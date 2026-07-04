import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students from "../../data/students";
import RiskBadge from "../../components/health/RiskBadge";

function StudentProfile() {
  const student = students[0];

  return (
    <DashboardLayout>
      <div className="space-y-8">

        {/* Header */}
        <div className="rounded-3xl bg-white p-8 shadow-md">

          <div className="flex items-center justify-between">

            <div>

              <h1 className="text-4xl font-bold">
                {student.name}
              </h1>

              <p className="mt-2 text-slate-500">
                Digital Health Passport
              </p>

            </div>

            <RiskBadge level={student.risk} />

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}

export default StudentProfile;