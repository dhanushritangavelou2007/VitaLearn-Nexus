import { Bell, Search } from "lucide-react";

function Topbar() {
  return (
    <header className="sticky top-0 z-10 flex h-20 items-center justify-between border-b border-white/20 bg-white/40 px-8 backdrop-blur-md shadow-sm">
      {/* Left Side */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800 tracking-tight">
          Overview
        </h2>
        <p className="text-sm font-medium text-slate-500">
          Monitor your classroom's health status
        </p>
      </div>

      {/* Right Side */}
      <div className="flex items-center gap-4">
        
        <div className="hidden md:flex items-center gap-2 rounded-full bg-white/60 px-4 py-2 border border-slate-200/60 shadow-sm backdrop-blur-sm">
          <Search size={18} className="text-slate-400" />
          <input 
            type="text" 
            placeholder="Search students..." 
            className="bg-transparent text-sm outline-none placeholder:text-slate-400 w-48 text-slate-700"
          />
        </div>

        <button className="relative rounded-full bg-white/60 p-2.5 transition hover:bg-white border border-slate-200/60 shadow-sm backdrop-blur-sm">
          <Bell size={20} className="text-slate-600" />
          <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white"></span>
        </button>

        <div className="flex items-center gap-3 rounded-full bg-white/60 px-2 py-1.5 pr-4 border border-slate-200/60 shadow-sm backdrop-blur-sm cursor-pointer hover:bg-white transition">
          <div className="h-9 w-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold overflow-hidden">
            <img src="https://i.pravatar.cc/150?u=a042581f4e29026704d" alt="Profile" className="h-full w-full object-cover" />
          </div>
          <div className="hidden sm:block">
            <p className="text-sm font-semibold text-slate-700 leading-tight">
              Ms. Priya
            </p>
            <p className="text-xs font-medium text-slate-500">
              Class VIII-A
            </p>
          </div>
        </div>

      </div>
    </header>
  );
}

export default Topbar;
