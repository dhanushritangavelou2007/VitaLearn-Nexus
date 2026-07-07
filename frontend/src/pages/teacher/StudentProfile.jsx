import { useParams, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import {
  ChevronLeft,
  FileText,
  Activity,
  HeartPulse,
  AlertTriangle,
  Syringe,
  File,
  Download,
  ArrowRight,
  Sparkles,
} from "lucide-react";
import {
  calculateAge,
  formatList,
  getRiskLabel,
  getRiskStyle,
  getStudentAvatar,
} from "../../data/students";
import { useStudents } from "../../hooks/useStudents";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getStudentById, generateHealthSummary, setSelectedStudent } = useStudents();
  const student = getStudentById(id);
  const aiSummary = generateHealthSummary(student);

  useEffect(() => {
    if (student) {
      setSelectedStudent(student);
    }
  }, [student, setSelectedStudent]);

  if (!student) {
    return (
      <DashboardLayout>
        <div className="max-w-3xl mx-auto rounded-3xl bg-white/70 backdrop-blur-xl border border-white p-8 shadow-sm">
          <h1 className="text-2xl font-bold text-slate-800">Student not found</h1>
          <p className="mt-2 text-slate-500">No health passport exists for this student ID.</p>
          <button
            onClick={() => navigate("/teacher/students")}
            className="mt-6 rounded-xl bg-blue-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-blue-500/30 hover:bg-blue-700 transition-all"
          >
            Back to Students
          </button>
        </div>
      </DashboardLayout>
    );
  }

  return (
    <DashboardLayout>
      <div className="max-w-7xl mx-auto space-y-6 pb-10">
        <StudentHeader student={student} onBack={() => navigate("/teacher/students")} />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          <div className="space-y-6">
            <HealthOverview student={student} />
            <EmergencyContact student={student} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <PassportCard student={student} />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <VaccinationCard student={student} />
              <RecentReports student={student} />
            </div>

            <AISummary summary={aiSummary} />
            <HealthTimeline student={student} />
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}

function StudentHeader({ student, onBack }) {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div className="flex items-center gap-4">
        <button
          onClick={onBack}
          className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-sm"
        >
          <ChevronLeft size={20} />
        </button>
        <div>
          <h1 className="text-3xl font-bold text-slate-800 tracking-tight">{student.name}</h1>
          <p className="text-slate-500 font-medium">
            Student Profile - Roll {student.rollNo}
          </p>
        </div>
      </div>
      <button
        onClick={() => navigate(`/teacher/report-symptoms/${student.id}`)}
        className="flex items-center justify-center gap-2 rounded-xl bg-amber-500 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-amber-500/30 hover:bg-amber-600 transition-all"
      >
        <Activity size={18} />
        Report Symptom
      </button>
    </div>
  );
}

