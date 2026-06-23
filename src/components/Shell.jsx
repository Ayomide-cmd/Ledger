import { NavLink } from 'react-router-dom'
import InstrumentStrip from './InstrumentStrip.jsx'
import './Shell.css'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', glyph: 'grid' },
  { to: '/markets', label: 'Markets', glyph: 'list' }
]

function NavIcon({ kind }) {
  if (kind === 'grid') {
    return (
      <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
        <rect x="1.5" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="1.5" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="1.5" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
        <rect x="9" y="9" width="5.5" height="5.5" rx="1.2" stroke="currentColor" strokeWidth="1.4" />
      </svg>
    )
  }
  return (
    <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
      <circle cx="2.5" cy="3.5" r="1" fill="currentColor" />
      <circle cx="2.5" cy="8" r="1" fill="currentColor" />
      <circle cx="2.5" cy="12.5" r="1" fill="currentColor" />
      <line x1="5.5" y1="3.5" x2="14" y2="3.5" stroke="currentColor" strokeWidth="1.4" />
      <line x1="5.5" y1="8" x2="14" y2="8" stroke="currentColor" strokeWidth="1.4" />
      <line x1="5.5" y1="12.5" x2="14" y2="12.5" stroke="currentColor" strokeWidth="1.4" />
    </svg>
  )
}

export default function Shell({ children }) {
  return (
    <div className="shell">
      <aside className="shell-rail">
        <div className="shell-brand">
          <span className="shell-brand-mark">L</span>
          <span className="shell-brand-name">Ledger</span>
        </div>
        <nav className="shell-nav">
          <p className="shell-nav-section">Workspace</p>
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'shell-nav-link shell-nav-link-active' : 'shell-nav-link'
              }
            >
              <span className="shell-nav-glyph">
                <NavIcon kind={item.glyph} />
              </span>
              {item.label}
            </NavLink>
          ))}
        </nav>
        <div className="shell-rail-footer">
          <p className="shell-rail-footer-label">Data source</p>
          <p className="shell-rail-footer-value">CoinGecko API</p>
        </div>
      </aside>

      <div className="shell-main">
        <header className="shell-topbar">
          <div className="shell-topbar-search">
            <svg width="15" height="15" viewBox="0 0 16 16" fill="none" className="shell-search-icon">
              <circle cx="7" cy="7" r="5" stroke="currentColor" strokeWidth="1.4" />
              <line x1="10.8" y1="10.8" x2="14" y2="14" stroke="currentColor" strokeWidth="1.4" strokeLinecap="round" />
            </svg>
            <input type="text" placeholder="Search assets, e.g. Bitcoin or ETH" />
          </div>
          <div className="shell-topbar-actions">
            <button className="shell-icon-btn" aria-label="Notifications">
              <svg width="17" height="17" viewBox="0 0 16 16" fill="none">
                <path
                  d="M8 1.8c-2 0-3.4 1.6-3.4 3.7v2.1c0 .5-.2 1-.5 1.4l-.7.9c-.5.6-.1 1.5.7 1.5h7.8c.8 0 1.2-.9.7-1.5l-.7-.9c-.3-.4-.5-.9-.5-1.4V5.5c0-2.1-1.4-3.7-3.4-3.7z"
                  stroke="currentColor"
                  strokeWidth="1.3"
                  strokeLinejoin="round"
                />
                <path d="M6.3 13.2a1.7 1.7 0 003.4 0" stroke="currentColor" strokeWidth="1.3" />
              </svg>
            </button>
            <div className="shell-avatar">SA</div>
          </div>
        </header>

        <InstrumentStrip />

        <main className="shell-content">{children}</main>
      </div>
    </div>
  )
}
