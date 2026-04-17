import { useState, useEffect, useMemo, useCallback } from 'react'
import {
  Plus, Edit3, Trash2, ChevronRight, ChevronLeft, Filter,
  Home, FileText, Search, ClipboardCheck,
  ShieldCheck, CalendarCheck, CheckCircle2, X, Save,
  TrendingUp, Briefcase, Clock, Award,
} from 'lucide-react'

/* ── Types ──────────────────────────────────── */

type DealStage = 'lead' | 'under_contract' | 'title_escrow' | 'inspection' | 'closing' | 'completed'
type ContractType = 'Assignment' | 'Double Close' | 'Novation'

interface Deal {
  id: string
  propertyAddress: string
  city: string
  state: string
  sellerName: string
  buyerName: string
  contractType: ContractType
  stage: DealStage
  purchasePrice: number
  assignmentFeeOrSalePrice: number
  earnestMoney: number
  contractDate: string
  inspectionDeadline: string
  closingDate: string
  notes: string
  createdAt: string
  updatedAt: string
}

/* ── Constants ──────────────────────────────── */

const STAGES: { id: DealStage; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'lead', label: 'Lead', color: '#5ba3d9', icon: <Search size={14} /> },
  { id: 'under_contract', label: 'Under Contract', color: '#a855f7', icon: <FileText size={14} /> },
  { id: 'title_escrow', label: 'Title & Escrow', color: '#eab308', icon: <ShieldCheck size={14} /> },
  { id: 'inspection', label: 'Inspection', color: '#ff7e5f', icon: <ClipboardCheck size={14} /> },
  { id: 'closing', label: 'Closing', color: '#22d3ee', icon: <CalendarCheck size={14} /> },
  { id: 'completed', label: 'Completed', color: '#5cb885', icon: <CheckCircle2 size={14} /> },
]

const STAGE_ORDER: DealStage[] = STAGES.map(s => s.id)

const STORAGE_KEY = 'ftc_deal_tracker'

const CONTRACT_TYPES: ContractType[] = ['Assignment', 'Double Close', 'Novation']

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA',
  'KS','KY','LA','ME','MD','MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ',
  'NM','NY','NC','ND','OH','OK','OR','PA','RI','SC','SD','TN','TX','UT','VT',
  'VA','WA','WV','WI','WY','DC',
]

/* ── Helpers ─────────────────────────────────── */

function fmt(n: number) {
  if (!n) return '$0'
  return '$' + n.toLocaleString('en-US')
}

function calcProfit(deal: Deal): number {
  if (deal.contractType === 'Assignment') {
    return deal.assignmentFeeOrSalePrice
  }
  return deal.assignmentFeeOrSalePrice - deal.purchasePrice
}

function stageIndex(stage: DealStage): number {
  return STAGE_ORDER.indexOf(stage)
}

function stageInfo(stage: DealStage) {
  return STAGES.find(s => s.id === stage)!
}

function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function emptyDeal(): Omit<Deal, 'id' | 'createdAt' | 'updatedAt'> {
  return {
    propertyAddress: '',
    city: '',
    state: '',
    sellerName: '',
    buyerName: '',
    contractType: 'Assignment',
    stage: 'lead',
    purchasePrice: 0,
    assignmentFeeOrSalePrice: 0,
    earnestMoney: 0,
    contractDate: '',
    inspectionDeadline: '',
    closingDate: '',
    notes: '',
  }
}

/* ── Styles ──────────────────────────────────── */

const colors = {
  bg: '#1e2530',
  bgCard: '#232d3b',
  bgInput: '#1a2230',
  border: '#2e3a4d',
  borderFocus: '#ff7e5f',
  textPrimary: '#f5f0eb',
  textSecondary: '#a09890',
  textMuted: '#6b6560',
  accent: '#ff7e5f',
  gold: '#ffb347',
}

const fonts = {
  heading: "'Bebas Neue', sans-serif",
  body: "'DM Sans', sans-serif",
}

/* ── Component ───────────────────────────────── */

