import { useState } from 'react'
import {
  MapPin, BarChart3, Calculator, FileText, Mail,
  ChevronRight, ChevronLeft, Check, Loader2,
  Home, TrendingUp, Wrench, DollarSign, Download,
  AlertTriangle, Lightbulb, Copy, Target,
  Sparkles,
} from 'lucide-react'
import { toast } from '@/lib/toast'

/* ─── helpers ─── */
function fmt(n: number) {
  if (!n && n !== 0) return '$0'
  return '$' + Math.round(n).toLocaleString('en-US')
}
/* ─── step definitions ─── */
const STEPS = [
  { id: 'market', label: 'Choose Market', icon: MapPin },
  { id: 'comps', label: 'Run Comps', icon: BarChart3 },
  { id: 'mao', label: 'Calculate MAO', icon: Calculator },
  { id: 'contract', label: 'Contract Draft', icon: FileText },
  { id: 'outreach', label: 'Buyer Outreach', icon: Mail },
] as const

/* ─── US states for market picker ─── */
const US_STATES = [
  'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut',
  'Delaware', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
  'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan',
  'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire',
  'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota',
  'Tennessee', 'Texas', 'Utah', 'Vermont', 'Virginia', 'Washington', 'West Virginia',
  'Wisconsin', 'Wyoming',
]

/* ─── comp type ─── */
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

