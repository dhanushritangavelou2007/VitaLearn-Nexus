import { useMemo, useState } from "react";
import { Bell, Check } from "lucide-react";
import { useStudents } from "../../hooks/useStudents";
import { getRecentActivity } from "../../utils/studentAnalytics";

function NotificationCenter() {
  const { students, dashboardSummary } = useStudents();
  const [open, setOpen] = useState(false);

  const notifications = useMemo(() => {
    const activity = getRecentActivity(students, 6);
    return activity.map((item, index) => ({
      id: `${item.id}-${index}`,
      title: item.title,
      message: `${item.studentName}: ${item.description}`,
      unread: index < 3,
    }));
  }, [students]);

  const unreadCount = notifications.filter((item) => item.unread).length;

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((value) => !value)}
        className="relative rounded-full bg-white/60 p-2.5 transition hover:bg-white border border-slate-200/60 shadow-sm backdrop-blur-sm"
      >
        <Bell size={20} className="text-slate-600" />
        {unreadCount > 0 ? <span className="absolute right-2 top-2 h-2.5 w-2.5 rounded-full bg-red-500 border-2 border-white" /> : null}
      </button>

      {open ? (
        <div className="absolute right-0 top-14 z-30 w-96 overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-2xl">
          <div className="flex items-center justify-between border-b border-slate-100 px-4 py-3">
            <div>
              <div className="text-sm font-semibold text-slate-800">Notifications</div>
              <div className="text-xs text-slate-500">{unreadCount} unread updates</div>
            </div>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-xs font-semibold text-blue-700">
              {dashboardSummary?.reportsToday ?? 0} today
            </span>
          </div>
          <div className="max-h-96 overflow-y-auto p-2">
            {notifications.map((notification) => (
              <div key={notification.id} className={`rounded-2xl px-4 py-3 ${notification.unread ? "bg-slate-50" : "bg-white"}`}>
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="font-semibold text-slate-800">{notification.title}</div>
                    <div className="text-sm text-slate-500">{notification.message}</div>
                  </div>
                  {notification.unread ? <Check size={16} className="mt-1 text-blue-500" /> : null}
                </div>
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default NotificationCenter;

