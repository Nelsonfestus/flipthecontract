import { useState, useCallback } from 'react'
import {
  Target,
  Calculator,
  FileText,
  Users,
  HandshakeIcon,
  ChevronRight,
  ChevronLeft,
  CheckCircle2,
  Circle,
  RotateCcw,
  Trophy,
  AlertTriangle,
  Lightbulb,
  Clock,
  DollarSign,
  Home,
  Gamepad2,
  ChevronDown,
} from 'lucide-react'

/* ── helpers ── */
function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', label: 'PRO TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', label: 'WATCH OUT', color: '#c47a1a' },
    note: { cls: 'info-note', label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{cfg.label}</span>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

/* ── scenario data ── */
interface Scenario {
  id: string
  title: string
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced' | 'Expert'
  difficultyColor: string
  address: string
  city: string
  state: string
  propertyType: string
  beds: number
  baths: number
  sqft: number
  yearBuilt: number
  condition: string
  ownerName: string
  ownerSituation: string
  ownerMotivation: number
  askingPrice: number
  arv: number
  repairEstimate: number
  correctOffer: number
  correctAssignmentFee: number
  buyerType: string
  buyerName: string
  buyerOffer: number
  comps: { address: string; soldPrice: number; sqft: number; condition: string }[]
  tips: string[]
}

/* ── curveball events — thrown mid-deal on Expert scenarios ── */
interface Curveball {
  stepId: string
  title: string
  description: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
  impact: string
}

function getCurveballs(scenario: Scenario): Curveball[] {
  if (scenario.id === 'scenario-4') {
    return [
      {
        stepId: 'write-contract',
        title: 'Curveball: Due-on-Sale Risk',
        description: 'Your buyer\'s attorney flags that taking the property subject-to the existing mortgage triggers the due-on-sale clause. The lender could technically call the full loan balance due.',
        question: 'How do you handle this risk in the contract and protect your buyer?',
        options: [
          'Include a clause acknowledging the due-on-sale risk with a contingency that buyer can exit if the lender accelerates the loan within 90 days',
          'Remove the subject-to structure entirely and switch to a conventional purchase',
          'Ignore it — lenders almost never enforce due-on-sale clauses',
        ],
        correctIndex: 0,
        explanation: 'The smart approach is to disclose the risk and build a contractual safety net. While due-on-sale enforcement is rare on performing loans, a professional buyer expects this risk to be addressed in writing. Never ignore it or remove a profitable deal structure — mitigate it.',
        impact: 'This adds a contingency period but preserves the favorable 3.2% rate that makes this deal attractive.',
      },
      {
        stepId: 'find-buyer',
        title: 'Curveball: Tenant Complications',
        description: 'Unit A\'s tenant just informed you they\'re withholding next month\'s rent due to a maintenance issue (broken A/C). Your buyer is asking about tenant estoppel certificates.',
        question: 'What should you do before assigning this deal to your buyer?',
        options: [
          'Get signed estoppel certificates from both tenants confirming lease terms, rent amounts, deposits, and any outstanding maintenance requests',
          'Tell the buyer the tenants are happy and will cooperate',
          'Offer to reduce your assignment fee by $2,000 to cover the A/C repair',
        ],
        correctIndex: 0,
        explanation: 'Estoppel certificates protect the buyer by having tenants confirm in writing: current rent, lease terms, security deposit amounts, and any claims against the landlord. This is standard practice in multi-unit deals and catches issues before they become closing problems.',
        impact: 'Getting estoppels adds 5-7 days but prevents post-closing disputes and builds buyer confidence.',
      },
    ]
  }
  if (scenario.id === 'scenario-5') {
    return [
      {
        stepId: 'run-numbers',
        title: 'Curveball: Hidden Liens Discovered',
        description: 'Your title search reveals an additional IRS tax lien of $22,000 against the LLC. The seller "forgot" about it. The total encumbrances are now: $32,000 back taxes + $14,200 code fines + $8,500 mechanic\'s lien + $22,000 IRS lien = $76,700.',
        question: 'How does this change your deal analysis and offer?',
        options: [
          'Recalculate: MAO stays at $75,500 but now the seller nets only ~$55,000 minus $76,700 in liens — the seller may owe money at closing. Renegotiate or walk.',
          'Increase your offer to cover the liens so the seller gets something',
          'Ignore the IRS lien — it\'s the seller\'s problem, not yours',
        ],
        correctIndex: 0,
        explanation: 'When total liens ($76,700) approach or exceed your offer, the seller may need to bring money to closing or negotiate with lien holders. You must recalculate whether this deal is still viable. IRS liens survive transfer and are absolutely your buyer\'s problem if not cleared at closing.',
        impact: 'This may require a short sale negotiation with lien holders or the deal may need to be restructured as a double close.',
      },
      {
        stepId: 'close-deal',
        title: 'Curveball: Demolition Timeline Accelerated',
        description: 'The city just moved up the demolition hearing by 3 weeks. You now have 18 days to close instead of 45. Your buyer\'s hard money lender needs 21 days minimum for funding.',
        question: 'How do you handle this closing timeline crisis?',
        options: [
          'Request an emergency hearing continuance from the city while simultaneously arranging a bridge loan or transactional funding for a double close within 18 days',
          'Ask the buyer to pay cash to speed up closing',
          'Walk away from the deal — the timeline is too tight',
        ],
        correctIndex: 0,
        explanation: 'Attack on two fronts: file for a continuance (most cities will grant 30 days if you show a pending sale contract) AND arrange backup funding. Transactional funding for double closes can fund in 3-5 days. Never rely on a single path when timelines are critical.',
        impact: 'This adds transactional funding costs (~$2,000-3,000) but saves a $20,000 assignment fee.',
      },
    ]
  }
  return []
}

const DIFFICULTY_ORDER = ['Expert', 'Beginner', 'Intermediate', 'Advanced'] as const
type DifficultyFilter = 'All' | Scenario['difficulty']
const DIFFICULTY_OPTIONS: DifficultyFilter[] = ['All', 'Expert', 'Beginner', 'Intermediate', 'Advanced']
const DIFFICULTY_COLORS: Record<string, string> = {
  Expert: '#e040fb',
  Beginner: '#5cb885',
  Intermediate: '#e8a44a',
  Advanced: '#ff7e5f',
}

const SCENARIOS: Scenario[] = [
  {
    id: 'scenario-4',
    title: 'The Subject-To Duplex',
    difficulty: 'Expert' as any,
    difficultyColor: '#e040fb',
    address: '3190 Westwood Park Ave',
    city: 'Houston',
    state: 'TX',
    propertyType: 'Duplex',
    beds: 4,
    baths: 3,
    sqft: 2600,
    yearBuilt: 2001,
    condition: 'Good condition overall — Unit A needs minor cosmetic updates ($5K), Unit B recently renovated. Both units currently occupied.',
    ownerName: 'James & Patricia Howard',
    ownerSituation: 'Relocating for job transfer in 30 days. Owe $192,000 on a 3.2% fixed-rate mortgage (20 years remaining). Current rental income is $2,800/mo combined. Property taxes are current. HOA of $150/mo.',
    ownerMotivation: 8,
    askingPrice: 265000,
    arv: 320000,
    repairEstimate: 12000,
    correctOffer: 212000,
    correctAssignmentFee: 18000,
    buyerType: 'Buy & Hold Investor',
    buyerName: 'Metro Equity Partners',
    buyerOffer: 230000,
    comps: [
      { address: '3204 Westwood Park Ave', soldPrice: 315000, sqft: 2550, condition: 'Fully renovated duplex' },
      { address: '3118 Westwood Park Ave', soldPrice: 328000, sqft: 2700, condition: 'Updated, both units occupied' },
      { address: '2980 Cedarbrook Ln', soldPrice: 305000, sqft: 2400, condition: 'Renovated, single unit occupied' },
    ],
    tips: [
      'Subject-to deals keep the seller\'s existing mortgage in place — the low interest rate is the real prize here.',
      'Always disclose the subject-to structure to the buyer; it affects their exit strategy.',
      'Due-on-sale clause risk is real but rarely enforced on performing loans. Still, disclose it and plan for it.',
      'With rental income of $2,800/mo and a mortgage payment of ~$1,050/mo, this property cash-flows day one.',
    ],
  },
  {
    id: 'scenario-5',
    title: 'The Code Violation Flip',
    difficulty: 'Expert' as any,
    difficultyColor: '#e040fb',
    address: '7744 Industrial Blvd',
    city: 'Detroit',
    state: 'MI',
    propertyType: 'Single Family',
    beds: 5,
    baths: 3,
    sqft: 2800,
    yearBuilt: 1955,
    condition: 'Major rehab — open code violations (electrical, plumbing), unpermitted addition, roof replacement needed, environmental concerns (possible lead paint/asbestos)',
    ownerName: 'Frank DeLuca (DeLuca Holdings LLC)',
    ownerSituation: 'Absentee owner with an LLC. Accumulated $14,200 in code violation fines. City threatening demolition order in 90 days. Property has $32,000 in back taxes. Owner has 6 other distressed properties and wants to liquidate portfolio. Title has a mechanic\'s lien of $8,500 from a previous contractor.',
    ownerMotivation: 9,
    askingPrice: 85000,
    arv: 225000,
    repairEstimate: 82000,
    correctOffer: 55000,
    correctAssignmentFee: 20000,
    buyerType: 'Experienced Rehabber',
    buyerName: 'Motor City Renovations Inc.',
    buyerOffer: 75000,
    comps: [
      { address: '7800 Industrial Blvd', soldPrice: 218000, sqft: 2650, condition: 'Fully renovated' },
      { address: '7612 Industrial Blvd', soldPrice: 232000, sqft: 2900, condition: 'Updated, move-in ready' },
      { address: '7520 Gratiot Ave', soldPrice: 221000, sqft: 2750, condition: 'Renovated, new systems' },
    ],
    tips: [
      'Code violations and liens must be disclosed to the buyer — they affect closing costs and timeline.',
      'Always run a full title search on properties with LLC owners — multiple liens and encumbrances are common.',
      'Factor in environmental remediation costs (lead paint, asbestos) for pre-1978 homes — this is a federal requirement.',
      'Demolition orders create extreme urgency but also extreme leverage for negotiation.',
      'A double close may be necessary here to avoid exposing a large assignment fee on a distressed property.',
    ],
  },
  {
    id: 'scenario-1',
    title: 'The Tired Landlord',
    difficulty: 'Beginner',
    difficultyColor: '#5cb885',
    address: '1247 Maple Grove Dr',
    city: 'Memphis',
    state: 'TN',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2,
    sqft: 1450,
    yearBuilt: 1985,
    condition: 'Needs cosmetic rehab — dated kitchen, worn carpet, exterior paint peeling',
    ownerName: 'Robert Jenkins',
    ownerSituation: 'Tired landlord. Has owned the property for 12 years, last tenant trashed it 6 months ago. Behind on property taxes. Lives out of state and wants to be done with it.',
    ownerMotivation: 8,
    askingPrice: 95000,
    arv: 165000,
    repairEstimate: 28000,
    correctOffer: 82000,
    correctAssignmentFee: 10000,
    buyerType: 'Fix & Flip Investor',
    buyerName: 'Apex Renovations LLC',
    buyerOffer: 92000,
    comps: [
      { address: '1310 Maple Grove Dr', soldPrice: 158000, sqft: 1400, condition: 'Fully renovated' },
      { address: '1189 Maple Grove Dr', soldPrice: 172000, sqft: 1520, condition: 'Fully renovated' },
      { address: '940 Oak Hill Ln', soldPrice: 161000, sqft: 1480, condition: 'Updated, minor repairs needed' },
    ],
    tips: [
      'Tired landlords are some of the best leads — they want out fast.',
      'Always verify tax delinquency amounts at the county assessor.',
      'Cosmetic rehabs have the highest profit margins for buyers.',
    ],
  },
  {
    id: 'scenario-2',
    title: 'The Probate Property',
    difficulty: 'Intermediate',
    difficultyColor: '#e8a44a',
    address: '8821 Riverside Ave',
    city: 'Jacksonville',
    state: 'FL',
    propertyType: 'Single Family',
    beds: 4,
    baths: 2,
    sqft: 1820,
    yearBuilt: 1978,
    condition: 'Moderate rehab — roof needs replacement, outdated HVAC, foundation cracks in garage',
    ownerName: 'Maria Gonzalez (Estate of Carlos Gonzalez)',
    ownerSituation: 'Inherited from father who passed 8 months ago. Probate is open. Maria lives in New York and has no interest in managing the property. Two siblings want to split proceeds.',
    ownerMotivation: 7,
    askingPrice: 140000,
    arv: 245000,
    repairEstimate: 55000,
    correctOffer: 112000,
    correctAssignmentFee: 15000,
    buyerType: 'Buy & Hold Investor',
    buyerName: 'Sunbelt Capital Group',
    buyerOffer: 127000,
    comps: [
      { address: '8900 Riverside Ave', soldPrice: 238000, sqft: 1750, condition: 'Fully renovated' },
      { address: '8714 Riverside Ave', soldPrice: 252000, sqft: 1900, condition: 'Updated, move-in ready' },
      { address: '9020 Willow Creek Dr', soldPrice: 241000, sqft: 1800, condition: 'Fully renovated' },
    ],
    tips: [
      'Always confirm probate has been filed and the personal representative has authority to sell.',
      'Multiple heirs can complicate deals — get all parties to agree before contracting.',
      'Probate deals often take 30-60 days longer to close. Build that into your timeline.',
    ],
  },
  {
    id: 'scenario-3',
    title: 'The Pre-Foreclosure Sprint',
    difficulty: 'Advanced',
    difficultyColor: '#ff7e5f',
    address: '4502 Pinehurst Blvd',
    city: 'Atlanta',
    state: 'GA',
    propertyType: 'Single Family',
    beds: 3,
    baths: 2.5,
    sqft: 2100,
    yearBuilt: 1992,
    condition: 'Light cosmetic work — property is livable, needs paint, landscaping, and appliance updates',
    ownerName: 'David & Tanya Williams',
    ownerSituation: 'Behind 4 months on mortgage ($1,850/mo). Foreclosure auction scheduled in 45 days. Owe $148,000 on the mortgage. Both lost jobs during layoffs. Need to sell fast to avoid foreclosure on their credit.',
    ownerMotivation: 9,
    askingPrice: 175000,
    arv: 285000,
    repairEstimate: 18000,
    correctOffer: 165000,
    correctAssignmentFee: 12000,
    buyerType: 'Hedge Fund / Institutional',
    buyerName: 'Trident Residential Fund',
    buyerOffer: 177000,
    comps: [
      { address: '4610 Pinehurst Blvd', soldPrice: 279000, sqft: 2050, condition: 'Updated, minor cosmetic' },
      { address: '4388 Pinehurst Blvd', soldPrice: 292000, sqft: 2200, condition: 'Fully renovated' },
      { address: '4750 Roswell Ct', soldPrice: 281000, sqft: 2100, condition: 'Move-in ready' },
    ],
    tips: [
      'Time is everything in pre-foreclosure. You must close before the auction date.',
      'Always verify the payoff amount with the lender — sellers sometimes understate what they owe.',
      'Consider a double close if the spread is tight. Assignment may expose your fee to the seller.',
    ],
  },
]

/* ── step definitions ── */
const STEPS = [
  { id: 'find-lead', label: 'Find the Lead', icon: Target, color: '#ff7e5f' },
  { id: 'run-numbers', label: 'Run the Numbers', icon: Calculator, color: '#ffb347' },
  { id: 'write-contract', label: 'Write the Contract', icon: FileText, color: '#5ba3d9' },
  { id: 'find-buyer', label: 'Find a Buyer', icon: Users, color: '#a855f7' },
  { id: 'close-deal', label: 'Close the Deal', icon: HandshakeIcon, color: '#5cb885' },
]

/* ── quiz questions per step ── */
interface Question {
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

function getStepQuestions(scenario: Scenario, stepId: string): Question[] {
  switch (stepId) {
    case 'find-lead':
      if (scenario.id === 'scenario-4') {
        return [
          {
            question: `The sellers are relocating in 30 days with an existing 3.2% mortgage. What makes this a subject-to opportunity rather than a standard wholesale deal?`,
            options: [
              'The below-market interest rate (3.2%) is more valuable than the equity spread — a buyer keeps the cheap debt',
              'Subject-to is always better than wholesale assignment',
              'The sellers are motivated, so any deal structure works',
            ],
            correctIndex: 0,
            explanation: 'In a high-rate environment, a 3.2% locked-in mortgage is a massive asset. A buy-and-hold investor can acquire the property and keep the cheap debt, making the cash flow significantly better than if they financed at current rates (7%+). This is the core value proposition.',
          },
          {
            question: `This is a duplex with $2,800/mo rental income and $192,000 owed on the mortgage. What is the approximate monthly debt service and cash-on-cash return if the mortgage payment is ~$1,050/mo?`,
            options: [
              'Net cash flow ~$1,600/mo after mortgage and HOA — strong positive cash flow from day one',
              'Net cash flow ~$800/mo — decent but not great',
              'The property is cash-flow negative because of the HOA',
            ],
            correctIndex: 0,
            explanation: `Rental income ($2,800) minus mortgage ($1,050) minus HOA ($150) = ~$1,600/mo net before maintenance reserves. That's approximately $19,200/year. On a down payment equivalent of ~$20K-$40K (assignment fee + closing costs), this is an exceptional cash-on-cash return.`,
          },
          {
            question: 'When acquiring a duplex with existing tenants, what must you verify BEFORE making an offer?',
            options: [
              'Review all existing lease agreements, verify rent payment history, confirm security deposits, and check for any pending maintenance requests or tenant disputes',
              'Just verify the property condition and comps',
              'Ask the seller if the tenants are good — their word is enough',
            ],
            correctIndex: 0,
            explanation: 'Existing tenants represent both income and liability. You must verify leases (month-to-month vs. fixed term), actual rent collected (not just listed rent), deposit amounts held, and any outstanding issues. This due diligence protects your buyer and prevents surprises at closing.',
          },
        ]
      }
      if (scenario.id === 'scenario-5') {
        return [
          {
            question: `This property has code violations, back taxes ($32K), a mechanic's lien ($8.5K), and a demolition threat. What is the FIRST thing you verify before spending time on this deal?`,
            options: [
              'Run a full title search to identify ALL liens, encumbrances, and judgments — you need the total financial picture before analyzing the deal',
              'Pull comps to determine the ARV',
              'Contact the city about the demolition timeline',
            ],
            correctIndex: 0,
            explanation: 'On heavily distressed properties, the title search comes first. If total liens exceed what the property is worth at wholesale, the deal may be dead before you start. You found $54,700 in known encumbrances — but a title search might reveal more. Always know the full picture.',
          },
          {
            question: `The property was built in 1955. What federal requirement affects the rehab budget that many new wholesalers overlook?`,
            options: [
              'EPA Lead Paint Rule (RRP) — any renovation in pre-1978 homes requires certified contractors for lead paint, adding $3,000-$15,000+ to rehab costs',
              'FHA minimum property standards must be met',
              'The property needs a historical preservation review',
            ],
            correctIndex: 0,
            explanation: 'The EPA Renovation, Repair, and Painting (RRP) Rule requires certified contractors for ANY renovation that disturbs lead paint in pre-1978 homes. Violations carry fines up to $37,500/day. This significantly increases rehab costs and timeline — your buyer MUST factor this in.',
          },
          {
            question: 'The seller owns this property through an LLC (DeLuca Holdings LLC). What additional due diligence is required compared to an individual seller?',
            options: [
              'Verify the LLC is in good standing, confirm the signer has authority (operating agreement or articles), check for UCC filings and judgments against the entity',
              'Just verify the deed is in the LLC name',
              'No additional steps — an LLC works the same as an individual seller',
            ],
            correctIndex: 0,
            explanation: 'LLC-owned properties require extra verification: the entity must be active/in good standing with the state, the person signing must have documented authority, and you need to search for UCC filings (secured debts) and entity-level judgments. Failing to verify authority can void the entire transaction.',
          },
        ]
      }
      return [
        {
          question: `${scenario.ownerName} is described as: "${scenario.ownerSituation.split('.')[0]}." How would you rate their motivation level?`,
          options: ['Low (1-3) — Just testing the market', 'Medium (4-6) — Somewhat interested in selling', 'High (7-10) — Motivated and ready to sell'],
          correctIndex: 2,
          explanation: `This seller has a motivation level of ${scenario.ownerMotivation}/10. Key indicators: ${scenario.ownerSituation.split('.').slice(1, 3).join('.').trim()}.`,
        },
        {
          question: 'What is the FIRST thing you should verify about this property?',
          options: ['Check Zillow for the Zestimate', 'Pull comps and verify the ARV', 'Look up the owner on social media'],
          correctIndex: 1,
          explanation: 'Always start by pulling comparable sales (comps) to determine the After Repair Value (ARV). This is the foundation of every wholesale deal analysis.',
        },
        {
          question: `The property at ${scenario.address} is ${scenario.propertyType}, ${scenario.beds}bd/${scenario.baths}ba, ${scenario.sqft.toLocaleString()} sqft. What lead source would most likely surface this deal?`,
          options: ['Driving for Dollars', 'County tax delinquent list', 'MLS expired listings'],
          correctIndex: 1,
          explanation: 'Motivated sellers with financial distress (back taxes, pre-foreclosure, probate) are most commonly found through county records and targeted lists. Always cross-reference with skip-trace data.',
        },
      ]
    case 'run-numbers':
      if (scenario.id === 'scenario-4') {
        return [
          {
            question: `This is a subject-to deal. The standard 70% rule gives MAO = $${Math.round(scenario.arv * 0.7 - scenario.repairEstimate).toLocaleString()}. But what ADDITIONAL factor makes this deal worth more than a standard wholesale?`,
            options: [
              'The assumable 3.2% mortgage — at today\'s 7%+ rates, the interest savings over 20 years is worth $80,000+, which increases the deal\'s value to a buy-and-hold buyer',
              'Duplexes are always worth more than single-family homes',
              'The location in Houston guarantees appreciation',
            ],
            correctIndex: 0,
            explanation: 'The 70% rule is a starting point for fix-and-flip analysis. But this is a cash-flow play. A buyer financing $192K at 3.2% pays ~$1,050/mo. At 7%, that same balance would cost ~$1,490/mo. That $440/mo savings = $5,280/year = $105,600 over 20 years. This is why subject-to deals in low-rate mortgages command premium assignment fees.',
          },
          {
            question: `Calculate the Cap Rate for this duplex: NOI = ($2,800/mo rent × 12) - ($150/mo HOA × 12) - estimated expenses (insurance $1,800/yr, maintenance $2,400/yr, vacancy 5%). What is the approximate cap rate at your offer of $${scenario.correctOffer.toLocaleString()}?`,
            options: [
              `~12.8% — ($${scenario.correctOffer.toLocaleString()} purchase) this is an excellent cap rate for a duplex`,
              '~6.5% — average for this market',
              '~4.2% — below average, the deal doesn\'t pencil out',
            ],
            correctIndex: 0,
            explanation: `Gross income: $33,600/yr. Less vacancy (5%): $31,920. Less HOA ($1,800), insurance ($1,800), maintenance ($2,400) = NOI of ~$25,920. Cap Rate = NOI / Purchase Price = $25,920 / $212,000 = 12.2%. Even with conservative estimates, this is a strong cap rate that will attract buy-and-hold investors.`,
          },
          {
            question: 'Your buyer will take over the existing mortgage subject-to. What number is MOST critical for them to verify independently?',
            options: [
              'The exact loan payoff balance, remaining term, interest rate, and whether the loan is current — get a third-party payoff statement from the lender',
              'The property tax assessment',
              'The Zestimate on Zillow',
            ],
            correctIndex: 0,
            explanation: 'In a subject-to deal, the buyer is taking over an existing loan. They MUST independently verify the payoff balance, rate, term, and payment status directly with the lender (or through a title company). Never rely on the seller\'s word for loan details — a single missed payment you don\'t know about can trigger acceleration.',
          },
        ]
      }
      if (scenario.id === 'scenario-5') {
        return [
          {
            question: `The ARV is $${scenario.arv.toLocaleString()} and repairs are $${scenario.repairEstimate.toLocaleString()}. But this property has known encumbrances totaling $54,700 (back taxes + fines + mechanic's lien). How do you calculate your TRUE maximum offer?`,
            options: [
              `MAO = (ARV × 70%) - Repairs - Encumbrances = ($${scenario.arv.toLocaleString()} × 0.70) - $${scenario.repairEstimate.toLocaleString()} - $54,700 = $${Math.round(scenario.arv * 0.7 - scenario.repairEstimate - 54700).toLocaleString()} — but since this is negative/very low, you need to negotiate lien reductions`,
              `$${Math.round(scenario.arv * 0.7 - scenario.repairEstimate).toLocaleString()} — use the standard formula, liens are the seller's problem`,
              `$${scenario.askingPrice.toLocaleString()} — match the asking price to secure the deal fast`,
            ],
            correctIndex: 0,
            explanation: `Standard MAO: ($225,000 × 0.70) - $82,000 = $75,500. But encumbrances of $54,700 must be cleared for clean title. If the buyer is paying $75,000 and liens total $54,700, the seller nets only ~$20,300 minus closing costs — possibly negative. You may need to negotiate with lien holders (cities often settle code fines for 30-50 cents on the dollar) to make the numbers work.`,
          },
          {
            question: `For a 1955 property needing major rehab, what ADDITIONAL costs should you factor beyond standard repair estimates that could add $15,000-$40,000?`,
            options: [
              'Lead paint abatement ($5K-$15K), asbestos removal ($3K-$10K), mold remediation ($3K-$8K), permit fees for unpermitted additions ($2K-$5K), and code compliance upgrades to current building standards',
              'Only standard rehab costs apply — environmental issues are rare',
              'Just add 10% contingency to the repair estimate',
            ],
            correctIndex: 0,
            explanation: 'Pre-1978 homes in distressed condition almost always have environmental issues. Lead paint abatement, asbestos removal (common in old insulation, tiles, siding), mold remediation, and bringing unpermitted work up to code can easily double a rehab budget. An experienced rehabber prices these in — a new wholesaler who doesn\'t will lose buyer credibility fast.',
          },
          {
            question: `The seller wants $85,000. Your analysis shows $55,000 is the right offer. How do you justify a 35% reduction from asking without losing the deal?`,
            options: [
              'Present a detailed breakdown: ARV, repair costs, environmental costs, lien payoffs, and closing costs — show the seller the math proves they can\'t net more through any other channel',
              'Just submit the offer and hope they accept',
              'Offer $70,000 as a compromise to keep the seller happy',
            ],
            correctIndex: 0,
            explanation: 'On deeply distressed properties, sellers often have unrealistic expectations. Your leverage is the demolition timeline (90 days) and total encumbrances ($54,700+). Show them: if the city demolishes, they still owe $54,700 in liens on an empty lot worth $15,000. Your offer, even at $55,000, is their best path to resolution. Let the math do the convincing.',
          },
        ]
      }
      return [
        {
          question: `Based on the comps, the ARV is approximately $${scenario.arv.toLocaleString()}. Repairs are estimated at $${scenario.repairEstimate.toLocaleString()}. Using the 70% rule, what is your Maximum Allowable Offer (MAO)?`,
          options: [
            `$${Math.round(scenario.arv * 0.7 - scenario.repairEstimate).toLocaleString()}`,
            `$${Math.round(scenario.arv * 0.8 - scenario.repairEstimate).toLocaleString()}`,
            `$${Math.round(scenario.arv * 0.65 - scenario.repairEstimate).toLocaleString()}`,
          ],
          correctIndex: 0,
          explanation: `The 70% rule: MAO = (ARV × 70%) − Repairs = ($${scenario.arv.toLocaleString()} × 0.70) − $${scenario.repairEstimate.toLocaleString()} = $${Math.round(scenario.arv * 0.7 - scenario.repairEstimate).toLocaleString()}. This leaves room for your assignment fee and the buyer's profit.`,
        },
        {
          question: `The seller is asking $${scenario.askingPrice.toLocaleString()}. Your MAO is $${Math.round(scenario.arv * 0.7 - scenario.repairEstimate).toLocaleString()}. What should your initial offer be?`,
          options: [
            `$${scenario.correctOffer.toLocaleString()} — leave room for negotiation`,
            `$${scenario.askingPrice.toLocaleString()} — match the asking price`,
            `$${Math.round(scenario.arv * 0.5).toLocaleString()} — lowball hard`,
          ],
          correctIndex: 0,
          explanation: `Your offer of $${scenario.correctOffer.toLocaleString()} is below the MAO, leaving a $${scenario.correctAssignmentFee.toLocaleString()} spread for your assignment fee. Never match asking price on the first offer, and avoid lowballs that insult the seller.`,
        },
        {
          question: 'What does "ARV" stand for and why does it matter?',
          options: [
            'After Repair Value — the property\'s worth once fully renovated',
            'Annual Return on Value — the yearly rental yield',
            'Assessed Real Value — the county tax assessment',
          ],
          correctIndex: 0,
          explanation: 'ARV (After Repair Value) is the estimated market value of a property after all repairs and renovations are complete. It is the single most important number in a wholesale deal because all offers are derived from it.',
        },
      ]
    case 'write-contract':
      if (scenario.id === 'scenario-4') {
        return [
          {
            question: 'In a subject-to deal, which contract structure do you use INSTEAD of a standard purchase agreement + assignment?',
            options: [
              'A Purchase Agreement with a subject-to addendum specifying the existing loan terms, plus a separate Land Trust or LLC transfer structure to avoid triggering the due-on-sale clause',
              'A standard assignment contract — same as any wholesale deal',
              'A lease-option agreement — let the buyer rent first',
            ],
            correctIndex: 0,
            explanation: 'Subject-to deals require specialized contracts. The purchase agreement must explicitly state the buyer is taking the property "subject to" the existing financing. Many investors use a Land Trust structure (deed goes to trust, buyer is beneficiary) to add a layer of protection against due-on-sale enforcement. This is NOT a standard wholesale assignment.',
          },
          {
            question: 'What is the "due-on-sale clause" and why is it the #1 risk in a subject-to transaction?',
            options: [
              'A mortgage provision allowing the lender to demand full loan repayment if ownership transfers — if triggered, the buyer must refinance or pay off the loan immediately',
              'A clause requiring the seller to pay off the loan before selling',
              'A title insurance exclusion that prevents claims on subject-to deals',
            ],
            correctIndex: 0,
            explanation: 'The due-on-sale clause (Garn-St. Germain Act, 1982) gives lenders the right to accelerate the loan if the property is transferred. While enforcement is rare on performing loans (lenders prefer payments over foreclosure), it\'s a real risk. Mitigation strategies: Land Trust transfer, keeping loan current, having refinance plan as backup.',
          },
          {
            question: 'What additional documents does a subject-to deal require that a standard wholesale assignment does NOT?',
            options: [
              'Authorization to Release Information (to communicate with lender), Power of Attorney for loan servicing, insurance transfer/new policy naming buyer, and detailed disclosure of due-on-sale risk to all parties',
              'Just the standard purchase agreement and assignment',
              'Only a title insurance policy — everything else is the same',
            ],
            correctIndex: 0,
            explanation: 'Subject-to deals have significantly more paperwork: (1) Auth to Release to verify loan details with lender, (2) POA for managing loan payments, (3) new hazard insurance naming the buyer, (4) written risk disclosures. Missing any of these creates legal liability. This is why subject-to deals command higher assignment fees — the complexity is real.',
          },
        ]
      }
      if (scenario.id === 'scenario-5') {
        return [
          {
            question: `With $54,700+ in liens on this property, what contract clause is ESSENTIAL to protect yourself as the wholesaler?`,
            options: [
              'A title contingency stating the deal is void if clear title cannot be delivered, plus a separate clause requiring seller to provide full lien disclosure with a penalty for omissions',
              'The standard "and/or assigns" clause — liens are handled at closing',
              'An "as-is" clause that transfers all liens to the buyer',
            ],
            correctIndex: 0,
            explanation: 'When dealing with heavily encumbered properties, your contract MUST include robust title contingencies. If new liens surface that kill the deal economics, you need an exit. Also require seller disclosure of ALL known encumbrances with a representation that the list is complete — this gives you legal recourse if they "forgot" to mention a $22,000 IRS lien.',
          },
          {
            question: 'The city has an active demolition order with a 90-day timeline. What contract provision addresses this unique urgency?',
            options: [
              'A "closing deadline" clause tied to the demolition hearing date, with an automatic price reduction if seller-caused delays push past the deadline, plus a right to attend the hearing on seller\'s behalf',
              'Standard 30-day closing timeline — the demolition order doesn\'t affect the contract',
              'Add a clause letting you extend closing indefinitely',
            ],
            correctIndex: 0,
            explanation: 'The demolition order is both your leverage and your risk. Your contract should: (1) set closing before the hearing, (2) include price reduction protection for delays, (3) authorize you or your buyer to attend hearings and present the pending sale to the city. Cities generally pause demolition when a legitimate sale is in progress.',
          },
          {
            question: 'Should you use an assignment or a double close on this deal? Your assignment fee is $20,000 on a $55,000 contract.',
            options: [
              'Double close — a $20K fee on a $55K contract is a 36% markup that will alarm the buyer and could cause them to go directly to the seller or renegotiate aggressively',
              'Assignment — it\'s simpler and faster',
              'It doesn\'t matter — use whichever is more convenient',
            ],
            correctIndex: 0,
            explanation: 'When your assignment fee is more than 10-15% of the contract price, a double close protects the deal. With a double close, neither the seller nor the buyer sees your profit. You buy at $55K and sell at $75K in back-to-back closings. This requires transactional funding ($2K-$3K cost) but preserves your $20K fee. Many deals over $15K in assignment fees use double closes.',
          },
        ]
      }
      return [
        {
          question: `You've agreed on $${scenario.correctOffer.toLocaleString()} with ${scenario.ownerName}. Which contract do you use first?`,
          options: [
            'Purchase Agreement — lock up the property under contract',
            'Assignment Agreement — assign it directly to a buyer',
            'Letter of Intent — express interest in buying',
          ],
          correctIndex: 0,
          explanation: 'Always start with a Purchase Agreement to get the property under contract. The Assignment Agreement comes later when you find a buyer. Never assign before you have a signed purchase contract.',
        },
        {
          question: 'What clause MUST be in your purchase agreement to wholesale the deal?',
          options: [
            '"And/or assigns" — allows you to assign the contract to a buyer',
            '"As-is" — you accept the property in current condition',
            '"Seller financing" — allows the seller to finance the deal',
          ],
          correctIndex: 0,
          explanation: 'The "and/or assigns" clause is what allows you to transfer (assign) your purchase contract to an end buyer. Without this clause, you cannot wholesale the deal via assignment.',
        },
        {
          question: `What inspection period would you include for a ${scenario.condition.includes('Light') ? 'light cosmetic' : scenario.condition.includes('Moderate') ? 'moderate rehab' : 'cosmetic rehab'} property?`,
          options: ['7 days — minimal inspection needed', '14 days — standard for most deals', '30 days — need extra time for inspections'],
          correctIndex: 1,
          explanation: 'A 14-day inspection period is standard for most wholesale deals. It gives you enough time to run comps, inspect the property, and find a buyer — while keeping the seller comfortable with a reasonable timeline.',
        },
      ]
    case 'find-buyer':
      if (scenario.id === 'scenario-4') {
        return [
          {
            question: 'What type of buyer is MOST attracted to a subject-to duplex deal, and why?',
            options: [
              'Buy-and-hold investors who prioritize cash flow — the 3.2% assumable debt and existing tenants create immediate positive cash flow without the hassle of high-rate financing',
              'Fix-and-flip investors — they can renovate and resell quickly',
              'First-time homebuyers looking for a primary residence',
            ],
            correctIndex: 0,
            explanation: 'Subject-to deals with below-market rates are cash-flow gold for buy-and-hold investors. This duplex cash-flows ~$1,600/mo from day one. A flip investor wouldn\'t want the existing mortgage complication, and first-time buyers lack the sophistication for subject-to structures. Target your marketing to experienced landlords and portfolio investors.',
          },
          {
            question: `You're marketing this deal at $${(scenario.correctOffer + scenario.correctAssignmentFee).toLocaleString()}. What key metrics should your deal package include for a sophisticated buy-and-hold buyer?`,
            options: [
              'Cap rate, cash-on-cash return, debt service coverage ratio (DSCR), rent roll with lease terms, monthly P&L projection, and subject-to loan details (rate, balance, term remaining)',
              'Just the purchase price and ARV',
              'Property photos and a description — serious buyers will do their own numbers',
            ],
            correctIndex: 0,
            explanation: 'Sophisticated investors speak the language of returns: Cap Rate (~12%), Cash-on-Cash (~48%), DSCR (~2.5x). They need a full rent roll, P&L, and detailed loan information. Presenting a professional deal package with these metrics separates you from amateur wholesalers and commands respect (and higher assignment fees).',
          },
          {
            question: 'A potential buyer wants to know if they can refinance out of the subject-to structure in 12 months. What do you tell them?',
            options: [
              'Yes, that\'s a common exit strategy — season the property for 12 months, build equity through rent payments and appreciation, then refinance into their own loan at current rates to eliminate the due-on-sale risk',
              'No, subject-to mortgages can never be refinanced',
              'They should refinance immediately at closing',
            ],
            correctIndex: 0,
            explanation: 'The "season and refi" strategy is standard for subject-to buyers: hold the property for 12-24 months, pay down the loan with rental income, potentially increase rents, then refinance into their own mortgage. This eliminates due-on-sale risk long-term while capturing the cash flow advantage in the interim. Smart buyers always have a refinance exit plan.',
          },
        ]
      }
      if (scenario.id === 'scenario-5') {
        return [
          {
            question: 'This property needs $82K+ in rehab with environmental issues and code violations. What type of buyer can handle this?',
            options: [
              'Only experienced, well-funded rehabbers with contractor teams, environmental remediation experience, and relationships with the city code enforcement office',
              'Any cash buyer who wants a deal',
              'A first-time flipper looking for a project',
            ],
            correctIndex: 0,
            explanation: 'Major rehabs with environmental issues and code violations are NOT beginner deals. Your buyer must have: (1) access to capital ($80K+ in rehab funds), (2) licensed contractors for lead/asbestos, (3) experience navigating code enforcement, (4) insurance that covers environmental work. Market to your top-tier rehabber contacts only — a failed rehab on this deal damages your reputation.',
          },
          {
            question: `You're using a double close. What is "transactional funding" and why do you need it?`,
            options: [
              'Short-term (same-day) funding that lets you purchase the property from the seller and resell to your buyer on the same day — you need it because in a double close, YOU are briefly the owner and must bring funds to the first closing table',
              'A traditional bank loan used for the purchase',
              'Earnest money that covers both transactions',
            ],
            correctIndex: 0,
            explanation: 'In a double close, there are two separate transactions: (1) you buy from seller at $55K, (2) you sell to buyer at $75K. For transaction #1, you need to actually fund the purchase. Transactional funders provide same-day capital (often at 1-2% of the purchase price) that gets repaid hours later when transaction #2 closes. Your net: $75K - $55K - $2K funding cost = $18K profit.',
          },
          {
            question: 'Your buyer\'s inspection reveals possible asbestos in the attic insulation. They want a $10,000 price reduction. How do you handle this?',
            options: [
              'Negotiate a compromise: get an actual asbestos test ($200-$500) to confirm — if positive, split the abatement cost estimate or adjust the price based on a certified remediation quote, not a guess',
              'Agree to the full $10,000 reduction immediately',
              'Refuse any reduction and risk losing the buyer',
            ],
            correctIndex: 0,
            explanation: 'Never negotiate on assumptions — verify first. An asbestos test costs $200-$500 and takes 2-3 days. If positive, get a certified remediation quote (actual cost may be $4K-$8K, not $10K). Negotiate based on real numbers, potentially splitting the difference. This shows professionalism and protects your fee while keeping the buyer committed.',
          },
        ]
      }
      return [
        {
          question: `Your contract price is $${scenario.correctOffer.toLocaleString()}. You want a $${scenario.correctAssignmentFee.toLocaleString()} assignment fee. What price do you market to buyers?`,
          options: [
            `$${(scenario.correctOffer + scenario.correctAssignmentFee).toLocaleString()}`,
            `$${scenario.correctOffer.toLocaleString()} (your contract price)`,
            `$${scenario.arv.toLocaleString()} (the ARV)`,
          ],
          correctIndex: 0,
          explanation: `You market at $${(scenario.correctOffer + scenario.correctAssignmentFee).toLocaleString()} = contract price ($${scenario.correctOffer.toLocaleString()}) + your assignment fee ($${scenario.correctAssignmentFee.toLocaleString()}). The buyer still gets a deal because ARV is $${scenario.arv.toLocaleString()} with only $${scenario.repairEstimate.toLocaleString()} in repairs.`,
        },
        {
          question: `${scenario.buyerName} is a ${scenario.buyerType}. What's the best way to reach institutional/experienced buyers?`,
          options: [
            'Cash buyer email blast with property details and photos',
            'Post on Zillow as a for-sale listing',
            'Run Facebook Marketplace ads',
          ],
          correctIndex: 0,
          explanation: 'Experienced cash buyers and institutional funds prefer direct email blasts with key deal metrics: address, ARV, repair estimate, contract price, and photos. Build your buyer list from title company records, REIA meetings, and online investor groups.',
        },
        {
          question: 'A buyer is interested but wants to negotiate your assignment fee down. What do you do?',
          options: [
            'Stand firm — show the numbers prove the deal works at this price',
            'Cut your fee in half to close fast',
            'Refuse to negotiate and move to the next buyer',
          ],
          correctIndex: 0,
          explanation: 'Present the deal analysis: ARV, comps, repair estimate, and potential profit. If the numbers work, the fee is justified. You can negotiate slightly but never undervalue your work. Strong deal packaging reduces fee pushback.',
        },
      ]
    case 'close-deal':
      if (scenario.id === 'scenario-4') {
        return [
          {
            question: 'In a subject-to closing, what must happen with the existing mortgage and insurance that is DIFFERENT from a standard closing?',
            options: [
              'The mortgage stays in the seller\'s name (not paid off), insurance is updated to name the new buyer as additional insured/loss payee, and a servicing agreement is executed so the buyer makes payments on the seller\'s loan',
              'The existing mortgage is paid off at closing like any other deal',
              'Nothing different — the title company handles everything the same way',
            ],
            correctIndex: 0,
            explanation: 'The defining feature of subject-to is that the existing mortgage remains in place. At closing: (1) deed transfers to buyer (or trust), (2) insurance is updated (crucial — a lapse triggers lender attention), (3) buyer executes a loan servicing agreement, (4) seller signs authorization for buyer to communicate with lender. The title company must be experienced with subject-to closings.',
          },
          {
            question: 'Your assignment fee on this deal is $18,000. In a subject-to wholesale, when and how do you get paid?',
            options: [
              'At the closing table through the title company — your fee is documented on the HUD-1/settlement statement and paid from the buyer\'s funds, just like a standard assignment but with additional subject-to documentation',
              'The buyer pays you separately after closing',
              'The seller pays your fee from their proceeds',
            ],
            correctIndex: 0,
            explanation: 'Your assignment fee is paid at closing through the title company, documented on the settlement statement. In subject-to deals, the buyer\'s funds cover your fee plus the seller\'s equity (if any) and closing costs. The mortgage is NOT paid off, so there\'s no lender payoff on the HUD-1 — just the existing loan balance carried forward. Always use a title company experienced in creative financing closings.',
          },
          {
            question: 'Post-closing: what ongoing obligation does the SELLER have in a subject-to deal that they wouldn\'t have in a standard sale?',
            options: [
              'The mortgage remains in their name — if the buyer stops making payments, the seller\'s credit is damaged and they could face foreclosure on a property they no longer own. This is why seller trust and proper documentation are critical.',
              'None — once they sign the deed, they\'re done',
              'They must continue paying property taxes',
            ],
            correctIndex: 0,
            explanation: 'This is the seller\'s biggest risk in a subject-to deal: the loan stays on their credit report and they\'re ultimately liable. If the buyer defaults, the seller faces foreclosure on their credit. This is why sellers need to trust the buyer, and why proper loan servicing agreements, payment tracking, and communication are essential. Smart wholesalers explain this clearly to sellers.',
          },
        ]
      }
      if (scenario.id === 'scenario-5') {
        return [
          {
            question: 'You\'re doing a double close. The A-to-B closing (you buying from seller) is at 10am. The B-to-C closing (you selling to buyer) is at 2pm. What could go wrong?',
            options: [
              'If the B-to-C closing falls through, you own a $55,000 property with $82K in repairs and $54K+ in liens — always have a backup buyer or extended transactional funding to avoid being stuck with the property',
              'Nothing — double closes are risk-free',
              'The title company might refuse to do two closings in one day',
            ],
            correctIndex: 0,
            explanation: 'The nightmare scenario in a double close: your end buyer backs out between closings, and you now own a distressed property you can\'t afford to rehab. Mitigation: (1) have 2-3 backup buyers, (2) arrange transactional funding that extends 7-14 days if needed, (3) include a non-refundable earnest money deposit from your buyer. Never double-close without a Plan B.',
          },
          {
            question: 'At closing, the title company reports a NEW lien they just discovered — a $6,500 water utility lien. The seller says they won\'t pay. What do you do?',
            options: [
              'Negotiate: offer to split it (you absorb $3,250 from your fee, seller covers $3,250) to keep the deal alive — a $3,250 haircut on a $20K fee is worth it to close',
              'Walk away — the deal keeps getting worse',
              'Tell the buyer to handle it after closing',
            ],
            correctIndex: 0,
            explanation: 'Last-minute liens are common on distressed properties. Killing a $20K deal over $6,500 is bad business math. The smart play: negotiate a split, adjust the settlement statement, and close. Your net drops from $20K to $16,750 — still excellent for the work involved. The key is staying solution-oriented at the closing table.',
          },
          {
            question: 'The deal closes successfully. What\'s your NET profit after transactional funding costs ($2,500) and the lien split ($3,250)?',
            options: [
              `$14,250 — original $20,000 fee minus $2,500 funding costs minus $3,250 lien split = $14,250 net profit`,
              '$20,000 — the full assignment fee',
              '$17,500 — only deduct the funding costs',
            ],
            correctIndex: 0,
            explanation: 'Real wholesale profits always differ from projected profits. Your deal started at a $20,000 assignment fee but reality cost you: $2,500 in transactional funding + $3,250 in lien negotiation = $5,750 in deal costs. Net profit: $14,250. Still an excellent payday — and the experience of navigating a complex deal makes you a better wholesaler. Always track actual costs vs. projected costs.',
          },
        ]
      }
      return [
        {
          question: `${scenario.buyerName} agreed to purchase at $${scenario.buyerOffer.toLocaleString()}. What document formalizes the assignment?`,
          options: [
            'Assignment of Contract — transfers your purchase agreement to the buyer',
            'New Purchase Agreement between buyer and seller',
            'Bill of Sale for the property',
          ],
          correctIndex: 0,
          explanation: 'The Assignment of Contract transfers your rights in the original Purchase Agreement to the end buyer. The buyer steps into your shoes and closes directly with the seller. Your assignment fee is paid at closing.',
        },
        {
          question: 'Who typically handles the closing and distributes funds?',
          options: [
            'A title company or real estate attorney',
            'The wholesaler (you)',
            'The seller\'s real estate agent',
          ],
          correctIndex: 0,
          explanation: 'A title company or real estate attorney handles the closing, performs a title search, ensures clear title, and distributes all funds — including your assignment fee. Never try to handle closing yourself.',
        },
        {
          question: `Your assignment fee on this deal is $${scenario.correctAssignmentFee.toLocaleString()}. When do you get paid?`,
          options: [
            'At the closing table — the title company wires or cuts a check',
            'When the buyer signs the assignment agreement',
            'After the seller moves out of the property',
          ],
          correctIndex: 0,
          explanation: `Your $${scenario.correctAssignmentFee.toLocaleString()} assignment fee is paid at the closing table by the title company. It comes out of the buyer's funds. This is why having a reliable title company is essential.`,
        },
      ]
    default:
      return []
  }
}

/* ── main component ── */
export default function PracticeDeal() {
  const [selectedScenario, setSelectedScenario] = useState<Scenario | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [answers, setAnswers] = useState<Record<string, number[]>>({})
  const [showResults, setShowResults] = useState(false)
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answerRevealed, setAnswerRevealed] = useState(false)
  const [showingCurveball, setShowingCurveball] = useState(false)
  const [curveballAnswered, setCurveballAnswered] = useState<Record<string, boolean>>({})
  const [curveballCorrect, setCurveballCorrect] = useState<Record<string, boolean>>({})
  const [curveballSelected, setCurveballSelected] = useState<number | null>(null)
  const [curveballRevealed, setCurveballRevealed] = useState(false)
  const [difficultyFilter, setDifficultyFilter] = useState<DifficultyFilter>('All')
  const [filterOpen, setFilterOpen] = useState(false)

  const filteredScenarios = difficultyFilter === 'All'
    ? SCENARIOS
    : SCENARIOS.filter(s => s.difficulty === difficultyFilter)

  const resetSimulation = useCallback(() => {
    setSelectedScenario(null)
    setCurrentStep(0)
    setAnswers({})
    setShowResults(false)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerRevealed(false)
    setShowingCurveball(false)
    setCurveballAnswered({})
    setCurveballCorrect({})
    setCurveballSelected(null)
    setCurveballRevealed(false)
  }, [])

  const handleSelectAnswer = (index: number) => {
    if (answerRevealed) return
    setSelectedAnswer(index)
  }

  const handleRevealAnswer = () => {
    if (selectedAnswer === null) return
    setAnswerRevealed(true)
    const stepId = STEPS[currentStep].id
    setAnswers(prev => ({
      ...prev,
      [stepId]: [...(prev[stepId] || []), selectedAnswer],
    }))
  }

  const handleNextQuestion = () => {
    if (!selectedScenario) return
    const stepId = STEPS[currentStep].id
    const questions = getStepQuestions(selectedScenario, stepId)

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1)
      setSelectedAnswer(null)
      setAnswerRevealed(false)
    } else if (currentStep < STEPS.length - 1) {
      // Check for curveball before advancing to next step
      const curveballs = getCurveballs(selectedScenario)
      const nextStepId = STEPS[currentStep + 1].id
      const curveball = curveballs.find(c => c.stepId === nextStepId && !curveballAnswered[nextStepId])
      if (curveball) {
        setShowingCurveball(true)
        setCurveballSelected(null)
        setCurveballRevealed(false)
      } else {
        setCurrentStep(prev => prev + 1)
        setCurrentQuestionIndex(0)
        setSelectedAnswer(null)
        setAnswerRevealed(false)
      }
    } else {
      setShowResults(true)
    }
  }

  const handleCurveballSelect = (index: number) => {
    if (curveballRevealed) return
    setCurveballSelected(index)
  }

  const handleCurveballReveal = () => {
    if (curveballSelected === null || !selectedScenario) return
    setCurveballRevealed(true)
    const nextStepId = STEPS[currentStep + 1]?.id || STEPS[currentStep].id
    const curveballs = getCurveballs(selectedScenario)
    const curveball = curveballs.find(c => c.stepId === nextStepId)
    if (curveball) {
      setCurveballCorrect(prev => ({ ...prev, [nextStepId]: curveballSelected === curveball.correctIndex }))
    }
  }

  const handleCurveballNext = () => {
    if (!selectedScenario) return
    const nextStepId = STEPS[currentStep + 1]?.id || STEPS[currentStep].id
    setCurveballAnswered(prev => ({ ...prev, [nextStepId]: true }))
    setShowingCurveball(false)
    setCurrentStep(prev => prev + 1)
    setCurrentQuestionIndex(0)
    setSelectedAnswer(null)
    setAnswerRevealed(false)
  }

  const calculateScore = (): { correct: number; total: number; curveballsCorrect: number; curveballsTotal: number } => {
    if (!selectedScenario) return { correct: 0, total: 0, curveballsCorrect: 0, curveballsTotal: 0 }
    let correct = 0
    let total = 0
    for (const step of STEPS) {
      const questions = getStepQuestions(selectedScenario, step.id)
      const stepAnswers = answers[step.id] || []
      questions.forEach((q, i) => {
        total++
        if (stepAnswers[i] === q.correctIndex) correct++
      })
    }
    const curveballs = getCurveballs(selectedScenario)
    const curveballsTotal = curveballs.filter(c => curveballAnswered[c.stepId]).length
    const curveballsCorrectCount = curveballs.filter(c => curveballCorrect[c.stepId]).length
    return { correct, total, curveballsCorrect: curveballsCorrectCount, curveballsTotal }
  }

  /* ── scenario selection screen ── */
  if (!selectedScenario) {
    return (
      <div style={{ padding: '0 4px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 10,
            background: 'linear-gradient(135deg, rgba(168,85,247,0.15), rgba(244,126,95,0.15))',
            border: '1px solid rgba(168,85,247,0.3)', borderRadius: 10, padding: '10px 20px', marginBottom: 16,
          }}>
            <Gamepad2 size={20} style={{ color: '#a855f7' }} />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#a855f7', letterSpacing: '0.05em' }}>
              DEAL SIMULATOR
            </span>
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#f5f0eb', marginBottom: 8 }}>
            Practice a Fake Deal — Zero Risk, Real Skills
          </h2>
          <p style={{ color: '#afa69e', fontSize: 14, maxWidth: 560, margin: '0 auto', lineHeight: 1.6 }}>
            Choose a scenario and walk through the entire wholesale process: find the lead, run comps, write the contract, find a buyer, and close. No real money involved — just real education.
          </p>
        </div>

        {/* Difficulty Filter Dropdown */}
        <div style={{ maxWidth: 800, margin: '0 auto 16px', display: 'flex', justifyContent: 'flex-end' }}>
          <div style={{ position: 'relative' }}>
            <button
              onClick={() => setFilterOpen(!filterOpen)}
              style={{
                display: 'flex', alignItems: 'center', gap: 8,
                padding: '8px 16px', borderRadius: 8,
                background: 'var(--color-bg-2)', border: '1px solid var(--color-border)',
                color: difficultyFilter === 'All' ? '#afa69e' : (DIFFICULTY_COLORS[difficultyFilter] || '#afa69e'),
                fontSize: 13, fontWeight: 600, cursor: 'pointer',
                transition: 'border-color 0.2s',
              }}
            >
              <span>
                {difficultyFilter === 'All' ? 'All Difficulties' : difficultyFilter}
              </span>
              <ChevronDown size={14} style={{
                transition: 'transform 0.2s',
                transform: filterOpen ? 'rotate(180deg)' : 'rotate(0deg)',
              }} />
            </button>
            {filterOpen && (
              <div style={{
                position: 'absolute', top: '100%', right: 0, marginTop: 4,
                background: 'var(--color-bg-2)', border: '1px solid var(--color-border)',
                borderRadius: 8, overflow: 'hidden', zIndex: 50,
                minWidth: 180, boxShadow: '0 8px 24px rgba(0,0,0,0.4)',
              }}>
                {DIFFICULTY_OPTIONS.map(opt => (
                  <button
                    key={opt}
                    onClick={() => { setDifficultyFilter(opt); setFilterOpen(false) }}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      width: '100%', textAlign: 'left', padding: '10px 16px',
                      background: difficultyFilter === opt ? 'rgba(168,85,247,0.1)' : 'transparent',
                      border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                      color: opt === 'All' ? '#f5f0eb' : (DIFFICULTY_COLORS[opt] || '#f5f0eb'),
                      transition: 'background 0.15s',
                    }}
                    onMouseEnter={e => { (e.target as HTMLElement).style.background = 'rgba(168,85,247,0.08)' }}
                    onMouseLeave={e => { (e.target as HTMLElement).style.background = difficultyFilter === opt ? 'rgba(168,85,247,0.1)' : 'transparent' }}
                  >
                    {opt === 'All' ? (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: '#888' }} />
                    ) : (
                      <span style={{ width: 8, height: 8, borderRadius: '50%', background: DIFFICULTY_COLORS[opt] }} />
                    )}
                    {opt === 'All' ? 'All Difficulties' : opt}
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Scenario Cards */}
        <div style={{ display: 'grid', gap: 16, maxWidth: 800, margin: '0 auto' }}>
          {filteredScenarios.map(s => (
            <button
              key={s.id}
              onClick={() => setSelectedScenario(s)}
              className="resource-card"
              style={{
                width: '100%', textAlign: 'left', cursor: 'pointer', padding: 20,
                borderRadius: 12, background: 'var(--color-bg-2)', border: '1px solid var(--color-border)',
              }}
            >
              <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 8 }}>
                <div style={{ flex: 1, minWidth: 200 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', marginBottom: 8 }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb',
                    }}>
                      {s.title}
                    </span>
                    <span style={{
                      fontSize: 10, fontWeight: 700, padding: '3px 10px', borderRadius: 20,
                      background: `${s.difficultyColor}22`, color: s.difficultyColor,
                      border: `1px solid ${s.difficultyColor}44`, letterSpacing: '0.05em', whiteSpace: 'nowrap',
                    }}>
                      {s.difficulty}
                    </span>
                  </div>
                  <p style={{ color: '#afa69e', fontSize: 13, lineHeight: 1.5, marginBottom: 10 }}>{s.ownerSituation.split('.').slice(0, 2).join('.')}</p>
                  <div style={{ display: 'flex', gap: 16, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      <Home size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }} />
                      {s.beds}bd/{s.baths}ba · {s.sqft.toLocaleString()} sqft
                    </span>
                    <span style={{ fontSize: 12, color: '#888' }}>
                      <MapPinIcon /> {s.city}, {s.state}
                    </span>
                    <span style={{ fontSize: 12, color: '#5cb885' }}>
                      <DollarSign size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                      ARV: ${s.arv.toLocaleString()}
                    </span>
                  </div>
                </div>
                <ChevronRight size={20} style={{ color: '#666', flexShrink: 0, marginTop: 4 }} />
              </div>
            </button>
          ))}
        </div>

        <InfoBox type="tip">
          Each scenario simulates a real-world wholesale deal with actual numbers. Answer questions at each stage to test your knowledge. Your score is tracked at the end — aim for 100%.
        </InfoBox>
      </div>
    )
  }

  /* ── results screen ── */
  if (showResults) {
    const { correct, total, curveballsCorrect, curveballsTotal } = calculateScore()
    const allCorrect = correct + curveballsCorrect
    const allTotal = total + curveballsTotal
    const pct = Math.round((allCorrect / allTotal) * 100)
    const grade = pct >= 90 ? 'A+' : pct >= 80 ? 'A' : pct >= 70 ? 'B' : pct >= 60 ? 'C' : 'D'
    const gradeColor = pct >= 80 ? '#5cb885' : pct >= 60 ? '#e8a44a' : '#ff7e5f'
    const isExpert = selectedScenario.difficulty === 'Expert'

    return (
      <div style={{ padding: '0 4px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          textAlign: 'center', padding: 32, borderRadius: 16,
          background: 'linear-gradient(135deg, rgba(92,184,133,0.08), rgba(168,85,247,0.08))',
          border: '1px solid var(--color-border)', marginBottom: 24,
        }}>
          <Trophy size={48} style={{ color: gradeColor, marginBottom: 12 }} />
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.75rem, 5vw, 2.5rem)', color: '#f5f0eb', marginBottom: 4 }}>
            Deal Complete!
          </h2>
          <p style={{ color: '#afa69e', fontSize: 14, marginBottom: 20 }}>
            "{selectedScenario.title}" — {selectedScenario.city}, {selectedScenario.state}
          </p>

          <div style={{
            display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
            width: 80, height: 80, borderRadius: '50%',
            background: `${gradeColor}22`, border: `3px solid ${gradeColor}`,
            marginBottom: 16,
          }}>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: gradeColor }}>{grade}</span>
          </div>

          <p style={{ fontSize: 16, color: '#f5f0eb', marginBottom: 4 }}>
            <strong>{allCorrect}</strong> of <strong>{allTotal}</strong> correct ({pct}%)
          </p>
          {isExpert && curveballsTotal > 0 && (
            <p style={{ fontSize: 12, color: '#e040fb', marginBottom: 4 }}>
              Curveballs handled: <strong>{curveballsCorrect}</strong> of <strong>{curveballsTotal}</strong>
            </p>
          )}
          <p style={{ fontSize: 13, color: '#afa69e' }}>
            Assignment fee earned: <span style={{ color: '#5cb885', fontWeight: 700 }}>${selectedScenario.correctAssignmentFee.toLocaleString()}</span> (simulated)
          </p>
        </div>

        {/* Deal Summary */}
        <div style={{
          padding: 20, borderRadius: 12, background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', marginBottom: 24,
        }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', marginBottom: 12 }}>Deal Summary</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12 }}>
            {[
              { label: 'Property', value: selectedScenario.address },
              { label: 'ARV', value: `$${selectedScenario.arv.toLocaleString()}` },
              { label: 'Repairs', value: `$${selectedScenario.repairEstimate.toLocaleString()}` },
              { label: 'Your Offer', value: `$${selectedScenario.correctOffer.toLocaleString()}` },
              { label: 'Sold To', value: selectedScenario.buyerName },
              { label: 'Your Profit', value: `$${selectedScenario.correctAssignmentFee.toLocaleString()}` },
            ].map(item => (
              <div key={item.label} style={{ padding: 10, background: 'var(--color-bg-3)', borderRadius: 8 }}>
                <div style={{ fontSize: 10, color: '#888', fontWeight: 700, letterSpacing: '0.05em', marginBottom: 4 }}>{item.label}</div>
                <div style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>{item.value}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Tips from this scenario */}
        <InfoBox type="tip">
          <strong>Key lessons from this deal:</strong>
          <ul style={{ margin: '8px 0 0 16px', padding: 0 }}>
            {selectedScenario.tips.map((t, i) => (
              <li key={i} style={{ marginBottom: 4 }}>{t}</li>
            ))}
          </ul>
        </InfoBox>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginTop: 20 }}>
          <button
            onClick={resetSimulation}
            style={{
              flex: 1, minWidth: 180, padding: '12px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347)', color: '#000',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.05em',
              border: 'none',
            }}
          >
            <RotateCcw size={16} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 6 }} />
            Try Another Scenario
          </button>
        </div>
      </div>
    )
  }

  /* ── curveball event screen ── */
  if (showingCurveball && selectedScenario) {
    const curveballs = getCurveballs(selectedScenario)
    const nextStepId = STEPS[currentStep + 1]?.id || STEPS[currentStep].id
    const curveball = curveballs.find(c => c.stepId === nextStepId)
    if (curveball) {
      return (
        <div style={{ padding: '0 4px', maxWidth: 700, margin: '0 auto' }}>
          {/* Curveball Header */}
          <div style={{
            textAlign: 'center', padding: 24, borderRadius: 16,
            background: 'linear-gradient(135deg, rgba(224,64,251,0.12), rgba(255,126,95,0.12))',
            border: '1px solid rgba(224,64,251,0.3)', marginBottom: 20,
          }}>
            <div style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '6px 16px', borderRadius: 20,
              background: 'rgba(224,64,251,0.2)', border: '1px solid rgba(224,64,251,0.4)',
              marginBottom: 12,
            }}>
              <AlertTriangle size={16} style={{ color: '#e040fb' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#e040fb', letterSpacing: '0.08em' }}>CURVEBALL EVENT</span>
            </div>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(1.2rem, 3vw, 1.6rem)', color: '#f5f0eb', marginBottom: 8 }}>
              {curveball.title}
            </h3>
            <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.7, maxWidth: 560, margin: '0 auto' }}>
              {curveball.description}
            </p>
          </div>

          {/* Impact Notice */}
          <div style={{
            display: 'flex', alignItems: 'flex-start', gap: 10, padding: 14, borderRadius: 10,
            background: 'rgba(232,164,74,0.08)', border: '1px solid rgba(232,164,74,0.25)', marginBottom: 16,
          }}>
            <Clock size={16} style={{ color: '#e8a44a', flexShrink: 0, marginTop: 2 }} />
            <div>
              <div style={{ fontSize: 10, fontWeight: 700, color: '#e8a44a', letterSpacing: '0.05em', marginBottom: 4 }}>DEAL IMPACT</div>
              <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.5 }}>{curveball.impact}</div>
            </div>
          </div>

          {/* Question */}
          <div style={{
            padding: 20, borderRadius: 12, background: 'var(--color-bg-2)', border: '1px solid var(--color-border)', marginBottom: 16,
          }}>
            <p style={{ fontSize: 14, color: '#f5f0eb', lineHeight: 1.6, marginBottom: 16 }}>
              {curveball.question}
            </p>
            <div style={{ display: 'grid', gap: 8 }}>
              {curveball.options.map((opt, i) => {
                const isSelected = curveballSelected === i
                const isCorrect = i === curveball.correctIndex
                let borderColor = 'var(--color-border)'
                let bg = 'var(--color-bg-3)'
                if (curveballRevealed) {
                  if (isCorrect) { borderColor = '#5cb885'; bg = 'rgba(92,184,133,0.1)' }
                  else if (isSelected && !isCorrect) { borderColor = '#ff7e5f'; bg = 'rgba(244,126,95,0.1)' }
                } else if (isSelected) {
                  borderColor = '#e040fb'; bg = 'rgba(224,64,251,0.08)'
                }
                return (
                  <button
                    key={i}
                    onClick={() => handleCurveballSelect(i)}
                    style={{
                      width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 8,
                      cursor: curveballRevealed ? 'default' : 'pointer',
                      background: bg, border: `1px solid ${borderColor}`,
                      color: '#f5f0eb', fontSize: 13, lineHeight: 1.5,
                      transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 10,
                    }}
                  >
                    <div style={{
                      width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                      border: `2px solid ${curveballRevealed && isCorrect ? '#5cb885' : curveballRevealed && isSelected ? '#ff7e5f' : isSelected ? '#e040fb' : '#555'}`,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', marginTop: 1,
                    }}>
                      {curveballRevealed && isCorrect && <CheckCircle2 size={14} style={{ color: '#5cb885' }} />}
                      {curveballRevealed && isSelected && !isCorrect && <AlertTriangle size={12} style={{ color: '#ff7e5f' }} />}
                      {!curveballRevealed && isSelected && <Circle size={10} style={{ color: '#e040fb', fill: '#e040fb' }} />}
                    </div>
                    <span>{opt}</span>
                  </button>
                )
              })}
            </div>

            {curveballRevealed && (
              <div style={{
                marginTop: 16, padding: 14, borderRadius: 8,
                background: 'rgba(224,64,251,0.08)', borderLeft: '3px solid #e040fb',
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                  <Lightbulb size={14} style={{ color: '#e040fb' }} />
                  <span style={{ fontSize: 11, fontWeight: 700, color: '#e040fb', letterSpacing: '0.05em' }}>EXPERT INSIGHT</span>
                </div>
                <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{curveball.explanation}</p>
              </div>
            )}
          </div>

          {/* Actions */}
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {!curveballRevealed ? (
              <button
                onClick={handleCurveballReveal}
                disabled={curveballSelected === null}
                style={{
                  flex: 1, minWidth: 160, padding: '12px 20px', borderRadius: 8,
                  cursor: curveballSelected === null ? 'not-allowed' : 'pointer',
                  background: curveballSelected === null ? '#333' : 'linear-gradient(135deg, #e040fb, #a855f7)',
                  color: curveballSelected === null ? '#666' : '#fff',
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.05em',
                  border: 'none', opacity: curveballSelected === null ? 0.5 : 1, transition: 'all 0.2s',
                }}
              >
                Handle the Curveball
              </button>
            ) : (
              <button
                onClick={handleCurveballNext}
                style={{
                  flex: 1, minWidth: 160, padding: '12px 20px', borderRadius: 8, cursor: 'pointer',
                  background: 'linear-gradient(135deg, #e040fb, #a855f7)', color: '#fff',
                  fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.05em', border: 'none',
                }}
              >
                Continue to {STEPS[currentStep + 1]?.label || 'Results'}
                <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
              </button>
            )}
          </div>
        </div>
      )
    }
  }

  /* ── simulation step view ── */
  const stepId = STEPS[currentStep].id
  const questions = getStepQuestions(selectedScenario, stepId)
  const currentQuestion = questions[currentQuestionIndex]

  return (
    <div style={{ padding: '0 4px' }}>
      {/* Scenario Header */}
      <div style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        flexWrap: 'wrap', gap: 8, marginBottom: 16,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <button
            onClick={resetSimulation}
            style={{
              padding: '6px 12px', borderRadius: 6, cursor: 'pointer',
              background: 'var(--color-bg-3)', border: '1px solid var(--color-border)',
              color: '#afa69e', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4,
            }}
          >
            <ChevronLeft size={14} /> Back
          </button>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb' }}>
            {selectedScenario.title}
          </span>
          <span style={{
            fontSize: 10, fontWeight: 700, padding: '2px 8px', borderRadius: 12,
            background: `${selectedScenario.difficultyColor}22`, color: selectedScenario.difficultyColor,
            border: `1px solid ${selectedScenario.difficultyColor}44`,
          }}>
            {selectedScenario.difficulty}
          </span>
        </div>
      </div>

      {/* Progress Steps */}
      <div style={{
        display: 'flex', gap: 2, marginBottom: 20, overflowX: 'auto',
        padding: '4px 0', WebkitOverflowScrolling: 'touch',
      }}>
        {STEPS.map((step, i) => {
          const isActive = i === currentStep
          const isComplete = i < currentStep
          const StepIcon = step.icon
          return (
            <div
              key={step.id}
              style={{
                flex: '1 0 auto', minWidth: 56, padding: '8px 6px', borderRadius: 8, textAlign: 'center',
                background: isActive ? `${step.color}22` : isComplete ? `${step.color}11` : 'var(--color-bg-3)',
                border: `1px solid ${isActive ? step.color : isComplete ? `${step.color}44` : 'var(--color-border)'}`,
                transition: 'all 0.2s',
              }}
            >
              <div style={{ marginBottom: 4 }}>
                {isComplete ? (
                  <CheckCircle2 size={16} style={{ color: step.color }} />
                ) : (
                  <StepIcon size={16} style={{ color: isActive ? step.color : '#666' }} />
                )}
              </div>
              <div style={{
                fontSize: 9, fontWeight: 700, color: isActive ? step.color : isComplete ? step.color : '#666',
                letterSpacing: '0.03em', lineHeight: 1.2,
              }}>
                {step.label}
              </div>
            </div>
          )
        })}
      </div>

      {/* Property Info Card */}
      <div style={{
        padding: 16, borderRadius: 12, background: 'var(--color-bg-2)', border: '1px solid var(--color-border)',
        marginBottom: 16,
      }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 8 }}>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0eb' }}>{selectedScenario.address}</div>
            <div style={{ fontSize: 12, color: '#888' }}>{selectedScenario.city}, {selectedScenario.state} · {selectedScenario.beds}bd/{selectedScenario.baths}ba · {selectedScenario.sqft.toLocaleString()} sqft</div>
          </div>
          <div style={{ fontSize: 12, color: '#afa69e' }}>
            Asking: <span style={{ color: '#ffb347', fontWeight: 700 }}>${selectedScenario.askingPrice.toLocaleString()}</span>
          </div>
        </div>
        <div style={{ fontSize: 12, color: '#999', lineHeight: 1.5 }}>
          <strong style={{ color: '#afa69e' }}>Condition:</strong> {selectedScenario.condition}
        </div>

        {/* Comps — show during run-numbers step and beyond */}
        {currentStep >= 1 && (
          <div style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--color-border)' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#5ba3d9', letterSpacing: '0.05em', marginBottom: 8 }}>COMPARABLE SALES</div>
            <div style={{ display: 'grid', gap: 6 }}>
              {selectedScenario.comps.map((c, i) => (
                <div key={i} style={{
                  display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                  padding: '6px 10px', background: 'var(--color-bg-3)', borderRadius: 6,
                  fontSize: 12, flexWrap: 'wrap', gap: 4,
                }}>
                  <span style={{ color: '#ccc' }}>{c.address}</span>
                  <span style={{ color: '#5cb885', fontWeight: 600 }}>${c.soldPrice.toLocaleString()}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Current Step Label */}
      <div style={{
        display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16,
      }}>
        <div style={{
          width: 32, height: 32, borderRadius: 8,
          background: `${STEPS[currentStep].color}22`, border: `1px solid ${STEPS[currentStep].color}44`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          {(() => { const Icon = STEPS[currentStep].icon; return <Icon size={16} style={{ color: STEPS[currentStep].color }} /> })()}
        </div>
        <div>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: STEPS[currentStep].color }}>
            Step {currentStep + 1}: {STEPS[currentStep].label}
          </div>
          <div style={{ fontSize: 11, color: '#888' }}>
            Question {currentQuestionIndex + 1} of {questions.length}
          </div>
        </div>
      </div>

      {/* Question Card */}
      <div style={{
        padding: 20, borderRadius: 12, background: 'var(--color-bg-2)', border: '1px solid var(--color-border)',
        marginBottom: 16,
      }}>
        <p style={{ fontSize: 14, color: '#f5f0eb', lineHeight: 1.6, marginBottom: 16 }}>
          {currentQuestion.question}
        </p>

        <div style={{ display: 'grid', gap: 8 }}>
          {currentQuestion.options.map((opt, i) => {
            const isSelected = selectedAnswer === i
            const isCorrect = i === currentQuestion.correctIndex
            let borderColor = 'var(--color-border)'
            let bg = 'var(--color-bg-3)'
            if (answerRevealed) {
              if (isCorrect) { borderColor = '#5cb885'; bg = 'rgba(92,184,133,0.1)' }
              else if (isSelected && !isCorrect) { borderColor = '#ff7e5f'; bg = 'rgba(244,126,95,0.1)' }
            } else if (isSelected) {
              borderColor = '#ffb347'; bg = 'rgba(255,179,71,0.08)'
            }

            return (
              <button
                key={i}
                onClick={() => handleSelectAnswer(i)}
                style={{
                  width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 8,
                  cursor: answerRevealed ? 'default' : 'pointer',
                  background: bg, border: `1px solid ${borderColor}`,
                  color: '#f5f0eb', fontSize: 13, lineHeight: 1.5,
                  transition: 'all 0.2s', display: 'flex', alignItems: 'flex-start', gap: 10,
                }}
              >
                <div style={{
                  width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
                  border: `2px solid ${answerRevealed && isCorrect ? '#5cb885' : answerRevealed && isSelected ? '#ff7e5f' : isSelected ? '#ffb347' : '#555'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  marginTop: 1,
                }}>
                  {answerRevealed && isCorrect && <CheckCircle2 size={14} style={{ color: '#5cb885' }} />}
                  {answerRevealed && isSelected && !isCorrect && <AlertTriangle size={12} style={{ color: '#ff7e5f' }} />}
                  {!answerRevealed && isSelected && <Circle size={10} style={{ color: '#ffb347', fill: '#ffb347' }} />}
                </div>
                <span>{opt}</span>
              </button>
            )
          })}
        </div>

        {/* Explanation after reveal */}
        {answerRevealed && (
          <div style={{
            marginTop: 16, padding: 14, borderRadius: 8,
            background: 'rgba(91,163,217,0.08)', borderLeft: '3px solid #5ba3d9',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
              <Lightbulb size={14} style={{ color: '#5ba3d9' }} />
              <span style={{ fontSize: 11, fontWeight: 700, color: '#5ba3d9', letterSpacing: '0.05em' }}>EXPLANATION</span>
            </div>
            <p style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{currentQuestion.explanation}</p>
          </div>
        )}
      </div>

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
        {!answerRevealed ? (
          <button
            onClick={handleRevealAnswer}
            disabled={selectedAnswer === null}
            style={{
              flex: 1, minWidth: 160, padding: '12px 20px', borderRadius: 8, cursor: selectedAnswer === null ? 'not-allowed' : 'pointer',
              background: selectedAnswer === null ? '#333' : 'linear-gradient(135deg, #ff7e5f, #ffb347)',
              color: selectedAnswer === null ? '#666' : '#000',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.05em',
              border: 'none', opacity: selectedAnswer === null ? 0.5 : 1,
              transition: 'all 0.2s',
            }}
          >
            Submit Answer
          </button>
        ) : (
          <button
            onClick={handleNextQuestion}
            style={{
              flex: 1, minWidth: 160, padding: '12px 20px', borderRadius: 8, cursor: 'pointer',
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347)', color: '#000',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, letterSpacing: '0.05em',
              border: 'none',
            }}
          >
            {currentStep === STEPS.length - 1 && currentQuestionIndex === questions.length - 1
              ? 'See Final Results'
              : currentQuestionIndex === questions.length - 1
                ? `Next: ${STEPS[currentStep + 1].label}`
                : 'Next Question'
            }
            <ChevronRight size={16} style={{ display: 'inline', verticalAlign: 'middle', marginLeft: 4 }} />
          </button>
        )}
      </div>
    </div>
  )
}

/* small inline icon to avoid import issues */
function MapPinIcon() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4 }}>
      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" /><circle cx="12" cy="10" r="3" />
    </svg>
  )
}
