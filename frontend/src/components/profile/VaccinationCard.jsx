import GlassCard from "../ui/GlassCard";
import { Syringe, CheckCircle2, Clock } from "lucide-react";

// Normalize vaccination entry — supports both legacy string format and new object format
function normalizeVaccination(v) {
  if (!v) return null;
  if (typeof v === "string") return { name: v, date: null, status: "completed" };
  return { name: v.name || "Unknown", date: v.date || null, status: v.status || "completed" };
}

function VaccinationCard({ student }) {
  const vaccinations = (student.vaccinations || []).map(normalizeVaccination).filter(Boolean);
  const completed = vaccinations.filter((v) => v.status === "completed");
  const pending = vaccinations.filter((v) => v.status === "pending");

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Syringe size={18} className="text-emerald-500" />
          <h3 className="font-bold text-slate-800">Vaccinations</h3>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
          {completed.length}/{vaccinations.length}
        </span>
      </div>
      <ul className="space-y-3 text-sm">
        {completed.map((v) => (
          <li key={v.name} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-1">
            <div className="flex items-center gap-2">
              <CheckCircle2 size={13} className="text-emerald-500 shrink-0" />
              <span className="text-slate-700 font-medium">{v.name}</span>
            </div>
            <div className="text-right">
              <span className="text-emerald-600 text-xs font-semibold block">Completed</span>
              {v.date && <span className="text-slate-400 text-[11px]">{v.date}</span>}
            </div>
          </li>
        ))}
        {pending.map((v) => (
          <li key={v.name} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-1">
            <div className="flex items-center gap-2">
              <Clock size={13} className="text-amber-500 shrink-0" />
              <span className="text-slate-600 font-medium">{v.name}</span>
            </div>
            <div className="text-right">
              <span className="text-amber-600 text-xs font-semibold bg-amber-50 px-2 py-0.5 rounded-sm block">Pending</span>
              {v.date && <span className="text-slate-400 text-[11px]">Due: {v.date}</span>}
            </div>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default VaccinationCard;
