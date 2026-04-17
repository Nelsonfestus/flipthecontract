import { useState, useEffect, useMemo } from 'react'
import {
  Calculator, TrendingUp, TrendingDown, Trash2, BarChart3,
  Plus, ArrowUpDown, Check, X, DollarSign, Home,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

type AnalysisType = 'Quick Offer' | 'Multi-Family' | 'ARV & NOI' | 'Investment Strategy'

export interface SavedAnalysis {
  id: string
  address: string
  analysisType: AnalysisType
  purchasePrice: number
  arv: number
  repairCosts: number
  offerPrice: number
  potentialProfit: number
  notes: string
  dateSaved: string
}

type SortField = 'date' | 'profit'
type SortDir = 'asc' | 'desc'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STORAGE_KEY = 'ftc_calc_history'
const ANALYSIS_TYPES: AnalysisType[] = ['Quick Offer', 'Multi-Family', 'ARV & NOI', 'Investment Strategy']

const TYPE_COLORS: Record<AnalysisType, string> = {
  'Quick Offer': '#ff7e5f',
  'Multi-Family': '#ffb347',
  'ARV & NOI': '#5fd9ff',
  'Investment Strategy': '#a78bfa',
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function fmt(n: number) {
  if (!n && n !== 0) return '$0'
  return '$' + Math.round(n).toLocaleString('en-US')
}

function pct(profit: number, arv: number) {
  if (!arv) return '0.0%'
  return ((profit / arv) * 100).toFixed(1) + '%'
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadHistory(): SavedAnalysis[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? JSON.parse(raw) : []
  } catch {
    return []
  }
}

function saveHistory(items: SavedAnalysis[]) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function QuickStats({ history }: { history: SavedAnalysis[] }) {
  const totalSaved = history.length
  const avgProfit = totalSaved > 0
    ? history.reduce((s, h) => s + h.potentialProfit, 0) / totalSaved
    : 0
  const bestDeal = totalSaved > 0
    ? history.reduce((best, h) => h.potentialProfit > best.potentialProfit ? h : best, history[0])
    : null

  const stats = [
    { label: 'Saved Analyses', value: totalSaved.toString(), icon: Calculator, color: '#ff7e5f' },
    { label: 'Avg Profit', value: fmt(avgProfit), icon: DollarSign, color: '#ffb347' },
    { label: 'Best Deal', value: bestDeal ? fmt(bestDeal.potentialProfit) : '--', icon: TrendingUp, color: '#4ade80' },
  ]

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
      {stats.map(s => {
        const Icon = s.icon
        return (
          <div key={s.label} style={{
            background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 12, padding: '16px 18px',
            display: 'flex', alignItems: 'center', gap: 14,
          }}>
            <div style={{
              width: 40, height: 40, borderRadius: 10,
              background: `${s.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Icon size={18} style={{ color: s.color }} />
            </div>
            <div>
              <div style={{ fontSize: 11, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                {s.label}
              </div>
              <div style={{ fontSize: 20, fontWeight: 700, color: '#f5f0eb', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>
                {s.value}
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Save Form
// ---------------------------------------------------------------------------

const emptyForm = {
  address: '',
  analysisType: 'Quick Offer' as AnalysisType,
  purchasePrice: '',
  arv: '',
  repairCosts: '',
  offerPrice: '',
  notes: '',
}

function SaveForm({ onSave }: { onSave: (a: SavedAnalysis) => void }) {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState(emptyForm)

  const purchase = parseFloat(form.purchasePrice) || 0
  const arv = parseFloat(form.arv) || 0
  const repairs = parseFloat(form.repairCosts) || 0
  const potentialProfit = arv - purchase - repairs

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!form.address.trim()) return
    onSave({
      id: genId(),
      address: form.address.trim(),
      analysisType: form.analysisType,
      purchasePrice: purchase,
      arv,
      repairCosts: repairs,
      offerPrice: parseFloat(form.offerPrice) || 0,
      potentialProfit,
      notes: form.notes.trim(),
      dateSaved: new Date().toISOString(),
    })
    setForm(emptyForm)
    setOpen(false)
  }

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    background: '#161b24', border: '1px solid #2e3a4d', color: '#f5f0eb',
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 12, color: '#a09890', marginBottom: 4,
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
  }

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        style={{
          display: 'flex', alignItems: 'center', gap: 8, padding: '12px 20px',
          background: 'linear-gradient(135deg, #ff7e5f, #e86830)', border: 'none', borderRadius: 10,
          color: '#000', fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          cursor: 'pointer', marginBottom: 24,
        }}
      >
        <Plus size={16} /> Save New Analysis
      </button>
    )
  }

  return (
    <form onSubmit={handleSubmit} style={{
      background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 14, padding: 24, marginBottom: 24,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
          Save Deal Analysis
        </h3>
        <button type="button" onClick={() => { setOpen(false); setForm(emptyForm) }}
          style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4 }}>
          <X size={18} />
        </button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
        {/* Address */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Property Address *</label>
          <div style={{ position: 'relative' }}>
            <Home size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560' }} />
            <input
              required
              placeholder="123 Main St, City, State"
              value={form.address}
              onChange={e => setForm({ ...form, address: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 34 }}
            />
          </div>
        </div>

        {/* Analysis Type */}
        <div>
          <label style={labelStyle}>Analysis Type</label>
          <select
            value={form.analysisType}
            onChange={e => setForm({ ...form, analysisType: e.target.value as AnalysisType })}
            style={{ ...inputStyle, cursor: 'pointer' }}
          >
            {ANALYSIS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
        </div>

        {/* Purchase Price */}
        <div>
          <label style={labelStyle}>Purchase Price</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560' }} />
            <input
              type="number" min="0" placeholder="0"
              value={form.purchasePrice}
              onChange={e => setForm({ ...form, purchasePrice: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* ARV */}
        <div>
          <label style={labelStyle}>After Repair Value (ARV)</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560' }} />
            <input
              type="number" min="0" placeholder="0"
              value={form.arv}
              onChange={e => setForm({ ...form, arv: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Repair Costs */}
        <div>
          <label style={labelStyle}>Repair Costs</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560' }} />
            <input
              type="number" min="0" placeholder="0"
              value={form.repairCosts}
              onChange={e => setForm({ ...form, repairCosts: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Offer Price */}
        <div>
          <label style={labelStyle}>Offer Price</label>
          <div style={{ position: 'relative' }}>
            <DollarSign size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560' }} />
            <input
              type="number" min="0" placeholder="0"
              value={form.offerPrice}
              onChange={e => setForm({ ...form, offerPrice: e.target.value })}
              style={{ ...inputStyle, paddingLeft: 30 }}
            />
          </div>
        </div>

        {/* Auto-calculated Profit */}
        <div>
          <label style={labelStyle}>Potential Profit (auto)</label>
          <div style={{
            padding: '10px 12px', borderRadius: 8, background: '#161b24', border: '1px solid #2e3a4d',
            color: potentialProfit >= 0 ? '#4ade80' : '#f87171', fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", fontSize: 14,
          }}>
            {fmt(potentialProfit)}
          </div>
        </div>

        {/* Notes */}
        <div style={{ gridColumn: '1 / -1' }}>
          <label style={labelStyle}>Notes</label>
          <textarea
            placeholder="Deal notes, seller motivation, condition details..."
            value={form.notes}
            onChange={e => setForm({ ...form, notes: e.target.value })}
            rows={3}
            style={{ ...inputStyle, resize: 'vertical' }}
          />
        </div>
      </div>

      <div style={{ display: 'flex', gap: 10, marginTop: 20, justifyContent: 'flex-end' }}>
        <button type="button" onClick={() => { setOpen(false); setForm(emptyForm) }}
          style={{
            padding: '10px 20px', borderRadius: 8, background: 'transparent',
            border: '1px solid #2e3a4d', color: '#a09890', cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          }}>
          Cancel
        </button>
        <button type="submit"
          style={{
            padding: '10px 20px', borderRadius: 8,
            background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
            border: 'none', color: '#000', fontWeight: 600, cursor: 'pointer',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13,
          }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> Save Analysis
          </span>
        </button>
      </div>
    </form>
  )
}

// ---------------------------------------------------------------------------
// History Card
// ---------------------------------------------------------------------------

function HistoryCard({
  item,
  onDelete,
  selected,
  onToggleSelect,
  compareMode,
}: {
  item: SavedAnalysis
  onDelete: (id: string) => void
  selected: boolean
  onToggleSelect: (id: string) => void
  compareMode: boolean
}) {
  const profitPositive = item.potentialProfit >= 0
  const margin = pct(item.potentialProfit, item.arv)

  return (
    <div style={{
      background: '#1e2530',
      border: `1px solid ${selected ? '#ff7e5f' : '#2e3a4d'}`,
      borderRadius: 14, padding: 20, position: 'relative',
      transition: 'border-color 0.2s',
    }}>
      {/* Top row */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14, gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <Home size={14} style={{ color: '#ff7e5f', flexShrink: 0 }} />
            <span style={{
              fontFamily: "'DM Sans', sans-serif", fontSize: 15, fontWeight: 600, color: '#f5f0eb',
              overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
            }}>
              {item.address}
            </span>
          </div>
          <span style={{
            display: 'inline-block', padding: '3px 10px', borderRadius: 6, fontSize: 11, fontWeight: 600,
            fontFamily: "'DM Sans', sans-serif", letterSpacing: '0.02em',
            background: `${TYPE_COLORS[item.analysisType]}18`,
            color: TYPE_COLORS[item.analysisType],
            border: `1px solid ${TYPE_COLORS[item.analysisType]}30`,
          }}>
            {item.analysisType}
          </span>
        </div>

        <div style={{ display: 'flex', gap: 6, flexShrink: 0 }}>
          {compareMode && (
            <button
              onClick={() => onToggleSelect(item.id)}
              aria-label={selected ? 'Deselect for comparison' : 'Select for comparison'}
              style={{
                width: 32, height: 32, borderRadius: 8, border: `1px solid ${selected ? '#ff7e5f' : '#2e3a4d'}`,
                background: selected ? 'rgba(255,126,95,0.15)' : 'transparent',
                color: selected ? '#ff7e5f' : '#6b6560', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}
            >
              <Check size={14} />
            </button>
          )}
          <button
            onClick={() => onDelete(item.id)}
            aria-label="Delete analysis"
            style={{
              width: 32, height: 32, borderRadius: 8, border: '1px solid #2e3a4d',
              background: 'transparent', color: '#6b6560', cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              transition: 'all 0.2s',
            }}
            onMouseEnter={e => { e.currentTarget.style.borderColor = '#f87171'; e.currentTarget.style.color = '#f87171'; e.currentTarget.style.background = 'rgba(248,113,113,0.1)' }}
            onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e3a4d'; e.currentTarget.style.color = '#6b6560'; e.currentTarget.style.background = 'transparent' }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>

      {/* Numbers grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10, marginBottom: 14 }}>
        {[
          { label: 'Purchase', value: fmt(item.purchasePrice) },
          { label: 'ARV', value: fmt(item.arv) },
          { label: 'Repairs', value: fmt(item.repairCosts) },
          { label: 'Offer', value: fmt(item.offerPrice) },
        ].map(n => (
          <div key={n.label} style={{ background: '#161b24', borderRadius: 8, padding: '8px 10px' }}>
            <div style={{ fontSize: 10, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              {n.label}
            </div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>
              {n.value}
            </div>
          </div>
        ))}
      </div>

      {/* Profit row */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 12px',
        background: profitPositive ? 'rgba(74,222,128,0.06)' : 'rgba(248,113,113,0.06)',
        border: `1px solid ${profitPositive ? 'rgba(74,222,128,0.15)' : 'rgba(248,113,113,0.15)'}`,
        borderRadius: 8,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          {profitPositive
            ? <TrendingUp size={14} style={{ color: '#4ade80' }} />
            : <TrendingDown size={14} style={{ color: '#f87171' }} />}
          <span style={{ fontSize: 13, fontWeight: 600, color: profitPositive ? '#4ade80' : '#f87171', fontFamily: "'DM Sans', sans-serif" }}>
            {fmt(item.potentialProfit)}
          </span>
        </div>
        <span style={{ fontSize: 12, color: profitPositive ? '#4ade80' : '#f87171', fontFamily: "'DM Sans', sans-serif", opacity: 0.8 }}>
          {margin} margin
        </span>
      </div>

      {/* Notes */}
      {item.notes && (
        <p style={{ fontSize: 12, color: '#a09890', marginTop: 10, marginBottom: 0, lineHeight: 1.5, fontFamily: "'DM Sans', sans-serif" }}>
          {item.notes}
        </p>
      )}

      {/* Date */}
      <div style={{ fontSize: 11, color: '#6b6560', marginTop: 10, fontFamily: "'DM Sans', sans-serif" }}>
        Saved {new Date(item.dateSaved).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Comparison Table
// ---------------------------------------------------------------------------

function ComparisonTable({ items }: { items: SavedAnalysis[] }) {
  if (items.length < 2) return null

  const rows: { label: string; key: keyof SavedAnalysis | 'margin' }[] = [
    { label: 'Address', key: 'address' },
    { label: 'Type', key: 'analysisType' },
    { label: 'Purchase Price', key: 'purchasePrice' },
    { label: 'ARV', key: 'arv' },
    { label: 'Repair Costs', key: 'repairCosts' },
    { label: 'Offer Price', key: 'offerPrice' },
    { label: 'Potential Profit', key: 'potentialProfit' },
    { label: 'Profit Margin', key: 'margin' },
  ]

  function cellValue(item: SavedAnalysis, key: string) {
    if (key === 'margin') return pct(item.potentialProfit, item.arv)
    const v = item[key as keyof SavedAnalysis]
    if (typeof v === 'number') return fmt(v)
    return String(v ?? '')
  }

  const thStyle: React.CSSProperties = {
    padding: '10px 14px', textAlign: 'left', fontSize: 12, color: '#6b6560',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 500, borderBottom: '1px solid #2e3a4d',
    whiteSpace: 'nowrap',
  }

  const tdStyle: React.CSSProperties = {
    padding: '10px 14px', fontSize: 13, color: '#f5f0eb',
    fontFamily: "'DM Sans', sans-serif", borderBottom: '1px solid #2e3a4d',
    whiteSpace: 'nowrap',
  }

  return (
    <div style={{
      background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 14,
      padding: 20, marginBottom: 24, overflowX: 'auto',
    }}>
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
        <BarChart3 size={18} style={{ color: '#ffb347' }} /> Side-by-Side Comparison
      </h3>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            <th style={thStyle}>Metric</th>
            {items.map(item => (
              <th key={item.id} style={{ ...thStyle, color: '#ff7e5f' }}>
                {item.address.length > 25 ? item.address.slice(0, 25) + '...' : item.address}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map(row => (
            <tr key={row.key}>
              <td style={{ ...tdStyle, color: '#a09890', fontWeight: 500 }}>{row.label}</td>
              {items.map(item => {
                const isProfitRow = row.key === 'potentialProfit' || row.key === 'margin'
                const profitPositive = item.potentialProfit >= 0
                return (
                  <td key={item.id} style={{
                    ...tdStyle,
                    color: isProfitRow ? (profitPositive ? '#4ade80' : '#f87171') : '#f5f0eb',
                    fontWeight: isProfitRow ? 600 : 400,
                  }}>
                    {cellValue(item, row.key)}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function CalculatorHistory() {
  const [history, setHistory] = useState<SavedAnalysis[]>([])
  const [sortField, setSortField] = useState<SortField>('date')
  const [sortDir, setSortDir] = useState<SortDir>('desc')
  const [filterType, setFilterType] = useState<AnalysisType | 'all'>('all')
  const [compareMode, setCompareMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  // Load from localStorage on mount
  useEffect(() => {
    setHistory(loadHistory())
  }, [])

  // Persist on change
  useEffect(() => {
    if (history.length > 0 || localStorage.getItem(STORAGE_KEY)) {
      saveHistory(history)
    }
  }, [history])

  function handleSave(analysis: SavedAnalysis) {
    setHistory(prev => [analysis, ...prev])
  }

  function handleDelete(id: string) {
    setHistory(prev => prev.filter(a => a.id !== id))
    setSelectedIds(prev => {
      const next = new Set(prev)
      next.delete(id)
      return next
    })
  }

  function toggleSelect(id: string) {
    setSelectedIds(prev => {
      const next = new Set(prev)
      if (next.has(id)) {
        next.delete(id)
      } else if (next.size < 3) {
        next.add(id)
      }
      return next
    })
  }

  function toggleSort(field: SortField) {
    if (sortField === field) {
      setSortDir(d => d === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDir('desc')
    }
  }

  const filtered = useMemo(() => {
    let items = [...history]
    if (filterType !== 'all') {
      items = items.filter(a => a.analysisType === filterType)
    }
    items.sort((a, b) => {
      let cmp = 0
      if (sortField === 'date') {
        cmp = new Date(a.dateSaved).getTime() - new Date(b.dateSaved).getTime()
      } else {
        cmp = a.potentialProfit - b.potentialProfit
      }
      return sortDir === 'asc' ? cmp : -cmp
    })
    return items
  }, [history, filterType, sortField, sortDir])

  const comparedItems = useMemo(
    () => filtered.filter(a => selectedIds.has(a.id)),
    [filtered, selectedIds],
  )

  const sortBtnStyle = (active: boolean): React.CSSProperties => ({
    padding: '6px 14px', borderRadius: 8, fontSize: 12,
    fontFamily: "'DM Sans', sans-serif", fontWeight: active ? 600 : 400, cursor: 'pointer',
    background: active ? 'rgba(255,126,95,0.12)' : 'transparent',
    border: `1px solid ${active ? 'rgba(255,126,95,0.3)' : '#2e3a4d'}`,
    color: active ? '#ff7e5f' : '#a09890',
    display: 'flex', alignItems: 'center', gap: 4,
    transition: 'all 0.2s',
  })

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        <Calculator size={22} style={{ color: '#ff7e5f' }} />
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb',
          letterSpacing: '0.04em', margin: 0,
        }}>
          Saved Calculator History
        </h2>
      </div>
      <p style={{ fontSize: 14, color: '#a09890', fontFamily: "'DM Sans', sans-serif", marginTop: 0, marginBottom: 24, lineHeight: 1.5 }}>
        Save, review, and compare your deal analyses. All data is stored locally on your device.
      </p>

      {/* Quick Stats */}
      <QuickStats history={history} />

      {/* Save Form */}
      <SaveForm onSave={handleSave} />

      {/* Controls row */}
      {history.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 10, marginBottom: 20, alignItems: 'center',
          justifyContent: 'space-between',
        }}>
          {/* Left: Sort + Filter */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
            <button onClick={() => toggleSort('date')} style={sortBtnStyle(sortField === 'date')}>
              <ArrowUpDown size={12} /> Date {sortField === 'date' && (sortDir === 'desc' ? '\u2193' : '\u2191')}
            </button>
            <button onClick={() => toggleSort('profit')} style={sortBtnStyle(sortField === 'profit')}>
              <ArrowUpDown size={12} /> Profit {sortField === 'profit' && (sortDir === 'desc' ? '\u2193' : '\u2191')}
            </button>

            <select
              value={filterType}
              onChange={e => setFilterType(e.target.value as AnalysisType | 'all')}
              style={{
                padding: '6px 12px', borderRadius: 8, fontSize: 12,
                fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                background: '#161b24', border: '1px solid #2e3a4d', color: '#a09890',
                outline: 'none',
              }}
            >
              <option value="all">All Types</option>
              {ANALYSIS_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>

          {/* Right: Compare toggle */}
          <button
            onClick={() => { setCompareMode(!compareMode); setSelectedIds(new Set()) }}
            style={{
              padding: '6px 14px', borderRadius: 8, fontSize: 12,
              fontFamily: "'DM Sans', sans-serif", fontWeight: 600, cursor: 'pointer',
              background: compareMode ? 'rgba(255,179,71,0.12)' : 'transparent',
              border: `1px solid ${compareMode ? 'rgba(255,179,71,0.3)' : '#2e3a4d'}`,
              color: compareMode ? '#ffb347' : '#a09890',
              display: 'flex', alignItems: 'center', gap: 6,
              transition: 'all 0.2s',
            }}
          >
            <BarChart3 size={13} />
            {compareMode ? 'Exit Compare' : 'Compare'}
            {compareMode && selectedIds.size > 0 && ` (${selectedIds.size}/3)`}
          </button>
        </div>
      )}

      {/* Compare hint */}
      {compareMode && selectedIds.size < 2 && (
        <div style={{
          padding: '10px 14px', borderRadius: 8, marginBottom: 16,
          background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.15)',
          fontSize: 13, color: '#ffb347', fontFamily: "'DM Sans', sans-serif",
        }}>
          Select 2-3 analyses to compare side-by-side.
        </div>
      )}

      {/* Comparison Table */}
      {compareMode && comparedItems.length >= 2 && (
        <ComparisonTable items={comparedItems} />
      )}

      {/* History Cards */}
      {filtered.length === 0 ? (
        <div style={{
          textAlign: 'center', padding: '60px 20px', background: '#1e2530',
          border: '1px solid #2e3a4d', borderRadius: 14,
        }}>
          <Calculator size={36} style={{ color: '#2e3a4d', marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", margin: 0 }}>
            {history.length === 0
              ? 'No saved analyses yet. Save your first deal above!'
              : 'No analyses match the current filter.'}
          </p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
          {filtered.map(item => (
            <HistoryCard
              key={item.id}
              item={item}
              onDelete={handleDelete}
              selected={selectedIds.has(item.id)}
              onToggleSelect={toggleSelect}
              compareMode={compareMode}
            />
          ))}
        </div>
      )}
    </div>
  )
}
