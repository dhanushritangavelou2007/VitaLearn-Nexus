import GlassCard from "../ui/GlassCard";
import { ResponsiveContainer, BarChart, Bar, CartesianGrid, Tooltip, XAxis, YAxis } from "recharts";

const fallbackData = [
  { name: "Healthy", value: 14 },
  { name: "Observation", value: 4 },
  { name: "Review", value: 3 },
  { name: "Critical", value: 2 },
];

function RiskBarChart({ data = fallbackData, title = "Risk Analysis" }) {
  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="value" fill="#2563eb" radius={[12, 12, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default RiskBarChart;

