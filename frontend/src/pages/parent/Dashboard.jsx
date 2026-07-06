import { Link } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students from "../../data/students";
import { Activity, Bell, HeartPulse, ShieldCheck } from "lucide-react";

function ParentDashboard() {
  const child = students[0];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-linear-to-r from-blue-600 via-indigo-600 to-purple-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Hello, {child.parent.name}</h1>
          <p className="mt-2 text-blue-100">Your child’s health updates are now visible in one secure place.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <HeartPulse size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Child Health Snapshot</h2>
                <p className="text-sm text-slate-500">Latest wellness summary for {child.name}</p>
              </div>
            </div>

            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Risk Status" value="Observation" accent="blue" />
              <InfoCard label="Attendance" value={child.attendance} accent="emerald" />
              <InfoCard label="Last Update" value={child.lastUpdate} accent="amber" />
              <InfoCard label="Vaccinations" value={`${child.vaccinations.length} recorded`} accent="indigo" />
            </div>
          </section>

          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Bell size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Notifications</h2>
                <p className="text-sm text-slate-500">Recent updates from school</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <NotificationItem title="Symptom note added" description="Observed mild cough during the day." />
              <NotificationItem title="Vaccination reminder" description="Upcoming immunization due next week." />
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">AI Suggestions</h2>
              <p className="text-sm text-slate-500">Helpful guidance based on the latest health record</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            Keep a water bottle available and ensure a healthy breakfast before school. A short rest after classes may help if symptoms continue.
          </div>
          <div className="mt-4">
            <Link to="/teacher/student-profile/1" className="text-sm font-semibold text-blue-600 hover:underline">
              View full passport →
            </Link>
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function InfoCard({ label, value, accent }) {
  const styles = {
    blue: "bg-blue-50 text-blue-700",
    emerald: "bg-emerald-50 text-emerald-700",
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

function NotificationItem({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-blue-500" />
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default ParentDashboard;
