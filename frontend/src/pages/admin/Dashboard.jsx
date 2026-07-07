import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import GlassCard from "../../components/ui/GlassCard";
import students, { getDashboardStats } from "../../data/students";
import { Activity, BarChart3, ShieldCheck, Users } from "lucide-react";

function AdminDashboard() {
  const stats = getDashboardStats(students);
  const highRiskCount = students.filter((student) => student.risk === "critical").length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-linear-to-r from-slate-800 via-slate-700 to-blue-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">School Administration Center</h1>
          <p className="mt-2 text-slate-200">Monitor the school’s health ecosystem, staff coverage, and student wellness trends.</p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
          <DashboardCard title="Teachers" value="24" subtitle="Active staff members" icon={Users} color="text-blue-600" bg="bg-blue-500" />
          <DashboardCard title="Doctors" value="4" subtitle="Medical support staff" icon={ShieldCheck} color="text-emerald-600" bg="bg-emerald-500" />
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
          <HealthTrendChart />
          <HealthDistributionChart />
        </div>
      </div>
    </DashboardLayout>
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

