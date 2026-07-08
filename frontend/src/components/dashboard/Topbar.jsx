import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

function Topbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();

  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/20 bg-white/40 px-8 backdrop-blur-md shadow-sm">
      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          {role ? `${role[0].toUpperCase()}${role.slice(1)} Overview` : "Overview"}
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Monitor the school health intelligence workspace
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationCenter />

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className="hidden sm:flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 border border-slate-200/60 shadow-sm backdrop-blur-sm hover:bg-white transition text-sm font-medium text-slate-600"
        >
          <LogOut size={16} />
          Logout
        </button>

        <div className="flex items-center gap-3 rounded-full bg-white/60 px-2 py-1.5 pr-4 border border-slate-200/60 shadow-sm backdrop-blur-sm cursor-pointer hover:bg-white transition">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              {user?.name || "Ms. Priya"}
            </p>
            <p className="text-xs font-medium text-slate-500">
              {role ? role.toUpperCase() : "Class VIII-A"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Topbar;
