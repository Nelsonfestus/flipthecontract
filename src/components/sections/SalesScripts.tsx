import { useState, useEffect, useRef, useCallback } from 'react'
import { ChevronDown, ChevronUp, Phone, Mail, MessageSquare, Copy, Check, Edit3, RotateCcw, Filter } from 'lucide-react'

/* ─── Script Categories ─── */
const CATEGORIES = [
  { id: 'all', label: 'All Scripts' },
  { id: 'seller-cold', label: 'Seller Cold Calls' },
  { id: 'seller-followup', label: 'Seller Follow-Up' },
  { id: 'seller-objection', label: 'Objection Handling' },
  { id: 'seller-discovery', label: 'Motivated Seller' },
  { id: 'buyer-lead', label: 'Buyer Lead Gen' },
  { id: 'buyer-qualify', label: 'Qualifying Buyers' },
  { id: 'buyer-followup', label: 'Buyer Follow-Up' },
  { id: 'assignment', label: 'Assignment/JV' },
  { id: 'nurturing', label: 'Lead Nurturing' },
  { id: 'negotiation', label: 'Negotiation' },
  { id: 'voicemail-text', label: 'Voicemail & Text' },
  { id: 'emergency', label: 'Emergency/Problem' },
] as const

type CategoryId = (typeof CATEGORIES)[number]['id']

type ScriptType = 'phone' | 'email' | 'text'

interface Script {
  id: string
  title: string
  category: CategoryId
  categoryLabel: string
  type: ScriptType
  tag: string
  tip?: string
  script: string
}

