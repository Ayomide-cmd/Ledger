import { useEffect, useRef, useState, useCallback } from 'react'

export function usePolling(fetchFn, intervalMs = 30000, deps = []) {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)
  const [lastUpdated, setLastUpdated] = useState(null)
  const timerRef = useRef(null)
  const mountedRef = useRef(true)

  const run = useCallback(async () => {
    try {
      const result = await fetchFn()
      if (!mountedRef.current) return
      setData(result)
      setError(null)
      setLastUpdated(Date.now())
    } catch (err) {
      if (!mountedRef.current) return
      setError(err)
    } finally {
      if (mountedRef.current) setLoading(false)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps)

  useEffect(() => {
    mountedRef.current = true
    setLoading(true)
    setData(null)
    run()

    if (intervalMs > 0) {
      timerRef.current = setInterval(run, intervalMs)
    }

    return () => {
      mountedRef.current = false
      if (timerRef.current) clearInterval(timerRef.current)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [run, intervalMs])

  return { data, error, loading, lastUpdated, refetch: run }
}
