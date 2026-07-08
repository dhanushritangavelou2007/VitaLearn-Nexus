import GlassCard from "../ui/GlassCard";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const COLORS = [
  "#22c55e",
  "#f59e0b",
  "#ef4444",
];

function HealthDistributionChart({
  data = [],
  title = "Health Distribution",
}) {
  const chartData = data.filter(
    (item) => Number(item.value) > 0
  );

  return (
    <GlassCard className="p-6">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        {title}
      </h2>

      <div className="h-80">

        {chartData.length === 0 ? (
          <div className="flex h-full items-center justify-center text-slate-500">
            No health distribution available.
          </div>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>

              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                outerRadius={100}
                label={({ name, percent }) =>
                  `${name} ${(percent * 100).toFixed(0)}%`
                }
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={COLORS[index % COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip />

              <Legend />

            </PieChart>
          </ResponsiveContainer>
        )}

      </div>
    </GlassCard>
  );
}

export default HealthDistributionChart;