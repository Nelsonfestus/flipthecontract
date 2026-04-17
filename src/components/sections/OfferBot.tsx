import { useState, useCallback, useRef } from 'react'

/* ------------------------------------------------------------------ */
/*  Types                                                              */
/* ------------------------------------------------------------------ */

interface RepairItem {
  name: string
  low: number
  high: number
}

interface OfferData {
  letter: string
  sms: string
  smsFollowup: string
  emailSubject: string
  email: string
  analysis: string
  dealStrength: 'Strong' | 'Moderate' | 'Weak'
  profitPotential: 'High' | 'Medium' | 'Low'
  sellerMotivation: 'High' | 'Medium' | 'Low'
  recommendation: string
}

interface Lead {
  id: number
  addr: string
  city: string
  seller: string
  phone: string
  arv: number
  repairs: number
  mao: number
  score: string
  status: 'pending' | 'generating' | 'ready' | 'sent'
  offer: OfferData | null
  checked: boolean
}

type ModalTab = 'letter' | 'sms' | 'email' | 'repairs' | 'analysis'

/* ------------------------------------------------------------------ */
/*  Constants                                                          */
/* ------------------------------------------------------------------ */

const REPAIRS: RepairItem[] = [
  { name: 'Roof', low: 8000, high: 18000 },
  { name: 'HVAC', low: 4000, high: 12000 },
  { name: 'Plumbing', low: 2000, high: 8000 },
  { name: 'Electrical', low: 3000, high: 10000 },
  { name: 'Kitchen', low: 5000, high: 20000 },
  { name: 'Bathrooms', low: 3000, high: 12000 },
  { name: 'Flooring', low: 4000, high: 12000 },
  { name: 'Windows', low: 2000, high: 8000 },
  { name: 'Foundation', low: 5000, high: 25000 },
  { name: 'Paint (Int/Ext)', low: 2000, high: 6000 },
]

const SAMPLE_LEADS: Omit<Lead, 'mao' | 'score'>[] = [
  { id: 1, addr: '2847 Elmwood Ave', city: 'Detroit, MI 48206', seller: 'Linda Martinez', phone: '(313) 555-0191', arv: 95000, repairs: 18000, status: 'pending', offer: null, checked: false },
  { id: 2, addr: '1204 Oak Street', city: 'Cleveland, OH 44108', seller: 'Robert Johnson', phone: '(216) 555-0147', arv: 72000, repairs: 12000, status: 'pending', offer: null, checked: false },
  { id: 3, addr: '5519 Maple Drive', city: 'Memphis, TN 38118', seller: 'Sandra Williams', phone: '(901) 555-0283', arv: 110000, repairs: 25000, status: 'pending', offer: null, checked: false },
  { id: 4, addr: '3301 Pine Blvd', city: 'Atlanta, GA 30310', seller: 'Marcus Davis', phone: '(404) 555-0362', arv: 145000, repairs: 30000, status: 'pending', offer: null, checked: false },
  { id: 5, addr: '788 Birch Lane', city: 'Houston, TX 77051', seller: 'Patricia Moore', phone: '(713) 555-0419', arv: 88000, repairs: 15000, status: 'pending', offer: null, checked: false },
  { id: 6, addr: '4420 Cedar Court', city: 'Indianapolis, IN 46201', seller: 'James Wilson', phone: '(317) 555-0534', arv: 65000, repairs: 8000, status: 'pending', offer: null, checked: false },
  { id: 7, addr: '1650 Walnut Way', city: 'Kansas City, MO 64106', seller: 'Dorothy Thompson', phone: '(816) 555-0678', arv: 78000, repairs: 20000, status: 'pending', offer: null, checked: false },
  { id: 8, addr: '2230 Sycamore St', city: 'Birmingham, AL 35203', seller: 'Charles Anderson', phone: '(205) 555-0712', arv: 52000, repairs: 5000, status: 'pending', offer: null, checked: false },
]

/* ------------------------------------------------------------------ */
/*  Helpers                                                            */
/* ------------------------------------------------------------------ */

function calcMAO(arv: number, repairs: number, arvPct: number, fee: number, closingCosts: number): number {
  return Math.max(0, Math.round((arv * (arvPct / 100)) - repairs - fee - closingCosts))
}

function calcScore(arv: number, repairs: number, mao: number): string {
  const repairRatio = repairs / arv
  if (mao > 25000 && repairRatio < 0.25) return 'A'
  if (mao > 15000 && repairRatio < 0.35) return 'B'
  if (mao > 8000 && repairRatio < 0.45) return 'C'
  if (mao > 0) return 'D'
  return 'F'
}

function fmtMoney(n: number): string {
  if (n >= 1000000) return '$' + (n / 1000000).toFixed(1) + 'M'
  if (n >= 1000) return '$' + Math.round(n / 1000) + 'K'
  return '$' + n
}

function fmtMoneyFull(n: number): string {
  return '$' + n.toLocaleString()
}

function buildLocalOffer(lead: Lead, buyerName: string, buyerPhone: string, buyerEmail: string, closing: string, expiry: string): OfferData {
  const firstName = lead.seller.split(' ')[0]
  const today = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })
  const refId = 'FTC-' + String(lead.id).slice(-4).padStart(4, '0')

  return {
    letter: `<div class="letter-header"><span>${today}</span><span>Ref: ${refId}</span></div>
<p>Dear ${lead.seller},</p>
<p>I am writing to present a formal cash purchase offer of <strong class="offer-amt">${fmtMoneyFull(lead.mao)}</strong> for your property located at <strong>${lead.addr}, ${lead.city}</strong>.</p>
<p>This is a firm, as-is cash offer with no contingencies. You will not need to make any repairs, pay any agent commissions, or cover any closing costs. We handle everything.</p>
<p>Key terms of this offer:</p>
<p>&bull; <strong>Purchase Price:</strong> ${fmtMoneyFull(lead.mao)} cash, as-is condition<br/>
&bull; <strong>Closing Timeline:</strong> ${closing} from acceptance<br/>
&bull; <strong>Earnest Money Deposit:</strong> $1,000 deposited within 3 business days<br/>
&bull; <strong>No Repairs Required:</strong> Property purchased in current condition<br/>
&bull; <strong>No Commissions:</strong> No real estate agent fees<br/>
&bull; <strong>Seller Closing Costs:</strong> Paid by buyer</p>
<p>This offer is valid for <strong>${expiry}</strong> from the date of this letter. After that time, we reserve the right to modify or withdraw this offer.</p>
<p>If you have any questions or would like to discuss this offer, please don&rsquo;t hesitate to reach out directly.</p>
<div class="sig-block">
<strong>${buyerName}</strong><br/>
Flip The Contract<br/>
${buyerPhone} | ${buyerEmail}
</div>`,
    sms: `Hi ${firstName}, cash offer of ${fmtMoneyFull(lead.mao)} for ${lead.addr}. As-is, close in ${closing}. Call ${buyerPhone}`,
    smsFollowup: `Hey ${firstName}, following up on my offer for ${lead.addr}. Still interested? Happy to answer questions - ${buyerName}`,
    emailSubject: `Cash Offer: ${lead.addr} — ${fmtMoneyFull(lead.mao)}`,
    email: `Hi ${lead.seller},\n\nI hope this message finds you well. I'm reaching out regarding your property at ${lead.addr}, ${lead.city}.\n\nI'd like to present a cash offer of ${fmtMoneyFull(lead.mao)} for the property in its current as-is condition.\n\nHere's what makes this offer stand out:\n• All cash — no financing delays\n• As-is purchase — no repairs needed\n• We cover closing costs\n• Close in as little as ${closing}\n\nThis offer is valid for ${expiry}. I'd love to discuss this with you at your convenience.\n\nBest regards,\n${buyerName}\nFlip The Contract\n${buyerPhone}\n${buyerEmail}`,
    analysis: `At ${fmtMoneyFull(lead.mao)}, this offer represents ${Math.round((lead.mao / lead.arv) * 100)}% of the ARV (${fmtMoneyFull(lead.arv)}), factoring in ${fmtMoneyFull(lead.repairs)} in estimated repairs. This provides the seller a fast, hassle-free exit while maintaining healthy investor margins.`,
    dealStrength: lead.mao > 20000 ? 'Strong' : lead.mao > 10000 ? 'Moderate' : 'Weak',
    profitPotential: lead.mao > 25000 ? 'High' : lead.mao > 12000 ? 'Medium' : 'Low',
    sellerMotivation: 'Medium',
    recommendation: lead.mao > 20000 ? 'Strong deal — submit offer immediately and follow up within 24 hours.' : lead.mao > 10000 ? 'Decent margins — follow up within 48 hours to gauge seller motivation.' : 'Thin deal — consider negotiating repairs down or increasing ARV estimate.',
  }
}

