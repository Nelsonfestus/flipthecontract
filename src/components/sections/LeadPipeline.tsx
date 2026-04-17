import { useState, useCallback, useEffect } from 'react'
import {
  Plus, Trash2, Phone, Home, DollarSign,
  MapPin, User, Clock, CheckCircle2, AlertTriangle,
  Target, ArrowRight, Search, Download, BarChart3,
} from 'lucide-react'

/* ── Types ──────────────────────────────────── */
type Stage = 'new' | 'contacted' | 'followup' | 'offer' | 'contract' | 'closing' | 'dead'

interface Lead {
  id: string
  address: string
  city: string
  state: string
  sellerName: string
  phone: string
  email: string
  source: string
  askingPrice: number
  offerPrice: number
  arv: number
  repairs: number
  stage: Stage
  notes: string
  createdAt: string
  updatedAt: string
  followUpDate: string
  priority: 'hot' | 'warm' | 'cold'
}

const STAGES: { id: Stage; label: string; color: string; icon: React.ReactNode }[] = [
  { id: 'new', label: 'New Lead', color: '#5ba3d9', icon: <Target size={14} /> },
  { id: 'contacted', label: 'Contacted', color: '#a855f7', icon: <Phone size={14} /> },
  { id: 'followup', label: 'Follow Up', color: '#eab308', icon: <Clock size={14} /> },
  { id: 'offer', label: 'Offer Made', color: '#ff7e5f', icon: <DollarSign size={14} /> },
  { id: 'contract', label: 'Under Contract', color: '#5cb885', icon: <CheckCircle2 size={14} /> },
  { id: 'closing', label: 'Closing', color: '#22d3ee', icon: <Home size={14} /> },
  { id: 'dead', label: 'Dead / Lost', color: '#666', icon: <AlertTriangle size={14} /> },
]

const SOURCES = [
  'Driving for Dollars', 'Skip Trace', 'Direct Mail', 'Bandit Signs',
  'Cold Call', 'Referral', 'MLS / Zillow', 'Auction', 'Facebook/Social', 'Other'
]

const STORAGE_KEY = 'ftc_seller_leads'

function fmt(n: number) {
  if (!n) return '–'
  return '$' + Math.round(n).toLocaleString('en-US')
}

function genId() {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 7)
}

function emptyLead(): Lead {
  return {
    id: genId(),
    address: '', city: '', state: '', sellerName: '', phone: '', email: '',
    source: '', askingPrice: 0, offerPrice: 0, arv: 0, repairs: 0,
    stage: 'new', notes: '', createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(), followUpDate: '', priority: 'warm',
  }
}

