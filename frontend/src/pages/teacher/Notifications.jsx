/**
 * TeacherNotifications.jsx
 *
 * Displays doctor response notifications for observations the currently
 * logged-in teacher has submitted. This closes the previously broken loop:
 *
 *   Teacher submits observation → Doctor reviews & responds → Teacher sees response
 *
 * Mirrors the Student/Parent notifications pattern for a consistent,
 * role-aware notification experience across the app.
 */

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import DashboardLayout from "../../components/dashboard/DashboardLayout";
import GlassCard from "../../components/ui/GlassCard";
import { Bell, CheckCircle2, Clock, Stethoscope, ChevronLeft, InboxIcon, MessageSquare, Syringe, AlertCircle } from "lucide-react";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function TeacherNotifications() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { getNotificationsForUser, getReportsForSender, markNotificationRead } = useMedicalReports();

  const userId = user?.id || user?._id || "teacher-default";
  const { students } = useStudents();
  const allUserNotifications = getNotificationsForUser(userId, "teacher");
  
  // Get activity notifications identical to the Bell icon
  const activityNotifications = getRecentActivity(students, 5).map((item, index) => ({
    id: `${item.id}-${index}`,
    message: item.title,
    date: `${item.studentName}: ${item.description}`,
    read: true,
    type: "activity",
    raw: item
  }));

  const allNotifications = [
    ...allUserNotifications.map(n => ({ ...n, id: n.id || n._id, message: n.title || n.message, date: n.message || n.date })),
    ...activityNotifications
  ];

  // Split into doctor-response and vaccination notifications
  const notifications = allNotifications.filter(
    (n) => n.type !== "vaccination-pending" && n.metadata?.type !== "vaccination-pending" && n.type !== "vaccination"
  );
  const vaccinationNotifications = allNotifications.filter(
    (n) => n.type === "vaccination-pending" || n.metadata?.type === "vaccination-pending" || n.type === "vaccination"
  );
  const myReports = getReportsForSender(userId, "teacher");
  const reviewedReports = myReports.filter((r) => r.status === "reviewed");

  const [selectedReport, setSelectedReport] = useState(null);

  const handleNotificationClick = (notif) => {
    if (!notif.read && notif.type !== "activity") markNotificationRead(notif.id || notif._id);
    
    if (notif.type === "activity") {
      setSelectedReport({
        symptoms: ["Activity Alert"],
        observation: notif.raw.description,
        diagnosis: notif.raw.title,
        doctorReview: `Student: ${notif.raw.studentName}\nRisk level: ${notif.raw.risk}`,
        recommendation: "Please review the student's passport for a full timeline of events.",
        observationSentAt: notif.raw.date,
      });
      setTimeout(() => {
        document.getElementById("review-history")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
      return;
    }

    const report = myReports.find((r) => String(r.id) === String(notif.metadata?.reportId || notif.reportId));
    if (report) {
      setSelectedReport(report);
      setTimeout(() => {
        document.getElementById("review-history")?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 100);
    }
  };

  const unreadCount = allNotifications.filter((n) => !n.read).length;

  return (
    <DashboardLayout>
      <div className="mx-auto max-w-4xl space-y-6 pb-10">

        {/* Header */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/teacher/dashboard")}
            className="p-2 rounded-xl bg-white border border-slate-200 text-slate-500 hover:bg-slate-50 transition-colors shadow-sm"
          >
            <ChevronLeft size={20} />
          </button>
          <div>
            <h1 className="text-3xl font-bold text-slate-800 tracking-tight">Notifications</h1>
            <p className="text-slate-500 font-medium">Doctor responses to your health observations</p>
          </div>
          {unreadCount > 0 && (
            <span className="ml-auto rounded-full bg-rose-100 border border-rose-200 px-3 py-1 text-xs font-bold text-rose-700">
              {unreadCount} unread
            </span>
          )}
        </div>

        {/* Vaccination Notifications */}
        {vaccinationNotifications.length > 0 && (
          <GlassCard className="p-6">
            <div className="flex items-center gap-3 mb-5">
              <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
                <Syringe size={20} />
              </div>
              <div>
                <h2 className="text-lg font-bold text-slate-800">Vaccination Alerts</h2>
                <p className="text-sm text-slate-500">Students with pending or upcoming vaccinations</p>
              </div>
            </div>
            <div className="space-y-3">
              {vaccinationNotifications.map((notif) => (
                <div
                  key={notif.id}
                  className={`rounded-2xl border p-4 flex items-start gap-4 ${
                    notif.read ? "border-slate-100 bg-white" : "border-amber-200 bg-amber-50"
                  }`}
                >
                  <div className={`mt-0.5 h-9 w-9 rounded-xl flex items-center justify-center shrink-0 ${
                    notif.read ? "bg-slate-100 text-slate-500" : "bg-amber-100 text-amber-600"
                  }`}>
                    <Syringe size={16} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`font-semibold text-sm ${notif.read ? "text-slate-700" : "text-amber-800"}`}>
                      {notif.message}
                    </p>
                    <div className="flex flex-wrap gap-2 mt-1.5">
                      {notif.metadata?.studentName && (
                        <span className="text-xs bg-slate-100 text-slate-600 px-2 py-0.5 rounded-full font-medium">
                          Student: {notif.metadata.studentName}
                        </span>
                      )}
                      {notif.metadata?.vaccinationName && (
                        <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-medium">
                          Vaccine: {notif.metadata.vaccinationName}
                        </span>
                      )}
                      {notif.metadata?.dueDate && notif.metadata.dueDate !== "Not scheduled" && (
                        <span className="text-xs bg-rose-100 text-rose-700 px-2 py-0.5 rounded-full font-medium flex items-center gap-1">
                          <AlertCircle size={9} /> Due: {notif.metadata.dueDate}
                        </span>
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-1 flex items-center gap-1">
                      <Clock size={10} /> {notif.date}
                    </p>
                  </div>
                  {!notif.read && <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-amber-500 mt-2" />}
                </div>
              ))}
            </div>
          </GlassCard>
        )}

        {/* Notifications list */}
        <GlassCard className="p-6">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-amber-50 p-2.5 text-amber-600">
              <Bell size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Recent Alerts &amp; Doctor Responses</h2>
              <p className="text-sm text-slate-500">Student activity alerts and doctor responses to your observations</p>
            </div>
          </div>

          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <InboxIcon size={24} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600">No notifications yet</p>
              <p className="text-sm text-slate-400">Once the doctor reviews an observation you submitted and sends a response, it will appear here.</p>
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
                      {!notif.read && (
                        <span className="shrink-0 h-2.5 w-2.5 rounded-full bg-blue-500" />
                      )}
                    </div>
                    <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                      <Clock size={10} /> {notif.date}
                    </p>
                    <p className="text-xs font-medium text-blue-600 mt-2 group-hover:text-blue-700 transition-colors">
                      {notif.type === "activity" ? "Click to view alert details →" : "Click to view the doctor's full response →"}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

        {/* Doctor's Responses to observations */}
        <GlassCard id="review-history" className="p-6 scroll-mt-24">
          <div className="flex items-center gap-3 mb-5">
            <div className="rounded-2xl bg-emerald-50 p-2.5 text-emerald-600">
              <Stethoscope size={20} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-slate-800">Doctor Review History</h2>
              <p className="text-sm text-slate-500">Clinical responses received for observations you submitted</p>
            </div>
          </div>

          {selectedReport ? (
            <div className="space-y-4">
              <div className="rounded-2xl border border-slate-100 bg-slate-50 p-5">
                <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">Your Original Observation</p>
                <div className="flex flex-wrap gap-2 mb-3">
                  {selectedReport.symptoms?.map((s) => (
                    <span key={s} className="rounded-full bg-rose-50 border border-rose-100 px-3 py-0.5 text-xs font-semibold text-rose-700">{s}</span>
                  ))}
                </div>
                {selectedReport.notes && (
                  <p className="text-sm text-slate-600">{selectedReport.notes}</p>
                )}
              </div>

              <div className="space-y-3">
                <div className="rounded-2xl border border-emerald-200 bg-emerald-50 p-5">
                  <div className="flex items-center gap-2 mb-3">
                    <CheckCircle2 size={18} className="text-emerald-600" />
                    <span className="font-bold text-emerald-800">Doctor's Observation</span>
                  </div>
                  <p className="text-sm text-emerald-900 leading-relaxed">{selectedReport.observation}</p>
                </div>
                {selectedReport.diagnosis && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Diagnosis</p>
                    <p className="text-sm font-semibold text-slate-800">{selectedReport.diagnosis}</p>
                  </div>
                )}
                {selectedReport.doctorReview && (
                  <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                    <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-1">Clinical Notes</p>
                    <p className="text-sm text-slate-700 leading-relaxed">{selectedReport.doctorReview}</p>
                  </div>
                )}
                {selectedReport.recommendation && (
                  <div className="rounded-2xl border border-blue-200 bg-blue-50 p-5">
                    <p className="text-xs font-semibold text-blue-400 uppercase tracking-wider mb-1">Recommendation</p>
                    <p className="text-sm text-blue-900 leading-relaxed">{selectedReport.recommendation}</p>
                  </div>
                )}
                {selectedReport.prescription && (
                  <div className="rounded-2xl border border-purple-200 bg-purple-50 p-5">
                    <p className="text-xs font-semibold text-purple-400 uppercase tracking-wider mb-1">Prescription</p>
                    <p className="text-sm text-purple-900 leading-relaxed">{selectedReport.prescription}</p>
                  </div>
                )}
                {selectedReport.observationSentAt && (
                  <p className="text-xs text-slate-500 mt-2 flex items-center gap-1 pl-2">
                    <Clock size={10} />
                    Sent on {new Date(selectedReport.observationSentAt).toLocaleString("en-IN", { day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit" })}
                  </p>
                )}
              </div>

              <button
                onClick={() => setSelectedReport(null)}
                className="text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors"
              >
                ← Back to all responses
              </button>
            </div>
          ) : reviewedReports.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 gap-3 text-center">
              <div className="h-14 w-14 rounded-full bg-slate-100 flex items-center justify-center">
                <MessageSquare size={22} className="text-slate-400" />
              </div>
              <p className="font-semibold text-slate-600">No responses received yet</p>
              <p className="text-sm text-slate-400">Doctor's responses to observations you submit will be displayed here.</p>
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
                      <p className="text-sm font-semibold text-slate-700">
                        {report.symptoms?.join(", ") || "Health Observation"}
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">{new Date(report.submittedAt).toLocaleDateString("en-IN")}</p>
                      <p className="text-xs text-slate-500 mt-1.5 line-clamp-2">{report.observation}</p>
                    </div>
                    <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 border border-emerald-200 px-2 py-0.5 text-xs font-bold text-emerald-700 shrink-0">
                      <CheckCircle2 size={10} /> Reviewed
                    </span>
                  </div>
                  <p className="text-xs font-medium text-emerald-600 mt-2 group-hover:text-emerald-700 transition-colors">
                    Click to read full response →
                  </p>
                </button>
              ))}
            </div>
          )}
        </GlassCard>

      </div>
    </DashboardLayout>
  );
}

export default TeacherNotifications;
