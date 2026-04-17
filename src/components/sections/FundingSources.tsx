import { useState } from 'react'
import {
  Search,
  DollarSign,
  Clock,
  ExternalLink,
  TrendingUp,
  Landmark,
  PiggyBank,
  Handshake,
  ChevronDown,
  ChevronUp,
  Star,
  Shield,
  BookOpen,
  Zap,
  Building2,
  Users,
  FileText,
} from 'lucide-react'

/* ─── InfoBox (local, matches project pattern) ─── */
function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', label: 'TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', label: 'WARNING', color: '#c47a1a' },
    note: { cls: 'info-note', label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ borderRadius: 8, padding: '14px 18px', marginBottom: 18, fontSize: 14, lineHeight: 1.7 }}>
      <strong style={{ color: cfg.color, marginRight: 6 }}>{cfg.label}:</strong>
      {children}
    </div>
  )
}

/* ─── Types ─── */
interface TransactionalLender {
  name: string
  website: string
  rate: string
  minAmount: string
  maxAmount: string
  speed: string
  description: string
  bestFor: string
  featured?: boolean
}

interface HardMoneyLender {
  name: string
  website: string
  rates: string
  terms: string
  ltv: string
  minLoan: string
  maxLoan: string
  speed: string
  description: string
  bestFor: string
  featured?: boolean
}

/* ─── Tabs ─── */
const TABS = [
  { id: 'transactional', label: 'Transactional Funding', icon: Zap },
  { id: 'hardmoney', label: 'Hard Money Lenders', icon: Building2 },
  { id: 'privatemoney', label: 'Private Money Guide', icon: Users },
  { id: 'sdira', label: 'Self-Directed IRA/401k', icon: PiggyBank },
  { id: 'creative', label: 'Creative Financing', icon: Handshake },
] as const

type TabId = (typeof TABS)[number]['id']

/* ═══════════════════════════════════════════════
   TRANSACTIONAL FUNDING LENDERS
   ═══════════════════════════════════════════════ */
const TRANSACTIONAL_LENDERS: TransactionalLender[] = [
  {
    name: 'Best Transaction Funding',
    website: 'besttransactionfunding.com',
    rate: '1% flat fee (min $500)',
    minAmount: '$10,000',
    maxAmount: '$5,000,000',
    speed: 'Same day — 24 hrs',
    description:
      'One of the most established transactional funding companies in the U.S. Provides 100% of the funding needed for double closes with no credit check, no income verification, and no upfront fees. Funds are wired directly to the closing agent. Over 15 years in business serving wholesalers nationwide.',
    bestFor: 'Wholesalers doing consistent double closes who want reliable, fast funding with transparent flat-rate pricing.',
    featured: true,
  },
  {
    name: 'Investor Lending',
    website: 'investorlending.com',
    rate: '1–2% of transaction amount',
    minAmount: '$25,000',
    maxAmount: '$10,000,000',
    speed: 'Same day — 48 hrs',
    description:
      'Full-service transactional funding provider offering same-day funding for double closes. No credit check or personal guarantee required. Also provides short-term bridge loans for investors who need a few extra days to close the B-to-C leg. Serves all 50 states.',
    bestFor: 'Larger wholesale deals and investors who may need a few extra days between the A-to-B and B-to-C closings.',
  },
  {
    name: 'Fund That Flip (now Upright)',
    website: 'upright.us',
    rate: '1.5–2.5% (varies by deal size)',
    minAmount: '$50,000',
    maxAmount: '$5,000,000',
    speed: '24–72 hrs',
    description:
      'Originally a fix-and-flip lender, now rebranded as Upright. Offers transactional funding alongside their fix-and-flip products. Tech-forward platform with an online application process. Also provides rehab draws and bridge loans for investors who graduate from wholesaling to flipping.',
    bestFor: 'Wholesalers who also flip and want a single lending relationship for both strategies.',
  },
  {
    name: 'Coastal Funding Group',
    website: 'coastalfundinggroup.com',
    rate: '1–1.5% flat fee',
    minAmount: '$10,000',
    maxAmount: '$3,000,000',
    speed: 'Same day — 24 hrs',
    description:
      'Specializes exclusively in transactional funding for wholesale double closes. No credit check, no upfront fees, and no personal guarantee. Funds are wired directly to the title company or closing attorney. Known for fast turnaround and responsive customer service.',
    bestFor: 'New wholesalers doing their first double close who need a hands-on, responsive funding partner.',
  },
  {
    name: 'QC Capital Group',
    website: 'qccapitalgroup.com',
    rate: '1.25% flat fee (min $750)',
    minAmount: '$20,000',
    maxAmount: '$5,000,000',
    speed: 'Same day — 24 hrs',
    description:
      'Nationwide transactional funding provider offering 100% funding for simultaneous (same-day) double closes. No credit check, no income verification. Requires a signed purchase agreement (A-to-B) and a signed resale agreement (B-to-C) before funding. Fast approval process.',
    bestFor: 'Experienced wholesalers who have both contracts locked and need fast, no-hassle funding.',
  },
  {
    name: 'REI Flash Cash',
    website: 'reiflashcash.com',
    rate: '1–2% of A-to-B purchase price',
    minAmount: '$5,000',
    maxAmount: '$2,500,000',
    speed: 'Same day',
    description:
      'Transactional funding company designed specifically for real estate wholesalers. Provides same-day funding for double closes with minimal paperwork. Funds wired directly to closing agent. Low minimum makes them accessible for smaller wholesale deals in affordable markets.',
    bestFor: 'Wholesalers in lower-price markets who need funding for deals under $50K.',
  },
  {
    name: 'TC Funding',
    website: 'transactionalcapitalfunding.com',
    rate: '1.5% flat fee',
    minAmount: '$15,000',
    maxAmount: '$4,000,000',
    speed: 'Same day — 24 hrs',
    description:
      'Provides transactional capital for same-day double closings. No credit checks, no upfront deposits, no personal guarantees. Funds are escrowed with the title company and disbursed at closing. Serves wholesalers in all 50 states with a simple online application.',
    bestFor: 'Wholesalers who want a simple, straightforward process with a clear flat-rate fee structure.',
  },
  {
    name: 'DoubleClose.com',
    website: 'doubleclose.com',
    rate: '1–1.75% of funded amount',
    minAmount: '$10,000',
    maxAmount: '$5,000,000',
    speed: 'Same day',
    description:
      'Purpose-built for wholesale double closings. Offers an educational component alongside their funding services, helping newer investors understand the double-close process. Partners with investor-friendly title companies nationwide. No credit check or appraisal required.',
    bestFor: 'New wholesalers who want education and funding in one place, plus help finding investor-friendly title companies.',
    featured: true,
  },
  {
    name: 'Express Transaction Funding',
    website: 'expresstransactionfunding.com',
    rate: '1–2% (volume discounts available)',
    minAmount: '$10,000',
    maxAmount: '$3,000,000',
    speed: 'Same day — 24 hrs',
    description:
      'Transactional lender offering volume discounts for repeat wholesalers. No credit check, no bank statements, no tax returns. Proof of funds letters available on request. Works with title companies and closing attorneys in all 50 states.',
    bestFor: 'High-volume wholesalers who close multiple double-close deals per month and want volume pricing.',
  },
]

