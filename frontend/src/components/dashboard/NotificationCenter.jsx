import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell, Check, Stethoscope, Clock, Syringe } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";
import { useMedicalReports } from "../../context/MedicalReportsContext";
import { useAuth } from "../../hooks/useAuth";

function NotificationCenter() {
  const { students, dashboardSummary } = useStudents();
  const { getNotificationsForUser, markNotificationRead } = useMedicalReports();
  const { user, role } = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);

  const userId = user?.id || user?._id || `${role}-default`;

  // Doctor observations for this user (students/parents/teachers).
  // Doctors don't receive these (they create them); admin uses the activity feed.
  const doctorNotifications = useMemo(() => {
    if (role === "doctor" || role === "admin") return [];
    return getNotificationsForUser(userId, role);
  }, [getNotificationsForUser, userId, role]);

  // General activity notifications (for doctors/admin, and as a secondary feed for teachers)
  const activityNotifications = useMemo(() => {
    if (role === "student" || role === "parent") return [];
    const activity = getRecentActivity(students, 5);
    return activity.map((item, index) => ({
      id: `${item.id}-${index}`,
      title: item.title,
      message: `${item.studentName}: ${item.description}`,
      unread: index < 3,
      type: "activity",
    }));
  }, [students, role]);

  // Vaccination notifications for teachers (from doctorNotifications filtered by type)
  // These are already included in doctorNotifications — no separate variable needed.
  // The type detection below in allNotifications handles the icon differentiation.

  const allNotifications = useMemo(() => {
    const doctorItems = doctorNotifications.map((n) => ({
      id: n.id,
      title: n.message,
      message: n.date,
      unread: !n.read,
      type: n.metadata?.type === "vaccination-pending" ? "vaccination" : "doctor",
      raw: n,
    }));
    return [...doctorItems, ...activityNotifications];
  }, [doctorNotifications, activityNotifications]);

  const unreadCount = allNotifications.filter((n) => n.unread).length;

  const handleItemClick = (item) => {
    if (item.type === "doctor") {
      markNotificationRead(item.id);
      setOpen(false);
      if (role === "student") navigate("/student/notifications");
      if (role === "parent") navigate("/parent/notifications");
      if (role === "teacher") navigate("/teacher/notifications");
    }
  };

  const notifPath = role === "student"
    ? "/student/notifications"
    : role === "parent"
    ? "/parent/notifications"
    : role === "teacher"
    ? "/teacher/notifications"
    : null;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="relative rounded-full bg-white/60 p-2.5 transition hover:bg-white border border-slate-200/60 shadow-sm backdrop-blur-sm"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" />
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-14 z-30 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
            <div>
              <div className="text-sm font-bold text-slate-800">Notifications</div>
              <div className="text-xs text-slate-400">{unreadCount} unread</div>
            </div>
            {notifPath && (
              <button
                onClick={() => { setOpen(false); navigate(notifPath); }}
                className="text-xs font-semibold text-blue-600 hover:text-blue-700"
              >
                View all
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-50">
            {allNotifications.length === 0 && (
              <div className="px-5 py-8 text-center text-sm text-slate-400">
                No notifications yet.
              </div>
            )}
            {allNotifications.map((item) => (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={`w-full text-left px-5 py-4 flex items-start gap-3 transition-colors ${
                  item.unread ? "bg-blue-50 hover:bg-blue-100" : "bg-white hover:bg-slate-50"
                }`}
              >
                <div className={`mt-0.5 h-8 w-8 rounded-xl flex items-center justify-center shrink-0 ${
                  item.type === "vaccination"
                    ? item.unread ? "bg-amber-100 text-amber-600" : "bg-slate-100 text-slate-500"
                    : item.type === "doctor"
                    ? item.unread ? "bg-emerald-100 text-emerald-600" : "bg-slate-100 text-slate-500"
                    : "bg-blue-100 text-blue-600"
                }`}>
                  {item.type === "vaccination" ? <Syringe size={14} /> : item.type === "doctor" ? <Stethoscope size={14} /> : <Check size={14} />}
                </div>
                <div className="flex-1 min-w-0">
                  <div className={`text-sm font-semibold truncate ${item.unread ? "text-slate-800" : "text-slate-600"}`}>
                    {item.title}
                  </div>
                  <div className="text-xs text-slate-400 flex items-center gap-1 mt-0.5">
                    <Clock size={9} /> {item.message}
                  </div>
                </div>
                {item.unread && (
                  <span className="shrink-0 h-2 w-2 rounded-full bg-blue-500 mt-2" />
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default NotificationCenter;
