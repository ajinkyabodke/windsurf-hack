import { StravaConnectButton } from "@/components/strava-connect-button";

export default function Home() {
  return (
    <main className="flex flex-col items-center justify-center bg-gradient-to-b from-zinc-50 to-zinc-100 pt-8 pb-20">
      <div className="flex w-full max-w-3xl flex-col items-center gap-8 text-center">
        <h1 className="text-4xl font-bold tracking-tight text-zinc-900 sm:text-6xl">
          Psycoach: Your AI Voice Training Partner
        </h1>

        <p className="max-w-prose text-xl text-zinc-600">
          Get personalized training plans that adapt to your Strava activities
          and daily voice check-ins. Like having a coach who really listens and
          understands your journey.
        </p>

        <div className="mt-4">
          <StravaConnectButton />
        </div>

        <div className="mt-4 grid w-full grid-cols-1 gap-8 md:grid-cols-2">
          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">
              AI-Powered Training Plans
            </h2>
            <p className="text-zinc-600">
              Smart training plans that evolve with your Strava data and adjust
              based on your daily voice check-ins about energy, mood, and
              recovery.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">
              Voice-First Experience
            </h2>
            <p className="text-zinc-600">
              Simply tell Psycoach how you&apos;re feeling, and watch your
              training plan adapt in real-time to optimize your performance.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Strava Integration</h2>
            <p className="text-zinc-600">
              Seamlessly syncs with your Strava activities to build a complete
              picture of your training and progress.
            </p>
          </div>

          <div className="rounded-xl bg-white p-6 shadow-md">
            <h2 className="mb-2 text-xl font-semibold">Holistic Coaching</h2>
            <p className="text-zinc-600">
              Balance your training load with real-life factors like stress,
              sleep, and energy levels through natural conversations.
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}
