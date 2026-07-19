import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import VaccinationProgressRing from "../../components/charts/VaccinationProgressRing";
import GlassCard from "../../components/ui/GlassCard";
import { Bell, HeartPulse, ShieldCheck, Syringe, Stethoscope, CheckCircle2, Clock } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { REQUIRED_VACCINATIONS } from "../../utils/healthStatus";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";

function ParentDashboard() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getReportsForSender, getNotificationsForUser } = useMedicalReports();
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
  const myReports       = getReportsForSender(parentId, "parent");
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
        <div className="rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Hello, {child.parent?.name || "Parent"}</h1>
          <p className="mt-2 text-blue-100">Your child's health updates are now visible in one secure place.</p>
        </div>

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
                    <p className="text-sm text-slate-500">Latest wellness summary for {child.name}</p>
                  </div>
                </div>
                <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
                  {currentSummary}
                </div>
                <div className="mt-6 grid gap-4 sm:grid-cols-2">
                  <InfoCard label="Medical History" value={child.medicalConditions?.join(", ") || "None"} accent="blue"  />
                  <InfoCard label="Allergies"        value={child.allergies?.join(", ")          || "None"} accent="amber" />
                </div>
              </GlassCard>

              {/* Vaccination Progress Ring — replaces old CSS border hack */}
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
                  <h2 className="text-lg font-bold text-slate-800">Doctor's Diagnosis and Reviews</h2>
                  <p className="text-sm text-slate-500">Clinical observations sent to you after reviewing your health reports</p>
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
                  Submit a health report and once the doctor reviews it, their clinical observation will be displayed here.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {reviewedReports.slice(0, 3).map((report) => (
                  <div key={report.id} className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5">
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 size={16} className="text-emerald-600 shrink-0" />
                        <span className="text-sm font-bold text-emerald-800">Observation Approved &amp; Sent</span>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium shrink-0">
                        <Clock size={10} />
                        {report.observationSentAt
                          ? new Date(report.observationSentAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short" })
                          : "Recently"}
                      </span>
                    </div>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {report.symptoms?.slice(0, 3).map((s) => (
                        <span key={s} className="rounded-full bg-white border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{s}</span>
                      ))}
                    </div>
                    <div className="rounded-xl bg-white border border-emerald-100 p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Doctor's Note</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{report.observation}</p>
                    </div>
                  </div>
                ))}
                {reviewedReports.length > 3 && (
                  <button
                    onClick={() => navigate("/parent/notifications")}
                    className="w-full py-3 rounded-2xl border border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  >
                    View all {reviewedReports.length} observations →
                  </button>
                )}
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Notifications sub-page — redirect handled by router ── */}
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

        {/* ── Vaccination Section ───────────────────────────
             Note: "Upcoming Vaccination Calendar" removed per spec.
             Only the vaccination records + progress ring are shown.  */}
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
                  const done = (child.vaccinations || []).includes(vaccine);
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
                      <span className={`font-semibold ${done ? "text-emerald-800" : "text-rose-700"}`}>{vaccine}</span>
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

function NotificationItem({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default ParentDashboard;
