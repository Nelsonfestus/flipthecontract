import { useState } from 'react'
import { Download, FileText, AlertTriangle, Info, Lightbulb, Search, MapPin, Printer } from 'lucide-react'
import { toast } from '@/lib/toast'

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

const STATES = [
  { id: 'al', name: 'Alabama', flag: '🏛️', notes: 'No license required for wholesaling. Attorney-closing state — use a closing attorney. Very investor-friendly market.' },
  { id: 'ak', name: 'Alaska', flag: '🏔️', notes: 'Assignment allowed. Small market with limited buyers. Remote areas may have title and access challenges.' },
  { id: 'az', name: 'Arizona', flag: '🌵', notes: 'One of the most wholesaler-friendly states. No license required for assignments. Strong investor market in Phoenix and Tucson.' },
  { id: 'ar', name: 'Arkansas', flag: '💎', notes: 'No specific wholesale laws. Affordable entry point for new wholesalers. Assignment contracts widely accepted.' },
  { id: 'ca', name: 'California', flag: '🌊', notes: 'Strict disclosure requirements. Must comply with equity purchase laws. LA, Inland Empire, and Sacramento are active markets. Use attorney-reviewed contracts.' },
  { id: 'co', name: 'Colorado', flag: '⛰️', notes: 'Must use Division of Real Estate approved forms. Equity skimming laws require careful structuring. Denver metro is active.' },
  { id: 'ct', name: 'Connecticut', flag: '🍂', notes: 'Attorney-closing state. Hartford and New Haven have affordable inventory. Assignment allowed with proper disclosure.' },
  { id: 'de', name: 'Delaware', flag: '💙', notes: 'Small but investor-friendly market. Wilmington metro has active buyers. No specific wholesale legislation.' },
  { id: 'dc', name: 'District of Columbia', flag: '🏛️', notes: 'High property values. Strict tenant protections. Assignment allowed but consult local attorney. Limited inventory for wholesale.' },
  { id: 'fl', name: 'Florida', flag: '🌴', notes: 'Active wholesale market. Recent legislation requires more transparency. Assignment fees must be disclosed. High-volume wholesale state.' },
  { id: 'ga', name: 'Georgia', flag: '🍑', notes: 'Very investor-friendly. Quick foreclosure timelines and straightforward assignment process. Atlanta is a top wholesale market.' },
  { id: 'hi', name: 'Hawaii', flag: '🌺', notes: 'High property values limit wholesale margins. Oahu has most activity. Unique land tenure (leasehold vs fee simple) affects deals.' },
  { id: 'id', name: 'Idaho', flag: '🥔', notes: 'Growing market, especially in Boise metro. No specific wholesale legislation. Standard assignment practices apply.' },
  { id: 'il', name: 'Illinois', flag: '🏙️', notes: 'Attorney-closing state. Chicago is one of the top wholesale markets. Understand the IL Real Estate License Act exemptions.' },
  { id: 'in', name: 'Indiana', flag: '🏁', notes: 'Very wholesaler-friendly. Indianapolis is a strong wholesale market with affordable properties and active cash buyers.' },
  { id: 'ia', name: 'Iowa', flag: '🌽', notes: 'No specific wholesale regulations. Des Moines is the most active market. Assignment contracts are standard practice.' },
  { id: 'ks', name: 'Kansas', flag: '🌻', notes: 'Wholesaler-friendly. Kansas City (KS side) and Wichita are active markets. Low property values offer decent margins.' },
  { id: 'ky', name: 'Kentucky', flag: '🐴', notes: 'No license required for wholesale assignment of contracts. Louisville and Lexington are active markets.' },
  { id: 'la', name: 'Louisiana', flag: '⚜️', notes: 'Uses unique civil law system (Napoleonic Code). Notarial closings are the norm. Flood zones are a major consideration.' },
  { id: 'me', name: 'Maine', flag: '🦞', notes: 'Small wholesale market. Portland area has most activity. Attorney involvement recommended. Seasonal considerations for closings.' },
  { id: 'md', name: 'Maryland', flag: '🦀', notes: 'HB 1079 specifically regulates wholesale transactions. Baltimore is an active wholesale market. Attorney involvement recommended.' },
  { id: 'ma', name: 'Massachusetts', flag: '📜', notes: 'Attorney-closing state. Boston metro is competitive but profitable. Strict consumer protection laws apply to real estate.' },
  { id: 'mi', name: 'Michigan', flag: '🦌', notes: 'No attorney required at closing. Detroit is one of the most active wholesale markets for low-cost properties.' },
  { id: 'mn', name: 'Minnesota', flag: '🌲', notes: 'Wholesaler-friendly state. Minneapolis-St. Paul is active. Contract for deed deals have specific regulations.' },
  { id: 'ms', name: 'Mississippi', flag: '🎵', notes: 'Wholesale friendly. Few restrictions on contract assignments. Low property values offer good margins.' },
  { id: 'mo', name: 'Missouri', flag: '🏛️', notes: 'No specific wholesale legislation. Kansas City and St. Louis are strong markets. Very investor-friendly overall.' },
  { id: 'mt', name: 'Montana', flag: '🏔️', notes: 'Small, rural market. Billings and Missoula have some investor activity. Limited cash buyer pool outside metro areas.' },
  { id: 'ne', name: 'Nebraska', flag: '🌾', notes: 'No specific wholesale laws. Omaha and Lincoln are the primary markets. Very investor-friendly with affordable inventory.' },
  { id: 'nv', name: 'Nevada', flag: '🎰', notes: 'AB 404 introduced specific regulations for wholesalers. Las Vegas is a major wholesale market. Disclosures are strict.' },
  { id: 'nh', name: 'New Hampshire', flag: '⛷️', notes: 'No state income tax makes it attractive for investors. Manchester and Nashua have active markets. Small but growing wholesale community.' },
  { id: 'nj', name: 'New Jersey', flag: '🏖️', notes: 'Attorney-closing state. Active wholesale market in Newark, Camden, and Trenton. High property taxes affect deal analysis.' },
  { id: 'nm', name: 'New Mexico', flag: '🌶️', notes: 'Albuquerque is the primary market. No specific wholesale legislation. Growing investor community with affordable properties.' },
  { id: 'ny', name: 'New York', flag: '🗽', notes: 'Attorney-closing state. NYC boroughs, Buffalo, and Rochester are active. Strict regulations — use local attorney. AG may scrutinize repeated transactions.' },
  { id: 'nc', name: 'North Carolina', flag: '🐝', notes: 'NC Real Estate Commission has weighed in on wholesale activity. Charlotte and Raleigh-Durham are active markets.' },
  { id: 'nd', name: 'North Dakota', flag: '🦬', notes: 'Very small wholesale market. Fargo and Bismarck have limited activity. Low property values and small buyer pool.' },
  { id: 'oh', name: 'Ohio', flag: '🌰', notes: 'Very wholesaler-friendly. Cleveland, Columbus, and Cincinnati are all active markets with affordable prices and cash buyers.' },
  { id: 'ok', name: 'Oklahoma', flag: '🌪️', notes: 'No specific wholesale legislation. Oklahoma City and Tulsa have active investor communities. Affordable market.' },
  { id: 'or', name: 'Oregon', flag: '🌲', notes: 'Portland is the primary wholesale market. Landlord-tenant laws are strict. Assignment contracts are accepted with disclosure.' },
  { id: 'pa', name: 'Pennsylvania', flag: '🔔', notes: 'Philadelphia has introduced specific licensing for wholesalers. Pittsburgh is more straightforward. Understand local rules.' },
  { id: 'ri', name: 'Rhode Island', flag: '⛵', notes: 'Small but active market. Providence has most wholesale activity. Attorney involvement recommended. Tight-knit investor community.' },
  { id: 'sc', name: 'South Carolina', flag: '🌙', notes: 'Attorney-closing state. Charleston, Columbia, and Greenville are growing markets. Attorney involvement helps compliance.' },
  { id: 'sd', name: 'South Dakota', flag: '🗿', notes: 'Very small wholesale market. Sioux Falls has most activity. No specific wholesale legislation. Low competition.' },
  { id: 'tn', name: 'Tennessee', flag: '🎸', notes: 'Wholesaler-friendly state. Nashville and Memphis are top wholesale markets nationally. Large volume of investor properties.' },
  { id: 'tx', name: 'Texas', flag: '⭐', notes: 'HB 1228 requires specific disclosure language on marketing. DFW, Houston, and San Antonio are among the most active markets.' },
  { id: 'ut', name: 'Utah', flag: '🏜️', notes: 'No specific wholesale legislation. Salt Lake City area is an active market. Growing investor community.' },
  { id: 'vt', name: 'Vermont', flag: '🍁', notes: 'Very small market with limited wholesale opportunities. Burlington area has some activity. Seasonal market considerations.' },
  { id: 'va', name: 'Virginia', flag: '🗺️', notes: 'Virginia Real Estate Board has provided guidance on wholesale activity. Northern VA has high values; Hampton Roads offers better margins.' },
  { id: 'wa', name: 'Washington', flag: '🌧️', notes: 'Seattle metro has high values. Tacoma and Spokane offer better wholesale margins. Recent legislation increased disclosure requirements.' },
  { id: 'wv', name: 'West Virginia', flag: '⛰️', notes: 'Very affordable properties. Charleston and Huntington have some investor activity. Low competition for wholesalers.' },
  { id: 'wi', name: 'Wisconsin', flag: '🧀', notes: 'Assignment of contracts is legal with proper documentation. Milwaukee is the primary wholesale market.' },
  { id: 'wy', name: 'Wyoming', flag: '🤠', notes: 'Smallest wholesale market in the country. Cheyenne and Casper have limited activity. No state income tax.' },
]

