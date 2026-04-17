import { createFileRoute } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Lock, Users, DollarSign, Eye, BarChart3, LogOut, ShieldCheck, UserX, UserCheck, Clock, Search, RefreshCw, TrendingUp, AlertTriangle, CreditCard, Receipt, Database, ChevronDown, ChevronRight, Vault, Building2, CheckCircle, XCircle } from 'lucide-react'

export const Route = createFileRoute('/ftc-admin')({
  component: AdminPage,
  head: () => ({
    meta: [{ name: 'robots', content: 'noindex, nofollow' }],
  }),
})

const ADMIN_TOKEN_KEY = 'ftc_admin_token'

interface Subscriber {
  id: string
  email: string
  name: string
  status: 'active' | 'cancelled'
  subscribedAt: string
  cancelledAt?: string
  amount: number
}

interface LoginEvent {
  email: string
  timestamp: string
}

interface LeadRequest {
  id: string
  email: string
  name: string
  requestedAt: string
  type: string
  details: string
}

interface Transaction {
  id: string
  stripeSessionId: string
  stripeCustomerId: string
  stripeSubscriptionId: string
  email: string
  name: string
  amount: number
  currency: string
  status: string
  type: string
  createdAt: string
}

interface AdminStats {
  activeSubscribers: number
  cancelledSubscribers: number
  monthlyRevenue: number
  totalLeadRequests: number
  recentLogins: number
  totalPaymentVolume: number
  totalTransactions: number
}

interface AdminData {
  stats: AdminStats
  subscribers: Subscriber[]
  logins: LoginEvent[]
  leadRequests: LeadRequest[]
  transactions: Transaction[]
}

interface CrmItem {
  id: string
  type: 'lead' | 'offer' | 'sent'
  name: string
  email?: string
  phone?: string
  address?: string
  notes?: string
  status: string
  amount?: string
  createdAt: string
  updatedAt: string
}

interface UserCrmData {
  userId: string
  leads: CrmItem[]
  offers: CrmItem[]
  sent: CrmItem[]
}

interface AdminCrmData {
  users: UserCrmData[]
  stats: {
    totalUsers: number
    totalLeads: number
    totalOffers: number
    totalSent: number
    totalItems: number
  }
}

