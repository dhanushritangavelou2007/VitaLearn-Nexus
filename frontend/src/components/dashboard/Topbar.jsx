import {
  Bell,
  Search,
  Sparkles,
  UserCircle2,
  Sun,
} from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-40 flex h-24 items-center justify-between border-b border-slate-200 bg-white/80 px-8 backdrop-blur-xl">

      {/* Left */}

      <div>

        <h1 className="text-3xl font-bold text-slate-800">
          Teacher Health Command Center
        </h1>

        <p className="mt-1 text-slate-500">
          Monitor student wellness and manage Digital Health Passports.
        </p>

      </div>

      {/* Right */}

      <div className="flex items-center gap-5">

        {/* Search */}

        <div className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3">

          <Search
            size={18}
            className="text-slate-400"
          />

          <input
            type="text"
            placeholder="Search students..."
            className="w-56 bg-transparent text-sm outline-none placeholder:text-slate-400"
          />

        </div>

        {/* AI */}

        <div className="flex items-center gap-2 rounded-2xl bg-linear-to-r from-blue-600 to-teal-500 px-4 py-3 text-white shadow-lg">

          <Sparkles size={18} />

          <span className="text-sm font-semibold">
            AI Active
          </span>

        </div>

        {/* Weather */}

        <div className="flex items-center gap-2 rounded-2xl bg-amber-50 px-4 py-3">

          <Sun
            size={18}
            className="text-amber-500"
          />

          <span className="text-sm font-semibold text-slate-700">
            29°C
          </span>

        </div>

        {/* Notifications */}

        <button className="relative rounded-2xl bg-slate-100 p-3 transition hover:bg-slate-200">

          <Bell size={20} />

          <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-xs text-white">
            3
          </span>

        </button>

        {/* Profile */}

        <div className="flex items-center gap-3 rounded-2xl bg-slate-100 px-4 py-2">

          <UserCircle2
            size={42}
            className="text-blue-600"
          />

          <div>

            <h3 className="font-semibold text-slate-800">
              Ms. Priya
            </h3>

            <p className="text-xs text-slate-500">
              Teacher • VIII-A
            </p>

          </div>

        </div>

      </div>

    </header>
  );
}

export default Topbar;