function generatePurchaseContract(stateName: string): string {
  return `WHOLESALE REAL ESTATE PURCHASE AND SALE AGREEMENT

STATE OF ${stateName.toUpperCase()}

This Purchase and Sale Agreement ("Agreement") is made as of
_____________, 20_____, by and between:

SELLER:
Name: ________________________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

BUYER/ASSIGNEE:
Name: ________________________________________________
Entity (if applicable): ________________________________
Address: _____________________________________________
Phone: _________________ Email: ______________________

1. PROPERTY DESCRIPTION
The property located at:
Address: _____________________________________________
City: _________________ County: ______________________
State: ${stateName} Zip: ________
Legal Description: ____________________________________
APN/Parcel #: ________________________________________
(the "Property")

2. PURCHASE PRICE AND TERMS
Purchase Price: $______________
Earnest Money Deposit (EMD): $______________ to be deposited
within _____ business days of execution into escrow with:
Title Company: _______________________________________
Address: _____________________________________________
The EMD shall be applied to the purchase price at closing.

3. ASSIGNMENT CLAUSE
Buyer shall have the right to assign this Agreement, in
whole or in part, to any third party ("Assignee") without
the prior written consent of Seller. Seller acknowledges
and agrees that Buyer may earn an assignment fee from such
assignment, which shall not reduce or affect the net
proceeds payable to Seller. The assignment fee amount
shall be disclosed to Seller in writing prior to or at
closing, as required by applicable state law. The
assignment fee shall be paid through the closing/title
company. Upon assignment, Assignee shall assume all
obligations of Buyer under this Agreement.

4. INSPECTION / DUE DILIGENCE PERIOD
Buyer shall have _____ calendar days from the date of this
Agreement ("Inspection Period") to conduct inspections,
appraisals, surveys, environmental assessments, and any
other due diligence at Buyer's expense. If Buyer is not
satisfied for any reason, Buyer may terminate this Agreement
by written notice before expiration of the Inspection
Period, and EMD shall be returned to Buyer in full.

5. TITLE AND CLOSING
(a) Seller shall provide marketable and insurable title,
    free of liens, encumbrances, and defects, except:
    ___________________________________________________
(b) Closing shall occur on or before: _________________
    or _____ days after expiration of Inspection Period.
(c) Closing shall be conducted by the Title Company
    named above. Seller shall provide a warranty deed
    (or applicable deed per state law) at closing.
(d) Title insurance shall be provided at Seller's expense.

6. CLOSING COSTS
Seller shall pay: deed preparation, transfer taxes (if
applicable per state), title insurance premium, any
outstanding liens, HOA estoppel (if applicable).
Buyer shall pay: recording fees, Buyer's closing costs,
any additional title endorsements requested by Buyer.

7. PROPERTY CONDITION — AS-IS
Buyer is purchasing the Property in its present "AS-IS,
WHERE-IS" condition. Seller makes no warranties or
representations regarding the condition of the Property,
including but not limited to structural, mechanical,
environmental, or habitability conditions, except as
required by applicable state law. Buyer relies solely
on their own inspections and investigations, and not on
any representations made by Seller or Seller's agents.

8. SELLER REPRESENTATIONS
Seller represents and warrants that:
(a) Seller has the legal authority to sell the Property.
(b) There are no undisclosed liens, claims, or
    encumbrances against the Property.
(c) Seller has not received notice of any pending or
    threatened legal actions affecting the Property.
(d) All required disclosures per state law have been or
    will be provided prior to closing.

9. DEFAULT AND REMEDIES
(a) If Buyer defaults, Seller's sole remedy shall be
    retention of the EMD as liquidated damages.
(b) If Seller defaults, Buyer may: (i) seek specific
    performance; (ii) terminate this Agreement and
    receive a full refund of the EMD; or (iii) pursue
    any other remedy available at law or in equity.

10. CONTINGENCIES
This Agreement is contingent upon:
[ ] Clear and marketable title
[ ] Satisfactory inspection within the Due Diligence Period
[ ] Buyer's Subject to Partner Approval (within _____ days;
    if not removed within stated period, contingency is
    deemed waived and Buyer shall proceed to close)
[ ] Buyer's Subject to Funding / Financing
[ ] Other: ____________________________________________
If any contingency is not satisfied or waived within the
stated period, Buyer may terminate this Agreement and
receive a full and immediate refund of the EMD.

11. EMD DISPUTE RESOLUTION
In the event of a dispute over the disposition of the
Earnest Money Deposit, the Title Company/Escrow Agent
shall hold the EMD in escrow pending: (a) mutual written
instructions from both parties; or (b) a final court
order or arbitration award. The Title Company/Escrow
Agent shall not be liable for any loss or damage
resulting from good-faith compliance with this section.
Neither party shall make demand on the Title Company
for release of the EMD without first providing written
notice and a 10-business-day cure period to the other
party.

12. POSSESSION
Possession of the Property shall be delivered to Buyer
(or Assignee) at closing, unless otherwise agreed:
___________________________________________________

13. RISK OF LOSS
Risk of loss shall remain with Seller until closing.
If the Property is materially damaged before closing,
Buyer may terminate this Agreement and receive a full
EMD refund.

14. FORCE MAJEURE / BANKRUPTCY
(a) If either party is prevented from performing due to
    acts of God, natural disasters, government orders,
    or other events beyond reasonable control, the
    affected party's performance shall be excused for
    the duration of such event, and closing deadlines
    shall be extended accordingly.
(b) If Seller files for bankruptcy or becomes subject to
    an involuntary petition, Buyer may terminate this
    Agreement and receive a full refund of the EMD.
    Seller shall provide immediate written notice to
    Buyer of any bankruptcy filing or proceeding.

15. ENTIRE AGREEMENT
This Agreement constitutes the entire agreement between
the parties. No modifications shall be valid unless in
writing and signed by both parties.

16. LEAD-BASED PAINT DISCLOSURE (Pre-1978 Properties)
If the Property was built before 1978, Seller shall
provide Buyer with any known information regarding
lead-based paint or lead-based paint hazards, and Buyer
shall receive the EPA pamphlet "Protect Your Family From
Lead in Your Home." Buyer shall have 10 days (unless
otherwise agreed) to conduct a lead-based paint
inspection at Buyer's expense. This section is required
by federal law (42 U.S.C. 4852d).
[ ] Property built before 1978 — disclosure attached
[ ] Property built 1978 or later — not applicable

17. BROKER / AGENT DISCLOSURE
[ ] Seller is represented by: _________________________
[ ] Buyer is represented by: __________________________
[ ] No brokers or agents are involved in this transaction
Any commissions owed shall be the responsibility of the
party who engaged the broker/agent. If one party is
represented and the other is not, the represented party's
agent shall not be deemed to represent the unrepresented
party. Each party acknowledges they have been advised to
seek independent legal and professional representation.

18. DISPUTE RESOLUTION
Any disputes arising from this Agreement shall first be
submitted to mediation. If mediation is unsuccessful,
the parties may pursue remedies available at law or in
equity in the courts of the State of ${stateName}.
The prevailing party in any legal action shall be
entitled to recover reasonable attorney fees and costs.

19. GOVERNING LAW
This Agreement shall be governed by the laws of the
State of ${stateName}.

20. MEMORANDUM OF CONTRACT / EQUITABLE INTEREST
Buyer shall have the right to record a Memorandum of
Contract or Affidavit of Equitable Interest in the
public records to protect Buyer's equitable interest
in the Property. Seller agrees not to encumber, sell,
or transfer the Property to any other party during the
term of this Agreement.

21. SIGNATURES
By signing below, the parties agree to all terms above.

SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

BUYER/ASSIGNEE:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________
${stateName.toLowerCase() === 'illinois' ? `
STATE-SPECIFIC DISCLOSURE (ILLINOIS):
Buyer is a real estate investor and is purchasing the
Property for the purpose of investment and/or resale.
Seller acknowledges that Buyer holds an equitable
interest and may assign this contract for a profit.` : stateName.toLowerCase() === 'oklahoma' ? `
STATE-SPECIFIC DISCLOSURE (OKLAHOMA):
Notice: The Buyer under this contract holds an equitable
interest and intends to assign or resell this interest
for a profit. Seller acknowledges and consents to this
intended assignment.` : stateName.toLowerCase() === 'pennsylvania' ? `
STATE-SPECIFIC DISCLOSURE (PENNSYLVANIA):
Wholesale License Disclosure: If the Property is located
in Philadelphia, Buyer affirms compliance with local
wholesale licensing and disclosure ordinances. Seller
acknowledges Buyer intends to assign this contract for
a profit.` : stateName.toLowerCase() === 'texas' ? `
STATE-SPECIFIC DISCLOSURE (TEXAS):
Per Texas HB 1228, Buyer hereby discloses that Buyer
intends to assign or market this contract for a profit
prior to closing. This contract may be marketed, and
Buyer's assignment fee or profit will be earned from
the assignment. Seller acknowledges this disclosure.
This notice is provided pursuant to Texas Property Code.` : stateName.toLowerCase() === 'florida' ? `
STATE-SPECIFIC DISCLOSURE (FLORIDA):
Buyer is a real estate investor entering into this
contract with the intent to assign or resell the
equitable interest for a profit. The assignment fee
shall be disclosed in writing to Seller prior to or
at closing. Seller acknowledges and consents to this
intended assignment. This disclosure is made pursuant
to Florida Statute requirements for transparency in
wholesale transactions.` : stateName.toLowerCase() === 'nevada' ? `
STATE-SPECIFIC DISCLOSURE (NEVADA):
Per Nevada AB 404, Buyer discloses that Buyer is a
wholesaler entering into this Agreement with the intent
to assign the contract or resell the equitable interest
for a profit. Buyer shall comply with all disclosure
requirements under Nevada law. Seller acknowledges this
disclosure and the nature of the transaction.` : stateName.toLowerCase() === 'maryland' ? `
STATE-SPECIFIC DISCLOSURE (MARYLAND):
Per Maryland HB 1079, Buyer discloses that Buyer is a
real estate wholesaler entering this contract with the
intent to assign or resell the equitable interest for
a profit. Buyer shall comply with all Maryland
wholesale transaction disclosure requirements. Attorney
involvement is recommended for both parties.` : stateName.toLowerCase() === 'california' ? `
STATE-SPECIFIC DISCLOSURE (CALIFORNIA):
Buyer discloses that Buyer is an investor purchasing
this Property for investment or resale purposes. Seller
is advised to seek independent legal counsel. This
transaction must comply with California equity purchase
laws (Civil Code Sections 1695 et seq.) if the Property
is in or approaching foreclosure. Buyer shall provide
all disclosures required under California law.` : ''}

---
This document is for educational purposes only.
Always consult a licensed real estate attorney in your
state before using any contract on a live deal.
© 2026 Flip the Contract. All rights reserved.`
}

