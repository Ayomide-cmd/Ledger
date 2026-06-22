import './PanelHeader.css'

export default function PanelHeader({ title, subtitle, lastUpdated }) {
  return (
    <div className="panel-header">
      <div>
        <h2 className="panel-header-title">{title}</h2>
        {subtitle && <p className="panel-header-subtitle">{subtitle}</p>}
      </div>
      {lastUpdated && (
        <div className="panel-header-status">
          <span className="panel-header-dot" />
          Updated {lastUpdated}
        </div>
      )}
    </div>
  )
}
