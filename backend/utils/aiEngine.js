/**
 * aiEngine.js  — Backend Health AI Engine
 * ─────────────────────────────────────────────────────────────
 * Canonical HealthStatus → HealthScore mapping (matches frontend):
 *
 *   "Healthy"           → 95
 *   "Need Observation"  → 75
 *   "Need Review"       → 60
 *   "Critical"          → 45
 *
 * Risk derivation and AI health report generation live here.
 * ─────────────────────────────────────────────────────────────
 */

const REQUIRED_VACCINATIONS = ["BCG", "OPV", "COVID-19", "MMR"];

// ─── Canonical Status → Score Map ───────────────────────────

/**
 * Maps a HealthStatus label (or legacy risk string) to its numeric score.
 * Single source of truth for the backend — mirrors healthStatus.js on the frontend.
 *
 * @param {string} status
 * @returns {number}
 */
function scoreFromStatus(status) {
  switch (String(status || "").trim()) {
    case "Healthy":
    case "healthy":          return 95;
    case "Need Observation":
    case "observation":
    case "moderate":         return 75;
    case "Need Review":
    case "review":
    case "high":             return 60;
    case "Critical":
    case "critical":         return 45;
    default:                 return 75;
  }
}

// ─── Score Derivation from Student Record ────────────────────

/**
 * Resolves the HealthScore for a student record.
 *
 * Priority:
 *  1. student.healthStatus  (canonical label)
 *  2. student.healthCondition (legacy label — mapped to canonical)
 *  3. student.risk (raw stored risk)
 *
 * @param {object} student
 * @returns {number}
 */
function resolveHealthScore(student) {
  if (!student) return 75;

  if (student.healthStatus) return scoreFromStatus(student.healthStatus);

  if (student.healthCondition) {
    switch (String(student.healthCondition).trim()) {
      case "Healthy":      return 95;
      case "Fever":        return 60; // → Need Review
      case "Asthma Flare": return 75; // → Need Observation
      default:             break;
    }
  }

  if (student.risk) return scoreFromStatus(student.risk);

  return 75;
}

// ─── Risk Derivation ─────────────────────────────────────────

/**
 * Derives the canonical risk label from vitals, symptoms, and score.
 * Returns one of: "Healthy" | "Need Observation" | "Need Review" | "Critical"
 */
function resolveRisk(student, score) {
  const temperature    = parseVitalNumber(student?.vitals?.temperature);
  const symptoms       = (student?.symptoms || []).filter((s) => s && s !== "None");
  const vaccinations   = student?.vaccinations || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((v) => !vaccinations.includes(v));
  const hasBreathing   = symptoms.some(
    (s) => s.toLowerCase().includes("breath") || s.toLowerCase().includes("wheez")
  );

  if (temperature >= 102 || hasBreathing || score <= 45) return "Critical";
  if (score <= 60 || symptoms.length >= 2 || missingVaccinations.length >= 2) return "Need Review";
  if (score <= 75 || symptoms.length === 1 || missingVaccinations.length === 1) return "Need Observation";
  return "Healthy";
}

// ─── Main Export ─────────────────────────────────────────────

export function generateAIHealthReport(student) {
  const bmi         = parseVitalNumber(student?.vitals?.bmi);
  const attendance  = parsePercent(student?.attendance);
  const temperature = parseVitalNumber(student?.vitals?.temperature);
  const symptoms    = (student?.symptoms || []).filter((s) => s && s !== "None");
  const conditions  = (student?.medicalConditions || []).filter((c) => c && c !== "None");
  const vaccinations = student?.vaccinations || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((v) => !vaccinations.includes(v));

  // Canonical score from status → canonical risk from vitals
  const score = resolveHealthScore(student);
  const risk  = resolveRisk(student, score);

  const dietRecommendation = bmi < 18.5
    ? "Increase caloric intake with nutrient-dense foods."
    : bmi > 24.9
    ? "Focus on balanced meals with lean proteins and vegetables."
    : "Maintain current balanced diet.";

  const hasBreathing = symptoms.some(
    (s) => s.toLowerCase().includes("breath") || s.toLowerCase().includes("wheez")
  );
  const exerciseRecommendation = hasBreathing
    ? "Avoid strenuous exercise until medically cleared."
    : "Engage in 60 minutes of moderate-to-vigorous physical activity daily.";

  const preventiveTips = missingVaccinations.length > 0
    ? `Schedule missing vaccinations: ${missingVaccinations.join(", ")}.`
    : "Maintain good hand hygiene and sleep schedule.";

  const doctorAlerts = risk === "Critical"
    ? "Immediate medical review required."
    : risk === "Need Review"
    ? "Schedule a checkup soon."
    : "No immediate action needed.";

  const emergencyAlerts = (temperature >= 102 || hasBreathing)
    ? "High priority: Monitor closely and contact guardians."
    : "None";

  const healthSummary = `${student.name} has a health score of ${score}/100 and is classified as ${risk}. ${
    bmi ? `BMI is ${bmi}.` : ""
  } Attendance is ${attendance}%. ${
    symptoms.length ? `Current symptoms include ${symptoms.join(", ")}.` : "No active symptoms."
  }`;

  return {
    score,
    risk,
    dietRecommendation,
    exerciseRecommendation,
    preventiveTips,
    doctorAlerts,
    emergencyAlerts,
    healthSummary,
  };
}

// ─── Private Helpers ─────────────────────────────────────────

function parsePercent(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || "").replace("%", ""));
  return Number.isFinite(parsed) ? parsed : 0;
}

function parseVitalNumber(value) {
  if (typeof value === "number") return value;
  const parsed = Number.parseFloat(String(value || ""));
  return Number.isFinite(parsed) ? parsed : 0;
}
