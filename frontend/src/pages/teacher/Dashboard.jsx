import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";

function Dashboard() {
  return (
    <DashboardLayout>

      {/* Welcome Banner */}

      <div className="mb-8 rounded-3xl bg-gradient-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-lg">

        <div className="flex items-center justify-between">

          <div>

            <h1 className="text-4xl font-bold">
              Good Morning, Ms. Priya 👋
            </h1>

            <p className="mt-2 text-blue-100">
              Here's today's classroom health overview.
            </p>

          </div>

          <div className="text-right">

            <p className="text-sm text-blue-100">
              Saturday
            </p>

            <h3 className="text-xl font-semibold">
              Class VIII-A
            </h3>

          </div>

        </div>

      </div>



      {/* Statistics */}

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

        <DashboardCard
          title="Students"
          value="120"
          color="text-blue-600"
        />

        <DashboardCard
          title="Healthy"
          value="96"
          color="text-green-600"
        />

        <DashboardCard
          title="Needs Review"
          value="18"
          color="text-amber-500"
        />

        <DashboardCard
          title="Doctor Attention"
          value="6"
          color="text-red-600"
        />

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;