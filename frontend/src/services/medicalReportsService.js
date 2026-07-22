import api from "./api";

// Normalizes a backend report doc into the exact shape MedicalReportsContext
// has always produced from localStorage, so none of the ~9 consuming
// pages/components need to change.
function normalizeReport(report) {
  if (!report) return null;
  return {
    id: report._id || report.id,
    senderId: report.senderId,
    senderRole: report.senderRole,
    senderName: report.senderName,
    symptoms: Array.isArray(report.symptoms) ? report.symptoms : [],
    severity: report.severity,
    temperature: report.temperature,
    date: report.date,
    notes: report.notes,
    status: report.status,
    observation: report.observation ?? null,
    observationSentAt: report.observationSentAt ?? null,
    submittedAt: report.createdAt || report.submittedAt,
    // Full doctor review fields
    diagnosis: report.diagnosis ?? null,
    doctorReview: report.doctorReview ?? null,
    recommendation: report.recommendation ?? null,
    prescription: report.prescription ?? null,
    reviewedByName: report.reviewedByName ?? null,
    reviewedByRole: report.reviewedByRole ?? "doctor",
    // Student link
    studentId: report.studentId || report.student || null,
  };
}

function normalizeNotification(notification) {
  if (!notification) return null;
  return {
    id: notification._id || notification.id,
    recipientId: notification.recipient,
    recipientRole: notification.metadata?.recipientRole || notification.metadata?.senderRole,
    reportId: notification.metadata?.reportId,
    date: notification.message,
    message: notification.title,
    read: Boolean(notification.read),
    createdAt: notification.createdAt,
    // Expose top-level type AND mirror it into metadata so consumers can check either
    type: notification.type || "info",
    metadata: {
      ...(notification.metadata || {}),
      type: notification.type || notification.metadata?.type || "info",
    },
  };
}

export async function fetchReports() {
  const { data } = await api.get("/reports");
  const items = data.data || data.items || [];
  return items.map(normalizeReport);
}

export async function submitReportRequest(payload) {
  const { data } = await api.post("/reports", payload);
  return normalizeReport(data.data || data);
}

export async function sendObservationRequest(reportId, reviewData) {
  // Support both legacy (plain string) and new (full review object) callers
  const body = typeof reviewData === "string"
    ? { observation: reviewData }
    : reviewData;
  const { data } = await api.post(`/reports/${reportId}/observation`, body);
  return normalizeReport(data.data || data);
}

export async function fetchNotifications() {
  const { data } = await api.get("/notifications");
  const items = data.data || data.items || [];
  return items.map(normalizeNotification);
}

export async function markNotificationReadRequest(notificationId) {
  const { data } = await api.patch(`/notifications/${notificationId}/read`);
  return normalizeNotification(data.data || data);
}
