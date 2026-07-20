import { getRepository } from "../repositories/index.js";
import { AppError } from "../utils/AppError.js";
import { createNotification } from "./notificationService.js";

function byCreatedDesc(a, b) {
  return new Date(b.createdAt || b.submittedAt || 0) - new Date(a.createdAt || a.submittedAt || 0);
}

function normalizeId(value) {
  return value === undefined || value === null ? value : String(value);
}

/**
 * Paginated / filterable listing — used for admin-style bulk browsing.
 * Kept separate from listReportsForUser (role-scoped) below.
 */
export async function listReports({ page = 1, limit = 20, search = "", risk }) {
  const repo = getRepository("Report");
  const query = {};
  if (search) {
    query.$or = [
      { type: new RegExp(search, "i") },
      { status: new RegExp(search, "i") },
    ];
  }
  if (risk) query.risk = risk;

  const skip = (Number(page) - 1) * Number(limit);
  const items = await repo.find(query, { createdAt: -1 }, skip, Number(limit));
  const total = await repo.countDocuments(query);

  return {
    items,
    pagination: {
      page: Number(page),
      limit: Number(limit),
      total,
      pages: Math.ceil(total / Number(limit)) || 1,
    },
  };
}

/**
 * Role-scoped listing for the observation pipeline.
 * - Doctor / Admin: see ALL reports.
 * - Teacher: sees only reports they personally submitted (senderId match).
 * - Parent: sees reports that have been reviewed AND are linked to their child
 *   (via Student.parentUser === user.id). Also sees their own submitted reports.
 * - Student: sees reports linked to their own student record (Student.user === user.id).
 *   Also sees their own submitted reports.
 */
export async function listReportsForUser(user) {
  const repo = getRepository("Report");
  const all = await repo.find({});

  const userId = normalizeId(user.id || user._id);

  if (user.role === "doctor" || user.role === "admin") {
    return [...all].sort(byCreatedDesc);
  }

  if (user.role === "teacher") {
    const scoped = all.filter((r) => normalizeId(r.senderId) === userId);
    return [...scoped].sort(byCreatedDesc);
  }

  if (user.role === "parent") {
    // Find the student linked to this parent user
    const studentRepo = getRepository("Student");
    const allStudents = await studentRepo.find({});
    const linkedStudent = allStudents.find(
      (s) => normalizeId(s.parentUser) === userId
    );
    const linkedStudentId = linkedStudent
      ? normalizeId(linkedStudent._id || linkedStudent.id)
      : null;

    const scoped = all.filter((r) => {
      // Parent's own submitted reports
      if (normalizeId(r.senderId) === userId) return true;
      // Reviewed reports about their linked child
      if (
        linkedStudentId &&
        r.status === "reviewed" &&
        (normalizeId(r.studentId) === linkedStudentId ||
          normalizeId(r.student) === linkedStudentId)
      )
        return true;
      return false;
    });
    return [...scoped].sort(byCreatedDesc);
  }

  if (user.role === "student") {
    // Find the student record linked to this user account
    const studentRepo = getRepository("Student");
    const allStudents = await studentRepo.find({});
    const linkedStudent = allStudents.find(
      (s) => normalizeId(s.user) === userId
    );
    const linkedStudentId = linkedStudent
      ? normalizeId(linkedStudent._id || linkedStudent.id)
      : null;

    const scoped = all.filter((r) => {
      // Student's own submitted reports
      if (normalizeId(r.senderId) === userId) return true;
      // Reviewed reports about this student
      if (
        linkedStudentId &&
        r.status === "reviewed" &&
        (normalizeId(r.studentId) === linkedStudentId ||
          normalizeId(r.student) === linkedStudentId)
      )
        return true;
      return false;
    });
    return [...scoped].sort(byCreatedDesc);
  }

  // Fallback: only own submissions
  const scoped = all.filter((r) => normalizeId(r.senderId) === userId);
  return [...scoped].sort(byCreatedDesc);
}

export async function createReport(payload, user) {
  const repo = getRepository("Report");
  const report = await repo.create({
    senderId: normalizeId(payload.senderId || user.id || user._id),
    senderRole: payload.senderRole || user.role,
    senderName: payload.senderName || user.name,
    symptoms: Array.isArray(payload.symptoms) ? payload.symptoms : [],
    severity: Number(payload.severity) || 1,
    temperature: payload.temperature || "",
    date: payload.date || new Date().toISOString().split("T")[0],
    notes: payload.notes || "",
    studentId: payload.studentId || null,
    student: payload.studentId || null,
    status: "pending",
    observation: null,
    observationSentAt: null,
  });
  return report;
}

/**
 * Doctor submits a full clinical review.
 * Sends role-specific notifications to:
 *   1. The original sender (teacher/parent/student) with their specific message.
 *   2. The parent of the linked student (if the sender was a teacher).
 *   3. The student of the linked student (if the sender was a teacher or parent).
 */
export async function addObservation(reportId, doctorUser, reviewData) {
  const repo = getRepository("Report");
  const report = await repo.findById(reportId);
  if (!report) throw new AppError("Report not found", 404);

  const observationSentAt = new Date().toISOString();
  const {
    observation,
    diagnosis,
    doctorReview,
    recommendation,
    prescription,
  } = reviewData;

  const doctorId = normalizeId(doctorUser.id || doctorUser._id);
  const doctorName = doctorUser.name || "Doctor";

  const updated = await repo.findByIdAndUpdate(reportId, {
    status: "reviewed",
    observation: observation || null,
    observationSentAt,
    reviewedBy: doctorId,
    diagnosis: diagnosis || null,
    doctorReview: doctorReview || null,
    recommendation: recommendation || null,
    prescription: prescription || null,
    reviewedByName: doctorName,
    reviewedByRole: "doctor",
  });

  const dateLabel = new Date(observationSentAt).toLocaleDateString("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  });

  const reportIdStr = normalizeId(report._id || report.id);
  const studentId = normalizeId(report.studentId || report.student);

  // 1. Always notify the original sender (teacher, parent, or student)
  if (report.senderId) {
    await createNotification({
      recipient: report.senderId,
      title: `Dr. ${doctorName} has reviewed your observation`,
      message: `Reviewed on ${dateLabel}`,
      type: "doctor-response",
      metadata: {
        reportId: reportIdStr,
        recipientRole: report.senderRole,
        senderRole: report.senderRole,
        doctorName,
        studentId,
      },
    });
  }

  // 2. If sender is a teacher, also notify the parent and student
  if (report.senderRole === "teacher" && studentId) {
    const studentRepo = getRepository("Student");
    const student = await studentRepo.findById(studentId);

    if (student) {
      const parentUserId = normalizeId(student.parentUser);
      const studentUserId = normalizeId(student.user);

      // Notify parent
      if (parentUserId) {
        await createNotification({
          recipient: parentUserId,
          title: `Dr. ${doctorName} has reviewed ${student.name}'s health report`,
          message: `Reviewed on ${dateLabel}`,
          type: "doctor-response",
          metadata: {
            reportId: reportIdStr,
            recipientRole: "parent",
            senderRole: report.senderRole,
            doctorName,
            studentId,
            studentName: student.name,
          },
        });
      }

      // Notify student
      if (studentUserId) {
        await createNotification({
          recipient: studentUserId,
          title: `Dr. ${doctorName} has reviewed your health report`,
          message: `Reviewed on ${dateLabel}`,
          type: "doctor-response",
          metadata: {
            reportId: reportIdStr,
            recipientRole: "student",
            senderRole: report.senderRole,
            doctorName,
            studentId,
          },
        });
      }
    }
  }

  return updated;
}
