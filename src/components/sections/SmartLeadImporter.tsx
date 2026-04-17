import { useState, useCallback, useEffect } from 'react'
import {
  Upload, CheckCircle2, Phone, Search as SearchIcon, AlertTriangle,
  FileText, Loader2, Download, Trash2, Eye, X, MapPin, User, Play,
} from 'lucide-react'

interface ImportedLead {
  id: string
  name: string
  address: string
  city: string
  state: string
  zip: string
  phone: string
  category: 'Ready to Call' | 'Needs Skip Trace'
  importedAt: string
}

interface ImportResult {
  total: number
  readyToCall: number
  needsSkipTrace: number
}

export default function SmartLeadImporter() {
  const [leads, setLeads] = useState<ImportedLead[]>([])
  const [loading, setLoading] = useState(false)
  const [importing, setImporting] = useState(false)
  const [result, setResult] = useState<ImportResult | null>(null)
  const [error, setError] = useState('')
  const [fileName, setFileName] = useState('')
  const [search, setSearch] = useState('')
  const [filterCategory, setFilterCategory] = useState<'all' | 'Ready to Call' | 'Needs Skip Trace'>('all')
  const [dragOver, setDragOver] = useState(false)
  const [isExample, setIsExample] = useState(false)

  const SAMPLE_LEADS: ImportedLead[] = [
    { id: 'ex-1', name: 'John Martinez', address: '742 Oak Street', city: 'Houston', state: 'TX', zip: '77002', phone: '713-555-0142', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-2', name: 'Sarah Johnson', address: '1204 Elm Avenue', city: 'Dallas', state: 'TX', zip: '75201', phone: '214-555-0198', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-3', name: 'Robert Williams', address: '389 Pine Road', city: 'Austin', state: 'TX', zip: '78701', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
    { id: 'ex-4', name: 'Maria Garcia', address: '5567 Maple Drive', city: 'San Antonio', state: 'TX', zip: '78205', phone: '210-555-0167', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-5', name: 'James Brown', address: '2100 Cedar Lane', city: 'Fort Worth', state: 'TX', zip: '76102', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
    { id: 'ex-6', name: 'Linda Davis', address: '901 Birch Court', city: 'El Paso', state: 'TX', zip: '79901', phone: '915-555-0134', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-7', name: 'Michael Wilson', address: '4455 Spruce Way', city: 'Arlington', state: 'TX', zip: '76010', phone: '817-555-0156', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-8', name: 'Patricia Moore', address: '678 Walnut Street', city: 'Plano', state: 'TX', zip: '75074', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
    { id: 'ex-9', name: 'David Taylor', address: '1332 Ash Boulevard', city: 'Laredo', state: 'TX', zip: '78040', phone: '956-555-0189', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-10', name: 'Jennifer Anderson', address: '2876 Willow Circle', city: 'Lubbock', state: 'TX', zip: '79401', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
    { id: 'ex-11', name: 'Christopher Thomas', address: '510 Hickory Lane', city: 'Corpus Christi', state: 'TX', zip: '78401', phone: '361-555-0112', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-12', name: 'Amanda Jackson', address: '1745 Poplar Drive', city: 'Irving', state: 'TX', zip: '75060', phone: '972-555-0145', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-13', name: 'Daniel White', address: '3200 Sycamore Terrace', city: 'Amarillo', state: 'TX', zip: '79101', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
    { id: 'ex-14', name: 'Jessica Harris', address: '860 Magnolia Street', city: 'Brownsville', state: 'TX', zip: '78520', phone: '956-555-0178', category: 'Ready to Call', importedAt: new Date().toISOString() },
    { id: 'ex-15', name: 'Matthew Martin', address: '4100 Dogwood Avenue', city: 'Grand Prairie', state: 'TX', zip: '75050', phone: '', category: 'Needs Skip Trace', importedAt: new Date().toISOString() },
  ]

  const loadExample = useCallback(() => {
    setLeads(SAMPLE_LEADS)
    setIsExample(true)
    setError('')
    const readyToCall = SAMPLE_LEADS.filter(l => l.category === 'Ready to Call').length
    const needsSkipTrace = SAMPLE_LEADS.filter(l => l.category === 'Needs Skip Trace').length
    setResult({
      total: SAMPLE_LEADS.length,
      readyToCall,
      needsSkipTrace,
    })
  }, [])

  const clearExample = useCallback(() => {
    setLeads([])
    setIsExample(false)
    setResult(null)
    fetchLeads()
  }, [])

  // Fetch existing imported leads on mount
  useEffect(() => {
    fetchLeads()
  }, [])

  const fetchLeads = useCallback(async () => {
    setLoading(true)
    try {
      const res = await fetch('/api/lead-import')
      if (res.ok) {
        const data = await res.json()
        setLeads(data.leads || [])
      }
    } catch {
      // silent fail on initial load
    } finally {
      setLoading(false)
    }
  }, [])

  const handleFile = useCallback(async (file: File) => {
    if (!file.name.toLowerCase().endsWith('.csv')) {
      setError('Please upload a CSV file.')
      return
    }

    setFileName(file.name)
    setError('')
    setResult(null)
    setImporting(true)

    try {
      const text = await file.text()

      const res = await fetch('/api/lead-import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ csv: text }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Import failed')
        return
      }

      setResult({
        total: data.total,
        readyToCall: data.readyToCall,
        needsSkipTrace: data.needsSkipTrace,
      })

      // Refresh the lead list
      setLeads(prev => [...(data.leads || []), ...prev])
    } catch (err: any) {
      setError(err.message || 'Import failed')
    } finally {
      setImporting(false)
    }
  }, [])

  const onFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFile(file)
    e.target.value = ''
  }, [handleFile])

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) handleFile(file)
  }, [handleFile])

  const exportLeads = useCallback(() => {
    const csv = [
      'Name,Address,City,State,Zip,Phone,Category,Imported At',
      ...leads.map(l =>
        `"${l.name}","${l.address}","${l.city}","${l.state}","${l.zip}","${l.phone}","${l.category}","${l.importedAt}"`
      ),
    ].join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `FTC_Imported_Leads_${new Date().toISOString().split('T')[0]}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }, [leads])

  // Filter leads
  const filtered = leads.filter(l => {
    if (filterCategory !== 'all' && l.category !== filterCategory) return false
    if (search) {
      const q = search.toLowerCase()
      return l.name.toLowerCase().includes(q) ||
        l.address.toLowerCase().includes(q) ||
        l.city.toLowerCase().includes(q) ||
        l.state.toLowerCase().includes(q) ||
        l.phone.includes(q)
    }
    return true
  })

  const readyCount = leads.filter(l => l.category === 'Ready to Call').length
  const skipCount = leads.filter(l => l.category === 'Needs Skip Trace').length

  return (
    <div>
      <h2 className="section-header">Smart Lead Importer</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Upload a CSV file to import leads. The system automatically categorizes each lead based on phone number availability.
      </p>

      <div className="info-tip" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <FileText size={14} color="#5cb885" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>CSV FORMAT</span>
        </div>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          Your CSV should include columns for: <strong>name</strong>, <strong>address</strong>, <strong>city</strong>, <strong>state</strong>, <strong>zip</strong>, and <strong>phone</strong> (optional). Column headers are matched automatically.
        </div>
        <div style={{ display: 'flex', gap: 8, marginTop: 10, flexWrap: 'wrap' }}>
          <button
            onClick={loadExample}
            className="btn-orange"
            style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 5, borderRadius: 6 }}
          >
            <Play size={12} /> Try Example (15 Leads)
          </button>
          <a
            href="/sample-leads.csv"
            download="sample-leads.csv"
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: 12, display: 'inline-flex', alignItems: 'center', gap: 5, borderRadius: 6, textDecoration: 'none' }}
          >
            <Download size={12} /> Download Sample CSV
          </a>
        </div>
      </div>

      {/* Upload Area */}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={onDrop}
        style={{
          border: `2px dashed ${dragOver ? '#ff7e5f' : '#3d4e65'}`,
          borderRadius: 12,
          padding: '40px 24px',
          textAlign: 'center',
          marginBottom: 24,
          background: dragOver ? 'rgba(255,126,95,0.05)' : 'rgba(38,48,64,0.3)',
          transition: 'all 0.2s',
          cursor: 'pointer',
        }}
        onClick={() => document.getElementById('csv-file-input')?.click()}
      >
        <input
          id="csv-file-input"
          type="file"
          accept=".csv"
          onChange={onFileSelect}
          style={{ display: 'none' }}
        />
        {importing ? (
          <div>
            <Loader2 size={36} color="#ff7e5f" style={{ animation: 'spin 1s linear infinite', marginBottom: 12 }} />
            <p style={{ color: '#ff7e5f', fontSize: 15, fontWeight: 600, margin: 0 }}>
              Importing leads from {fileName}...
            </p>
          </div>
        ) : (
          <div>
            <Upload size={36} color={dragOver ? '#ff7e5f' : '#555'} style={{ marginBottom: 12 }} />
            <p style={{ color: '#f5f0eb', fontSize: 15, fontWeight: 600, margin: '0 0 6px' }}>
              Drop your CSV file here or click to upload
            </p>
            <p style={{ color: '#666', fontSize: 13, margin: 0 }}>
              Supports .csv files with lead data
            </p>
          </div>
        )}
      </div>

      {/* Error */}
      {error && (
        <div style={{
          background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <AlertTriangle size={16} color="#ef4444" />
          <span style={{ color: '#ef4444', fontSize: 13, flex: 1 }}>{error}</span>
          <button onClick={() => setError('')} style={{ background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: 4 }}>
            <X size={16} />
          </button>
        </div>
      )}

      {/* Success Result */}
      {result && (
        <div style={{
          background: 'rgba(92,184,133,0.08)', border: '1px solid rgba(92,184,133,0.3)',
          borderRadius: 12, padding: 24, marginBottom: 24,
          animation: 'fadeInUp 0.3s ease',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
            <CheckCircle2 size={20} color="#5cb885" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885', letterSpacing: '0.04em', flex: 1 }}>
              {isExample ? 'Example Data Loaded!' : 'Import Successful!'}
            </span>
            {isExample && (
              <button
                onClick={clearExample}
                className="btn-ghost"
                style={{ padding: '4px 12px', fontSize: 11, display: 'flex', alignItems: 'center', gap: 4, borderRadius: 6 }}
              >
                <X size={12} /> Clear Example
              </button>
            )}
          </div>
          {isExample && (
            <div style={{
              background: 'rgba(255,126,95,0.08)', border: '1px solid rgba(255,126,95,0.2)',
              borderRadius: 8, padding: '10px 14px', marginBottom: 16,
              fontSize: 12, color: '#ff7e5f', lineHeight: 1.6,
            }}>
              This is example data to demonstrate how the Smart Lead Importer works. Upload your own CSV to import real leads.
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12 }}>
            <div className="stat-counter">
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Imported</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f5f0eb' }}>{result.total}</div>
            </div>
            <div className="stat-counter">
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready to Call</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#5cb885' }}>{result.readyToCall}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <Phone size={10} color="#5cb885" />
                <span style={{ fontSize: 11, color: '#5cb885' }}>Has phone</span>
              </div>
            </div>
            <div className="stat-counter">
              <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Needs Skip Trace</div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#e8a44a' }}>{result.needsSkipTrace}</div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                <SearchIcon size={10} color="#e8a44a" />
                <span style={{ fontSize: 11, color: '#e8a44a' }}>No phone</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Bar */}
      {leads.length > 0 && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 24 }}>
          <div className="stat-counter">
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Total Leads</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb' }}>{leads.length}</div>
          </div>
          <div className="stat-counter">
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Ready to Call</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885' }}>{readyCount}</div>
          </div>
          <div className="stat-counter">
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Needs Skip Trace</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#e8a44a' }}>{skipCount}</div>
          </div>
        </div>
      )}

      {/* Controls */}
      {leads.length > 0 && (
        <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap', alignItems: 'center' }}>
          {/* Skip Trace Button */}
          <button
            className="btn-orange"
            style={{ padding: '10px 20px', fontSize: 14, display: 'flex', alignItems: 'center', gap: 6 }}
            onClick={() => alert('Skip Trace API will be connected soon!')}
          >
            <SearchIcon size={14} /> Skip Trace Leads
          </button>

          {/* Export */}
          <button onClick={exportLeads} className="btn-ghost" style={{ padding: '8px 16px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}>
            <Download size={12} /> Export CSV
          </button>

          {/* Category filters */}
          <div style={{ display: 'flex', gap: 4 }}>
            {([
              { id: 'all' as const, label: `All (${leads.length})`, color: '#ff7e5f' },
              { id: 'Ready to Call' as const, label: `Ready (${readyCount})`, color: '#5cb885' },
              { id: 'Needs Skip Trace' as const, label: `Skip Trace (${skipCount})`, color: '#e8a44a' },
            ]).map(f => (
              <button
                key={f.id}
                onClick={() => setFilterCategory(f.id)}
                style={{
                  padding: '6px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer',
                  border: `1px solid ${filterCategory === f.id ? f.color : '#3d4e65'}`,
                  background: filterCategory === f.id ? `${f.color}20` : 'transparent',
                  color: filterCategory === f.id ? f.color : '#888',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              >
                {f.label}
              </button>
            ))}
          </div>

          {/* Search */}
          <div style={{ flex: 1, minWidth: 180 }}>
            <div style={{ position: 'relative' }}>
              <SearchIcon size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
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
      )}

      {/* Loading */}
      {loading && (
        <div style={{ textAlign: 'center', padding: '40px 20px' }}>
          <Loader2 size={28} color="#ff7e5f" style={{ animation: 'spin 1s linear infinite', marginBottom: 8 }} />
          <p style={{ color: '#666', fontSize: 13 }}>Loading leads...</p>
        </div>
      )}

      {/* Lead List — Desktop table view */}
      {!loading && leads.length > 0 && (
        <div className="lead-import-desktop-table" style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {/* Table header */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1.5fr 2fr 1fr 0.8fr 0.8fr 1.2fr 1fr',
            gap: 12, padding: '10px 16px',
            background: 'rgba(38,48,64,0.4)', borderRadius: 8,
            fontSize: 11, color: '#6b6560', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.08em',
          }}>
            <span>Name</span>
            <span>Address</span>
            <span>City</span>
            <span>State</span>
            <span>Zip</span>
            <span>Phone</span>
            <span>Category</span>
          </div>

          {/* Table rows */}
          {filtered.map(lead => (
            <div
              key={lead.id}
              style={{
                display: 'grid',
                gridTemplateColumns: '1.5fr 2fr 1fr 0.8fr 0.8fr 1.2fr 1fr',
                gap: 12, padding: '12px 16px',
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 8,
                fontSize: 13, color: '#ccc', alignItems: 'center',
                borderLeft: `3px solid ${lead.category === 'Ready to Call' ? '#5cb885' : '#e8a44a'}`,
              }}
            >
              <span style={{ color: '#f5f0eb', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                {lead.name}
              </span>
              <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{lead.address || '—'}</span>
              <span>{lead.city || '—'}</span>
              <span>{lead.state || '—'}</span>
              <span>{lead.zip || '—'}</span>
              <span style={{ color: lead.phone ? '#5cb885' : '#666' }}>
                {lead.phone || '—'}
              </span>
              <span style={{
                fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                background: lead.category === 'Ready to Call' ? 'rgba(92,184,133,0.15)' : 'rgba(232,164,74,0.15)',
                color: lead.category === 'Ready to Call' ? '#5cb885' : '#e8a44a',
                textAlign: 'center', whiteSpace: 'nowrap',
              }}>
                {lead.category === 'Ready to Call' ? 'Ready' : 'Skip Trace'}
              </span>
            </div>
          ))}

          {filtered.length === 0 && leads.length > 0 && (
            <div style={{ textAlign: 'center', padding: '30px 20px', color: '#555', fontSize: 13 }}>
              No leads match your search or filter.
            </div>
          )}
        </div>
      )}

      {/* Mobile card view (hidden on desktop, shown on small screens) */}
      {!loading && leads.length > 0 && (
        <div className="lead-import-mobile-cards" style={{ display: 'none', flexDirection: 'column', gap: 8, marginTop: 8 }}>
          {filtered.map(lead => (
            <div
              key={`m-${lead.id}`}
              style={{
                background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
                padding: 16,
                borderLeft: `3px solid ${lead.category === 'Ready to Call' ? '#5cb885' : '#e8a44a'}`,
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 600 }}>{lead.name}</div>
                <span style={{
                  fontSize: 10, fontWeight: 700, padding: '3px 8px', borderRadius: 4,
                  background: lead.category === 'Ready to Call' ? 'rgba(92,184,133,0.15)' : 'rgba(232,164,74,0.15)',
                  color: lead.category === 'Ready to Call' ? '#5cb885' : '#e8a44a',
                  whiteSpace: 'nowrap',
                }}>
                  {lead.category === 'Ready to Call' ? 'Ready' : 'Skip Trace'}
                </span>
              </div>
              {lead.address && (
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4, display: 'flex', alignItems: 'center', gap: 4 }}>
                  <MapPin size={10} /> {lead.address}
                </div>
              )}
              {(lead.city || lead.state || lead.zip) && (
                <div style={{ fontSize: 12, color: '#888', marginBottom: 4 }}>
                  {[lead.city, lead.state, lead.zip].filter(Boolean).join(', ')}
                </div>
              )}
              {lead.phone && (
                <div style={{ fontSize: 12, color: '#5cb885', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Phone size={10} /> {lead.phone}
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Empty State */}
      {!loading && leads.length === 0 && !result && (
        <div style={{
          textAlign: 'center', padding: '50px 20px',
          background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
        }}>
          <Upload size={36} color="#333" style={{ marginBottom: 12 }} />
          <p style={{ fontSize: 15, color: '#666', margin: '0 0 6px' }}>
            No leads imported yet
          </p>
          <p style={{ fontSize: 13, color: '#444', margin: '0 0 20px' }}>
            Upload a CSV file above to get started, or try the example below
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={loadExample}
              className="btn-orange"
              style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderRadius: 8 }}
            >
              <Play size={14} /> Load Example (15 Leads)
            </button>
            <a
              href="/sample-leads.csv"
              download="sample-leads.csv"
              className="btn-ghost"
              style={{ padding: '10px 20px', fontSize: 13, display: 'inline-flex', alignItems: 'center', gap: 6, borderRadius: 8, textDecoration: 'none' }}
            >
              <Download size={14} /> Download Sample CSV
            </a>
          </div>
        </div>
      )}
    </div>
  )
}
