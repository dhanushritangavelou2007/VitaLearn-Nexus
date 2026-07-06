import {
  LayoutDashboard,
  Users,
  FileText,
  Activity,
  Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";

function Sidebar() {
  const menuItems = [
    { name: "Dashboard", path: "/teacher/dashboard", icon: LayoutDashboard },
    { name: "Students", path: "/teacher/students", icon: Users },
    { name: "Symptoms", path: "/teacher/report-symptoms/1", icon: Activity },
    { name: "Reports", path: "/reports", icon: FileText },
    { name: "Settings", path: "/settings", icon: Settings },
  ];

  return (
    <aside className="w-72 hidden md:flex flex-col min-h-screen border-r border-slate-200/60 bg-white/70 backdrop-blur-xl p-6 transition-all duration-300 shadow-[4px_0_24px_rgba(0,0,0,0.02)]">
      <div className="flex items-center gap-3 mb-10 px-2">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-linear-to-br from-blue-600 to-indigo-600 text-white shadow-lg shadow-blue-500/30">
          <Activity size={24} className="stroke-[2.5]" />
        </div>
        <h1 className="text-xl font-bold bg-linear-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
          VitaLearn
        </h1>
      </div>

      <nav className="space-y-1.5 flex-1">
        {menuItems.map((item) => {
          const Icon = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) => `group flex w-full items-center gap-3 rounded-2xl px-4 py-3.5 transition-all duration-200 ${
                isActive
                  ? "bg-blue-600 text-white shadow-md shadow-blue-500/25"
                  : "text-slate-500 hover:bg-slate-100/80 hover:text-slate-900"
              }`}
            >
              {({ isActive }) => (
                <>
                  <Icon 
                    size={20} 
                    className={`transition-transform duration-200 ${isActive ? "stroke-[2.5]" : "group-hover:scale-110"}`}
                  />
                  <span className={`font-medium ${isActive ? "" : "group-hover:translate-x-0.5 transition-transform"}`}>
                    {item.name}
                  </span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>
      
      <div className="mt-auto pt-8">
        <div className="rounded-2xl bg-linear-to-br from-blue-50 to-indigo-50/50 p-5 border border-blue-100/50">
          <h4 className="font-semibold text-slate-800 text-sm mb-1">Need Help?</h4>
          <p className="text-xs text-slate-500 mb-3">Check our docs for guidance on health protocols.</p>
          <button className="w-full rounded-xl bg-white px-3 py-2 text-sm font-medium text-blue-600 shadow-sm border border-slate-200 hover:bg-slate-50 transition-colors">
            View Docs
          </button>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
