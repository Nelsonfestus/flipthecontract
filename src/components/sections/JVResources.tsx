import { useState } from 'react'
import { Download, FileText } from 'lucide-react'

const JV_AGREEMENT_TEXT = `JOINT VENTURE AGREEMENT
Wholesale Real Estate Transaction

This Joint Venture Agreement ("Agreement") is entered into as of
_____________, 20___, by and between:

Party A (Deal Finder): _______________________________
Address: ____________________________________________
Phone: _________________ Email: _____________________

Party B (Disposition / Buyer Specialist): _______________
Address: ____________________________________________
Phone: _________________ Email: _____________________

PROPERTY: _________________________________________
Address: ____________________________________________
City: _____________ State: ______ Zip: _______________

1. PURPOSE
   The parties agree to work together to wholesale the
   above property. This is a single-transaction JV.
   Party A is responsible for: securing the property under
   contract with the Seller.
   Party B is responsible for: finding and closing an end
   buyer (cash buyer or assignee).

2. ROLES AND RESPONSIBILITIES
   Party A shall:
   - Negotiate and execute the purchase agreement with Seller
   - Provide all property details, photos, and comps to Party B
   - Maintain communication with Seller through closing
   - Ensure contract remains in good standing

   Party B shall:
   - Market the deal to qualified cash buyers
   - Negotiate the assignment fee or resale price
   - Coordinate with the title company for closing
   - Provide proof of buyer's funds or financing

3. COMPENSATION SPLIT
   Total Assignment Fee / Profit: $_______________
   Party A receives: ______% = $_______________
   Party B receives: ______% = $_______________
   (Standard split is 50/50 unless otherwise agreed)
   Payment shall be made at closing through the title
   company. Neither party shall receive payment outside
   of the closing process.

4. EARNEST MONEY
   EMD of $_____________ shall be paid by: [ ] Party A
   [ ] Party B [ ] Split equally
   If the deal does not close, EMD responsibility shall
   be borne by: _________________.

5. TIMELINE
   This agreement is valid until: _______________
   If no buyer is found by this date, the agreement
   terminates automatically. Either party may extend
   the deadline by mutual written consent.

6. EXCLUSIVITY
   During the term of this Agreement, neither party shall
   independently pursue the sale, assignment, or marketing
   of the subject Property without the other party's
   written consent.

7. CONFIDENTIALITY & NON-CIRCUMVENT
   Both parties agree not to circumvent each other by
   contacting the seller, buyer, or any related party
   directly without written consent. This non-circumvent
   clause shall survive termination for a period of
   24 months. Any deal negotiated or sourced during the
   term of this Agreement that closes after termination
   shall remain subject to the compensation split herein.
   Violation of this clause shall entitle the non-violating
   party to the full assignment fee plus reasonable
   attorney's fees.

8. CONTRACT CONTROL & AUTHORITY
   Party A shall hold and control the original purchase
   agreement with the Seller. Neither party shall modify,
   amend, extend, or cancel the purchase agreement without
   the written consent of the other party. All
   communications with the Seller regarding material terms
   shall be coordinated between both parties. Party B
   shall not negotiate with the Seller directly unless
   authorized in writing by Party A.

9. LIABILITY & INSURANCE
   Each party shall be responsible for their own acts and
   omissions. Neither party shall be liable for the
   other's negligence, misrepresentation, or failure to
   perform. Both parties are encouraged to maintain
   general liability insurance. If either party incurs
   liability arising from the transaction, the responsible
   party shall indemnify and hold harmless the other.

10. DEFAULT
   If either party fails to perform their obligations:
   (a) The non-defaulting party may terminate this
       Agreement with written notice.
   (b) The defaulting party forfeits their share of the
       assignment fee.
   (c) The non-defaulting party may pursue the deal
       independently.

11. DISPUTE RESOLUTION
   Disputes shall be resolved by binding arbitration in
   the county where the subject property is located,
   in accordance with the rules of the American
   Arbitration Association. The prevailing party shall
   be entitled to recover reasonable attorney's fees.

12. INDEPENDENT CONTRACTORS
    The parties are independent contractors. This Agreement
    does not create a partnership, employment relationship,
    or agency. Neither party has authority to bind the
    other without express written consent.

13. GOVERNING LAW
    This Agreement shall be governed by the laws of the
    State of _____________.

14. ENTIRE AGREEMENT
    This Agreement constitutes the entire understanding
    between the parties. Amendments must be in writing
    and signed by both parties.

Both parties acknowledge and agree to the terms above.

Party A Signature: _________________ Date: _________
Printed Name: _______________________________________

Party B Signature: _________________ Date: _________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed attorney before executing.
© 2026 Flip the Contract. All rights reserved.`

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

