import { useState, useMemo } from 'react'
import { useParams, Link } from 'react-router-dom'
import { usePolling } from '../hooks/usePolling.js'
import { getCoinDetail, getCoinMarketChart } from '../utils/api.js'
import { formatCurrency, formatPercent, formatCompactNumber, formatTime, classForDelta } from '../utils/format.js'
import LineChart from '../components/LineChart.jsx'
import KpiCard from '../components/KpiCard.jsx'
import PanelHeader from '../components/PanelHeader.jsx'
import { LoadingBlock, ErrorBanner } from '../components/StatusStates.jsx'
import './CoinDetail.css'

const RANGES = [
  { label: '24H', days: 1 },
  { label: '7D', days: 7 },
  { label: '30D', days: 30 },
  { label: '1Y', days: 365 }
]

function getSummary(rawText) {
  const stripped = rawText.replace(/<[^>]*>/g, '')
  const sentences = stripped.split('. ').slice(0, 3).join('. ')
  return sentences.endsWith('.') ? sentences : `${sentences}.`
}

export default function CoinDetail() {
  const { id } = useParams()
  const [rangeDays, setRangeDays] = useState(1)

  const detail = usePolling(() => getCoinDetail(id), 60000, [id])
  const chart = usePolling(() => getCoinMarketChart(id, rangeDays), 60000, [id, rangeDays])

  const chartPoints = useMemo(() => {
    const prices = chart.data?.prices
    if (!prices) return []
    return prices.map(([timestamp, value]) => ({
      label:
        rangeDays <= 1
          ? formatTime(timestamp)
          : new Date(timestamp).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      value
    }))
  }, [chart.data, rangeDays])

  if (detail.loading && !detail.data) {
    return <LoadingBlock height={400} label="Loading asset" />
  }

  if (detail.error && !detail.data) {
    return <ErrorBanner message="Could not load this asset." onRetry={detail.refetch} />
  }

  const coin = detail.data
  const marketData = coin?.market_data
  const change24h = marketData?.price_change_percentage_24h

  return (
    <div className="coin-detail-page">
      <Link to="/markets" className="coin-detail-back">
        ← Back to Markets
      </Link>

      <div className="coin-detail-head">
        <img src={coin.image?.large} alt="" width="40" height="40" />
        <div>
          <h1 className="coin-detail-name">
            {coin.name} <span className="coin-detail-symbol">{coin.symbol.toUpperCase()}</span>
          </h1>
          <p className="coin-detail-rank">Rank #{coin.market_cap_rank ?? '—'}</p>
        </div>
        <div className="coin-detail-price-block">
          <span className="coin-detail-price tabular">
            {formatCurrency(marketData?.current_price?.usd)}
          </span>
          <span className={`coin-detail-change tabular ${classForDelta(change24h)}`}>
            {formatPercent(change24h)} (24h)
          </span>
        </div>
      </div>

      <div className="coin-detail-kpis">
        <KpiCard label="Market Cap" value={formatCurrency(marketData?.market_cap?.usd, { compact: true })} />
        <KpiCard label="24h Volume" value={formatCurrency(marketData?.total_volume?.usd, { compact: true })} />
        <KpiCard label="Circulating Supply" value={formatCompactNumber(marketData?.circulating_supply)} />
        <KpiCard
          label="All-Time High"
          value={formatCurrency(marketData?.ath?.usd)}
          sublabel={marketData?.ath_date?.usd ? new Date(marketData.ath_date.usd).toLocaleDateString() : ''}
        />
      </div>

      <section className="coin-detail-chart-panel">
        <div className="coin-detail-chart-header">
          <PanelHeader
            title="Price chart"
            lastUpdated={chart.lastUpdated ? formatTime(chart.lastUpdated) : null}
          />
          <div className="coin-detail-range-switch">
            {RANGES.map((range) => (
              <button
                key={range.days}
                className={range.days === rangeDays ? 'range-btn range-btn-active' : 'range-btn'}
                onClick={() => setRangeDays(range.days)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {chart.loading && !chart.data ? (
          <LoadingBlock height={280} label="Loading chart" />
        ) : chart.error && !chart.data ? (
          <ErrorBanner message="Could not load chart data." onRetry={chart.refetch} />
        ) : (
          <LineChart points={chartPoints} positive={(change24h ?? 0) >= 0} />
        )}
      </section>

      {coin.description?.en && (
        <section className="coin-detail-about">
          <PanelHeader title={`About ${coin.name}`} />
          <p className="coin-detail-about-text">{getSummary(coin.description.en)}</p>
        </section>
      )}
    </div>
  )
}