/* ─── contract generator ─── */
function generateWholesaleContract(data: {
  state: string; address: string; city: string; zip: string;
  contractPrice: number; assignmentFee: number;
}): string {
  return `WHOLESALE REAL ESTATE PURCHASE AND SALE AGREEMENT

STATE OF ${data.state.toUpperCase()}

This Purchase and Sale Agreement ("Agreement") is made as of
_____________, 20_____, by and between:

SELLER:
Name: ________________________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

BUYER/ASSIGNEE:
Name: ________________________________________________
Entity (if applicable): ________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

1. PROPERTY DESCRIPTION
The property located at:
Address: ${data.address || '_____________________________________________'}
City: ${data.city || '_________________'} County: ______________________
State: ${data.state} Zip: ${data.zip || '________'}
Legal Description: ____________________________________
APN/Parcel #: ________________________________________
(the "Property")

2. PURCHASE PRICE AND TERMS
Purchase Price: ${data.contractPrice > 0 ? fmt(data.contractPrice) : '$______________'}
Earnest Money Deposit (EMD): $______________ to be deposited
within _____ business days of execution into escrow with:
Title Company: _______________________________________
Address: _____________________________________________
The EMD shall be applied to the purchase price at closing.

3. ASSIGNMENT CLAUSE
Buyer shall have the right to assign this Agreement, in
whole or in part, to any third party ("Assignee") without
the prior written consent of Seller. Seller acknowledges
and agrees that Buyer may earn an assignment fee from such
assignment, which shall not reduce or affect the net
proceeds payable to Seller. The assignment fee amount
shall be disclosed to Seller in writing prior to or at
closing, as required by applicable state law. The
assignment fee shall be paid through the closing/title
company. Upon assignment, Assignee shall assume all
obligations of Buyer under this Agreement.

4. INSPECTION / DUE DILIGENCE PERIOD
Buyer shall have _____ calendar days from the date of this
Agreement ("Inspection Period") to conduct inspections,
appraisals, surveys, environmental assessments, and any
other due diligence at Buyer's expense. If Buyer is not
satisfied for any reason, Buyer may terminate this Agreement
by written notice before expiration of the Inspection
Period, and EMD shall be returned to Buyer in full.

5. TITLE AND CLOSING
(a) Seller shall provide marketable and insurable title,
    free of liens, encumbrances, and defects.
(b) Closing shall occur on or before: _________________
    or _____ days after expiration of Inspection Period.
(c) Closing shall be conducted by the Title Company
    named above. Seller shall provide a warranty deed
    (or applicable deed per state law) at closing.
(d) Title insurance shall be provided at Seller's expense.

6. CLOSING COSTS
Seller shall pay: deed preparation, transfer taxes (if
applicable per state), title insurance premium, any
outstanding liens, HOA estoppel (if applicable).
Buyer shall pay: recording fees, Buyer's closing costs,
any additional title endorsements requested by Buyer.

7. PROPERTY CONDITION — AS-IS
Buyer is purchasing the Property in its present "AS-IS,
WHERE-IS" condition. Seller makes no warranties or
representations regarding the condition of the Property,
including but not limited to structural, mechanical,
environmental, or habitability conditions, except as
required by applicable state law.

8. SELLER REPRESENTATIONS
Seller represents and warrants that:
(a) Seller has the legal authority to sell the Property.
(b) There are no undisclosed liens, claims, or
    encumbrances against the Property.
(c) Seller has not received notice of any pending or
    threatened legal actions affecting the Property.
(d) All required disclosures per state law have been or
    will be provided prior to closing.

9. DEFAULT AND REMEDIES
(a) If Buyer defaults, Seller's sole remedy shall be
    retention of the EMD as liquidated damages.
(b) If Seller defaults, Buyer may: (i) seek specific
    performance; (ii) terminate this Agreement and
    receive a full refund of the EMD; or (iii) pursue
    any other remedy available at law or in equity.

10. CONTINGENCIES
This Agreement is contingent upon:
[x] Clear and marketable title
[x] Satisfactory inspection within the Due Diligence Period
[ ] Buyer's Subject to Partner Approval
[ ] Buyer's Subject to Funding / Financing
[ ] Other: ____________________________________________

11. EMD DISPUTE RESOLUTION
In the event of a dispute over the disposition of the
Earnest Money Deposit, the Title Company/Escrow Agent
shall hold the EMD in escrow pending: (a) mutual written
instructions from both parties; or (b) a final court
order or arbitration award.

12. POSSESSION
Possession of the Property shall be delivered to Buyer
(or Assignee) at closing, unless otherwise agreed.

13. RISK OF LOSS
Risk of loss shall remain with Seller until closing.

14. FORCE MAJEURE / BANKRUPTCY
If either party is prevented from performing due to
acts of God, natural disasters, government orders,
or other events beyond reasonable control, the
affected party's performance shall be excused and
closing deadlines shall be extended accordingly.

15. LEAD-BASED PAINT DISCLOSURE (Pre-1978 Properties)
If the Property was built before 1978, Seller shall
provide all lead-based paint disclosures required by
federal law (42 U.S.C. 4852d).

16. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between
the parties. No modifications shall be valid unless in
writing and signed by both parties.

17. DISPUTE RESOLUTION
Any disputes arising from this Agreement shall first be
submitted to mediation. If unsuccessful, the parties may
pursue remedies available at law or in equity in the
courts of the State of ${data.state}.

18. GOVERNING LAW
This Agreement shall be governed by the laws of the
State of ${data.state}.

19. SIGNATURES
By signing below, the parties agree to all terms above.

SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

BUYER/ASSIGNEE:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney in your
state before using any contract on a live deal.`
}

