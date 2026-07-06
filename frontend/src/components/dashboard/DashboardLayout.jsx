import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

function DashboardLayout({ children }) {
  return (
    <div className="flex min-h-screen flex-col bg-linear-to-br from-slate-50 via-blue-50 to-teal-50 lg:flex-row">
      <Sidebar />

      <div className="flex flex-1 flex-col">
        <Topbar />

        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 xl:p-10">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;