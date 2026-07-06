import {
  LayoutDashboard,
  Users,
  FilePlus2,
  Activity,
  Sparkles,
  HeartPulse,
} from "lucide-react";
import { NavLink } from "react-router-dom";

const menuItems = [
  {
    title: "Dashboard",
    icon: LayoutDashboard,
    path: "/teacher/dashboard",
  },
  {
    title: "Students",
    icon: Users,
    path: "/teacher/students",
  },
  {
    title: "Create Passport",
    icon: FilePlus2,
    path: "/teacher/create-passport",
  },
  {
    title: "Report Symptoms",
    icon: Activity,
    path: "/teacher/report-symptoms",
  },
];

function Sidebar() {
  return (
    <aside className="w-full border-b border-slate-200 bg-white/80 backdrop-blur-xl lg:h-screen lg:w-72 lg:border-b-0 lg:border-r lg:shadow-sm">
      <div className="border-b border-slate-200 p-6">
        <div className="flex items-center gap-3">
          <div className="rounded-2xl bg-linear-to-br from-blue-600 to-teal-500 p-3 text-white">
            <HeartPulse size={28} />
          </div>

          <div>
            <h1 className="text-xl font-bold text-slate-800">VitaLearn</h1>
            <p className="text-sm text-slate-500">Nexus</p>
          </div>
        </div>
      </div>

      <div className="m-5 rounded-3xl bg-linear-to-br from-blue-600 to-teal-500 p-5 text-white shadow-xl">
        <p className="text-sm opacity-80">Teacher Portal</p>
        <h2 className="mt-2 text-xl font-bold">Ms. Priya Sharma</h2>
        <p className="mt-1 text-sm opacity-90">Class Teacher • VIII-A</p>
      </div>

      <nav className="px-5 pb-5">
        <p className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Navigation
        </p>

        <div className="space-y-2">
          {menuItems.map((item) => (
            <NavLink
              key={item.title}
              to={item.path}
              className={({ isActive }) =>
                `flex items-center gap-3 rounded-2xl px-4 py-3 transition-all duration-300 ${
                  isActive
                    ? "bg-linear-to-r from-blue-600 to-teal-500 text-white shadow-lg"
                    : "text-slate-600 hover:bg-slate-100"
                }`
              }
            >
              <item.icon size={20} />
              {item.title}
            </NavLink>
          ))}
        </div>
      </nav>

      <div className="m-5 rounded-3xl bg-slate-100 p-5">
        <div className="flex items-center gap-2">
          <Sparkles size={20} className="text-teal-500" />
          <h3 className="font-semibold">AI Health Monitor</h3>
        </div>
        <p className="mt-3 text-sm text-slate-500">
          AI monitoring is active. All summaries require doctor verification.
        </p>
      </div>
    </aside>
  );
}

export default Sidebar;