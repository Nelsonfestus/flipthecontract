import { useState } from 'react'
import {
  CheckCircle2,
  Circle,
  ChevronDown,
  ChevronRight,
  Phone,
  Search,
  FileText,
  Users,
  HandshakeIcon,
  DollarSign,
  Target,
  Lightbulb,
  AlertTriangle,
  BookOpen,
  Clock,
  Calculator,
  TrendingUp,
  ClipboardList,
} from 'lucide-react'

function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', label: 'TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', label: 'WARNING', color: '#c47a1a' },
    note: { cls: 'info-note', label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{cfg.label}</span>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

interface ChecklistItem {
  id: string
  label: string
  description: string
}

interface Phase {
  id: string
  title: string
  icon: React.ReactNode
  color: string
  items: ChecklistItem[]
  tips: string[]
  mistakes: string[]
  resources: string[]
  documents: string[]
  timeline: string
}

const PHASES: Phase[] = [
  {
    id: 'lead-gen',
    title: 'Lead Generation',
    icon: <Target size={20} />,
    color: '#ff7e5f',
    timeline: '1-2 weeks (ongoing)',
    items: [
      { id: 'lg-1', label: 'Pull motivated seller lists', description: 'Use county records for pre-foreclosures, tax delinquents, absentee owners, probate, and high-equity properties.' },
      { id: 'lg-2', label: 'Set up driving-for-dollars routes', description: 'Identify neighborhoods with distressed properties. Use Deal Machine or similar apps to log addresses on the go.' },
      { id: 'lg-3', label: 'Launch marketing campaigns', description: 'Send direct mail (yellow letters, postcards), cold call lists, or run PPC/Facebook ads targeting motivated sellers.' },
      { id: 'lg-4', label: 'Build referral network', description: 'Connect with probate attorneys, divorce attorneys, property managers, and code enforcement officers who encounter motivated sellers.' },
      { id: 'lg-5', label: 'Set up lead tracking system', description: 'Use a CRM (Podio, REI Sift, InvestorFuse) to organize leads by status, follow-up dates, and deal potential.' },
    ],
    tips: [
      'Stack multiple marketing channels -- don\'t rely on just one.',
      'The money is in the follow-up. Most deals close on the 5th-12th contact.',
      'Start with free methods (driving for dollars, Craigslist) before spending on direct mail.',
    ],
    mistakes: [
      'Giving up too early -- most new wholesalers quit before their marketing gains traction.',
      'Skipping list scrubbing -- sending mail to wrong addresses wastes money.',
      'Not tracking KPIs like cost per lead and cost per deal.',
    ],
    resources: ['Buy Leads', 'Skip Trace'],
    documents: ['Marketing budget spreadsheet', 'Lead source tracking sheet', 'CRM setup checklist'],
  },
  {
    id: 'initial-contact',
    title: 'Initial Contact',
    icon: <Phone size={20} />,
    color: '#ffb347',
    timeline: '1-3 days per lead',
    items: [
      { id: 'ic-1', label: 'Make initial contact with seller', description: 'Call, text, or visit the property owner. Use a proven script. Ask about their situation, timeline, and motivation level.' },
      { id: 'ic-2', label: 'Qualify the seller\'s motivation', description: 'Rate motivation 1-10. Key indicators: behind on payments, recent divorce/death, vacant property, code violations, tired landlord.' },
      { id: 'ic-3', label: 'Gather property details', description: 'Get beds/baths, square footage, lot size, year built, condition, any liens or encumbrances, and the seller\'s asking price.' },
      { id: 'ic-4', label: 'Schedule property walkthrough', description: 'If the lead is warm (motivation 7+), schedule an in-person or virtual walkthrough to assess condition and build rapport.' },
      { id: 'ic-5', label: 'Document lead in CRM', description: 'Log all details: seller contact info, property info, motivation level, notes from conversation, and next follow-up date.' },
    ],
    tips: [
      'Let the seller talk -- ask open-ended questions and listen for pain points.',
      'Never give your offer on the first call. Gather info, then call back with numbers.',
      'Text "Is this still available?" if responding to a for-sale-by-owner listing.',
    ],
    mistakes: [
      'Sounding like a telemarketer -- be conversational, not scripted.',
      'Making an offer before understanding the seller\'s situation.',
      'Not following up. Set calendar reminders for every lead.',
    ],
    resources: ['Sales Scripts', 'Key Verbiage'],
    documents: ['Seller interview questionnaire', 'Property info sheet', 'Follow-up schedule template'],
  },
  {
    id: 'property-analysis',
    title: 'Property Analysis',
    icon: <Search size={20} />,
    color: '#5cb885',
    timeline: '1-2 days',
    items: [
      { id: 'pa-1', label: 'Pull comparable sales (comps)', description: 'Find 3-5 recently sold properties within 0.5 miles, similar size/beds/baths, sold in last 6 months. Use Zillow, PropStream, or MLS.' },
      { id: 'pa-2', label: 'Calculate After Repair Value (ARV)', description: 'Average the top 3 comps adjusted for differences. This is what the property is worth fully renovated.' },
      { id: 'pa-3', label: 'Estimate repair costs', description: 'Walk the property or use photos. Estimate costs for roof, HVAC, plumbing, electrical, cosmetic, foundation. Use per-sqft estimates if needed.' },
      { id: 'pa-4', label: 'Calculate Maximum Allowable Offer', description: 'MAO = ARV x 70% - Repairs - Your Assignment Fee. This is the most you should offer the seller.' },
      { id: 'pa-5', label: 'Verify title and liens', description: 'Run a preliminary title search or check county records for mortgages, tax liens, judgments, or HOA liens that could affect the deal.' },
      { id: 'pa-6', label: 'Confirm deal meets buyer criteria', description: 'Cross-reference your numbers with what your cash buyers typically want: minimum equity spread, preferred neighborhoods, property types.' },
    ],
    tips: [
      'Be conservative with ARV -- use median, not the highest comp.',
      'Add 10-20% buffer to repair estimates for unexpected issues.',
      'The numbers don\'t lie. If the deal doesn\'t work at 70%, walk away.',
    ],
    mistakes: [
      'Inflating ARV to make a deal work on paper -- this kills credibility with buyers.',
      'Underestimating repairs, especially on older homes (pre-1970).',
      'Ignoring liens -- a $5k tax lien can destroy your assignment fee.',
    ],
    resources: ['ARV & NOI Calculators', 'Property Map'],
    documents: ['Comp analysis worksheet', 'Repair estimate template', 'Deal analysis spreadsheet'],
  },
  {
    id: 'contract-signing',
    title: 'Contract Signing',
    icon: <FileText size={20} />,
    color: '#5a9ad6',
    timeline: '1-3 days',
    items: [
      { id: 'cs-1', label: 'Present offer to seller', description: 'Walk the seller through your offer in person if possible. Explain the process, timeline, and how they benefit (fast close, no repairs, no agent fees).' },
      { id: 'cs-2', label: 'Execute purchase agreement', description: 'Use your state-compliant Purchase & Sale Agreement. Include "and/or assigns" after your name. Ensure assignment clause is included.' },
      { id: 'cs-3', label: 'Collect signed contract and disclosures', description: 'Get all pages signed and initialed. Include seller property disclosure if required by your state. Keep copies of everything.' },
      { id: 'cs-4', label: 'Submit earnest money deposit', description: 'Deposit EMD ($100-$500 typical) with the title company or escrow agent within the timeframe specified in the contract.' },
      { id: 'cs-5', label: 'Open escrow with title company', description: 'Send executed contract to your title company. Request a preliminary title report and confirm closing timeline.' },
    ],
    tips: [
      'Always include an inspection contingency -- this is your exit clause if the deal falls apart.',
      'Set a closing date 21-30 days out to give yourself time to find a buyer.',
      'Use a title company that is investor-friendly and understands assignments.',
    ],
    mistakes: [
      'Forgetting the "and/or assigns" language -- without it, you may not be able to assign.',
      'Setting too short a closing window. Give yourself at least 21 days.',
      'Not reading the contract you\'re using. Know every clause.',
    ],
    resources: ['Contract Templates', 'State Laws', 'Title Companies'],
    documents: ['Purchase & Sale Agreement', 'Assignment clause addendum', 'Seller disclosure form', 'EMD receipt'],
  },
  {
    id: 'marketing-buyers',
    title: 'Marketing to Buyers',
    icon: <Users size={20} />,
    color: '#a855f7',
    timeline: '3-10 days',
    items: [
      { id: 'mb-1', label: 'Create property marketing package', description: 'Include photos, address, beds/baths/sqft, ARV, repair estimate, asking price, and your contact info. Make it professional.' },
      { id: 'mb-2', label: 'Blast to your buyers list', description: 'Email your deal to your cash buyers list. Include key numbers upfront: purchase price, ARV, estimated repairs, potential profit.' },
      { id: 'mb-3', label: 'Post on investor platforms', description: 'Share on BiggerPockets, Facebook investor groups, Craigslist, and local REIA meetups. Cast a wide net.' },
      { id: 'mb-4', label: 'Follow up with interested buyers', description: 'Respond to inquiries within minutes. Send additional info, schedule property viewings, and gauge buyer seriousness.' },
      { id: 'mb-5', label: 'Negotiate assignment fee with buyer', description: 'Your assignment fee is the difference between your contract price and what the buyer pays. Typical range: $5k-$15k for residential.' },
      { id: 'mb-6', label: 'Collect buyer proof of funds', description: 'Before accepting a buyer, verify they can close. Get proof of funds (bank statement, proof of lending) and confirm their timeline.' },
    ],
    tips: [
      'Build your buyers list BEFORE you get your first deal. Attend REIA meetings, network on Facebook groups.',
      'Price your deal to sell fast. A quick $7k fee beats a stalled $15k fee every time.',
      'Always have 2-3 backup buyers in case your primary buyer falls through.',
    ],
    mistakes: [
      'Overpricing the assignment fee and scaring away buyers.',
      'Not having a buyers list before locking up a deal.',
      'Sharing the seller\'s contact info with buyers (they\'ll go around you).',
    ],
    resources: ['Buyer Template', 'Hedge Fund Buyers', 'Investment Brokerages'],
    documents: ['Property marketing flyer', 'Buyers list spreadsheet', 'Proof of funds template'],
  },
  {
    id: 'assignment-close',
    title: 'Assignment / Double Close',
    icon: <HandshakeIcon size={20} />,
    color: '#ef4444',
    timeline: '3-7 days',
    items: [
      { id: 'ac-1', label: 'Execute assignment agreement', description: 'Sign the Assignment of Contract with your end buyer. Specify the assignment fee, closing date, and terms.' },
      { id: 'ac-2', label: 'Send assignment to title company', description: 'Forward the signed assignment agreement to the title company handling the closing. Confirm they have everything needed.' },
      { id: 'ac-3', label: 'Coordinate closing details', description: 'Confirm closing date/time with seller, buyer, and title company. Ensure all parties have required documents.' },
      { id: 'ac-4', label: 'Review settlement statement (HUD-1/CD)', description: 'Check the Closing Disclosure or HUD-1 for accuracy. Verify your assignment fee, all credits/debits, and proration of taxes.' },
      { id: 'ac-5', label: 'Attend closing (or sign remotely)', description: 'Be present at closing if possible. If doing a double close, you\'ll close the A-B transaction first, then the B-C transaction.' },
    ],
    tips: [
      'If your assignment fee is large (>$15k), consider a double close to keep it private.',
      'Have your title company explain the process to nervous sellers -- it builds trust.',
      'Always do a final walkthrough before closing to confirm property condition.',
    ],
    mistakes: [
      'Not reading the settlement statement -- errors happen and they cost you money.',
      'Choosing a title company that doesn\'t do assignments or double closes.',
      'Waiting until the last minute to coordinate. Start coordinating 5+ days before closing.',
    ],
    resources: ['Contract Templates', 'Title Companies', 'State Laws'],
    documents: ['Assignment of Contract agreement', 'Closing Disclosure / HUD-1', 'Wire instructions', 'Closing checklist'],
  },
  {
    id: 'post-close',
    title: 'Post-Close',
    icon: <DollarSign size={20} />,
    color: '#2dd4bf',
    timeline: '1-3 days',
    items: [
      { id: 'pc-1', label: 'Confirm assignment fee received', description: 'Verify the title company has disbursed your assignment fee via check or wire. Confirm the amount matches your agreement.' },
      { id: 'pc-2', label: 'Send thank-you to all parties', description: 'Thank the seller, buyer, and title company. Relationships are everything in this business. Ask for referrals.' },
      { id: 'pc-3', label: 'Update deal tracker and records', description: 'Log final numbers: purchase price, assignment fee, total marketing spend, timeline, and lessons learned.' },
      { id: 'pc-4', label: 'Add buyer to your VIP list', description: 'If the buyer closed smoothly and quickly, flag them as a priority buyer for future deals. Note their buying criteria.' },
      { id: 'pc-5', label: 'Review and optimize your process', description: 'What worked? What slowed you down? Refine your systems, scripts, and marketing for the next deal.' },
    ],
    tips: [
      'Set aside 25-30% of your assignment fee for taxes. Wholesale income is self-employment income.',
      'Reinvest a portion of your profits back into marketing to keep your pipeline full.',
      'Document every deal as a case study -- you\'ll use these to build credibility.',
    ],
    mistakes: [
      'Spending your entire assignment fee without setting aside money for taxes.',
      'Not following up with the buyer for future deals.',
      'Failing to analyze what worked and what didn\'t -- every deal is a learning opportunity.',
    ],
    resources: ['JV Resources', 'Reviews'],
    documents: ['Assignment fee receipt', 'Deal summary sheet', 'Tax records folder', 'Buyer feedback form'],
  },
]

export default function DealChecklist() {
  const [checked, setChecked] = useState<Record<string, boolean>>({})
  const [expandedPhases, setExpandedPhases] = useState<Record<string, boolean>>({ 'lead-gen': true })

  const totalItems = PHASES.reduce((sum, p) => sum + p.items.length, 0)
  const completedItems = Object.values(checked).filter(Boolean).length
  const progressPct = totalItems > 0 ? Math.round((completedItems / totalItems) * 100) : 0

  const toggleCheck = (id: string) => {
    setChecked(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const togglePhase = (id: string) => {
    setExpandedPhases(prev => ({ ...prev, [id]: !prev[id] }))
  }

  const getPhaseProgress = (phase: Phase) => {
    const done = phase.items.filter(i => checked[i.id]).length
    return { done, total: phase.items.length, pct: Math.round((done / phase.items.length) * 100) }
  }

  return (
    <div style={{ maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
          <ClipboardList size={28} color="#ff7e5f" />
          <h2 className="section-header" style={{ margin: 0 }}>Deal Pipeline Checklist</h2>
        </div>
        <p style={{ fontSize: 14, color: '#888', lineHeight: 1.6, maxWidth: 700 }}>
          Track every step of your wholesale deal from lead generation to closing. Check off items as you complete them to monitor your progress through each phase.
        </p>
      </div>

      {/* Overall Progress */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: 20, marginBottom: 28 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em' }}>
            Overall Deal Progress
          </span>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: progressPct === 100 ? '#5cb885' : '#ff7e5f', letterSpacing: '0.04em' }}>
            {progressPct}%
          </span>
        </div>
        <div style={{ background: '#2e3a4d', borderRadius: 8, height: 12, overflow: 'hidden', border: '1px solid #3d4e65' }}>
          <div
            style={{
              width: `${progressPct}%`,
              height: '100%',
              background: progressPct === 100
                ? 'linear-gradient(90deg, #5cb885, #34d399)'
                : 'linear-gradient(90deg, #ff7e5f, #ffb347)',
              borderRadius: 8,
              transition: 'width 0.4s ease, background 0.4s ease',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 8 }}>
          <span style={{ fontSize: 12, color: '#888' }}>{completedItems} of {totalItems} tasks completed</span>
          {progressPct === 100 && (
            <span style={{ fontSize: 12, color: '#5cb885', fontWeight: 600 }}>Deal Complete!</span>
          )}
        </div>
      </div>

      {/* Phase Pipeline Visual */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 28, overflowX: 'auto', paddingBottom: 4 }}>
        {PHASES.map((phase, i) => {
          const prog = getPhaseProgress(phase)
          const isComplete = prog.pct === 100
          const isActive = prog.done > 0 && prog.pct < 100
          return (
            <button
              key={phase.id}
              onClick={() => {
                setExpandedPhases(() => {
                  const next: Record<string, boolean> = {}
                  PHASES.forEach(p => { next[p.id] = p.id === phase.id })
                  return next
                })
              }}
              style={{
                flex: 1,
                minWidth: 90,
                background: isComplete ? 'rgba(45,184,133,0.12)' : isActive ? `${phase.color}15` : '#263040',
                border: `1px solid ${isComplete ? '#5cb885' : isActive ? phase.color : '#3d4e65'}`,
                borderRadius: 8,
                padding: '10px 6px',
                cursor: 'pointer',
                textAlign: 'center',
                transition: 'all 0.2s ease',
              }}
            >
              <div style={{ fontSize: 11, color: isComplete ? '#5cb885' : phase.color, fontWeight: 600, marginBottom: 2 }}>
                {i + 1}
              </div>
              <div style={{ fontSize: 10, color: isComplete ? '#5cb885' : '#888', lineHeight: 1.3 }}>
                {phase.title.split(' ')[0]}
              </div>
              {isComplete && <CheckCircle2 size={12} color="#5cb885" style={{ marginTop: 2 }} />}
            </button>
          )
        })}
      </div>

      {/* Phase Sections */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {PHASES.map((phase, phaseIndex) => {
          const prog = getPhaseProgress(phase)
          const isExpanded = expandedPhases[phase.id]
          const isComplete = prog.pct === 100

          return (
            <div
              key={phase.id}
              className="resource-card"
              style={{ borderRadius: 12, overflow: 'hidden', borderColor: isComplete ? '#5cb885' : undefined }}
            >
              {/* Phase Header */}
              <button
                onClick={() => togglePhase(phase.id)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  padding: '16px 20px',
                  background: 'transparent',
                  border: 'none',
                  cursor: 'pointer',
                  textAlign: 'left',
                }}
              >
                <div style={{
                  width: 36,
                  height: 36,
                  borderRadius: 8,
                  background: isComplete ? 'rgba(45,184,133,0.15)' : `${phase.color}18`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: isComplete ? '#5cb885' : phase.color,
                  flexShrink: 0,
                }}>
                  {isComplete ? <CheckCircle2 size={20} /> : phase.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 20,
                      color: isComplete ? '#5cb885' : phase.color,
                      letterSpacing: '0.04em',
                    }}>
                      Phase {phaseIndex + 1}: {phase.title}
                    </span>
                    <span className={isComplete ? 'badge badge-green' : 'badge badge-orange'}>
                      {prog.done}/{prog.total}
                    </span>
                  </div>
                  {/* Mini progress bar */}
                  <div style={{ background: '#2e3a4d', borderRadius: 4, height: 4, marginTop: 6, maxWidth: 200 }}>
                    <div style={{
                      width: `${prog.pct}%`,
                      height: '100%',
                      background: isComplete ? '#5cb885' : phase.color,
                      borderRadius: 4,
                      transition: 'width 0.3s ease',
                    }} />
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                  <span style={{ fontSize: 11, color: '#666', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={12} /> {phase.timeline}
                  </span>
                  {isExpanded ? <ChevronDown size={18} color="#888" /> : <ChevronRight size={18} color="#888" />}
                </div>
              </button>

              {/* Expanded Content */}
              {isExpanded && (
                <div style={{ padding: '0 20px 20px', animation: 'fadeIn 0.3s ease' }}>
                  {/* Checklist Items */}
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 20 }}>
                    {phase.items.map(item => {
                      const isDone = checked[item.id]
                      return (
                        <button
                          key={item.id}
                          onClick={() => toggleCheck(item.id)}
                          style={{
                            display: 'flex',
                            alignItems: 'flex-start',
                            gap: 12,
                            padding: '12px 14px',
                            background: isDone ? 'rgba(45,184,133,0.06)' : '#2e3a4d',
                            border: `1px solid ${isDone ? 'rgba(45,184,133,0.25)' : '#3d4e65'}`,
                            borderRadius: 8,
                            cursor: 'pointer',
                            textAlign: 'left',
                            width: '100%',
                            transition: 'all 0.2s ease',
                          }}
                        >
                          <div style={{ flexShrink: 0, marginTop: 1 }}>
                            {isDone
                              ? <CheckCircle2 size={18} color="#5cb885" />
                              : <Circle size={18} color="#555" />
                            }
                          </div>
                          <div style={{ flex: 1 }}>
                            <div style={{
                              fontSize: 14,
                              fontWeight: 600,
                              color: isDone ? '#5cb885' : '#f5f0eb',
                              textDecoration: isDone ? 'line-through' : 'none',
                              marginBottom: 3,
                            }}>
                              {item.label}
                            </div>
                            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                              {item.description}
                            </div>
                          </div>
                        </button>
                      )
                    })}
                  </div>

                  {/* Tips & Mistakes Grid */}
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))', gap: 12, marginBottom: 16 }}>
                    {/* Tips */}
                    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <Lightbulb size={14} color="#5cb885" />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: '#5cb885', letterSpacing: '0.04em' }}>
                          Pro Tips
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {phase.tips.map((tip, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{tip}</li>
                        ))}
                      </ul>
                    </div>

                    {/* Common Mistakes */}
                    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 16 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
                        <AlertTriangle size={14} color="#c47a1a" />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 15, color: '#c47a1a', letterSpacing: '0.04em' }}>
                          Common Mistakes
                        </span>
                      </div>
                      <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
                        {phase.mistakes.map((m, i) => (
                          <li key={i} style={{ fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>{m}</li>
                        ))}
                      </ul>
                    </div>
                  </div>

                  {/* Resources & Documents */}
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
                    {phase.resources.map(r => (
                      <span key={r} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        background: 'rgba(244,126,95,0.08)',
                        border: '1px solid rgba(244,126,95,0.2)',
                        borderRadius: 6,
                        fontSize: 11,
                        color: '#ff7e5f',
                        fontWeight: 500,
                      }}>
                        <BookOpen size={10} /> {r}
                      </span>
                    ))}
                    {phase.documents.map(d => (
                      <span key={d} style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 4,
                        padding: '4px 10px',
                        background: 'rgba(136,136,136,0.08)',
                        border: '1px solid rgba(136,136,136,0.2)',
                        borderRadius: 6,
                        fontSize: 11,
                        color: '#888',
                      }}>
                        <FileText size={10} /> {d}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Quick Reference Section */}
      <div style={{ marginTop: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
          <Calculator size={24} color="#ff7e5f" />
          <h2 className="section-header" style={{ margin: 0, fontSize: 'clamp(24px, 3.5vw, 36px)' }}>Quick Reference</h2>
        </div>

        {/* Wholesale Formulas */}
        <div className="resource-card" style={{ borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 16 }}>
            Essential Wholesale Formulas
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {[
              {
                name: 'Maximum Allowable Offer (MAO)',
                formula: 'MAO = ARV x 70% - Repairs - Assignment Fee',
                example: 'ARV $200,000 x 70% = $140,000 - $25,000 repairs - $10,000 fee = $105,000 MAO',
                color: '#ff7e5f',
              },
              {
                name: 'Assignment Fee',
                formula: 'Assignment Fee = Buyer Price - Your Contract Price',
                example: 'Buyer pays $115,000 - Your contract at $105,000 = $10,000 assignment fee',
                color: '#5cb885',
              },
              {
                name: 'Investor Profit Check',
                formula: 'Investor Profit = ARV - Purchase Price - Repairs - Holding Costs - Selling Costs',
                example: '$200,000 - $115,000 - $25,000 - $8,000 - $16,000 = $36,000 investor profit',
                color: '#5a9ad6',
              },
              {
                name: '70% Rule (Quick Check)',
                formula: 'Max Price = ARV x 0.70 - Rehab Cost',
                example: '$200,000 x 0.70 - $25,000 = $115,000 (includes room for your fee + investor profit)',
                color: '#ffb347',
              },
              {
                name: 'Cap Rate (Rental Properties)',
                formula: 'Cap Rate = (NOI / Purchase Price) x 100',
                example: '$12,000 NOI / $150,000 price = 8% cap rate',
                color: '#a855f7',
              },
            ].map(f => (
              <div key={f.name} style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 14 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: f.color, marginBottom: 6 }}>{f.name}</div>
                <div className="font-mono-contract" style={{ fontSize: 13, color: '#f5f0eb', marginBottom: 6, padding: '6px 10px', background: '#12161c', borderRadius: 4, border: '1px solid #2e3a4d' }}>
                  {f.formula}
                </div>
                <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>
                  <strong style={{ color: '#aaa' }}>Example:</strong> {f.example}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Documents by Phase */}
        <div className="resource-card" style={{ borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 16 }}>
            Key Documents by Phase
          </h3>
          <div style={{ overflowX: 'auto' }}>
            <table className="state-table" style={{ width: '100%', borderCollapse: 'collapse' }}>
              <thead>
                <tr>
                  <th>Phase</th>
                  <th>Required Documents</th>
                </tr>
              </thead>
              <tbody>
                {PHASES.map((phase, i) => (
                  <tr key={phase.id}>
                    <td style={{ whiteSpace: 'nowrap' }}>
                      <span style={{ color: phase.color, fontWeight: 600 }}>{i + 1}. {phase.title}</span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                        {phase.documents.map(d => (
                          <span key={d} style={{
                            display: 'inline-block',
                            padding: '2px 8px',
                            background: '#2e3a4d',
                            borderRadius: 4,
                            fontSize: 12,
                            color: '#ccc',
                            whiteSpace: 'nowrap',
                          }}>
                            {d}
                          </span>
                        ))}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Timeline Estimates */}
        <div className="resource-card" style={{ borderRadius: 12, padding: 24, marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 16 }}>
            Timeline: Your First Deal
          </h3>
          <div style={{ position: 'relative', paddingLeft: 24 }}>
            {/* Vertical line */}
            <div style={{
              position: 'absolute',
              left: 7,
              top: 4,
              bottom: 4,
              width: 2,
              background: 'linear-gradient(to bottom, #ff7e5f, #ffb347, #5cb885, #5a9ad6, #a855f7, #ef4444, #2dd4bf)',
              borderRadius: 1,
            }} />
            {PHASES.map((phase, i) => (
              <div key={phase.id} style={{ position: 'relative', paddingBottom: i < PHASES.length - 1 ? 20 : 0, paddingLeft: 24 }}>
                {/* Dot */}
                <div style={{
                  position: 'absolute',
                  left: -24,
                  top: 4,
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  background: phase.color,
                  border: '2px solid #12161c',
                }} />
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flexWrap: 'wrap' }}>
                  <span style={{ fontSize: 14, fontWeight: 600, color: phase.color }}>{phase.title}</span>
                  <span style={{ fontSize: 12, color: '#888', display: 'flex', alignItems: 'center', gap: 4 }}>
                    <Clock size={11} /> {phase.timeline}
                  </span>
                </div>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 20, padding: '12px 16px', background: '#263040', borderRadius: 8, border: '1px solid #3d4e65' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <TrendingUp size={14} color="#ff7e5f" />
              <span style={{ fontSize: 13, fontWeight: 600, color: '#f5f0eb' }}>Total estimated timeline: 30-45 days for your first deal</span>
            </div>
            <p style={{ fontSize: 12, color: '#888', marginTop: 4, lineHeight: 1.5 }}>
              Experienced wholesalers can close deals in 14-21 days. Speed comes with practice, systems, and a strong buyers list.
            </p>
          </div>
        </div>

        {/* Bottom Tips */}
        <InfoBox type="tip">
          <strong>First Deal Strategy:</strong> Focus on one marketing channel, one property type, and one market area. Master the basics before expanding. Your first deal will take longer than expected -- that's normal.
        </InfoBox>
        <InfoBox type="warn">
          <strong>Legal Compliance:</strong> Wholesale laws vary by state. Some states require a real estate license to wholesale. Always check your state's regulations on the <strong>State Laws</strong> tab before doing your first deal.
        </InfoBox>
        <InfoBox type="note">
          <strong>Track Your Numbers:</strong> Every deal should be logged with marketing spend, time invested, and profit earned. This data helps you optimize your business and scale smarter.
        </InfoBox>
      </div>
    </div>
  )
}
