import { useState, useEffect, useRef } from 'react'
import { DollarSign, Home, TrendingUp, Calculator, Target, Percent, ArrowRight, Pause, Play as PlayIcon, BarChart3, PieChart, Layers, CheckCircle2, AlertTriangle, Wrench, Building2, MapPin, Hammer, LogOut, Clock, Shield, Zap, Activity } from 'lucide-react'

/* ── Deal Analyzer Demo Screens ── */
const SCREENS = [
  { nav: 0, title: 'Property Input', content: 'input' },
  { nav: 1, title: 'Comp Analysis', content: 'comps' },
  { nav: 2, title: 'Deal Breakdown', content: 'breakdown' },
  { nav: 3, title: 'Market Trends', content: 'market' },
  { nav: 4, title: 'Rehab Estimator', content: 'rehab' },
  { nav: 5, title: 'Profit Analysis', content: 'profit' },
  { nav: 6, title: 'Exit Strategy', content: 'exit' },
  { nav: 7, title: 'Deal Verdict', content: 'verdict' },
]

const NAV_ITEMS = ['Property Input', 'Comp Analysis', 'Deal Breakdown', 'Market Trends', 'Rehab Estimator', 'Profit Analysis', 'Exit Strategy', 'Deal Verdict']

const SCREEN_DURATION = 4000 // 4s per screen = 32s total

/* ── Animated counter hook ── */
function useAnimatedNumber(target: number, duration = 1200) {
  const [value, setValue] = useState(0)
  const ref = useRef<ReturnType<typeof requestAnimationFrame>>()

  useEffect(() => {
    const start = performance.now()
    const from = 0
    function tick(now: number) {
      const elapsed = now - start
      const progress = Math.min(elapsed / duration, 1)
      const eased = 1 - Math.pow(1 - progress, 3) // ease-out cubic
      setValue(Math.round(from + (target - from) * eased))
      if (progress < 1) ref.current = requestAnimationFrame(tick)
    }
    ref.current = requestAnimationFrame(tick)
    return () => { if (ref.current) cancelAnimationFrame(ref.current) }
  }, [target, duration])

  return value
}