/* ═══════════════════════════════════════════════
   HARD MONEY LENDERS
   ═══════════════════════════════════════════════ */
const HARD_MONEY_LENDERS: HardMoneyLender[] = [
  {
    name: 'Kiavi (formerly LendingHome)',
    website: 'kiavi.com',
    rates: '6.5–9.5% interest, 1–2 origination points',
    terms: '12–18 months (fix-and-flip), 30-year (rental)',
    ltv: 'Up to 90% LTC, 75% ARV',
    minLoan: '$100,000',
    maxLoan: '$3,000,000',
    speed: '7–14 days',
    description:
      'One of the largest technology-driven hard money lenders in the U.S. Offers fix-and-flip loans, bridge loans, and DSCR rental loans through an online platform. Automated underwriting enables fast approvals. Funded over $12 billion in investor loans since founding.',
    bestFor: 'Experienced flippers with 2+ completed projects who want competitive rates and a streamlined online process.',
    featured: true,
  },
  {
    name: 'Lima One Capital',
    website: 'limaone.com',
    rates: '7.49–10.99% interest, 1–3 origination points',
    terms: '13 months (fix-and-flip), 30-year (rental)',
    ltv: 'Up to 90% LTC, 70% ARV',
    minLoan: '$75,000',
    maxLoan: '$5,000,000+',
    speed: '10–21 days',
    description:
      'National hard money lender offering fix-and-flip, ground-up construction, bridge, and rental loans. In-house underwriting, servicing, and draw management. Dedicated loan officers for each borrower. Competitive rates for experienced investors with strong track records.',
    bestFor: 'Investors scaling to larger projects or ground-up construction who need a full-service lending partner.',
    featured: true,
  },
  {
    name: 'RCN Capital',
    website: 'rcncapital.com',
    rates: '7.99–10.49% interest, 1.5–3 origination points',
    terms: '12–18 months (bridge), 30-year (rental)',
    ltv: 'Up to 90% LTC, 75% ARV',
    minLoan: '$50,000',
    maxLoan: '$2,500,000',
    speed: '10–15 days',
    description:
      'National direct lender specializing in fix-and-flip, bridge, and long-term rental financing. Offers both individual and portfolio loans. Competitive rates with flexible qualification criteria. No minimum FICO requirement for select programs. Serves investors in 46 states.',
    bestFor: 'Investors looking for flexible qualification criteria, especially those with lower credit or fewer completed projects.',
  },
  {
    name: 'Visio Lending',
    website: 'visiolending.com',
    rates: '6.5–8.5% interest, 0–2 origination points',
    terms: '30-year fixed and adjustable (rental loans)',
    ltv: 'Up to 80% LTV',
    minLoan: '$75,000',
    maxLoan: '$2,000,000',
    speed: '21–30 days',
    description:
      'Specializes in long-term DSCR (Debt Service Coverage Ratio) rental loans. Does not require personal income verification — qualifies based on property cash flow. Offers 30-year fixed and adjustable rate options. Ideal for buy-and-hold investors building a rental portfolio.',
    bestFor: 'Buy-and-hold investors who need long-term rental financing without personal income documentation.',
  },
  {
    name: 'New Silver Lending',
    website: 'newsilver.com',
    rates: '7.5–9.75% interest, 1–2 origination points',
    terms: '12–24 months (fix-and-flip)',
    ltv: 'Up to 90% LTC, 75% ARV',
    minLoan: '$100,000',
    maxLoan: '$5,000,000',
    speed: '5–10 days',
    description:
      'Tech-forward hard money lender with a fully online application and approval process. Instant term sheets in minutes. Fix-and-flip and rental bridge products. Fast draws for rehab with in-house project management tools. Known for speed and transparency.',
    bestFor: 'Tech-savvy investors who want an entirely digital lending experience with fast closings.',
  },
  {
    name: 'Civic Financial Services',
    website: 'civicfs.com',
    rates: '8–10.5% interest, 1–3 origination points',
    terms: '12–24 months (bridge), 30-year (rental)',
    ltv: 'Up to 85% LTV, 75% ARV',
    minLoan: '$75,000',
    maxLoan: '$20,000,000',
    speed: '7–14 days',
    description:
      'Subsidiary of Pacific Western Bank (now Banc of California). Offers bridge loans, fix-and-flip, ground-up construction, and DSCR rental loans. Institutional backing provides stability and larger loan sizes. Strong presence in western U.S. markets.',
    bestFor: 'Investors pursuing larger projects or ground-up construction with access to higher loan amounts.',
  },
  {
    name: 'CoreVest Finance',
    website: 'corevestfinance.com',
    rates: '7–9.5% interest, 1–2 origination points',
    terms: '12–24 months (bridge), 30-year (rental)',
    ltv: 'Up to 80% LTV',
    minLoan: '$75,000',
    maxLoan: '$50,000,000+',
    speed: '14–21 days',
    description:
      'Institutional-grade lender backed by Redwood Trust. Specializes in single-family rental portfolios and bridge loans. Offers individual and portfolio loans with competitive pricing for experienced operators. Also provides credit lines for repeat borrowers.',
    bestFor: 'Portfolio investors and landlords with 5+ properties who want institutional-grade portfolio financing.',
  },
  {
    name: 'Anchor Loans',
    website: 'anchorloans.com',
    rates: '7.5–10% interest, 1.5–3 origination points',
    terms: '12–18 months (fix-and-flip)',
    ltv: 'Up to 90% LTC, 70% ARV',
    minLoan: '$50,000',
    maxLoan: '$10,000,000',
    speed: '3–10 days',
    description:
      'One of the original hard money lenders, in business since 1998. Direct balance-sheet lender with in-house underwriting. Known for fast closings and reliability. Offers fix-and-flip, bridge, and ground-up construction loans. Has funded over $14 billion in loans.',
    bestFor: 'Experienced flippers who need reliable, fast closings on fix-and-flip projects.',
  },
  {
    name: 'Easy Street Capital',
    website: 'easystreetcap.com',
    rates: '9.5–12% interest, 1–3 origination points',
    terms: '6–18 months (bridge / fix-and-flip)',
    ltv: 'Up to 90% LTC, 70% ARV',
    minLoan: '$75,000',
    maxLoan: '$2,000,000',
    speed: '7–14 days',
    description:
      'Austin-based hard money lender specializing in fix-and-flip and short-term bridge loans. Flexible underwriting for newer investors. No minimum experience required. Offers a "first-time flipper" program with additional support and education.',
    bestFor: 'New investors doing their first fix-and-flip who need a lender willing to work with beginners.',
  },
  {
    name: 'Do Hard Money',
    website: 'dohardmoney.com',
    rates: '10–14% interest, 2–5 origination points',
    terms: '6–12 months',
    ltv: 'Up to 100% financing (with equity in other assets)',
    minLoan: '$50,000',
    maxLoan: '$1,000,000',
    speed: '5–14 days',
    description:
      'Caters specifically to newer investors with limited capital. Offers up to 100% financing on certain deals (using cross-collateralization). Higher rates reflect the higher risk of lending to newer borrowers. Includes a "Find-Fund-Flip" system with training and deal analysis tools.',
    bestFor: 'Brand-new investors with little to no capital who need 100% financing and are willing to pay premium rates.',
  },
]