export default function DealTracker() {
  const [deals, setDeals] = useState<Deal[]>([])
  const [filterStage, setFilterStage] = useState<DealStage | 'all'>('all')
  const [showForm, setShowForm] = useState(false)
  const [editingId, setEditingId] = useState<string | null>(null)
  const [form, setForm] = useState(emptyDeal())

  /* ── Persistence ── */
  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY)
      if (raw) setDeals(JSON.parse(raw))
    } catch { /* ignore */ }
  }, [])

  const persist = useCallback((next: Deal[]) => {
    setDeals(next)
    try { localStorage.setItem(STORAGE_KEY, JSON.stringify(next)) } catch { /* ignore */ }
  }, [])

  /* ── Stats ── */
  const stats = useMemo(() => {
    const now = new Date()
    const thisMonth = now.getMonth()
    const thisYear = now.getFullYear()
    const active = deals.filter(d => d.stage !== 'completed').length
    const underContract = deals.filter(d => d.stage === 'under_contract').length
    const closedThisMonth = deals.filter(d => {
      if (d.stage !== 'completed') return false
      const updated = new Date(d.updatedAt)
      return updated.getMonth() === thisMonth && updated.getFullYear() === thisYear
    }).length
    const totalProfit = deals.filter(d => d.stage === 'completed').reduce((sum, d) => sum + calcProfit(d), 0)
    return { active, underContract, closedThisMonth, totalProfit }
  }, [deals])

  /* ── Filtered deals ── */
  const filteredDeals = useMemo(() => {
    if (filterStage === 'all') return deals
    return deals.filter(d => d.stage === filterStage)
  }, [deals, filterStage])

  /* ── Handlers ── */
  const openAdd = () => {
    setEditingId(null)
    setForm(emptyDeal())
    setShowForm(true)
  }

  const openEdit = (deal: Deal) => {
    setEditingId(deal.id)
    setForm({
      propertyAddress: deal.propertyAddress,
      city: deal.city,
      state: deal.state,
      sellerName: deal.sellerName,
      buyerName: deal.buyerName,
      contractType: deal.contractType,
      stage: deal.stage,
      purchasePrice: deal.purchasePrice,
      assignmentFeeOrSalePrice: deal.assignmentFeeOrSalePrice,
      earnestMoney: deal.earnestMoney,
      contractDate: deal.contractDate,
      inspectionDeadline: deal.inspectionDeadline,
      closingDate: deal.closingDate,
      notes: deal.notes,
    })
    setShowForm(true)
  }

  const saveDeal = () => {
    if (!form.propertyAddress.trim()) return
    const now = new Date().toISOString()
    if (editingId) {
      persist(deals.map(d => d.id === editingId ? { ...d, ...form, updatedAt: now } : d))
    } else {
      const newDeal: Deal = { ...form, id: genId(), createdAt: now, updatedAt: now }
      persist([newDeal, ...deals])
    }
    setShowForm(false)
    setEditingId(null)
    setForm(emptyDeal())
  }

  const deleteDeal = (id: string) => {
    persist(deals.filter(d => d.id !== id))
  }

  const moveStage = (id: string, direction: 1 | -1) => {
    const now = new Date().toISOString()
    persist(deals.map(d => {
      if (d.id !== id) return d
      const idx = stageIndex(d.stage) + direction
      if (idx < 0 || idx >= STAGE_ORDER.length) return d
      return { ...d, stage: STAGE_ORDER[idx], updatedAt: now }
    }))
  }

  const updateField = (key: string, value: string | number) => {
    setForm(prev => ({ ...prev, [key]: value }))
  }

  /* ── Render ── */
  return (
    <div style={{ background: colors.bg, minHeight: '100vh', fontFamily: fonts.body, color: colors.textPrimary, padding: '24px 16px' }}>
      {/* Title */}
      <div style={{ maxWidth: 1200, margin: '0 auto' }}>
        <h1 style={{ fontFamily: fonts.heading, fontSize: 36, letterSpacing: 1.5, margin: '0 0 4px', color: colors.textPrimary }}>
          Deal Tracker
        </h1>
        <p style={{ color: colors.textSecondary, fontSize: 14, margin: '0 0 24px' }}>
          Track every deal from contract to closing
        </p>

        {/* ── Quick Stats ── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 24 }}>
          {[
            { label: 'Active Deals', value: stats.active, icon: <Briefcase size={18} />, color: '#5ba3d9' },
            { label: 'Under Contract', value: stats.underContract, icon: <FileText size={18} />, color: '#a855f7' },
            { label: 'Closed This Month', value: stats.closedThisMonth, icon: <Clock size={18} />, color: '#22d3ee' },
            { label: 'Total Profit', value: fmt(stats.totalProfit), icon: <Award size={18} />, color: colors.gold },
          ].map((s, i) => (
            <div key={i} style={{
              background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12,
              padding: '16px 18px', display: 'flex', flexDirection: 'column', gap: 6,
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: s.color }}>
                {s.icon}
                <span style={{ fontSize: 12, color: colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.8 }}>{s.label}</span>
              </div>
              <span style={{ fontFamily: fonts.heading, fontSize: 28, letterSpacing: 1, color: colors.textPrimary }}>{s.value}</span>
            </div>
          ))}
        </div>

        {/* ── Pipeline overview ── */}
        <div style={{
          background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12,
          padding: 16, marginBottom: 24, overflowX: 'auto',
        }}>
          <div style={{ display: 'flex', gap: 4, minWidth: 500 }}>
            {STAGES.map(s => {
              const count = deals.filter(d => d.stage === s.id).length
              return (
                <div key={s.id} style={{ flex: 1, textAlign: 'center' }}>
                  <div style={{
                    height: 6, borderRadius: 3, marginBottom: 8,
                    background: count > 0
                      ? `linear-gradient(90deg, ${s.color}, ${s.color}cc)`
                      : '#2e3a4d',
                  }} />
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 4, color: s.color, fontSize: 12 }}>
                    {s.icon}
                    <span style={{ fontWeight: 600 }}>{s.label}</span>
                  </div>
                  <div style={{ fontFamily: fonts.heading, fontSize: 22, color: colors.textPrimary, marginTop: 2 }}>{count}</div>
                </div>
              )
            })}
          </div>
        </div>

        {/* ── Toolbar ── */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center', marginBottom: 20 }}>
          <button onClick={openAdd} style={{
            background: `linear-gradient(135deg, ${colors.accent}, #e06a4f)`,
            color: '#fff', border: 'none', borderRadius: 8, padding: '10px 20px',
            fontFamily: fonts.body, fontWeight: 600, fontSize: 14, cursor: 'pointer',
            display: 'flex', alignItems: 'center', gap: 6,
          }}>
            <Plus size={16} /> Add Deal
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 'auto' }}>
            <Filter size={14} style={{ color: colors.textSecondary }} />
            <select
              value={filterStage}
              onChange={e => setFilterStage(e.target.value as DealStage | 'all')}
              style={{
                background: colors.bgInput, color: colors.textPrimary, border: `1px solid ${colors.border}`,
                borderRadius: 8, padding: '8px 12px', fontFamily: fonts.body, fontSize: 13,
                cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="all">All Stages</option>
              {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        {/* ── Deal Cards ── */}
        {filteredDeals.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px', color: colors.textMuted,
            border: `1px dashed ${colors.border}`, borderRadius: 12,
          }}>
            <Home size={40} style={{ marginBottom: 12, opacity: 0.4 }} />
            <p style={{ fontSize: 16, margin: 0 }}>No deals yet. Add your first deal to get started.</p>
          </div>
        )}

        <div style={{ display: 'grid', gap: 14 }}>
          {filteredDeals.map(deal => {
            const info = stageInfo(deal.stage)
            const idx = stageIndex(deal.stage)
            const progress = ((idx + 1) / STAGE_ORDER.length) * 100
            const profit = calcProfit(deal)

            return (
              <div key={deal.id} style={{
                background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 12,
                padding: 20, transition: 'border-color 0.2s, box-shadow 0.2s',
                cursor: 'default',
              }}
                onMouseEnter={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = info.color + '88'
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = `0 2px 20px ${info.color}15`
                }}
                onMouseLeave={e => {
                  (e.currentTarget as HTMLDivElement).style.borderColor = colors.border
                  ;(e.currentTarget as HTMLDivElement).style.boxShadow = 'none'
                }}
              >
                {/* Card header */}
                <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                  <div>
                    <h3 style={{ fontFamily: fonts.heading, fontSize: 22, margin: '0 0 2px', letterSpacing: 0.8, color: colors.textPrimary }}>
                      {deal.propertyAddress}
                    </h3>
                    <span style={{ fontSize: 13, color: colors.textSecondary }}>
                      {deal.city}{deal.state ? `, ${deal.state}` : ''}
                    </span>
                  </div>
                  <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
                    <span style={{
                      background: info.color + '22', color: info.color, fontSize: 11, fontWeight: 700,
                      padding: '4px 10px', borderRadius: 20, display: 'flex', alignItems: 'center', gap: 4,
                      textTransform: 'uppercase', letterSpacing: 0.6,
                    }}>
                      {info.icon} {info.label}
                    </span>
                    <span style={{
                      background: colors.accent + '18', color: colors.accent, fontSize: 11, fontWeight: 600,
                      padding: '4px 10px', borderRadius: 20,
                    }}>
                      {deal.contractType}
                    </span>
                  </div>
                </div>

                {/* Progress bar */}
                <div style={{ background: '#2e3a4d', height: 4, borderRadius: 2, marginBottom: 14 }}>
                  <div style={{
                    height: 4, borderRadius: 2, width: `${progress}%`,
                    background: `linear-gradient(90deg, ${info.color}, ${info.color}aa)`,
                    transition: 'width 0.3s ease',
                  }} />
                </div>

                {/* Details row */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 10, fontSize: 13, marginBottom: 14 }}>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>Seller</span>
                    <div style={{ color: colors.textSecondary, marginTop: 2 }}>{deal.sellerName || '—'}</div>
                  </div>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>Buyer</span>
                    <div style={{ color: colors.textSecondary, marginTop: 2 }}>{deal.buyerName || '—'}</div>
                  </div>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>Purchase Price</span>
                    <div style={{ color: colors.textSecondary, marginTop: 2 }}>{fmt(deal.purchasePrice)}</div>
                  </div>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>
                      {deal.contractType === 'Assignment' ? 'Assignment Fee' : 'Sale Price'}
                    </span>
                    <div style={{ color: colors.textSecondary, marginTop: 2 }}>{fmt(deal.assignmentFeeOrSalePrice)}</div>
                  </div>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>Earnest Money</span>
                    <div style={{ color: colors.textSecondary, marginTop: 2 }}>{fmt(deal.earnestMoney)}</div>
                  </div>
                  <div>
                    <span style={{ color: colors.textMuted, fontSize: 11, textTransform: 'uppercase', letterSpacing: 0.6 }}>Est. Profit</span>
                    <div style={{ color: profit > 0 ? colors.gold : colors.textMuted, fontWeight: 700, marginTop: 2 }}>
                      <TrendingUp size={12} style={{ marginRight: 4, verticalAlign: -1 }} />
                      {fmt(profit)}
                    </div>
                  </div>
                </div>

                {/* Dates */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 16, fontSize: 12, color: colors.textMuted, marginBottom: 14 }}>
                  {deal.contractDate && <span>Contract: {deal.contractDate}</span>}
                  {deal.inspectionDeadline && <span>Inspection: {deal.inspectionDeadline}</span>}
                  {deal.closingDate && <span>Closing: {deal.closingDate}</span>}
                </div>

                {/* Notes */}
                {deal.notes && (
                  <p style={{ fontSize: 13, color: colors.textMuted, margin: '0 0 14px', fontStyle: 'italic', lineHeight: 1.5 }}>
                    {deal.notes}
                  </p>
                )}

                {/* Actions */}
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, alignItems: 'center' }}>
                  <button
                    disabled={idx === 0}
                    onClick={() => moveStage(deal.id, -1)}
                    style={{
                      background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 8,
                      color: idx === 0 ? colors.textMuted : colors.textSecondary, padding: '6px 12px',
                      fontSize: 12, cursor: idx === 0 ? 'not-allowed' : 'pointer', display: 'flex', alignItems: 'center', gap: 4,
                      fontFamily: fonts.body, opacity: idx === 0 ? 0.4 : 1,
                    }}
                  >
                    <ChevronLeft size={14} /> Back
                  </button>
                  <button
                    disabled={idx === STAGE_ORDER.length - 1}
                    onClick={() => moveStage(deal.id, 1)}
                    style={{
                      background: idx === STAGE_ORDER.length - 1 ? 'transparent' : `linear-gradient(135deg, ${info.color}cc, ${info.color})`,
                      border: idx === STAGE_ORDER.length - 1 ? `1px solid ${colors.border}` : 'none', borderRadius: 8,
                      color: idx === STAGE_ORDER.length - 1 ? colors.textMuted : '#fff', padding: '6px 14px',
                      fontSize: 12, cursor: idx === STAGE_ORDER.length - 1 ? 'not-allowed' : 'pointer',
                      display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600, fontFamily: fonts.body,
                      opacity: idx === STAGE_ORDER.length - 1 ? 0.4 : 1,
                    }}
                  >
                    {idx < STAGE_ORDER.length - 2 ? `Move to ${STAGES[idx + 1].label}` : idx === STAGE_ORDER.length - 2 ? 'Mark Completed' : 'Completed'}
                    <ChevronRight size={14} />
                  </button>

                  <div style={{ marginLeft: 'auto', display: 'flex', gap: 6 }}>
                    <button onClick={() => openEdit(deal)} style={{
                      background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 8,
                      color: colors.textSecondary, padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}>
                      <Edit3 size={14} />
                    </button>
                    <button onClick={() => deleteDeal(deal.id)} style={{
                      background: 'transparent', border: `1px solid ${colors.border}`, borderRadius: 8,
                      color: '#e05555', padding: '6px 10px', cursor: 'pointer', display: 'flex', alignItems: 'center',
                    }}>
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </div>

      {/* ── Add / Edit Modal ── */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.65)', zIndex: 1000,
          display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16,
        }}
          onClick={e => { if (e.target === e.currentTarget) setShowForm(false) }}
        >
          <div style={{
            background: colors.bgCard, border: `1px solid ${colors.border}`, borderRadius: 16,
            width: '100%', maxWidth: 640, maxHeight: '90vh', overflowY: 'auto', padding: 28,
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
              <h2 style={{ fontFamily: fonts.heading, fontSize: 26, margin: 0, letterSpacing: 1, color: colors.textPrimary }}>
                {editingId ? 'Edit Deal' : 'Add New Deal'}
              </h2>
              <button onClick={() => setShowForm(false)} style={{
                background: 'transparent', border: 'none', color: colors.textMuted, cursor: 'pointer', padding: 4,
              }}>
                <X size={20} />
              </button>
            </div>

            {/* Form fields */}
            <div style={{ display: 'grid', gap: 14 }}>
              {/* Property address */}
              <FieldGroup label="Property Address">
                <Input value={form.propertyAddress} onChange={v => updateField('propertyAddress', v)} placeholder="123 Main St" />
              </FieldGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 100px', gap: 12 }}>
                <FieldGroup label="City">
                  <Input value={form.city} onChange={v => updateField('city', v)} placeholder="Houston" />
                </FieldGroup>
                <FieldGroup label="State">
                  <select
                    value={form.state}
                    onChange={e => updateField('state', e.target.value)}
                    style={selectStyle}
                  >
                    <option value="">--</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </FieldGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <FieldGroup label="Seller Name">
                  <Input value={form.sellerName} onChange={v => updateField('sellerName', v)} placeholder="John Doe" />
                </FieldGroup>
                <FieldGroup label="Buyer Name">
                  <Input value={form.buyerName} onChange={v => updateField('buyerName', v)} placeholder="Jane Smith" />
                </FieldGroup>
              </div>

              <FieldGroup label="Contract Type">
                <select
                  value={form.contractType}
                  onChange={e => updateField('contractType', e.target.value)}
                  style={selectStyle}
                >
                  {CONTRACT_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </FieldGroup>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FieldGroup label="Purchase Price">
                  <Input type="number" value={form.purchasePrice || ''} onChange={v => updateField('purchasePrice', Number(v))} placeholder="0" />
                </FieldGroup>
                <FieldGroup label={form.contractType === 'Assignment' ? 'Assignment Fee' : 'Sale Price'}>
                  <Input type="number" value={form.assignmentFeeOrSalePrice || ''} onChange={v => updateField('assignmentFeeOrSalePrice', Number(v))} placeholder="0" />
                </FieldGroup>
                <FieldGroup label="Earnest Money">
                  <Input type="number" value={form.earnestMoney || ''} onChange={v => updateField('earnestMoney', Number(v))} placeholder="0" />
                </FieldGroup>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 12 }}>
                <FieldGroup label="Contract Date">
                  <Input type="date" value={form.contractDate} onChange={v => updateField('contractDate', v)} />
                </FieldGroup>
                <FieldGroup label="Inspection Deadline">
                  <Input type="date" value={form.inspectionDeadline} onChange={v => updateField('inspectionDeadline', v)} />
                </FieldGroup>
                <FieldGroup label="Closing Date">
                  <Input type="date" value={form.closingDate} onChange={v => updateField('closingDate', v)} />
                </FieldGroup>
              </div>

              {editingId && (
                <FieldGroup label="Stage">
                  <select
                    value={form.stage}
                    onChange={e => updateField('stage', e.target.value)}
                    style={selectStyle}
                  >
                    {STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                  </select>
                </FieldGroup>
              )}

              <FieldGroup label="Notes">
                <textarea
                  value={form.notes}
                  onChange={e => updateField('notes', e.target.value)}
                  placeholder="Additional notes about this deal..."
                  rows={3}
                  style={{
                    ...inputBase,
                    resize: 'vertical' as const,
                    minHeight: 72,
                  }}
                />
              </FieldGroup>
            </div>

            {/* Save */}
            <button onClick={saveDeal} style={{
              width: '100%', marginTop: 20,
              background: `linear-gradient(135deg, ${colors.accent}, #e06a4f)`,
              color: '#fff', border: 'none', borderRadius: 10, padding: '12px 0',
              fontFamily: fonts.body, fontWeight: 700, fontSize: 15, cursor: 'pointer',
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
            }}>
              <Save size={16} />
              {editingId ? 'Update Deal' : 'Save Deal'}
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Shared sub-components ─────────────────── */

const inputBase: React.CSSProperties = {
  width: '100%',
  background: colors.bgInput,
  color: colors.textPrimary,
  border: `1px solid ${colors.border}`,
  borderRadius: 8,
  padding: '9px 12px',
  fontFamily: fonts.body,
  fontSize: 13,
  outline: 'none',
  boxSizing: 'border-box',
}

const selectStyle: React.CSSProperties = {
  ...inputBase,
  cursor: 'pointer',
}

function FieldGroup({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label style={{
        display: 'block', fontSize: 11, color: colors.textMuted,
        textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: 5, fontWeight: 600,
      }}>
        {label}
      </label>
      {children}
    </div>
  )
}

function Input({ value, onChange, placeholder, type = 'text' }: {
  value: string | number
  onChange: (v: string) => void
  placeholder?: string
  type?: string
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={e => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputBase}
      onFocus={e => { e.currentTarget.style.borderColor = colors.borderFocus }}
      onBlur={e => { e.currentTarget.style.borderColor = colors.border }}
    />
  )
}
