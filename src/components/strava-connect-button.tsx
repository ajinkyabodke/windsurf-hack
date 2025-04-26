"use client";

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
      <button
        onClick={() => (window.location.href = "/dashboard")}
        className="flex items-center gap-2 rounded-lg bg-[#FC4C02] px-6 py-3 font-black text-white transition-all hover:bg-[#E34402]"
      >
        <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
          <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
        </svg>
        View Dashboard
      </button>
    );
  }

  return (
    <button
      onClick={handleConnect}
      className="flex items-center gap-2 rounded-lg bg-[#FC4C02] px-6 py-3 font-black text-white transition-all hover:bg-[#E34402]"
    >
      <svg viewBox="0 0 24 24" className="h-6 w-6 fill-current">
        <path d="M15.387 17.944l-2.089-4.116h-3.065L15.387 24l5.15-10.172h-3.066m-7.008-5.599l2.836 5.598h4.172L10.463 0l-7 13.828h4.169" />
      </svg>
      Connect with Strava
    </button>
  );
}
