import { useState, useMemo } from 'react'
import { Flame, TrendingUp, TrendingDown, MapPin, DollarSign, Users, ArrowUpRight, ArrowDownRight, Filter, ChevronDown, ChevronUp, BarChart3, Eye, Star } from 'lucide-react'

/* ─── Types ─── */
interface Neighborhood {
  id: string
  name: string
  city: string
  state: string
  lat: number
  lng: number
  hotScore: number          // 0-100
  investorActivity: number  // 0-100
  undervalued: number       // 0-100 (higher = more undervalued)
  avgPrice: number
  priceChange: number       // % change YoY
  dealCount: number
  avgARV: number
  avgDiscount: number       // % below market
  population: string
  tags: string[]
}

type ViewMode = 'map' | 'list'
type FilterCategory = 'all' | 'hot' | 'investor' | 'undervalued'
type SortKey = 'hotScore' | 'investorActivity' | 'undervalued' | 'avgPrice' | 'priceChange' | 'dealCount'

/* ─── Neighborhood Data ─── */
const NEIGHBORHOODS: Neighborhood[] = [
  { id: 'atl-1', name: 'Bankhead', city: 'Atlanta', state: 'GA', lat: 33.77, lng: -84.44, hotScore: 95, investorActivity: 88, undervalued: 82, avgPrice: 145000, priceChange: 18.5, dealCount: 47, avgARV: 245000, avgDiscount: 38, population: '28K', tags: ['Rapid Growth', 'Investor Hotspot'] },
  { id: 'atl-2', name: 'East Point', city: 'Atlanta', state: 'GA', lat: 33.68, lng: -84.44, hotScore: 88, investorActivity: 76, undervalued: 90, avgPrice: 128000, priceChange: 22.3, dealCount: 35, avgARV: 218000, avgDiscount: 41, population: '38K', tags: ['Undervalued', 'High Upside'] },
  { id: 'det-1', name: 'Brightmoor', city: 'Detroit', state: 'MI', lat: 42.39, lng: -83.28, hotScore: 72, investorActivity: 65, undervalued: 96, avgPrice: 42000, priceChange: 31.2, dealCount: 62, avgARV: 95000, avgDiscount: 56, population: '11K', tags: ['Deep Discount', 'Cash Flow'] },
  { id: 'det-2', name: 'Grandmont Rosedale', city: 'Detroit', state: 'MI', lat: 42.39, lng: -83.24, hotScore: 81, investorActivity: 72, undervalued: 78, avgPrice: 85000, priceChange: 25.8, dealCount: 28, avgARV: 165000, avgDiscount: 48, population: '18K', tags: ['Trending Up', 'Investor Hotspot'] },
  { id: 'cle-1', name: 'Slavic Village', city: 'Cleveland', state: 'OH', lat: 41.46, lng: -81.62, hotScore: 68, investorActivity: 58, undervalued: 92, avgPrice: 55000, priceChange: 28.7, dealCount: 41, avgARV: 120000, avgDiscount: 54, population: '22K', tags: ['Deep Discount', 'Revitalizing'] },
  { id: 'cle-2', name: 'Clark-Fulton', city: 'Cleveland', state: 'OH', lat: 41.47, lng: -81.71, hotScore: 74, investorActivity: 61, undervalued: 85, avgPrice: 62000, priceChange: 19.4, dealCount: 33, avgARV: 135000, avgDiscount: 54, population: '15K', tags: ['Undervalued', 'Emerging'] },
  { id: 'hou-1', name: 'Third Ward', city: 'Houston', state: 'TX', lat: 29.72, lng: -95.35, hotScore: 92, investorActivity: 91, undervalued: 45, avgPrice: 195000, priceChange: 14.2, dealCount: 56, avgARV: 310000, avgDiscount: 37, population: '32K', tags: ['Rapid Growth', 'Investor Hotspot'] },
  { id: 'hou-2', name: 'Sunnyside', city: 'Houston', state: 'TX', lat: 29.67, lng: -95.34, hotScore: 78, investorActivity: 69, undervalued: 88, avgPrice: 105000, priceChange: 26.1, dealCount: 39, avgARV: 195000, avgDiscount: 46, population: '21K', tags: ['High Upside', 'Undervalued'] },
  { id: 'phi-1', name: 'Kensington', city: 'Philadelphia', state: 'PA', lat: 39.98, lng: -75.12, hotScore: 85, investorActivity: 82, undervalued: 75, avgPrice: 112000, priceChange: 20.6, dealCount: 51, avgARV: 210000, avgDiscount: 47, population: '45K', tags: ['Investor Hotspot', 'Trending Up'] },
  { id: 'phi-2', name: 'Point Breeze', city: 'Philadelphia', state: 'PA', lat: 39.93, lng: -75.17, hotScore: 90, investorActivity: 85, undervalued: 55, avgPrice: 175000, priceChange: 16.8, dealCount: 44, avgARV: 295000, avgDiscount: 41, population: '19K', tags: ['Rapid Growth', 'Gentrifying'] },
  { id: 'mem-1', name: 'Orange Mound', city: 'Memphis', state: 'TN', lat: 35.12, lng: -89.96, hotScore: 70, investorActivity: 55, undervalued: 94, avgPrice: 48000, priceChange: 33.5, dealCount: 37, avgARV: 110000, avgDiscount: 56, population: '14K', tags: ['Deep Discount', 'Cash Flow'] },
  { id: 'mem-2', name: 'Binghampton', city: 'Memphis', state: 'TN', lat: 35.14, lng: -89.95, hotScore: 76, investorActivity: 64, undervalued: 80, avgPrice: 72000, priceChange: 27.9, dealCount: 29, avgARV: 145000, avgDiscount: 50, population: '10K', tags: ['Emerging', 'High Upside'] },
  { id: 'jax-1', name: 'Eastside', city: 'Jacksonville', state: 'FL', lat: 30.33, lng: -81.63, hotScore: 82, investorActivity: 74, undervalued: 86, avgPrice: 98000, priceChange: 24.3, dealCount: 45, avgARV: 185000, avgDiscount: 47, population: '26K', tags: ['Undervalued', 'Investor Hotspot'] },
  { id: 'stl-1', name: 'Dutchtown', city: 'St. Louis', state: 'MO', lat: 38.58, lng: -90.24, hotScore: 65, investorActivity: 52, undervalued: 91, avgPrice: 58000, priceChange: 21.7, dealCount: 31, avgARV: 125000, avgDiscount: 54, population: '17K', tags: ['Deep Discount', 'Revitalizing'] },
  { id: 'bham-1', name: 'Ensley', city: 'Birmingham', state: 'AL', lat: 33.50, lng: -86.88, hotScore: 63, investorActivity: 48, undervalued: 93, avgPrice: 38000, priceChange: 35.2, dealCount: 26, avgARV: 88000, avgDiscount: 57, population: '12K', tags: ['Deep Discount', 'Highest ROI'] },
  { id: 'bal-1', name: 'Sandtown-Winchester', city: 'Baltimore', state: 'MD', lat: 39.30, lng: -76.65, hotScore: 71, investorActivity: 62, undervalued: 89, avgPrice: 52000, priceChange: 29.3, dealCount: 38, avgARV: 115000, avgDiscount: 55, population: '20K', tags: ['Undervalued', 'Cash Flow'] },
  { id: 'kc-1', name: 'Historic Northeast', city: 'Kansas City', state: 'MO', lat: 39.12, lng: -94.54, hotScore: 79, investorActivity: 70, undervalued: 72, avgPrice: 95000, priceChange: 19.8, dealCount: 34, avgARV: 175000, avgDiscount: 46, population: '24K', tags: ['Trending Up', 'Emerging'] },
  { id: 'ind-1', name: 'Martindale-Brightwood', city: 'Indianapolis', state: 'IN', lat: 39.80, lng: -86.12, hotScore: 73, investorActivity: 60, undervalued: 87, avgPrice: 68000, priceChange: 23.4, dealCount: 30, avgARV: 140000, avgDiscount: 51, population: '16K', tags: ['High Upside', 'Undervalued'] },
  { id: 'cha-1', name: 'West Charlotte', city: 'Charlotte', state: 'NC', lat: 35.22, lng: -80.90, hotScore: 87, investorActivity: 80, undervalued: 60, avgPrice: 165000, priceChange: 15.6, dealCount: 42, avgARV: 270000, avgDiscount: 39, population: '35K', tags: ['Rapid Growth', 'Investor Hotspot'] },
  { id: 'sa-1', name: 'West Side', city: 'San Antonio', state: 'TX', lat: 29.43, lng: -98.53, hotScore: 77, investorActivity: 66, undervalued: 83, avgPrice: 92000, priceChange: 21.2, dealCount: 36, avgARV: 170000, avgDiscount: 46, population: '29K', tags: ['Undervalued', 'Emerging'] },
]

