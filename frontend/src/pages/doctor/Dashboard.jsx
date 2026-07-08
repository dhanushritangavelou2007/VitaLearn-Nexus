import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import CircularProgress from "../../components/charts/CircularProgress";
import GlassCard from "../../components/ui/GlassCard";
import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Activity, ClipboardList, HeartPulse, ShieldCheck, AlertTriangle } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function DoctorDashboard() {
  const location = useLocation();
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const criticalStudents = students.filter((student) => student.risk === "critical");
  const reviewStudents = students.filter((student) => student.risk === "high" || student.risk === "critical");
  const stats = calculateDashboardStats();
  const recentActivity = getRecentActivity(students, 6);
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];
  const distributionData = [
    { name: "Healthy", value: stats.healthy },
    { name: "Moderate", value: stats.riskDistribution?.moderate || 0 },
    { name: "High", value: stats.riskDistribution?.high || 0 },
    { name: "Critical", value: stats.critical },
  ];

  useEffect(() => {
    const hash = location.hash?.replace("#", "");
    if (!hash) return;
    document.getElementById(hash)?.scrollIntoView({ behavior: "smooth", block: "start" });
  }, [location.hash]);

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
        <div className="rounded-3xl bg-linear-to-r from-rose-600 via-red-600 to-orange-500 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Doctor Review Center</h1>
          <p className="mt-2 text-red-100">Monitor urgent health cases, review notes, and approve school follow-ups.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Critical Students" value={criticalStudents.length} subtitle="Immediate medical attention" icon={AlertTriangle} color="text-red-600" bg="bg-red-500" />
          <DashboardCard title="Diagnosis Queue" value={reviewStudents.length} subtitle="Waiting for clinical review" icon={ClipboardList} color="text-amber-600" bg="bg-amber-500" />
          <DashboardCard title="Medical Reports" value={stats.reportCount} subtitle="Student files in system" icon={HeartPulse} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="AI Alerts" value={stats.pendingReports} subtitle="Needs follow-up" icon={Activity} color="text-slate-600" bg="bg-slate-700" />
        </div>

        <div id="patients" className="grid gap-6 xl:grid-cols-12">
          <GlassCard className="xl:col-span-5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-rose-50 p-2.5 text-rose-600">
                <HeartPulse size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Today's Patients</h2>
                <p className="text-sm text-slate-500">Students needing medical review</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {reviewStudents.slice(0, 5).map((student) => (
                <div key={student.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-700">{student.name}</h3>
                      <p className="text-sm text-slate-500">{student.rollNo} • {student.medicalConditions[0] || "Review required"}</p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">{student.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </GlassCard>

          <GlassCard id="diagnosis" className="xl:col-span-3 p-6">
            <h2 className="text-lg font-bold text-slate-800">Diagnosis Queue</h2>
            <div className="mt-6 space-y-3">
              {["Assign review", "Update notes", "Notify guardian"].map((item) => (
                <div key={item} className="rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">{item}</div>
              ))}
            </div>
          </GlassCard>

          <GlassCard className="xl:col-span-4 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">AI Suggestions</h2>
                <p className="text-sm text-slate-500">Decision support for follow-up</p>
              </div>
            </div>
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              Review recent symptom entries, prioritize breathing concerns, and coordinate with guardians before the next school session.
            </div>
            <div className="mt-4 space-y-3">
              {recentActivity.slice(0, 3).map((item) => (
                <div key={item.id} className="rounded-2xl border border-slate-100 bg-white p-4">
                  <div className="text-sm font-semibold text-slate-700">{item.studentName}</div>
                  <div className="text-xs text-slate-500">{item.title} - {item.description}</div>
                </div>
              ))}
            </div>
          </GlassCard>
        </div>

        <div id="appointments" className="grid gap-6 lg:grid-cols-3">
          <HealthTrendChart data={trendData} title="Health Score Trend" />
          <HealthDistributionChart data={distributionData} title="Risk Distribution" />
          <HealthAreaChart
            title="Disease Trends"
            data={trendData.map((item, index) => ({ day: item.day, value: Math.max(0, item.healthy - index) }))}
          />
        </div>

        <div id="critical" className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Vaccination Status</h2>
            <div className="mt-6 flex justify-center">
              <CircularProgress value={Math.round((stats.healthyPercent || 0) + 12)} label="Vaccination Coverage" />
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Department Analytics</h2>
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              Pediatrics and triage queues are prioritized based on critical risk alerts and follow-up activity.
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Pending Follow-ups</h2>
            <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm leading-7 text-slate-600">
              {stats.pendingReports} reports require review or guardian follow-up this cycle.
            </div>
          </GlassCard>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default DoctorDashboard;
