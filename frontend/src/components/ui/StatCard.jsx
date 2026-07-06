import GlassCard from "./GlassCard";

function StatCard({
  title,
  value,
  description,
  icon: Icon,
  accent = "from-blue-600 to-cyan-500",
}) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-start justify-between gap-4">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h3 className="mt-3 text-3xl font-semibold text-slate-900">{value}</h3>
          <p className="mt-2 text-sm text-slate-500">{description}</p>
        </div>

        <div className={`rounded-2xl bg-linear-to-br ${accent} p-3 text-white shadow-lg`}>
          {Icon && <Icon size={22} />}
        </div>
      </div>
    </GlassCard>
  );
}

export default StatCard;
