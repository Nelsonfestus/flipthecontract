import { useState } from 'react'
import { Search, ChevronDown, ChevronUp } from 'lucide-react'

const LAWS = [
  {
    state: 'Alabama',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Standard property disclosure; no specific wholesale statute',
    dos: ['Use a real estate attorney for contract review', 'Disclose your position as a contract holder', 'Use proper assignment language in contracts'],
    donts: ['Don\'t market properties as if you are the owner', 'Don\'t skip getting title insurance', 'Don\'t advertise without equitable interest'],
    notes: 'No specific wholesale regulations. Attorney-closing state — use a closing attorney. Very investor-friendly market.',
  },
  {
    state: 'Alaska',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Property condition disclosure required by seller',
    dos: ['Work with local title companies experienced in assignments', 'Get familiar with remote closing procedures', 'Build relationships with local agents'],
    donts: ['Don\'t assume all title companies handle assignments', 'Don\'t ignore the unique property issues (permafrost, access roads)', 'Don\'t skip due diligence on land boundaries'],
    notes: 'Small market with limited buyers. Remote areas may have title and access challenges. Title insurance is critical.',
  },
  {
    state: 'Arizona',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'SPDS required by seller; wholesaler must disclose equitable interest',
    dos: ['Use the SPDS (Seller\'s Property Disclosure Statement)', 'Disclose equitable interest to all parties', 'Work with wholesale-friendly title companies'],
    donts: ['Don\'t skip the SPDS disclosure', 'Don\'t market property without being under contract', 'Don\'t represent yourself as the property owner'],
    notes: 'One of the most wholesaler-friendly states. No cooling-off period for investment properties. Strong investor market in Phoenix and Tucson.',
  },
  {
    state: 'Arkansas',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Property disclosure required; standard contract terms apply',
    dos: ['Use attorney-reviewed contracts', 'Build relationships with local title companies', 'Disclose your role as assignor'],
    donts: ['Don\'t skip title searches', 'Don\'t ignore local county regulations', 'Don\'t market without equitable interest'],
    notes: 'No specific wholesale laws. Affordable entry point for new wholesalers. Rural markets can have title complications.',
  },
  {
    state: 'California',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Limited',
    doubleClose: 'Yes',
    disclosures: 'Extensive disclosure requirements; TDS, NHD, and more',
    dos: ['Consult a California real estate attorney', 'Use double close strategy when possible', 'Comply with all disclosure requirements (TDS, NHD, etc.)'],
    donts: ['Don\'t assign contracts without understanding AB 1788 restrictions', 'Don\'t market properties aggressively without proper licensing', 'Don\'t skip any disclosures — California has the strictest requirements'],
    notes: 'Most complex state for wholesaling. AB 1788 limits assignment rights in some cases. Heavy regulation and disclosure requirements. Strongly recommend an attorney for every deal.',
  },
  {
    state: 'Colorado',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Division-approved contracts required; equity skimming statute may apply',
    dos: ['Use Division of Real Estate approved contract forms', 'Understand equity skimming laws', 'Disclose your intent to assign'],
    donts: ['Don\'t use custom contracts without attorney approval', 'Don\'t violate equity skimming statutes', 'Don\'t act as an agent without a license'],
    notes: 'Must use Division of Real Estate approved forms. Equity skimming laws require careful structuring. Denver metro is an active wholesale market.',
  },
  {
    state: 'Connecticut',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Residential property condition report required',
    dos: ['Use an attorney for all closings (attorney-closing state)', 'Get proper property condition disclosures', 'Understand municipal lien requirements'],
    donts: ['Don\'t close without an attorney', 'Don\'t ignore municipal lien searches', 'Don\'t market without being under contract first'],
    notes: 'Attorney-closing state. Municipal liens can be problematic. Smaller market but active in Hartford, New Haven, and Bridgeport areas.',
  },
  {
    state: 'Delaware',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller\'s disclosure form required; lead paint for pre-1978 homes',
    dos: ['Work with wholesale-friendly title companies', 'Disclose assignment intent upfront', 'Use proper assignment addendums'],
    donts: ['Don\'t ignore transfer tax implications', 'Don\'t skip lead paint disclosures for older homes', 'Don\'t assume all title companies handle assignments'],
    notes: 'Small state with limited inventory. Transfer taxes apply. Close proximity to PA and MD markets creates cross-border opportunities.',
  },
  {
    state: 'Florida',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Must disclose assignment; new laws require transparency in wholesale transactions',
    dos: ['Disclose your role as a wholesaler to all parties', 'Use the "and/or assigns" clause in contracts', 'Work with investor-friendly title companies', 'Stay updated on new wholesale disclosure laws'],
    donts: ['Don\'t market properties without equitable interest', 'Don\'t hide your assignment fee', 'Don\'t act as a real estate broker without a license', 'Don\'t ignore SB 264 foreign ownership restrictions'],
    notes: 'Active wholesale market. Recent legislation requires more transparency from wholesalers. Assignment fees must be disclosed. One of the highest-volume wholesale states.',
  },
  {
    state: 'Georgia',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'GAR forms include standard disclosures; non-judicial foreclosure state',
    dos: ['Use GAR (Georgia Association of Realtors) approved forms', 'Work with investor-friendly attorneys', 'Leverage the non-judicial foreclosure process for pre-foreclosure leads'],
    donts: ['Don\'t skip title searches — Georgia has complex lien laws', 'Don\'t act as an agent for compensation without a license', 'Don\'t ignore HOA transfer requirements'],
    notes: 'Very investor-friendly. Quick foreclosure timelines and straightforward assignment process. Atlanta metro is one of the top wholesale markets nationally.',
  },
  {
    state: 'Hawaii',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller\'s real property disclosure required; special land lease considerations',
    dos: ['Understand leasehold vs fee simple ownership', 'Work with local attorneys familiar with Hawaiian property law', 'Factor in high closing costs'],
    donts: ['Don\'t assume mainland contract practices apply', 'Don\'t ignore leasehold properties and their unique challenges', 'Don\'t skip local legal consultation'],
    notes: 'Unique market with leasehold properties. High property values but thin wholesale margins. Local knowledge is essential.',
  },
  {
    state: 'Idaho',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller\'s property condition disclosure required',
    dos: ['Disclose your position as assignor', 'Use standard Idaho real estate purchase contracts', 'Build relationships with Boise-area title companies'],
    donts: ['Don\'t market without equitable interest', 'Don\'t skip property condition disclosures', 'Don\'t act as a broker without a license'],
    notes: 'Growing market, especially in Boise metro. No specific wholesale legislation. Standard assignment practices apply.',
  },
  {
    state: 'Illinois',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Residential real property disclosure required; Chicago has additional requirements',
    dos: ['Use an attorney for all closings', 'Understand Chicago-specific regulations', 'Comply with the Illinois Real Estate License Act exemptions'],
    donts: ['Don\'t close without an attorney (attorney-closing state)', 'Don\'t ignore Chicago\'s additional real estate regulations', 'Don\'t market properties without being under contract'],
    notes: 'Attorney-closing state. Chicago is one of the top wholesale markets. Understand the exemptions under the Illinois Real Estate License Act that allow wholesale activity.',
  },
  {
    state: 'Indiana',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller\'s residential real estate disclosure required',
    dos: ['Use standard Indiana Association of Realtors forms', 'Disclose assignment intent', 'Work with title companies experienced in investor transactions'],
    donts: ['Don\'t skip disclosures', 'Don\'t act as an agent without a license', 'Don\'t ignore tax lien implications'],
    notes: 'Very wholesaler-friendly state. Indianapolis is a strong wholesale market with affordable properties and active cash buyers.',
  },
  {
    state: 'Louisiana',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide property disclosure; notary required at closing',
    dos: ['Use a notary for all closings (Louisiana uses notarial system)', 'Understand the Napoleonic Code differences', 'Work with local real estate attorneys'],
    donts: ['Don\'t assume standard common law applies — Louisiana has unique legal traditions', 'Don\'t close without a notary', 'Don\'t skip flood zone research'],
    notes: 'Louisiana uses a unique civil law system (Napoleonic Code). Notarial closings are the norm. Flood zones are a major consideration. New Orleans and Baton Rouge are active markets.',
  },
  {
    state: 'Maryland',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide property condition disclosure; specific wholesale regulations exist',
    dos: ['Comply with HB 1079 wholesale disclosure requirements', 'Work with attorneys experienced in Maryland real estate', 'Disclose assignment fees to all parties'],
    donts: ['Don\'t ignore HB 1079 — it has specific rules for wholesalers', 'Don\'t market without proper disclosures', 'Don\'t act as an agent without a license'],
    notes: 'HB 1079 specifically regulates wholesale transactions. Baltimore is an active wholesale market. Attorney involvement recommended for compliance.',
  },
  {
    state: 'Massachusetts',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Lead paint disclosure required; standard property disclosures apply',
    dos: ['Use an attorney for all closings (attorney-closing state)', 'Comply with lead paint disclosure laws for pre-1978 properties', 'Understand the 93A consumer protection implications'],
    donts: ['Don\'t close without an attorney', 'Don\'t violate consumer protection statutes (Chapter 93A)', 'Don\'t skip lead paint disclosures'],
    notes: 'Attorney-closing state with strong consumer protection laws. Boston area has high prices but active investor community. Lead paint is a major concern with older housing stock.',
  },
  {
    state: 'Michigan',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller\'s Disclosure Statement required; land contract rules apply',
    dos: ['Use proper disclosure statements', 'Explore land contract opportunities', 'Work with title companies experienced in wholesale transactions'],
    donts: ['Don\'t confuse land contracts with assignments', 'Don\'t skip seller disclosure requirements', 'Don\'t ignore tax lien properties without research'],
    notes: 'No attorney required at closing. Land contracts are common and offer flexibility. Detroit is one of the most active wholesale markets for low-cost properties.',
  },
  {
    state: 'Minnesota',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide disclosure statement; special rules for contract for deed',
    dos: ['Disclose your wholesaler position to all parties', 'Understand contract for deed regulations', 'Work with local title companies'],
    donts: ['Don\'t confuse contract for deed with wholesale assignment', 'Don\'t ignore property tax and assessment requirements', 'Don\'t market without equitable interest'],
    notes: 'Wholesaler-friendly state. Minneapolis-St. Paul is an active market. Contract for deed deals have specific regulations — don\'t confuse them with wholesale assignments.',
  },
  {
    state: 'Missouri',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller property condition disclosure required',
    dos: ['Use proper assignment addendums', 'Work with wholesale-friendly title companies', 'Disclose your interest in the property'],
    donts: ['Don\'t skip seller disclosure requirements', 'Don\'t act as an agent without a license', 'Don\'t market without being under contract'],
    notes: 'No specific wholesale legislation. Kansas City and St. Louis are strong wholesale markets. Very investor-friendly state overall.',
  },
  {
    state: 'Nevada',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide disclosure; specific rules for marketing wholesale contracts',
    dos: ['Comply with AB 404 wholesale regulations', 'Disclose assignment fees', 'Work with experienced real estate attorneys'],
    donts: ['Don\'t ignore AB 404 requirements', 'Don\'t market properties without proper disclosures', 'Don\'t represent yourself as the property owner'],
    notes: 'AB 404 introduced specific regulations for wholesalers. Las Vegas is a major wholesale market. Disclosure requirements are strict.',
  },
  {
    state: 'New Jersey',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide property condition disclosure; attorney review period required',
    dos: ['Use an attorney — NJ has a 3-day attorney review period', 'Understand the attorney review process and how it affects assignments', 'Comply with all disclosure requirements'],
    donts: ['Don\'t close without attorney involvement', 'Don\'t ignore the 3-day attorney review period', 'Don\'t market properties until the review period has passed'],
    notes: 'Attorney-closing state with a 3-day attorney review period. Northern NJ (near NYC) is a high-value market. Complex regulations require professional guidance.',
  },
  {
    state: 'New York',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Property condition disclosure or $500 credit; extensive tenant protection laws',
    dos: ['Use an attorney for all transactions', 'Understand the $500 disclosure credit option', 'Be aware of NYC vs upstate differences'],
    donts: ['Don\'t wholesale occupied properties without understanding tenant rights', 'Don\'t close without an attorney', 'Don\'t ignore NYC-specific regulations if operating there'],
    notes: 'Complex regulatory environment. NYC has additional regulations. Attorney-closing state. The $500 disclosure credit is commonly used in lieu of providing a full property condition disclosure.',
  },
  {
    state: 'North Carolina',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Residential property disclosure required; specific rules about marketing interests in real property',
    dos: ['Disclose your position as an assignor clearly', 'Use attorney-reviewed contracts', 'Work with local title companies experienced in assignments'],
    donts: ['Don\'t market property you don\'t own without proper disclosures', 'Don\'t act as a real estate broker without a license', 'Don\'t ignore the NC Real Estate Commission guidelines'],
    notes: 'NC Real Estate Commission has weighed in on wholesale activity. Charlotte and Raleigh-Durham are active wholesale markets. Staying compliant is essential.',
  },
  {
    state: 'Ohio',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Residential property disclosure form required; lead paint for pre-1978 homes',
    dos: ['Use proper Ohio disclosure forms', 'Disclose your wholesaler position', 'Work with title companies that handle investor transactions'],
    donts: ['Don\'t skip the residential property disclosure', 'Don\'t market without equitable interest', 'Don\'t ignore lead paint requirements for older homes'],
    notes: 'Very wholesaler-friendly state. Cleveland, Columbus, and Cincinnati are all active wholesale markets with affordable price points and high cash buyer activity.',
  },
  {
    state: 'Oklahoma',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller property condition disclosure required',
    dos: ['Disclose your interest in the transaction', 'Use standard Oklahoma contracts with assignment clauses', 'Work with local title companies'],
    donts: ['Don\'t skip disclosures', 'Don\'t represent yourself as the property owner', 'Don\'t act as a broker without a license'],
    notes: 'No specific wholesale legislation. Oklahoma City and Tulsa have active investor communities. Affordable market with good wholesale margins.',
  },
  {
    state: 'Oregon',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller property disclosure required; specific rules about acting as a dealer in contracts',
    dos: ['Understand the "dealer" classification and its implications', 'Consult an Oregon real estate attorney', 'Comply with all disclosure requirements'],
    donts: ['Don\'t wholesale repeatedly without understanding the dealer classification', 'Don\'t ignore Portland-area specific regulations', 'Don\'t market without proper disclosures'],
    notes: 'Oregon can classify frequent wholesalers as "dealers" which may trigger licensing requirements. Portland is the primary market. Consult an attorney about deal volume limits.',
  },
  {
    state: 'Pennsylvania',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller property condition disclosure required; Philadelphia has additional regulations',
    dos: ['Use an attorney for closings', 'Understand Philadelphia-specific transfer tax and licensing rules', 'Disclose your position clearly in all marketing'],
    donts: ['Don\'t ignore Philadelphia\'s unique licensing requirements for wholesalers', 'Don\'t skip transfer tax research', 'Don\'t market without equitable interest'],
    notes: 'Philadelphia has introduced specific licensing for wholesalers. Pittsburgh and other PA cities are more straightforward. Understand local rules before operating in Philly.',
  },
  {
    state: 'South Carolina',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller property condition disclosure required; attorney-closing state',
    dos: ['Use an attorney for all closings (attorney-closing state)', 'Disclose your role clearly', 'Work with local real estate attorneys experienced in wholesale transactions'],
    donts: ['Don\'t close without an attorney', 'Don\'t market properties as if you are the owner', 'Don\'t ignore local regulatory guidance'],
    notes: 'Attorney-closing state. Charleston, Columbia, and Greenville are growing markets. Attorney involvement helps ensure compliance.',
  },
  {
    state: 'Tennessee',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide residential property condition disclosure',
    dos: ['Use proper assignment contracts', 'Disclose your position to all parties', 'Work with title companies experienced in investor transactions'],
    donts: ['Don\'t act as a broker without a license', 'Don\'t skip property condition disclosures', 'Don\'t market without equitable interest'],
    notes: 'Wholesaler-friendly state. Nashville and Memphis are top wholesale markets nationally. Memphis in particular has a large volume of investor-priced properties.',
  },
  {
    state: 'Texas',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Must disclose if marketing an interest in real property without license (HB 1228)',
    dos: ['Comply with HB 1228 disclosure requirements', 'Include specific disclosure language on all marketing materials', 'Use TREC (Texas Real Estate Commission) forms where applicable'],
    donts: ['Don\'t skip HB 1228 disclosure language on marketing', 'Don\'t represent yourself as the property owner', 'Don\'t act as a broker without a license'],
    notes: 'HB 1228 requires specific disclosure language on marketing materials. Dallas-Fort Worth, Houston, and San Antonio are among the most active wholesale markets in the country.',
  },
  {
    state: 'Utah',
    licenseRequired: 'No',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller disclosure required; standard contract terms apply',
    dos: ['Use proper assignment language in contracts', 'Disclose your position as contract holder', 'Work with title companies familiar with assignments'],
    donts: ['Don\'t act as a real estate agent without a license', 'Don\'t skip seller disclosures', 'Don\'t market without equitable interest'],
    notes: 'No specific wholesale legislation. Salt Lake City area is an active market. Growing investor community.',
  },
  {
    state: 'Virginia',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller must provide residential property disclosure; specific marketing rules exist',
    dos: ['Comply with Virginia Real Estate Board guidance on wholesaling', 'Disclose your position clearly', 'Use an attorney for complex transactions'],
    donts: ['Don\'t violate marketing restrictions', 'Don\'t act as a broker without proper licensing', 'Don\'t ignore the Virginia Real Estate Board guidelines'],
    notes: 'Virginia Real Estate Board has provided guidance on wholesale activity. Northern Virginia (DC suburbs) has high values; Hampton Roads and Richmond offer better wholesale margins.',
  },
  {
    state: 'Washington',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Seller disclosure required (Form 17); additional environmental disclosures in some areas',
    dos: ['Use Form 17 seller disclosure', 'Understand local environmental and zoning disclosures', 'Work with attorneys familiar with WA wholesale transactions'],
    donts: ['Don\'t skip Form 17 disclosures', 'Don\'t ignore local environmental requirements', 'Don\'t represent yourself as the property owner in marketing'],
    notes: 'Seattle area has high prices and thin margins. Eastern Washington offers more affordable opportunities. Comply with all disclosure requirements — WA takes consumer protection seriously.',
  },
  {
    state: 'Wisconsin',
    licenseRequired: 'Conditional',
    assignmentAllowed: 'Yes',
    doubleClose: 'Yes',
    disclosures: 'Real estate condition report required by seller',
    dos: ['Understand Wisconsin\'s unique licensing interpretations for wholesalers', 'Consult a real estate attorney', 'Use proper assignment documentation'],
    donts: ['Don\'t ignore the Wisconsin Real Estate Examining Board guidance', 'Don\'t wholesale without legal consultation', 'Don\'t skip the real estate condition report'],
    notes: 'Wisconsin Real Estate Examining Board has weighed in on wholesaling. Milwaukee is the primary wholesale market. Legal consultation is strongly recommended.',
  },
]

