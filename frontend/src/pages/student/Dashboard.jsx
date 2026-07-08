import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import CircularProgress from "../../components/charts/CircularProgress";
import GlassCard from "../../components/ui/GlassCard";
import { Activity, HeartPulse, ShieldCheck, Syringe, Award } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function StudentDashboard() {
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const student = students[0];
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
    { name: "Healthy", value: stats.healthy },
    { name: "Review", value: stats.needReview - stats.critical },
    { name: "Critical", value: stats.critical },
  ];

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

        <div className="grid gap-6 xl:grid-cols-12">
          <GlassCard className="xl:col-span-7 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <HeartPulse size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Digital Passport</h2>
                <p className="text-sm text-slate-500">Current wellness overview</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Health Status" value="Healthy" accent="emerald" />
              <InfoCard label="Attendance" value={student.attendance} accent="blue" />
              <InfoCard label="Allergies" value={student.allergies[0] || "None"} accent="amber" />
              <InfoCard label="Vaccinations" value={`${student.vaccinations.length} completed`} accent="indigo" />
            </div>
          </GlassCard>

          <GlassCard className="xl:col-span-5 p-6">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Wellness Tips</h2>
                <p className="text-sm text-slate-500">Helpful reminders for today</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <ReminderCard title="Hydration" description="Carry water and stay hydrated." />
              <ReminderCard title="Medication" description="Bring your inhaler if required." />
              <ReminderCard title="Check-in" description="Report symptoms early to the school nurse." />
            </div>
          </GlassCard>
        </div>

        <GlassCard className="p-6">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-cyan-50 p-2.5 text-cyan-600">
              <Syringe size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Vaccination Record</h2>
              <p className="text-sm text-slate-500">Your completed immunizations</p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {student.vaccinations.map((item) => (
              <span key={item} className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1.5 text-sm font-semibold text-emerald-700">
                {item}
              </span>
            ))}
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-3">
          <HealthTrendChart data={trendData} title="Wellness Trend" />
          <HealthDistributionChart data={distributionData} title="Health Distribution" />
          <HealthAreaChart
            title="Mental Wellness"
            data={trendData.map((item, index) => ({ day: item.day, value: Math.max(0, Math.min(100, item.healthy - index + 8)) }))}
          />
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Daily Water Tracker</h2>
            <div className="mt-6 flex justify-center">
              <CircularProgress value={Math.min(100, Math.round(stats.averageHealthScore + 10))} label="Hydration" />
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Sleep Tracker</h2>
            <div className="mt-6 flex justify-center">
              <CircularProgress value={82} label="Sleep Quality" />
            </div>
          </GlassCard>
          <GlassCard className="p-6">
            <h2 className="text-lg font-bold text-slate-800">Exercise Tracker</h2>
            <div className="mt-6 flex justify-center">
              <CircularProgress value={74} label="Activity" />
            </div>
          </GlassCard>
        </div>
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
  };

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm font-medium text-slate-500">{label}</p>
      <p className={`mt-2 inline-flex rounded-full px-2.5 py-1 text-sm font-semibold ${styles[accent]}`}>{value}</p>
    </div>
  );
}

function ReminderCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-cyan-500" />
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default StudentDashboard;
