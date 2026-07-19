import {
  HeartPulse,
  Sparkles,
  TrendingUp,
  CalendarDays,
} from "lucide-react";

function HeroSection() {
  return (
    <section className="mb-8 overflow-hidden rounded-4xl bg-linear-to-r from-blue-600 via-blue-500 to-teal-500 p-8 text-white shadow-2xl">

      <div className="flex items-center justify-between">

        {/* Left */}

        <div className="max-w-2xl">

          <p className="mb-3 text-sm font-semibold uppercase tracking-widest text-blue-100">
            Teacher Health Command Center
          </p>

          <h1 className="text-5xl font-bold leading-tight">
            Good Morning,
            <br />
            Ms. Priya 👋
          </h1>

          <p className="mt-5 max-w-xl text-lg text-blue-100">
            Welcome to VitaLearn Nexus. Monitor student wellness,
            identify health trends early, and collaborate with
            parents and doctors through AI-assisted insights.
          </p>

          <div className="mt-8 flex flex-wrap gap-4">

            <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur-md">
              <p className="text-sm text-blue-100">
                School Health Score
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                94%
              </h2>
            </div>

            <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur-md">
              <p className="text-sm text-blue-100">
                Students
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                624
              </h2>
            </div>

            <div className="rounded-2xl bg-white/20 px-5 py-3 backdrop-blur-md">
              <p className="text-sm text-blue-100">
                Reports Today
              </p>

              <h2 className="mt-1 text-3xl font-bold">
                24
              </h2>
            </div>

          </div>

        </div>

        {/* Right */}

        <div className="hidden lg:flex flex-col gap-5 w-90">

          <div className="rounded-3xl bg-white/15 p-6 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <Sparkles className="text-yellow-300" />

              <h3 className="text-xl font-bold">
                AI Insight
              </h3>

            </div>

            <p className="mt-4 text-blue-100">
              Recurring headache reports have increased this week.
              Review affected students for further assessment.
            </p>

          </div>

          <div className="grid grid-cols-2 gap-4">

            <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">

              <HeartPulse size={32} />

              <h3 className="mt-3 text-2xl font-bold">
                Healthy
              </h3>

              <p className="text-blue-100">
                596 Students
              </p>

            </div>

            <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">

              <TrendingUp size={32} />

              <h3 className="mt-3 text-2xl font-bold">
                Trending
              </h3>

              <p className="text-blue-100">
                +12% Reports
              </p>

            </div>

          </div>

          <div className="rounded-3xl bg-white/15 p-5 backdrop-blur-xl">

            <div className="flex items-center gap-3">

              <CalendarDays />

              <span className="font-semibold">
                Upcoming Health Campaign
              </span>

            </div>

            <p className="mt-3 text-blue-100">
              Eye Check-up Camp
              <br />
              15 July • School Auditorium
            </p>

          </div>

        </div>

      </div>

    </section>
  );
}

export default HeroSection;