import GlassCard from "../ui/GlassCard";
import { BrainCircuit, Sparkles } from "lucide-react";

function AISummary({ summary }) {
  return (
    <GlassCard className="p-8">
      <div className="flex items-center gap-4">
        <div className="rounded-2xl bg-linear-to-br from-violet-600 to-indigo-600 p-4 text-white">
          <BrainCircuit size={28} />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-slate-900">AI Health Summary</h2>
          <p className="text-slate-500">AI-generated overview for quick review</p>
        </div>
      </div>
      <div className="mt-8 rounded-2xl bg-slate-50 p-6 leading-8 text-slate-700">
        <div className="mb-4 flex items-center gap-2 text-violet-600">
          <Sparkles size={20} />
          <span className="font-semibold">Summary</span>
        </div>
        <p>{summary}</p>
      </div>
      <div className="mt-6 rounded-xl border border-blue-200 bg-blue-50 p-4 text-sm text-blue-800">
        <strong>Note:</strong> This summary is AI-generated to assist with reviewing records. It is informational only and should be reviewed by qualified healthcare professionals before making medical decisions.
      </div>
    </GlassCard>
  );
}

export default AISummary;