const SCRIPTS: Script[] = [
  /* ═══════════════════════════════════════════════
     1️⃣  SELLER COLD CALL SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'cold-call-intro',
    title: 'Cold Call — Introduction & Qualifying',
    category: 'seller-cold',
    categoryLabel: 'Seller Cold Calls',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'Pace yourself. Speak slowly and warmly — you\'re a neighbor, not a telemarketer. Pause after your opening question and let them talk.',
    script: `Hi, is this [OWNER NAME]?

Hi [FIRST NAME], my name is [YOUR NAME], I'm a local real estate investor here in [CITY]. I was reaching out because I noticed you own the property over on [ADDRESS] and I wanted to see if you'd ever consider selling it.

[PAUSE — let them respond]

IF INTERESTED:
"That's great. I buy houses in [CITY] area and I pay cash, close fast — sometimes in as little as 7–10 days, and I cover all closing costs. Would it be okay if I stopped by to take a look at the property so I could put together a fair offer for you?"

IF NOT INTERESTED:
"I totally understand, I appreciate your time. Hey, would it be okay if I kept your number in case things change down the road? You never know."`,
  },
  {
    id: 'cold-call-expired',
    title: 'Cold Call — Expired Listings',
    category: 'seller-cold',
    categoryLabel: 'Seller Cold Calls',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'Expired listing owners are often frustrated. Acknowledge their experience and position yourself as the simple, fast alternative.',
    script: `Hi, is this [OWNER NAME]? My name is [YOUR NAME], and I'm a local investor in [CITY].

I noticed your property at [ADDRESS] was on the market but it looks like the listing expired. I know that can be frustrating — I just wanted to reach out and see if you're still interested in selling.

[Let them respond]

"I totally get it. The market can be tough, especially when a home sits for a while. Here's what makes me different — I buy houses as-is, I pay cash, and I can close in as little as [7–14] days. No agent commissions, no repairs, no open houses.

Would you be open to hearing what I could offer? Even if it's just a backup plan, it never hurts to know your options."`,
  },
  {
    id: 'cold-call-fsbo',
    title: 'Cold Call — For Sale By Owner (FSBO)',
    category: 'seller-cold',
    categoryLabel: 'Seller Cold Calls',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'FSBO owners are typically motivated but want to save on commissions. Respect that and show how you can still help.',
    script: `Hi [OWNER NAME], this is [YOUR NAME]. I saw you have a property for sale at [ADDRESS] — are you still looking for a buyer?

[Let them respond]

"Great. I'm a local real estate investor and I buy properties directly from homeowners — no agents involved on my end either. I pay cash and can close on your timeline.

Can I ask — how long has it been on the market? And what price are you hoping to get?

[Listen and take notes]

"I appreciate you sharing that. Based on what you've told me, I'd love to take a quick look and put together an offer. What does your schedule look like this week?"`,
  },
  {
    id: 'cold-call-absentee',
    title: 'Cold Call — Absentee Owners',
    category: 'seller-cold',
    categoryLabel: 'Seller Cold Calls',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'Absentee owners often don\'t realize how much hassle their property is costing them. Help them see the true cost of holding.',
    script: `Hi, is this [OWNER NAME]? My name is [YOUR NAME], I'm a real estate investor in [CITY].

I see you own a property at [ADDRESS] but it looks like you might not be living there currently. I work with property owners who have homes they may not need anymore and I buy them directly for cash.

[Let them respond]

IF YES / SOMEWHAT INTERESTED:
"Perfect. Can I ask — are you currently renting it out, or is it sitting vacant?

[Listen]

A lot of owners I talk to are dealing with maintenance costs, property taxes, and headaches from a distance. I take all of that off your plate — I buy as-is, cover all closing costs, and can close in [7–14] days.

Would it make sense for me to put together an offer so you can at least see what it's worth to you?"`,
  },
  {
    id: 'cold-call-email',
    title: 'Cold Outreach — Email to Seller',
    category: 'seller-cold',
    categoryLabel: 'Seller Cold Calls',
    type: 'email',
    tag: 'badge-orange',
    tip: 'Keep emails short. Sellers skim — get to the point in the first two sentences.',
    script: `Subject: Quick Question About Your Property at [ADDRESS]

Hi [OWNER NAME],

My name is [YOUR NAME] and I'm a local real estate investor in [CITY]. I came across your property at [ADDRESS] and wanted to reach out to see if you'd ever consider selling.

I buy houses directly from homeowners — no agents, no commissions, no repairs needed. I pay cash and can close on your timeline, sometimes in as little as 7–10 days.

If you're open to it, I'd love to chat for a few minutes to see if we might be a good fit. No pressure at all.

You can reach me at [PHONE] or just reply to this email.

Looking forward to hearing from you,
[YOUR NAME]
[COMPANY NAME]
[PHONE]
[EMAIL]`,
  },

  /* ═══════════════════════════════════════════════
     1️⃣B  SELLER FOLLOW-UP SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'seller-followup-vm',
    title: 'Follow-Up After Voicemail',
    category: 'seller-followup',
    categoryLabel: 'Seller Follow-Up',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'Be warm and casual. You\'re not chasing them — you\'re checking in like a friend would.',
    script: `Hi [OWNER NAME], this is [YOUR NAME] — I left you a voicemail a couple of days ago about your property at [ADDRESS].

I know you're busy, so I'll keep it quick. I'm a local investor and I buy homes for cash, as-is. I just wanted to see if selling is something you'd be open to — even if it's down the road.

No pressure at all. If now's not the right time, I totally understand. But if anything changes, I'd love to be the first call you make.

Can I keep your info on file just in case?`,
  },
  {
    id: 'seller-followup-email',
    title: 'Follow-Up Email After No Response',
    category: 'seller-followup',
    categoryLabel: 'Seller Follow-Up',
    type: 'email',
    tag: 'badge-orange',
    script: `Subject: Following Up — [ADDRESS]

Hi [OWNER NAME],

I reached out a few days ago about your property at [ADDRESS] and wanted to follow up in case my message got buried.

I'm still interested in making you a fair, no-obligation cash offer. There's no cost to you, and you're under no pressure to accept.

If you have 5 minutes for a quick call, I'd love to learn more about your situation and see if I can help.

Best,
[YOUR NAME]
[PHONE]`,
  },
  {
    id: 'seller-followup-text',
    title: 'Follow-Up Text Sequence (Day 3 / 14 / 30)',
    category: 'seller-followup',
    categoryLabel: 'Seller Follow-Up',
    type: 'text',
    tag: 'badge-orange',
    tip: 'Keep texts under 160 characters when possible. Be human, not salesy.',
    script: `[DAY 3 — After initial contact]

"Hi [NAME], this is [YOUR NAME], the investor who called about your property on [ADDRESS]. Just checking in — has anything changed on your end? Still happy to make a cash offer if the timing works better now. No pressure either way. — [YOUR NAME]"

---

[DAY 14 — Second touch]

"Hi [NAME] — [YOUR NAME] again about [ADDRESS]. I know you weren't ready before. We're still buying in your area and I wanted to check back in case anything has changed. Hope all is well."

---

[DAY 30 — Final touch]

"Hey [NAME], long shot but wanted to check one more time on [ADDRESS]. If you ever decide to sell, I'm your guy. Cash, fast close, as-is. Take care. — [YOUR NAME]"`,
  },

  /* ═══════════════════════════════════════════════
     1️⃣C  OBJECTION HANDLING SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'objection-not-ready',
    title: '"I\'m Not Ready to Sell"',
    category: 'seller-objection',
    categoryLabel: 'Objection Handling',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Don\'t push. Plant a seed and position yourself as the go-to when they ARE ready.',
    script: `Seller: "I'm not ready to sell right now."

YOU: "I completely understand, and I appreciate you being upfront about that. Can I ask — what would it take for you to consider selling? Is it a price thing, a timing thing, or something else?

[Let them answer — listen carefully]

YOU: "That makes total sense. Here's what I'd like to do — let me stay in touch with you. Sometimes things change and when you ARE ready, I want to make sure you have someone you trust who can close quickly and hassle-free.

Would it be okay if I checked back in [30/60/90] days?"`,
  },
  {
    id: 'objection-think',
    title: '"I Need to Think About It"',
    category: 'seller-objection',
    categoryLabel: 'Objection Handling',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'This objection usually means they have a specific concern. Your job is to uncover it gently.',
    script: `Seller: "I need to think about it."

YOU: "Absolutely, I want you to feel 100% comfortable with any decision you make. Can I ask — what specifically would you like to think through? Is it the price, the timeline, or maybe you want to talk to someone first?

[Let them answer]

YOU: "I totally get it. Here's what I can tell you — my offer is good for [X] days, so there's no rush. But I did want you to know that we're actively buying in your area right now, and I can close fast if the timing is right for you.

Would it help if I sent you over some information about how the process works so you can review it on your own time?"`,
  },
  {
    id: 'objection-price',
    title: '"I Want Full Market Price"',
    category: 'seller-objection',
    categoryLabel: 'Objection Handling',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Never argue about price. Shift the conversation to value: speed, certainty, convenience.',
    script: `Seller: "Your offer is way too low. I want full market price."

YOU: "I completely understand that feeling, and I appreciate your honesty. Can I ask you — what number were you thinking you needed to get out of it?

[Let them answer]

YOU: "Got it. So the gap between where we are is [X]. Here's my challenge — I'm buying this as-is, meaning I'm taking on all the repairs, the holding costs, the closing costs, and the risk. By the time I factor all that in, the math gets really tight.

But let me ask you this — if the price isn't the biggest thing, what matters most to you about this sale? Is it the timeline? The certainty of closing? Not having to deal with repairs or showings?"

[Focus on their pain point, not price]

YOU: "A lot of sellers I work with say that the certainty of a fast, guaranteed cash close is worth more than waiting 3–6 months on the open market. No showings, no inspections, no buyer financing falling through."`,
  },
  {
    id: 'objection-realtor',
    title: '"I\'ll Just List with a Realtor"',
    category: 'seller-objection',
    categoryLabel: 'Objection Handling',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Never badmouth agents. Acknowledge the option, then highlight what you offer that agents can\'t.',
    script: `Seller: "I think I'll just list it with a Realtor."

YOU: "That's totally a valid option, and sometimes it's the right move. Can I ask — have you talked to any agents yet about what price they think you'd get?

[If no] "Here's just something to keep in mind — when you list, you're typically looking at 3–6% in agent commissions, plus buyers will request repairs after inspections, and there's no guarantee it closes. The average sale takes 45–90 days.

What I offer is: no commissions, no repairs, no open houses, and a certain close. For some sellers that's worth more than squeezing every last dollar. Would it make sense to at least get my offer as a backup before you decide?"`,
  },
  {
    id: 'objection-spouse',
    title: '"I Need to Talk to My Spouse"',
    category: 'seller-objection',
    categoryLabel: 'Objection Handling',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'This is a real and valid concern. Facilitate the conversation — don\'t try to bypass the spouse.',
    script: `Seller: "I need to talk to my husband/wife first."

YOU: "Of course — that's a big decision and you should absolutely discuss it together. Would it be helpful if I put together a simple one-page summary of my offer that you could share with them? That way they have all the details.

Also — would it make sense for all three of us to hop on a quick call together? I'm happy to answer any questions either of you might have. Sometimes it's easier when everyone hears the same info at the same time.

What works best for your schedule?"`,
  },

  /* ═══════════════════════════════════════════════
     1️⃣D  MOTIVATED SELLER DISCOVERY
     ═══════════════════════════════════════════════ */
  {
    id: 'discovery-motivation',
    title: 'Uncovering Seller Motivation',
    category: 'seller-discovery',
    categoryLabel: 'Motivated Seller Discovery',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Ask open-ended questions and listen more than you talk. The seller\'s pain point IS your leverage — but use it ethically.',
    script: `[After initial rapport — transition to discovery questions]

"I really appreciate you taking the time to chat. So I can better understand your situation, do you mind if I ask you a few quick questions?

1. What's motivating your sale? What's going on that made you consider selling?

2. How soon do you need to sell? Is there a specific timeline?

3. What happens if you don't sell soon? Will it create problems or is it just something you're exploring?

4. Is anyone else living in the property right now? Any tenants?

5. What kind of condition is the property in? Any major repairs needed?

6. What do you think the property is worth? Have you had any appraisals?

7. Is there a mortgage on it? About how much do you owe?

8. Have you talked to any other investors or agents about selling?"

[LISTEN carefully to answers — take notes on their emotional triggers and timeline pressure]`,
  },
  {
    id: 'discovery-inherited',
    title: 'Inherited Property Discovery',
    category: 'seller-discovery',
    categoryLabel: 'Motivated Seller Discovery',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Be sensitive. Someone passed away. Lead with empathy, not deal-making.',
    script: `"First, I'm sorry for your loss. I know this can be a really difficult time.

I work with a lot of families who inherit properties and aren't sure what to do with them. Can I ask you a few questions to see if I might be able to help?

1. How long ago did you inherit the property?

2. Is the probate process complete, or is that still in progress?

3. Is anyone currently living in the property?

4. Are you paying property taxes and insurance on it right now?

5. What's the overall condition — is it move-in ready or does it need work?

6. Have you thought about whether you want to keep it, rent it, or sell it?

I ask because a lot of heirs end up spending thousands on a property they don't really want — between taxes, insurance, maintenance, and utilities, it adds up fast. I can take all of that off your plate with a cash offer, and we can close whenever you're ready."`,
  },
  {
    id: 'discovery-financial',
    title: 'Financial Distress Discovery',
    category: 'seller-discovery',
    categoryLabel: 'Motivated Seller Discovery',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Never make the seller feel judged. Normalize their situation — "I work with homeowners in this situation all the time."',
    script: `"I work with homeowners in all kinds of situations — job changes, medical bills, divorce, or just needing a fresh start. There's no judgment here at all. Let me ask you a few questions so I can figure out the best way to help.

1. What's going on with the property right now? Are you current on payments?

2. Have you received any notices from the bank — like a notice of default or foreclosure?

3. How much do you owe on the mortgage, roughly?

4. How quickly do you need to sell? Is there a deadline?

5. If we could get this handled in the next [7–14] days, would that relieve some of the pressure?

I've helped a lot of homeowners avoid foreclosure and walk away with cash in hand. The key is acting quickly. Let me take a look at the numbers and see what I can put together for you."`,
  },

  /* ═══════════════════════════════════════════════
     2️⃣  BUYER SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'buyer-cold-call',
    title: 'Cash Buyer — Cold Call',
    category: 'buyer-lead',
    categoryLabel: 'Buyer Lead Gen',
    type: 'phone',
    tag: 'badge-green',
    tip: 'Investors are busy. Be direct, lead with the deal, and respect their time.',
    script: `"Hey [BUYER NAME], it's [YOUR NAME] — I'm a local wholesaler in [CITY]. I'm building my buyers list and wanted to connect with active investors in the area.

Are you currently buying properties in [CITY/COUNTY]?

[If yes]

"Great. I typically source off-market deals at [X]% below market value. When I have something that fits your criteria, I'd love to send it over first before I blast it to my full list.

Quick questions so I can match you with the right deals:
1. What areas are you buying in?
2. What's your price range?
3. Do you prefer fix-and-flips, rentals, or both?
4. How quickly can you typically close?
5. Best way to send you deals — email, text, or both?"`,
  },
  {
    id: 'buyer-email-outreach',
    title: 'Cash Buyer — Email Outreach',
    category: 'buyer-lead',
    categoryLabel: 'Buyer Lead Gen',
    type: 'email',
    tag: 'badge-green',
    script: `Subject: Off-Market Deal in [CITY] — [PROPERTY TYPE]

Hi [BUYER NAME],

I'm [YOUR NAME], a local wholesaler in [CITY]. I specialize in sourcing off-market investment properties at below-market prices.

I'm reaching out because I'm building my VIP buyers list and want to connect with serious investors who are actively buying.

Here's what I bring to the table:
• Off-market deals at 20–40% below ARV
• Full property details, comps, and repair estimates
• Fast assignment process — you can close in 7–14 days
• First access before I send to my broader list

If you're interested, just reply with your buying criteria:
1. Target areas
2. Price range
3. Property types (SFR, multi, commercial)
4. Fix-and-flip or buy-and-hold

I'll keep you at the top of my list.

Best,
[YOUR NAME]
[PHONE]
[EMAIL]`,
  },
  {
    id: 'buyer-text-outreach',
    title: 'Cash Buyer — Text Outreach',
    category: 'buyer-lead',
    categoryLabel: 'Buyer Lead Gen',
    type: 'text',
    tag: 'badge-green',
    script: `[Initial outreach text]

"Hey [BUYER NAME], this is [YOUR NAME] — local wholesaler in [CITY]. I've got off-market deals coming in regularly. Are you actively buying? If so, reply with your criteria and I'll add you to my VIP list."

---

[Follow-up with a specific deal]

"Hey [BUYER NAME], I've got a new deal: [PROPERTY TYPE] in [NEIGHBORHOOD]. ARV: $[X], asking $[WHOLESALE PRICE], est. repairs $[X]. Want the full breakdown? Reply YES."`,
  },

  {
    id: 'buyer-qualify',
    title: 'Qualifying a Cash Buyer',
    category: 'buyer-qualify',
    categoryLabel: 'Qualifying Buyers',
    type: 'phone',
    tag: 'badge-green',
    tip: 'Qualify early to avoid wasting time. Not every "investor" can actually close. Ask for proof of funds before locking in a deal.',
    script: `"Thanks for your interest in this property. Before I send over the full details, I just want to make sure we're a good fit. Do you mind if I ask a few quick questions?

1. How many properties have you purchased in the last 12 months?

2. What's your typical price range?

3. Do you buy with cash, hard money, or conventional financing?

4. What areas are you focused on?

5. Are you looking for fix-and-flips, buy-and-hold rentals, or both?

6. How fast can you typically close once you decide on a property?

7. Do you have proof of funds available? (bank statement, HML approval letter)

8. What's the best way to reach you when I have a deal — call, text, or email?

Perfect. I'm going to add you to my priority list. When something matches your criteria, you'll be the first to know."`,
  },

  {
    id: 'buyer-followup-property',
    title: 'Buyer Follow-Up — After Sending Property Info',
    category: 'buyer-followup',
    categoryLabel: 'Buyer Follow-Up',
    type: 'phone',
    tag: 'badge-green',
    tip: 'Follow up within 24 hours. Deals move fast — if they\'re not responsive, move to the next buyer.',
    script: `"Hey [BUYER NAME], it's [YOUR NAME]. I sent over the details on that [PROPERTY TYPE] at [ADDRESS] yesterday — did you get a chance to look it over?

[If yes] "What did you think? Any questions on the numbers?"

[If no] "No worries. Quick summary: ARV is $[X], I'm asking $[WHOLESALE PRICE], and estimated repairs are about $[X]. Your potential spread is $[X]. I've got a few other buyers looking at it, so I wanted to give you first shot. Can you take a look today?"

[If they pass] "Totally understand. What criteria would make a deal a slam-dunk for you? I want to make sure the next one I send is exactly what you're looking for."`,
  },
  {
    id: 'buyer-followup-missed',
    title: 'Buyer Follow-Up — Missed Call / No Response',
    category: 'buyer-followup',
    categoryLabel: 'Buyer Follow-Up',
    type: 'text',
    tag: 'badge-green',
    script: `[Text after missed call]

"Hey [BUYER NAME], [YOUR NAME] here. Tried calling about an off-market deal in [AREA]. It's moving fast. Let me know if you want the details — I'll send them right over."

---

[Text after no response — 2 days later]

"Hi [BUYER NAME], just following up on the [PROPERTY TYPE] in [AREA]. Still available but won't last. Want me to send the full packet?"

---

[Re-engagement for future deals]

"Hey [BUYER NAME], it's [YOUR NAME]. Haven't connected in a while. Are you still buying in [AREA]? I've got new inventory coming in this week."`,
  },

  /* ═══════════════════════════════════════════════
     3️⃣  ASSIGNMENT / JV SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'assignment-pitch',
    title: 'Assignment Offer — Pitching to a Buyer',
    category: 'assignment',
    categoryLabel: 'Assignment / JV',
    type: 'phone',
    tag: 'badge-blue',
    tip: 'Be transparent about the assignment. Professional buyers expect it — don\'t try to hide the fee.',
    script: `"Hey [BUYER NAME], it's [YOUR NAME]. I've got a property under contract that I think would be a great fit for you. Let me give you the quick breakdown:

Property: [ADDRESS]
Type: [SFR / Multi / etc.]
ARV: $[X]
Contract Price: $[CONTRACT PRICE]
Assignment Fee: $[ASSIGNMENT FEE]
Your Total: $[CONTRACT PRICE + ASSIGNMENT FEE]
Estimated Repairs: $[X]
Your Potential Profit: $[X]

I've done the comps, pulled the repair estimates, and I can get you the full packet within the hour. The seller has agreed to close in [X] days.

Are you interested in taking a closer look? I can set up a walkthrough as soon as [DATE]."

[If they negotiate the fee]

"I hear you. Here's what I can do — if you can close within [X] days with no contingencies, I can bring the fee down to $[ADJUSTED FEE]. That's my best number. Does that work?"`,
  },
  {
    id: 'assignment-negotiate',
    title: 'Assignment Fee Negotiation',
    category: 'assignment',
    categoryLabel: 'Assignment / JV',
    type: 'phone',
    tag: 'badge-blue',
    tip: 'Know your floor number before the call. Never negotiate against yourself — let the buyer counter first.',
    script: `Buyer: "Your assignment fee is too high."

YOU: "I appreciate the feedback. Let me walk through the numbers with you so you can see why it's priced where it is.

The ARV on this is $[X], and you're all-in at $[TOTAL]. After repairs of $[X] and holding costs, your projected profit is $[PROFIT]. That's a [X]% return on your investment.

But I hear you — what number would make this a no-brainer for you?

[Let them respond]

I can't go below $[FLOOR], but if you can close in [X] days with proof of funds by [DATE], I can meet you at $[ADJUSTED]. That's my best and final. Deal?"`,
  },
  {
    id: 'jv-partner-pitch',
    title: 'JV Partner — Deal Split Pitch',
    category: 'assignment',
    categoryLabel: 'Assignment / JV',
    type: 'phone',
    tag: 'badge-blue',
    tip: 'Be crystal clear about who does what. JV disputes happen when roles aren\'t defined upfront.',
    script: `"Hey [PARTNER NAME], it's [YOUR NAME]. I've got a deal I'd like to JV on with you. Here's the situation:

I've got a property under contract at [ADDRESS] for $[CONTRACT PRICE]. ARV is $[X], repairs are about $[X]. The spread is approximately $[TOTAL PROFIT].

Here's what I'm proposing:
— I bring: the contract, the seller relationship, and the deal analysis
— You bring: the buyer, the dispo, and/or the closing funds
— Profit split: [50/50] or [YOUR SPLIT / THEIR SPLIT]

Everything goes through a title company, so it's clean and transparent. We can put the JV agreement in writing before we move forward.

What do you think? Want to see the numbers?"

[If they want a different split]

"I'm open to discussing it. What split did you have in mind, and what are you bringing to the table? Let's make sure it's fair for both of us and work from there."`,
  },
  {
    id: 'jv-agreement-close',
    title: 'JV — Clarifying Roles & Closing',
    category: 'assignment',
    categoryLabel: 'Assignment / JV',
    type: 'phone',
    tag: 'badge-blue',
    script: `"Before we finalize, let's make sure we're on the same page with everything:

1. Deal: [ADDRESS] — under contract at $[CONTRACT PRICE]
2. Your role: [Dispo / Funding / Both]
3. My role: [Acquisition / Analysis / Seller management]
4. Profit split: [X/X]
5. Timeline: close by [DATE]
6. Title company: [COMPANY NAME]

I'll draft up a simple JV agreement that covers:
— Each party's responsibilities
— How the profit is calculated and distributed
— What happens if the deal falls through
— Dispute resolution

I'll send it over for your review within [24 hours]. Once we both sign, we're locked in. Sound good?"`,
  },

  /* ═══════════════════════════════════════════════
     4️⃣  LEAD NURTURING SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'nurture-text-drip-seller',
    title: 'Seller Text/Email Drip Campaign',
    category: 'nurturing',
    categoryLabel: 'Lead Nurturing',
    type: 'text',
    tag: 'badge-purple',
    tip: 'Drip campaigns work over time. Be patient — some sellers take 6–12 months to convert.',
    script: `[WEEK 1 — Value message]
"Hi [NAME], it's [YOUR NAME]. Just wanted to share — home values in [AREA] have been shifting lately. If you ever want to know what your property at [ADDRESS] might be worth, I'm happy to pull some numbers for you. No strings attached."

---

[WEEK 3 — Check-in]
"Hi [NAME], [YOUR NAME] here. Hope you're doing well. Just checking in — any changes with the property at [ADDRESS]? I'm still buying in your area if the timing ever works out."

---

[WEEK 6 — Social proof]
"Hey [NAME], just closed on a property in [NEARBY NEIGHBORHOOD] this week. If you ever decide to sell [ADDRESS], I'd love to make you an offer. Cash, fast, as-is. — [YOUR NAME]"

---

[WEEK 10 — Direct ask]
"Hi [NAME], it's been a while since we connected. I wanted to reach out one more time about [ADDRESS]. Are you still holding onto it, or would you be open to hearing a cash offer? Either way, no pressure. — [YOUR NAME]"`,
  },
  {
    id: 'nurture-cold-lead-call',
    title: 'Cold Lead Re-Engagement Call',
    category: 'nurturing',
    categoryLabel: 'Lead Nurturing',
    type: 'phone',
    tag: 'badge-purple',
    script: `"Hi [NAME], this is [YOUR NAME] — we spoke a while back about your property at [ADDRESS]. You mentioned the timing wasn't right back then, and I totally respected that.

I'm just calling to check in and see if anything has changed on your end. Are you still holding onto the property, or has your situation shifted at all?

[Let them respond]

[If still not ready] "No problem at all. I'll keep you on my list and check in again down the road. If anything changes before then, you've got my number."

[If somewhat interested] "Great, let me ask a few updated questions so I can put together a current offer for you..."`,
  },
  {
    id: 'nurture-buyer-reengagement',
    title: 'Buyer Re-Engagement — Didn\'t Close First Deal',
    category: 'nurturing',
    categoryLabel: 'Lead Nurturing',
    type: 'phone',
    tag: 'badge-purple',
    script: `"Hey [BUYER NAME], it's [YOUR NAME]. I know the last deal at [ADDRESS] didn't work out, and I appreciate you taking the time to look at it.

I wanted to reach out because I've got some new inventory coming in this week that might be a better fit. Can I ask — what was the main reason the last one didn't work for you?

[Listen — was it price, location, condition, timing?]

Got it. I'll keep that in mind. I want to make sure the next deal I bring you is exactly what you're looking for. Are you still actively buying?"`,
  },

  /* ═══════════════════════════════════════════════
     5️⃣  NEGOTIATION SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'negotiate-lowball-buyer',
    title: 'Handling Lowball Offers from Buyers',
    category: 'negotiation',
    categoryLabel: 'Negotiation',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Stay calm and professional. A lowball offer is still an offer — it means they\'re interested.',
    script: `Buyer: "I'll take it for $[LOWBALL AMOUNT]."

YOU: "I appreciate the offer. Let me walk you through the numbers real quick so you can see why it's priced where it is.

ARV: $[X]
Repairs: $[X]
My price: $[WHOLESALE PRICE]
Your all-in: $[TOTAL]
Projected profit: $[PROFIT] — that's a [X]% return

At $[LOWBALL], the math just doesn't work on my end. I've got other buyers in the pipeline looking at this one.

What I CAN do is [small concession — e.g., 'come down $2K' or 'give you an extra week to close']. Would that work?"`,
  },
  {
    id: 'negotiate-counteroffer-seller',
    title: 'Responding to Seller Counteroffers',
    category: 'negotiation',
    categoryLabel: 'Negotiation',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Always acknowledge their counter respectfully. Then redirect to the value YOU bring.',
    script: `Seller: "I appreciate your offer, but I need $[COUNTER AMOUNT]."

YOU: "Thank you for coming back to me on that. I want to make this work for both of us.

At $[COUNTER], here's where I'd be after repairs and closing costs: [break down numbers briefly]. The margin gets really thin for me at that price.

Here's what I can do — I can come up to $[YOUR MAX], and I'll guarantee a close in [X] days with zero cost to you. No commissions, no repair requests, no inspections, no financing contingencies.

The certainty of this close is worth a lot. What do you think — can we meet there?"`,
  },
  {
    id: 'negotiate-multi-offer',
    title: 'Multi-Offer Scenario — Creating Urgency',
    category: 'negotiation',
    categoryLabel: 'Negotiation',
    type: 'phone',
    tag: 'badge-gold',
    tip: 'Only use this if it\'s TRUE. Never fabricate competition — it destroys trust.',
    script: `[When you have multiple buyers interested]

"Hey [BUYER NAME], I wanted to give you a heads up — I've got [X] other buyers who've expressed interest in this property. I'm not trying to pressure you, I just want to be transparent.

Here's where things stand:
— Current asking: $[WHOLESALE PRICE]
— Other offers: I've received [verbal interest / signed offers] from [X] buyers
— Timeline: I'm making a decision by [DATE/TIME]

If you're serious about this one, I'd recommend getting me your best offer by [DEADLINE]. I'm looking for the highest price with the fastest close and fewest contingencies.

What are you thinking?"`,
  },

  /* ═══════════════════════════════════════════════
     6️⃣  VOICEMAIL & TEXT QUICK TEMPLATES
     ═══════════════════════════════════════════════ */
  {
    id: 'vm-seller-short',
    title: 'Seller Voicemail — Short & Sweet',
    category: 'voicemail-text',
    categoryLabel: 'Voicemail & Text',
    type: 'phone',
    tag: 'badge-orange',
    tip: 'Keep voicemails under 30 seconds. Smile while you talk — it changes your tone.',
    script: `"Hi [OWNER NAME], this is [YOUR NAME]. I saw your property at [ADDRESS] and wanted to see if you're interested in selling. I buy houses for cash, close fast, and I cover all closing costs.

If you're open to chatting, give me a call back at [PHONE NUMBER]. Again, that's [REPEAT NUMBER].

Thanks, and have a great day!"`,
  },
  {
    id: 'vm-buyer-short',
    title: 'Buyer Voicemail — Deal Alert',
    category: 'voicemail-text',
    categoryLabel: 'Voicemail & Text',
    type: 'phone',
    tag: 'badge-green',
    script: `"Hey [BUYER NAME], it's [YOUR NAME]. I've got a hot deal in [AREA] — [PROPERTY TYPE], ARV around $[X], priced at $[WHOLESALE PRICE]. It's moving fast.

Call me back at [PHONE NUMBER] if you want the details. I'll hold it for you until [TIME/DATE]. Talk soon!"`,
  },
  {
    id: 'text-seller-quick',
    title: 'Seller Text — Quick Intro',
    category: 'voicemail-text',
    categoryLabel: 'Voicemail & Text',
    type: 'text',
    tag: 'badge-orange',
    script: `"Hi [NAME], I help homeowners sell properties quickly for cash. Are you open to an offer for [ADDRESS]? Reply YES or NO. — [YOUR NAME]"

---

[If they reply YES]

"Thanks [NAME]! I'd love to learn more. What's the best time for a quick 5-minute call? I just need to ask a few questions to put together a fair offer."

---

[If they reply NO]

"No problem at all! If anything changes down the road, feel free to text me. Wishing you the best. — [YOUR NAME]"`,
  },
  {
    id: 'text-buyer-deal-blast',
    title: 'Buyer Text — Deal Blast',
    category: 'voicemail-text',
    categoryLabel: 'Voicemail & Text',
    type: 'text',
    tag: 'badge-green',
    script: `"🏠 NEW DEAL ALERT
[PROPERTY TYPE] in [NEIGHBORHOOD]
ARV: $[X] | Price: $[WHOLESALE PRICE]
Repairs: ~$[X] | Spread: $[X]+
Cash buyers only. First come, first served.
Reply INTERESTED for full packet.
— [YOUR NAME]"`,
  },

  /* ═══════════════════════════════════════════════
     7️⃣  EMERGENCY / PROBLEM SCRIPTS
     ═══════════════════════════════════════════════ */
  {
    id: 'emergency-seller-backs-out',
    title: 'Seller Backs Out — Re-Engagement',
    category: 'emergency',
    categoryLabel: 'Emergency / Problem',
    type: 'phone',
    tag: 'badge-red',
    tip: 'Stay calm and empathetic. Find out the real reason — it\'s usually fear, not a better offer.',
    script: `"Hi [SELLER NAME], this is [YOUR NAME]. I got your message about wanting to cancel. I completely understand — selling your home is a big decision.

Before we do anything, can I ask what changed? Was it something about the price, the timeline, or did something else come up?

[Listen carefully]

[If cold feet]
"That's totally normal. A lot of sellers I work with feel the same way right before closing. Here's what I can tell you — we've already done all the hard work. The title is clear, the paperwork is ready, and you're [X] days away from having $[AMOUNT] in your hands with zero stress.

What if we pushed the closing back [X] days to give you some breathing room? Would that help?"

[If better offer]
"I respect that. Can I ask what the other offer looks like? I'd like the chance to match or improve my offer before you decide. At the end of the day, I want you to get the best deal."`,
  },
  {
    id: 'emergency-buyer-cant-close',
    title: 'Buyer Can\'t Close — Backup Plan',
    category: 'emergency',
    categoryLabel: 'Emergency / Problem',
    type: 'phone',
    tag: 'badge-red',
    tip: 'Always have 2–3 backup buyers ready. The moment a buyer shows signs of cold feet, activate your backup list.',
    script: `[Step 1: Call the buyer]

"Hey [BUYER NAME], I understand things came up. Can you tell me exactly what happened? Is it a funding issue, or did something change about the deal?

[If funding fell through]
"Got it. Can you close if I give you [X] more days? Or do we need to part ways on this one?"

[If they can't close at all]

[Step 2: Activate backup buyers]

"Hey [BACKUP BUYER], it's [YOUR NAME]. I've got a deal that just opened back up — [ADDRESS] in [AREA]. ARV: $[X], price: $[WHOLESALE PRICE]. The original buyer's financing fell through.

This is available RIGHT NOW, first come first served. Can you close in [X] days? I need proof of funds by [DATE] to lock this in."

[Step 3: Communicate with seller]

"Hi [SELLER NAME], just a quick update — we had a minor hiccup with our original buyer but I've already got a backup in place. Everything is still on track for a close by [NEW DATE]. I'll keep you posted."`,
  },
  {
    id: 'emergency-contingency',
    title: 'Contingency Handling — Extension Request',
    category: 'emergency',
    categoryLabel: 'Emergency / Problem',
    type: 'phone',
    tag: 'badge-red',
    script: `[Requesting an extension from the seller]

"Hi [SELLER NAME], this is [YOUR NAME]. I wanted to give you an update on the closing.

Everything is moving forward, but [reason — title issue, buyer needs extra time, survey delay, etc.]. I need to request a [X]-day extension to make sure everything closes smoothly.

I know that's not ideal, and I apologize for the delay. Here's what I can offer in return:
— Increase my earnest money deposit by $[X] as a show of good faith
— Lock in the original price with no changes
— Provide a firm, no-excuses close date of [NEW DATE]

Would you be open to signing a simple addendum? I'll have it drafted and sent to you today."

[If seller pushes back]

"I completely understand your frustration. Let me be transparent — the deal is solid, the funds are ready, and this is just a [minor procedural issue]. If we walk away now, we both lose. Give me [X] days and I guarantee this closes."`,
  },
]

