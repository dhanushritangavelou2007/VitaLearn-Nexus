import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import RiskBarChart from "../../components/charts/RiskBarChart";
import CircularProgress from "../../components/charts/CircularProgress";
import VaccinationProgressRing from "../../components/charts/VaccinationProgressRing";
import VaccinationCard from "../../components/profile/VaccinationCard";
import GlassCard from "../../components/ui/GlassCard";
import { Activity, HeartPulse, ShieldCheck, Award, Syringe, Bell, Stethoscope, CheckCircle2, Clock, Download, FileText } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { calculateHealthScore } from "../../utils/studentAnalytics";
import { REQUIRED_VACCINATIONS } from "../../utils/healthStatus";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";
import { downloadProfessionalPassport, downloadMedicalReport } from "../../utils/exportHelpers";


function StudentDashboard() {
  const location  = useLocation();
  const navigate  = useNavigate();
  const { user }  = useAuth();
  const { allReports, getNotificationsForUser } = useMedicalReports();
  const { students, calculateDashboardStats, generateHealthSummary, loading, refreshStudents } =
    useStudents();

  useEffect(() => {
    void refreshStudents();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const userId = user?.id || user?._id || "student-default";
  // Include only reviewed reports linked to this student's own record
  // (server-side listReportsForUser scopes them correctly via studentId link)
  const linkedStudentId = students.find(
    (s) => s.name === "Aarav Sharma" || String(s.user) === userId
  );
  const myStudentId = linkedStudentId ? String(linkedStudentId.id || linkedStudentId._id) : null;
  const reviewedReports = allReports.filter(
    (r) => r.status === "reviewed" && (
      r.senderId === userId ||
      (myStudentId && (r.studentId === myStudentId || r.studentId === myStudentId))
    )
  );
  const myNotifications = getNotificationsForUser(userId, "student");
  const unreadCount     = myNotifications.filter((n) => !n.read).length;

  const student = students.find((s) => s.name === "Aarav Sharma") || students[0];
  const stats   = calculateDashboardStats();

  const fallbackStudent = {
    name: "Student",
    vitals: { bmi: "N/A", bloodPressure: "N/A", temperature: "N/A" },
    attendance: "95%",
    vaccinations: [],
    symptoms: [],
    medicalConditions: [],
    aiSummary: "Loading student summary...",
    perfectSummary: "",
  };

  const currentStudent = student || fallbackStudent;

  // ── Health Score (canonical) ─────────────────────────────────
  const healthScore = Number.isFinite(Number(currentStudent?.healthScore))
    ? Math.round(Number(currentStudent.healthScore))
    : Math.round(calculateHealthScore(currentStudent));

  const healthStatus =
    healthScore >= 90 ? "Excellent"
    : healthScore >= 75 ? "Good — Low Risk"
    : healthScore >= 60 ? "Needs Observation"
    : "Needs Review";

  const summaryText = currentStudent.perfectSummary || generateHealthSummary(currentStudent);

  // ── Vaccination Data ─────────────────────────────────────────
  // Normalize to name strings for checklist comparisons
  const vaccNames = (currentStudent.vaccinations || []).map((v) => {
    if (!v) return null;
    if (typeof v === "string") return v;
    return v.status === "completed" ? v.name : null;
  }).filter(Boolean);
  const completedVaccinations = vaccNames.filter((v) => REQUIRED_VACCINATIONS.includes(v));
  const missingVaccinations = REQUIRED_VACCINATIONS.filter(
    (v) => !completedVaccinations.includes(v)
  );

  // ── Chart Data ───────────────────────────────────────────────
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];

  const isAchievements  = location.pathname.includes("achievements");
  const isTimeline      = location.pathname.includes("timeline");
  const isVaccination   = location.pathname.includes("vaccination");
  const isMainDashboard = !isAchievements && !isTimeline && !isVaccination;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">

        {/* ── Hero Banner ─────────────────────────────────── */}
        <div className="rounded-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-lg">
          <h1 className="text-4xl font-bold tracking-tight">Welcome, {currentStudent.name}</h1>
          <p className="mt-2 text-emerald-100 text-lg">Your personal health passport is ready and up to date.</p>
        </div>

        {/* ── Top Vitals Row ──────────────────────────────── */}
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Health Score"
            value={loading ? "Loading..." : `${healthScore}/100`}
            subtitle={loading ? "Fetching health score" : healthStatus}
            icon={HeartPulse}
            color="text-emerald-600"
            bg="bg-emerald-500"
          />
          <DashboardCard
            title="BMI"
            value={currentStudent.vitals?.bmi || "N/A"}
            subtitle="Healthy range"
            icon={Activity}
            color="text-slate-700"
            bg="bg-slate-700"
          />
          <DashboardCard
            title="Attendance"
            value={currentStudent.attendance || "N/A"}
            subtitle="Overall"
            icon={ShieldCheck}
            color="text-blue-600"
            bg="bg-blue-500"
          />
          <DashboardCard
            title="Risk Level"
            value={currentStudent.risk ? currentStudent.risk.charAt(0).toUpperCase() + currentStudent.risk.slice(1) : "Healthy"}
            subtitle="Current status"
            icon={Activity}
            color="text-amber-600"
            bg="bg-amber-500"
          />
        </div>

        {/* ── Doctor's Suggestions & Care Plan ──────────────── */}
        {isMainDashboard && (currentStudent.doctorNotes || currentStudent.medicalConditions?.length > 0) && (
          <GlassCard className="p-6 border-l-4 border-l-indigo-500">
            <div className="flex items-center gap-3 mb-4">
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <Stethoscope size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Doctor's Suggestions & Care Plan</h2>
                <p className="text-sm text-slate-500">Clinical notes and ongoing instructions from your doctor</p>
              </div>
            </div>
            <div className="grid gap-6 md:grid-cols-2">
              <div className="rounded-2xl bg-slate-50 p-5 border border-slate-100">
                <h3 className="text-sm font-bold text-slate-700 mb-2 uppercase tracking-wider">Active Conditions</h3>
                {currentStudent.medicalConditions?.length > 0 ? (
                  <ul className="list-disc list-inside text-sm text-slate-600 space-y-1">
                    {currentStudent.medicalConditions.map(c => <li key={c}>{c}</li>)}
                  </ul>
                ) : (
                  <p className="text-sm text-slate-500">No active conditions</p>
                )}
              </div>
              <div className="rounded-2xl bg-indigo-50/50 p-5 border border-indigo-100">
                <h3 className="text-sm font-bold text-indigo-900 mb-2 uppercase tracking-wider">Clinical Notes & Recommendations</h3>
                <p className="text-sm text-indigo-800 leading-relaxed whitespace-pre-wrap">
                  {currentStudent.doctorNotes || "No specific instructions at this time. Maintain healthy habits!"}
                </p>
              </div>
            </div>
          </GlassCard>
        )}

        {/* ── Main Passport Panel ─────────────────────────── */}
        {isMainDashboard && (
          <div id="passport" className="grid gap-6 xl:grid-cols-12">

            {/* AI Health Tips — spans 8 cols */}
            <GlassCard className="xl:col-span-8 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">AI Health Tips</h2>
                  <p className="text-sm text-slate-500">Personalised for you</p>
                </div>
              </div>
              <div className="mt-6 rounded-xl border border-indigo-100 bg-indigo-50 p-5 text-sm leading-relaxed text-indigo-900">
                {summaryText}
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard label="Height"      value={currentStudent.vitals?.height   || "N/A"} accent="blue"    />
                <InfoCard label="Weight"      value={currentStudent.vitals?.weight   || "N/A"} accent="emerald" />
                <InfoCard label="Blood Group" value={currentStudent.bloodGroup        || "N/A"} accent="rose"    />
                <InfoCard label="Allergies"   value={currentStudent.allergies?.join(", ") || "None"} accent="amber" />
              </div>
            </GlassCard>

            {/* Health Passport — spans 4 cols */}
            <GlassCard className="xl:col-span-4 p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white border-0">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white/90">Health Passport</h2>
                  <p className="text-sm text-white/70">Individual student wellness score</p>
                </div>
                <div className="mt-6 flex flex-col items-center justify-center gap-4 rounded-2xl bg-white/10 p-4 backdrop-blur-md">
                  <CircularProgress
                    value={healthScore}
                    label="Wellness"
                    size={132}
                    accent="from-emerald-200 to-cyan-200"
                  />
                </div>
                <div className="mt-4 rounded-xl bg-white/20 p-3 backdrop-blur-md">
                  <p className="text-sm font-medium">Keep up the good work! Stay hydrated.</p>
                </div>
                <div className="mt-4 flex flex-col gap-2">
                  <button
                    onClick={() => downloadProfessionalPassport(currentStudent, summaryText)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    <Download size={14} /> Download Passport
                  </button>
                  <button
                    onClick={() => downloadMedicalReport(currentStudent, summaryText)}
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-white/20 hover:bg-white/30 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
                  >
                    <FileText size={14} /> Download Medical Report
                  </button>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── Vaccination Details Widget ───────────────────── */}
        {isMainDashboard && (
          <div className="grid gap-6 lg:grid-cols-3">

            {/* Circular Progress Ring */}
            <GlassCard className="lg:col-span-1 p-6 flex flex-col items-center justify-center bg-gradient-to-br from-slate-50 to-indigo-50">
              <div className="flex items-center gap-2 mb-6 self-start">
                <div className="rounded-xl bg-indigo-50 p-2 text-indigo-600">
                  <Syringe size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Vaccination Progress</h2>
                  <p className="text-xs text-slate-500">4 required vaccines tracked</p>
                </div>
              </div>
              <VaccinationProgressRing
                vaccinations={currentStudent.vaccinations}
                size={168}
                showList={false}
              />
            </GlassCard>

            {/* Vaccine Checklist */}
            <GlassCard className="lg:col-span-2 p-6">
              <div className="flex items-center gap-2 mb-5">
                <div className="rounded-xl bg-emerald-50 p-2 text-emerald-600">
                  <ShieldCheck size={18} />
                </div>
                <div>
                  <h2 className="text-base font-bold text-slate-800">Vaccination Details</h2>
                  <p className="text-xs text-slate-500">
                    {completedVaccinations.length} of {REQUIRED_VACCINATIONS.length} doses complete
                  </p>
                </div>
              </div>

              <div className="space-y-3">
                {REQUIRED_VACCINATIONS.map((vaccine) => {
                  const done = completedVaccinations.includes(vaccine);
                  const vaccObj = (currentStudent.vaccinations || []).find(
                    (v) => (typeof v === "string" ? v : v?.name) === vaccine
                  );
                  const vaccDate = vaccObj && typeof vaccObj === "object" ? vaccObj.date : null;
                  return (
                    <div
                      key={vaccine}
                      className={`flex items-center justify-between rounded-2xl border px-5 py-3.5 transition-all ${
                        done
                          ? "border-emerald-100 bg-emerald-50"
                          : "border-rose-100 bg-rose-50"
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div
                          className={`rounded-full p-1.5 ${
                            done ? "bg-emerald-100 text-emerald-600" : "bg-rose-100 text-rose-500"
                          }`}
                        >
                          <ShieldCheck size={14} />
                        </div>
                        <div>
                          <span className={`font-semibold text-sm block ${done ? "text-emerald-800" : "text-rose-700"}`}>
                            {vaccine}
                          </span>
                          {vaccDate && <span className="text-xs text-slate-400">{vaccDate}</span>}
                        </div>
                      </div>
                      <span
                        className={`rounded-full px-3 py-1 text-xs font-bold ${
                          done
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-rose-100 text-rose-600"
                        }`}
                      >
                        {done ? "✓ Complete" : "Pending"}
                      </span>
                    </div>
                  );
                })}
              </div>

              {missingVaccinations.length > 0 && (
                <div className="mt-4 rounded-xl border border-amber-100 bg-amber-50 px-4 py-3 text-sm text-amber-700">
                  <span className="font-semibold">Action required: </span>
                  Schedule {missingVaccinations.join(", ")} vaccination
                  {missingVaccinations.length > 1 ? "s" : ""} with the school nurse.
                </div>
              )}
            </GlassCard>
          </div>
        )}

        {/* ── Doctor's Diagnosis and Reviews ────────────────────── */}
        {isMainDashboard && (
          <GlassCard className="p-6">
            <div className="flex items-center justify-between mb-5">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                  <Stethoscope size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Doctor's Diagnosis and Reviews</h2>
                  <p className="text-sm text-slate-500">Clinical observations approved and sent by your doctor</p>
                </div>
              </div>
              <button
                onClick={() => navigate("/student/notifications")}
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
                  Once the teacher submits a health report and the doctor reviews it, the clinical observation will appear here.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {reviewedReports.slice(0, 3).map((report) => (
                  <div
                    key={report.id}
                    className="rounded-2xl border border-emerald-100 bg-gradient-to-r from-emerald-50 to-teal-50 p-5"
                  >
                    {/* Doctor Identity Row */}
                    <div className="flex items-start justify-between gap-3 mb-3">
                      <div className="flex items-center gap-3">
                        <div className="h-9 w-9 rounded-xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                          <Stethoscope size={16} />
                        </div>
                        <div>
                          <p className="text-base font-bold text-slate-800">{report.reviewedByName || "Doctor"}</p>
                          <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">Doctor</span>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1 text-xs text-emerald-600 font-medium shrink-0">
                        <Clock size={10} />
                        {report.observationSentAt
                          ? new Date(report.observationSentAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "Recently"}
                      </span>
                    </div>
                    {/* Diagnosis */}
                    {report.diagnosis && (
                      <div className="mb-3 rounded-xl bg-white border border-slate-100 px-4 py-2">
                        <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">Diagnosis</p>
                        <p className="text-base font-bold text-slate-800">{report.diagnosis}</p>
                      </div>
                    )}
                    {/* Symptoms */}
                    {report.symptoms?.length > 0 && (
                      <div className="flex flex-wrap gap-2 mb-3">
                        {report.symptoms.slice(0, 3).map((s) => (
                          <span key={s} className="rounded-full bg-white border border-emerald-100 px-2.5 py-0.5 text-xs font-medium text-slate-600">{s}</span>
                        ))}
                      </div>
                    )}
                    {/* Observation */}
                    <div className="rounded-xl bg-white border border-emerald-100 p-4">
                      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1.5">Observation</p>
                      <p className="text-sm text-slate-700 leading-relaxed">{report.observation}</p>
                    </div>
                    {/* Recommendation */}
                    {report.recommendation && (
                      <div className="rounded-xl bg-blue-50 border border-blue-100 p-4 mt-3">
                        <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1.5">Recommendation</p>
                        <p className="text-sm text-blue-900 leading-relaxed font-medium">{report.recommendation}</p>
                      </div>
                    )}
                  </div>
                ))}
                {reviewedReports.length > 3 && (
                  <button
                    onClick={() => navigate("/student/notifications")}
                    className="w-full py-3 rounded-2xl border border-dashed border-slate-200 text-sm font-semibold text-slate-500 hover:border-emerald-300 hover:text-emerald-700 transition-colors"
                  >
                    View all {reviewedReports.length} observations →
                  </button>
                )}
              </div>
            )}
          </GlassCard>
        )}

        {/* ── Timeline Section ─────────────────────────────── */}
        {isTimeline && (

          <>
            <div id="timeline" className="grid gap-6 lg:grid-cols-2">
              <HealthTrendChart data={trendData} title="Health Timeline" />
              <HealthAreaChart
                data={[
                  { day: "Week 1", value: 18.5 },
                  { day: "Week 2", value: 18.7 },
                  { day: "Week 3", value: 18.6 },
                  { day: "Week 4", value: parseFloat(currentStudent.vitals?.bmi || 18.7) },
                ]}
                title="BMI Trend"
              />
            </div>
            <div className="grid gap-6 lg:grid-cols-2 mt-6">
              <HealthTrendChart
                data={[
                  { day: "Jan", height: Math.max(0, parseFloat(currentStudent.vitals?.height || 140) - 3), weight: Math.max(0, parseFloat(currentStudent.vitals?.weight || 35) - 2) },
                  { day: "Mar", height: Math.max(0, parseFloat(currentStudent.vitals?.height || 140) - 2), weight: Math.max(0, parseFloat(currentStudent.vitals?.weight || 35) - 1) },
                  { day: "May", height: Math.max(0, parseFloat(currentStudent.vitals?.height || 140) - 1), weight: Math.max(0, parseFloat(currentStudent.vitals?.weight || 35) - 0.5) },
                  { day: "Jul", height: parseFloat(currentStudent.vitals?.height || 140),                  weight: parseFloat(currentStudent.vitals?.weight || 35) },
                ]}
                title="Growth Curve (Height)"
                dataKey="height"
                strokeColor="#8b5cf6"
              />
              <RiskBarChart
                data={[
                  { name: "Activity",   value: 85 },
                  { name: "Sleep",      value: 90 },
                  { name: "Hydration",  value: 70 },
                  { name: "Nutrition",  value: 80 },
                ]}
                title="Wellness Progress"
              />
            </div>
          </>
        )}

        {/* ── Achievements Section ─────────────────────────── */}
        {isAchievements && (
          <div id="achievements" className="grid gap-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="rounded-2xl bg-purple-50 p-2.5 text-purple-600">
                  <Activity size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">AI Wellness Summary</h2>
                  <p className="text-sm text-slate-500">Automated health evaluation</p>
                </div>
              </div>
              <div className="rounded-xl border border-indigo-100 bg-indigo-50/50 p-6 leading-relaxed text-indigo-900">
                {summaryText}
              </div>
            </GlassCard>
          </div>
        )}

        {/* ── Vaccination Section ──────────────────────────── */}
        {isVaccination && (
          <div id="vaccination" className="grid gap-6 lg:grid-cols-2">

            {/* Progress Ring */}
            <GlassCard className="p-6 flex flex-col items-center justify-center">
              <h2 className="text-lg font-bold text-slate-800 self-start mb-6">Vaccination Progress</h2>
              <VaccinationProgressRing
                vaccinations={currentStudent.vaccinations}
                size={180}
                showList={false}
              />
            </GlassCard>

            {/* Completed Records */}
            <VaccinationCard student={currentStudent} />
          </div>
        )}

      </div>
    </DashboardLayout>
  );
}

function InfoCard({ label, value, accent }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue:    "bg-blue-50 text-blue-700",
    amber:   "bg-amber-50 text-amber-700",
    indigo:  "bg-indigo-50 text-indigo-700",
    rose:    "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${styles[accent] || styles.blue}`}>
        {value}
      </p>
    </div>
  );
}

export default StudentDashboard;