/* ─── SVG State Paths (simplified US map) ─── */
const US_BOUNDS = { minLat: 24.5, maxLat: 49.5, minLng: -125, maxLng: -66.5 }
function project(lat: number, lng: number, w: number, h: number): [number, number] {
  const x = ((lng - US_BOUNDS.minLng) / (US_BOUNDS.maxLng - US_BOUNDS.minLng)) * w
  const y = h - ((lat - US_BOUNDS.minLat) / (US_BOUNDS.maxLat - US_BOUNDS.minLat)) * h
  return [x, y]
}

/* ─── Helper ─── */
function fmt(n: number) {
  if (n >= 1_000_000) return `$${(n / 1_000_000).toFixed(1)}M`
  if (n >= 1_000) return `$${(n / 1_000).toFixed(0)}K`
  return `$${n}`
}

function getHeatColor(score: number): string {
  if (score >= 85) return '#ff4444'
  if (score >= 70) return '#ff7e5f'
  if (score >= 55) return '#ffb347'
  if (score >= 40) return '#ffd700'
  return '#44aa77'
}

function getScoreLabel(score: number): string {
  if (score >= 85) return 'Extreme'
  if (score >= 70) return 'High'
  if (score >= 55) return 'Moderate'
  if (score >= 40) return 'Mild'
  return 'Low'
}

