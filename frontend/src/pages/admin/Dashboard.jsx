import React, { useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import RiskBarChart from "../../components/charts/RiskBarChart";
import GlassCard from "../../components/ui/GlassCard";
import { Activity, BarChart3, ShieldCheck, Users } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";

function AdminDashboard() {
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const stats = calculateDashboardStats();
  const highRiskCount = students.filter((student) => student.risk === "critical").length;
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

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Teachers" value={stats.teacherCount || 0} subtitle="Active staff members" icon={Users} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="Doctors" value={stats.doctorCount || 0} subtitle="Medical support staff" icon={ShieldCheck} color="text-emerald-600" bg="bg-emerald-500" />
          <DashboardCard title="Students" value={stats.total} subtitle="Monitored passports" icon={Activity} color="text-slate-700" bg="bg-slate-700" />
          <DashboardCard title="Reports" value={stats.reportCount} subtitle={`${highRiskCount} high risk`} icon={BarChart3} color="text-amber-600" bg="bg-amber-500" />
        </div>

        <div className="grid gap-6 xl:grid-cols-12">
          <GlassCard className="xl:col-span-7 p-6">
            <h2 className="text-lg font-bold text-slate-800">School Health Intelligence</h2>
            <div className="mt-6 space-y-4">
              <InsightItem title="Student coverage" description="All classroom health passports are being monitored." />
              <InsightItem title="Risk alerts" description="Follow-up is needed for current high-risk cases." />
              <InsightItem title="Compliance" description="Vaccination and report records are up to date for most students." />
            </div>
          </GlassCard>

          <GlassCard className="xl:col-span-5 p-6">
            <h2 className="text-lg font-bold text-slate-800">Admin Actions</h2>
            <div className="mt-6 space-y-3">
              <ActionCard title="Review teacher assignments" description="Ensure wellness coverage is balanced across classes." />
              <ActionCard title="Escalate urgent cases" description="Coordinate with the medical team for critical follow-up." />
              <ActionCard title="Audit reports" description="Confirm data integrity and recent activity logs." />
            </div>
          </GlassCard>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <HealthTrendChart data={trendData} title="School Health Trend" />
          <HealthDistributionChart data={distributionData} title="Risk Distribution" />
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          <RiskBarChart
            title="Student Distribution"
            data={[
              { name: "Students", value: stats.total },
              { name: "Reports", value: stats.reportCount },
              { name: "Appointments", value: stats.appointments || 0 },
              { name: "Incidents", value: highRiskCount },
            ]}
          />
          <GlassCard className="p-6 flex flex-col max-h-[400px]">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-slate-800">Pending Tasks</h2>
              <button className="text-sm font-semibold text-blue-600 hover:text-blue-700">View All</button>
            </div>
            <div className="space-y-3 overflow-y-auto pr-2">
              <TaskItem id={1} title={`Review ${stats.pendingReports} pending reports`} />
              <TaskItem id={2} title={`Follow up ${highRiskCount} critical cases`} />
              <TaskItem id={3} title={`Monitor ${stats.appointments || 0} scheduled appointments`} />
            </div>
          </GlassCard>
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
