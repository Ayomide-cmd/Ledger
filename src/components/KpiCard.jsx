import './KpiCard.css'

export default function KpiCard({ label, value, delta, deltaLabel, sublabel }) {
  const deltaClass =
    delta === undefined || delta === null
      ? ''
      : delta >= 0
        ? 'kpi-delta-positive'
        : 'kpi-delta-negative'

  return (
    <div className="kpi-card">
      <p className="kpi-label">{label}</p>
      <p className="kpi-value tabular">{value}</p>
      <div className="kpi-footer">
        {delta !== undefined && delta !== null && (
          <span className={`kpi-delta tabular ${deltaClass}`}>
            {delta >= 0 ? '▲' : '▼'} {Math.abs(delta).toFixed(2)}%
          </span>
        )}
        {sublabel && <span className="kpi-sublabel">{sublabel}</span>}
        {deltaLabel && <span className="kpi-delta-label">{deltaLabel}</span>}
      </div>
    </div>
  )
}
