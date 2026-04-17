import { useState, useEffect, useRef } from 'react'
import { Users, BarChart3, Kanban, Target, CheckCircle2, ArrowRight, Pause, Play as PlayIcon, ListTodo, Contact, Upload, Activity, Clock, Flag, Phone, Mail, MapPin, Bell, CalendarDays, FileText, Star } from 'lucide-react'
import { Link } from '@tanstack/react-router'

const CRM_FEATURES = [
  { icon: Users, label: 'Lead Management', desc: 'Track & organize all your leads' },
  { icon: Kanban, label: 'Deal Pipeline', desc: 'Visual drag-and-drop pipeline' },
  { icon: BarChart3, label: 'Reports & Analytics', desc: 'Real-time deal insights' },
  { icon: Target, label: 'Deal Scorer', desc: 'AI-powered deal analysis' },
  { icon: ListTodo, label: 'Task Manager', desc: 'Never miss a follow-up' },
  { icon: Contact, label: 'Contact Book', desc: 'All your contacts in one place' },
  { icon: Upload, label: 'Lead Importer', desc: 'Import leads from any source' },
  { icon: Activity, label: 'Activity Feed', desc: 'Full timeline of every action' },
]

/* ── Screen recording data ── */
const NAV_ITEMS = ['Dashboard', 'Leads', 'Pipeline', 'Deal Score', 'Tasks', 'Contacts', 'Importer', 'Activity', 'Reports']

const SCREENS = [
  { nav: 0, title: 'Dashboard', content: 'dashboard' },
  { nav: 1, title: 'Leads', content: 'leads' },
  { nav: 2, title: 'Deal Pipeline', content: 'pipeline' },
  { nav: 3, title: 'Deal Score', content: 'dealscore' },
  { nav: 4, title: 'Tasks', content: 'tasks' },
  { nav: 5, title: 'Contacts', content: 'contacts' },
  { nav: 6, title: 'Smart Lead Importer', content: 'importer' },
  { nav: 7, title: 'Activity Feed', content: 'activityfeed' },
  { nav: 8, title: 'Reports', content: 'reports' },
]

const SCREEN_DURATION = 4000 // 4 seconds per screen = 36s total loop

/* ── Fake data for screens ── */
const LEADS_DATA = [
  { name: 'Marcus Johnson', address: '1423 Elm St, Atlanta', status: 'New Lead', statusColor: '#5ba3d9', amount: '$145,000' },
  { name: 'Sarah Williams', address: '892 Oak Ave, Dallas', status: 'Contacted', statusColor: '#a855f7', amount: '$210,000' },
  { name: 'David Chen', address: '3211 Pine Rd, Houston', status: 'Qualified', statusColor: '#5cb885', amount: '$178,000' },
  { name: 'Lisa Rodriguez', address: '567 Maple Dr, Phoenix', status: 'Follow Up', statusColor: '#e8a44a', amount: '$95,000' },
  { name: 'James Thompson', address: '2100 Cedar Ln, Miami', status: 'New Lead', statusColor: '#5ba3d9', amount: '$320,000' },
]

const PIPELINE_STAGES = [
  { name: 'Lead Found', color: '#5ba3d9', deals: ['1423 Elm St', '567 Maple Dr', '2100 Cedar Ln'] },
  { name: 'Contacted', color: '#a855f7', deals: ['892 Oak Ave', '789 Birch Way'] },
  { name: 'Negotiating', color: '#e8a44a', deals: ['3211 Pine Rd', '445 Spruce Ct'] },
  { name: 'Under Contract', color: '#ff7e5f', deals: ['118 Walnut Blvd'] },
  { name: 'Buyer Found', color: '#5cb885', deals: ['990 Willow St', '621 Ash Pl'] },
  { name: 'Closed', color: '#22c55e', deals: ['334 Poplar Ave'] },
]

