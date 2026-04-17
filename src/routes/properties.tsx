import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Home, Plus, X, Clock, MapPin, DollarSign, Building2, Phone, Mail, User,
  ChevronDown, AlertTriangle, Loader2, LogOut, Search, Filter, TrendingUp,
  ArrowLeft, Bed, Bath, Maximize, Hammer, BarChart3, Eye, Share2,
  ChevronRight, Calculator, FileText, Tag, Zap, Star, ArrowUpRight
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from '@/components/GlobalSearch'

interface PropertyPost {
  id: string
  address: string
  city: string
  state: string
  contractPrice: string
  askingPrice: string
  propertyType: string
  bedrooms: string
  bathrooms: string
  sqft: string
  arv: string
  repairEstimate: string
  description: string
  contactName: string
  contactPhone: string
  contactEmail: string
  createdAt: string
  expiresAt: string
}

const US_STATES = [
  'AL','AK','AZ','AR','CA','CO','CT','DE','FL','GA','HI','ID','IL','IN','IA','KS','KY','LA','ME','MD',
  'MA','MI','MN','MS','MO','MT','NE','NV','NH','NJ','NM','NY','NC','ND','OH','OK','OR','PA','RI','SC',
  'SD','TN','TX','UT','VT','VA','WA','WV','WI','WY','DC'
]

const STATE_NAMES: Record<string, string> = {
  AL:'Alabama',AK:'Alaska',AZ:'Arizona',AR:'Arkansas',CA:'California',CO:'Colorado',CT:'Connecticut',
  DE:'Delaware',FL:'Florida',GA:'Georgia',HI:'Hawaii',ID:'Idaho',IL:'Illinois',IN:'Indiana',IA:'Iowa',
  KS:'Kansas',KY:'Kentucky',LA:'Louisiana',ME:'Maine',MD:'Maryland',MA:'Massachusetts',MI:'Michigan',
  MN:'Minnesota',MS:'Mississippi',MO:'Missouri',MT:'Montana',NE:'Nebraska',NV:'Nevada',NH:'New Hampshire',
  NJ:'New Jersey',NM:'New Mexico',NY:'New York',NC:'North Carolina',ND:'North Dakota',OH:'Ohio',
  OK:'Oklahoma',OR:'Oregon',PA:'Pennsylvania',RI:'Rhode Island',SC:'South Carolina',SD:'South Dakota',
  TN:'Tennessee',TX:'Texas',UT:'Utah',VT:'Vermont',VA:'Virginia',WA:'Washington',WV:'West Virginia',
  WI:'Wisconsin',WY:'Wyoming',DC:'District of Columbia'
}

const PROPERTY_TYPES = ['Single Family', 'Multi-Family', 'Townhouse', 'Condo', 'Duplex', 'Triplex', 'Fourplex', 'Land', 'Commercial', 'Mobile Home', 'Other']

function parsePrice(s: string): number {
  return Number(s.replace(/[^0-9.]/g, '')) || 0
}

function formatUSD(n: number): string {
  return n.toLocaleString('en-US', { maximumFractionDigits: 0 })
}

