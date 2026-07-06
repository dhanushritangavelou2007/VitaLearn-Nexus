import GlassCard from "../ui/GlassCard";
import {
  UserCircle,
  ShieldCheck,
  School,
  Droplets,
} from "lucide-react";

function StudentHeader() {
  return (
    <GlassCard className="p-8">

      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">

        {/* Left Side */}

        <div className="flex items-center gap-6">

          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-linear-to-br from-blue-600 to-cyan-500 text-white shadow-xl">

            <UserCircle size={70} />

          </div>

          <div>

            <h1 className="text-4xl font-bold text-slate-900">
              Aarav Sharma
            </h1>

            <p className="mt-2 text-slate-500">
              Passport ID : VLN-2026-00124
            </p>

            <div className="mt-5 flex flex-wrap gap-3">

              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">

                <School size={18} />

                Class VIII-A

              </div>

              <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">

                <Droplets size={18} />

                Blood Group O+

              </div>

            </div>

          </div>

        </div>

        {/* Right Side */}

        <div className="rounded-3xl bg-linear-to-r from-emerald-500 to-green-600 px-8 py-6 text-center text-white shadow-xl">

          <ShieldCheck
            size={48}
            className="mx-auto"
          />

          <h2 className="mt-3 text-3xl font-bold">

            Healthy

          </h2>

          <p className="text-emerald-100">

            Low Risk Student

          </p>

        </div>

      </div>

    </GlassCard>
  );
}

export default StudentHeader;