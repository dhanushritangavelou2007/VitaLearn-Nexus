import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students from "../../data/students";
import { Activity, ClipboardList, HeartPulse, ShieldCheck } from "lucide-react";

function DoctorDashboard() {
  const highRiskStudents = students.filter((student) => student.risk === "critical" || student.risk === "review");

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-7xl space-y-6 pb-10">
        <div className="rounded-3xl bg-gradient-to-r from-rose-600 via-red-600 to-orange-500 p-8 text-white shadow-lg">
          <h1 className="text-3xl font-bold">Doctor Review Center</h1>
          <p className="mt-2 text-red-100">Monitor urgent health cases, review notes, and approve school follow-ups.</p>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-red-50 p-2.5 text-red-600">
                <HeartPulse size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Priority Cases</h2>
                <p className="text-sm text-slate-500">Students needing medical review</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              {highRiskStudents.map((student) => (
                <div key={student.id} className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
                  <div className="flex items-center justify-between gap-3">
                    <div>
                      <h3 className="font-semibold text-slate-700">{student.name}</h3>
                      <p className="text-sm text-slate-500">{student.rollNo} • {student.medicalConditions[0] || "Review required"}</p>
                    </div>
                    <span className="rounded-full bg-red-100 px-3 py-1 text-sm font-semibold text-red-700">{student.risk}</span>
                  </div>
                </div>
              ))}
            </div>
          </section>

          <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center gap-3">
              <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                <ClipboardList size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Doctor Actions</h2>
                <p className="text-sm text-slate-500">Review and approve observations</p>
              </div>
            </div>
            <div className="mt-6 space-y-3">
              <ActionCard title="Review symptoms" description="Assess newly reported student observations." />
              <ActionCard title="Approve reports" description="Verify and sign doctor notes for release." />
              <ActionCard title="Follow-up plan" description="Create recommended actions for school staff." />
            </div>
          </section>
        </div>

        <section className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <ShieldCheck size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Clinical Summary</h2>
              <p className="text-sm text-slate-500">Daily overview for school medical support</p>
            </div>
          </div>
          <div className="mt-6 rounded-2xl border border-slate-100 bg-slate-50 p-4 text-sm text-slate-600">
            There are {highRiskStudents.length} current cases requiring attention. Review the latest reports and confirm any necessary interventions.
          </div>
        </section>
      </div>
    </DashboardLayout>
  );
}

function ActionCard({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <div className="flex items-center gap-2">
        <Activity size={16} className="text-rose-500" />
        <h3 className="font-semibold text-slate-700">{title}</h3>
      </div>
      <p className="mt-2 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default DoctorDashboard;
