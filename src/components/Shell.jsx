import { NavLink } from 'react-router-dom'
import TickerTape from './TickerTape.jsx'
import './Shell.css'

const NAV_ITEMS = [
  { to: '/', label: 'Overview', glyph: '◆' },
  { to: '/markets', label: 'Markets', glyph: '▤' }
]

export default function Shell({ children }) {
  return (
    <div className="shell">
      <aside className="shell-rail">
        <div className="shell-brand">
          <span className="shell-brand-mark">LDG</span>
          <span className="shell-brand-name">Ledger</span>
        </div>
        <nav className="shell-nav">
          {NAV_ITEMS.map((item) => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) =>
                isActive ? 'shell-nav-link shell-nav-link-active' : 'shell-nav-link'
              }
            >
              <span className="shell-nav-glyph">{item.glyph}</span>
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
        <header className="shell-header">
          <TickerTape />
        </header>
        <main className="shell-content">{children}</main>
      </div>
    </div>
  )
}