/* ─── Helpers ─── */

const TYPE_ICON: Record<ScriptType, typeof Phone> = { phone: Phone, email: Mail, text: MessageSquare }
const TYPE_LABEL: Record<ScriptType, string> = { phone: 'Phone', email: 'Email', text: 'Text' }

// Extract all [PLACEHOLDER] patterns
const PLACEHOLDER_RE = /\[([A-Z][A-Z0-9 /&'—.]+)\]/g

function getPlaceholders(text: string): string[] {
  const set = new Set<string>()
  let m: RegExpExecArray | null
  while ((m = PLACEHOLDER_RE.exec(text)) !== null) {
    // Skip instructional placeholders
    const val = m[1]
    if (!val.startsWith('IF ') && !val.startsWith('PAUSE') && !val.startsWith('LET ') && !val.startsWith('LISTEN') && !val.startsWith('STEP ') && val !== 'YES' && val !== 'NO') {
      set.add(m[0]) // full match including brackets
    }
  }
  return Array.from(set)
}

function applyReplacements(text: string, replacements: Record<string, string>): string {
  let result = text
  for (const [placeholder, value] of Object.entries(replacements)) {
    if (value.trim()) {
      result = result.split(placeholder).join(value)
    }
  }
  return result
}

// Persist user replacements across sessions
function loadGlobalDefaults(): Record<string, string> {
  try {
    const raw = localStorage.getItem('ftc-script-defaults')
    return raw ? JSON.parse(raw) : {}
  } catch { return {} }
}
function saveGlobalDefaults(defaults: Record<string, string>) {
  try { localStorage.setItem('ftc-script-defaults', JSON.stringify(defaults)) } catch {}
}

/* ─── Script Card Component ─── */
function ScriptCard({ s, globalDefaults, onDefaultChange }: {
  s: Script
  globalDefaults: Record<string, string>
  onDefaultChange: (key: string, value: string) => void
}) {
  const [open, setOpen] = useState(false)
  const [editing, setEditing] = useState(false)
  const [localReplacements, setLocalReplacements] = useState<Record<string, string>>({})
  const [copied, setCopied] = useState(false)
  const [isEditingContent, setIsEditingContent] = useState(false)
  const [editedContent, setEditedContent] = useState<string | null>(null)
  const placeholders = getPlaceholders(s.script)
  const TypeIcon = TYPE_ICON[s.type]

  // Merge global defaults with local overrides
  const mergedReplacements = { ...globalDefaults, ...localReplacements }
  const filledScript = applyReplacements(s.script, mergedReplacements)

  // Use edited content if available, otherwise use the filled script
  const displayContent = editedContent !== null ? editedContent : filledScript
  const contentModified = editedContent !== null && editedContent !== filledScript

  function handleCopy() {
    navigator.clipboard.writeText(displayContent).then(() => {
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    })
  }

  function handleReset() {
    setLocalReplacements({})
    setEditing(false)
  }

  function handleFieldChange(placeholder: string, value: string) {
    setLocalReplacements(prev => ({ ...prev, [placeholder]: value }))
    // Also update global defaults for common fields
    const commonFields = ['[YOUR NAME]', '[PHONE]', '[PHONE NUMBER]', '[EMAIL]', '[COMPANY NAME]', '[CITY]']
    if (commonFields.includes(placeholder)) {
      onDefaultChange(placeholder, value)
    }
  }

  return (
    <div className="resource-card" style={{ borderRadius: 10, marginBottom: 10, overflow: 'hidden' }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          width: '100%', background: 'none', border: 'none', cursor: 'pointer',
          padding: '14px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          gap: 8, textAlign: 'left',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap', flex: 1, minWidth: 0 }}>
          <TypeIcon size={14} color="#888" style={{ flexShrink: 0 }} />
          <span style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(15px, 3.5vw, 18px)',
            color: '#ff7e5f', letterSpacing: '0.04em',
            overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {s.title}
          </span>
          <span className={`badge ${s.tag}`} style={{ fontSize: 10, flexShrink: 0 }}>{TYPE_LABEL[s.type]}</span>
        </div>
        {open ? <ChevronUp size={16} color="#888" style={{ flexShrink: 0 }} /> : <ChevronDown size={16} color="#888" style={{ flexShrink: 0 }} />}
      </button>

      {open && (
        <div style={{ padding: '0 16px 16px' }}>
          {/* Tip */}
          {s.tip && (
            <div className="info-tip" style={{ marginBottom: 12, padding: '10px 14px' }}>
              <span style={{ fontSize: 10, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em', display: 'block', marginBottom: 2 }}>PRO TIP</span>
              <div style={{ fontSize: 12, color: '#ccc', lineHeight: 1.5 }}>{s.tip}</div>
            </div>
          )}

          {/* Action buttons */}
          <div style={{ display: 'flex', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <button
              onClick={() => setEditing(!editing)}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', fontSize: 12, fontWeight: 600,
                background: editing ? 'rgba(244,126,95,0.15)' : 'rgba(255,255,255,0.04)',
                border: editing ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                borderRadius: 6, cursor: 'pointer',
                color: editing ? '#ff7e5f' : '#888',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
            >
              <Edit3 size={12} /> {editing ? 'Done Editing' : 'Edit Fields'}
            </button>
            <button
              onClick={handleCopy}
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '7px 14px', fontSize: 12, fontWeight: 600,
                background: copied ? 'rgba(45,184,133,0.15)' : 'rgba(255,255,255,0.04)',
                border: copied ? '1px solid #5cb885' : '1px solid #3d4e65',
                borderRadius: 6, cursor: 'pointer',
                color: copied ? '#5cb885' : '#888',
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
            >
              {copied ? <><Check size={12} /> Copied!</> : <><Copy size={12} /> Copy</>}
            </button>
            {Object.keys(localReplacements).length > 0 && (
              <button
                onClick={handleReset}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '7px 14px', fontSize: 12, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                  borderRadius: 6, cursor: 'pointer', color: '#888',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                <RotateCcw size={12} /> Reset
              </button>
            )}
          </div>

          {/* Editable fields */}
          {editing && placeholders.length > 0 && (
            <div style={{
              background: 'rgba(244,126,95,0.04)',
              border: '1px solid rgba(244,126,95,0.2)',
              borderRadius: 8,
              padding: '14px',
              marginBottom: 12,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#ff7e5f', letterSpacing: '0.05em', marginBottom: 10, textTransform: 'uppercase' }}>
                Fill in Your Details
              </div>
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))',
                gap: 8,
              }}>
                {placeholders.map(ph => {
                  const label = ph.slice(1, -1) // Remove brackets
                  return (
                    <div key={ph}>
                      <label style={{ fontSize: 11, color: '#888', display: 'block', marginBottom: 3, fontFamily: "'DM Sans', sans-serif" }}>
                        {label}
                      </label>
                      <input
                        type="text"
                        placeholder={label}
                        value={mergedReplacements[ph] || ''}
                        onChange={e => handleFieldChange(ph, e.target.value)}
                        style={{
                          width: '100%',
                          padding: '8px 12px',
                          fontSize: 13,
                          background: '#12161c',
                          border: '1px solid #3d4e65',
                          borderRadius: 6,
                          color: '#f5f0eb',
                          fontFamily: "'DM Sans', sans-serif",
                          outline: 'none',
                          boxSizing: 'border-box',
                          transition: 'border-color 0.2s',
                        }}
                        onFocus={e => e.target.style.borderColor = '#ff7e5f'}
                        onBlur={e => e.target.style.borderColor = '#3d4e65'}
                      />
                    </div>
                  )
                })}
              </div>
              <p style={{ fontSize: 11, color: '#666', marginTop: 8, marginBottom: 0, lineHeight: 1.5 }}>
                Common fields (Your Name, Phone, Email, City, Company) auto-fill across all scripts.
              </p>
            </div>
          )}

          {/* Editable hint label */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
            <span style={{
              fontSize: 11,
              fontWeight: 700,
              letterSpacing: '0.04em',
              color: isEditingContent ? '#ff7e5f' : '#666',
              textTransform: 'uppercase',
            }}>
              {isEditingContent ? 'EDITING — customize below' : 'Click the text below to edit'}
            </span>
            {contentModified && (
              <button
                onClick={() => { setEditedContent(null); setIsEditingContent(false); }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '4px 10px', fontSize: 11, fontWeight: 600,
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                  borderRadius: 6, cursor: 'pointer', color: '#888',
                  fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
              >
                <RotateCcw size={10} /> Reset to Original
              </button>
            )}
          </div>

          {/* Script content */}
          <textarea
            value={displayContent}
            onChange={e => setEditedContent(e.target.value)}
            onFocus={() => {
              setIsEditingContent(true)
              if (editedContent === null) setEditedContent(filledScript)
            }}
            onBlur={() => setIsEditingContent(false)}
            style={{
              width: '100%', boxSizing: 'border-box',
              whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              fontSize: 13, lineHeight: 1.7, color: '#ccc',
              background: isEditingContent ? '#111' : '#1a2030',
              border: isEditingContent ? '1px solid #ff7e5f' : '1px solid #2e3a4d',
              borderRadius: 8, padding: 16,
              minHeight: 300, maxHeight: 500, overflowY: 'auto',
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical',
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          />
        </div>
      )}
    </div>
  )
}

/* ─── Main Component ─── */
export default function SalesScripts() {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all')
  const [globalDefaults, setGlobalDefaults] = useState<Record<string, string>>(() => loadGlobalDefaults())
  const [showFilters, setShowFilters] = useState(false)
  const scrollRef = useRef<HTMLDivElement>(null)

  // Save defaults when they change
  useEffect(() => {
    saveGlobalDefaults(globalDefaults)
  }, [globalDefaults])

  const handleDefaultChange = useCallback((key: string, value: string) => {
    setGlobalDefaults(prev => ({ ...prev, [key]: value }))
  }, [])

  const filtered = activeCategory === 'all'
    ? SCRIPTS
    : SCRIPTS.filter(s => s.category === activeCategory)

  const categoryCount = (id: CategoryId) =>
    id === 'all' ? SCRIPTS.length : SCRIPTS.filter(s => s.category === id).length

  return (
    <div>
      <h2 className="section-header">Sales Scripts</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
        {SCRIPTS.length} battle-tested wholesale scripts for every stage of the deal — cold calling, objection handling, buyer outreach, assignments, negotiation, and more. Click any card to expand, then edit and copy.
      </p>

      {/* Quick stats */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {[
          { label: 'Phone Scripts', count: SCRIPTS.filter(s => s.type === 'phone').length, icon: Phone, color: '#ff7e5f' },
          { label: 'Email Templates', count: SCRIPTS.filter(s => s.type === 'email').length, icon: Mail, color: '#5a9ad6' },
          { label: 'Text Templates', count: SCRIPTS.filter(s => s.type === 'text').length, icon: MessageSquare, color: '#5cb885' },
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

      <div className="info-tip" style={{ marginBottom: 16 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>HOW TO USE</span>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          Click <strong>Edit Fields</strong> to fill in your name, phone number, and property details. Common fields auto-fill across all scripts. Click <strong>Copy</strong> to copy the personalized script to your clipboard. Practice reading each script aloud 10x before your first call.
        </div>
      </div>

      {/* Category filter */}
      <div style={{ marginBottom: 20 }}>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '8px 16px', fontSize: 13, fontWeight: 600,
            background: showFilters ? 'rgba(244,126,95,0.1)' : 'rgba(255,255,255,0.04)',
            border: showFilters ? '1px solid #ff7e5f' : '1px solid #3d4e65',
            borderRadius: 8, cursor: 'pointer',
            color: showFilters ? '#ff7e5f' : '#888',
            fontFamily: "'DM Sans', sans-serif",
            marginBottom: showFilters ? 10 : 0,
            transition: 'all 0.2s',
          }}
        >
          <Filter size={14} /> Filter by Category
          {activeCategory !== 'all' && (
            <span style={{
              background: '#ff7e5f', color: '#000', fontSize: 10,
              fontWeight: 700, borderRadius: 10, padding: '2px 7px', marginLeft: 4,
            }}>
              {categoryCount(activeCategory)}
            </span>
          )}
        </button>

        {showFilters && (
          <div ref={scrollRef} style={{
            display: 'flex', gap: 6, flexWrap: 'wrap',
          }}>
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
        )}
      </div>

      {/* Category header for filtered view */}
      {activeCategory !== 'all' && (
        <div style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          marginBottom: 12, flexWrap: 'wrap', gap: 8,
        }}>
          <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
            {CATEGORIES.find(c => c.id === activeCategory)?.label}
          </span>
          <button
            onClick={() => setActiveCategory('all')}
            style={{
              fontSize: 12, color: '#ff7e5f', background: 'none', border: 'none',
              cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", textDecoration: 'underline',
            }}
          >
            Show All Scripts
          </button>
        </div>
      )}

      {/* Script cards */}
      {filtered.map(s => (
        <ScriptCard
          key={s.id}
          s={s}
          globalDefaults={globalDefaults}
          onDefaultChange={handleDefaultChange}
        />
      ))}

      {/* Pro tips footer */}
      <div style={{
        marginTop: 24,
        padding: 20,
        background: 'rgba(244,126,95,0.04)',
        border: '1px solid rgba(244,126,95,0.15)',
        borderRadius: 10,
      }}>
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 10 }}>
          Pro Tips for Script Success
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 12 }}>
          {[
            { title: 'Tone & Pacing', desc: 'Speak slowly and clearly. Smile while you talk — it changes your tone. Pause after questions to let the other person think.' },
            { title: 'Personalize Everything', desc: 'These scripts are starting points. Adapt them to your voice and market. The more natural you sound, the better your results.' },
            { title: 'Practice Makes Perfect', desc: 'Read each script aloud 10 times before using it on a real call. Role-play with a partner if possible.' },
            { title: 'Track Your Results', desc: 'Note which scripts and variations get the best responses. Over time, you\'ll build a custom playbook that\'s uniquely yours.' },
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
    </div>
  )
}
