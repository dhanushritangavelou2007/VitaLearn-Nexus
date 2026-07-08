export function generateAIHealthReport(student) {
  const bmi = parseVitalNumber(student?.vitals?.bmi);
  const attendance = parsePercent(student?.attendance);
  const temperature = parseVitalNumber(student?.vitals?.temperature);
  const heartRate = parseVitalNumber(student?.vitals?.heartRate);
  const symptoms = (student?.symptoms || []).filter((s) => s && s !== "None");
  const conditions = (student?.medicalConditions || []).filter((c) => c && c !== "None");
  const vaccinations = student?.vaccinations || [];

  const REQUIRED_VACCINATIONS = ["BCG", "OPV", "COVID-19", "MMR"];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((v) => !vaccinations.includes(v));

  let score = 100;
  if (bmi && (bmi < 18.5 || bmi > 24.9)) score -= 8;
  if (attendance < 90) score -= 10;
  if (temperature >= 100.4) score -= 14;
  if (heartRate && (heartRate < 60 || heartRate > 110)) score -= 8;
  score -= symptoms.length * 6;
  score -= conditions.length * 5;

  score = Math.max(0, Math.min(100, Math.round(score)));

  const hasBreathingConcern = symptoms.some((s) => s.toLowerCase().includes("breath") || s.toLowerCase().includes("wheez"));
  
  let risk = "Healthy";
  if (temperature >= 102 || hasBreathingConcern || score < 60) risk = "Critical";
  else if (score < 75 || symptoms.length >= 2 || missingVaccinations.length >= 2) risk = "High Risk";
  else if (score < 88 || symptoms.length === 1 || missingVaccinations.length === 1) risk = "Moderate";

  const dietRecommendation = bmi < 18.5 ? "Increase caloric intake with nutrient-dense foods." : bmi > 24.9 ? "Focus on balanced meals with lean proteins and vegetables." : "Maintain current balanced diet.";
  const exerciseRecommendation = hasBreathingConcern ? "Avoid strenuous exercise until medically cleared." : "Engage in 60 minutes of moderate-to-vigorous physical activity daily.";
  const preventiveTips = missingVaccinations.length > 0 ? `Schedule missing vaccinations: ${missingVaccinations.join(", ")}.` : "Maintain good hand hygiene and sleep schedule.";
  const doctorAlerts = risk === "Critical" ? "Immediate medical review required." : risk === "High Risk" ? "Schedule a checkup soon." : "No immediate action needed.";
  const emergencyAlerts = (temperature >= 102 || hasBreathingConcern) ? "High priority: Monitor closely and contact guardians." : "None";

  const healthSummary = `${student.name} has a health score of ${score}/100 and is classified as ${risk}. ${bmi ? `BMI is ${bmi}.` : ""} Attendance is ${attendance}%. ${symptoms.length ? `Current symptoms include ${symptoms.join(", ")}.` : "No active symptoms."}`;

  return {
    score,
    risk,
    dietRecommendation,
    exerciseRecommendation,
    preventiveTips,
    doctorAlerts,
    emergencyAlerts,
    healthSummary
  };
}

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
