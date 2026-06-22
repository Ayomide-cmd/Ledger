import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Sparkline from './Sparkline.jsx'
import { formatCurrency, formatPercent, formatCompactNumber, classForDelta } from '../utils/format.js'
import './CoinTable.css'

const COLUMNS = [
  { key: 'market_cap_rank', label: '#', sortable: true },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'current_price', label: 'Price', sortable: true },
  { key: 'price_change_percentage_1h_in_currency', label: '1h', sortable: true },
  { key: 'price_change_percentage_24h', label: '24h', sortable: true },
  { key: 'price_change_percentage_7d_in_currency', label: '7d', sortable: true },
  { key: 'market_cap', label: 'Market Cap', sortable: true },
  { key: 'total_volume', label: 'Volume (24h)', sortable: true },
  { key: 'sparkline', label: 'Last 7d', sortable: false }
]

export default function CoinTable({ coins }) {
  const navigate = useNavigate()
  const [query, setQuery] = useState('')
  const [sortKey, setSortKey] = useState('market_cap_rank')
  const [sortDir, setSortDir] = useState('asc')

  const filtered = useMemo(() => {
    const lower = query.trim().toLowerCase()
    let result = coins
    if (lower) {
      result = coins.filter(
        (coin) =>
          coin.name.toLowerCase().includes(lower) || coin.symbol.toLowerCase().includes(lower)
      )
    }

    const sorted = [...result].sort((a, b) => {
      const aVal = a[sortKey]
      const bVal = b[sortKey]
      if (typeof aVal === 'string') {
        return sortDir === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
      }
      const safeA = aVal ?? 0
      const safeB = bVal ?? 0
      return sortDir === 'asc' ? safeA - safeB : safeB - safeA
    })

    return sorted
  }, [coins, query, sortKey, sortDir])

  function handleSort(column) {
    if (!column.sortable) return
    if (sortKey === column.key) {
      setSortDir((prev) => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(column.key)
      setSortDir('desc')
    }
  }

  return (
    <div className="coin-table-card">
      <div className="coin-table-toolbar">
        <input
          type="text"
          className="coin-table-search"
          placeholder="Filter by name or symbol"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
        />
        <span className="coin-table-count">{filtered.length} assets</span>
      </div>

      <div className="coin-table-scroll">
        <table className="coin-table">
          <thead>
            <tr>
              {COLUMNS.map((column) => (
                <th
                  key={column.key}
                  onClick={() => handleSort(column)}
                  className={column.sortable ? 'coin-table-sortable' : ''}
                >
                  {column.label}
                  {sortKey === column.key && (
                    <span className="coin-table-sort-arrow">{sortDir === 'asc' ? ' ▲' : ' ▼'}</span>
                  )}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {filtered.map((coin) => (
              <tr
                key={coin.id}
                className="coin-table-row"
                onClick={() => navigate(`/coin/${coin.id}`)}
              >
                <td className="tabular coin-table-rank">{coin.market_cap_rank ?? '—'}</td>
                <td>
                  <div className="coin-table-name-cell">
                    <img src={coin.image} alt="" width="20" height="20" className="coin-table-icon" />
                    <span className="coin-table-name">{coin.name}</span>
                    <span className="coin-table-symbol">{coin.symbol.toUpperCase()}</span>
                  </div>
                </td>
                <td className="tabular">{formatCurrency(coin.current_price)}</td>
                <td className={`tabular ${classForDelta(coin.price_change_percentage_1h_in_currency)}`}>
                  {formatPercent(coin.price_change_percentage_1h_in_currency)}
                </td>
                <td className={`tabular ${classForDelta(coin.price_change_percentage_24h)}`}>
                  {formatPercent(coin.price_change_percentage_24h)}
                </td>
                <td className={`tabular ${classForDelta(coin.price_change_percentage_7d_in_currency)}`}>
                  {formatPercent(coin.price_change_percentage_7d_in_currency)}
                </td>
                <td className="tabular">{formatCompactNumber(coin.market_cap)}</td>
                <td className="tabular">{formatCompactNumber(coin.total_volume)}</td>
                <td>
                  {coin.sparkline_in_7d?.price && (
                    <Sparkline
                      values={coin.sparkline_in_7d.price}
                      positive={coin.price_change_percentage_7d_in_currency >= 0}
                    />
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {filtered.length === 0 && (
          <div className="coin-table-empty">No assets match that filter.</div>
        )}
      </div>
    </div>
  )
}
