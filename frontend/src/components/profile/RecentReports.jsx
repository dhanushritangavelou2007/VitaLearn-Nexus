import GlassCard from "../ui/GlassCard";
import { FileText } from "lucide-react";

const reports = [
  {
    title: "Annual Health Screening",
    date: "12 Jul 2026",
    status: "Completed",
  },
  {
    title: "Vision Screening",
    date: "18 Mar 2026",
    status: "Completed",
  },
  {
    title: "Vaccination Follow-up",
    date: "20 Apr 2026",
    status: "Completed",
  },
];

function RecentReports() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-2xl font-bold text-slate-900">
        Recent Medical Reports
      </h2>

      <div className="space-y-4">
        {reports.map((report) => (
          <div
            key={report.title}
            className="flex items-center justify-between rounded-2xl border border-slate-200 p-5"
          >
            <div className="flex items-center gap-4">
              <div className="rounded-xl bg-cyan-100 p-3">
                <FileText className="text-cyan-600" size={22} />
              </div>

              <div>
                <h3 className="font-semibold text-slate-900">
                  {report.title}
                </h3>

                <p className="text-sm text-slate-500">
                  {report.date}
                </p>
              </div>
            </div>

            <span className="rounded-full bg-emerald-100 px-4 py-2 text-sm font-medium text-emerald-700">
              {report.status}
            </span>
          </div>
        ))}
      </div>
    </GlassCard>
  );
}

export default RecentReports;