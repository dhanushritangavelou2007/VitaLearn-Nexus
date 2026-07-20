/**
 * MedicalReportsContext
 * ─────────────────────
 * Isolated, role-aware medical reporting pipeline:
 *
 *   Student / Parent / Teacher  ──►  submitReport()
 *                                        │
 *                                        ▼
 *                                  Doctor sees all reports
 *                                  via getReportsForDoctor()
 *                                        │
 *                              sendObservation(reportId, text)
 *                                        │
 *                                        ▼
 *                          Originating sender receives notification
 *                          and sees observation in their dashboard.
 *
 * Privacy guarantee (enforced server-side too — see backend/services/
 * reportService.js and notificationService.js):
 *   • Teachers CANNOT see Student/Parent reports.
 *   • Students/Parents CANNOT see Teacher reports.
 *   • Every sender only sees their own reports + doctor's response.
 *
 * Backed by the Express API (GET/POST /reports, /reports/:id/observation,
 * GET /notifications, PATCH /notifications/:id/read) rather than
 * localStorage. Reads are served from an in-memory cache that's hydrated on
 * login and refreshed on a short poll, so every exported getter here stays
 * SYNCHRONOUS — none of the ~9 consuming pages/components had to change.
 * Mutations apply an optimistic local update immediately (so the UI feels
 * instant) and roll back if the API call fails.
 */

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import {
  fetchReports,
  fetchNotifications,
  submitReportRequest,
  sendObservationRequest,
  markNotificationReadRequest,
} from "../services/medicalReportsService";

const POLL_INTERVAL_MS = 12000;

export const MedicalReportsContext = createContext(null);

export function MedicalReportsProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [reports, setReports] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const pollRef = useRef(null);

  const refresh = useCallback(async () => {
    try {
      const [reportsData, notificationsData] = await Promise.all([
        fetchReports(),
        fetchNotifications(),
      ]);
      setReports(reportsData);
      setNotifications(notificationsData);
    } catch (err) {
      // A transient network hiccup shouldn't wipe out what's already on
      // screen — keep the last-known-good cache and try again next tick.
      console.error("Failed to refresh medical reports/notifications:", err);
    }
  }, []);

  useEffect(() => {
    if (!isAuthenticated) {
      setReports([]);
      setNotifications([]);
      return undefined;
    }

    refresh();
    pollRef.current = setInterval(refresh, POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [isAuthenticated, refresh]);

  // ── Mutations ─────────────────────────────────────────────────
  // Each stays callable exactly as before (no await required by callers):
  // apply an optimistic local update synchronously, fire the real request in
  // the background, and reconcile or roll back when it resolves.

  const submitReport = useCallback((payload) => {
    const tempId = `temp-${Date.now()}`;
    const optimisticReport = {
      id: tempId,
      ...payload,
      submittedAt: new Date().toISOString(),
      status: "pending",
      observation: null,
      observationSentAt: null,
    };
    setReports((prev) => [optimisticReport, ...prev]);

    submitReportRequest(payload)
      .then((saved) => {
        setReports((prev) => prev.map((r) => (r.id === tempId ? saved : r)));
      })
      .catch((err) => {
        console.error("Failed to submit report:", err);
        setReports((prev) => prev.filter((r) => r.id !== tempId));
      });

    return optimisticReport;
  }, []);

  const sendObservation = useCallback((reportId, reviewData) => {
    const sentAt = new Date().toISOString();
    let rollbackSnapshot = null;
    // Support both legacy string and new full-review-object callers
    const observationText = typeof reviewData === "string" ? reviewData : reviewData?.observation;

    setReports((prev) => {
      rollbackSnapshot = prev;
      return prev.map((r) =>
        r.id === reportId
          ? {
              ...r,
              status: "reviewed",
              observation: observationText,
              observationSentAt: sentAt,
              ...(typeof reviewData === "object" ? reviewData : {}),
            }
          : r
      );
    });

    sendObservationRequest(reportId, reviewData)
      .then((updated) => {
        setReports((prev) => prev.map((r) => (r.id === reportId ? updated : r)));
        // Pull fresh notifications immediately so the sender's bell/inbox
        // updates without waiting for the next poll tick.
        refresh();
      })
      .catch((err) => {
        console.error("Failed to send observation:", err);
        if (rollbackSnapshot) setReports(rollbackSnapshot);
      });
  }, [refresh]);

  const markNotificationRead = useCallback((notificationId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notificationId ? { ...n, read: true } : n))
    );
    markNotificationReadRequest(notificationId).catch((err) => {
      console.error("Failed to mark notification read:", err);
    });
  }, []);

  const getReportsForDoctor = useCallback(() => reports, [reports]);

  const getReportsForSender = useCallback(
    (senderId, senderRole) =>
      reports.filter((r) => r.senderId === senderId && r.senderRole === senderRole),
    [reports]
  );

  const getNotificationsForUser = useCallback(
    (recipientId, recipientRole) =>
      notifications.filter(
        (n) => n.recipientId === recipientId && n.recipientRole === recipientRole
      ),
    [notifications]
  );

  const value = useMemo(
    () => ({
      submitReport,
      sendObservation,
      markNotificationRead,
      getReportsForDoctor,
      getReportsForSender,
      getNotificationsForUser,
      allReports: reports,
      allNotifications: notifications,
    }),
    [
      submitReport,
      sendObservation,
      markNotificationRead,
      getReportsForDoctor,
      getReportsForSender,
      getNotificationsForUser,
      reports,
      notifications,
    ]
  );

  return (
    <MedicalReportsContext.Provider value={value}>
      {children}
    </MedicalReportsContext.Provider>
  );
}

export function useMedicalReports() {
  const ctx = useContext(MedicalReportsContext);
  if (!ctx) throw new Error("useMedicalReports must be used inside MedicalReportsProvider");
  return ctx;
}
