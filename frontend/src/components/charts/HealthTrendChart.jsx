import GlassCard from "../ui/GlassCard";
import { ResponsiveContainer, LineChart, Line, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const fallbackData = [
  { day: "Mon", healthy: 590 },
  { day: "Tue", healthy: 596 },
  { day: "Wed", healthy: 601 },
  { day: "Thu", healthy: 598 },
  { day: "Fri", healthy: 604 },
  { day: "Sat", healthy: 610 },
];

function HealthTrendChart({ data = fallbackData, title = "Weekly Health Trend" }) {
  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="day" />
            <YAxis />
            <Tooltip />
            <Line type="monotone" dataKey="healthy" stroke="#2563eb" strokeWidth={4} />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default HealthTrendChart;