/* ── Gauge Component ── */
function AnimatedGauge({ score, size = 100, label }: { score: number; size?: number; label: string }) {
  const animatedScore = useAnimatedNumber(score)
  const radius = 38
  const circumference = 2 * Math.PI * radius
  const progress = (animatedScore / 100) * circumference
  const color = score >= 75 ? '#22c55e' : score >= 50 ? '#e8a44a' : '#ef4444'
  const gradientId = `gauge-${label.replace(/\s/g, '')}`

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
      <svg width={size} height={size} viewBox="0 0 100 100">
        <defs>
          <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" stopColor={color} />
            <stop offset="100%" stopColor={score >= 75 ? '#5cb885' : score >= 50 ? '#ff7e5f' : '#dc2626'} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r={radius} fill="none" stroke="rgba(61,78,101,0.2)" strokeWidth="5" />
        <circle
          cx="50" cy="50" r={radius}
          fill="none"
          stroke={`url(#${gradientId})`}
          strokeWidth="5"
          strokeDasharray={`${progress} ${circumference}`}
          strokeLinecap="round"
          transform="rotate(-90 50 50)"
          style={{ transition: 'stroke-dasharray 1.2s cubic-bezier(0.4,0,0.2,1)' }}
        />
        <text x="50" y="46" textAnchor="middle" fill={color} fontSize="22" fontWeight="800" fontFamily="'Bebas Neue', sans-serif">
          {animatedScore}
        </text>
        <text x="50" y="60" textAnchor="middle" fill="#6b6560" fontSize="8" fontFamily="system-ui">
          / 100
        </text>
      </svg>
      <span style={{ fontSize: 'clamp(8px, 0.85vw, 12px)', color: '#9a918a', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{label}</span>
    </div>
  )
}

/* ── Mini Stat Card ── */
function MiniStat({ label, value, color, icon: Icon }: { label: string; value: string; color: string; icon: typeof DollarSign }) {
  return (
    <div className="da-stat-card" style={{ borderLeftColor: color }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(4px, 0.5vw, 8px)', marginBottom: 'clamp(2px, 0.3vw, 6px)' }}>
        <Icon size={12} color={color} />
        <span className="da-stat-label">{label}</span>
      </div>
      <div className="da-stat-value" style={{ color }}>{value}</div>
    </div>
  )
}

/* ── Animated Progress Bar ── */
function ProgressBar({ value, max, color, label }: { value: number; max: number; color: string; label: string }) {
  const pct = Math.min((value / max) * 100, 100)
  return (
    <div style={{ marginBottom: 'clamp(5px, 0.6vw, 10px)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(8px, 0.85vw, 12px)', marginBottom: 3 }}>
        <span style={{ color: '#9a918a' }}>{label}</span>
        <span style={{ color, fontWeight: 700 }}>{value.toLocaleString()}</span>
      </div>
      <div style={{ height: 'clamp(4px, 0.5vw, 7px)', background: 'rgba(61,78,101,0.3)', borderRadius: 10, overflow: 'hidden' }}>
        <div style={{ width: `${pct}%`, height: '100%', background: `linear-gradient(90deg, ${color}, ${color}cc)`, borderRadius: 10, transition: 'width 1s ease' }} />
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════ */
/*  Screen Components                                */
/* ══════════════════════════════════════════════════ */

function PropertyInputScreen() {
  return (
    <div className="da-screen">
      <div className="da-input-grid">
        {/* Property Card */}
        <div className="da-card da-property-card">
          <div className="da-card-header"><Home size={12} /> Property Details</div>
          <div className="da-input-fields">
            <div className="da-field-filled">
              <span className="da-field-label">Address</span>
              <span className="da-field-value">1423 Elm Street</span>
            </div>
            <div className="da-field-filled">
              <span className="da-field-label">City, State</span>
              <span className="da-field-value">Atlanta, GA 30301</span>
            </div>
            <div className="da-input-row">
              <div className="da-field-filled">
                <span className="da-field-label">Asking Price</span>
                <span className="da-field-value" style={{ color: '#ff7e5f' }}>$185,000</span>
              </div>
              <div className="da-field-filled">
                <span className="da-field-label">Bed / Bath</span>
                <span className="da-field-value">3 bd / 2 ba</span>
              </div>
            </div>
            <div className="da-input-row">
              <div className="da-field-filled">
                <span className="da-field-label">Sq Ft</span>
                <span className="da-field-value">1,680</span>
              </div>
              <div className="da-field-filled">
                <span className="da-field-label">Year Built</span>
                <span className="da-field-value">1994</span>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Values */}
        <div className="da-card">
          <div className="da-card-header"><DollarSign size={12} /> Key Values</div>
          <div className="da-key-values">
            <div className="da-key-value-item">
              <TrendingUp size={14} color="#5cb885" />
              <div>
                <div className="da-field-label">After Repair Value</div>
                <div className="da-field-value" style={{ color: '#5cb885', fontSize: 'clamp(12px, 1.4vw, 18px)' }}>$285,000</div>
              </div>
            </div>
            <div className="da-key-value-item">
              <Wrench size={14} color="#e8a44a" />
              <div>
                <div className="da-field-label">Est. Repairs</div>
                <div className="da-field-value" style={{ color: '#e8a44a', fontSize: 'clamp(12px, 1.4vw, 18px)' }}>$32,000</div>
              </div>
            </div>
            <div className="da-key-value-item">
              <Target size={14} color="#a855f7" />
              <div>
                <div className="da-field-label">Assignment Fee</div>
                <div className="da-field-value" style={{ color: '#a855f7', fontSize: 'clamp(12px, 1.4vw, 18px)' }}>$15,000</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function CompAnalysisScreen() {
  const comps = [
    { addr: '1501 Elm St', dist: '0.2 mi', sold: '$278,000', sqft: '$166/sf', date: '14 days ago', match: 94 },
    { addr: '1388 Oak Ave', dist: '0.4 mi', sold: '$292,000', sqft: '$171/sf', date: '21 days ago', match: 89 },
    { addr: '1610 Pine Rd', dist: '0.3 mi', sold: '$269,500', sqft: '$158/sf', date: '30 days ago', match: 82 },
    { addr: '1245 Maple Dr', dist: '0.5 mi', sold: '$301,000', sqft: '$178/sf', date: '45 days ago', match: 76 },
  ]

  return (
    <div className="da-screen">
      <div className="da-stats-row">
        <MiniStat label="Avg Comp Price" value="$285,125" color="#5cb885" icon={DollarSign} />
        <MiniStat label="Avg $/Sq Ft" value="$168" color="#5ba3d9" icon={BarChart3} />
        <MiniStat label="Comps Found" value="4 nearby" color="#a855f7" icon={MapPin} />
        <MiniStat label="Confidence" value="High" color="#22c55e" icon={Target} />
      </div>

      <div className="da-card" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="da-card-header"><Building2 size={12} /> Comparable Sales</div>
        <div className="da-comp-table">
          <div className="da-comp-header-row">
            <span style={{ flex: 3 }}>Address</span>
            <span style={{ flex: 1 }}>Dist.</span>
            <span style={{ flex: 1.5 }}>Sold Price</span>
            <span style={{ flex: 1 }}>$/SF</span>
            <span style={{ flex: 1, textAlign: 'right' }}>Match</span>
          </div>
          {comps.map((c, i) => (
            <div key={i} className="da-comp-row" style={{ animationDelay: `${i * 0.12}s` }}>
              <div style={{ flex: 3 }}>
                <div style={{ color: '#f5f0eb', fontWeight: 500, fontSize: 'clamp(8px, 0.95vw, 13px)' }}>{c.addr}</div>
                <div style={{ color: '#6b6560', fontSize: 'clamp(7px, 0.7vw, 10px)' }}>{c.date}</div>
              </div>
              <span style={{ flex: 1, color: '#9a918a', fontSize: 'clamp(8px, 0.85vw, 12px)' }}>{c.dist}</span>
              <span style={{ flex: 1.5, color: '#5cb885', fontWeight: 600, fontSize: 'clamp(8px, 0.95vw, 13px)' }}>{c.sold}</span>
              <span style={{ flex: 1, color: '#9a918a', fontSize: 'clamp(8px, 0.85vw, 12px)' }}>{c.sqft}</span>
              <div style={{ flex: 1, textAlign: 'right' }}>
                <span className="da-match-badge" style={{
                  background: c.match >= 90 ? 'rgba(34,197,94,0.15)' : c.match >= 80 ? 'rgba(91,163,217,0.15)' : 'rgba(232,164,74,0.15)',
                  color: c.match >= 90 ? '#22c55e' : c.match >= 80 ? '#5ba3d9' : '#e8a44a',
                  borderColor: c.match >= 90 ? 'rgba(34,197,94,0.3)' : c.match >= 80 ? 'rgba(91,163,217,0.3)' : 'rgba(232,164,74,0.3)',
                }}>
                  {c.match}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

function DealBreakdownScreen() {
  return (
    <div className="da-screen">
      <div className="da-breakdown-grid">
        {/* Cost Breakdown */}
        <div className="da-card">
          <div className="da-card-header"><Layers size={12} /> Cost Breakdown</div>
          <div style={{ padding: 'clamp(4px, 0.5vw, 8px) 0' }}>
            <ProgressBar label="Purchase Price" value={185000} max={285000} color="#ff7e5f" />
            <ProgressBar label="Estimated Repairs" value={32000} max={285000} color="#e8a44a" />
            <ProgressBar label="Closing Costs (4%)" value={11400} max={285000} color="#a855f7" />
            <ProgressBar label="Holding Costs" value={4200} max={285000} color="#5ba3d9" />
            <ProgressBar label="Assignment Fee" value={15000} max={285000} color="#5cb885" />
            <div style={{ borderTop: '1px solid rgba(61,78,101,0.3)', paddingTop: 'clamp(5px, 0.6vw, 10px)', marginTop: 'clamp(5px, 0.6vw, 10px)', display: 'flex', justifyContent: 'space-between', fontSize: 'clamp(9px, 1vw, 13px)' }}>
              <span style={{ color: '#f5f0eb', fontWeight: 700 }}>Total Investment</span>
              <span style={{ color: '#ff7e5f', fontWeight: 800 }}>$247,600</span>
            </div>
          </div>
        </div>

        {/* Rule Comparisons */}
        <div className="da-card">
          <div className="da-card-header"><Percent size={12} /> Offer Rules</div>
          <div className="da-rules-list">
            {[
              { rule: '70% Rule', formula: 'ARV × 70% − Repairs − Fee', result: '$152,500', verdict: 'Conservative', color: '#5cb885' },
              { rule: '75% Rule', formula: 'ARV × 75% − Repairs − Fee', result: '$166,750', verdict: 'Standard', color: '#5ba3d9' },
              { rule: '80% Rule', formula: 'ARV × 80% − Repairs − Fee', result: '$181,000', verdict: 'Aggressive', color: '#e8a44a' },
            ].map((r, i) => (
              <div key={i} className="da-rule-item" style={{ animationDelay: `${i * 0.1}s` }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 700, color: '#f5f0eb', fontSize: 'clamp(9px, 1vw, 14px)' }}>{r.rule}</span>
                  <span className="da-rule-verdict" style={{ background: `${r.color}18`, color: r.color, borderColor: `${r.color}40` }}>
                    {r.verdict}
                  </span>
                </div>
                <div style={{ fontSize: 'clamp(7px, 0.7vw, 10px)', color: '#6b6560', margin: '3px 0' }}>{r.formula}</div>
                <div style={{ fontSize: 'clamp(12px, 1.3vw, 18px)', fontWeight: 800, color: r.color, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.03em' }}>{r.result}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfitAnalysisScreen() {
  return (
    <div className="da-screen">
      <div className="da-stats-row">
        <MiniStat label="Your Profit" value="$15,000" color="#5cb885" icon={DollarSign} />
        <MiniStat label="Buyer Profit" value="$37,400" color="#5ba3d9" icon={TrendingUp} />
        <MiniStat label="Buyer ROI" value="24.8%" color="#a855f7" icon={Percent} />
        <MiniStat label="Days to Close" value="~21" color="#e8a44a" icon={Calculator} />
      </div>

      <div className="da-profit-grid">
        {/* Waterfall chart */}
        <div className="da-card">
          <div className="da-card-header"><BarChart3 size={12} /> Profit Waterfall</div>
          <div className="da-waterfall">
            {[
              { label: 'ARV', amount: 285000, type: 'positive' as const },
              { label: 'Purchase', amount: -185000, type: 'negative' as const },
              { label: 'Repairs', amount: -32000, type: 'negative' as const },
              { label: 'Closing', amount: -11400, type: 'negative' as const },
              { label: 'Holding', amount: -4200, type: 'negative' as const },
              { label: 'Net Profit', amount: 52400, type: 'total' as const },
            ].map((item, i) => {
              const maxVal = 285000
              const barHeight = Math.abs(item.amount) / maxVal * 100
              const color = item.type === 'positive' ? '#5cb885' : item.type === 'total' ? '#ff7e5f' : '#ef4444'
              return (
                <div key={i} className="da-waterfall-col" style={{ animationDelay: `${i * 0.15}s` }}>
                  <div className="da-waterfall-bar-wrap">
                    <div className="da-waterfall-bar" style={{ height: `${barHeight}%`, background: `linear-gradient(180deg, ${color}, ${color}88)` }} />
                  </div>
                  <span className="da-waterfall-label">{item.label}</span>
                  <span className="da-waterfall-amount" style={{ color }}>
                    {item.amount >= 0 ? '' : '−'}${Math.abs(item.amount / 1000).toFixed(0)}K
                  </span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Split breakdown */}
        <div className="da-card">
          <div className="da-card-header"><PieChart size={12} /> Deal Split</div>
          <div className="da-split-items">
            <div className="da-split-item">
              <div className="da-split-icon" style={{ background: 'rgba(168,85,247,0.15)', borderColor: 'rgba(168,85,247,0.3)' }}>
                <Target size={14} color="#a855f7" />
              </div>
              <div>
                <div style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', color: '#9a918a' }}>Your Assignment Fee</div>
                <div style={{ fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 800, color: '#a855f7', fontFamily: "'Bebas Neue', sans-serif" }}>$15,000</div>
              </div>
            </div>
            <div className="da-split-item">
              <div className="da-split-icon" style={{ background: 'rgba(92,184,133,0.15)', borderColor: 'rgba(92,184,133,0.3)' }}>
                <TrendingUp size={14} color="#5cb885" />
              </div>
              <div>
                <div style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', color: '#9a918a' }}>Buyer's Net Profit</div>
                <div style={{ fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 800, color: '#5cb885', fontFamily: "'Bebas Neue', sans-serif" }}>$37,400</div>
              </div>
            </div>
            <div className="da-split-item">
              <div className="da-split-icon" style={{ background: 'rgba(255,126,95,0.15)', borderColor: 'rgba(255,126,95,0.3)' }}>
                <DollarSign size={14} color="#ff7e5f" />
              </div>
              <div>
                <div style={{ fontSize: 'clamp(8px, 0.8vw, 11px)', color: '#9a918a' }}>Total Deal Value</div>
                <div style={{ fontSize: 'clamp(14px, 1.5vw, 20px)', fontWeight: 800, color: '#ff7e5f', fontFamily: "'Bebas Neue', sans-serif" }}>$52,400</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Market Trends Screen ── */
function MarketTrendsScreen() {
  const months = ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar']
  const medianPrices = [268, 272, 275, 279, 282, 285]
  const daysOnMarket = [28, 25, 22, 20, 18, 16]
  const maxPrice = 300
  const maxDOM = 35

  return (
    <div className="da-screen">
      <div className="da-stats-row">
        <MiniStat label="Median Price" value="$285K" color="#5cb885" icon={TrendingUp} />
        <MiniStat label="6-Mo Change" value="+6.3%" color="#22c55e" icon={Activity} />
        <MiniStat label="Avg DOM" value="16 days" color="#5ba3d9" icon={Clock} />
        <MiniStat label="Market Type" value="Seller's" color="#ff7e5f" icon={Zap} />
      </div>

      <div className="da-profit-grid">
        {/* Median Price Trend */}
        <div className="da-card">
          <div className="da-card-header"><TrendingUp size={12} /> Median Price Trend</div>
          <div className="da-waterfall">
            {months.map((month, i) => {
              const barHeight = (medianPrices[i] / maxPrice) * 100
              return (
                <div key={i} className="da-waterfall-col" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="da-waterfall-bar-wrap">
                    <div className="da-waterfall-bar" style={{ height: `${barHeight}%`, background: `linear-gradient(180deg, #5cb885, #5cb88566)` }} />
                  </div>
                  <span className="da-waterfall-label">{month}</span>
                  <span className="da-waterfall-amount" style={{ color: '#5cb885' }}>${medianPrices[i]}K</span>
                </div>
              )
            })}
          </div>
        </div>

        {/* Days on Market */}
        <div className="da-card">
          <div className="da-card-header"><Clock size={12} /> Days on Market</div>
          <div className="da-waterfall">
            {months.map((month, i) => {
              const barHeight = (daysOnMarket[i] / maxDOM) * 100
              return (
                <div key={i} className="da-waterfall-col" style={{ animationDelay: `${i * 0.12}s` }}>
                  <div className="da-waterfall-bar-wrap">
                    <div className="da-waterfall-bar" style={{ height: `${barHeight}%`, background: `linear-gradient(180deg, #5ba3d9, #5ba3d966)` }} />
                  </div>
                  <span className="da-waterfall-label">{month}</span>
                  <span className="da-waterfall-amount" style={{ color: '#5ba3d9' }}>{daysOnMarket[i]}d</span>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Rehab Estimator Screen ── */
function RehabEstimatorScreen() {
  const rehabItems = [
    { category: 'Kitchen Remodel', cost: 8500, priority: 'High', color: '#ef4444' },
    { category: 'Bathroom Updates', cost: 5200, priority: 'High', color: '#ef4444' },
    { category: 'Flooring', cost: 6800, priority: 'Medium', color: '#e8a44a' },
    { category: 'Exterior Paint', cost: 4500, priority: 'Medium', color: '#e8a44a' },
    { category: 'HVAC Repair', cost: 3200, priority: 'Low', color: '#5ba3d9' },
    { category: 'Landscaping', cost: 1800, priority: 'Low', color: '#5ba3d9' },
    { category: 'Electrical', cost: 2000, priority: 'Medium', color: '#e8a44a' },
  ]

  return (
    <div className="da-screen">
      <div className="da-stats-row">
        <MiniStat label="Total Rehab" value="$32,000" color="#e8a44a" icon={Wrench} />
        <MiniStat label="Cost per SF" value="$19.05" color="#5ba3d9" icon={Calculator} />
        <MiniStat label="% of ARV" value="11.2%" color="#5cb885" icon={Percent} />
        <MiniStat label="Risk Level" value="Low" color="#22c55e" icon={Shield} />
      </div>

      <div className="da-profit-grid">
        {/* Rehab Line Items */}
        <div className="da-card" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
          <div className="da-card-header"><Hammer size={12} /> Rehab Line Items</div>
          <div className="da-comp-table">
            <div className="da-comp-header-row">
              <span style={{ flex: 3 }}>Category</span>
              <span style={{ flex: 1.5 }}>Cost</span>
              <span style={{ flex: 1, textAlign: 'right' }}>Priority</span>
            </div>
            {rehabItems.map((item, i) => (
              <div key={i} className="da-comp-row" style={{ animationDelay: `${i * 0.08}s` }}>
                <span style={{ flex: 3, color: '#f5f0eb', fontWeight: 500, fontSize: 'clamp(8px, 0.9vw, 12px)' }}>{item.category}</span>
                <span style={{ flex: 1.5, color: '#e8a44a', fontWeight: 600, fontSize: 'clamp(8px, 0.9vw, 12px)' }}>${item.cost.toLocaleString()}</span>
                <div style={{ flex: 1, textAlign: 'right' }}>
                  <span className="da-match-badge" style={{
                    background: `${item.color}15`,
                    color: item.color,
                    borderColor: `${item.color}30`,
                  }}>
                    {item.priority}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cost Breakdown Pie */}
        <div className="da-card">
          <div className="da-card-header"><PieChart size={12} /> Cost by Category</div>
          <div style={{ padding: 'clamp(6px,0.8vw,10px) clamp(8px,1vw,12px)' }}>
            <ProgressBar label="Kitchen" value={8500} max={32000} color="#ef4444" />
            <ProgressBar label="Flooring" value={6800} max={32000} color="#e8a44a" />
            <ProgressBar label="Bathrooms" value={5200} max={32000} color="#a855f7" />
            <ProgressBar label="Exterior" value={4500} max={32000} color="#5ba3d9" />
            <ProgressBar label="HVAC" value={3200} max={32000} color="#5cb885" />
            <ProgressBar label="Electrical" value={2000} max={32000} color="#ff7e5f" />
            <ProgressBar label="Landscaping" value={1800} max={32000} color="#22c55e" />
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── Exit Strategy Screen ── */
function ExitStrategyScreen() {
  const strategies = [
    { name: 'Wholesale Assignment', profit: '$15,000', timeline: '7–14 days', risk: 'Low', score: 92, color: '#5cb885', recommended: true },
    { name: 'Fix & Flip', profit: '$52,400', timeline: '3–6 months', risk: 'Medium', score: 78, color: '#5ba3d9', recommended: false },
    { name: 'Buy & Hold Rental', profit: '$1,650/mo', timeline: 'Long-term', risk: 'Low', score: 85, color: '#a855f7', recommended: false },
  ]

  return (
    <div className="da-screen">
      <div className="da-stats-row">
        <MiniStat label="Best Exit" value="Wholesale" color="#5cb885" icon={Target} />
        <MiniStat label="Fastest Close" value="7 days" color="#5ba3d9" icon={Clock} />
        <MiniStat label="Highest Profit" value="Fix & Flip" color="#ff7e5f" icon={DollarSign} />
        <MiniStat label="Strategies" value="3 viable" color="#a855f7" icon={LogOut} />
      </div>

      <div className="da-breakdown-grid" style={{ gridTemplateColumns: '1fr' }}>
        <div className="da-card">
          <div className="da-card-header"><LogOut size={12} /> Exit Strategy Comparison</div>
          <div className="da-rules-list">
            {strategies.map((s, i) => (
              <div key={i} className="da-rule-item" style={{ animationDelay: `${i * 0.12}s`, borderColor: s.recommended ? `${s.color}40` : undefined }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 'clamp(6px,0.7vw,10px)' }}>
                    <span style={{ fontWeight: 700, color: '#f5f0eb', fontSize: 'clamp(9px, 1vw, 13px)' }}>{s.name}</span>
                    {s.recommended && (
                      <span className="da-match-badge" style={{ background: 'rgba(34,197,94,0.15)', color: '#22c55e', borderColor: 'rgba(34,197,94,0.3)' }}>
                        Recommended
                      </span>
                    )}
                  </div>
                  <span className="da-match-badge" style={{
                    background: `${s.color}15`,
                    color: s.color,
                    borderColor: `${s.color}30`,
                  }}>
                    Score: {s.score}
                  </span>
                </div>
                <div style={{ display: 'flex', gap: 'clamp(10px,1.5vw,24px)', marginTop: 'clamp(4px,0.5vw,8px)' }}>
                  <div>
                    <div style={{ fontSize: 'clamp(7px,0.65vw,9px)', color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Profit</div>
                    <div style={{ fontSize: 'clamp(11px, 1.2vw, 16px)', fontWeight: 800, color: s.color, fontFamily: "'Bebas Neue', sans-serif" }}>{s.profit}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(7px,0.65vw,9px)', color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Timeline</div>
                    <div style={{ fontSize: 'clamp(11px, 1.2vw, 16px)', fontWeight: 800, color: '#f5f0eb', fontFamily: "'Bebas Neue', sans-serif" }}>{s.timeline}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 'clamp(7px,0.65vw,9px)', color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Risk</div>
                    <div style={{ fontSize: 'clamp(11px, 1.2vw, 16px)', fontWeight: 800, color: s.risk === 'Low' ? '#22c55e' : '#e8a44a', fontFamily: "'Bebas Neue', sans-serif" }}>{s.risk}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function DealVerdictScreen() {
  return (
    <div className="da-screen">
      {/* Score gauges row */}
      <div className="da-gauges-row">
        <AnimatedGauge score={82} label="Overall Score" size={90} />
        <AnimatedGauge score={88} label="Profit Potential" size={90} />
        <AnimatedGauge score={76} label="Market Strength" size={90} />
        <AnimatedGauge score={91} label="Buyer Appeal" size={90} />
      </div>

      <div className="da-verdict-grid">
        {/* Verdict Card */}
        <div className="da-card da-verdict-card">
          <div className="da-verdict-badge" style={{ background: 'linear-gradient(135deg, rgba(34,197,94,0.15), rgba(92,184,133,0.08))', borderColor: 'rgba(34,197,94,0.3)' }}>
            <CheckCircle2 size={20} color="#22c55e" />
            <div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(18px, 2vw, 28px)', color: '#22c55e', letterSpacing: '0.04em', lineHeight: 1 }}>
                STRONG BUY
              </div>
              <div style={{ fontSize: 'clamp(8px, 0.8vw, 12px)', color: '#9a918a', marginTop: 2 }}>
                This deal meets all wholesale criteria
              </div>
            </div>
          </div>

          <div className="da-verdict-checks">
            {[
              { text: 'MAO is 35% below ARV', pass: true },
              { text: 'Buyer ROI exceeds 20%', pass: true },
              { text: 'Repair costs under 15% ARV', pass: true },
              { text: 'Strong comp support (4 recent)', pass: true },
              { text: 'Market trending upward', pass: true },
            ].map((check, i) => (
              <div key={i} className="da-verdict-check-row" style={{ animationDelay: `${i * 0.1}s` }}>
                {check.pass
                  ? <CheckCircle2 size={12} color="#22c55e" />
                  : <AlertTriangle size={12} color="#ef4444" />
                }
                <span style={{ color: check.pass ? '#c8c3bd' : '#ef4444', fontSize: 'clamp(8px, 0.85vw, 13px)' }}>
                  {check.text}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="da-card">
          <div className="da-card-header">Quick Actions</div>
          <div className="da-actions-list">
            {[
              { label: 'Send to Buyer List', color: '#5cb885', icon: ArrowRight },
              { label: 'Download Offer Sheet', color: '#5ba3d9', icon: ArrowRight },
              { label: 'Save to Pipeline', color: '#a855f7', icon: ArrowRight },
              { label: 'Share Analysis', color: '#ff7e5f', icon: ArrowRight },
            ].map((action, i) => (
              <div key={i} className="da-action-btn" style={{ borderColor: `${action.color}30`, animationDelay: `${i * 0.08}s` }}>
                <span style={{ color: action.color, fontSize: 'clamp(8px, 0.9vw, 13px)', fontWeight: 600 }}>{action.label}</span>
                <action.icon size={10} color={action.color} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ══════════════════════════════════════════════════ */
/*  Main Component                                   */
/* ══════════════════════════════════════════════════ */

const DA_FEATURES = [
  { icon: Calculator, label: 'MAO Calculator', desc: 'Auto-calculate max allowable offer using 70/75/80% rules' },
  { icon: Building2, label: 'Comp Analysis', desc: 'Recent comparable sales with match scores' },
  { icon: Activity, label: 'Market Trends', desc: 'Track median prices & days on market over time' },
  { icon: Hammer, label: 'Rehab Estimator', desc: 'Itemized repair costs with priority levels' },
  { icon: BarChart3, label: 'Profit Projections', desc: 'Full waterfall breakdown of buyer ROI & profit' },
  { icon: LogOut, label: 'Exit Strategies', desc: 'Compare wholesale, fix & flip, and rental exits' },
  { icon: Target, label: 'Deal Scoring', desc: 'AI-powered verdicts with pass/fail checklist' },
  { icon: PieChart, label: 'Deal Split View', desc: 'Your fee vs buyer profit at a glance' },
]

export default function DealAnalyzerVideo() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const screenRef = useRef(0)

  useEffect(() => {
    if (isPaused) return

    const advance = () => {
      setFadeState('out')
      setTimeout(() => {
        screenRef.current = (screenRef.current + 1) % SCREENS.length
        setCurrentScreen(screenRef.current)
        setFadeState('in')
      }, 400)
    }

    timerRef.current = setInterval(advance, SCREEN_DURATION)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [isPaused])

  const screen = SCREENS[currentScreen]
  const totalSeconds = SCREENS.length * 4
  const currentSeconds = currentScreen * 4

  return (
    <section className="da-video-section">
      <div className="da-video-header">
        <span className="da-video-badge">DEAL ANALYZER WALKTHROUGH</span>
        <h2 className="da-video-title">
          Analyze Any Deal in Seconds
        </h2>
        <p className="da-video-subtitle">
          Plug in an address and instantly get ARV comps, rehab estimates, market trends, profit projections, exit strategies, and a full deal verdict — 8 powerful screens in one advanced tool. Watch it in action below.
        </p>
      </div>

      <div className="da-video-container">
        <div className="da-recording-wrapper">
          {/* Simulated Deal Analyzer UI */}
          <div className="da-rec-layout">
            {/* Sidebar */}
            <div className="da-rec-sidebar">
              <div className="da-rec-logo">
                <Calculator size={14} />
                <span>Deal Analyzer</span>
              </div>
              {NAV_ITEMS.map((item, i) => (
                <div
                  key={item}
                  className={`da-rec-nav-item ${i === screen.nav ? 'da-rec-nav-active' : ''}`}
                  style={{ cursor: 'pointer' }}
                  onClick={() => {
                    screenRef.current = i
                    setCurrentScreen(i)
                    setFadeState('in')
                  }}
                >
                  <div className={`da-rec-nav-dot ${i === screen.nav ? 'active' : ''}`} />
                  {item}
                </div>
              ))}
              <div className="da-rec-sidebar-footer">
                <div className="da-rec-property-pill">
                  <Home size={10} />
                  <span>1423 Elm St</span>
                </div>
              </div>
            </div>

            {/* Main content area */}
            <div className="da-rec-main">
              {/* Top bar */}
              <div className="da-rec-topbar">
                <span className="da-rec-page-title">{screen.title}</span>
                <div className="da-rec-topbar-right">
                  <div className="da-rec-topbar-badge">
                    <span style={{ fontSize: 'clamp(6px, 0.6vw, 8px)', color: '#22c55e' }}>● </span>
                    Score: 82
                  </div>
                  <div className="da-rec-topbar-badge" style={{ color: '#a855f7' }}>
                    MAO: $166,750
                  </div>
                </div>
              </div>

              {/* Screen content with transition */}
              <div className={`da-rec-content da-rec-fade-${fadeState}`}>
                {screen.content === 'input' && <PropertyInputScreen />}
                {screen.content === 'comps' && <CompAnalysisScreen />}
                {screen.content === 'breakdown' && <DealBreakdownScreen />}
                {screen.content === 'market' && <MarketTrendsScreen />}
                {screen.content === 'rehab' && <RehabEstimatorScreen />}
                {screen.content === 'profit' && <ProfitAnalysisScreen />}
                {screen.content === 'exit' && <ExitStrategyScreen />}
                {screen.content === 'verdict' && <DealVerdictScreen />}
              </div>
            </div>
          </div>

          {/* Recording indicator + controls overlay */}
          <div className="da-rec-overlay">
            <div className="da-rec-indicator">
              <div className="da-rec-red-dot" />
              <span>LIVE PREVIEW</span>
            </div>
            <div className="da-rec-time">
              {String(Math.floor(currentSeconds / 60)).padStart(2, '0')}:{String(currentSeconds % 60).padStart(2, '0')} / 0:{String(totalSeconds).padStart(2, '0')}
            </div>
          </div>

          {/* Controls bar at bottom */}
          <div className="da-rec-controls">
            <button
              className="da-rec-ctrl-btn"
              onClick={() => setIsPaused(p => !p)}
              aria-label={isPaused ? 'Play' : 'Pause'}
            >
              {isPaused ? <PlayIcon size={14} fill="white" color="white" /> : <Pause size={14} color="white" />}
            </button>

            {/* Progress bar */}
            <div className="da-rec-progress-track">
              <div
                className="da-rec-progress-fill"
                style={{
                  width: `${((currentScreen + 1) / SCREENS.length) * 100}%`,
                  transition: 'width 0.4s ease',
                }}
              />
              {SCREENS.map((_, i) => (
                <button
                  key={i}
                  className={`da-rec-progress-dot ${i === currentScreen ? 'active' : ''}`}
                  style={{ left: `${((i + 0.5) / SCREENS.length) * 100}%` }}
                  onClick={() => {
                    screenRef.current = i
                    setCurrentScreen(i)
                    setFadeState('in')
                  }}
                  aria-label={`Go to ${SCREENS[i].title}`}
                />
              ))}
            </div>

            <div className="da-rec-timer-label">
              {screen.title}
            </div>
          </div>

          {/* Screen labels */}
          <div className="da-rec-screen-labels">
            {SCREENS.map((s, i) => (
              <button
                key={i}
                className={`da-rec-screen-label ${i === currentScreen ? 'active' : ''}`}
                onClick={() => {
                  screenRef.current = i
                  setCurrentScreen(i)
                  setFadeState('in')
                }}
              >
                {s.title}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Feature highlights below video */}
      <div className="da-video-features">
        {DA_FEATURES.map(feat => (
          <div key={feat.label} className="da-video-feature-item">
            <feat.icon size={22} color="#a855f7" />
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0eb' }}>{feat.label}</div>
              <div style={{ fontSize: 12, color: '#7a7370', marginTop: 2 }}>{feat.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}
