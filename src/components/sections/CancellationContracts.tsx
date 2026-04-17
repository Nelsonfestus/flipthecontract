import { useState } from 'react'
import { Download, FileText, MapPin, AlertTriangle, Printer } from 'lucide-react'

const WHOLESALE_STATES = [
  { abbr: 'AL', name: 'Alabama', notes: 'Very wholesale friendly. No specific regulations on assignments.' },
  { abbr: 'AK', name: 'Alaska', notes: 'Assignment allowed. Small market with limited buyers.' },
  { abbr: 'AZ', name: 'Arizona', notes: 'No license required for assignments. Double close friendly.' },
  { abbr: 'AR', name: 'Arkansas', notes: 'Assignment friendly. Standard wholesale practices accepted.' },
  { abbr: 'CA', name: 'California', notes: 'Strict disclosure requirements. Must comply with equity purchase laws.' },
  { abbr: 'CO', name: 'Colorado', notes: 'Assignment allowed. Must disclose assignment to seller in some cases.' },
  { abbr: 'CT', name: 'Connecticut', notes: 'Attorney-closing state. Assignment allowed with proper disclosure.' },
  { abbr: 'DE', name: 'Delaware', notes: 'Small but investor-friendly market. No specific wholesale legislation.' },
  { abbr: 'DC', name: 'District of Columbia', notes: 'Assignment allowed. Strict tenant protections apply.' },
  { abbr: 'FL', name: 'Florida', notes: 'Assignment allowed. Assignment fees must be disclosed per recent legislation.' },
  { abbr: 'GA', name: 'Georgia', notes: 'Assignment of contract is legal. No specific wholesaling license.' },
  { abbr: 'HI', name: 'Hawaii', notes: 'Assignment legal. Unique land tenure (leasehold vs fee simple) affects deals.' },
  { abbr: 'ID', name: 'Idaho', notes: 'No specific wholesale legislation. Standard assignment practices apply.' },
  { abbr: 'IL', name: 'Illinois', notes: 'Attorney-closing state. Understand IL Real Estate License Act exemptions.' },
  { abbr: 'IN', name: 'Indiana', notes: 'Very wholesale friendly. Assignment and double close both common.' },
  { abbr: 'IA', name: 'Iowa', notes: 'No specific wholesale regulations. Assignment contracts are standard.' },
  { abbr: 'KS', name: 'Kansas', notes: 'Wholesale friendly. Assignment contracts widely accepted.' },
  { abbr: 'KY', name: 'Kentucky', notes: 'No license required for wholesale assignment of contracts.' },
  { abbr: 'LA', name: 'Louisiana', notes: 'Uses Napoleonic Code civil law. Notarial closings are standard.' },
  { abbr: 'ME', name: 'Maine', notes: 'Small wholesale market. Attorney involvement recommended.' },
  { abbr: 'MD', name: 'Maryland', notes: 'HB 1079 regulates wholesale transactions. Attorney recommended.' },
  { abbr: 'MA', name: 'Massachusetts', notes: 'Attorney-closing state. Strict consumer protection laws.' },
  { abbr: 'MI', name: 'Michigan', notes: 'Assignment of contract is legal and commonly practiced.' },
  { abbr: 'MN', name: 'Minnesota', notes: 'Wholesale friendly. Contract for deed deals have specific regulations.' },
  { abbr: 'MS', name: 'Mississippi', notes: 'Wholesale friendly. Few restrictions on contract assignments.' },
  { abbr: 'MO', name: 'Missouri', notes: 'Wholesale friendly. No special license for contract assignments.' },
  { abbr: 'MT', name: 'Montana', notes: 'Small rural market. Standard assignment practices apply.' },
  { abbr: 'NE', name: 'Nebraska', notes: 'No specific wholesale laws. Very investor-friendly.' },
  { abbr: 'NV', name: 'Nevada', notes: 'AB 404 requires specific disclosures for wholesalers.' },
  { abbr: 'NH', name: 'New Hampshire', notes: 'No state income tax. Assignment allowed with standard practices.' },
  { abbr: 'NJ', name: 'New Jersey', notes: 'Attorney-closing state. High property taxes affect deal analysis.' },
  { abbr: 'NM', name: 'New Mexico', notes: 'No specific wholesale legislation. Growing investor community.' },
  { abbr: 'NY', name: 'New York', notes: 'Attorney-closing state. Strict regulations — use local attorney.' },
  { abbr: 'NC', name: 'North Carolina', notes: 'Assignment allowed with proper contract language.' },
  { abbr: 'ND', name: 'North Dakota', notes: 'Very small market. Low property values and limited buyer pool.' },
  { abbr: 'OH', name: 'Ohio', notes: 'Wholesale friendly. Assignment contracts widely accepted.' },
  { abbr: 'OK', name: 'Oklahoma', notes: 'Assignment of contracts is legal and regularly practiced.' },
  { abbr: 'OR', name: 'Oregon', notes: 'Assignment contracts accepted with disclosure. Strict landlord-tenant laws.' },
  { abbr: 'PA', name: 'Pennsylvania', notes: 'Philadelphia requires wholesale licensing. Pittsburgh is more straightforward.' },
  { abbr: 'RI', name: 'Rhode Island', notes: 'Small but active market. Attorney involvement recommended.' },
  { abbr: 'SC', name: 'South Carolina', notes: 'Attorney-closing state. Assignment contracts commonly used.' },
  { abbr: 'SD', name: 'South Dakota', notes: 'Very small market. No specific wholesale legislation.' },
  { abbr: 'TN', name: 'Tennessee', notes: 'No license required. One of the top wholesale markets nationally.' },
  { abbr: 'TX', name: 'Texas', notes: 'HB 1228 requires specific disclosure language. Top wholesale market.' },
  { abbr: 'UT', name: 'Utah', notes: 'No specific wholesale legislation. Growing investor community.' },
  { abbr: 'VT', name: 'Vermont', notes: 'Very small market. Seasonal market considerations.' },
  { abbr: 'VA', name: 'Virginia', notes: 'VA Real Estate Board has provided guidance on wholesale activity.' },
  { abbr: 'WA', name: 'Washington', notes: 'Recent legislation increased disclosure requirements.' },
  { abbr: 'WV', name: 'West Virginia', notes: 'Very affordable properties. Low competition for wholesalers.' },
  { abbr: 'WI', name: 'Wisconsin', notes: 'Assignment of contracts is legal with proper documentation.' },
  { abbr: 'WY', name: 'Wyoming', notes: 'Smallest wholesale market. No state income tax.' },
]

