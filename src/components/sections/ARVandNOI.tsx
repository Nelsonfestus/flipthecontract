import { useState } from 'react'
import { Calculator } from 'lucide-react'
import AdvancedCompCalc from './AdvancedCompCalc'

function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', label: 'TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', label: 'WARNING', color: '#c47a1a' },
    note: { cls: 'info-note', label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{cfg.label}</span>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

function fmt(n: number) {
  if (!n && n !== 0) return '–'
  return n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
}

function ARVCalc() {
  const [arv, setArv] = useState('')
  const [repairs, setRepairs] = useState('')
  const [fee, setFee] = useState('')
  const [pct, setPct] = useState('70')

  const arvN = parseFloat(arv) || 0
  const repN = parseFloat(repairs) || 0
  const feeN = parseFloat(fee) || 0
  const pctN = parseFloat(pct) || 70

  const mao = arvN * (pctN / 100) - repN - feeN
  const investorProfit = arvN - mao - repN - arvN * 0.08 // rough holding/selling costs

  return (
    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Calculator size={20} color="#ff7e5f" />
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: 0 }}>
          ARV / MAO Calculator
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>ARV ($)</label>
          <input className="input-dark" type="number" placeholder="150000" value={arv} onChange={e => setArv(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Estimated Repairs ($)</label>
          <input className="input-dark" type="number" placeholder="25000" value={repairs} onChange={e => setRepairs(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Your Assignment Fee ($)</label>
          <input className="input-dark" type="number" placeholder="10000" value={fee} onChange={e => setFee(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Investor Rule (%)</label>
          <input className="input-dark" type="number" placeholder="70" value={pct} onChange={e => setPct(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {[
          { label: 'ARV', value: fmt(arvN), color: '#f5f0eb' },
          { label: `${pctN}% of ARV`, value: fmt(arvN * (pctN/100)), color: '#ffb347' },
          { label: '− Repairs', value: fmt(repN), color: '#e05050' },
          { label: '− Assignment Fee', value: fmt(feeN), color: '#e05050' },
          { label: 'Max Offer (MAO)', value: mao > 0 ? fmt(mao) : 'Deal doesn\'t work', color: mao > 0 ? '#5cb885' : '#e05050' },
          { label: 'Est. Investor Profit', value: investorProfit > 0 ? fmt(investorProfit) : '–', color: '#ffb347' },
        ].map(item => (
          <div key={item.label} style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: item.color, letterSpacing: '0.04em' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function NOICalc() {
  const [rent, setRent] = useState('')
  const [vacancy, setVacancy] = useState('5')
  const [expenses, setExpenses] = useState('')
  const [capRate, setCapRate] = useState('8')

  const rentN = parseFloat(rent) || 0
  const vacancyN = parseFloat(vacancy) || 5
  const expN = parseFloat(expenses) || 0
  const capN = parseFloat(capRate) || 8

  const grossIncome = rentN * 12
  const effectiveIncome = grossIncome * (1 - vacancyN / 100)
  const noi = effectiveIncome - expN
  const impliedValue = capN > 0 ? noi / (capN / 100) : 0

  return (
    <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
        <Calculator size={20} color="#ffb347" />
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ffb347', letterSpacing: '0.04em', margin: 0 }}>
          NOI / Cap Rate Calculator
        </h3>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginBottom: 20 }}>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Monthly Rent ($)</label>
          <input className="input-dark" type="number" placeholder="1500" value={rent} onChange={e => setRent(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Vacancy Rate (%)</label>
          <input className="input-dark" type="number" placeholder="5" value={vacancy} onChange={e => setVacancy(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Annual Operating Expenses ($)</label>
          <input className="input-dark" type="number" placeholder="5000" value={expenses} onChange={e => setExpenses(e.target.value)} />
        </div>
        <div>
          <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Market Cap Rate (%)</label>
          <input className="input-dark" type="number" placeholder="8" value={capRate} onChange={e => setCapRate(e.target.value)} />
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 10 }}>
        {[
          { label: 'Gross Annual Income', value: fmt(grossIncome), color: '#f5f0eb' },
          { label: `Effective Income (−${vacancyN}% vacancy)`, value: fmt(effectiveIncome), color: '#ffb347' },
          { label: '− Operating Expenses', value: fmt(expN), color: '#e05050' },
          { label: 'NOI', value: fmt(noi), color: noi > 0 ? '#5cb885' : '#e05050' },
          { label: `Implied Value @ ${capN}% Cap`, value: impliedValue > 0 ? fmt(impliedValue) : '–', color: '#ff7e5f' },
        ].map(item => (
          <div key={item.label} style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 6, padding: 12 }}>
            <div style={{ fontSize: 11, color: '#888', marginBottom: 4 }}>{item.label}</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: item.color, letterSpacing: '0.04em' }}>
              {item.value}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

const EXAMPLES = [
  {
    title: 'Example 1: Phoenix SFR Flip',
    arv: 280000, repairs: 35000, fee: 12000, pct: 70,
    desc: 'Single-family residence in Phoenix. 3/2, 1,400 sqft. Light cosmetic rehab needed.',
  },
  {
    title: 'Example 2: Atlanta Buy & Hold',
    rent: 1800, vacancy: 5, expenses: 6000, capRate: 8,
    desc: 'Atlanta duplex. Both units occupied. Evaluating as long-term rental hold.',
  },
]

export default function ARVandNOI() {
  return (
    <div>
      <h2 className="section-header">ARV & NOI Training</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Master the two most critical numbers in wholesale real estate: ARV (After Repair Value) for flips and NOI (Net Operating Income) for rentals. Use the calculators below on live deals.
      </p>

      <InfoBox type="note">
        ARV is for wholesale/flip deals. NOI is for buy-and-hold/rental analysis. Know which metric applies to your end buyer's strategy.
      </InfoBox>

      {/* ARV Formula */}
      <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.04em', marginBottom: 12 }}>
          The 70% Rule Formula
        </h3>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 15, color: '#f5f0eb', lineHeight: 2, background: '#12161c', padding: 16, borderRadius: 6, border: '1px solid #3d4e65' }}>
          <span style={{ color: '#5cb885' }}>MAO</span> = (ARV × <span style={{ color: '#ffb347' }}>70%</span>) − <span style={{ color: '#e05050' }}>Repairs</span> − <span style={{ color: '#e05050' }}>Assignment Fee</span>
          <br />
          <span style={{ color: '#555', fontSize: 12 }}>{'// Maximum Allowable Offer you can pay the seller'}</span>
          <br /><br />
          <span style={{ color: '#555', fontSize: 12 }}>{'// Example: ARV $200k, $20k repairs, $10k fee'}</span>
          <br />
          <span style={{ color: '#5cb885' }}>MAO</span> = ($200,000 × 0.70) − $20,000 − $10,000 = <span style={{ color: '#ff7e5f', fontWeight: 700 }}>$110,000</span>
        </div>
      </div>

      <ARVCalc />

      {/* Advanced Comp Calculator */}
      <div className="labeled-divider">Advanced Comp Analysis</div>
      <AdvancedCompCalc />

      {/* NOI Formula */}
      <div style={{ background: '#2e3a4d', border: '1px solid #3d4e65', borderRadius: 8, padding: 20, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
          NOI & Cap Rate Formula
        </h3>
        <div style={{ fontFamily: "'Courier Prime', monospace", fontSize: 15, color: '#f5f0eb', lineHeight: 2, background: '#12161c', padding: 16, borderRadius: 6, border: '1px solid #3d4e65' }}>
          <span style={{ color: '#5cb885' }}>NOI</span> = Gross Income − <span style={{ color: '#e05050' }}>Operating Expenses</span>
          <br />
          <span style={{ color: '#5cb885' }}>Cap Rate</span> = NOI ÷ Property Value
          <br />
          <span style={{ color: '#5cb885' }}>Property Value</span> = NOI ÷ Cap Rate
          <br /><br />
          <span style={{ color: '#555', fontSize: 12 }}>{'// Example: NOI $18,000/yr, 8% cap rate market'}</span>
          <br />
          <span style={{ color: '#5cb885' }}>Value</span> = $18,000 ÷ 0.08 = <span style={{ color: '#ffb347', fontWeight: 700 }}>$225,000</span>
        </div>
      </div>

      <NOICalc />

      <InfoBox type="tip">
        When evaluating a deal for a rental investor buyer, calculate the NOI and present the implied cap rate. Most rental investors in secondary markets want a 6–10% cap rate. In major metros, 4–6% is typical.
      </InfoBox>
    </div>
  )
}
