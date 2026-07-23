import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import StudentHeader from "../../components/profile/StudentHeader";
import EmergencyContact from "../../components/profile/EmergencyContact";
import VaccinationCard from "../../components/profile/VaccinationCard";
import AISummary from "../../components/profile/AISummary";
import HealthTimeline from "../../components/profile/HealthTimeline";
import HealthTrendChart from "../../components/charts/HealthTrendChart";
import GlassCard from "../../components/ui/GlassCard";
import { useStudents } from "../../hooks/useStudents";
import { calculateAge, getRiskLabel, getStudentAvatar } from "../../data/students";
import { Download, FileText, HeartPulse, Activity, ShieldCheck, Syringe } from "lucide-react";
import { printElement, downloadProfessionalPassport, downloadMedicalReport } from "../../utils/exportHelpers";
import { useAuth } from "../../hooks/useAuth";
import DoctorReviewPanel from "../../components/profile/DoctorReviewPanel";

function StudentProfile() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { role, user } = useAuth();
  const { getStudentById, fetchStudentById, generateHealthSummary, setSelectedStudent, updateStudent, loading, error, refreshStudents } = useStudents();
  const student = getStudentById(id);
  const aiSummary = generateHealthSummary(student);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [editForm, setEditForm] = useState({
    name: "",
    rollNo: "",
    className: "",
    section: "",
    dob: "",
    gender: "",
    bloodGroup: "",
    parentName: "",
    parentContact: "",
    parentEmail: "",
    emergencyContact: "",
    allergies: "",
    medicalConditions: "",
    attendance: "",
    teacherObservation: "",
    height: "",
    weight: "",
    bmi: "",
    vision: "",
    bloodPressure: "",
  });

  useEffect(() => {
    let active = true;
    if (!student) {
      fetchStudentById(id).then((record) => {
        if (active && record) {
          // fetchStudentById already sets selected student in context
        }
      });
    }
    return () => {
      active = false;
    };
  }, [student, fetchStudentById, id]);

  const initializeEditForm = (sourceStudent) => {
    const [className, section] = (sourceStudent.class || "").split("-");
    setEditForm({
      name: sourceStudent.name || "",
      rollNo: sourceStudent.rollNo || "",
      className: className || sourceStudent.class || "",
      section: section || "",
      dob: sourceStudent.dob || "",
      gender: sourceStudent.gender || "",
      bloodGroup: sourceStudent.bloodGroup || "",
      parentName: sourceStudent.parent?.name || "",
      parentContact: sourceStudent.parent?.contact || "",
      parentEmail: sourceStudent.parent?.email || "",
      emergencyContact: sourceStudent.emergencyContact || "",
      allergies: Array.isArray(sourceStudent.allergies) ? sourceStudent.allergies.join(", ") : sourceStudent.allergies || "",
      medicalConditions: Array.isArray(sourceStudent.medicalConditions) ? sourceStudent.medicalConditions.join(", ") : sourceStudent.medicalConditions || "",
      attendance: sourceStudent.attendance || "",
      teacherObservation: sourceStudent.teacherObservation || "",
      height: sourceStudent.vitals?.height || "",
      weight: sourceStudent.vitals?.weight || "",
      bmi: sourceStudent.vitals?.bmi || "",
      vision: sourceStudent.vitals?.vision || "",
      bloodPressure: sourceStudent.vitals?.bloodPressure || "",
    });
  };

  const openEditor = () => {
    if (!student) return;
    initializeEditForm(student);
    setIsEditing(true);
  };

  const handleEditChange = (field, value) => {
    setEditForm((current) => ({ ...current, [field]: value }));
  };

  const handleSaveProfile = async (event) => {
    event.preventDefault();
    if (!student) return;

    setSaving(true);
    setSaveSuccess(false);

    const updatedClass = editForm.className && editForm.section ? `${editForm.className}-${editForm.section}` : editForm.className || student.class;
    const updatedParent = {
      name: editForm.parentName,
      contact: editForm.parentContact,
      email: editForm.parentEmail,
    };

    const payload = {
      name: editForm.name,
      rollNo: editForm.rollNo,
      class: updatedClass,
      dob: editForm.dob,
      gender: editForm.gender,
      bloodGroup: editForm.bloodGroup,
      parent: updatedParent,
      emergencyContact: editForm.emergencyContact,
      allergies: editForm.allergies.split(",").map((item) => item.trim()).filter(Boolean),
      medicalConditions: editForm.medicalConditions.split(",").map((item) => item.trim()).filter(Boolean),
      attendance: editForm.attendance,
      teacherObservation: editForm.teacherObservation,
      vitals: {
        height: editForm.height,
        weight: editForm.weight,
        bmi: editForm.bmi,
        vision: editForm.vision,
        bloodPressure: editForm.bloodPressure,
      },
    };

    const updated = await updateStudent(student.id, payload);
    if (updated) {
      setSelectedStudent(updated);
      setSaveSuccess(true);
      setIsEditing(false);
      setTimeout(() => setSaveSuccess(false), 2500);
    }
    setSaving(false);
  };

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
            Go Back
          </button>
        </div>
      </DashboardLayout>
    );
  }

  // Restrict access for parent/student to only their own passport
  // Use user ID matching against student.user (student) or student.parentUser (parent)
  if (role === "parent" || role === "student") {
    const userId = user?.id || user?._id;
    const isOwn =
      (role === "student" && String(student.user) === String(userId)) ||
      (role === "parent" && String(student.parentUser) === String(userId)) ||
      // Demo fallback: Aarav Sharma is linked to both demo parent and student
      student.name === "Aarav Sharma";
    if (!isOwn) {
      return (
        <DashboardLayout>
          <div className="mx-auto max-w-3xl rounded-3xl bg-white/70 backdrop-blur-xl border border-rose-200 p-8 shadow-sm">
            <h1 className="text-2xl font-bold text-rose-700">Unauthorized Access</h1>
            <p className="mt-2 text-rose-500">You do not have permission to view this student's passport.</p>
            <button onClick={() => navigate(`/${role}/dashboard`)} className="mt-6 rounded-xl bg-rose-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md shadow-rose-500/30 hover:bg-rose-700 transition-all">
              Back to Dashboard
            </button>
          </div>
        </DashboardLayout>
      );
    }
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

  return (
    <DashboardLayout>
      <div id="passport-page" className="mx-auto max-w-7xl space-y-6 pb-10">
        <StudentHeader
          student={student}
          passportId={passportId}
          statusLabel={statusLabel}
          onBack={() => navigate("/teacher/students")}
          onReport={() => navigate(`/teacher/report-symptoms/${student.id}`)}
          onEdit={role === "teacher" ? openEditor : undefined}
          showEditButton={role !== "doctor"}
          showReportButton={role !== "doctor"}
        />

        {role === "teacher" && (
          <GlassCard className="rounded-3xl border border-slate-200 bg-white/90 p-6 shadow-sm">
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
              <div>
                <p className="text-sm uppercase tracking-widest text-slate-400">Passport Editor</p>
                <h2 className="text-2xl font-bold text-slate-900">Update Student Passport Details</h2>
                <p className="mt-2 text-sm text-slate-500">Teachers can keep every profile field accurate for a complete health passport.</p>
              </div>
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  onClick={() => (isEditing ? setIsEditing(false) : openEditor())}
                  className="rounded-full border border-slate-200 bg-slate-50 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100 transition-colors"
                >
                  {isEditing ? "Close editor" : "Open editor"}
                </button>
              </div>
            </div>

            {isEditing ? (
              <form onSubmit={handleSaveProfile} className="mt-6 grid gap-4 lg:grid-cols-2">
                {[
                  { label: "Student Name", value: editForm.name, field: "name", type: "text" },
                  { label: "Roll Number", value: editForm.rollNo, field: "rollNo", type: "text" },
                  { label: "Class", value: editForm.className, field: "className", type: "text" },
                  { label: "Section", value: editForm.section, field: "section", type: "text" },
                  { label: "Date of Birth", value: editForm.dob, field: "dob", type: "date" },
                  { label: "Gender", value: editForm.gender, field: "gender", type: "text" },
                  { label: "Blood Group", value: editForm.bloodGroup, field: "bloodGroup", type: "text" },
                  { label: "Parent / Guardian Name", value: editForm.parentName, field: "parentName", type: "text" },
                  { label: "Parent Contact", value: editForm.parentContact, field: "parentContact", type: "tel" },
                  { label: "Parent Email", value: editForm.parentEmail, field: "parentEmail", type: "email" },
                  { label: "Emergency Contact", value: editForm.emergencyContact, field: "emergencyContact", type: "tel" },
                  { label: "Attendance", value: editForm.attendance, field: "attendance", type: "text" },
                  { label: "Teacher Observation", value: editForm.teacherObservation, field: "teacherObservation", type: "text" },
                ].map(({ label, value, field, type }) => (
                  <label key={field} className="block text-sm text-slate-700">
                    <span className="font-semibold">{label}</span>
                    <input
                      type={type}
                      value={value}
                      onChange={(e) => handleEditChange(field, e.target.value)}
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                ))}

                <div className="lg:col-span-2 grid gap-4">
                  <label className="block text-sm text-slate-700">
                    <span className="font-semibold">Allergies</span>
                    <input
                      type="text"
                      value={editForm.allergies}
                      onChange={(e) => handleEditChange("allergies", e.target.value)}
                      placeholder="e.g. Peanuts, Dust"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                  <label className="block text-sm text-slate-700">
                    <span className="font-semibold">Medical Conditions</span>
                    <input
                      type="text"
                      value={editForm.medicalConditions}
                      onChange={(e) => handleEditChange("medicalConditions", e.target.value)}
                      placeholder="e.g. Asthma, Migraine"
                      className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                    />
                  </label>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-700">
                      <span className="font-semibold">Height</span>
                      <input
                        type="text"
                        value={editForm.height}
                        onChange={(e) => handleEditChange("height", e.target.value)}
                        placeholder="e.g. 155 cm"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                    <label className="block text-sm text-slate-700">
                      <span className="font-semibold">Weight</span>
                      <input
                        type="text"
                        value={editForm.weight}
                        onChange={(e) => handleEditChange("weight", e.target.value)}
                        placeholder="e.g. 45 kg"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                  </div>
                  <div className="grid gap-4 sm:grid-cols-2">
                    <label className="block text-sm text-slate-700">
                      <span className="font-semibold">BMI</span>
                      <input
                        type="text"
                        value={editForm.bmi}
                        onChange={(e) => handleEditChange("bmi", e.target.value)}
                        placeholder="e.g. 18.7"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                    <label className="block text-sm text-slate-700">
                      <span className="font-semibold">Vision / BP</span>
                      <input
                        type="text"
                        value={`${editForm.vision} / ${editForm.bloodPressure}`}
                        onChange={(e) => {
                          const [vision, bloodPressure] = e.target.value.split("/").map((item) => item.trim());
                          handleEditChange("vision", vision || "");
                          handleEditChange("bloodPressure", bloodPressure || "");
                        }}
                        placeholder="e.g. 6/6 / 110/70"
                        className="mt-2 w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
                      />
                    </label>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-2">
                    <button
                      type="submit"
                      disabled={saving}
                      className="rounded-2xl bg-blue-600 px-5 py-3 text-sm font-semibold text-white shadow-md hover:bg-blue-700 transition disabled:opacity-70"
                    >
                      {saving ? "Saving..." : "Save Passport Info"}
                    </button>
                    <button
                      type="button"
                      onClick={() => setIsEditing(false)}
                      className="rounded-2xl border border-slate-200 bg-white px-5 py-3 text-sm font-semibold text-slate-700 hover:bg-slate-50 transition"
                    >
                      Cancel
                    </button>
                    {saveSuccess && <span className="text-sm font-medium text-emerald-600">Passport updated successfully.</span>}
                  </div>
                </div>
              </form>
            ) : (
              <div className="mt-6 grid gap-4 rounded-3xl border border-slate-100 bg-slate-50 p-5 text-sm text-slate-600">
                <p>Content updates here will keep the student passport aligned for doctors, parents, and administrative reporting.</p>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="block text-slate-500">Current Parent / Guardian</span>
                    <p className="mt-1 font-semibold text-slate-800">{student.parent?.name || "Not provided"}</p>
                  </div>
                  <div>
                    <span className="block text-slate-500">Current Contact</span>
                    <p className="mt-1 font-semibold text-slate-800">{student.parent?.contact || "Not provided"}</p>
                  </div>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <div>
                    <span className="block text-slate-500">Medical Conditions</span>
                    <p className="mt-1 font-semibold text-slate-800">{(student.medicalConditions || []).join(", ") || "None"}</p>
                  </div>
                  <div>
                    <span className="block text-slate-500">Allergies</span>
                    <p className="mt-1 font-semibold text-slate-800">{(student.allergies || []).join(", ") || "None"}</p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setIsEditing(true)}
                  className="mt-3 inline-flex items-center justify-center rounded-2xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white hover:bg-blue-700 transition"
                >
                  Edit Passport Info
                </button>
              </div>
            )}
          </GlassCard>
        )}

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
                <Info label="Blood Group" value={student.bloodGroup || "N/A"} />
                <Info label="Attendance" value={student.attendance || "N/A"} />
                <Info label="Class / Roll" value={`${student.class} - ${student.rollNo}`} />
                <Info label="Height / Weight" value={`${student.vitals?.height || "N/A"} / ${student.vitals?.weight || "N/A"}`} />
                <Info label="BMI" value={student.vitals?.bmi || "N/A"} />
                <Info label="Last Updated" value={student.lastUpdate || "Today"} />
                <Info label="Teacher Note" value={student.teacherObservation || "Doing well in class."} />
              </div>
            </GlassCard>
            <EmergencyContact student={student} />
          </div>

          <div className="lg:col-span-2 space-y-6">
            <GlassCard className="rounded-3xl bg-linear-to-br from-blue-600 to-indigo-700 p-6 text-white shadow-lg">
              <div className="flex items-start justify-between gap-6">
                <div>
                  <p className="text-xs uppercase tracking-widest text-blue-100">Digital Health Passport</p>
                  <h2 className="mt-2 text-3xl font-bold">{passportId}</h2>
                  <p className="mt-2 text-sm text-blue-100">Status: {statusLabel}</p>
                  <p className="mt-1 text-sm font-medium text-white/80">{student.name}</p>
                </div>
                <div className="flex gap-4">
                  <div className="rounded-2xl bg-white p-2 flex items-center justify-center shadow-inner">
                    <img src={`https://api.qrserver.com/v1/create-qr-code/?size=96x96&data=${encodeURIComponent(window.location.origin + "/passport/" + student.id)}`} alt="QR Code" className="h-24 w-24 rounded-lg" />
                  </div>
                  <div className="rounded-2xl bg-white/15 p-2 text-center backdrop-blur-sm">
                    <img src={getStudentAvatar(student)} alt={student.name} className="h-24 w-24 rounded-xl object-cover" />
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-4 sm:grid-cols-3">
                <MiniStat label="Health Score" value={student.healthScore} icon={ShieldCheck} />
                <MiniStat label="Symptoms" value={(student.symptoms || []).filter((item) => item !== "None").length} icon={Activity} />
                <MiniStat label="Vaccinations" value={student.vaccinations.length} icon={Syringe} />
              </div>
            </GlassCard>

            <div className="mb-6">
              <VaccinationCard student={student} />
            </div>

            <AISummary summary={aiSummary} />
            <HealthTimeline student={student} />

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthTrendChart data={bmiTrend} title="BMI Graph" />
              <HealthTrendChart data={growthTrend} title="Growth Graph" />
            </div>

            <div className="grid gap-6 lg:grid-cols-2">
              <HealthTrendChart data={attendanceTrend} title="Attendance Graph" />
            </div>

            {role === "doctor" && (
              <DoctorReviewPanel student={student} aiSummary={aiSummary} />
            )}
          </div>
        </div>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => downloadProfessionalPassport(student, aiSummary)}
            className="inline-flex items-center gap-2 rounded-2xl bg-blue-600 px-5 py-3 font-semibold text-white shadow-md shadow-blue-500/25 hover:bg-blue-700 transition-colors"
          >
            <Download size={16} />
            Download Passport
          </button>
          <button
            onClick={() => downloadMedicalReport(student, aiSummary)}
            className="inline-flex items-center gap-2 rounded-2xl bg-emerald-600 px-5 py-3 font-semibold text-white shadow-md shadow-emerald-500/25 hover:bg-emerald-700 transition-colors"
          >
            <FileText size={16} />
            Download Medical Report
          </button>
          {role !== "doctor" && (
            <button onClick={() => navigate(`/report-symptoms/${student.id}`)} className="inline-flex items-center gap-2 rounded-2xl bg-slate-900 px-5 py-3 font-semibold text-white">
              <FileText size={16} />
              Add Report
            </button>
          )}
          <button onClick={() => downloadProfessionalPassport(student, aiSummary, "passport", "print")} className="inline-flex items-center gap-2 rounded-2xl border border-slate-200 bg-white px-5 py-3 font-semibold text-slate-700">
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
