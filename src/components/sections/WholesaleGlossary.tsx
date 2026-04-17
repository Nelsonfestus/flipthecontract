import { useState } from 'react'
import { Search, BookOpen } from 'lucide-react'

const GLOSSARY: { term: string; definition: string; category: string }[] = [
  // Valuation
  { term: 'ARV (After Repair Value)', definition: 'The estimated value of a property after all repairs and renovations are completed. This is the price a property would sell for in its best condition on the open market.', category: 'Valuation' },
  { term: 'Comps (Comparables)', definition: 'Recently sold properties similar to your subject property in size, condition, location, and features. Used to determine fair market value and ARV.', category: 'Valuation' },
  { term: 'Equity', definition: 'The difference between what a property is worth and what is owed on it. Properties with significant equity are prime wholesale targets.', category: 'Valuation' },
  { term: 'MAO (Maximum Allowable Offer)', definition: 'The highest price you should offer for a property. Formula: (ARV × 70%) - Repair Costs - Your Assignment Fee = MAO.', category: 'Valuation' },
  { term: 'NOI (Net Operating Income)', definition: 'Total income from a rental property minus operating expenses (but not mortgage payments). Used to evaluate investment properties. Formula: Gross Income - Operating Expenses = NOI.', category: 'Valuation' },
  { term: 'Rehab Estimate', definition: 'The estimated cost of all repairs and renovations needed to bring a property to full market value. Key component of the 70% rule calculation.', category: 'Valuation' },
  { term: '70% Rule', definition: 'The golden rule of real estate investing: Never pay more than 70% of ARV minus repair costs. Formula: Max Price = (ARV × 0.70) - Repairs. This ensures enough margin for profit.', category: 'Valuation' },
  { term: 'Cap Rate (Capitalization Rate)', definition: 'A metric used to evaluate the profitability of an investment property. Cap Rate = NOI ÷ Current Market Value. A higher cap rate indicates higher potential return (and usually higher risk).', category: 'Valuation' },
  { term: 'BPO (Broker Price Opinion)', definition: 'An estimate of a property\'s value provided by a licensed broker, often used by lenders instead of a full appraisal. Cheaper and faster than a formal appraisal.', category: 'Valuation' },
  { term: 'CMA (Comparative Market Analysis)', definition: 'A detailed analysis of recently sold, pending, and active listings used to estimate a property\'s market value. Typically prepared by a real estate agent or run through MLS.', category: 'Valuation' },
  { term: 'Gross Rent Multiplier (GRM)', definition: 'A quick method to evaluate rental property value: GRM = Property Price ÷ Gross Annual Rent. Lower GRM = better potential return. Used for quick screening, not deep analysis.', category: 'Valuation' },
  { term: 'Assessed Value', definition: 'The value a local tax authority assigns to a property for tax purposes. Often lower than market value. Useful as a data point but should not be your primary valuation tool.', category: 'Valuation' },

  // Contracts
  { term: 'Assignment of Contract', definition: 'Transferring your rights and obligations in a purchase contract to another buyer (your end buyer) for a fee. You never actually take ownership of the property.', category: 'Contracts' },
  { term: 'Assignment Fee', definition: 'The profit a wholesaler makes by assigning their contract to an end buyer. This is the difference between your contracted price with the seller and the price the buyer pays.', category: 'Contracts' },
  { term: 'Daisy Chain', definition: 'When multiple wholesalers assign the same contract from one to another, stacking assignment fees. Generally frowned upon as it inflates the price and can kill deals.', category: 'Contracts' },
  { term: 'Due Diligence Period', definition: 'The timeframe in a purchase contract where the buyer can inspect the property and back out without penalty. Critical for wholesalers to lock up deals while finding buyers.', category: 'Contracts' },
  { term: 'EMD (Earnest Money Deposit)', definition: 'A deposit made to demonstrate serious intent to purchase. In wholesale deals, this is typically $100-$500. It\'s held in escrow and applied toward the purchase price at closing.', category: 'Contracts' },
  { term: 'Purchase & Sale Agreement (PSA)', definition: 'The legal contract between buyer and seller that outlines the terms of the real estate transaction including price, contingencies, and closing date.', category: 'Contracts' },
  { term: 'Subject-To (Sub2)', definition: 'A creative financing strategy where you take ownership of a property "subject to" the existing mortgage remaining in the seller\'s name. The loan stays, but ownership transfers.', category: 'Contracts' },
  { term: 'Under Contract', definition: 'When a seller has accepted your offer and signed a purchase agreement. The property is "locked up" and you can now market it to your buyers list.', category: 'Contracts' },
  { term: 'Wholesale Deal', definition: 'The process of contracting a property at a discount and assigning that contract (or double closing) to an end buyer for a profit, without renovating or holding the property.', category: 'Contracts' },
  { term: 'Contract Assignability', definition: 'The legal right to transfer (assign) your interest in a purchase contract to another party. Ensure your contract includes an assignment clause or use "and/or assigns" after the buyer name.', category: 'Contracts' },
  { term: 'Contingency', definition: 'A condition in a contract that must be met for the deal to close. Common contingencies include financing, inspection, appraisal, and title. Wholesalers often use inspection contingency as an escape clause.', category: 'Contracts' },
  { term: 'Equitable Interest', definition: 'The legal right to a property that arises when you have a signed purchase contract, even before closing. This gives wholesalers the right to market and assign the contract.', category: 'Contracts' },
  { term: 'Addendum', definition: 'A supplemental document attached to the original purchase agreement that modifies or adds to the contract terms. Common addendums include assignment clauses, inspection extensions, and financing terms.', category: 'Contracts' },
  { term: 'Escalation Clause', definition: 'A contract provision that automatically increases your offer by a set amount above any competing offers, up to a maximum cap. Used in competitive situations to secure deals.', category: 'Contracts' },
  { term: 'Option Contract', definition: 'A contract that gives you the right (but not obligation) to purchase a property within a specified time for a specified price. Similar to a purchase agreement but with more flexibility.', category: 'Contracts' },

  // Closing
  { term: 'Double Close (Simultaneous Close)', definition: 'Two separate transactions that happen back-to-back on the same day. You buy from the seller (A-to-B) and immediately sell to your buyer (B-to-C), briefly taking ownership.', category: 'Closing' },
  { term: 'Closing Costs', definition: 'Fees and expenses beyond the property price that buyers and sellers pay to complete a real estate transaction. Includes title insurance, recording fees, transfer taxes, and attorney fees.', category: 'Closing' },
  { term: 'Proof of Funds (POF)', definition: 'Documentation showing you or your buyer has the funds available to complete the purchase. Bank statements, hard money pre-approval letters, or transactional funding commitments.', category: 'Closing' },
  { term: 'Transactional Funding', definition: 'Short-term funding (usually 1-3 days) used specifically for double closings. The lender provides funds for your A-to-B closing, and is repaid from your B-to-C closing proceeds.', category: 'Closing' },
  { term: 'Escrow', definition: 'A neutral third party that holds funds, documents, and coordinates the closing process. The escrow agent ensures all conditions are met before releasing money and transferring title.', category: 'Closing' },
  { term: 'Dry Closing', definition: 'A closing where all documents are signed but funds are not yet disbursed. The transaction is funded and completed at a later date. Less common in wholesale but occurs with certain title companies.', category: 'Closing' },
  { term: 'Settlement Statement (HUD-1 / ALTA)', definition: 'A document that itemizes all credits, debits, fees, and charges for both buyer and seller in a real estate transaction. Review it carefully before every closing.', category: 'Closing' },

  // Title
  { term: 'Chain of Title', definition: 'The history of ownership transfers for a property. A clear chain of title means there are no breaks, disputes, or unresolved claims on the property.', category: 'Title' },
  { term: 'Title Insurance', definition: 'Insurance that protects the buyer and lender from claims against the property\'s ownership. Required for most real estate transactions.', category: 'Title' },
  { term: 'Seasoning', definition: 'The length of time a property must be held before it can be resold or refinanced. Some lenders require 90-day seasoning. Wholesale-friendly title companies have no seasoning requirements.', category: 'Title' },
  { term: 'Clear Title', definition: 'A property title free of any liens, claims, or encumbrances. Required for a clean transfer of ownership at closing.', category: 'Title' },
  { term: 'Lien', definition: 'A legal claim against a property for unpaid debts. Common liens include mortgage liens, tax liens, mechanic\'s liens, and judgment liens. Must typically be satisfied before title transfers.', category: 'Title' },
  { term: 'Title Search', definition: 'A review of public records to confirm the seller\'s legal right to sell the property and identify any liens, encumbrances, or issues that could affect transfer of clean title.', category: 'Title' },
  { term: 'Lis Pendens', definition: 'A public notice that a lawsuit has been filed involving the property. It clouds the title and makes it difficult to sell or finance until the legal matter is resolved.', category: 'Title' },
  { term: 'Quiet Title Action', definition: 'A court proceeding to establish clear ownership of a property and remove any claims or disputes against the title. Common with inherited or abandoned properties.', category: 'Title' },

  // Leads
  { term: 'Motivated Seller', definition: 'A property owner who needs to sell quickly due to financial hardship, divorce, relocation, inherited property, or other urgent circumstances. The foundation of wholesale deals.', category: 'Leads' },
  { term: 'Skip Tracing', definition: 'The process of finding contact information (phone, email, address) for property owners, especially absentee owners or those who are hard to reach.', category: 'Leads' },
  { term: 'Vacant Property', definition: 'A property that is unoccupied. Often indicates a motivated seller and can be found through driving for dollars or vacant property lists.', category: 'Leads' },
  { term: 'Driving for Dollars', definition: 'Physically driving through neighborhoods looking for distressed or vacant properties that could be wholesale opportunities. One of the most effective lead generation methods.', category: 'Leads' },
  { term: 'Absentee Owner', definition: 'A property owner who does not live at the property they own. Often less emotionally attached and more open to a discounted sale, making them prime targets for wholesale outreach.', category: 'Leads' },
  { term: 'Pre-Foreclosure', definition: 'The period between when a homeowner receives a Notice of Default (NOD) and when the property goes to foreclosure auction. Homeowners may be motivated to sell quickly.', category: 'Leads' },
  { term: 'Probate Property', definition: 'A property owned by a deceased person whose estate is being settled through court. Heirs often want to liquidate quickly, creating motivated seller opportunities.', category: 'Leads' },
  { term: 'Distressed Property', definition: 'A property in poor condition, facing foreclosure, or owned by someone in financial difficulty. The bread and butter of wholesale real estate — they sell below market value.', category: 'Leads' },
  { term: 'Cold Calling', definition: 'Directly calling property owners who have not expressed interest in selling. A primary lead generation method in wholesaling. Requires thick skin but generates consistent deals.', category: 'Leads' },
  { term: 'Direct Mail', definition: 'Sending physical letters, postcards, or yellow letters to targeted property owners to generate seller leads. A proven wholesale marketing channel with measurable response rates.', category: 'Leads' },
  { term: 'Yellow Letter', definition: 'A handwritten-style direct mail piece on yellow lined paper with higher open and response rates than printed postcards because it looks personal. A classic wholesale marketing strategy.', category: 'Leads' },
  { term: 'Bandit Sign', definition: 'Small corrugated plastic signs placed at intersections that say "We Buy Houses." An old-school but effective marketing method. Check local ordinances — bandit signs are illegal in many municipalities.', category: 'Leads' },
  { term: 'Tax Delinquent List', definition: 'A list of property owners who are behind on property taxes. These owners are often motivated to sell before the property goes to tax auction. Available from county tax offices.', category: 'Leads' },
  { term: 'Code Violation List', definition: 'A list of properties that have received citations from the city for maintenance or building code violations. Owners with code violations are often motivated to sell to avoid fines.', category: 'Leads' },
  { term: 'High Equity List', definition: 'A list of properties where the owner has significant equity (low mortgage balance relative to property value). High equity sellers can accept discounted offers and still walk away satisfied.', category: 'Leads' },

  // Roles
  { term: 'Bird Dog', definition: 'Someone who locates potential investment properties for a wholesaler or investor in exchange for a referral fee. They don\'t sign contracts — they just find leads.', category: 'Roles' },
  { term: 'Cash Buyer', definition: 'An investor who purchases properties with cash (no mortgage financing). These are typically your end buyers in wholesale deals since they can close quickly.', category: 'Roles' },
  { term: 'JV (Joint Venture)', definition: 'A partnership between two or more investors to complete a deal. Common in wholesaling when one person has the deal and another has the buyer or funding.', category: 'Roles' },
  { term: 'Disposition Manager', definition: 'The person responsible for finding end buyers for wholesale deals. They manage the buyers list, market deals, and negotiate the B-to-C side of transactions.', category: 'Roles' },
  { term: 'Acquisition Manager', definition: 'The person responsible for finding motivated sellers and getting properties under contract. They handle cold calling, appointments, and negotiation with homeowners.', category: 'Roles' },
  { term: 'Transaction Coordinator (TC)', definition: 'A professional who manages the paperwork and timeline between contract and closing. They coordinate with title companies, lenders, and all parties involved.', category: 'Roles' },
  { term: 'Hard Money Lender', definition: 'A private lender who provides short-term, asset-based loans for real estate investments at higher interest rates (8-15%) but closes faster than banks. End buyers often use hard money.', category: 'Roles' },
  { term: 'Virtual Assistant (VA)', definition: 'A remote worker who handles tasks like cold calling, skip tracing, data entry, and lead management. Many wholesalers outsource repetitive tasks to VAs to scale their business.', category: 'Roles' },

  // Marketing
  { term: 'Buyers List', definition: 'A database of cash buyers and investors ready to purchase wholesale deals. Building a strong buyers list is critical — a deal without a buyer is worthless.', category: 'Marketing' },
  { term: 'Deal Analyzer', definition: 'A spreadsheet or software tool used to calculate MAO, repair costs, assignment fee, and end buyer profit on a potential wholesale deal. Essential for making accurate offers.', category: 'Marketing' },
  { term: 'Disposition', definition: 'The process of selling or assigning your wholesale contract to an end buyer. A strong disposition strategy means having a deep buyers list and knowing who wants what deals.', category: 'Marketing' },
  { term: 'Acquisition', definition: 'The process of getting a property under contract from a motivated seller. Involves marketing, lead generation, cold calling, and negotiating with homeowners.', category: 'Marketing' },
  { term: 'PPC (Pay Per Click)', definition: 'Online advertising where you pay each time someone clicks your ad. Google Ads and Facebook Ads are common PPC channels for generating motivated seller leads.', category: 'Marketing' },
  { term: 'SEO (Search Engine Optimization)', definition: 'Optimizing your website to rank higher in Google search results for terms like "sell my house fast." A long-term lead generation strategy for wholesalers.', category: 'Marketing' },

  // Legal & Compliance
  { term: 'RESPA (Real Estate Settlement Procedures Act)', definition: 'Federal law regulating settlement services. Prohibits kickbacks between settlement service providers. Generally does not apply to cash transactions.', category: 'Legal' },
  { term: 'TCPA (Telephone Consumer Protection Act)', definition: 'Federal law regulating phone/text marketing. Always scrub your call list against the National DNC Registry. Violations carry $500-$1,500 per call in penalties.', category: 'Legal' },
  { term: 'Fair Housing Act', definition: 'Federal law prohibiting discrimination in real estate transactions based on race, color, national origin, religion, sex, familial status, or disability.', category: 'Legal' },
  { term: 'Dodd-Frank Act', definition: 'Federal law that limits seller-financing structures. If you use subject-to or wrap mortgages, consult an attorney to ensure compliance with loan originator rules.', category: 'Legal' },
  { term: 'Wholesaling Disclosure', definition: 'Many states require wholesalers to disclose their position (that they are assigning a contract and not the actual owner). Failure to disclose can result in fines or license requirements.', category: 'Legal' },
  { term: 'Power of Attorney (POA)', definition: 'A legal document authorizing someone to act on another\'s behalf in real estate transactions. Sometimes used in probate or absentee owner situations.', category: 'Legal' },
]

