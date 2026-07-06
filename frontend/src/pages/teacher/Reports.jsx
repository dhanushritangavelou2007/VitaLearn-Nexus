import DashboardLayout from "../../components/dashboard/DashboardLayout";
import students, { getDashboardStats, getRecentActivity } from "../../data/students";
import { Activity, AlertTriangle, FileDown, HeartPulse, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const CHART_COLORS = ["#22c55e", "#f59e0b", "#ef4444"];

function Reports() {
  const stats = getDashboardStats(students);
  const recentActivity = getRecentActivity(students, 6);
  const attendanceTrend = [82, 86, 84, 88, 91, 89];
  const insightItems = [
    {
      title: "Priority Watch",
      description: `${stats.doctorAttention} students currently require immediate follow-up attention.`,
    },
    {
      title: "Attendance Trend",
      description: `Attendance remains steady at an average wellness trend of ${attendanceTrend[attendanceTrend.length - 1]}% across the latest checks.`,
    },
    {
      title: "Vaccination Coverage",
      description: `${stats.total - stats.pendingVaccinations} students are aligned with core immunization records.`,
    },
  ];
  const classSummaries = Array.from(new Set(students.map((student) => student.class))).map((className) => {
    const classStudents = students.filter((student) => student.class === className);
    const healthy = classStudents.filter((student) => student.risk === "healthy").length;
    const observation = classStudents.filter((student) => student.risk === "observation").length;
    const review = classStudents.filter((student) => student.risk === "review").length;
    const critical = classStudents.filter((student) => student.risk === "critical").length;
    const sick = observation + review + critical;

    return {
      className,
      total: classStudents.length,
      healthy,
      sick,
      critical,
      barData: [
        { name: "Healthy", value: healthy },
        { name: "Needs Attention", value: sick },
      ],
      pieData: [
        { name: "Healthy", value: healthy },
        { name: "Monitoring", value: observation + review },
        { name: "Critical", value: critical },
      ],
    };
  });

  const handleExportExcel = () => {
    const rows = [
      ["Metric", "Value"],
      ["Total Students", stats.total],
      ["Healthy", stats.healthy],
      ["Doctor Attention", stats.doctorAttention],
      ["Reports Today", stats.reportsToday],
    ];

    const csvContent = rows.map((row) => row.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "vitalearn-health-report.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleExportPdf = () => {
    window.print();
  };

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Health Reports</h1>
            <p className="mt-2 text-slate-500">
              Review class health trends, monitor risk distribution, and export insights for school leadership.
            </p>
          </div>
          <div className="flex gap-3">
            <button
              type="button"
              onClick={handleExportExcel}
              className="rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition-colors"
            >
              Export Excel
            </button>
            <button
              type="button"
              onClick={handleExportPdf}
              className="rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition-colors flex items-center gap-2"
            >
              <FileDown size={16} /> Export PDF
            </button>
          </div>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          <MetricCard label="Total Students" value={stats.total} icon={Users} accent="blue" />
          <MetricCard label="Healthy" value={stats.healthy} icon={HeartPulse} accent="emerald" />
          <MetricCard label="Doctor Attention" value={stats.doctorAttention} icon={AlertTriangle} accent="red" />
          <MetricCard label="Reports Today" value={stats.reportsToday} icon={Activity} accent="amber" />
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
          <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Risk Distribution</h2>
                <p className="mt-1 text-sm text-slate-500">Current health status across the school roster.</p>
              </div>
            </div>
            <div className="mt-6 space-y-4">
              {[
                { label: "Healthy", value: stats.healthy, color: "bg-emerald-500" },
                { label: "Observation", value: students.filter((student) => student.risk === "observation").length, color: "bg-blue-500" },
                { label: "Needs Review", value: students.filter((student) => student.risk === "review").length, color: "bg-amber-500" },
                { label: "Doctor Attention", value: stats.doctorAttention, color: "bg-red-500" },
              ].map((item) => (
                <div key={item.label}>
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="font-medium text-slate-600">{item.label}</span>
                    <span className="font-semibold text-slate-800">{item.value}</span>
                  </div>
                  <div className="h-2.5 w-full rounded-full bg-slate-100">
                    <div className={`h-2.5 rounded-full ${item.color}`} style={{ width: `${Math.max(10, (item.value / stats.total) * 100)}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">AI Insights</h2>
                <p className="mt-1 text-sm text-slate-500">Suggested follow-up priorities for the teacher.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {insightItems.map((item) => (
                <InsightItem key={item.title} title={item.title} description={item.description} />
              ))}
            </div>
          </div>
        </div>

        <div className="grid gap-6 xl:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Wellness Trend</h2>
                <p className="mt-1 text-sm text-slate-500">Weekly trend from recent health observations.</p>
              </div>
            </div>
            <div className="mt-6 flex items-end gap-3">
              {attendanceTrend.map((value, index) => (
                <div key={index} className="flex flex-1 flex-col items-center gap-2">
                  <div className="w-full rounded-t-2xl bg-linear-to-t from-blue-600 to-cyan-400" style={{ height: `${value}px` }} />
                  <span className="text-xs font-medium text-slate-500">W{index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-bold text-slate-800">Recent Activity</h2>
                <p className="mt-1 text-sm text-slate-500">Latest student notes and health updates.</p>
              </div>
            </div>
            <div className="mt-5 space-y-3">
              {recentActivity.map((item) => (
                <div key={item.id} className="flex items-center justify-between rounded-2xl border border-slate-100 bg-slate-50 px-4 py-3">
                  <div>
                    <p className="font-semibold text-slate-700">{item.studentName}</p>
                    <p className="text-sm text-slate-500">{item.title} • {item.description}</p>
                  </div>
                  <span className="text-sm font-medium text-slate-500">{item.date}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="rounded-3xl border border-white bg-white/70 p-6 shadow-sm backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-800">Class Health Overview</h2>
              <p className="mt-1 text-sm text-slate-500">Each class is summarized with a bar chart and pie chart for healthy, monitoring, and critical cases.</p>
            </div>
          </div>
          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            {classSummaries.map((summary) => (
              <div key={summary.className} className="rounded-3xl border border-slate-100 bg-slate-50/80 p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h3 className="text-base font-semibold text-slate-800">{summary.className}</h3>
                    <p className="mt-1 text-sm text-slate-500">
                      {summary.total} students • {summary.healthy} healthy • {summary.sick} need attention
                    </p>
                  </div>
                  <div className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-600">
                    {summary.critical} critical
                  </div>
                </div>

                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-xs font-semibold text-emerald-700">
                    Healthy: {summary.healthy}
                  </span>
                  <span className="rounded-full bg-amber-50 px-2.5 py-1 text-xs font-semibold text-amber-700">
                    Monitoring: {summary.pieData[1].value}
                  </span>
                  <span className="rounded-full bg-red-50 px-2.5 py-1 text-xs font-semibold text-red-700">
                    Critical: {summary.critical}
                  </span>
                </div>

                <div className="mt-5 grid gap-4 md:grid-cols-2">
                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={summary.barData}>
                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                        <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                        <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                        <Tooltip />
                        <Bar dataKey="value" radius={[8, 8, 0, 0]} fill="#2563eb" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>

                  <div className="h-44">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie data={summary.pieData} dataKey="value" innerRadius={38} outerRadius={70} paddingAngle={2}>
                          {summary.pieData.map((entry, index) => (
                            <Cell key={`${summary.className}-${entry.name}`} fill={CHART_COLORS[index]} />
                          ))}
                        </Pie>
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function MetricCard({ label, value, icon: Icon, accent }) {
  const accentStyles = {
    blue: "from-blue-600 to-indigo-600",
    emerald: "from-emerald-500 to-teal-500",
    red: "from-red-500 to-rose-500",
    amber: "from-amber-500 to-orange-500",
  };

  return (
    <div className={`rounded-3xl bg-linear-to-br ${accentStyles[accent]} p-px shadow-sm`}>
      <div className="rounded-[calc(1.5rem-1px)] bg-white/95 p-5">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm font-medium text-slate-500">{label}</p>
            <p className="mt-2 text-2xl font-bold text-slate-800">{value}</p>
          </div>
          <div className={`rounded-2xl p-3 ${accent === "blue" ? "bg-blue-50 text-blue-600" : accent === "emerald" ? "bg-emerald-50 text-emerald-600" : accent === "red" ? "bg-red-50 text-red-600" : "bg-amber-50 text-amber-600"}`}>
            <Icon size={20} />
          </div>
        </div>
      </div>
    </div>
  );
}

function InsightItem({ title, description }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <h3 className="font-semibold text-slate-700">{title}</h3>
      <p className="mt-1 text-sm text-slate-500">{description}</p>
    </div>
  );
}

export default Reports;