/* ═══════════════════════════════════════════════
   PRIVATE MONEY GUIDE CONTENT
   ═══════════════════════════════════════════════ */
const PRIVATE_MONEY_SECTIONS = [
  {
    title: 'What Is Private Money?',
    content: `Private money is capital raised from individuals — friends, family, colleagues, self-directed IRA holders, high-net-worth contacts, and other non-institutional sources. Unlike hard money lenders (companies), private money lenders are everyday people who want a better return on their money than a savings account or stock market.

As a wholesaler or investor, private money lets you:
- Fund double closes without transactional lenders
- Purchase and rehab properties without hard money
- Close faster than any traditional financing
- Negotiate your own terms, rates, and repayment schedules
- Build long-term lending relationships that scale with your business`,
  },
  {
    title: 'Where to Find Private Money Lenders',
    content: `The best private money lenders are already in your network. Start here:

1. Real estate investment clubs (REIAs) — Attend meetings and network. Many attendees are passive investors looking to lend.
2. Friends and family — People who know and trust you. Start small ($20K–$50K) and build credibility.
3. Attorneys and CPAs — They have clients with idle cash in savings accounts earning almost nothing.
4. Retirement communities — Retirees often have large IRA/401k balances and want passive income.
5. LinkedIn and Facebook groups — Real estate investing groups where people advertise capital available.
6. Your title company — Ask your closing agent who they see bringing private capital to closings.
7. Church and community groups — Trust-based relationships are the foundation of private lending.
8. Other investors — Experienced investors with excess capital often lend to active wholesalers.`,
  },
  {
    title: 'How to Structure a Private Money Note',
    content: `A private money loan is documented with a promissory note and secured by a deed of trust (or mortgage, depending on state). Here are the standard components:

Loan Amount: The principal being lent (e.g., $100,000)
Interest Rate: Typically 8–12% annual for private money (higher than bank, lower than hard money)
Term: 6–12 months for flips, 1–5 years for rentals
Payments: Interest-only monthly payments with a balloon at maturity is most common
Security: First-position lien (deed of trust or mortgage) on the subject property
LTV: Never borrow more than 65–70% of ARV — this protects your lender
Insurance: Require hazard insurance naming the lender as loss payee
Title Insurance: Always issue a lender's title insurance policy

SAMPLE TERMS:
- Loan: $80,000 | Rate: 10% annual | Term: 12 months
- Monthly interest-only payment: $666.67
- Secured by 1st-position deed of trust
- Lender receives lender's title policy + hazard insurance
- Balloon payment of $80,000 due at month 12`,
  },
  {
    title: 'The Private Money Pitch',
    content: `When approaching a potential private lender, focus on THEIR benefit, not yours. Here is a framework:

1. Lead with their return: "How would you like to earn 8–10% on your money, secured by real estate?"
2. Explain the security: "Your money is protected by a first-position lien on a physical property worth more than the loan."
3. Show the math: "I'm buying a property worth $150K for $80K. You lend me $80K at 10%. Your money is secured by a property worth almost twice what you lend."
4. Provide documentation: Show a sample promissory note, deed of trust, title policy, and insurance certificate.
5. Start small: Offer a small first deal ($20K–$50K) so they can see the process and build trust.
6. Highlight passive income: "You collect a check every month. I do all the work. You get your principal back at closing."
7. Address risk: "If I default, you foreclose and own a property worth more than your loan. You are protected."

NEVER guarantee returns or promise no risk — that is a securities violation. Always recommend they consult with an attorney and CPA.`,
  },
  {
    title: 'Legal Considerations',
    content: `Private money lending must comply with federal and state securities laws. Key considerations:

1. Regulation D, Rule 506(b) — If raising money from multiple lenders for a single project, you may be selling a security. Consult a securities attorney.
2. Usury laws — Each state has maximum interest rate limits. Know your state's usury cap before setting rates.
3. Dodd-Frank — If your private lender is lending on a property that will be owner-occupied, Dodd-Frank rules apply. Stick to investment properties.
4. Promissory note + deed of trust — ALWAYS document the loan with a proper promissory note and record a deed of trust (or mortgage) with the county.
5. Lender's title insurance — Always issue a lender's title insurance policy to protect your private lender.
6. Use an attorney — Have a real estate attorney draft your loan documents. Templates are a starting point, not a final product.
7. Disclosure — Be transparent about the deal, the risks, the timeline, and the exit strategy. Honesty builds repeat lenders.`,
  },
]