/* ------------------------------------------------------------------ */
/*  Styles (inline to match the app pattern)                           */
/* ------------------------------------------------------------------ */

const s = {
  wrap: { display: 'flex', gap: 0, height: '100%', minHeight: 'calc(100vh - 240px)', background: '#1e2530', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(47,58,74,0.5)' } as React.CSSProperties,
  // Settings Panel
  sp: { width: 320, borderRight: '1px solid rgba(47,58,74,0.5)', overflowY: 'auto', flexShrink: 0, background: '#1a2030' } as React.CSSProperties,
  spSection: { borderBottom: '1px solid rgba(47,58,74,0.4)' } as React.CSSProperties,
  spHeader: { padding: '14px 18px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', cursor: 'pointer', userSelect: 'none' } as React.CSSProperties,
  spTitle: { fontSize: 12, fontWeight: 700, color: '#9a918a', textTransform: 'uppercase', letterSpacing: '0.08em', display: 'flex', alignItems: 'center', gap: 8 } as React.CSSProperties,
  spBody: { padding: '0 18px 16px' } as React.CSSProperties,
  field: { marginBottom: 10 } as React.CSSProperties,
  fieldLast: { marginBottom: 0 } as React.CSSProperties,
  label: { display: 'block', fontSize: 11, fontWeight: 600, color: '#7a716a', marginBottom: 5, letterSpacing: '0.02em' } as React.CSSProperties,
  input: { width: '100%', background: 'rgba(30,37,48,0.8)', border: '1px solid rgba(47,58,74,0.6)', color: '#f5f0eb', padding: '8px 12px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none' } as React.CSSProperties,
  fieldRow: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 } as React.CSSProperties,
  fieldHint: { fontSize: 11, color: '#5a524c', marginTop: 4, lineHeight: 1.5 } as React.CSSProperties,
  bidBox: { background: 'rgba(30,37,48,0.6)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 10, padding: 14, marginTop: 12 } as React.CSSProperties,
  bidFormula: { fontFamily: "'Courier Prime', monospace", fontSize: 11, color: '#7a716a', lineHeight: 2.2 } as React.CSSProperties,
  bidResult: { marginTop: 10, paddingTop: 10, borderTop: '1px solid rgba(47,58,74,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 } as React.CSSProperties,
  bidVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ff7e5f', letterSpacing: '0.04em' } as React.CSSProperties,
  toggleItem: { display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(47,58,74,0.3)' } as React.CSSProperties,
  toggleName: { fontSize: 13, color: '#f5f0eb', fontWeight: 500 } as React.CSSProperties,
  toggleDesc: { fontSize: 11, color: '#5a524c', marginTop: 2 } as React.CSSProperties,
  // Leads Panel
  lp: { flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', minWidth: 0 } as React.CSSProperties,
  statsRow: { display: 'flex', gap: 0, borderBottom: '1px solid rgba(47,58,74,0.5)', background: '#1a2030', flexShrink: 0, flexWrap: 'wrap' } as React.CSSProperties,
  statCol: { flex: 1, padding: '12px 16px', borderRight: '1px solid rgba(47,58,74,0.4)', textAlign: 'center', minWidth: 80 } as React.CSSProperties,
  statNum: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 } as React.CSSProperties,
  statLbl: { fontSize: 10, fontFamily: "'Courier Prime', monospace", color: '#5a524c', letterSpacing: '0.08em', textTransform: 'uppercase' } as React.CSSProperties,
  toolbar: { padding: '10px 16px', borderBottom: '1px solid rgba(47,58,74,0.5)', display: 'flex', alignItems: 'center', gap: 8, background: '#1a2030', flexWrap: 'wrap', flexShrink: 0 } as React.CSSProperties,
  searchBox: { background: 'rgba(30,37,48,0.8)', border: '1px solid rgba(47,58,74,0.5)', color: '#f5f0eb', padding: '7px 12px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none', width: 200, maxWidth: '100%' } as React.CSSProperties,
  filterSelect: { background: 'rgba(30,37,48,0.8)', border: '1px solid rgba(47,58,74,0.5)', color: '#9a918a', padding: '7px 12px', borderRadius: 8, fontFamily: "'DM Sans', sans-serif", fontSize: 12, outline: 'none', cursor: 'pointer' } as React.CSSProperties,
  tableWrap: { flex: 1, overflowY: 'auto', overflowX: 'auto' } as React.CSSProperties,
  th: { padding: '10px 14px', textAlign: 'left', fontSize: 11, fontWeight: 700, color: '#5a524c', textTransform: 'uppercase', letterSpacing: '0.08em', borderBottom: '1px solid rgba(47,58,74,0.5)', background: '#1a2030', whiteSpace: 'nowrap', position: 'sticky', top: 0, zIndex: 5 } as React.CSSProperties,
  td: { padding: '10px 14px', verticalAlign: 'middle', borderBottom: '1px solid rgba(47,58,74,0.25)' } as React.CSSProperties,
  footer: { padding: '10px 16px', borderTop: '1px solid rgba(47,58,74,0.5)', background: '#1a2030', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10, flexShrink: 0 } as React.CSSProperties,
  // Offer Modal
  modalBg: { position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', zIndex: 500, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 16, backdropFilter: 'blur(4px)' } as React.CSSProperties,
  modal: { background: '#1e2530', border: '1px solid rgba(47,58,74,0.6)', borderRadius: 14, width: '100%', maxWidth: 740, maxHeight: '90vh', display: 'flex', flexDirection: 'column', animation: 'fadeIn 0.2s ease' } as React.CSSProperties,
  modalTop: { background: '#1a2030', borderBottom: '1px solid rgba(47,58,74,0.5)', padding: '16px 22px', display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexShrink: 0, borderRadius: '14px 14px 0 0' } as React.CSSProperties,
  modalTitle: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.06em', color: '#f5f0eb', marginBottom: 2 } as React.CSSProperties,
  modalSub: { fontSize: 12, color: '#ff7e5f', fontFamily: "'Courier Prime', monospace" } as React.CSSProperties,
  modalTabs: { display: 'flex', gap: 4, padding: '12px 22px 0', borderBottom: '1px solid rgba(47,58,74,0.5)', background: '#1a2030', flexShrink: 0, flexWrap: 'wrap' } as React.CSSProperties,
  modalTab: (active: boolean) => ({ padding: '8px 14px', fontSize: 12, fontWeight: 500, color: active ? '#f5f0eb' : '#7a716a', cursor: 'pointer', borderRadius: '8px 8px 0 0', borderBottom: active ? '2px solid #ff7e5f' : '2px solid transparent', background: 'transparent', border: 'none', transition: 'all 0.15s', whiteSpace: 'nowrap' }) as React.CSSProperties,
  modalBody: { flex: 1, overflowY: 'auto', padding: 22 } as React.CSSProperties,
  modalFooter: { background: '#1a2030', borderTop: '1px solid rgba(47,58,74,0.5)', padding: '12px 22px', display: 'flex', justifyContent: 'flex-end', gap: 8, flexShrink: 0, borderRadius: '0 0 14px 14px' } as React.CSSProperties,
  // Contract Paper
  paper: { background: '#FAFAF8', color: '#1a1a1a', borderRadius: 10, padding: '28px 32px', fontFamily: "'Georgia', serif", fontSize: 13, lineHeight: 1.9, position: 'relative', overflow: 'hidden' } as React.CSSProperties,
  paperWatermark: { position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%,-50%) rotate(-25deg)', fontFamily: "'Bebas Neue', sans-serif", fontSize: 130, color: 'rgba(255,126,95,0.06)', letterSpacing: 10, pointerEvents: 'none' } as React.CSSProperties,
  // Score badge
  scoreBadge: (grade: string) => {
    const colors: Record<string, { color: string; border: string; bg: string }> = {
      A: { color: '#5cb885', border: 'rgba(92,184,133,0.5)', bg: 'rgba(92,184,133,0.1)' },
      B: { color: '#5ba3d9', border: 'rgba(91,163,217,0.5)', bg: 'rgba(91,163,217,0.1)' },
      C: { color: '#e8a44a', border: 'rgba(232,164,74,0.5)', bg: 'rgba(232,164,74,0.1)' },
      D: { color: '#7a716a', border: 'rgba(47,58,74,0.5)', bg: 'rgba(47,58,74,0.3)' },
      F: { color: '#ef4444', border: 'rgba(239,68,68,0.4)', bg: 'rgba(239,68,68,0.1)' },
    }
    const c = colors[grade] || colors.D
    return { width: 36, height: 36, borderRadius: '50%', display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, letterSpacing: '0.04em', border: `2px solid ${c.border}`, color: c.color, background: c.bg, flexShrink: 0 } as React.CSSProperties
  },
  // Status badge
  statusBadge: (status: string) => {
    const map: Record<string, { color: string; bg: string; border: string }> = {
      pending: { color: '#9a918a', bg: 'rgba(47,58,74,0.4)', border: 'rgba(47,58,74,0.6)' },
      generating: { color: '#ff7e5f', bg: 'rgba(255,126,95,0.1)', border: 'rgba(255,126,95,0.3)' },
      ready: { color: '#5cb885', bg: 'rgba(92,184,133,0.1)', border: 'rgba(92,184,133,0.3)' },
      sent: { color: '#5ba3d9', bg: 'rgba(91,163,217,0.1)', border: 'rgba(91,163,217,0.3)' },
    }
    const c = map[status] || map.pending
    return { display: 'inline-flex', alignItems: 'center', gap: 6, padding: '3px 10px', borderRadius: 12, fontSize: 11, fontWeight: 500, whiteSpace: 'nowrap', background: c.bg, color: c.color, border: `1px solid ${c.border}` } as React.CSSProperties
  },
  statusDot: (status: string) => {
    const map: Record<string, string> = { pending: '#9a918a', generating: '#ff7e5f', ready: '#5cb885', sent: '#5ba3d9' }
    return { width: 6, height: 6, borderRadius: '50%', flexShrink: 0, background: map[status] || '#9a918a', animation: status === 'generating' ? 'pulse 0.8s infinite' : 'none' } as React.CSSProperties
  },
  inlineInput: { background: 'transparent', border: '1px solid transparent', color: '#f5f0eb', padding: '5px 8px', borderRadius: 6, fontFamily: "'DM Sans', sans-serif", fontSize: 13, outline: 'none', width: '100%' } as React.CSSProperties,
  maoCell: (mao: number) => ({ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, letterSpacing: '0.04em', color: mao > 0 ? '#ff7e5f' : mao < 0 ? '#ef4444' : '#5a524c' }) as React.CSSProperties,
  addRow: { padding: '12px 16px', background: 'rgba(91,163,217,0.06)', borderBottom: '1px dashed rgba(91,163,217,0.25)', display: 'flex', gap: 8, alignItems: 'flex-end', flexWrap: 'wrap' } as React.CSSProperties,
  scriptBlock: { background: 'rgba(30,37,48,0.6)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 10, padding: 18, fontSize: 13, lineHeight: 1.8, color: '#f5f0eb' } as React.CSSProperties,
  scriptLabel: { fontFamily: "'Courier Prime', monospace", fontSize: 10, letterSpacing: '0.12em', color: '#ff7e5f', textTransform: 'uppercase', marginBottom: 10 } as React.CSSProperties,
  subjectLine: { background: 'rgba(46,58,77,0.5)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 8, padding: '8px 14px', fontSize: 12, color: '#ff7e5f', fontFamily: "'Courier Prime', monospace", marginBottom: 14 } as React.CSSProperties,
  offerNums: { display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 18 } as React.CSSProperties,
  onItem: { background: 'rgba(30,37,48,0.6)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 10, padding: 12, textAlign: 'center' } as React.CSSProperties,
  onVal: { fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 } as React.CSSProperties,
  onLbl: { fontSize: 10, fontFamily: "'Courier Prime', monospace", color: '#5a524c', textTransform: 'uppercase', letterSpacing: '0.08em' } as React.CSSProperties,
  analysisGrid: { display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 18 } as React.CSSProperties,
  agItem: { background: 'rgba(30,37,48,0.6)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 10, padding: 14 } as React.CSSProperties,
  agLabel: { fontSize: 10, fontFamily: "'Courier Prime', monospace", color: '#5a524c', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 } as React.CSSProperties,
  repairItem: { background: 'rgba(30,37,48,0.6)', border: '1px solid rgba(47,58,74,0.5)', borderRadius: 8, padding: 10, display: 'flex', alignItems: 'center', justifyContent: 'space-between' } as React.CSSProperties,
  repairTotal: { marginTop: 12, background: 'rgba(255,126,95,0.08)', border: '1px solid rgba(255,126,95,0.25)', borderRadius: 10, padding: '12px 16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' } as React.CSSProperties,
  progressToast: { position: 'fixed', bottom: 24, right: 24, background: '#1e2530', border: '1px solid rgba(47,58,74,0.6)', borderRadius: 12, padding: '16px 20px', width: 320, boxShadow: '0 8px 32px rgba(0,0,0,0.5)', zIndex: 999 } as React.CSSProperties,
}

/* ------------------------------------------------------------------ */
/*  Toggle Component                                                   */
/* ------------------------------------------------------------------ */

function Toggle({ on, onChange }: { on: boolean; onChange: (v: boolean) => void }) {
  return (
    <button
      type="button"
      onClick={() => onChange(!on)}
      style={{
        width: 38, height: 22, background: on ? '#5cb885' : 'rgba(47,58,74,0.6)',
        borderRadius: 11, cursor: 'pointer', position: 'relative', transition: 'background 0.2s',
        border: 'none', flexShrink: 0,
      }}
    >
      <span style={{
        position: 'absolute', top: 3, left: on ? 19 : 3,
        width: 16, height: 16, background: '#fff', borderRadius: '50%', transition: 'left 0.2s',
      }} />
    </button>
  )
}

/* ------------------------------------------------------------------ */
/*  Main Component                                                     */
/* ------------------------------------------------------------------ */

export default function DealMaker() {
  // Settings state
  const [buyerName, setBuyerName] = useState('Demetrius Drew')
  const [buyerPhone, setBuyerPhone] = useState('')
  const [buyerEmail, setBuyerEmail] = useState('')
  const [arvPct, setArvPct] = useState(70)
  const [myFee, setMyFee] = useState(10000)
  const [closingCosts, setClosingCosts] = useState(2500)
  const [offerStyle, setOfferStyle] = useState('professional')
  const [offerExpiry, setOfferExpiry] = useState('48 Hours')
  const [closingTime, setClosingTime] = useState('14–21 Days')
  const [contractTemplate, setContractTemplate] = useState('Standard Purchase Agreement')
  const [togRepeat, setTogRepeat] = useState(false)
  const [togIncrease, setTogIncrease] = useState(false)
  const [togRepair, setTogRepair] = useState(true)
  const [togSMS, setTogSMS] = useState(true)

  // Leads state
  const [leads, setLeads] = useState<Lead[]>([])
  const [filterText, setFilterText] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [sortBy, setSortBy] = useState('score')
  const [showAddRow, setShowAddRow] = useState(false)
  const [showSettingsPanel, setShowSettingsPanel] = useState(true)

  // Add lead form
  const [newAddr, setNewAddr] = useState('')
  const [newSeller, setNewSeller] = useState('')
  const [newArv, setNewArv] = useState('')
  const [newRepairs, setNewRepairs] = useState('')
  const [newPhone, setNewPhone] = useState('')

  // Modal state
  const [modalOpen, setModalOpen] = useState(false)
  const [currentLead, setCurrentLead] = useState<Lead | null>(null)
  const [modalTab, setModalTab] = useState<ModalTab>('letter')
  const [repairChecked, setRepairChecked] = useState<boolean[]>(REPAIRS.map((_, i) => i < 4))

  // Progress state
  const [progressVisible, setProgressVisible] = useState(false)
  const [progressPct, setProgressPct] = useState(0)
  const [progressText, setProgressText] = useState('')

  // Copy feedback
  const [copyLabel, setCopyLabel] = useState('Copy')

  const letterRef = useRef<HTMLDivElement>(null)
  const smsRef = useRef<HTMLDivElement>(null)
  const emailRef = useRef<HTMLDivElement>(null)

  // Recalc MAO/score for all leads whenever params change
  const recalcLeads = useCallback((ls: Lead[]) => {
    return ls.map(l => {
      const mao = calcMAO(l.arv, l.repairs, arvPct, myFee, closingCosts)
      const score = calcScore(l.arv, l.repairs, mao)
      return { ...l, mao, score }
    })
  }, [arvPct, myFee, closingCosts])

  const exampleMAO = Math.max(0, Math.round((100000 * (arvPct / 100)) - 20000 - myFee - closingCosts))

  // Filtered + sorted leads
  const getFiltered = useCallback(() => {
    let list = leads.filter(l => {
      const matchText = !filterText || l.addr.toLowerCase().includes(filterText) || l.seller.toLowerCase().includes(filterText) || l.city.toLowerCase().includes(filterText)
      const matchStatus = filterStatus === 'all' || l.status === filterStatus
      return matchText && matchStatus
    })
    const scoreOrder = ['A', 'B', 'C', 'D', 'F']
    if (sortBy === 'score') list = [...list].sort((a, b) => scoreOrder.indexOf(a.score) - scoreOrder.indexOf(b.score))
    else if (sortBy === 'mao_desc') list = [...list].sort((a, b) => b.mao - a.mao)
    else if (sortBy === 'mao_asc') list = [...list].sort((a, b) => a.mao - b.mao)
    else if (sortBy === 'arv_desc') list = [...list].sort((a, b) => b.arv - a.arv)
    return list
  }, [leads, filterText, filterStatus, sortBy])

  const filtered = getFiltered()

  // Stats
  const totalLeads = leads.length
  const pendingCount = leads.filter(l => l.status === 'pending').length
  const readyCount = leads.filter(l => l.status === 'ready').length
  const sentCount = leads.filter(l => l.status === 'sent').length
  const totalMAO = leads.reduce((s, l) => s + l.mao, 0)
  const selectedCount = leads.filter(l => l.checked).length

  // Load sample data
  function loadSample() {
    const newLeads: Lead[] = SAMPLE_LEADS.map(l => {
      const mao = calcMAO(l.arv, l.repairs, arvPct, myFee, closingCosts)
      return { ...l, mao, score: calcScore(l.arv, l.repairs, mao) } as Lead
    })
    setLeads(newLeads)
  }

  // Add lead
  function addLead() {
    const arv = parseFloat(newArv) || 0
    if (!newAddr || !arv) { alert('Address and ARV are required.'); return }
    const repairs = parseFloat(newRepairs) || 0
    const mao = calcMAO(arv, repairs, arvPct, myFee, closingCosts)
    setLeads(prev => [...prev, {
      id: Date.now(), addr: newAddr, city: '', seller: newSeller || 'Property Owner',
      phone: newPhone, arv, repairs, mao, score: calcScore(arv, repairs, mao),
      status: 'pending', offer: null, checked: false,
    }])
    setNewAddr(''); setNewSeller(''); setNewArv(''); setNewRepairs(''); setNewPhone('')
    setShowAddRow(false)
  }

  // Toggle check
  function toggleCheck(id: number) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, checked: !l.checked } : l))
  }

  function toggleAll(v: boolean) {
    setLeads(prev => prev.map(l => ({ ...l, checked: v })))
  }

  function selectAll() {
    setLeads(prev => prev.map(l => ({ ...l, checked: true })))
  }

  // Update inline field
  function updateField(id: number, field: 'arv' | 'repairs', val: string) {
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l
      const updated = { ...l, [field]: parseFloat(val) || 0, offer: null, status: 'pending' as const }
      updated.mao = calcMAO(updated.arv, updated.repairs, arvPct, myFee, closingCosts)
      updated.score = calcScore(updated.arv, updated.repairs, updated.mao)
      return updated
    }))
  }

  // Generate offers
  async function generateAll() {
    const toGen = leads.filter(l => l.status !== 'sent' && l.status !== 'ready')
    if (!toGen.length) {
      if (leads.some(l => l.status === 'ready')) alert('All offers already generated! Click "View Offer" on any lead.')
      else alert('Add leads first.')
      return
    }
    setProgressVisible(true)
    setProgressPct(0)
    for (let i = 0; i < leads.length; i++) {
      const l = leads[i]
      if (l.status === 'sent' || l.status === 'ready') continue
      setLeads(prev => prev.map(x => x.id === l.id ? { ...x, status: 'generating' } : x))
      setProgressPct(Math.round((i / leads.length) * 100))
      setProgressText(`Generating offer ${i + 1} of ${leads.length}: ${l.addr}`)
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400))
      const offer = buildLocalOffer({ ...l, mao: calcMAO(l.arv, l.repairs, arvPct, myFee, closingCosts) }, buyerName || 'Demetrius Drew', buyerPhone || '(555) 000-0000', buyerEmail || 'info@flipthecontract.com', closingTime, offerExpiry)
      setLeads(prev => prev.map(x => x.id === l.id ? { ...x, status: 'ready', offer } : x))
    }
    setProgressPct(100)
    setProgressText('All offers ready!')
    setTimeout(() => setProgressVisible(false), 2500)
  }

  async function generateSingle(id: number) {
    setLeads(prev => prev.map(l => l.id === id ? { ...l, status: 'generating' } : l))
    await new Promise(r => setTimeout(r, 500 + Math.random() * 500))
    setLeads(prev => prev.map(l => {
      if (l.id !== id) return l
      const offer = buildLocalOffer(l, buyerName || 'Demetrius Drew', buyerPhone || '(555) 000-0000', buyerEmail || 'info@flipthecontract.com', closingTime, offerExpiry)
      return { ...l, status: 'ready', offer }
    }))
    const lead = leads.find(x => x.id === id)
    if (lead) {
      const offer = buildLocalOffer(lead, buyerName || 'Demetrius Drew', buyerPhone || '(555) 000-0000', buyerEmail || 'info@flipthecontract.com', closingTime, offerExpiry)
      setCurrentLead({ ...lead, status: 'ready', offer })
      setModalTab('letter')
      setModalOpen(true)
    }
  }

  async function generateSelected() {
    const sel = leads.filter(l => l.checked && l.status !== 'ready' && l.status !== 'sent')
    if (!sel.length) { alert('Select leads with pending offers first.'); return }
    setProgressVisible(true)
    setProgressPct(0)
    for (let i = 0; i < sel.length; i++) {
      setLeads(prev => prev.map(x => x.id === sel[i].id ? { ...x, status: 'generating' } : x))
      setProgressPct(Math.round((i / sel.length) * 100))
      setProgressText(`Generating offer ${i + 1} of ${sel.length}`)
      await new Promise(r => setTimeout(r, 400 + Math.random() * 400))
      const offer = buildLocalOffer(sel[i], buyerName || 'Demetrius Drew', buyerPhone || '(555) 000-0000', buyerEmail || 'info@flipthecontract.com', closingTime, offerExpiry)
      setLeads(prev => prev.map(x => x.id === sel[i].id ? { ...x, status: 'ready', offer } : x))
    }
    setProgressPct(100)
    setProgressText('Selected offers ready!')
    setTimeout(() => setProgressVisible(false), 2000)
  }

  // View offer
  function viewOffer(id: number) {
    const l = leads.find(x => x.id === id)
    if (!l || !l.offer) return
    setCurrentLead(l)
    setModalTab('letter')
    setRepairChecked(REPAIRS.map((_, i) => i < 4))
    setModalOpen(true)
  }

  // Mark sent
  function markLeadSent() {
    if (!currentLead) return
    setLeads(prev => prev.map(l => l.id === currentLead.id ? { ...l, status: 'sent' } : l))
    setModalOpen(false)
  }

  function markAllSent() {
    setLeads(prev => prev.map(l => l.status === 'ready' ? { ...l, status: 'sent' } : l))
  }

  // Export CSV
  function exportOffers() {
    const ready = leads.filter(l => l.status === 'ready' || l.status === 'sent')
    if (!ready.length) { alert('Generate offers first.'); return }
    const csv = 'Address,Seller,ARV,Repairs,MAO,Score,Status\n' + ready.map(l => `"${l.addr} ${l.city}","${l.seller}","$${l.arv}","$${l.repairs}","$${l.mao}","${l.score}","${l.status}"`).join('\n')
    const a = document.createElement('a')
    a.href = 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv)
    a.download = 'ftc_offers.csv'
    a.click()
  }

  // Copy offer content
  function copyOffer() {
    if (!currentLead?.offer) return
    let text = ''
    if (modalTab === 'letter') text = letterRef.current?.innerText || ''
    else if (modalTab === 'sms') text = smsRef.current?.textContent || ''
    else if (modalTab === 'email') text = currentLead.offer.emailSubject + '\n\n' + currentLead.offer.email
    navigator.clipboard.writeText(text).then(() => {
      setCopyLabel('Copied!')
      setTimeout(() => setCopyLabel('Copy'), 1500)
    })
  }

  function clearAll() {
    if (!leads.length) return
    if (confirm('Clear all leads?')) setLeads([])
  }

  // Recalculate whenever params change
  const recalcedLeads = recalcLeads(leads)
  if (JSON.stringify(recalcedLeads.map(l => l.mao)) !== JSON.stringify(leads.map(l => l.mao))) {
    // Only set if MAOs actually changed to avoid loops
    setLeads(recalcedLeads)
  }

  const statusLabel: Record<string, string> = { pending: 'Pending', generating: 'Writing...', ready: 'Ready', sent: 'Sent' }
  const strengthColor = (v: string) => v === 'Strong' || v === 'High' ? '#5cb885' : v === 'Moderate' || v === 'Medium' ? '#e8a44a' : '#ef4444'

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 20 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f5f0eb', letterSpacing: '0.06em', marginBottom: 4, lineHeight: 1.1 }}>
              Deal Maker — Bulk Offer Campaign
            </h2>
            <p style={{ fontSize: 13, color: '#7a716a', fontFamily: "'Courier Prime', monospace" }}>
              Generate &amp; send personalized offers to multiple leads simultaneously
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <button className="btn-ghost" onClick={loadSample} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              Load Sample Leads
            </button>
            <button onClick={() => setShowAddRow(!showAddRow)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
              + Add Lead
            </button>
            <button className="btn-ghost" onClick={() => setShowSettingsPanel(!showSettingsPanel)} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', display: 'none', alignItems: 'center', gap: 5 }} id="toggle-settings-btn">
              Settings
            </button>
            {leads.length > 0 && (
              <button onClick={clearAll} style={{ padding: '7px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(239,68,68,0.3)', color: '#ef4444', display: 'inline-flex', alignItems: 'center', gap: 5 }}>
                Clear All
              </button>
            )}
            <button onClick={generateAll} disabled={!leads.length} style={{ padding: '8px 18px', borderRadius: 8, fontSize: 13, fontWeight: 600, cursor: leads.length ? 'pointer' : 'not-allowed', background: leads.length ? 'linear-gradient(135deg, #ff7e5f, #ffb347)' : 'rgba(47,58,74,0.4)', color: leads.length ? '#fff' : '#5a524c', border: 'none', display: 'inline-flex', alignItems: 'center', gap: 6 }}>
              ⚡ Run Deal Maker
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout */}
      <div style={s.wrap}>
        {/* Settings Panel */}
        {showSettingsPanel && (
          <div style={s.sp} className="dealmaker-settings-panel">
            {/* Your Info */}
            <div style={s.spSection}>
              <div style={s.spHeader}><span style={s.spTitle as React.CSSProperties}>Your Info</span></div>
              <div style={s.spBody}>
                <div style={s.field}>
                  <label style={s.label}>Name / Company</label>
                  <input style={s.input} value={buyerName} onChange={e => setBuyerName(e.target.value)} placeholder="Your name or company" />
                </div>
                <div style={s.fieldRow}>
                  <div style={s.field}>
                    <label style={s.label}>Phone</label>
                    <input style={s.input} value={buyerPhone} onChange={e => setBuyerPhone(e.target.value)} placeholder="(555) 000-0000" />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Email</label>
                    <input style={s.input} value={buyerEmail} onChange={e => setBuyerEmail(e.target.value)} placeholder="you@email.com" />
                  </div>
                </div>
              </div>
            </div>

            {/* Dynamic Bid Generator */}
            <div style={s.spSection}>
              <div style={s.spHeader}><span style={s.spTitle as React.CSSProperties}>Dynamic Bid Generator</span></div>
              <div style={s.spBody}>
                <div style={s.field}>
                  <label style={s.label}>Investor Profit % (ARV Rule)</label>
                  <input style={s.input} type="number" value={arvPct} min={50} max={90} onChange={e => setArvPct(parseInt(e.target.value) || 70)} />
                  <div style={s.fieldHint}>Standard = 70% of ARV</div>
                </div>
                <div style={s.fieldRow}>
                  <div style={s.field}>
                    <label style={s.label}>Assignment Fee</label>
                    <input style={s.input} type="number" value={myFee} onChange={e => setMyFee(parseInt(e.target.value) || 0)} />
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Closing Costs</label>
                    <input style={s.input} type="number" value={closingCosts} onChange={e => setClosingCosts(parseInt(e.target.value) || 0)} />
                  </div>
                </div>
                <div style={s.bidBox}>
                  <div style={s.bidFormula}>
                    MAO = (ARV × <span style={{ color: '#ff7e5f' }}>{arvPct}</span>%) − Repairs<br />
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;− <span style={{ color: '#ff7e5f' }}>${Math.round(myFee / 1000)}K</span> fee − <span style={{ color: '#ff7e5f' }}>${(closingCosts / 1000).toFixed(1)}K</span> closing
                  </div>
                  <div style={s.bidResult}>
                    <div>
                      <div style={{ fontSize: 11, color: '#5a524c', fontFamily: "'Courier Prime', monospace" }}>EXAMPLE: $100K ARV / $20K Repairs</div>
                      <div style={{ fontSize: 10, color: '#4a4440', fontFamily: "'Courier Prime', monospace", marginTop: 3 }}>
                        ($100K×{arvPct}%)−$20K−${Math.round(myFee / 1000)}K−${(closingCosts / 1000).toFixed(1)}K
                      </div>
                    </div>
                    <div style={s.bidVal}>{fmtMoneyFull(exampleMAO)}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Offer Settings */}
            <div style={s.spSection}>
              <div style={s.spHeader}><span style={s.spTitle as React.CSSProperties}>Offer Settings</span></div>
              <div style={s.spBody}>
                <div style={s.field}>
                  <label style={s.label}>Offer Style / Tone</label>
                  <select style={s.input} value={offerStyle} onChange={e => setOfferStyle(e.target.value)}>
                    <option value="professional">Professional &amp; Direct</option>
                    <option value="empathetic">Empathetic &amp; Personal</option>
                    <option value="urgent">Urgent &amp; Time-Sensitive</option>
                    <option value="simple">Simple &amp; No Fluff</option>
                  </select>
                </div>
                <div style={s.fieldRow}>
                  <div style={s.field}>
                    <label style={s.label}>Expires In</label>
                    <select style={s.input} value={offerExpiry} onChange={e => setOfferExpiry(e.target.value)}>
                      <option>24 Hours</option>
                      <option>48 Hours</option>
                      <option>72 Hours</option>
                      <option>7 Days</option>
                    </select>
                  </div>
                  <div style={s.field}>
                    <label style={s.label}>Close Timeline</label>
                    <select style={s.input} value={closingTime} onChange={e => setClosingTime(e.target.value)}>
                      <option>7–10 Days</option>
                      <option>14–21 Days</option>
                      <option>30 Days</option>
                    </select>
                  </div>
                </div>
                <div style={s.field}>
                  <label style={s.label}>Contract Template</label>
                  <select style={s.input} value={contractTemplate} onChange={e => setContractTemplate(e.target.value)}>
                    <option>Standard Purchase Agreement</option>
                    <option>As-Is Cash Offer Letter</option>
                    <option>Motivated Seller Script</option>
                    <option>REO / Bank-Owned Offer</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Campaign Options */}
            <div style={s.spSection}>
              <div style={s.spHeader}><span style={s.spTitle as React.CSSProperties}>Campaign Options</span></div>
              <div style={s.spBody}>
                <div style={s.toggleItem}>
                  <div>
                    <div style={s.toggleName}>Repeat Campaign</div>
                    <div style={s.toggleDesc}>Re-send with new offer on delay</div>
                  </div>
                  <Toggle on={togRepeat} onChange={setTogRepeat} />
                </div>
                <div style={s.toggleItem}>
                  <div>
                    <div style={s.toggleName}>Increase Offer On Follow-Up</div>
                    <div style={s.toggleDesc}>+5% each round</div>
                  </div>
                  <Toggle on={togIncrease} onChange={setTogIncrease} />
                </div>
                <div style={s.toggleItem}>
                  <div>
                    <div style={s.toggleName}>Include Repair Estimate</div>
                    <div style={s.toggleDesc}>Attach repair breakdown to offer</div>
                  </div>
                  <Toggle on={togRepair} onChange={setTogRepair} />
                </div>
                <div style={{ ...s.toggleItem, borderBottom: 'none' }}>
                  <div>
                    <div style={s.toggleName}>Auto-Generate SMS Version</div>
                    <div style={s.toggleDesc}>SMS script alongside letter</div>
                  </div>
                  <Toggle on={togSMS} onChange={setTogSMS} />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Right: Leads Panel */}
        <div style={s.lp}>
          {/* Stats Row */}
          <div style={s.statsRow}>
            <div style={s.statCol}>
              <span style={{ ...s.statNum, color: '#5ba3d9' }}>{totalLeads}</span>
              <span style={s.statLbl as React.CSSProperties}>Total Leads</span>
            </div>
            <div style={s.statCol}>
              <span style={{ ...s.statNum, color: '#ff7e5f' }}>{pendingCount}</span>
              <span style={s.statLbl as React.CSSProperties}>Pending</span>
            </div>
            <div style={s.statCol}>
              <span style={{ ...s.statNum, color: '#5cb885' }}>{readyCount}</span>
              <span style={s.statLbl as React.CSSProperties}>Offers Ready</span>
            </div>
            <div style={s.statCol}>
              <span style={{ ...s.statNum, color: '#5ba3d9' }}>{sentCount}</span>
              <span style={s.statLbl as React.CSSProperties}>Sent</span>
            </div>
            <div style={{ ...s.statCol, borderRight: 'none' }}>
              <span style={{ ...s.statNum, color: '#e8a44a' }}>{fmtMoney(totalMAO)}</span>
              <span style={s.statLbl as React.CSSProperties}>Total MAO</span>
            </div>
          </div>

          {/* Toolbar */}
          <div style={s.toolbar}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: 1, flexWrap: 'wrap' }}>
              <input style={s.searchBox} type="text" placeholder="Search leads..." value={filterText} onChange={e => setFilterText(e.target.value.toLowerCase())} />
              <select style={s.filterSelect} value={filterStatus} onChange={e => setFilterStatus(e.target.value)}>
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="ready">Offer Ready</option>
                <option value="sent">Sent</option>
              </select>
              <select style={s.filterSelect} value={sortBy} onChange={e => setSortBy(e.target.value)}>
                <option value="score">Sort: Deal Score</option>
                <option value="mao_desc">Sort: MAO High→Low</option>
                <option value="mao_asc">Sort: MAO Low→High</option>
                <option value="arv_desc">Sort: ARV High→Low</option>
              </select>
            </div>
            <button onClick={selectAll} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', whiteSpace: 'nowrap' }}>
              Select All
            </button>
            <button onClick={generateSelected} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', whiteSpace: 'nowrap' }}>
              ⚡ Generate Selected
            </button>
          </div>

          {/* Add Lead Row */}
          {showAddRow && (
            <div style={s.addRow}>
              <div style={{ flex: 2, minWidth: 160 }}>
                <label style={{ ...s.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>PROPERTY ADDRESS</label>
                <input style={s.input} value={newAddr} onChange={e => setNewAddr(e.target.value)} placeholder="123 Main St, Detroit, MI" />
              </div>
              <div style={{ flex: 1, minWidth: 120 }}>
                <label style={{ ...s.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>SELLER NAME</label>
                <input style={s.input} value={newSeller} onChange={e => setNewSeller(e.target.value)} placeholder="John Smith" />
              </div>
              <div style={{ width: 100 }}>
                <label style={{ ...s.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>ARV ($)</label>
                <input style={s.input} type="number" value={newArv} onChange={e => setNewArv(e.target.value)} placeholder="100000" />
              </div>
              <div style={{ width: 100 }}>
                <label style={{ ...s.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>REPAIRS ($)</label>
                <input style={s.input} type="number" value={newRepairs} onChange={e => setNewRepairs(e.target.value)} placeholder="20000" />
              </div>
              <div style={{ width: 100 }}>
                <label style={{ ...s.label, fontSize: 10, fontWeight: 700, letterSpacing: '0.05em' }}>SELLER PHONE</label>
                <input style={s.input} value={newPhone} onChange={e => setNewPhone(e.target.value)} placeholder="Optional" />
              </div>
              <button onClick={addLead} style={{ padding: '8px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: '#5ba3d9', color: '#fff', border: 'none', alignSelf: 'flex-end' }}>
                Add Lead
              </button>
              <button onClick={() => setShowAddRow(false)} style={{ padding: '8px 14px', borderRadius: 8, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', alignSelf: 'flex-end' }}>
                Cancel
              </button>
            </div>
          )}

          {/* Table */}
          <div style={s.tableWrap}>
            <table style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th style={{ ...s.th as React.CSSProperties, width: 36 }}>
                    <input type="checkbox" checked={leads.length > 0 && leads.every(l => l.checked)} onChange={e => toggleAll(e.target.checked)} style={{ accentColor: '#ff7e5f', cursor: 'pointer', width: 14, height: 14 }} />
                  </th>
                  <th style={s.th as React.CSSProperties}>Property Address</th>
                  <th style={s.th as React.CSSProperties}>Seller</th>
                  <th style={s.th as React.CSSProperties}>ARV</th>
                  <th style={s.th as React.CSSProperties}>Repairs</th>
                  <th style={s.th as React.CSSProperties}>MAO (Bid)</th>
                  <th style={s.th as React.CSSProperties}>Score</th>
                  <th style={s.th as React.CSSProperties}>Status</th>
                  <th style={s.th as React.CSSProperties}>Action</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan={9} style={{ textAlign: 'center', padding: leads.length ? '40px 20px' : '60px 20px', color: '#5a524c' }}>
                      {leads.length ? (
                        <div style={{ fontSize: 13 }}>No leads match your filter.</div>
                      ) : (
                        <>
                          <div style={{ fontSize: 36, marginBottom: 12 }}>📋</div>
                          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, letterSpacing: '0.06em', marginBottom: 8, color: '#7a716a' }}>
                            NO LEADS LOADED
                          </div>
                          <div style={{ fontSize: 13, color: '#5a524c' }}>
                            Click <strong style={{ color: '#f5f0eb' }}>Load Sample Leads</strong> to see Deal Maker in action, or add your own leads.
                          </div>
                        </>
                      )}
                    </td>
                  </tr>
                ) : (
                  filtered.map(l => (
                    <tr key={l.id} style={{ borderBottom: '1px solid rgba(47,58,74,0.25)', cursor: 'pointer', background: l.checked ? 'rgba(255,126,95,0.04)' : 'transparent', transition: 'background 0.1s' }}
                      onMouseEnter={e => { if (!l.checked) (e.currentTarget as HTMLElement).style.background = 'rgba(255,255,255,0.015)' }}
                      onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = l.checked ? 'rgba(255,126,95,0.04)' : 'transparent' }}>
                      <td style={{ ...s.td, borderLeft: l.checked ? '2px solid #ff7e5f' : '2px solid transparent' }}>
                        <input type="checkbox" checked={l.checked} onChange={() => toggleCheck(l.id)} onClick={e => e.stopPropagation()} style={{ accentColor: '#ff7e5f', cursor: 'pointer', width: 14, height: 14 }} />
                      </td>
                      <td style={s.td} onClick={() => toggleCheck(l.id)}>
                        <div style={{ fontWeight: 500, color: '#f5f0eb', fontSize: 13 }}>{l.addr}</div>
                        <div style={{ fontSize: 11, color: '#5a524c', marginTop: 2 }}>{l.city || l.phone || '—'}</div>
                      </td>
                      <td style={s.td}>
                        <div style={{ fontSize: 13, fontWeight: 500 }}>{l.seller}</div>
                        {l.phone && <div style={{ fontSize: 11, color: '#5a524c', marginTop: 2 }}>{l.phone}</div>}
                      </td>
                      <td style={s.td}>
                        <input
                          type="number" value={l.arv}
                          onChange={e => updateField(l.id, 'arv', e.target.value)}
                          style={{ ...s.inlineInput, width: 90 }}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5ba3d9'; e.currentTarget.style.background = 'rgba(30,37,48,0.6)' }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent' }}
                        />
                      </td>
                      <td style={s.td}>
                        <input
                          type="number" value={l.repairs}
                          onChange={e => updateField(l.id, 'repairs', e.target.value)}
                          style={{ ...s.inlineInput, width: 80 }}
                          onFocus={e => { e.currentTarget.style.borderColor = '#5ba3d9'; e.currentTarget.style.background = 'rgba(30,37,48,0.6)' }}
                          onBlur={e => { e.currentTarget.style.borderColor = 'transparent'; e.currentTarget.style.background = 'transparent' }}
                        />
                      </td>
                      <td style={s.td}><div style={s.maoCell(l.mao)}>{fmtMoneyFull(l.mao)}</div></td>
                      <td style={s.td}><div style={s.scoreBadge(l.score)}>{l.score || '?'}</div></td>
                      <td style={s.td}><div style={s.statusBadge(l.status)}><div style={s.statusDot(l.status)} />{statusLabel[l.status]}</div></td>
                      <td style={s.td}>
                        {l.status === 'ready' || l.status === 'sent' ? (
                          <button onClick={e => { e.stopPropagation(); viewOffer(l.id) }} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(92,184,133,0.3)', color: '#5cb885', whiteSpace: 'nowrap' }}>
                            View Offer
                          </button>
                        ) : (
                          <button onClick={e => { e.stopPropagation(); generateSingle(l.id) }} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', whiteSpace: 'nowrap' }}>
                            Generate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div style={s.footer}>
            <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
              <span style={{ fontSize: 12, color: '#7a716a' }}><strong style={{ color: '#f5f0eb' }}>{selectedCount}</strong> selected</span>
              <span style={{ fontSize: 12, color: '#7a716a' }}><strong style={{ color: '#f5f0eb' }}>{totalLeads}</strong> total leads</span>
              <span style={{ fontSize: 12, color: '#5cb885' }}>✓ <strong>{readyCount}</strong> offers ready</span>
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button onClick={exportOffers} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a', whiteSpace: 'nowrap' }}>
                Export All
              </button>
              <button onClick={markAllSent} style={{ padding: '5px 12px', borderRadius: 6, fontSize: 11, fontWeight: 600, cursor: 'pointer', background: '#5cb885', color: '#fff', border: 'none', whiteSpace: 'nowrap' }}>
                ✓ Mark All Sent
              </button>
              <button onClick={generateAll} disabled={!leads.length} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: leads.length ? 'pointer' : 'not-allowed', background: leads.length ? 'linear-gradient(135deg, #ff7e5f, #ffb347)' : 'rgba(47,58,74,0.4)', color: leads.length ? '#fff' : '#5a524c', border: 'none', whiteSpace: 'nowrap' }}>
                ⚡ Run Deal Maker
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Progress Toast */}
      {progressVisible && (
        <div style={s.progressToast}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
            <span style={{ fontSize: 12, fontWeight: 600, color: '#f5f0eb' }}>⚡ Deal Maker Running...</span>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em' }}>{progressPct}%</span>
          </div>
          <div style={{ height: 4, background: 'rgba(47,58,74,0.5)', borderRadius: 2, overflow: 'hidden', marginBottom: 6 }}>
            <div style={{ height: '100%', background: 'linear-gradient(90deg, #ff7e5f, #e8a44a)', borderRadius: 2, transition: 'width 0.3s ease', width: `${progressPct}%` }} />
          </div>
          <div style={{ fontSize: 11, color: '#5a524c', fontFamily: "'Courier Prime', monospace" }}>{progressText}</div>
        </div>
      )}

      {/* Offer Modal */}
      {modalOpen && currentLead?.offer && (
        <div style={s.modalBg} onClick={e => { if (e.target === e.currentTarget) setModalOpen(false) }}>
          <div style={s.modal} onClick={e => e.stopPropagation()}>
            {/* Modal Header */}
            <div style={s.modalTop}>
              <div>
                <div style={s.modalTitle}>OFFER — {currentLead.seller.toUpperCase()}</div>
                <div style={s.modalSub}>{currentLead.addr}{currentLead.city ? ' · ' + currentLead.city : ''}</div>
              </div>
              <button onClick={() => setModalOpen(false)} style={{ background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#7a716a', width: 30, height: 30, borderRadius: 8, cursor: 'pointer', fontSize: 14, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                ✕
              </button>
            </div>

            {/* Modal Tabs */}
            <div style={s.modalTabs}>
              {(['letter', 'sms', 'email', 'repairs', 'analysis'] as ModalTab[]).map(tab => (
                <button key={tab} onClick={() => setModalTab(tab)} style={s.modalTab(modalTab === tab)}>
                  {tab === 'letter' ? 'Offer Letter' : tab === 'sms' ? 'SMS Script' : tab === 'email' ? 'Email' : tab === 'repairs' ? 'Repair Est.' : 'Analysis'}
                </button>
              ))}
            </div>

            {/* Modal Body */}
            <div style={s.modalBody}>
              {/* Letter Tab */}
              {modalTab === 'letter' && (
                <div ref={letterRef} style={s.paper as React.CSSProperties}>
                  <div style={s.paperWatermark as React.CSSProperties}>FTC</div>
                  <div dangerouslySetInnerHTML={{ __html: currentLead.offer.letter }} />
                </div>
              )}

              {/* SMS Tab */}
              {modalTab === 'sms' && (
                <div>
                  <div ref={smsRef} style={s.scriptBlock}>
                    <div style={s.scriptLabel as React.CSSProperties}>SMS Script (Under 160 chars)</div>
                    <div>{currentLead.offer.sms}</div>
                  </div>
                  <div style={{ marginTop: 14, padding: 12, background: 'rgba(30,37,48,0.6)', borderRadius: 10, border: '1px solid rgba(47,58,74,0.5)' }}>
                    <div style={{ fontSize: 11, color: '#5a524c', fontFamily: "'Courier Prime', monospace", marginBottom: 8 }}>FOLLOW-UP TEXT #2 (Day 3)</div>
                    <div style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.7 }}>{currentLead.offer.smsFollowup}</div>
                  </div>
                </div>
              )}

              {/* Email Tab */}
              {modalTab === 'email' && (
                <div ref={emailRef}>
                  <div style={s.subjectLine}>{currentLead.offer.emailSubject}</div>
                  <div style={s.scriptBlock}>
                    <div style={s.scriptLabel as React.CSSProperties}>Email Body</div>
                    <div style={{ whiteSpace: 'pre-line' }}>{currentLead.offer.email}</div>
                  </div>
                </div>
              )}

              {/* Repairs Tab */}
              {modalTab === 'repairs' && (
                <div>
                  <div style={{ marginBottom: 14, fontSize: 12, color: '#7a716a' }}>
                    Estimated repair costs for this property. Check applicable items to include in your offer analysis.
                  </div>
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {REPAIRS.map((r, i) => {
                      const perItem = Math.round(currentLead.repairs / REPAIRS.length)
                      const est = Math.round(perItem * (0.5 + ((i * 7 + 3) % 10) / 10))
                      return (
                        <div key={r.name} style={s.repairItem}>
                          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                            <input type="checkbox" checked={repairChecked[i]} onChange={() => setRepairChecked(prev => prev.map((v, j) => j === i ? !v : v))} style={{ accentColor: '#ff7e5f', cursor: 'pointer', width: 16, height: 16 }} />
                            <span style={{ fontSize: 12, fontWeight: 500, color: '#f5f0eb' }}>{r.name}</span>
                          </div>
                          <span style={{ fontSize: 12, color: '#7a716a', fontFamily: "'Courier Prime', monospace" }}>${est.toLocaleString()}</span>
                        </div>
                      )
                    })}
                  </div>
                  <div style={s.repairTotal}>
                    <span style={{ fontSize: 12, color: '#7a716a' }}>Total Repair Estimate</span>
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#ff7e5f', letterSpacing: '0.04em' }}>{fmtMoneyFull(currentLead.repairs)}</span>
                  </div>
                </div>
              )}

              {/* Analysis Tab */}
              {modalTab === 'analysis' && (
                <div>
                  <div style={{ ...s.offerNums, gridTemplateColumns: window.innerWidth < 500 ? '1fr 1fr' : 'repeat(4, 1fr)' }}>
                    <div style={s.onItem as React.CSSProperties}><span style={{ ...s.onVal, color: '#5ba3d9' }}>{fmtMoneyFull(currentLead.arv)}</span><span style={s.onLbl as React.CSSProperties}>ARV</span></div>
                    <div style={s.onItem as React.CSSProperties}><span style={{ ...s.onVal, color: '#ef4444' }}>{fmtMoneyFull(currentLead.repairs)}</span><span style={s.onLbl as React.CSSProperties}>Repairs</span></div>
                    <div style={s.onItem as React.CSSProperties}><span style={{ ...s.onVal, color: '#ff7e5f' }}>{fmtMoneyFull(currentLead.mao)}</span><span style={s.onLbl as React.CSSProperties}>Your Offer</span></div>
                    <div style={s.onItem as React.CSSProperties}><span style={{ ...s.onVal, color: '#5cb885' }}>{fmtMoneyFull(myFee)}</span><span style={s.onLbl as React.CSSProperties}>Your Fee</span></div>
                  </div>
                  <div style={{ ...s.analysisGrid, gridTemplateColumns: window.innerWidth < 500 ? '1fr' : '1fr 1fr' }}>
                    <div style={s.agItem}><div style={s.agLabel as React.CSSProperties}>Deal Strength</div><div style={{ fontSize: 14, fontWeight: 600, color: strengthColor(currentLead.offer.dealStrength) }}>{currentLead.offer.dealStrength}</div></div>
                    <div style={s.agItem}><div style={s.agLabel as React.CSSProperties}>Profit Potential</div><div style={{ fontSize: 14, fontWeight: 600, color: strengthColor(currentLead.offer.profitPotential) }}>{currentLead.offer.profitPotential}</div></div>
                    <div style={s.agItem}><div style={s.agLabel as React.CSSProperties}>Seller Motivation</div><div style={{ fontSize: 14, fontWeight: 600, color: strengthColor(currentLead.offer.sellerMotivation) }}>{currentLead.offer.sellerMotivation}</div></div>
                    <div style={s.agItem}><div style={s.agLabel as React.CSSProperties}>Deal Score</div><div style={{ fontSize: 14, fontWeight: 600, color: ['A', 'B'].includes(currentLead.score) ? '#5cb885' : currentLead.score === 'C' ? '#e8a44a' : '#ef4444' }}>{currentLead.score} Grade</div></div>
                  </div>
                  <div style={{ fontSize: 12, color: '#9a918a', lineHeight: 1.7, background: 'rgba(30,37,48,0.6)', borderRadius: 10, padding: 14, border: '1px solid rgba(47,58,74,0.5)' }}>
                    <strong style={{ color: '#f5f0eb' }}>Analysis:</strong> {currentLead.offer.analysis}<br /><br />
                    <strong style={{ color: '#f5f0eb' }}>Recommendation:</strong> {currentLead.offer.recommendation}
                  </div>
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div style={s.modalFooter}>
              <button onClick={copyOffer} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a' }}>
                {copyLabel === 'Copied!' ? '✓ ' : ''}{copyLabel}
              </button>
              <button onClick={markLeadSent} style={{ padding: '6px 14px', borderRadius: 6, fontSize: 12, fontWeight: 500, cursor: 'pointer', background: 'transparent', border: '1px solid rgba(47,58,74,0.6)', color: '#9a918a' }}>
                ✓ Mark Sent
              </button>
              <button onClick={() => setModalOpen(false)} style={{ padding: '6px 16px', borderRadius: 8, fontSize: 12, fontWeight: 600, cursor: 'pointer', background: 'linear-gradient(135deg, #ff7e5f, #ffb347)', color: '#fff', border: 'none' }}>
                Done
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Styles */}
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1 } 50% { opacity: 0.3 } }
        .dealmaker-settings-panel { transition: width 0.2s; }
        .contract-paper .letter-header {
          font-family: 'Inter', sans-serif;
          font-size: 11px;
          color: #888;
          padding-bottom: 12px;
          border-bottom: 1px solid #ddd;
          margin-bottom: 18px;
          display: flex;
          justify-content: space-between;
        }
        .contract-paper .offer-amt {
          font-family: 'Inter', sans-serif;
          font-size: 22px;
          font-weight: 700;
          color: #E25A30;
        }
        .contract-paper .sig-block {
          margin-top: 24px;
          padding-top: 14px;
          border-top: 1px solid #ddd;
          font-family: 'Inter', sans-serif;
          font-size: 12px;
          color: #666;
          line-height: 1.8;
        }
        .contract-paper p { margin-bottom: 12px; }

        @media (max-width: 900px) {
          .dealmaker-settings-panel { display: none !important; }
          #toggle-settings-btn { display: inline-flex !important; }
        }
        @media (max-width: 600px) {
          table th:nth-child(3), table td:nth-child(3),
          table th:nth-child(7), table td:nth-child(7) { display: none; }
        }
      `}</style>
    </div>
  )
}