export default function JVResources() {
  const [editedContent, setEditedContent] = useState(JV_AGREEMENT_TEXT)
  const [isEditing, setIsEditing] = useState(false)
  const hasChanges = editedContent !== JV_AGREEMENT_TEXT

  return (
    <div>
      <h2 className="section-header">JV Resources</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Joint venture agreement templates, fee-splitting frameworks, and partnership guidelines for wholesale co-deals.
      </p>

      <div className="info-warn" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#c47a1a', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>WARNING</span>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          JV agreements should always be in writing before a deal starts. Verbal agreements lead to disputes. Have an attorney review for deals over $10,000.
        </div>
      </div>

      {/* JV Agreement Preview */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 24, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em' }}>
              JV Agreement Template
            </div>
            <div style={{ fontSize: 12, color: '#888', marginTop: 2 }}>Standard wholesale joint venture — two-party split</div>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
            {hasChanges && (
              <button
                className="btn-download btn-pdf"
                onClick={() => { setEditedContent(JV_AGREEMENT_TEXT); setIsEditing(false) }}
                style={{ background: 'transparent', border: '1px solid #ff7e5f', color: '#ff7e5f' }}
              >
                Reset to Original
              </button>
            )}
            <button className="btn-download btn-pdf" onClick={() => downloadText('JV_Agreement_Template.txt', editedContent)}>
              <Download size={13} /> Download .txt
            </button>
          </div>
        </div>

        <div style={{ fontSize: 11, color: isEditing ? '#ff7e5f' : '#666', marginBottom: 6, letterSpacing: '0.03em' }}>
          {isEditing ? 'EDITING — customize below' : 'Click the text below to edit'}
        </div>

        <textarea
          value={editedContent}
          onChange={(e) => setEditedContent(e.target.value)}
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
      </div>

      {/* JV Fee Split Calculator */}
      <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 16 }}>
          Common JV Split Structures
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
          {[
            { label: '50/50 Split', a: 50, b: 50, desc: 'Most common. Equal work, equal pay.' },
            { label: '60/40 Split', a: 60, b: 40, desc: 'Deal finder gets more for a tough deal.' },
            { label: '70/30 Split', a: 70, b: 30, desc: 'Deal finder has buyer lined up already.' },
            { label: '40/60 Split', a: 40, b: 60, desc: 'Buyer brings capital/credibility to close.' },
          ].map(split => (
            <div key={split.label} style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 14 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em' }}>
                {split.label}
              </div>
              <div style={{ fontSize: 11, color: '#888', marginBottom: 6 }}>Deal Finder / Disposition</div>
              <div style={{ display: 'flex', gap: 4, marginBottom: 8 }}>
                <div style={{ height: 6, borderRadius: 3, background: '#ff7e5f', width: `${split.a}%`, transition: 'width 0.3s' }} />
                <div style={{ height: 6, borderRadius: 3, background: '#ffb347', width: `${split.b}%`, transition: 'width 0.3s' }} />
              </div>
              <div style={{ fontSize: 12, color: '#aaa' }}>{split.desc}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="info-note">
        <span style={{ fontSize: 11, fontWeight: 700, color: '#6aadee', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>NOTE</span>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          Always clarify <strong>who controls the contract</strong> in your JV. The person who signed the purchase agreement with the seller has the legal right to assign. Make sure this is documented in your JV agreement.
        </div>
      </div>
    </div>
  )
}
