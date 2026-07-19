import GlassCard from "../ui/GlassCard";
import { FileText, Download } from "lucide-react";

function RecentReports({ student }) {
  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={18} className="text-blue-500" />
        <h3 className="font-bold text-slate-800">Files & Reports</h3>
      </div>
      {(student.reports || []).length === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-100 p-4">No reports recorded yet.</p>
      ) : (
        <ul className="space-y-3">
          {student.reports.map((report) => (
            <li key={`${report.date}-${report.type}`} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer">
              <div>
                <p className="text-sm font-semibold text-slate-700">{report.type}</p>
                <p className="text-xs text-slate-500">{report.date} - {report.status}</p>
              </div>
              <Download size={16} className="text-slate-400 group-hover:text-blue-600" />
            </li>
          ))}
        </ul>
      )}
    </GlassCard>
  );
}

export default RecentReports;

