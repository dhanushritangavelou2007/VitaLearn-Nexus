import api from "./api";
import initialStudents from "../data/students";
import { calculateHealthScore, deriveRisk, generateHealthSummary } from "../utils/studentAnalytics";

const todayLabel = "Today";

const demoStore = {
  students: cloneStudents(initialStudents),
  reports: [],
  appointments: [],
};

function clone(value) {
  return JSON.parse(JSON.stringify(value));
}

function cloneStudents(items) {
  return clone(items).map(mapStudent);
}

function normalizeList(value) {
  if (Array.isArray(value)) return value.filter(Boolean);
  if (!value) return ["None"];
  const list = String(value)
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
  return list.length ? list : ["None"];
}

function mapStudent(student) {
  if (!student) return null;
  const reports = (student.reports || []).map((report) => ({
    ...report,
    id: report._id || report.id || `${student.id}-${report.date}-${report.type}`,
  }));
  const risk = student.risk || deriveRisk(student);
  const healthScore = student.healthScore || calculateHealthScore({ ...student, risk });

  return {
    ...student,
    reports,
    allergies: normalizeList(student.allergies),
    medicalConditions: normalizeList(student.medicalConditions),
    vaccinations: normalizeList(student.vaccinations),
    risk,
    healthScore,
    aiSummary: student.aiSummary || generateHealthSummary({ ...student, risk, healthScore }),
  };
}

function localGetStudents() {
  return { students: demoStore.students.map(mapStudent), pagination: null };
}

function localGetStudentById(id) {
  return demoStore.students.find((student) => String(student.id) === String(id)) || null;
}

function localCreateStudent(payload) {
  const nextId = demoStore.students.length ? Math.max(...demoStore.students.map((student) => Number(student.id) || 0)) + 1 : 1;
  const student = mapStudent({
    id: nextId,
    rollNo: payload.rollNo,
    name: payload.name,
    class: payload.class || [payload.className, payload.section].filter(Boolean).join("-"),
    gender: payload.gender,
    dob: payload.dob,
    bloodGroup: payload.bloodGroup,
    parent: {
      name: payload.parentName,
      contact: payload.emergencyContact || payload.parentPhone,
      email: payload.parentEmail || "Not provided",
    },
    allergies: normalizeList(payload.allergies),
    medicalConditions: normalizeList(payload.medicalConditions),
    vitals: {
      height: payload.height || "Not recorded",
      weight: payload.weight || "Not recorded",
      bmi: payload.bmi || 0,
      vision: payload.vision || "Not recorded",
      bloodPressure: payload.bloodPressure || "Not recorded",
      heartRate: payload.heartRate || "Not recorded",
      temperature: payload.temperature || "Not recorded",
    },
    vaccinations: normalizeList(payload.vaccinations),
    symptoms: ["None"],
    reports: [],
    attendance: payload.attendance || "100%",
    lastUpdate: todayLabel,
    passportStatus: "Completed",
  });
  demoStore.students.unshift(student);
  return student;
}

function localUpdateStudent(id, updates) {
  const index = demoStore.students.findIndex((student) => String(student.id) === String(id));
  if (index === -1) return null;
  const updated = mapStudent({ ...demoStore.students[index], ...updates, lastUpdate: todayLabel });
  demoStore.students[index] = updated;
  return updated;
}

function localDeleteStudent(id) {
  demoStore.students = demoStore.students.filter((student) => String(student.id) !== String(id));
  return true;
}

function localCreateSymptomReport(payload) {
  const student = localGetStudentById(payload.student);
  if (!student) return null;
  const newSymptoms = normalizeList(payload.symptoms);
  const existingSymptoms = (student.symptoms || []).filter((symptom) => symptom !== "None");
  const symptoms = Array.from(new Set([...existingSymptoms, ...newSymptoms]));
  const report = {
    id: `symptom-${Date.now()}`,
    date: payload.date,
    type: "Symptom Report",
    status: `${newSymptoms.join(", ")} - Severity ${payload.severity}/10`,
    notes: payload.notes,
  };
  student.symptoms = symptoms.length ? symptoms : ["None"];
  student.reports = [...(student.reports || []), report];
  student.risk = payload.severity >= 8 ? "critical" : payload.severity >= 5 ? "review" : student.risk;
  student.healthScore = calculateHealthScore(student);
  student.aiSummary = generateHealthSummary(student);
  student.lastUpdate = todayLabel;
  return report;
}

