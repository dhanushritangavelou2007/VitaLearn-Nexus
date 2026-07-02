import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";

function TeacherDashboard() {
  return (
    <DashboardLayout>

      <h1 className="mb-8 text-3xl font-bold">
        Teacher Dashboard
      </h1>

      {/* Statistics */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">

        <DashboardCard
          title="Students"
          value="325"
          color="text-blue-600"
        />

        <DashboardCard
          title="Pending Symptoms"
          value="18"
          color="text-red-600"
        />

        <DashboardCard
          title="Health Reports"
          value="45"
          color="text-green-600"
        />

        <DashboardCard
          title="Attendance"
          value="96%"
          color="text-purple-600"
        />

      </div>

      {/* Quick Actions */}
      <div className="mt-10 rounded-2xl bg-white p-8 shadow-md">

        <h2 className="text-2xl font-bold">
          Quick Actions
        </h2>

        <div className="mt-6 flex flex-wrap gap-4">

          <button className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white hover:bg-blue-700">
            Add Student
          </button>

          <button className="rounded-xl bg-red-500 px-6 py-3 font-semibold text-white hover:bg-red-600">
            Report Symptom
          </button>

          <button className="rounded-xl bg-green-600 px-6 py-3 font-semibold text-white hover:bg-green-700">
            View Reports
          </button>

        </div>

      </div>

    </DashboardLayout>
  );
}

export default TeacherDashboard;