import { useState, useEffect, useCallback } from 'react'
import { createFileRoute } from '@tanstack/react-router'
import SectionLayout from '@/components/SectionLayout'
import {
  Vault, Plus, Clock, CheckCircle, XCircle, DollarSign, AlertTriangle,
  FileText, Building2, User, Upload, ChevronRight, ChevronLeft,
  ArrowLeft, Eye, Send, Info, Landmark,
} from 'lucide-react'

export const Route = createFileRoute('/emd-vault')({
  component: EmdVaultPage,
})

/* ─── Types ─── */

interface EmdRequest {
  id: string
  userId: string
  dealId: string
  propertyAddress: string
  amountRequested: number
  fee: number
  totalDue: number
  status: 'pending' | 'approved' | 'funded' | 'rejected' | 'repaid'
  documents: {
    purchaseAgreement?: string
    titleCompanyInfo?: string
    escrowOfficerInfo?: string
    wireInstructions?: string
  }
  titleCompanyInfo: string
  escrowOfficerInfo: string
  wireInstructions: string
  createdAt: string
  dueDate?: string
  repaidAt?: string
  repaymentProof?: string
  adminNotes?: string
}

interface PipelineDeal {
  id: string
  name: string
  address?: string
  phone?: string
  email?: string
  amount?: string
  notes?: string
  createdAt: string
  updatedAt: string
}

interface PipelineData {
  [stage: string]: PipelineDeal[]
}

/* ─── Example / Demo Data ─── */

const EXAMPLE_EMD_REQUESTS: EmdRequest[] = [
  {
    id: 'demo-1',
    userId: 'demo',
    dealId: 'deal-101',
    propertyAddress: '742 Evergreen Terrace, Springfield, IL 62704',
    amountRequested: 1000,
    fee: 150,
    totalDue: 1150,
    status: 'funded',
    documents: {
      purchaseAgreement: 'purchase-agreement-742.pdf',
      titleCompanyInfo: 'Provided',
      escrowOfficerInfo: 'Provided',
      wireInstructions: 'Provided',
    },
    titleCompanyInfo: 'First American Title — Springfield Branch',
    escrowOfficerInfo: 'Sarah Johnson — (217) 555-0142',
    wireInstructions: 'First American Title — Wire details provided upon approval',
    createdAt: '2026-03-15T10:30:00Z',
    dueDate: '2026-04-14T10:30:00Z',
  },
  {
    id: 'demo-2',
    userId: 'demo',
    dealId: 'deal-102',
    propertyAddress: '1520 NW 3rd Ave, Miami, FL 33136',
    amountRequested: 750,
    fee: 150,
    totalDue: 900,
    status: 'repaid',
    documents: {
      purchaseAgreement: 'contract-1520nw.pdf',
      titleCompanyInfo: 'Provided',
      escrowOfficerInfo: 'Provided',
      wireInstructions: 'Provided',
    },
    titleCompanyInfo: 'Stewart Title — Miami Office',
    escrowOfficerInfo: 'Carlos Rivera — (305) 555-0198',
    wireInstructions: 'Stewart Title — Wire details provided upon approval',
    createdAt: '2026-02-01T14:00:00Z',
    dueDate: '2026-03-03T14:00:00Z',
    repaidAt: '2026-02-25T09:15:00Z',
  },
  {
    id: 'demo-3',
    userId: 'demo',
    dealId: 'deal-103',
    propertyAddress: '3847 Oakwood Dr, Dallas, TX 75219',
    amountRequested: 500,
    fee: 150,
    totalDue: 650,
    status: 'pending',
    documents: {
      purchaseAgreement: 'agreement-3847oak.pdf',
      titleCompanyInfo: 'Provided',
      escrowOfficerInfo: 'Provided',
      wireInstructions: 'Provided',
    },
    titleCompanyInfo: 'Chicago Title — Dallas Downtown',
    escrowOfficerInfo: 'Amanda Chen — (214) 555-0267',
    wireInstructions: 'Chicago Title — Wire details provided upon approval',
    createdAt: '2026-04-10T08:45:00Z',
  },
  {
    id: 'demo-4',
    userId: 'demo',
    dealId: 'deal-104',
    propertyAddress: '928 Magnolia Blvd, Atlanta, GA 30309',
    amountRequested: 1000,
    fee: 150,
    totalDue: 1150,
    status: 'approved',
    documents: {
      purchaseAgreement: 'contract-928magnolia.pdf',
      titleCompanyInfo: 'Provided',
      escrowOfficerInfo: 'Provided',
      wireInstructions: 'Provided',
    },
    titleCompanyInfo: 'Fidelity National Title — Atlanta',
    escrowOfficerInfo: 'Marcus Williams — (404) 555-0331',
    wireInstructions: 'Fidelity National — Wire details provided upon approval',
    createdAt: '2026-04-08T11:20:00Z',
  },
]

/* ─── Status helpers ─── */

