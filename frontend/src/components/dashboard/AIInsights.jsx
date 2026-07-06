import GlassCard from "../ui/GlassCard";
import { BrainCircuit, Sparkles } from "lucide-react";

function AIInsights() {
  return (
    <GlassCard className="p-6">

      <div className="flex items-center gap-3">

        <div className="rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 p-3 text-white">

          <BrainCircuit size={28} />

        </div>

        <div>

          <h2 className="text-2xl font-bold">
            AI Insights
          </h2>

          <p className="text-slate-500">
            Daily health intelligence
          </p>

        </div>

      </div>

      <div className="mt-6 rounded-2xl bg-slate-50 p-6">

        <div className="mb-3 flex items-center gap-2 text-violet-600">

          <Sparkles size={18} />

          <span className="font-semibold">

            Today's Insight

          </span>

        </div>

        <p className="leading-8 text-slate-700">
          Attendance and health indicators remain stable across all monitored
          classes. A small number of students require follow-up for scheduled
          vaccinations. Consider organizing a wellness review next week to keep
          preventive care on track.
        </p>

      </div>

    </GlassCard>
  );
}

export default AIInsights;