function StatusPill({ value }: { value: string }) {
  const color =
    value === 'Yes' ? '#5cb885' :
    value === 'No' ? '#e05050' :
    '#c47a1a'
  return (
    <span style={{
      display: 'inline-block',
      padding: '2px 8px',
      borderRadius: 4,
      fontSize: 11,
      fontWeight: 700,
      background: `${color}22`,
      color,
      letterSpacing: '0.04em',
    }}>
      {value}
    </span>
  )
}

export default function StateLaws() {
  const [search, setSearch] = useState('')
  const [expandedState, setExpandedState] = useState<string | null>(null)

  const filtered = LAWS.filter(row =>
    !search || row.state.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="section-header">State Laws & Rules</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Wholesale real estate regulations by state. This is a general overview — laws change and vary by county. Always consult a local real estate attorney.
      </p>

      <div className="info-warn" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#c47a1a', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>WARNING</span>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          This table is for educational reference only. Real estate laws change frequently. Verify current laws with a licensed attorney before executing wholesale transactions.
        </div>
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input
          className="input-dark"
          placeholder="Search by state name..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 34 }}
        />
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
        Showing {filtered.length} of {LAWS.length} states
      </div>

      {/* State cards */}
      <div style={{ display: 'grid', gap: 10 }}>
        {filtered.map(row => {
          const isExpanded = expandedState === row.state
          return (
            <div key={row.state} style={{
              background: '#263040',
              border: '1px solid #3d4e65',
              borderRadius: 10,
              overflow: 'hidden',
              transition: 'border-color 0.2s',
            }}>
              {/* Header row */}
              <button
                onClick={() => setExpandedState(isExpanded ? null : row.state)}
                style={{
                  width: '100%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '14px 18px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  gap: 12,
                  textAlign: 'left',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, flex: 1, flexWrap: 'wrap' }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', minWidth: 120 }}>
                    {row.state}
                  </span>
                  <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 11, color: '#888' }}>License: <StatusPill value={row.licenseRequired} /></span>
                    <span style={{ fontSize: 11, color: '#888' }}>Assignment: <StatusPill value={row.assignmentAllowed} /></span>
                    <span style={{ fontSize: 11, color: '#888' }}>Double Close: <StatusPill value={row.doubleClose} /></span>
                  </div>
                </div>
                {isExpanded ? <ChevronUp size={18} color="#888" /> : <ChevronDown size={18} color="#888" />}
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{ padding: '0 18px 18px', borderTop: '1px solid #2e3a4d' }}>
                  {/* Key Disclosures */}
                  <div style={{ marginTop: 14, marginBottom: 14 }}>
                    <div style={{ fontSize: 12, fontWeight: 700, color: '#ffb347', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>
                      Key Disclosures
                    </div>
                    <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, margin: 0 }}>{row.disclosures}</p>
                  </div>

                  {/* Do's and Don'ts */}
                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
                    <div style={{ background: 'rgba(45,184,133,0.06)', border: '1px solid rgba(45,184,133,0.15)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Do's
                      </div>
                      {row.dos.map((d, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
                          <span style={{ color: '#5cb885', flexShrink: 0 }}>+</span>
                          {d}
                        </div>
                      ))}
                    </div>
                    <div style={{ background: 'rgba(224,80,80,0.06)', border: '1px solid rgba(224,80,80,0.15)', borderRadius: 8, padding: '12px 14px' }}>
                      <div style={{ fontSize: 12, fontWeight: 700, color: '#e05050', letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 8 }}>
                        Don'ts
                      </div>
                      {row.donts.map((d, i) => (
                        <div key={i} style={{ display: 'flex', gap: 6, marginBottom: 4, fontSize: 12, color: '#aaa', lineHeight: 1.5 }}>
                          <span style={{ color: '#e05050', flexShrink: 0 }}>-</span>
                          {d}
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Notes */}
                  <div className="info-note" style={{ marginTop: 0 }}>
                    <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                      {row.notes}
                    </div>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <p>No states found matching "{search}"</p>
        </div>
      )}

      {/* Key Federal & Multi-State Rules */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
          Key Federal & Multi-State Rules
        </h3>
        {[
          { title: 'RESPA (Real Estate Settlement Procedures Act)', desc: 'Regulates settlement services. Prohibits kickbacks between settlement service providers. Generally does not apply to cash transactions but be aware when working with lenders.' },
          { title: 'TCPA (Telephone Consumer Protection Act)', desc: 'Regulates phone/text marketing. Always scrub your call list against the National DNC Registry. Violations carry $500–$1,500 per call in penalties.' },
          { title: 'Dodd-Frank Act', desc: 'Limits seller-financing structures. If you use subject-to or wrap mortgages, consult an attorney to ensure compliance with loan originator rules.' },
          { title: 'Fair Housing Act', desc: 'Prohibits discrimination in real estate transactions. Applies to all buyers and sellers regardless of deal structure.' },
          { title: 'SAFE Act (Secure and Fair Enforcement for Mortgage Licensing)', desc: 'Requires licensing for anyone who originates residential mortgage loans. Relevant if you use subject-to or seller financing strategies.' },
          { title: 'Lead-Based Paint Disclosure (Pre-1978)', desc: 'Federal law requires disclosure of known lead-based paint hazards in residential properties built before 1978. Applies to all sellers and landlords.' },
        ].map(item => (
          <div key={item.title} style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 16, marginBottom: 10 }}>
            <div style={{ fontWeight: 700, color: '#f5f0eb', fontSize: 14, marginBottom: 6 }}>{item.title}</div>
            <div style={{ fontSize: 13, color: '#888', lineHeight: 1.6 }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Universal Do's and Don'ts */}
      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
          Universal Wholesale Do's & Don'ts
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          <div style={{ background: 'rgba(45,184,133,0.06)', border: '1px solid rgba(45,184,133,0.15)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#5cb885', letterSpacing: '0.04em', marginBottom: 12 }}>
              Always Do
            </div>
            {[
              'Have a signed contract before marketing any property',
              'Disclose your position as an assignor / contract holder',
              'Use "and/or assigns" in buyer name field',
              'Consult a local real estate attorney',
              'Build relationships with wholesale-friendly title companies',
              'Keep records of all transactions and communications',
              'Stay updated on your state\'s latest wholesale laws',
              'Get title insurance on every deal',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
                <span style={{ color: '#5cb885', fontWeight: 700, flexShrink: 0 }}>+</span>
                {item}
              </div>
            ))}
          </div>
          <div style={{ background: 'rgba(224,80,80,0.06)', border: '1px solid rgba(224,80,80,0.15)', borderRadius: 10, padding: '18px 20px' }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#e05050', letterSpacing: '0.04em', marginBottom: 12 }}>
              Never Do
            </div>
            {[
              'Market a property you don\'t have under contract',
              'Represent yourself as the property owner',
              'Act as a real estate agent/broker without a license',
              'Hide your assignment fee from parties involved',
              'Use deceptive or misleading marketing practices',
              'Skip disclosure requirements for your state',
              'Ignore TCPA rules when cold calling or texting',
              'Close without proper title search and insurance',
            ].map((item, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, marginBottom: 6, fontSize: 13, color: '#aaa', lineHeight: 1.5 }}>
                <span style={{ color: '#e05050', fontWeight: 700, flexShrink: 0 }}>-</span>
                {item}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}
