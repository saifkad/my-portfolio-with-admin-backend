function buildLast30Days(daily) {
  const counts = new Map(daily.map((d) => [d._id, d.count]));
  const days = [];
  for (let i = 29; i >= 0; i--) {
    const date = new Date(Date.now() - i * 86400000).toISOString().slice(0, 10);
    days.push({ date, count: counts.get(date) || 0 });
  }
  return days;
}

export default function Sparkline({ daily }) {
  const days = buildLast30Days(daily);
  const max = Math.max(1, ...days.map((d) => d.count));
  const w = 560, h = 120, pad = 6;

  const points = days.map((d, i) => ({
    ...d,
    x: pad + (i * (w - pad * 2)) / (days.length - 1),
    y: h - pad - (d.count / max) * (h - pad * 2),
  }));
  const line = points.map((p) => `L${p.x},${p.y}`).join(' ');
  const area = `M${points[0].x},${h - pad} ${line} L${points[points.length - 1].x},${h - pad} Z`;

  return (
    <svg viewBox={`0 0 ${w} ${h}`} className="w-full" role="img" aria-label="Daily visits, last 30 days">
      <defs>
        <linearGradient id="spark-fill" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.35" />
          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0" />
        </linearGradient>
      </defs>
      <path d={area} fill="url(#spark-fill)" />
      <path
        d={`M${points[0].x},${points[0].y} ${line}`}
        fill="none" stroke="#60a5fa" strokeWidth="2"
        strokeLinejoin="round" strokeLinecap="round"
      />
      {points.map((p) => (
        <circle key={p.date} cx={p.x} cy={p.y} r={p.count > 0 ? 2.5 : 0} fill="#60a5fa">
          <title>{`${p.date}: ${p.count} visit${p.count === 1 ? '' : 's'}`}</title>
        </circle>
      ))}
    </svg>
  );
}