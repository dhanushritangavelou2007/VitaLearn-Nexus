import GlassCard from "../ui/GlassCard";
import { AlertTriangle } from "lucide-react";

function EmergencyContact({ student }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle size={18} className="text-red-500" />
        <h3 className="font-bold text-slate-800">Emergency Info</h3>
      </div>
      <div className="space-y-4 text-sm">
        <Info label="Parent / Guardian" value={student.parent?.name || "Not provided"} />
        <Info label="Emergency Contact" value={student.parent?.contact || "Not provided"} />
        <Info label="Parent Email" value={student.parent?.email || "Not provided"} />
        <Info label="Allergies" value={(student.allergies || []).join(", ") || "None"} />
        <Info label="Medical Conditions" value={(student.medicalConditions || []).join(", ") || "None"} />
      </div>
    </GlassCard>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="font-medium text-slate-700">{value}</p>
    </div>
  );
}

export default EmergencyContact;