const CATEGORIES = ['All', 'Valuation', 'Contracts', 'Closing', 'Title', 'Leads', 'Roles', 'Marketing', 'Legal']

export default function WholesaleGlossary() {
  const [search, setSearch] = useState('')
  const [activeCategory, setActiveCategory] = useState('All')

  const filtered = GLOSSARY.filter(item => {
    const matchesSearch = !search || item.term.toLowerCase().includes(search.toLowerCase()) || item.definition.toLowerCase().includes(search.toLowerCase())
    const matchesCategory = activeCategory === 'All' || item.category === activeCategory
    return matchesSearch && matchesCategory
  }).sort((a, b) => a.term.localeCompare(b.term))

  return (
    <div>
      <h2 className="section-header">Wholesale Glossary</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Every term you need to know in wholesale real estate. Master these and you'll sound like a pro on every call.
      </p>
      <div className="info-tip" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0 }}>
          <strong>Pro Tip:</strong> Knowing the right terminology builds trust with sellers, buyers, and title companies. Study these terms and use them confidently.
        </p>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ flex: '1 1 280px', position: 'relative' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            className="input-dark"
            placeholder="Search terms..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: 34 }}
          />
        </div>
      </div>

      {/* Category pills */}
      <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            style={{
              padding: '6px 14px', borderRadius: 20,
              fontSize: 12, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif",
              border: '1px solid',
              cursor: 'pointer',
              transition: 'all 0.2s',
              background: activeCategory === cat ? 'rgba(244,126,95,0.15)' : 'transparent',
              borderColor: activeCategory === cat ? '#ff7e5f' : '#3d4e65',
              color: activeCategory === cat ? '#ff7e5f' : '#888',
            }}
          >
            {cat}
          </button>
        ))}
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>{filtered.length} terms</div>

      {/* Glossary entries */}
      <div style={{ display: 'grid', gap: 8 }}>
        {filtered.map(item => (
          <div key={item.term} style={{
            background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: '16px 20px',
            transition: 'border-color 0.2s',
          }}
          onMouseEnter={e => e.currentTarget.style.borderColor = '#ff7e5f'}
          onMouseLeave={e => e.currentTarget.style.borderColor = '#3d4e65'}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, marginBottom: 6 }}>
              <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                {item.term}
              </h4>
              <span style={{
                fontSize: 10, fontWeight: 600, padding: '2px 8px', borderRadius: 4,
                background: 'rgba(232,179,71,0.1)', color: '#ffb347', whiteSpace: 'nowrap',
                letterSpacing: '0.05em', textTransform: 'uppercase',
              }}>
                {item.category}
              </span>
            </div>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7, margin: 0 }}>
              {item.definition}
            </p>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <BookOpen size={24} style={{ marginBottom: 8 }} />
          <p>No matching terms found.</p>
        </div>
      )}
    </div>
  )
}
