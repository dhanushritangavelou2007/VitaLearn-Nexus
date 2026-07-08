import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StudentHeader from "../../components/profile/StudentHeader";
import EmergencyContact from "../../components/profile/EmergencyContact";
import VaccinationCard from "../../components/profile/VaccinationCard";
import RecentReports from "../../components/profile/RecentReports";
import AISummary from "../../components/profile/AISummary";
import HealthTimeline from "../../components/profile/HealthTimeline";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import HealthDistributionChart from "../../components/charts/HealthDistributionChart";
import GlassCard from "../../components/ui/GlassCard";
import { useStudents } from "../../hooks/useStudents";
import { calculateAge, getRiskLabel, getStudentAvatar } from "../../data/students";
import { Download, FileText, HeartPulse, Activity, ShieldCheck, Syringe } from "lucide-react";
import { exportJsonAsPdf, printElement } from "../../utils/exportHelpers";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, fetchStudentById, generateHealthSummary, setSelectedStudent, loading, error, refreshStudents } = useStudents();
  const student = getStudentById(id);
  const aiSummary = generateHealthSummary(student);

  useEffect(() => {
    let active = true;
    if (student) {
      setSelectedStudent(student);
      return;
    }
    fetchStudentById(id).then((record) => {
      if (active && record) setSelectedStudent(record);
    });
    return () => {
      active = false;
    };
  }, [student, setSelectedStudent, fetchStudentById, id]);

  if (loading && !student) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-7xl space-y-6 pb-10">
          <div className="h-40 animate-pulse rounded-3xl bg-slate-200/70" />
          <div className="grid gap-6 lg:grid-cols-3">
            <div className="h-96 animate-pulse rounded-3xl bg-slate-200/70" />
            <div className="h-96 lg:col-span-2 animate-pulse rounded-3xl bg-slate-200/70" />
          </div>
        </div>
      </DashboardLayout>
    );
  }

  if (error && !student) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-2xl rounded-3xl border border-rose-200 bg-rose-50 p-8 text-rose-700">
          <h1 className="text-2xl font-bold">Unable to load student profile</h1>
          <p className="mt-2">{error}</p>
          <button onClick={refreshStudents} className="mt-6 rounded-2xl bg-rose-600 px-5 py-3 font-semibold text-white">
            Retry
          </button>
        </div>
      </DashboardLayout>
    );
  }

  if (!student) {
    return (
      <DashboardLayout>
        <div className="mx-auto max-w-3xl rounded-3xl bg-white/70 backdrop-blur-xl border border-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Student not found</h1>
          <p className="mt-2 text-slate-500">No health passport exists for this student ID.</p>
          <button onClick={() => navigate("/teacher/students")} className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all">
            Back to Students
          </button>
        </div>
      </DashboardLayout>
    );
  }

  const passportId = `VLN-${String(student.id).padStart(4, "0")}`;
  const statusLabel = getRiskLabel(student.risk);
  const currentBmi = Number(student.vitals?.bmi || 0);
  const currentAttendance = Number(String(student.attendance || "0").replace("%", "")) || 0;
  const bmiTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    day: month,
    healthy: Math.max(0, Number((currentBmi + (index - 2) * 0.2).toFixed(1))),
  }));
  const attendanceTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    day: month,
    healthy: Math.max(0, Math.min(100, Math.round(currentAttendance + (index - 2) * 1.5))),
  }));
  const growthTrend = ["Jan", "Feb", "Mar", "Apr", "May", "Jun"].map((month, index) => ({
    day: month,
    healthy: Math.max(0, Number((Number(student.vitals?.height?.replace(/[^0-9.]/g, "") || 0) + index * 0.3).toFixed(1))),
  }));
  const riskDistribution = [
    { name: "Healthy", value: student.risk === "healthy" ? 1 : 0 },
    { name: "Observation", value: student.risk === "observation" ? 1 : 0 },
    { name: "Review", value: student.risk === "review" ? 1 : 0 },
    { name: "Critical", value: student.risk === "critical" ? 1 : 0 },
  ];

  return (
    <DashboardLayout>
      <div id="passport-page" className="mx-auto max-w-7xl space-y-6 pb-10">
        <StudentHeader
          student={student}
          passportId={passportId}
          statusLabel={statusLabel}
          onBack={() => navigate("/teacher/students")}
          onReport={() => navigate(`/teacher/report-symptoms/${student.id}`)}
        />

        <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
          <div className="space-y-6">
            <GlassCard className="p-6">
              <div className="flex items-center gap-3">
                <div className="rounded-2xl bg-blue-50 p-2.5 text-blue-600">
                  <HeartPulse size={20} />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-slate-800">Profile</h2>
                  <p className="text-sm text-slate-500">Core student details</p>
                </div>
              </div>
              <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                <Info label="Age / Gender" value={`${calculateAge(student.dob)} / ${student.gender}`} />
                <Info label="Attendance" value={student.attendance} />
                <Info label="Class" value={student.class} />
                <Info label="Roll No." value={student.rollNo} />
              </div>
            </GlassCard>
            <EmergencyContact student={student} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
              <div className="flex items-center justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-blue-100">Digital Health Passport</p>
                  <h2 className="mt-2 text-3xl font-bold">{passportId}</h2>
                  <p className="mt-2 text-sm text-blue-100">Status: {statusLabel}</p>
                </div>
                <div className="rounded-2xl bg-white/15 p-4 text-center backdrop-blur-sm">
                  <img src={getStudentAvatar(student)} alt={student.name} className="h-24 w-24 rounded-2xl object-cover" />
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MiniStat label="Health Score" value={student.healthScore} icon={ShieldCheck} />
                <MiniStat label="Symptoms" value={(student.symptoms || []).filter((item) => item !== "None").length} icon={Activity} />
                <MiniStat label="Vaccinations" value={student.vaccinations.length} icon={Syringe} />
              </div>
            </GlassCard>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
              <VaccinationCard student={student} />
              <RecentReports student={student} />
            </div>

            <AISummary summary={aiSummary} />
            <HealthTimeline student={student} />

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthTrendChart data={bmiTrend} title="BMI Graph" />
              <HealthTrendChart data={growthTrend} title="Growth Graph" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthTrendChart data={attendanceTrend} title="Attendance Graph" />
              <HealthDistributionChart data={riskDistribution} title="Risk Indicator" />
            </div>
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() =>
              exportJsonAsPdf({
                title: `Passport-${student.rollNo}`,
                subtitle: `${student.name} | ${student.class}`,
                rows: [
                  ["Passport ID", passportId],
                  ["Name", student.name],
                  ["Class", student.class],
                  ["Risk", statusLabel],
                  ["Health Score", student.healthScore],
                  ["Attendance", student.attendance],
                ],
              })
            }
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-500/25"
          >
            <Download size={16} />
            Download Passport
          </button>
          <button onClick={() => navigate(`/teacher/report-symptoms/${student.id}`)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white">
            <FileText size={16} />
            Add Report
          </button>
          <button onClick={() => printElement("passport-page")} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">
            Print Passport
          </button>
        </div>
      </div>
    </DashboardLayout>
  );
}

function Info({ label, value }) {
  return (
    <div className="rounded-2xl border border-slate-100 bg-slate-50 p-4">
      <p className="text-xs uppercase tracking-wider text-slate-400">{label}</p>
      <p className="mt-1 font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function MiniStat({ label, value, icon: Icon }) {
  return (
    <div className="rounded-2xl border border-white/15 bg-white/10 p-4">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs uppercase tracking-wider text-blue-100">{label}</p>
          <p className="mt-2 text-2xl font-bold">{value}</p>
        </div>
        <Icon size={18} />
      </div>
    </div>
  );
}

export default StudentProfile;
