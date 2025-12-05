import { useEffect, useMemo, useState } from 'react'
import {
  type ThaiAddress,
  autocomplete,
  findByDistrict,
  findByPostalCode,
  findByProvince,
  initAddressData,
  searchAddresses,
} from '@amiearth/thai-address-finder'
import './App.css'

function App() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<ThaiAddress[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [dataReady, setDataReady] = useState(false)

  const hasQuery = query.trim().length > 0

  const examples = useMemo(
    () => ['กรุงเทพ', '10330', 'บางรัก', 'เชียงใหม่', 'ลาดพร้าว'],
    []
  )

  const formatAddress = (hit: ThaiAddress) => {
    const parts = [
      hit.subDistrict,
      hit.district,
      hit.province,
      hit.postalCode,
    ].filter(Boolean)
    return parts.join(' · ')
  }

  const runSearch = async () => {
    const trimmed = query.trim()
    if (!trimmed) {
      setError('กรุณากรอกคำค้นหา')
      setResults([])
      return
    }
    if (!dataReady) {
      setError('กำลังเตรียมข้อมูล โปรดลองอีกครั้ง')
      setResults([])
      return
    }
    setLoading(true)
    setError(null)
    try {
      const numeric = /^\d+$/.test(trimmed)
      let hits: ThaiAddress[] = []

      if (numeric && trimmed.length === 5) {
        hits = findByPostalCode(trimmed)
      } else if (trimmed.length >= 2) {
        // Prioritize province/district if query is short; otherwise use autocomplete
        hits = [
          ...findByProvince(trimmed),
          ...findByDistrict(trimmed),
          ...autocomplete({ query: trimmed, limit: 20 }),
        ]
        // De-duplicate by stringified content
        const seen = new Set<string>()
        hits = hits.filter((h) => {
          const key = `${h.subDistrict}-${h.district}-${h.province}-${h.postalCode}`
          if (seen.has(key)) return false
          seen.add(key)
          return true
        })
      } else {
        hits = searchAddresses({ province: trimmed, district: trimmed })
      }

      setResults(hits)
    } catch (err) {
      setError('ค้นหาไม่สำเร็จ ลองอีกครั้ง')
      console.error(err)
      setResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    initAddressData()
      .then(() => setDataReady(true))
      .catch((err) => {
        console.error(err)
        setError('โหลดข้อมูลที่อยู่ไม่สำเร็จ')
      })
  }, [])

  return (
    <main className="page">
      <header>
        <h1>Thai Address Finder</h1>
        <p className="subtitle">
          ค้นหาที่อยู่ไทยด้วย <code>@amiearth/thai-address-finder</code>
        </p>
      </header>

      <section className="panel">
        <label className="field-label" htmlFor="address-query">
          คำค้นหา
        </label>
        <div className="input-row">
          <input
            id="address-query"
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="เช่น กรุงเทพ, บางรัก, 10330"
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                runSearch()
              }
            }}
          />
          <button onClick={runSearch} disabled={loading}>
            {loading ? 'กำลังค้นหา...' : 'ค้นหา'}
          </button>
        </div>

        <div className="examples">
          ตัวอย่าง:
          {examples.map((ex) => (
            <button
              key={ex}
              type="button"
              className="chip"
              onClick={() => setQuery(ex)}
            >
              {ex}
            </button>
          ))}
        </div>

        {error && <p className="status error">{error}</p>}
        {!error && !loading && hasQuery && results.length === 0 && (
          <p className="status">ไม่พบผลลัพธ์</p>
        )}
      </section>

      <section className="results">
        {results.map((hit, idx) => (
          <article className="result-card" key={`${hit.postalCode}-${idx}`}>
            <div className="result-title">{formatAddress(hit)}</div>
            <div className="result-meta">
              <span>{hit.subDistrict || '—'}</span>
              <span>{hit.district || '—'}</span>
              <span>{hit.province || '—'}</span>
              <span>{hit.postalCode || '—'}</span>
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}

export default App
