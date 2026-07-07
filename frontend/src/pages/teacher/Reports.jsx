import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import { FileText, ArrowRight } from "lucide-react";
import { getRiskLabel, getRiskStyle } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function Reports() {
  const navigate = useNavigate();
  const { students } = useStudents();
  const reports = getRecentActivity(students, 50);

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">
            Reports
          </h1>
          <p className="text-slate-500 font-medium">
            Review student health files and symptom reports
          </p>
        </div>

        <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm overflow-hidden flex flex-col">
          <div className="p-6 border-b border-slate-100 flex items-center gap-3">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
              <FileText size={20} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-800">
                Recent Reports
              </h3>
              <p className="text-sm text-slate-500">
                {reports.length} records from centralized student data
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-225">
              <thead>
                <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider border-b border-slate-100">
                  <th className="px-6 py-4 font-semibold">Student</th>
                  <th className="px-6 py-4 font-semibold">Report</th>
                  <th className="px-6 py-4 font-semibold">Status</th>
                  <th className="px-6 py-4 font-semibold">Date</th>
                  <th className="px-6 py-4 font-semibold text-right">
                    Action
                  </th>
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100/80">
                {reports.map((report) => {
                  const style = getRiskStyle(report.risk);

                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-white/50 transition-colors"
                    >
                      <td className="px-6 py-4">
                        <div className="font-semibold text-slate-800">
                          {report.studentName}
                        </div>
                        <div className="text-xs text-slate-500">
                          ID {report.studentId}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-sm font-medium text-slate-700">
                          {report.title}
                        </div>
                        <div className="text-xs text-slate-500">
                          {report.description}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${style.pill}`}
                        >
                          {getRiskLabel(report.risk)}
                        </span>
                      </td>

                      <td className="px-6 py-4 text-sm text-slate-500">
                        {report.date}
                      </td>

                      <td className="px-6 py-4 text-right">
                        <button
                          onClick={() =>
                            navigate(
                              `/teacher/student-profile/${report.studentId}`
                            )
                          }
                          className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                        >
                          View <ArrowRight size={14} />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;