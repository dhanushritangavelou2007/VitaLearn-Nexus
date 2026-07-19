import { useMemo, useState } from "react";
import GlassCard from "../ui/GlassCard";
import { CheckCircle2, Send, Stethoscope, AlertTriangle, Sparkles } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function DoctorReviewPanel({ student, aiSummary }) {
  const { updateStudent } = useStudents();
  const [diagnosis, setDiagnosis] = useState(student.medicalConditions?.join(", ") || "");
  const [notes, setNotes] = useState(student.doctorNotes || "");
  const [risk, setRisk] = useState(student.risk || "healthy");
  const [summary, setSummary] = useState(student.perfectSummary || aiSummary || "");
  const [verifiedSymptoms, setVerifiedSymptoms] = useState((student.verifiedSymptoms || student.symptoms || []).filter(Boolean));
  const [appointmentDate, setAppointmentDate] = useState("");
  const [appointmentNotes, setAppointmentNotes] = useState("");
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const criticalInsight = useMemo(() => {
    if (student.risk === "critical") {
      return "Immediate attention needed: verified symptoms indicate a high-priority clinical review.";
    }
    if (student.risk === "review") {
      return "Requires review: confirm symptom progression and update care plan.";
    }
    return "Stable profile: continue monitoring and preventive support.";
  }, [student.risk]);

  const handleSave = async () => {
    setSaving(true);
    setSaved(false);

    const appointmentPayload = appointmentDate
      ? {
          appointments: [
            ...(student.appointments || []),
            {
              id: `appt-${Date.now()}`,
              scheduledAt: appointmentDate,
              status: "pending",
              consent: "pending",
              notes: appointmentNotes,
              createdBy: "doctor",
              createdAt: new Date().toISOString(),
            },
          ],
        }
      : {};

    const updated = await updateStudent(student.id, {
      medicalConditions: diagnosis.split(",").map((i) => i.trim()).filter(Boolean),
      doctorNotes: notes,
      perfectSummary: summary,
      verifiedSymptoms,
      risk,
      lastUpdate: "Today",
      ...appointmentPayload,
    });

    setSaving(false);
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
    return updated;
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
        <div className="rounded-3xl border border-slate-200 bg-slate-50 p-4">
          <div className="flex items-center gap-2 text-slate-700 mb-3">
            <Sparkles size={18} />
            <span className="font-semibold">Critical Insight</span>
          </div>
          <p className="text-sm text-slate-600">{criticalInsight}</p>
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Doctor’s Edited Summary</label>
          <textarea
            value={summary}
            onChange={(e) => setSummary(e.target.value)}
            rows="4"
            placeholder="Refine the AI summary to a perfected clinical narrative..."
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
          />
        </div>

        <div>
          <label className="text-sm font-semibold text-slate-700 mb-1 block">Verified Symptoms</label>
          <input
            type="text"
            value={verifiedSymptoms.join(", ")}
            onChange={(e) => setVerifiedSymptoms(e.target.value.split(",").map((item) => item.trim()).filter(Boolean))}
            placeholder="List verified symptoms separated by commas"
            className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
          />
          <p className="text-xs text-slate-500 mt-2">Use confirmed symptoms that should be shared with parent and teacher tracking widgets.</p>
        </div>

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
          />
        </div>

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
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

          <div>
            <label className="text-sm font-semibold text-slate-700 mb-1 block">Proposed Appointment</label>
            <div className="grid gap-3">
              <input
                type="datetime-local"
                value={appointmentDate}
                onChange={(e) => setAppointmentDate(e.target.value)}
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 bg-white"
              />
              <textarea
                value={appointmentNotes}
                onChange={(e) => setAppointmentNotes(e.target.value)}
                rows="2"
                placeholder="Appointment notes and expected focus areas..."
                className="w-full rounded-xl border border-slate-200 p-3 outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 resize-none"
              />
            </div>
          </div>
        </div>

        <div className="flex flex-col justify-end gap-3 lg:flex-row lg:items-center lg:justify-end mt-2">
          <button
            onClick={handleSave}
            disabled={saving}
            className={`inline-flex items-center justify-center gap-2 rounded-2xl py-3 px-8 font-semibold text-white shadow-md transition-all ${
              saved
                ? "bg-emerald-500 shadow-emerald-500/30"
                : "bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 shadow-emerald-500/25"
            }`}
          >
            {saving ? (
              "Processing…"
            ) : saved ? (
              <>
                <CheckCircle2 size={18} />
                Observation Saved
              </>
            ) : (
              <>
                <Send size={18} />
                Approve and Send
              </>
            )}
          </button>
        </div>
      </div>
    </GlassCard>
  );
}

export default DoctorReviewPanel;
