import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    // Get access token and page from request
    const { searchParams } = new URL(req.url);
    const accessToken = searchParams.get("token");
    const page = searchParams.get("page") ?? "1";
    const perPage = searchParams.get("per_page") ?? "30";

    if (!accessToken) {
      return NextResponse.json(
        { error: "Access token is required" },
        { status: 400 },
      );
    }

    console.log(`Fetching Strava activities page ${page}`);

    // Make the request to Strava API
    const response = await fetch(
      `https://www.strava.com/api/v3/athlete/activities?page=${page}&per_page=${perPage}`,
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
        "Error fetching Strava activities:",
        response.status,
        response.statusText,
        errorText,
      );

      return NextResponse.json(
        { error: `Strava API error: ${response.statusText}` },
        { status: response.status },
      );
    }

    // Define a type for the activities
    type StravaActivity = {
      id: string;
      name: string;
      // Add other fields as needed
      [key: string]: unknown;
    };

    const data = (await response.json()) as StravaActivity[];
    console.log(`Successfully fetched activities data (${data.length} items)`);

    return NextResponse.json(data);
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";

    console.error("Error in Strava activities fetch:", errorMessage);
    return NextResponse.json(
      { error: "Failed to fetch activities data" },
      { status: 500 },
    );
  }
}
