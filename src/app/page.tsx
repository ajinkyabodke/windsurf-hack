import { StravaConnectButton } from "@/components/strava-connect-button";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 p-4">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Your Strava Stats, Simplified
        </h1>

        <p className="max-w-prose text-xl text-zinc-600">
          Connect with Strava to see your activities, stats, and more in a
          clean, simple dashboard.
        </p>

        <div className="mt-4">
          <StravaConnectButton />
        </div>

        <div className="mt-16 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Track Your Progress</h2>
            <p className="text-zinc-600">
              See your activities and track your progress over time with
              detailed stats.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Analyze Your Data</h2>
            <p className="text-zinc-600">
              Get insights into your performance and see how you&apos;re
              improving.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
