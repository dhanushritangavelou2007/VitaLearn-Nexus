import api from "./api";

const todayLabel = "Today";

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
  const reports = (student.reports || []).map((report) => ({
    ...report,
    id: report._id || report.id || `${student.id}-${report.date}-${report.type}`,
  }));

  return {
    ...student,
    reports,
    allergies: normalizeList(student.allergies),
    medicalConditions: normalizeList(student.medicalConditions),
    vaccinations: normalizeList(student.vaccinations),
  };
}

export async function getStudents(params = {}) {
  const { data } = await api.get("/students", { params });
  const students = data.data || data.items || [];
  return {
    students: students.map(mapStudent),
    pagination: data.pagination || data.meta || null,
  };
}

export async function getStudentById(id) {
  const { data } = await api.get(`/students/${id}`);
  return mapStudent(data.data || data.student || data);
}

export async function createStudent(payload) {
  const { data } = await api.post("/students", payload);
  return mapStudent(data.data || data);
}

export async function updateStudent(id, updates) {
  const { data } = await api.patch(`/students/${id}`, updates);
  return mapStudent(data.data || data);
}

export async function deleteStudent(id) {
  await api.delete(`/students/${id}`);
  return true;
}

export async function createSymptomReport(payload) {
  const { data } = await api.post("/symptoms", payload);
  return data.data || data;
}

export async function createReport(payload) {
  const { data } = await api.post("/reports", payload);
  return data.data || data;
}

export async function createAppointment(payload) {
  const { data } = await api.post("/appointments", payload);
  return data.data || data;
}

export async function getDashboardSummary() {
  const { data } = await api.get("/dashboard");
  return data.data || data;
}

export async function getReports(params = {}) {
  const { data } = await api.get("/reports", { params });
  return {
    reports: data.data || data.items || [],
    pagination: data.pagination || null,
  };
}

