import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import { ArrowRight, Search, Filter, Download } from "lucide-react";
import { getRiskLabel, getRiskStyle } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";
import { exportJsonAsExcel, exportJsonAsPdf, printElement } from "../../utils/exportHelpers";
import { useAuth } from "../../hooks/useAuth";

function Reports() {
  const navigate = useNavigate();
  const { students, calculateDashboardStats, loading, error, refreshStudents } = useStudents();
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const { role } = useAuth();
  
  const stats = calculateDashboardStats();
  const trendData = [
    { day: "Mon", healthy: Math.max(0, Math.round(stats.averageHealthScore - 3)) },
    { day: "Tue", healthy: Math.max(0, Math.round(stats.averageHealthScore - 1)) },
    { day: "Wed", healthy: Math.max(0, Math.round(stats.averageHealthScore + 1)) },
    { day: "Thu", healthy: Math.max(0, Math.round(stats.averageHealthScore - 2)) },
    { day: "Fri", healthy: Math.max(0, Math.round(stats.averageHealthScore + 2)) },
    { day: "Sat", healthy: Math.max(0, Math.round(stats.averageHealthScore + 3)) },
  ];
  const distributionData = [
    { name: "Healthy", value: stats.healthy },
    { name: "Observation", value: (stats.riskDistribution?.moderate || 0) + (stats.riskDistribution?.high || 0) },
    { name: "Critical", value: stats.critical },
  ];

  const reports = getRecentActivity(
    role === "parent" || role === "student"
      ? students.filter((s) => s.name === "Aarav Sharma" || s.id === students[0]?.id).slice(0, 1)
      : students,
    50
  );

  const filteredReports = useMemo(() => {
    const term = query.toLowerCase();
    return reports.filter((report) => {
      const matchesQuery =
        report.studentName.toLowerCase().includes(term) ||
        report.title.toLowerCase().includes(term) ||
        report.description.toLowerCase().includes(term);
      const matchesRisk = riskFilter === "All" || report.risk === riskFilter;
      return matchesQuery && matchesRisk;
    });
  }, [query, reports, riskFilter]);

  if (loading) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6">
          <div className="h-32 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="h-96 animate-pulse rounded-3xl bg-slate-200/70" />
        </div>
      </DashboardLayout>
    );
  }

  if (error) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load reports</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div id="reports-page" className="mx-auto max-w-7xl space-y-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-800">Reports</h1>
          <p className="font-medium text-slate-500">Review student health files and symptom reports</p>
        </div>

        <GlassCard className="p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Reports</h2>
              <p className="text-sm text-slate-500">{filteredReports.length} records from centralized student data</p>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Search size={18} className="text-slate-400" />
                <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search reports..." className="bg-transparent outline-none" />
              </div>
              <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3">
                <Filter size={18} className="text-slate-400" />
                <select value={riskFilter} onChange={(e) => setRiskFilter(e.target.value)} className="bg-transparent outline-none">
                  <option value="All">All Risks</option>
                  <option value="healthy">Healthy</option>
                  <option value="observation">Observation</option>
                  <option value="review">Needs Review</option>
                  <option value="critical">Doctor Attention</option>
                </select>
              </div>
              <button
                onClick={() => {
                  if (role === "admin") {
                    const rows = students.filter(s => riskFilter === "All" || s.risk === riskFilter).filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map((student) => [
                      student.name, student.attendance, student.risk, `${student.vaccinations?.length || 0} / 4`, student.medicalConditions?.join(", ") || "None"
                    ]);
                    exportJsonAsPdf({ title: "Admin Student Report", subtitle: "School health intelligence", rows });
                  } else {
                    exportJsonAsPdf({
                      title: "Student-Reports",
                      subtitle: "Centralized student report export",
                      rows: filteredReports.map((report) => [report.studentName, report.title, report.description, report.risk, report.date]),
                    });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white"
              >
                <Download size={16} />
                Export PDF
              </button>
              <button
                onClick={() => {
                  if (role === "admin") {
                    const rows = students.filter(s => riskFilter === "All" || s.risk === riskFilter).filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map((student) => [
                      student.name, student.attendance, student.risk, `${student.vaccinations?.length || 0} / 4`, student.medicalConditions?.join(", ") || "None"
                    ]);
                    exportJsonAsExcel({ title: "Student Reports", rows: [["Student", "Attendance", "Risk", "Vaccinations", "Conditions"], ...rows] });
                  } else {
                    exportJsonAsExcel({
                      title: "Student Reports",
                      rows: [["Student", "Report", "Status", "Risk", "Date"], ...filteredReports.map((report) => [report.studentName, report.title, report.description, report.risk, report.date])],
                    });
                  }
                }}
                className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white"
              >
                <Download size={16} />
                Export Excel
              </button>
              <button onClick={() => printElement("reports-page")} className="inline-flex items-center justify-center gap-2 rounded-2xl border border-slate-200 bg-white px-4 py-3 font-semibold text-slate-700">
                Print
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            {role === "admin" ? (
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Attendance</th>
                    <th className="px-6 py-4 font-semibold">Risk Level</th>
                    <th className="px-6 py-4 font-semibold">Vaccinations</th>
                    <th className="px-6 py-4 font-semibold">Medical Conditions</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {students.filter(s => riskFilter === "All" || s.risk === riskFilter).filter(s => s.name.toLowerCase().includes(query.toLowerCase())).length > 0 ? (
                    students.filter(s => riskFilter === "All" || s.risk === riskFilter).filter(s => s.name.toLowerCase().includes(query.toLowerCase())).map((student) => {
                      const style = getRiskStyle(student.risk);
                      return (
                        <tr key={student.id} className="hover:bg-white/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{student.name}</div>
                            <div className="text-xs text-slate-500">ID VLN-{String(student.id).padStart(4, "0")}</div>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">{student.attendance}</td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${style.pill}`}>
                              {getRiskLabel(student.risk)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-700">{student.vaccinations?.length || 0} / 4 Core</td>
                          <td className="px-6 py-4 text-sm text-slate-500">
                            {student.medicalConditions?.length ? student.medicalConditions.join(", ") : "None"}
                          </td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/passport/${student.id}`)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              View <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="6" className="px-6 py-8 text-center text-slate-500 text-sm">
                        No students found matching your criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            ) : (
              <table className="w-full min-w-225 text-left border-collapse">
                <thead>
                  <tr className="bg-slate-50/80 text-xs uppercase tracking-wider text-slate-500">
                    <th className="px-6 py-4 font-semibold">Student</th>
                    <th className="px-6 py-4 font-semibold">Report</th>
                    <th className="px-6 py-4 font-semibold">Status</th>
                    <th className="px-6 py-4 font-semibold">Date</th>
                    <th className="px-6 py-4 font-semibold text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100/80">
                  {filteredReports.length > 0 ? (
                    filteredReports.map((report) => {
                      const style = getRiskStyle(report.risk);
                      return (
                        <tr key={report.id} className="hover:bg-white/60 transition-colors">
                          <td className="px-6 py-4">
                            <div className="font-semibold text-slate-800">{report.studentName}</div>
                            <div className="text-xs text-slate-500">ID {report.studentId}</div>
                          </td>
                          <td className="px-6 py-4">
                            <div className="text-sm font-medium text-slate-700">{report.title}</div>
                            <div className="text-xs text-slate-500">{report.description}</div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`inline-flex items-center rounded-full px-2.5 py-1 text-xs font-medium border ${style.pill}`}>
                              {getRiskLabel(report.risk)}
                            </span>
                          </td>
                          <td className="px-6 py-4 text-sm text-slate-500">{report.date}</td>
                          <td className="px-6 py-4 text-right">
                            <button
                              onClick={() => navigate(`/passport/${report.studentId}`)}
                              className="inline-flex items-center gap-1.5 text-sm font-medium text-blue-600 hover:text-blue-700"
                            >
                              View <ArrowRight size={14} />
                            </button>
                          </td>
                        </tr>
                      );
                    })
                  ) : (
                    <tr>
                      <td colSpan="5" className="px-6 py-8 text-center text-slate-500 text-sm">
                        No reports found for the selected criteria.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <HealthTrendChart data={trendData} title="Health Score Trend" />
          <HealthDistributionChart data={distributionData} title="Risk Distribution" />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
