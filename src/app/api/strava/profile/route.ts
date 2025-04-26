import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Get access token from request
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("token");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    console.log("Fetching Strava profile with token");

    // Make the request to Strava API
    const response = await fetch("https://www.strava.com/api/v3/athlete", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch {
        errorText = "Could not retrieve error details";
      }

      console.error(
        "Error fetching Strava profile:",
        response.status,
        response.statusText,
        errorText,
      );

      return NextResponse.json(
        { error: `Strava API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    // Define a type for the athlete profile
    type StravaProfile = {
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

    const data = (await response.json()) as StravaProfile;
    console.log("Successfully fetched profile data");

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error in Strava profile fetch:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch profile data" },
      { status: 500 },
    );
  }
}
