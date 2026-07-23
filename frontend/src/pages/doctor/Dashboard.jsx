import { useState, useMemo, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../services/api";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import RiskBarChart from "../../components/charts/RiskBarChart";
import GlassCard from "../../components/ui/GlassCard";
import {
  Activity,
  ClipboardList,
  HeartPulse,
  ShieldCheck,
  AlertTriangle,
  Stethoscope,
  FileText,
  Send,
  Eye,
  ChevronLeft,
  Clock,
  CheckCircle2,
  Calendar,
  User,
  MessageSquare,
  InboxIcon,
} from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";
import { useMedicalReports } from "../../context/MedicalReportsContext";

/* ─── Role colour helpers ──────────────────────────────────── */
const ROLE_BADGE = {
  student: "bg-emerald-100 text-emerald-700 border-emerald-200",
  parent:  "bg-blue-100   text-blue-700   border-blue-200",
  teacher: "bg-purple-100 text-purple-700 border-purple-200",
};
const ROLE_LABEL = { student: "Student", parent: "Parent", teacher: "Teacher" };

/* ─── Status badge ─────────────────────────────────────────── */
function StatusBadge({ status }) {
  return status === "reviewed" ? (
    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
      <CheckCircle2 size={11} /> Reviewed
    </span>
  ) : (
    <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 border border-amber-200 px-2.5 py-0.5 text-xs font-semibold text-amber-700">
      <Clock size={11} /> Awaiting Review
    </span>
  );
}

/* ─── Report Detail Panel ───────────────────────────────────── */
function ReportDetailPanel({ report, onBack, onSend }) {
  const [form, setForm] = useState({
    observation: report.observation || "",
    diagnosis: report.diagnosis || "",
    doctorReview: report.doctorReview || "",
    recommendation: report.recommendation || "",
    prescription: report.prescription || "",
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(report.status === "reviewed");
  const [aiStatus, setAiStatus] = useState(report.aiInsight?.status || "pending");
  const [showScheduleForm, setShowScheduleForm] = useState(false);
  const [scheduleForm, setScheduleForm] = useState({ date: "", time: "", notes: "" });
  const [scheduling, setScheduling] = useState(false);
  const [scheduleSuccess, setScheduleSuccess] = useState(false);

  const handleAcceptAi = () => {
    if (!report.aiInsight) return;
    setAiStatus("accepted");
    setForm({
      observation: report.aiInsight.suggestions || "",
      diagnosis: report.aiInsight.possibleCauses?.join(", ") || "",
      doctorReview: "AI Insight accepted. Risk level: " + (report.aiInsight.riskLevel || "unknown"),
      recommendation: report.aiInsight.recommendedAction || "",
      prescription: "",
    });
  };

  const handleRejectAi = () => {
    setAiStatus("rejected");
    setForm({
      observation: "",
      diagnosis: "",
      doctorReview: "",
      recommendation: "",
      prescription: "",
    });
  };

  const set = (field) => (e) => setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleSend = () => {
    if (!form.observation.trim()) return;
    setSending(true);
    setTimeout(() => {
      onSend(report.id, {
        observation: form.observation.trim(),
        diagnosis: form.diagnosis.trim(),
        doctorReview: form.doctorReview.trim(),
        recommendation: form.recommendation.trim(),
        prescription: form.prescription.trim(),
      });
      setSent(true);
      setSending(false);
    }, 900);
  };

  const handleScheduleAppointment = async () => {
    if (!scheduleForm.date || !scheduleForm.time) return;
    setScheduling(true);
    try {
      const scheduledAt = new Date(`${scheduleForm.date}T${scheduleForm.time}`).toISOString();
      await api.patch(`/students/${report.studentId}/appointments`, {
        newAppointment: { scheduledAt, notes: scheduleForm.notes }
      });
      setScheduleSuccess(true);
      setShowScheduleForm(false);
    } catch (err) {
      console.error("Failed to schedule appointment:", err);
    } finally {
      setScheduling(false);
    }
  };

  const roleBadge = ROLE_BADGE[report.senderRole] || "bg-slate-100 text-slate-700 border-slate-200";
  const roleLabel = ROLE_LABEL[report.senderRole] || report.senderRole;
  const submitted = new Date(report.submittedAt).toLocaleString("en-IN", {
    day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="space-y-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-2 text-sm font-semibold text-slate-500 hover:text-slate-800 transition-colors"
      >
        <ChevronLeft size={16} /> Back to All Reports
      </button>

      {/* Sender Card */}
      <GlassCard className="p-6">
        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
          <div className="flex items-start gap-4">
            <div className={`flex h-12 w-12 items-center justify-center rounded-2xl shrink-0 ${report.senderRole === "student" ? "bg-emerald-100 text-emerald-600" : report.senderRole === "parent" ? "bg-blue-100 text-blue-600" : "bg-purple-100 text-purple-600"}`}>
              <User size={22} />
            </div>
            <div>
              <div className="flex items-center gap-2 mb-1">
                <h2 className="text-xl font-bold text-slate-800">
                  {report.senderRole === "student" ? "Submitted by Student: " : "Submitted by: "}
                  {report.senderName}
                </h2>
                <span className={`inline-flex items-center gap-1 rounded-full border px-2.5 py-0.5 text-xs font-semibold ${roleBadge}`}>
                  {roleLabel}
                </span>
              </div>
              <div className="space-y-1 mt-2">
                {report.senderRole !== "student" && (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Patient (Student):</span> {report.notes?.match(/\[Re:\s([^\]]+)\]/)?.[1] || "Student ID " + report.studentId}
                  </p>
                )}
                {report.senderRole === "parent" && (
                  <p className="text-sm text-slate-600">
                    <span className="font-semibold">Relationship:</span> Parent/Guardian
                  </p>
                )}
                <p className="text-xs text-slate-400">
                  <span className="font-semibold">Report ID:</span> {report.id}
                </p>
                <p className="text-xs text-slate-400">
                  <span className="font-semibold">Time:</span> {submitted}
                </p>
              </div>
            </div>
          </div>
          <StatusBadge status={report.status} />
        </div>
      </GlassCard>

      {/* Reported symptoms */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-4">
          <div className="rounded-xl bg-amber-50 p-2 text-amber-600">
            <AlertTriangle size={16} />
          </div>
          <h3 className="font-bold text-slate-800">Reported Symptoms &amp; Health Information</h3>
        </div>

        {report.symptoms?.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-4">
            {report.symptoms.map((s) => (
              <span key={s} className="rounded-full bg-rose-50 border border-rose-100 px-3 py-1 text-xs font-semibold text-rose-700">
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="grid gap-3 sm:grid-cols-3 mb-4">
          {report.severity && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Severity</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{report.severity} <span className="text-sm font-medium text-slate-400">/ 10</span></p>
            </div>
          )}
          {report.temperature && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Temperature</p>
              <p className="mt-1 text-lg font-bold text-slate-800">{report.temperature}°F</p>
            </div>
          )}
          {report.date && (
            <div className="rounded-2xl bg-slate-50 border border-slate-100 p-3">
              <p className="text-xs font-medium text-slate-400 uppercase tracking-wider">Observation Date</p>
              <p className="mt-1 text-sm font-bold text-slate-800">{report.date}</p>
            </div>
          )}
        </div>

        {report.notes && (
          <div className="rounded-2xl bg-indigo-50 border border-indigo-100 p-4">
            <p className="text-xs font-semibold text-indigo-500 uppercase tracking-wider mb-1">Additional Notes</p>
            <p className="text-sm text-indigo-900 leading-relaxed">{report.notes}</p>
          </div>
        )}
      </GlassCard>

      {/* AI Medical Insight */}
      {!sent && report.aiInsight && (
        <GlassCard className={`p-6 border-2 transition-colors ${aiStatus === "accepted" ? "border-emerald-200" : aiStatus === "rejected" ? "border-slate-200" : "border-purple-200"}`}>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <div className={`rounded-xl p-2 ${aiStatus === "accepted" ? "bg-emerald-50 text-emerald-600" : aiStatus === "rejected" ? "bg-slate-50 text-slate-400" : "bg-purple-50 text-purple-600"}`}>
                <Activity size={16} />
              </div>
              <h3 className="font-bold text-slate-800">AI Medical Insight</h3>
            </div>
            {aiStatus !== "pending" && (
              <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${aiStatus === "accepted" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
                {aiStatus === "accepted" ? "Insight Accepted" : "Insight Rejected"}
              </span>
            )}
          </div>
          
          {aiStatus !== "rejected" ? (
            <div className="space-y-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-xl bg-purple-50/50 p-4 border border-purple-100/50">
                  <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">Possible Causes</p>
                  <p className="text-sm font-medium text-slate-700">{report.aiInsight.possibleCauses?.join(", ") || "None identified"}</p>
                </div>
                <div className="rounded-xl bg-purple-50/50 p-4 border border-purple-100/50">
                  <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">Recommended Action</p>
                  <p className="text-sm font-medium text-slate-700">{report.aiInsight.recommendedAction || "Consult doctor"}</p>
                </div>
              </div>
              <div className="rounded-xl bg-purple-50/50 p-4 border border-purple-100/50">
                <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider mb-1.5">Clinical Suggestions</p>
                <p className="text-sm text-slate-700 leading-relaxed">{report.aiInsight.suggestions || "No suggestions available"}</p>
              </div>
              
              {aiStatus === "pending" && (
                <div className="flex items-center gap-3 pt-2">
                  <button onClick={handleAcceptAi} className="flex-1 rounded-xl bg-purple-600 hover:bg-purple-700 text-white py-2.5 text-sm font-semibold transition-colors">
                    Accept & Auto-fill
                  </button>
                  <button onClick={handleRejectAi} className="flex-1 rounded-xl bg-white border border-slate-200 hover:bg-slate-50 text-slate-700 py-2.5 text-sm font-semibold transition-colors">
                    Reject Insight
                  </button>
                </div>
              )}
            </div>
          ) : (
            <p className="text-sm text-slate-500 italic">AI Insight was rejected. Please proceed with a manual clinical review.</p>
          )}
        </GlassCard>
      )}

      {/* Doctor's Clinical Review Form */}
      <GlassCard className="p-6">
        <div className="flex items-center gap-2 mb-5">
          <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
            <Stethoscope size={16} />
          </div>
          <h3 className="text-lg font-bold text-slate-800">Doctor's Clinical Review</h3>
        </div>

        {sent ? (
          <div className="space-y-3">
            <div className="flex items-center gap-2 rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-3">
              <CheckCircle2 size={18} className="text-emerald-600" />
              <span className="font-semibold text-emerald-800">Review dispatched to {report.senderName}</span>
            </div>
            {form.diagnosis && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                <p className="text-sm font-semibold text-slate-700">{form.diagnosis}</p>
              </div>
            )}
            {form.observation && (
              <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Observation</p>
                <p className="text-sm text-slate-700 leading-relaxed">{form.observation}</p>
              </div>
            )}
            {form.recommendation && (
              <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
                <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Recommendation</p>
                <p className="text-sm text-blue-900 leading-relaxed">{form.recommendation}</p>
              </div>
            )}
            {form.prescription && (
              <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
                <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Prescription</p>
                <p className="text-sm text-purple-900 leading-relaxed">{form.prescription}</p>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            {/* Diagnosis */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Clinical Diagnosis / Conditions <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={form.diagnosis}
                onChange={set("diagnosis")}
                placeholder="e.g. Mild Anaemia, Seasonal Allergies"
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all"
              />
            </div>

            {/* Doctor Review */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Doctor Review / Clinical Notes
              </label>
              <textarea
                rows={3}
                value={form.doctorReview}
                onChange={set("doctorReview")}
                placeholder="Enter your clinical notes and initial assessment..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Observation */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Observation / Health Summary <span className="text-rose-500">*</span>
              </label>
              <textarea
                rows={4}
                value={form.observation}
                onChange={set("observation")}
                placeholder="Describe your clinical observation and recommended next steps..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Recommendation */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Medical Recommendation
              </label>
              <textarea
                rows={2}
                value={form.recommendation}
                onChange={set("recommendation")}
                placeholder="e.g. Rest for 2 days, hydrate well, revisit in a week..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
              />
            </div>

            {/* Prescription */}
            <div>
              <label className="text-sm font-semibold text-slate-700 mb-1 block">
                Prescription (if applicable)
              </label>
              <textarea
                rows={2}
                value={form.prescription}
                onChange={set("prescription")}
                placeholder="e.g. Paracetamol 500mg twice daily for 3 days..."
                className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm text-slate-800 outline-none focus:border-blue-400 focus:bg-white transition-all resize-none"
              />
            </div>

            <div className="flex flex-col gap-4 mt-6">
              {/* Appointment Scheduling Block */}
              {showScheduleForm ? (
                <div className="rounded-xl border border-blue-200 bg-blue-50 p-4">
                  <h4 className="font-semibold text-slate-800 mb-3 flex items-center gap-2">
                    <Calendar size={16} className="text-blue-600" /> Schedule Follow-up Appointment
                  </h4>
                  <div className="grid gap-3 sm:grid-cols-2 mb-3">
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Date</label>
                      <input type="date" value={scheduleForm.date} onChange={(e) => setScheduleForm({...scheduleForm, date: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none" />
                    </div>
                    <div>
                      <label className="text-xs font-semibold text-slate-600 mb-1 block">Time</label>
                      <input type="time" value={scheduleForm.time} onChange={(e) => setScheduleForm({...scheduleForm, time: e.target.value})} className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none" />
                    </div>
                  </div>
                  <div className="mb-3">
                    <label className="text-xs font-semibold text-slate-600 mb-1 block">Notes for Parent</label>
                    <input type="text" value={scheduleForm.notes} onChange={(e) => setScheduleForm({...scheduleForm, notes: e.target.value})} placeholder="e.g. Please bring the latest blood test reports" className="w-full rounded-lg border border-slate-200 p-2 text-sm outline-none" />
                  </div>
                  <div className="flex gap-2 justify-end mt-2">
                    <button onClick={() => setShowScheduleForm(false)} className="px-4 py-2 text-sm font-semibold text-slate-600 hover:bg-slate-200 rounded-lg transition-colors">Cancel</button>
                    <button onClick={handleScheduleAppointment} disabled={!scheduleForm.date || !scheduleForm.time || scheduling} className="px-4 py-2 text-sm font-semibold text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-colors disabled:opacity-50 flex items-center gap-2">
                      {scheduling ? "Scheduling..." : "Confirm Appointment"}
                    </button>
                  </div>
                </div>
              ) : scheduleSuccess ? (
                <div className="rounded-xl bg-emerald-50 border border-emerald-200 p-3 text-sm text-emerald-700 flex items-center gap-2">
                  <CheckCircle2 size={16} /> Appointment scheduled and parent notified.
                </div>
              ) : null}

              {/* Action Buttons */}
              <div className="flex items-center justify-end gap-3 mt-2">
                {!showScheduleForm && !scheduleSuccess && (
                  <button
                    onClick={() => setShowScheduleForm(true)}
                    className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
                  >
                    <Calendar size={15} /> Schedule Appointment
                  </button>
                )}
                <button
                  onClick={handleSend}
                  disabled={!form.observation.trim() || sending}
                  className="inline-flex items-center gap-2 rounded-2xl bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-sm font-semibold text-white shadow-md shadow-emerald-500/30 hover:from-emerald-700 hover:to-teal-700 transition-all disabled:opacity-50"
                >
                  <Send size={15} />
                  {sending ? "Dispatching…" : "Approve and Send Review"}
                </button>
              </div>
            </div>
          </div>
        )}
      </GlassCard>
    </div>
  );
}

/* ─── Reports Panel (list view) ─────────────────────────────── */
function ReportsPanel({ onSelectReport }) {
  const { getReportsForDoctor } = useMedicalReports();
  const allReports = getReportsForDoctor();
  // Only show pending reports in the queue — reviewed ones are removed after doctor submits
  const reports = allReports.filter((r) => r.status === "pending");

  if (reports.length === 0) {
    return (
      <GlassCard className="p-10 flex flex-col items-center justify-center text-center gap-4">
        <div className="h-16 w-16 rounded-full bg-slate-100 flex items-center justify-center">
          <InboxIcon size={28} className="text-slate-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-700">No Reports Yet</h3>
          <p className="text-sm text-slate-400 mt-1">Reports submitted by students, parents, and teachers will appear here for your clinical review.</p>
        </div>
      </GlassCard>
    );
  }

  return (
    <div className="space-y-3">
      {reports.map((report) => {
        const roleBadge = ROLE_BADGE[report.senderRole] || "bg-slate-100 text-slate-700 border-slate-200";
        const roleLabel = ROLE_LABEL[report.senderRole] || report.senderRole;
        const submitted = new Date(report.submittedAt).toLocaleDateString("en-IN", {
          day: "2-digit", month: "short", year: "numeric",
        });

        return (
          <div
            key={report.id}
            onClick={() => onSelectReport(report)}
            className="group cursor-pointer rounded-2xl border border-slate-100 bg-white/80 hover:bg-white hover:border-blue-200 hover:shadow-md transition-all p-5 flex items-start justify-between gap-4"
          >
            <div className="flex items-start gap-4">
              <div className="h-10 w-10 rounded-xl bg-slate-100 flex items-center justify-center text-slate-500 shrink-0 group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors">
                <FileText size={18} />
              </div>
              <div>
                <div className="flex flex-wrap items-center gap-2 mb-1">
                  <span className="font-bold text-slate-800">{report.senderName}</span>
                  <span className={`inline-flex items-center gap-1 rounded-full border px-2 py-0.5 text-xs font-semibold ${roleBadge}`}>
                    {roleLabel}
                  </span>
                </div>
                <p className="text-sm text-slate-500 line-clamp-1">
                  {report.symptoms?.join(", ") || "No symptoms listed"}
                  {report.notes ? ` — ${report.notes}` : ""}
                </p>
                <p className="text-xs text-slate-400 mt-1">{submitted}</p>
              </div>
            </div>
            <div className="flex flex-col items-end gap-2 shrink-0">
              <StatusBadge status={report.status} />
              <span className="inline-flex items-center gap-1 text-xs font-semibold text-blue-600 opacity-0 group-hover:opacity-100 transition-opacity">
                <Eye size={12} /> View Details
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

/* ─── Main Doctor Dashboard ─────────────────────────────────── */
function DoctorDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const { sendObservation, allReports } = useMedicalReports();

  const [selectedReport, setSelectedReport] = useState(null);

  // If navigating from Appointments to Diagnosis with a specific student
  useEffect(() => {
    if (location.pathname.includes("diagnosis") && location.state?.directDiagnoseStudent) {
      const s = location.state.directDiagnoseStudent;
      setSelectedReport({
        id: `mock-${s.id}`, // Mock ID
        studentId: s.id,
        senderName: "Direct Appointment",
        senderRole: "admin",
        status: "pending",
        symptoms: s.symptoms || [],
        notes: "Direct diagnosis from appointments tab.",
      });
      // Clear state so it doesn't re-trigger on refresh
      window.history.replaceState({}, document.title);
    }
  }, [location.pathname, location.state]);

  const reviewStudents = students.filter((s) => s.risk === "high" || s.risk === "critical");
  const stats = calculateDashboardStats();
  const recentActivity = getRecentActivity(students, 6);

  const pendingCount = useMemo(
    () => allReports.filter((r) => r.status === "pending").length,
    [allReports]
  );

  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];

  const diseaseCategories = [
    { name: "Asthma",    value: students.filter((s) => s.medicalConditions?.some((c) => c.toLowerCase().includes("asthma"))).length   || 4 },
    { name: "Allergies", value: students.filter((s) => s.allergies?.length > 0 && s.allergies[0] !== "None").length                  || 6 },
    { name: "Diabetes",  value: students.filter((s) => s.medicalConditions?.some((c) => c.toLowerCase().includes("diabetes"))).length || 1 },
    { name: "Anemia",    value: students.filter((s) => s.medicalConditions?.some((c) => c.toLowerCase().includes("anemia"))).length   || 2 },
  ];

  const isAppointments = location.pathname.includes("appointments");
  const isDiagnosis    = location.pathname.includes("diagnosis");
  const isMainDashboard = !isAppointments && !isDiagnosis;

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load doctor dashboard</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">

        {/* ── Hero Banner ─────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 p-8 text-white shadow-xl relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="relative z-10">
            <div className="flex items-center gap-3 mb-2">
              <Stethoscope size={28} className="text-rose-200" />
              <h1 className="text-3xl font-bold">Doctor Review Centre</h1>
            </div>
            <p className="text-red-100 max-w-xl">
              Monitor and review health reports submitted by students, parents, and teachers. 
              Issue clinical observations and send approved responses directly to senders.
            </p>
          </div>
        </div>

        {/* ── KPI Cards ─────────────────────────────── */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardCard title="Critical Cases"       value={stats.critical}          subtitle="Immediate medical attention"  icon={AlertTriangle}  color="text-red-600"     bg="bg-red-500" />
          <DashboardCard title="Diagnosis Queue"      value={reviewStudents.length}   subtitle="Awaiting clinical review"     icon={ClipboardList}  color="text-amber-600"   bg="bg-amber-500" />
          <DashboardCard title="Pending Reports"      value={pendingCount}            subtitle="Reports requiring observation" icon={MessageSquare}  color="text-blue-600"    bg="bg-blue-500" />
          <DashboardCard title="Completed Diagnoses"  value={allReports.filter(r => r.status === "reviewed").length} subtitle="Observations dispatched" icon={ShieldCheck} color="text-emerald-600" bg="bg-emerald-500" />
          <DashboardCard title="Consultations"        value={stats.appointments || 0} subtitle="Scheduled appointments"       icon={HeartPulse}     color="text-purple-600"  bg="bg-purple-500" />
        </div>

        {/* ── Main Dashboard ─────────────────────────── */}
        {isMainDashboard && (
          <>
            <div id="patients" className="grid gap-6 xl:grid-cols-12">
              <GlassCard className="xl:col-span-6 p-6">
                <div className="flex items-center gap-3 mb-4">
                  <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">Recent Clinical Activity</h2>
                    <p className="text-sm text-slate-500">Completed medical reviews from patient records</p>
                  </div>
                </div>
                <div className="space-y-3">
                  {recentActivity.slice(0, 4).map((item) => (
                    <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4 flex justify-between items-center hover:border-slate-200 transition-colors">
                      <div>
                        <div className="text-sm font-semibold text-slate-700">{item.studentName}</div>
                        <div className="text-xs text-slate-500">{item.title} — {item.description}</div>
                      </div>
                      <span className="text-xs text-slate-400 shrink-0">{item.date}</span>
                    </div>
                  ))}
                  {recentActivity.length === 0 && (
                    <p className="text-sm text-slate-400 text-center py-4">No recent clinical activity.</p>
                  )}
                </div>
              </GlassCard>

              <div className="xl:col-span-6 flex flex-col justify-center">
                <HealthTrendChart data={trendData} title="Diagnosis Trend" dataKey="healthy" strokeColor="#3b82f6" />
              </div>
            </div>

            {/* ── Doctor's Review & Diagnosis — Reports Sent ── */}
            <GlassCard className="p-6">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
                    <InboxIcon size={20} />
                  </div>
                  <div>
                    <h2 className="text-xl font-bold text-slate-800">Doctor's Review &amp; Diagnosis — Reports Sent</h2>
                    <p className="text-sm text-slate-500">
                      Review all submitted health reports. Click any report to view full details and issue a clinical observation.
                    </p>
                  </div>
                </div>
                {pendingCount > 0 && (
                  <span className="rounded-full bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
                    {pendingCount} pending
                  </span>
                )}
              </div>

              {selectedReport ? (
                <ReportDetailPanel
                  report={selectedReport}
                  onBack={() => setSelectedReport(null)}
                  onSend={(id, text) => {
                    sendObservation(id, text);
                    // After review submitted, remove from queue and return to list
                    setSelectedReport(null);
                  }}
                />
              ) : (
                <ReportsPanel onSelectReport={setSelectedReport} />
              )}
            </GlassCard>

            <div className="grid gap-6 lg:grid-cols-2">
              <RiskBarChart
                data={diseaseCategories}
                title="Active Cases by Condition"
              />
              <HealthDistributionChart
                data={[
                  { name: "Active Treatment", value: stats.critical },
                  { name: "Under Observation", value: stats.needReview },
                  { name: "Recovered", value: stats.healthy },
                ]}
                title="Treatment Status Overview"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthAreaChart
                data={[
                  { day: "Week 1", value: 5 },
                  { day: "Week 2", value: 8 },
                  { day: "Week 3", value: 4 },
                  { day: "Week 4", value: stats.appointments || 2 },
                ]}
                title="Follow-up Appointments Trend"
              />
            </div>
          </>
        )}

        {/* ── Diagnosis Queue sub-page ─────────────────────────── */}
        {isDiagnosis && (
          <GlassCard id="diagnosis" className="p-6">
            <div className="flex items-center gap-3 mb-6">
              <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
                <InboxIcon size={20} />
              </div>
              <div>
                <h2 className="text-xl font-bold text-slate-800">Doctor's Review &amp; Diagnosis — Reports Sent</h2>
                <p className="text-sm text-slate-500">All incoming health reports requiring clinical attention.</p>
              </div>
            </div>
            {selectedReport ? (
              <ReportDetailPanel
                report={selectedReport}
                onBack={() => setSelectedReport(null)}
                onSend={(id, text) => {
                  sendObservation(id, text);
                  setSelectedReport(null);
                }}
              />
            ) : (
              <ReportsPanel onSelectReport={setSelectedReport} />
            )}
          </GlassCard>
        )}

        {/* ── Appointments sub-page ────────────────────────────── */}
        {isAppointments && (
          <GlassCard id="appointments" className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-slate-800">Scheduled Appointments</h2>
              <select
                className="bg-white border border-slate-200 rounded-xl px-4 py-2 text-sm text-slate-700 outline-none"
                onChange={(e) => {
                  const val = e.target.value;
                  document.querySelectorAll(".appointment-row").forEach((row) => {
                    if (val === "all") {
                      row.style.display = (row.dataset.risk === "critical" || row.dataset.risk === "observation") ? "table-row" : "none";
                    } else {
                      row.style.display = row.dataset.risk === val ? "table-row" : "none";
                    }
                  });
                }}
              >
                <option value="all">Critical &amp; Observation</option>
                <option value="critical">Critical Only</option>
                <option value="observation">Observation Only</option>
              </select>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold rounded-tl-xl">Student</th>
                    <th className="px-6 py-4 font-semibold">Risk Level</th>
                    <th className="px-6 py-4 font-semibold">Condition</th>
                    <th className="px-6 py-4 font-semibold rounded-tr-xl">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {students.filter((s) => s.risk === "critical" || s.risk === "observation").map((student) => (
                    <tr key={student.id} className="appointment-row hover:bg-slate-50 transition-colors" data-risk={student.risk}>
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">{student.name}</div>
                        <div className="text-xs text-slate-500">Roll: {student.rollNo}</div>
                      </td>
                      <td className="px-6 py-4">
                        <span className={`px-3 py-1 rounded-full text-xs font-semibold ${student.risk === "critical" ? "bg-red-100 text-red-700" : "bg-blue-100 text-blue-700"}`}>
                          {student.risk}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-slate-600">
                        {student.medicalConditions?.join(", ") || "None"}
                      </td>
                      <td className="px-6 py-4 flex items-center gap-3">
                        <a href={`/passport/${student.id}`} className="text-blue-600 hover:underline text-sm font-medium">
                          Passport
                        </a>

                        <button
                          onClick={() => {
                            navigate("/doctor/diagnosis", { state: { directDiagnoseStudent: student } });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-rose-50 text-rose-600 hover:bg-rose-100 font-semibold text-xs transition-colors"
                        >
                          Diagnose
                        </button>
                      </td>
                    </tr>
                  ))}
                  {students.filter((s) => s.risk === "critical" || s.risk === "observation").length === 0 && (
                    <tr>
                      <td colSpan="4" className="text-center py-8 text-slate-500 text-sm">
                        No critical or observation-level appointments at this time.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </GlassCard>
        )}
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
