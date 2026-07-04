import students from "../../data/students";
import RiskBadge from "./RiskBadge";

function StudentTable() {
  return (
    <div className="rounded-2xl bg-white shadow-md overflow-hidden">

      {/* Header */}

      <div className="flex items-center justify-between border-b p-6">

        <h2 className="text-2xl font-bold text-slate-800">
          Students
        </h2>

        <button className="rounded-xl bg-blue-600 px-5 py-2 text-white transition hover:bg-blue-700">
          + Create Passport
        </button>

      </div>

      {/* Table */}

      <table className="w-full">

        <thead className="bg-slate-50">

          <tr>

            <th className="px-6 py-4 text-left">Student</th>

            <th className="px-6 py-4 text-left">Class</th>

            <th className="px-6 py-4 text-left">Attendance</th>

            <th className="px-6 py-4 text-left">Risk</th>

            <th className="px-6 py-4 text-left">Last Update</th>

            <th className="px-6 py-4 text-center">Action</th>

          </tr>

        </thead>

        <tbody>

          {students.map((student) => (

            <tr
              key={student.id}
              className="border-b hover:bg-slate-50 transition"
            >

              <td className="px-6 py-4">

                <div>

                  <h3 className="font-semibold">
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

              <td className="px-6 py-4 text-center">

                <button className="rounded-lg bg-slate-100 px-4 py-2 hover:bg-slate-200">
                  View
                </button>

              </td>

            </tr>

          ))}

        </tbody>

      </table>

    </div>
  );
}

export default StudentTable;