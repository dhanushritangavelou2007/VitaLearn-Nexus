import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StudentTable from "../../components/health/StudentTable";

function Students() {
  return (
    <DashboardLayout>

      <div className="mb-8">

        <h1 className="text-4xl font-bold text-slate-800">
          Students
        </h1>

        <p className="mt-2 text-slate-500">
          Manage Digital Health Passports and monitor student health.
        </p>

      </div>

      <StudentTable />

    </DashboardLayout>
  );
}

export default Students;