function RecentActivity() {
  const activities = [
    {
      title: "Parent reported fever",
      time: "2 mins ago",
    },
    {
      title: "Doctor verified report",
      time: "18 mins ago",
    },
    {
      title: "Vaccination updated",
      time: "Yesterday",
    },
    {
      title: "Health passport created",
      time: "Yesterday",
    },
    {
      title: "Health campaign scheduled",
      time: "2 days ago",
    },
  ];

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold">
        Recent Activity
      </h2>

      <div className="space-y-4">
        {activities.map((activity, index) => (
          <div
            key={index}
            className="border-l-4 border-blue-500 pl-4"
          >
            <h3 className="font-medium">
              {activity.title}
            </h3>

            <p className="text-sm text-slate-500">
              {activity.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RecentActivity;