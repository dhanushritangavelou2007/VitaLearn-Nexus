/**
 * ParentNotifications.jsx
 *
 * Notification center for the parent — mirrors the Student notification
 * experience with bell, unread count, history, mark-as-read, timestamps,
 * and full doctor review details (Diagnosis, Observation, Recommendation,
 * Prescription, Doctor Name, Role, Date/Time).
 *
 * Updated as part of the communication flow fix:
 *   Teacher submits → Doctor reviews → Parent notified + dashboard updated
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import {
  Bell, CheckCircle2, Clock, Stethoscope, ChevronLeft,
  InboxIcon, MessageSquare, AlertCircle, Pill, ClipboardList,
} from "lucide-react";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";

function ParentNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNotificationsForUser, allReports, markNotificationRead } = useMedicalReports();

  const userId = user?.id || user?._id || "parent-default";
  // Notifications explicitly addressed to this parent (role=parent)
  const notifications = getNotificationsForUser(userId, "parent");
  // Reviewed reports from the server-scoped list (includes teacher-initiated reviews)
  const reviewedReports = allReports.filter((r) => r.status === "reviewed");

  const [selectedReport, setSelectedReport] = useState(null);
  const unreadCount = notifications.filter((n) => !n.read).length;

  const handleNotificationClick = (notif) => {
    if (!notif.read) markNotificationRead(notif.id);
    const report = allReports.find((r) => r.id === notif.reportId);
    if (report) setSelectedReport(report);
  };

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/parent/dashboard")}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Notifications</h1>
            <p className="text-slate-500 font-medium">Doctor observations and health updates for your child</p>
          </div>
          {unreadCount > 0 && (
            <span className="ml-auto rounded-full bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Notification List */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Doctor's Observations</h2>
              <p className="text-sm text-slate-500">Notifications sent after the doctor reviews health reports</p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <InboxIcon size={24} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600">No notifications yet</p>
              <p className="text-sm text-slate-400">Doctor's responses to reports about your child will appear here once sent.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {notifications.map((notif) => (
                <button
                  key={notif.id}
                  onClick={() => handleNotificationClick(notif)}
                  className={`w-full text-left rounded-2xl border transition-all p-4 flex items-start gap-4 group ${
                    notif.read
                      ? "border-slate-100 bg-white hover:border-slate-200"
                      : "border-blue-200 bg-blue-50 hover:border-blue-300"
                  }`}
                >
                  <div className={`mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${notif.read ? "bg-slate-100 text-slate-500" : "bg-blue-100 text-blue-600"}`}>
                    <Stethoscope size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-2">
                      <p className={`font-semibold text-sm ${notif.read ? "text-slate-700" : "text-blue-800"}`}>
                        {notif.message}
                      </p>
                      {!notif.read && <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500" />}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {notif.date}
                    </p>
                    <p className="text-xs font-medium text-blue-600 mt-2 group-hover:text-blue-700">
                      Click to view the full clinical observation →
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Doctor's Diagnosis and Reviews History */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-xl font-bold text-slate-800">Doctor's Diagnosis and Reviews</h2>
              <p className="text-sm text-slate-500">Complete clinical observation history for your child</p>
            </div>
          </div>

          {selectedReport ? (
            <div className="space-y-4">
              {/* Doctor Identity */}
              <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                <div className="flex items-center gap-3 mb-3">
                  <div className="h-10 w-10 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center shrink-0">
                    <Stethoscope size={18} />
                  </div>
                  <div>
                    <p className="text-base font-bold text-emerald-900">{selectedReport.reviewedByName || "Doctor"}</p>
                    <span className="inline-flex items-center rounded-full bg-emerald-100 border border-emerald-200 px-2.5 py-0.5 text-xs font-semibold text-emerald-700">
                      Doctor
                    </span>
                  </div>
                  <span className="ml-auto text-xs text-emerald-600 flex items-center gap-1">
                    <Clock size={10} />
                    {selectedReport.observationSentAt
                      ? new Date(selectedReport.observationSentAt).toLocaleString("en-IN", {
                          day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit",
                        })
                      : "Recently"}
                  </span>
                </div>
              </div>

              {/* Diagnosis */}
              {selectedReport.diagnosis && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <ClipboardList size={16} className="text-slate-600" />
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Diagnosis</p>
                  </div>
                  <p className="text-lg font-bold text-slate-800">{selectedReport.diagnosis}</p>
                </div>
              )}

              {/* Observation */}
              {selectedReport.observation && (
                <div className="rounded-2xl border border-emerald-100 bg-white p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Observation</p>
                  <p className="text-base text-slate-700 leading-relaxed">{selectedReport.observation}</p>
                </div>
              )}

              {/* Recommendation */}
              {selectedReport.recommendation && (
                <div className="rounded-2xl border border-blue-100 bg-blue-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={16} className="text-blue-600" />
                    <p className="text-xs font-semibold text-blue-500 uppercase tracking-wider">Medical Recommendation</p>
                  </div>
                  <p className="text-base text-blue-900 leading-relaxed font-medium">{selectedReport.recommendation}</p>
                </div>
              )}

              {/* Prescription */}
              {selectedReport.prescription && (
                <div className="rounded-2xl border border-purple-100 bg-purple-50 p-5">
                  <div className="flex items-center gap-2 mb-2">
                    <Pill size={16} className="text-purple-600" />
                    <p className="text-xs font-semibold text-purple-500 uppercase tracking-wider">Prescription</p>
                  </div>
                  <p className="text-base text-purple-900 leading-relaxed">{selectedReport.prescription}</p>
                </div>
              )}

              {/* Doctor Review Notes */}
              {selectedReport.doctorReview && (
                <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Doctor Review Notes</p>
                  <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.doctorReview}</p>
                </div>
              )}

              {/* Reported Symptoms */}
              {selectedReport.symptoms?.length > 0 && (
                <div className="rounded-2xl border border-rose-100 bg-rose-50/50 p-5">
                  <p className="text-xs font-semibold text-rose-400 uppercase tracking-wider mb-2">Reported Symptoms</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedReport.symptoms.map((s) => (
                      <span key={s} className="rounded-full bg-white border border-rose-100 px-3 py-0.5 text-xs font-semibold text-rose-700">{s}</span>
                    ))}
                  </div>
                </div>
              )}

              <button onClick={() => setSelectedReport(null)} className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
                ← Back to all reviews
              </button>
            </div>
          ) : reviewedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <MessageSquare size={22} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600">No observations received yet</p>
              <p className="text-sm text-slate-400">Once the doctor reviews a report about your child, the full clinical observation will appear here.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {reviewedReports.map((report) => (
                <button
                  key={report.id}
                  onClick={() => setSelectedReport(report)}
                  className="w-full text-left rounded-2xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-50 hover:border-emerald-200 transition-all p-4 group"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="text-base font-bold text-slate-800">{report.reviewedByName || "Doctor"}</p>
                        <span className="rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-semibold text-emerald-700">Doctor</span>
                      </div>
                      {report.diagnosis && (
                        <p className="text-sm font-semibold text-slate-700">
                          Diagnosis: <span className="font-normal text-slate-600">{report.diagnosis}</span>
                        </p>
                      )}
                      <p className="text-xs text-slate-400 mt-0.5">
                        {report.observationSentAt
                          ? new Date(report.observationSentAt).toLocaleDateString("en-IN", { day: "2-digit", month: "short", year: "numeric" })
                          : "Recently"}
                      </p>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{report.observation}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-700 shrink-0">
                      <CheckCircle2 size={10} /> Reviewed
                    </span>
                  </div>
                  <p className="text-xs font-medium text-emerald-600 mt-2 group-hover:text-emerald-700">Click to read full clinical observation →</p>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

      </div>
    </DashboardLayout>
  );
}

export default ParentNotifications;
