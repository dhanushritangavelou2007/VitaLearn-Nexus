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
 * Role-scoped listing for the teacher/parent/student/doctor observation
 * pipeline (mirrors what MedicalReportsContext used to do purely in
 * localStorage). Doctors and admins see every report so they can triage;
 * everyone else sees only the reports they personally submitted, so a
 * parent's report is never visible to a teacher and vice versa.
 */
export async function listReportsForUser(user) {
  const repo = getRepository("Report");
  const all = await repo.find({});

  const scoped =
    user.role === "doctor" || user.role === "admin"
      ? all
      : all.filter((r) => normalizeId(r.senderId) === normalizeId(user.id || user._id));

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
    status: "pending",
    observation: null,
    observationSentAt: null,
  });
  return report;
}

export async function addObservation(reportId, doctorUser, observationText) {
  const repo = getRepository("Report");
  const report = await repo.findById(reportId);
  if (!report) throw new AppError("Report not found", 404);

  const observationSentAt = new Date().toISOString();
  const updated = await repo.findByIdAndUpdate(reportId, {
    status: "reviewed",
    observation: observationText,
    observationSentAt,
    reviewedBy: normalizeId(doctorUser.id || doctorUser._id),
  });

  // Notify ONLY the original sender — privacy requirement from the master
  // prompt (teacher observation response → only that teacher, parent report
  // → only that parent, etc).
  if (report.senderId) {
    const dateLabel = new Date(observationSentAt).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
    await createNotification({
      recipient: report.senderId,
      title: "Observation Sent and Approved.",
      message: dateLabel,
      type: "doctor-response",
      metadata: { reportId: normalizeId(report._id || report.id), senderRole: report.senderRole },
    });
  }

  return updated;
}
