import { useMemo, useState } from 'react'
import './LineChart.css'

export default function LineChart({ points, height = 280, positive = true }) {
  const [hoverIndex, setHoverIndex] = useState(null)
  const width = 760
  const padding = 24

  const { path, areaPath, coords, min, max } = useMemo(() => {
    if (!points || points.length === 0) {
      return { path: '', areaPath: '', coords: [], min: 0, max: 0 }
    }

    const values = points.map((p) => p.value)
    const min = Math.min(...values)
    const max = Math.max(...values)
    const range = max - min || 1

    const coords = points.map((p, index) => {
      const x =
        points.length === 1
          ? width / 2
          : padding + (index / (points.length - 1)) * (width - padding * 2)
      const y = padding + (1 - (p.value - min) / range) * (height - padding * 2)
      return { x, y, value: p.value, label: p.label }
    })

    const path = coords
      .map((c, i) => `${i === 0 ? 'M' : 'L'} ${c.x.toFixed(2)} ${c.y.toFixed(2)}`)
      .join(' ')

    const areaPath = `${path} L ${coords[coords.length - 1].x.toFixed(2)} ${height - padding} L ${coords[0].x.toFixed(2)} ${height - padding} Z`

    return { path, areaPath, coords, min, max }
  }, [points, height])

  if (!points || points.length === 0) {
    return <div className="line-chart-empty">No chart data available</div>
  }

  const lineColor = positive ? 'var(--gain)' : 'var(--loss)'
  const hovered = hoverIndex !== null ? coords[hoverIndex] : null

  function handleMove(event) {
    const svg = event.currentTarget
    const rect = svg.getBoundingClientRect()
    const relativeX = ((event.clientX - rect.left) / rect.width) * width
    let closest = 0
    let closestDist = Infinity
    coords.forEach((c, i) => {
      const dist = Math.abs(c.x - relativeX)
      if (dist < closestDist) {
        closestDist = dist
        closest = i
      }
    })
    setHoverIndex(closest)
  }

  return (
    <div className="line-chart-wrapper">
      <svg
        viewBox={`0 0 ${width} ${height}`}
        className="line-chart-svg"
        preserveAspectRatio="none"
        onMouseMove={handleMove}
        onMouseLeave={() => setHoverIndex(null)}
      >
        <defs>
          <linearGradient id="areaFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={lineColor} stopOpacity="0.18" />
            <stop offset="100%" stopColor={lineColor} stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0.25, 0.5, 0.75].map((fraction) => (
          <line
            key={fraction}
            x1={padding}
            x2={width - padding}
            y1={padding + fraction * (height - padding * 2)}
            y2={padding + fraction * (height - padding * 2)}
            className="line-chart-gridline"
          />
        ))}

        <path d={areaPath} fill="url(#areaFill)" stroke="none" />
        <path d={path} fill="none" stroke={lineColor} strokeWidth="1.75" />

        {hovered && (
          <>
            <line
              x1={hovered.x}
              x2={hovered.x}
              y1={padding}
              y2={height - padding}
              className="line-chart-cursor"
            />
            <circle cx={hovered.x} cy={hovered.y} r="4" fill={lineColor} stroke="var(--bg-panel)" strokeWidth="2" />
          </>
        )}
      </svg>

      {hovered && (
        <div
          className="line-chart-tooltip"
          style={{ left: `${(hovered.x / width) * 100}%` }}
        >
          <span className="line-chart-tooltip-label">{hovered.label}</span>
          <span className="line-chart-tooltip-value tabular">
            {hovered.value.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: hovered.value < 1 ? 4 : 2 })}
          </span>
        </div>
      )}

      <div className="line-chart-range">
        <span>{min.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
        <span>{max.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })}</span>
      </div>
    </div>
  )
}
