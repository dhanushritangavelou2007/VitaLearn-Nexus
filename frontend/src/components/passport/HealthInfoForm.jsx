import GlassCard from "../ui/GlassCard";

function HealthInfoForm() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        🩺 Health Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Height (cm)
          </label>

          <input
            type="number"
            placeholder="150"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Weight (kg)
          </label>

          <input
            type="number"
            placeholder="42"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Vision Status
          </label>

          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>Normal</option>
            <option>Uses Glasses</option>
            <option>Needs Examination</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Vaccination Status
          </label>

          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>Up to Date</option>
            <option>Pending</option>
            <option>Unknown</option>
          </select>
        </div>

      </div>
    </GlassCard>
  );
}

export default HealthInfoForm;