import GlassCard from "../ui/GlassCard";
import {
  HeartPulse,
  Thermometer,
  Weight,
  Activity,
} from "lucide-react";

const healthStats = [
  {
    title: "Heart Rate",
    value: "78 BPM",
    status: "Normal",
    icon: HeartPulse,
    bg: "bg-red-100",
    text: "text-red-600",
  },
  {
    title: "Temperature",
    value: "98.4°F",
    status: "Stable",
    icon: Thermometer,
    bg: "bg-orange-100",
    text: "text-orange-600",
  },
  {
    title: "BMI",
    value: "19.8",
    status: "Healthy",
    icon: Weight,
    bg: "bg-blue-100",
    text: "text-blue-600",
  },
  {
    title: "Oxygen",
    value: "98%",
    status: "Excellent",
    icon: Activity,
    bg: "bg-emerald-100",
    text: "text-emerald-600",
  },
];

function HealthOverview() {
  return (
    <div>

      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Health Overview
      </h2>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        {healthStats.map((item) => {
          const Icon = item.icon;

          return (
            <GlassCard
              key={item.title}
              className="p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl ${item.bg}`}
              >
                <Icon
                  size={28}
                  className={item.text}
                />
              </div>

              <h3 className="mt-5 text-lg font-semibold text-slate-700">
                {item.title}
              </h3>

              <p className="mt-2 text-3xl font-bold text-slate-900">
                {item.value}
              </p>

              <span className="mt-4 inline-block rounded-full bg-emerald-100 px-3 py-1 text-sm font-medium text-emerald-700">
                {item.status}
              </span>
            </GlassCard>
          );
        })}

      </div>

    </div>
  );
}

export default HealthOverview;