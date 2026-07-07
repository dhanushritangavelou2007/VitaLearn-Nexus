import { useNavigate } from "react-router-dom";
import { CheckCircle2, AlertCircle, Clock } from "lucide-react";
import { getRiskLabel, getRiskStyle } from "../../data/students";
import { useStudents } from "../../hooks/useStudents";

const statusIcons = {
  healthy: CheckCircle2,
  observation: Clock,
  review: Clock,
  critical: AlertCircle,
};

function StudentTable({ students }) {
  const navigate = useNavigate();
  const studentContext = useStudents();
  const visibleStudents = (students || studentContext.students).slice(0, 5);

  return (
    <div className="rounded-3xl bg-white/70 backdrop-blur-xl border border-white shadow-sm overflow-hidden flex flex-col h-full">
      <div className="p-6 border-b border-slate-100 flex items-center justify-between">
        <div>
          <h3 className="text-lg font-bold text-slate-800">Recent Screenings</h3>
          <p className="text-sm text-slate-500">Today's health check results</p>
        </div>
        <button
          onClick={() => navigate("/teacher/students")}
          className="text-sm font-medium text-blue-600 hover:text-blue-700"
        >
          View All
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="bg-slate-50/50 text-slate-500 text-xs uppercase tracking-wider">
              <th className="px-6 py-4 font-semibold">Student Name</th>
              <th className="px-6 py-4 font-semibold">ID</th>
              <th className="px-6 py-4 font-semibold">Status</th>
              <th className="px-6 py-4 font-semibold">Time</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100/80">
            {visibleStudents.map((student) => {
              const StatusIcon = statusIcons[student.risk] || Clock;
              const status = getRiskLabel(student.risk);
              const style = getRiskStyle(student.risk);

              return (
              <tr
                key={student.id}
                onClick={() => navigate(`/teacher/student-profile/${student.id}`)}
                className="hover:bg-white/50 transition-colors cursor-pointer"
              >
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-800">{student.name}</div>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{student.rollNo}</td>
                <td className="px-6 py-4">
                  <span className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${style.pill}`}>
                    <StatusIcon size={14} /> {status}
                  </span>
                </td>
                <td className="px-6 py-4 text-slate-500 text-sm">{student.lastUpdate}</td>
              </tr>
            );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default StudentTable;
