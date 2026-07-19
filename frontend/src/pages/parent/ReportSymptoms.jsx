/**
 * ParentReportSymptoms.jsx
 *
 * Parents submit health concerns about their child here.
 * The report is sent directly and privately to the school doctor.
 * Only the parent and doctor can see the content — fully isolated from teachers.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { symptomOptions } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import { useAuth } from "../../hooks/useAuth";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import {
  ChevronLeft,
  UploadCloud,
  Thermometer,
  Calendar,
  AlertTriangle,
  CheckCircle2,
  Send,
  HeartPulse,
  ShieldCheck,
} from "lucide-react";

function ParentReportSymptoms() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { students, selectedStudent } = useStudents();
  const { submitReport } = useMedicalReports();

  const child =
    selectedStudent ||
    students.find((s) => s.name === "Aarav Sharma") ||
    students[0];

  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [severity, setSeverity] = useState(3);
  const [temperature, setTemperature] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [notes, setNotes] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const toggleSymptom = (symptom) => {
    setSelectedSymptoms((curr) =>
      curr.includes(symptom) ? curr.filter((s) => s !== symptom) : [...curr, symptom]
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    if (selectedSymptoms.length === 0) {
      setErrorMessage("Please select at least one symptom before submitting.");
      return;
    }
    setIsSubmitting(true);
    try {
      await new Promise((r) => setTimeout(r, 800));
      submitReport({
        senderName:  user?.name || "Parent",
        senderRole:  "parent",
        senderId:    user?.id || user?._id || "parent-default",
        symptoms:    selectedSymptoms,
        severity,
        temperature,
        date,
        notes: child ? `[Re: ${child.name}] ${notes}` : notes,
      });
      setSubmitted(true);
    } catch {
      setErrorMessage("Unable to submit your report. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  /* ── Success screen ──────────────────────────────────── */
  if (submitted) {
    return (
      <DashboardLayout>
        <div className="max-w-lg mx-auto py-14 flex flex-col items-center text-center gap-6">
          <div className="h-24 w-24 rounded-full bg-gradient-to-br from-emerald-400 to-teal-500 flex items-center justify-center shadow-xl shadow-emerald-500/30">
            <CheckCircle2 size={44} className="text-white stroke-[2.5]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Report Submitted Successfully</h2>
            <p className="mt-2 text-slate-500 text-sm leading-relaxed">
              Your health report has been securely forwarded to the school doctor.
              You will be notified once the doctor reviews and approves an observation.
            </p>
          </div>

          <div className="w-full rounded-3xl border border-slate-100 bg-white p-6 text-left shadow-sm space-y-4">
            <h3 className="font-bold text-slate-600 text-sm uppercase tracking-wider">Report Summary</h3>
            <div className="flex flex-wrap gap-2">
              {selectedSymptoms.map((s) => (
                <span key={s} className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">{s}</span>
              ))}
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Severity</p>
                <p className="font-bold text-slate-700">{severity} / 10</p>
              </div>
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-3">
                <p className="text-xs text-slate-400 mb-0.5">Date</p>
                <p className="font-bold text-slate-700">{date}</p>
              </div>
            </div>
            {notes && (
              <div className="rounded-xl bg-indigo-50 border border-indigo-100 p-3 text-sm text-indigo-800">
                <p className="text-xs font-semibold text-indigo-400 mb-1">Additional Notes</p>
                {notes}
              </div>
            )}
            <div className="rounded-xl border border-blue-100 bg-blue-50 p-3 flex items-start gap-2">
              <HeartPulse size={15} className="text-blue-500 shrink-0 mt-0.5" />
              <p className="text-xs text-blue-700">
                <span className="font-semibold">What happens next?</span> The doctor will review this privately and send an approved clinical observation directly to you. Check your Notifications or the "Doctor's Diagnosis and Reviews" section on your dashboard.
              </p>
            </div>
          </div>

          <div className="flex gap-3 w-full">
            <button
              onClick={() => { setSubmitted(false); setSelectedSymptoms([]); setNotes(""); setTemperature(""); setSeverity(3); }}
              className="flex-1 py-3 rounded-2xl border border-slate-200 text-slate-600 font-semibold hover:bg-slate-50 transition-colors text-sm"
            >
              Submit Another
            </button>
            <button
              onClick={() => navigate("/parent/dashboard")}
              className="flex-1 py-3 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 text-white font-semibold shadow-md hover:from-emerald-700 hover:to-teal-700 transition-all text-sm"
            >
              Back to Dashboard
            </button>
          </div>
        </div>
      </DashboardLayout>
    );
  }

  /* ── Report form ─────────────────────────────────────── */
  return (
    <DashboardLayout>
      <div className="max-w-4xl mx-auto space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/parent/dashboard")}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
              Report Child's Health Concern
            </h1>
            <p className="text-slate-500 font-medium">
              Submit a confidential health report directly to the school doctor
              {child ? ` — regarding ${child.name}` : ""}
            </p>
          </div>
        </div>

        {errorMessage && (
          <div className="rounded-3xl border border-rose-200 bg-rose-50 p-5 text-rose-700">
            <div className="font-semibold">Submission Error</div>
            <p className="mt-1 text-sm">{errorMessage}</p>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="bg-white/90 backdrop-blur-xl border border-white rounded-3xl p-6 sm:p-8 shadow-sm space-y-8">

            {/* Symptom selector */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-bold text-slate-800">
                  Select Observed Symptoms <span className="text-red-500">*</span>
                </h3>
                <span className="text-xs font-medium text-slate-400 bg-slate-100 px-2 py-1 rounded-lg">Multi-select enabled</span>
              </div>
              <div className="flex flex-wrap gap-2.5">
                {symptomOptions.map((symptom) => {
                  const isSelected = selectedSymptoms.includes(symptom);
                  return (
                    <button
                      key={symptom}
                      type="button"
                      onClick={() => toggleSymptom(symptom)}
                      className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 border ${
                        isSelected
                          ? "bg-blue-600 border-blue-600 text-white shadow-md shadow-blue-500/30"
                          : "bg-white border-slate-200 text-slate-600 hover:border-blue-300 hover:bg-blue-50"
                      }`}
                    >
                      {symptom}
                    </button>
                  );
                })}
              </div>
            </div>

            <hr className="border-slate-100" />

            {/* Severity + vitals */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="space-y-3">
                <div className="flex justify-between items-center mb-1">
                  <label className="text-sm font-semibold text-slate-700 flex items-center gap-1.5">
                    <AlertTriangle
                      size={16}
                      className={severity > 7 ? "text-red-500" : severity > 4 ? "text-amber-500" : "text-emerald-500"}
                    />
                    Severity Level
                  </label>
                  <span className={`text-sm font-bold ${severity > 7 ? "text-red-500" : severity > 4 ? "text-amber-500" : "text-emerald-500"}`}>
                    {severity} / 10
                  </span>
                </div>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={severity}
                  onChange={(e) => setSeverity(parseInt(e.target.value, 10))}
                  className="w-full h-2 bg-slate-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 font-medium px-1">
                  <span>Mild</span>
                  <span>Moderate</span>
                  <span>Severe</span>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Temperature (°F)</label>
                  <div className="relative">
                    <Thermometer size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="number"
                      step="0.1"
                      value={temperature}
                      onChange={(e) => setTemperature(e.target.value)}
                      placeholder="Optional"
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm font-medium"
                    />
                  </div>
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-sm font-semibold text-slate-700">Date Observed</label>
                  <div className="relative">
                    <Calendar size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                    <input
                      type="date"
                      value={date}
                      onChange={(e) => setDate(e.target.value)}
                      className="w-full rounded-xl bg-slate-50 border border-slate-200 py-2.5 pl-9 pr-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm font-medium"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Notes + attachment */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="md:col-span-2 flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Additional Details</label>
                <textarea
                  rows={4}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="Describe your child's condition, when symptoms started, any home remedies tried, or any other details for the doctor…"
                  className="w-full rounded-xl bg-slate-50 border border-slate-200 p-4 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition-all shadow-sm text-sm resize-none"
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className="text-sm font-semibold text-slate-700">Attach Photo</label>
                <div className="flex-1 w-full border-2 border-dashed border-slate-300 rounded-xl bg-slate-50 flex flex-col items-center justify-center gap-2 text-slate-400 hover:bg-slate-100 hover:border-blue-300 transition-colors cursor-pointer p-4 text-center">
                  <UploadCloud size={24} className="text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">Upload photo<br />(Optional)</span>
                </div>
              </div>
            </div>
          </div>

          {/* Privacy notice */}
          <div className="rounded-2xl border border-emerald-100 bg-emerald-50 px-5 py-4 flex items-start gap-3">
            <ShieldCheck size={16} className="text-emerald-600 shrink-0 mt-0.5" />
            <p className="text-xs text-emerald-800 leading-relaxed">
              <span className="font-semibold">Fully private and secure.</span> This report is visible only to the school doctor. 
              Teachers and other school staff cannot access any part of this report. 
              Your child's privacy is fully protected.
            </p>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-4">
            <button
              type="button"
              onClick={() => navigate("/parent/dashboard")}
              className="px-6 py-3 rounded-xl border border-slate-200 text-slate-600 font-medium hover:bg-slate-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-8 py-3 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-semibold shadow-md shadow-blue-500/25 hover:from-blue-700 hover:to-indigo-700 transition-all disabled:opacity-70 flex items-center gap-2"
            >
              <Send size={16} />
              {isSubmitting ? "Submitting…" : "Submit Health Report"}
            </button>
          </div>
        </form>
      </div>
    </DashboardLayout>
  );
}

export default ParentReportSymptoms;
