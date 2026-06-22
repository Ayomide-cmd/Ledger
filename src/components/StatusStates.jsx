import './StatusStates.css'

export function LoadingBlock({ height = 200, label = 'Loading data' }) {
  return (
    <div className="status-loading" style={{ height }}>
      <div className="status-loading-bar" />
      <span className="status-loading-label">{label}</span>
    </div>
  )
}

export function ErrorBanner({ message, onRetry }) {
  return (
    <div className="status-error">
      <span>{message}</span>
      {onRetry && (
        <button className="status-error-retry" onClick={onRetry}>
          Retry
        </button>
      )}
    </div>
  )
}
