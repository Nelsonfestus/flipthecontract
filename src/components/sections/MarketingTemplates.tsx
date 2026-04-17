import { useState } from 'react'
import { Download, Mail, FileText, AlertTriangle, Info, Lightbulb, Search, Copy, Check, Smartphone, Globe, Image } from 'lucide-react'

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

type CategoryId = 'all' | 'directmail' | 'bandit' | 'social' | 'email' | 'sms'
const CATEGORIES: { id: CategoryId; label: string; icon: typeof Mail }[] = [
  { id: 'all', label: 'All Templates', icon: FileText },
  { id: 'directmail', label: 'Direct Mail', icon: Mail },
  { id: 'bandit', label: 'Bandit Signs', icon: Image },
  { id: 'social', label: 'Social Media', icon: Globe },
  { id: 'email', label: 'Email Sequences', icon: Mail },
  { id: 'sms', label: 'SMS / Text', icon: Smartphone },
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
  // DIRECT MAIL
  {
    id: 'dm-yellow-letter',
    title: 'Handwritten Yellow Letter',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'The classic high-response yellow letter. Hand-write on yellow lined paper for best results. 3-5% response rate typical.',
    content: `Dear [OWNER NAME],

My name is [YOUR NAME] and I noticed you own the property at [PROPERTY ADDRESS].

I'm a local real estate investor and I'm interested in buying houses in your neighborhood. I was wondering if you've ever thought about selling?

I buy houses in any condition — no repairs needed, no agents, no fees. I can close quickly and pay cash.

If you'd like to chat, give me a call or text at [YOUR PHONE]. No pressure at all — just a friendly conversation.

Thanks,
[YOUR NAME]
[YOUR PHONE]`,
  },
  {
    id: 'dm-probate',
    title: 'Probate / Inherited Property Letter',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'Sensitive letter for heirs who inherited property. Empathetic tone is critical.',
    content: `Dear [HEIR NAME],

First, I want to express my condolences for your loss. I understand this is a difficult time.

My name is [YOUR NAME] and I work with families who have inherited property and may not be sure what to do with it. Inherited properties can come with unexpected costs — taxes, insurance, maintenance, and utilities add up quickly.

If keeping or managing the property at [PROPERTY ADDRESS] isn't in your plans, I'd like to offer a simple solution. I purchase properties directly from homeowners:

• No real estate agent commissions
• No repairs or cleaning needed
• I handle all the paperwork
• Close on YOUR timeline
• Fair cash offer within 24 hours

There's absolutely no obligation. If you'd like to explore your options, I'm happy to have a confidential conversation.

Respectfully,
[YOUR NAME]
[YOUR PHONE]
[YOUR EMAIL]`,
  },
  {
    id: 'dm-preforeclosure',
    title: 'Pre-Foreclosure Letter',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'For homeowners facing foreclosure. Time-sensitive — be direct but compassionate.',
    content: `Dear [OWNER NAME],

I understand you may be going through a challenging time with your property at [PROPERTY ADDRESS]. I'm reaching out because I've helped many homeowners in similar situations find a way out — with cash in hand and their credit protected.

Here's what I can offer:
• Stop the foreclosure process
• Pay off your remaining mortgage balance
• Put cash in your pocket at closing
• Close in as little as 7-14 days
• 100% confidential — no one needs to know

I'm not a real estate agent. I'm a local investor who buys houses directly. There are no fees, no commissions, and no obligation.

Time is important in these situations. The sooner we talk, the more options you have.

Call or text me anytime: [YOUR PHONE]

[YOUR NAME]`,
  },
  {
    id: 'dm-absentee',
    title: 'Absentee Owner Postcard',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'Short postcard format for out-of-state or absentee property owners.',
    content: `FRONT:
━━━━━━━━━━━━━━━━━━━━━━━
TIRED OF MANAGING YOUR
RENTAL PROPERTY?
━━━━━━━━━━━━━━━━━━━━━━━
I'll Buy Your House — CASH
No Agents. No Fees. No Repairs.
Close in 7-30 Days.
CALL/TEXT: [YOUR PHONE]
━━━━━━━━━━━━━━━━━━━━━━━

BACK:
Dear [OWNER NAME],

I noticed you own the property at [PROPERTY ADDRESS] but live elsewhere.

Are you tired of:
□ Dealing with tenants?
□ Paying for repairs from a distance?
□ Property taxes on a property you don't use?

I buy properties AS-IS for cash. No repairs, no cleaning, no showings.

Get a fair offer in 24 hours.
[YOUR NAME] | [YOUR PHONE]
[YOUR EMAIL]`,
  },
  {
    id: 'dm-tax-delinquent',
    title: 'Tax Delinquent Owner Letter',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'For owners with unpaid property taxes. Often highly motivated sellers.',
    content: `Dear [OWNER NAME],

I noticed that the property taxes on [PROPERTY ADDRESS] may be behind. I'm reaching out because I specialize in helping homeowners resolve property tax situations before they escalate to a tax lien sale.

Here's how I can help:
• I'll pay off your back taxes at closing
• You walk away with cash in your pocket
• No agents, no fees, no repairs needed
• Close in as little as 10-14 days
• Completely confidential process

Unpaid taxes can lead to liens, penalties, and eventually the county selling your property. I'd like to help you avoid that.

Even if you're not sure, a quick 5-minute conversation could help you understand all your options. No pressure, no obligation.

Call or text: [YOUR PHONE]

Best regards,
[YOUR NAME]`,
  },
  {
    id: 'dm-divorce',
    title: 'Divorce / Life Change Letter',
    category: 'directmail',
    tag: 'badge-orange',
    description: 'For homeowners going through divorce or major life transitions.',
    content: `Dear Homeowner,

Life changes can be overwhelming — and dealing with a property on top of everything else can make things harder.

If you're going through a transition and need to sell your home quickly, I can help make the process simple and stress-free:

• Cash offer within 24 hours
• Close on your timeline (7-45 days)
• No showings, no open houses
• No agent commissions (save 5-6%)
• I buy AS-IS — no repairs needed
• Completely confidential

I'm [YOUR NAME], a local real estate investor. I've helped many homeowners during difficult transitions sell quickly and move forward.

No obligation. Just a conversation.

[YOUR NAME]
[YOUR PHONE]
[YOUR EMAIL]`,
  },

  // BANDIT SIGNS
  {
    id: 'bandit-1',
    title: 'Classic "We Buy Houses" Sign',
    category: 'bandit',
    tag: 'badge-gold',
    description: 'The tried-and-true bandit sign. Yellow background, black text. Place at busy intersections.',
    content: `SIGN TEXT:
━━━━━━━━━━━━━━━━━━
  WE BUY HOUSES
       CASH!
  Any Condition
  Close in 7 Days

  [YOUR PHONE]
━━━━━━━━━━━━━━━━━━

SPECS:
• Size: 18" x 24" corrugated plastic
• Background: Yellow (#FFD700)
• Text: Black, bold
• Font: Large, readable from car at 35mph
• Placement: High-traffic intersections, near distressed areas
• Best days: Friday evening through Sunday`,
  },
  {
    id: 'bandit-2',
    title: 'Urgent / Deadline Sign',
    category: 'bandit',
    tag: 'badge-gold',
    description: 'Creates urgency. Works well near neighborhoods with older homes.',
    content: `SIGN TEXT:
━━━━━━━━━━━━━━━━━━
  NEED TO SELL
  YOUR HOUSE?

  I Buy This Week!
  CASH • AS-IS
  No Fees or Agents

  CALL NOW:
  [YOUR PHONE]
━━━━━━━━━━━━━━━━━━

SPECS:
• Size: 18" x 24" corrugated plastic
• Background: White
• Text: Red headline, black body
• Arrow stickers to direct to phone number
• Place near stop signs for maximum visibility`,
  },
  {
    id: 'bandit-3',
    title: 'Behind on Payments Sign',
    category: 'bandit',
    tag: 'badge-gold',
    description: 'Targets homeowners in financial distress. Compliance-sensitive — check local rules.',
    content: `SIGN TEXT:
━━━━━━━━━━━━━━━━━━
  BEHIND ON
  PAYMENTS?

  I Can Help.
  Cash Offer Today.
  No Judgment.

  [YOUR PHONE]
━━━━━━━━━━━━━━━━━━

SPECS:
• Size: 18" x 24"
• Background: Blue
• Text: White
• Tone: Helpful, not predatory
• NOTE: Check local ordinances — bandit signs are illegal in many cities
  Fines range from $50-$500 per sign`,
  },
  {
    id: 'bandit-4',
    title: 'Handwritten Style Sign',
    category: 'bandit',
    tag: 'badge-gold',
    description: 'Handwritten look gets 2-3x more calls than printed signs in many markets.',
    content: `SIGN TEXT (hand-write on blank sign):
━━━━━━━━━━━━━━━━━━
  I Buy Houses!

  • Cash
  • Quick Close
  • Any Condition

  Call [YOUR NAME]
  [YOUR PHONE]
━━━━━━━━━━━━━━━━━━

TIPS:
• Use a thick black marker on yellow/white sign
• Intentionally messy handwriting gets more attention
• Add a smiley face or arrow pointing to number
• Replace signs every 2-3 weeks (they get removed)
• Best ROI of all sign styles — under $3 each`,
  },

  // SOCIAL MEDIA
  {
    id: 'social-fb-post',
    title: 'Facebook — Buyer Post',
    category: 'social',
    tag: 'badge-blue',
    description: 'Post in local REI Facebook groups to find cash buyers.',
    content: `🏠 OFF-MARKET DEAL ALERT — [CITY, STATE]

Looking for cash buyers for a [PROPERTY TYPE] in [NEIGHBORHOOD].

📍 Location: [CITY/ZIP]
💰 Asking: $[WHOLESALE PRICE]
📊 ARV: $[ARV]
🔧 Est. Repairs: $[REPAIR ESTIMATE]
📐 Sq Ft: [SQFT]
🛏️ Beds/Baths: [X] / [X]

This property is perfect for [fix-and-flip / buy-and-hold / BRRRR].

Serious buyers only. Proof of funds required.
DM me or text [YOUR PHONE] for the full property package.

#WholesaleDeals #[City]RealEstate #CashBuyers #OffMarket #InvestmentProperty`,
  },
  {
    id: 'social-fb-seller',
    title: 'Facebook — Seller Lead Ad',
    category: 'social',
    tag: 'badge-blue',
    description: 'Post to attract motivated sellers from community groups.',
    content: `🏡 Do You Need to Sell Your House Fast in [CITY]?

We buy houses in ANY condition:
✅ No real estate agent fees
✅ No repairs or cleaning needed
✅ Cash offer in 24 hours
✅ Close in as little as 7 days
✅ We pay ALL closing costs

Whether you're dealing with:
• Foreclosure or behind on payments
• Inherited property you don't want
• Divorce or relocation
• Problem tenants
• Fire/water damage
• Or just need a fresh start

We can help! Get your FREE, no-obligation cash offer today.

📱 Call/Text: [YOUR PHONE]
💻 Or visit: [YOUR WEBSITE]

We've helped [X]+ homeowners sell fast. Let us help you too!`,
  },
  {
    id: 'social-ig-post',
    title: 'Instagram — Deal Showcase',
    category: 'social',
    tag: 'badge-blue',
    description: 'Show off your deals to build credibility and attract buyers.',
    content: `CAPTION:
🔥 ANOTHER DEAL CLOSED! 🔥

Just closed this [PROPERTY TYPE] in [CITY]!

The numbers:
📍 [NEIGHBORHOOD]
💰 Purchase Price: $[PRICE]
📊 ARV: $[ARV]
🔧 Rehab Budget: $[REPAIRS]
💵 Profit Potential: $[PROFIT]

This is what happens when you have the right systems:
1️⃣ Found the deal through [skip tracing / driving for dollars / direct mail]
2️⃣ Got it under contract at [X]% below ARV
3️⃣ Assigned to a cash buyer in [X] days
4️⃣ Closed and collected the assignment fee

Want to get deals like this sent to your inbox?
DM me "DEALS" and I'll add you to my VIP buyers list.

#WholesaleRealEstate #RealEstateInvesting #Wholesaling #FlipTheContract #CashBuyer`,
  },
  {
    id: 'social-craigslist',
    title: 'Craigslist — Property Ad',
    category: 'social',
    tag: 'badge-blue',
    description: 'Craigslist ad to find cash buyers. Post in "Real Estate - by owner" section.',
    content: `TITLE: Investment Property — [CITY] — Below Market Value — Cash Buyers Only

BODY:
I have an off-market investment property available in [CITY/NEIGHBORHOOD].

Property Details:
• Address area: [NEIGHBORHOOD/ZIP] (full address with POF)
• Type: [SFR / Duplex / Multi-family]
• Beds/Baths: [X] / [X]
• Sq Ft: [SQFT]
• Year Built: [YEAR]
• Lot Size: [LOT]

Investment Numbers:
• Asking Price: $[WHOLESALE PRICE]
• Estimated ARV: $[ARV]
• Estimated Repairs: $[REPAIRS]
• Potential Profit: $[PROFIT]

Property needs [brief description of condition].
Great opportunity for fix-and-flip or rental investors.

CASH BUYERS ONLY. Proof of funds required for full address.

Contact: [YOUR NAME]
Phone/Text: [YOUR PHONE]
Email: [YOUR EMAIL]

This is NOT a retail listing. Assignment of contract.`,
  },

  // EMAIL SEQUENCES
  {
    id: 'email-seller-1',
    title: 'Seller Follow-Up — Email #1 (Day 1)',
    category: 'email',
    tag: 'badge-purple',
    description: 'First follow-up email after initial contact with a motivated seller.',
    content: `Subject: Quick follow-up about [PROPERTY ADDRESS]

Hi [SELLER NAME],

It was great speaking with you today about your property at [PROPERTY ADDRESS]. I appreciate you taking the time to share your situation with me.

As I mentioned, I buy properties directly from homeowners — no agents, no commissions, and I handle all the paperwork. Here's a quick recap of what I can offer:

• Cash purchase — no financing delays
• Close on your timeline
• Buy AS-IS — no repairs needed
• I cover standard closing costs
• Confidential and hassle-free process

I'm putting together some numbers based on our conversation and comparable sales in your area. I should have a written offer for you within [24-48] hours.

In the meantime, if you have any questions at all, don't hesitate to reach out.

Talk soon,
[YOUR NAME]
[YOUR PHONE]`,
  },
  {
    id: 'email-seller-2',
    title: 'Seller Follow-Up — Email #2 (Day 3)',
    category: 'email',
    tag: 'badge-purple',
    description: 'Second follow-up with the actual offer.',
    content: `Subject: Your cash offer for [PROPERTY ADDRESS]

Hi [SELLER NAME],

I've finished reviewing the comparable sales in your area and the property details you shared. Based on my analysis, I'd like to offer:

💰 Cash Offer: $[OFFER AMOUNT]

Here's what this includes:
✅ All-cash, no financing contingency
✅ Close in [7-30] days (your choice)
✅ I pay standard closing costs
✅ No agent fees or commissions
✅ Property purchased AS-IS

This offer is good for [7] days.

I know this is a big decision. I'm happy to walk through the numbers with you on a quick call. Would [DAY] at [TIME] work for a 10-minute chat?

Looking forward to hearing from you.

Best,
[YOUR NAME]
[YOUR PHONE]`,
  },
  {
    id: 'email-seller-3',
    title: 'Seller Follow-Up — Email #3 (Day 7)',
    category: 'email',
    tag: 'badge-purple',
    description: 'Gentle follow-up if no response. Creates soft urgency.',
    content: `Subject: Still interested in selling [PROPERTY ADDRESS]?

Hi [SELLER NAME],

I wanted to follow up one more time about the property at [PROPERTY ADDRESS]. I sent over a cash offer a few days ago and wanted to make sure you received it.

I completely understand if the timing isn't right — there's absolutely no pressure. But if you're still considering selling, I'm here to answer any questions and make the process as easy as possible.

A few things to keep in mind:
• My offer has no obligation — you can say no at any time
• I can adjust the closing date to fit your schedule
• If circumstances have changed, I'm happy to revisit the numbers

Would you have 5 minutes for a quick call this week? I'm available [LIST TIMES].

Either way, I wish you the best.

[YOUR NAME]
[YOUR PHONE]`,
  },
  {
    id: 'email-buyer-blast',
    title: 'Buyer List — New Deal Blast',
    category: 'email',
    tag: 'badge-purple',
    description: 'Email to send to your cash buyer list when you have a new deal.',
    content: `Subject: 🔥 NEW DEAL — [PROPERTY TYPE] in [CITY] — [X]% Below ARV

Hey [BUYER NAME / "Investors"],

New off-market deal just landed. First come, first served.

📍 PROPERTY DETAILS:
• Location: [CITY, STATE ZIP]
• Type: [SFR / Duplex / etc.]
• Beds/Baths: [X] / [X]
• Sq Ft: [SQFT]
• Year Built: [YEAR]
• Current Condition: [Brief description]

💰 THE NUMBERS:
• Asking Price: $[WHOLESALE PRICE]
• ARV (After Repair Value): $[ARV]
• Estimated Repairs: $[REPAIRS]
• Potential Profit: $[PROFIT]
• Assignment Fee: $[FEE] (included in asking)

🎯 IDEAL FOR: [Fix-and-flip / BRRRR / Rental]

⚡ TO LOCK THIS DEAL:
1. Reply to this email or text me at [YOUR PHONE]
2. Provide proof of funds
3. Sign the assignment contract
4. Close in [X] days

This deal won't last. Serious buyers only — proof of funds required.

[YOUR NAME]
[YOUR PHONE]
Flip the Contract`,
  },

  // SMS / TEXT
  {
    id: 'sms-seller-cold',
    title: 'Cold Text — Motivated Seller',
    category: 'sms',
    tag: 'badge-green',
    description: 'Initial outreach text to property owners. Keep it short and personal.',
    content: `TEXT 1 — Initial Outreach:
"Hi [NAME], this is [YOUR NAME]. I'm a local investor and I noticed you own the property at [ADDRESS]. Would you ever consider selling? I buy homes for cash, any condition. No pressure — just checking. 😊"

TEXT 2 — If they respond with interest:
"Great! I'd love to learn more about your property and situation. Would you prefer a quick 5-min phone call or would you rather text back and forth? Either works for me."

TEXT 3 — If no response after 3 days:
"Hey [NAME], just following up on my text about [ADDRESS]. If selling isn't something you're interested in right now, no worries at all. But if things change, my offer stands. Have a great week!"

TEXT 4 — Long-term follow-up (30 days):
"Hi [NAME], it's [YOUR NAME] again. I'm still buying in your area if you ever decide to sell [ADDRESS]. Cash offer, close on your timeline. Just wanted to stay in touch. 🏡"`,
  },
  {
    id: 'sms-seller-preforeclosure',
    title: 'Pre-Foreclosure Text',
    category: 'sms',
    tag: 'badge-green',
    description: 'Time-sensitive outreach for pre-foreclosure leads.',
    content: `TEXT 1 — Initial:
"Hi [NAME], this is [YOUR NAME]. I help homeowners who are dealing with difficult mortgage situations. I noticed your property at [ADDRESS] and wanted to reach out — I may be able to help. Are you open to a quick chat?"

TEXT 2 — If they respond:
"Thanks for responding. I work with homeowners to find solutions — sometimes I can purchase the property and stop the foreclosure, sometimes there are other options. Everything is confidential. Would a 5-minute call work?"

TEXT 3 — After conversation:
"Thanks for chatting, [NAME]. Just to recap — I can make you a cash offer within 24 hours and we can close before [DEADLINE]. I'll send over the numbers by [DAY]. Hang in there. 💪"`,
  },
  {
    id: 'sms-buyer-deal',
    title: 'Cash Buyer — Deal Alert Text',
    category: 'sms',
    tag: 'badge-green',
    description: 'Quick text blast to your buyer list when you have a new deal.',
    content: `TEXT 1 — Deal Alert:
"🔥 NEW DEAL: [PROPERTY TYPE] in [CITY]. ARV: $[ARV], Price: $[PRICE], Repairs: ~$[REPAIRS]. Great for [flip/rental]. Want details? Reply YES for the full package."

TEXT 2 — Send property details to those who reply:
"Here's the breakdown for [ADDRESS]:
• [X] bed / [X] bath, [SQFT] sqft
• Built [YEAR]
• ARV: $[ARV] (based on [X] comps)
• Repairs: $[REPAIRS]
• Price: $[PRICE]
• Potential profit: $[PROFIT]
• POF required to view. Can you close in [X] days?"

TEXT 3 — Urgency follow-up:
"Hey, just a heads up — I've got [X] other buyers looking at this deal. If you're interested, let me know ASAP so I can hold it for you. First signed contract wins."`,
  },
  {
    id: 'sms-follow-up',
    title: 'General Follow-Up Sequence',
    category: 'sms',
    tag: 'badge-green',
    description: '5-touch text follow-up sequence for leads who went cold.',
    content: `DAY 1: "Hi [NAME], it's [YOUR NAME]. Just wanted to follow up on our conversation about [ADDRESS]. Still interested in exploring your options? Happy to chat whenever works for you."

DAY 4: "Hey [NAME], checking in again. If you have any questions about the process or my offer, I'm here to help. No pressure at all."

DAY 10: "Hi [NAME], I know selling a home is a big decision and these things take time. Just wanted you to know my cash offer still stands. Whenever you're ready, I'm here."

DAY 21: "Hey [NAME], hope you're doing well. Quick question — has anything changed with the property? I'm still buying in your area and would love to help if the timing is right."

DAY 45: "Hi [NAME], it's [YOUR NAME]. Just a friendly check-in. If you ever decide to sell [ADDRESS], I'd love the opportunity to make you a fair cash offer. My number is [YOUR PHONE]. Wishing you the best! 🏡"`,
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

  const isModified = editedContent !== template.content

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
        <div style={{ flex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6, flexWrap: 'wrap' }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
              {template.title}
            </h3>
            <span className={`badge ${template.tag}`}>{CATEGORIES.find(c => c.id === template.category)?.label}</span>
          </div>
          <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>{template.description}</p>
        </div>
        <span style={{ color: '#ff7e5f', fontSize: 12, flexShrink: 0, fontWeight: 600 }}>
          {expanded ? '▲ Close' : '▼ View'}
        </span>
      </div>

      {expanded && (
        <div style={{ marginTop: 16 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <span style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.05em', color: isEditing ? '#ff7e5f' : '#555' }}>
              {isEditing ? 'EDITING — customize below' : 'Click the text below to edit'}
            </span>
            {isModified && (
              <button
                onClick={(e) => { e.stopPropagation(); handleReset() }}
                style={{
                  fontSize: 11, fontWeight: 600, color: '#ff7e5f', background: 'rgba(244,126,95,0.1)',
                  border: '1px solid rgba(244,126,95,0.3)', borderRadius: 6, padding: '3px 10px',
                  cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                }}
              >
                Reset to Original
              </button>
            )}
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
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

export default function MarketingTemplates() {
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
      <h2 className="section-header">Marketing Templates</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
        {TEMPLATES.length} ready-to-use marketing templates for every channel — direct mail, bandit signs, social media, email sequences, and SMS. Copy, customize with your info, and start generating leads today.
      </p>

      <InfoBox type="tip">
        Replace all [BRACKETED] fields with your actual information. The more personalized your message, the higher your response rate. Direct mail typically gets 1-5% response rates; SMS can reach 15-30%.
      </InfoBox>

      <InfoBox type="warn">
        <strong>TCPA Compliance:</strong> Before sending text messages or making calls, ensure you comply with the Telephone Consumer Protection Act (TCPA). You must have prior express consent to send marketing texts. Violations can result in $500-$1,500 per message in penalties. Always include opt-out instructions in automated messages.
      </InfoBox>

      {/* Stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Direct Mail', count: categoryCount('directmail'), icon: Mail, color: '#ff7e5f' },
          { label: 'Bandit Signs', count: categoryCount('bandit'), icon: Image, color: '#ffb347' },
          { label: 'Social Media', count: categoryCount('social'), icon: Globe, color: '#5a9ad6' },
          { label: 'Email', count: categoryCount('email'), icon: Mail, color: '#a855f7' },
          { label: 'SMS/Text', count: categoryCount('sms'), icon: Smartphone, color: '#5cb885' },
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
          placeholder="Search templates..."
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
              `${'='.repeat(50)}\n${t.title.toUpperCase()}\nCategory: ${CATEGORIES.find(c => c.id === t.category)?.label}\n${'='.repeat(50)}\n\n${t.content}\n\n\n`
            ).join('')
            downloadText('All_Marketing_Templates.txt', all)
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

      {/* Marketing tips */}
      <div style={{
        marginTop: 24, padding: 20,
        background: 'rgba(244,126,95,0.04)',
        border: '1px solid rgba(244,126,95,0.15)',
        borderRadius: 10,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 10 }}>
          Marketing Best Practices
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          {[
            { title: 'Consistency Wins', desc: 'Send direct mail every 4-6 weeks to the same list. It takes 5-7 touches before most sellers respond. Don\'t give up after one mailing.' },
            { title: 'Multi-Channel Approach', desc: 'Combine direct mail + text + driving for dollars for highest response rates. Hit the same leads from multiple angles.' },
            { title: 'Track Everything', desc: 'Use unique phone numbers for each marketing channel so you know exactly where your leads are coming from. Measure cost per lead.' },
            { title: 'Follow Up Religiously', desc: 'The fortune is in the follow-up. 80% of deals come from the 5th-12th contact. Use a CRM to automate your sequences.' },
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

      <InfoBox type="note">
        All templates are for educational purposes only. Always ensure your marketing complies with local, state, and federal laws including TCPA, CAN-SPAM, and state-specific real estate marketing regulations.
      </InfoBox>
    </div>
  )
}
