import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students from "../../data/students";
import { Activity, BarChart3, ShieldCheck, Users } from "lucide-react";

function AdminDashboard() {
  const activeStudents = students.length;
  const highRiskCount = students.filter((student) => student.risk === "critical").length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-linear-to-r from-slate-800 via-slate-700 to-blue-700 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">School Administration Center</h1>
          <p className="mt-2 text-slate-200">Monitor the school’s health ecosystem, staff coverage, and student wellness trends.</p>
        </div>

        <div className="grid gap-6 md:grid-cols-3">
          <StatCard label="Active Students" value={activeStudents} icon={Users} accent="blue" />
          <StatCard label="High Risk Cases" value={highRiskCount} icon={ShieldCheck} accent="red" />
          <StatCard label="System Alerts" value="6" icon={Activity} accent="amber" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <BarChart3 size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">School Health Overview</h2>
                <p className="text-sm text-slate-500">Operational insights across the school</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              <InsightItem title="Student coverage" description="All classroom health passports are being monitored." />
              <InsightItem title="Risk alerts" description="Follow-up is needed for the current high-risk cases." />
              <InsightItem title="Compliance" description="Vaccination and report records are up to date for most students." />
            </div>
          </section>

          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Admin Actions</h2>
                <p className="text-sm text-slate-500">Priority management tasks</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <ActionCard title="Review teacher assignments" description="Ensure wellness coverage is balanced across classes." />
              <ActionCard title="Escalate urgent cases" description="Coordinate with the medical team for critical follow-up." />
              <ActionCard title="Audit reports" description="Confirm data integrity and recent activity logs." />
            </div>
          </section>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StatCard({ label, value, icon: Icon, accent }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    red: "bg-red-50 text-red-700",
    amber: "bg-amber-50 text-amber-700",
  };

  return (
    <div className="rounded-3xl border border-white bg-white/70 p-5 shadow-sm backdrop-blur-xl">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-slate-500">{label}</p>
          <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
        </div>
        <div className={`rounded-2xl p-3 ${styles[accent]}`}>
          <Icon size={20} />
        </div>
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
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-slate-500" />
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default AdminDashboard;
