import GlassCard from "../ui/GlassCard";
import { Syringe } from "lucide-react";

function VaccinationCard({ student }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Syringe size={18} className="text-emerald-500" />
          <h3 className="font-bold text-slate-800">Vaccinations</h3>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
          {student.vaccinations?.length || 0}
        </span>
      </div>
      <ul className="space-y-3 text-sm">
        {(student.vaccinations || []).map((vaccination) => (
          <li key={vaccination} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-1">
            <span className="text-slate-600 font-medium">{vaccination}</span>
            <span className="text-emerald-600 text-xs font-semibold">Recorded</span>
          </li>
        ))}
      </ul>
    </GlassCard>
  );
}

export default VaccinationCard;

