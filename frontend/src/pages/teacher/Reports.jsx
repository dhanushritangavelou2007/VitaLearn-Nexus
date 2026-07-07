import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import { FileText, ArrowRight, Search, Filter, Download } from "lucide-react";
import { getRiskLabel, getRiskStyle } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function Reports() {
  const navigate = useNavigate();
  const { students, loading, error, refreshStudents } = useStudents();
  const [query, setQuery] = useState("");
  const [riskFilter, setRiskFilter] = useState("All");
  const reports = getRecentActivity(students, 50);

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
      <div className="mx-auto max-w-7xl space-y-6">
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
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-blue-600 px-4 py-3 font-semibold text-white">
                <Download size={16} />
                Export PDF
              </button>
              <button className="inline-flex items-center justify-center gap-2 rounded-2xl bg-slate-900 px-4 py-3 font-semibold text-white">
                <Download size={16} />
                Export Excel
              </button>
            </div>
          </div>
        </GlassCard>

        <GlassCard className="overflow-hidden p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[900px] text-left border-collapse">
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
                {filteredReports.map((report) => {
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
                          onClick={() => navigate(`/teacher/student-profile/${report.studentId}`)}
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
        </GlassCard>

        <div className="grid gap-6 lg:grid-cols-2">
          <HealthTrendChart />
          <HealthDistributionChart />
        </div>
      </div>
    </DashboardLayout>
  );
}

export default Reports;
