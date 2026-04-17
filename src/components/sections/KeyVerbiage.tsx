import { useState } from 'react'
import { Search } from 'lucide-react'

const TERMS = [
  { term: 'ARV (After Repair Value)', def: 'The estimated market value of a property after all renovations are complete. Used to calculate the maximum allowable offer (MAO). ARV is determined by running comparable sales (comps) of similar, recently sold properties in the same neighborhood.' },
  { term: 'Assignment of Contract', def: 'The legal process of transferring your rights and obligations in a purchase agreement to a third-party buyer for a fee. The assignment fee is the profit the wholesaler earns. The original seller closes with the new buyer.' },
  { term: 'Double Close (Simultaneous Close)', def: 'A two-transaction closing where the wholesaler first purchases the property from the seller (A-to-B), then immediately sells it to the end buyer (B-to-C). Both closings happen on the same day, often using transactional funding.' },
  { term: 'MAO (Maximum Allowable Offer)', def: 'The highest price a wholesaler can pay for a property and still make a profit for both themselves and the end buyer. Formula: MAO = (ARV × 70%) − Repairs − Assignment Fee. The 70% rule leaves room for the investor\'s profit and holding costs.' },
  { term: 'Equitable Interest', def: 'The legal right to a property that arises when you have a signed purchase contract, even before closing. This is what gives wholesalers the right to market and assign the contract without technically "owning" the property.' },
  { term: 'Transactional Funding', def: 'Short-term bridge financing (often same-day or 24 hours) used to fund the A-to-B side of a double close. The lender is repaid as soon as the B-to-C close is funded. Typically costs 1–3% of the purchase price.' },
  { term: 'Subject-To', def: 'A creative financing strategy where you take title to a property "subject to" the existing mortgage remaining in place. The seller\'s loan stays in their name; you make the payments. Not traditional wholesaling, but often used on distressed deals.' },
  { term: 'NOI (Net Operating Income)', def: 'For income-producing properties: NOI = Gross Rental Income − Operating Expenses (excluding mortgage). Used to calculate property value using cap rates. Cap Rate = NOI ÷ Property Value.' },
  { term: 'Cap Rate (Capitalization Rate)', def: 'A metric used to evaluate the profitability of an investment property. Cap Rate = NOI ÷ Current Market Value. A higher cap rate indicates higher potential return (and usually higher risk).' },
  { term: 'Earnest Money Deposit (EMD)', def: 'A good-faith deposit made by the buyer when signing a purchase contract. In wholesale deals, wholesalers use minimal EMD ($10–$100 or "receipt of contract") in seller-motivated situations, or $500–$2,000 for competitive deals.' },
  { term: 'Title Search', def: 'A review of public records to confirm the seller\'s legal right to sell the property and identify any liens, encumbrances, judgments, or other issues that could affect the transfer of clean title.' },
  { term: 'Clear Title', def: 'A property title that is free of any liens, claims, or encumbrances. Required for a clean transfer of ownership at closing. Title insurance protects the buyer if title issues are discovered after closing.' },
  { term: 'Probate Property', def: 'A property owned by a deceased person whose estate is being settled through the court (probate process). These properties are often motivated seller opportunities as heirs want to liquidate quickly.' },
  { term: 'Pre-Foreclosure', def: 'The period between when a homeowner receives a Notice of Default (NOD) and when the property goes to foreclosure auction. Homeowners in pre-foreclosure may be motivated to sell to avoid the foreclosure hitting their credit.' },
  { term: 'Cash Buyer / End Buyer', def: 'An investor who purchases wholesale deals with cash or hard money financing. Building a strong cash buyer list is critical to wholesaling success — your buyers list determines what deals you can move.' },
  { term: 'Wholesaling', def: 'A real estate investment strategy where you secure a property under contract below market value and sell/assign that contract to an investor for a fee without ever taking title (in an assignment) or with a brief title transfer (double close).' },
  { term: 'Skip Tracing', def: 'The process of locating a property owner\'s current contact information (phone, email, address) using data aggregation tools. Essential for reaching absentee owners, out-of-state landlords, and vacant property owners.' },
  { term: 'Absentee Owner', def: 'A property owner who does not live at the property they own. Often absentee owners are less emotionally attached to the property and more open to a discounted sale, making them prime targets for wholesale outreach.' },
  { term: 'Daisy Chain', def: 'When multiple wholesalers are involved in the same deal — one wholesaler assigns to another, who assigns to another. This adds layers of assignment fees, reduces the end buyer\'s profit margin, and can kill deals. Avoid daisy chains by working directly with sellers.' },
  { term: 'Disposition', def: 'The process of selling or assigning your wholesale contract to an end buyer. A strong disposition strategy means having a deep buyers list and knowing exactly who wants what type of deal in each market.' },
  { term: 'Acquisition', def: 'The process of getting a property under contract from a motivated seller. The acquisition side involves marketing, lead generation, cold calling, and negotiating with homeowners to sign a purchase agreement.' },
  { term: 'Motivated Seller', def: 'A homeowner who has a compelling reason to sell quickly and/or below market value. Common motivations include: divorce, foreclosure, job relocation, inherited property, tax liens, code violations, or tired landlords.' },
  { term: 'Comps (Comparable Sales)', def: 'Recently sold properties similar to the subject property in size, age, condition, and location. Comps are used to determine ARV. Best comps are within 0.5 miles, sold in the last 90 days, similar sqft (±200), and same bedroom count.' },
  { term: 'Driving for Dollars (D4D)', def: 'A lead generation strategy where you physically drive through neighborhoods looking for distressed, vacant, or poorly maintained properties. You then skip trace the owner and make contact. One of the cheapest and most effective ways to find deals.' },
  { term: 'Buyers List', def: 'A database of cash buyers and investors who are ready to purchase wholesale deals. Building a strong buyers list is the #1 priority for new wholesalers. A deal without a buyer is worthless — always know your exit before locking up a property.' },
  { term: 'EMD (Earnest Money Deposit)', def: 'A good-faith deposit that accompanies a purchase contract. In wholesale, EMDs are typically small ($10–$100 for very motivated sellers, $500–$2,000 for competitive deals). The EMD shows the seller you\'re serious about closing.' },
  { term: 'Yellow Letter', def: 'A handwritten-style direct mail piece sent to property owners on yellow lined paper. Yellow letters have higher open and response rates than printed postcards because they look personal. A classic wholesale marketing strategy.' },
  { term: 'Bandit Sign', def: 'Small corrugated plastic signs placed at intersections that say "We Buy Houses" with a phone number. An old-school but effective marketing method. Check local ordinances — bandit signs are illegal in many municipalities.' },
  { term: 'Proof of Funds (POF)', def: 'A document showing you or your buyer has the cash available to close the deal. Sellers and their agents often request proof of funds before accepting an offer. Transactional funding companies can provide POF letters.' },
  { term: 'Inspection Period (Due Diligence)', def: 'A contractual timeframe where the buyer can inspect the property and cancel the contract without penalty. Wholesalers use the inspection period to market the deal to buyers. Typical periods are 7–14 days but can be negotiated longer.' },
  { term: 'Contingency', def: 'A condition in a contract that must be met for the deal to close. Common contingencies include financing, inspection, appraisal, and title. Wholesalers often include an inspection contingency as their "escape clause" if they can\'t find a buyer.' },
  { term: 'Hard Money Lender', def: 'A private lender who provides short-term, asset-based loans for real estate investments. Interest rates are higher (8–15%) but they close faster than banks. End buyers often use hard money to fund their purchases from wholesalers.' },
  { term: 'Distressed Property', def: 'A property in poor condition, facing foreclosure, or owned by someone in financial difficulty. Distressed properties are the bread and butter of wholesale real estate — they sell below market value and have motivated sellers.' },
  { term: 'Contract Assignability', def: 'The legal right to transfer (assign) your interest in a purchase contract to another party. Not all contracts are assignable — you must ensure your contract includes an assignment clause or use "and/or assigns" after the buyer name.' },
  { term: 'Bird Dog', def: 'A person who finds potential wholesale deals and passes them to a wholesaler for a small finder\'s fee ($500–$2,000). Bird-dogging is a great way to learn the business without taking on the risk of putting properties under contract.' },
  { term: 'Lien', def: 'A legal claim against a property for unpaid debts. Common liens include mortgage liens, tax liens, mechanic\'s liens, and judgment liens. Liens must typically be satisfied before a property can transfer clean title at closing.' },
  { term: 'Title Insurance', def: 'An insurance policy that protects the buyer (and lender) against financial loss from defects in the title. Title insurance covers issues like unknown liens, forged documents, and errors in public records. Required by most lenders.' },
  { term: 'Closing Costs', def: 'Fees and expenses incurred when transferring property ownership. These include title search, title insurance, recording fees, transfer taxes, and attorney fees. In a double close, the wholesaler pays closing costs on both transactions.' },
  { term: 'Vacant Property', def: 'A property that is unoccupied. Vacant properties are prime wholesale targets because they often indicate a motivated or absentee owner. Signs of vacancy include overgrown lawn, mail piling up, boarded windows, and no utilities.' },
  { term: 'Rehab Estimate', def: 'The projected cost to renovate a distressed property to market-ready condition. Accurate rehab estimates are critical for calculating MAO. Walk the property, itemize repairs, and get contractor quotes when possible.' },
  { term: 'Exit Strategy', def: 'Your plan for how you\'ll profit from a deal — assignment, double close, or wholesale to a retail buyer. Always have your exit strategy determined before putting a property under contract. No exit = no deal.' },
  { term: 'Escrow', def: 'A neutral third party that holds funds, documents, and coordinates the closing process. The escrow agent ensures all conditions of the contract are met before releasing funds and recording the deed transfer.' },
  { term: 'Novation Agreement', def: 'A legal agreement where you replace yourself in the original contract with the end buyer. Unlike an assignment, the original contract is canceled and a new one is created between the seller and your buyer. Used when contracts are non-assignable.' },
  { term: 'Wrap Mortgage (Wraparound)', def: 'A creative financing technique where a new mortgage "wraps around" an existing mortgage. The seller\'s existing loan stays in place while the new buyer makes payments on a larger loan amount. Requires careful legal structuring.' },
  { term: 'Net Sheet', def: 'A document showing the seller\'s estimated net proceeds from the sale after all costs are deducted. Creating a net sheet for motivated sellers helps them see the bottom line and make faster decisions.' },
  { term: 'Letter of Intent (LOI)', def: 'A preliminary document expressing a buyer\'s interest in purchasing a property at certain terms. Non-binding but shows serious intent. Used more in commercial wholesale deals.' },
  { term: 'Scope of Work (SOW)', def: 'A detailed breakdown of all repairs and renovations a property needs, including labor and material costs for each item. Essential for accurate MAO calculations and presenting to end buyers.' },
  { term: 'Due-on-Sale Clause', def: 'A provision in most mortgages that allows the lender to demand full repayment of the loan when the property is sold or transferred. Critical to understand when doing subject-to deals.' },
  { term: 'Quitclaim Deed', def: 'A deed that transfers whatever ownership interest the grantor has in a property, with no warranties or guarantees. Common in divorces, family transfers, and clearing title defects. Not recommended for wholesale transactions without title insurance.' },
  { term: 'Memorandum of Agreement', def: 'A recorded document that gives public notice of your equitable interest in a property. Recording a memorandum prevents the seller from selling to someone else while you\'re marketing the deal.' },
  { term: 'Cash-on-Cash Return', def: 'A metric measuring the annual pre-tax cash flow relative to total cash invested. Formula: Annual Cash Flow ÷ Total Cash Invested × 100. Important for your end buyers evaluating rental properties.' },
  { term: 'After-Action Review', def: 'A structured review conducted after every closed deal (or lost deal) to identify what went well, what went wrong, and what to improve. Top wholesalers do this consistently to refine their process.' },
]

export default function KeyVerbiage() {
  const [search, setSearch] = useState('')

  const filtered = TERMS.filter(t =>
    t.term.toLowerCase().includes(search.toLowerCase()) ||
    t.def.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="section-header">Key Verbiage Glossary</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
        Essential wholesale real estate terminology. Know these terms inside-out before your first deal.
      </p>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 24 }}>
        <Search size={16} color="#888" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="input-dark"
          placeholder="Search terms..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
        Showing {filtered.length} of {TERMS.length} terms
      </div>

      <div>
        {filtered.map(item => (
          <div key={item.term} className="glossary-term">
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em' }}>
                {item.term}
              </span>
            </div>
            <p style={{ fontSize: 13.5, color: '#aaa', lineHeight: 1.75, margin: 0 }}>{item.def}</p>
          </div>
        ))}
        {filtered.length === 0 && (
          <div style={{ textAlign: 'center', padding: '40px 0', color: '#555', fontSize: 14 }}>
            No terms found for "{search}"
          </div>
        )}
      </div>
    </div>
  )
}
