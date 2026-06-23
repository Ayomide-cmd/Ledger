import { usePolling } from '../hooks/usePolling.js'
import { getGlobal, getMarkets, getCoinMarketChart, getTrending } from '../utils/api.js'
import { formatCurrency, formatCompactNumber, formatTime } from '../utils/format.js'
import KpiCard from '../components/KpiCard.jsx'
import LineChart from '../components/LineChart.jsx'
import PanelHeader from '../components/PanelHeader.jsx'
import { LoadingBlock, ErrorBanner } from '../components/StatusStates.jsx'
import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import './Overview.css'

function KpiIcon({ kind }) {
  if (kind === 'cap') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <path d="M2 8h12M8 2v12" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
        <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  }
  if (kind === 'volume') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <rect x="2" y="9" width="2.5" height="5" fill="currentColor" />
        <rect x="6.75" y="5.5" width="2.5" height="8.5" fill="currentColor" />
        <rect x="11.5" y="2" width="2.5" height="12" fill="currentColor" />
      </svg>
    )
  }
  if (kind === 'dominance') {
    return (
      <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
        <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
        <path d="M8 1.8A6.2 6.2 0 0114.2 8H8z" fill="currentColor" />
      </svg>
    )
  }
  return (
    <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
      <circle cx="8" cy="8" r="6.2" stroke="currentColor" strokeWidth="1.4" />
      <path d="M8 4.6v3.6l2.4 2" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
    </svg>
  )
}

export default function Overview() {
  const navigate = useNavigate()

  const global = usePolling(() => getGlobal(), 60000, [])
  const markets = usePolling(() => getMarkets({ perPage: 5 }), 45000, [])
  const btcChart = usePolling(() => getCoinMarketChart('bitcoin', 1), 60000, [])
  const trending = usePolling(() => getTrending(), 90000, [])

  const chartPoints = useMemo(() => {
    const prices = btcChart.data?.prices
    if (!prices) return []
    return prices.map(([timestamp, value]) => ({
      label: formatTime(timestamp),
      value
    }))
  }, [btcChart.data])

  const globalData = global.data?.data
  const totalMarketCap = globalData?.total_market_cap?.usd
  const totalVolume = globalData?.total_volume?.usd
  const btcDominance = globalData?.market_cap_percentage?.btc
  const marketCapChange = globalData?.market_cap_change_percentage_24h_usd

  const bitcoin = markets.data?.find((coin) => coin.id === 'bitcoin')
  const btcPriceChange = bitcoin?.price_change_percentage_24h

  return (
    <div className="overview-page">
      <div className="page-intro">
        <h1 className="page-title">Overview</h1>
        <p className="page-subtitle">Global market snapshot, refreshed automatically</p>
      </div>

      {global.error && !global.data && (
        <ErrorBanner message="Could not load global market data." onRetry={global.refetch} />
      )}

      <div className="kpi-grid">
        {global.loading && !global.data ? (
          <LoadingBlock height={100} label="Loading KPIs" />
        ) : (
          <>
            <KpiCard
              label="Total Market Cap"
              value={formatCurrency(totalMarketCap, { compact: true })}
              delta={marketCapChange}
              icon={<KpiIcon kind="cap" />}
            />
            <KpiCard
              label="24h Volume"
              value={formatCurrency(totalVolume, { compact: true })}
              sublabel="across tracked assets"
              icon={<KpiIcon kind="volume" />}
            />
            <KpiCard
              label="BTC Dominance"
              value={btcDominance ? `${btcDominance.toFixed(1)}%` : '—'}
              sublabel="of total market cap"
              icon={<KpiIcon kind="dominance" />}
            />
            <KpiCard
              label="BTC Price (24h)"
              value={formatCurrency(bitcoin?.current_price)}
              delta={btcPriceChange}
              icon={<KpiIcon kind="price" />}
            />
          </>
        )}
      </div>

      <div className="overview-grid">
        <section className="overview-chart-panel">
          <PanelHeader
            title="Bitcoin — 24h"
            subtitle="Price movement, last 24 hours"
            lastUpdated={btcChart.lastUpdated ? formatTime(btcChart.lastUpdated) : null}
          />
          {btcChart.loading && !btcChart.data ? (
            <LoadingBlock height={280} label="Loading chart" />
          ) : btcChart.error && !btcChart.data ? (
            <ErrorBanner message="Could not load chart data." onRetry={btcChart.refetch} />
          ) : (
            <LineChart points={chartPoints} positive={(btcPriceChange ?? 0) >= 0} />
          )}
        </section>

        <section className="overview-trending-panel">
          <PanelHeader title="Trending" subtitle="Most searched, last 24 hours" />
          {trending.loading && !trending.data ? (
            <LoadingBlock height={280} label="Loading trending" />
          ) : trending.error && !trending.data ? (
            <ErrorBanner message="Could not load trending coins." onRetry={trending.refetch} />
          ) : (
            <ul className="trending-list">
              {trending.data?.coins?.slice(0, 7).map((entry, index) => (
                <li
                  key={entry.item.id}
                  className="trending-row"
                  onClick={() => navigate(`/coin/${entry.item.id}`)}
                >
                  <span className="trending-rank">{index + 1}</span>
                  <img src={entry.item.small} alt="" width="22" height="22" className="trending-icon" />
                  <div className="trending-meta">
                    <span className="trending-name">{entry.item.name}</span>
                    <span className="trending-symbol">{entry.item.symbol.toUpperCase()}</span>
                  </div>
                  <span className="trending-cap-rank tabular">
                    {entry.item.market_cap_rank ? `#${entry.item.market_cap_rank}` : '—'}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="overview-top-panel">
        <PanelHeader title="Top Assets" subtitle="By market capitalization" />
        {markets.loading && !markets.data ? (
          <LoadingBlock height={160} label="Loading assets" />
        ) : markets.error && !markets.data ? (
          <ErrorBanner message="Could not load top assets." onRetry={markets.refetch} />
        ) : (
          <div className="mini-cards-grid">
            {markets.data?.map((coin) => (
              <button
                key={coin.id}
                className="mini-card"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <div className="mini-card-head">
                  <img src={coin.image} alt="" width="24" height="24" />
                  <span className="mini-card-symbol">{coin.symbol.toUpperCase()}</span>
                </div>
                <span className="mini-card-price tabular">{formatCurrency(coin.current_price)}</span>
                <span className="mini-card-cap tabular">{formatCompactNumber(coin.market_cap)} cap</span>
              </button>
            ))}
          </div>
        )}
      </section>
    </div>
  )
}