function getExampleProperties(): PropertyPost[] {
  const now = Date.now()
  return [
    {
      id: 'example-1',
      address: '4217 Magnolia Ave',
      city: 'Houston',
      state: 'TX',
      contractPrice: '145,000',
      askingPrice: '162,000',
      propertyType: 'Single Family',
      bedrooms: '3',
      bathrooms: '2',
      sqft: '1,450',
      arv: '215,000',
      repairEstimate: '30,000',
      description: 'Motivated seller — property is vacant and needs cosmetic rehab. New roof in 2023. Great flip opportunity in an up-and-coming neighborhood. Seller wants to close in 14 days.',
      contactName: 'Marcus Johnson',
      contactPhone: '(713) 555-0192',
      contactEmail: 'marcus.j@example.com',
      createdAt: new Date(now - 6 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 42 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-2',
      address: '891 Peachtree St NW',
      city: 'Atlanta',
      state: 'GA',
      contractPrice: '98,000',
      askingPrice: '115,000',
      propertyType: 'Duplex',
      bedrooms: '4',
      bathrooms: '2',
      sqft: '2,100',
      arv: '185,000',
      repairEstimate: '45,000',
      description: 'Duplex with both units rented month-to-month. Seller is relocating out of state. Each unit is 2bed/1bath. Solid rental history. Great for BRRRR strategy or quick assignment.',
      contactName: 'Tanya Williams',
      contactPhone: '(404) 555-0287',
      contactEmail: 'tanya.w@example.com',
      createdAt: new Date(now - 18 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 30 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-3',
      address: '2650 W Cermak Rd',
      city: 'Chicago',
      state: 'IL',
      contractPrice: '72,000',
      askingPrice: '89,500',
      propertyType: 'Single Family',
      bedrooms: '4',
      bathrooms: '1',
      sqft: '1,800',
      arv: '165,000',
      repairEstimate: '55,000',
      description: 'Estate sale — heirs want a quick close. Property needs full rehab (kitchen, bath, HVAC). Large lot with detached garage. Comps in the area support $160K+ ARV.',
      contactName: 'DeShawn Carter',
      contactPhone: '(312) 555-0413',
      contactEmail: 'deshawn.c@example.com',
      createdAt: new Date(now - 36 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 12 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-4',
      address: '1105 NW 3rd Ave',
      city: 'Miami',
      state: 'FL',
      contractPrice: '210,000',
      askingPrice: '235,000',
      propertyType: 'Townhouse',
      bedrooms: '3',
      bathrooms: '2.5',
      sqft: '1,650',
      arv: '310,000',
      repairEstimate: '40,000',
      description: 'Pre-foreclosure — seller is behind 4 months on mortgage. Townhouse in gated community with HOA-maintained pool. Needs updated flooring and kitchen. Cash buyers preferred.',
      contactName: 'Sofia Ramirez',
      contactPhone: '(305) 555-0178',
      contactEmail: 'sofia.r@example.com',
      createdAt: new Date(now - 2 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 46 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-5',
      address: '7832 E Camelback Rd',
      city: 'Phoenix',
      state: 'AZ',
      contractPrice: '185,000',
      askingPrice: '205,000',
      propertyType: 'Single Family',
      bedrooms: '4',
      bathrooms: '3',
      sqft: '2,200',
      arv: '295,000',
      repairEstimate: '50,000',
      description: 'Divorce sale — both parties want out fast. Pool home in Scottsdale school district. Needs new AC, paint, and landscaping. Huge equity spread for the right buyer.',
      contactName: 'Jake Patterson',
      contactPhone: '(480) 555-0334',
      contactEmail: 'jake.p@example.com',
      createdAt: new Date(now - 10 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 38 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: 'example-6',
      address: '340 Broad St',
      city: 'Newark',
      state: 'NJ',
      contractPrice: '120,000',
      askingPrice: '142,000',
      propertyType: 'Multi-Family',
      bedrooms: '6',
      bathrooms: '3',
      sqft: '3,200',
      arv: '250,000',
      repairEstimate: '60,000',
      description: '3-unit multi-family — all units currently occupied. Seller is tired landlord. Below-market rents with upside potential. Perfect for a buy-and-hold investor.',
      contactName: 'Anthony Russo',
      contactPhone: '(973) 555-0521',
      contactEmail: 'anthony.r@example.com',
      createdAt: new Date(now - 24 * 60 * 60 * 1000).toISOString(),
      expiresAt: new Date(now + 24 * 60 * 60 * 1000).toISOString(),
    },
  ]
}

export const Route = createFileRoute('/properties')({
  component: PropertiesBoard,
})

/* ── Countdown Timer ── */
function CountdownTimer({ expiresAt, large }: { expiresAt: string; large?: boolean }) {
  const [timeLeft, setTimeLeft] = useState('')
  const [urgency, setUrgency] = useState<'normal' | 'warning' | 'critical'>('normal')

  useEffect(() => {
    function update() {
      const now = Date.now()
      const expires = new Date(expiresAt).getTime()
      const diff = expires - now

      if (diff <= 0) {
        setTimeLeft('Expired')
        setUrgency('critical')
        return
      }

      const hours = Math.floor(diff / (1000 * 60 * 60))
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60))
      const seconds = Math.floor((diff % (1000 * 60)) / 1000)

      setTimeLeft(`${hours}h ${minutes}m ${seconds}s`)

      if (hours < 6) setUrgency('critical')
      else if (hours < 12) setUrgency('warning')
      else setUrgency('normal')
    }

    update()
    const interval = setInterval(update, 1000)
    return () => clearInterval(interval)
  }, [expiresAt])

  const colors = {
    normal: { bg: 'rgba(92,184,133,0.12)', border: '#5cb885', text: '#5cb885' },
    warning: { bg: 'rgba(232,164,74,0.12)', border: '#e8a44a', text: '#e8a44a' },
    critical: { bg: 'rgba(239,68,68,0.12)', border: '#ef4444', text: '#ef4444' },
  }
  const c = colors[urgency]

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: large ? 8 : 6,
      background: c.bg, border: `1px solid ${c.border}`,
      borderRadius: 8, padding: large ? '6px 14px' : '4px 10px',
      fontSize: large ? 14 : 12, fontWeight: 600,
      color: c.text, fontFamily: "'DM Sans', sans-serif",
    }}>
      <Clock size={large ? 14 : 12} />
      {timeLeft}
    </div>
  )
}

/* ── Deal Score Badge ── */
function DealScore({ post }: { post: PropertyPost }) {
  const contract = parsePrice(post.contractPrice)
  const arv = parsePrice(post.arv)
  const repairs = parsePrice(post.repairEstimate)

  if (!arv || !contract) return null

  const mao = arv * 0.7 - repairs
  const ratio = contract / arv
  let score: 'hot' | 'good' | 'fair'
  let label: string

  if (contract <= mao && ratio <= 0.55) {
    score = 'hot'
    label = 'Hot Deal'
  } else if (contract <= mao * 1.05 && ratio <= 0.65) {
    score = 'good'
    label = 'Good Deal'
  } else {
    score = 'fair'
    label = 'Fair'
  }

  const styles = {
    hot: { bg: 'rgba(239,68,68,0.15)', border: '#ef4444', color: '#ef4444', icon: Zap },
    good: { bg: 'rgba(92,184,133,0.15)', border: '#5cb885', color: '#5cb885', icon: TrendingUp },
    fair: { bg: 'rgba(234,179,8,0.12)', border: '#d4a017', color: '#eab308', icon: Tag },
  }

  const s = styles[score]
  const Icon = s.icon

  return (
    <div style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      background: s.bg, border: `1px solid ${s.border}`,
      borderRadius: 6, padding: '3px 8px', fontSize: 11, fontWeight: 700,
      color: s.color, textTransform: 'uppercase', letterSpacing: '0.06em',
    }}>
      <Icon size={10} /> {label}
    </div>
  )
}

