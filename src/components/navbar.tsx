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
    <header className="border-b-4 border-black bg-white">
      <div className="container mx-auto flex items-center justify-between px-6 py-4">
        <Link
          href="/"
          className="rotate-[-1deg] transform text-2xl font-black text-black transition-transform hover:rotate-[1deg]"
        >
          🚴‍♂️ PsyCoach
        </Link>

        <nav className="flex items-center gap-4">
          <Link
            href="/"
            className="rounded-lg border-2 border-black bg-yellow-300 px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            Home
          </Link>
          <Link
            href="/dashboard"
            className="rounded-lg border-2 border-black bg-cyan-300 px-4 py-2 font-bold text-black shadow-[2px_2px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-[1px] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,1)]"
          >
            Dashboard
          </Link>

          {!isConnected && (
            <div className="pl-2">
              <StravaConnectButton />
            </div>
          )}
        </nav>
      </div>
    </header>
  );
}
