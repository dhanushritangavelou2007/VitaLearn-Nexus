import React from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import RiskBarChart from "../../components/charts/RiskBarChart";
import GlassCard from "../../components/ui/GlassCard";
import { Activity, BarChart3, ShieldCheck, Users, Heart, AlertCircle, Calendar } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { Link } from "react-router-dom";

function AdminDashboard() {
  const { calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const stats = calculateDashboardStats();
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];


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
          <h1 className="text-2xl font-bold">Unable to load admin dashboard</h1>
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
        <div className="rounded-3xl bg-linear-to-r from-slate-800 via-slate-700 to-blue-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">School Administration Center</h1>
          <p className="mt-2 text-slate-200">Monitor the school’s health ecosystem, staff coverage, and student wellness trends.</p>
        </div>

        {/* Top KPIs */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
          <DashboardCard title="Total Students" value={stats.total} subtitle="Enrolled" icon={Users} color="text-slate-700" bg="bg-slate-700" />
          <DashboardCard title="Teachers" value={stats.teacherCount || 0} subtitle="Staff members" icon={Users} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="Doctors" value={stats.doctorCount || 0} subtitle="Medical staff" icon={ShieldCheck} color="text-emerald-600" bg="bg-emerald-500" />
          <DashboardCard title="Parents" value={stats.parentCount || 0} subtitle="Active accounts" icon={Users} color="text-indigo-600" bg="bg-indigo-500" />
          <DashboardCard title="Appointments" value={stats.appointments || 0} subtitle="Scheduled" icon={Calendar} color="text-purple-600" bg="bg-purple-500" />
        </div>

        {/* Health Stats */}
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Healthy" value={stats.healthy} subtitle="No issues" icon={Heart} color="text-emerald-500" bg="bg-emerald-500" />
          <DashboardCard title="Moderate" value={stats.moderate} subtitle="Observation" icon={Activity} color="text-blue-500" bg="bg-blue-500" />
          <DashboardCard title="Critical" value={stats.critical} subtitle="Doctor Attention" icon={AlertCircle} color="text-red-500" bg="bg-red-500" />
          <DashboardCard title="Pending Reports" value={stats.pendingReports} subtitle="Needs review" icon={BarChart3} color="text-amber-500" bg="bg-amber-500" />
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <GlassCard className="xl:col-span-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">School Analytics</h2>
              <Link to="/students" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Details</Link>
            </div>
            <div className="mt-2 space-y-4">
              <InsightItem title="Average Attendance" description={`${stats.averageAttendance || 95}% across all classes`} />
              <InsightItem title="Average BMI" description={`${stats.averageBmi || 20} (Healthy range)`} />
              <InsightItem title="Average Health Score" description={`${stats.averageHealthScore}/100`} />
              <InsightItem title="Vaccination Coverage" description={`${stats.pendingVaccinations} pending mandatory vaccinations`} />
            </div>
          </GlassCard>

          <GlassCard className="xl:col-span-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Department Analytics</h2>
              <Link to="/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700">View Details</Link>
            </div>
            <div className="mt-2 space-y-3">
              <ActionCard title="Science Department" description={`${stats.averageHealthScore}% avg score. ${stats.critical} critical cases.`} />
              <ActionCard title="Commerce Department" description={`${Math.max(0, stats.averageHealthScore - 2)}% avg score. ${stats.pendingReports} pending reports.`} />
              <ActionCard title="Arts Department" description={`${Math.min(100, stats.averageHealthScore + 1)}% avg score. ${stats.observation || 2} moderate risk.`} />
            </div>
          </GlassCard>

          <GlassCard className="xl:col-span-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Pending Follow-ups</h2>
              <Link to="/reports" className="text-sm font-semibold text-blue-600 hover:text-blue-700">Manage</Link>
            </div>
            <div className="mt-2 space-y-3">
              <TaskItem title="Approve Medical Leave for Aryan Gupta" />
              <TaskItem title="Review new health policy from Dr. Smith" />
              <TaskItem title="Schedule vaccination drive next week" />
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-3 mb-6">
          <div className="lg:col-span-2">
            <HealthTrendChart data={trendData} title="Monthly Reports Trend" />
          </div>
          <div className="lg:col-span-1">
            <HealthDistributionChart 
              data={[
                { name: "Healthy", value: stats.riskDistribution.healthy },
                { name: "Moderate", value: stats.riskDistribution.moderate },
                { name: "High", value: stats.riskDistribution.high },
                { name: "Critical", value: stats.riskDistribution.critical },
              ]} 
              title="Health Distribution" 
            />
          </div>
        </div>
        <div className="grid gap-6 lg:grid-cols-1">
          <RiskBarChart 
            data={[
              { name: "Healthy", value: stats.riskDistribution.healthy },
              { name: "Moderate", value: stats.riskDistribution.moderate },
              { name: "High", value: stats.riskDistribution.high },
              { name: "Critical", value: stats.riskDistribution.critical },
            ]}
            title="Risk Distribution"
          />
        </div>
      </div>
    </DashboardLayout>
  );
}

function TaskItem({ title }) {
  const [status, setStatus] = React.useState("pending");

  if (status === "completed") {
    return (
      <div className="rounded-2xl border border-emerald-100 bg-emerald-50 p-4 text-sm text-emerald-600 flex justify-between items-center">
        <span className="line-through">{title}</span>
        <span className="font-semibold">Completed</span>
      </div>
    );
  }

  if (status === "rejected") {
    return (
      <div className="rounded-2xl border border-rose-100 bg-rose-50 p-4 text-sm text-rose-600 flex justify-between items-center">
        <span className="line-through">{title}</span>
        <span className="font-semibold">Rejected</span>
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-sm text-slate-600 mb-3">{title}</p>
      <div className="flex gap-2">
        <button onClick={() => setStatus("completed")} className="rounded-lg bg-emerald-100 px-3 py-1 text-xs font-semibold text-emerald-700 hover:bg-emerald-200">Approve</button>
        <button onClick={() => setStatus("rejected")} className="rounded-lg bg-rose-100 px-3 py-1 text-xs font-semibold text-rose-700 hover:bg-rose-200">Reject</button>
        <button onClick={() => setStatus("completed")} className="rounded-lg bg-slate-200 px-3 py-1 text-xs font-semibold text-slate-700 hover:bg-slate-300">Mark Complete</button>
      </div>
    </div>
  );
}

function InsightItem({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

function ActionCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default AdminDashboard;