function generateCancellationContract(state: string): string {
  return `CANCELLATION / TERMINATION OF PURCHASE AND SALE AGREEMENT

STATE OF ${state.toUpperCase()}

This Cancellation and Mutual Release Agreement ("Agreement") is entered into as of the date signed below by the undersigned parties.

PARTIES:
Seller: _______________________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

Buyer/Assignee: ______________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

PROPERTY:
Address: _____________________________________________
City: _________________ State: ${state} Zip: ___________
County: ______________________________________________
Legal Description: ____________________________________
APN/Parcel #: ________________________________________

RECITALS:
WHEREAS, the parties entered into a Purchase and Sale Agreement ("Original Agreement") dated _____________, 20_____ for the above-referenced property;

WHEREAS, an Earnest Money Deposit ("EMD") in the amount of $__________ was deposited with __________________________________ (Title Company/Escrow Agent);

WHEREAS, both parties mutually agree to cancel and terminate the Original Agreement under the terms set forth herein;

NOW, THEREFORE, in consideration of the mutual agreements contained herein, the parties agree as follows:

1. TERMINATION
The Original Agreement dated _____________ is hereby cancelled, terminated, and rendered null and void effective as of the date of this Agreement. All rights, obligations, and duties of the parties under the Original Agreement shall cease immediately.

2. EARNEST MONEY DEPOSIT DISPOSITION
The Earnest Money Deposit in the amount of $__________ currently held by __________________________________ shall be:
   [ ] Returned in full to Buyer/Assignee
   [ ] Released in full to Seller
   [ ] Split as follows: $__________ to Buyer/Assignee and $__________ to Seller
   [ ] Applied as follows: ________________________________________

The parties hereby authorize and direct the escrow/title company to disburse the EMD in accordance with the selection above. Both parties agree to execute any additional documents required by the escrow/title company to effectuate this disbursement.

If the parties cannot agree on EMD disposition, the escrow/title company shall hold the funds pending: (a) mutual written instructions signed by both parties; (b) a court order; or (c) binding arbitration. Neither party shall make demand upon the escrow/title company without first providing written notice and a 10-business-day cure period to the other party.

3. MUTUAL RELEASE OF CLAIMS
Each party hereby fully and unconditionally releases and forever discharges the other party, and their respective heirs, successors, assigns, agents, attorneys, and affiliates, from any and all claims, demands, actions, causes of action, obligations, damages, costs, expenses, and liabilities of any kind, whether known or unknown, arising out of or related to the Original Agreement or the Property.

4. NO FURTHER OBLIGATIONS
Neither party shall have any further obligations, duties, or liability to the other under the Original Agreement after the effective date of this Cancellation Agreement.

5. RETURN OF DOCUMENTS AND PROPERTY
Each party shall promptly return to the other any documents, keys, access codes, or property of the other party received in connection with the Original Agreement.

6. NO ADMISSION OF LIABILITY
This Agreement is entered into for the purpose of resolving and settling any potential disputes. Nothing herein shall be construed as an admission of liability, fault, or wrongdoing by either party.

7. CONFIDENTIALITY
The parties agree to keep the terms of this Cancellation Agreement and the circumstances of the cancellation confidential, except as required by law.

8. GOVERNING LAW
This Agreement shall be governed by and construed in accordance with the laws of the State of ${state}.

9. ENTIRE AGREEMENT
This Cancellation Agreement constitutes the entire agreement between the parties regarding the termination of the Original Agreement and supersedes any prior oral or written agreements related to such termination.

10. COUNTERPARTS
This Agreement may be executed in counterparts, each of which shall be deemed an original. Electronic signatures shall be considered valid and binding.

IN WITNESS WHEREOF, the parties have executed this Agreement as of the date(s) set forth below.

SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

BUYER/ASSIGNEE:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

WITNESS (if required by state law):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

NOTARY ACKNOWLEDGMENT (if applicable):

State of ${state}
County of _________________________

On this _____ day of _____________, 20_____, before me personally appeared the above-named individuals, known to me (or proved to me on the basis of satisfactory evidence) to be the persons who executed the foregoing instrument, and acknowledged that they executed the same as their free act and deed.

Notary Public: _______________________________________
My Commission Expires: _______________________________
[Seal]

---
This document is provided for educational purposes only. Consult a licensed attorney in your state before executing.
© 2026 Flip the Contract. All rights reserved.`
}

