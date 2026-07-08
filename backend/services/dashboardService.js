import User from "../models/User.js";
import Student from "../models/Student.js";
import Report from "../models/Report.js";
import Appointment from "../models/Appointment.js";
import Notification from "../models/Notification.js";

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
  score -= (student?.risk === "observation" ? 1 : student?.risk === "review" ? 2 : student?.risk === "critical" ? 3 : 0) * 8;

  return Math.max(0, Math.min(100, Math.round(score)));
}

export async function getDashboardSummary() {
  const [users, students, reports, appointments, notifications, studentDocs, teacherCount, doctorCount, parentCount, adminCount] = await Promise.all([
    User.countDocuments(),
    Student.countDocuments(),
    Report.countDocuments(),
    Appointment.countDocuments(),
    Notification.countDocuments(),
    Student.find().lean(),
    User.countDocuments({ role: "teacher" }),
    User.countDocuments({ role: "doctor" }),
    User.countDocuments({ role: "parent" }),
    User.countDocuments({ role: "admin" }),
  ]);

  const total = studentDocs.length;
  const riskDistribution = studentDocs.reduce(
    (distribution, student) => ({
      ...distribution,
      [student.risk]: (distribution[student.risk] || 0) + 1,
    }),
    { healthy: 0, observation: 0, review: 0, critical: 0 }
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
    healthy: riskDistribution.healthy,
    critical: riskDistribution.critical,
    needReview: riskDistribution.observation + riskDistribution.review + riskDistribution.critical,
    doctorAttention: riskDistribution.critical,
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
    healthyPercent: total ? Math.round((riskDistribution.healthy / total) * 100) : 0,
  };
}
