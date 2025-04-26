"use client";

import {
  fetchAllStravaActivities,
  getStravaAthleteProfile,
  getStravaAthleteStats,
  refreshAccessToken,
  type StravaActivity,
  type StravaProfile,
  type StravaStats,
} from "@/utils/strava";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Dashboard } from "./Dashboard";

// Redefine types to match Dashboard component's expectations
type DashboardStravaProfile = {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  city: string;
  country: string;
  profile: string;
};

type DashboardStravaData = {
  stats?: StravaStats;
  activities?: StravaActivity[];
  profile?: DashboardStravaProfile;
};

type StravaTokenResponse = {
  access_token: string;
  refresh_token: string;
  athlete: {
    id: number;
  };
  expires_at: number;
};

export default function DashboardPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isLoading, setIsLoading] = useState(false);
  const [isFetchingData, setIsFetchingData] = useState(false);
  const [stravaConnected, setStravaConnected] = useState(false);
  const [athleteId, setAthleteId] = useState<number | undefined>(undefined);
  const [stravaData, setStravaData] = useState<DashboardStravaData | undefined>(
    undefined,
  );
  const [lastFetched, setLastFetched] = useState<Date | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);

  // Function to check and refresh token if needed
  const getValidAccessToken = async () => {
    if (typeof window === "undefined") return null;

    const accessToken = localStorage.getItem("strava_access_token");
    const refreshToken = localStorage.getItem("strava_refresh_token");
    const expiresAt = localStorage.getItem("strava_token_expires");

    if (!accessToken || !refreshToken || !expiresAt) {
      return null;
    }

    const now = Math.floor(Date.now() / 1000);
    const tokenExpires = parseInt(expiresAt);

    // If token is expired, refresh it
    if (tokenExpires < now) {
      try {
        const newTokens = await refreshAccessToken(refreshToken);

        // Update localStorage with new tokens
        localStorage.setItem("strava_access_token", newTokens.access_token);
        localStorage.setItem("strava_refresh_token", newTokens.refresh_token);
        localStorage.setItem(
          "strava_token_expires",
          newTokens.expires_at.toString(),
        );

        return newTokens.access_token;
      } catch (err) {
        console.error("Error refreshing token:", err);
        return null;
      }
    }

    return accessToken;
  };

  // Convert Strava API profile to dashboard profile format
  const convertProfile = (
    apiProfile: StravaProfile,
  ): DashboardStravaProfile => {
    return {
      id: apiProfile.id,
      username: apiProfile.username ?? "",
      firstname: apiProfile.firstname,
      lastname: apiProfile.lastname,
      city: apiProfile.city ?? "",
      country: apiProfile.country ?? "",
      profile: apiProfile.profile ?? "",
    };
  };

  // Function to fetch Strava data
  const fetchStravaData = async () => {
    setIsFetchingData(true);

    try {
      const accessToken = await getValidAccessToken();
      const storedAthleteId = localStorage.getItem("strava_athlete_id");

      if (!accessToken || !storedAthleteId) {
        throw new Error("Missing access token or athlete ID");
      }

      const athleteIdNum = parseInt(storedAthleteId);

      // Fetch athlete profile, stats, and activities in parallel
      const [apiProfile, stats, activities] = await Promise.all([
        getStravaAthleteProfile(accessToken),
        getStravaAthleteStats(accessToken, athleteIdNum),
        fetchAllStravaActivities(accessToken, 3), // Limit to 3 pages to avoid rate limits
      ]);

      // Convert API profile to dashboard format
      const profile = convertProfile(apiProfile);

      setStravaData({
        profile,
        stats,
        activities,
      });

      setLastFetched(new Date());

      // Save data to localStorage for future use
      localStorage.setItem("strava_data_profile", JSON.stringify(profile));
      localStorage.setItem("strava_data_stats", JSON.stringify(stats));
      localStorage.setItem("strava_data_lastFetched", new Date().toISOString());

      // Don't store all activities in localStorage as it might be too large
      // Just store the 20 most recent ones
      localStorage.setItem(
        "strava_data_recent_activities",
        JSON.stringify(activities.slice(0, 20)),
      );
    } catch (err) {
      console.error("Error fetching Strava data:", err);
      setError("Failed to fetch Strava data. Please try again later.");
    } finally {
      setIsFetchingData(false);
    }
  };

  // Try to load cached data from localStorage
  const loadCachedData = () => {
    if (typeof window === "undefined") return;

    try {
      const profileStr = localStorage.getItem("strava_data_profile");
      const statsStr = localStorage.getItem("strava_data_stats");
      const lastFetchedStr = localStorage.getItem("strava_data_lastFetched");
      const activitiesStr = localStorage.getItem(
        "strava_data_recent_activities",
      );

      if (profileStr && statsStr) {
        const profile = JSON.parse(profileStr) as DashboardStravaProfile;
        const stats = JSON.parse(statsStr) as StravaStats;
        const activities = activitiesStr
          ? (JSON.parse(activitiesStr) as StravaActivity[])
          : undefined;

        setStravaData({
          profile,
          stats,
          activities,
        });

        if (lastFetchedStr) {
          setLastFetched(new Date(lastFetchedStr));
        }
      }
    } catch (err) {
      console.error("Error loading cached data:", err);
    }
  };

  useEffect(() => {
    // Make sure we're in the browser environment before accessing localStorage
    if (typeof window === "undefined") return;

    // Check if user is already connected
    const storedConnected = localStorage.getItem("strava_connected") === "true";
    const storedAthleteId = localStorage.getItem("strava_athlete_id");

    setStravaConnected(storedConnected);
    if (storedAthleteId) {
      setAthleteId(parseInt(storedAthleteId));
    }

    // Load any cached data first
    loadCachedData();

    // Process OAuth callback if code is present
    const code = searchParams.get("code");
    const scope = searchParams.get("scope");

    if (code && scope) {
      setIsLoading(true);

      // Exchange code for tokens
      fetch(`/api/strava-auth?code=${code}`)
        .then((response) => {
          if (!response.ok) {
            throw new Error("Failed to exchange code for token");
          }
          return response.json() as Promise<StravaTokenResponse>;
        })
        .then((data) => {
          // Save to localStorage
          localStorage.setItem("strava_access_token", data.access_token);
          localStorage.setItem("strava_refresh_token", data.refresh_token);
          localStorage.setItem("strava_athlete_id", data.athlete.id.toString());
          localStorage.setItem(
            "strava_token_expires",
            data.expires_at.toString(),
          );
          localStorage.setItem("strava_connected", "true");

          setStravaConnected(true);
          setAthleteId(data.athlete.id);

          // Remove query params from URL
          router.replace("/dashboard");

          // Fetch initial Strava data
          return fetchStravaData();
        })
        .catch((err) => {
          console.error("Error processing Strava auth:", err);
          setError("Failed to connect to Strava. Please try again.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    } else if (storedConnected) {
      // Check if we need to fetch fresh data
      const shouldFetchFreshData = () => {
        // If no existing state data, check localStorage
        const cachedDataExists =
          localStorage.getItem("strava_data_profile") !== null &&
          localStorage.getItem("strava_data_stats") !== null;

        if (!cachedDataExists) return true;

        // Check if the last fetched time is available
        const lastFetchedStr = localStorage.getItem("strava_data_lastFetched");
        if (!lastFetchedStr) return true;

        // Check if the data is older than 24 hours
        const lastFetchTime = new Date(lastFetchedStr).getTime();
        const currentTime = new Date().getTime();
        const dataAge = currentTime - lastFetchTime;
        const maxAge = 24 * 3600 * 1000; // 24 hours in milliseconds

        return dataAge > maxAge;
      };

      // Only fetch if we need fresh data
      if (shouldFetchFreshData()) {
        void fetchStravaData();
      }
    }
  }, [searchParams, router]);

  if (isLoading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Processing Your Request</h1>
        <div className="rounded-lg bg-blue-50 p-6 text-center">
          <p className="text-blue-700">Connecting to Strava...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold">Error</h1>
        <div className="rounded-lg bg-red-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-red-800">
            Connection Error
          </h2>
          <p className="text-red-700">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {stravaConnected ? (
        <Dashboard
          stravaData={stravaData}
          athleteId={athleteId}
          stravaFetchedAt={lastFetched}
          onRefresh={() => void fetchStravaData()}
          isRefreshing={isFetchingData}
        />
      ) : (
        <div className="rounded-lg border border-amber-200 bg-amber-50 p-6">
          <h2 className="mb-2 text-xl font-semibold text-amber-800">
            Not Connected
          </h2>
          <p className="mb-2 text-amber-700">
            You haven&apos;t connected your Strava account yet.
          </p>
          <p className="text-amber-700">
            Go to the home page and click the &quot;Connect with Strava&quot;
            button to get started.
          </p>
        </div>
      )}
    </div>
  );
}
