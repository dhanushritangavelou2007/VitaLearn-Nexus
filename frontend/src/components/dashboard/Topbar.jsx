import { LogOut, MoonStar, Sun } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";
import { useTheme } from "../../hooks/useTheme";
import GlobalSearch from "./GlobalSearch";
import NotificationCenter from "./NotificationCenter";

function Topbar() {
  const navigate = useNavigate();
  const { user, role, logout } = useAuth();
  const { isDarkMode, toggleTheme } = useTheme();

  const dashboardTitle = {
    admin: "School Administration Dashboard",
    teacher: "Teacher Dashboard",
    doctor: "Doctor Dashboard",
    parent: "Parent Dashboard",
    student: "Student Dashboard",
  };

  const subtitle = {
    admin: "Monitor school-wide health analytics",
    teacher: "Track classroom health and student wellbeing",
    doctor: "Review diagnoses and monitor critical cases",
    parent: "Monitor your child's health records",
    student: "Track your personal health passport",
  };

  const roleName = {
    admin: "Administrator",
    teacher: "Teacher",
    doctor: "Doctor",
    parent: "Parent",
    student: "Student",
  };

  const profileImages = {
    teacher:
      "https://images.unsplash.com/photo-1544717302-de2939b7ef71?w=150&h=150&fit=crop&auto=format",
    doctor:
      "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?w=150&h=150&fit=crop&auto=format",
    parent:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&auto=format",
    student:
      "https://images.unsplash.com/photo-1488161628813-04466f872be2?w=150&h=150&fit=crop&auto=format",
    admin:
      "https://images.unsplash.com/photo-1560250097-0b93528c311a?w=150&h=150&fit=crop&auto=format",
    default:
      "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&auto=format",
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <header
      className={`sticky top-0 z-10 flex h-20 items-center justify-between border-b px-8 backdrop-blur-md shadow-sm ${
        isDarkMode
          ? "border-slate-800 bg-slate-900/80 text-slate-100"
          : "border-white/20 bg-white/40 text-slate-800"
      }`}
    >
      {/* Left Section */}
      <div>
        <h2
          className={`text-2xl font-bold tracking-tight ${
            isDarkMode ? "text-slate-100" : "text-slate-800"
          }`}
        >
          {dashboardTitle[role] || "Dashboard"}
        </h2>

        <p
          className={`text-sm font-medium ${
            isDarkMode ? "text-slate-400" : "text-slate-500"
          }`}
        >
          {subtitle[role] || "Welcome to VitaLearn Nexus"}
        </p>
      </div>

      {/* Right Section */}
      <div className="flex items-center gap-4">
        <GlobalSearch />

        <NotificationCenter />

        {/* Theme Toggle */}
        <button
          onClick={toggleTheme}
          className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-sm transition sm:flex ${
            isDarkMode
              ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              : "border-slate-200/60 bg-white/60 text-slate-600 hover:bg-white"
          }`}
        >
          {isDarkMode ? <Sun size={16} /> : <MoonStar size={16} />}
          {isDarkMode ? "Light" : "Dark"}
        </button>

        {/* Logout */}
        <button
          onClick={handleLogout}
          className={`hidden items-center gap-2 rounded-full border px-3 py-2 text-sm font-medium shadow-sm transition sm:flex ${
            isDarkMode
              ? "border-slate-700 bg-slate-800 text-slate-100 hover:bg-slate-700"
              : "border-slate-200/60 bg-white/60 text-slate-600 hover:bg-white"
          }`}
        >
          <LogOut size={16} />
          Logout
        </button>

        {/* Profile */}
        <div
          onClick={() => navigate("/settings")}
          className={`flex cursor-pointer items-center gap-3 rounded-full border px-2 py-1.5 pr-4 shadow-sm backdrop-blur-sm transition ${
            isDarkMode
              ? "border-slate-700 bg-slate-800 hover:bg-slate-700"
              : "border-slate-200/60 bg-white/60 hover:bg-white"
          }`}
        >
          <div className="flex h-10 w-10 items-center justify-center overflow-hidden rounded-full bg-blue-100">
            <img
              src={profileImages[role] || profileImages.default}
              alt="Profile"
              className="h-full w-full object-cover"
              onError={(e) => {
                e.currentTarget.src = profileImages.default;
              }}
            />
          </div>

          <div className="hidden sm:block">
            <p
              className={`text-sm font-semibold ${
                isDarkMode ? "text-slate-100" : "text-slate-700"
              }`}
            >
              {user?.name || "Demo User"}
            </p>

            <p
              className={`text-xs ${
                isDarkMode ? "text-slate-400" : "text-slate-500"
              }`}
            >
              {roleName[role] || "User"}
            </p>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;