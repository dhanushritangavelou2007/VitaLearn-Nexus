import GlassCard from "../ui/GlassCard";
import { UserCircle, ShieldCheck, School, Droplets, Pencil } from "lucide-react";

function StudentHeader({ student, statusLabel, passportId, onBack, onReport, onEdit, showEditButton = true, showReportButton = true }) {
  return (
    <GlassCard className="p-8">
      <div className="flex flex-col gap-8 lg:flex-row lg:items-center lg:justify-between">
        <div className="flex items-start gap-6">
          <div className="flex h-28 w-28 items-center justify-center rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 text-white shadow-xl">
            <UserCircle size={70} />
          </div>

          <div>
            <div className="flex flex-wrap items-center gap-3">
              <button onClick={onBack} className="text-sm font-semibold text-blue-600 hover:underline">
                Back to Students
              </button>
              {showEditButton && onEdit && (
                <button onClick={onEdit} className="text-sm font-semibold text-slate-500 hover:text-blue-600 transition-colors flex items-center gap-1">
                  <Pencil size={14} /> Edit Passport
                </button>
              )}
            </div>
            <h1 className="mt-2 text-4xl font-bold text-slate-900">{student.name}</h1>
            <p className="mt-2 text-slate-500">Passport ID : {passportId}</p>

            <div className="mt-5 flex flex-wrap gap-3">
              <div className="flex items-center gap-2 rounded-full bg-blue-100 px-4 py-2 text-blue-700">
                <School size={18} />
                Class {student.class}
              </div>
              <div className="flex items-center gap-2 rounded-full bg-red-100 px-4 py-2 text-red-700">
                <Droplets size={18} />
                Blood Group {student.bloodGroup}
              </div>
            </div>
          </div>
        </div>

        <div className={`rounded-3xl px-8 py-6 text-center text-white shadow-xl ${
          student.risk === 'critical' ? 'bg-gradient-to-r from-red-500 to-rose-600' :
          student.risk === 'review' || student.risk === 'high' ? 'bg-gradient-to-r from-amber-500 to-orange-600' :
          student.risk === 'observation' || student.risk === 'moderate' ? 'bg-gradient-to-r from-blue-500 to-indigo-600' :
          'bg-gradient-to-r from-emerald-500 to-green-600'
        }`}>
          <ShieldCheck size={48} className="mx-auto" />
          <h2 className="mt-3 text-3xl font-bold">{statusLabel}</h2>
          <p className="text-white/80">{student.risk === 'critical' ? 'Critical Risk Student' : student.risk === 'healthy' ? 'Low Risk Student' : 'Needs Review'}</p>
          {showReportButton && (
          <button onClick={onReport} className="mt-4 rounded-2xl bg-white/15 px-4 py-2 text-sm font-semibold text-white backdrop-blur-sm">
            Report Symptom
          </button>
          )}
        </div>
      </div>
    </GlassCard>
  );
}

export default StudentHeader;