/* ═══════════════════════════════════════════════
   SELF-DIRECTED IRA / 401K GUIDE
   ═══════════════════════════════════════════════ */
const SDIRA_SECTIONS = [
  {
    title: 'What Is a Self-Directed IRA?',
    content: `A Self-Directed IRA (SDIRA) is a retirement account that allows you to invest in alternative assets — including real estate — instead of just stocks, bonds, and mutual funds. The IRA is held by a custodian (a specialized trust company), but YOU choose the investments.

Why this matters for wholesalers:
- Your end buyers may have SDIRA funds ready to deploy
- You can use your OWN SDIRA to fund deals
- Private lenders can lend from their SDIRA (earning tax-free or tax-deferred returns)
- Understanding SDIRAs opens up a massive pool of capital most wholesalers never tap`,
  },
  {
    title: 'How SDIRAs Can Be Used in Real Estate',
    content: `There are several ways self-directed retirement accounts intersect with wholesale real estate:

1. Buying Properties — An SDIRA can purchase investment real estate outright. All income and gains flow back to the IRA tax-deferred (Traditional) or tax-free (Roth).

2. Lending Money — An SDIRA can be a private money lender. The IRA holds the promissory note, and all interest payments flow into the IRA. This is how your private lenders can lend tax-advantaged capital.

3. Buying Wholesale Deals — An investor's SDIRA can be the buyer on your wholesale assignment or double close. The property is owned by the IRA, not the individual.

4. Partnering on Deals — With proper structuring, SDIRAs can partner with non-IRA funds on deals (but prohibited transaction rules are strict).

5. Solo 401(k) — Self-employed individuals can set up a Solo 401(k) with even greater flexibility, including the ability to borrow up to $50,000 from the account.`,
  },
  {
    title: 'Top SDIRA Custodians',
    content: `These custodians specialize in self-directed accounts for real estate investors:

1. Equity Trust Company — equitytrust.com — Largest SDIRA custodian. Over $39 billion in assets under custody. Full real estate support.

2. Advanta IRA — advantaira.com — Specializes in real estate and alternative investments. Tampa, FL based. Excellent customer service.

3. NuView Trust — nuviewtrust.com — Orlando-based custodian with a strong focus on real estate investing education and support.

4. IRA Financial Group — irafinancialgroup.com — Specializes in checkbook IRA LLCs and Solo 401(k)s. Great for investors who want direct control.

5. Entrust Group — theentrustgroup.com — One of the oldest SDIRA custodians. Offers Traditional, Roth, SEP, and SIMPLE IRA options.

6. Rocket Dollar — rocketdollar.com — Modern, tech-forward SDIRA platform with checkbook control and a simple online experience.`,
  },
  {
    title: 'Prohibited Transactions (Must Know)',
    content: `The IRS has strict rules about what you CANNOT do with SDIRA funds. Violating these rules can disqualify your entire IRA and trigger massive tax penalties.

PROHIBITED TRANSACTIONS:
- You cannot buy property FROM yourself or sell property TO yourself
- You cannot buy property from or sell to "disqualified persons" (spouse, parents, children, grandchildren, their spouses, or entities they control)
- You cannot live in or personally use a property owned by your IRA
- You cannot provide personal labor (sweat equity) to improve an IRA-owned property
- You cannot guarantee a loan for your IRA or use IRA property as collateral for a personal loan
- All expenses must be paid by the IRA; all income must flow to the IRA

IF YOUR BUYER IS USING AN SDIRA:
- The title will be in the name of the IRA (e.g., "Equity Trust FBO John Smith IRA")
- All funds come from the custodian, not the individual
- Closing may take slightly longer (3–5 extra days) for custodian processing
- The buyer cannot do the rehab themselves — they must hire third-party contractors`,
  },
]

