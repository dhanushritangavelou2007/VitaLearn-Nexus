import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import VaccinationProgressRing from "../../components/charts/VaccinationProgressRing";
import GlassCard from "../../components/ui/GlassCard";
import {
  Bell, HeartPulse, ShieldCheck, Syringe, Stethoscope,
  CheckCircle2, Clock, User, Phone, Mail, BookOpen, AlertCircle, Download, FileText,
} from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { REQUIRED_VACCINATIONS } from "../../utils/healthStatus";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";
import { downloadProfessionalPassport, downloadMedicalReport } from "../../utils/exportHelpers";

function ParentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { allReports, getNotificationsForUser } = useMedicalReports();
  const { students, selectedStudent, loading, error, refreshStudents, updateStudentAppointments } =
    useStudents();
  const [confirmationStatus, setConfirmationStatus] = useState("");
  const [appointmentError, setAppointmentError]     = useState("");

  useEffect(() => {
    void refreshStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const child = selectedStudent || students.find((s) => s.name === "Aarav Sharma") || students[0];

  const parentId = user?.id || user?._id || "parent-default";
  const parentName = user?.name || "Parent";
  const parentRole = user?.role || "parent";

  // Reports scoped to the parent: either sent by them OR reviewed reports
  // linked to their child (populated server-side via listReportsForUser).
  // The server already scopes these correctly — we just filter client-side
  // as an extra guard to ensure only this parent's child's reports show.
  const myReports = allReports.filter(
    (r) => r.senderId === parentId || (
      r.status === "reviewed" &&
      (r.studentId === String(child?.id) || r.studentId === String(child?._id))
    )
  );
  const reviewedReports = myReports.filter((r) => r.status === "reviewed");
  const myNotifications = getNotificationsForUser(parentId, "parent");
  const unreadCount     = myNotifications.filter((n) => !n.read).length;

  const isTimeline      = location.pathname.includes("timeline");
  const isNotifications = location.pathname.includes("notifications");
  const isVaccination   = location.pathname.includes("vaccination");
  const isMainDashboard = !isTimeline && !isNotifications && !isVaccination;

  const pendingAppointment = useMemo(
    () => (child?.appointments || []).find((a) => a.status === "pending" && a.consent !== "accepted"),
    [child]
  );

  // ── Canonical Health Score ────────────────────────────────
  const resolvedHealthScore = Number.isFinite(Number(child?.healthScore))
    ? Math.round(Number(child.healthScore))
    : 75;

  const currentSummary =
    child?.perfectSummary ||
    child?.aiSummary ||
    `${child?.name || "Your child"} is keeping good health records. Stay on top of planned appointments and symptom checks.`;

  // ── Loading / Error / Empty States ───────────────────────

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
          <h1 className="text-2xl font-bold">Unable to load parent dashboard</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!child) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-amber-200 bg-amber-50 p-8 text-amber-700">
          <h1 className="text-2xl font-bold">No student records found</h1>
          <p className="mt-2">We couldn't find any student records linked to your account.</p>
        </div>
      </DashboardLayout>
    );
  }

  // ── Appointment Handler ────────────────────────────────────
  const handleAcceptAppointment = async () => {
    setAppointmentError("");
    if (!pendingAppointment || !updateStudentAppointments) {
      setAppointmentError("No appointment available to confirm.");
      return;
    }
    try {
      await updateStudentAppointments(child.id, {
        appointments: (child.appointments || []).map((a) =>
          a.id === pendingAppointment.id ? { ...a, status: "confirmed", consent: "accepted" } : a
        ),
      });
      setConfirmationStatus("Appointment confirmed. Notification sent to teacher and doctor.");
    } catch (err) {
      setAppointmentError(err?.message || "Unable to confirm appointment. Please try again.");
    }
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 text-white shadow-lg relative overflow-hidden">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="relative z-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="text-4xl font-bold tracking-tight">Hello, {parentName}</h1>
              <p className="mt-2 text-blue-100 text-lg">Your child's health updates are now visible in one secure place.</p>
            </div>
            <div className="flex flex-col items-start rounded-2xl border border-white/60 bg-white/20 px-6 py-4 backdrop-blur-md">
              <p className="text-xs font-semibold uppercase tracking-wider text-blue-100">Linked Child</p>
              <p className="mt-1 text-2xl font-bold text-white">{child.name}</p>
              <p className="text-sm text-blue-100">Class {child.class}</p>
            </div>
          </div>
        </div>

        {/* ── Parent Profile Card ──────────────────────────── */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
              <User size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Parent Profile</h2>
              <p className="text-sm text-slate-500">Your account and linked child details</p>
            </div>
          </div>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Parent Name</p>
              <p className="text-xl font-bold text-slate-800">{parentName}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Parent ID</p>
              <p className="text-sm font-semibold text-slate-700 break-all">{parentId}</p>
            </div>
            <div className="rounded-2xl border border-blue-50 bg-blue-50/50 p-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Role</p>
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-100 px-3 py-1 text-sm font-bold text-blue-700 capitalize">
                {parentRole}
              </span>
            </div>
            <div className="rounded-2xl border border-emerald-50 bg-emerald-50/50 p-4">
              <p className="text-xs font-semibold text-emerald-400 uppercase tracking-wider mb-1">Linked Student</p>
              <p className="text-base font-bold text-emerald-800">{child.name}</p>
              <p className="text-xs text-emerald-600">Class {child.class} · Roll {child.rollNo}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <Mail size={11} /> Contact Email
              </p>
              <p className="text-sm font-semibold text-slate-700">{user?.email || "parent@vitalearn.ai"}</p>
            </div>
            <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1 flex items-center gap-1">
                <BookOpen size={11} /> Student Blood Group
              </p>
              <p className="text-sm font-bold text-slate-700">{child.bloodGroup || "N/A"}</p>
            </div>
          </div>
        </GlassCard>

        {/* ── KPI Cards ───────────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Health Score"
            value={`${resolvedHealthScore}/100`}
            subtitle="Overall wellness"
            icon={HeartPulse}
            color="text-emerald-600"
            bg="bg-emerald-500"
          />
          <DashboardCard
            title="BMI"
            value={child.vitals?.bmi || "N/A"}
            subtitle="Body Mass Index"
            icon={ShieldCheck}
            color="text-blue-600"
            bg="bg-blue-500"
          />
          <DashboardCard
            title="Heart Rate"
            value={child.vitals?.heartRate || "N/A"}
            subtitle="bpm"
            icon={HeartPulse}
            color="text-amber-600"
            bg="bg-amber-500"
          />
          <DashboardCard
            title="Temperature"
            value={child.vitals?.temperature ? `${child.vitals.temperature}°F` : "N/A"}
            subtitle="Current temp"
            icon={Bell}
            color="text-slate-700"
            bg="bg-slate-700"
          />
        </div>

        {/* ── Main Dashboard ──────────────────────────────── */}
        {isMainDashboard && (
          <>
            {/* Row 1: AI Summary + Vaccination Progress Ring */}
            <div id="passport" className="grid gap-6 xl:grid-cols-12">

              {/* AI Health Summary */}
              <GlassCard className="xl:col-span-7 p-6">
                <div className="flex items-center gap-3">
                  <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                    <ShieldCheck size={20} />
                  </div>
                  <div>
                    <h2 className="text-lg font-bold text-slate-800">AI Health Summary</h2>
                    <p className="text-sm text-slate-500">Latest wellness summary for <span className="font-semibold text-slate-700">{child.name}</span></p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {currentSummary}
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Medical History" value={child.medicalConditions?.join(", ") || "None"} accent="blue"  />
                  <InfoCard label="Allergies"        value={child.allergies?.join(", ")          || "None"} accent="amber" />
                </div>
                <div className="mt-5 flex flex-wrap gap-3">
                  <button
                    onClick={() => downloadProfessionalPassport(child, currentSummary)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-colors"
                  >
                    <Download size={14} /> Download Passport
                  </button>
                  <button
                    onClick={() => downloadMedicalReport(child, currentSummary)}
                    className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 transition-colors"
                  >
                    <FileText size={14} /> Download Medical Report
                  </button>
                </div>
              </GlassCard>

              {/* Vaccination Progress Ring */}
              <GlassCard className="xl:col-span-5 p-6 flex flex-col justify-center items-center bg-gradient-to-br from-indigo-50 to-purple-50">
                <div className="flex items-center gap-2 mb-6 self-start">
                  <div className="rounded-xl bg-indigo-100 p-2 text-indigo-600">
                    <Syringe size={18} />
                  </div>
                  <div>
                    <h2 className="text-base font-bold text-slate-800">Vaccination Progress</h2>
                    <p className="text-xs text-slate-500">4 core vaccines tracked for {child.name}</p>
                  </div>
                </div>
                <VaccinationProgressRing
                  vaccinations={child.vaccinations}
                  size={172}
                  showList={false}
                />
              </GlassCard>
            </div>

            {/* Row 2: Pediatrician Notes / Symptom History / Upcoming Appointments */}
            <div className="grid gap-6 xl:grid-cols-3">

              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Pediatrician Notes</h2>
                <div className="space-y-3">
                  {child.reports && child.reports.length > 0 ? (
                    child.reports.map((r, i) => (
                      <div key={i} className="rounded-xl bg-slate-50 p-3 text-sm text-slate-600 border border-slate-100">
                        <span className="font-semibold block">{r.date} — {r.type}</span>
                        {r.status}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No recent notes.</p>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Symptom History</h2>
                <div className="space-y-3">
                  {child.symptoms?.length > 0 && child.symptoms[0] !== "None" ? (
                    child.symptoms.map((s, i) => (
                      <div key={i} className="rounded-xl bg-amber-50 p-3 text-sm text-amber-700 border border-amber-100">
                        {s}
                      </div>
                    ))
                  ) : (
                    <p className="text-sm text-slate-500">No symptoms reported recently.</p>
                  )}
                </div>
              </GlassCard>

              <GlassCard className="p-6">
                <h2 className="text-lg font-bold text-slate-800 mb-4">Upcoming Appointments</h2>
                <div className="space-y-3">
                  {pendingAppointment ? (
                    <div className="rounded-xl bg-blue-50 p-4 text-sm text-blue-700 border border-blue-100">
                      <span className="font-semibold block">{pendingAppointment.title || "Doctor Review"}</span>
                      <p className="mt-1">{pendingAppointment.scheduledAt || pendingAppointment.date || "Date pending"}</p>
                      <p className="mt-1 text-slate-500">{pendingAppointment.notes || "Please consent to this appointment."}</p>
                      <button
                        onClick={handleAcceptAppointment}
                        className="mt-4 inline-flex items-center justify-center rounded-xl bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-700"
                      >
                        Accept &amp; Consent
                      </button>
                      {confirmationStatus && <p className="mt-3 text-sm text-emerald-700">{confirmationStatus}</p>}
                      {appointmentError   && <p className="mt-3 text-sm text-rose-700">{appointmentError}</p>}
                    </div>
                  ) : (
                    <p className="text-sm text-slate-500">No appointments are awaiting consent right now.</p>
                  )}
                </div>
              </GlassCard>
            </div>
          </>
        )}

        {/* ── Doctor's Diagnosis and Reviews (Main Dashboard) ───── */}
        {isMainDashboard && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-slate-800">Doctor's Diagnosis and Reviews</h2>
                  <p className="text-sm text-slate-500">Complete observation history for {child.name}</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/parent/notifications")}
                className="relative rounded-full bg-white border border-slate-200 p-2.5 shadow-sm hover:bg-slate-50 transition-colors"
                title="View all notifications"
              >
                <Bell size={18} className="text-slate-600" />
                {unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 h-4 w-4 rounded-full bg-rose-500 border-2 border-white flex items-center justify-center text-[9px] font-bold text-white">
                    {unreadCount}
                  </span>
                )}
              </button>
            </div>

            {reviewedReports.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
                <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                  <Stethoscope size={22} className="text-slate-400" />
                </div>
                <p className="font-semibold text-slate-600">No observations received yet</p>
                <p className="text-sm text-slate-400 max-w-sm">
                  Once the teacher submits a health report and the doctor reviews it, the full clinical observation will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewedReports.map((report) => (
                  <DoctorReviewCard key={report.id} report={report} />
                ))}
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Notifications sub-page redirect ── */}
        {isNotifications && (
          <GlassCard id="notifications" className="p-6">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                <p className="text-sm text-slate-500">Doctor observations and health updates</p>
              </div>
            </div>
            <p className="text-sm text-slate-500">
              Redirecting to your notifications…{" "}
              <button onClick={() => navigate("/parent/notifications")} className="text-blue-600 font-semibold hover:underline">
                Click here
              </button>
            </p>
          </GlassCard>
        )}

        {/* ── Vaccination Section ─────────────────────────── */}
        {isVaccination && (
          <div id="vaccination" className="grid gap-6 lg:grid-cols-2">

            {/* Progress Ring */}
            <GlassCard className="p-6 flex flex-col items-center justify-center bg-gradient-to-br from-indigo-50 to-purple-50">
              <h2 className="text-lg font-bold text-slate-800 self-start mb-6">Vaccination Progress</h2>
              <VaccinationProgressRing
                vaccinations={child.vaccinations}
                size={180}
                showList={false}
              />
            </GlassCard>

            {/* Completed Vaccine Records */}
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-slate-800 mb-5">Vaccination Records</h2>
              <div className="space-y-3">
                {REQUIRED_VACCINATIONS.map((vaccine) => {
                  const vaccObj = (child.vaccinations || []).find(
                    (v) => (typeof v === "string" ? v : v?.name) === vaccine
                  );
                  const done = vaccObj
                    ? (typeof vaccObj === "string" || vaccObj.status === "completed")
                    : false;
                  const vaccDate = vaccObj && typeof vaccObj === "object" ? vaccObj.date : null;
                  return (
                    <div
                      key={vaccine}
                      className={`flex items-center gap-3 rounded-2xl border p-4 ${
                        done ? "border-emerald-100 bg-emerald-50/50" : "border-rose-100 bg-rose-50/50"
                      }`}
                    >
                      <div className={`rounded-full p-2 ${done ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"}`}>
                        <ShieldCheck size={16} />
                      </div>
                      <div>
                        <span className={`font-semibold block ${done ? "text-emerald-800" : "text-rose-700"}`}>{vaccine}</span>
                        {vaccDate && <span className="text-xs text-slate-400">{vaccDate}</span>}
                      </div>
                      <span className={`ml-auto text-xs font-bold px-3 py-1 rounded-full ${done ? "bg-emerald-100 text-emerald-700" : "bg-rose-100 text-rose-600"}`}>
                        {done ? "✓ Complete" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── Timeline Section ─────────────────────────────── */}
        {isTimeline && (
          <div id="timeline" className="grid gap-6 lg:grid-cols-2">
            <HealthTrendChart
              data={[
                { day: "Jan", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 3), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 2) },
                { day: "Mar", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 2), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 1) },
                { day: "May", height: Math.max(0, parseFloat(child.vitals?.height || 140) - 1), weight: Math.max(0, parseFloat(child.vitals?.weight || 35) - 0.5) },
                { day: "Jul", height: parseFloat(child.vitals?.height || 140),                   weight: parseFloat(child.vitals?.weight || 35) },
              ]}
              title="Child Growth (Height &amp; Weight)"
              dataKey="height"
            />
            <HealthAreaChart
              data={[
                { day: "Week 1", value: 85 },
                { day: "Week 2", value: 88 },
                { day: "Week 3", value: 87 },
                { day: "Week 4", value: resolvedHealthScore },
              ]}
              title="Health Score Trend"
            />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

// ─── Doctor Review Card ───────────────────────────────────────
// Full observation history card shown in Parent Dashboard with
// Doctor Name, Role, Date/Time, Observation, Diagnosis, Recommendation.
function DoctorReviewCard({ report }) {
  const [open, setOpen] = useState(false);
  const sentAt = report.observationSentAt
    ? new Date(report.observationSentAt).toLocaleString("en-IN", {
        day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
      })
    : "Recently";

  return (
    <div className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50">
      {/* Header row */}
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full text-left p-5 flex items-start justify-between gap-3"
      >
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
            <Stethoscope size={18} />
          </div>
          <div>
            <div className="flex flex-wrap items-center gap-2 mb-1">
              <p className="text-base font-bold text-slate-800">
                {report.reviewedByName || "Doctor"}
              </p>
              <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                Doctor
              </span>
            </div>
            {report.diagnosis && (
              <p className="text-sm font-semibold text-slate-700">
                Diagnosis: <span className="font-normal">{report.diagnosis}</span>
              </p>
            )}
            <p className="text-xs text-slate-400 flex items-center gap-1 mt-1">
              <Clock size={10} /> {sentAt}
            </p>
          </div>
        </div>
        <div className="flex flex-col items-end gap-2 shrink-0">
          <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-bold text-emerald-700">
            <CheckCircle2 size={10} /> Reviewed
          </span>
          <span className="text-xs text-slate-400">{open ? "▲ Less" : "▼ Details"}</span>
        </div>
      </button>

      {/* Expanded details */}
      {open && (
        <div className="px-5 pb-5 space-y-3 border-t border-emerald-100 pt-4">
          {/* Observation */}
          {report.observation && (
            <div className="rounded-xl bg-white border border-emerald-100 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Observation</p>
              <p className="text-sm text-slate-700 leading-relaxed">{report.observation}</p>
            </div>
          )}
          {/* Diagnosis */}
          {report.diagnosis && (
            <div className="rounded-xl bg-white border border-slate-100 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Diagnosis</p>
              <p className="text-base font-bold text-slate-800">{report.diagnosis}</p>
            </div>
          )}
          {/* Recommendation */}
          {report.recommendation && (
            <div className="rounded-xl bg-blue-50 border border-blue-100 p-4">
              <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">Medical Recommendation</p>
              <p className="text-sm text-blue-900 leading-relaxed font-medium">{report.recommendation}</p>
            </div>
          )}
          {/* Prescription */}
          {report.prescription && (
            <div className="rounded-xl bg-purple-50 border border-purple-100 p-4">
              <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1.5">Prescription</p>
              <p className="text-sm text-purple-900 leading-relaxed">{report.prescription}</p>
            </div>
          )}
          {/* Doctor Review notes */}
          {report.doctorReview && (
            <div className="rounded-xl bg-slate-50 border border-slate-100 p-4">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Doctor Review Notes</p>
              <p className="text-sm text-slate-700 leading-relaxed">{report.doctorReview}</p>
            </div>
          )}
          {/* Symptoms reported */}
          {report.symptoms?.length > 0 && (
            <div className="flex flex-wrap gap-2">
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider w-full">Reported Symptoms</p>
              {report.symptoms.map((s) => (
                <span key={s} className="rounded-full bg-rose-50 border border-rose-100 px-2.5 py-0.5 text-xs font-medium text-rose-700">{s}</span>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}

// ─── Sub-components ──────────────────────────────────────────

function InfoCard({ label, value, accent }) {
  const styles = {
    blue:    "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
    amber:   "bg-amber-50 text-amber-700",
    indigo:  "bg-indigo-50 text-indigo-700",
  };
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${styles[accent]}`}>{value}</p>
    </div>
  );
}

export default ParentDashboard;
