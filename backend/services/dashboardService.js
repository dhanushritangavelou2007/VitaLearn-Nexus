import { getRepository } from "../repositories/index.js";

function parsePercent(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseNumber(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function calculateHealthScore(student) {
  const bmi = parseNumber(student?.vitals?.bmi);
  const attendance = parsePercent(student?.attendance);
  const temperature = parseNumber(student?.vitals?.temperature);
  const heartRate = parseNumber(student?.vitals?.heartRate);
  const symptoms = student?.symptoms || [];
  const activeSymptoms = symptoms.filter((symptom) => symptom && symptom !== "None").length;
  const conditions = (student?.medicalConditions || []).filter((condition) => condition && condition !== "None").length;

  let score = 100;
  if (bmi && (bmi < 18.5 || bmi > 24.9)) score -= 8;
  if (attendance < 90) score -= 10;
  if (temperature >= 100.4) score -= 14;
  if (heartRate && (heartRate < 60 || heartRate > 110)) score -= 8;
  score -= activeSymptoms * 6;
  score -= conditions * 5;
  score -= (student?.risk === "Moderate" ? 1 : student?.risk === "High Risk" ? 2 : student?.risk === "Critical" ? 3 : 0) * 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function getDashboardSummary() {
  const userRepo = getRepository("User");
  const studentRepo = getRepository("Student");
  const reportRepo = getRepository("Report");
  const appointmentRepo = getRepository("Appointment");
  const notificationRepo = getRepository("Notification");

  const [users, students, reports, appointments, notifications, studentDocs, teacherCount, doctorCount, parentCount, adminCount] = await Promise.all([
    userRepo.countDocuments(),
    studentRepo.countDocuments(),
    reportRepo.countDocuments(),
    appointmentRepo.countDocuments(),
    notificationRepo.countDocuments(),
    studentRepo.find(),
    userRepo.countDocuments({ role: "teacher" }),
    userRepo.countDocuments({ role: "doctor" }),
    userRepo.countDocuments({ role: "parent" }),
    userRepo.countDocuments({ role: "admin" }),
  ]);

  const total = studentDocs.length;
  const riskDistribution = studentDocs.reduce(
    (distribution, student) => ({
      ...distribution,
      [student.risk]: (distribution[student.risk] || 0) + 1,
    }),
    { Healthy: 0, Moderate: 0, "High Risk": 0, Critical: 0 }
  );
  const healthScores = studentDocs.map(calculateHealthScore);
  const average = (values) =>
    values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return {
    users,
    students,
    reports,
    appointments,
    notifications,
    teacherCount,
    doctorCount,
    parentCount,
    adminCount,
    total,
    healthy: riskDistribution.Healthy,
    critical: riskDistribution.Critical,
    needReview: riskDistribution.Moderate + riskDistribution["High Risk"] + riskDistribution.Critical,
    doctorAttention: riskDistribution.Critical,
    reportsToday: studentDocs.filter((student) => student.lastUpdate === "Today").length,
    pendingReports: studentDocs.reduce(
      (count, student) =>
        count + (student.reports || []).filter((report) => /pending|review|needs/i.test(report.status)).length,
      0
    ),
    reportCount: reports,
    averageAttendance: average(studentDocs.map((student) => parsePercent(student.attendance))),
    averageBMI: total ? Number((studentDocs.reduce((sum, student) => sum + parseNumber(student.vitals?.bmi), 0) / total).toFixed(1)) : 0,
    averageHealthScore: average(healthScores),
    riskDistribution,
    healthyPercent: total ? Math.round((riskDistribution.Healthy / total) * 100) : 0,
  };
}
