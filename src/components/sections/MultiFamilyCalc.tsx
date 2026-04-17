import { useState, useCallback } from 'react'
import {
  Building2, DollarSign, TrendingUp, Download, Wrench,
  PlusCircle, Trash2, Calculator, Percent, PiggyBank,
  FileDown, RotateCcw,
} from 'lucide-react'

/* ── helpers ─────────────────────────────────────────────────── */
function fmt(n: number) {
  if (!n && n !== 0) return '$0'
  return '$' + Math.round(n).toLocaleString('en-US')
}

function pct(n: number) {
  if (!isFinite(n)) return '0.0%'
  return (n * 100).toFixed(1) + '%'
}

function numInput(value: number, setter: (v: number) => void, opts?: { min?: number; step?: number; prefix?: string }) {
  return (
    <div style={{ position: 'relative' }}>
      {opts?.prefix && (
        <span style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#6b6560', fontSize: 14, pointerEvents: 'none' }}>
          {opts.prefix}
        </span>
      )}
      <input
        type="number"
        value={value || ''}
        onChange={e => setter(Number(e.target.value) || 0)}
        min={opts?.min ?? 0}
        step={opts?.step ?? 1}
        style={{
          width: '100%',
          padding: opts?.prefix ? '10px 12px 10px 24px' : '10px 12px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid #3d4e65',
          borderRadius: 8,
          color: '#f5f0eb',
          fontSize: 14,
          fontFamily: "'DM Sans', sans-serif",
          outline: 'none',
          transition: 'border-color 0.2s',
        }}
        onFocus={e => { e.currentTarget.style.borderColor = '#ff7e5f' }}
        onBlur={e => { e.currentTarget.style.borderColor = '#3d4e65' }}
      />
    </div>
  )
}

/* ── types ────────────────────────────────────────────────────── */
interface UnitRow {
  id: number
  label: string
  monthlyRent: number
  occupied: boolean
}

interface ExpenseRow {
  id: number
  label: string
  annual: number
}

const DEFAULT_EXPENSES: ExpenseRow[] = [
  { id: 1, label: 'Property Taxes', annual: 0 },
  { id: 2, label: 'Insurance', annual: 0 },
  { id: 3, label: 'Property Management', annual: 0 },
  { id: 4, label: 'Maintenance / Repairs Reserve', annual: 0 },
  { id: 5, label: 'Utilities (Owner-Paid)', annual: 0 },
  { id: 6, label: 'Vacancy Allowance', annual: 0 },
]

let _unitId = 4
let _expId = 7