const TASKS_DATA = [
  { title: 'Call Marcus Johnson', priority: 'urgent', status: 'todo', due: 'Today', deal: '1423 Elm St', type: 'call' },
  { title: 'Send offer to Sarah W.', priority: 'high', status: 'in_progress', due: 'Today', deal: '892 Oak Ave', type: 'offer' },
  { title: 'Schedule inspection', priority: 'medium', status: 'todo', due: 'Tomorrow', deal: '3211 Pine Rd', type: 'meeting' },
  { title: 'Follow up with David C.', priority: 'high', status: 'todo', due: 'Wed', deal: '3211 Pine Rd', type: 'call' },
  { title: 'Upload contract docs', priority: 'low', status: 'done', due: 'Done', deal: '334 Poplar Ave', type: 'doc' },
  { title: 'Send comp report', priority: 'medium', status: 'done', due: 'Done', deal: '118 Walnut Blvd', type: 'doc' },
]

const CONTACTS_DATA = [
  { name: 'Marcus Johnson', role: 'Seller', phone: '(404) 555-1234', email: 'marcus@email.com', tags: ['Motivated', 'Cash'], lastContact: '2h ago' },
  { name: 'Buyer Network LLC', role: 'Buyer', phone: '(305) 555-8877', email: 'deals@buyernet.com', tags: ['Hedge Fund', 'Multi-Family'], lastContact: '1d ago' },
  { name: 'Sarah Williams', role: 'Seller', phone: '(214) 555-3456', email: 'sarah.w@email.com', tags: ['Probate', 'Absentee'], lastContact: '3d ago' },
  { name: 'First National Title', role: 'Title Co', phone: '(713) 555-9900', email: 'closings@fntitle.com', tags: ['Investor-Friendly'], lastContact: '1w ago' },
  { name: 'David Chen', role: 'Seller', phone: '(713) 555-2200', email: 'dchen@email.com', tags: ['Pre-Foreclosure'], lastContact: '5d ago' },
]

const ACTIVITY_FEED_DATA = [
  { type: 'call', text: 'Called Marcus Johnson — interested, wants offer by EOD', time: '12m ago', icon: 'phone', color: '#5ba3d9' },
  { type: 'email', text: 'Sent comp analysis to Sarah Williams', time: '45m ago', icon: 'mail', color: '#a855f7' },
  { type: 'deal', text: 'Deal moved to "Under Contract" — 118 Walnut Blvd', time: '2h ago', icon: 'file', color: '#ff7e5f' },
  { type: 'note', text: 'Added note: Seller needs 30-day close, no inspections', time: '3h ago', icon: 'note', color: '#e8a44a' },
  { type: 'close', text: 'Deal CLOSED — 334 Poplar Ave — $18,500 assignment fee', time: '5h ago', icon: 'star', color: '#22c55e' },
  { type: 'import', text: 'Imported 24 new leads from BatchLeads export', time: '1d ago', icon: 'upload', color: '#5ba3d9' },
  { type: 'reminder', text: 'Reminder: Follow up with David Chen tomorrow', time: '1d ago', icon: 'bell', color: '#e8a44a' },
]

const IMPORT_SOURCES = [
  { name: 'BatchLeads', count: '2,340 leads', status: 'connected', color: '#5cb885' },
  { name: 'PropStream', count: '1,890 leads', status: 'connected', color: '#5cb885' },
  { name: 'DealMachine', count: '567 leads', status: 'connected', color: '#5cb885' },
  { name: 'CSV Upload', count: 'Manual', status: 'ready', color: '#5ba3d9' },
]

