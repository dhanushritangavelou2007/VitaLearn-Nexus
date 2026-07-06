export const students = [
  {
    id: 1,
    rollNo: "8A01",
    name: "Aarav Sharma",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-04-15",
    bloodGroup: "O+",
    parent: { name: "Rajesh Sharma", contact: "+91-9876543210", email: "rajesh.s@example.com" },
    allergies: ["Dust"],
    medicalConditions: ["Mild Asthma"],
    vitals: { height: "155 cm", weight: "45 kg", bmi: 18.7, vision: "6/6", bloodPressure: "110/70" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Occasional cough"],
    reports: [{ date: "2024-01-15", type: "General Checkup", status: "Normal" }],
    aiSummary: "Aarav has a history of mild asthma triggered by dust. Vitals are stable. Keep inhaler handy.",
    risk: "observation",
    attendance: "96%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 2,
    rollNo: "8A02",
    name: "Diya Patel",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-07-22",
    bloodGroup: "A+",
    parent: { name: "Suresh Patel", contact: "+91-9876543211", email: "suresh.p@example.com" },
    allergies: ["Peanuts"],
    medicalConditions: ["None"],
    vitals: { height: "152 cm", weight: "42 kg", bmi: 18.2, vision: "6/9", bloodPressure: "105/65" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["None"],
    reports: [{ date: "2024-02-10", type: "Eye Checkup", status: "Needs glasses" }],
    aiSummary: "Diya is healthy overall. Vision needs correction for mild myopia.",
    risk: "healthy",
    attendance: "98%",
    lastUpdate: "Yesterday",
    passportStatus: "Completed"
  },
  {
    id: 3,
    rollNo: "8A03",
    name: "Arjun Kumar",
    class: "VIII-A",
    gender: "Male",
    dob: "2009-11-05",
    bloodGroup: "B+",
    parent: { name: "Vikram Kumar", contact: "+91-9876543212", email: "vikram.k@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "160 cm", weight: "50 kg", bmi: 19.5, vision: "6/6", bloodPressure: "115/75" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Fatigue"],
    reports: [{ date: "2024-03-05", type: "Blood Test", status: "Slight anemia" }],
    aiSummary: "Arjun shows signs of mild fatigue. Dietary adjustments recommended to boost iron levels.",
    risk: "review",
    attendance: "92%",
    lastUpdate: "2 days ago",
    passportStatus: "Completed"
  },
  {
    id: 4,
    rollNo: "8A04",
    name: "Sneha Reddy",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-02-14",
    bloodGroup: "AB+",
    parent: { name: "Kiran Reddy", contact: "+91-9876543213", email: "kiran.r@example.com" },
    allergies: ["Lactose Intolerant"],
    medicalConditions: ["None"],
    vitals: { height: "150 cm", weight: "40 kg", bmi: 17.8, vision: "6/6", bloodPressure: "100/60" },
    vaccinations: ["BCG", "COVID-19", "MMR"],
    symptoms: ["Stomach cramps occasionally"],
    reports: [],
    aiSummary: "Sneha is lactose intolerant. School cafeteria should be notified to avoid dairy products in meals.",
    risk: "healthy",
    attendance: "95%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 5,
    rollNo: "8A05",
    name: "Rohan Singh",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-09-10",
    bloodGroup: "O-",
    parent: { name: "Amit Singh", contact: "+91-9876543214", email: "amit.s@example.com" },
    allergies: ["None"],
    medicalConditions: ["Type 1 Diabetes"],
    vitals: { height: "158 cm", weight: "52 kg", bmi: 20.8, vision: "6/6", bloodPressure: "112/70" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR", "Hepatitis B"],
    symptoms: ["Frequent thirst"],
    reports: [{ date: "2024-03-20", type: "Endocrinology", status: "HbA1c slightly elevated" }],
    aiSummary: "Rohan requires insulin monitoring during school hours. High priority observation for blood sugar levels.",
    risk: "critical",
    attendance: "85%",
    lastUpdate: "1 hour ago",
    passportStatus: "Pending"
  },
  {
    id: 6,
    rollNo: "8A06",
    name: "Ananya Iyer",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-01-25",
    bloodGroup: "B-",
    parent: { name: "Raman Iyer", contact: "+91-9876543215", email: "raman.i@example.com" },
    allergies: ["Pollen"],
    medicalConditions: ["None"],
    vitals: { height: "154 cm", weight: "44 kg", bmi: 18.5, vision: "6/6", bloodPressure: "108/68" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Sneezing"],
    reports: [{ date: "2023-11-10", type: "Allergy Test", status: "Pollen allergy confirmed" }],
    aiSummary: "Ananya experiences seasonal allergies. Provide antihistamines if symptoms flare up.",
    risk: "observation",
    attendance: "97%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 7,
    rollNo: "8A07",
    name: "Ishaan Verma",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-12-12",
    bloodGroup: "A-",
    parent: { name: "Deepak Verma", contact: "+91-9876543216", email: "deepak.v@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "157 cm", weight: "48 kg", bmi: 19.5, vision: "6/6", bloodPressure: "110/72" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["None"],
    reports: [],
    aiSummary: "Ishaan is in excellent health. No current medical concerns.",
    risk: "healthy",
    attendance: "99%",
    lastUpdate: "Yesterday",
    passportStatus: "Completed"
  },
  {
    id: 8,
    rollNo: "8A08",
    name: "Kavya Menon",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-06-18",
    bloodGroup: "O+",
    parent: { name: "Prakash Menon", contact: "+91-9876543217", email: "prakash.m@example.com" },
    allergies: ["Soy"],
    medicalConditions: ["None"],
    vitals: { height: "153 cm", weight: "43 kg", bmi: 18.4, vision: "6/6", bloodPressure: "105/65" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Skin rash occasionally"],
    reports: [{ date: "2024-01-20", type: "Dermatology", status: "Mild dermatitis" }],
    aiSummary: "Kavya has mild contact dermatitis and soy allergy. Dietary restrictions needed.",
    risk: "observation",
    attendance: "94%",
    lastUpdate: "3 days ago",
    passportStatus: "Completed"
  },
  {
    id: 9,
    rollNo: "8A09",
    name: "Aryan Gupta",
    class: "VIII-A",
    gender: "Male",
    dob: "2009-08-30",
    bloodGroup: "B+",
    parent: { name: "Sanjay Gupta", contact: "+91-9876543218", email: "sanjay.g@example.com" },
    allergies: ["None"],
    medicalConditions: ["Migraine"],
    vitals: { height: "162 cm", weight: "55 kg", bmi: 21.0, vision: "6/6", bloodPressure: "115/75" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Headache"],
    reports: [{ date: "2024-02-28", type: "Neurology", status: "Prescribed pain relievers" }],
    aiSummary: "Aryan suffers from occasional migraines. Needs a quiet space if an episode occurs.",
    risk: "review",
    attendance: "89%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 10,
    rollNo: "8A10",
    name: "Meera Nair",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-03-05",
    bloodGroup: "AB-",
    parent: { name: "Rajiv Nair", contact: "+91-9876543219", email: "rajiv.n@example.com" },
    allergies: ["Dust Mites"],
    medicalConditions: ["Asthma"],
    vitals: { height: "151 cm", weight: "41 kg", bmi: 18.0, vision: "6/12", bloodPressure: "102/62" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Wheezing"],
    reports: [{ date: "2024-04-01", type: "Pulmonology", status: "Moderate asthma control" }],
    aiSummary: "Meera requires an inhaler for asthma and wears corrective lenses. Keep away from dusty areas.",
    risk: "critical",
    attendance: "88%",
    lastUpdate: "Today",
    passportStatus: "Pending"
  },
  {
    id: 11,
    rollNo: "8A11",
    name: "Aditya Desai",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-05-14",
    bloodGroup: "O+",
    parent: { name: "Kunal Desai", contact: "+91-9876543220", email: "kunal.d@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "159 cm", weight: "49 kg", bmi: 19.4, vision: "6/6", bloodPressure: "110/70" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["None"],
    reports: [],
    aiSummary: "Aditya is generally healthy with stable vitals.",
    risk: "healthy",
    attendance: "96%",
    lastUpdate: "Yesterday",
    passportStatus: "Completed"
  },
  {
    id: 12,
    rollNo: "8A12",
    name: "Zara Khan",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-10-02",
    bloodGroup: "B+",
    parent: { name: "Imran Khan", contact: "+91-9876543221", email: "imran.k@example.com" },
    allergies: ["Penicillin"],
    medicalConditions: ["None"],
    vitals: { height: "156 cm", weight: "46 kg", bmi: 18.9, vision: "6/6", bloodPressure: "106/66" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["None"],
    reports: [{ date: "2023-08-15", type: "Allergy Test", status: "Penicillin allergy noted" }],
    aiSummary: "Zara is healthy but has a strict penicillin allergy. Medical records must reflect this during emergencies.",
    risk: "observation",
    attendance: "98%",
    lastUpdate: "1 week ago",
    passportStatus: "Completed"
  },
  {
    id: 13,
    rollNo: "8A13",
    name: "Vivaan Joshi",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-11-20",
    bloodGroup: "A+",
    parent: { name: "Anand Joshi", contact: "+91-9876543222", email: "anand.j@example.com" },
    allergies: ["None"],
    medicalConditions: ["Eczema"],
    vitals: { height: "155 cm", weight: "47 kg", bmi: 19.6, vision: "6/6", bloodPressure: "112/72" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Dry skin patches"],
    reports: [{ date: "2024-01-05", type: "Dermatology", status: "Topical cream prescribed" }],
    aiSummary: "Vivaan has mild eczema. Needs to apply moisturizer regularly, especially during winter.",
    risk: "observation",
    attendance: "95%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 14,
    rollNo: "8A14",
    name: "Pooja Banerjee",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-08-08",
    bloodGroup: "O-",
    parent: { name: "Subhas Banerjee", contact: "+91-9876543223", email: "subhas.b@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "148 cm", weight: "38 kg", bmi: 17.3, vision: "6/6", bloodPressure: "98/60" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Low energy"],
    reports: [{ date: "2024-03-12", type: "Nutrition", status: "Underweight" }],
    aiSummary: "Pooja is slightly underweight. Nutritional counseling and a balanced diet are recommended.",
    risk: "review",
    attendance: "93%",
    lastUpdate: "Yesterday",
    passportStatus: "Pending"
  },
  {
    id: 15,
    rollNo: "8A15",
    name: "Krishna Pillai",
    class: "VIII-A",
    gender: "Male",
    dob: "2009-10-18",
    bloodGroup: "AB+",
    parent: { name: "Hari Pillai", contact: "+91-9876543224", email: "hari.p@example.com" },
    allergies: ["Shellfish"],
    medicalConditions: ["None"],
    vitals: { height: "165 cm", weight: "60 kg", bmi: 22.0, vision: "6/6", bloodPressure: "118/76" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["None"],
    reports: [],
    aiSummary: "Krishna is healthy and athletic. Dietary restriction on shellfish must be noted.",
    risk: "healthy",
    attendance: "100%",
    lastUpdate: "2 days ago",
    passportStatus: "Completed"
  },
  {
    id: 16,
    rollNo: "8A16",
    name: "Sanya Malhotra",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-04-22",
    bloodGroup: "A-",
    parent: { name: "Rakesh Malhotra", contact: "+91-9876543225", email: "rakesh.m@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "154 cm", weight: "45 kg", bmi: 19.0, vision: "6/6", bloodPressure: "108/68" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["None"],
    reports: [],
    aiSummary: "Sanya has no significant medical conditions. Vitals are excellent.",
    risk: "healthy",
    attendance: "97%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 17,
    rollNo: "8A17",
    name: "Dhruv Chauhan",
    class: "VIII-A",
    gender: "Male",
    dob: "2010-02-09",
    bloodGroup: "O+",
    parent: { name: "Mahesh Chauhan", contact: "+91-9876543226", email: "mahesh.c@example.com" },
    allergies: ["Tree Nuts"],
    medicalConditions: ["Hyperthyroidism"],
    vitals: { height: "160 cm", weight: "48 kg", bmi: 18.8, vision: "6/6", bloodPressure: "116/74" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Restlessness", "Weight loss"],
    reports: [{ date: "2024-03-30", type: "Endocrinology", status: "Thyroid levels irregular" }],
    aiSummary: "Dhruv is under medication for hyperthyroidism. Needs monitoring for restlessness and fatigue.",
    risk: "critical",
    attendance: "87%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  },
  {
    id: 18,
    rollNo: "8A18",
    name: "Neha Agarwal",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-05-28",
    bloodGroup: "B+",
    parent: { name: "Sunil Agarwal", contact: "+91-9876543227", email: "sunil.a@example.com" },
    allergies: ["None"],
    medicalConditions: ["Anemia"],
    vitals: { height: "150 cm", weight: "41 kg", bmi: 18.2, vision: "6/6", bloodPressure: "100/65" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Dizziness"],
    reports: [{ date: "2024-02-15", type: "Blood Test", status: "Low hemoglobin" }],
    aiSummary: "Neha has anemia. Needs iron supplements and should be excused from strenuous physical activities.",
    risk: "review",
    attendance: "91%",
    lastUpdate: "4 days ago",
    passportStatus: "Pending"
  },
  {
    id: 19,
    rollNo: "8A19",
    name: "Aman Ahuja",
    class: "VIII-A",
    gender: "Male",
    dob: "2009-12-01",
    bloodGroup: "A+",
    parent: { name: "Gaurav Ahuja", contact: "+91-9876543228", email: "gaurav.a@example.com" },
    allergies: ["None"],
    medicalConditions: ["None"],
    vitals: { height: "158 cm", weight: "51 kg", bmi: 20.4, vision: "6/9", bloodPressure: "110/70" },
    vaccinations: ["BCG", "OPV", "COVID-19", "MMR"],
    symptoms: ["Squinting"],
    reports: [{ date: "2024-01-10", type: "Eye Checkup", status: "Myopia detected" }],
    aiSummary: "Aman is healthy but needs to wear glasses for myopia during board work.",
    risk: "observation",
    attendance: "96%",
    lastUpdate: "Yesterday",
    passportStatus: "Completed"
  },
  {
    id: 20,
    rollNo: "8A20",
    name: "Ria Sengupta",
    class: "VIII-A",
    gender: "Female",
    dob: "2010-07-15",
    bloodGroup: "O+",
    parent: { name: "Anil Sengupta", contact: "+91-9876543229", email: "anil.s@example.com" },
    allergies: ["Gluten"],
    medicalConditions: ["Celiac Disease"],
    vitals: { height: "155 cm", weight: "45 kg", bmi: 18.7, vision: "6/6", bloodPressure: "105/68" },
    vaccinations: ["BCG", "OPV", "COVID-19"],
    symptoms: ["Bloating occasionally"],
    reports: [{ date: "2023-09-20", type: "Gastroenterology", status: "Celiac confirmed" }],
    aiSummary: "Ria has celiac disease. Requires a strict gluten-free diet in the school premises.",
    risk: "review",
    attendance: "94%",
    lastUpdate: "Today",
    passportStatus: "Completed"
  }
];

export const riskLabels = {
  healthy: "Healthy",
  observation: "Observation",
  review: "Needs Review",
  critical: "Doctor Attention",
};

export const riskStyles = {
  healthy: {
    pill: "bg-emerald-50 text-emerald-700 border-emerald-200",
    icon: "text-emerald-600",
    dot: "bg-emerald-500",
  },
  observation: {
    pill: "bg-blue-50 text-blue-700 border-blue-200",
    icon: "text-blue-600",
    dot: "bg-blue-500",
  },
  review: {
    pill: "bg-amber-50 text-amber-700 border-amber-200",
    icon: "text-amber-600",
    dot: "bg-amber-500",
  },
  critical: {
    pill: "bg-red-50 text-red-700 border-red-200",
    icon: "text-red-600",
    dot: "bg-red-500",
  },
};

export const symptomOptions = [
  "Fever",
  "Cough",
  "Cold",
  "Vomiting",
  "Headache",
  "Fatigue",
  "Injury",
  "Rash",
  "Breathing Difficulty",
  "Stomach Ache",
];

function toNumber(value, fallback = 0) {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function getHealthScore(student) {
  let score = 100;
  const bmi = toNumber(student?.vitals?.bmi, 0);
  const attendance = Number(String(student?.attendance || "").replace(/%/g, ""));
  const symptomCount = (student?.symptoms || []).filter((symptom) => symptom && symptom !== "None").length;
  const conditionCount = (student?.medicalConditions || []).filter((condition) => condition && condition !== "None").length;
  const hasVaccinations = (student?.vaccinations || []).length >= 4;
  const hasReports = (student?.reports || []).length > 0;

  if (bmi > 25 || bmi < 18) score -= 10;
  if (symptomCount > 0) score -= Math.min(20, symptomCount * 4);
  if (conditionCount > 0) score -= Math.min(18, conditionCount * 6);
  if (Number.isFinite(attendance) && attendance < 95) score -= attendance < 90 ? 8 : 4;
  if (!hasVaccinations) score -= 5;
  if (hasReports) score -= 3;
  if (student?.doctorNotes) score -= 2;

  return Math.max(0, Math.min(100, score));
}

export function getHealthScoreLabel(score) {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 55) return "Average";
  return "Poor";
}

export function getRisk(student) {
  const score = getHealthScore(student);
  const hasSevereCondition = (student?.medicalConditions || []).some((condition) =>
    /diabetes|asthma|thyroid|hyperthyroidism|anemia|celiac|migraine/i.test(condition)
  );

  if (score >= 85) return "healthy";
  if (score >= 70) return "observation";
  if (score >= 55 || hasSevereCondition) return "review";
  return "critical";
}

export function getAISummary(student) {
  const score = getHealthScore(student);
  const symptoms = (student?.symptoms || []).filter((symptom) => symptom && symptom !== "None");
  const conditions = (student?.medicalConditions || []).filter((condition) => condition && condition !== "None");
  const bmi = toNumber(student?.vitals?.bmi, 0);

  if (score >= 85) {
    return `${student?.name || "Student"} maintains excellent overall wellness. Routine monitoring and annual check-up reminders remain appropriate.`;
  }

  if (conditions.some((condition) => /asthma|diabetes|thyroid|hyperthyroidism|anemia/i.test(condition))) {
    return `${student?.name || "Student"} has a documented medical history that requires close supervision. Recommend continued follow-up, hydration support, and guardian coordination.`;
  }

  if (bmi > 25) {
    return `${student?.name || "Student"} shows elevated BMI indicators. Encourage daily physical activity and dietary counseling at school and home.`;
  }

  if (symptoms.length > 0) {
    return `${student?.name || "Student"} has reported ${symptoms.slice(0, 2).join(", ")}. Continue observation and maintain a calm, supportive environment until symptoms subside.`;
  }

  return `${student?.name || "Student"} is progressing steadily. Keep attendance and vaccination records current and continue routine wellness checks.`;
}

export function getPendingVaccinations(student) {
  const requiredVaccines = ["BCG", "OPV", "COVID-19", "MMR", "Hepatitis B"];
  const vaccinationSet = new Set(student?.vaccinations || []);
  return requiredVaccines.filter((vaccine) => !vaccinationSet.has(vaccine)).length;
}

export function updateStudentRecord(studentId, updates = {}) {
  const student = students.find((item) => String(item.id) === String(studentId));

  if (!student) {
    return null;
  }

  Object.assign(student, updates);
  student.healthScore = getHealthScore(student);
  student.risk = getRisk(student);
  student.aiSummary = getAISummary(student);
  student.lastUpdate = updates.lastUpdate || "Today";

  if (!student.timeline) {
    student.timeline = [];
  }

  return student;
}

export function createStudentPassport(payload) {
  const className = payload.className && payload.section ? `${payload.className}-${payload.section}` : payload.className || "VIII-A";
  const newStudent = {
    id: students.length + 1,
    rollNo: payload.rollNo || `8${className.replace(/[^A-Z]/g, "")}${String(students.length + 1).padStart(2, "0")}`,
    name: payload.name || "New Student",
    class: className,
    gender: payload.gender || "Other",
    dob: payload.dob || "2010-01-01",
    bloodGroup: payload.bloodGroup || "O+",
    parent: {
      name: payload.parentName || "Guardian",
      contact: payload.parentPhone || "",
      email: payload.parentEmail || "",
    },
    allergies: payload.allergies ? payload.allergies.split(",").map((item) => item.trim()).filter(Boolean) : ["None"],
    medicalConditions: payload.medicalConditions ? payload.medicalConditions.split(",").map((item) => item.trim()).filter(Boolean) : ["None"],
    vitals: {
      height: "-",
      weight: "-",
      bmi: 20,
      vision: "6/6",
      bloodPressure: "110/70",
    },
    vaccinations: payload.vaccinations || ["BCG", "OPV", "COVID-19"],
    symptoms: ["None"],
    reports: [],
    aiSummary: "",
    risk: "healthy",
    attendance: "96%",
    lastUpdate: "Today",
    passportStatus: "Completed",
    admissionNumber: `ADM-${String(students.length + 1).padStart(3, "0")}`,
    passportNumber: `PL-${String(students.length + 1).padStart(4, "0")}`,
    doctorNotes: payload.doctorNotes || "Initial assessment pending.",
    timeline: [
      {
        id: `passport-${students.length + 1}`,
        date: new Date().toLocaleDateString("en-GB"),
        title: "Passport Created",
        description: "New digital passport generated for the student.",
        type: "info",
      },
    ],
  };

  newStudent.aiSummary = getAISummary(newStudent);
  newStudent.healthScore = getHealthScore(newStudent);
  newStudent.risk = getRisk(newStudent);
  students.push(newStudent);

  return newStudent;
}

export function getStudentById(id) {
  return students.find((student) => String(student.id) === String(id));
}

export function getRiskLabel(risk) {
  return riskLabels[risk] || "Observation";
}

export function getRiskStyle(risk) {
  return riskStyles[risk] || riskStyles.observation;
}

export function getStudentAvatar(student) {
  return `https://i.pravatar.cc/150?u=${student.id}-${student.rollNo}`;
}

export function formatList(items) {
  if (!items || items.length === 0) return "None";
  return items.join(", ");
}

export function calculateAge(dob) {
  const birthDate = new Date(dob);
  const today = new Date();
  let age = today.getFullYear() - birthDate.getFullYear();
  const monthDelta = today.getMonth() - birthDate.getMonth();

  if (monthDelta < 0 || (monthDelta === 0 && today.getDate() < birthDate.getDate())) {
    age -= 1;
  }

  return age;
}

export function getReportCountToday(studentList = students) {
  return studentList.filter((student) => student.lastUpdate === "Today").length;
}

export function getRecentActivity(studentList = students, limit = 5) {
  return studentList
    .flatMap((student) =>
      student.reports.map((report) => ({
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

export function getDashboardStats(studentList = students) {
  const healthy = studentList.filter((student) => student.risk === "healthy").length;
  const observation = studentList.filter((student) => student.risk === "observation").length;
  const review = studentList.filter((student) => student.risk === "review").length;
  const critical = studentList.filter((student) => student.risk === "critical").length;
  const needReview = observation + review + critical;
  const doctorAttention = critical;
  const reportsToday = getReportCountToday(studentList);
  const pendingVaccinations = studentList.reduce((total, student) => total + getPendingVaccinations(student), 0);
  const averageBmi = studentList.length
    ? (studentList.reduce((total, student) => total + toNumber(student?.vitals?.bmi, 0), 0) / studentList.length).toFixed(1)
    : "0.0";
  const averageHealthScore = studentList.length
    ? Math.round(studentList.reduce((total, student) => total + getHealthScore(student), 0) / studentList.length)
    : 0;

  return {
    total: studentList.length,
    healthy,
    observation,
    review,
    critical,
    needReview,
    doctorAttention,
    reportsToday,
    pendingVaccinations,
    averageBmi,
    averageHealthScore,
    healthyPercent: studentList.length ? Math.round((healthy / studentList.length) * 100) : 0,
  };
}

export default students;
