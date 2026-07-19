import { useStudents } from "../../hooks/useStudents";
import RiskBadge from "./RiskBadge";

function AttentionList() {
  const { students } = useStudents();
  const attentionStudents = students.filter(
    (student) =>
      student.risk === "review" || student.risk === "critical"
  );

  return (
    <div className="rounded-2xl bg-white p-6 shadow-md">
      <h2 className="mb-6 text-xl font-bold">
        Students Needing Attention
      </h2>

      <div className="space-y-4">
        {attentionStudents.map((student) => (
          <div
            key={student.id}
            className="flex items-center justify-between border-b pb-3 last:border-none"
          >
            <div>
              <h3 className="font-semibold">
                {student.name}
              </h3>

              <p className="text-sm text-slate-500">
                {student.class}
              </p>
            </div>

            <RiskBadge level={student.risk} />
          </div>
        ))}
      </div>
    </div>
  );
}

export default AttentionList;