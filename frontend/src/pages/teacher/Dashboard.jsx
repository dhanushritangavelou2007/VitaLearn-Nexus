import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StudentTable from "../../components/health/StudentTable";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/health/QuickActions";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import { Users, Activity, HeartPulse, Stethoscope } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function Dashboard() {
  const { students, calculateDashboardStats } = useStudents();
  const stats = calculateDashboardStats();
  const recentActivity = getRecentActivity(students);

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6">
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 shadow-lg border border-blue-500/50">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white opacity-10 blur-3xl" />
          <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/3 -translate-x-1/4 rounded-full bg-blue-300 opacity-20 blur-2xl" />

          <div className="relative z-10 flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
            <div>
              <h1 className="mb-2 text-3xl font-bold tracking-tight text-slate-950 md:text-4xl">
                Good Morning, Ms. Priya
              </h1>
              <p className="max-w-xl text-lg font-medium text-slate-700 md:text-xl">
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
            title="Total Students"
            value={stats.total}
            subtitle={`${stats.averageAttendance}% avg attendance`}
            icon={Users}
            color="text-emerald-500"
            bg="bg-blue-600"
          />
          <DashboardCard
            title="Healthy"
            value={stats.healthy}
            subtitle={`${stats.averageHealthScore}/100 avg health score`}
            icon={HeartPulse}
            color="text-slate-500"
            bg="bg-emerald-500"
          />
          <DashboardCard
            title="Needs Review"
            value={stats.needReview}
            subtitle={`Avg BMI ${stats.averageBMI}`}
            icon={Activity}
            color="text-emerald-500"
            bg="bg-amber-500"
          />
          <DashboardCard
            title="Doctor Attention"
            value={stats.critical}
            subtitle={`${stats.pendingReports} pending reports`}
            icon={Stethoscope}
            color="text-red-500"
            bg="bg-red-500"
          />
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

        <div className="grid gap-6 lg:grid-cols-2">
          <HealthTrendChart />
          <HealthDistributionChart />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;