function generateAssignmentAddendum(stateName: string): string {
  return `ASSIGNMENT OF REAL ESTATE PURCHASE AGREEMENT

STATE OF ${stateName.toUpperCase()}

This Assignment ("Assignment") is made as of
_____________, 20_____, by and between:

ASSIGNOR (Original Buyer): ____________________________
ASSIGNEE (New Buyer): _________________________________

RECITALS:
WHEREAS, Assignor entered into a Purchase and Sale
Agreement ("Original Agreement") dated _____________,
20_____ with Seller: __________________________________
for the property located at:
_______________________________________________________
City: _____________ State: ${stateName} Zip: ___________

NOW, THEREFORE, for good and valuable consideration,
including the Assignment Fee stated below, the parties
agree as follows:

1. ASSIGNMENT
Assignor hereby assigns, transfers, and conveys to
Assignee all of Assignor's right, title, and interest
in and to the Original Agreement.

2. ASSIGNMENT FEE
Assignee shall pay Assignor an assignment fee of
$_____________ at or before closing. This fee shall be
paid through the title company/closing agent and shall
not reduce the Seller's net proceeds. The assignment fee
amount is hereby disclosed to all parties. Assignor
shall not further assign this Agreement without written
consent of Assignee.

3. ASSUMPTION OF OBLIGATIONS
Assignee assumes all obligations, duties, and
responsibilities of Assignor under the Original
Agreement, including but not limited to the obligation
to close on the Property and pay the full purchase
price as stated in the Original Agreement.

4. EARNEST MONEY
The original EMD of $_____________ deposited by Assignor
shall: [ ] remain in escrow [ ] be replaced by Assignee
Assignee shall deposit additional EMD of $____________
within _____ business days of this Assignment.

5. CLOSING
Closing shall occur on or before the date specified in
the Original Agreement: _________________.

6. HOLD HARMLESS & RELEASE OF LIABILITY
Assignee agrees to indemnify and hold harmless Assignor
from any claims, liabilities, or damages arising from
Assignee's failure to perform under the Original
Agreement after the effective date of this Assignment.
Upon execution of this Assignment and payment of the
Assignment Fee, Seller and Assignee hereby agree to
fully release and discharge Assignor from all
obligations, liabilities, and duties under the Original
Agreement. Notwithstanding the foregoing, Seller retains
the right to seek specific performance against Assignee
in the event Assignee fails to close. Assignee
acknowledges sole responsibility for performance under
the Original Agreement from the effective date of this
Assignment.

7. ORIGINAL AGREEMENT
The Original Agreement is incorporated herein by
reference. All terms and conditions of the Original
Agreement remain in full force and effect except as
modified by this Assignment.

8. GOVERNING LAW
This Assignment shall be governed by the laws of the
State of ${stateName}.

IN WITNESS WHEREOF, the parties have executed this
Assignment as of the date first written above.

ASSIGNOR:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

ASSIGNEE:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

ACKNOWLEDGMENT BY SELLER (if required):
Seller acknowledges this Assignment and agrees to
close with Assignee under the terms of the Original
Agreement.
Seller Signature: ___________________ Date: __________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney.
© 2026 Flip the Contract. All rights reserved.`
}

