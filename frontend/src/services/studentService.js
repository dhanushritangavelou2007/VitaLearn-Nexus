import initialStudents from "../data/students";
import { calculateHealthScore, deriveRisk, generateHealthSummary } from "../utils/studentAnalytics";

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

function enrichStudent(student) {
  const risk = student.risk || deriveRisk(student);
  const healthScore = calculateHealthScore({ ...student, risk });
  return {
    ...student,
    risk,
    healthScore,
    aiSummary: generateHealthSummary({ ...student, risk, healthScore }),
  };
}

export function getInitialStudents() {
  return initialStudents.map((student) => enrichStudent({ ...student }));
}

export function findStudentById(students, id) {
  return students.find((student) => String(student.id) === String(id));
}

export function createStudent(students, payload) {
  const nextId = students.length ? Math.max(...students.map((student) => Number(student.id) || 0)) + 1 : 1;
  return enrichStudent({
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
}

export function addStudent(students, payload) {
  return [...students, createStudent(students, payload)];
}

export function updateStudent(students, id, updates) {
  return students.map((student) =>
    String(student.id) === String(id) ? enrichStudent({ ...student, ...updates, lastUpdate: todayLabel }) : student
  );
}

export function deleteStudent(students, id) {
  return students.filter((student) => String(student.id) !== String(id));
}

export function updateSymptoms(students, id, symptomReport) {
  return students.map((student) => {
    if (String(student.id) !== String(id)) return student;

    const newSymptoms = normalizeList(symptomReport.symptoms);
    const existingSymptoms = (student.symptoms || []).filter((symptom) => symptom !== "None");
    const symptoms = Array.from(new Set([...existingSymptoms, ...newSymptoms]));
    const reports = [
      ...(student.reports || []),
      {
        date: symptomReport.date,
        type: "Symptom Report",
        status: `${newSymptoms.join(", ")} - Severity ${symptomReport.severity}/10`,
        notes: symptomReport.notes,
      },
    ];
    const vitals = symptomReport.temperature
      ? { ...student.vitals, temperature: `${symptomReport.temperature} F` }
      : student.vitals;

    return enrichStudent({
      ...student,
      symptoms: symptoms.length ? symptoms : ["None"],
      reports,
      vitals,
      risk: symptomReport.severity >= 8 ? "critical" : symptomReport.severity >= 5 ? "review" : undefined,
      lastUpdate: todayLabel,
    });
  });
}

export function updateVitals(students, id, vitals) {
  return students.map((student) =>
    String(student.id) === String(id)
      ? enrichStudent({ ...student, vitals: { ...student.vitals, ...vitals }, lastUpdate: todayLabel })
      : student
  );
}

export function updateReports(students, id, reports) {
  return students.map((student) =>
    String(student.id) === String(id)
      ? enrichStudent({
          ...student,
          reports: Array.isArray(reports) ? reports : [...(student.reports || []), reports],
          lastUpdate: todayLabel,
        })
      : student
  );
}
