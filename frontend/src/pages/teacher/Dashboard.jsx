import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StudentTable from "../../components/health/StudentTable";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/health/QuickActions";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import RiskBarChart from "../../components/charts/RiskBarChart";
import HealthAreaChart from "../../components/charts/HealthAreaChart";
import { Users, Activity, HeartPulse, Stethoscope } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function Dashboard() {
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const stats = calculateDashboardStats();
  const recentActivity = getRecentActivity(students);
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

  const bmiTrendData = [
    { day: "Mon", bmi: stats.averageBMI },
    { day: "Tue", bmi: Math.max(0, stats.averageBMI - 0.1) },
    { day: "Wed", bmi: stats.averageBMI },
    { day: "Thu", bmi: Math.round((stats.averageBMI + 0.2)*10)/10 },
    { day: "Fri", bmi: stats.averageBMI },
    { day: "Sat", bmi: stats.averageBMI },
  ];

  const attendanceTrendData = [
    { day: "Mon", attendance: Math.max(0, stats.averageAttendance - 2) },
    { day: "Tue", attendance: Math.min(100, stats.averageAttendance + 1) },
    { day: "Wed", attendance: stats.averageAttendance },
    { day: "Thu", attendance: Math.max(0, stats.averageAttendance - 1) },
    { day: "Fri", attendance: Math.min(100, stats.averageAttendance + 2) },
    { day: "Sat", attendance: 100 },
  ];

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {Array.from({ length: 4 }).map((_, index) => (
              <div key={index} className="h-36 animate-pulse rounded-3xl bg-slate-200/70" />
            ))}
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load dashboard</h1>
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
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 shadow-lg border border-blue-500/50">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/3 -translate-x-1/4 rounded-full bg-blue-300 opacity-20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-white md:text-4xl">
                Good Morning, Ms. Priya
              </h1>
              <p className="max-w-xl text-lg font-medium text-indigo-100 md:text-xl">
                Classroom health overview looks good today. Let's keep the students healthy and safe.
              </p>
            </div>

            <div className="flex flex-col items-start rounded-2xl border border-white/60 bg-white/80 p-4 text-slate-900 shadow-inner backdrop-blur-md md:items-end">
              <p className="mb-1 text-sm font-medium uppercase tracking-wider text-slate-500">Today</p>
              <h3 className="text-2xl font-bold tracking-tight">Class VIII-A</h3>
            </div>
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard
            title="Class Strength"
            value={stats.total}
            subtitle={`${stats.averageAttendance}% avg attendance`}
            icon={Users}
            color="text-emerald-500"
            bg="bg-blue-600"
          />
          <DashboardCard
            title="Healthy Students"
            value={stats.healthy}
            subtitle={`${stats.averageHealthScore}/100 avg health score`}
            icon={HeartPulse}
            color="text-slate-500"
            bg="bg-emerald-500"
          />
          <DashboardCard
            title="Need Observation"
            value={stats.moderate}
            subtitle="Monitor closely"
            icon={Activity}
            color="text-emerald-500"
            bg="bg-amber-500"
          />
          <DashboardCard
            title="Critical Students"
            value={stats.critical}
            subtitle={`${stats.pendingReports} pending reports`}
            icon={Stethoscope}
            color="text-red-500"
            bg="bg-red-500"
          />
        </div>

        <div className="grid gap-4 sm:grid-cols-3">
          <DashboardCard title="Attendance" value={`${stats.averageAttendance}%`} subtitle="Class average" icon={Users} color="text-slate-600" bg="bg-slate-500" />
          <DashboardCard title="Today's Reports" value={stats.reportsToday} subtitle="Recently updated" icon={Activity} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="Teacher Alerts" value={stats.needReview} subtitle="Action required" icon={HeartPulse} color="text-amber-600" bg="bg-amber-500" />
        </div>

        <div className="grid gap-6 xl:grid-cols-12 items-stretch">
          <div className="xl:col-span-8">
            <StudentTable students={students} />
          </div>

          <div className="xl:col-span-4 flex flex-col gap-6">
            <AIInsights stats={stats} recentActivity={recentActivity} />
            <QuickActions />
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-2 mb-6">
          <HealthTrendChart data={attendanceTrendData} title="Attendance Trend" dataKey="attendance" strokeColor="#10b981" />
          <RiskBarChart 
            data={[
              { name: "Healthy", value: stats.healthy },
              { name: "Observation", value: stats.moderate },
              { name: "Review", value: stats.needReview },
              { name: "Critical", value: stats.critical },
            ]} 
            title="Class Health (Student Count)" 
          />
        </div>
        
        <div className="grid gap-6 lg:grid-cols-2">
          <HealthAreaChart 
            data={[
              { day: "Week 1", value: stats.averageBMI - 0.2 },
              { day: "Week 2", value: stats.averageBMI - 0.1 },
              { day: "Week 3", value: stats.averageBMI },
              { day: "Week 4", value: stats.averageBMI + 0.1 },
            ]}
            title="Class BMI Trend"
          />
          <HealthDistributionChart 
            data={[
              { name: "Completed", value: Math.max(0, stats.total - (stats.pendingVaccinations || 0)) },
              { name: "Pending", value: stats.pendingVaccinations || 0 },
            ]}
            title="Vaccination Coverage"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
