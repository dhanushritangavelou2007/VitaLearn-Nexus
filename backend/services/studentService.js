/**
 * studentService.js  — Backend Student Service
 * ─────────────────────────────────────────────────────────────
 * Persists canonical HealthScore (derived from HealthStatus) on
 * every create/update so the stored score is always authoritative.
 * ─────────────────────────────────────────────────────────────
 */
import { getRepository } from "../repositories/index.js";
import { generateAIHealthReport } from "../utils/aiEngine.js";
import { createNotification } from "./notificationService.js";

// ─── List Students ───────────────────────────────────────────

export async function listStudents(
  { page = 1, limit = 20, search = "", risk, className, parentEmail },
  user
) {
  const repo  = getRepository("Student");
  const query = {};

  if (user) {
    if (user.role === "parent") {
      if (parentEmail) query["parent.email"] = parentEmail;
      // Demo: parent can see all linked records for the mock experience.
    } else if (user.role === "student") {
      query.id = user.email === "student@vitalearn.ai" ? "1" : user.id;
    }
  }

  if (search) {
    query.$or = [
      { name:   new RegExp(search, "i") },
      { rollNo: new RegExp(search, "i") },
      { class:  new RegExp(search, "i") },
    ];
  }
  if (risk)      query.risk  = risk;
  if (className) query.class = className;

  const skip  = (Number(page) - 1) * Number(limit);
  const items = await repo.find(query, { createdAt: -1 }, skip, Number(limit));
  const total = await repo.countDocuments(query);

  return {
    items,
    pagination: {
      page:  Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

// ─── Get Single Student ──────────────────────────────────────

export async function getStudentById(id) {
  const repo    = getRepository("Student");
  const student = await repo.findById(id);
  if (!student) return null;

  const aiReport = generateAIHealthReport(student);
  return { ...(student.toObject ? student.toObject() : student), aiReport };
}

// ─── Update Student ──────────────────────────────────────────

/**
 * Updates a student record and persists the canonical health score.
 * Also triggers vaccination notifications for teachers when pending
 * vaccinations are detected.
 */
export async function updateStudent(id, payload) {
  const repo = getRepository("Student");

  // Apply the raw payload first
  let updated = await repo.findByIdAndUpdate(id, payload);

  if (updated) {
    const aiReport = generateAIHealthReport(updated);

    // Always write the canonical score and risk back to the record
    const patch = {
      healthScore: aiReport.score,     // Canonical: 95 | 75 | 60 | 45
      risk:        payload.risk || aiReport.risk,
    };

    if (payload.perfectSummary) {
      patch.perfectSummary = payload.perfectSummary;
    }

    updated = await repo.findByIdAndUpdate(id, patch);

    // Trigger vaccination notifications if vaccinations were updated
    if (payload.vaccinations) {
      await generateVaccinationNotifications(updated);
    }
  }

  return updated;
}

/**
 * Generates notifications for teachers about pending/upcoming vaccinations.
 * Finds all teacher users and notifies them about each pending vaccination.
 */
async function generateVaccinationNotifications(student) {
  try {
    const vaccinations = student.vaccinations || [];
    const pendingVaccinations = vaccinations.filter(
      (v) => v && typeof v === "object" && v.status === "pending"
    );

    if (pendingVaccinations.length === 0) return;

    const userRepo = getRepository("User");
    const allUsers = await userRepo.find({});
    const teachers = allUsers.filter((u) => u.role === "teacher");

    for (const teacher of teachers) {
      const teacherId = String(teacher._id || teacher.id);
      for (const vacc of pendingVaccinations) {
        const vaccName = vacc.name || "Unknown Vaccine";
        const dueDate = vacc.date || "Not scheduled";
        await createNotification({
          recipient: teacherId,
          title: `Vaccination Pending: ${student.name}`,
          message: `${student.name} has a pending ${vaccName} vaccination. Due date: ${dueDate}.`,
          type: "vaccination-pending",
          metadata: {
            studentId: String(student._id || student.id),
            studentName: student.name,
            vaccinationName: vaccName,
            dueDate,
            recipientRole: "teacher",
          },
        });
      }
    }
  } catch (err) {
    console.error("Failed to generate vaccination notifications:", err);
  }
}