function generateAddendum(state: string): string {
  return `ADDENDUM TO PURCHASE AND SALE AGREEMENT

STATE OF ${state.toUpperCase()}

This Addendum ("Addendum") is made and attached to the Purchase and Sale Agreement ("Agreement") dated _____________, 20_____ between the following parties:

PARTIES:
Seller: _______________________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

Buyer/Assignee: ______________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

PROPERTY:
Address: _____________________________________________
City: _________________ State: ${state} Zip: ___________
County: ______________________________________________

The parties agree to modify the Agreement as follows:

1. MODIFICATION OF TERMS
   Check all that apply:
   [ ] Purchase Price Change: The purchase price is hereby
       changed from $__________ to $__________.
       Reason: ________________________________________
   [ ] Closing Date Extension: The closing date is hereby
       extended from _____________ to _____________, 20_____.
       Reason: ________________________________________
   [ ] Inspection Period Extension: The inspection period
       is extended by _____ additional calendar days,
       new expiration: _____________, 20_____.
   [ ] Earnest Money Increase: Additional earnest money of
       $__________ to be deposited by _____________, 20_____
       with ____________________________________________.
   [ ] Earnest Money Reduction/Change: EMD is hereby
       changed from $__________ to $__________.
   [ ] Assignment Clause: Buyer reserves the right to
       assign this contract to a third party prior to
       closing. Assignment fee disclosure:
       [ ] Required [ ] Not required per state law
   [ ] Contingency Addition: ___________________________
       ________________________________________________
   [ ] Contingency Removal: The following contingency
       is hereby waived: _____________________________
   [ ] Repair Credit: Seller shall provide a repair credit
       of $__________ at closing in lieu of repairs.
   [ ] Seller Concessions: Seller agrees to pay up to
       $__________ toward Buyer's closing costs.
   [ ] Other: __________________________________________
       ________________________________________________

2. ADDITIONAL TERMS AND CONDITIONS
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________
_______________________________________________

3. WHOLESALE ASSIGNMENT DISCLOSURE (if applicable)
Buyer/Assignee may assign their interest in this Agreement to a third-party buyer. The assignment fee, if any, shall be:
   [ ] Disclosed to Seller: $__________
   [ ] Not required to be disclosed per state law
   [ ] Paid separately at closing through title company
   [ ] Included in the purchase price paid by Assignee

4. TIMELINE
This Addendum shall be executed by both parties on or before _____________, 20_____. If not executed by this date, this Addendum shall be null and void.

5. CONFLICT
In the event of any conflict between this Addendum and the original Agreement, the terms of this Addendum shall prevail and control.

6. RATIFICATION
Except as expressly modified herein, all other terms and conditions of the Agreement remain unchanged and in full force and effect. Both parties ratify and confirm the Agreement as modified by this Addendum.

7. GOVERNING LAW
This Addendum shall be governed by the laws of the State of ${state}.

8. COUNTERPARTS
This Addendum may be executed in counterparts, each of which shall be deemed an original. Electronic signatures shall be considered valid and binding.

IN WITNESS WHEREOF, the parties have executed this Addendum as of the date(s) below.

SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

BUYER/ASSIGNEE:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

---
This document is provided for educational purposes only. Consult a licensed attorney in your state before executing.
© 2026 Flip the Contract. All rights reserved.`
}

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