/* ═══════════════════════════════════════════════
   CREATIVE FINANCING METHODS
   ═══════════════════════════════════════════════ */
const CREATIVE_METHODS = [
  {
    title: 'Subject-To (Taking Over Existing Mortgage)',
    icon: FileText,
    difficulty: 'Advanced',
    content: `"Subject-to" means buying a property "subject to" the existing mortgage remaining in place. The deed transfers to you, but the seller's loan stays in the seller's name and you make the payments.

HOW IT WORKS:
1. Seller deeds the property to you (or your entity)
2. The existing mortgage stays in the seller's name
3. You make the monthly payments on the seller's loan
4. You control the property — rent it, rehab it, or resell it
5. When you sell, you pay off the seller's remaining mortgage balance

WHY SELLERS AGREE:
- They are behind on payments and facing foreclosure
- They owe more than the house is worth (underwater)
- They need to relocate quickly (job transfer, divorce, military)
- They cannot sell traditionally due to condition or negative equity

KEY RISKS:
- Due-on-sale clause: The lender CAN call the loan due when ownership transfers. In practice, this rarely happens if payments are being made, but the risk exists.
- Insurance: You must maintain insurance on the property. Use a land trust to keep the deed in a trust name.
- Seller trust: The seller must trust that you will make the payments. Use a loan servicing company as a neutral third party.

WHOLESALING SUBJECT-TO:
As a wholesaler, you can lock up a subject-to deal and assign or partner with a buy-and-hold investor who will take over the payments. Your assignment fee comes from the equity spread.`,
  },
  {
    title: 'Seller Financing (Owner Financing)',
    icon: Handshake,
    difficulty: 'Intermediate',
    content: `Seller financing means the property seller acts as the bank. Instead of the buyer getting a mortgage from a lender, the seller carries a note and the buyer makes payments directly to the seller.

HOW IT WORKS:
1. Buyer and seller agree on price, down payment, interest rate, and term
2. Seller deeds the property to the buyer
3. Buyer signs a promissory note and deed of trust (or mortgage) to the seller
4. Buyer makes monthly payments to the seller (or a loan servicing company)
5. When the note is paid off (or buyer refinances), the seller's lien is released

TYPICAL TERMS:
- Down payment: 5–20%
- Interest rate: 5–8% (negotiable)
- Term: 5–30 years (balloon in 3–5 years is common)
- Payments: Principal + interest (amortized or interest-only)

BEST SITUATIONS FOR SELLER FINANCING:
- Free-and-clear properties (no existing mortgage)
- Sellers who want passive monthly income
- Properties that do not qualify for traditional financing
- Land and commercial deals where bank financing is difficult
- High-value properties where the seller wants to defer capital gains (installment sale)

WHOLESALING SELLER-FINANCED DEALS:
Lock up the property under contract with seller financing terms, then assign or double-close to a buyer who wants the favorable financing. Your fee is the spread or assignment.`,
  },
  {
    title: 'Lease Options (Rent-to-Own)',
    icon: FileText,
    difficulty: 'Intermediate',
    content: `A lease option gives you the right (but not the obligation) to purchase a property at a predetermined price within a set timeframe, while leasing the property in the meantime.

TWO COMPONENTS:
1. Lease Agreement — Standard rental lease with monthly payments
2. Option Agreement — Gives you the exclusive right to purchase the property at a set price before the option expires

HOW IT WORKS:
1. You sign a lease agreement with the property owner (typically 1–3 year term)
2. You pay an "option consideration" fee (typically 1–5% of purchase price) — this is usually non-refundable but applied to the purchase price if you exercise the option
3. You agree on a future purchase price (locked in today)
4. You lease the property and can sublease to a tenant-buyer at a higher rent (sandwich lease)
5. Before the option expires, you exercise your option to purchase OR assign your option to another buyer

SANDWICH LEASE OPTION (WHOLESALER STRATEGY):
1. Lease-option the property from the seller at $1,200/month with a $150K purchase price
2. Sublease to a tenant-buyer at $1,500/month with a $175K purchase price
3. Collect $300/month cash flow PLUS $25,000 at the back end when the tenant-buyer exercises

RISKS:
- Option fee is non-refundable if you do not exercise
- Property maintenance responsibilities during the lease
- Tenant-buyer may not qualify for a mortgage at exercise time
- State laws vary significantly — some states treat lease options as equitable interests`,
  },
  {
    title: 'Novation Agreements',
    icon: TrendingUp,
    difficulty: 'Advanced',
    content: `A novation is a strategy where you get a property under contract, then instead of assigning or double closing, you get the seller's permission to market and sell the property on the open market (MLS) at a higher price. The profit is yours.

HOW IT WORKS:
1. Get the property under contract at a wholesale price (e.g., $150K)
2. Sign a novation agreement with the seller giving you the right to list and sell the property
3. List the property on the MLS at retail price (e.g., $200K)
4. When the property sells, the seller gets the agreed contract price ($150K) and you keep the difference ($50K minus costs)
5. The end buyer gets a regular retail purchase with a mortgage

WHY USE NOVATION:
- Higher profit margins than traditional assignments (you sell at retail, not wholesale)
- Access to retail buyers (MLS exposure, FHA/VA buyers)
- No need for transactional funding or proof of funds
- Sellers get their agreed price — they are often happy to let you handle the sale
- Properties that are in good condition but underpriced by motivated sellers

REQUIREMENTS:
- A real estate license is strongly recommended (or partner with a licensed agent)
- A novation-specific agreement drafted by an attorney
- The seller's cooperation and clear understanding of the arrangement
- Marketing budget for MLS listing, photos, and showing coordination`,
  },
  {
    title: 'BRRRR Method (Buy, Rehab, Rent, Refinance, Repeat)',
    icon: TrendingUp,
    difficulty: 'Intermediate',
    content: `While not a wholesale exit strategy, BRRRR is the most common strategy your END BUYERS use. Understanding it helps you find better deals and speak your buyer's language.

THE PROCESS:
1. BUY — Purchase a distressed property below market value (this is where your wholesale deal comes in)
2. REHAB — Renovate the property to increase its value
3. RENT — Place a qualified tenant at market rent
4. REFINANCE — Get a cash-out refinance based on the new, higher appraised value to pull out most or all of the original investment
5. REPEAT — Use the refinanced cash to buy the next deal

WHY YOUR BUYERS LOVE BRRRR:
- If the deal is right, they recover 100% of their initial capital
- They own a cash-flowing rental with little to no money left in the deal
- They can scale a rental portfolio indefinitely using the same capital

WHAT BRRRR BUYERS NEED FROM YOU:
- Properties at 65–75% of ARV (or lower) MINUS rehab costs
- Accurate ARV comps (provide them!)
- Honest rehab estimates
- Properties in areas with strong rental demand
- A deal that "BRRRRs" — meaning the numbers work for the refinance to pull out most of the capital`,
  },
  {
    title: 'Wraparound Mortgages (Wraps)',
    icon: Shield,
    difficulty: 'Advanced',
    content: `A wraparound mortgage is a form of seller financing where the seller has an existing mortgage, creates a NEW note that "wraps around" the existing one, and the buyer makes payments to the seller on the new, larger note. The seller continues to make payments on the original mortgage.

HOW IT WORKS:
1. Seller has an existing mortgage of $100K at 4% interest
2. Seller sells the property for $150K with a wraparound note at 7% interest
3. Buyer makes payments to the seller based on the $150K at 7%
4. Seller uses a portion of the buyer's payment to continue paying the underlying $100K mortgage at 4%
5. Seller profits from the interest rate spread (7% minus 4%) on the underlying $100K PLUS gets paid on the $50K equity portion

RISKS:
- Due-on-sale clause risk on the underlying mortgage (same as subject-to)
- If the seller stops making payments on the underlying mortgage, the buyer's position is at risk
- Use a loan servicing company to collect the buyer's payment and make the underlying mortgage payment automatically
- Must be structured by an experienced attorney

WHOLESALING WRAPS:
You can lock up a wrap deal and connect the seller with a buyer who wants affordable financing. Your fee is negotiated as part of the transaction.`,
  },
]

