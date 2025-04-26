import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Get access token and athlete ID from request
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("token");
    const athleteId = searchParams.get("athlete_id");

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    if (!athleteId) {
      return NextResponse.json(
        { error: "Athlete ID is required" },
        { status: 400 },
      );
    }

    console.log(`Fetching Strava stats for athlete ${athleteId}`);

    // Make the request to Strava API
    const response = await fetch(
      `https://www.strava.com/api/v3/athletes/${athleteId}/stats`,
      {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      },
    );

    if (!response.ok) {
      let errorText: string;
      try {
        errorText = await response.text();
      } catch {
        errorText = "Could not retrieve error details";
      }

      console.error(
        "Error fetching Strava stats:",
        response.status,
        response.statusText,
        errorText,
      );

      return NextResponse.json(
        { error: `Strava API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    // Define a type for the stats response
    type StravaStats = {
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

    const data = (await response.json()) as StravaStats;
    console.log("Successfully fetched stats data");

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error in Strava stats fetch:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch stats data" },
      { status: 500 },
    );
  }
}
