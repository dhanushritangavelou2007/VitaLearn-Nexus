function RiskBadge({ level }) {
  const styles = {
    healthy: {
      text: "Healthy",
      color: "bg-green-100 text-green-700",
      icon: "🟢",
    },
    observation: {
      text: "Observation",
      color: "bg-yellow-100 text-yellow-700",
      icon: "🟡",
    },
    review: {
      text: "Needs Review",
      color: "bg-orange-100 text-orange-700",
      icon: "🟠",
    },
    critical: {
      text: "Doctor Attention",
      color: "bg-red-100 text-red-700",
      icon: "🔴",
    },
  };

  const badge = styles[level] || styles.healthy;

  return (
    <span
      className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-medium ${badge.color}`}
    >
      <span>{badge.icon}</span>
      {badge.text}
    </span>
  );
}

export default RiskBadge;