import { usePolling } from '../hooks/usePolling.js'
import { getMarkets } from '../utils/api.js'
import { formatCurrency, formatPercent, classForDelta } from '../utils/format.js'
import './TickerTape.css'

export default function TickerTape() {
  const { data, loading, error } = usePolling(() => getMarkets({ perPage: 16 }), 45000, [])

  if (loading && !data) {
    return (
      <div className="ticker-tape">
        <div className="ticker-tape-status">Connecting to feed…</div>
      </div>
    )
  }

  if (error && !data) {
    return (
      <div className="ticker-tape">
        <div className="ticker-tape-status ticker-tape-status-error">
          Feed unavailable. Retrying on next interval.
        </div>
      </div>
    )
  }

  const items = data || []
  const track = [...items, ...items]

  return (
    <div className="ticker-tape" role="region" aria-label="Live price ticker">
      <div className="ticker-tape-track">
        {track.map((coin, index) => (
          <div className="ticker-item" key={`${coin.id}-${index}`}>
            <span className="ticker-symbol">{coin.symbol.toUpperCase()}</span>
            <span className="ticker-price tabular">{formatCurrency(coin.current_price)}</span>
            <span className={`ticker-delta tabular ${classForDelta(coin.price_change_percentage_24h)}`}>
              {formatPercent(coin.price_change_percentage_24h)}
            </span>
          </div>
        ))}
      </div>
    </div>
  )
}
