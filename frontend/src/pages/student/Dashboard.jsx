import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students from "../../data/students";
import { Activity, HeartPulse, ShieldCheck, Syringe } from "lucide-react";

function StudentDashboard() {
  const student = students[1];

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-linear-to-r from-emerald-600 via-teal-600 to-cyan-600 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Welcome, {student.name}</h1>
          <p className="mt-2 text-emerald-100">Your personal health passport is ready and up to date.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
                <HeartPulse size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">My Health Passport</h2>
                <p className="text-sm text-slate-500">Current wellness overview</p>
              </div>
            </div>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <InfoCard label="Health Status" value="Healthy" accent="emerald" />
              <InfoCard label="Attendance" value={student.attendance} accent="blue" />
              <InfoCard label="Allergies" value={student.allergies[0] || "None"} accent="amber" />
              <InfoCard label="Vaccinations" value={`${student.vaccinations.length} completed`} accent="indigo" />
            </div>
          </section>

          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-indigo-50 p-2.5 text-indigo-600">
                <ShieldCheck size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Student Guidance</h2>
                <p className="text-sm text-slate-500">Helpful reminders for the day</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <ReminderCard title="Hydration" description="Carry water and stay hydrated." />
              <ReminderCard title="Medication" description="Bring your inhaler if required." />
              <ReminderCard title="Check-in" description="Report symptoms early to the school nurse." />
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
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
        </section>
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
