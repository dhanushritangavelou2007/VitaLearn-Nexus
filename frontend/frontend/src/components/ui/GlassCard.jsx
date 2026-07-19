function GlassCard({ children, className = "", ...props }) {
  return (
    <div
      className={`rounded-4xl border border-white/70 bg-white/70 p-6 shadow-[0_20px_80px_-30px_rgba(15,23,42,0.35)] backdrop-blur-xl ${className}`}
      {...props}
    >
      {children}
    </div>
  );
}

export default GlassCard;