const STATUS_CONFIG: Record<string, { label: string; color: string; bg: string; icon: typeof Clock }> = {
  pending: { label: 'Pending Review', color: '#e8a44a', bg: 'rgba(232,164,74,0.12)', icon: Clock },
  approved: { label: 'Approved', color: '#5ba3d9', bg: 'rgba(91,163,217,0.12)', icon: CheckCircle },
  funded: { label: 'Funded', color: '#5cb885', bg: 'rgba(92,184,133,0.12)', icon: DollarSign },
  rejected: { label: 'Rejected', color: '#e85c5c', bg: 'rgba(232,92,92,0.12)', icon: XCircle },
  repaid: { label: 'Repaid', color: '#9b8fff', bg: 'rgba(155,143,255,0.12)', icon: CheckCircle },
}

function StatusBadge({ status }: { status: string }) {
  const cfg = STATUS_CONFIG[status] || STATUS_CONFIG.pending
  const Icon = cfg.icon
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 5,
      padding: '4px 10px', borderRadius: 6,
      background: cfg.bg, color: cfg.color,
      fontSize: 12, fontWeight: 600,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      <Icon size={12} />
      {cfg.label}
    </span>
  )
}

/* ─── Main Page Component ─── */

function EmdVaultPage() {
  const [activeTab, setActiveTab] = useState('vault')
  const [requests, setRequests] = useState<EmdRequest[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedRequest, setSelectedRequest] = useState<EmdRequest | null>(null)
  const [showForm, setShowForm] = useState(false)

  const tabs = [
    { id: 'vault', label: 'EMD Vault', icon: Vault },
    { id: 'request', label: 'Request EMD', icon: Plus },
  ]

  const [isDemo, setIsDemo] = useState(false)

  const fetchRequests = useCallback(async () => {
    try {
      const res = await fetch('/api/emd')
      if (res.ok) {
        const data = await res.json()
        const real = data.requests || []
        if (real.length > 0) {
          setRequests(real)
          setIsDemo(false)
        } else {
          setRequests(EXAMPLE_EMD_REQUESTS)
          setIsDemo(true)
        }
      } else {
        setRequests(EXAMPLE_EMD_REQUESTS)
        setIsDemo(true)
      }
    } catch {
      setRequests(EXAMPLE_EMD_REQUESTS)
      setIsDemo(true)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const hasActiveRequest = requests.some(r => !['rejected', 'repaid'].includes(r.status))

  return (
    <SectionLayout
      title="Earnest Money Vault"
      subtitle="Secure your deals even if you don't have EMD"
      badge="EMD FUNDING"
      badgeColor="orange"
      tabs={tabs}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'request' || showForm ? (
        <RequestEmdForm
          onBack={() => { setShowForm(false); setActiveTab('vault') }}
          onSuccess={() => { setShowForm(false); setActiveTab('vault'); fetchRequests() }}
        />
      ) : selectedRequest ? (
        <RequestDetail
          request={selectedRequest}
          onBack={() => { setSelectedRequest(null); fetchRequests() }}
        />
      ) : (
        <VaultDashboard
          requests={requests}
          loading={loading}
          hasActiveRequest={hasActiveRequest}
          isDemo={isDemo}
          onNewRequest={() => setActiveTab('request')}
          onViewRequest={setSelectedRequest}
        />
      )}
    </SectionLayout>
  )
}

/* ─── Vault Dashboard ─── */

function VaultDashboard({
  requests, loading, hasActiveRequest, isDemo, onNewRequest, onViewRequest,
}: {
  requests: EmdRequest[]
  loading: boolean
  hasActiveRequest: boolean
  isDemo: boolean
  onNewRequest: () => void
  onViewRequest: (r: EmdRequest) => void
}) {
  return (
    <div>
      {/* Demo banner */}
      {isDemo && (
        <div style={{
          display: 'flex', alignItems: 'center', gap: 10,
          background: 'linear-gradient(135deg, rgba(255,126,95,0.10), rgba(232,104,48,0.08))',
          border: '1px solid rgba(255,126,95,0.25)',
          borderRadius: 10, padding: '14px 18px', marginBottom: 20,
        }}>
          <Eye size={18} style={{ color: '#ff7e5f', flexShrink: 0 }} />
          <div>
            <span style={{ fontSize: 14, fontWeight: 700, color: '#ff7e5f', fontFamily: "'DM Sans', sans-serif", display: 'block', marginBottom: 2 }}>
              Example EMD Vault Preview
            </span>
            <span style={{ fontSize: 13, color: '#a09890', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
              This is a demo showing how the EMD Vault works. Below are example requests at various stages — Pending, Approved, Funded, and Repaid. Click "View" on any request to see the full details. When you submit a real request, your actual data will appear here.
            </span>
          </div>
        </div>
      )}
      {/* Hero stats */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: 16, marginBottom: 28,
      }}>
        <StatCard icon={Vault} label="Total Requests" value={String(requests.length)} color="#ff7e5f" />
        <StatCard icon={DollarSign} label="Active Funding" value={`$${requests.filter(r => r.status === 'funded').reduce((s, r) => s + r.amountRequested, 0).toLocaleString()}`} color="#5cb885" />
        <StatCard icon={CheckCircle} label="Repaid" value={String(requests.filter(r => r.status === 'repaid').length)} color="#9b8fff" />
      </div>

      {/* Important notice */}
      <div style={{
        display: 'flex', alignItems: 'flex-start', gap: 10,
        background: 'rgba(91,163,217,0.06)', border: '1px solid rgba(91,163,217,0.15)',
        borderRadius: 10, padding: '14px 16px', marginBottom: 24,
      }}>
        <Info size={16} style={{ color: '#5ba3d9', flexShrink: 0, marginTop: 2 }} />
        <p style={{ fontSize: 13, color: '#a09890', lineHeight: 1.6, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
          EMD funds are sent directly to the title company — never to personal accounts.
          Repayment is due within 30 days of funding or at closing, whichever comes first.
          A $150 fee applies to all funded requests.
        </p>
      </div>

      {/* Request EMD button */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 12 }}>
        <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: 0, letterSpacing: '0.03em' }}>
          Your Requests
        </h2>
        <button
          onClick={onNewRequest}
          disabled={hasActiveRequest && !isDemo}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 20px', borderRadius: 8,
            background: (hasActiveRequest && !isDemo) ? '#3d4e65' : 'linear-gradient(135deg, #ff7e5f, #e86830)',
            border: 'none', color: (hasActiveRequest && !isDemo) ? '#6b6560' : '#000',
            fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
            cursor: (hasActiveRequest && !isDemo) ? 'not-allowed' : 'pointer',
            transition: 'transform 0.15s, box-shadow 0.15s',
          }}
          onMouseEnter={e => { if (!(hasActiveRequest && !isDemo)) { e.currentTarget.style.transform = 'translateY(-1px)'; e.currentTarget.style.boxShadow = '0 4px 16px rgba(244,126,95,0.3)' } }}
          onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none' }}
        >
          <Plus size={16} /> Request EMD
        </button>
      </div>

      {hasActiveRequest && !isDemo && (
        <p style={{ fontSize: 12, color: '#e8a44a', marginTop: -12, marginBottom: 16, fontFamily: "'DM Sans', sans-serif" }}>
          You already have an active EMD request. Only one active request is allowed at a time.
        </p>
      )}

      {/* Requests table */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: 40, color: '#6b6560' }}>Loading...</div>
      ) : requests.length === 0 ? (
        <EmptyState onNewRequest={onNewRequest} />
      ) : (
        <div style={{ overflowX: 'auto', WebkitOverflowScrolling: 'touch' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', minWidth: 600 }}>
            <thead>
              <tr>
                {['Property Address', 'Amount', 'Status', 'Date', 'Actions'].map(h => (
                  <th key={h} style={{
                    textAlign: 'left', padding: '12px 14px',
                    fontSize: 11, fontWeight: 600, letterSpacing: '0.06em',
                    color: '#6b6560', borderBottom: '1px solid #2e3a4d',
                    fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {requests.map(r => {
                const isPastDue = r.status === 'funded' && r.dueDate && new Date(r.dueDate) < new Date()
                return (
                  <tr key={r.id} style={{ borderBottom: '1px solid rgba(61,78,101,0.3)' }}>
                    <td style={{ padding: '14px', color: '#f5f0eb', fontSize: 14, fontFamily: "'DM Sans', sans-serif" }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <Building2 size={14} style={{ color: '#ff7e5f', flexShrink: 0 }} />
                        <span style={{ maxWidth: 220, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {r.propertyAddress}
                        </span>
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#f5f0eb', fontSize: 14, fontFamily: "'DM Sans', sans-serif", fontWeight: 600 }}>
                      ${r.amountRequested.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                        <StatusBadge status={r.status} />
                        {isPastDue && (
                          <span style={{ display: 'flex', alignItems: 'center', gap: 3, color: '#e85c5c', fontSize: 11, fontWeight: 600 }}>
                            <AlertTriangle size={11} /> Overdue
                          </span>
                        )}
                      </div>
                    </td>
                    <td style={{ padding: '14px', color: '#6b6560', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>
                      {new Date(r.createdAt).toLocaleDateString()}
                    </td>
                    <td style={{ padding: '14px' }}>
                      <button
                        onClick={() => onViewRequest(r)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 4,
                          padding: '6px 12px', borderRadius: 6,
                          background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                          color: '#a09890', fontSize: 12, cursor: 'pointer',
                          fontFamily: "'DM Sans', sans-serif",
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,126,95,0.3)'; e.currentTarget.style.color = '#ff7e5f' }}
                        onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.color = '#a09890' }}
                      >
                        <Eye size={12} /> View
                      </button>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}

/* ─── Stat Card ─── */

function StatCard({ icon: Icon, label, value, color }: { icon: typeof Clock; label: string; value: string; color: string }) {
  return (
    <div style={{
      background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
      borderRadius: 10, padding: '18px 16px',
      display: 'flex', alignItems: 'center', gap: 14,
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={18} style={{ color }} />
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 20, fontWeight: 700, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>
          {value}
        </div>
      </div>
    </div>
  )
}

/* ─── Empty State ─── */

function EmptyState({ onNewRequest }: { onNewRequest: () => void }) {
  return (
    <div style={{
      textAlign: 'center', padding: '60px 24px',
      background: 'rgba(255,255,255,0.01)', border: '1px dashed #3d4e65',
      borderRadius: 12,
    }}>
      <Vault size={48} style={{ color: '#3d4e65', marginBottom: 16 }} />
      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 8px', letterSpacing: '0.03em' }}>
        No EMD Requests Yet
      </h3>
      <p style={{ color: '#6b6560', fontSize: 14, fontFamily: "'DM Sans', sans-serif", margin: '0 0 20px', maxWidth: 360, marginInline: 'auto' }}>
        Secure your deals with up to $1,000 in earnest money funding sent directly to the title company.
      </p>
      <button
        onClick={onNewRequest}
        style={{
          display: 'inline-flex', alignItems: 'center', gap: 6,
          padding: '12px 24px', borderRadius: 8,
          background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
          border: 'none', color: '#000',
          fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
          cursor: 'pointer',
        }}
      >
        <Plus size={16} /> Request EMD
      </button>
    </div>
  )
}

/* ─── Request Detail View ─── */

function RequestDetail({ request: r, onBack }: { request: EmdRequest; onBack: () => void }) {
  const [uploading, setUploading] = useState(false)
  const isPastDue = r.status === 'funded' && r.dueDate && new Date(r.dueDate) < new Date()

  async function handleMarkRepaid() {
    setUploading(true)
    try {
      await fetch(`/api/emd?id=${r.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ repaymentProof: 'user-marked-repaid' }),
      })
      onBack()
    } catch {
      // handle error
    } finally {
      setUploading(false)
    }
  }

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: '#a09890',
          fontSize: 14, cursor: 'pointer', marginBottom: 20,
          fontFamily: "'DM Sans', sans-serif", padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back to Vault
      </button>

      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
        borderRadius: 12, overflow: 'hidden',
      }}>
        {/* Header */}
        <div style={{
          padding: '20px 24px',
          background: 'rgba(255,126,95,0.04)',
          borderBottom: '1px solid #2e3a4d',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12,
        }}>
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', margin: '0 0 4px', letterSpacing: '0.03em' }}>
              {r.propertyAddress}
            </h3>
            <span style={{ fontSize: 12, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>
              Requested {new Date(r.createdAt).toLocaleDateString()}
            </span>
          </div>
          <StatusBadge status={r.status} />
        </div>

        {/* Past due warning */}
        {isPastDue && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(232,92,92,0.08)', borderBottom: '1px solid rgba(232,92,92,0.15)',
            padding: '12px 24px',
          }}>
            <AlertTriangle size={16} style={{ color: '#e85c5c' }} />
            <span style={{ color: '#e85c5c', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              This EMD request is past due. Please repay immediately to maintain good standing.
            </span>
          </div>
        )}

        {/* Funded message */}
        {r.status === 'funded' && (
          <div style={{
            display: 'flex', alignItems: 'center', gap: 8,
            background: 'rgba(92,184,133,0.08)', borderBottom: '1px solid rgba(92,184,133,0.15)',
            padding: '12px 24px',
          }}>
            <DollarSign size={16} style={{ color: '#5cb885' }} />
            <span style={{ color: '#5cb885', fontSize: 13, fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>
              Funds sent to title company
            </span>
          </div>
        )}

        {/* Financial Details */}
        <div style={{ padding: '24px' }}>
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
            gap: 16, marginBottom: 24,
          }}>
            <DetailBox label="Amount Requested" value={`$${r.amountRequested.toLocaleString()}`} />
            <DetailBox label="Service Fee" value={`$${r.fee.toLocaleString()}`} />
            <DetailBox label="Total Due" value={`$${r.totalDue.toLocaleString()}`} highlight />
            {r.dueDate && (
              <DetailBox label="Due Date" value={new Date(r.dueDate).toLocaleDateString()} warning={isPastDue || false} />
            )}
          </div>

          {/* Deal Info */}
          <div style={{ marginBottom: 24 }}>
            <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#f5f0eb', margin: '0 0 12px' }}>
              Deal Information
            </h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
              <InfoRow icon={Building2} label="Title Company" value={r.titleCompanyInfo} />
              <InfoRow icon={User} label="Escrow Officer" value={r.escrowOfficerInfo} />
              <InfoRow icon={Landmark} label="Wire Instructions" value={r.wireInstructions} />
            </div>
          </div>

          {/* Actions for funded status */}
          {r.status === 'funded' && (
            <div style={{
              background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
              borderRadius: 10, padding: 20, textAlign: 'center',
            }}>
              <h4 style={{ fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600, color: '#f5f0eb', margin: '0 0 8px' }}>
                Repayment
              </h4>
              <p style={{ fontSize: 13, color: '#6b6560', margin: '0 0 16px', fontFamily: "'DM Sans', sans-serif" }}>
                Once you've sent repayment, mark this request as repaid. An admin will verify and confirm.
              </p>
              <button
                onClick={handleMarkRepaid}
                disabled={uploading}
                style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6,
                  padding: '10px 24px', borderRadius: 8,
                  background: 'linear-gradient(135deg, #5cb885, #3a9b6b)',
                  border: 'none', color: '#000',
                  fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                  cursor: uploading ? 'wait' : 'pointer',
                  opacity: uploading ? 0.7 : 1,
                }}
              >
                <Send size={14} /> {uploading ? 'Submitting...' : 'Mark as Repaid'}
              </button>
            </div>
          )}

          {/* Admin notes */}
          {r.adminNotes && (
            <div style={{
              background: 'rgba(91,163,217,0.06)', border: '1px solid rgba(91,163,217,0.15)',
              borderRadius: 8, padding: '12px 16px', marginTop: 16,
            }}>
              <span style={{ fontSize: 11, fontWeight: 600, color: '#5ba3d9', display: 'block', marginBottom: 4 }}>ADMIN NOTE</span>
              <p style={{ fontSize: 13, color: '#a09890', margin: 0, fontFamily: "'DM Sans', sans-serif" }}>{r.adminNotes}</p>
            </div>
          )}

          {r.status === 'repaid' && r.repaidAt && (
            <div style={{
              background: 'rgba(155,143,255,0.06)', border: '1px solid rgba(155,143,255,0.15)',
              borderRadius: 8, padding: '12px 16px', marginTop: 16,
              display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <CheckCircle size={14} style={{ color: '#9b8fff' }} />
              <span style={{ fontSize: 13, color: '#9b8fff', fontFamily: "'DM Sans', sans-serif" }}>
                Repaid on {new Date(r.repaidAt).toLocaleDateString()}
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

function DetailBox({ label, value, highlight, warning }: { label: string; value: string; highlight?: boolean; warning?: boolean }) {
  return (
    <div style={{
      background: highlight ? 'rgba(255,126,95,0.06)' : 'rgba(255,255,255,0.02)',
      border: `1px solid ${warning ? 'rgba(232,92,92,0.3)' : highlight ? 'rgba(255,126,95,0.15)' : '#2e3a4d'}`,
      borderRadius: 8, padding: '14px 16px',
    }}>
      <div style={{ fontSize: 11, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 4 }}>
        {label}
      </div>
      <div style={{
        fontSize: 18, fontWeight: 700,
        color: warning ? '#e85c5c' : highlight ? '#ff7e5f' : '#f5f0eb',
        fontFamily: "'DM Sans', sans-serif",
      }}>
        {value}
      </div>
    </div>
  )
}

function InfoRow({ icon: Icon, label, value }: { icon: typeof Building2; label: string; value: string }) {
  return (
    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 12px', background: 'rgba(255,255,255,0.01)', borderRadius: 8 }}>
      <Icon size={14} style={{ color: '#6b6560', marginTop: 2, flexShrink: 0 }} />
      <div>
        <div style={{ fontSize: 11, color: '#6b6560', fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{label}</div>
        <div style={{ fontSize: 13, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif", wordBreak: 'break-word' }}>{value}</div>
      </div>
    </div>
  )
}

/* ─── Multi-step Request Form ─── */

function RequestEmdForm({ onBack, onSuccess }: { onBack: () => void; onSuccess: () => void }) {
  const [step, setStep] = useState(1)
  const [deals, setDeals] = useState<PipelineDeal[]>([])
  const [loadingDeals, setLoadingDeals] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  // Form state
  const [selectedDealId, setSelectedDealId] = useState('')
  const [selectedAddress, setSelectedAddress] = useState('')
  const [titleCompanyInfo, setTitleCompanyInfo] = useState('')
  const [escrowOfficerInfo, setEscrowOfficerInfo] = useState('')
  const [wireInstructions, setWireInstructions] = useState('')
  const [purchaseAgreementName, setPurchaseAgreementName] = useState('')
  const [amount, setAmount] = useState('')
  const [agree1, setAgree1] = useState(false)
  const [agree2, setAgree2] = useState(false)
  const [agree3, setAgree3] = useState(false)

  // Fetch deals from pipeline
  useEffect(() => {
    async function loadDeals() {
      try {
        const res = await fetch('/api/pipeline')
        if (res.ok) {
          const data = await res.json()
          const pipeline: PipelineData = data.pipeline || {}
          const allDeals: PipelineDeal[] = []
          for (const stage of Object.keys(pipeline)) {
            for (const deal of pipeline[stage]) {
              allDeals.push(deal)
            }
          }
          setDeals(allDeals)
        }
      } catch {
        // handle error
      } finally {
        setLoadingDeals(false)
      }
    }
    loadDeals()
  }, [])

  function selectDeal(dealId: string) {
    setSelectedDealId(dealId)
    const deal = deals.find(d => d.id === dealId)
    if (deal?.address) setSelectedAddress(deal.address)
    else setSelectedAddress('')
  }

  async function handleSubmit() {
    setError('')
    setSubmitting(true)
    try {
      const res = await fetch('/api/emd', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dealId: selectedDealId,
          propertyAddress: selectedAddress,
          amountRequested: Number(amount),
          titleCompanyInfo,
          escrowOfficerInfo,
          wireInstructions,
          documents: {
            purchaseAgreement: purchaseAgreementName || 'Uploaded',
            titleCompanyInfo: 'Provided',
            escrowOfficerInfo: 'Provided',
            wireInstructions: 'Provided',
          },
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        setError(data.error || 'Something went wrong.')
        return
      }

      onSuccess()
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const canGoNext = () => {
    if (step === 1) return !!selectedDealId && !!selectedAddress
    if (step === 2) return !!titleCompanyInfo && !!escrowOfficerInfo && !!wireInstructions
    if (step === 3) return Number(amount) > 0 && Number(amount) <= 1000
    if (step === 4) return agree1 && agree2 && agree3
    return false
  }

  const STEPS = [
    { num: 1, label: 'Select Deal' },
    { num: 2, label: 'Documents' },
    { num: 3, label: 'Amount' },
    { num: 4, label: 'Agreement' },
  ]

  return (
    <div>
      <button
        onClick={onBack}
        style={{
          display: 'flex', alignItems: 'center', gap: 6,
          background: 'none', border: 'none', color: '#a09890',
          fontSize: 14, cursor: 'pointer', marginBottom: 20,
          fontFamily: "'DM Sans', sans-serif", padding: 0,
        }}
      >
        <ArrowLeft size={16} /> Back to Vault
      </button>

      {/* Step indicator */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        gap: 4, marginBottom: 28, flexWrap: 'wrap',
      }}>
        {STEPS.map((s, i) => (
          <div key={s.num} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 12px', borderRadius: 20,
              background: step === s.num ? 'rgba(255,126,95,0.12)' : step > s.num ? 'rgba(92,184,133,0.12)' : 'rgba(255,255,255,0.03)',
              border: `1px solid ${step === s.num ? 'rgba(255,126,95,0.3)' : step > s.num ? 'rgba(92,184,133,0.2)' : '#2e3a4d'}`,
            }}>
              <span style={{
                width: 20, height: 20, borderRadius: '50%',
                background: step > s.num ? '#5cb885' : step === s.num ? '#ff7e5f' : '#3d4e65',
                color: step >= s.num ? '#000' : '#6b6560',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 11, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              }}>
                {step > s.num ? '✓' : s.num}
              </span>
              <span style={{
                fontSize: 12, fontWeight: step === s.num ? 600 : 400,
                color: step === s.num ? '#ff7e5f' : step > s.num ? '#5cb885' : '#6b6560',
                fontFamily: "'DM Sans', sans-serif",
                display: 'none',
              }} className="step-label-text">
                {s.label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div style={{ width: 20, height: 1, background: step > s.num ? '#5cb885' : '#3d4e65' }} />
            )}
          </div>
        ))}
      </div>

      <style>{`@media (min-width: 600px) { .step-label-text { display: inline !important; } }`}</style>

      {/* Form card */}
      <div style={{
        background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
        borderRadius: 12, padding: '28px 24px',
        maxWidth: 600, margin: '0 auto',
      }}>
        {/* Step 1: Select Deal */}
        {step === 1 && (
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 4px', letterSpacing: '0.03em' }}>
              Select a Deal
            </h3>
            <p style={{ fontSize: 13, color: '#6b6560', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif" }}>
              Choose a deal from your CRM pipeline to tie this EMD request to.
            </p>

            {loadingDeals ? (
              <div style={{ padding: 20, textAlign: 'center', color: '#6b6560' }}>Loading deals...</div>
            ) : deals.length === 0 ? (
              <div style={{
                padding: 20, textAlign: 'center',
                background: 'rgba(232,164,74,0.06)', border: '1px solid rgba(232,164,74,0.15)',
                borderRadius: 8,
              }}>
                <p style={{ color: '#e8a44a', fontSize: 13, margin: 0, fontFamily: "'DM Sans', sans-serif" }}>
                  No deals found in your pipeline. Add a deal to your CRM first.
                </p>
              </div>
            ) : (
              <>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#a09890', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, display: 'block' }}>
                  Select Deal
                </label>
                <select
                  value={selectedDealId}
                  onChange={e => selectDeal(e.target.value)}
                  style={{
                    width: '100%', padding: '12px 14px',
                    background: '#1a1f28', border: '1px solid #3d4e65',
                    borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                    fontFamily: "'DM Sans', sans-serif",
                    appearance: 'none', cursor: 'pointer',
                  }}
                >
                  <option value="">— Choose a deal —</option>
                  {deals.map(d => (
                    <option key={d.id} value={d.id}>{d.name}{d.address ? ` — ${d.address}` : ''}</option>
                  ))}
                </select>

                {selectedDealId && (
                  <div style={{ marginTop: 16 }}>
                    <label style={{ fontSize: 12, fontWeight: 600, color: '#a09890', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, display: 'block' }}>
                      Property Address
                    </label>
                    <input
                      value={selectedAddress}
                      onChange={e => setSelectedAddress(e.target.value)}
                      placeholder="Enter property address"
                      style={{
                        width: '100%', padding: '12px 14px',
                        background: '#1a1f28', border: '1px solid #3d4e65',
                        borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                        fontFamily: "'DM Sans', sans-serif",
                        boxSizing: 'border-box',
                      }}
                    />
                  </div>
                )}
              </>
            )}
          </div>
        )}

        {/* Step 2: Documents & Info */}
        {step === 2 && (
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 4px', letterSpacing: '0.03em' }}>
              Documents & Info
            </h3>
            <p style={{ fontSize: 13, color: '#6b6560', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif" }}>
              Provide title company details and upload your purchase agreement.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              {/* Purchase Agreement upload */}
              <div>
                <label style={{ fontSize: 12, fontWeight: 600, color: '#a09890', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, display: 'block' }}>
                  Purchase Agreement <span style={{ color: '#e85c5c' }}>*</span>
                </label>
                <div
                  style={{
                    padding: '16px', borderRadius: 8, textAlign: 'center',
                    border: '1px dashed #3d4e65', background: 'rgba(255,255,255,0.01)',
                    cursor: 'pointer',
                  }}
                  onClick={() => {
                    // Simulate file selection
                    setPurchaseAgreementName('purchase-agreement.pdf')
                  }}
                >
                  {purchaseAgreementName ? (
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, color: '#5cb885' }}>
                      <FileText size={16} />
                      <span style={{ fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}>{purchaseAgreementName}</span>
                    </div>
                  ) : (
                    <div>
                      <Upload size={20} style={{ color: '#6b6560', marginBottom: 4 }} />
                      <div style={{ fontSize: 12, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>
                        Click to upload purchase agreement
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <FormTextarea label="Title Company Info" value={titleCompanyInfo} onChange={setTitleCompanyInfo} placeholder="Enter title company name, address, phone..." required />
              <FormTextarea label="Escrow Officer Info" value={escrowOfficerInfo} onChange={setEscrowOfficerInfo} placeholder="Enter escrow officer name, email, phone..." required />
              <FormTextarea label="Wire Instructions" value={wireInstructions} onChange={setWireInstructions} placeholder="Enter wire routing, account number, beneficiary..." required />
            </div>
          </div>
        )}

        {/* Step 3: Amount */}
        {step === 3 && (
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 4px', letterSpacing: '0.03em' }}>
              Enter Amount
            </h3>
            <p style={{ fontSize: 13, color: '#6b6560', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif" }}>
              How much earnest money do you need? (Maximum $1,000)
            </p>

            <div style={{ position: 'relative', marginBottom: 16 }}>
              <span style={{
                position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)',
                color: '#ff7e5f', fontSize: 20, fontWeight: 700, fontFamily: "'DM Sans', sans-serif",
              }}>$</span>
              <input
                type="number"
                min="1"
                max="1000"
                value={amount}
                onChange={e => {
                  const val = e.target.value
                  if (Number(val) <= 1000) setAmount(val)
                }}
                placeholder="0"
                style={{
                  width: '100%', padding: '16px 14px 16px 36px',
                  background: '#1a1f28', border: '1px solid #3d4e65',
                  borderRadius: 8, color: '#f5f0eb', fontSize: 24, fontWeight: 700,
                  fontFamily: "'DM Sans', sans-serif",
                  boxSizing: 'border-box',
                }}
              />
            </div>

            {Number(amount) > 0 && (
              <div style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
                borderRadius: 8, padding: 16,
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>EMD Amount</span>
                  <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>${Number(amount).toLocaleString()}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                  <span style={{ fontSize: 13, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>Service Fee</span>
                  <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}>$150</span>
                </div>
                <div style={{ height: 1, background: '#2e3a4d', margin: '8px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 14, color: '#ff7e5f', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>Total Due at Repayment</span>
                  <span style={{ fontSize: 14, color: '#ff7e5f', fontWeight: 700, fontFamily: "'DM Sans', sans-serif" }}>${(Number(amount) + 150).toLocaleString()}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Step 4: Agreement */}
        {step === 4 && (
          <div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 4px', letterSpacing: '0.03em' }}>
              Agreement
            </h3>
            <p style={{ fontSize: 13, color: '#6b6560', margin: '0 0 20px', fontFamily: "'DM Sans', sans-serif" }}>
              Please review and agree to the following terms before submitting.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              <CheckboxItem
                checked={agree1}
                onChange={setAgree1}
                label="I agree to repay the full amount plus fee within 30 days of funding or at closing, whichever comes first."
              />
              <CheckboxItem
                checked={agree2}
                onChange={setAgree2}
                label="I confirm this is a real deal under contract and the information provided is accurate."
              />
              <CheckboxItem
                checked={agree3}
                onChange={setAgree3}
                label="I understand that a $150 service fee applies and funds will be sent directly to the title company."
              />
            </div>

            {/* Summary */}
            <div style={{
              background: 'rgba(255,126,95,0.04)', border: '1px solid rgba(255,126,95,0.15)',
              borderRadius: 8, padding: 16, marginTop: 20,
            }}>
              <div style={{ fontSize: 12, fontWeight: 600, color: '#ff7e5f', marginBottom: 8, fontFamily: "'DM Sans', sans-serif", textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Request Summary
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                <SummaryRow label="Property" value={selectedAddress} />
                <SummaryRow label="Amount" value={`$${Number(amount).toLocaleString()}`} />
                <SummaryRow label="Fee" value="$150" />
                <SummaryRow label="Total Due" value={`$${(Number(amount) + 150).toLocaleString()}`} />
              </div>
            </div>

            {error && (
              <div style={{
                marginTop: 16, padding: '10px 14px', borderRadius: 8,
                background: 'rgba(232,92,92,0.08)', border: '1px solid rgba(232,92,92,0.2)',
                color: '#e85c5c', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              }}>
                {error}
              </div>
            )}
          </div>
        )}

        {/* Navigation buttons */}
        <div style={{
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          marginTop: 28, gap: 12,
        }}>
          {step > 1 ? (
            <button
              onClick={() => setStep(step - 1)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 18px', borderRadius: 8,
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                color: '#a09890', fontSize: 14, cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              <ChevronLeft size={16} /> Back
            </button>
          ) : <div />}

          {step < 4 ? (
            <button
              onClick={() => setStep(step + 1)}
              disabled={!canGoNext()}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 20px', borderRadius: 8,
                background: canGoNext() ? 'linear-gradient(135deg, #ff7e5f, #e86830)' : '#3d4e65',
                border: 'none',
                color: canGoNext() ? '#000' : '#6b6560',
                fontSize: 14, fontWeight: 600, cursor: canGoNext() ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              Next <ChevronRight size={16} />
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={!canGoNext() || submitting}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 24px', borderRadius: 8,
                background: canGoNext() && !submitting ? 'linear-gradient(135deg, #ff7e5f, #e86830)' : '#3d4e65',
                border: 'none',
                color: canGoNext() && !submitting ? '#000' : '#6b6560',
                fontSize: 14, fontWeight: 600,
                cursor: canGoNext() && !submitting ? 'pointer' : 'not-allowed',
                fontFamily: "'DM Sans', sans-serif",
              }}
            >
              {submitting ? 'Submitting...' : 'Submit Request'}
            </button>
          )}
        </div>
      </div>
    </div>
  )
}

function FormTextarea({ label, value, onChange, placeholder, required }: {
  label: string; value: string; onChange: (v: string) => void; placeholder: string; required?: boolean
}) {
  return (
    <div>
      <label style={{ fontSize: 12, fontWeight: 600, color: '#a09890', fontFamily: "'DM Sans', sans-serif", marginBottom: 6, display: 'block' }}>
        {label} {required && <span style={{ color: '#e85c5c' }}>*</span>}
      </label>
      <textarea
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        rows={3}
        style={{
          width: '100%', padding: '12px 14px',
          background: '#1a1f28', border: '1px solid #3d4e65',
          borderRadius: 8, color: '#f5f0eb', fontSize: 14,
          fontFamily: "'DM Sans', sans-serif", resize: 'vertical',
          boxSizing: 'border-box',
        }}
      />
    </div>
  )
}

function CheckboxItem({ checked, onChange, label }: { checked: boolean; onChange: (v: boolean) => void; label: string }) {
  return (
    <label style={{
      display: 'flex', alignItems: 'flex-start', gap: 10,
      padding: '12px 14px', borderRadius: 8,
      background: checked ? 'rgba(92,184,133,0.06)' : 'rgba(255,255,255,0.01)',
      border: `1px solid ${checked ? 'rgba(92,184,133,0.2)' : '#2e3a4d'}`,
      cursor: 'pointer', transition: 'all 0.2s',
    }}>
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        style={{ accentColor: '#5cb885', marginTop: 2, flexShrink: 0 }}
      />
      <span style={{ fontSize: 13, color: checked ? '#f5f0eb' : '#a09890', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.5 }}>
        {label}
      </span>
    </label>
  )
}

function SummaryRow({ label, value }: { label: string; value: string }) {
  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: 13, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>{label}</span>
      <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 500, fontFamily: "'DM Sans', sans-serif" }}>{value}</span>
    </div>
  )
}
