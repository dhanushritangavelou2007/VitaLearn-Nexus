import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import StudentTable from "../../components/dashboard/StudentTable";
import AIInsights from "../../components/dashboard/AIInsights";
import QuickActions from "../../components/dashboard/QuickActions";
import { Users, Activity, HeartPulse, Stethoscope } from "lucide-react";
import students, { getDashboardStats, getRecentActivity } from "../../data/students";

function Dashboard() {
  const stats = getDashboardStats(students);
  const recentActivity = getRecentActivity(students);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Welcome Banner */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 md:p-10 text-white shadow-lg border border-blue-500/50">
          <div className="absolute right-0 top-0 h-64 w-64 -translate-y-1/2 translate-x-1/3 rounded-full bg-white opacity-10 blur-3xl"></div>
          <div className="absolute bottom-0 left-0 h-48 w-48 translate-y-1/3 -translate-x-1/4 rounded-full bg-blue-300 opacity-20 blur-2xl"></div>
          
          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold tracking-tight mb-2">
                Good Morning, Ms. Priya 👋
              </h1>
              <p className="text-blue-100 text-lg md:text-xl font-medium max-w-xl">
                Classroom health overview looks good today. Let's keep the students healthy and safe.
              </p>
            </div>
            
            <div className="flex flex-col items-start md:items-end bg-white/10 backdrop-blur-md rounded-2xl p-4 border border-white/20 shadow-inner">
              <p className="text-sm text-blue-100 font-medium uppercase tracking-wider mb-1">
                Today
              </p>
              <h3 className="text-2xl font-bold tracking-tight">
                Class VIII-A
              </h3>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title="Total Students"
            value={stats.total}
            subtitle="Centralized records"
            icon={Users}
            color="text-emerald-500"
            bg="bg-blue-600"
          />
          <DashboardCard
            title="Healthy"
            value={stats.healthy}
            subtitle={`${stats.healthyPercent}% of class`}
            icon={HeartPulse}
            color="text-slate-500"
            bg="bg-emerald-500"
          />
          <DashboardCard
            title="Needs Review"
            value={stats.needReview}
            subtitle="Observation, review, critical"
            icon={Activity}
            color="text-emerald-500"
            bg="bg-amber-500"
          />
          <DashboardCard
            title="Doctor Attention"
            value={stats.doctorAttention}
            subtitle={`${stats.reportsToday} updated today`}
            icon={Stethoscope}
            color="text-red-500"
            bg="bg-red-500"
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid gap-6 lg:grid-cols-12 items-stretch">
          {/* Left Column - Student Table */}
          <div className="lg:col-span-8">
            <StudentTable students={students} />
          </div>

          {/* Right Column - AI Insights & Quick Actions */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            <div className="flex-1">
              <AIInsights stats={stats} recentActivity={recentActivity} />
            </div>
            <div className="flex-1">
              <QuickActions />
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Dashboard;