/* ═══════════════════════════════════════════════
   COMPONENT
   ═══════════════════════════════════════════════ */
export default function FundingSources() {
  const [activeTab, setActiveTab] = useState<TabId>('transactional')
  const [search, setSearch] = useState('')
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())

  const toggle = (id: string) => {
    setExpandedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const lowerSearch = search.toLowerCase()

  /* Filter transactional lenders */
  const filteredTransactional = TRANSACTIONAL_LENDERS.filter(
    l =>
      !search ||
      l.name.toLowerCase().includes(lowerSearch) ||
      l.description.toLowerCase().includes(lowerSearch) ||
      l.bestFor.toLowerCase().includes(lowerSearch)
  )

  /* Filter hard money lenders */
  const filteredHardMoney = HARD_MONEY_LENDERS.filter(
    l =>
      !search ||
      l.name.toLowerCase().includes(lowerSearch) ||
      l.description.toLowerCase().includes(lowerSearch) ||
      l.bestFor.toLowerCase().includes(lowerSearch)
  )

  return (
    <div>
      <h2 className="section-header">Funding Sources & Lender Directory</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        The comprehensive funding resource for wholesalers. Transactional funding for double closes, hard money for flips, private money strategies, self-directed IRA capital, and creative financing methods — everything you need to fund your deals.
      </p>

      {/* ─── Tab navigation ─── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 20 }}>
        {TABS.map(tab => {
          const Icon = tab.icon
          return (
            <button
              key={tab.id}
              onClick={() => { setActiveTab(tab.id); setSearch('') }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                padding: '8px 14px',
                borderRadius: 6,
                border: activeTab === tab.id ? '1px solid #ff7e5f' : '1px solid #333',
                background: activeTab === tab.id ? 'rgba(244,126,95,0.12)' : '#2e3a4d',
                color: activeTab === tab.id ? '#ff7e5f' : '#aaa',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {tab.label}
            </button>
          )
        })}
      </div>

      {/* ─── Search bar (for lender tabs) ─── */}
      {(activeTab === 'transactional' || activeTab === 'hardmoney') && (
        <div style={{ position: 'relative', marginBottom: 20 }}>
          <Search
            size={16}
            style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#666' }}
          />
          <input
            type="text"
            placeholder={
              activeTab === 'transactional'
                ? 'Search transactional funding lenders...'
                : 'Search hard money lenders...'
            }
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 12px 10px 36px',
              borderRadius: 8,
              border: '1px solid #333',
              background: '#141414',
              color: '#fff',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      )}

      {/* ═══════════════════════════════════════
           TAB: TRANSACTIONAL FUNDING
         ═══════════════════════════════════════ */}
      {activeTab === 'transactional' && (
        <div>
          <InfoBox type="note">
            Transactional funding provides 100% of the purchase price for your A-to-B leg in a double close. The funds are in your account for minutes to hours — just long enough to close both transactions. No credit check, no income verification, no personal guarantee. You need both an A-to-B contract AND a B-to-C contract to qualify.
          </InfoBox>

          {filteredTransactional.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center', padding: 40 }}>No lenders match your search.</p>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            {filteredTransactional.map(lender => (
              <div
                key={lender.name}
                className="resource-card"
                style={{
                  borderRadius: 10,
                  padding: 20,
                  borderLeft: lender.featured ? '3px solid #ff7e5f' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                      {lender.name}
                    </h3>
                    {lender.featured && (
                      <span style={{ background: 'rgba(244,126,95,0.15)', color: '#ff7e5f', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <Star size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                        Top Pick
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://${lender.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff7e5f', fontSize: 12, textDecoration: 'none' }}
                  >
                    <ExternalLink size={12} />
                    {lender.website}
                  </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10, marginBottom: 12 }}>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Rate / Fee</div>
                    <div style={{ fontSize: 13, color: '#ddd', fontWeight: 600 }}><DollarSign size={12} style={{ color: '#ff7e5f', marginRight: 2 }} />{lender.rate}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Minimum</div>
                    <div style={{ fontSize: 13, color: '#ddd', fontWeight: 600 }}>{lender.minAmount}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Maximum</div>
                    <div style={{ fontSize: 13, color: '#ddd', fontWeight: 600 }}>{lender.maxAmount}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Speed</div>
                    <div style={{ fontSize: 13, color: '#ddd', fontWeight: 600 }}><Clock size={12} style={{ color: '#ff7e5f', marginRight: 2 }} />{lender.speed}</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7, margin: '0 0 8px' }}>{lender.description}</p>
                <p style={{ fontSize: 12, color: '#ff7e5f', margin: 0 }}>
                  <strong>Best for:</strong> <span style={{ color: '#bbb' }}>{lender.bestFor}</span>
                </p>
              </div>
            ))}
          </div>

          <InfoBox type="tip">
            Before your first double close, get proof-of-funds letters from 2–3 transactional lenders. Many sellers and title companies will want to see POF before moving forward. Most transactional lenders provide these at no cost.
          </InfoBox>

          <InfoBox type="warn">
            Transactional funding only works for simultaneous (same-day) double closes. If your B-to-C closing is scheduled for a different day, you may need a short-term bridge loan instead. Always confirm the same-day closing with your title company in advance.
          </InfoBox>
        </div>
      )}

      {/* ═══════════════════════════════════════
           TAB: HARD MONEY LENDERS
         ═══════════════════════════════════════ */}
      {activeTab === 'hardmoney' && (
        <div>
          <InfoBox type="note">
            Hard money loans are asset-based, short-term loans secured by the property itself. They are primarily used for fix-and-flip projects and bridge financing. Rates are higher than conventional loans (7–14%), but they close faster (7–21 days) and have more flexible qualification criteria. Most require 10–25% down payment.
          </InfoBox>

          {filteredHardMoney.length === 0 && (
            <p style={{ color: '#666', textAlign: 'center', padding: 40 }}>No lenders match your search.</p>
          )}

          <div style={{ display: 'grid', gap: 12 }}>
            {filteredHardMoney.map(lender => (
              <div
                key={lender.name}
                className="resource-card"
                style={{
                  borderRadius: 10,
                  padding: 20,
                  borderLeft: lender.featured ? '3px solid #ff7e5f' : undefined,
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 10 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                      {lender.name}
                    </h3>
                    {lender.featured && (
                      <span style={{ background: 'rgba(244,126,95,0.15)', color: '#ff7e5f', fontSize: 10, padding: '2px 8px', borderRadius: 4, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                        <Star size={10} style={{ marginRight: 3, verticalAlign: 'middle' }} />
                        Top Pick
                      </span>
                    )}
                  </div>
                  <a
                    href={`https://${lender.website}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{ display: 'flex', alignItems: 'center', gap: 4, color: '#ff7e5f', fontSize: 12, textDecoration: 'none' }}
                  >
                    <ExternalLink size={12} />
                    {lender.website}
                  </a>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(145px, 1fr))', gap: 8, marginBottom: 12 }}>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Rates</div>
                    <div style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}>{lender.rates}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Terms</div>
                    <div style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}>{lender.terms}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Max LTV</div>
                    <div style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}>{lender.ltv}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Loan Range</div>
                    <div style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}>{lender.minLoan} – {lender.maxLoan}</div>
                  </div>
                  <div style={{ background: '#263040', borderRadius: 6, padding: '8px 12px' }}>
                    <div style={{ fontSize: 10, color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 2 }}>Speed</div>
                    <div style={{ fontSize: 12, color: '#ddd', fontWeight: 600 }}><Clock size={12} style={{ color: '#ff7e5f', marginRight: 2 }} />{lender.speed}</div>
                  </div>
                </div>

                <p style={{ fontSize: 13, color: '#999', lineHeight: 1.7, margin: '0 0 8px' }}>{lender.description}</p>
                <p style={{ fontSize: 12, color: '#ff7e5f', margin: 0 }}>
                  <strong>Best for:</strong> <span style={{ color: '#bbb' }}>{lender.bestFor}</span>
                </p>
              </div>
            ))}
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox type="tip">
              When shopping hard money lenders, compare the total cost of capital — not just the interest rate. A lender charging 8% with 3 points is more expensive on a 6-month flip than a lender charging 10% with 1 point. Run the numbers for YOUR projected hold time.
            </InfoBox>
            <InfoBox type="warn">
              Hard money loans have short terms (6–18 months). If your project goes over schedule, extension fees can be 1–2% of the loan balance per month. Always build a 2–3 month buffer into your timeline and budget.
            </InfoBox>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
           TAB: PRIVATE MONEY GUIDE
         ═══════════════════════════════════════ */}
      {activeTab === 'privatemoney' && (
        <div>
          <InfoBox type="note">
            Private money is the ultimate competitive advantage in real estate investing. While your competition fights over hard money and transactional funding, building private lender relationships gives you unlimited, flexible capital on YOUR terms. This guide teaches you how.
          </InfoBox>

          <div style={{ display: 'grid', gap: 10 }}>
            {PRIVATE_MONEY_SECTIONS.map((section, idx) => {
              const key = `pm-${idx}`
              const expanded = expandedItems.has(key)
              return (
                <div key={key} className="resource-card" style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                      <BookOpen size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      {section.title}
                    </h3>
                    {expanded ? <ChevronUp size={18} color="#ff7e5f" /> : <ChevronDown size={18} color="#666" />}
                  </button>
                  {expanded && (
                    <div style={{ padding: '0 20px 20px', whiteSpace: 'pre-line', fontSize: 13, color: '#bbb', lineHeight: 1.8 }}>
                      {section.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox type="tip">
              Your first private lender is the hardest to find. After you close one deal and return their capital plus interest on time, word spreads. Most experienced investors have 3–5 private lenders competing to fund their deals.
            </InfoBox>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
           TAB: SELF-DIRECTED IRA / 401K
         ═══════════════════════════════════════ */}
      {activeTab === 'sdira' && (
        <div>
          <InfoBox type="note">
            Over $11 trillion sits in U.S. retirement accounts. Self-directed IRAs and Solo 401(k)s allow that money to be invested in real estate. As a wholesaler, understanding SDIRAs means you can tap into a massive pool of buyer and lender capital that most investors overlook.
          </InfoBox>

          <div style={{ display: 'grid', gap: 10 }}>
            {SDIRA_SECTIONS.map((section, idx) => {
              const key = `sdira-${idx}`
              const expanded = expandedItems.has(key)
              return (
                <div key={key} className="resource-card" style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                      <Landmark size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                      {section.title}
                    </h3>
                    {expanded ? <ChevronUp size={18} color="#ff7e5f" /> : <ChevronDown size={18} color="#666" />}
                  </button>
                  {expanded && (
                    <div style={{ padding: '0 20px 20px', whiteSpace: 'pre-line', fontSize: 13, color: '#bbb', lineHeight: 1.8 }}>
                      {section.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox type="warn">
              Prohibited transaction rules are strict and the penalties are severe — the entire IRA can be disqualified. ALWAYS consult a tax professional or SDIRA custodian before structuring any deal involving retirement funds. This guide is educational, not legal or tax advice.
            </InfoBox>
            <InfoBox type="tip">
              When marketing to cash buyers, ask: "Are you purchasing with personal funds or through a self-directed IRA?" If they say SDIRA, allow 3–5 extra business days for custodian processing and make sure the title company knows the buyer entity name will be in the format "Custodian FBO Investor Name IRA."
            </InfoBox>
          </div>
        </div>
      )}

      {/* ═══════════════════════════════════════
           TAB: CREATIVE FINANCING
         ═══════════════════════════════════════ */}
      {activeTab === 'creative' && (
        <div>
          <InfoBox type="note">
            Creative financing lets you control properties and profit from deals without using your own money or traditional bank loans. These strategies are essential for wholesalers who want to graduate to bigger profits and more complex deal structures.
          </InfoBox>

          <div style={{ display: 'grid', gap: 10 }}>
            {CREATIVE_METHODS.map((method, idx) => {
              const key = `creative-${idx}`
              const expanded = expandedItems.has(key)
              const Icon = method.icon
              const diffColor =
                method.difficulty === 'Advanced' ? '#e74c3c' : method.difficulty === 'Intermediate' ? '#ff7e5f' : '#5cb885'
              return (
                <div key={key} className="resource-card" style={{ borderRadius: 10, overflow: 'hidden' }}>
                  <button
                    onClick={() => toggle(key)}
                    style={{
                      width: '100%',
                      display: 'flex',
                      justifyContent: 'space-between',
                      alignItems: 'center',
                      padding: '16px 20px',
                      background: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      textAlign: 'left',
                    }}
                  >
                    <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexWrap: 'wrap' }}>
                      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                        <Icon size={16} style={{ marginRight: 8, verticalAlign: 'middle' }} />
                        {method.title}
                      </h3>
                      <span
                        style={{
                          fontSize: 10,
                          padding: '2px 8px',
                          borderRadius: 4,
                          fontWeight: 700,
                          textTransform: 'uppercase',
                          letterSpacing: '0.06em',
                          color: diffColor,
                          background: `${diffColor}18`,
                          border: `1px solid ${diffColor}40`,
                        }}
                      >
                        {method.difficulty}
                      </span>
                    </div>
                    {expanded ? <ChevronUp size={18} color="#ff7e5f" /> : <ChevronDown size={18} color="#666" />}
                  </button>
                  {expanded && (
                    <div style={{ padding: '0 20px 20px', whiteSpace: 'pre-line', fontSize: 13, color: '#bbb', lineHeight: 1.8 }}>
                      {method.content}
                    </div>
                  )}
                </div>
              )
            })}
          </div>

          <div style={{ marginTop: 16 }}>
            <InfoBox type="warn">
              Creative financing strategies involve complex legal structures. ALWAYS work with a real estate attorney experienced in these methods. A single mistake in documentation can expose you to lawsuits, fines, or loss of the deal. This content is educational — not legal advice.
            </InfoBox>
            <InfoBox type="tip">
              Start with seller financing and lease options — they are the most accessible creative strategies for newer investors. Save subject-to and wraps until you have an attorney and title company who are comfortable with those structures.
            </InfoBox>
          </div>
        </div>
      )}
    </div>
  )
}