function generateDoubleCloseAgreement(stateName: string): string {
  return `DOUBLE CLOSE (SIMULTANEOUS CLOSE) AGREEMENT

STATE OF ${stateName.toUpperCase()}

This Double Close Agreement ("Agreement") is made as of
_____________, 20_____, by and between:

TRANSACTION A — PURCHASE FROM SELLER:
Seller: ________________________________________________
Buyer (Wholesaler): ____________________________________
Property: ______________________________________________
City: _________________ State: ${stateName} Zip: ________
Purchase Price (A-B): $______________

TRANSACTION B — SALE TO END BUYER:
Seller (Wholesaler): ___________________________________
End Buyer: _____________________________________________
Sale Price (B-C): $______________

WHOLESALER'S SPREAD: $______________
(Difference between Transaction B sale price and
Transaction A purchase price)

1. OVERVIEW OF DOUBLE CLOSE STRUCTURE
This transaction involves two separate, simultaneous
closings:
  Transaction A: Wholesaler purchases the Property from
  Seller at the A-B price.
  Transaction B: Wholesaler immediately resells the
  Property to End Buyer at the B-C price.
Both transactions shall close on the same day through
the same title company/closing agent. The wholesaler
takes title momentarily between the two closings.

2. FUNDING SOURCE FOR TRANSACTION A
[ ] Wholesaler's own funds
[ ] Transactional funding lender:
    Lender: ____________________________________________
    Terms: _____________________________________________
[ ] End Buyer's funds (if title company allows)
[ ] Other: _____________________________________________

In the event transactional funding is not available or
is withdrawn prior to closing, Wholesaler shall have
_____ business days to secure alternative funding. If
alternative funding cannot be obtained, Wholesaler may:
(a) Proceed using own funds; (b) Delay closing by up to
_____ days with written notice to all parties; or
(c) Cancel both transactions, with all EMD returned to
the respective depositors. Wholesaler shall not be
liable to End Buyer for damages resulting from a
transactional funding failure, provided timely notice
is given.

3. TITLE COMPANY / CLOSING AGENT
Name: _________________________________________________
Address: ______________________________________________
Contact: ______________________________________________
Phone: _________________ Email: ______________________

4. CLOSING DATE
Both Transaction A and Transaction B shall close on:
_________________, 20_____
Transaction A shall close first, immediately followed
by Transaction B. If either transaction fails to close,
both transactions shall be null and void.

5. EARNEST MONEY DEPOSITS
Transaction A EMD: $______________ deposited by Wholesaler
Transaction B EMD: $______________ deposited by End Buyer
EMD for both transactions shall be held by the Title
Company named above.

6. TITLE REQUIREMENTS
Seller shall provide marketable and insurable title
free of liens and encumbrances. Title insurance shall
be issued for both transactions.

7. CLOSING COSTS
Transaction A:
  Seller pays: deed preparation, title insurance (owner's
  policy), transfer taxes, outstanding liens.
  Wholesaler pays: recording fees, transactional funding
  costs (if applicable).

Transaction B:
  Wholesaler pays: deed preparation, transfer taxes.
  End Buyer pays: recording fees, title insurance,
  buyer's closing costs.

8. DISCLOSURES
Wholesaler discloses to End Buyer that:
(a) Wholesaler is purchasing the Property simultaneously.
(b) Wholesaler will profit from the price differential.
(c) Wholesaler is not a licensed real estate agent/broker
    (unless otherwise disclosed).
This disclosure is provided in writing as required by
applicable state law.

9. PROPERTY CONDITION
End Buyer acknowledges the Property is being sold in
AS-IS, WHERE-IS condition. Wholesaler makes no
warranties regarding property condition.

10. DEFAULT
If Seller defaults on Transaction A, both transactions
are void and all EMD shall be returned to depositors.
If End Buyer defaults on Transaction B, Wholesaler may
choose to: (a) proceed with Transaction A and retain
the Property; or (b) cancel both transactions.
If Wholesaler defaults, Seller and End Buyer may pursue
available remedies.

11. PROOF OF FUNDS
End Buyer shall provide Wholesaler and/or Title Company
with satisfactory proof of funds or financing commitment
within _____ business days of executing this Agreement.
Acceptable proof includes: bank statements, lender
pre-approval letters, hard money commitment letters,
or transactional funding approval. If End Buyer fails
to provide proof of funds within the stated period,
Wholesaler may terminate Transaction B and proceed
with or cancel Transaction A at Wholesaler's discretion.

12. DISPUTE RESOLUTION
Any disputes arising from this Agreement shall first be
submitted to mediation administered by a mutually agreed
mediator. If mediation is unsuccessful within thirty (30)
days, the parties may pursue remedies available at law
or in equity in the courts of the State of ${stateName}.
The prevailing party in any legal action shall be
entitled to recover reasonable attorney fees and costs.

13. GOVERNING LAW
This Agreement shall be governed by the laws of the
State of ${stateName}.
${stateName.toLowerCase() === 'texas' ? `
STATE-SPECIFIC DISCLOSURE (TEXAS):
Per Texas HB 1228, Wholesaler hereby discloses that
Wholesaler is purchasing the Property from Seller and
simultaneously reselling to End Buyer for a profit.
The price differential between Transaction A and
Transaction B constitutes Wholesaler's compensation.
This notice is provided pursuant to Texas Property Code.` : stateName.toLowerCase() === 'florida' ? `
STATE-SPECIFIC DISCLOSURE (FLORIDA):
Wholesaler discloses that this is a simultaneous double
closing transaction. Wholesaler is purchasing from Seller
and immediately reselling to End Buyer at a higher price.
The spread between the A-B and B-C prices is Wholesaler's
profit. This disclosure is made pursuant to Florida
Statute requirements for transparency in wholesale
real estate transactions.` : stateName.toLowerCase() === 'illinois' ? `
STATE-SPECIFIC DISCLOSURE (ILLINOIS):
Wholesaler is a real estate investor conducting a
simultaneous double close. Wholesaler is purchasing
the Property from Seller and immediately reselling to
End Buyer for a profit. Both parties acknowledge the
nature of this transaction and the price differential
between the two closings.` : stateName.toLowerCase() === 'california' ? `
STATE-SPECIFIC DISCLOSURE (CALIFORNIA):
Wholesaler discloses that this is a simultaneous double
closing transaction for investment purposes. This
transaction must comply with California equity purchase
laws (Civil Code Sections 1695 et seq.) if the Property
is in or approaching foreclosure. All parties are advised
to seek independent legal counsel. Wholesaler shall
provide all disclosures required under California law.` : stateName.toLowerCase() === 'nevada' ? `
STATE-SPECIFIC DISCLOSURE (NEVADA):
Per Nevada AB 404, Wholesaler discloses that Wholesaler
is conducting a simultaneous double close, purchasing
from Seller and immediately reselling to End Buyer at a
higher price. Wholesaler shall comply with all disclosure
requirements under Nevada law regarding wholesale real
estate transactions.` : stateName.toLowerCase() === 'maryland' ? `
STATE-SPECIFIC DISCLOSURE (MARYLAND):
Per Maryland HB 1079, Wholesaler discloses that this is
a wholesale double close transaction. Wholesaler is
purchasing from Seller at one price and simultaneously
selling to End Buyer at a higher price. Attorney
involvement is recommended for all parties. Wholesaler
shall comply with all Maryland wholesale transaction
disclosure requirements.` : ''}

14. SIGNATURES

SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

WHOLESALER (BUYER/SELLER):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________
Entity: _____________________________________________

END BUYER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney.
© 2026 Flip the Contract. All rights reserved.`
}

