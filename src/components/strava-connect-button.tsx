"use client";

import { Button } from "@/components/ui/button";
import { env } from "@/env";
import { useEffect, useState } from "react";

export function StravaConnectButton() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Make sure we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      // Check if already connected
      const connected = localStorage.getItem("strava_connected") === "true";
      setIsConnected(connected);
    }
  }, []);

  const handleConnect = () => {
    const redirectUri = `${env.NEXT_PUBLIC_APP_URL}/dashboard`;
    const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${env.NEXT_PUBLIC_STRAVA_CLIENT_ID}&redirect_uri=${redirectUri}&response_type=code&scope=read,activity:read`;

    window.location.href = stravaAuthUrl;
  };

  if (isConnected) {
    return (
      <Button
        onClick={() => (window.location.href = "/dashboard")}
        className="flex items-center rounded bg-green-600 px-4 py-2 font-bold text-white hover:bg-green-700"
      >
        <img
          src="/strava-logo.svg"
          alt="Strava logo"
          width={24}
          height={24}
          className="mr-2"
        />
        View Dashboard
      </Button>
    );
  }

  return (
    <Button
      onClick={handleConnect}
      className="flex items-center rounded bg-[#FC4C02] px-4 py-2 font-bold text-white hover:bg-[#FC4C02]/90"
    >
      <img
        src="/strava-logo.svg"
        alt="Strava logo"
        width={24}
        height={24}
        className="mr-2"
      />
      Connect with Strava
    </Button>
  );
}
