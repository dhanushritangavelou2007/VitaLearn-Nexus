import GlassCard from "../ui/GlassCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = {
  Healthy: "#10b981", // emerald-500
  Moderate: "#3b82f6", // blue-500
  High: "#f59e0b", // amber-500
  Critical: "#ef4444", // red-500
  "Active Treatment": "#ef4444",
  Observation: "#3b82f6",
  Recovered: "#10b981",
  Completed: "#10b981",
  Pending: "#f59e0b",
};
const FALLBACK_COLORS = ["#10b981", "#3b82f6", "#f59e0b", "#ef4444", "#8b5cf6", "#ec4899", "#f43f5e"];

function HealthDistributionChart({
  data = [],
  title = "Health Distribution",
}) {
  const total = data.reduce((sum, item) => sum + (Number(item.value) || 0), 0);
  const chartData = total === 0 
    ? [{ name: "No Data", value: 1, color: "#cbd5e1" }] 
    : data.map(item => ({ ...item, value: Number(item.value) || 0 }));

  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="h-80">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, value }) =>
                total === 0 ? "No Data" : `${name}: ${value}`
              }
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={entry.name}
                  fill={entry.color || COLORS[entry.name] || FALLBACK_COLORS[index % FALLBACK_COLORS.length]}
                />
              ))}
            </Pie>
            {total > 0 && <Tooltip />}
            {total > 0 && <Legend />}
          </PieChart>
        </ResponsiveContainer>
      </div>
    </GlassCard>
  );
}

export default HealthDistributionChart;