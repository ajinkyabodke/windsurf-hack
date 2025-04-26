import { env } from "@/env";
import { NextRequest, NextResponse } from "next/server";
export const runtime = "edge";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const hasCode = searchParams.has("code");

    if (!hasCode) {
      return new Response(`Missing code parameter`, { status: 400 });
    }

    const code = searchParams.get("code");

    if (!code) {
      return NextResponse.json({ error: "Failed to get code" });
    }

    console.log("Exchanging code for token:", code);

    // Authorization code can only be used once, so we need to ensure we're using it correctly
    try {
      // Exchange code for access token using a proper POST request with headers
      const tokenResponse = await fetch("https://www.strava.com/oauth/token", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          client_id: env.NEXT_PUBLIC_STRAVA_CLIENT_ID,
          client_secret: env.STRAVA_CLIENT_SECRET,
          code: code,
          grant_type: "authorization_code",
        }),
      });

      if (!tokenResponse.ok) {
        let errorDetails: string;
        try {
          errorDetails = await tokenResponse.text();
        } catch {
          errorDetails = "Could not retrieve error details";
        }

        console.error(
          "Error exchanging code for access token:",
          tokenResponse.status,
          tokenResponse.statusText,
          errorDetails,
        );
        return NextResponse.json(
          { error: `Token exchange failed: ${tokenResponse.statusText}` },
          { status: tokenResponse.status },
        );
      }

      const tokenData = (await tokenResponse.json()) as {
        access_token: string;
        refresh_token: string;
        athlete: {
          id: number;
        };
        expires_at: number;
      };

      console.log("Successfully exchanged code for token");
      return NextResponse.json(tokenData);
    } catch (tokenError) {
      const errorMessage =
        tokenError instanceof Error
          ? tokenError.message
          : "Unknown error during token exchange";

      console.error("Error in token exchange:", errorMessage);
      return NextResponse.json(
        { error: "Error exchanging token" },
        { status: 500 },
      );
    }
  } catch (error) {
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error in Strava auth";

    console.error("Error in Strava auth:", errorMessage);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 },
    );
  }
}
