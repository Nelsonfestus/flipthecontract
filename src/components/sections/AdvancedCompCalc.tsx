import { useState, useCallback } from 'react'
import { Calculator, Plus, Trash2, BarChart3, TrendingUp, AlertTriangle } from 'lucide-react'

interface CompEntry {
  id: number
  price: string
  sqft: string
  distance: string
}

function fmt(n: number) {
  if (!n && n !== 0) return '–'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtDec(n: number) {
  if (!n && n !== 0) return '–'
  return '$' + n.toFixed(2)
}

let nextId = 5

export default function AdvancedCompCalc() {
  const [subjectSqft, setSubjectSqft] = useState('')
  const [repairs, setRepairs] = useState('')
  const [rule, setRule] = useState('70')
  const [comps, setComps] = useState<CompEntry[]>([
    { id: 1, price: '', sqft: '', distance: '' },
    { id: 2, price: '', sqft: '', distance: '' },
    { id: 3, price: '', sqft: '', distance: '' },
    { id: 4, price: '', sqft: '', distance: '' },
  ])
  const [result, setResult] = useState<{
    weightedPpsf: number
    arv: number
    mao: number
    rating: 'great' | 'tight' | 'pass'
    compsUsed: number
    compsTotal: number
    outlierRemoved: number
  } | null>(null)
  const [error, setError] = useState('')

  const updateComp = useCallback((id: number, field: keyof Omit<CompEntry, 'id'>, value: string) => {
    setComps(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }, [])

  const addComp = useCallback(() => {
    setComps(prev => [...prev, { id: nextId++, price: '', sqft: '', distance: '' }])
  }, [])

  const removeComp = useCallback((id: number) => {
    setComps(prev => prev.length > 2 ? prev.filter(c => c.id !== id) : prev)
  }, [])

  function calculate() {
    setError('')
    setResult(null)

    const sqft = parseFloat(subjectSqft)
    const repairsN = parseFloat(repairs)
    const ruleN = parseFloat(rule) / 100

    if (!sqft || sqft <= 0) {
      setError('Enter the subject property square footage.')
      return
    }
    if (isNaN(repairsN) || repairsN < 0) {
      setError('Enter a valid repair estimate (can be $0).')
      return
    }

    const validComps: { ppsf: number; weight: number }[] = []

    for (const c of comps) {
      const p = parseFloat(c.price)
      const s = parseFloat(c.sqft)
      const d = parseFloat(c.distance)
      if (p && s && d >= 0) {
        const ppsf = p / s
        const sizeDiff = Math.abs(s - sqft) / sqft
        const weight = (1 / (1 + d)) * (1 / (1 + sizeDiff))
        validComps.push({ ppsf, weight })
      }
    }

    if (validComps.length < 2) {
      setError('Add at least 2 complete comps (price, sqft, distance).')
      return
    }

    // Remove outliers (beyond 1 std deviation)
    const values = validComps.map(c => c.ppsf)
    const avg = values.reduce((a, b) => a + b, 0) / values.length
    const std = Math.sqrt(values.map(x => Math.pow(x - avg, 2)).reduce((a, b) => a + b) / values.length)

    const filtered = validComps.filter(c => Math.abs(c.ppsf - avg) <= std)
    const outlierRemoved = validComps.length - filtered.length

    if (filtered.length < 1) {
      setError('Not enough valid comps after outlier removal. Add more comps.')
      return
    }

    // Weighted average
    const totalWeight = filtered.reduce((a, b) => a + b.weight, 0)
    const weightedAvg = filtered.reduce((sum, c) => sum + (c.ppsf * c.weight), 0) / totalWeight

    const arv = weightedAvg * sqft
    const mao = (arv * ruleN) - repairsN

    // Deal rating — based on MAO relative to ARV
    let rating: 'great' | 'tight' | 'pass'
    if (mao > arv * 0.6) rating = 'great'
    else if (mao > arv * 0.5) rating = 'tight'
    else rating = 'pass'

    setResult({
      weightedPpsf: weightedAvg,
      arv,
      mao,
      rating,
      compsUsed: filtered.length,
      compsTotal: validComps.length,
      outlierRemoved,
    })
  }

  const ratingConfig = {
    great: { emoji: '🔥', label: 'Great Deal', color: '#5cb885', bg: 'rgba(45,184,133,0.12)' },
    tight: { emoji: '⚠️', label: 'Tight Deal', color: '#ffb347', bg: 'rgba(232,179,71,0.12)' },
    pass: { emoji: '❌', label: 'Pass', color: '#e05050', bg: 'rgba(224,80,80,0.12)' },
  }

  return (
    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
        <BarChart3 size={20} color="#ff7e5f" />
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
          Advanced Comp Calculator
        </h3>
      </div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
        Enter your subject property details and comparable sales. The calculator uses weighted averaging (closer comps and similar sizes count more) with automatic outlier removal.
      </p>

      {/* Subject Property Inputs */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: '#ffb347', letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 10 }}>
          Subject Property
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12 }}>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Subject Sqft</label>
            <input
              className="input-dark"
              type="number"
              placeholder="1,400"
              value={subjectSqft}
              onChange={e => setSubjectSqft(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Repairs ($)</label>
            <input
              className="input-dark"
              type="number"
              placeholder="25,000"
              value={repairs}
              onChange={e => setRepairs(e.target.value)}
            />
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Investor Rule (%)</label>
            <input
              className="input-dark"
              type="number"
              placeholder="70"
              value={rule}
              onChange={e => setRule(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Comp Entries */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#ffb347', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Comparable Sales ({comps.length})
          </div>
          <button
            onClick={addComp}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(244,126,95,0.1)', border: '1px solid rgba(244,126,95,0.3)',
              color: '#ff7e5f', padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Plus size={13} /> Add Comp
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {comps.map((comp, i) => (
            <div
              key={comp.id}
              style={{
                background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8,
                padding: '12px 14px',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>COMP {i + 1}</span>
                {comps.length > 2 && (
                  <button
                    onClick={() => removeComp(comp.id)}
                    style={{
                      background: 'none', border: 'none', cursor: 'pointer',
                      color: '#555', padding: 4, display: 'flex',
                    }}
                    title="Remove comp"
                  >
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Sale Price ($)</label>
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="185,000"
                    value={comp.price}
                    onChange={e => updateComp(comp.id, 'price', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Sqft</label>
                  <input
                    className="input-dark"
                    type="number"
                    placeholder="1,350"
                    value={comp.sqft}
                    onChange={e => updateComp(comp.id, 'sqft', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Distance (mi)</label>
                  <input
                    className="input-dark"
                    type="number"
                    step="0.1"
                    placeholder="0.5"
                    value={comp.distance}
                    onChange={e => updateComp(comp.id, 'distance', e.target.value)}
                    style={{ padding: '8px 10px', fontSize: 13 }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Analyze Button */}
      <button
        onClick={calculate}
        className="btn-orange"
        style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}
      >
        <Calculator size={16} /> Analyze Deal
      </button>

      {/* Error */}
      {error && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.3)',
          borderRadius: 8, padding: '10px 14px', marginBottom: 16,
        }}>
          <AlertTriangle size={14} color="#e05050" />
          <span style={{ fontSize: 13, color: '#e05050' }}>{error}</span>
        </div>
      )}

      {/* Results */}
      {result && (
        <div style={{ animation: 'fadeInUp 0.4s ease' }}>
          {/* Deal Rating Banner */}
          <div style={{
            background: ratingConfig[result.rating].bg,
            border: `1px solid ${ratingConfig[result.rating].color}`,
            borderRadius: 10, padding: '16px 20px', marginBottom: 16,
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
          }}>
            <span style={{ fontSize: 28 }}>{ratingConfig[result.rating].emoji}</span>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 26,
              color: ratingConfig[result.rating].color, letterSpacing: '0.04em',
            }}>
              {ratingConfig[result.rating].label}
            </span>
          </div>

          {/* Result Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Weighted $/Sqft</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                {fmtDec(result.weightedPpsf)}
              </div>
            </div>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>ARV</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em' }}>
                {fmt(result.arv)}
              </div>
            </div>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Max Offer (MAO)</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: result.mao > 0 ? '#5cb885' : '#e05050', letterSpacing: '0.04em' }}>
                {result.mao > 0 ? fmt(result.mao) : "Doesn't work"}
              </div>
            </div>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Comps Used</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                {result.compsUsed} / {result.compsTotal}
                {result.outlierRemoved > 0 && (
                  <span style={{ fontSize: 11, color: '#888', fontFamily: "'DM Sans', sans-serif", marginLeft: 6 }}>
                    ({result.outlierRemoved} outlier{result.outlierRemoved > 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Explanation */}
          <div style={{ marginTop: 12, fontSize: 12, color: '#666', lineHeight: 1.6 }}>
            <TrendingUp size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
            Closer comps and similarly sized properties carry more weight. Outliers beyond 1 standard deviation are excluded automatically.
          </div>
        </div>
      )}
    </div>
  )
}