function localCreateReport(payload) {
  const student = localGetStudentById(payload.student);
  if (!student) return null;
  const report = {
    id: `report-${Date.now()}`,
    date: payload.date || todayLabel,
    type: payload.type || "General Report",
    status: payload.status || "Recorded",
    notes: payload.notes || "",
  };
  student.reports = [...(student.reports || []), report];
  student.healthScore = calculateHealthScore(student);
  student.aiSummary = generateHealthSummary(student);
  student.lastUpdate = todayLabel;
  return report;
}

function localCreateAppointment(payload) {
  const appointment = { id: `appointment-${Date.now()}`, ...payload };
  demoStore.appointments.unshift(appointment);
  return appointment;
}

function localDashboardSummary() {
  const students = demoStore.students;
  const total = students.length;
  const riskDistribution = students.reduce(
    (distribution, student) => ({
      ...distribution,
      [student.risk]: (distribution[student.risk] || 0) + 1,
    }),
    { healthy: 0, observation: 0, review: 0, critical: 0 }
  );
    const scores = students.map((student) => Number(student.healthScore) || 0);
  const average = (values) =>
    values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return {
    total,
    healthy: riskDistribution.healthy,
    critical: riskDistribution.critical,
    needReview: riskDistribution.observation + riskDistribution.review + riskDistribution.critical,
    doctorAttention: riskDistribution.critical,
    reportsToday: students.filter((student) => student.lastUpdate === todayLabel).length,
    pendingReports: students.reduce(
      (count, student) =>
        count + (student.reports || []).filter((report) => /pending|review|needs/i.test(report.status)).length,
      0
    ),
    reportCount: students.reduce((count, student) => count + (student.reports?.length || 0), 0),
    averageAttendance: average(students.map((student) => Number(String(student.attendance || "").replace("%", "")) || 0)),
    averageBMI: total
      ? Number((students.reduce((sum, student) => sum + Number(student.vitals?.bmi || 0), 0) / total).toFixed(1))
      : 0,
    averageHealthScore: average(scores),
    riskDistribution,
    healthyPercent: total ? Math.round((riskDistribution.healthy / total) * 100) : 0,
  };
}

async function requestWithFallback(request, fallback) {
  try {
    return await request();
  } catch {
    return fallback();
  }
}

export async function getStudents(params = {}) {
  return requestWithFallback(async () => {
    const { data } = await api.get("/students", { params });
    const students = data.data || data.items || [];
    return {
      students: students.map(mapStudent),
      pagination: data.pagination || data.meta || null,
    };
  }, localGetStudents);
}

export async function getStudentById(id) {
  return requestWithFallback(async () => {
    const { data } = await api.get(`/students/${id}`);
    return mapStudent(data.data || data.student || data);
  }, () => mapStudent(localGetStudentById(id)));
}

export async function createStudent(payload) {
  return requestWithFallback(async () => {
    const { data } = await api.post("/students", payload);
    return mapStudent(data.data || data);
  }, () => localCreateStudent(payload));
}

export async function updateStudent(id, updates) {
  return requestWithFallback(async () => {
    const { data } = await api.patch(`/students/${id}`, updates);
    return mapStudent(data.data || data);
  }, () => localUpdateStudent(id, updates));
}

export async function deleteStudent(id) {
  return requestWithFallback(async () => {
    await api.delete(`/students/${id}`);
    return true;
  }, () => localDeleteStudent(id));
}

export async function createSymptomReport(payload) {
  return requestWithFallback(async () => {
    const { data } = await api.post("/symptoms", payload);
    return data.data || data;
  }, () => localCreateSymptomReport(payload));
}

export async function createReport(payload) {
  return requestWithFallback(async () => {
    const { data } = await api.post("/reports", payload);
    return data.data || data;
  }, () => localCreateReport(payload));
}

export async function createAppointment(payload) {
  return requestWithFallback(async () => {
    const { data } = await api.post("/appointments", payload);
    return data.data || data;
  }, () => localCreateAppointment(payload));
}

export async function getDashboardSummary() {
  return requestWithFallback(async () => {
    const { data } = await api.get("/dashboard");
    return data.data || data;
  }, localDashboardSummary);
}

export async function getReports(params = {}) {
  return requestWithFallback(async () => {
    const { data } = await api.get("/reports", { params });
    return {
      reports: data.data || data.items || [],
      pagination: data.pagination || null,
    };
  }, () => ({
    reports: demoStore.students.flatMap((student) =>
      (student.reports || []).map((report) => ({
        ...report,
        studentId: student.id,
        studentName: student.name,
        risk: student.risk,
      }))
    ),
    pagination: null,
  }));
}
