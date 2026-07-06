import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow-sm">
      <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4">
        <Link to="/" className="flex items-center gap-2">
          <HeartPulse className="h-8 w-8 text-blue-600" />
          <h1 className="text-xl font-bold text-slate-900">
            VitaLearn Nexus
          </h1>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          <a href="#home" className="text-slate-600 hover:text-blue-600">
            Home
          </a>

          <a href="#features" className="text-slate-600 hover:text-blue-600">
            Features
          </a>

          <a href="#roles" className="text-slate-600 hover:text-blue-600">
            Roles
          </a>
        </div>

        <div className="flex items-center gap-4">
          <Link to="/teacher/dashboard" className="text-slate-600 hover:text-blue-600">
            Login
          </Link>

          <Link
            to="/teacher/dashboard"
            className="rounded-xl bg-blue-600 px-5 py-2 text-white hover:bg-blue-700 transition"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;