export default function LeadPipeline() {
  const [leads, setLeads] = useState<Lead[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY)
      return stored ? JSON.parse(stored) : []
    } catch { return [] }
  })
  const [editingId, setEditingId] = useState<string | null>(null)
  const [showAddForm, setShowAddForm] = useState(false)
  const [newLead, setNewLead] = useState<Lead>(emptyLead)
  const [filterStage, setFilterStage] = useState<Stage | 'all'>('all')
  const [search, setSearch] = useState('')
  const [viewMode, setViewMode] = useState<'pipeline' | 'list'>('pipeline')

  // Save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(leads))
    } catch { /* storage full */ }
  }, [leads])

  const addLead = useCallback(() => {
    if (!newLead.address.trim()) return
    setLeads(prev => [{ ...newLead, id: genId(), createdAt: new Date().toISOString(), updatedAt: new Date().toISOString() }, ...prev])
    setNewLead(emptyLead())
    setShowAddForm(false)
  }, [newLead])

  const updateLead = useCallback((id: string, updates: Partial<Lead>) => {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, ...updates, updatedAt: new Date().toISOString() } : l))
  }, [])

  const deleteLead = useCallback((id: string) => {
    setLeads(prev => prev.filter(l => l.id !== id))
    if (editingId === id) setEditingId(null)
  }, [editingId])

  const moveStage = useCallback((id: string, newStage: Stage) => {
    updateLead(id, { stage: newStage })
  }, [updateLead])

  // Filter and search
  const filtered = leads.filter(l => {
    if (filterStage !== 'all' && l.stage !== filterStage) return false
    if (search) {
      const q = search.toLowerCase()
      return l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.sellerName.toLowerCase().includes(q) ||
        l.phone.includes(q)
    }
    return true
  })

  // Stats
  const stageCounts = STAGES.map(s => ({
    ...s,
    count: leads.filter(l => l.stage === s.id).length,
    totalValue: leads.filter(l => l.stage === s.id).reduce((sum, l) => sum + (l.offerPrice || 0), 0),
  }))
  const activeLeads = leads.filter(l => l.stage !== 'dead').length
  const totalPipeline = leads.filter(l => ['offer', 'contract', 'closing'].includes(l.stage)).reduce((s, l) => s + (l.offerPrice || 0), 0)
  const potentialFees = leads.filter(l => ['offer', 'contract', 'closing'].includes(l.stage)).reduce((s, l) => s + Math.max(0, (l.arv * 0.7 - l.repairs - l.offerPrice) > 0 ? 10000 : 0), 0)

  function exportLeads() {
    const csv = [
      'Address,City,State,Seller,Phone,Email,Source,Asking,Offer,ARV,Repairs,Stage,Priority,Notes,Follow Up,Created',
      ...leads.map(l =>
        `"${l.address}","${l.city}","${l.state}","${l.sellerName}","${l.phone}","${l.email}","${l.source}",${l.askingPrice},${l.offerPrice},${l.arv},${l.repairs},"${l.stage}","${l.priority}","${l.notes.replace(/"/g, '""')}","${l.followUpDate}","${l.createdAt}"`
      )
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FTC_Lead_Pipeline_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <h2 className="section-header">Seller Lead Pipeline</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Track every lead from first contact to closing. Saved locally on your device — your data stays private.
      </p>

      <div className="info-tip" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Target size={14} color="#5cb885" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>TIP</span>
        </div>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          The money is in the follow-up. Most deals close after 5-7 touches. Use the pipeline to never let a lead fall through the cracks.
        </div>
      </div>

      {/* Stats Bar */}
      <div className="pipeline-stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
        <div className="stat-counter">
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Leads</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb' }}>{leads.length}</div>
        </div>
        <div className="stat-counter">
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Active</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885' }}>{activeLeads}</div>
        </div>
        <div className="stat-counter">
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Pipeline Value</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ff7e5f' }}>{fmt(totalPipeline)}</div>
        </div>
        <div className="stat-counter">
          <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Est. Fees</div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ffb347' }}>{fmt(potentialFees)}</div>
        </div>
      </div>

      {/* Controls */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
        <button onClick={() => setShowAddForm(!showAddForm)} className="btn-orange" style={{ padding: '10px 20px', fontSize: 14 }}>
          <Plus size={14} /> Add Lead
        </button>
        <div style={{ display: 'flex', gap: 4 }}>
          <button
            onClick={() => setViewMode('pipeline')}
            style={{
              padding: '8px 14px', borderRadius: '6px 0 0 6px', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: '1px solid #3d4e65', fontFamily: "'DM Sans', sans-serif",
              background: viewMode === 'pipeline' ? 'rgba(244,126,95,0.15)' : 'transparent',
              color: viewMode === 'pipeline' ? '#ff7e5f' : '#888',
            }}
          >
            <BarChart3 size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} /> Pipeline
          </button>
          <button
            onClick={() => setViewMode('list')}
            style={{
              padding: '8px 14px', borderRadius: '0 6px 6px 0', fontSize: 12, fontWeight: 600, cursor: 'pointer',
              border: '1px solid #3d4e65', borderLeft: 'none', fontFamily: "'DM Sans', sans-serif",
              background: viewMode === 'list' ? 'rgba(244,126,95,0.15)' : 'transparent',
              color: viewMode === 'list' ? '#ff7e5f' : '#888',
            }}
          >
            List
          </button>
        </div>
        {leads.length > 0 && (
          <button onClick={exportLeads} className="btn-ghost" style={{ padding: '8px 16px', fontSize: 12 }}>
            <Download size={12} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} /> Export CSV
          </button>
        )}
        <div style={{ flex: 1, minWidth: 180 }}>
          <div style={{ position: 'relative' }}>
            <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
            <input
              className="input-dark"
              placeholder="Search leads..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{ paddingLeft: 30, padding: '8px 12px 8px 30px', fontSize: 13 }}
            />
          </div>
        </div>
      </div>

      {/* Stage filters */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => setFilterStage('all')}
          style={{
            padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
            border: filterStage === 'all' ? '1px solid #ff7e5f' : '1px solid #3d4e65',
            background: filterStage === 'all' ? 'rgba(244,126,95,0.15)' : 'transparent',
            color: filterStage === 'all' ? '#ff7e5f' : '#888',
            fontFamily: "'DM Sans', sans-serif",
          }}
        >
          All ({leads.length})
        </button>
        {stageCounts.map(s => (
          <button
            key={s.id}
            onClick={() => setFilterStage(s.id)}
            style={{
              padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${filterStage === s.id ? s.color : '#3d4e65'}`,
              background: filterStage === s.id ? `${s.color}20` : 'transparent',
              color: filterStage === s.id ? s.color : '#888',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            {s.icon} {s.label} ({s.count})
          </button>
        ))}
      </div>

      {/* Add Lead Form */}
      {showAddForm && (
        <div style={{
          background: '#263040', border: '1px solid #ff7e5f40', borderRadius: 10,
          padding: 24, marginBottom: 24, animation: 'fadeInUp 0.3s ease',
        }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
            <Plus size={18} style={{ display: 'inline', verticalAlign: '-3px', marginRight: 6 }} />
            Add New Lead
          </h3>
          <div className="lead-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 16 }}>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Property Address *</label>
              <input className="input-dark" placeholder="123 Main St" value={newLead.address} onChange={e => setNewLead(p => ({ ...p, address: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>City</label>
              <input className="input-dark" placeholder="Atlanta" value={newLead.city} onChange={e => setNewLead(p => ({ ...p, city: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>State</label>
              <input className="input-dark" placeholder="GA" value={newLead.state} onChange={e => setNewLead(p => ({ ...p, state: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Seller Name</label>
              <input className="input-dark" placeholder="John Smith" value={newLead.sellerName} onChange={e => setNewLead(p => ({ ...p, sellerName: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Phone</label>
              <input className="input-dark" placeholder="(555) 123-4567" value={newLead.phone} onChange={e => setNewLead(p => ({ ...p, phone: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Email</label>
              <input className="input-dark" placeholder="seller@email.com" value={newLead.email} onChange={e => setNewLead(p => ({ ...p, email: e.target.value }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Lead Source</label>
              <select
                className="input-dark"
                value={newLead.source}
                onChange={e => setNewLead(p => ({ ...p, source: e.target.value }))}
                style={{ cursor: 'pointer' }}
              >
                <option value="">Select source...</option>
                {SOURCES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Priority</label>
              <div style={{ display: 'flex', gap: 4 }}>
                {(['hot', 'warm', 'cold'] as const).map(p => (
                  <button
                    key={p}
                    onClick={() => setNewLead(prev => ({ ...prev, priority: p }))}
                    style={{
                      flex: 1, padding: '8px 0', borderRadius: 6, fontSize: 12, fontWeight: 600, cursor: 'pointer',
                      border: `1px solid ${newLead.priority === p ? (p === 'hot' ? '#ef4444' : p === 'warm' ? '#eab308' : '#5ba3d9') : '#3d4e65'}`,
                      background: newLead.priority === p ? `${p === 'hot' ? '#ef4444' : p === 'warm' ? '#eab308' : '#5ba3d9'}20` : 'transparent',
                      color: newLead.priority === p ? (p === 'hot' ? '#ef4444' : p === 'warm' ? '#eab308' : '#5ba3d9') : '#888',
                      fontFamily: "'DM Sans', sans-serif", textTransform: 'capitalize',
                    }}
                  >
                    {p}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Asking Price</label>
              <input className="input-dark" type="number" placeholder="150000" value={newLead.askingPrice || ''} onChange={e => setNewLead(p => ({ ...p, askingPrice: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Your Offer</label>
              <input className="input-dark" type="number" placeholder="100000" value={newLead.offerPrice || ''} onChange={e => setNewLead(p => ({ ...p, offerPrice: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>ARV</label>
              <input className="input-dark" type="number" placeholder="200000" value={newLead.arv || ''} onChange={e => setNewLead(p => ({ ...p, arv: parseFloat(e.target.value) || 0 }))} />
            </div>
            <div>
              <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Repairs</label>
              <input className="input-dark" type="number" placeholder="30000" value={newLead.repairs || ''} onChange={e => setNewLead(p => ({ ...p, repairs: parseFloat(e.target.value) || 0 }))} />
            </div>
          </div>
          <div style={{ marginBottom: 16 }}>
            <label style={{ fontSize: 11, color: '#888', marginBottom: 4, display: 'block' }}>Notes</label>
            <textarea
              className="input-dark"
              rows={2}
              placeholder="Seller motivation, property condition, timeline..."
              value={newLead.notes}
              onChange={e => setNewLead(p => ({ ...p, notes: e.target.value }))}
              style={{ resize: 'vertical' }}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button onClick={addLead} className="btn-orange" style={{ padding: '10px 24px', fontSize: 14 }}>
              <Plus size={14} /> Add Lead
            </button>
            <button onClick={() => setShowAddForm(false)} className="btn-ghost" style={{ padding: '10px 20px', fontSize: 13 }}>
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Pipeline View */}
      {viewMode === 'pipeline' && (
        <div className="pipeline-scroll" style={{ overflowX: 'auto', paddingBottom: 8 }}>
          <div style={{ display: 'flex', gap: 10, minWidth: 'max-content' }}>
            {STAGES.filter(s => s.id !== 'dead').map(stage => {
              const stageLeads = filtered.filter(l => l.stage === stage.id)
              return (
                <div key={stage.id} style={{
                  width: 260, flexShrink: 0,
                  background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
                  display: 'flex', flexDirection: 'column',
                }}>
                  {/* Stage header */}
                  <div style={{
                    padding: '12px 14px', borderBottom: `2px solid ${stage.color}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span style={{ color: stage.color }}>{stage.icon}</span>
                      <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: stage.color, letterSpacing: '0.04em' }}>
                        {stage.label}
                      </span>
                    </div>
                    <span style={{
                      background: `${stage.color}20`, color: stage.color,
                      fontSize: 11, fontWeight: 700, padding: '2px 8px', borderRadius: 4,
                    }}>
                      {stageLeads.length}
                    </span>
                  </div>
                  {/* Cards */}
                  <div style={{ padding: 8, flex: 1, overflowY: 'auto', maxHeight: 500, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {stageLeads.map(lead => (
                      <LeadCard key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} onMove={moveStage} isEditing={editingId === lead.id} onToggleEdit={setEditingId} />
                    ))}
                    {stageLeads.length === 0 && (
                      <div style={{ textAlign: 'center', padding: '20px 10px', color: '#444', fontSize: 12 }}>
                        No leads in this stage
                      </div>
                    )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}

      {/* List View */}
      {viewMode === 'list' && (
        <div>
          {filtered.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 20px', color: '#555', fontSize: 14 }}>
              {leads.length === 0 ? 'No leads yet. Add your first lead above!' : 'No leads match your filters.'}
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {filtered.map(lead => (
                <LeadCard key={lead.id} lead={lead} onUpdate={updateLead} onDelete={deleteLead} onMove={moveStage} isEditing={editingId === lead.id} onToggleEdit={setEditingId} expanded />
              ))}
            </div>
          )}
        </div>
      )}

      {leads.length === 0 && !showAddForm && (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
        }}>
          <Target size={36} color="#333" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: '#666', margin: '0 0 16px' }}>
            Start tracking your wholesale deals!
          </p>
          <button onClick={() => setShowAddForm(true)} className="btn-orange" style={{ padding: '12px 24px', fontSize: 15 }}>
            <Plus size={14} /> Add Your First Lead
          </button>
        </div>
      )}
    </div>
  )
}

