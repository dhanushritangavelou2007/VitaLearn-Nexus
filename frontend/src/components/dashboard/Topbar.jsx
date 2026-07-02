import { Bell, Search, UserCircle } from "lucide-react";

function Topbar() {
  return (
    <header className="flex h-20 items-center justify-between border-b border-slate-200 bg-white px-8">

      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">
          Dashboard
        </h2>

        <p className="text-slate-500">
          Welcome back to VitaLearn Nexus
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-6">

        <button className="rounded-full p-2 transition hover:bg-slate-100">
          <Search size={22} />
        </button>

        <button className="rounded-full p-2 transition hover:bg-slate-100">
          <Bell size={22} />
        </button>

        <div className="flex items-center gap-3 rounded-full bg-slate-100 px-4 py-2">

          <UserCircle
            size={38}
            className="text-blue-600"
          />

          <div>

            <p className="font-semibold">
              Teacher
            </p>

            <p className="text-sm text-slate-500">
              Demo Account
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;