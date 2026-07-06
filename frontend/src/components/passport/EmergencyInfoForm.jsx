import GlassCard from "../ui/GlassCard";

function EmergencyInfoForm() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        🚑 Emergency Profile
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Emergency Contact
          </label>

          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Allergies
          </label>

          <input
            type="text"
            placeholder="Peanuts, Dust..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Existing Medical Conditions
          </label>

          <textarea
            rows="3"
            placeholder="Asthma, Diabetes..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="md:col-span-2">
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Current Medications
          </label>

          <textarea
            rows="3"
            placeholder="Mention ongoing medications..."
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

      </div>
    </GlassCard>
  );
}

export default EmergencyInfoForm;