/* ── component ───────────────────────────────────────────────── */
export default function MultiFamilyCalc() {
  /* ── state ── */
  const [propertyName, setPropertyName] = useState('')
  const [address, setAddress] = useState('')
  const [purchasePrice, setPurchasePrice] = useState(0)
  const [rehabCosts, setRehabCosts] = useState(0)
  const [downPaymentPct, setDownPaymentPct] = useState(25)
  const [interestRate, setInterestRate] = useState(7)
  const [loanTermYears, setLoanTermYears] = useState(30)
  const [closingCostsPct, setClosingCostsPct] = useState(3)

  const [units, setUnits] = useState<UnitRow[]>([
    { id: 1, label: 'Unit 1', monthlyRent: 0, occupied: true },
    { id: 2, label: 'Unit 2', monthlyRent: 0, occupied: true },
    { id: 3, label: 'Unit 3', monthlyRent: 0, occupied: false },
  ])

  const [expenses, setExpenses] = useState<ExpenseRow[]>(DEFAULT_EXPENSES)

  /* ── unit helpers ── */
  const addUnit = useCallback(() => {
    _unitId++
    setUnits(u => [...u, { id: _unitId, label: `Unit ${u.length + 1}`, monthlyRent: 0, occupied: true }])
  }, [])
  const removeUnit = useCallback((id: number) => setUnits(u => u.filter(r => r.id !== id)), [])
  const updateUnit = useCallback((id: number, patch: Partial<UnitRow>) => {
    setUnits(u => u.map(r => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  /* ── expense helpers ── */
  const addExpense = useCallback(() => {
    _expId++
    setExpenses(e => [...e, { id: _expId, label: 'New Expense', annual: 0 }])
  }, [])
  const removeExpense = useCallback((id: number) => setExpenses(e => e.filter(r => r.id !== id)), [])
  const updateExpense = useCallback((id: number, patch: Partial<ExpenseRow>) => {
    setExpenses(e => e.map(r => (r.id === id ? { ...r, ...patch } : r)))
  }, [])

  /* ── calculations ── */
  const grossMonthlyRent = units.reduce((s, u) => s + u.monthlyRent, 0)
  const grossAnnualRent = grossMonthlyRent * 12
  const occupiedMonthlyRent = units.filter(u => u.occupied).reduce((s, u) => s + u.monthlyRent, 0)
  const occupiedAnnualRent = occupiedMonthlyRent * 12
  const totalAnnualExpenses = expenses.reduce((s, e) => s + e.annual, 0)
  const noi = occupiedAnnualRent - totalAnnualExpenses
  const capRate = purchasePrice > 0 ? noi / purchasePrice : 0

  // Financing
  const downPayment = purchasePrice * (downPaymentPct / 100)
  const loanAmount = purchasePrice - downPayment
  const closingCosts = purchasePrice * (closingCostsPct / 100)
  const totalCashInvested = downPayment + closingCosts + rehabCosts
  const monthlyRate = interestRate / 100 / 12
  const numPayments = loanTermYears * 12
  const monthlyMortgage = loanAmount > 0 && monthlyRate > 0
    ? loanAmount * (monthlyRate * Math.pow(1 + monthlyRate, numPayments)) / (Math.pow(1 + monthlyRate, numPayments) - 1)
    : 0
  const annualDebtService = monthlyMortgage * 12
  const annualCashFlow = noi - annualDebtService
  const monthlyCashFlow = annualCashFlow / 12
  const cashOnCashReturn = totalCashInvested > 0 ? annualCashFlow / totalCashInvested : 0
  const dscr = annualDebtService > 0 ? noi / annualDebtService : 0
  const expenseRatio = grossAnnualRent > 0 ? totalAnnualExpenses / grossAnnualRent : 0
  const pricePerUnit = units.length > 0 ? purchasePrice / units.length : 0
  const grm = grossAnnualRent > 0 ? purchasePrice / grossAnnualRent : 0

  /* ── verdict ── */
  let verdictLabel = 'Needs Review'
  let verdictColor = '#f59e0b'
  if (capRate >= 0.08 && cashOnCashReturn >= 0.10 && dscr >= 1.25) {
    verdictLabel = 'Strong Deal'
    verdictColor = '#22c55e'
  } else if (capRate >= 0.06 && cashOnCashReturn >= 0.06 && dscr >= 1.1) {
    verdictLabel = 'Decent Deal'
    verdictColor = '#3b82f6'
  } else if (noi <= 0 || annualCashFlow < 0) {
    verdictLabel = 'Negative Cash Flow'
    verdictColor = '#ef4444'
  }

  /* ── reset ── */
  const resetAll = () => {
    setPropertyName(''); setAddress('')
    setPurchasePrice(0); setRehabCosts(0)
    setDownPaymentPct(25); setInterestRate(7); setLoanTermYears(30); setClosingCostsPct(3)
    setUnits([
      { id: 1, label: 'Unit 1', monthlyRent: 0, occupied: true },
      { id: 2, label: 'Unit 2', monthlyRent: 0, occupied: true },
      { id: 3, label: 'Unit 3', monthlyRent: 0, occupied: false },
    ])
    setExpenses(DEFAULT_EXPENSES.map(e => ({ ...e })))
  }

  /* ── download ── */
  const downloadReport = () => {
    const text = `MULTI-FAMILY PROPERTY ANALYSIS REPORT
Generated: ${new Date().toLocaleDateString()}
${'='.repeat(52)}

PROPERTY INFORMATION
  Property: ${propertyName || '(not entered)'}
  Address: ${address || '(not entered)'}
  Number of Units: ${units.length}

PURCHASE & REHAB
  Purchase Price: ${fmt(purchasePrice)}
  Rehab / Renovation Costs: ${fmt(rehabCosts)}
  Price Per Unit: ${fmt(pricePerUnit)}

FINANCING
  Down Payment (${downPaymentPct}%): ${fmt(downPayment)}
  Loan Amount: ${fmt(loanAmount)}
  Interest Rate: ${interestRate}%
  Loan Term: ${loanTermYears} years
  Monthly Mortgage Payment: ${fmt(monthlyMortgage)}
  Annual Debt Service: ${fmt(annualDebtService)}
  Closing Costs (${closingCostsPct}%): ${fmt(closingCosts)}
  Total Cash Invested: ${fmt(totalCashInvested)}

RENT ROLL
${units.map(u => `  ${u.label}: ${fmt(u.monthlyRent)}/mo — ${u.occupied ? 'Occupied' : 'Vacant'}`).join('\n')}
  ─────────────────────────────────
  Gross Monthly Rent: ${fmt(grossMonthlyRent)}
  Gross Annual Rent: ${fmt(grossAnnualRent)}
  Occupied Annual Rent: ${fmt(occupiedAnnualRent)}

OPERATING EXPENSES
${expenses.map(e => `  ${e.label}: ${fmt(e.annual)}/yr`).join('\n')}
  ─────────────────────────────────
  Total Annual Expenses: ${fmt(totalAnnualExpenses)}
  Expense Ratio: ${pct(expenseRatio)}

KEY METRICS
  Net Operating Income (NOI): ${fmt(noi)}
  Cap Rate: ${pct(capRate)}
  Annual Cash Flow: ${fmt(annualCashFlow)}
  Monthly Cash Flow: ${fmt(monthlyCashFlow)}
  Cash-on-Cash Return: ${pct(cashOnCashReturn)}
  Debt Service Coverage Ratio (DSCR): ${dscr.toFixed(2)}x
  Gross Rent Multiplier (GRM): ${grm.toFixed(2)}

DEAL VERDICT: ${verdictLabel}

---
Generated by Flip the Contract — Multi-Family Calculator
For educational purposes only. Always verify with your own due diligence.
© 2026 Flip the Contract. All rights reserved.`

    const blob = new Blob([text], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MultiFam_Analysis_${propertyName?.replace(/\s+/g, '_') || 'Property'}.txt`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  const downloadCSV = () => {
    const rows = [
      ['Multi-Family Property Analysis'],
      ['Generated', new Date().toLocaleDateString()],
      [],
      ['Property', propertyName || ''],
      ['Address', address || ''],
      ['Units', String(units.length)],
      [],
      ['Purchase Price', String(purchasePrice)],
      ['Rehab Costs', String(rehabCosts)],
      ['Down Payment %', String(downPaymentPct)],
      ['Interest Rate %', String(interestRate)],
      ['Loan Term (years)', String(loanTermYears)],
      ['Closing Costs %', String(closingCostsPct)],
      [],
      ['--- RENT ROLL ---'],
      ['Unit', 'Monthly Rent', 'Occupied'],
      ...units.map(u => [u.label, String(u.monthlyRent), u.occupied ? 'Yes' : 'No']),
      [],
      ['--- EXPENSES ---'],
      ['Expense', 'Annual Amount'],
      ...expenses.map(e => [e.label, String(e.annual)]),
      [],
      ['--- KEY METRICS ---'],
      ['Gross Annual Rent', String(grossAnnualRent)],
      ['Total Annual Expenses', String(totalAnnualExpenses)],
      ['NOI', String(noi)],
      ['Cap Rate', pct(capRate)],
      ['Annual Cash Flow', String(annualCashFlow)],
      ['Monthly Cash Flow', String(Math.round(monthlyCashFlow))],
      ['Cash-on-Cash Return', pct(cashOnCashReturn)],
      ['DSCR', dscr.toFixed(2)],
      ['GRM', grm.toFixed(2)],
      ['Verdict', verdictLabel],
    ]
    const csv = rows.map(r => r.map(c => `"${String(c).replace(/"/g, '""')}"`).join(',')).join('\n')
    const blob = new Blob([csv], { type: 'text/csv' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `MultiFam_Analysis_${propertyName?.replace(/\s+/g, '_') || 'Property'}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    URL.revokeObjectURL(url)
  }

  /* ── shared styles ── */
  const sectionCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.02)',
    border: '1px solid #3d4e65',
    borderRadius: 14,
    padding: '24px 20px',
    marginBottom: 20,
  }
  const sectionTitle: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif",
    fontSize: 20,
    letterSpacing: '0.04em',
    color: '#f5f0eb',
    marginBottom: 16,
    display: 'flex',
    alignItems: 'center',
    gap: 10,
  }
  const fieldLabel: React.CSSProperties = {
    fontSize: 12,
    color: '#9a918a',
    marginBottom: 6,
    fontFamily: "'DM Sans', sans-serif",
    fontWeight: 500,
  }
  const fieldGroup: React.CSSProperties = {
    marginBottom: 14,
  }
  const metricCard: React.CSSProperties = {
    background: 'rgba(255,255,255,0.03)',
    border: '1px solid #3d4e65',
    borderRadius: 10,
    padding: '16px 14px',
    textAlign: 'center' as const,
  }

  /* ── render ────────────────────────────────────────────────── */
  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8, flexWrap: 'wrap' }}>
          <div style={{
            width: 42, height: 42, borderRadius: 10,
            background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Building2 size={22} color="#fff" />
          </div>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(24px, 4vw, 32px)',
              letterSpacing: '0.04em',
              color: '#f5f0eb',
              margin: 0, lineHeight: 1.1,
            }}>
              Multi-Family Calculator
            </h2>
            <p style={{ fontSize: 13, color: '#6b6560', margin: 0, marginTop: 2 }}>
              Analyze rental properties — NOI, cap rate, cash flow & returns
            </p>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginTop: 12 }}>
          <button
            onClick={resetAll}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid #3d4e65', color: '#9a918a',
              cursor: 'pointer', fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <RotateCcw size={13} /> Reset All
          </button>
          <button
            onClick={downloadReport}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              border: 'none', color: '#fff',
              cursor: 'pointer', fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
              fontWeight: 600,
            }}
          >
            <Download size={13} /> Download Report
          </button>
          <button
            onClick={downloadCSV}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '8px 16px', borderRadius: 8,
              background: 'rgba(99,102,241,0.12)',
              border: '1px solid rgba(99,102,241,0.3)', color: '#a5b4fc',
              cursor: 'pointer', fontSize: 13,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <FileDown size={13} /> Download CSV
          </button>
        </div>
      </div>

      {/* ── Property Info ── */}
      <div style={sectionCard}>
        <div style={sectionTitle}><Building2 size={18} color="#8b5cf6" /> Property Information</div>
        <div className="mf-grid-2">
          <div style={fieldGroup}>
            <div style={fieldLabel}>Property Name</div>
            <input
              type="text"
              placeholder="e.g. Maple Street Triplex"
              value={propertyName}
              onChange={e => setPropertyName(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#ff7e5f' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#3d4e65' }}
            />
          </div>
          <div style={fieldGroup}>
            <div style={fieldLabel}>Address</div>
            <input
              type="text"
              placeholder="123 Main St, City, State"
              value={address}
              onChange={e => setAddress(e.target.value)}
              style={{
                width: '100%', padding: '10px 12px',
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                fontFamily: "'DM Sans', sans-serif", outline: 'none',
              }}
              onFocus={e => { e.currentTarget.style.borderColor = '#ff7e5f' }}
              onBlur={e => { e.currentTarget.style.borderColor = '#3d4e65' }}
            />
          </div>
        </div>
      </div>

      {/* ── Purchase & Rehab ── */}
      <div style={sectionCard}>
        <div style={sectionTitle}><DollarSign size={18} color="#22c55e" /> Purchase & Rehab</div>
        <div className="mf-grid-2">
          <div style={fieldGroup}>
            <div style={fieldLabel}>Purchase Price</div>
            {numInput(purchasePrice, setPurchasePrice, { prefix: '$' })}
          </div>
          <div style={fieldGroup}>
            <div style={fieldLabel}>Rehab / Renovation Costs</div>
            {numInput(rehabCosts, setRehabCosts, { prefix: '$' })}
          </div>
        </div>
      </div>

      {/* ── Financing ── */}
      <div style={sectionCard}>
        <div style={sectionTitle}><PiggyBank size={18} color="#f59e0b" /> Financing</div>
        <div className="mf-grid-4">
          <div style={fieldGroup}>
            <div style={fieldLabel}>Down Payment %</div>
            {numInput(downPaymentPct, setDownPaymentPct, { min: 0, step: 1 })}
          </div>
          <div style={fieldGroup}>
            <div style={fieldLabel}>Interest Rate %</div>
            {numInput(interestRate, setInterestRate, { min: 0, step: 0.25 })}
          </div>
          <div style={fieldGroup}>
            <div style={fieldLabel}>Loan Term (years)</div>
            {numInput(loanTermYears, setLoanTermYears, { min: 1 })}
          </div>
          <div style={fieldGroup}>
            <div style={fieldLabel}>Closing Costs %</div>
            {numInput(closingCostsPct, setClosingCostsPct, { min: 0, step: 0.5 })}
          </div>
        </div>
        <div className="mf-grid-3" style={{ marginTop: 10 }}>
          <div style={{ ...metricCard, borderColor: 'rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Down Payment</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb' }}>{fmt(downPayment)}</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Loan Amount</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb' }}>{fmt(loanAmount)}</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Monthly Mortgage</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb' }}>{fmt(monthlyMortgage)}</div>
          </div>
        </div>
      </div>

      {/* ── Rent Roll ── */}
      <div style={sectionCard}>
        <div style={{ ...sectionTitle, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <TrendingUp size={18} color="#3b82f6" /> Rent Roll
          </span>
          <button
            onClick={addUnit}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(59,130,246,0.12)',
              border: '1px solid rgba(59,130,246,0.3)',
              color: '#60a5fa', cursor: 'pointer', fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <PlusCircle size={13} /> Add Unit
          </button>
        </div>

        {units.map((unit) => (
          <div key={unit.id} style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            marginBottom: 10, flexWrap: 'wrap',
          }} className="mf-unit-row">
            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <div style={fieldLabel}>Unit Name</div>
              <input
                type="text"
                value={unit.label}
                onChange={e => updateUnit(unit.id, { label: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                  borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#ff7e5f' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#3d4e65' }}
              />
            </div>
            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <div style={fieldLabel}>Monthly Rent</div>
              {numInput(unit.monthlyRent, v => updateUnit(unit.id, { monthlyRent: v }), { prefix: '$' })}
            </div>
            <div style={{ flex: '0 0 auto', display: 'flex', alignItems: 'center', gap: 8, paddingBottom: 2 }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 6, cursor: 'pointer', fontSize: 13, color: unit.occupied ? '#22c55e' : '#ef4444' }}>
                <input
                  type="checkbox"
                  checked={unit.occupied}
                  onChange={e => updateUnit(unit.id, { occupied: e.target.checked })}
                  style={{ accentColor: '#22c55e' }}
                />
                {unit.occupied ? 'Occupied' : 'Vacant'}
              </label>
              {units.length > 1 && (
                <button
                  onClick={() => removeUnit(unit.id)}
                  style={{
                    background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                    borderRadius: 6, padding: 6, cursor: 'pointer', color: '#f87171',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}
                  aria-label={`Remove ${unit.label}`}
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          <div style={{ ...metricCard, flex: '1 1 140px', borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Gross Monthly Rent</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#60a5fa' }}>{fmt(grossMonthlyRent)}</div>
          </div>
          <div style={{ ...metricCard, flex: '1 1 140px', borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Gross Annual Rent</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#60a5fa' }}>{fmt(grossAnnualRent)}</div>
          </div>
          <div style={{ ...metricCard, flex: '1 1 140px', borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Occupied Annual Rent</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#60a5fa' }}>{fmt(occupiedAnnualRent)}</div>
          </div>
        </div>
      </div>

      {/* ── Expenses ── */}
      <div style={sectionCard}>
        <div style={{ ...sectionTitle, justifyContent: 'space-between', flexWrap: 'wrap' }}>
          <span style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Wrench size={18} color="#ef4444" /> Operating Expenses
          </span>
          <button
            onClick={addExpense}
            style={{
              display: 'flex', alignItems: 'center', gap: 6,
              padding: '6px 14px', borderRadius: 8,
              background: 'rgba(239,68,68,0.08)',
              border: '1px solid rgba(239,68,68,0.2)',
              color: '#f87171', cursor: 'pointer', fontSize: 12,
              fontFamily: "'DM Sans', sans-serif",
            }}
          >
            <PlusCircle size={13} /> Add Expense
          </button>
        </div>

        {expenses.map(exp => (
          <div key={exp.id} style={{
            display: 'flex', gap: 10, alignItems: 'flex-end',
            marginBottom: 10, flexWrap: 'wrap',
          }} className="mf-expense-row">
            <div style={{ flex: '1 1 200px', minWidth: 140 }}>
              <div style={fieldLabel}>Expense</div>
              <input
                type="text"
                value={exp.label}
                onChange={e => updateExpense(exp.id, { label: e.target.value })}
                style={{
                  width: '100%', padding: '10px 12px',
                  background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                  borderRadius: 8, color: '#f5f0eb', fontSize: 14,
                  fontFamily: "'DM Sans', sans-serif", outline: 'none',
                }}
                onFocus={e => { e.currentTarget.style.borderColor = '#ff7e5f' }}
                onBlur={e => { e.currentTarget.style.borderColor = '#3d4e65' }}
              />
            </div>
            <div style={{ flex: '1 1 140px', minWidth: 120 }}>
              <div style={fieldLabel}>Annual Amount</div>
              {numInput(exp.annual, v => updateExpense(exp.id, { annual: v }), { prefix: '$' })}
            </div>
            <div style={{ flex: '0 0 auto', paddingBottom: 2 }}>
              <button
                onClick={() => removeExpense(exp.id)}
                style={{
                  background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
                  borderRadius: 6, padding: 6, cursor: 'pointer', color: '#f87171',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}
                aria-label={`Remove ${exp.label}`}
              >
                <Trash2 size={14} />
              </button>
            </div>
          </div>
        ))}

        <div style={{ display: 'flex', gap: 16, marginTop: 14, flexWrap: 'wrap' }}>
          <div style={{ ...metricCard, flex: '1 1 160px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Total Annual Expenses</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f87171' }}>{fmt(totalAnnualExpenses)}</div>
          </div>
          <div style={{ ...metricCard, flex: '1 1 160px', borderColor: 'rgba(239,68,68,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Expense Ratio</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f87171' }}>{pct(expenseRatio)}</div>
          </div>
        </div>
      </div>

      {/* ── Key Metrics / Results ── */}
      <div style={{
        ...sectionCard,
        background: 'linear-gradient(135deg, rgba(99,102,241,0.06), rgba(139,92,246,0.04))',
        borderColor: 'rgba(99,102,241,0.2)',
      }}>
        <div style={sectionTitle}><Calculator size={18} color="#a5b4fc" /> Key Metrics & Results</div>

        {/* Verdict banner */}
        <div style={{
          background: `rgba(${verdictColor === '#22c55e' ? '34,197,94' : verdictColor === '#3b82f6' ? '59,130,246' : verdictColor === '#ef4444' ? '239,68,68' : '245,158,11'},0.1)`,
          border: `1px solid ${verdictColor}40`,
          borderRadius: 10,
          padding: '14px 18px',
          marginBottom: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          flexWrap: 'wrap',
        }}>
          <div style={{
            width: 38, height: 38, borderRadius: '50%',
            background: `${verdictColor}20`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <TrendingUp size={18} color={verdictColor} />
          </div>
          <div>
            <div style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 22, color: verdictColor,
              letterSpacing: '0.04em', lineHeight: 1,
            }}>
              {verdictLabel}
            </div>
            <div style={{ fontSize: 12, color: '#9a918a', marginTop: 2 }}>
              Based on cap rate, cash-on-cash return & DSCR
            </div>
          </div>
        </div>

        {/* Metrics grid */}
        <div className="mf-grid-3" style={{ gap: 12 }}>
          <div style={{ ...metricCard, borderColor: 'rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Net Operating Income</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: noi >= 0 ? '#22c55e' : '#ef4444' }}>{fmt(noi)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Annual</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(99,102,241,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Cap Rate</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#a5b4fc' }}>{pct(capRate)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>NOI / Purchase Price</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(245,158,11,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Cash-on-Cash Return</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#fbbf24' }}>{pct(cashOnCashReturn)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Cash Flow / Cash Invested</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(34,197,94,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Annual Cash Flow</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: annualCashFlow >= 0 ? '#22c55e' : '#ef4444' }}>{fmt(annualCashFlow)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>NOI − Debt Service</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(59,130,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Monthly Cash Flow</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: monthlyCashFlow >= 0 ? '#60a5fa' : '#ef4444' }}>{fmt(monthlyCashFlow)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Per month</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(139,92,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>DSCR</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: dscr >= 1.25 ? '#a78bfa' : dscr >= 1.0 ? '#fbbf24' : '#ef4444' }}>{dscr.toFixed(2)}x</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Debt Service Coverage</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(255,126,95,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Price Per Unit</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f' }}>{fmt(pricePerUnit)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>{units.length} unit{units.length !== 1 ? 's' : ''}</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(255,126,95,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Gross Rent Multiplier</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f' }}>{grm.toFixed(2)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Purchase / Annual Rent</div>
          </div>
          <div style={{ ...metricCard, borderColor: 'rgba(139,92,246,0.2)' }}>
            <div style={{ fontSize: 11, color: '#9a918a', marginBottom: 4 }}>Total Cash Invested</div>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#c4b5fd' }}>{fmt(totalCashInvested)}</div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>Down + Closing + Rehab</div>
          </div>
        </div>
      </div>

      {/* Responsive CSS */}
      <style>{`
        .mf-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 14px; }
        .mf-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 14px; }
        .mf-grid-4 { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; }
        @media (max-width: 768px) {
          .mf-grid-2 { grid-template-columns: 1fr; }
          .mf-grid-3 { grid-template-columns: 1fr; }
          .mf-grid-4 { grid-template-columns: 1fr 1fr; }
          .mf-unit-row, .mf-expense-row { flex-direction: column; align-items: stretch !important; }
          .mf-unit-row > div, .mf-expense-row > div { flex: 1 1 100% !important; min-width: 0 !important; }
        }
        @media (min-width: 769px) and (max-width: 1024px) {
          .mf-grid-3 { grid-template-columns: repeat(2, 1fr); }
          .mf-grid-4 { grid-template-columns: repeat(2, 1fr); }
        }
        @media (max-width: 480px) {
          .mf-grid-4 { grid-template-columns: 1fr; }
        }
      `}</style>
    </div>
  )
}