/* ── Lead Card Component ──────────────────── */
function LeadCard({
  lead, onDelete, onMove, expanded,
}: {
  lead: Lead
  onUpdate: (id: string, updates: Partial<Lead>) => void
  onDelete: (id: string) => void
  onMove: (id: string, stage: Stage) => void
  isEditing: boolean
  onToggleEdit: (id: string | null) => void
  expanded?: boolean
}) {
  const stage = STAGES.find(s => s.id === lead.stage)!
  const stageIdx = STAGES.findIndex(s => s.id === lead.stage)
  const nextStage = stageIdx < STAGES.length - 2 ? STAGES[stageIdx + 1] : null
  const priorityColors = { hot: '#ef4444', warm: '#eab308', cold: '#5ba3d9' }

  return (
    <div style={{
      background: expanded ? '#263040' : '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8,
      padding: expanded ? 16 : 10, transition: 'all 0.2s',
      borderLeft: `3px solid ${priorityColors[lead.priority]}`,
    }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600, lineHeight: 1.3 }}>
            {lead.address || 'No address'}
          </div>
          {(lead.city || lead.state) && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              <MapPin size={10} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 2 }} />
              {[lead.city, lead.state].filter(Boolean).join(', ')}
            </div>
          )}
          {expanded && lead.sellerName && (
            <div style={{ fontSize: 11, color: '#888', marginTop: 2 }}>
              <User size={10} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 2 }} />
              {lead.sellerName} {lead.phone && `· ${lead.phone}`}
            </div>
          )}
        </div>
        <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
          {expanded && (
            <span style={{
              fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
              background: `${stage.color}20`, color: stage.color,
            }}>
              {stage.label}
            </span>
          )}
          <span style={{
            fontSize: 10, fontWeight: 600, padding: '2px 6px', borderRadius: 4,
            background: `${priorityColors[lead.priority]}20`, color: priorityColors[lead.priority],
            textTransform: 'uppercase',
          }}>
            {lead.priority}
          </span>
        </div>
      </div>

      {/* Quick numbers */}
      {(lead.offerPrice > 0 || lead.arv > 0) && (
        <div style={{ display: 'flex', gap: 10, marginTop: 6, flexWrap: 'wrap' }}>
          {lead.offerPrice > 0 && (
            <span style={{ fontSize: 11, color: '#ff7e5f' }}>Offer: {fmt(lead.offerPrice)}</span>
          )}
          {lead.arv > 0 && (
            <span style={{ fontSize: 11, color: '#5cb885' }}>ARV: {fmt(lead.arv)}</span>
          )}
          {lead.askingPrice > 0 && (
            <span style={{ fontSize: 11, color: '#888' }}>Ask: {fmt(lead.askingPrice)}</span>
          )}
        </div>
      )}

      {lead.notes && expanded && (
        <div style={{ fontSize: 11, color: '#888', marginTop: 6, lineHeight: 1.5, fontStyle: 'italic' }}>
          {lead.notes}
        </div>
      )}

      {/* Actions */}
      <div style={{ display: 'flex', gap: 4, marginTop: 8, flexWrap: 'wrap' }}>
        {nextStage && (
          <button
            onClick={() => onMove(lead.id, nextStage.id)}
            style={{
              padding: '4px 10px', borderRadius: 4, fontSize: 10, fontWeight: 600, cursor: 'pointer',
              border: `1px solid ${nextStage.color}40`, background: `${nextStage.color}15`, color: nextStage.color,
              display: 'flex', alignItems: 'center', gap: 3, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <ArrowRight size={10} /> {nextStage.label}
          </button>
        )}
        {lead.stage !== 'dead' && (
          <button
            onClick={() => onMove(lead.id, 'dead')}
            style={{
              padding: '4px 8px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
              border: '1px solid #44444440', background: 'transparent', color: '#666',
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            Dead
          </button>
        )}
        <button
          onClick={() => onDelete(lead.id)}
          style={{
            padding: '4px 8px', borderRadius: 4, fontSize: 10, cursor: 'pointer',
            border: '1px solid #ef444440', background: 'transparent', color: '#ef4444',
            marginLeft: 'auto', fontFamily: "'DM Sans', sans-serif",
          }}
        >
          <Trash2 size={10} />
        </button>
      </div>
    </div>
  )
}