/* ─── Component ─── */
export default function HeatMap() {
  const [view, setView] = useState<ViewMode>('map')
  const [filter, setFilter] = useState<FilterCategory>('all')
  const [sortKey, setSortKey] = useState<SortKey>('hotScore')
  const [sortAsc, setSortAsc] = useState(false)
  const [selectedHood, setSelectedHood] = useState<Neighborhood | null>(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const filtered = useMemo(() => {
    let list = [...NEIGHBORHOODS]
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase()
      list = list.filter(n => n.name.toLowerCase().includes(q) || n.city.toLowerCase().includes(q) || n.state.toLowerCase().includes(q))
    }
    if (filter === 'hot') list = list.filter(n => n.hotScore >= 75)
    if (filter === 'investor') list = list.filter(n => n.investorActivity >= 70)
    if (filter === 'undervalued') list = list.filter(n => n.undervalued >= 80)
    list.sort((a, b) => sortAsc ? a[sortKey] - b[sortKey] : b[sortKey] - a[sortKey])
    return list
  }, [filter, sortKey, sortAsc, searchQuery])

  const stats = useMemo(() => ({
    hotCount: NEIGHBORHOODS.filter(n => n.hotScore >= 75).length,
    investorCount: NEIGHBORHOODS.filter(n => n.investorActivity >= 70).length,
    undervaluedCount: NEIGHBORHOODS.filter(n => n.undervalued >= 80).length,
    avgDiscount: Math.round(NEIGHBORHOODS.reduce((s, n) => s + n.avgDiscount, 0) / NEIGHBORHOODS.length),
  }), [])

  function handleSort(key: SortKey) {
    if (sortKey === key) setSortAsc(!sortAsc)
    else { setSortKey(key); setSortAsc(false) }
  }

  const SortIcon = ({ k }: { k: SortKey }) => sortKey === k ? (sortAsc ? <ChevronUp size={12} /> : <ChevronDown size={12} />) : null

  return (
    <div style={{ maxWidth: 1100, margin: '0 auto', padding: '0 16px' }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 28 }}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: 'linear-gradient(135deg, #ff4444, #ff7e5f)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Flame size={22} color="#fff" />
          </div>
          <h2 className="section-header" style={{ margin: 0 }}>Neighborhood Heat Map</h2>
        </div>
        <p style={{ color: '#9a918a', fontSize: 14, maxWidth: 600, margin: '0 auto', lineHeight: 1.6 }}>
          Visual map of the hottest wholesale markets. Identify investor activity, undervalued neighborhoods, and emerging opportunities across the U.S.
        </p>
      </div>

      {/* Stats Banner */}
      <div className="heatmap-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 20 }}>
        {[
          { label: 'Hot Markets', value: stats.hotCount, icon: Flame, color: '#ff4444', sub: 'Score 75+' },
          { label: 'Investor Active', value: stats.investorCount, icon: Users, color: '#ff7e5f', sub: 'High activity' },
          { label: 'Undervalued', value: stats.undervaluedCount, icon: TrendingDown, color: '#44aa77', sub: 'Score 80+' },
          { label: 'Avg Discount', value: `${stats.avgDiscount}%`, icon: DollarSign, color: '#ffb347', sub: 'Below market' },
        ].map(s => (
          <div key={s.label} style={{ background: '#263040', borderRadius: 12, padding: '16px 14px', border: '1px solid #3d4e65', textAlign: 'center' }}>
            <s.icon size={18} color={s.color} style={{ marginBottom: 6 }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#f5f0eb', letterSpacing: '0.04em', lineHeight: 1 }}>{s.value}</div>
            <div style={{ fontSize: 12, color: '#9a918a', marginTop: 2 }}>{s.label}</div>
            <div style={{ fontSize: 10, color: '#6b6560', marginTop: 2 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      {/* Controls Bar */}
      <div className="heatmap-controls" style={{ display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 16, alignItems: 'center' }}>
        {/* Search */}
        <input
          type="text"
          placeholder="Search city or neighborhood..."
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="input-dark"
          style={{ flex: '1 1 200px', minWidth: 180, padding: '10px 14px', fontSize: 13 }}
        />
        {/* Filter Buttons */}
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
          {([
            { key: 'all', label: 'All', icon: BarChart3 },
            { key: 'hot', label: 'Hot', icon: Flame },
            { key: 'investor', label: 'Investor', icon: Users },
            { key: 'undervalued', label: 'Undervalued', icon: TrendingDown },
          ] as const).map(f => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5, padding: '8px 14px', borderRadius: 8,
                border: filter === f.key ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                background: filter === f.key ? 'rgba(244,126,95,0.12)' : '#263040',
                color: filter === f.key ? '#ff7e5f' : '#9a918a',
                cursor: 'pointer', fontSize: 12, fontWeight: 500, whiteSpace: 'nowrap',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <f.icon size={13} />
              {f.label}
            </button>
          ))}
        </div>
        {/* View Toggle */}
        <div style={{ display: 'flex', borderRadius: 8, overflow: 'hidden', border: '1px solid #3d4e65' }}>
          {(['map', 'list'] as const).map(v => (
            <button
              key={v}
              onClick={() => setView(v)}
              style={{
                padding: '8px 16px', border: 'none', cursor: 'pointer', fontSize: 12, fontWeight: 500,
                background: view === v ? '#ff7e5f' : '#263040',
                color: view === v ? '#000' : '#9a918a',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {v === 'map' ? 'Map' : 'List'}
            </button>
          ))}
        </div>
      </div>

      {/* Legend */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginBottom: 16, alignItems: 'center' }}>
        <span style={{ fontSize: 11, color: '#6b6560', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Heat Level:</span>
        {[
          { label: 'Extreme', color: '#ff4444' },
          { label: 'High', color: '#ff7e5f' },
          { label: 'Moderate', color: '#ffb347' },
          { label: 'Mild', color: '#ffd700' },
          { label: 'Low', color: '#44aa77' },
        ].map(l => (
          <span key={l.label} style={{ display: 'flex', alignItems: 'center', gap: 5, fontSize: 11, color: '#9a918a' }}>
            <span style={{ width: 10, height: 10, borderRadius: '50%', background: l.color, display: 'inline-block', boxShadow: `0 0 6px ${l.color}55` }} />
            {l.label}
          </span>
        ))}
      </div>

      {/* MAP VIEW */}
      {view === 'map' && (
        <div style={{ position: 'relative', background: '#141920', borderRadius: 14, border: '1px solid #3d4e65', overflow: 'hidden', marginBottom: 20 }}>
          <svg
            viewBox="0 0 800 500"
            style={{ width: '100%', height: 'auto', display: 'block' }}
            aria-label="US neighborhood heat map"
          >
            {/* Background */}
            <rect width="800" height="500" fill="#141920" />
            {/* Grid */}
            {Array.from({ length: 9 }).map((_, i) => (
              <line key={`v${i}`} x1={i * 100} y1="0" x2={i * 100} y2="500" stroke="#1e2530" strokeWidth="0.5" />
            ))}
            {Array.from({ length: 6 }).map((_, i) => (
              <line key={`h${i}`} x1="0" y1={i * 100} x2="800" y2={i * 100} stroke="#1e2530" strokeWidth="0.5" />
            ))}

            {/* US Outline (simplified) */}
            <path
              d="M90,140 L120,120 L180,110 L220,105 L280,100 L340,95 L400,90 L440,92 L480,95 L520,100 L560,110 L600,120 L640,115 L680,120 L720,130 L730,145 L725,170 L720,200 L715,230 L710,260 L700,290 L690,310 L670,330 L650,345 L620,360 L600,368 L580,372 L550,378 L520,380 L490,378 L460,375 L440,378 L420,385 L400,390 L380,388 L350,382 L320,378 L290,380 L260,385 L230,390 L200,388 L170,380 L140,370 L120,355 L105,335 L95,310 L88,280 L82,250 L78,220 L80,190 L85,160 Z"
              fill="none"
              stroke="#3d4e65"
              strokeWidth="1.5"
              opacity="0.6"
            />

            {/* Heat zones (radial gradients behind dots) */}
            <defs>
              {filtered.map(n => {
                const color = getHeatColor(n.hotScore)
                return (
                  <radialGradient key={`grad-${n.id}`} id={`hg-${n.id}`}>
                    <stop offset="0%" stopColor={color} stopOpacity="0.35" />
                    <stop offset="100%" stopColor={color} stopOpacity="0" />
                  </radialGradient>
                )
              })}
            </defs>

            {/* Heat circles */}
            {filtered.map(n => {
              const [x, y] = project(n.lat, n.lng, 800, 500)
              const color = getHeatColor(n.hotScore)
              const r = 14 + (n.hotScore / 100) * 26
              const isSelected = selectedHood?.id === n.id
              return (
                <g
                  key={n.id}
                  onClick={() => setSelectedHood(isSelected ? null : n)}
                  style={{ cursor: 'pointer' }}
                  role="button"
                  aria-label={`${n.name}, ${n.city} - Heat score ${n.hotScore}`}
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') setSelectedHood(isSelected ? null : n) }}
                >
                  {/* Heat glow */}
                  <circle cx={x} cy={y} r={r} fill={`url(#hg-${n.id})`} />
                  {/* Pulse ring for selected */}
                  {isSelected && (
                    <circle cx={x} cy={y} r={12} fill="none" stroke={color} strokeWidth="2" opacity="0.6">
                      <animate attributeName="r" from="12" to="24" dur="1.5s" repeatCount="indefinite" />
                      <animate attributeName="opacity" from="0.6" to="0" dur="1.5s" repeatCount="indefinite" />
                    </circle>
                  )}
                  {/* Dot */}
                  <circle
                    cx={x} cy={y}
                    r={isSelected ? 7 : 5}
                    fill={color}
                    stroke={isSelected ? '#fff' : color}
                    strokeWidth={isSelected ? 2 : 1}
                    style={{ filter: `drop-shadow(0 0 4px ${color})` }}
                  />
                  {/* Label on hover / selected */}
                  {isSelected && (
                    <text x={x} y={y - 14} textAnchor="middle" fill="#f5f0eb" fontSize="10" fontWeight="600" fontFamily="DM Sans, sans-serif">
                      {n.name}
                    </text>
                  )}
                </g>
              )
            })}
          </svg>

          {/* Selected Neighborhood Info Panel */}
          {selectedHood && (
            <div className="heatmap-info-panel" style={{
              position: 'absolute', bottom: 16, left: 16, right: 16,
              background: 'rgba(26,31,40,0.96)', backdropFilter: 'blur(12px)',
              borderRadius: 12, border: '1px solid #3d4e65', padding: 16,
              maxWidth: 480,
            }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                    <MapPin size={14} color={getHeatColor(selectedHood.hotScore)} />
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                      {selectedHood.name}
                    </span>
                  </div>
                  <span style={{ fontSize: 12, color: '#9a918a' }}>{selectedHood.city}, {selectedHood.state} · Pop. {selectedHood.population}</span>
                </div>
                <button onClick={() => setSelectedHood(null)} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }} aria-label="Close">✕</button>
              </div>

              {/* Score bars */}
              <div style={{ display: 'grid', gap: 8, marginBottom: 12 }}>
                {[
                  { label: 'Hot Score', value: selectedHood.hotScore, color: getHeatColor(selectedHood.hotScore) },
                  { label: 'Investor Activity', value: selectedHood.investorActivity, color: '#ff7e5f' },
                  { label: 'Undervalued Score', value: selectedHood.undervalued, color: '#44aa77' },
                ].map(bar => (
                  <div key={bar.label}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: '#9a918a', marginBottom: 3 }}>
                      <span>{bar.label}</span>
                      <span style={{ color: bar.color, fontWeight: 600 }}>{bar.value}/100</span>
                    </div>
                    <div style={{ height: 6, background: '#2e3a4d', borderRadius: 3, overflow: 'hidden' }}>
                      <div style={{ height: '100%', width: `${bar.value}%`, background: bar.color, borderRadius: 3, transition: 'width 0.4s ease' }} />
                    </div>
                  </div>
                ))}
              </div>

              {/* Stats grid */}
              <div className="heatmap-detail-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8, marginBottom: 10 }}>
                {[
                  { label: 'Avg Price', value: fmt(selectedHood.avgPrice) },
                  { label: 'ARV', value: fmt(selectedHood.avgARV) },
                  { label: 'Discount', value: `${selectedHood.avgDiscount}%` },
                  { label: 'YoY Change', value: `+${selectedHood.priceChange}%`, color: '#44aa77' },
                  { label: 'Active Deals', value: selectedHood.dealCount.toString() },
                  { label: 'Heat', value: getScoreLabel(selectedHood.hotScore), color: getHeatColor(selectedHood.hotScore) },
                ].map(s => (
                  <div key={s.label} style={{ background: '#2e3a4d', borderRadius: 8, padding: '8px 10px', textAlign: 'center' }}>
                    <div style={{ fontSize: 10, color: '#6b6560', marginBottom: 2 }}>{s.label}</div>
                    <div style={{ fontSize: 14, fontWeight: 700, color: s.color || '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>{s.value}</div>
                  </div>
                ))}
              </div>

              {/* Tags */}
              <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                {selectedHood.tags.map(tag => (
                  <span key={tag} className="badge badge-orange" style={{ fontSize: 10 }}>{tag}</span>
                ))}
              </div>
            </div>
          )}

          {/* Map tip */}
          {!selectedHood && (
            <div style={{ position: 'absolute', bottom: 12, left: '50%', transform: 'translateX(-50%)', fontSize: 11, color: '#6b6560', background: 'rgba(20,25,32,0.9)', padding: '6px 14px', borderRadius: 20, pointerEvents: 'none' }}>
              <Eye size={11} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
              Tap a dot to see neighborhood details
            </div>
          )}
        </div>
      )}

      {/* LIST VIEW */}
      {view === 'list' && (
        <div style={{ marginBottom: 20 }}>
          {/* Sort header */}
          <div className="heatmap-list-header" style={{ display: 'grid', gridTemplateColumns: '2fr repeat(5, 1fr)', gap: 8, padding: '10px 14px', background: '#263040', borderRadius: '12px 12px 0 0', border: '1px solid #3d4e65', borderBottom: 'none' }}>
            {[
              { label: 'Neighborhood', key: null },
              { label: 'Hot Score', key: 'hotScore' as SortKey },
              { label: 'Investor', key: 'investorActivity' as SortKey },
              { label: 'Undervalued', key: 'undervalued' as SortKey },
              { label: 'Avg Price', key: 'avgPrice' as SortKey },
              { label: 'YoY Change', key: 'priceChange' as SortKey },
            ].map(col => (
              <button
                key={col.label}
                onClick={() => col.key && handleSort(col.key)}
                style={{
                  background: 'none', border: 'none', color: sortKey === col.key ? '#ff7e5f' : '#6b6560',
                  cursor: col.key ? 'pointer' : 'default', fontSize: 10, fontWeight: 600,
                  textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 3,
                  fontFamily: "'DM Sans', sans-serif", padding: 0, textAlign: 'left',
                }}
              >
                {col.label}
                {col.key && <SortIcon k={col.key} />}
              </button>
            ))}
          </div>

          {/* List rows */}
          <div style={{ border: '1px solid #3d4e65', borderRadius: '0 0 12px 12px', overflow: 'hidden' }}>
            {filtered.length === 0 && (
              <div style={{ padding: 32, textAlign: 'center', color: '#6b6560', fontSize: 14 }}>
                No neighborhoods match your search or filter.
              </div>
            )}
            {filtered.map((n, i) => {
              const isExpanded = expandedId === n.id
              return (
                <div key={n.id}>
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : n.id)}
                    className="heatmap-list-row"
                    style={{
                      display: 'grid', gridTemplateColumns: '2fr repeat(5, 1fr)', gap: 8,
                      padding: '14px 14px', cursor: 'pointer',
                      background: isExpanded ? 'rgba(244,126,95,0.04)' : i % 2 === 0 ? '#161b22' : '#263040',
                      borderBottom: '1px solid #2e3a4d',
                      alignItems: 'center',
                      transition: 'background 0.15s',
                    }}
                  >
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <span style={{ width: 8, height: 8, borderRadius: '50%', background: getHeatColor(n.hotScore), flexShrink: 0, boxShadow: `0 0 4px ${getHeatColor(n.hotScore)}55` }} />
                        <span style={{ fontWeight: 600, color: '#f5f0eb', fontSize: 13 }}>{n.name}</span>
                      </div>
                      <span style={{ fontSize: 11, color: '#6b6560', marginLeft: 14 }}>{n.city}, {n.state}</span>
                    </div>
                    <div style={{ fontWeight: 700, color: getHeatColor(n.hotScore), fontSize: 14 }}>{n.hotScore}</div>
                    <div style={{ fontWeight: 600, color: n.investorActivity >= 70 ? '#ff7e5f' : '#9a918a', fontSize: 14 }}>{n.investorActivity}</div>
                    <div style={{ fontWeight: 600, color: n.undervalued >= 80 ? '#44aa77' : '#9a918a', fontSize: 14 }}>{n.undervalued}</div>
                    <div style={{ fontWeight: 600, color: '#f5f0eb', fontSize: 13 }}>{fmt(n.avgPrice)}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 3, fontWeight: 600, color: '#44aa77', fontSize: 13 }}>
                      <ArrowUpRight size={12} />+{n.priceChange}%
                    </div>
                  </div>

                  {/* Expanded row detail */}
                  {isExpanded && (
                    <div style={{ padding: '14px 18px', background: 'rgba(244,126,95,0.02)', borderBottom: '1px solid #3d4e65' }}>
                      <div className="heatmap-expanded-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 10 }}>
                        <div style={{ background: '#2e3a4d', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: '#6b6560', marginBottom: 2 }}>ARV</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0eb' }}>{fmt(n.avgARV)}</div>
                        </div>
                        <div style={{ background: '#2e3a4d', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: '#6b6560', marginBottom: 2 }}>Discount</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#ff7e5f' }}>{n.avgDiscount}%</div>
                        </div>
                        <div style={{ background: '#2e3a4d', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: '#6b6560', marginBottom: 2 }}>Active Deals</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#ffb347' }}>{n.dealCount}</div>
                        </div>
                        <div style={{ background: '#2e3a4d', borderRadius: 8, padding: '10px 12px' }}>
                          <div style={{ fontSize: 10, color: '#6b6560', marginBottom: 2 }}>Population</div>
                          <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0eb' }}>{n.population}</div>
                        </div>
                      </div>
                      {/* Score bars */}
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 10 }}>
                        {[
                          { label: 'Hot Score', value: n.hotScore, color: getHeatColor(n.hotScore) },
                          { label: 'Investor Activity', value: n.investorActivity, color: '#ff7e5f' },
                          { label: 'Undervalued', value: n.undervalued, color: '#44aa77' },
                        ].map(bar => (
                          <div key={bar.label}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: '#9a918a', marginBottom: 3 }}>
                              <span>{bar.label}</span>
                              <span style={{ color: bar.color, fontWeight: 600 }}>{bar.value}</span>
                            </div>
                            <div style={{ height: 5, background: '#263040', borderRadius: 3, overflow: 'hidden' }}>
                              <div style={{ height: '100%', width: `${bar.value}%`, background: bar.color, borderRadius: 3 }} />
                            </div>
                          </div>
                        ))}
                      </div>
                      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                        {n.tags.map(tag => (
                          <span key={tag} className="badge badge-orange" style={{ fontSize: 10 }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* Bottom Tips */}
      <div className="info-tip" style={{ marginBottom: 16 }}>
        <strong>How to use this map:</strong> Filter by <em>Hot</em> to find the most active wholesale markets, <em>Investor</em> to see where cash buyers are concentrated, or <em>Undervalued</em> to spot neighborhoods with the highest potential spread. Tap any dot on the map or row in the list to see full stats including ARV, discount percentage, and deal count.
      </div>

      <div className="info-warn" style={{ marginBottom: 16 }}>
        <strong>Disclaimer:</strong> Heat scores are based on aggregated wholesale market activity indicators. Always conduct your own due diligence and verify comparable sales in your target area before making offers.
      </div>
    </div>
  )
}
