import { StravaConnectButton } from "@/components/strava-connect-button";

export default function Home() {
  return (
    <main className="min-h-screen bg-white">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-emerald-200 py-24">
        <div className="absolute inset-0 z-0">
          <div className="absolute top-0 -left-4 h-72 w-72 rotate-12 transform rounded-3xl bg-yellow-300 opacity-50"></div>
          <div className="absolute top-20 right-0 h-96 w-96 -rotate-12 transform rounded-3xl bg-cyan-300 opacity-50"></div>
        </div>

        <div className="relative z-10 container mx-auto px-4">
          <div className="mx-auto max-w-4xl text-center">
            <h1 className="mb-8 rotate-[-1deg] transform text-6xl font-black tracking-tight text-black sm:text-7xl">
              Your AI Voice Training Partner 🎙️ 🚴‍♂️
            </h1>
            <p className="mx-auto mb-12 max-w-2xl rotate-1 transform text-xl font-bold text-black">
              Get personalized training plans that adapt to your Strava
              activities and daily voice check-ins. Like having a coach who
              really listens.
            </p>
            <div className="flex justify-center gap-6">
              <div className="rounded-xl border-4 border-black bg-[#FC4C02] p-1 shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]">
                <StravaConnectButton />
              </div>
              <a
                href="#features"
                className="rounded-xl border-4 border-black bg-white px-8 py-4 text-xl font-black text-black shadow-[6px_6px_0px_0px_rgba(0,0,0,1)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(0,0,0,1)]"
              >
                Learn More ↓
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* Features Section */}
      <div id="features" className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="mb-16 text-center text-4xl font-black">
            Why Choose PsyCoach?
          </h2>
          <div className="grid gap-8 md:grid-cols-2">
            <div className="rounded-xl border-4 border-black bg-yellow-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-4 text-2xl font-black">
                🎯 AI-Powered Training Plans
              </h3>
              <p className="text-lg font-bold">
                Smart training plans that evolve with your Strava data and
                adjust based on your daily voice check-ins about energy, mood,
                and recovery.
              </p>
            </div>

            <div className="rounded-xl border-4 border-black bg-cyan-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-4 text-2xl font-black">
                🎤 Voice-First Experience
              </h3>
              <p className="text-lg font-bold">
                Simply tell PsyCoach how you&apos;re feeling, and watch your
                training plan adapt in real-time to optimize your performance.
              </p>
            </div>

            <div className="rounded-xl border-4 border-black bg-emerald-200 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-4 text-2xl font-black">
                🔄 Strava Integration
              </h3>
              <p className="text-lg font-bold">
                Seamlessly syncs with your Strava activities to build a complete
                picture of your training and progress over time.
              </p>
            </div>

            <div className="rounded-xl border-4 border-black bg-blue-300 p-8 shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]">
              <h3 className="mb-4 text-2xl font-black">🧠 Holistic Coaching</h3>
              <p className="text-lg font-bold">
                Balance your training load with real-life factors like stress,
                sleep, and energy levels through natural conversations.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      <div className="bg-black py-24">
        <div className="container mx-auto px-4 text-center">
          <h2 className="mb-8 text-4xl font-black text-white">
            Ready to Transform Your Training?
          </h2>
          <p className="mx-auto mb-12 max-w-2xl text-xl text-gray-300">
            Join PsyCoach today and experience the future of personalized
            training. Connect with Strava to get started.
          </p>
          <div className="inline-block rounded-xl border-4 border-white bg-[#FC4C02] p-1 shadow-[6px_6px_0px_0px_rgba(255,255,255,0.5)] transition-all hover:translate-y-1 hover:shadow-[4px_4px_0px_0px_rgba(255,255,255,0.5)]">
            <StravaConnectButton />
          </div>
        </div>
      </div>
    </main>
  );
}
