import { useState, useRef, useCallback } from 'react'
import {
  Send, Copy, CheckCircle, DollarSign, Home, TrendingUp, Wrench,
  Search, MapPin, Calendar, Ruler, Loader2, Droplets, LandPlot,
  Download, FileText, Calculator, BarChart3, Plus, Trash2,
  AlertTriangle, ChevronDown, ChevronUp, Target, PieChart,
} from 'lucide-react'

/* ── Types ─────────────────────────────────────── */

interface Comp {
  address: string
  city: string
  state: string
  zip: string
  salePrice: number
  saleDate: string
  sqft: number
  bedrooms: number
  bathrooms: number
  yearBuilt: number
  distanceMiles: number
  pricePerSqft: number
  daysOnMarket: number
  propertyType: string
  pool: string
  lotSize: string
}

interface MarketSummary {
  medianPrice: number
  medianPricePerSqft: number
  avgDaysOnMarket: number
  trend: string
  notes: string
}

interface CompData {
  comps: Comp[]
  marketSummary: MarketSummary
}

interface ManualComp {
  id: number
  address: string
  beds: string
  baths: string
  dateSold: string
  price: string
  sqft: string
  distance: string
}

/* ── Helpers ───────────────────────────────────── */

function formatCurrency(val: string | number): string {
  const num = typeof val === 'string' ? parseFloat(val) : val
  if (isNaN(num)) return '$0'
  return '$' + num.toLocaleString('en-US')
}

function fmt(n: number) {
  if (!n && n !== 0) return '–'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function fmtDec(n: number) {
  if (!n && n !== 0) return '–'
  return '$' + n.toFixed(2)
}

/* ── Collapsible Section ──────────────────────── */

function CollapsibleSection({
  title,
  icon: Icon,
  iconColor = '#ff7e5f',
  defaultOpen = false,
  children,
}: {
  title: string
  icon: any
  iconColor?: string
  defaultOpen?: boolean
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(defaultOpen)
  return (
    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, marginBottom: 24, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '16px 24px', background: 'transparent', border: 'none', cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Icon size={18} color={iconColor} />
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: iconColor, letterSpacing: '0.04em' }}>
            {title}
          </span>
        </div>
        {open ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
      </button>
      {open && <div style={{ padding: '0 24px 24px' }}>{children}</div>}
    </div>
  )
}

/* ── Step Number Badge ───────────────────────── */

function StepBadge({ step }: { step: number }) {
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
      width: 24, height: 24, borderRadius: '50%',
      background: 'linear-gradient(135deg, #ff7e5f, #e06010)',
      color: '#000', fontSize: 12, fontWeight: 700,
      flexShrink: 0,
    }}>
      {step}
    </span>
  )
}

/* ── Manual Comp Analysis Section ──────────────── */

let nextManualCompId = 5