/* ── Financial Analysis Section (for detail view) ── */
function FinancialAnalysis({ post }: { post: PropertyPost }) {
  const contract = parsePrice(post.contractPrice)
  const asking = parsePrice(post.askingPrice)
  const arv = parsePrice(post.arv)
  const repairs = parsePrice(post.repairEstimate)

  const assignmentFee = asking - contract
  const mao = arv ? arv * 0.7 - repairs : 0
  const totalInvestment = asking + repairs
  const potentialProfit = arv ? arv - totalInvestment : 0
  const roi = totalInvestment > 0 ? (potentialProfit / totalInvestment) * 100 : 0
  const equitySpread = arv ? arv - contract - repairs : 0
  const pricePerSqft = post.sqft ? Math.round(contract / parsePrice(post.sqft)) : 0

  const metrics = [
    { label: 'Assignment Fee', value: `$${formatUSD(assignmentFee)}`, color: '#5cb885', desc: 'Asking minus contract price' },
    { label: 'MAO (70% Rule)', value: arv ? `$${formatUSD(mao)}` : 'N/A', color: contract <= mao ? '#5cb885' : '#e8a44a', desc: 'ARV x 70% minus repairs' },
    { label: 'Equity Spread', value: arv ? `$${formatUSD(equitySpread)}` : 'N/A', color: equitySpread > 0 ? '#5cb885' : '#ef4444', desc: 'ARV minus contract minus repairs' },
    { label: 'Buyer Potential ROI', value: arv ? `${roi.toFixed(1)}%` : 'N/A', color: roi > 20 ? '#5cb885' : roi > 10 ? '#e8a44a' : '#ef4444', desc: 'Profit / total investment' },
    { label: 'Total Investment', value: `$${formatUSD(totalInvestment)}`, color: '#5ba3d9', desc: 'Asking + estimated repairs' },
    ...(pricePerSqft > 0 ? [{ label: 'Price / Sq Ft', value: `$${formatUSD(pricePerSqft)}`, color: '#ffb347', desc: 'Contract price per sq ft' }] : []),
  ]

  return (
    <div>
      <h3 style={{
        fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb',
        letterSpacing: '0.04em', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <BarChart3 size={18} color="#ff7e5f" /> Deal Analysis
      </h3>

      <div className="analysis-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {metrics.map(m => (
          <div key={m.label} style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 10, padding: '12px 14px',
          }}>
            <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>{m.label}</div>
            <div style={{ fontSize: 20, fontWeight: 700, color: m.color, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>{m.value}</div>
            <div style={{ fontSize: 10, color: '#6b6560', marginTop: 4 }}>{m.desc}</div>
          </div>
        ))}
      </div>

      {arv > 0 && (
        <div style={{ marginTop: 16, background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d', borderRadius: 10, padding: '14px 16px' }}>
          <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Deal Breakdown</div>
          <div style={{ position: 'relative', height: 28, borderRadius: 8, overflow: 'hidden', background: '#1e2530' }}>
            <div style={{
              position: 'absolute', left: 0, top: 0, height: '100%',
              width: `${Math.min((contract / arv) * 100, 100)}%`,
              background: 'linear-gradient(90deg, #5cb885, #5cb885)', borderRadius: '8px 0 0 8px',
              transition: 'width 0.6s ease',
            }} />
            <div style={{
              position: 'absolute', left: `${(contract / arv) * 100}%`, top: 0, height: '100%',
              width: `${Math.min((repairs / arv) * 100, 100)}%`,
              background: '#e8a44a',
              transition: 'width 0.6s ease',
            }} />
            <div style={{
              position: 'absolute', left: `${((contract + repairs) / arv) * 100}%`, top: 0, height: '100%',
              width: `${Math.max(100 - ((contract + repairs) / arv) * 100, 0)}%`,
              background: 'rgba(244,126,95,0.3)',
              borderRadius: '0 8px 8px 0',
              transition: 'width 0.6s ease',
            }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 14, marginTop: 10, fontSize: 11 }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#5cb885', display: 'inline-block' }} />
              <span style={{ color: '#9a918a' }}>Contract {((contract / arv) * 100).toFixed(0)}%</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: '#e8a44a', display: 'inline-block' }} />
              <span style={{ color: '#9a918a' }}>Repairs {((repairs / arv) * 100).toFixed(0)}%</span>
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 8, height: 8, borderRadius: 2, background: 'rgba(244,126,95,0.5)', display: 'inline-block' }} />
              <span style={{ color: '#9a918a' }}>Equity {Math.max(100 - ((contract + repairs) / arv) * 100, 0).toFixed(0)}%</span>
            </span>
          </div>
        </div>
      )}
    </div>
  )
}

