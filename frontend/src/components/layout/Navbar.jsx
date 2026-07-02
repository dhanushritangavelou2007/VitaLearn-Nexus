import { HeartPulse } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900">
            VitaLearn Nexus
          </h1>
        </div>

        {/* Navigation Links */}
        <div className="hidden md:flex items-center gap-8">
          <a href="#" className="text-slate-600 hover:text-blue-600">
            Home
          </a>

          <a href="#" className="text-slate-600 hover:text-blue-600">
            Features
          </a>

          <a href="#" className="text-slate-600 hover:text-blue-600">
            About
          </a>
        </div>

        {/* Right Side */}
        <div className="flex items-center gap-4">
          <button className="text-slate-600 hover:text-blue-600">
            Login
          </button>

          <button className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition">
            Get Started
          </button>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;