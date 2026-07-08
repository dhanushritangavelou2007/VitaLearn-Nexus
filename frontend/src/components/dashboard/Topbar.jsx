import { LogOut, MoonStar, Sun } from "lucide-react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

function Topbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  return (
    <header className={`sticky top-0 z-10 flex h-20 items-center justify-between border-b ${isDarkMode ? "border-slate-800 bg-slate-900/80 text-slate-100" : "border-white/20 bg-white/40 text-slate-800"} px-8 backdrop-blur-md shadow-sm`}>
      {/* Left Side */}
      <div>
        <h2 className={`text-2xl font-bold tracking-tight ${isDarkMode ? "text-slate-100" : "text-slate-800"}`}>
          {role ? `${role[0].toUpperCase()}${role.slice(1)} Overview` : "Overview"}
        </h2>
        <p className={`text-sm font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
          Monitor the school health intelligence workspace
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        <GlobalSearch />
        <NotificationCenter />

        <button
          onClick={toggleTheme}
          className={`hidden sm:flex items-center gap-2 rounded-full ${isDarkMode ? "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700" : "bg-white/60 text-slate-600 border-slate-200/60 hover:bg-white"} px-3 py-2 border shadow-sm backdrop-blur-sm transition text-sm font-medium`}
        >
          {isDarkMode ? <Sun size={16} /> : <MoonStar size={16} />}
          {isDarkMode ? "Light" : "Dark"}
        </button>

        <button
          onClick={() => {
            logout();
            navigate("/login");
          }}
          className={`hidden sm:flex items-center gap-2 rounded-full ${isDarkMode ? "bg-slate-800 text-slate-100 border-slate-700 hover:bg-slate-700" : "bg-white/60 text-slate-600 border-slate-200/60 hover:bg-white"} px-3 py-2 border shadow-sm backdrop-blur-sm transition text-sm font-medium`}
        >
          <LogOut size={16} />
          Logout
        </button>

        <div onClick={() => navigate("/settings")} className={`flex items-center gap-3 rounded-full ${isDarkMode ? "bg-slate-800 border-slate-700 hover:bg-slate-700" : "bg-white/60 border-slate-200/60 hover:bg-white"} px-2 py-1.5 pr-4 border shadow-sm backdrop-blur-sm cursor-pointer transition`}>
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className={`text-sm font-semibold leading-tight ${isDarkMode ? "text-slate-100" : "text-slate-700"}`}>
              {user?.name || "Ms. Priya"}
            </p>
            <p className={`text-xs font-medium ${isDarkMode ? "text-slate-400" : "text-slate-500"}`}>
              {role ? role.toUpperCase() : "Class VIII-A"}
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Topbar;
