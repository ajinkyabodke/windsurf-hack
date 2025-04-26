import { env } from "@/env";

export type StravaActivity = {
  id: number;
  name: string;
  distance: number;
  moving_time: number;
  elapsed_time: number;
  total_elevation_gain: number;
  type: string;
  start_date: string;
  [key: string]: unknown;
};

export type StravaProfile = {
  id: number;
  username: string | null;
  firstname: string;
  lastname: string;
  bio: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  sex: string | null;
  profile: string | null;
  profile_medium: string | null;
  [key: string]: unknown;
};

export type StravaStats = {
  recent_ride_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  recent_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_ride_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  all_run_totals: {
    count: number;
    distance: number;
    moving_time: number;
    elapsed_time: number;
    elevation_gain: number;
  };
  [key: string]: unknown;
};

export async function getStravaDataFromAuth(code: string) {
  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&client_secret=${env.STRAVA_CLIENT_SECRET}&code=${code}&grant_type=authorization_code`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to exchange auth code for tokens");
  }

  const data = (await response.json()) as {
    access_token: string;
    refresh_token: string;
    athlete: {
      id: number;
    };
    expires_at: number;
  };

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    athleteId: data.athlete.id,
    strava_access_token_expires_at: data.expires_at,
  };
}

// This is a simplified version that uses our proxy API routes
export async function fetchStravaData<T>(
  token: string,
  url: string,
): Promise<T> {
  const response = await fetch(url, {
    headers: {
      // No need for authorization header, token is passed in URL
    },
  });

  if (!response.ok) {
    throw new Error(`Strava API error: ${response.statusText}`);
  }

  return (await response.json()) as T;
}

export async function refreshAccessToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_at: number;
}> {
  const response = await fetch(
    `https://www.strava.com/oauth/token?client_id=${env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&client_secret=${env.STRAVA_CLIENT_SECRET}&refresh_token=${refreshToken}&grant_type=refresh_token`,
    {
      method: "POST",
    },
  );

  if (!response.ok) {
    throw new Error("Failed to refresh access token");
  }

  return (await response.json()) as {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  };
}

export async function getStravaAthleteProfile(
  accessToken: string,
): Promise<StravaProfile> {
  return fetchStravaData<StravaProfile>(
    accessToken,
    `/api/strava/profile?token=${accessToken}`,
  );
}

export async function getStravaAthleteStats(
  accessToken: string,
  athleteId: number,
): Promise<StravaStats> {
  return fetchStravaData<StravaStats>(
    accessToken,
    `/api/strava/stats?token=${accessToken}&athlete_id=${athleteId}`,
  );
}

export async function getStravaActivities(
  accessToken: string,
  page = 1,
  perPage = 200,
): Promise<StravaActivity[]> {
  return fetchStravaData<StravaActivity[]>(
    accessToken,
    `/api/strava/activities?token=${accessToken}&page=${page}&per_page=${perPage}`,
  );
}

export async function fetchAllStravaActivities(
  accessToken: string,
  maxPages = 5,
): Promise<StravaActivity[]> {
  const allActivities: StravaActivity[] = [];
  const minActivitiesPerPage = 200;

  for (let page = 1; page <= maxPages; page++) {
    try {
      const activities: StravaActivity[] = await getStravaActivities(
        accessToken,
        page,
      );

      // Use forEach to safely add items
      activities.forEach((activity) => {
        allActivities.push(activity);
      });

      // If we get fewer than the minimum activities, we've reached the end
      if (activities.length < minActivitiesPerPage) {
        break;
      }
    } catch (error) {
      console.error(`Error fetching activities for page ${page}:`, error);
      break;
    }
  }

  return allActivities;
}