function generateLetterOfIntent(stateName: string): string {
  return `LETTER OF INTENT (LOI) TO PURCHASE REAL ESTATE

STATE OF ${stateName.toUpperCase()}

Date: _____________, 20_____

To (Seller/Owner):
Name: _________________________________________________
Address: ______________________________________________
City: _________________ State: ${stateName} Zip: ________

From (Buyer/Investor):
Name: _________________________________________________
Entity: _______________________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

RE: Letter of Intent to Purchase Property at:
_______________________________________________________
City: _________________ State: ${stateName} Zip: ________
APN/Parcel #: _________________________________________

Dear ___________________________,

This Letter of Intent ("LOI") outlines the proposed
terms for the purchase of the above-referenced property
("Property"). This LOI is non-binding except for the
Confidentiality and Exclusivity provisions below.

1. PROPOSED PURCHASE PRICE
Offer Price: $______________
This is a [ ] cash offer [ ] financed offer

2. EARNEST MONEY DEPOSIT
EMD Amount: $______________
To be deposited within _____ business days of executing
a binding Purchase and Sale Agreement ("PSA").

3. DUE DILIGENCE / INSPECTION PERIOD
_____ calendar days from execution of the PSA.
Buyer may conduct inspections, appraisals, surveys,
environmental assessments, and title review during
this period.

4. PROPOSED CLOSING DATE
On or before _____ days from execution of the PSA,
or _________________, 20_____.

5. TITLE
Seller shall convey marketable and insurable title
via warranty deed (or applicable deed). Title insurance
shall be provided at Seller's expense.

6. PROPERTY CONDITION
Buyer intends to purchase the Property AS-IS, WHERE-IS.
Seller shall disclose all known material defects.

7. CONTINGENCIES
This offer is contingent upon:
[ ] Satisfactory inspection
[ ] Clear and marketable title
[ ] Buyer's ability to assign or close
[ ] Environmental clearance
[ ] Financing approval
[ ] Other: _____________________________________________

8. ASSIGNMENT
Buyer reserves the right to assign this LOI and any
resulting PSA to a designated entity or third party.

9. EXCLUSIVITY PERIOD (BINDING)
Seller agrees to negotiate exclusively with Buyer for
a period of _____ days from the date of this LOI. During
this period, Seller shall not solicit, entertain, or
accept other offers for the Property.

10. CONFIDENTIALITY (BINDING)
Both parties agree to keep the terms of this LOI and
any resulting negotiations confidential and shall not
disclose to third parties without written consent,
except to professional advisors, lenders, or as
required by law.

11. NON-BINDING NATURE
Except for the Exclusivity and Confidentiality
provisions above, this LOI is non-binding and is
intended only to outline the general terms of a
potential transaction. A binding agreement shall only
exist upon execution of a formal PSA by both parties.

12. EXPIRATION
This LOI shall expire if not accepted by Seller on or
before _________________, 20_____.

Sincerely,

BUYER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________
Entity: _____________________________________________

ACCEPTED AND AGREED BY SELLER:
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney.
© 2026 Flip the Contract. All rights reserved.`
}

function generateNonCircumvent(stateName: string): string {
  return `NON-DISCLOSURE AND NON-CIRCUMVENTION AGREEMENT

STATE OF ${stateName.toUpperCase()}

This Non-Disclosure and Non-Circumvention Agreement
("Agreement") is entered into as of _____________, 20_____,
by and between:

PARTY A (Disclosing Party):
Name: _________________________________________________
Entity: _______________________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

PARTY B (Receiving Party):
Name: _________________________________________________
Entity: _______________________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

RECITALS:
WHEREAS, the parties intend to explore a potential real
estate wholesale transaction or joint venture; and
WHEREAS, the Disclosing Party possesses proprietary
information including but not limited to property details,
seller contacts, buyer lists, financial terms, and deal
structures ("Confidential Information");

NOW, THEREFORE, in consideration of the mutual promises
contained herein, the parties agree as follows:

1. CONFIDENTIAL INFORMATION
"Confidential Information" includes, but is not limited to:
(a) Property addresses, legal descriptions, and details
(b) Seller names, contact information, and motivations
(c) Cash buyer names, contact information, and criteria
(d) Purchase prices, assignment fees, and profit margins
(e) Marketing strategies, deal pipelines, and lead sources
(f) Financial statements, proof of funds, and lending terms
(g) Title company contacts and closing procedures
(h) Any other information designated as confidential

2. NON-DISCLOSURE OBLIGATIONS
The Receiving Party agrees to:
(a) Keep all Confidential Information strictly confidential
(b) Not disclose, publish, or disseminate any Confidential
    Information to any third party without prior written
    consent of the Disclosing Party
(c) Use Confidential Information solely for the purpose of
    evaluating or completing the proposed transaction
(d) Take reasonable measures to protect the confidentiality
    of the information, at minimum the same level of care
    used to protect their own confidential information

3. NON-CIRCUMVENTION
The Receiving Party agrees that for a period of
_____ months (minimum 24 months recommended) from the
date of this Agreement, they shall NOT:
(a) Contact, negotiate with, or transact directly with any
    seller, buyer, investor, lender, title company, or
    other party introduced by the Disclosing Party
(b) Attempt to bypass the Disclosing Party to complete any
    transaction involving the disclosed property or parties
(c) Use the Disclosing Party's contacts, leads, or deal
    information for personal gain outside of the agreed
    transaction
(d) Introduce any disclosed contacts to third parties
    without written consent
(e) Interfere with any existing or potential business
    relationship of the Disclosing Party

4. PROPERTY/DEAL REFERENCE
This Agreement specifically covers:
Property Address: _____________________________________
City: _________________ State: ${stateName} Zip: ________
[ ] And all future deals between the parties
[ ] This specific transaction only

5. REMEDIES FOR BREACH
In the event of a breach of this Agreement:
(a) The breaching party shall pay the non-breaching party
    the full assignment fee or profit that would have been
    earned, plus damages
(b) Liquidated damages of $_____________ (minimum) shall
    be due upon breach, in addition to actual damages
(c) The non-breaching party shall be entitled to injunctive
    relief without the need to post a bond
(d) The breaching party shall pay all reasonable attorney
    fees, court costs, and collection expenses

6. TERM
This Agreement shall remain in effect for a period of
_____ months from the date of execution. The non-
circumvention obligations shall survive termination.

7. RETURN OF INFORMATION
Upon termination or request, the Receiving Party shall
promptly return or destroy all Confidential Information,
including copies, notes, and electronic files.

8. EXCEPTIONS
Confidential Information does not include information that:
(a) Was publicly available at the time of disclosure
(b) Becomes publicly available through no fault of the
    Receiving Party
(c) Was already known to the Receiving Party prior to
    disclosure (with documentation)
(d) Is required to be disclosed by law or court order

9. NO LICENSE
Nothing in this Agreement grants any license or rights
to intellectual property, trademarks, or proprietary
systems of the Disclosing Party.

10. GOVERNING LAW
This Agreement shall be governed by the laws of the
State of ${stateName}. Any disputes shall be resolved
in the courts of the county where the subject property
is located.

11. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding
between the parties regarding confidentiality and non-
circumvention. Amendments must be in writing.

IN WITNESS WHEREOF, the parties have executed this
Agreement as of the date first written above.

PARTY A (Disclosing Party):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

PARTY B (Receiving Party):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

---
This document is for educational purposes only.
Always consult a licensed attorney before executing.
© 2026 Flip the Contract. All rights reserved.`
}

