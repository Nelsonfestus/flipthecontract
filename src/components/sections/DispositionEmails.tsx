import { useState } from 'react'
import { Download, Mail, Copy, Check, AlertTriangle, Info, Lightbulb, Search, Clock, Zap, Camera, Target, TrendingUp, Users, Star, ChevronDown, ChevronUp } from 'lucide-react'

function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', icon: <Lightbulb size={14} color="#5cb885" />, label: 'TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', icon: <AlertTriangle size={14} color="#c47a1a" />, label: 'WARNING', color: '#c47a1a' },
    note: { cls: 'info-note', icon: <Info size={14} color="#2a6aad" />, label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ marginBottom: 16 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
        {cfg.icon}
        <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.05em' }}>{cfg.label}</span>
      </div>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

type CategoryId = 'all' | 'initial' | 'followup' | 'urgency' | 'photo' | 'portfolio' | 'subject'

const CATEGORIES: { id: CategoryId; label: string; icon: typeof Mail }[] = [
  { id: 'all', label: 'All Templates', icon: Mail },
  { id: 'initial', label: 'Initial Blast', icon: Zap },
  { id: 'photo', label: 'Photo Layouts', icon: Camera },
  { id: 'urgency', label: 'Urgency Hooks', icon: Clock },
  { id: 'followup', label: 'Follow-Up', icon: TrendingUp },
  { id: 'portfolio', label: 'Portfolio Deals', icon: Users },
  { id: 'subject', label: 'Subject Lines', icon: Star },
]

interface Template {
  id: string
  title: string
  category: CategoryId
  tag: string
  description: string
  content: string
}

const TEMPLATES: Template[] = [
  // INITIAL BLAST TEMPLATES
  {
    id: 'disp-initial-sfr',
    title: 'Single Family — Initial Deal Blast',
    category: 'initial',
    tag: 'badge-orange',
    description: 'The bread-and-butter disposition email. Send this to your full buyer list the moment you lock up a single family deal. Clean, professional, all the numbers upfront.',
    content: `Subject: 🔥 NEW Off-Market Deal — [CITY], [STATE] — [X]% Below ARV

Hey [BUYER NAME / "Investors"],

Just locked up a killer off-market deal. First come, first served — this won't last.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 PROPERTY SNAPSHOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Address: [STREET ADDRESS], [CITY], [STATE] [ZIP]
• Type: Single Family Residence
• Beds / Baths: [X] / [X]
• Sq Ft: [SQFT] | Lot: [LOT SIZE]
• Year Built: [YEAR]
• Current Condition: [Occupied/Vacant] — [Brief condition notes]
• Zoning: [Residential / Mixed-Use]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 THE NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Contract Price: $[WHOLESALE PRICE]
• ARV (After Repair Value): $[ARV]
• Estimated Repairs: $[REPAIRS]
• Potential Profit (Flip): $[FLIP PROFIT]
• Monthly Rent Estimate: $[RENT]/mo
• Cap Rate (as rental): [X]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 IDEAL EXIT STRATEGY
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ Fix & Flip — Strong ARV with $[PROFIT]+ profit potential
☐ BRRRR — Rents at $[RENT]/mo after rehab
☐ Buy & Hold — Solid cash flow neighborhood

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 PHOTOS: [LINK TO PHOTOS / GOOGLE DRIVE]
📋 COMPS: [LINK TO COMP SHEET]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ HOW TO LOCK THIS DEAL:
1. Reply "INTERESTED" to this email or text [YOUR PHONE]
2. Provide Proof of Funds (POF)
3. Sign assignment contract
4. $[EMD AMOUNT] EMD due within 48 hours
5. Close in [X] days at [TITLE COMPANY]

Serious buyers only. POF required before I release the full address.

— [YOUR NAME]
[YOUR PHONE]
[YOUR EMAIL]
Flip the Contract`,
  },
  {
    id: 'disp-initial-multi',
    title: 'Multi-Family — Initial Deal Blast',
    category: 'initial',
    tag: 'badge-orange',
    description: 'Disposition template for duplexes, triplexes, quads, and small apartment buildings. Emphasizes rental income and cash-on-cash returns.',
    content: `Subject: 🏢 Multi-Family Deal — [X]-Unit in [CITY] — Cash Flowing NOW

Hey Investors,

I've got a [X]-unit multi-family property under contract in [CITY/NEIGHBORHOOD]. This one is already producing income.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 PROPERTY DETAILS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Address: [NEIGHBORHOOD/ZIP] (Full address with POF)
• Type: [Duplex / Triplex / Quad / Apartment]
• Units: [X]
• Total Sq Ft: [SQFT]
• Year Built: [YEAR]
• Lot Size: [LOT]
• Condition: [Details]
• Occupancy: [X of X units occupied]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 INCOME & NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Contract Price: $[WHOLESALE PRICE]
• ARV: $[ARV]
• Current Monthly Gross Rent: $[RENT TOTAL]
• Pro Forma Monthly Rent (after rehab): $[PROFORMA RENT]
• Annual NOI: $[NOI]
• Cap Rate (current): [X]%
• Cap Rate (pro forma): [X]%
• Cash-on-Cash Return: [X]%
• Estimated Repairs: $[REPAIRS]

UNIT BREAKDOWN:
  Unit 1: [X]bd/[X]ba — $[RENT]/mo — [Occupied/Vacant]
  Unit 2: [X]bd/[X]ba — $[RENT]/mo — [Occupied/Vacant]
  Unit 3: [X]bd/[X]ba — $[RENT]/mo — [Occupied/Vacant]
  Unit 4: [X]bd/[X]ba — $[RENT]/mo — [Occupied/Vacant]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WHY THIS DEAL WORKS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Already producing $[RENT TOTAL]/mo in income
• Below-market rents = immediate value-add potential
• [NEIGHBORHOOD] rents trending up [X]% YoY
• Strong rental demand — [SCHOOL DISTRICT / EMPLOYER / UNIVERSITY] nearby
• Separately metered — tenants pay own utilities

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 PHOTOS & DOCS: [LINK]
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

⚡ NEXT STEPS:
1. Reply or text [YOUR PHONE] to express interest
2. Submit POF within 24 hours
3. $[EMD] EMD / Close in [X] days

This property will move fast. Don't sleep on it.

— [YOUR NAME]
[YOUR PHONE] | [YOUR EMAIL]`,
  },
  {
    id: 'disp-initial-land',
    title: 'Vacant Land — Deal Blast',
    category: 'initial',
    tag: 'badge-orange',
    description: 'For wholesaling vacant land parcels. Highlights development potential, zoning, and comparable lot sales.',
    content: `Subject: 🌳 Off-Market Land Deal — [X] Acres in [COUNTY], [STATE] — Below Comps

Investors,

Got a vacant land parcel under contract — priced well below recent lot sales in the area.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 PARCEL INFO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Location: [COUNTY], [STATE] (near [LANDMARK/CITY])
• Parcel ID: [APN]
• Acreage: [X] acres
• Zoning: [Residential / Agricultural / Commercial]
• Terrain: [Flat / Wooded / Cleared / Hillside]
• Road Access: [Paved / Dirt / Easement]
• Utilities: [Water / Sewer / Electric — Available or Need to bring in]
• Flood Zone: [Yes/No — Zone X/A/etc.]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 THE NUMBERS
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Contract Price: $[WHOLESALE PRICE]
• Comparable Lot Sales: $[COMP 1], $[COMP 2], $[COMP 3]
• Average Price/Acre in Area: $[PRICE PER ACRE]
• This Deal Price/Acre: $[YOUR PRICE PER ACRE]
• Discount to Market: [X]%

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 POTENTIAL USE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
☐ New construction — Build [X] homes
☐ Subdivision potential — Split into [X] lots
☐ Owner financing play — Sell with terms
☐ Long-term hold — Appreciation play
☐ Recreation / Hunting land

📸 AERIAL PHOTOS & SURVEY: [LINK]
📋 COUNTY RECORDS: [LINK]

⚡ INTERESTED? Reply or text [YOUR PHONE]. POF required.

— [YOUR NAME]
[YOUR PHONE]`,
  },

  // PHOTO LAYOUT TEMPLATES
  {
    id: 'disp-photo-before-after',
    title: 'Before / After Vision Email',
    category: 'photo',
    tag: 'badge-blue',
    description: 'Show buyers the transformation potential. Side-by-side "current" vs "after rehab" vision with comparable renovated properties in the area.',
    content: `Subject: 👀 See the Potential — [ADDRESS] — Before → After Vision

Hey [BUYER NAME],

I know this property needs work — but look at what other investors have done with similar homes in [NEIGHBORHOOD]:

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🔄 TRANSFORMATION POTENTIAL
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

KITCHEN:
┌─────────────────┐    ┌─────────────────┐
│ [CURRENT KITCHEN │ → │ [COMP/EXAMPLE    │
│  PHOTO]          │    │  RENOVATED       │
│                  │    │  KITCHEN]        │
│ Dated cabinets,  │    │ Open concept,    │
│ old appliances   │    │ granite, SS      │
└─────────────────┘    └─────────────────┘

BATHROOM:
┌─────────────────┐    ┌─────────────────┐
│ [CURRENT BATH   │ → │ [COMP/EXAMPLE    │
│  PHOTO]          │    │  RENOVATED       │
│                  │    │  BATHROOM]       │
│ Needs updating   │    │ Modern tile,     │
│                  │    │ new vanity       │
└─────────────────┘    └─────────────────┘

EXTERIOR:
┌─────────────────┐    ┌─────────────────┐
│ [CURRENT        │ → │ [COMPARABLE      │
│  EXTERIOR]       │    │  RENOVATED       │
│                  │    │  EXTERIOR]       │
│ Needs paint,     │    │ Fresh paint,     │
│ landscaping      │    │ new landscaping  │
└─────────────────┘    └─────────────────┘

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 COMPARABLE RENOVATED SALES (within 0.5 mi):
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. [ADDRESS] — Sold $[PRICE] — [DATE] — [SQFT]sf — Similar layout
2. [ADDRESS] — Sold $[PRICE] — [DATE] — [SQFT]sf — Same bed/bath
3. [ADDRESS] — Sold $[PRICE] — [DATE] — [SQFT]sf — Same neighborhood

Average sold price per sqft (renovated): $[PRICE/SQFT]
This property per sqft (at contract price): $[YOUR PRICE/SQFT]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 THE MATH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Contract Price:  $[WHOLESALE PRICE]
+ Repairs:       $[REPAIRS]
+ Holding Costs: $[HOLDING]
+ Closing Costs: $[CLOSING]
= All-In Cost:   $[TOTAL]

ARV:             $[ARV]
YOUR PROFIT:     $[PROFIT]
ROI:             [X]%

This is a clear value-add play. The comps prove it.

📸 Full album: [LINK]
Reply or text [YOUR PHONE] for access.

— [YOUR NAME]`,
  },

  // URGENCY HOOK TEMPLATES
  {
    id: 'disp-urgency-48hr',
    title: '48-Hour Deadline Blast',
    category: 'urgency',
    tag: 'badge-red',
    description: 'Creates a hard 48-hour deadline for buyer response. Use this when you have a genuine time constraint — inspection period expiring, seller has backup offers, etc.',
    content: `Subject: ⏰ 48 HOURS — [CITY] Deal Expires [DAY] at 5PM — Act Now

DEAL EXPIRES: [DAY, DATE] at 5:00 PM [TIMEZONE]

Investors,

I've got a deal under contract in [CITY] with a tight timeline. My inspection period ends in 48 hours and I need a committed buyer NOW.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⏰ WHY THE RUSH
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Inspection period expires [DAY] at 5PM
• Seller has 2 backup offers waiting
• I need signed assignment + EMD by [DEADLINE]
• If no buyer commits, I'm releasing this deal

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 QUICK SNAPSHOT
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [BEDS]bd / [BATHS]ba | [SQFT] sqft | Built [YEAR]
• [CITY], [STATE] [ZIP]
• Contract Price: $[PRICE]
• ARV: $[ARV]
• Repairs: ~$[REPAIRS]
• YOUR PROFIT: $[PROFIT]+

📸 Photos: [LINK]
📋 Comps: [LINK]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ TO LOCK THIS DEAL IN THE NEXT 48 HOURS:
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
1. Reply "I'M IN" right now
2. Send POF within 2 hours
3. Sign assignment contract today
4. Wire $[EMD] EMD by [DEADLINE]
5. Close at [TITLE COMPANY] in [X] days

First buyer with signed contract and EMD wins. No exceptions.

Text me NOW: [YOUR PHONE]

— [YOUR NAME]`,
  },
  {
    id: 'disp-urgency-price-drop',
    title: 'Price Drop / Reduced — Urgency Blast',
    category: 'urgency',
    tag: 'badge-red',
    description: 'When you need to move a deal fast and are willing to reduce the assignment fee. The price drop creates a second wave of urgency with your buyer list.',
    content: `Subject: 💥 PRICE REDUCED — [CITY] Deal Now $[NEW PRICE] — Was $[OLD PRICE]

PRICE DROP ALERT 🔻

Hey Investors,

I'm reducing the price on my [CITY] deal to move it THIS WEEK.

OLD PRICE: $[OLD PRICE] ← CROSSED OUT
NEW PRICE: $[NEW PRICE] ✅

That's an extra $[SAVINGS] in YOUR pocket.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 DEAL RECAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [BEDS]bd / [BATHS]ba | [SQFT] sqft
• [CITY], [STATE]
• NEW Contract Price: $[NEW PRICE]
• ARV: $[ARV]
• Repairs: ~$[REPAIRS]
• YOUR PROFIT: $[NEW PROFIT]+ (increased!)

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 UPDATED NUMBERS AT NEW PRICE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Before:
  Price $[OLD] + Repairs $[REPAIRS] = $[OLD TOTAL]
  Profit: $[OLD PROFIT]

NOW:
  Price $[NEW] + Repairs $[REPAIRS] = $[NEW TOTAL]
  Profit: $[NEW PROFIT] ← EXTRA $[SAVINGS]

The deal already made sense at $[OLD PRICE]. At $[NEW PRICE], this is a no-brainer.

📸 Photos: [LINK]

⚡ This reduced price is good through [DATE/TIME]. After that, I'm either closing it myself or pulling it off the market.

Text me: [YOUR PHONE]

— [YOUR NAME]`,
  },
  {
    id: 'disp-urgency-multiple-offers',
    title: 'Multiple Offers — FOMO Blast',
    category: 'urgency',
    tag: 'badge-red',
    description: 'When you genuinely have multiple buyers interested. Creates FOMO (fear of missing out) and drives faster decisions. Only use this when it is TRUE.',
    content: `Subject: ⚠️ 3 Buyers Looking — [CITY] Deal — Highest & Fastest Wins

MULTIPLE BUYERS INTERESTED — UPDATE

Investors,

Quick update on the [CITY/NEIGHBORHOOD] property I sent out yesterday.

I currently have [X] buyers reviewing this deal. Two have already submitted POF.

If you were on the fence, now's the time to move.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📍 DEAL RECAP
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• [BEDS]bd / [BATHS]ba | [SQFT] sqft | [CITY], [STATE]
• Contract Price: $[PRICE]
• ARV: $[ARV] | Repairs: $[REPAIRS]
• Profit Potential: $[PROFIT]+
• 📸 Photos: [LINK]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏆 HOW I'M SELECTING THE BUYER
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
I'll give this deal to the buyer who:
1. Submits POF first
2. Can sign the assignment contract today
3. Wires EMD fastest
4. Has the shortest closing timeline

I'm not running an auction — I'm not looking for highest price.
I want the most CERTAIN close. Speed and reliability win.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
⚡ DEADLINE: [DAY] at [TIME] — I'm making my decision.

If you want this deal, don't just reply "interested" — send your POF NOW.

Text me: [YOUR PHONE]

— [YOUR NAME]`,
  },

  // FOLLOW-UP TEMPLATES
  {
    id: 'disp-followup-24hr',
    title: '24-Hour Follow-Up — No Response',
    category: 'followup',
    tag: 'badge-purple',
    description: 'Follow-up email sent 24 hours after your initial blast if you haven\'t gotten enough buyer interest. Re-emphasizes the opportunity.',
    content: `Subject: Re: [CITY] Deal — Did You See This? [X]% Below ARV

Hey [BUYER NAME / "Investors"],

I sent out a deal yesterday in [CITY/NEIGHBORHOOD] and wanted to make sure it didn't get buried in your inbox.

Quick recap — here's why this deal is worth your attention:

✅ Contract Price: $[PRICE] (that's $[AMOUNT] below ARV)
✅ ARV: $[ARV] (based on [X] verified comps within 0.5 miles)
✅ Repairs: ~$[REPAIRS] (mostly cosmetic — [brief details])
✅ Profit: $[PROFIT]+ on a flip | $[RENT]/mo as a rental
✅ [BEDS]bd/[BATHS]ba | [SQFT] sqft | Built [YEAR]

I know your inbox is flooded with "deals" — most of them aren't real. This one is:
• I have it under contract ✓
• Title is clear ✓
• Comps are verified ✓
• Photos available ✓

📸 See the full package: [LINK]

This deal is still available as of right now. But I've got [X] buyers reviewing it, so the window is closing.

If you're interested, just hit reply or text me at [YOUR PHONE].

— [YOUR NAME]`,
  },
  {
    id: 'disp-followup-final',
    title: 'Final Notice — Last Chance',
    category: 'followup',
    tag: 'badge-purple',
    description: 'Last-chance email before you close the deal or let it expire. Creates authentic urgency without being pushy.',
    content: `Subject: FINAL — [CITY] Deal Closing [DAY] — Last Chance

Last call on this one, [BUYER NAME].

The [PROPERTY TYPE] in [CITY] is closing [DAY]. I have a buyer ready to sign but wanted to give my list one final shot.

━━━━━━━━━━━━━━━━━━
$[PRICE] | ARV $[ARV]
[BEDS]bd/[BATHS]ba | [SQFT]sf
Repairs: ~$[REPAIRS]
Profit: $[PROFIT]+
━━━━━━━━━━━━━━━━━━

📸 [LINK]

If you want it, reply within the next [X] hours. After that, it's gone.

— [YOUR NAME]
[YOUR PHONE]`,
  },
  {
    id: 'disp-followup-check-in',
    title: 'Buyer Check-In — What Are You Looking For?',
    category: 'followup',
    tag: 'badge-purple',
    description: 'Send to buyers who have been on your list but haven\'t responded to recent deals. Helps you understand their buy box and keeps the relationship warm.',
    content: `Subject: Quick question — what kind of deals are you looking for?

Hey [BUYER NAME],

I've sent a few deals your way recently and I want to make sure I'm sending you the RIGHT deals — not just any deal.

Quick question: what does your ideal deal look like?

📍 What areas/zip codes are you focused on?
  _________________________

🏠 What property types? (SFR / Multi / Land / Commercial)
  _________________________

💰 What's your price range?
  $__________ to $__________

🎯 Exit strategy? (Flip / BRRRR / Rental / Wholesale)
  _________________________

🔧 How much rehab are you comfortable with?
  ☐ Turnkey only ($0-10K)
  ☐ Light cosmetic ($10-30K)
  ☐ Medium rehab ($30-75K)
  ☐ Full gut rehab ($75K+)

⏱️ How quickly can you close?
  ☐ 7-14 days
  ☐ 14-30 days
  ☐ 30-45 days

Just reply with your answers and I'll only send you deals that match your buy box. No more inbox noise.

— [YOUR NAME]
[YOUR PHONE]`,
  },

  // PORTFOLIO / BULK TEMPLATES
  {
    id: 'disp-portfolio-package',
    title: 'Portfolio Package — Multiple Properties',
    category: 'portfolio',
    tag: 'badge-gold',
    description: 'For when you have multiple deals available at once. Present them as a portfolio package with bundle pricing.',
    content: `Subject: 📦 [X] Deal Portfolio — [CITY/REGION] — Bundle Discount Available

Hey Investors,

I've got [X] properties under contract in [CITY/REGION]. Available individually OR as a discounted portfolio package.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📦 PORTFOLIO OVERVIEW
━━━━━━━━━━━━━━━━━━━━━━━━━━━━

DEAL #1 — [ADDRESS/NEIGHBORHOOD]
• [BEDS]bd/[BATHS]ba | [SQFT]sf | Built [YEAR]
• Price: $[PRICE] | ARV: $[ARV] | Repairs: $[REPAIRS]
• Strategy: [Flip/Rental] | Profit: $[PROFIT]
• Status: ✅ Available

DEAL #2 — [ADDRESS/NEIGHBORHOOD]
• [BEDS]bd/[BATHS]ba | [SQFT]sf | Built [YEAR]
• Price: $[PRICE] | ARV: $[ARV] | Repairs: $[REPAIRS]
• Strategy: [Flip/Rental] | Profit: $[PROFIT]
• Status: ✅ Available

DEAL #3 — [ADDRESS/NEIGHBORHOOD]
• [BEDS]bd/[BATHS]ba | [SQFT]sf | Built [YEAR]
• Price: $[PRICE] | ARV: $[ARV] | Repairs: $[REPAIRS]
• Strategy: [Flip/Rental] | Profit: $[PROFIT]
• Status: ✅ Available

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
💰 BUNDLE PRICING
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
Individual Total: $[SUM OF INDIVIDUAL PRICES]
Portfolio Price: $[DISCOUNTED BUNDLE PRICE]
SAVINGS: $[DISCOUNT AMOUNT] when you take all [X]

Combined ARV: $[TOTAL ARV]
Combined Repairs: $[TOTAL REPAIRS]
Combined Profit Potential: $[TOTAL PROFIT]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📸 FULL PACKAGES:
Deal #1: [LINK]
Deal #2: [LINK]
Deal #3: [LINK]

Pick one, pick two, or take the whole package. Reply or text [YOUR PHONE].

— [YOUR NAME]`,
  },
  {
    id: 'disp-portfolio-rental',
    title: 'Turnkey Rental Portfolio Blast',
    category: 'portfolio',
    tag: 'badge-gold',
    description: 'For packaging multiple rental properties. Highlights total portfolio cash flow and cap rates for buy-and-hold investors.',
    content: `Subject: 🏘️ Cash Flow Portfolio — [X] Properties — $[TOTAL RENT]/mo Gross

Buy & Hold Investors,

I've got a [X]-property rental portfolio in [CITY/REGION]. All tenanted, all cash flowing.

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🏘️ PORTFOLIO AT A GLANCE
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Total Properties: [X]
• Total Units: [X]
• Total Monthly Rent: $[TOTAL RENT]
• Total Annual NOI: $[TOTAL NOI]
• Portfolio Price: $[PORTFOLIO PRICE]
• Blended Cap Rate: [X]%
• Average Price Per Door: $[AVG/DOOR]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━

PROPERTY #1 — [ADDRESS]
  [BEDS]bd/[BATHS]ba | Rent: $[RENT]/mo | Tenant since [DATE]

PROPERTY #2 — [ADDRESS]
  [BEDS]bd/[BATHS]ba | Rent: $[RENT]/mo | Tenant since [DATE]

PROPERTY #3 — [ADDRESS]
  [BEDS]bd/[BATHS]ba | Rent: $[RENT]/mo | Tenant since [DATE]

━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🎯 WHY THIS PORTFOLIO
━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Immediate cash flow from day one
• All properties occupied — no vacancy
• Below-market rents with room to increase
• Same area — easy to manage
• Ideal for out-of-state investors with a PM company

📸 Full details & photos: [LINK]

Want the full rent rolls and leases? Reply or text [YOUR PHONE].

— [YOUR NAME]`,
  },

  // SUBJECT LINE TEMPLATES
  {
    id: 'disp-subjects-collection',
    title: '40+ Subject Lines That Get Opens',
    category: 'subject',
    tag: 'badge-green',
    description: 'A collection of proven subject lines for disposition emails. Open rate is everything — if they don\'t open, they can\'t buy. Test different styles for your market.',
    content: `━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📬 40+ DISPOSITION EMAIL SUBJECT LINES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

🔥 URGENCY / SCARCITY HOOKS
1. "⏰ 48 Hours — [City] Deal Expires Friday at 5PM"
2. "🔥 Under Contract in [City] — First Buyer with POF Wins"
3. "⚠️ 3 Buyers Looking — [City] Deal — Don't Miss This"
4. "LAST CALL: [City] Deal Going to Backup Buyer Tomorrow"
5. "This [City] Deal Won't Survive the Weekend"
6. "24 Hours Left — $[XX]K Below ARV in [Neighborhood]"
7. "Gone by Friday — [Beds]bd in [City] for $[Price]"

💰 NUMBERS-FOCUSED (Show the Money)
8. "🔥 NEW — [City] — $[XXK] Profit Potential — [X]% Below ARV"
9. "$[XX]K Assignment — [City] [Property Type] — Who Wants It?"
10. "[City] Deal: Buy at $[Price], ARV $[ARV] — Do the Math"
11. "ARV $[ARV], Price $[Price], Repairs $[Repairs] — [City]"
12. "$[Rent]/mo Cash Flow — [City] Rental — Turn-Key"
13. "Cap Rate: [X]% — [Units]-Unit in [City] — Cash Flowing"
14. "All-In Under $[Price] — ARV $[ARV] — [City]"

📍 LOCATION-SPECIFIC
15. "Off-Market in [Hot Neighborhood] — Rare Find"
16. "New Deal: [Street Name], [City] — [X] Blocks from [Landmark]"
17. "[City] ZIP [XXXXX] — This Area Is Blowing Up"
18. "Off-Market [Property Type] in [School District] District"
19. "[Neighborhood] Is Trending — Got One Under Contract"

📸 PHOTO/VISUAL HOOKS
20. "📸 Photos Inside — [City] Deal — See the Potential"
21. "Before & After Vision — [City] Flip Opportunity"
22. "👀 See What $[Repairs] in Rehab Gets You (Photos)"
23. "Full Photo Package — [City] — [Beds]bd [Property Type]"

💥 PRICE REDUCTION
24. "💥 PRICE REDUCED — [City] Now $[New Price] (Was $[Old])"
25. "Just Dropped $[Amount] — [City] Deal — New Price Inside"
26. "I'm Eating My Assignment Fee — [City] Deal at Cost"
27. "Renegotiated With Seller — New Price on [City] Deal"

📦 PORTFOLIO / MULTIPLE DEALS
28. "📦 [X] Properties Available — [City] — Bundle Deal"
29. "[X] Deals, [X] Cities — This Month's Inventory Inside"
30. "Cash Flow Package: [X] Properties, $[Total Rent]/mo"
31. "Portfolio Alert — [X] Doors in [City] — One Buyer"

🎯 STRATEGY-SPECIFIC
32. "BRRRR Alert — [City] — Numbers Inside"
33. "Perfect First Flip — [City] — Light Rehab, Big ARV"
34. "Creative Finance Play — [City] — Sub-To / Wrap"
35. "Land Deal: [X] Acres in [County] — Below Comps"

🤝 RELATIONSHIP / PERSONAL
36. "Saved This One for You — [City] Deal"
37. "[Name], This Matches Your Buy Box Exactly"
38. "You Said You Wanted [City/Type] — Here It Is"
39. "Quick Question About Your Buying Criteria"
40. "Thought of You When I Locked This Up"
41. "VIP Access — Not Sending This to My Full List"

━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 SUBJECT LINE BEST PRACTICES
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
• Keep under 50 characters when possible
• Include the CITY name — buyers search by location
• Lead with a number ($XX,XXX or XX%)
• Use 1-2 emojis max (🔥 and 💰 perform best)
• Avoid ALL CAPS for entire subject (triggers spam)
• A/B test: send same deal with 2 different subjects
• Best send times: Tues-Thurs, 7-9 AM or 5-7 PM
• Personalize with buyer's name when possible

Average open rates by type:
• Urgency subjects: 35-45% open rate
• Numbers-focused: 30-40%
• Location-specific: 28-35%
• Personal/relationship: 40-50% (highest!)`,
  },
]

function downloadText(filename: string, content: string) {
  const blob = new Blob([content], { type: 'text/plain' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  URL.revokeObjectURL(url)
}

function TemplateCard({ template }: { template: Template }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const [editedContent, setEditedContent] = useState(template.content)
  const [isEditing, setIsEditing] = useState(false)

  function handleCopy() {
    navigator.clipboard.writeText(editedContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleReset() {
    setEditedContent(template.content)
    setIsEditing(false)
  }

  return (
    <div className="resource-card" style={{ borderRadius: 10, padding: 20, marginBottom: 12 }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, cursor: 'pointer' }}
        onClick={() => setExpanded(!expanded)}
      >
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
              {template.title}
            </h3>
            <span className={`badge ${template.tag}`}>{CATEGORIES.find(c => c.id === template.category)?.label}</span>
          </div>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>{template.description}</p>
        </div>
        <span style={{ color: '#ff7e5f', fontSize: 12, flexShrink: 0, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          {expanded ? <><ChevronUp size={14} /> Close</> : <><ChevronDown size={14} /> View</>}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 11, color: isEditing ? '#5cb885' : '#666', fontWeight: 600, letterSpacing: '0.04em' }}>
              {isEditing ? '✎ EDITING — customize the template below' : 'Click the text below to edit'}
            </span>
            {isEditing && editedContent !== template.content && (
              <button
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                style={{
                  fontSize: 11, color: '#888', background: 'rgba(255,255,255,0.05)',
                  border: '1px solid #333', borderRadius: 6, padding: '4px 10px',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Reset to Original
              </button>
            )}
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => { setEditedContent(e.target.value); setIsEditing(true) }}
            onFocus={() => setIsEditing(true)}
            onClick={(e) => e.stopPropagation()}
            style={{
              width: '100%', boxSizing: 'border-box',
              whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              fontSize: 13, lineHeight: 1.7, color: '#ccc',
              background: isEditing ? '#111' : '#1a2030',
              border: isEditing ? '1px solid #ff7e5f' : '1px solid #2e3a4d',
              borderRadius: 8, padding: 16,
              minHeight: 300, maxHeight: 500, overflowY: 'auto',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          />
          <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
            <button
              onClick={(e) => { e.stopPropagation(); handleCopy() }}
              className="btn-download btn-pdf"
              style={{ display: 'flex', alignItems: 'center', gap: 6 }}
            >
              {copied ? <><Check size={13} /> Copied!</> : <><Copy size={13} /> Copy to Clipboard</>}
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); downloadText(`${template.id}.txt`, editedContent) }}
              className="btn-download btn-word"
            >
              <Download size={13} /> Download .txt
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

// Live example component showing a filled-out template
function LiveExample() {
  const [showExample, setShowExample] = useState(false)

  return (
    <div style={{
      marginBottom: 24, padding: 20,
      background: 'rgba(90,154,214,0.04)',
      border: '1px solid rgba(90,154,214,0.15)',
      borderRadius: 10,
    }}>
      <div
        style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
        onClick={() => setShowExample(!showExample)}
      >
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#5a9ad6', letterSpacing: '0.04em' }}>
          Live Example — Real Deal Email (Filled Out)
        </div>
        <span style={{ color: '#5a9ad6', fontSize: 12, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4 }}>
          {showExample ? <><ChevronUp size={14} /> Hide</> : <><ChevronDown size={14} /> Show</>}
        </span>
      </div>
      <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: '8px 0 0' }}>
        See what a completed disposition email looks like with all fields filled in — ready to send to your buyer list.
      </p>

      {showExample && (
        <div style={{ marginTop: 16 }}>
          <div style={{
            background: '#161c28', border: '1px solid #2e3a4d', borderRadius: 10, overflow: 'hidden',
          }}>
            {/* Email header mockup */}
            <div style={{ padding: '12px 16px', borderBottom: '1px solid #2e3a4d', background: 'rgba(255,255,255,0.02)' }}>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>From: Marcus Johnson &lt;marcus@cashoffersclt.com&gt;</div>
              <div style={{ fontSize: 11, color: '#666', marginBottom: 4 }}>To: Charlotte Investors List &lt;buyers@cashoffersclt.com&gt;</div>
              <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 600 }}>
                Subject: 🔥 NEW Off-Market Deal — Charlotte, NC — 28% Below ARV
              </div>
            </div>

            {/* Email body */}
            <div style={{ padding: 16, fontSize: 13, color: '#ccc', lineHeight: 1.8, fontFamily: "'DM Sans', sans-serif" }}>
              <p style={{ margin: '0 0 16px' }}>Hey Investors,</p>
              <p style={{ margin: '0 0 16px' }}>Just locked up a killer off-market deal in NoDa. First come, first served — this won't last.</p>

              <div style={{ background: 'rgba(255,126,95,0.06)', border: '1px solid rgba(255,126,95,0.15)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: '#ff7e5f', fontSize: 12, letterSpacing: '0.05em', marginBottom: 8 }}>📍 PROPERTY SNAPSHOT</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 4, fontSize: 13, color: '#bbb' }}>
                  <div>• Address: 4218 Spencer St, Charlotte, NC 28205</div>
                  <div>• Type: Single Family Residence</div>
                  <div>• Beds / Baths: 3 / 2</div>
                  <div>• Sq Ft: 1,340 | Lot: 0.18 acres</div>
                  <div>• Year Built: 1962</div>
                  <div>• Condition: Vacant — Needs cosmetic rehab</div>
                </div>
              </div>

              <div style={{ background: 'rgba(91,184,133,0.06)', border: '1px solid rgba(91,184,133,0.15)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: '#5cb885', fontSize: 12, letterSpacing: '0.05em', marginBottom: 8 }}>💰 THE NUMBERS</div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 4, fontSize: 13, color: '#bbb' }}>
                  <div>• Contract Price: <strong style={{ color: '#5cb885' }}>$165,000</strong></div>
                  <div>• ARV: <strong>$229,000</strong></div>
                  <div>• Estimated Repairs: <strong>$28,000</strong></div>
                  <div>• Potential Profit (Flip): <strong style={{ color: '#5cb885' }}>$36,000+</strong></div>
                  <div>• Monthly Rent Estimate: $1,450/mo</div>
                  <div>• Cap Rate (as rental): 7.2%</div>
                </div>
              </div>

              <div style={{ background: 'rgba(244,126,95,0.06)', border: '1px solid rgba(244,126,95,0.15)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: '#ff7e5f', fontSize: 12, letterSpacing: '0.05em', marginBottom: 8 }}>🎯 IDEAL EXIT STRATEGY</div>
                <div style={{ fontSize: 13, color: '#bbb' }}>
                  <div>☑ Fix & Flip — Strong ARV with $36K+ profit potential</div>
                  <div>☑ BRRRR — Rents at $1,450/mo after rehab, NoDa appreciation trending 12% YoY</div>
                </div>
              </div>

              <div style={{ background: 'rgba(168,85,247,0.06)', border: '1px solid rgba(168,85,247,0.15)', borderRadius: 8, padding: 14, marginBottom: 16 }}>
                <div style={{ fontWeight: 700, color: '#a855f7', fontSize: 12, letterSpacing: '0.05em', marginBottom: 8 }}>⚡ HOW TO LOCK THIS DEAL</div>
                <div style={{ fontSize: 13, color: '#bbb' }}>
                  <div>1. Reply "INTERESTED" or text (704) 555-0192</div>
                  <div>2. Provide Proof of Funds (POF)</div>
                  <div>3. Sign assignment contract</div>
                  <div>4. $3,000 EMD due within 48 hours</div>
                  <div>5. Close in 14 days at Investors Title</div>
                </div>
              </div>

              <p style={{ margin: '0 0 8px', fontStyle: 'italic', color: '#888' }}>Serious buyers only. POF required before I release the full address.</p>
              <p style={{ margin: 0 }}>
                — Marcus Johnson<br />
                (704) 555-0192<br />
                marcus@cashoffersclt.com
              </p>
            </div>
          </div>

          <div style={{ marginTop: 12, padding: 12, background: 'rgba(255,255,255,0.02)', borderRadius: 8, border: '1px solid #2e3a4d' }}>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#5a9ad6', marginBottom: 6 }}>Why This Email Works:</div>
            <div style={{ fontSize: 12, color: '#888', lineHeight: 1.7 }}>
              • <strong style={{ color: '#ccc' }}>Subject line</strong> — emoji hook + city + specific discount percentage<br />
              • <strong style={{ color: '#ccc' }}>Property details</strong> — all key specs in a scannable format<br />
              • <strong style={{ color: '#ccc' }}>Clear numbers</strong> — contract price, ARV, repairs, and profit are front and center<br />
              • <strong style={{ color: '#ccc' }}>Exit strategies</strong> — shows buyer how THEY make money, not just the deal<br />
              • <strong style={{ color: '#ccc' }}>Clear CTA</strong> — step-by-step action items to lock the deal<br />
              • <strong style={{ color: '#ccc' }}>Scarcity</strong> — "first come, first served" and POF gating create natural urgency
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default function DispositionEmails() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [search, setSearch] = useState('')

  const filtered = TEMPLATES.filter(t => {
    const matchesCategory = activeCategory === 'all' || t.category === activeCategory
    const matchesSearch = !search || t.title.toLowerCase().includes(search.toLowerCase()) || t.content.toLowerCase().includes(search.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const categoryCount = (id: CategoryId) =>
    id === 'all' ? TEMPLATES.length : TEMPLATES.filter(t => t.category === id).length

  return (
    <div>
      <h2 className="section-header">Disposition Email Templates</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
        {TEMPLATES.length} ready-to-send email templates for blasting your deals to cash buyer lists. Includes initial blasts, before/after vision layouts, urgency hooks, follow-up sequences, portfolio packages, and 40+ proven subject lines. Edit directly, copy, and close deals faster.
      </p>

      <InfoBox type="tip">
        <strong>The #1 rule of disposition:</strong> Speed wins. The moment you get a property under contract, blast it to your buyer list within the hour. The first 24 hours are when you'll get 80% of your buyer interest. Use these templates to send professional, compelling deal packages fast.
      </InfoBox>

      <InfoBox type="warn">
        <strong>CAN-SPAM Compliance:</strong> All marketing emails must include your physical mailing address, a clear unsubscribe option, and accurate "From" and subject lines. Don't use deceptive subject lines or misleading headers. Violations can result in penalties up to $50,120 per email.
      </InfoBox>

      {/* Live Example */}
      <LiveExample />

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Initial Blasts', count: categoryCount('initial'), icon: Zap, color: '#ff7e5f' },
          { label: 'Photo Layouts', count: categoryCount('photo'), icon: Camera, color: '#5a9ad6' },
          { label: 'Urgency Hooks', count: categoryCount('urgency'), icon: Clock, color: '#ef4444' },
          { label: 'Follow-Ups', count: categoryCount('followup'), icon: TrendingUp, color: '#a855f7' },
          { label: 'Portfolio', count: categoryCount('portfolio'), icon: Users, color: '#ffb347' },
          { label: 'Subject Lines', count: categoryCount('subject'), icon: Star, color: '#5cb885' },
        ].map(stat => (
          <div key={stat.label} style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '6px 12px', background: 'rgba(255,255,255,0.03)',
            border: '1px solid #2e3a4d', borderRadius: 8, fontSize: 12, color: '#888',
          }}>
            <stat.icon size={12} color={stat.color} />
            <span style={{ color: stat.color, fontWeight: 700 }}>{stat.count}</span> {stat.label}
          </div>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 16 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input
          className="input-dark"
          placeholder="Search disposition templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 34 }}
        />
      </div>

      {/* Category filters */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 20 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat.id}
            onClick={() => setActiveCategory(cat.id)}
            style={{
              padding: '6px 14px',
              fontSize: 12,
              fontWeight: activeCategory === cat.id ? 700 : 500,
              background: activeCategory === cat.id ? 'rgba(244,126,95,0.15)' : 'rgba(255,255,255,0.03)',
              border: activeCategory === cat.id ? '1px solid #ff7e5f' : '1px solid #3d4e65',
              borderRadius: 20,
              cursor: 'pointer',
              color: activeCategory === cat.id ? '#ff7e5f' : '#888',
              fontFamily: "'DM Sans', sans-serif",
              transition: 'all 0.2s',
              whiteSpace: 'nowrap',
            }}
          >
            {cat.label} ({categoryCount(cat.id)})
          </button>
        ))}
      </div>

      {/* Download all */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => {
            const all = TEMPLATES.map(t =>
              `${'='.repeat(60)}\n${t.title.toUpperCase()}\nCategory: ${CATEGORIES.find(c => c.id === t.category)?.label}\n${'='.repeat(60)}\n\n${t.content}\n\n\n`
            ).join('')
            downloadText('All_Disposition_Email_Templates.txt', all)
          }}
          className="btn-orange"
          style={{ padding: '10px 20px', fontSize: 13 }}
        >
          <Download size={14} /> Download All {TEMPLATES.length} Templates
        </button>
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
        Showing {filtered.length} of {TEMPLATES.length} templates
      </div>

      {/* Template cards */}
      {filtered.map(t => <TemplateCard key={t.id} template={t} />)}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <p>No templates found matching your search.</p>
        </div>
      )}

      {/* Disposition Best Practices */}
      <div style={{
        marginTop: 24, padding: 20,
        background: 'rgba(244,126,95,0.04)',
        border: '1px solid rgba(244,126,95,0.15)',
        borderRadius: 10,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 10 }}>
          Disposition Email Best Practices
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: 12 }}>
          {[
            { title: 'Blast Within 1 Hour', desc: 'The moment you lock up a contract, send your disposition email. The first hour generates the most buyer interest. Have your template pre-loaded and ready to customize.' },
            { title: 'Lead With the Numbers', desc: 'Buyers care about money. Put contract price, ARV, repairs, and profit potential in the top third of your email. Don\'t bury the numbers below photos or descriptions.' },
            { title: 'Always Include Photos', desc: 'Deals with photos get 3x more responses than text-only emails. Even phone photos are better than nothing. Include exterior, kitchen, bathrooms, and any damage.' },
            { title: 'Use Multiple Channels', desc: 'Don\'t just email — text your top buyers, post in Facebook groups, and call your VIP buyers. The best wholesalers use 3-4 channels simultaneously for every deal.' },
            { title: 'Segment Your List', desc: 'Don\'t send every deal to every buyer. Know each buyer\'s buy box (area, price, strategy) and send targeted emails. Higher relevance = higher response rate.' },
            { title: 'Follow Up Systematically', desc: 'Send the initial blast, then follow up at 24 hours, 48 hours, and send a final notice. Most deals are assigned on the 2nd or 3rd touch, not the first.' },
          ].map(tip => (
            <div key={tip.title} style={{
              padding: '12px 14px', background: 'rgba(0,0,0,0.3)', borderRadius: 8,
              border: '1px solid #2e3a4d',
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#f5f0eb', marginBottom: 4 }}>{tip.title}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.6 }}>{tip.desc}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Disposition workflow */}
      <div style={{
        marginTop: 16, padding: 20,
        background: 'rgba(90,154,214,0.04)',
        border: '1px solid rgba(90,154,214,0.15)',
        borderRadius: 10,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#5a9ad6', letterSpacing: '0.04em', marginBottom: 12 }}>
          Disposition Timeline — From Contract to Assignment
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {[
            { time: 'Hour 0', action: 'Lock up the contract', detail: 'Get signed purchase agreement from seller' },
            { time: 'Hour 1', action: 'Initial Deal Blast', detail: 'Send to full buyer list with photos and numbers' },
            { time: 'Hours 2-8', action: 'Field Responses', detail: 'Reply to interested buyers, send POF requests' },
            { time: 'Hour 24', action: 'First Follow-Up', detail: 'Re-send to non-openers with new subject line' },
            { time: 'Hour 48', action: 'Urgency Blast', detail: 'Send deadline email — "48 hours left"' },
            { time: 'Hours 48-72', action: 'Collect EMD & Assign', detail: 'Sign assignment contract, collect EMD from buyer' },
            { time: 'Day 7-30', action: 'Close', detail: 'Title company handles closing, collect assignment fee' },
          ].map((step, i) => (
            <div key={i} style={{
              display: 'flex', gap: 12, alignItems: 'flex-start',
              padding: '10px 14px', background: 'rgba(0,0,0,0.2)', borderRadius: 8,
              border: '1px solid #2e3a4d',
            }}>
              <div style={{
                flexShrink: 0, width: 72, padding: '4px 0',
                fontSize: 11, fontWeight: 700, color: '#5a9ad6',
                fontFamily: "'DM Sans', sans-serif",
              }}>{step.time}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#f5f0eb' }}>{step.action}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{step.detail}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <InfoBox type="note">
        All templates are for educational purposes only. Always ensure your email marketing complies with CAN-SPAM Act, state-specific regulations, and your email service provider's terms of service. Never send unsolicited emails to people who haven't opted in to your list.
      </InfoBox>
    </div>
  )
}
