import "@/styles/globals.css";

import { type Metadata } from "next";
import { Geist } from "next/font/google";

import { NavBar } from "@/components/navbar";
import { TRPCReactProvider } from "@/trpc/react";

export const metadata: Metadata = {
  title: "PsyCoach - Your AI Coach",
  description: "Connect your Strava account to see your activities and stats.",
  icons: [{ rel: "icon", url: "/favicon.ico" }],
};

const geist = Geist({
  subsets: ["latin"],
  variable: "--font-geist-sans",
});

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" className={`${geist.variable}`}>
      <body>
        <TRPCReactProvider>
          <NavBar />
          {children}
          <footer className="py-6 text-center text-sm text-gray-500">
            © {new Date().getFullYear()} PsyCoach. All rights reserved.
          </footer>
        </TRPCReactProvider>
      </body>
    </html>
  );
}
