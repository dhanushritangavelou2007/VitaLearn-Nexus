import GlassCard from "../ui/GlassCard";

function StudentInfoForm() {
  return (
    <GlassCard className="p-8">
      <h2 className="mb-6 text-xl font-bold text-slate-800">
        👤 Student Information
      </h2>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Student Name
          </label>
          <input
            type="text"
            placeholder="Enter student name"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Admission Number
          </label>
          <input
            type="text"
            placeholder="ADM-2026-001"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Roll Number
          </label>
          <input
            type="text"
            placeholder="21"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Class
          </label>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>VIII-A</option>
            <option>VIII-B</option>
            <option>IX-A</option>
            <option>IX-B</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Date of Birth
          </label>
          <input
            type="date"
            className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Gender
          </label>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-600">
            Blood Group
          </label>
          <select className="w-full rounded-xl border border-slate-200 px-4 py-3 focus:border-blue-500 focus:outline-none">
            <option>A+</option>
            <option>A-</option>
            <option>B+</option>
            <option>B-</option>
            <option>AB+</option>
            <option>AB-</option>
            <option>O+</option>
            <option>O-</option>
          </select>
        </div>

      </div>
    </GlassCard>
  );
}

export default StudentInfoForm;