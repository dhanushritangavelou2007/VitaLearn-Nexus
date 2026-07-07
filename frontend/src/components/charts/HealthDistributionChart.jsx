import GlassCard from "../ui/GlassCard";
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from "recharts";

const fallbackData = [
  { name: "Healthy", value: 596 },
  { name: "Review", value: 18 },
  { name: "Critical", value: 10 },
];

const COLORS = ["#22c55e", "#f59e0b", "#ef4444", "#3b82f6"];

function HealthDistributionChart({ data = fallbackData, title = "Health Distribution" }) {
  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">{title}</h2>
      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie data={data} dataKey="value" outerRadius={110} label>
              {data.map((entry, index) => (
                <Cell key={entry.name} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default HealthDistributionChart;
