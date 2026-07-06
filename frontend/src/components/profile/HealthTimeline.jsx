import GlassCard from "../ui/GlassCard";
import {
  HeartPulse,
  Eye,
  Syringe,
  ShieldCheck,
} from "lucide-react";

const timeline = [
  {
    date: "Jan 2026",
    title: "Routine Health Checkup",
    description: "All vital signs were within the healthy range.",
    icon: HeartPulse,
    color: "bg-blue-500",
  },
  {
    date: "Mar 2026",
    title: "Vision Screening",
    description: "Minor vision issue detected. Eye examination recommended.",
    icon: Eye,
    color: "bg-amber-500",
  },
  {
    date: "Apr 2026",
    title: "Vaccination",
    description: "MMR Booster administered successfully.",
    icon: Syringe,
    color: "bg-emerald-500",
  },
  {
    date: "Jul 2026",
    title: "Annual Health Assessment",
    description: "Student classified as Healthy. No follow-up required.",
    icon: ShieldCheck,
    color: "bg-teal-500",
  },
];

function HealthTimeline() {
  return (
    <GlassCard className="p-8">

      <h2 className="mb-8 text-2xl font-bold text-slate-900">
        Health Timeline
      </h2>

      <div className="relative border-l-2 border-slate-200 pl-8">

        {timeline.map((item) => {
          const Icon = item.icon;

          return (
            <div
              key={item.title}
              className="relative mb-10 last:mb-0"
            >
              <div
                className={`absolute -left-[44px] flex h-10 w-10 items-center justify-center rounded-full ${item.color} text-white shadow-lg`}
              >
                <Icon size={20} />
              </div>

              <p className="text-sm font-semibold text-blue-600">
                {item.date}
              </p>

              <h3 className="mt-1 text-lg font-bold text-slate-900">
                {item.title}
              </h3>

              <p className="mt-2 text-slate-600 leading-7">
                {item.description}
              </p>
            </div>
          );
        })}

      </div>

    </GlassCard>
  );
}

export default HealthTimeline;