function generateOptionToPurchase(stateName: string): string {
  return `OPTION TO PURCHASE REAL ESTATE AGREEMENT

STATE OF ${stateName.toUpperCase()}

This Option to Purchase Agreement ("Agreement") is
entered into as of _____________, 20_____, by and between:

OPTIONOR (Property Owner/Seller):
Name: _________________________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

OPTIONEE (Buyer/Investor):
Name: _________________________________________________
Entity (if applicable): ________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

1. PROPERTY DESCRIPTION
The property subject to this Option is located at:
Address: ______________________________________________
City: _________________ County: ______________________
State: ${stateName} Zip: ________
Legal Description: ____________________________________
APN/Parcel #: _________________________________________
(the "Property")

2. GRANT OF OPTION
Optionor hereby grants to Optionee the exclusive and
irrevocable option to purchase the Property under the
terms and conditions set forth herein.

3. OPTION CONSIDERATION
In exchange for this Option, Optionee shall pay Optionor
non-refundable option consideration of $______________,
payable upon execution of this Agreement.
[ ] Option consideration shall be applied toward the
    purchase price if the option is exercised
[ ] Option consideration is separate from the purchase
    price and shall not be credited at closing

4. OPTION PERIOD
This Option shall be effective from the date of execution
and shall expire at 11:59 PM on _____________, 20_____
(the "Option Period"). The Option Period is _____ days.
[ ] Option may be extended for an additional _____ days
    upon payment of additional consideration of
    $______________.
[ ] Option may NOT be extended.

5. PURCHASE PRICE
If Optionee exercises this Option, the purchase price
for the Property shall be: $______________
Payment shall be made at closing as follows:
[ ] Cash at closing
[ ] Certified/cashier's check
[ ] Wire transfer
[ ] Financing — Optionee shall secure financing within
    _____ days of exercising the Option

6. EXERCISE OF OPTION
To exercise this Option, Optionee must deliver written
notice to Optionor before the expiration of the Option
Period. Upon exercise, both parties shall be bound to
close the transaction under the terms stated herein.
Notice shall be delivered to:
Address: ______________________________________________
Email: _______________________________________________
Exercise is effective upon delivery of written notice.

7. CLOSING
Closing shall occur within _____ days after Optionee
exercises the Option, at a title company/closing agent
mutually agreed upon by the parties.
Title Company: ________________________________________
Address: ______________________________________________

8. TITLE
Optionor shall convey marketable and insurable title,
free and clear of liens, encumbrances, and defects,
except: _______________________________________________
Title insurance shall be provided at Optionor's expense.

9. PROPERTY CONDITION
The Property is offered in AS-IS, WHERE-IS condition.
Optionee shall have the right to inspect the Property
during the Option Period. Optionor shall maintain the
Property in its current condition during the Option
Period and shall not allow any additional liens or
encumbrances.

10. ASSIGNMENT
Optionee may assign this Option to a third party without
the consent of Optionor. Upon assignment, the Assignee
shall assume all rights and obligations of Optionee.
Assignment fee (if any): $______________
The assignment fee shall be paid through the title
company at closing.

11. DEFAULT
If Optionee fails to exercise the Option within the
Option Period, this Agreement terminates automatically,
and Optionor retains the option consideration as full
compensation.
If Optionor refuses to sell after Optionee properly
exercises the Option, Optionee may:
(a) Seek specific performance
(b) Seek damages including lost profits and the return
    of option consideration
(c) Pursue any other remedy available at law or in equity

12. RECORDING
[ ] This Option may be recorded against the Property
    (recommended to protect Optionee's interest)
[ ] This Option shall NOT be recorded

13. MEMORANDUM OF OPTION
Optionee may record a Memorandum of Option in the public
records to provide notice of Optionee's interest in the
Property. Optionor agrees to execute such Memorandum
upon request.

14. OPTIONOR'S COVENANTS
During the Option Period, Optionor shall:
(a) Not sell, encumber, or transfer the Property
(b) Not enter into any lease or agreement affecting
    the Property without Optionee's written consent
(c) Maintain all existing insurance on the Property
(d) Pay all taxes and assessments as they become due
(e) Notify Optionee of any material changes affecting
    the Property

15. GOVERNING LAW
This Agreement shall be governed by the laws of the
State of ${stateName}.

16. ENTIRE AGREEMENT
This Agreement constitutes the entire understanding
between the parties. Amendments must be in writing
and signed by both parties.

IN WITNESS WHEREOF, the parties have executed this
Agreement as of the date first written above.

OPTIONOR (Property Owner):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________

OPTIONEE (Buyer/Investor):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________
Entity: _____________________________________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney before
using any contract on a live deal.
© 2026 Flip the Contract. All rights reserved.`
}

function generateProofOfFunds(): string {
  return `PROOF OF FUNDS LETTER

Date: _____________, 20_____

To Whom It May Concern:

RE: Proof of Funds for Real Estate Purchase

This letter serves as verification that the undersigned
buyer/entity has access to sufficient funds to complete
the purchase of real estate.

BUYER INFORMATION:
Name: _________________________________________________
Entity: _______________________________________________
Address: ______________________________________________
Phone: _________________ Email: ______________________

FINANCIAL VERIFICATION:
[ ] Bank Account Balance
    Institution: ______________________________________
    Account Type: _____________________________________
    Available Balance: $_______________
    As of Date: _________________, 20_____

[ ] Line of Credit / HELOC
    Institution: ______________________________________
    Available Credit: $_______________
    Expiration: _________________, 20_____

[ ] Private/Hard Money Lender Pre-Approval
    Lender: ___________________________________________
    Pre-Approved Amount: $_______________
    Contact: __________________________________________
    Phone: _____________________________________________

[ ] Transactional Funding
    Funding Company: __________________________________
    Pre-Approved Amount: $_______________
    Contact: __________________________________________

[ ] Self-Directed IRA / 401(k)
    Custodian: _________________________________________
    Available Balance: $_______________

TOTAL AVAILABLE FUNDS: $_______________

PURPOSE:
These funds are available for the purpose of purchasing
real estate and related closing costs.

PROPERTY (if applicable):
Address: ______________________________________________

CERTIFICATION:
I hereby certify that the above information is true and
accurate to the best of my knowledge as of the date
stated herein. The funds referenced above are currently
available, unencumbered, and shall remain on deposit or
available through the closing date of the contemplated
transaction. This letter does not constitute a commitment
to lend or a guarantee of funds, but rather a verified
statement of available resources. This certification may
be relied upon by the Seller or Seller's agent solely
for the purpose of evaluating this real estate
transaction.

Buyer Signature: ______________________ Date: _________
Printed Name: _______________________________________
Entity (if applicable): ______________________________

Bank/Lender Verification (if available):
Officer: _________________________ Date: ______________
Institution: _________________________________________
Phone: _______________________________________________

---
This document is for educational purposes only.
Always consult your financial institution for official
proof of funds documentation.
© 2026 Flip the Contract. All rights reserved.`
}