/* ─── buyer email generator ─── */
function generateBuyerEmail(data: {
  address: string; city: string; state: string; zip: string;
  contractPrice: number; arv: number; repairs: number; assignmentFee: number;
  beds: string; baths: string; sqft: string; mao: number;
}): string {
  const buyerPrice = data.mao + data.assignmentFee
  const flipProfit = data.arv - buyerPrice - data.repairs
  return `Subject: NEW Off-Market Deal — ${data.city}, ${data.state} — ${Math.round(((data.arv - buyerPrice) / data.arv) * 100)}% Below ARV

Hey [BUYER NAME],

Just locked up an off-market deal. First come, first served.

PROPERTY SNAPSHOT
Address: ${data.address}, ${data.city}, ${data.state} ${data.zip}
Type: Single Family Residence
Beds / Baths: ${data.beds} / ${data.baths}
Sq Ft: ${data.sqft}

THE NUMBERS
Contract Price: ${fmt(buyerPrice)}
ARV (After Repair Value): ${fmt(data.arv)}
Estimated Repairs: ${fmt(data.repairs)}
Potential Profit (Flip): ${fmt(flipProfit)}

EXIT STRATEGY
Fix & Flip — Strong ARV with ${fmt(flipProfit)}+ profit potential
Buy & Hold — ${data.beds}bd/${data.baths}ba in ${data.city} = strong rental demand

NEXT STEPS
1. Reply "INTERESTED" for the full property package
2. Schedule a walkthrough this week
3. We can close in 14-21 days

This deal won't last — serious buyers only.

Best,
[YOUR NAME]
[YOUR PHONE]
[YOUR COMPANY]`
}

/* ═══════════════════════════════════════════════════════════
   MAIN COMPONENT
   ═══════════════════════════════════════════════════════════ */
