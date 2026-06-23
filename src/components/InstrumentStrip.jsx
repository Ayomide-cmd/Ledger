import { usePolling } from '../hooks/usePolling.js'
import { getMarkets } from '../utils/api.js'
import { formatCurrency, formatPercent, classForDelta } from '../utils/format.js'
import Sparkline from './Sparkline.jsx'
import './InstrumentStrip.css'

export default function InstrumentStrip() {
  const { data, loading, error } = usePolling(() => getMarkets({ perPage: 6 }), 45000, [])

  if (loading && !data) {
    return (
      <div className="instrument-strip">
        <span className="instrument-strip-status">Connecting to live feed</span>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="instrument-strip">
        <span className="instrument-strip-status instrument-strip-status-error">
          Feed unavailable, retrying automatically
        </span>
      </div>
    )
  }

  return (
    <div className="instrument-strip" role="region" aria-label="Live asset snapshot">
      {data.map((coin) => {
        const positive = (coin.price_change_percentage_24h ?? 0) >= 0
        return (
          <div className="instrument-chip" key={coin.id}>
            <img src={coin.image} alt="" width="18" height="18" className="instrument-chip-icon" />
            <div className="instrument-chip-meta">
              <span className="instrument-chip-symbol">{coin.symbol.toUpperCase()}</span>
              <span className="instrument-chip-price tabular">{formatCurrency(coin.current_price)}</span>
            </div>
            {coin.sparkline_in_7d?.price && (
              <Sparkline values={coin.sparkline_in_7d.price} positive={positive} width={56} height={22} />
            )}
            <span className={`instrument-chip-delta tabular ${classForDelta(coin.price_change_percentage_24h)}`}>
              {formatPercent(coin.price_change_percentage_24h)}
            </span>
          </div>
        )
      })}
    </div>
  )
}