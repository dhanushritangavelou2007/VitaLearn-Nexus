/**
 * studentAnalytics.js
 * ─────────────────────────────────────────────────────────────
 * Frontend analytics utilities. All HealthScore calculations
 * are delegated to the canonical `healthStatus.js` module.
 * ─────────────────────────────────────────────────────────────
 */
import {
  calculateHealthScore as canonicalHealthScore,
  REQUIRED_VACCINATIONS,
  riskToStatus,
} from "./healthStatus";

// Re-export so consumers that previously imported from here keep working.
export { REQUIRED_VACCINATIONS };

// ─── Helpers ────────────────────────────────────────────────

export function parsePercent(value) {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  const parsed = Number.parseFloat(String(value).replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

export function parseVitalNumber(value) {
  if (value == null) return 0;
  if (typeof value === "number") return Number.isNaN(value) ? 0 : value;
  const parsed = Number.parseFloat(String(value));
  return Number.isFinite(parsed) ? parsed : 0;
}

// ─── Recent Activity ────────────────────────────────────────

export function getRecentActivity(studentList = [], limit = 5) {
  return studentList
    .flatMap((student) =>
      (student.reports || []).map((report) => ({
        id: `${student.id}-${report.date}-${report.type}`,
        studentId: student.id,
        studentName: student.name,
        date: report.date,
        title: report.type,
        description: report.status,
        risk: student.risk,
      }))
    )
    .sort((a, b) => new Date(b.date) - new Date(a.date))
    .slice(0, limit);
}

// ─── Health Score ────────────────────────────────────────────

/**
 * Returns the canonical HealthScore for a student object.
 *
 * Resolution order:
 *  1. student.healthStatus  (e.g. "Healthy", "Need Observation", …)
 *  2. student.healthCondition (legacy field)
 *  3. student.risk (raw risk string bridged via riskToStatus)
 *
 * @param {object} student
 * @returns {number}
 */
export function calculateHealthScore(student) {
  if (!student) return 75;

  // Prefer explicit healthStatus field
  if (student.healthStatus) {
    return canonicalHealthScore(student.healthStatus);
  }

  // Bridge legacy healthCondition field
  if (student.healthCondition) {
    switch (String(student.healthCondition).trim()) {
      case "Healthy":     return canonicalHealthScore("Healthy");
      case "Fever":       return canonicalHealthScore("Need Review");
      case "Asthma Flare":return canonicalHealthScore("Need Observation");
      default:            break;
    }
  }

  // Fall back to risk label
  if (student.risk) {
    return canonicalHealthScore(riskToStatus(student.risk));
  }

  return 75; // Safe fallback
}

// ─── Risk Derivation ─────────────────────────────────────────

export function deriveRisk(student) {
  const score       = calculateHealthScore(student);
  const temperature = parseVitalNumber(student?.vitals?.temperature);
  const symptoms    = student?.symptoms || [];
  const activeSymptoms = symptoms.filter((s) => s && s !== "None");
  const hasBreathingConcern = activeSymptoms.some(
    (s) => s.toLowerCase().includes("breathing") || s.toLowerCase().includes("wheezing")
  );
  const vaccinations = student?.vaccinations || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((v) => !vaccinations.includes(v));

  if (temperature >= 102 || hasBreathingConcern || score <= 45) return "critical";
  if (score <= 60 || activeSymptoms.length >= 2 || missingVaccinations.length >= 2) return "review";
  if (score <= 75 || activeSymptoms.length === 1 || missingVaccinations.length === 1) return "observation";
  return "healthy";
}

// ─── Dashboard Stats ─────────────────────────────────────────

export function calculateDashboardStats(studentList = []) {
  const total = studentList.length;

  const riskDistribution = studentList.reduce(
    (dist, student) => ({
      ...dist,
      [student.risk]: (dist[student.risk] || 0) + 1,
    }),
    { healthy: 0, moderate: 0, high: 0, critical: 0, observation: 0, review: 0 }
  );

  // Normalise legacy vs new risk labels
  const healthy  = riskDistribution.healthy;
  const moderate = riskDistribution.moderate + riskDistribution.observation;
  const high     = riskDistribution.high     + riskDistribution.review;
  const critical = riskDistribution.critical;

  const healthScores = studentList.map(calculateHealthScore);

  const reportCount = studentList.reduce(
    (n, s) => n + (s.reports?.length || 0), 0
  );
  const pendingReports = studentList.reduce(
    (n, s) =>
      n + (s.reports || []).filter((r) => /pending|review|needs/i.test(r.status)).length,
    0
  );
  const pendingVaccinations = studentList.reduce(
    (n, s) => n + REQUIRED_VACCINATIONS.filter((v) => !(s.vaccinations || []).includes(v)).length,
    0
  );

  const average = (values) =>
    values.length
      ? Math.round(values.reduce((sum, v) => sum + v, 0) / values.length)
      : 0;

  return {
    total,
    healthy,
    moderate,
    high,
    critical,
    needReview: moderate + high + critical,
    doctorAttention: critical,
    reportsToday: studentList.filter((s) => s.lastUpdate === "Today").length,
    pendingReports,
    reportCount,
    appointments: 8,   // Mocked for demo
    teacherCount: 12,  // Mocked
    doctorCount: 4,    // Mocked
    parentCount: 18,   // Mocked
    pendingVaccinations,
    averageAttendance: average(studentList.map((s) => parsePercent(s.attendance))),
    averageBMI: total
      ? Number(
          (studentList.reduce((sum, s) => sum + parseVitalNumber(s.vitals?.bmi), 0) / total).toFixed(1)
        ) || 0
      : 0,
    averageHealthScore: average(healthScores) || 0,
    riskDistribution: {
      healthy:  healthy  || 0,
      moderate: moderate || 0,
      high:     high     || 0,
      critical: critical || 0,
    },
    healthyPercent: total ? Math.round((healthy / total) * 100) : 0,
  };
}

// ─── Health Summary ──────────────────────────────────────────

export function generateHealthSummary(student) {
  if (!student) return "No student record is selected for health summary generation.";
  if (student.perfectSummary) return student.perfectSummary;
  if (student.aiSummary)      return student.aiSummary;

  const bmi         = parseVitalNumber(student.vitals?.bmi);
  const attendance  = parsePercent(student.attendance);
  const heartRate   = student.vitals?.heartRate   || "not recorded";
  const temperature = student.vitals?.temperature || "not recorded";
  const symptoms    = (student.symptoms          || []).filter((s) => s && s !== "None");
  const vaccinations = student.vaccinations      || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((v) => !vaccinations.includes(v));
  const conditions  = (student.medicalConditions || []).filter((c) => c && c !== "None");
  const score       = student.healthScore || calculateHealthScore(student);
  const risk        = student.risk        || deriveRisk(student);

  const bmiText = bmi
    ? `BMI is ${bmi}, which ${bmi < 18.5 ? "suggests underweight monitoring" : bmi > 24.9 ? "needs weight trend review" : "is within a healthy range"}`
    : "BMI is not recorded";
  const symptomText = symptoms.length
    ? `Current symptoms include ${symptoms.join(", ")}`
    : "No active symptoms are currently recorded";
  const vaccineText = missingVaccinations.length
    ? `Vaccination record is incomplete for ${missingVaccinations.join(", ")}`
    : "Core vaccinations are recorded";
  const conditionText = conditions.length
    ? `Known medical conditions: ${conditions.join(", ")}`
    : "No chronic medical condition is recorded";

  return `${student.name} has a health score of ${score}/100 and is classified as ${risk}. ${bmiText}. Attendance is ${attendance}%, heart rate is ${heartRate}, and temperature is ${temperature}. ${symptomText}. ${vaccineText}. ${conditionText}. Continue school-level observation, keep guardians informed for new symptoms, and escalate to qualified healthcare professionals for diagnosis or treatment decisions.`;
}
