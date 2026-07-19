import { ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";

function DashboardCard({
  title,
  value,
  color,
  icon: Icon,
  bg = "bg-blue-600",
  subtitle = "Updated just now",
  link = null,
}) {
  return (
    <div className="group flex h-full flex-col justify-between rounded-3xl border border-white/60 bg-white/80 backdrop-blur-xl p-6 shadow-lg transition-all duration-300 hover:-translate-y-1 hover:shadow-2xl">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{title}</p>
          <h2 className={`mt-3 text-4xl font-bold ${color}`}>{value}</h2>
          <p className="mt-3 text-sm text-slate-400">{subtitle}</p>
        </div>

        <div className={`rounded-2xl bg-linear-to-br ${bg} p-4 text-white shadow-lg`}>
          {Icon && <Icon size={26} />}
        </div>
      </div>
      
      {link ? (
        <Link to={link} className="mt-auto flex items-center gap-2 text-sm font-medium text-blue-600 hover:text-blue-700">
          View Details
          <ArrowUpRight
            size={18}
            className="transition group-hover:translate-x-1 group-hover:-translate-y-1"
          />
        </Link>
      ) : (
        <div className="mt-6 flex items-center gap-2 text-sm font-medium text-slate-400">
          {/* Optional: Render non-clickable placeholder or nothing */}
        </div>
      )}
    </div>
  );
}

export default DashboardCard;
