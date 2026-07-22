/**
 * healthStatus.js
 * ─────────────────────────────────────────────────────────────
 * Canonical source of truth for the VitaLearn Health System.
 * Import these constants and functions everywhere — never
 * duplicate the mapping logic in individual files.
 * ─────────────────────────────────────────────────────────────
 */

/** The four mandatory school vaccinations tracked by the system. */
export const REQUIRED_VACCINATIONS = ["BCG", "OPV", "COVID-19", "MMR"];

/** Total number of required vaccinations (hardcoded capacity = 4). */
export const TOTAL_VACCINATIONS = 4;

/**
 * Maps a canonical HealthStatus string to its numeric HealthScore.
 *
 * HealthStatus   → HealthScore
 * ─────────────────────────────
 * "Healthy"            →  95
 * "Need Observation"   →  75
 * "Need Review"        →  60
 * "Critical"           →  45
 *
 * Falls back to 75 for any unknown / legacy status values.
 *
 * @param {string} status - The student's health status string.
 * @returns {number} The corresponding numeric health score (0–100).
 */
export function calculateHealthScore(status) {
  switch (String(status || "").trim()) {
    case "Healthy":          return 95;
    case "Need Observation": return 75;
    case "Need Review":      return 60;
    case "Critical":         return 45;
    // ── Legacy / mapped labels ──────────────────────────────
    case "observation":      return 75;
    case "review":           return 60;
    case "critical":         return 45;
    case "healthy":          return 95;
    default:                 return 75; // Safe fallback
  }
}

/**
 * Derives a canonical HealthStatus label from a raw risk string.
 * Bridges old risk keys ("observation", "review") to display labels.
 *
 * @param {string} risk - Raw risk value stored on the student record.
 * @returns {string} Human-readable HealthStatus label.
 */
export function riskToStatus(risk) {
  switch (String(risk || "").toLowerCase().trim()) {
    case "healthy":      return "Healthy";
    case "observation":
    case "moderate":     return "Need Observation";
    case "review":
    case "high":         return "Need Review";
    case "critical":     return "Critical";
    default:             return "Need Observation";
  }
}

/**
 * Calculates vaccination progress percentage.
 * Supports both legacy string arrays and new object arrays.
 *
 * @param {Array} completedVaccinations - Array of vaccine name strings or objects.
 * @returns {{ completed: number, total: number, percent: number }}
 */
export function getVaccinationProgress(completedVaccinations = []) {
  const names = (completedVaccinations || []).map((v) => {
    if (!v) return null;
    if (typeof v === "string") return v;
    return v.status === "completed" ? v.name : null;
  }).filter(Boolean);

  const validCompleted = names.filter((v) => REQUIRED_VACCINATIONS.includes(v));
  const completed = Math.min(validCompleted.length, TOTAL_VACCINATIONS);
  const percent = Math.round((completed / TOTAL_VACCINATIONS) * 100);
  return { completed, total: TOTAL_VACCINATIONS, percent };
}
