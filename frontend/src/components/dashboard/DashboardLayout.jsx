import Sidebar from "./Sidebar";
import Topbar from "./Topbar";
import { useTheme } from "../../hooks/useTheme";

function DashboardLayout({ children }) {
  const { isDarkMode } = useTheme();

  return (
    <div className={`flex min-h-screen flex-col ${isDarkMode ? "bg-slate-950 text-slate-100" : "bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 text-slate-900"} lg:flex-row`}>
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className={`flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10 ${isDarkMode ? "bg-slate-950" : "bg-transparent"}`}>
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;