function ManualCompSection({ subjectSqft, onArvCalculated }: { subjectSqft: string; onArvCalculated: (arv: number, ppsf: number) => void }) {
  const [comps, setComps] = useState<ManualComp[]>([
    { id: 1, address: '', beds: '', baths: '', dateSold: '', price: '', sqft: '', distance: '' },
    { id: 2, address: '', beds: '', baths: '', dateSold: '', price: '', sqft: '', distance: '' },
    { id: 3, address: '', beds: '', baths: '', dateSold: '', price: '', sqft: '', distance: '' },
  ])
  const [result, setResult] = useState<{
    weightedPpsf: number
    arv: number
    compsUsed: number
    compsTotal: number
    outlierRemoved: number
  } | null>(null)
  const [error, setError] = useState('')

  const updateComp = useCallback((id: number, field: keyof Omit<ManualComp, 'id'>, value: string) => {
    setComps(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }, [])

  const addComp = useCallback(() => {
    setComps(prev => [...prev, { id: nextManualCompId++, address: '', beds: '', baths: '', dateSold: '', price: '', sqft: '', distance: '' }])
  }, [])

  const removeComp = useCallback((id: number) => {
    setComps(prev => prev.length > 2 ? prev.filter(c => c.id !== id) : prev)
  }, [])

  function calculate() {
    setError('')
    setResult(null)

    const sqft = parseFloat(subjectSqft)

    if (!sqft || sqft <= 0) {
      setError('Enter the subject property square footage in Property Details above first.')
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

    setResult({ weightedPpsf: weightedAvg, arv, compsUsed: filtered.length, compsTotal: validComps.length, outlierRemoved })
  }

  return (
    <div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
        Enter comparable sales with address, bed/bath count, date sold, and distance. Closer comps and similarly sized properties carry more weight. Outliers are removed automatically.
      </p>

      {/* Comp entries */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 10, flexWrap: 'wrap', gap: 8 }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: '#ffb347', letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            Manual Comps ({comps.length})
          </div>
          <button
            onClick={addComp}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              background: 'rgba(244,126,95,0.1)', border: '1px solid rgba(244,126,95,0.3)',
              color: '#ff7e5f', padding: '6px 12px', borderRadius: 6,
              cursor: 'pointer', fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <Plus size={13} /> Add Comp
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {comps.map((comp, i) => (
            <div key={comp.id} style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8, padding: '12px 14px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 11, color: '#666', fontWeight: 600 }}>COMP {i + 1}</span>
                {comps.length > 2 && (
                  <button onClick={() => removeComp(comp.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#555', padding: 4, display: 'flex' }} title="Remove comp">
                    <Trash2 size={14} />
                  </button>
                )}
              </div>
              <div style={{ marginBottom: 8 }}>
                <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Address</label>
                <input className="input-dark" type="text" placeholder="123 Main St" value={comp.address} onChange={e => updateComp(comp.id, 'address', e.target.value)} style={{ padding: '8px 10px', fontSize: 13, width: '100%' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(110px, 1fr))', gap: 8 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Beds</label>
                  <input className="input-dark" type="number" placeholder="3" value={comp.beds} onChange={e => updateComp(comp.id, 'beds', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Baths</label>
                  <input className="input-dark" type="number" step="0.5" placeholder="2" value={comp.baths} onChange={e => updateComp(comp.id, 'baths', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Date Sold</label>
                  <input className="input-dark" type="date" value={comp.dateSold} onChange={e => updateComp(comp.id, 'dateSold', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Sale Price ($)</label>
                  <input className="input-dark" type="number" placeholder="185,000" value={comp.price} onChange={e => updateComp(comp.id, 'price', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Sqft</label>
                  <input className="input-dark" type="number" placeholder="1,350" value={comp.sqft} onChange={e => updateComp(comp.id, 'sqft', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 11, color: '#666', marginBottom: 3 }}>Distance (mi)</label>
                  <input className="input-dark" type="number" step="0.1" placeholder="0.5" value={comp.distance} onChange={e => updateComp(comp.id, 'distance', e.target.value)} style={{ padding: '8px 10px', fontSize: 13 }} />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <button onClick={calculate} className="btn-orange" style={{ width: '100%', justifyContent: 'center', marginBottom: 16 }}>
        <Calculator size={16} /> Calculate ARV from Comps
      </button>

      {error && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16 }}>
          <AlertTriangle size={14} color="#e05050" />
          <span style={{ fontSize: 13, color: '#e05050' }}>{error}</span>
        </div>
      )}

      {result && (
        <div style={{ animation: 'fadeInUp 0.4s ease' }}>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10, marginBottom: 12 }}>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Weighted $/Sqft</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                {fmtDec(result.weightedPpsf)}
              </div>
            </div>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Calculated ARV</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em' }}>
                {fmt(result.arv)}
              </div>
            </div>
            <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Comps Used</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                {result.compsUsed} / {result.compsTotal}
                {result.outlierRemoved > 0 && (
                  <span style={{ fontSize: 11, color: '#888', fontFamily: "'DM Sans', sans-serif", marginLeft: 4 }}>
                    ({result.outlierRemoved} outlier{result.outlierRemoved > 1 ? 's' : ''})
                  </span>
                )}
              </div>
            </div>
          </div>

          <button
            onClick={() => onArvCalculated(Math.round(result.arv), result.weightedPpsf)}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 6,
              padding: '10px 20px', fontSize: 14, fontWeight: 600,
              background: 'linear-gradient(135deg, #5cb885, #1d7a45)',
              color: '#fff', border: 'none', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              width: '100%', justifyContent: 'center',
            }}
          >
            <TrendingUp size={14} /> Use {fmt(result.arv)} as ARV in Deal Numbers Below
          </button>
        </div>
      )}
    </div>
  )
}

/* ── NOI / Cap Rate Calculator ─────────────────── */

function NOICalcSection() {
  const [rent, setRent] = useState('')
  const [vacancy, setVacancy] = useState('5')
  const [expenses, setExpenses] = useState('')
  const [capRate, setCapRate] = useState('8')

  const rentN = parseFloat(rent) || 0
  const vacancyN = parseFloat(vacancy) || 5
  const expN = parseFloat(expenses) || 0
  const capN = parseFloat(capRate) || 8

  const grossIncome = rentN * 12
  const effectiveIncome = grossIncome * (1 - vacancyN / 100)
  const noi = effectiveIncome - expN
  const impliedValue = capN > 0 ? noi / (capN / 100) : 0

  return (
    <div>
      <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
        For rental/buy-and-hold buyers: calculate NOI and implied property value based on cap rate.
      </p>

      <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, marginBottom: 16 }}>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 13, color: '#f5f0eb', lineHeight: 1.8 }}>
          <span style={{ color: '#5cb885' }}>NOI</span> = Gross Income - <span style={{ color: '#e05050' }}>Operating Expenses</span>
          <br />
          <span style={{ color: '#5cb885' }}>Property Value</span> = NOI / Cap Rate
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Monthly Rent ($)</label>
          <input className="input-dark" type="number" placeholder="1500" value={rent} onChange={e => setRent(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Vacancy Rate (%)</label>
          <input className="input-dark" type="number" placeholder="5" value={vacancy} onChange={e => setVacancy(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Annual Operating Expenses ($)</label>
          <input className="input-dark" type="number" placeholder="5000" value={expenses} onChange={e => setExpenses(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Market Cap Rate (%)</label>
          <input className="input-dark" type="number" placeholder="8" value={capRate} onChange={e => setCapRate(e.target.value)} />
        </div>
      </div>

      {rentN > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
          {[
            { label: 'Gross Annual Income', value: fmt(grossIncome), color: '#f5f0eb' },
            { label: `Effective Income (-${vacancyN}% vacancy)`, value: fmt(effectiveIncome), color: '#ffb347' },
            { label: '- Operating Expenses', value: fmt(expN), color: '#e05050' },
            { label: 'NOI', value: fmt(noi), color: noi > 0 ? '#5cb885' : '#e05050' },
            { label: `Implied Value @ ${capN}% Cap`, value: impliedValue > 0 ? fmt(impliedValue) : '–', color: '#ff7e5f' },
          ].map(item => (
            <div key={item.label} style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{item.label}</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: item.color, letterSpacing: '0.04em' }}>
                {item.value}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

/* ══════════════════════════════════════════════════
   MAIN COMPONENT — Unified Deal Analyzer + Buyer Template
   ══════════════════════════════════════════════════ */

export default function BuyerTemplate() {
  const [form, setForm] = useState({
    propertyAddress: '',
    city: '',
    state: '',
    zip: '',
    bedrooms: '',
    bathrooms: '',
    sqft: '',
    yearBuilt: '',
    lotSize: '',
    pool: 'No',
    propertyType: 'Single Family',
    condition: 'Fair',
    arv: '',
    askingPrice: '',
    rehabEstimate: '',
    assignmentFee: '',
    investorRule: '70',
    notes: '',
    sellerName: '',
    buyerName: '',
  })
  const [arvSource, setArvSource] = useState<'manual' | 'comps' | 'calc' | ''>('')

  const [generated, setGenerated] = useState(false)
  const [copied, setCopied] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editableContent, setEditableContent] = useState('')
  const previewRef = useRef<HTMLDivElement>(null)
  const editRef = useRef<HTMLTextAreaElement>(null)
  const numbersRef = useRef<HTMLDivElement>(null)

  // Comp lookup state
  const [compData, setCompData] = useState<CompData | null>(null)
  const [compLoading, setCompLoading] = useState(false)
  const [compError, setCompError] = useState('')
  const compsRef = useRef<HTMLDivElement>(null)

  function handleChange(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
    if (field === 'arv') setArvSource('manual')
  }

  // ── Computed deal numbers (single source of truth) ──
  const arv = parseFloat(form.arv) || 0
  const asking = parseFloat(form.askingPrice) || 0
  const rehab = parseFloat(form.rehabEstimate) || 0
  const fee = parseFloat(form.assignmentFee) || 0
  const rulePercent = parseFloat(form.investorRule) || 70
  const ruleDecimal = rulePercent / 100

  const mao = arv * ruleDecimal - rehab - fee
  const potentialProfit = arv - asking - rehab - fee
  const roiPercent = asking > 0 ? ((potentialProfit / (asking + rehab)) * 100).toFixed(1) : '0'
  const investorProfit = arv - asking - rehab - arv * 0.08 // rough holding/selling costs
  const spread = arv - asking

  // Deal Rating — based on whether asking price is at or below MAO
  let dealRating: 'great' | 'good' | 'tight' | 'pass' = 'pass'
  if (arv > 0 && asking > 0) {
    if (asking <= mao * 0.95) dealRating = 'great'
    else if (asking <= mao) dealRating = 'good'
    else if (asking <= mao * 1.1) dealRating = 'tight'
    else dealRating = 'pass'
  }

  const ratingConfig = {
    great: { emoji: '🔥', label: 'Great Deal — Well Below MAO', color: '#5cb885', bg: 'rgba(45,184,133,0.12)' },
    good: { emoji: '✅', label: 'Good Deal — At or Below MAO', color: '#5a9ad6', bg: 'rgba(90,154,214,0.12)' },
    tight: { emoji: '⚠️', label: 'Tight Deal — Slightly Over MAO', color: '#ffb347', bg: 'rgba(232,179,71,0.12)' },
    pass: { emoji: '❌', label: 'Pass — Over MAO', color: '#e05050', bg: 'rgba(224,80,80,0.12)' },
  }

  function scrollToNumbers() {
    setTimeout(() => {
      numbersRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  async function handlePullComps() {
    if (!form.propertyAddress || !form.city || !form.state) {
      setCompError('Please enter address, city, and state to pull comps.')
      return
    }

    setCompLoading(true)
    setCompError('')
    setCompData(null)

    try {
      const res = await fetch('/api/comp-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: form.propertyAddress,
          city: form.city,
          state: form.state,
          zip: form.zip,
          sqft: form.sqft,
          bedrooms: form.bedrooms,
          bathrooms: form.bathrooms,
          lotSize: form.lotSize,
          pool: form.pool,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.error || 'Failed to fetch comps')
      }

      const data: CompData = await res.json()
      setCompData(data)

      if (data.marketSummary?.medianPrice) {
        setForm(prev => ({ ...prev, arv: String(data.marketSummary.medianPrice) }))
        setArvSource('comps')
      }

      setTimeout(() => {
        compsRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
      }, 100)
    } catch (err: any) {
      setCompError(err.message || 'Failed to pull comps. Please try again.')
    } finally {
      setCompLoading(false)
    }
  }

  function generateTemplate(): string {
    let compSection = ''
    if (compData && compData.comps.length > 0) {
      compSection = `\nCOMPARABLE SALES (Same City, Within 3 Mi, Last 9 Months)
─────────────────────────────────────────\n`
      compData.comps.forEach((c, i) => {
        compSection += `Comp ${i + 1}: ${c.address}, ${c.city}, ${c.state}
  Sale Price: ${formatCurrency(c.salePrice)} | Date: ${c.saleDate}
  ${c.sqft} sqft | ${c.bedrooms}bd/${c.bathrooms}ba | Built ${c.yearBuilt}
  Pool: ${c.pool || 'N/A'} | Lot Size: ${c.lotSize || 'N/A'}
  $/sqft: ${formatCurrency(c.pricePerSqft)} | ${c.distanceMiles} mi away | ${c.daysOnMarket} DOM\n\n`
      })
      compSection += `Market Summary:
  Median Price: ${formatCurrency(compData.marketSummary.medianPrice)}
  Median $/sqft: ${formatCurrency(compData.marketSummary.medianPricePerSqft)}
  Avg Days on Market: ${compData.marketSummary.avgDaysOnMarket}
  Market Trend: ${compData.marketSummary.trend}
  ${compData.marketSummary.notes}\n`
    }

    const ratingLabel = (arv > 0 && asking > 0) ? ratingConfig[dealRating].label : 'N/A'

    return `═══════════════════════════════════════════
  WHOLESALE DEAL PRESENTATION
  Flip the Contract
═══════════════════════════════════════════

PROPERTY DETAILS
─────────────────────────────────────────
Address:        ${form.propertyAddress}
City/State:     ${form.city}, ${form.state} ${form.zip}
Property Type:  ${form.propertyType}
Bedrooms:       ${form.bedrooms}
Bathrooms:      ${form.bathrooms}
Sq. Footage:    ${form.sqft} sqft
Year Built:     ${form.yearBuilt}
Lot Size:       ${form.lotSize ? form.lotSize + ' sqft' : 'N/A'}
Pool:           ${form.pool}
Condition:      ${form.condition}

THE NUMBERS (${rulePercent}% Rule)
─────────────────────────────────────────
ARV (After Repair Value):   ${formatCurrency(form.arv)}
Asking Price:               ${formatCurrency(form.askingPrice)}
Estimated Rehab:            ${formatCurrency(form.rehabEstimate)}
Assignment Fee:             ${formatCurrency(form.assignmentFee)}
─────────────────────────────────────────
${rulePercent}% of ARV:              ${formatCurrency(String(arv * ruleDecimal))}
MAO (Max Allowable Offer):  ${formatCurrency(String(mao))}
Spread (ARV - Asking):      ${formatCurrency(String(spread))}
Potential Profit:           ${formatCurrency(String(potentialProfit))}
ROI:                        ${roiPercent}%
Est. Investor Profit:       ${formatCurrency(String(investorProfit))} (ARV - Purchase - Rehab - 8% costs)
─────────────────────────────────────────
DEAL RATING:                ${ratingLabel}
${compSection}
${form.notes ? `ADDITIONAL NOTES\n─────────────────────────────────────────\n${form.notes}\n` : ''}
═══════════════════════════════════════════
This deal is being presented by Flip the Contract.
For questions, contact the assignor directly.
═══════════════════════════════════════════`
  }

  function handleGenerate() {
    setGenerated(true)
    setIsEditing(false)
    setEditableContent(generateTemplate())
    setTimeout(() => {
      previewRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 100)
  }

  function handleCopy() {
    navigator.clipboard.writeText(editableContent)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  function handleDownloadTxt() {
    const content = editableContent
    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deal-presentation-${form.propertyAddress.replace(/\s+/g, '-') || 'template'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function handleDownloadDoc() {
    const content = editableContent
    const htmlContent = `<!DOCTYPE html>
<html><head><meta charset="utf-8"><title>Wholesale Deal Presentation</title>
<style>
body { font-family: 'Courier New', monospace; font-size: 12px; line-height: 1.8; color: #222; max-width: 800px; margin: 40px auto; padding: 20px; }
h1 { text-align: center; font-size: 18px; border-top: 3px double #333; border-bottom: 3px double #333; padding: 10px 0; }
h2 { font-size: 14px; border-bottom: 1px solid #333; padding-bottom: 4px; margin-top: 24px; }
pre { white-space: pre-wrap; word-wrap: break-word; }
.highlight { background: #fffde7; padding: 2px 4px; }
</style></head><body>
<pre>${content.replace(/</g, '&lt;').replace(/>/g, '&gt;')}</pre>
</body></html>`
    const blob = new Blob([htmlContent], { type: 'application/msword' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `deal-presentation-${form.propertyAddress.replace(/\s+/g, '-') || 'template'}.doc`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }


  return (
    <div>
      <h2 className="section-header">Deal Analyzer & Buyer Template</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Analyze a wholesale deal from start to finish, then generate a professional template to send to your cash buyers.
      </p>
      <div className="info-tip" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0 }}>
          <strong>How it works:</strong> Property Details → Find ARV (via comps) → Enter Deal Numbers → See if it works → Generate Buyer Template
        </p>
      </div>

      <div style={{ display: 'grid', gap: 0 }}>

        {/* ═══════════════════════════════════════════
            STEP 1: PROPERTY DETAILS
            ═══════════════════════════════════════════ */}
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepBadge step={1} /> <Home size={18} /> Property Details
          </h3>
          <p style={{ fontSize: 12, color: '#666', margin: '0 0 16px' }}>
            Enter the subject property information. Address, city, and state are required to pull comps.
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Property Address *</label>
              <input className="input-dark" value={form.propertyAddress} onChange={e => handleChange('propertyAddress', e.target.value)} placeholder="123 Main St" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>City *</label>
              <input className="input-dark" value={form.city} onChange={e => handleChange('city', e.target.value)} placeholder="Houston" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>State *</label>
              <input className="input-dark" value={form.state} onChange={e => handleChange('state', e.target.value)} placeholder="TX" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Zip</label>
              <input className="input-dark" value={form.zip} onChange={e => handleChange('zip', e.target.value)} placeholder="77001" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Bedrooms</label>
              <input className="input-dark" type="number" value={form.bedrooms} onChange={e => handleChange('bedrooms', e.target.value)} placeholder="3" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Bathrooms</label>
              <input className="input-dark" type="number" value={form.bathrooms} onChange={e => handleChange('bathrooms', e.target.value)} placeholder="2" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Square Footage</label>
              <input className="input-dark" type="number" value={form.sqft} onChange={e => handleChange('sqft', e.target.value)} placeholder="1500" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Year Built</label>
              <input className="input-dark" type="number" value={form.yearBuilt} onChange={e => handleChange('yearBuilt', e.target.value)} placeholder="1985" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Lot Size (sqft)</label>
              <input className="input-dark" type="number" value={form.lotSize} onChange={e => handleChange('lotSize', e.target.value)} placeholder="6000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Pool</label>
              <select className="input-dark" value={form.pool} onChange={e => handleChange('pool', e.target.value)} style={{ cursor: 'pointer' }}>
                <option>No</option>
                <option>Yes</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Property Type</label>
              <select className="input-dark" value={form.propertyType} onChange={e => handleChange('propertyType', e.target.value)} style={{ cursor: 'pointer' }}>
                <option>Single Family</option>
                <option>Duplex</option>
                <option>Triplex</option>
                <option>Quadplex</option>
                <option>Townhouse</option>
                <option>Condo</option>
                <option>Mobile Home</option>
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Condition</label>
              <select className="input-dark" value={form.condition} onChange={e => handleChange('condition', e.target.value)} style={{ cursor: 'pointer' }}>
                <option>Excellent</option>
                <option>Good</option>
                <option>Fair</option>
                <option>Poor</option>
                <option>Needs Full Rehab</option>
              </select>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════
            STEP 2: FIND YOUR ARV
            ═══════════════════════════════════════════ */}
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepBadge step={2} /> <Search size={18} /> Find Your ARV
          </h3>
          <p style={{ fontSize: 12, color: '#666', margin: '0 0 16px' }}>
            Choose one method to determine the After Repair Value. Either pull comps automatically or enter your own manually.
          </p>

          {/* ARV Source Indicator */}
          {arvSource && arv > 0 && (
            <div style={{
              display: 'flex', alignItems: 'center', gap: 8,
              padding: '10px 14px', marginBottom: 16, borderRadius: 8,
              background: 'rgba(45,184,133,0.08)', border: '1px solid rgba(45,184,133,0.25)',
            }}>
              <CheckCircle size={16} color="#5cb885" />
              <span style={{ fontSize: 13, color: '#8fc9a3' }}>
                <strong>ARV set to {fmt(arv)}</strong>
                {arvSource === 'comps' && ' — from comp median price'}
                {arvSource === 'calc' && ' — from manual comp analysis'}
                {arvSource === 'manual' && ' — entered manually'}
              </span>
            </div>
          )}

          {/* Option A: Pull Comps */}
          <div style={{
            background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, marginBottom: 16,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Option A</span>
              <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>Pull Comps Automatically</span>
            </div>
            <p style={{ fontSize: 12, color: '#666', margin: '0 0 12px' }}>
              Finds 5 comparable sales in the same city (3 mi radius, last 9 months) with matching beds/baths.
            </p>
            <button
              onClick={handlePullComps}
              disabled={compLoading || !form.propertyAddress || !form.city || !form.state}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 24px', fontSize: 15, fontWeight: 600,
                background: compLoading ? '#333' : 'linear-gradient(135deg, #5cb885, #1d7a45)',
                color: '#fff', border: 'none', borderRadius: 8, cursor: compLoading ? 'not-allowed' : 'pointer',
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
                opacity: (!form.propertyAddress || !form.city || !form.state) ? 0.5 : 1,
              }}
            >
              {compLoading ? <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Pulling Comps...</> : <><Search size={16} /> Pull Comps for ARV</>}
            </button>
            {compError && (
              <div style={{ marginTop: 8, padding: '10px 14px', background: 'rgba(224,80,80,0.1)', border: '1px solid rgba(224,80,80,0.3)', borderRadius: 8, fontSize: 13, color: '#e05050' }}>
                {compError}
              </div>
            )}
          </div>

          {/* Option B: Manual Comp Calculator */}
          <div style={{
            background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 20,
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
              <span style={{ fontSize: 11, fontWeight: 700, color: '#ffb347', letterSpacing: '0.05em', textTransform: 'uppercase' }}>Option B</span>
              <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>Manual Comp Analysis</span>
            </div>
            <CollapsibleSection title="Advanced Comp Calculator" icon={BarChart3} iconColor="#ffb347" defaultOpen={false}>
              <ManualCompSection
                subjectSqft={form.sqft}
                onArvCalculated={(arvVal) => {
                  setForm(prev => ({ ...prev, arv: String(arvVal) }))
                  setArvSource('calc')
                  scrollToNumbers()
                }}
              />
            </CollapsibleSection>
          </div>
        </div>

        {/* ── Comp Results (shown after pull) ── */}
        {compData && (
          <div ref={compsRef} style={{ background: '#263040', border: '1px solid #5cb88533', borderRadius: 10, padding: 24, marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#5cb885', letterSpacing: '0.04em', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
              <TrendingUp size={18} /> Comparable Sales Found
            </h3>
            <p style={{ fontSize: 13, color: '#888', margin: '0 0 16px' }}>
              Properties sold within 9 months, same city, within 3 miles. Exact bedroom/bathroom match.
            </p>

            {/* Market Summary */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
              <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Median Price (ARV)</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885' }}>
                  {formatCurrency(compData.marketSummary.medianPrice)}
                </div>
              </div>
              <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Median $/sqft</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ffb347' }}>
                  {formatCurrency(compData.marketSummary.medianPricePerSqft)}
                </div>
              </div>
              <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Avg Days on Market</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f' }}>
                  {compData.marketSummary.avgDaysOnMarket}
                </div>
              </div>
              <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Market Trend</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5a9ad6', textTransform: 'capitalize' }}>
                  {compData.marketSummary.trend}
                </div>
              </div>
            </div>

            {compData.marketSummary.notes && (
              <div style={{ padding: '10px 14px', background: 'rgba(45,184,133,0.06)', border: '1px solid rgba(45,184,133,0.2)', borderRadius: 8, fontSize: 13, color: '#8fc9a3', marginBottom: 16, lineHeight: 1.6 }}>
                {compData.marketSummary.notes}
              </div>
            )}

            <div style={{ fontSize: 12, color: '#5cb885', fontWeight: 600, marginBottom: 12, letterSpacing: '0.05em' }}>
              COMPARABLE PROPERTIES ({compData.comps.length} FOUND)
            </div>

            <div style={{ display: 'grid', gap: 10 }}>
              {compData.comps.map((comp, i) => (
                <div key={i} style={{
                  background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 16,
                  display: 'grid', gridTemplateColumns: 'minmax(0, 1fr) auto', gap: 12, alignItems: 'start',
                }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                      <span style={{ background: '#ff7e5f', color: '#000', fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4 }}>
                        COMP {i + 1}
                      </span>
                      <span style={{ fontSize: 11, color: '#666' }}>{comp.distanceMiles} mi away</span>
                    </div>
                    <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 600, marginBottom: 4 }}>
                      <MapPin size={12} style={{ display: 'inline', marginRight: 4 }} />
                      {comp.address}
                    </div>
                    <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>
                      {comp.city}, {comp.state} {comp.zip}
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#888' }}>
                      <span><Ruler size={11} style={{ display: 'inline', marginRight: 3 }} />{comp.sqft.toLocaleString()} sqft</span>
                      <span>{comp.bedrooms}bd / {comp.bathrooms}ba</span>
                      <span>Built {comp.yearBuilt}</span>
                      <span><Calendar size={11} style={{ display: 'inline', marginRight: 3 }} />Sold {comp.saleDate}</span>
                      <span>{comp.daysOnMarket} DOM</span>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#888', marginTop: 4 }}>
                      <span style={{ color: comp.pool === 'Yes' ? '#5a9ad6' : '#666' }}>
                        <Droplets size={11} style={{ display: 'inline', marginRight: 3 }} />Pool: {comp.pool || 'N/A'}
                      </span>
                      <span>
                        <LandPlot size={11} style={{ display: 'inline', marginRight: 3 }} />Lot: {comp.lotSize || 'N/A'}
                      </span>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#5cb885' }}>
                      {formatCurrency(comp.salePrice)}
                    </div>
                    <div style={{ fontSize: 11, color: '#888' }}>
                      {formatCurrency(comp.pricePerSqft)}/sqft
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="info-tip" style={{ marginTop: 16 }}>
              <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0 }}>
                <strong>ARV auto-set to {formatCurrency(compData.marketSummary.medianPrice)}</strong> based on the median comp price. You can adjust it in the Deal Numbers section below.
              </p>
            </div>
          </div>
        )}

        {/* ═══════════════════════════════════════════
            STEP 3: DEAL NUMBERS (single source of truth)
            ═══════════════════════════════════════════ */}
        <div ref={numbersRef} style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 6px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepBadge step={3} /> <DollarSign size={18} /> Deal Numbers
          </h3>
          <p style={{ fontSize: 12, color: '#666', margin: '0 0 16px' }}>
            Enter your numbers. Everything calculates in real time — MAO, profit, ROI, and deal rating all update automatically.
          </p>

          {/* Formula reference */}
          <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, marginBottom: 16 }}>
            <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 13, color: '#f5f0eb', lineHeight: 1.8 }}>
              <span style={{ color: '#5cb885' }}>MAO</span> = (ARV x <span style={{ color: '#ffb347' }}>{rulePercent}%</span>) - <span style={{ color: '#e05050' }}>Rehab</span> - <span style={{ color: '#e05050' }}>Assignment Fee</span>
            </div>
          </div>

          {/* Input Fields */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>
                ARV (After Repair Value) *
                {arvSource === 'comps' && <span style={{ color: '#5cb885', marginLeft: 6, fontSize: 11 }}>From comps</span>}
                {arvSource === 'calc' && <span style={{ color: '#ffb347', marginLeft: 6, fontSize: 11 }}>From calculator</span>}
              </label>
              <input className="input-dark" type="number" value={form.arv} onChange={e => handleChange('arv', e.target.value)} placeholder="250000"
                style={arvSource === 'comps' ? { borderColor: '#5cb88544' } : arvSource === 'calc' ? { borderColor: '#ffb34744' } : {}}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Asking Price *</label>
              <input className="input-dark" type="number" value={form.askingPrice} onChange={e => handleChange('askingPrice', e.target.value)} placeholder="150000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Estimated Rehab *</label>
              <input className="input-dark" type="number" value={form.rehabEstimate} onChange={e => handleChange('rehabEstimate', e.target.value)} placeholder="35000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Assignment Fee</label>
              <input className="input-dark" type="number" value={form.assignmentFee} onChange={e => handleChange('assignmentFee', e.target.value)} placeholder="10000" />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Investor Rule (%)</label>
              <input className="input-dark" type="number" value={form.investorRule} onChange={e => setForm(prev => ({ ...prev, investorRule: e.target.value }))} placeholder="70" />
              <span style={{ fontSize: 10, color: '#666' }}>Standard is 70%. Competitive markets may use 75-80%.</span>
            </div>
          </div>

          {/* ── Deal Results ── */}
          {arv > 0 && (
            <div style={{ animation: 'fadeInUp 0.3s ease' }}>
              {/* Deal Rating Banner (only show when asking price is entered) */}
              {asking > 0 && (
                <div style={{
                  background: ratingConfig[dealRating].bg,
                  border: `1px solid ${ratingConfig[dealRating].color}`,
                  borderRadius: 10, padding: '16px 20px', marginBottom: 16,
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 10,
                }}>
                  <span style={{ fontSize: 28 }}>{ratingConfig[dealRating].emoji}</span>
                  <span style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 24,
                    color: ratingConfig[dealRating].color, letterSpacing: '0.04em',
                  }}>
                    {ratingConfig[dealRating].label}
                  </span>
                </div>
              )}

              {/* Numbers Breakdown */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(150px, 1fr))', gap: 10 }}>
                {[
                  { label: 'ARV', value: fmt(arv), color: '#f5f0eb', icon: TrendingUp },
                  { label: `${rulePercent}% of ARV`, value: fmt(arv * ruleDecimal), color: '#ffb347', icon: PieChart },
                  { label: '- Rehab', value: fmt(rehab), color: '#e05050', icon: Wrench },
                  { label: '- Assignment Fee', value: fmt(fee), color: '#e05050', icon: DollarSign },
                  { label: 'Max Offer (MAO)', value: mao > 0 ? fmt(mao) : "Doesn't work", color: mao > 0 ? '#5cb885' : '#e05050', icon: Target },
                  ...(asking > 0 ? [
                    { label: 'Spread (ARV - Ask)', value: fmt(spread), color: spread >= 0 ? '#5a9ad6' : '#e05050', icon: TrendingUp },
                    { label: 'Potential Profit', value: fmt(potentialProfit), color: potentialProfit >= 0 ? '#5cb885' : '#e05050', icon: DollarSign },
                    { label: 'ROI', value: `${roiPercent}%`, color: parseFloat(roiPercent) >= 0 ? '#5cb885' : '#e05050', icon: PieChart },
                    { label: 'Est. Investor Profit', value: investorProfit > 0 ? fmt(investorProfit) : '–', color: '#ffb347', icon: TrendingUp },
                  ] : []),
                ].map(item => (
                  <div key={item.label} style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <item.icon size={16} color={item.color} style={{ marginBottom: 4 }} />
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 2 }}>{item.label}</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: item.color, letterSpacing: '0.04em' }}>
                      {item.value}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick verdict */}
              {asking > 0 && mao > 0 && (
                <div style={{
                  marginTop: 12, padding: '10px 14px', borderRadius: 8, fontSize: 13, lineHeight: 1.6,
                  background: asking <= mao ? 'rgba(45,184,133,0.06)' : 'rgba(224,80,80,0.06)',
                  border: asking <= mao ? '1px solid rgba(45,184,133,0.2)' : '1px solid rgba(224,80,80,0.2)',
                  color: asking <= mao ? '#8fc9a3' : '#e88080',
                }}>
                  {asking <= mao
                    ? <>The asking price of {fmt(asking)} is <strong>{fmt(mao - asking)} below</strong> your MAO of {fmt(mao)}. This deal has room.</>
                    : <>The asking price of {fmt(asking)} is <strong>{fmt(asking - mao)} above</strong> your MAO of {fmt(mao)}. You'd need to negotiate down to make this work.</>
                  }
                </div>
              )}
            </div>
          )}
        </div>

        {/* ═══════════════════════════════════════════
            STEP 4: NOI (Optional, for rental buyers)
            ═══════════════════════════════════════════ */}
        <CollapsibleSection title="NOI / Cap Rate Calculator (For Rental Buyers)" icon={Calculator} iconColor="#ffb347">
          <NOICalcSection />
        </CollapsibleSection>

        {/* ═══════════════════════════════════════════
            STEP 5: NOTES + GENERATE
            ═══════════════════════════════════════════ */}
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px', display: 'flex', alignItems: 'center', gap: 8 }}>
            <StepBadge step={4} /> <FileText size={18} /> Notes & Generate
          </h3>
          <textarea
            className="input-dark"
            value={form.notes}
            onChange={e => handleChange('notes', e.target.value)}
            placeholder="Add any additional details about the deal, motivation, timeline, etc."
            rows={4}
            style={{ resize: 'vertical', marginBottom: 16 }}
          />

          <button
            onClick={handleGenerate}
            className="btn-orange"
            style={{ width: '100%', justifyContent: 'center', padding: '16px 28px', fontSize: 18 }}
            disabled={!form.propertyAddress || !form.arv || !form.askingPrice}
          >
            <Send size={18} /> Generate Buyer Template
          </button>
          {(!form.propertyAddress || !form.arv || !form.askingPrice) && (
            <p style={{ fontSize: 11, color: '#666', marginTop: 8, textAlign: 'center' }}>
              Fill in the property address, ARV, and asking price to generate a template.
            </p>
          )}
        </div>
      </div>

      {/* ═══════════════════════════════════════════
          TEMPLATE PREVIEW
          ═══════════════════════════════════════════ */}
      {generated && (
        <div ref={previewRef} style={{ marginTop: 8, background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 10 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
              Deal Presentation Preview
            </h3>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              {editableContent !== generateTemplate() && (
                <button
                  onClick={() => setEditableContent(generateTemplate())}
                  style={{
                    display: 'inline-flex', alignItems: 'center', gap: 6,
                    padding: '8px 14px', fontSize: 13, fontWeight: 600,
                    background: 'linear-gradient(135deg, #6b2f2f, #4a1a1a)',
                    color: '#ff9e9e', border: '1px solid #6b2f2f', borderRadius: 6, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Reset to Original
                </button>
              )}
              <button onClick={handleCopy} className="btn-orange" style={{ padding: '8px 14px', fontSize: 13 }}>
                {copied ? <><CheckCircle size={14} /> Copied!</> : <><Copy size={14} /> Copy</>}
              </button>
            </div>
          </div>

          <p style={{ fontSize: 12, color: isEditing ? '#ff7e5f' : '#666', marginBottom: 8, fontStyle: 'italic' }}>
            {isEditing ? 'EDITING — customize below' : 'Click the text below to edit'}
          </p>

          <textarea
            ref={editRef}
            value={editableContent}
            onChange={e => { setEditableContent(e.target.value); setIsEditing(true) }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              fontSize: 13, lineHeight: 1.7, color: '#ccc',
              background: isEditing ? '#111' : '#1a2030',
              border: isEditing ? '1px solid #ff7e5f' : '1px solid #2e3a4d',
              borderRadius: 8, padding: 16,
              minHeight: 300, maxHeight: 500, overflowY: 'auto',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          />

          {/* Download Buttons */}
          <div style={{ marginTop: 16, display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={handleDownloadTxt}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', fontSize: 14, fontWeight: 600,
                background: 'linear-gradient(135deg, #5cb885, #1d7a45)',
                color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", flex: '1 1 auto', justifyContent: 'center', minWidth: 180,
              }}
            >
              <Download size={16} /> Download as .TXT
            </button>
            <button
              onClick={handleDownloadDoc}
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 8,
                padding: '12px 20px', fontSize: 14, fontWeight: 600,
                background: 'linear-gradient(135deg, #2a6aad, #1d4f7a)',
                color: '#fff', border: 'none', borderRadius: 8, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif", flex: '1 1 auto', justifyContent: 'center', minWidth: 180,
              }}
            >
              <FileText size={16} /> Download as .DOC
            </button>
          </div>
          <p style={{ fontSize: 11, color: '#666', marginTop: 8, textAlign: 'center' }}>
            Download the template to edit in Word, Google Docs, or any text editor.
          </p>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
