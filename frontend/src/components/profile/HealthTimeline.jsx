import GlassCard from "../ui/GlassCard";
import { HeartPulse } from "lucide-react";

function HealthTimeline({ student }) {
  const timeline = [
    ...(student.reports || []).map((report) => ({
      id: `${report.date}-${report.type}`,
      date: report.date,
      title: report.type,
      description: report.status,
      type: "report",
    })),
    ...((student.symptoms || [])
      .filter((symptom) => symptom !== "None")
      .map((symptom) => ({
        id: `symptom-${symptom}`,
        date: student.lastUpdate,
        title: "Symptom Noted",
        description: symptom,
        type: "symptom",
      }))),
  ];

  return (
    <GlassCard className="p-6">
      <div className="flex items-center gap-3 mb-6">
        <div className="rounded-2xl bg-slate-100 p-2.5 text-slate-600">
          <HeartPulse size={18} />
        </div>
        <h3 className="font-bold text-slate-800 text-lg">Health Timeline</h3>
      </div>
      <div className="relative border-l-2 border-slate-100 ml-3 space-y-6 pb-2">
        {timeline.length === 0 ? (
          <p className="text-sm text-slate-500 pl-6">No timeline activity recorded.</p>
        ) : (
          timeline.map((item) => (
            <div key={item.id} className="relative pl-6">
              <span className={`absolute -left-2 top-1 h-4 w-4 rounded-full border-4 border-white ${item.type === "symptom" ? "bg-amber-500" : "bg-blue-500"}`} />
              <div className="text-xs text-slate-400 font-medium mb-1">{item.date}</div>
              <div className="font-semibold text-slate-700 text-sm mb-0.5">{item.title}</div>
              <div className="text-sm text-slate-500 leading-relaxed">{item.description}</div>
            </div>
          ))
        )}
      </div>
    </GlassCard>
  );
}

export default HealthTimeline;