export default function CancellationContracts() {
  const [selectedState, setSelectedState] = useState('')
  const [previewType, setPreviewType] = useState<'cancellation' | 'addendum' | null>(null)
  const [editedContent, setEditedContent] = useState('')
  const [isEditing, setIsEditing] = useState(false)

  const currentState = WHOLESALE_STATES.find(s => s.abbr === selectedState)

  const originalContent = currentState && previewType
    ? previewType === 'cancellation'
      ? generateCancellationContract(currentState.name)
      : generateAddendum(currentState.name)
    : ''

  return (
    <div>
      <h2 className="section-header">Cancellation Contracts & Addendums</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Downloadable cancellation contracts and addendums for each wholesale-friendly state. Always have your exit strategy ready.
      </p>
      <div className="info-warn" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#d4a574', margin: 0 }}>
          <AlertTriangle size={14} style={{ display: 'inline', verticalAlign: '-2px', marginRight: 4 }} />
          <strong>Legal Disclaimer:</strong> These documents are templates for educational purposes only. Always have contracts reviewed by a licensed attorney in your state before executing.
        </p>
      </div>

      {/* State selector */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
          Select Your State
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {WHOLESALE_STATES.map(state => (
            <button
              key={state.abbr}
              onClick={() => { setSelectedState(state.abbr); setPreviewType(null); setEditedContent(''); setIsEditing(false) }}
              style={{
                padding: '8px 14px',
                borderRadius: 6,
                border: selectedState === state.abbr ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                background: selectedState === state.abbr ? 'rgba(244,126,95,0.15)' : 'transparent',
                color: selectedState === state.abbr ? '#ff7e5f' : '#888',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 12,
                fontWeight: 600,
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 4,
              }}
            >
              <MapPin size={11} />
              {state.abbr}
            </button>
          ))}
        </div>
      </div>

      {/* Selected state info + downloads */}
      {currentState && (
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <MapPin size={20} color="#ff7e5f" />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
              {currentState.name}
            </h3>
          </div>
          <p style={{ fontSize: 13, color: '#888', marginBottom: 20, lineHeight: 1.6 }}>
            {currentState.notes}
          </p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 16 }}>
            {/* Cancellation Contract */}
            <div className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <FileText size={20} color="#ff7e5f" />
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                    Cancellation Contract
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {currentState.name} — Purchase Agreement Termination
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => downloadText(`Cancellation_Contract_${currentState.abbr}.txt`, (previewType === 'cancellation' && editedContent) ? editedContent : generateCancellationContract(currentState.name))}
                  className="btn-download btn-pdf"
                >
                  <Download size={14} /> Download .txt
                </button>
                <button
                  onClick={() => {
                    const next = previewType === 'cancellation' ? null : 'cancellation'
                    setPreviewType(next)
                    if (next) { setEditedContent(generateCancellationContract(currentState.name)); setIsEditing(false) }
                  }}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  {previewType === 'cancellation' ? 'Hide Preview' : 'Preview'}
                </button>
              </div>
            </div>

            {/* Addendum */}
            <div className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <FileText size={20} color="#ffb347" />
                <div>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                    Contract Addendum
                  </div>
                  <div style={{ fontSize: 12, color: '#888' }}>
                    {currentState.name} — Agreement Modification
                  </div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                <button
                  onClick={() => downloadText(`Addendum_${currentState.abbr}.txt`, (previewType === 'addendum' && editedContent) ? editedContent : generateAddendum(currentState.name))}
                  className="btn-download btn-word"
                >
                  <Download size={14} /> Download .txt
                </button>
                <button
                  onClick={() => {
                    const next = previewType === 'addendum' ? null : 'addendum'
                    setPreviewType(next)
                    if (next) { setEditedContent(generateAddendum(currentState.name)); setIsEditing(false) }
                  }}
                  className="btn-ghost"
                  style={{ padding: '8px 16px', fontSize: 13 }}
                >
                  {previewType === 'addendum' ? 'Hide Preview' : 'Preview'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Preview */}
      {currentState && previewType && (
        <div style={{ background: '#1a2030', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
            {previewType === 'cancellation' ? 'Cancellation Contract' : 'Addendum'} Preview — {currentState.name}
          </h3>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <div style={{ fontSize: 12, color: isEditing ? '#ff7e5f' : '#666', fontFamily: "'DM Sans', sans-serif" }}>
              {isEditing ? 'EDITING — customize below' : 'Click the text below to edit'}
            </div>
            <button
              onClick={() => window.print()}
              className="btn-download btn-pdf no-print"
              style={{ padding: '6px 12px', fontSize: 12 }}
            >
              <Printer size={13} /> Print
            </button>
          </div>
          <textarea
            value={editedContent}
            onChange={(e) => { setEditedContent(e.target.value); setIsEditing(true) }}
            onFocus={() => setIsEditing(true)}
            onBlur={() => setIsEditing(false)}
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
          {/* Print-friendly content (hidden on screen, shown when printing) */}
          <div className="contract-print-content print-only">
            <div className="print-header">
              <h1>Flip the Contract</h1>
              <p>{currentState.name} — {previewType === 'cancellation' ? 'Cancellation Contract' : 'Contract Addendum'}</p>
            </div>
            {editedContent}
          </div>
          {editedContent !== originalContent && (
            <button
              onClick={() => { setEditedContent(originalContent); setIsEditing(false) }}
              style={{
                marginTop: 10,
                padding: '6px 16px',
                fontSize: 12,
                fontFamily: "'DM Sans', sans-serif",
                color: '#ff7e5f',
                background: 'transparent',
                border: '1px solid #ff7e5f',
                borderRadius: 6,
                cursor: 'pointer',
              }}
            >
              Reset to Original
            </button>
          )}
        </div>
      )}

      {!selectedState && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#555', fontSize: 14 }}>
          Select a state above to view and download cancellation contracts and addendums.
        </div>
      )}
    </div>
  )
}