function generateMemorandum(stateName: string): string {
  return `MEMORANDUM OF PURCHASE AND SALE AGREEMENT

STATE OF ${stateName.toUpperCase()}
COUNTY OF ________________________

KNOW ALL MEN BY THESE PRESENTS:

That on _____________, 20_____, an Agreement of Purchase and Sale
was entered into by and between:

SELLER(S): _________________________________________________
Address: __________________________________________________

AND

BUYER(S): __________________________________________________
Entity: ____________________________________________________
Address: __________________________________________________

Regarding the real property located at:
Property Address: _________________________________________
City: _________________ State: ${stateName} Zip: ________
Legal Description: ________________________________________
APN/Parcel #: _____________________________________________

NOTICE IS HEREBY GIVEN that Buyer has a valid, equitable interest
in the above-described Property by virtue of said Agreement.
Any third party dealing with said Property must contact Buyer
prior to attempting to close any transaction involving the Property.

This Memorandum is being recorded to provide constructive notice
of Buyer's interest in the Property. A copy of the unrecorded
Agreement is in the possession of Buyer and may be reviewed
upon written request.

PRIORITY AND DISCHARGE:
This Memorandum shall have priority from the date and time of
recording. Upon closing of the transaction contemplated by the
Agreement, or upon written release executed by Buyer, this
Memorandum shall be discharged of record. If the Agreement is
terminated for any reason, Buyer shall execute and deliver a
release or satisfaction of this Memorandum within ten (10)
business days of termination, and Buyer authorizes the Title
Company to record such release. All existing lienholders of
record are hereby placed on notice of Buyer's equitable interest.

IN WITNESS WHEREOF, the Buyer has executed this Memorandum
as of the date written below.

BUYER(S):
Signature: _________________________ Date: ___________
Printed Name: _______________________________________
Title (if Entity): __________________________________

NOTARY ACKNOWLEDGMENT
STATE OF ${stateName.toUpperCase()}
COUNTY OF ________________________

On this _____ day of _______________, 20_____, before me,
a Notary Public in and for said State, personally appeared
__________________________________________, known to me
(or satisfactorily proven) to be the person whose name is
subscribed to the within instrument, and acknowledged that
he/she executed the same for the purposes therein contained.

__________________________________________
Notary Public
My Commission Expires: _________________

---
This document is for educational purposes only.
Always consult a licensed real estate attorney before
recording any documents against title.
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
  toast.success(`Downloaded ${filename.replace(/_/g, ' ').replace('.txt', '')}`)
}

function StateCard({ state, onSelect }: { state: (typeof STATES)[number]; onSelect: (id: string) => void }) {
  return (
    <div className="resource-card" style={{ borderRadius: 10, padding: 20, marginBottom: 12 }}>
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
        <div style={{ flex: 1, minWidth: 220 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 8 }}>
            <span style={{ fontSize: 24 }}>{state.flag}</span>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
              {state.name}
            </h3>
            <span className="badge badge-orange">Wholesale Contract</span>
          </div>
          <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7, margin: 0 }}>{state.notes}</p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          <button
            onClick={() => downloadText(`Purchase_Agreement_${state.name.replace(/\s+/g, '_')}.txt`, generatePurchaseContract(state.name))}
            className="btn-download btn-pdf"
          >
            <Download size={13} /> Purchase Agreement
          </button>
          <button
            onClick={() => downloadText(`Assignment_Addendum_${state.name.replace(/\s+/g, '_')}.txt`, generateAssignmentAddendum(state.name))}
            className="btn-download btn-word"
          >
            <FileText size={13} /> Assignment Addendum
          </button>
          <button
            onClick={() => downloadText(`Double_Close_Agreement_${state.name.replace(/\s+/g, '_')}.txt`, generateDoubleCloseAgreement(state.name))}
            className="btn-download"
            style={{
              background: 'rgba(45,184,133,0.12)', border: '1px solid #5cb885', color: '#5cb885',
            }}
          >
            <Download size={13} /> Double Close Agreement
          </button>
          <button
            onClick={() => downloadText(`Letter_of_Intent_${state.name.replace(/\s+/g, '_')}.txt`, generateLetterOfIntent(state.name))}
            className="btn-download"
            style={{
              background: 'rgba(90,154,214,0.12)', border: '1px solid #5a9ad6', color: '#5a9ad6',
            }}
          >
            <Download size={13} /> Letter of Intent (LOI)
          </button>
          <button
            onClick={() => downloadText(`Non_Circumvent_NDA_${state.name.replace(/\s+/g, '_')}.txt`, generateNonCircumvent(state.name))}
            className="btn-download"
            style={{
              background: 'rgba(168,85,247,0.12)', border: '1px solid #a855f7', color: '#a855f7',
            }}
          >
            <Download size={13} /> Non-Circumvent / NDA
          </button>
          <button
            onClick={() => downloadText(`Option_to_Purchase_${state.name.replace(/\s+/g, '_')}.txt`, generateOptionToPurchase(state.name))}
            className="btn-download"
            style={{
              background: 'rgba(234,179,8,0.12)', border: '1px solid #eab308', color: '#eab308',
            }}
          >
            <Download size={13} /> Option to Purchase
          </button>
          <button
            onClick={() => downloadText(`Memorandum_of_Contract_${state.name.replace(/\s+/g, '_')}.txt`, generateMemorandum(state.name))}
            className="btn-download"
            style={{
              background: 'rgba(239,68,68,0.12)', border: '1px solid #ef4444', color: '#ef4444',
            }}
          >
            <FileText size={13} /> Memorandum of Contract
          </button>

          <button
            onClick={() => onSelect(state.id)}
            className="btn-ghost"
            style={{ padding: '8px 14px', fontSize: 12, textAlign: 'center' }}
          >
            Preview
          </button>
        </div>
      </div>
    </div>
  )
}

export default function ContractTemplates() {
  const [search, setSearch] = useState('')
  const [previewState, setPreviewState] = useState<string | null>(null)
  const [previewType, setPreviewType] = useState<'purchase' | 'assignment' | 'doubleclose' | 'loi' | 'noncircumvent' | 'option' | 'memorandum'>('purchase')
  const [editedContent, setEditedContent] = useState<string>('')
  const [isEditing, setIsEditing] = useState(false)

  const filtered = STATES.filter(s =>
    !search || s.name.toLowerCase().includes(search.toLowerCase()) || s.id.includes(search.toLowerCase())
  )

  const previewStateObj = STATES.find(s => s.id === previewState)

  const getOriginalContent = (type: string, stateName: string): string => {
    const fns: Record<string, () => string> = {
      purchase: () => generatePurchaseContract(stateName),
      assignment: () => generateAssignmentAddendum(stateName),
      doubleclose: () => generateDoubleCloseAgreement(stateName),
      loi: () => generateLetterOfIntent(stateName),
      noncircumvent: () => generateNonCircumvent(stateName),
      option: () => generateOptionToPurchase(stateName),
      memorandum: () => generateMemorandum(stateName),
    }
    return fns[type]?.() ?? ''
  }

  return (
    <div>
      <h2 className="section-header">Contract Templates</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        State-specific wholesale purchase &amp; assignment contracts for all 50 states + D.C. Click to download or preview.
      </p>

      <InfoBox type="warn">
        These templates are for educational purposes. Always consult a licensed real estate attorney in your state before using any contract on a live deal.
      </InfoBox>
      <InfoBox type="tip">
        When assigning a contract, attach a separate Assignment of Contract addendum. Both buyer and seller must sign. The assignment fee is typically disclosed at closing.
      </InfoBox>

      {/* Download-all buttons */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 24, flexWrap: 'wrap' }}>
        <button
          onClick={() => {
            const allContracts = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — PURCHASE AND SALE AGREEMENT\n${'='.repeat(60)}\n\n${generatePurchaseContract(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Purchase_Agreements.txt', allContracts)
          }}
          className="btn-orange"
          style={{ padding: '10px 20px', fontSize: 13 }}
        >
          <Download size={14} /> All Purchase Agreements
        </button>
        <button
          onClick={() => {
            const allAddendums = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — ASSIGNMENT ADDENDUM\n${'='.repeat(60)}\n\n${generateAssignmentAddendum(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Assignment_Addendums.txt', allAddendums)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
        >
          <Download size={14} /> All Assignment Addendums
        </button>
        <button
          onClick={() => {
            const allDC = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — DOUBLE CLOSE AGREEMENT\n${'='.repeat(60)}\n\n${generateDoubleCloseAgreement(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Double_Close_Agreements.txt', allDC)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#5cb885', color: '#5cb885' }}
        >
          <Download size={14} /> All Double Close Agreements
        </button>
        <button
          onClick={() => {
            const allLOI = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — LETTER OF INTENT\n${'='.repeat(60)}\n\n${generateLetterOfIntent(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Letters_of_Intent.txt', allLOI)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#5a9ad6', color: '#5a9ad6' }}
        >
          <Download size={14} /> All Letters of Intent
        </button>
        <button
          onClick={() => downloadText('Proof_of_Funds_Letter.txt', generateProofOfFunds())}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#a855f7', color: '#a855f7' }}
        >
          <Download size={14} /> Proof of Funds Letter
        </button>
        <button
          onClick={() => {
            const allNDA = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — NON-CIRCUMVENT / NDA\n${'='.repeat(60)}\n\n${generateNonCircumvent(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Non_Circumvent_NDA.txt', allNDA)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#c084fc', color: '#c084fc' }}
        >
          <Download size={14} /> All Non-Circumvent / NDAs
        </button>
        <button
          onClick={() => {
            const allOption = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — OPTION TO PURCHASE\n${'='.repeat(60)}\n\n${generateOptionToPurchase(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Option_to_Purchase.txt', allOption)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#eab308', color: '#eab308' }}
        >
          <Download size={14} /> All Option to Purchase
        </button>
        <button
          onClick={() => {
            const allMemo = STATES.map(s =>
              `${'='.repeat(60)}\n${s.name.toUpperCase()} — MEMORANDUM OF CONTRACT\n${'='.repeat(60)}\n\n${generateMemorandum(s.name)}\n\n\n`
            ).join('')
            downloadText('All_State_Memorandum_of_Contract.txt', allMemo)
          }}
          className="btn-ghost"
          style={{ padding: '10px 20px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6, borderColor: '#ef4444', color: '#ef4444' }}
        >
          <Download size={14} /> All Memorandums
        </button>

      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
        <input
          className="input-dark"
          placeholder="Search states..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 34 }}
        />
      </div>

      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
        Showing {filtered.length} of {STATES.length} states
      </div>

      {/* Standard Wholesale Purchase & Sale Agreement - master template */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <div style={{ fontSize: 11, color: '#ff7e5f', fontWeight: 700, letterSpacing: '0.08em' }}>
              MASTER TEMPLATE — STANDARD WHOLESALE PURCHASE &amp; SALE AGREEMENT
            </div>
            <div style={{ fontSize: 12, color: '#666', marginTop: 4 }}>
              Generic template — fill in your state. Or download state-specific versions below.
            </div>
          </div>
          <button
            onClick={() => downloadText('Wholesale_Purchase_Agreement_Generic.txt', generatePurchaseContract('______________'))}
            className="btn-download btn-pdf"
          >
            <Download size={13} /> Download Generic Template
          </button>
        </div>
      </div>

      <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 16 }}>
        State-Specific Templates (All 50 States + D.C.)
      </h3>

      {filtered.map(s => <StateCard key={s.id} state={s} onSelect={(id) => { setPreviewState(id); setEditedContent(''); setIsEditing(false) }} />)}

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: 40, color: '#555' }}>
          <p>No states found matching "{search}"</p>
        </div>
      )}

      {/* Preview overlay */}
      {previewStateObj && (
        <div style={{ marginTop: 24, background: '#1a2030', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, flexWrap: 'wrap', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <MapPin size={20} color="#ff7e5f" />
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
                {previewStateObj.name} — Contract Preview
              </h3>
            </div>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {([
                { key: 'purchase' as const, label: 'Purchase', color: '#ff7e5f' },
                { key: 'assignment' as const, label: 'Assignment', color: '#ffb347' },
                { key: 'doubleclose' as const, label: 'Double Close', color: '#5cb885' },
                { key: 'loi' as const, label: 'LOI', color: '#5a9ad6' },
                { key: 'noncircumvent' as const, label: 'NDA/Non-Circumvent', color: '#a855f7' },
                { key: 'option' as const, label: 'Option to Purchase', color: '#eab308' },
                { key: 'memorandum' as const, label: 'Memorandum', color: '#ef4444' },
              ]).map(btn => (
                <button
                  key={btn.key}
                  onClick={() => {
                    setPreviewType(btn.key)
                    setEditedContent(getOriginalContent(btn.key, previewStateObj.name))
                    setIsEditing(false)
                  }}
                  style={{
                    padding: '6px 12px', borderRadius: 6, border: '1px solid',
                    borderColor: previewType === btn.key ? btn.color : '#3d4e65',
                    background: previewType === btn.key ? `${btn.color}25` : 'transparent',
                    color: previewType === btn.key ? btn.color : '#888',
                    cursor: 'pointer', fontSize: 11, fontWeight: 600,
                  }}
                >
                  {btn.label}
                </button>
              ))}
              <button
                onClick={() => {
                  const names: Record<string, string> = {
                    purchase: 'Purchase_Agreement',
                    assignment: 'Assignment_Addendum',
                    doubleclose: 'Double_Close_Agreement',
                    loi: 'Letter_of_Intent',
                    noncircumvent: 'Non_Circumvent_NDA',
                    option: 'Option_to_Purchase',
                    memorandum: 'Memorandum_of_Contract',
                  }
                  downloadText(`${names[previewType]}_${previewStateObj.name.replace(/\s+/g, '_')}.txt`, editedContent || getOriginalContent(previewType, previewStateObj.name))
                }}
                className="btn-download btn-pdf"
              >
                <Download size={13} /> Download
              </button>
              <button
                onClick={() => window.print()}
                className="btn-download btn-pdf"
              >
                <Printer size={13} /> Print
              </button>
              <button
                onClick={() => { setPreviewState(null); setEditedContent(''); setIsEditing(false) }}
                className="btn-ghost"
                style={{ padding: '6px 14px', fontSize: 12 }}
              >
                Close
              </button>
            </div>
          </div>
          <div style={{ fontSize: 11, fontWeight: 600, color: isEditing ? '#ff7e5f' : '#666', marginBottom: 6, letterSpacing: '0.03em' }}>
            {isEditing ? 'EDITING — customize the template below' : 'Click the text below to edit'}
          </div>
          <textarea
            value={editedContent || getOriginalContent(previewType, previewStateObj.name)}
            onChange={(e) => {
              setEditedContent(e.target.value)
              if (!isEditing) setIsEditing(true)
            }}
            onFocus={() => {
              if (!editedContent) {
                setEditedContent(getOriginalContent(previewType, previewStateObj.name))
              }
              setIsEditing(true)
            }}
            onBlur={() => setIsEditing(false)}
            style={{
              width: '100%', boxSizing: 'border-box' as const,
              whiteSpace: 'pre-wrap', wordWrap: 'break-word',
              fontSize: 13, lineHeight: 1.7, color: '#ccc',
              background: isEditing ? '#111' : '#1a2030',
              border: isEditing ? '1px solid #ff7e5f' : '1px solid #2e3a4d',
              borderRadius: 8, padding: 16,
              minHeight: 300, maxHeight: 500, overflowY: 'auto' as const,
              fontFamily: "'DM Sans', sans-serif",
              resize: 'vertical' as const,
              outline: 'none',
              transition: 'border-color 0.2s, background 0.2s',
            }}
          />
          {/* Print-friendly content (hidden on screen, shown when printing) */}
          <div className="contract-print-content print-only">
            <div className="print-header">
              <h1>Flip the Contract</h1>
              <p>{previewStateObj.name} — {
                { purchase: 'Wholesale Purchase Agreement', assignment: 'Assignment Addendum', doubleclose: 'Double Close Agreement', loi: 'Letter of Intent', noncircumvent: 'Non-Circumvent / NDA', option: 'Option to Purchase', memorandum: 'Memorandum of Contract' }[previewType]
              }</p>
            </div>
            {(editedContent || getOriginalContent(previewType, previewStateObj.name))}
          </div>
          {editedContent && editedContent !== getOriginalContent(previewType, previewStateObj.name) && (
            <button
              onClick={() => {
                setEditedContent(getOriginalContent(previewType, previewStateObj.name))
                setIsEditing(false)
              }}
              style={{
                marginTop: 8, padding: '6px 14px', fontSize: 11, fontWeight: 600,
                background: 'transparent', border: '1px solid #ff7e5f', color: '#ff7e5f',
                borderRadius: 6, cursor: 'pointer',
              }}
            >
              Reset to Original
            </button>
          )}
        </div>
      )}

      <InfoBox type="note">
        Need a state not listed here? Request a specific state template using the 1-on-1 call booking tab.
      </InfoBox>
    </div>
  )
}
