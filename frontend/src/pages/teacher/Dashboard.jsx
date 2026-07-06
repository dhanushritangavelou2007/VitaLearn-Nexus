import DashboardLayout from "../../components/dashboard/DashboardLayout";
import HeroSection from "../../components/dashboard/HeroSection";
import AttentionList from "../../components/health/AttentionList";
import QuickActions from "../../components/health/QuickActions";
import RecentActivity from "../../components/health/RecentActivity";
import StudentTable from "../../components/health/StudentTable";
import StatCard from "../../components/ui/StatCard";

import {
  Activity,
  ShieldCheck,
  TriangleAlert,
  Users,
} from "lucide-react";

const stats = [
  {
    title: "Students",
    value: "624",
    description: "Active digital health passports",
    icon: Users,
    accent: "from-blue-600 to-cyan-500",
  },
  {
    title: "Healthy",
    value: "596",
    description: "Students with no follow-up needed",
    icon: ShieldCheck,
    accent: "from-emerald-500 to-green-500",
  },
  {
    title: "Need Review",
    value: "18",
    description: "Students flagged for observation",
    icon: TriangleAlert,
    accent: "from-amber-500 to-orange-500",
  },
  {
    title: "Reports Today",
    value: "24",
    description: "New symptoms or wellness notes",
    icon: Activity,
    accent: "from-teal-500 to-cyan-500",
  },
];

function Dashboard() {
  return (
    <DashboardLayout>

      {/* Hero Section */}
      <HeroSection />

      {/* Statistics */}
      <div className="mt-8 grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {stats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description}
            icon={stat.icon}
            accent={stat.accent}
          />
        ))}
      </div>

      {/* Quick Actions */}
      <div className="mt-8">
        <QuickActions />
      </div>

      {/* Student Table */}
      <div className="mt-8">
        <StudentTable />
      </div>

      {/* Bottom Section */}
      <div className="mt-8 grid gap-6 lg:grid-cols-2">
        <AttentionList />
        <RecentActivity />
      </div>

    </DashboardLayout>
  );
}

export default Dashboard;