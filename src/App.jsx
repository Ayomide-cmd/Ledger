import { Routes, Route } from 'react-router-dom'
import Shell from './components/Shell.jsx'
import Overview from './pages/Overview.jsx'
import Markets from './pages/Markets.jsx'
import CoinDetail from './pages/CoinDetail.jsx'

export default function App() {
  return (
    <Shell>
      <Routes>
        <Route path="/" element={<Overview />} />
        <Route path="/markets" element={<Markets />} />
        <Route path="/coin/:id" element={<CoinDetail />} />
      </Routes>
    </Shell>
  )
}
