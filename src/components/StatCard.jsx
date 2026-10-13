const RADIUS = 30;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;

export default function StatCard({ label, value, total, hint, color, track }) {
  const ratio = total > 0 ? value / total : 0;
  const percent = Math.round(ratio * 100);

  return (
    <div className="stat">
      <div className="stat__ring">
        <svg width="56" height="56" viewBox="0 0 72 72" aria-hidden="true">
          <circle cx="36" cy="36" r={RADIUS} fill="none" stroke={track} strokeWidth="8" />
          {value > 0 && (
            <circle
              cx="36"
              cy="36"
              r={RADIUS}
              fill="none"
              stroke={color}
              strokeWidth="8"
              strokeLinecap="round"
              strokeDasharray={`${ratio * CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              transform="rotate(-90 36 36)"
            />
          )}
        </svg>
        <div>{percent}%</div>
      </div>
      <div>
        <div className="stat__label">{label}</div>
        <div className="stat__value">{value}</div>
        <div className="stat__hint">{hint}</div>
      </div>
    </div>
  );
}
