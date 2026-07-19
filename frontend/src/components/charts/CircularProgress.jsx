function CircularProgress({ value = 0, label = "Progress", size = 160, accent = "from-blue-600 to-cyan-500" }) {
  const normalized = Math.max(0, Math.min(100, Number(value) || 0));
  return (
    <div className="flex flex-col items-center gap-3">
      <div
        className="relative rounded-full"
        style={{
          width: size,
          height: size,
          background: `conic-gradient(#2563eb ${normalized * 3.6}deg, rgba(203,213,225,0.35) 0deg)`,
        }}
      >
        <div className="absolute inset-3 flex items-center justify-center rounded-full bg-white/90 backdrop-blur-xl">
          <div className={`bg-linear-to-br ${accent} bg-clip-text text-3xl font-bold text-transparent`}>{normalized}%</div>
        </div>
      </div>
      <div className="text-center">
        <div className="font-semibold text-slate-800">{label}</div>
      </div>
    </div>
  );
}

export default CircularProgress;

