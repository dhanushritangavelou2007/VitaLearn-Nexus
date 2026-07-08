import { useState } from "react";
import GlassCard from "../ui/GlassCard";
import { CheckCircle2, Save, Stethoscope, AlertTriangle } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function DoctorReviewPanel({ student, aiSummary }) {
  const { updateStudent } = useStudents();
  const [diagnosis, setDiagnosis] = useState(student.medicalConditions?.join(", ") || "");
  const [notes, setNotes] = useState(student.doctorNotes || "");
  const [risk, setRisk] = useState(student.risk || "healthy");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);
    
    await updateStudent(student.id, {
      medicalConditions: diagnosis.split(",").map(i => i.trim()).filter(Boolean),
      doctorNotes: notes,
      risk: risk,
      lastUpdate: "Today"
    });
    
    setTimeout(() => {
      setSaving(false);
      setSaved(true);
      setTimeout(() => setSaved(false), 3000);
    }, 800);
  };

  return (
    <GlassCard className="rounded-3xl border-2 border-blue-500/20 p-6 bg-blue-50/30 mt-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-2xl bg-blue-100 p-2.5 text-blue-700">
          <Stethoscope size={24} />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800">Doctor Review & Diagnosis</h2>
          <p className="text-sm text-slate-600">Update medical records and clinical notes</p>
        </div>
      </div>

      <div className="space-y-5">
        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Clinical Diagnosis / Conditions</label>
          <input
            type="text"
            value={diagnosis}
            onChange={(e) => setDiagnosis(e.target.value)}
            placeholder="e.g. Mild Asthma, Seasonal Allergies"
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Doctor's Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows="3"
            placeholder="Add clinical observations, prescriptions, or follow-up instructions..."
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          ></textarea>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 flex items-center gap-1">
              <AlertTriangle size={16} /> Risk Assessment
            </label>
            <select
              value={risk}
              onChange={(e) => setRisk(e.target.value)}
              className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 bg-white"
            >
              <option value="healthy">Healthy</option>
              <option value="observation">Observation</option>
              <option value="review">Needs Review</option>
              <option value="critical">Critical</option>
            </select>
          </div>
          
          <div className="flex flex-col justify-end">
            <button
              onClick={handleSave}
              disabled={saving}
              className={`flex items-center justify-center gap-2 rounded-xl py-3 font-semibold text-white transition-all ${
                saved ? "bg-emerald-500" : "bg-blue-600 hover:bg-blue-700"
              }`}
            >
              {saving ? (
                "Saving..."
              ) : saved ? (
                <>
                  <CheckCircle2 size={18} />
                  Saved
                </>
              ) : (
                <>
                  <Save size={18} />
                  Approve & Save
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </GlassCard>
  );
}

export default DoctorReviewPanel;
