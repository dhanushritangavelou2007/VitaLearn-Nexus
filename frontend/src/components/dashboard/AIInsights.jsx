import { Sparkles, ArrowRight } from "lucide-react";

function AIInsights({ stats, recentActivity }) {
  const latestActivity = recentActivity[0];
  const insight = latestActivity
    ? `${stats.needReview} students need observation or review. Latest report: ${latestActivity.studentName} - ${latestActivity.title} (${latestActivity.description}). AI support should help teachers prioritize follow-up and hydration/rest guidance, not make a diagnosis.`
    : `${stats.healthy} of ${stats.total} students are currently marked healthy. AI support can continue monitoring attendance, symptoms, and report trends for early wellness alerts.`;

  return (
    <div className="rounded-3xl bg-linear-to-br from-indigo-900 via-purple-900 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden flex flex-col justify-between h-full group">
      {/* Background glow effects */}
      <div className="absolute top-0 right-0 -mr-16 -mt-16 h-48 w-48 rounded-full bg-purple-500 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>
      <div className="absolute bottom-0 left-0 -ml-16 -mb-16 h-48 w-48 rounded-full bg-blue-500 opacity-20 blur-3xl group-hover:opacity-30 transition-opacity duration-500"></div>

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-6">
          <div className="flex h-8 w-8 items-center justify-center rounded-full bg-white/10 backdrop-blur-sm border border-white/20">
            <Sparkles size={16} className="text-purple-300" />
          </div>
          <h3 className="font-semibold text-purple-100 tracking-wide uppercase text-xs">AI Insight</h3>
        </div>

        <p className="text-lg font-medium leading-relaxed text-slate-100 mb-6">
          {insight}
        </p>
      </div>

      <div className="relative z-10 mt-auto">
        <button className="flex w-full items-center justify-between rounded-xl bg-white/10 px-4 py-3 text-sm font-medium hover:bg-white/20 transition-colors border border-white/10 backdrop-blur-sm">
          <span>View Detailed Analysis</span>
          <ArrowRight size={16} />
        </button>
      </div>
    </div>
  );
}

export default AIInsights;