function HealthOverview({ student }) {
  const status = getRiskLabel(student.risk);
  const style = getRiskStyle(student.risk);

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm flex flex-col items-center text-center">
      <div className="h-28 w-28 rounded-full bg-slate-100 mb-4 p-1 shadow-inner border border-slate-200">
        <img src={getStudentAvatar(student)} alt={student.name} className="h-full w-full rounded-full object-cover" />
      </div>
      <h2 className="text-xl font-bold text-slate-800">{student.name}</h2>
      <p className="text-slate-500 text-sm font-medium mb-4">
        Class {student.class} - Roll {student.rollNo}
      </p>

      <div className="w-full flex justify-center gap-3 mb-6">
        <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1.5 text-xs font-semibold text-blue-700 border border-blue-200">
          <HeartPulse size={14} /> {student.bloodGroup}
        </span>
        <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold border ${style.pill}`}>
          <Activity size={14} /> {status}
        </span>
      </div>

      <div className="w-full grid grid-cols-2 gap-4 text-left text-sm border-t border-slate-100 pt-6">
        <Info label="Age / Gender" value={`${calculateAge(student.dob)} / ${student.gender}`} />
        <Info label="Attendance" value={student.attendance} />
        <Info label="Height / Weight" value={`${student.vitals.height} / ${student.vitals.weight}`} />
        <Info label="BMI" value={student.vitals.bmi} />
        <Info label="Vision" value={student.vitals.vision} />
        <Info label="Blood Pressure" value={student.vitals.bloodPressure} />
      </div>
    </div>
  );
}

function EmergencyContact({ student }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <AlertTriangle size={18} className="text-red-500" />
        <h3 className="font-bold text-slate-800">Emergency Info</h3>
      </div>
      <div className="space-y-4 text-sm">
        <Info label="Parent / Guardian" value={student.parent.name} />
        <Info label="Emergency Contact" value={student.parent.contact} />
        <Info label="Parent Email" value={student.parent.email} />
        <div>
          <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">Allergies</p>
          <p className="font-medium text-red-600 bg-red-50 inline-block px-2 py-0.5 rounded border border-red-100">
            {formatList(student.allergies)}
          </p>
        </div>
        <Info label="Medical Conditions" value={formatList(student.medicalConditions)} />
      </div>
    </div>
  );
}

function PassportCard({ student }) {
  return (
    <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-3xl p-6 md:p-8 text-white shadow-lg relative overflow-hidden">
      <div className="absolute right-0 top-0 h-64 w-64 translate-x-1/3 -translate-y-1/3 rounded-full bg-white opacity-10 blur-3xl"></div>
      <div className="flex justify-between items-start relative z-10 gap-6">
        <div>
          <p className="text-blue-100 uppercase tracking-widest text-xs font-bold mb-1">Digital Health Passport</p>
          <h2 className="text-3xl font-bold mb-6 font-mono">{student.rollNo}</h2>
          <div className="flex flex-wrap gap-x-8 gap-y-4">
            <PassportMeta label="DOB" value={student.dob} />
            <PassportMeta label="Status" value={student.passportStatus} />
            <PassportMeta label="Last Updated" value={student.lastUpdate} />
          </div>
        </div>
        <div className="bg-white/20 p-2 rounded-xl backdrop-blur-md shrink-0">
          <div className="h-16 w-16 border-2 border-dashed border-white/50 rounded flex items-center justify-center">
            <span className="text-[10px] font-bold">QR CODE</span>
          </div>
        </div>
      </div>
    </div>
  );
}

function VaccinationCard({ student }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <Syringe size={18} className="text-emerald-500" />
          <h3 className="font-bold text-slate-800">Vaccinations</h3>
        </div>
        <span className="text-xs font-semibold bg-emerald-100 text-emerald-700 px-2 py-1 rounded-md">
          {student.vaccinations.length}
        </span>
      </div>
      <ul className="space-y-3 text-sm">
        {student.vaccinations.map((vaccination) => (
          <li key={vaccination} className="flex justify-between items-center border-b border-slate-100 pb-2 last:border-b-0 last:pb-1">
            <span className="text-slate-600 font-medium">{vaccination}</span>
            <span className="text-emerald-600 text-xs font-semibold">Recorded</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

function RecentReports({ student }) {
  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center gap-2 mb-5">
        <FileText size={18} className="text-blue-500" />
        <h3 className="font-bold text-slate-800">Files & Reports</h3>
      </div>
      {student.reports.length === 0 ? (
        <p className="text-sm text-slate-500 bg-slate-50 rounded-xl border border-slate-100 p-4">
          No reports recorded yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {student.reports.map((report) => (
            <li
              key={`${report.date}-${report.type}`}
              className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100 group hover:bg-blue-50 hover:border-blue-100 transition-colors cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="p-1.5 bg-blue-100 text-blue-600 rounded-lg">
                  <File size={16} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-700">{report.type}</p>
                  <p className="text-xs text-slate-500">{report.date} - {report.status}</p>
                </div>
              </div>
              <Download size={16} className="text-slate-400 group-hover:text-blue-600" />
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function AISummary({ summary }) {
  return (
    <div className="rounded-3xl bg-gradient-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles size={18} className="text-purple-300" />
          <h3 className="font-semibold text-purple-100 tracking-wide uppercase text-xs">AI Support Summary</h3>
        </div>
        <p className="text-sm md:text-base leading-relaxed text-slate-100">{summary}</p>
        <p className="mt-3 text-xs text-slate-300">
          Decision support only. Medical diagnosis remains with qualified healthcare professionals.
        </p>
      </div>
    </div>
  );
}

function HealthTimeline({ student }) {
  const timeline = [
    ...student.reports.map((report) => ({
      id: `${report.date}-${report.type}`,
      date: report.date,
      title: report.type,
      description: report.status,
      type: "report",
    })),
    ...student.symptoms
      .filter((symptom) => symptom !== "None")
      .map((symptom) => ({
        id: `symptom-${symptom}`,
        date: student.lastUpdate,
        title: "Symptom Noted",
        description: symptom,
        type: "symptom",
      })),
  ];

  return (
    <div className="bg-white/70 backdrop-blur-xl border border-white rounded-3xl p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h3 className="font-bold text-slate-800 text-lg">Health Timeline</h3>
        <button className="text-sm text-blue-600 font-medium hover:underline flex items-center gap-1">
          View Full History <ArrowRight size={14} />
        </button>
      </div>
      <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-500 pl-6">No timeline activity recorded.</p>
        ) : (
          timeline.map((item) => (
            <div key={item.id} className="relative pl-6">
              <span className={`absolute -left-2 top-1 h-4 w-4 rounded-full border-4 border-white ${
                item.type === "symptom" ? "bg-amber-500" : "bg-blue-500"
              }`}></span>
              <div className="text-xs text-slate-400 font-medium mb-1">{item.date}</div>
              <div className="font-semibold text-slate-700 text-sm mb-0.5">{item.title}</div>
              <div className="text-sm text-slate-500 leading-relaxed">{item.description}</div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

function Info({ label, value }) {
  return (
    <div>
      <p className="text-slate-400 text-xs uppercase tracking-wider mb-1">{label}</p>
      <p className="font-semibold text-slate-700">{value}</p>
    </div>
  );
}

function PassportMeta({ label, value }) {
  return (
    <div>
      <p className="text-blue-200 text-xs mb-1">{label}</p>
      <p className="font-semibold text-sm">{value}</p>
    </div>
  );
}

export default StudentProfile;
