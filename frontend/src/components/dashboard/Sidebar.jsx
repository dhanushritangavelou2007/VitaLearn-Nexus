import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
} from "lucide-react";

function Sidebar() {
  return (
    <aside className="w-64 min-h-screen bg-blue-700 text-white p-6">

      <h1 className="text-2xl font-bold mb-10">
        VitaLearn Nexus
      </h1>

      <nav className="space-y-4">

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-600 transition">
          <LayoutDashboard size={22} />
          Dashboard
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-600 transition">
          <Users size={22} />
          Students
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-600 transition">
          <Activity size={22} />
          Symptoms
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-600 transition">
          <FileText size={22} />
          Reports
        </button>

        <button className="flex w-full items-center gap-3 rounded-lg px-4 py-3 hover:bg-blue-600 transition">
          <Settings size={22} />
          Settings
        </button>

      </nav>

    </aside>
  );
}

export default Sidebar;