/* ── Property Detail Modal ── */
function PropertyDetail({ post, onClose }: { post: PropertyPost; onClose: () => void }) {
  const contract = parsePrice(post.contractPrice)
  const asking = parsePrice(post.askingPrice)
  const arv = parsePrice(post.arv)

  const postedDate = new Date(post.createdAt)
  const postedAgo = (() => {
    const h = Math.floor((Date.now() - postedDate.getTime()) / (1000 * 60 * 60))
    if (h < 1) return 'Less than 1 hour ago'
    return `${h} hour${h === 1 ? '' : 's'} ago`
  })()

  return (
    <div
      style={{
        position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.88)', zIndex: 9999,
        display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
        padding: '0', overflowY: 'auto',
      }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="animate-fade-in-up property-detail-modal" style={{
        background: '#1e2530', width: '100%', maxWidth: 860,
        minHeight: '100dvh',
      }}>
        {/* Detail header */}
        <div style={{
          position: 'sticky', top: 0, zIndex: 10,
          background: 'rgba(18,22,28,0.95)', backdropFilter: 'blur(16px)',
          borderBottom: '1px solid #2e3a4d',
          padding: '14px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        }}>
          <button
            onClick={onClose}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              background: 'none', border: 'none', color: '#9a918a',
              cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif",
              padding: '6px 0',
            }}
          >
            <ArrowLeft size={16} /> Back to Properties
          </button>
          <CountdownTimer expiresAt={post.expiresAt} large />
        </div>

        {/* Property image placeholder */}
        <div style={{
          background: 'linear-gradient(135deg, rgba(244,126,95,0.08), rgba(255,179,71,0.06))',
          borderBottom: '1px solid #2e3a4d',
          padding: '40px 20px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          position: 'relative', overflow: 'hidden',
        }}>
          <div style={{
            position: 'absolute', inset: 0, opacity: 0.03,
            backgroundImage: 'repeating-linear-gradient(0deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px), repeating-linear-gradient(90deg, transparent, transparent 20px, rgba(255,255,255,0.3) 20px, rgba(255,255,255,0.3) 21px)',
          }} />
          <div style={{ textAlign: 'center', position: 'relative', zIndex: 1 }}>
            <Building2 size={48} color="#3d4e65" style={{ marginBottom: 8 }} />
            <div style={{ fontSize: 12, color: '#6b6560' }}>Property Photos Coming Soon</div>
          </div>
        </div>

        {/* Detail content */}
        <div style={{ padding: '24px 20px 40px' }}>
          {/* Type and score badges */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-blue">{post.propertyType}</span>
            <DealScore post={post} />
            <span style={{ fontSize: 11, color: '#6b6560', marginLeft: 'auto' }}>Posted {postedAgo}</span>
          </div>

          {/* Address */}
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 40px)',
            color: '#f5f0eb', letterSpacing: '0.03em', margin: '0 0 4px', lineHeight: 1.1,
          }}>
            {post.address}
          </h1>
          <p style={{ fontSize: 15, color: '#9a918a', marginBottom: 24, display: 'flex', alignItems: 'center', gap: 6 }}>
            <MapPin size={14} color="#ff7e5f" />
            {post.city}, {STATE_NAMES[post.state] || post.state}
          </p>

          {/* Property quick stats */}
          <div className="detail-stats-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(120px, 1fr))', gap: 10, marginBottom: 28,
          }}>
            {post.bedrooms && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', textAlign: 'center', border: '1px solid #2e3a4d' }}>
                <Bed size={18} color="#ff7e5f" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>{post.bedrooms}</div>
                <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bedrooms</div>
              </div>
            )}
            {post.bathrooms && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', textAlign: 'center', border: '1px solid #2e3a4d' }}>
                <Bath size={18} color="#5ba3d9" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>{post.bathrooms}</div>
                <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Bathrooms</div>
              </div>
            )}
            {post.sqft && (
              <div style={{ background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: '14px', textAlign: 'center', border: '1px solid #2e3a4d' }}>
                <Maximize size={18} color="#ffb347" style={{ marginBottom: 6 }} />
                <div style={{ fontSize: 22, fontWeight: 700, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif" }}>{post.sqft}</div>
                <div style={{ fontSize: 11, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Sq Ft</div>
              </div>
            )}
          </div>

          {/* Pricing section */}
          <div className="detail-price-grid" style={{
            display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 28,
          }}>
            <div style={{ background: 'rgba(92,184,133,0.06)', borderRadius: 12, padding: '16px', border: '1px solid rgba(92,184,133,0.15)' }}>
              <div style={{ fontSize: 10, color: '#5cb885', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Contract Price</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#5cb885', fontFamily: "'DM Sans', sans-serif" }}>${post.contractPrice}</div>
            </div>
            <div style={{ background: 'rgba(244,126,95,0.06)', borderRadius: 12, padding: '16px', border: '1px solid rgba(244,126,95,0.15)' }}>
              <div style={{ fontSize: 10, color: '#ff7e5f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Asking Price</div>
              <div style={{ fontSize: 26, fontWeight: 700, color: '#ff7e5f', fontFamily: "'DM Sans', sans-serif" }}>${post.askingPrice}</div>
            </div>
            {arv > 0 && (
              <div style={{ background: 'rgba(255,179,71,0.06)', borderRadius: 12, padding: '16px', border: '1px solid rgba(255,179,71,0.15)' }}>
                <div style={{ fontSize: 10, color: '#ffb347', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>After Repair Value</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#ffb347', fontFamily: "'DM Sans', sans-serif" }}>${post.arv}</div>
              </div>
            )}
            {parsePrice(post.repairEstimate) > 0 && (
              <div style={{ background: 'rgba(91,163,217,0.06)', borderRadius: 12, padding: '16px', border: '1px solid rgba(91,163,217,0.15)' }}>
                <div style={{ fontSize: 10, color: '#5ba3d9', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Repair Estimate</div>
                <div style={{ fontSize: 26, fontWeight: 700, color: '#5ba3d9', fontFamily: "'DM Sans', sans-serif" }}>${post.repairEstimate}</div>
              </div>
            )}
          </div>

          {/* Description */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 12, padding: '18px 20px', marginBottom: 28,
          }}>
            <h3 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb',
              letterSpacing: '0.04em', marginBottom: 10, display: 'flex', alignItems: 'center', gap: 8,
            }}>
              <FileText size={16} color="#ff7e5f" /> Deal Details
            </h3>
            <p style={{ fontSize: 14, color: '#a09890', lineHeight: 1.8 }}>{post.description}</p>
          </div>

          {/* Financial Analysis */}
          <div style={{
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 12, padding: '18px 20px', marginBottom: 28,
          }}>
            <FinancialAnalysis post={post} />
          </div>

          {/* Contact section */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(244,126,95,0.06), rgba(255,179,71,0.04))',
            border: '1px solid rgba(244,126,95,0.15)',
            borderRadius: 14, padding: '20px', marginBottom: 28,
          }}>
            <h3 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb',
              letterSpacing: '0.04em', marginBottom: 14,
            }}>
              Contact the Wholesaler
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16 }}>
              <div style={{
                width: 44, height: 44, borderRadius: 12,
                background: 'rgba(244,126,95,0.12)', border: '1px solid rgba(244,126,95,0.2)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
              }}>
                <User size={20} color="#ff7e5f" />
              </div>
              <div>
                <div style={{ fontSize: 16, fontWeight: 600, color: '#f5f0eb' }}>{post.contactName}</div>
                <div style={{ fontSize: 12, color: '#6b6560' }}>Wholesaler</div>
              </div>
            </div>
            <div className="contact-actions-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
              {post.contactPhone && (
                <a
                  href={`tel:${post.contactPhone}`}
                  className="btn-orange"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 10, textDecoration: 'none', fontSize: 14,
                  }}
                >
                  <Phone size={16} /> Call Now
                </a>
              )}
              {post.contactEmail && (
                <a
                  href={`mailto:${post.contactEmail}?subject=RE: ${post.address}, ${post.city} ${post.state}&body=Hi ${post.contactName},%0D%0A%0D%0AI'm interested in the property at ${post.address}, ${post.city}, ${post.state} listed at $${post.askingPrice}.%0D%0A%0D%0APlease send me more details.%0D%0A%0D%0AThanks`}
                  className="btn-ghost"
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                    padding: '12px 16px', borderRadius: 10, textDecoration: 'none', fontSize: 14,
                    border: '1px solid #3d4e65', color: '#f5f0eb',
                  }}
                >
                  <Mail size={16} /> Email
                </a>
              )}
            </div>
            {post.contactPhone && (
              <div style={{ textAlign: 'center', marginTop: 10, fontSize: 12, color: '#6b6560' }}>
                {post.contactPhone} &middot; {post.contactEmail}
              </div>
            )}
          </div>

          <div className="info-tip" style={{ fontSize: 12, lineHeight: 1.6 }}>
            <strong>Disclaimer:</strong> Always verify contract details, property conditions, and seller motivation independently. FTC is a marketplace — we do not guarantee any deal posted here.
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Main Properties Board ── */
function PropertiesBoard() {
  const { user, signOut } = useAuth()
  const [posts, setPosts] = useState<PropertyPost[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [showingExamples, setShowingExamples] = useState(false)
  const [selectedProperty, setSelectedProperty] = useState<PropertyPost | null>(null)

  // Filters
  const [searchQuery, setSearchQuery] = useState('')
  const [filterType, setFilterType] = useState('')
  const [filterState, setFilterState] = useState('')
  const [showFilters, setShowFilters] = useState(false)
  const [sortBy, setSortBy] = useState<'newest' | 'expiring' | 'price-low' | 'price-high'>('newest')

  // Form state
  const [form, setForm] = useState({
    address: '', city: '', state: '', contractPrice: '', askingPrice: '',
    propertyType: 'Single Family', bedrooms: '', bathrooms: '', sqft: '',
    arv: '', repairEstimate: '', description: '', contactName: '',
    contactPhone: '', contactEmail: '',
  })

  const fetchPosts = useCallback(async () => {
    try {
      const res = await fetch('/api/properties')
      const data = await res.json()
      const realPosts = data.posts || []
      if (realPosts.length > 0) {
        setPosts(realPosts)
        setShowingExamples(false)
      } else {
        setPosts(getExampleProperties())
        setShowingExamples(true)
      }
    } catch {
      console.error('Failed to fetch properties')
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => {
    fetchPosts()
    const interval = setInterval(fetchPosts, 30000)
    return () => clearInterval(interval)
  }, [fetchPosts])

  // Filtered and sorted posts
  const filteredPosts = useMemo(() => {
    let result = [...posts]

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      result = result.filter(p =>
        p.address.toLowerCase().includes(q) ||
        p.city.toLowerCase().includes(q) ||
        p.state.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.contactName.toLowerCase().includes(q)
      )
    }

    if (filterType) {
      result = result.filter(p => p.propertyType === filterType)
    }

    if (filterState) {
      result = result.filter(p => p.state === filterState)
    }

    switch (sortBy) {
      case 'newest':
        result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
      case 'expiring':
        result.sort((a, b) => new Date(a.expiresAt).getTime() - new Date(b.expiresAt).getTime())
        break
      case 'price-low':
        result.sort((a, b) => parsePrice(a.askingPrice) - parsePrice(b.askingPrice))
        break
      case 'price-high':
        result.sort((a, b) => parsePrice(b.askingPrice) - parsePrice(a.askingPrice))
        break
    }

    return result
  }, [posts, searchQuery, filterType, filterState, sortBy])

  // Stats
  const stats = useMemo(() => {
    const states = new Set(posts.map(p => p.state))
    const avgSpread = posts.reduce((sum, p) => sum + parsePrice(p.askingPrice) - parsePrice(p.contractPrice), 0) / (posts.length || 1)
    return { count: posts.length, states: states.size, avgSpread }
  }, [posts])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/properties', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create post')
        return
      }
      setShowingExamples(false)
      setPosts(prev => showingExamples ? [data.post] : [data.post, ...prev])
      setShowForm(false)
      setForm({
        address: '', city: '', state: '', contractPrice: '', askingPrice: '',
        propertyType: 'Single Family', bedrooms: '', bathrooms: '', sqft: '',
        arv: '', repairEstimate: '', description: '', contactName: '',
        contactPhone: '', contactEmail: '',
      })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  function clearFilters() {
    setSearchQuery('')
    setFilterType('')
    setFilterState('')
    setSortBy('newest')
  }

  const hasActiveFilters = searchQuery || filterType || filterState || sortBy !== 'newest'

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent' }}>
      {/* Header */}
      <nav id="sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(18,22,28,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(47,58,74,0.6)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#9a918a', fontSize: 13 }}>
              <Home size={16} />
              <span style={{ display: 'none' }} className="desktop-nav-text">Back to Hub</span>
            </Link>
            <div style={{ width: 1, height: 20, background: '#3d4e65' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#000', fontWeight: 700,
              }}>FTC</div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.06em' }}>
                Properties Board
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GlobalSearch />
            {user && (
              <button
                onClick={signOut}
                aria-label="Sign out"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #3d4e65',
                  color: '#9a918a', cursor: 'pointer',
                  fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,126,95,0.1)'; e.currentTarget.style.borderColor = 'rgba(244,126,95,0.3)'; e.currentTarget.style.color = '#ff7e5f' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.color = '#9a918a' }}
              >
                <LogOut size={12} /> Sign Out
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="btn-orange"
              style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8 }}
            >
              <Plus size={14} /> Post Property
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section style={{ background: 'transparent', borderBottom: '1px solid #2e3a4d', padding: '36px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-gradient-mesh" />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Building2 size={10} /> Properties Board
            </span>
            <span className="badge badge-red" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Clock size={10} /> 48-Hour Timer
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#f5f0eb', letterSpacing: '0.03em', margin: '0 0 8px', lineHeight: 1,
          }}>
            Got a Property Under Contract?
          </h1>
          <p style={{ color: '#9a918a', fontSize: 'clamp(13px, 1.5vw, 15px)', maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            Post your deal here and see if another wholesaler has a buyer. Each post stays live for <strong style={{ color: '#ff7e5f' }}>48 hours</strong> — if your countdown hits zero, the post is removed automatically.
          </p>

          {/* Quick stats */}
          {!loading && posts.length > 0 && (
            <div className="hero-stats-row" style={{ display: 'flex', gap: 16, marginTop: 20, flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(244,126,95,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Building2 size={14} color="#ff7e5f" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0eb', lineHeight: 1 }}>{stats.count}</div>
                  <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase' }}>Active</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(91,163,217,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <MapPin size={14} color="#5ba3d9" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0eb', lineHeight: 1 }}>{stats.states}</div>
                  <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase' }}>States</div>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: 'rgba(92,184,133,0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <DollarSign size={14} color="#5cb885" />
                </div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: '#f5f0eb', lineHeight: 1 }}>${formatUSD(Math.round(stats.avgSpread))}</div>
                  <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase' }}>Avg Spread</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '28px 20px 48px' }}>
        {/* Info tip */}
        <div className="info-warn" style={{ marginBottom: 20, display: 'flex', alignItems: 'flex-start', gap: 10 }}>
          <AlertTriangle size={16} style={{ flexShrink: 0, marginTop: 2 }} />
          <div style={{ fontSize: 13, lineHeight: 1.6 }}>
            <strong>How it works:</strong> Post a property you have under contract. Other wholesalers with buyers can reach out to you directly. Each post has a <strong>48-hour countdown</strong> — once it expires, it's removed automatically. Only post properties you have a signed contract on.
          </div>
        </div>

        {/* Search and Filter Bar */}
        <div style={{ marginBottom: 20 }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: showFilters ? 12 : 0, flexWrap: 'wrap' }}>
            {/* Search input */}
            <div style={{
              flex: '1 1 260px', display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.03)', border: '1px solid #2e3a4d',
              borderRadius: 10, padding: '0 14px',
            }}>
              <Search size={14} color="#6b6560" />
              <input
                type="text"
                placeholder="Search by address, city, state, or name..."
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{
                  flex: 1, border: 'none', background: 'none', color: '#f5f0eb',
                  fontSize: 13, padding: '10px 0', outline: 'none',
                  fontFamily: "'DM Sans', sans-serif",
                }}
              />
              {searchQuery && (
                <button onClick={() => setSearchQuery('')} style={{ background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 2 }}>
                  <X size={14} />
                </button>
              )}
            </div>

            {/* Filter toggle */}
            <button
              onClick={() => setShowFilters(!showFilters)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                background: showFilters ? 'rgba(244,126,95,0.1)' : 'rgba(255,255,255,0.03)',
                border: `1px solid ${showFilters ? 'rgba(244,126,95,0.3)' : '#2e3a4d'}`,
                borderRadius: 10, padding: '10px 16px', cursor: 'pointer',
                color: showFilters ? '#ff7e5f' : '#9a918a', fontSize: 13,
                fontFamily: "'DM Sans', sans-serif", transition: 'all 0.2s',
              }}
            >
              <Filter size={14} /> Filters
              {hasActiveFilters && (
                <span style={{
                  width: 6, height: 6, borderRadius: '50%', background: '#ff7e5f',
                }} />
              )}
            </button>

            {/* Sort */}
            <select
              value={sortBy}
              onChange={e => setSortBy(e.target.value as typeof sortBy)}
              style={{
                background: 'rgba(255,255,255,0.03)', border: '1px solid #2e3a4d',
                borderRadius: 10, padding: '10px 14px', color: '#9a918a', fontSize: 13,
                fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none',
              }}
            >
              <option value="newest">Newest First</option>
              <option value="expiring">Expiring Soon</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
            </select>
          </div>

          {/* Expanded filters */}
          {showFilters && (
            <div className="animate-slide-down" style={{
              display: 'flex', gap: 10, flexWrap: 'wrap', alignItems: 'center',
              background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
              borderRadius: 10, padding: '12px 16px',
            }}>
              <select
                value={filterType}
                onChange={e => setFilterType(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #2e3a4d',
                  borderRadius: 8, padding: '8px 12px', color: '#9a918a', fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="">All Property Types</option>
                {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
              </select>

              <select
                value={filterState}
                onChange={e => setFilterState(e.target.value)}
                style={{
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #2e3a4d',
                  borderRadius: 8, padding: '8px 12px', color: '#9a918a', fontSize: 12,
                  fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', outline: 'none',
                }}
              >
                <option value="">All States</option>
                {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>

              {hasActiveFilters && (
                <button
                  onClick={clearFilters}
                  style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 8, padding: '8px 14px', color: '#ef4444', fontSize: 12,
                    cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Clear All
                </button>
              )}

              <span style={{ fontSize: 12, color: '#6b6560', marginLeft: 'auto' }}>
                {filteredPosts.length} of {posts.length} properties
              </span>
            </div>
          )}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div className="property-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 24 }}>
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <div key={i} className="property-card" style={{ background: 'rgba(255,255,255,0.02)', borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)', overflow: 'hidden' }}>
                <div style={{ height: 200, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                <div style={{ padding: 20 }}>
                  <div style={{ width: '40%', height: 24, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 12, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '80%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '60%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 20, animation: 'pulse 1.5s infinite' }} />
                  <div style={{ width: '100%', height: 36, background: 'rgba(255,255,255,0.05)', borderRadius: 6, animation: 'pulse 1.5s infinite' }} />
                </div>
              </div>
            ))}
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 16,
          }}>
            <Building2 size={48} color="#3d4e65" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', margin: '0 0 8px' }}>
              Be the First to Post a Deal
            </h3>
            <p style={{ color: '#7a7370', fontSize: 14, maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
              List your wholesale property and connect with cash buyers instantly. Properties are visible for 48 hours.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-orange" style={{ fontSize: 15 }}>
              <Plus size={16} /> Post Your First Property
            </button>
          </div>
        )}

        {/* No results after filtering */}
        {!loading && posts.length > 0 && filteredPosts.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '40px 20px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 14,
          }}>
            <Search size={36} color="#3d4e65" style={{ margin: '0 auto 12px' }} />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 6px' }}>
              No Matching Properties
            </h3>
            <p style={{ color: '#7a7370', fontSize: 13, marginBottom: 16 }}>Try adjusting your search or filters.</p>
            <button onClick={clearFilters} className="btn-ghost" style={{ fontSize: 13 }}>
              Clear Filters
            </button>
          </div>
        )}

        {/* Example properties banner */}
        {!loading && showingExamples && filteredPosts.length > 0 && (
          <div style={{
            marginBottom: 20,
            padding: '14px 18px',
            background: 'rgba(244,126,95,0.06)',
            border: '1px solid rgba(244,126,95,0.2)',
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            gap: 10,
            flexWrap: 'wrap',
          }}>
            <div style={{
              background: 'rgba(244,126,95,0.15)',
              borderRadius: 6,
              padding: '3px 10px',
              fontSize: 11,
              fontWeight: 700,
              color: '#ff7e5f',
              textTransform: 'uppercase',
              letterSpacing: '0.06em',
            }}>
              Examples
            </div>
            <span style={{ fontSize: 13, color: '#9a918a', lineHeight: 1.5 }}>
              These are sample properties to show you how the board works. Click any card for full details!
            </span>
            <button
              onClick={() => setShowForm(true)}
              className="btn-orange"
              style={{ marginLeft: 'auto', padding: '6px 14px', fontSize: 12, borderRadius: 8 }}
            >
              <Plus size={12} /> Post Yours
            </button>
          </div>
        )}

        {/* Property Cards Grid */}
        {!loading && filteredPosts.length > 0 && (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
            {filteredPosts.map(post => {
              const assignmentFee = parsePrice(post.askingPrice) - parsePrice(post.contractPrice)

              return (
                <div
                  key={post.id}
                  className="resource-card property-card"
                  style={{ borderRadius: 14, padding: 0, overflow: 'hidden', cursor: 'pointer', position: 'relative' }}
                  onClick={() => setSelectedProperty(post)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={e => { if (e.key === 'Enter') setSelectedProperty(post) }}
                >
                  {/* Card header with timer */}
                  <div style={{
                    padding: '14px 18px',
                    background: 'rgba(244,126,95,0.04)',
                    borderBottom: '1px solid var(--color-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      <span className="badge badge-blue">{post.propertyType}</span>
                      <DealScore post={post} />
                    </div>
                    <CountdownTimer expiresAt={post.expiresAt} />
                  </div>

                  {/* Card body */}
                  <div style={{ padding: '16px 18px' }}>
                    {/* Address */}
                    <div style={{ display: 'flex', alignItems: 'flex-start', gap: 8, marginBottom: 12 }}>
                      <MapPin size={16} color="#ff7e5f" style={{ flexShrink: 0, marginTop: 2 }} />
                      <div style={{ flex: 1 }}>
                        <div style={{ fontSize: 16, fontWeight: 600, color: '#f5f0eb', lineHeight: 1.3 }}>{post.address}</div>
                        <div style={{ fontSize: 13, color: '#9a918a' }}>{post.city}, {post.state}</div>
                      </div>
                      <ArrowUpRight size={16} color="#3d4e65" style={{ flexShrink: 0 }} />
                    </div>

                    {/* Price row */}
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                      <div style={{ background: 'rgba(92,184,133,0.08)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: '#5cb885', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Contract Price</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#5cb885', fontFamily: "'DM Sans', sans-serif" }}>${post.contractPrice}</div>
                      </div>
                      <div style={{ background: 'rgba(244,126,95,0.08)', borderRadius: 8, padding: '10px 12px' }}>
                        <div style={{ fontSize: 10, color: '#ff7e5f', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>Asking Price</div>
                        <div style={{ fontSize: 16, fontWeight: 700, color: '#ff7e5f', fontFamily: "'DM Sans', sans-serif" }}>${post.askingPrice}</div>
                      </div>
                    </div>

                    {/* Assignment fee highlight */}
                    {assignmentFee > 0 && (
                      <div style={{
                        background: 'rgba(255,179,71,0.06)', border: '1px solid rgba(255,179,71,0.15)',
                        borderRadius: 8, padding: '8px 12px', marginBottom: 14,
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      }}>
                        <span style={{ fontSize: 11, color: '#9a918a' }}>Assignment Fee</span>
                        <span style={{ fontSize: 14, fontWeight: 700, color: '#ffb347', fontFamily: "'DM Sans', sans-serif" }}>${formatUSD(assignmentFee)}</span>
                      </div>
                    )}

                    {/* Property details */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14 }}>
                      {post.bedrooms && <span style={{ fontSize: 11, color: '#9a918a', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><Bed size={10} /> {post.bedrooms} bed</span>}
                      {post.bathrooms && <span style={{ fontSize: 11, color: '#9a918a', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><Bath size={10} /> {post.bathrooms} bath</span>}
                      {post.sqft && <span style={{ fontSize: 11, color: '#9a918a', background: 'rgba(255,255,255,0.04)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><Maximize size={10} /> {post.sqft} sqft</span>}
                      {post.arv && <span style={{ fontSize: 11, color: '#ffb347', background: 'rgba(255,179,71,0.08)', borderRadius: 6, padding: '3px 8px' }}>ARV: ${post.arv}</span>}
                      {post.repairEstimate && <span style={{ fontSize: 11, color: '#5ba3d9', background: 'rgba(91,163,217,0.08)', borderRadius: 6, padding: '3px 8px', display: 'flex', alignItems: 'center', gap: 3 }}><Hammer size={10} /> ${post.repairEstimate}</span>}
                    </div>

                    {/* Description (truncated) */}
                    <p style={{ fontSize: 13, color: '#a09890', lineHeight: 1.6, marginBottom: 14, borderTop: '1px solid #2e3a4d', paddingTop: 12, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                      {post.description}
                    </p>

                    {/* View Details CTA */}
                    <div style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      borderTop: '1px solid #2e3a4d', paddingTop: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#6b6560' }}>
                        <User size={12} /> {post.contactName}
                      </div>
                      <span style={{
                        display: 'flex', alignItems: 'center', gap: 4,
                        fontSize: 12, fontWeight: 600, color: '#ff7e5f',
                      }}>
                        View Details <ChevronRight size={14} />
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </main>

      {/* Property Detail Modal */}
      {selectedProperty && (
        <PropertyDetail
          post={selectedProperty}
          onClose={() => setSelectedProperty(null)}
        />
      )}

      {/* Post Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '20px', overflowY: 'auto',
        }}>
          <div className="animate-fade-in-up" style={{
            background: '#263040', border: '1px solid #3d4e65', borderRadius: 16,
            width: '100%', maxWidth: 600, margin: '40px auto',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid #3d4e65',
            }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                Post a Property
              </h2>
              <button onClick={() => { setShowForm(false); setError('') }} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                borderRadius: 8, padding: 6, cursor: 'pointer', color: '#9a918a',
              }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="property-form-grid" style={{ padding: '20px 24px' }}>
              {error && (
                <div className="info-warn" style={{ marginBottom: 16, fontSize: 13 }}>
                  {error}
                </div>
              )}

              {/* Address */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4, letterSpacing: '0.04em' }}>Property Address *</label>
                <input
                  className="input-dark"
                  placeholder="123 Main St"
                  value={form.address}
                  onChange={e => updateForm('address', e.target.value)}
                  required
                />
              </div>

              {/* City / State row */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>City *</label>
                  <input
                    className="input-dark"
                    placeholder="City"
                    value={form.city}
                    onChange={e => updateForm('city', e.target.value)}
                    required
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>State *</label>
                  <select
                    className="input-dark"
                    value={form.state}
                    onChange={e => updateForm('state', e.target.value)}
                    required
                    style={{ cursor: 'pointer' }}
                  >
                    <option value="">Select</option>
                    {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                  </select>
                </div>
              </div>

              {/* Price row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Contract Price *</label>
                  <input className="input-dark" placeholder="150,000" value={form.contractPrice} onChange={e => updateForm('contractPrice', e.target.value)} required />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Asking Price *</label>
                  <input className="input-dark" placeholder="165,000" value={form.askingPrice} onChange={e => updateForm('askingPrice', e.target.value)} required />
                </div>
              </div>

              {/* Property type */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Property Type *</label>
                <select className="input-dark" value={form.propertyType} onChange={e => updateForm('propertyType', e.target.value)} style={{ cursor: 'pointer' }}>
                  {PROPERTY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>

              {/* Details row */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Beds</label>
                  <input className="input-dark" placeholder="3" value={form.bedrooms} onChange={e => updateForm('bedrooms', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Baths</label>
                  <input className="input-dark" placeholder="2" value={form.bathrooms} onChange={e => updateForm('bathrooms', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Sq Ft</label>
                  <input className="input-dark" placeholder="1,500" value={form.sqft} onChange={e => updateForm('sqft', e.target.value)} />
                </div>
              </div>

              {/* ARV / Repair */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>ARV (After Repair Value)</label>
                  <input className="input-dark" placeholder="220,000" value={form.arv} onChange={e => updateForm('arv', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Repair Estimate</label>
                  <input className="input-dark" placeholder="35,000" value={form.repairEstimate} onChange={e => updateForm('repairEstimate', e.target.value)} />
                </div>
              </div>

              {/* Description */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Deal Description *</label>
                <textarea
                  className="input-dark"
                  placeholder="Describe the property condition, motivation level of seller, assignment terms, etc."
                  value={form.description}
                  onChange={e => updateForm('description', e.target.value)}
                  required
                  rows={3}
                  style={{ resize: 'vertical', minHeight: 80 }}
                />
              </div>

              <div className="labeled-divider" style={{ margin: '20px 0 16px' }}>Your Contact Info</div>

              {/* Contact info */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Your Name *</label>
                <input className="input-dark" placeholder="Your name" value={form.contactName} onChange={e => updateForm('contactName', e.target.value)} required />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Phone</label>
                  <input className="input-dark" placeholder="(555) 123-4567" value={form.contactPhone} onChange={e => updateForm('contactPhone', e.target.value)} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Email</label>
                  <input className="input-dark" type="email" placeholder="you@email.com" value={form.contactEmail} onChange={e => updateForm('contactEmail', e.target.value)} />
                </div>
              </div>

              <div className="info-tip" style={{ marginBottom: 20, fontSize: 12, lineHeight: 1.6 }}>
                Your post will be live for <strong>48 hours</strong> with a visible countdown timer. After that, it's automatically removed.
              </div>

              <div className="info-tip" style={{ marginTop: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 12, margin: 0, lineHeight: 1.6, color: '#8fc9a3' }}>
                  <strong>Listing Guidelines:</strong> All properties are listed for 48 hours. Include accurate contract price, ARV, and repair estimates. Misrepresented deals may be removed.
                </p>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button type="button" onClick={() => { setShowForm(false); setError('') }} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" style={{ flex: 2 }} disabled={submitting}>
                  {submitting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Posting...</> : <><Plus size={14} /> Post Property</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav-text { display: none !important; }
        }
        @media (min-width: 641px) {
          .desktop-nav-text { display: inline !important; }
        }
        @media (max-width: 720px) {
          main > div[style*="grid-template-columns"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (max-width: 640px) {
          .property-form-grid div[style*="grid-template-columns: 1fr 1fr 1fr"],
          .property-form-grid div[style*="grid-template-columns: 2fr 1fr"],
          .property-form-grid div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
          .hero-stats-row {
            gap: 12px !important;
          }
          .detail-stats-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .detail-price-grid {
            grid-template-columns: 1fr 1fr !important;
          }
          .contact-actions-grid {
            grid-template-columns: 1fr !important;
          }
          .analysis-grid {
            grid-template-columns: 1fr 1fr !important;
          }
        }
        @media (max-width: 400px) {
          .detail-stats-grid {
            grid-template-columns: 1fr !important;
          }
          .detail-price-grid {
            grid-template-columns: 1fr !important;
          }
          .analysis-grid {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 768px) {
          .property-detail-modal {
            margin: 20px auto !important;
            border-radius: 16px !important;
            min-height: auto !important;
            max-height: 90dvh;
            overflow-y: auto;
          }
        }
        .property-card:hover .view-details-text {
          color: #ff7e5f;
        }
        select option {
          background: #263040;
          color: #f5f0eb;
        }
      `}</style>
    </div>
  )
}