export default function FirstDealWizard() {
  const [currentStep, setCurrentStep] = useState(0)

  /* Step 1 — Market */
  const [address, setAddress] = useState('')
  const [city, setCity] = useState('')
  const [state, setState] = useState('')
  const [zip, setZip] = useState('')
  const [sqft, setSqft] = useState('')
  const [beds, setBeds] = useState('3')
  const [baths, setBaths] = useState('2')
  const [propertyType, setPropertyType] = useState('Single Family')

  /* Step 2 — Comps */
  const [comps, setComps] = useState<Comp[]>([])
  const [marketSummary, setMarketSummary] = useState<MarketSummary | null>(null)
  const [compsLoading, setCompsLoading] = useState(false)
  const [compsError, setCompsError] = useState('')
  const [compsRan, setCompsRan] = useState(false)

  /* Step 3 — MAO */
  const [arv, setArv] = useState('')
  const [repairs, setRepairs] = useState('')
  const [assignmentFee, setAssignmentFee] = useState('10000')
  const [rulePct, setRulePct] = useState(70)

  /* Step 4 — Contract */
  const [contractGenerated, setContractGenerated] = useState(false)

  /* Step 5 — Outreach */
  const [emailGenerated, setEmailGenerated] = useState(false)
  const [copied, setCopied] = useState<'contract' | 'email' | null>(null)

  /* derived MAO numbers */
  const arvN = parseFloat(arv) || 0
  const repN = parseFloat(repairs) || 0
  const feeN = parseFloat(assignmentFee) || 0
  const mao = arvN * (rulePct / 100) - repN - feeN

  /* ─── navigation ─── */
  function canAdvance(): boolean {
    if (currentStep === 0) return !!(city.trim() && state.trim())
    if (currentStep === 1) return compsRan
    if (currentStep === 2) return arvN > 0 && mao > 0
    if (currentStep === 3) return contractGenerated
    return true
  }

  function next() {
    if (currentStep < STEPS.length - 1 && canAdvance()) setCurrentStep(currentStep + 1)
  }
  function back() {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  /* ─── comp lookup ─── */
  async function runComps() {
    setCompsLoading(true)
    setCompsError('')
    try {
      const res = await fetch('/api/comp-lookup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          address: address || `Subject property in ${city}`,
          city, state, zip,
          sqft: sqft || undefined,
          bedrooms: beds || undefined,
          bathrooms: baths || undefined,
        }),
      })
      if (!res.ok) throw new Error('Comp lookup failed')
      const data = await res.json()
      setComps(data.comps || [])
      setMarketSummary(data.marketSummary || null)
      setCompsRan(true)

      // Auto-fill ARV from median price
      if (data.marketSummary?.medianPrice && !arv) {
        setArv(String(Math.round(data.marketSummary.medianPrice)))
      }
    } catch (err: any) {
      setCompsError(err.message || 'Failed to fetch comps. Please try again.')
    } finally {
      setCompsLoading(false)
    }
  }

  /* ─── download helpers ─── */
  function downloadText(text: string, filename: string) {
    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = filename
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  function copyText(text: string, which: 'contract' | 'email') {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(which)
      toast.success('Copied to clipboard!')
      setTimeout(() => setCopied(null), 2000)
    })
  }

  const contractText = generateWholesaleContract({
    state, address, city, zip,
    contractPrice: mao,
    assignmentFee: feeN,
  })

  const emailText = generateBuyerEmail({
    address, city, state, zip,
    contractPrice: mao, arv: arvN, repairs: repN,
    assignmentFee: feeN, beds, baths, sqft, mao,
  })

  /* ═══ RENDER ═══ */
  return (
    <div>
      <h2 className="section-header" style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <Sparkles size={22} color="#ff7e5f" />
        First Deal in 15 Days
      </h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Follow this guided workflow to go from choosing a market to sending your first buyer outreach message. Complete each step before moving to the next.
      </p>

      <div className="info-tip" style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
          <Lightbulb size={14} color="#5cb885" />
          <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>HOW IT WORKS</span>
        </div>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          5 steps: Pick your market, pull comparable sales, calculate your maximum offer, generate a contract, and craft a buyer outreach message. Each step builds on the last.
        </div>
      </div>

      {/* ─── Progress bar ─── */}
      <div className="wizard-progress" style={{
        display: 'flex', gap: 0, marginBottom: 28,
        background: '#1e2530', borderRadius: 12, padding: '6px 6px',
        border: '1px solid #2e3a4d', overflowX: 'auto',
      }}>
        {STEPS.map((step, i) => {
          const Icon = step.icon
          const isActive = i === currentStep
          const isDone = i < currentStep
          return (
            <button
              key={step.id}
              onClick={() => { if (i <= currentStep) setCurrentStep(i) }}
              disabled={i > currentStep}
              className="wizard-step-btn"
              style={{
                flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                padding: '10px 8px', borderRadius: 8, border: 'none', cursor: i <= currentStep ? 'pointer' : 'default',
                background: isActive ? 'rgba(244,126,95,0.15)' : 'transparent',
                color: isActive ? '#ff7e5f' : isDone ? '#5cb885' : '#555',
                fontFamily: "'DM Sans', sans-serif", fontSize: 12, fontWeight: isActive ? 600 : 400,
                transition: 'all 0.2s', whiteSpace: 'nowrap', minWidth: 0,
                opacity: i > currentStep ? 0.4 : 1,
              }}
            >
              {isDone ? <Check size={14} /> : <Icon size={14} />}
              <span className="wizard-step-label">{step.label}</span>
            </button>
          )
        })}
      </div>

      {/* ═══ STEP 1: Choose Market ═══ */}
      {currentStep === 0 && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <MapPin size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
                Step 1: Choose Your Market
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
              Enter the target property details. City and state are required — address and specs help get better comps in the next step.
            </p>

            <div className="wizard-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ff7e5f', marginBottom: 6, fontWeight: 600 }}>
                  <MapPin size={12} /> City *
                </label>
                <input className="input-dark" placeholder="e.g. Atlanta" value={city} onChange={e => setCity(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ff7e5f', marginBottom: 6, fontWeight: 600 }}>
                  <MapPin size={12} /> State *
                </label>
                <select
                  className="input-dark"
                  value={state}
                  onChange={e => setState(e.target.value)}
                  style={{ appearance: 'none', paddingRight: 32 }}
                >
                  <option value="">Select state...</option>
                  {US_STATES.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  <Home size={12} /> Property Address
                </label>
                <input className="input-dark" placeholder="123 Main St" value={address} onChange={e => setAddress(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Zip Code
                </label>
                <input className="input-dark" placeholder="30301" value={zip} onChange={e => setZip(e.target.value)} />
              </div>
            </div>

            <div className="wizard-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Sq Ft
                </label>
                <input className="input-dark" type="number" placeholder="1500" value={sqft} onChange={e => setSqft(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Beds
                </label>
                <select className="input-dark" value={beds} onChange={e => setBeds(e.target.value)} style={{ appearance: 'none' }}>
                  {[1, 2, 3, 4, 5, 6].map(n => <option key={n} value={String(n)}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Baths
                </label>
                <select className="input-dark" value={baths} onChange={e => setBaths(e.target.value)} style={{ appearance: 'none' }}>
                  {['1', '1.5', '2', '2.5', '3', '3.5', '4'].map(n => <option key={n} value={n}>{n}</option>)}
                </select>
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#888', marginBottom: 6 }}>
                  Property Type
                </label>
                <select className="input-dark" value={propertyType} onChange={e => setPropertyType(e.target.value)} style={{ appearance: 'none' }}>
                  {['Single Family', 'Townhouse', 'Duplex', 'Multi-Family', 'Condo'].map(t => <option key={t} value={t}>{t}</option>)}
                </select>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ═══ STEP 2: Run Comps ═══ */}
      {currentStep === 1 && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <BarChart3 size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
                Step 2: Run Comparable Sales
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
              Pull estimated comparable sales for <strong style={{ color: '#f5f0eb' }}>{city}, {state}</strong>.
              {address && <> Property: <strong style={{ color: '#f5f0eb' }}>{address}</strong>.</>}
            </p>

            <div className="info-warn" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={14} color="#c47a1a" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#c47a1a', letterSpacing: '0.05em' }}>DISCLAIMER</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                These comps are AI-generated estimates for educational purposes. Always verify with MLS data, county records, or a licensed agent before making offers.
              </div>
            </div>

            {!compsRan && (
              <button
                onClick={runComps}
                disabled={compsLoading}
                className="btn-orange"
                style={{ padding: '14px 28px', fontSize: 15, opacity: compsLoading ? 0.7 : 1 }}
              >
                {compsLoading ? (
                  <><Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Running Comp Analysis...</>
                ) : (
                  <><BarChart3 size={16} /> Run Comp Estimate</>
                )}
              </button>
            )}

            {compsError && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>
                {compsError}
              </div>
            )}

            {/* Market Summary */}
            {marketSummary && (
              <div style={{ marginTop: 20, padding: 20, background: 'rgba(244,126,95,0.06)', border: '1px solid rgba(244,126,95,0.2)', borderRadius: 10 }}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 12px' }}>
                  Market Summary
                </h4>
                <div className="wizard-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(140px, 1fr))', gap: 10, marginBottom: 12 }}>
                  <div style={{ background: '#1e2530', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Median Price</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb' }}>{fmt(marketSummary.medianPrice)}</div>
                  </div>
                  <div style={{ background: '#1e2530', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>$/SqFt</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb' }}>${marketSummary.medianPricePerSqft}</div>
                  </div>
                  <div style={{ background: '#1e2530', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Avg DOM</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb' }}>{marketSummary.avgDaysOnMarket}</div>
                  </div>
                  <div style={{ background: '#1e2530', borderRadius: 8, padding: 12, textAlign: 'center' }}>
                    <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>Trend</div>
                    <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: marketSummary.trend === 'rising' ? '#5cb885' : marketSummary.trend === 'declining' ? '#ef4444' : '#ffb347' }}>
                      {marketSummary.trend}
                    </div>
                  </div>
                </div>
                {marketSummary.notes && (
                  <p style={{ fontSize: 13, color: '#aaa', margin: 0, lineHeight: 1.6 }}>{marketSummary.notes}</p>
                )}
              </div>
            )}

            {/* Comp cards */}
            {comps.length > 0 && (
              <div style={{ marginTop: 20 }}>
                <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
                  Comparable Sales ({comps.length})
                </h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {comps.map((c, i) => (
                    <div key={i} style={{
                      background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 8, padding: '14px 16px',
                      display: 'flex', flexWrap: 'wrap', gap: '8px 20px', alignItems: 'center',
                    }}>
                      <div style={{ flex: '1 1 200px', minWidth: 0 }}>
                        <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 500, marginBottom: 2, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {c.address}
                        </div>
                        <div style={{ fontSize: 11, color: '#888' }}>
                          {c.city}, {c.state} {c.zip} &middot; {c.distanceMiles}mi away
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap', fontSize: 12, color: '#aaa' }}>
                        <span><strong style={{ color: '#5cb885' }}>{fmt(c.salePrice)}</strong></span>
                        <span>{c.sqft} sqft</span>
                        <span>{c.bedrooms}bd/{c.bathrooms}ba</span>
                        <span>${c.pricePerSqft}/sqft</span>
                        <span>{c.daysOnMarket} DOM</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 3: Calculate MAO ═══ */}
      {currentStep === 2 && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Calculator size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
                Step 3: Calculate Maximum Allowable Offer
              </h3>
            </div>

            <div className="info-tip" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Lightbulb size={14} color="#5cb885" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>FORMULA</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                <strong>MAO = ARV x {rulePct}% - Repairs - Assignment Fee</strong>
                {marketSummary && <> &middot; Market median: {fmt(marketSummary.medianPrice)}</>}
              </div>
            </div>

            <div className="wizard-form-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 20 }}>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ff7e5f', marginBottom: 6, fontWeight: 600 }}>
                  <TrendingUp size={12} /> After Repair Value (ARV) *
                </label>
                <input className="input-dark" type="number" placeholder="250000" value={arv} onChange={e => setArv(e.target.value)} style={{ borderColor: arvN > 0 ? '#5cb885' : undefined }} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ff7e5f', marginBottom: 6, fontWeight: 600 }}>
                  <Wrench size={12} /> Estimated Repairs *
                </label>
                <input className="input-dark" type="number" placeholder="35000" value={repairs} onChange={e => setRepairs(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ffb347', marginBottom: 6, fontWeight: 600 }}>
                  <DollarSign size={12} /> Assignment Fee
                </label>
                <input className="input-dark" type="number" placeholder="10000" value={assignmentFee} onChange={e => setAssignmentFee(e.target.value)} />
              </div>
              <div>
                <label style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#ffb347', marginBottom: 6, fontWeight: 600 }}>
                  Rule %
                </label>
                <div style={{ display: 'flex', gap: 6 }}>
                  {[65, 70, 75, 80].map(p => (
                    <button
                      key={p}
                      onClick={() => setRulePct(p)}
                      style={{
                        flex: 1, padding: '10px 0', borderRadius: 6,
                        border: `1px solid ${rulePct === p ? '#ff7e5f' : '#3d4e65'}`,
                        background: rulePct === p ? 'rgba(244,126,95,0.15)' : 'transparent',
                        color: rulePct === p ? '#ff7e5f' : '#888',
                        cursor: 'pointer', fontSize: 14, fontWeight: 600,
                        fontFamily: "'DM Sans', sans-serif",
                      }}
                    >
                      {p}%
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* MAO result */}
            {arvN > 0 && (
              <div style={{
                display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginTop: 20,
              }}>
                <div style={{
                  background: 'rgba(244,126,95,0.06)', border: '2px solid #ff7e5f', borderRadius: 10, padding: 20,
                  textAlign: 'center', position: 'relative',
                }}>
                  <div style={{ fontSize: 11, color: '#ff7e5f', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>
                    Your MAO
                  </div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: mao > 0 ? '#ff7e5f' : '#ef4444' }}>
                    {fmt(mao)}
                  </div>
                </div>
                <div style={{ background: '#1e2530', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>ARV</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb' }}>{fmt(arvN)}</div>
                </div>
                <div style={{ background: '#1e2530', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Repairs</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#e8a44a' }}>{fmt(repN)}</div>
                </div>
                <div style={{ background: '#1e2530', borderRadius: 10, padding: 20, textAlign: 'center' }}>
                  <div style={{ fontSize: 11, color: '#888', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 6 }}>Your Fee</div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#5cb885' }}>{fmt(feeN)}</div>
                </div>
              </div>
            )}

            {mao < 0 && arvN > 0 && (
              <div style={{ marginTop: 16, padding: '12px 16px', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, color: '#ef4444', fontSize: 13 }}>
                <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 6 }} />
                MAO is negative — the numbers don&apos;t work at this ARV. Increase ARV, reduce repairs, or lower your fee.
              </div>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 4: Contract Draft ═══ */}
      {currentStep === 3 && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <FileText size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
                Step 4: Generate Contract Draft
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
              Standard wholesale purchase &amp; sale agreement for <strong style={{ color: '#f5f0eb' }}>{state}</strong> with your deal numbers pre-filled. Contract price: <strong style={{ color: '#ff7e5f' }}>{fmt(mao)}</strong>.
            </p>

            <div className="info-warn" style={{ marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <AlertTriangle size={14} color="#c47a1a" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#c47a1a', letterSpacing: '0.05em' }}>LEGAL NOTICE</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                This contract template is for educational purposes. Always have a licensed real estate attorney in your state review any contract before using it on a live deal.
              </div>
            </div>

            {!contractGenerated ? (
              <button
                onClick={() => setContractGenerated(true)}
                className="btn-orange"
                style={{ padding: '14px 28px', fontSize: 15 }}
              >
                <FileText size={16} /> Generate Contract Draft
              </button>
            ) : (
              <>
                <div style={{
                  background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 8,
                  padding: 20, maxHeight: 400, overflowY: 'auto', marginBottom: 16,
                  fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#ccc',
                  lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {contractText}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => downloadText(contractText, `Contract_${address?.replace(/\s+/g, '_') || city}_${state}.txt`)}
                    className="btn-orange"
                    style={{ padding: '10px 20px', fontSize: 13 }}
                  >
                    <Download size={14} /> Download Contract
                  </button>
                  <button
                    onClick={() => copyText(contractText, 'contract')}
                    style={{
                      padding: '10px 20px', fontSize: 13, borderRadius: 8,
                      border: '1px solid #3d4e65', background: 'rgba(255,255,255,0.04)',
                      color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {copied === 'contract' ? <Check size={14} color="#5cb885" /> : <Copy size={14} />}
                    {copied === 'contract' ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}

      {/* ═══ STEP 5: Buyer Outreach ═══ */}
      {currentStep === 4 && (
        <div style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
              <Mail size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
                Step 5: Create Buyer Outreach Message
              </h3>
            </div>
            <p style={{ fontSize: 13, color: '#888', marginBottom: 16, lineHeight: 1.6 }}>
              Send this to your buyers list to start getting offers. All your deal numbers are pre-filled.
            </p>

            {!emailGenerated ? (
              <button
                onClick={() => setEmailGenerated(true)}
                className="btn-orange"
                style={{ padding: '14px 28px', fontSize: 15 }}
              >
                <Mail size={16} /> Generate Buyer Email
              </button>
            ) : (
              <>
                <div style={{
                  background: '#1e2530', border: '1px solid #2e3a4d', borderRadius: 8,
                  padding: 20, maxHeight: 400, overflowY: 'auto', marginBottom: 16,
                  fontFamily: "'Courier Prime', monospace", fontSize: 12, color: '#ccc',
                  lineHeight: 1.7, whiteSpace: 'pre-wrap', wordBreak: 'break-word',
                }}>
                  {emailText}
                </div>
                <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                  <button
                    onClick={() => downloadText(emailText, `Buyer_Email_${city}_${state}.txt`)}
                    className="btn-orange"
                    style={{ padding: '10px 20px', fontSize: 13 }}
                  >
                    <Download size={14} /> Download Email
                  </button>
                  <button
                    onClick={() => copyText(emailText, 'email')}
                    style={{
                      padding: '10px 20px', fontSize: 13, borderRadius: 8,
                      border: '1px solid #3d4e65', background: 'rgba(255,255,255,0.04)',
                      color: '#ccc', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6,
                      fontFamily: "'DM Sans', sans-serif",
                    }}
                  >
                    {copied === 'email' ? <Check size={14} color="#5cb885" /> : <Copy size={14} />}
                    {copied === 'email' ? 'Copied!' : 'Copy to Clipboard'}
                  </button>
                </div>
              </>
            )}

            {/* Completion */}
            {emailGenerated && (
              <div style={{
                marginTop: 24, padding: 20,
                background: 'linear-gradient(135deg, rgba(92,184,133,0.08), rgba(92,184,133,0.02))',
                border: '1px solid rgba(92,184,133,0.25)', borderRadius: 10,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 10 }}>
                  <Check size={20} color="#5cb885" />
                  <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#5cb885', letterSpacing: '0.04em', margin: 0 }}>
                    Workflow Complete!
                  </h4>
                </div>
                <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, margin: '0 0 12px' }}>
                  You&apos;ve completed all 5 steps. Here&apos;s your summary:
                </p>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 6, fontSize: 13, color: '#aaa' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#5cb885" /> Market: <strong style={{ color: '#f5f0eb' }}>{city}, {state}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#5cb885" /> Comps analyzed: <strong style={{ color: '#f5f0eb' }}>{comps.length} properties</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#5cb885" /> MAO: <strong style={{ color: '#ff7e5f' }}>{fmt(mao)}</strong> ({rulePct}% rule)
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#5cb885" /> Contract drafted for <strong style={{ color: '#f5f0eb' }}>{state}</strong>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <Check size={14} color="#5cb885" /> Buyer outreach email ready
                  </div>
                </div>
                <div style={{ marginTop: 16 }}>
                  <div className="info-tip" style={{ margin: 0 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                      <Target size={14} color="#5cb885" />
                      <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>NEXT STEPS</span>
                    </div>
                    <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                      1. Verify comps with MLS/county records. 2. Have an attorney review your contract. 3. Send the buyer email to your list. 4. Follow up within 24 hours. 5. Track everything in your CRM.
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ─── Navigation buttons ─── */}
      <div style={{
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        marginTop: 24, gap: 12, flexWrap: 'wrap',
      }}>
        <button
          onClick={back}
          disabled={currentStep === 0}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '12px 20px', borderRadius: 8,
            border: '1px solid #3d4e65',
            background: currentStep === 0 ? 'transparent' : 'rgba(255,255,255,0.04)',
            color: currentStep === 0 ? '#444' : '#ccc',
            cursor: currentStep === 0 ? 'default' : 'pointer',
            fontSize: 14, fontFamily: "'DM Sans', sans-serif",
            opacity: currentStep === 0 ? 0.4 : 1,
            transition: 'all 0.2s',
          }}
        >
          <ChevronLeft size={16} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#666' }}>
          Step {currentStep + 1} of {STEPS.length}
        </div>

        {currentStep < STEPS.length - 1 && (
          <button
            onClick={next}
            disabled={!canAdvance()}
            className="btn-orange"
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '12px 24px', fontSize: 14,
              opacity: canAdvance() ? 1 : 0.4,
            }}
          >
            Next <ChevronRight size={16} />
          </button>
        )}

        {currentStep === STEPS.length - 1 && (
          <div style={{ fontSize: 12, color: '#5cb885', display: 'flex', alignItems: 'center', gap: 6 }}>
            <Check size={14} /> All steps available
          </div>
        )}
      </div>
    </div>
  )
}
