const RISK_ORDER = {
  healthy: 0,
  moderate: 1,
  high: 2,
  critical: 3,
};

const REQUIRED_VACCINATIONS = ["BCG", "OPV", "COVID-19", "MMR"];

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

export function calculateHealthScore(student) {
  const bmi = parseVitalNumber(student?.vitals?.bmi);
  const attendance = parsePercent(student?.attendance);
  const temperature = parseVitalNumber(student?.vitals?.temperature);
  const heartRate = parseVitalNumber(student?.vitals?.heartRate);
  const symptoms = student?.symptoms || [];
  const activeSymptoms = symptoms.filter((symptom) => symptom && symptom !== "None").length;
  const conditions = (student?.medicalConditions || []).filter((condition) => condition && condition !== "None").length;

  let score = 100;
  if (bmi > 0 && (bmi < 18.5 || bmi > 24.9)) score -= 8;
  if (attendance > 0 && attendance < 90) score -= 10;
  if (temperature >= 100.4) score -= 14;
  if (heartRate > 0 && (heartRate < 60 || heartRate > 110)) score -= 8;
  score -= activeSymptoms * 6;
  score -= conditions * 5;
  score -= (RISK_ORDER[student?.risk?.toLowerCase()] || 0) * 8;

  const finalScore = Math.max(0, Math.min(100, Math.round(score)));
  return Number.isNaN(finalScore) ? 100 : finalScore;
}

export function deriveRisk(student) {
  const score = calculateHealthScore(student);
  const temperature = parseVitalNumber(student?.vitals?.temperature);
  const symptoms = student?.symptoms || [];
  const activeSymptoms = symptoms.filter((symptom) => symptom && symptom !== "None");
  const hasBreathingConcern = activeSymptoms.some((symptom) =>
    symptom.toLowerCase().includes("breathing") || symptom.toLowerCase().includes("wheezing")
  );
  
  const vaccinations = student?.vaccinations || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((vaccine) => !vaccinations.includes(vaccine));

  if (temperature >= 102 || hasBreathingConcern || score < 60) return "critical";
  if (score < 75 || activeSymptoms.length >= 2 || missingVaccinations.length >= 2) return "high";
  if (score < 88 || activeSymptoms.length === 1 || missingVaccinations.length === 1) return "moderate";
  return "healthy";
}

export function calculateDashboardStats(studentList = []) {
  const total = studentList.length;
  const riskDistribution = studentList.reduce(
    (distribution, student) => ({
      ...distribution,
      [student.risk]: (distribution[student.risk] || 0) + 1,
    }),
    { healthy: 0, moderate: 0, high: 0, critical: 0, observation: 0, review: 0 }
  );
  
  // Normalize risk based on old labels vs new labels
  const healthy = riskDistribution.healthy;
  const moderate = riskDistribution.moderate + riskDistribution.observation;
  const high = riskDistribution.high + riskDistribution.review;
  const critical = riskDistribution.critical;
  
  const healthScores = studentList.map(calculateHealthScore);
  const reportCount = studentList.reduce((count, student) => count + (student.reports?.length || 0), 0);
  const pendingReports = studentList.reduce(
    (count, student) =>
      count + (student.reports || []).filter((report) => /pending|review|needs/i.test(report.status)).length,
    0
  );
  
  const pendingVaccinations = studentList.reduce(
    (count, student) => count + REQUIRED_VACCINATIONS.filter(v => !(student.vaccinations || []).includes(v)).length,
    0
  );

  const average = (values) =>
    values.length ? Math.round(values.reduce((sum, value) => sum + value, 0) / values.length) : 0;

  return {
    total,
    healthy,
    moderate,
    high,
    critical,
    needReview: moderate + high + critical,
    doctorAttention: critical,
    reportsToday: studentList.filter((student) => student.lastUpdate === "Today").length,
    pendingReports,
    reportCount,
    appointments: 8, // Mocked for hackathon dashboard
    teacherCount: 12, // Mocked
    doctorCount: 4, // Mocked
    parentCount: 18, // Mocked
    pendingVaccinations,
    averageAttendance: average(studentList.map((student) => parsePercent(student.attendance))),
    averageBMI: total
      ? Number(
          (
            studentList.reduce((sum, student) => sum + parseVitalNumber(student.vitals?.bmi), 0) / total
          ).toFixed(1)
        ) || 0
      : 0,
    averageHealthScore: average(healthScores) || 0,
    riskDistribution: { healthy: healthy || 0, moderate: moderate || 0, high: high || 0, critical: critical || 0 },
    healthyPercent: total ? Math.round((healthy / total) * 100) : 0,
  };
}

export function generateHealthSummary(student) {
  if (!student) return "No student record is selected for health summary generation.";
  if (student.aiSummary) return student.aiSummary;

  const bmi = parseVitalNumber(student.vitals?.bmi);
  const attendance = parsePercent(student.attendance);
  const heartRate = student.vitals?.heartRate || "not recorded";
  const temperature = student.vitals?.temperature || "not recorded";
  const symptoms = (student.symptoms || []).filter((symptom) => symptom && symptom !== "None");
  const vaccinations = student.vaccinations || [];
  const missingVaccinations = REQUIRED_VACCINATIONS.filter((vaccine) => !vaccinations.includes(vaccine));
  const conditions = (student.medicalConditions || []).filter((condition) => condition && condition !== "None");
  const score = student.healthScore || calculateHealthScore(student);
  const risk = student.risk || deriveRisk(student);

  const bmiText = bmi
    ? `BMI is ${bmi}, which ${bmi < 18.5 ? "suggests underweight monitoring" : bmi > 24.9 ? "needs weight trend review" : "is within a healthy range"}`
    : "BMI is not recorded";
  const symptomText = symptoms.length ? `Current symptoms include ${symptoms.join(", ")}` : "No active symptoms are currently recorded";
  const vaccineText = missingVaccinations.length
    ? `Vaccination record is incomplete for ${missingVaccinations.join(", ")}`
    : "Core vaccinations are recorded";
  const conditionText = conditions.length
    ? `Known medical conditions: ${conditions.join(", ")}`
    : "No chronic medical condition is recorded";

  return `${student.name} has a health score of ${score}/100 and is classified as ${risk}. ${bmiText}. Attendance is ${attendance}%, heart rate is ${heartRate}, and temperature is ${temperature}. ${symptomText}. ${vaccineText}. ${conditionText}. Continue school-level observation, keep guardians informed for new symptoms, and escalate to qualified healthcare professionals for diagnosis or treatment decisions.`;
}
