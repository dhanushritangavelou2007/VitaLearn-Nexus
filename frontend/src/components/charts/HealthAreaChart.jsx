import GlassCard from "../ui/GlassCard";
import { ResponsiveContainer, AreaChart, Area, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const fallbackData = [
  { day: "Mon", value: 72 },
  { day: "Tue", value: 74 },
  { day: "Wed", value: 76 },
  { day: "Thu", value: 75 },
  { day: "Fri", value: 78 },
  { day: "Sat", value: 80 },
];

function HealthAreaChart({ data = fallbackData, title = "Health Trend" }) {
  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Area type="monotone" dataKey="value" stroke="#0f766e" fill="#14b8a6" fillOpacity={0.24} />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default HealthAreaChart;

