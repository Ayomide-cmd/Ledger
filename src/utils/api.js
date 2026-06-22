const BASE_URL = 'https://api.coingecko.com/api/v3'

async function request(path) {
  const response = await fetch(`${BASE_URL}${path}`)
  if (!response.ok) {
    throw new Error(`CoinGecko request failed: ${response.status}`)
  }
  return response.json()
}

export function getMarkets({ perPage = 50, page = 1, currency = 'usd' } = {}) {
  return request(
    `/coins/markets?vs_currency=${currency}&order=market_cap_desc&per_page=${perPage}&page=${page}&sparkline=true&price_change_percentage=1h,24h,7d`
  )
}

export function getCoinDetail(id) {
  return request(
    `/coins/${id}?localization=false&tickers=false&market_data=true&community_data=false&developer_data=false`
  )
}

export function getCoinMarketChart(id, days = 1) {
  return request(`/coins/${id}/market_chart?vs_currency=usd&days=${days}`)
}

export function getGlobal() {
  return request('/global')
}

export function getTrending() {
  return request('/search/trending')
}
