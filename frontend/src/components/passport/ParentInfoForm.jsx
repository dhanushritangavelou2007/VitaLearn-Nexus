import GlassCard from "../ui/GlassCard";

function ParentInfoForm() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        👨‍👩‍👧 Parent Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Parent Name
          </label>

          <input
            type="text"
            placeholder="Enter parent name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Relationship
          </label>

          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>Father</option>
            <option>Mother</option>
            <option>Guardian</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Phone Number
          </label>

          <input
            type="tel"
            placeholder="+91 XXXXX XXXXX"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Email Address
          </label>

          <input
            type="email"
            placeholder="parent@email.com"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

      </div>
    </GlassCard>
  );
}

export default ParentInfoForm;