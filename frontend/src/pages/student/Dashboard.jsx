import { useLocation } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import GlassCard from "../../components/ui/GlassCard";
import { Activity, HeartPulse, ShieldCheck, Award } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function StudentDashboard() {
  const location = useLocation();
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const student = students.find(s => s.name === "Aarav Sharma") || students[0];
  const stats = calculateDashboardStats();
  
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];
  
  const distributionData = [
    { name: "Healthy", value: stats.riskDistribution?.Healthy || stats.riskDistribution?.healthy || 0 },
    { name: "Observation", value: (stats.riskDistribution?.Moderate || stats.riskDistribution?.moderate || 0) + (stats.riskDistribution?.["High Risk"] || stats.riskDistribution?.high || 0) },
    { name: "Critical", value: stats.critical || 0 },
  ];

  const isAchievements = location.pathname.includes("achievements");
  const isTimeline = location.pathname.includes("timeline");
  const isVaccination = location.pathname.includes("vaccination");
  const isMainDashboard = !isAchievements && !isTimeline && !isVaccination;

  if (loading || !student) {
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
          <h1 className="text-2xl font-bold">Unable to load student dashboard</h1>
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
        <div className="rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Welcome, {student.name}</h1>
          <p className="mt-2 text-emerald-100">Your personal health passport is ready and up to date.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Health Score" value={student.healthScore} subtitle="Current wellness" icon={HeartPulse} color="text-emerald-600" bg="bg-emerald-500" />
          <DashboardCard title="Attendance" value={student.attendance} subtitle="School term" icon={ShieldCheck} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="BMI" value={student.vitals.bmi} subtitle="Healthy range" icon={Activity} color="text-slate-700" bg="bg-slate-700" />
          <DashboardCard title="Achievements" value="4" subtitle="Health milestones" icon={Award} color="text-amber-600" bg="bg-amber-500" />
        </div>

        {isMainDashboard && (
          <div id="passport" className="grid gap-6 xl:grid-cols-12">
            <GlassCard className="xl:col-span-8 p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">My Health Passport</h2>
                  <p className="text-sm text-slate-500">Your current wellness summary</p>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <InfoCard label="Height" value={student.vitals.height} accent="blue" />
                <InfoCard label="Weight" value={student.vitals.weight} accent="emerald" />
                <InfoCard label="BMI" value={student.vitals.bmi} accent="amber" />
                <InfoCard label="Blood Group" value={student.bloodGroup} accent="rose" />
              </div>
            </GlassCard>

            <GlassCard className="xl:col-span-4 p-6 bg-linear-to-br from-indigo-500 to-purple-600 text-white border-0">
              <div className="flex flex-col h-full justify-between">
                <div>
                  <h2 className="text-lg font-bold text-white/90">Health Score</h2>
                  <p className="text-sm text-white/70">Based on recent checkups</p>
                </div>
                <div className="mt-6 flex items-end gap-3">
                  <span className="text-5xl font-bold">{student.healthScore}</span>
                  <span className="mb-1 text-lg font-medium text-white/80">/ 100</span>
                </div>
                <div className="mt-4 rounded-xl bg-white/20 p-3 backdrop-blur-md">
                  <p className="text-sm font-medium">Keep up the good work! Stay hydrated.</p>
                </div>
              </div>
            </GlassCard>
          </div>
        )}

        {isTimeline && (
          <div id="timeline" className="grid gap-6 lg:grid-cols-2">
            <HealthTrendChart data={trendData} title="My Wellness Trend" />
            <HealthDistributionChart data={distributionData} title="Health Distribution" />
          </div>
        )}

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
                {student.aiSummary || "Health summary is being generated by AI..."}
              </div>
            </GlassCard>
          </div>
        )}

        {isVaccination && (
          <div id="vaccination" className="grid gap-6">
            <GlassCard className="p-6">
              <h2 className="text-lg font-bold text-slate-800">Vaccination Records</h2>
              <div className="mt-6 space-y-3">
                {student.vaccinations.map((vac) => (
                  <div key={vac} className="flex items-center gap-3 rounded-2xl border border-emerald-100 bg-emerald-50/50 p-4">
                    <div className="rounded-full bg-emerald-100 p-2 text-emerald-600">
                      <ShieldCheck size={16} />
                    </div>
                    <span className="font-semibold text-emerald-800">{vac}</span>
                  </div>
                ))}
              </div>
            </GlassCard>
          </div>
        )}
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ label, value, accent }) {
  const styles = {
    emerald: "bg-emerald-50 text-emerald-700",
    blue: "bg-blue-50 text-blue-700",
    amber: "bg-amber-50 text-amber-700",
    indigo: "bg-indigo-50 text-indigo-700",
    rose: "bg-rose-50 text-rose-700",
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${styles[accent] || styles.blue}`}>{value}</p>
    </div>
  );
}

export default StudentDashboard;
