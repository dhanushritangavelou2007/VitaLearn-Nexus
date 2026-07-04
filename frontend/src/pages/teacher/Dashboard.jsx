import DashboardLayout from "../../components/dashboard/DashboardLayout";
import DashboardCard from "../../components/dashboard/DashboardCard";
import AttentionList from "../../components/health/AttentionList";
import QuickActions from "../../components/health/QuickActions";
import RecentActivity from "../../components/health/RecentActivity";
import HeroSection from "../../components/dashboard/HeroSection";
import {
  Users,
  ShieldCheck,
  TriangleAlert,
  Activity,
} from "lucide-react";
function Dashboard() {
  return (
    <DashboardLayout>
        <HeroSection />

      {/* Welcome Banner */}

      <div className="mb-8 rounded-3xl bg-linear-to-r from-blue-600 to-cyan-500 p-8 text-white shadow-lg">

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
     

      <QuickActions />

     <div className="mt-8 grid gap-6 lg:grid-cols-2">
  <AttentionList />
  <RecentActivity />
</div>

      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">

       <DashboardCard
  title="Students"
  value="120"
  color="text-blue-600"
  icon={Users}
/>

<DashboardCard
  title="Healthy"
  value="96"
  color="text-emerald-600"
  icon={ShieldCheck}
/>

<DashboardCard
  title="Need Review"
  value="18"
  color="text-amber-500"
  icon={TriangleAlert}
/>

<DashboardCard
  title="Reports Today"
  value="24"
  color="text-teal-600"
  icon={Activity}
/>
        <div className="mt-8 grid gap-6 lg:grid-cols-2">
  <AttentionList />
  <RecentActivity />
</div>

      </div>

    </DashboardLayout>
  );
}

export default Dashboard;