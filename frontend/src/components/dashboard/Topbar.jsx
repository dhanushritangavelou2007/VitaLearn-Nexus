import {
  Bell,
  Search,
  Sparkles,
  UserCircle2,
  Sun,
  ChevronDown,
} from "lucide-react";
import { Link, useLocation } from "react-router-dom";

function Topbar() {
  const location = useLocation();
  const currentPath = location.pathname;

  const roleLabel = currentPath.includes("/parent")
    ? "Parent Workspace"
    : currentPath.includes("/student")
      ? "Student Workspace"
      : currentPath.includes("/doctor")
        ? "Doctor Workspace"
        : currentPath.includes("/admin")
          ? "Admin Workspace"
          : "Teacher Health Command Center";

  const roleSubtitle = currentPath.includes("/parent")
    ? "Stay connected with your child’s health updates."
    : currentPath.includes("/student")
      ? "Track your wellness and passport details."
      : currentPath.includes("/doctor")
        ? "Review student cases and medical notes."
        : currentPath.includes("/admin")
          ? "Oversee school health operations and alerts."
          : "Monitor student wellness and manage Digital Health Passports.";

  return (
    <header className="sticky top-0 z-40 border-b border-slate-200 bg-white/80 px-4 py-4 backdrop-blur-xl sm:px-6 lg:px-8">
      <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 sm:text-3xl">{roleLabel}</h1>
          <p className="mt-1 text-sm text-slate-500 sm:text-base">{roleSubtitle}</p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">
            <Search size={18} className="text-slate-400" />
            <input
              type="text"
              placeholder="Search students..."
              className="w-full bg-transparent text-sm outline-none placeholder:text-slate-400 sm:w-56"
            />
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-teal-500 px-4 py-3 text-white shadow-lg">
            <Sparkles size={18} />
            <span className="text-sm font-semibold">AI Active</span>
          </div>

          <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3">
            <Sun size={18} className="text-amber-500" />
            <span className="text-sm font-semibold text-slate-700">29°C</span>
          </div>

          <button className="relative rounded-2xl bg-slate-100 p-3 transition hover:bg-slate-200">
            <Bell size={20} />
            <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
              3
            </span>
          </button>

          <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2">
            <UserCircle2 size={42} className="text-blue-600" />
            <div>
              <h3 className="font-semibold text-slate-800">Ms. Priya</h3>
              <p className="text-xs text-slate-500">Teacher • VIII-A</p>
            </div>
          </div>

          <div className="rounded-2xl border border-slate-200 bg-white px-3 py-2">
            <div className="flex items-center gap-2 text-sm font-semibold text-slate-700">
              <span>Switch Role</span>
              <ChevronDown size={16} className="text-slate-400" />
            </div>
            <div className="mt-2 flex flex-wrap gap-2">
              <Link to="/teacher/dashboard" className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">Teacher</Link>
              <Link to="/parent/dashboard" className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">Parent</Link>
              <Link to="/student/dashboard" className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">Student</Link>
              <Link to="/doctor/dashboard" className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">Doctor</Link>
              <Link to="/admin/dashboard" className="rounded-lg bg-slate-100 px-2 py-1 text-xs text-slate-600 hover:bg-blue-50 hover:text-blue-600">Admin</Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

export default Topbar;