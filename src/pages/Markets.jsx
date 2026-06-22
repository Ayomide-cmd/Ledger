import { usePolling } from '../hooks/usePolling.js'
import { getMarkets } from '../utils/api.js'
import { formatTime } from '../utils/format.js'
import CoinTable from '../components/CoinTable.jsx'
import PanelHeader from '../components/PanelHeader.jsx'
import { LoadingBlock, ErrorBanner } from '../components/StatusStates.jsx'
import './Markets.css'

export default function Markets() {
  const { data, loading, error, lastUpdated, refetch } = usePolling(
    () => getMarkets({ perPage: 100 }),
    45000,
    []
  )

  return (
    <div className="markets-page">
      <div className="page-intro">
        <h1 className="page-title">Markets</h1>
        <p className="page-subtitle">Top 100 assets by market capitalization</p>
      </div>

      <PanelHeader
        title="All assets"
        subtitle="Click a row to view details"
        lastUpdated={lastUpdated ? formatTime(lastUpdated) : null}
      />

      {error && !data && <ErrorBanner message="Could not load market data." onRetry={refetch} />}

      {loading && !data ? (
        <LoadingBlock height={400} label="Loading markets" />
      ) : (
        data && <CoinTable coins={data} />
      )}
    </div>
  )
}
