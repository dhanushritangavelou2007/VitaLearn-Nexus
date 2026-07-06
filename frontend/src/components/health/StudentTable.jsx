import { useNavigate } from "react-router-dom";
import students from "../../data/students";
import GlassCard from "../ui/GlassCard";
import RiskBadge from "./RiskBadge";

function StudentTable() {
  const navigate = useNavigate();

  return (
    <GlassCard className="overflow-hidden p-0">
      <div className="flex flex-col gap-4 border-b border-slate-200/80 p-6 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-slate-900">
            Students at a Glance
          </h2>

          <p className="mt-1 text-sm text-slate-500">
            Priority health signals and recent updates for the active classroom.
          </p>
        </div>

        <button
          onClick={() => navigate("/teacher/create-passport")}
          className="rounded-2xl bg-gradient-to-r from-blue-600 to-teal-500 px-4 py-2.5 text-sm font-semibold text-white shadow-lg transition hover:-translate-y-0.5"
        >
          + Create Passport
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full">

          <thead className="bg-slate-50 text-left text-sm text-slate-500">
            <tr>
              <th className="px-6 py-4">Student</th>
              <th className="px-6 py-4">Class</th>
              <th className="px-6 py-4">Attendance</th>
              <th className="px-6 py-4">Risk</th>
              <th className="px-6 py-4">Last Update</th>
              <th className="px-6 py-4 text-center">Actions</th>
            </tr>
          </thead>

          <tbody>
            {students.map((student) => (
              <tr
                key={student.id}
                className="border-t border-slate-100 transition hover:bg-slate-50"
              >
                <td className="px-6 py-4">
                  <div>
                    <h3 className="font-semibold text-slate-900">
                      {student.name}
                    </h3>

                    <p className="text-sm text-slate-500">
                      Blood Group: {student.bloodGroup}
                    </p>
                  </div>
                </td>

                <td className="px-6 py-4">
                  {student.class}
                </td>

                <td className="px-6 py-4">
                  {student.attendance}
                </td>

                <td className="px-6 py-4">
                  <RiskBadge level={student.risk} />
                </td>

                <td className="px-6 py-4">
                  {student.lastUpdate}
                </td>

                <td className="px-6 py-4">
                  <div className="flex justify-center gap-2">

                    <button
                      onClick={() => navigate("/teacher/student-profile")}
                      className="rounded-lg bg-blue-100 px-3 py-2 text-xs font-semibold text-blue-700 transition hover:bg-blue-200"
                    >
                      View Profile
                    </button>

                    <button
                      onClick={() => navigate("/teacher/report-symptoms")}
                      className="rounded-lg bg-amber-100 px-3 py-2 text-xs font-semibold text-amber-700 transition hover:bg-amber-200"
                    >
                      Report
                    </button>

                  </div>
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>
    </GlassCard>
  );
}

export default StudentTable;