export default function CrmVideoPreview() {
  const [currentScreen, setCurrentScreen] = useState(0)
  const [isPaused, setIsPaused] = useState(false)
  const [fadeState, setFadeState] = useState<'in' | 'out'>('in')
  const [showCta, setShowCta] = useState(false)
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
    <section className="crm-video-section">
      <div className="crm-video-header">
        <span className="crm-video-badge">INCLUDED WITH YOUR SUBSCRIPTION</span>
        <h2 className="crm-video-title">
          Built-In Wholesale CRM
        </h2>
        <p className="crm-video-subtitle">
          Manage leads, track deals, automate follow-ups, and close faster — all from one powerful dashboard. Watch a real walkthrough of every feature below.
        </p>
      </div>

      <div className="crm-video-container" style={{ aspectRatio: '16/9' }}>
        {!showCta ? (
          <div className="crm-recording-wrapper">
            {/* Simulated CRM screen recording */}
            <div className="crm-rec-layout">
              {/* Sidebar */}
              <div className="crm-rec-sidebar">
                <div className="crm-rec-logo">FTC CRM</div>
                {NAV_ITEMS.map((item, i) => (
                  <div
                    key={item}
                    className={`crm-rec-nav-item ${i === screen.nav ? 'crm-rec-nav-active' : ''}`}
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      screenRef.current = i
                      setCurrentScreen(i)
                      setFadeState('in')
                    }}
                  >
                    <div className={`crm-rec-nav-dot ${i === screen.nav ? 'active' : ''}`} />
                    {item}
                  </div>
                ))}
                <div className="crm-rec-sidebar-footer">
                  <div className="crm-rec-user-pill">
                    <div className="crm-rec-avatar">FT</div>
                    <span>Flip The Contract</span>
                  </div>
                </div>
              </div>

              {/* Main content area */}
              <div className="crm-rec-main">
                {/* Top bar */}
                <div className="crm-rec-topbar">
                  <span className="crm-rec-page-title">{screen.title}</span>
                  <div className="crm-rec-topbar-right">
                    <div className="crm-rec-search-bar">
                      <span style={{ opacity: 0.4, fontSize: 'clamp(8px,0.9vw,11px)' }}>🔍 Search leads, deals...</span>
                    </div>
                    <div className="crm-rec-notif-dot" />
                  </div>
                </div>

                {/* Screen content with transition */}
                <div className={`crm-rec-content crm-rec-fade-${fadeState}`}>
                  {screen.content === 'dashboard' && <DashboardScreen />}
                  {screen.content === 'leads' && <LeadsScreen />}
                  {screen.content === 'pipeline' && <PipelineScreen />}
                  {screen.content === 'dealscore' && <DealScoreScreen />}
                  {screen.content === 'tasks' && <TasksScreen />}
                  {screen.content === 'contacts' && <ContactsScreen />}
                  {screen.content === 'importer' && <ImporterScreen />}
                  {screen.content === 'activityfeed' && <ActivityFeedScreen />}
                  {screen.content === 'reports' && <ReportsScreen />}
                </div>
              </div>
            </div>

            {/* Recording indicator + controls overlay */}
            <div className="crm-rec-overlay">
              <div className="crm-rec-indicator">
                <div className="crm-rec-red-dot" />
                <span>LIVE PREVIEW</span>
              </div>
              <div className="crm-rec-time">
                {String(Math.floor(currentSeconds / 60)).padStart(2, '0')}:{String(currentSeconds % 60).padStart(2, '0')} / 0:{String(totalSeconds).padStart(2, '0')}
              </div>
            </div>

            {/* Controls bar at bottom */}
            <div className="crm-rec-controls">
              <button
                className="crm-rec-ctrl-btn"
                onClick={() => setIsPaused(p => !p)}
                aria-label={isPaused ? 'Play' : 'Pause'}
              >
                {isPaused ? <PlayIcon size={14} fill="white" color="white" /> : <Pause size={14} color="white" />}
              </button>

              {/* Progress bar */}
              <div className="crm-rec-progress-track">
                <div
                  className="crm-rec-progress-fill"
                  style={{
                    width: `${((currentScreen + 1) / SCREENS.length) * 100}%`,
                    transition: 'width 0.4s ease',
                  }}
                />
                {SCREENS.map((_, i) => (
                  <button
                    key={i}
                    className={`crm-rec-progress-dot ${i === currentScreen ? 'active' : ''}`}
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

              <button
                className="crm-rec-cta-btn"
                onClick={() => setShowCta(true)}
              >
                Try it live <ArrowRight size={12} />
              </button>
            </div>

            {/* Screen labels */}
            <div className="crm-rec-screen-labels">
              {SCREENS.map((s, i) => (
                <button
                  key={i}
                  className={`crm-rec-screen-label ${i === currentScreen ? 'active' : ''}`}
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
        ) : (
          <div className="crm-video-demo-active">
            <div className="crm-video-demo-content">
              <div className="crm-video-demo-icon">
                <Kanban size={48} color="#ff7e5f" />
              </div>
              <h3 style={{ fontSize: 22, fontWeight: 700, color: '#f5f0eb', margin: '16px 0 8px' }}>
                Try the CRM Live
              </h3>
              <p style={{ fontSize: 14, color: '#9a918a', maxWidth: 400, margin: '0 auto 24px', lineHeight: 1.6 }}>
                Experience the full CRM with pre-loaded demo data. No sign-up required — explore leads, pipeline, deal scoring, and more.
              </p>
              <Link
                to="/crm"
                search={{ demo: true }}
                className="crm-video-demo-btn"
              >
                Launch CRM Demo <ArrowRight size={16} />
              </Link>
              <button
                onClick={() => setShowCta(false)}
                className="crm-video-back-btn"
              >
                Back to preview
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Feature highlights below video */}
      <div className="crm-video-features">
        {CRM_FEATURES.map(feat => (
          <div key={feat.label} className="crm-video-feature-item">
            <feat.icon size={20} color="#ff7e5f" />
            <div>
              <div style={{ fontSize: 13, fontWeight: 600, color: '#f5f0eb' }}>{feat.label}</div>
              <div style={{ fontSize: 11, color: '#7a7370', marginTop: 2 }}>{feat.desc}</div>
            </div>
          </div>
        ))}
      </div>
    </section>
  )
}

/* ──────────────────────────────────────────────────── */
/*  Screen components                                   */
/* ──────────────────────────────────────────────────── */

function DashboardScreen() {
  return (
    <div className="crm-rec-screen">
      {/* Stats row */}
      <div className="crm-rec-stats-row">
        <StatCard label="Active Leads" value="47" color="#5ba3d9" change="+12%" />
        <StatCard label="Offers Sent" value="12" color="#ff7e5f" change="+5" />
        <StatCard label="Pipeline Value" value="$284K" color="#a855f7" change="+18%" />
        <StatCard label="Closed Deals" value="8" color="#5cb885" change="+3" />
      </div>

      {/* Recent activity + mini chart */}
      <div className="crm-rec-dash-grid">
        <div className="crm-rec-card">
          <div className="crm-rec-card-header">Recent Activity</div>
          <div className="crm-rec-activity-list">
            {[
              { text: 'New lead: 1423 Elm St', time: '2m ago', dot: '#5ba3d9' },
              { text: 'Offer sent: 892 Oak Ave', time: '15m ago', dot: '#ff7e5f' },
              { text: 'Deal closed: 334 Poplar Ave', time: '1h ago', dot: '#22c55e' },
              { text: 'Follow-up due: Marcus J.', time: '2h ago', dot: '#e8a44a' },
            ].map((a, i) => (
              <div key={i} className="crm-rec-activity-row">
                <div className="crm-rec-activity-dot" style={{ background: a.dot }} />
                <span className="crm-rec-activity-text">{a.text}</span>
                <span className="crm-rec-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="crm-rec-card">
          <div className="crm-rec-card-header">Weekly Deals</div>
          <div className="crm-rec-mini-chart">
            {[35, 52, 40, 68, 55, 72, 60].map((h, i) => (
              <div key={i} className="crm-rec-chart-bar-wrap">
                <div className="crm-rec-chart-bar" style={{ height: `${h}%` }} />
                <span className="crm-rec-chart-label">{['M','T','W','T','F','S','S'][i]}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function StatCard({ label, value, color, change }: { label: string; value: string; color: string; change: string }) {
  return (
    <div className="crm-rec-stat-card" style={{ borderLeftColor: color }}>
      <div className="crm-rec-stat-value" style={{ color }}>{value}</div>
      <div className="crm-rec-stat-label">{label}</div>
      <div className="crm-rec-stat-change" style={{ color: change.startsWith('+') ? '#5cb885' : '#ef4444' }}>{change}</div>
    </div>
  )
}

function LeadsScreen() {
  return (
    <div className="crm-rec-screen">
      {/* Lead filters */}
      <div className="crm-rec-lead-filters">
        <div className="crm-rec-filter-chip active">All Leads (47)</div>
        <div className="crm-rec-filter-chip">New (12)</div>
        <div className="crm-rec-filter-chip">Contacted (18)</div>
        <div className="crm-rec-filter-chip">Qualified (9)</div>
      </div>
      {/* Lead table */}
      <div className="crm-rec-lead-table">
        <div className="crm-rec-lead-table-header">
          <span style={{ flex: 2 }}>Name</span>
          <span style={{ flex: 3 }}>Property</span>
          <span style={{ flex: 1.5 }}>Status</span>
          <span style={{ flex: 1.2, textAlign: 'right' }}>Value</span>
        </div>
        {LEADS_DATA.map((lead, i) => (
          <div key={i} className="crm-rec-lead-row" style={{ animationDelay: `${i * 0.1}s` }}>
            <span style={{ flex: 2, fontWeight: 500, color: '#f5f0eb' }}>{lead.name}</span>
            <span style={{ flex: 3, color: '#9a918a' }}>{lead.address}</span>
            <span style={{ flex: 1.5 }}>
              <span className="crm-rec-status-badge" style={{ background: `${lead.statusColor}22`, color: lead.statusColor, borderColor: `${lead.statusColor}44` }}>
                {lead.status}
              </span>
            </span>
            <span style={{ flex: 1.2, textAlign: 'right', color: '#f5f0eb', fontWeight: 600 }}>{lead.amount}</span>
          </div>
        ))}
      </div>
    </div>
  )
}

function PipelineScreen() {
  return (
    <div className="crm-rec-screen">
      <div className="crm-rec-pipeline">
        {PIPELINE_STAGES.map((stage, i) => (
          <div key={i} className="crm-rec-pipeline-col">
            <div className="crm-rec-pipeline-header">
              <div className="crm-rec-pipeline-header-dot" style={{ background: stage.color }} />
              <span>{stage.name}</span>
              <span className="crm-rec-pipeline-count">{stage.deals.length}</span>
            </div>
            <div className="crm-rec-pipeline-cards">
              {stage.deals.map((deal, j) => (
                <div key={j} className="crm-rec-pipeline-card" style={{ animationDelay: `${(i * 0.1) + (j * 0.05)}s` }}>
                  <div className="crm-rec-pipeline-card-addr">{deal}</div>
                  <div className="crm-rec-pipeline-card-bar" style={{ background: `${stage.color}33` }}>
                    <div style={{ width: `${60 + Math.random() * 40}%`, height: '100%', background: stage.color, borderRadius: 2 }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

function DealScoreScreen() {
  return (
    <div className="crm-rec-screen">
      <div className="crm-rec-dealscore-grid">
        {/* Score circle */}
        <div className="crm-rec-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: 'clamp(12px,2vw,24px)' }}>
          <div className="crm-rec-score-circle">
            <svg viewBox="0 0 100 100" className="crm-rec-score-svg">
              <circle cx="50" cy="50" r="42" fill="none" stroke="rgba(61,78,101,0.3)" strokeWidth="6" />
              <circle cx="50" cy="50" r="42" fill="none" stroke="#5cb885" strokeWidth="6"
                strokeDasharray={`${0.78 * 264} ${264}`}
                strokeDashoffset="0"
                strokeLinecap="round"
                transform="rotate(-90 50 50)"
                className="crm-rec-score-ring"
              />
            </svg>
            <div className="crm-rec-score-text">
              <div className="crm-rec-score-num">78</div>
              <div className="crm-rec-score-label">Deal Score</div>
            </div>
          </div>
          <div style={{ fontSize: 'clamp(9px,1vw,12px)', color: '#5cb885', fontWeight: 600, marginTop: 8 }}>Strong Buy</div>
        </div>

        {/* Breakdown */}
        <div className="crm-rec-card" style={{ padding: 'clamp(10px,1.5vw,18px)' }}>
          <div className="crm-rec-card-header" style={{ marginBottom: 'clamp(6px,1vw,12px)' }}>Score Breakdown</div>
          {[
            { label: 'Profit Potential', score: 85, color: '#5cb885' },
            { label: 'Market Strength', score: 72, color: '#5ba3d9' },
            { label: 'Investment Grade', score: 80, color: '#a855f7' },
            { label: 'Risk Level', score: 25, color: '#ef4444' },
          ].map((item, i) => (
            <div key={i} className="crm-rec-score-bar-row">
              <span className="crm-rec-score-bar-label">{item.label}</span>
              <div className="crm-rec-score-bar-track">
                <div className="crm-rec-score-bar-fill" style={{ width: `${item.score}%`, background: item.color }} />
              </div>
              <span className="crm-rec-score-bar-val" style={{ color: item.color }}>{item.score}</span>
            </div>
          ))}
        </div>

        {/* Metrics */}
        <div className="crm-rec-card" style={{ padding: 'clamp(10px,1.5vw,18px)' }}>
          <div className="crm-rec-card-header" style={{ marginBottom: 'clamp(6px,1vw,12px)' }}>Deal Metrics</div>
          <div className="crm-rec-metrics-grid">
            {[
              { label: 'Est. Profit', value: '$32,400', color: '#5cb885' },
              { label: 'ROI', value: '24.8%', color: '#5ba3d9' },
              { label: 'ARV Spread', value: '28%', color: '#a855f7' },
              { label: 'Repair/ARV', value: '15%', color: '#e8a44a' },
            ].map((m, i) => (
              <div key={i} className="crm-rec-metric-item">
                <div className="crm-rec-metric-val" style={{ color: m.color }}>{m.value}</div>
                <div className="crm-rec-metric-label">{m.label}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── NEW: Tasks Screen ── */
function TasksScreen() {
  const priorityColors: Record<string, string> = { urgent: '#ef4444', high: '#ff7e5f', medium: '#e8a44a', low: '#5ba3d9' }
  const statusIcons: Record<string, { bg: string; label: string }> = {
    todo: { bg: 'rgba(91,163,217,0.15)', label: 'To Do' },
    in_progress: { bg: 'rgba(168,85,247,0.15)', label: 'In Progress' },
    done: { bg: 'rgba(92,184,133,0.15)', label: 'Done' },
  }

  return (
    <div className="crm-rec-screen">
      {/* Task stats row */}
      <div className="crm-rec-stats-row">
        <StatCard label="Open Tasks" value="14" color="#ff7e5f" change="+3 today" />
        <StatCard label="Due Today" value="4" color="#ef4444" change="2 urgent" />
        <StatCard label="In Progress" value="6" color="#a855f7" change="on track" />
        <StatCard label="Completed" value="23" color="#5cb885" change="+8 this week" />
      </div>

      {/* Task list */}
      <div className="crm-rec-card" style={{ flex: 1, minHeight: 0, overflow: 'hidden' }}>
        <div className="crm-rec-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span>Task Queue</span>
          <span style={{ fontSize: 'clamp(7px,0.7vw,9px)', color: '#ff7e5f', fontWeight: 700, cursor: 'pointer' }}>+ Add Task</span>
        </div>
        <div className="crm-rec-tasks-list">
          {TASKS_DATA.map((task, i) => (
            <div key={i} className="crm-rec-task-row" style={{ animationDelay: `${i * 0.08}s` }}>
              <div className="crm-rec-task-check" style={{
                background: task.status === 'done' ? '#5cb885' : 'transparent',
                borderColor: task.status === 'done' ? '#5cb885' : 'rgba(61,78,101,0.4)',
              }}>
                {task.status === 'done' && <span style={{ color: 'white', fontSize: 'clamp(6px,0.6vw,8px)' }}>✓</span>}
              </div>
              <div className="crm-rec-task-content">
                <div className="crm-rec-task-title" style={{ textDecoration: task.status === 'done' ? 'line-through' : 'none', opacity: task.status === 'done' ? 0.5 : 1 }}>
                  {task.title}
                </div>
                <div className="crm-rec-task-meta">
                  <span className="crm-rec-task-deal">{task.deal}</span>
                </div>
              </div>
              <div className="crm-rec-task-priority" style={{ background: `${priorityColors[task.priority]}22`, color: priorityColors[task.priority], borderColor: `${priorityColors[task.priority]}44` }}>
                {task.priority}
              </div>
              <div className="crm-rec-task-due" style={{ color: task.due === 'Today' ? '#ef4444' : task.due === 'Done' ? '#5cb885' : '#9a918a' }}>
                {task.due}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ── NEW: Contacts Screen ── */
function ContactsScreen() {
  const roleColors: Record<string, string> = { Seller: '#ff7e5f', Buyer: '#5cb885', Agent: '#a855f7', 'Title Co': '#5ba3d9', Lender: '#e8a44a' }

  return (
    <div className="crm-rec-screen">
      {/* Contact filters */}
      <div className="crm-rec-lead-filters">
        <div className="crm-rec-filter-chip active">All Contacts (86)</div>
        <div className="crm-rec-filter-chip">Sellers (34)</div>
        <div className="crm-rec-filter-chip">Buyers (28)</div>
        <div className="crm-rec-filter-chip">Vendors (24)</div>
      </div>

      {/* Contact cards */}
      <div className="crm-rec-contacts-grid">
        {CONTACTS_DATA.map((contact, i) => (
          <div key={i} className="crm-rec-contact-card" style={{ animationDelay: `${i * 0.08}s` }}>
            <div className="crm-rec-contact-header">
              <div className="crm-rec-contact-avatar" style={{ background: roleColors[contact.role] || '#6b6560' }}>
                {contact.name.split(' ').map(n => n[0]).join('').slice(0, 2)}
              </div>
              <div className="crm-rec-contact-info">
                <div className="crm-rec-contact-name">{contact.name}</div>
                <div className="crm-rec-contact-role" style={{ color: roleColors[contact.role] || '#6b6560' }}>{contact.role}</div>
              </div>
              <div className="crm-rec-contact-last">{contact.lastContact}</div>
            </div>
            <div className="crm-rec-contact-details">
              <span className="crm-rec-contact-detail-item">{contact.phone}</span>
              <span className="crm-rec-contact-detail-item">{contact.email}</span>
            </div>
            <div className="crm-rec-contact-tags">
              {contact.tags.map((tag, j) => (
                <span key={j} className="crm-rec-contact-tag">{tag}</span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

/* ── NEW: Smart Lead Importer Screen ── */
function ImporterScreen() {
  return (
    <div className="crm-rec-screen">
      {/* Import stats */}
      <div className="crm-rec-stats-row">
        <StatCard label="Total Imported" value="4,797" color="#5ba3d9" change="+124 today" />
        <StatCard label="Deduplicated" value="312" color="#a855f7" change="auto-removed" />
        <StatCard label="Auto-Tagged" value="4,485" color="#5cb885" change="97% tagged" />
        <StatCard label="Sources" value="4" color="#ff7e5f" change="all synced" />
      </div>

      <div className="crm-rec-importer-grid">
        {/* Sources panel */}
        <div className="crm-rec-card" style={{ padding: 'clamp(8px,1vw,14px)' }}>
          <div className="crm-rec-card-header" style={{ marginBottom: 'clamp(6px,0.8vw,10px)' }}>Connected Sources</div>
          <div className="crm-rec-import-sources">
            {IMPORT_SOURCES.map((source, i) => (
              <div key={i} className="crm-rec-import-source-row" style={{ animationDelay: `${i * 0.1}s` }}>
                <div className="crm-rec-import-source-icon" style={{ background: `${source.color}22`, borderColor: `${source.color}44` }}>
                  <Upload size={10} color={source.color} />
                </div>
                <div className="crm-rec-import-source-info">
                  <div style={{ fontSize: 'clamp(7px,0.8vw,10px)', color: '#f5f0eb', fontWeight: 600 }}>{source.name}</div>
                  <div style={{ fontSize: 'clamp(6px,0.65vw,8px)', color: '#6b6560' }}>{source.count}</div>
                </div>
                <div className="crm-rec-import-source-status" style={{ color: source.color }}>
                  {source.status === 'connected' ? '● Connected' : '○ Ready'}
                </div>
              </div>
            ))}
          </div>
          <div className="crm-rec-import-add-btn">
            + Connect New Source
          </div>
        </div>

        {/* Recent import log */}
        <div className="crm-rec-card" style={{ padding: 'clamp(8px,1vw,14px)' }}>
          <div className="crm-rec-card-header" style={{ marginBottom: 'clamp(6px,0.8vw,10px)' }}>Recent Import Log</div>
          <div className="crm-rec-activity-list">
            {[
              { text: 'BatchLeads: 24 leads imported', time: '2h ago', dot: '#5cb885' },
              { text: '12 duplicates auto-merged', time: '2h ago', dot: '#a855f7' },
              { text: 'PropStream sync: 18 new leads', time: '6h ago', dot: '#5cb885' },
              { text: 'CSV Upload: 45 leads processed', time: '1d ago', dot: '#5ba3d9' },
              { text: 'Auto-tagged 45 leads by area', time: '1d ago', dot: '#e8a44a' },
            ].map((a, i) => (
              <div key={i} className="crm-rec-activity-row" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="crm-rec-activity-dot" style={{ background: a.dot }} />
                <span className="crm-rec-activity-text">{a.text}</span>
                <span className="crm-rec-activity-time">{a.time}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ── NEW: Activity Feed Screen ── */
function ActivityFeedScreen() {
  const iconMap: Record<string, typeof Phone> = {
    phone: Phone, mail: Mail, file: FileText, note: Flag, star: Star, upload: Upload, bell: Bell,
  }

  return (
    <div className="crm-rec-screen">
      {/* Activity stats */}
      <div className="crm-rec-stats-row">
        <StatCard label="Today's Actions" value="18" color="#5ba3d9" change="+6 vs yesterday" />
        <StatCard label="Calls Made" value="7" color="#a855f7" change="3 connected" />
        <StatCard label="Emails Sent" value="5" color="#ff7e5f" change="2 replies" />
        <StatCard label="Deals Updated" value="4" color="#5cb885" change="2 moved forward" />
      </div>

      {/* Activity timeline */}
      <div className="crm-rec-card" style={{ flex: 1, minHeight: 0, overflow: 'hidden', padding: 'clamp(8px,1vw,14px)' }}>
        <div className="crm-rec-card-header" style={{ marginBottom: 'clamp(6px,0.8vw,10px)', display: 'flex', justifyContent: 'space-between' }}>
          <span>Activity Timeline</span>
          <span style={{ fontSize: 'clamp(6px,0.65vw,8px)', color: '#6b6560', fontWeight: 400, textTransform: 'none', letterSpacing: 0 }}>All types</span>
        </div>
        <div className="crm-rec-timeline">
          {ACTIVITY_FEED_DATA.map((item, i) => {
            const Icon = iconMap[item.icon] || Activity
            return (
              <div key={i} className="crm-rec-timeline-item" style={{ animationDelay: `${i * 0.08}s` }}>
                <div className="crm-rec-timeline-line" />
                <div className="crm-rec-timeline-icon" style={{ background: `${item.color}22`, borderColor: `${item.color}44` }}>
                  <Icon size={9} color={item.color} />
                </div>
                <div className="crm-rec-timeline-content">
                  <div className="crm-rec-timeline-text">{item.text}</div>
                  <div className="crm-rec-timeline-time">{item.time}</div>
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

function ReportsScreen() {
  return (
    <div className="crm-rec-screen">
      <div className="crm-rec-reports-grid">
        {/* Big chart */}
        <div className="crm-rec-card crm-rec-chart-card">
          <div className="crm-rec-card-header">Revenue Trend</div>
          <div className="crm-rec-line-chart">
            <svg viewBox="0 0 300 100" preserveAspectRatio="none" className="crm-rec-line-svg">
              <defs>
                <linearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#ff7e5f" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#ff7e5f" stopOpacity="0" />
                </linearGradient>
              </defs>
              <path d="M0,80 L50,65 L100,70 L150,45 L200,50 L250,30 L300,20" fill="none" stroke="#ff7e5f" strokeWidth="2" className="crm-rec-line-path" />
              <path d="M0,80 L50,65 L100,70 L150,45 L200,50 L250,30 L300,20 L300,100 L0,100Z" fill="url(#chartGrad)" className="crm-rec-line-area" />
            </svg>
            <div className="crm-rec-chart-labels-x">
              {['Jan','Feb','Mar','Apr','May','Jun','Jul'].map((m,i) => (
                <span key={i}>{m}</span>
              ))}
            </div>
          </div>
        </div>

        {/* Mini stat cards */}
        <div className="crm-rec-reports-stats">
          {[
            { label: 'Total Revenue', value: '$142,800', color: '#5cb885', sub: '+34% vs last month' },
            { label: 'Avg Deal Size', value: '$17,850', color: '#5ba3d9', sub: '8 deals closed' },
            { label: 'Conversion Rate', value: '23.4%', color: '#a855f7', sub: 'From lead to close' },
            { label: 'Avg Days to Close', value: '18 days', color: '#e8a44a', sub: '-4 days improvement' },
          ].map((s, i) => (
            <div key={i} className="crm-rec-report-stat">
              <div className="crm-rec-report-stat-val" style={{ color: s.color }}>{s.value}</div>
              <div className="crm-rec-report-stat-label">{s.label}</div>
              <div className="crm-rec-report-stat-sub">{s.sub}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