function AdminPage() {
  const [authenticated, setAuthenticated] = useState(false)
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [checking, setChecking] = useState(true)
  const [loggingIn, setLoggingIn] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'subscribers' | 'cancellations' | 'logins' | 'revenue' | 'leads' | 'transactions' | 'user-crms' | 'emd'>('overview')
  const [data, setData] = useState<AdminData | null>(null)
  const [loading, setLoading] = useState(false)
  const [searchFilter, setSearchFilter] = useState('')

  // CRM viewer state
  const [crmData, setCrmData] = useState<AdminCrmData | null>(null)

  // EMD admin state
  const [emdRequests, setEmdRequests] = useState<any[]>([])
  const [emdLoading, setEmdLoading] = useState(false)
  const [crmLoading, setCrmLoading] = useState(false)
  const [expandedUsers, setExpandedUsers] = useState<Set<string>>(new Set())

  // Add subscriber form
  const [showAddForm, setShowAddForm] = useState(false)
  const [newSub, setNewSub] = useState({ email: '', name: '', amount: '75' })

  useEffect(() => {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      setChecking(false)
      return
    }
    fetch('/api/admin-auth', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'verify', token }),
    })
      .then(res => res.json())
      .then(data => {
        if (data.valid) {
          setAuthenticated(true)
        } else {
          localStorage.removeItem(ADMIN_TOKEN_KEY)
        }
      })
      .catch(() => localStorage.removeItem(ADMIN_TOKEN_KEY))
      .finally(() => setChecking(false))
  }, [])

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY)
      const res = await fetch('/api/admin-data', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setData(json)
      } else if (res.status === 401) {
        localStorage.removeItem(ADMIN_TOKEN_KEY)
        setAuthenticated(false)
      }
    } catch (err) {
      console.error('Failed to fetch admin data:', err)
    } finally {
      setLoading(false)
    }
  }, [])

  const fetchCrmData = useCallback(async () => {
    setCrmLoading(true)
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY)
      const res = await fetch('/api/admin-crm', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setCrmData(json)
      }
    } catch (err) {
      console.error('Failed to fetch CRM data:', err)
    } finally {
      setCrmLoading(false)
    }
  }, [])

  const fetchEmdData = useCallback(async () => {
    setEmdLoading(true)
    try {
      const token = localStorage.getItem(ADMIN_TOKEN_KEY)
      const res = await fetch('/api/emd-admin', {
        headers: { 'Authorization': `Bearer ${token}` },
      })
      if (res.ok) {
        const json = await res.json()
        setEmdRequests(json.requests || [])
      }
    } catch (err) {
      console.error('Failed to fetch EMD data:', err)
    } finally {
      setEmdLoading(false)
    }
  }, [])

  useEffect(() => {
    if (authenticated) fetchData()
  }, [authenticated, fetchData])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoggingIn(true)
    setError('')
    try {
      const res = await fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'login', code }),
      })
      const data = await res.json()
      if (data.success && data.token) {
        localStorage.setItem(ADMIN_TOKEN_KEY, data.token)
        setAuthenticated(true)
      } else {
        setError('Invalid admin code')
      }
    } catch {
      setError('Authentication failed. Try again.')
    } finally {
      setLoggingIn(false)
    }
  }

  function handleLogout() {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    if (token) {
      fetch('/api/admin-auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'logout', token }),
      }).catch(() => {})
    }
    localStorage.removeItem(ADMIN_TOKEN_KEY)
    setAuthenticated(false)
    setCode('')
  }

  async function handleAddSubscriber(e: React.FormEvent) {
    e.preventDefault()
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    await fetch('/api/admin-data?action=add-subscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ email: newSub.email, name: newSub.name, amount: parseFloat(newSub.amount) || 75 }),
    })
    setNewSub({ email: '', name: '', amount: '75' })
    setShowAddForm(false)
    fetchData()
  }

  async function handleCancelSubscriber(id: string) {
    const token = localStorage.getItem(ADMIN_TOKEN_KEY)
    await fetch('/api/admin-data?action=cancel-subscriber', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
      body: JSON.stringify({ id }),
    })
    fetchData()
  }

  function formatDate(iso: string) {
    return new Date(iso).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
  }

  function formatDateTime(iso: string) {
    return new Date(iso).toLocaleString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })
  }

  if (checking) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 32, height: 32, border: '2px solid #3d4e65', borderTop: '2px solid #ff7e5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  if (!authenticated) {
    return (
      <div style={{ minHeight: '100vh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: 40, maxWidth: 420, width: '100%', boxShadow: '0 32px 80px rgba(0,0,0,0.8)' }}>
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 64, height: 64, borderRadius: '50%',
              background: 'rgba(244,126,95,0.15)', border: '1px solid rgba(244,126,95,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 16px',
            }}>
              <ShieldCheck size={28} color="#ff7e5f" />
            </div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ff7e5f', letterSpacing: '0.05em', margin: 0 }}>
              Admin Access
            </h2>
            <p style={{ color: '#888', fontSize: 13, marginTop: 8 }}>
              This area is restricted to site administrators only.
            </p>
          </div>
          <form onSubmit={handleLogin}>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>
              Secure Admin Code
            </label>
            <input
              className="input-dark"
              type="password"
              placeholder="Enter your secure admin code"
              value={code}
              onChange={e => { setCode(e.target.value); setError('') }}
              autoFocus
              style={{ marginBottom: 12 }}
            />
            {error && (
              <div style={{ color: '#e05050', fontSize: 13, marginBottom: 10 }}>
                {error}
              </div>
            )}
            <button type="submit" className="btn-orange" style={{ width: '100%', justifyContent: 'center' }} disabled={loggingIn}>
              <Lock size={14} /> {loggingIn ? 'Verifying...' : 'Sign In'}
            </button>
          </form>
        </div>
      </div>
    )
  }

  const stats = data?.stats
  const activeSubscribers = data?.subscribers?.filter(s => s.status === 'active') || []
  const cancelledSubscribers = data?.subscribers?.filter(s => s.status === 'cancelled') || []

  const filteredSubscribers = (data?.subscribers || []).filter(s =>
    !searchFilter || s.email.toLowerCase().includes(searchFilter.toLowerCase()) || s.name.toLowerCase().includes(searchFilter.toLowerCase())
  )
  const filteredLogins = (data?.logins || []).filter(l =>
    !searchFilter || l.email.toLowerCase().includes(searchFilter.toLowerCase())
  ).reverse()
  const filteredLeads = (data?.leadRequests || []).filter(l =>
    !searchFilter || l.email.toLowerCase().includes(searchFilter.toLowerCase()) || l.name.toLowerCase().includes(searchFilter.toLowerCase())
  ).reverse()
  const filteredTransactions = (data?.transactions || []).filter(t =>
    !searchFilter || t.email.toLowerCase().includes(searchFilter.toLowerCase()) || t.name.toLowerCase().includes(searchFilter.toLowerCase())
  ).reverse()

  const tabs = [
    { key: 'overview' as const, label: 'Overview', icon: BarChart3 },
    { key: 'subscribers' as const, label: 'Active Subscribers', icon: UserCheck },
    { key: 'cancellations' as const, label: 'Cancellations', icon: UserX },
    { key: 'logins' as const, label: 'Login Activity', icon: Clock },
    { key: 'revenue' as const, label: 'Revenue', icon: DollarSign },
    { key: 'transactions' as const, label: 'Transactions', icon: Receipt },
    { key: 'leads' as const, label: 'Lead Requests', icon: TrendingUp },
    { key: 'user-crms' as const, label: 'User CRMs', icon: Database },
    { key: 'emd' as const, label: 'EMD Vault', icon: Vault },
  ]

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Admin nav */}
      <nav style={{
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #3d4e65', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: 'linear-gradient(135deg, #e05050, #c03030)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#fff',
            }}>ADM</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.06em', color: '#f5f0eb' }}>
              FTC Admin Panel
            </span>
            <span className="badge" style={{ background: 'rgba(224,80,80,0.2)', color: '#e05050' }}>RESTRICTED</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <button onClick={fetchData} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <RefreshCw size={14} className={loading ? 'spin' : ''} /> Refresh
            </button>
            <a href="/" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>← Back to Site</a>
            <button onClick={handleLogout} className="btn-ghost" style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
              <LogOut size={14} /> Logout
            </button>
          </div>
        </div>
      </nav>

      <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 8px' }}>
          Admin Dashboard
        </h1>
        <p style={{ color: '#888', fontSize: 14, marginBottom: 24 }}>
          Track subscribers, revenue, transactions, cancellations, logins, and lead requests.
        </p>

        {/* Stat Cards - Always visible */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <UserCheck size={20} color="#5cb885" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Active Subscribers</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#5cb885' }}>
              {stats?.activeSubscribers ?? '—'}
            </div>
          </div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <DollarSign size={20} color="#ff7e5f" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Monthly Revenue</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#ff7e5f' }}>
              ${stats?.monthlyRevenue?.toLocaleString() ?? '—'}
            </div>
          </div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <UserX size={20} color="#e05050" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Cancelled</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#e05050' }}>
              {stats?.cancelledSubscribers ?? '—'}
            </div>
          </div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <Eye size={20} color="#5a9ad6" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Logins (30d)</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#5a9ad6' }}>
              {stats?.recentLogins ?? '—'}
            </div>
          </div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <TrendingUp size={20} color="#ffb347" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Lead Requests</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#ffb347' }}>
              {stats?.totalLeadRequests ?? '—'}
            </div>
          </div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
            <CreditCard size={20} color="#a78bfa" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Stripe Volume</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#a78bfa' }}>
              ${stats?.totalPaymentVolume?.toLocaleString() ?? '0'}
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div style={{ display: 'flex', gap: 4, marginBottom: 24, overflowX: 'auto', paddingBottom: 4 }}>
          {tabs.map(tab => (
            <button
              key={tab.key}
              onClick={() => { setActiveTab(tab.key); setSearchFilter(''); if (tab.key === 'user-crms' && !crmData) fetchCrmData(); if (tab.key === 'emd' && emdRequests.length === 0) fetchEmdData() }}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap',
                background: activeTab === tab.key ? '#ff7e5f' : '#2e3a4d',
                color: activeTab === tab.key ? '#000' : '#888',
                border: `1px solid ${activeTab === tab.key ? '#ff7e5f' : '#3d4e65'}`,
                borderRadius: 8, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
            >
              <tab.icon size={14} /> {tab.label}
            </button>
          ))}
        </div>

        {/* Search */}
        {activeTab !== 'overview' && activeTab !== 'revenue' && (
          <div style={{ marginBottom: 20 }}>
            <div style={{ position: 'relative' }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }} />
              <input
                className="input-dark"
                placeholder="Search by name or email..."
                value={searchFilter}
                onChange={e => setSearchFilter(e.target.value)}
                style={{ paddingLeft: 36 }}
              />
            </div>
          </div>
        )}

        {/* Content */}
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>

          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', margin: '0 0 16px' }}>
                Business Overview
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
                {/* Recent Subscribers */}
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#5cb885', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserCheck size={14} /> Recent Active Subscribers
                  </div>
                  {activeSubscribers.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#666' }}>No active subscribers yet. Add your first subscriber below.</p>
                  ) : (
                    activeSubscribers.slice(-5).reverse().map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2e3a4d', fontSize: 13 }}>
                        <div>
                          <div style={{ color: '#f5f0eb' }}>{s.name || s.email}</div>
                          <div style={{ color: '#666', fontSize: 11 }}>{formatDate(s.subscribedAt)}</div>
                        </div>
                        <div style={{ color: '#5cb885', fontFamily: "'Bebas Neue', sans-serif", fontSize: 18 }}>${s.amount}</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Recent Cancellations */}
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#e05050', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <UserX size={14} /> Recent Cancellations
                  </div>
                  {cancelledSubscribers.length === 0 ? (
                    <p style={{ fontSize: 13, color: '#666' }}>No cancellations recorded.</p>
                  ) : (
                    cancelledSubscribers.slice(-5).reverse().map(s => (
                      <div key={s.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 0', borderBottom: '1px solid #2e3a4d', fontSize: 13 }}>
                        <div>
                          <div style={{ color: '#f5f0eb' }}>{s.name || s.email}</div>
                          <div style={{ color: '#666', fontSize: 11 }}>Cancelled {s.cancelledAt ? formatDate(s.cancelledAt) : 'N/A'}</div>
                        </div>
                        <div style={{ color: '#e05050', fontSize: 11 }}>Lost ${s.amount}/mo</div>
                      </div>
                    ))
                  )}
                </div>

                {/* Recent Lead Requests */}
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 16 }}>
                  <div style={{ fontSize: 14, fontWeight: 600, color: '#ffb347', marginBottom: 12, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <TrendingUp size={14} /> Recent Lead Requests
                  </div>
                  {(data?.leadRequests || []).length === 0 ? (
                    <p style={{ fontSize: 13, color: '#666' }}>No lead requests yet.</p>
                  ) : (
                    (data?.leadRequests || []).slice(-5).reverse().map(l => (
                      <div key={l.id} style={{ padding: '8px 0', borderBottom: '1px solid #2e3a4d', fontSize: 13 }}>
                        <div style={{ color: '#f5f0eb' }}>{l.name || l.email}</div>
                        <div style={{ color: '#666', fontSize: 11 }}>{l.type} — {formatDate(l.requestedAt)}</div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Active Subscribers Tab */}
          {activeTab === 'subscribers' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885', margin: 0 }}>
                  Active Subscribers ({activeSubscribers.length})
                </h3>
                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="btn-orange"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  + Add Subscriber
                </button>
              </div>

              {showAddForm && (
                <form onSubmit={handleAddSubscriber} style={{ background: '#12161c', border: '1px solid #ff7e5f', borderRadius: 8, padding: 16, marginBottom: 16, display: 'grid', gridTemplateColumns: '1fr 1fr auto auto', gap: 10, alignItems: 'end' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>Email *</label>
                    <input className="input-dark" placeholder="email@example.com" value={newSub.email} onChange={e => setNewSub(p => ({ ...p, email: e.target.value }))} required />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>Name</label>
                    <input className="input-dark" placeholder="Full Name" value={newSub.name} onChange={e => setNewSub(p => ({ ...p, name: e.target.value }))} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 11, color: '#888', marginBottom: 4 }}>$/mo</label>
                    <input className="input-dark" type="number" value={newSub.amount} onChange={e => setNewSub(p => ({ ...p, amount: e.target.value }))} style={{ width: 80 }} />
                  </div>
                  <button type="submit" className="btn-orange" style={{ padding: '10px 16px', fontSize: 13 }}>Save</button>
                </form>
              )}

              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>NAME</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>EMAIL</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>SUBSCRIBED</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>AMOUNT</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>ACTION</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredSubscribers.filter(s => s.status === 'active').length === 0 ? (
                      <tr><td colSpan={5} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No active subscribers found.</td></tr>
                    ) : (
                      filteredSubscribers.filter(s => s.status === 'active').map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{s.name || '—'}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{s.email}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{formatDate(s.subscribedAt)}</td>
                          <td style={{ padding: '10px 8px', color: '#5cb885', textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16 }}>${s.amount}/mo</td>
                          <td style={{ padding: '10px 8px', textAlign: 'right' }}>
                            <button
                              onClick={() => handleCancelSubscriber(s.id)}
                              style={{ padding: '4px 10px', fontSize: 11, background: 'rgba(224,80,80,0.1)', color: '#e05050', border: '1px solid rgba(224,80,80,0.3)', borderRadius: 6, cursor: 'pointer' }}
                            >
                              Cancel
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Cancellations Tab */}
          {activeTab === 'cancellations' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#e05050', margin: '0 0 16px' }}>
                Cancelled Subscribers ({cancelledSubscribers.length})
              </h3>

              {cancelledSubscribers.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  <UserX size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No cancellations recorded yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>NAME</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>EMAIL</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>SUBSCRIBED</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>CANCELLED</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>LOST REVENUE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredSubscribers.filter(s => s.status === 'cancelled').map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{s.name || '—'}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{s.email}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{formatDate(s.subscribedAt)}</td>
                          <td style={{ padding: '10px 8px', color: '#e05050' }}>{s.cancelledAt ? formatDate(s.cancelledAt) : 'N/A'}</td>
                          <td style={{ padding: '10px 8px', color: '#e05050', textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16 }}>-${s.amount}/mo</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {cancelledSubscribers.length > 0 && (
                <div style={{ marginTop: 16, padding: 12, background: 'rgba(224,80,80,0.06)', border: '1px solid rgba(224,80,80,0.2)', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertTriangle size={14} color="#e05050" />
                  <span style={{ fontSize: 13, color: '#e05050' }}>
                    Total lost monthly revenue: ${cancelledSubscribers.reduce((sum, s) => sum + s.amount, 0)}/mo
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Login Activity Tab */}
          {activeTab === 'logins' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5a9ad6', margin: '0 0 16px' }}>
                Login Activity ({filteredLogins.length} events)
              </h3>

              {filteredLogins.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  <Clock size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No login activity recorded yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>EMAIL / USER</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>DATE & TIME</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLogins.map((l, i) => (
                        <tr key={i} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{l.email}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{formatDateTime(l.timestamp)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Revenue Tab */}
          {activeTab === 'revenue' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', margin: '0 0 16px' }}>
                Revenue Breakdown
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 24 }}>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Monthly Recurring Revenue</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#5cb885' }}>
                    ${stats?.monthlyRevenue?.toLocaleString() ?? '0'}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{activeSubscribers.length} active × avg ${activeSubscribers.length > 0 ? Math.round((stats?.monthlyRevenue || 0) / activeSubscribers.length) : 0}/mo</div>
                </div>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Projected Annual Revenue</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#ff7e5f' }}>
                    ${((stats?.monthlyRevenue || 0) * 12).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>Based on current MRR</div>
                </div>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: '#888', marginBottom: 8 }}>Lost Revenue (Cancellations)</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#e05050' }}>
                    -${cancelledSubscribers.reduce((sum, s) => sum + s.amount, 0).toLocaleString()}
                  </div>
                  <div style={{ fontSize: 11, color: '#666', marginTop: 4 }}>{cancelledSubscribers.length} cancelled subscribers</div>
                </div>
              </div>

              {/* Revenue per subscriber list */}
              <div style={{ fontSize: 14, fontWeight: 600, color: '#888', marginBottom: 12 }}>All Subscriber Revenue</div>
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>SUBSCRIBER</th>
                      <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>STATUS</th>
                      <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>MONTHLY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {(data?.subscribers || []).length === 0 ? (
                      <tr><td colSpan={3} style={{ padding: 20, textAlign: 'center', color: '#666' }}>No subscribers yet.</td></tr>
                    ) : (
                      (data?.subscribers || []).map(s => (
                        <tr key={s.id} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{s.name || s.email}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                              background: s.status === 'active' ? 'rgba(45,184,133,0.15)' : 'rgba(224,80,80,0.15)',
                              color: s.status === 'active' ? '#5cb885' : '#e05050',
                            }}>
                              {s.status === 'active' ? 'ACTIVE' : 'CANCELLED'}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: s.status === 'active' ? '#5cb885' : '#666', textDecoration: s.status === 'cancelled' ? 'line-through' : 'none' }}>
                            ${s.amount}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Lead Requests Tab */}
          {activeTab === 'leads' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ffb347', margin: '0 0 16px' }}>
                Lead Requests ({filteredLeads.length})
              </h3>

              {filteredLeads.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  <TrendingUp size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No lead requests recorded yet.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>NAME</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>EMAIL</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>TYPE</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>DETAILS</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>DATE</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredLeads.map(l => (
                        <tr key={l.id} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{l.name || '—'}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{l.email}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(232,179,71,0.15)', color: '#ffb347' }}>
                              {l.type}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', color: '#888', maxWidth: 200, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{l.details || '—'}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{formatDate(l.requestedAt)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          )}

          {/* Transactions Tab (Stripe POS) */}
          {activeTab === 'transactions' && (
            <div>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#a78bfa', margin: '0 0 16px' }}>
                Stripe Transactions ({filteredTransactions.length})
              </h3>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Total Volume</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885' }}>
                    ${stats?.totalPaymentVolume?.toLocaleString() ?? '0'}
                  </div>
                </div>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Successful</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885' }}>
                    {(data?.transactions || []).filter(t => t.status === 'completed' || t.status === 'paid').length}
                  </div>
                </div>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Failed</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#e05050' }}>
                    {(data?.transactions || []).filter(t => t.status === 'failed').length}
                  </div>
                </div>
                <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Cancellations</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ffb347' }}>
                    {(data?.transactions || []).filter(t => t.status === 'cancelled').length}
                  </div>
                </div>
              </div>

              {filteredTransactions.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  <Receipt size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No transactions recorded yet.</p>
                  <p style={{ fontSize: 12, color: '#555' }}>Transactions will appear here once customers subscribe through the Stripe checkout.</p>
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13 }}>
                    <thead>
                      <tr style={{ borderBottom: '1px solid #3d4e65' }}>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>DATE</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>CUSTOMER</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>EMAIL</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>TYPE</th>
                        <th style={{ textAlign: 'left', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>STATUS</th>
                        <th style={{ textAlign: 'right', padding: '10px 8px', color: '#888', fontWeight: 600, fontSize: 11 }}>AMOUNT</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredTransactions.map(t => (
                        <tr key={t.id} style={{ borderBottom: '1px solid #2e3a4d' }}>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{formatDateTime(t.createdAt)}</td>
                          <td style={{ padding: '10px 8px', color: '#f5f0eb' }}>{t.name || '—'}</td>
                          <td style={{ padding: '10px 8px', color: '#888' }}>{t.email}</td>
                          <td style={{ padding: '10px 8px' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                              background: t.type === 'subscription' ? 'rgba(167,139,250,0.15)' : t.type === 'recurring-payment' ? 'rgba(45,184,133,0.15)' : t.type === 'cancellation' ? 'rgba(224,80,80,0.15)' : 'rgba(232,179,71,0.15)',
                              color: t.type === 'subscription' ? '#a78bfa' : t.type === 'recurring-payment' ? '#5cb885' : t.type === 'cancellation' ? '#e05050' : '#ffb347',
                            }}>
                              {t.type === 'subscription' ? 'NEW SUB' : t.type === 'recurring-payment' ? 'RENEWAL' : t.type === 'cancellation' ? 'CANCEL' : t.type === 'payment-failed' ? 'FAILED' : t.type.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px' }}>
                            <span style={{
                              padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                              background: t.status === 'completed' || t.status === 'paid' ? 'rgba(45,184,133,0.15)' : t.status === 'failed' ? 'rgba(224,80,80,0.15)' : 'rgba(232,179,71,0.15)',
                              color: t.status === 'completed' || t.status === 'paid' ? '#5cb885' : t.status === 'failed' ? '#e05050' : '#ffb347',
                            }}>
                              {t.status.toUpperCase()}
                            </span>
                          </td>
                          <td style={{ padding: '10px 8px', textAlign: 'right', fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: t.amount > 0 ? '#5cb885' : '#666' }}>
                            {t.amount > 0 ? `$${t.amount}` : '—'}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              <div style={{ marginTop: 16, padding: 12, background: 'rgba(167,139,250,0.06)', border: '1px solid rgba(167,139,250,0.2)', borderRadius: 8, fontSize: 12, color: '#a78bfa' }}>
                <strong>Stripe POS:</strong> All payments are processed through Stripe and deposited directly to your connected bank account. Payouts typically arrive within 2 business days.
              </div>
            </div>
          )}

          {/* User CRMs Tab */}
          {activeTab === 'user-crms' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5a9ad6', margin: 0 }}>
                  All User CRM Data
                </h3>
                <button
                  onClick={fetchCrmData}
                  className="btn-ghost"
                  style={{ padding: '6px 12px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 6 }}
                >
                  <RefreshCw size={14} className={crmLoading ? 'spin' : ''} /> Refresh CRMs
                </button>
              </div>

              {/* CRM Summary Stats */}
              {crmData && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Users with CRM</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5a9ad6' }}>
                      {crmData.stats.totalUsers}
                    </div>
                  </div>
                  <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Total Leads</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885' }}>
                      {crmData.stats.totalLeads}
                    </div>
                  </div>
                  <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Total Offers</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ff7e5f' }}>
                      {crmData.stats.totalOffers}
                    </div>
                  </div>
                  <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Total Sent</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#a78bfa' }}>
                      {crmData.stats.totalSent}
                    </div>
                  </div>
                  <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 14, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>All Items</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ffb347' }}>
                      {crmData.stats.totalItems}
                    </div>
                  </div>
                </div>
              )}

              {crmLoading ? (
                <div style={{ textAlign: 'center', padding: 40 }}>
                  <div style={{ width: 32, height: 32, border: '2px solid #3d4e65', borderTop: '2px solid #5a9ad6', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto 12px' }} />
                  <p style={{ color: '#888', fontSize: 13 }}>Loading all CRM data...</p>
                </div>
              ) : !crmData || crmData.users.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666' }}>
                  <Database size={32} style={{ marginBottom: 12, opacity: 0.3 }} />
                  <p>No CRM data found. Users haven't created any leads, offers, or sent items yet.</p>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                  {crmData.users
                    .filter(u => {
                      if (!searchFilter) return true
                      const q = searchFilter.toLowerCase()
                      const allItems = [...u.leads, ...u.offers, ...u.sent]
                      return u.userId.toLowerCase().includes(q) ||
                        allItems.some(item =>
                          item.name.toLowerCase().includes(q) ||
                          (item.email && item.email.toLowerCase().includes(q)) ||
                          (item.phone && item.phone.toLowerCase().includes(q)) ||
                          (item.address && item.address.toLowerCase().includes(q))
                        )
                    })
                    .map(user => {
                      const isExpanded = expandedUsers.has(user.userId)
                      const totalItems = user.leads.length + user.offers.length + user.sent.length
                      const totalValue = [...user.leads, ...user.offers, ...user.sent]
                        .reduce((sum, item) => sum + (parseFloat(item.amount || '0') || 0), 0)

                      return (
                        <div key={user.userId} style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, overflow: 'hidden' }}>
                          {/* User header - click to expand */}
                          <button
                            onClick={() => {
                              const next = new Set(expandedUsers)
                              if (isExpanded) next.delete(user.userId)
                              else next.add(user.userId)
                              setExpandedUsers(next)
                            }}
                            style={{
                              width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                              padding: '14px 16px', background: 'transparent', border: 'none', cursor: 'pointer',
                              color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif",
                            }}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                              {isExpanded ? <ChevronDown size={16} color="#5a9ad6" /> : <ChevronRight size={16} color="#888" />}
                              <div style={{ textAlign: 'left' }}>
                                <div style={{ fontSize: 14, fontWeight: 600 }}>User: {user.userId.slice(0, 12)}...</div>
                                <div style={{ fontSize: 11, color: '#666', marginTop: 2 }}>
                                  {user.leads.length} leads · {user.offers.length} offers · {user.sent.length} sent
                                </div>
                              </div>
                            </div>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                              <span style={{ padding: '2px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600, background: 'rgba(90,154,214,0.15)', color: '#5a9ad6' }}>
                                {totalItems} items
                              </span>
                              {totalValue > 0 && (
                                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#5cb885' }}>
                                  ${totalValue.toLocaleString()}
                                </span>
                              )}
                            </div>
                          </button>

                          {/* Expanded user CRM data */}
                          {isExpanded && (
                            <div style={{ padding: '0 16px 16px', borderTop: '1px solid #3d4e65' }}>
                              {/* Leads section */}
                              {user.leads.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#5cb885', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#5cb885' }} />
                                    Leads ({user.leads.length})
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                      <thead>
                                        <tr style={{ borderBottom: '1px solid #2e3a4d' }}>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NAME</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>EMAIL</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>PHONE</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>ADDRESS</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>STATUS</th>
                                          <th style={{ textAlign: 'right', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>AMOUNT</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NOTES</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>UPDATED</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.leads.map(item => (
                                          <tr key={item.id} style={{ borderBottom: '1px solid #263040' }}>
                                            <td style={{ padding: '8px 6px', color: '#f5f0eb' }}>{item.name}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.email || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.phone || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address || '—'}</td>
                                            <td style={{ padding: '8px 6px' }}>
                                              <span style={{
                                                padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                                                background: item.status === 'Converted' ? 'rgba(45,184,133,0.15)' : item.status === 'Not Interested' ? 'rgba(224,80,80,0.15)' : 'rgba(232,179,71,0.15)',
                                                color: item.status === 'Converted' ? '#5cb885' : item.status === 'Not Interested' ? '#e05050' : '#ffb347',
                                              }}>
                                                {item.status}
                                              </span>
                                            </td>
                                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#5cb885', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14 }}>
                                              {item.amount ? `$${item.amount}` : '—'}
                                            </td>
                                            <td style={{ padding: '8px 6px', color: '#666', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#666' }}>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* Offers section */}
                              {user.offers.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#ff7e5f', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#ff7e5f' }} />
                                    Offers ({user.offers.length})
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                      <thead>
                                        <tr style={{ borderBottom: '1px solid #2e3a4d' }}>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NAME</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>EMAIL</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>PHONE</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>ADDRESS</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>STATUS</th>
                                          <th style={{ textAlign: 'right', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>AMOUNT</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NOTES</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>UPDATED</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.offers.map(item => (
                                          <tr key={item.id} style={{ borderBottom: '1px solid #263040' }}>
                                            <td style={{ padding: '8px 6px', color: '#f5f0eb' }}>{item.name}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.email || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.phone || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address || '—'}</td>
                                            <td style={{ padding: '8px 6px' }}>
                                              <span style={{
                                                padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                                                background: item.status === 'Accepted' ? 'rgba(45,184,133,0.15)' : item.status === 'Rejected' ? 'rgba(224,80,80,0.15)' : 'rgba(167,139,250,0.15)',
                                                color: item.status === 'Accepted' ? '#5cb885' : item.status === 'Rejected' ? '#e05050' : '#a78bfa',
                                              }}>
                                                {item.status}
                                              </span>
                                            </td>
                                            <td style={{ padding: '8px 6px', textAlign: 'right', color: '#ff7e5f', fontFamily: "'Bebas Neue', sans-serif", fontSize: 14 }}>
                                              {item.amount ? `$${item.amount}` : '—'}
                                            </td>
                                            <td style={{ padding: '8px 6px', color: '#666', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#666' }}>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}

                              {/* Sent section */}
                              {user.sent.length > 0 && (
                                <div style={{ marginTop: 16 }}>
                                  <div style={{ fontSize: 13, fontWeight: 600, color: '#a78bfa', marginBottom: 8, display: 'flex', alignItems: 'center', gap: 6 }}>
                                    <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#a78bfa' }} />
                                    Sent ({user.sent.length})
                                  </div>
                                  <div style={{ overflowX: 'auto' }}>
                                    <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 12 }}>
                                      <thead>
                                        <tr style={{ borderBottom: '1px solid #2e3a4d' }}>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NAME</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>EMAIL</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>PHONE</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>ADDRESS</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>STATUS</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>NOTES</th>
                                          <th style={{ textAlign: 'left', padding: '8px 6px', color: '#666', fontWeight: 600, fontSize: 10 }}>UPDATED</th>
                                        </tr>
                                      </thead>
                                      <tbody>
                                        {user.sent.map(item => (
                                          <tr key={item.id} style={{ borderBottom: '1px solid #263040' }}>
                                            <td style={{ padding: '8px 6px', color: '#f5f0eb' }}>{item.name}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.email || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888' }}>{item.phone || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#888', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.address || '—'}</td>
                                            <td style={{ padding: '8px 6px' }}>
                                              <span style={{
                                                padding: '2px 6px', borderRadius: 4, fontSize: 10, fontWeight: 600,
                                                background: item.status === 'Responded' ? 'rgba(45,184,133,0.15)' : item.status === 'No Response' ? 'rgba(224,80,80,0.15)' : 'rgba(90,154,214,0.15)',
                                                color: item.status === 'Responded' ? '#5cb885' : item.status === 'No Response' ? '#e05050' : '#5a9ad6',
                                              }}>
                                                {item.status}
                                              </span>
                                            </td>
                                            <td style={{ padding: '8px 6px', color: '#666', maxWidth: 150, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{item.notes || '—'}</td>
                                            <td style={{ padding: '8px 6px', color: '#666' }}>{new Date(item.updatedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</td>
                                          </tr>
                                        ))}
                                      </tbody>
                                    </table>
                                  </div>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      )
                    })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'emd' && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', margin: 0 }}>
                  EMD Vault — Admin
                </h3>
                <button
                  onClick={fetchEmdData}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 5,
                    padding: '8px 14px', borderRadius: 6,
                    background: '#2e3a4d', border: '1px solid #3d4e65',
                    color: '#a09890', fontSize: 12, cursor: 'pointer',
                    fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  <RefreshCw size={12} /> Refresh
                </button>
              </div>

              {emdLoading ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#888' }}>Loading EMD requests...</div>
              ) : emdRequests.length === 0 ? (
                <div style={{ textAlign: 'center', padding: 40, color: '#666', background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d', borderRadius: 8 }}>
                  No EMD requests yet.
                </div>
              ) : (
                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 13, minWidth: 700 }}>
                    <thead>
                      <tr>
                        {['User', 'Property', 'Amount', 'Fee', 'Total', 'Status', 'Date', 'Actions'].map(h => (
                          <th key={h} style={{ padding: '10px 8px', textAlign: 'left', borderBottom: '1px solid #3d4e65', color: '#666', fontSize: 11, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {emdRequests.map((r: any) => {
                        const isPastDue = r.status === 'funded' && r.dueDate && new Date(r.dueDate) < new Date()
                        return (
                          <tr key={r.id} style={{ borderBottom: '1px solid rgba(61,78,101,0.3)' }}>
                            <td style={{ padding: '10px 8px', color: '#ccc' }}>{r.userId?.slice(0, 8)}...</td>
                            <td style={{ padding: '10px 8px', color: '#f5f0eb', maxWidth: 180, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                                <Building2 size={12} style={{ color: '#ff7e5f', flexShrink: 0 }} />
                                {r.propertyAddress}
                              </div>
                            </td>
                            <td style={{ padding: '10px 8px', color: '#f5f0eb', fontWeight: 600 }}>${r.amountRequested?.toLocaleString()}</td>
                            <td style={{ padding: '10px 8px', color: '#888' }}>${r.fee}</td>
                            <td style={{ padding: '10px 8px', color: '#ff7e5f', fontWeight: 600 }}>${r.totalDue?.toLocaleString()}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <span style={{
                                padding: '3px 8px', borderRadius: 4, fontSize: 11, fontWeight: 600,
                                background: r.status === 'pending' ? 'rgba(232,164,74,0.15)' : r.status === 'approved' ? 'rgba(91,163,217,0.15)' : r.status === 'funded' ? 'rgba(92,184,133,0.15)' : r.status === 'rejected' ? 'rgba(232,92,92,0.15)' : 'rgba(155,143,255,0.15)',
                                color: r.status === 'pending' ? '#e8a44a' : r.status === 'approved' ? '#5ba3d9' : r.status === 'funded' ? '#5cb885' : r.status === 'rejected' ? '#e85c5c' : '#9b8fff',
                              }}>
                                {r.status?.toUpperCase()}
                              </span>
                              {isPastDue && <span style={{ marginLeft: 6, color: '#e85c5c', fontSize: 10, fontWeight: 700 }}>OVERDUE</span>}
                            </td>
                            <td style={{ padding: '10px 8px', color: '#666' }}>{new Date(r.createdAt).toLocaleDateString()}</td>
                            <td style={{ padding: '10px 8px' }}>
                              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                                {r.status === 'pending' && (
                                  <>
                                    <button
                                      onClick={async () => {
                                        const token = localStorage.getItem(ADMIN_TOKEN_KEY)
                                        await fetch('/api/emd-admin', {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                          body: JSON.stringify({ requestId: r.id, userId: r.userId, status: 'approved' }),
                                        })
                                        fetchEmdData()
                                      }}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 3,
                                        padding: '4px 8px', borderRadius: 4,
                                        background: 'rgba(92,184,133,0.15)', border: '1px solid rgba(92,184,133,0.3)',
                                        color: '#5cb885', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                      }}
                                    >
                                      <CheckCircle size={10} /> Approve
                                    </button>
                                    <button
                                      onClick={async () => {
                                        const token = localStorage.getItem(ADMIN_TOKEN_KEY)
                                        await fetch('/api/emd-admin', {
                                          method: 'PUT',
                                          headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                          body: JSON.stringify({ requestId: r.id, userId: r.userId, status: 'rejected' }),
                                        })
                                        fetchEmdData()
                                      }}
                                      style={{
                                        display: 'flex', alignItems: 'center', gap: 3,
                                        padding: '4px 8px', borderRadius: 4,
                                        background: 'rgba(232,92,92,0.15)', border: '1px solid rgba(232,92,92,0.3)',
                                        color: '#e85c5c', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                      }}
                                    >
                                      <XCircle size={10} /> Reject
                                    </button>
                                  </>
                                )}
                                {r.status === 'approved' && (
                                  <button
                                    onClick={async () => {
                                      const token = localStorage.getItem(ADMIN_TOKEN_KEY)
                                      await fetch('/api/emd-admin', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify({ requestId: r.id, userId: r.userId, status: 'funded' }),
                                      })
                                      fetchEmdData()
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 3,
                                      padding: '4px 8px', borderRadius: 4,
                                      background: 'rgba(91,163,217,0.15)', border: '1px solid rgba(91,163,217,0.3)',
                                      color: '#5ba3d9', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                    }}
                                  >
                                    <DollarSign size={10} /> Mark Funded
                                  </button>
                                )}
                                {r.status === 'funded' && r.repaymentProof && (
                                  <button
                                    onClick={async () => {
                                      const token = localStorage.getItem(ADMIN_TOKEN_KEY)
                                      await fetch('/api/emd-admin', {
                                        method: 'PUT',
                                        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
                                        body: JSON.stringify({ requestId: r.id, userId: r.userId, status: 'repaid' }),
                                      })
                                      fetchEmdData()
                                    }}
                                    style={{
                                      display: 'flex', alignItems: 'center', gap: 3,
                                      padding: '4px 8px', borderRadius: 4,
                                      background: 'rgba(155,143,255,0.15)', border: '1px solid rgba(155,143,255,0.3)',
                                      color: '#9b8fff', fontSize: 11, fontWeight: 600, cursor: 'pointer',
                                    }}
                                  >
                                    <CheckCircle size={10} /> Confirm Repaid
                                  </button>
                                )}
                                {['repaid', 'rejected'].includes(r.status) && (
                                  <span style={{ fontSize: 11, color: '#666', fontStyle: 'italic' }}>Completed</span>
                                )}
                              </div>
                            </td>
                          </tr>
                        )
                      })}
                    </tbody>
                  </table>
                </div>
              )}

              {/* EMD details */}
              {emdRequests.length > 0 && (
                <div style={{ marginTop: 24 }}>
                  <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#f5f0eb', marginBottom: 12 }}>
                    Document Details
                  </h4>
                  {emdRequests.filter(r => r.status === 'pending' || r.status === 'approved').map((r: any) => (
                    <div key={`detail-${r.id}`} style={{
                      background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
                      borderRadius: 8, padding: 16, marginBottom: 12,
                    }}>
                      <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0eb', marginBottom: 8 }}>{r.propertyAddress}</div>
                      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 10 }}>
                        <div>
                          <span style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Title Company</span>
                          <p style={{ fontSize: 12, color: '#a09890', margin: '2px 0 0' }}>{r.titleCompanyInfo || '—'}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Escrow Officer</span>
                          <p style={{ fontSize: 12, color: '#a09890', margin: '2px 0 0' }}>{r.escrowOfficerInfo || '—'}</p>
                        </div>
                        <div>
                          <span style={{ fontSize: 10, color: '#666', textTransform: 'uppercase' }}>Wire Instructions</span>
                          <p style={{ fontSize: 12, color: '#a09890', margin: '2px 0 0' }}>{r.wireInstructions || '—'}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      <style>{` { to { transform: rotate(360deg); } }
        .spin { animation: spin 0.8s linear infinite; }
        @media (max-width: 640px) {
          form[style*="grid-template-columns: 1fr 1fr auto auto"] {
            grid-template-columns: 1fr !important;
          }
          table { font-size: 12px; }
          table th, table td { padding: 6px 8px !important; }
        }
        @media (max-width: 768px) {
          div[style*="grid-template-columns: repeat(auto-fill, minmax(300px"] {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
