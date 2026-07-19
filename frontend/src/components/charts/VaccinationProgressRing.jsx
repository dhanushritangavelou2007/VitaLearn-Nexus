import { getVaccinationProgress, REQUIRED_VACCINATIONS } from "../../utils/healthStatus";
import { ShieldCheck, ShieldAlert } from "lucide-react";

/**
 * VaccinationProgressRing
 * ─────────────────────────────────────────────────────────────
 * Premium animated SVG ring that visualises how many of the 4
 * required vaccinations a student has completed.
 *
 * Props:
 *   vaccinations  — array of completed vaccine name strings
 *   size          — pixel diameter of the ring (default 160)
 *   showList      — if true, renders a vaccine checklist below
 * ─────────────────────────────────────────────────────────────
 */
function VaccinationProgressRing({ vaccinations = [], size = 160, showList = false }) {
  const { completed, total, percent } = getVaccinationProgress(vaccinations);

  /* SVG geometry */
  const strokeWidth = size * 0.075;
  const radius      = (size - strokeWidth * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const filledDash  = (percent / 100) * circumference;
  const cx = size / 2;
  const cy = size / 2;

  /* Colour palette based on progress */
  const ringColor =
    percent === 100 ? "#10b981"  // emerald-500 — all done
    : percent >= 75  ? "#059669"  // emerald-600
    : percent >= 50  ? "#f59e0b"  // amber-500
    : percent > 0    ? "#ef4444"  // red-500
    :                  "#cbd5e1"; // slate-300 — none

  const labelColor =
    percent === 100 ? "text-emerald-600"
    : percent >= 50  ? "text-amber-600"
    : percent > 0    ? "text-red-600"
    :                  "text-slate-400";

  const badgeGradient =
    percent === 100
      ? "from-emerald-500 to-teal-500"
      : percent >= 75
      ? "from-emerald-500 to-cyan-500"
      : percent >= 50
      ? "from-amber-400 to-orange-400"
      : "from-rose-400 to-red-500";

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Ring */}
      <div className="relative" style={{ width: size, height: size }}>
        <svg
          width={size}
          height={size}
          viewBox={`0 0 ${size} ${size}`}
          style={{ transform: "rotate(-90deg)" }}
        >
          {/* Track */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth={strokeWidth}
          />
          {/* Progress arc */}
          <circle
            cx={cx}
            cy={cy}
            r={radius}
            fill="none"
            stroke={ringColor}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={`${filledDash} ${circumference - filledDash}`}
            strokeDashoffset={0}
            style={{ transition: "stroke-dasharray 0.8s cubic-bezier(0.4, 0, 0.2, 1)" }}
          />
        </svg>

        {/* Centre label */}
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className={`text-3xl font-extrabold leading-none ${labelColor}`}>
            {completed}/{total}
          </span>
          <span className="mt-1 text-xs font-semibold text-slate-400 uppercase tracking-wider">
            vaccines
          </span>
        </div>
      </div>

      {/* Badge */}
      <div className={`inline-flex items-center gap-1.5 rounded-full bg-gradient-to-r ${badgeGradient} px-4 py-1.5 text-xs font-bold text-white shadow-sm`}>
        {percent === 100 ? (
          <ShieldCheck size={12} />
        ) : (
          <ShieldAlert size={12} />
        )}
        {percent === 100 ? "Fully Vaccinated" : `${percent}% Complete`}
      </div>

      {/* Optional vaccine checklist */}
      {showList && (
        <div className="w-full space-y-2">
          {REQUIRED_VACCINATIONS.map((vaccine) => {
            const done = (vaccinations || []).includes(vaccine);
            return (
              <div
                key={vaccine}
                className={`flex items-center justify-between rounded-xl px-4 py-2.5 text-sm font-medium border transition-colors ${
                  done
                    ? "bg-emerald-50 border-emerald-100 text-emerald-700"
                    : "bg-rose-50 border-rose-100 text-rose-600"
                }`}
              >
                <span>{vaccine}</span>
                {done ? (
                  <span className="flex items-center gap-1 text-xs font-semibold text-emerald-600">
                    <ShieldCheck size={13} /> Done
                  </span>
                ) : (
                  <span className="text-xs font-semibold text-rose-500">Pending</span>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default VaccinationProgressRing;
