"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { StravaConnectButton } from "./strava-connect-button";

export function NavBar() {
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    // Make sure we're in the browser before accessing localStorage
    if (typeof window !== "undefined") {
      // Check if already connected to Strava
      const connected = localStorage.getItem("strava_connected") === "true";
      setIsConnected(connected);
    }
  }, []);

  return (
    <header className="border-b border-gray-200 bg-white">
      <div className="container mx-auto flex items-center justify-between px-4 py-4">
        <Link href="/" className="text-xl font-bold text-gray-800">
          WindSurf
        </Link>

        <nav className="flex items-center gap-6">
          <Link
            href="/"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="text-gray-600 transition-colors hover:text-gray-900"
          >
            Dashboard
          </Link>

          {!isConnected && <StravaConnectButton />}
        </nav>
      </div>
    </header>
  );
}
