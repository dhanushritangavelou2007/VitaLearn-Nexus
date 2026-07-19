import { getRepository } from "../repositories/index.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/AppError.js";

export const createSymptomReport = asyncHandler(async (req, res) => {
  const reportRepo = getRepository("Report");
  const studentRepo = getRepository("Student");

  const symptoms = Array.isArray(req.body.symptoms)
    ? req.body.symptoms.map((item) => String(item).trim()).filter(Boolean)
    : typeof req.body.symptoms === "string"
    ? req.body.symptoms.split(",").map((item) => item.trim()).filter(Boolean)
    : [];

  const extraNotes = typeof req.body.extraNotes === "string"
    ? req.body.extraNotes.trim()
    : typeof req.body.notes === "string"
    ? req.body.notes.trim()
    : "";

  const date = req.body.date || new Date().toLocaleDateString("en-GB");
  const severity = Number(req.body.severity) || 1;

  let studentId = req.body.studentId || req.body.student;
  if (req.user.role === "student") {
    const linkedStudent = await studentRepo.findOne({ user: req.user._id || req.user.id });
    if (!linkedStudent) {
      throw new AppError("Student profile not found for this account.", 404);
    }
    studentId = linkedStudent._id || linkedStudent.id;
  }

  if (!studentId) {
    throw new AppError("Student ID is required to submit a symptom report.", 400);
  }

  const student = await studentRepo.findById(studentId);
  if (!student) {
    throw new AppError("Student not found.", 404);
  }

  const report = await reportRepo.create({
    student: studentId,
    createdBy: req.user._id || req.user.id,
    type: "Symptom Report",
    status: "Pending Review",
    notes: extraNotes,
    extraNotes,
    symptoms,
    severity,
    risk: severity >= 7 ? "critical" : "review",
    date,
  });

  const updatedTimeline = [
    ...(student.timeline || []),
    {
      date,
      title: "Symptom Reported",
      description: `Reported symptoms: ${symptoms.length ? symptoms.join(", ") : "None"}. Severity: ${severity}/10.`,
      type: "symptom",
    },
    {
      date: new Date().toLocaleDateString("en-GB"),
      title: "Awaiting Doctor Review",
      description: "Symptom report has been submitted and is waiting for clinical verification.",
      type: "pending",
    },
  ];

  await studentRepo.findByIdAndUpdate(studentId, {
    symptoms: symptoms.length > 0 ? symptoms : student.symptoms,
    lastUpdate: "Today",
    timeline: updatedTimeline,
    doctorNotes: student.doctorNotes || "Symptom report received and pending a doctor's review.",
    risk: severity >= 7 ? "critical" : "review",
  });

  res.status(201).json({ success: true, data: report });
});
