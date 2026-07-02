function DashboardCard({ title, value, color }) {
  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">

      <h3 className="text-slate-500">
        {title}
      </h3>

      <h2
        className={`mt-4 text-4xl font-bold ${color}`}
      >
        {value}
      </h2>

    </div>
  );
}

export default DashboardCard;