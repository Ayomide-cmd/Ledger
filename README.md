# Ledger — Market Terminal

A multi-page market dashboard for tracking live cryptocurrency prices, built as a frontend portfolio project. Data comes from the public [CoinGecko API](https://www.coingecko.com/en/api/documentation), which requires no API key.

## Features

- Three routed pages: Overview, Markets, and per-asset Coin Detail
- Live-updating KPI cards (market cap, volume, BTC dominance) on a polling interval
- Hand-built SVG line chart with hover tooltips, no charting library dependency
- Scrolling ticker tape of live prices across the top of every page
- Filterable, sortable asset table with inline sparklines
- Selectable chart time ranges (24H / 7D / 30D / 1Y) on the coin detail page
- Polling-based "real-time" updates with visible last-updated timestamps and retry on failure

## Stack

- React 18 with React Router for client-side routing
- Vite as the build tool and dev server
- Plain CSS with custom properties for theming, no CSS framework
- No charting library — line charts and sparklines are custom SVG components

## Folder structure

```
market-terminal/
├── index.html
├── package.json
├── vite.config.js
└── src/
    ├── main.jsx
    ├── App.jsx
    ├── styles/
    │   └── tokens.css
    ├── components/
    │   ├── Shell.jsx / Shell.css
    │   ├── TickerTape.jsx / TickerTape.css
    │   ├── KpiCard.jsx / KpiCard.css
    │   ├── LineChart.jsx / LineChart.css
    │   ├── Sparkline.jsx
    │   ├── CoinTable.jsx / CoinTable.css
    │   ├── PanelHeader.jsx / PanelHeader.css
    │   └── StatusStates.jsx / StatusStates.css
    ├── pages/
    │   ├── Overview.jsx / Overview.css
    │   ├── Markets.jsx / Markets.css
    │   └── CoinDetail.jsx / CoinDetail.css
    ├── hooks/
    │   └── usePolling.js
    └── utils/
        ├── api.js
        └── format.js
```

## Running locally

```
npm install
npm run dev
```

The dev server starts on `http://localhost:5173`.

## Notes on the API

CoinGecko's free tier has a shared rate limit. The dashboard polls on staggered intervals (45–90 seconds depending on the panel) to stay well within typical limits. If a request fails, each panel shows its own retry control rather than failing the whole page.
