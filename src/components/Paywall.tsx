import { useState, useEffect, useRef } from 'react'
import { Lock, CreditCard, CheckCircle, Calendar, Phone, Key, AlertCircle, FileText, Search, Building2, MessageSquare, Handshake, Scale, BookOpen, Building, ShoppingCart, Star, XCircle, Mail, DollarSign, ClipboardCheck, Zap, LayoutGrid, Flame, GraduationCap, Map, Landmark, Send, ChevronDown, ChevronUp, ArrowRight, Shield, Users, TrendingUp, Contact, Sparkles, Download, Gamepad2, Target, MessageCircle, Vault, Upload, Activity, BarChart3, Bot, Eye, EyeOff } from 'lucide-react'
import CrmVideoPreview from './CrmVideoPreview'
import DealAnalyzerVideo from './DealAnalyzerVideo'
import { supabase } from '@/lib/supabase'

const STORAGE_KEY = 'wre_hub_unlocked'

interface PaywallProps {
  onUnlock: () => void
}

const FEATURE_CATEGORIES = [
  {
    label: 'Getting Started',
    color: '#ff7e5f',
    description: 'Build your foundation and start closing deals from day one',
    features: [
      { icon: Flame, name: 'Daily Motivation', desc: 'Fresh quotes and mindset coaching every day' },
      { icon: GraduationCap, name: 'Wholesale Glossary', desc: '100+ terms every wholesaler needs to know' },
      { icon: BookOpen, name: 'Key Verbiage', desc: 'Exact phrases to use with sellers, buyers & agents' },
      { icon: ClipboardCheck, name: 'Deal Checklist', desc: 'Step-by-step workflow from lead to closing' },
      { icon: Sparkles, name: 'First Deal in 15 Days', desc: 'Guided step-by-step workflow from market selection to buyer outreach' },
    ],
  },
  {
    label: 'Contracts & Legal',
    color: '#5ba3d9',
    description: 'Professional contracts and legal guides for all 50 states',
    features: [
      { icon: FileText, name: 'Contract Templates', desc: 'Standard Purchase and Sale Agreement (PSA), Assignment of Contract, Joint Venture (JV), Option to Purchase, Memorandum, and LOI for all 50 states.' },
      { icon: XCircle, name: 'Cancellation Contracts', desc: 'Protect yourself with proper cancellation forms' },
      { icon: Handshake, name: 'JV Resources', desc: 'Joint venture agreements and partnership templates' },
      { icon: Scale, name: 'State Laws & Rules', desc: "Do's, don'ts, and legal requirements per state" },
    ],
  },
  {
    label: 'Finding Deals',
    color: '#5cb885',
    description: 'Proven tools and strategies to find off-market properties',
    features: [
      { icon: Search, name: 'Skip Trace Tools', desc: 'Find owner contact info for any property' },
      { icon: ShoppingCart, name: 'Buy Leads', desc: 'Curated lead sources: probate, pre-foreclosure & more' },
      { icon: MessageSquare, name: 'Sales Scripts', desc: 'Cold call, follow-up & objection-handling scripts' },
      { icon: Mail, name: 'Marketing Templates', desc: 'Direct mail, SMS, email & social media campaigns' },
      { icon: Map, name: 'Property Map', desc: 'Interactive map to identify target markets' },
    ],
  },
  {
    label: 'Buyers & Closing',
    color: '#ffb347',
    description: 'Connect with cash buyers and close deals fast',
    features: [
      { icon: Building, name: 'Hedge Fund Buyers', desc: 'Institutional & hedge fund cash buyer directory' },
      { icon: Landmark, name: 'Investment Brokerages', desc: 'Nationwide brokerage contacts for dispositions' },
      { icon: Send, name: 'Deal Analyzer', desc: 'Analyze deals and send to your buyer list instantly' },
      { icon: Mail, name: 'Disposition Emails', desc: 'Pre-written buyer outreach and deal blast templates' },
      { icon: Building2, name: 'Title Companies', desc: 'Investor-friendly title companies in every state' },
    ],
  },
  {
    label: 'Tools & Finance',
    color: '#a855f7',
    description: 'Calculators, funding sources, coaching, and saved analyses',
    features: [
      { icon: Zap, name: 'Quick Offer Calculator', desc: 'Run comps and generate offers in seconds' },
      { icon: LayoutGrid, name: 'Multi-Family Calculator', desc: 'NOI, cap rate & cash flow analysis' },
      { icon: TrendingUp, name: 'Investment Strategy Calc', desc: 'Compare wholesale, flip, and rental strategies' },
      { icon: DollarSign, name: 'Funding Sources', desc: 'Transactional lenders & hard money directory' },
      { icon: Phone, name: '1-on-1 Coaching Calls', desc: 'Book personal coaching with experienced wholesalers' },
      { icon: Star, name: 'Reviews', desc: 'Real success stories from FTC members' },
      { icon: BarChart3, name: 'Saved Analyses', desc: 'View and compare your past calculator results' },
    ],
  },
  {
    label: 'CRM & Pipeline',
    color: '#3b82f6',
    description: 'Manage your leads, deals, and business from one dashboard',
    features: [
      { icon: Contact, name: 'CRM Dashboard', desc: 'Manage leads, offers, and sent deals in one place' },
      { icon: Target, name: 'Lead Pipeline', desc: 'Visual kanban board to track leads through stages' },
      { icon: Upload, name: 'Smart Lead Importer', desc: 'Bulk import leads from CSV or spreadsheets' },
      { icon: Activity, name: 'Deal Tracker', desc: 'Monitor deal progress from contract to close' },
      { icon: ClipboardCheck, name: 'Activity Feed', desc: 'Log calls, emails, meetings & notes per contact' },
      { icon: Bot, name: 'DealMaker AI', desc: 'Auto-generate offers and outreach from deal data' },
    ],
  },
  {
    label: 'Practice & Learn',
    color: '#ec4899',
    description: 'Risk-free deal simulators and coaching to sharpen your skills',
    features: [
      { icon: Gamepad2, name: 'Practice Deals', desc: 'Simulate the entire wholesale process — zero risk' },
      { icon: MessageSquare, name: 'Script Coach', desc: 'Practice cold calls and objection handling with AI' },
    ],
  },
  {
    label: 'Community & Marketplace',
    color: '#14b8a6',
    description: 'Network with wholesalers, list deals, and fund your EMD',
    features: [
      { icon: MessageCircle, name: 'Community Forum', desc: 'Ask questions, share deal wins, and network' },
      { icon: Building2, name: 'Property Marketplace', desc: 'Browse and post wholesale deals to other investors' },
      { icon: Vault, name: 'EMD Vault', desc: 'Earnest money deposit funding and management' },
    ],
  },
]

/* ─── Professional Moving Background ─── */
function AnimatedBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let animId: number
    let w = 0
    let h = 0
    let time = 0

    interface Particle {
      x: number; y: number; size: number; speedX: number; speedY: number
      opacity: number; color: string; pulse: number; pulseSpeed: number
    }

    interface LightStreak {
      x: number; y: number; length: number; angle: number
      speed: number; opacity: number; color: string; width: number
    }

    const particles: Particle[] = []
    const streaks: LightStreak[] = []

    const palette = [
      [244, 126, 95],   // orange
      [168, 85, 247],   // purple
      [91, 163, 217],   // blue
      [92, 184, 133],   // green
      [255, 179, 71],   // gold
    ]

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas!.width = w * dpr
      canvas!.height = h * dpr
      canvas!.style.width = w + 'px'
      canvas!.style.height = h + 'px'
      ctx!.setTransform(dpr, 0, 0, dpr, 0, 0)
    }

    function init() {
      resize()
      particles.length = 0
      streaks.length = 0

      // Floating particles
      const count = Math.min(60, Math.floor((w * h) / 20000))
      for (let i = 0; i < count; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)]
        particles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          size: Math.random() * 2.5 + 0.5,
          speedX: (Math.random() - 0.5) * 0.3,
          speedY: -Math.random() * 0.2 - 0.05,
          opacity: Math.random() * 0.5 + 0.15,
          color: `${c[0]},${c[1]},${c[2]}`,
          pulse: Math.random() * Math.PI * 2,
          pulseSpeed: Math.random() * 0.02 + 0.005,
        })
      }

      // Light streaks
      for (let i = 0; i < 3; i++) {
        const c = palette[Math.floor(Math.random() * palette.length)]
        streaks.push({
          x: Math.random() * w,
          y: Math.random() * h,
          length: Math.random() * 300 + 200,
          angle: Math.random() * Math.PI * 2,
          speed: Math.random() * 0.002 + 0.001,
          opacity: Math.random() * 0.04 + 0.02,
          color: `${c[0]},${c[1]},${c[2]}`,
          width: Math.random() * 80 + 40,
        })
      }
    }

    function drawMeshGradient(t: number) {
      // Animated aurora-like mesh blobs
      const blobs = [
        { cx: w * 0.2, cy: h * 0.3, rx: w * 0.4, ry: h * 0.35, color: palette[0], phase: 0 },
        { cx: w * 0.8, cy: h * 0.2, rx: w * 0.35, ry: h * 0.3, color: palette[1], phase: 2 },
        { cx: w * 0.5, cy: h * 0.7, rx: w * 0.45, ry: h * 0.4, color: palette[2], phase: 4 },
        { cx: w * 0.15, cy: h * 0.8, rx: w * 0.3, ry: h * 0.3, color: palette[3], phase: 1.5 },
        { cx: w * 0.85, cy: h * 0.6, rx: w * 0.3, ry: h * 0.35, color: palette[4], phase: 3 },
      ]

      for (const b of blobs) {
        const offsetX = Math.sin(t * 0.0003 + b.phase) * w * 0.08
        const offsetY = Math.cos(t * 0.0002 + b.phase * 1.3) * h * 0.06
        const cx = b.cx + offsetX
        const cy = b.cy + offsetY
        const grad = ctx!.createRadialGradient(cx, cy, 0, cx, cy, Math.max(b.rx, b.ry))
        grad.addColorStop(0, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.07)`)
        grad.addColorStop(0.5, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0.03)`)
        grad.addColorStop(1, `rgba(${b.color[0]},${b.color[1]},${b.color[2]},0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.ellipse(cx, cy, b.rx, b.ry, Math.sin(t * 0.0001 + b.phase) * 0.3, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawStreaks(t: number) {
      for (const s of streaks) {
        s.angle += s.speed
        const cx = s.x + Math.sin(t * 0.0004) * 100
        const cy = s.y + Math.cos(t * 0.0003) * 80
        const endX = cx + Math.cos(s.angle) * s.length
        const endY = cy + Math.sin(s.angle) * s.length
        const grad = ctx!.createLinearGradient(cx, cy, endX, endY)
        grad.addColorStop(0, `rgba(${s.color},0)`)
        grad.addColorStop(0.5, `rgba(${s.color},${s.opacity})`)
        grad.addColorStop(1, `rgba(${s.color},0)`)
        ctx!.strokeStyle = grad
        ctx!.lineWidth = s.width
        ctx!.lineCap = 'round'
        ctx!.beginPath()
        ctx!.moveTo(cx, cy)
        ctx!.lineTo(endX, endY)
        ctx!.stroke()
      }
    }

    function drawParticles(t: number) {
      for (const p of particles) {
        p.x += p.speedX
        p.y += p.speedY
        p.pulse += p.pulseSpeed

        if (p.y < -10) { p.y = h + 10; p.x = Math.random() * w }
        if (p.x < -10) p.x = w + 10
        if (p.x > w + 10) p.x = -10

        const alpha = p.opacity * (0.6 + 0.4 * Math.sin(p.pulse))
        const glow = p.size * 3
        const grad = ctx!.createRadialGradient(p.x, p.y, 0, p.x, p.y, glow)
        grad.addColorStop(0, `rgba(${p.color},${alpha})`)
        grad.addColorStop(1, `rgba(${p.color},0)`)
        ctx!.fillStyle = grad
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, glow, 0, Math.PI * 2)
        ctx!.fill()

        // Core dot
        ctx!.fillStyle = `rgba(${p.color},${alpha * 1.5})`
        ctx!.beginPath()
        ctx!.arc(p.x, p.y, p.size * 0.5, 0, Math.PI * 2)
        ctx!.fill()
      }
    }

    function drawGrid() {
      ctx!.strokeStyle = 'rgba(255,255,255,0.015)'
      ctx!.lineWidth = 0.5
      const spacing = 60
      for (let x = 0; x < w; x += spacing) {
        ctx!.beginPath()
        ctx!.moveTo(x, 0)
        ctx!.lineTo(x, h)
        ctx!.stroke()
      }
      for (let y = 0; y < h; y += spacing) {
        ctx!.beginPath()
        ctx!.moveTo(0, y)
        ctx!.lineTo(w, y)
        ctx!.stroke()
      }
    }

    function draw() {
      time += 16
      ctx!.clearRect(0, 0, w, h)

      // Background base
      ctx!.fillStyle = '#0d1117'
      ctx!.fillRect(0, 0, w, h)

      // Subtle grid
      drawGrid()

      // Mesh gradient aurora
      drawMeshGradient(time)

      // Rotating light streaks
      drawStreaks(time)

      // Floating particles
      drawParticles(time)

      // Vignette overlay
      const vignette = ctx!.createRadialGradient(w / 2, h / 2, w * 0.2, w / 2, h / 2, w * 0.8)
      vignette.addColorStop(0, 'rgba(13,17,23,0)')
      vignette.addColorStop(1, 'rgba(13,17,23,0.5)')
      ctx!.fillStyle = vignette
      ctx!.fillRect(0, 0, w, h)

      animId = requestAnimationFrame(draw)
    }

    init()
    draw()
    window.addEventListener('resize', init)
    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', init)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 0,
        pointerEvents: 'none',
      }}
    />
  )
}

/* ─── Grid overlay is now part of canvas ─── */
function GridOverlay() {
  return null
}

export default function Paywall({ onUnlock }: PaywallProps) {
  const [activeTab, setActiveTab] = useState<'signup' | 'login'>('signup')
  const [expandedCategory, setExpandedCategory] = useState<number | null>(null)
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const [leadEmail, setLeadEmail] = useState('')
  const [leadName, setLeadName] = useState('')
  const [leadResource, setLeadResource] = useState('wholesale-checklist')
  const [leadSubmitting, setLeadSubmitting] = useState(false)
  const [leadSubmitted, setLeadSubmitted] = useState(false)
  const [leadError, setLeadError] = useState('')

  function handleLeadSubmit(e: React.FormEvent) {
    e.preventDefault()
    setLeadSubmitted(true)
  }

  async function handleAuth(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')
    try {
      if (activeTab === 'signup') {
        const { error: signUpError } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: name, plan: 'full' }
          }
        })
        if (signUpError) throw signUpError
      } else {
        const { error: signInError } = await supabase.auth.signInWithPassword({
          email,
          password,
        })
        if (signInError) throw signInError
      }
      
      localStorage.setItem('wre_hub_tier', 'full')
      onUnlock()
    } catch (err: any) {
      setError(err.message || 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const totalFeatures = FEATURE_CATEGORIES.reduce((sum, cat) => sum + cat.features.length, 0)

  return (
    <div className="paywall-root">
      <AnimatedBackground />
      <GridOverlay />

      {/* ─── Scrollable Content ─── */}
      <div className="paywall-scroll">

        {/* ─── HERO ─── */}
        <section className="paywall-hero">
          <div className="paywall-hero-inner">
            {/* Logo */}
            <div className="paywall-logo">FTC</div>

            <div className="paywall-badges">
              <span className="badge badge-orange" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Flame size={10} /> #1 Wholesale Platform
              </span>
              <span className="badge badge-green" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield size={10} /> All 50 States
              </span>
            </div>

            <h1 className="paywall-title">
              Everything You Need to<br />
              <span className="paywall-title-accent">Close Wholesale Deals</span>
            </h1>

            <p className="paywall-subtitle">
              {totalFeatures} premium tools, templates, and resources across {FEATURE_CATEGORIES.length} categories. From your first deal to building a wholesale empire.
            </p>

            {/* Outcome-focused line + Stats */}
            <p style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(15px, 2.2vw, 20px)',
              color: '#ffb347',
              letterSpacing: '0.04em',
              lineHeight: 1.3,
              margin: '0 0 12px',
              textAlign: 'center',
            }}>
              Everything you need to find, negotiate, and close your first wholesale deal
            </p>
            <div className="paywall-stats">
              {[
                { num: '37', label: 'Tools & Features' },
                { num: '50', label: 'States Covered' },
                { num: '8', label: 'Categories' },
              ].map(s => (
                <div key={s.label} className="paywall-stat">
                  <div className="paywall-stat-num">{s.num}</div>
                  <div className="paywall-stat-label">{s.label}</div>
                </div>
              ))}
            </div>

            {/* CTA arrow */}
            <button
              onClick={() => document.getElementById('get-access')?.scrollIntoView({ behavior: 'smooth' })}
              className="paywall-hero-cta"
            >
              <ArrowRight size={16} /> Get Started Now
            </button>
          </div>
        </section>

        {/* ─── CRM VIDEO PREVIEW ─── */}
        <CrmVideoPreview />

        {/* ─── DEAL ANALYZER VIDEO PREVIEW ─── */}
        <DealAnalyzerVideo />

        {/* ─── TWO-COLUMN LAYOUT: Features + Pricing ─── */}
        <div className="paywall-main">

          {/* ─── LEFT: Feature Categories ─── */}
          <section className="paywall-features">
            <div style={{ textAlign: 'center', marginBottom: 24 }}>
              <h2 className="paywall-section-title">What's Inside</h2>
              <p style={{ color: '#6b6560', fontSize: 13 }}>Tap a category to preview everything included</p>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {FEATURE_CATEGORIES.map((cat, idx) => {
                const isExpanded = expandedCategory === idx
                return (
                  <div
                    key={cat.label}
                    className="paywall-cat-card"
                    style={{
                      background: isExpanded
                        ? `linear-gradient(135deg, ${cat.color}0a, ${cat.color}05)`
                        : 'rgba(26,31,40,0.7)',
                      borderColor: isExpanded ? `${cat.color}50` : '#3d4e65',
                    }}
                  >
                    <button
                      onClick={() => setExpandedCategory(isExpanded ? null : idx)}
                      className="paywall-cat-btn"
                    >
                      <div className="paywall-cat-icon" style={{ background: `${cat.color}15`, borderColor: `${cat.color}30` }}>
                        {idx === 0 && <Flame size={18} color={cat.color} />}
                        {idx === 1 && <FileText size={18} color={cat.color} />}
                        {idx === 2 && <Search size={18} color={cat.color} />}
                        {idx === 3 && <Building size={18} color={cat.color} />}
                        {idx === 4 && <Zap size={18} color={cat.color} />}
                        {idx === 5 && <Contact size={18} color={cat.color} />}
                        {idx === 6 && <Gamepad2 size={18} color={cat.color} />}
                        {idx === 7 && <MessageCircle size={18} color={cat.color} />}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontFamily: "'Bebas Neue', sans-serif",
                          fontSize: 'clamp(17px, 2vw, 20px)',
                          color: cat.color,
                          letterSpacing: '0.04em',
                          lineHeight: 1.2,
                        }}>{cat.label}</div>
                        <div style={{ fontSize: 12, color: '#7a7370', marginTop: 2, lineHeight: 1.4 }}>
                          {cat.description}
                        </div>
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
                        <span className="paywall-cat-count">{cat.features.length} tools</span>
                        {isExpanded
                          ? <ChevronUp size={18} color="#6b6560" />
                          : <ChevronDown size={18} color="#6b6560" />
                        }
                      </div>
                    </button>

                    {isExpanded && (
                      <div style={{ padding: '0 clamp(16px, 2vw, 24px) clamp(16px, 2vw, 20px)' }} className="animate-fade-in-up">
                        <div className="paywall-feature-grid">
                          {cat.features.map(feat => (
                            <div key={feat.name} className="paywall-feature-item">
                              <feat.icon size={16} color={cat.color} style={{ flexShrink: 0, marginTop: 2 }} />
                              <div>
                                <div style={{ fontSize: 14, fontWeight: 600, color: '#f5f0eb', lineHeight: 1.3 }}>
                                  {feat.name}
                                </div>
                                <div style={{ fontSize: 12, color: '#7a7370', lineHeight: 1.5, marginTop: 2 }}>
                                  {feat.desc}
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )
              })}
            </div>
          </section>

          {/* ─── RIGHT: Pricing Card (Sticky on Desktop) ─── */}
          <section id="get-access" className="paywall-pricing">
            <div className="paywall-pricing-card">
              {/* Tab switcher for auth */}
              <div className="paywall-tabs">
                <button
                  onClick={() => setActiveTab('signup')}
                  className={`paywall-tab ${activeTab === 'signup' ? 'paywall-tab-active' : ''}`}
                >
                  <Sparkles size={14} />
                  Subscribe
                </button>
                <button
                  onClick={() => setActiveTab('login')}
                  className={`paywall-tab ${activeTab === 'login' ? 'paywall-tab-active' : ''}`}
                >
                  <Key size={14} />
                  Log In
                </button>
              </div>

              {/* Panel content */}
              <div className="paywall-panel">
                <div className="animate-fade-in">

                  {activeTab === 'signup' && (
                    <>
                      <div className="paywall-price-header" style={{ marginBottom: 20 }}>
                        <div className="animate-fade-in" style={{ textAlign: 'center' }}>
                          <div className="paywall-price-badge" style={{ display: 'inline-flex', marginBottom: 8, background: 'linear-gradient(135deg, #5cb885, #3a9d6a)' }}>
                            <Sparkles size={10} /> PRO MEMBERSHIP
                          </div>
                          <div className="paywall-price-amount" style={{ fontSize: 42, color: '#f5f0eb' }}>
                            $50<span className="paywall-price-period">/month</span>
                          </div>
                          <p style={{ fontSize: 13, color: '#9a918a', margin: '8px 0 0' }}>
                            Cancel anytime &middot; Instant access &middot; All wholesale tools
                          </p>
                        </div>
                      </div>
                      <div className="paywall-info-box" style={{ background: 'rgba(92,184,133,0.08)', borderColor: 'rgba(92,184,133,0.2)', marginBottom: 16 }}>
                        <Shield size={16} color="#5cb885" style={{ flexShrink: 0 }} />
                        <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0, lineHeight: 1.5 }}>
                          <strong>Test Mode Active:</strong> Payment is bypassed. Create your account to access all premium features for free.
                        </p>
                      </div>
                    </>
                  )}

                  {activeTab === 'login' && (
                    <div className="paywall-info-box" style={{ background: 'rgba(91,163,217,0.08)', borderColor: 'rgba(91,163,217,0.2)', marginBottom: 16 }}>
                      <Sparkles size={16} color="#5ba3d9" style={{ flexShrink: 0 }} />
                      <p style={{ fontSize: 12, color: '#8ab8d9', margin: 0, lineHeight: 1.5 }}>
                        <strong>Welcome back</strong> to access all premium wholesale tools and resources instantly.
                      </p>
                    </div>
                  )}

                  <form onSubmit={handleAuth} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                    {activeTab === 'signup' && (
                      <div>
                        <label className="paywall-label">Full Name</label>
                        <input
                          className="input-dark"
                          placeholder="John Smith"
                          value={name}
                          onChange={e => setName(e.target.value)}
                          disabled={loading}
                        />
                      </div>
                    )}
                    <div>
                      <label className="paywall-label">Email Address *</label>
                      <input
                        className="input-dark"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={email}
                        onChange={e => { setEmail(e.target.value); setError('') }}
                        disabled={loading}
                      />
                    </div>
                    <div>
                      <label className="paywall-label">Password *</label>
                      <div style={{ position: 'relative' }}>
                        <input
                          className="input-dark"
                          type={showPassword ? 'text' : 'password'}
                          placeholder="••••••••"
                          required
                          value={password}
                          onChange={e => { setPassword(e.target.value); setError('') }}
                          disabled={loading}
                          style={{ paddingRight: 44 }}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword(!showPassword)}
                          style={{
                            position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                            background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4,
                          }}
                        >
                          {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>

                    {error && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 12 }}>
                        <AlertCircle size={14} />
                        {error}
                      </div>
                    )}

                    <button
                      type="submit"
                      disabled={loading}
                      className="btn-orange paywall-submit-btn"
                      style={{ opacity: loading ? 0.6 : 1, cursor: loading ? 'not-allowed' : 'pointer', marginTop: 8 }}
                    >
                      {loading ? 'Processing...' : activeTab === 'signup' ? 'Subscribe Now — $50/mo' : 'Log In & Unlock'}
                    </button>
                  </form>
                </div>
              </div>
            </div>

            {/* Testimonial */}
            <div className="paywall-testimonial">
              <p className="paywall-testimonial-text">
                "FTC gave me everything I needed to close my first deal in 30 days. The contracts, buyer lists, and scripts are worth 10x the price."
              </p>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 12 }}>
                <img src="https://i.pravatar.cc/100?img=33" alt="User Avatar" style={{ width: 32, height: 32, borderRadius: '50%', border: '2px solid rgba(244,126,95,0.4)' }} />
                <span style={{ fontSize: 12, color: '#ff7e5f', fontWeight: 600 }}>— FTC Member, Phoenix AZ</span>
              </div>
            </div>

            {/* Support link */}
            <p style={{ textAlign: 'center', fontSize: 12, color: '#4a4440', marginTop: 16, lineHeight: 1.6 }}>
              Questions? Email <a href="mailto:support@flipthecontract.com" style={{ color: '#ff7e5f', textDecoration: 'none' }}>support@flipthecontract.com</a>
            </p>
          </section>

          {/* ─── LEAD MAGNET ─── */}
          <section className="paywall-lead-magnet">
            <div className="paywall-lead-magnet-inner">
              <div className="paywall-lead-magnet-badge">
                <Sparkles size={12} /> FREE DOWNLOAD
              </div>
              <h2 className="paywall-lead-magnet-title">
                Not Ready to Subscribe Yet?
              </h2>
              <p className="paywall-lead-magnet-subtitle">
                Grab one of these free resources — no credit card required. Start building your wholesale business today.
              </p>

              {!leadSubmitted ? (
                <form
                  name="lead-magnet"
                  onSubmit={handleLeadSubmit}
                  className="paywall-lead-magnet-form"
                >
                  <input type="hidden" name="form-name" value="lead-magnet" />
                  <p style={{ display: 'none' }}>
                    <label>Don't fill this out: <input name="bot-field" /></label>
                  </p>

                  {/* Resource picker */}
                  <div className="paywall-lead-magnet-options">
                    {[
                      { value: 'wholesale-checklist', icon: ClipboardCheck, label: 'Wholesale Deal Checklist', desc: 'Step-by-step guide from lead to closing' },
                      { value: 'sample-contracts', icon: FileText, label: 'Sample Contract Packet', desc: 'PSA, assignment & JV agreement samples' },
                      { value: 'deal-analyzer', icon: DollarSign, label: 'Deal Analyzer Template', desc: 'Spreadsheet to evaluate any wholesale deal' },
                    ].map(opt => (
                      <label
                        key={opt.value}
                        className={`paywall-lead-magnet-option ${leadResource === opt.value ? 'paywall-lead-magnet-option-active' : ''}`}
                      >
                        <input
                          type="radio"
                          name="resource"
                          value={opt.value}
                          checked={leadResource === opt.value}
                          onChange={() => setLeadResource(opt.value)}
                          style={{ display: 'none' }}
                        />
                        <div className="paywall-lead-magnet-option-icon" style={{ color: leadResource === opt.value ? '#ff7e5f' : '#6b6560' }}>
                          <opt.icon size={20} />
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ fontSize: 13, fontWeight: 600, color: leadResource === opt.value ? '#f5f0eb' : '#c4bdb6' }}>{opt.label}</div>
                          <div style={{ fontSize: 11, color: '#8a8480', lineHeight: 1.4 }}>{opt.desc}</div>
                        </div>
                        <div className="paywall-lead-magnet-radio" style={{ borderColor: leadResource === opt.value ? '#ff7e5f' : '#3d4e65' }}>
                          {leadResource === opt.value && <div className="paywall-lead-magnet-radio-dot" />}
                        </div>
                      </label>
                    ))}
                  </div>

                  {/* Name & Email */}
                  <div className="paywall-lead-magnet-fields">
                    <div>
                      <label className="paywall-label">First Name</label>
                      <input
                        className="input-dark"
                        name="name"
                        placeholder="John"
                        value={leadName}
                        onChange={e => setLeadName(e.target.value)}
                        disabled={leadSubmitting}
                      />
                    </div>
                    <div>
                      <label className="paywall-label">Email Address *</label>
                      <input
                        className="input-dark"
                        name="email"
                        type="email"
                        placeholder="john@example.com"
                        required
                        value={leadEmail}
                        onChange={e => { setLeadEmail(e.target.value); setLeadError('') }}
                        disabled={leadSubmitting}
                      />
                    </div>
                  </div>

                  {leadError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, color: '#ef4444', fontSize: 12 }}>
                      <AlertCircle size={14} />
                      {leadError}
                    </div>
                  )}

                  <button
                    type="submit"
                    disabled={leadSubmitting}
                    className="paywall-lead-magnet-btn"
                    style={{ opacity: leadSubmitting ? 0.6 : 1, cursor: leadSubmitting ? 'not-allowed' : 'pointer' }}
                  >
                    <ArrowRight size={18} />
                    {leadSubmitting ? 'Sending...' : 'Send Me the Free Resource'}
                  </button>

                  <p style={{ fontSize: 11, color: '#6b6560', textAlign: 'center', margin: 0 }}>
                    No spam, ever. Unsubscribe anytime.
                  </p>
                </form>
              ) : (
                <div className="paywall-lead-magnet-success animate-fade-in">
                  <CheckCircle size={44} color="#5cb885" />
                  <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885', letterSpacing: '0.04em', margin: 0 }}>
                    Your Free Resource Is Ready!
                  </h3>
                  <p style={{ fontSize: 13, color: '#a09890', lineHeight: 1.6, margin: 0 }}>
                    Thanks, <strong style={{ color: '#f5f0eb' }}>{leadName || 'friend'}</strong>! Click below to download your free resource right now.
                  </p>
                  <a
                    href={
                      leadResource === 'sample-contracts'
                        ? '/resources/sample-contracts.txt'
                        : leadResource === 'deal-analyzer'
                          ? '/resources/deal-analyzer.txt'
                          : '/resources/wholesale-checklist.txt'
                    }
                    download
                    style={{
                      display: 'inline-flex',
                      alignItems: 'center',
                      gap: 8,
                      padding: '12px 28px',
                      background: 'linear-gradient(135deg, #5cb885, #3a9d6a)',
                      color: '#fff',
                      borderRadius: 10,
                      fontSize: 15,
                      fontWeight: 700,
                      textDecoration: 'none',
                      marginTop: 12,
                      transition: 'opacity 0.2s',
                    }}
                  >
                    <Download size={18} />
                    Download{' '}
                    {leadResource === 'sample-contracts'
                      ? 'Sample Contract Packet'
                      : leadResource === 'deal-analyzer'
                        ? 'Deal Analyzer Template'
                        : 'Wholesale Deal Checklist'}
                  </a>
                  <p style={{ fontSize: 11, color: '#6b6560', marginTop: 12, margin: '12px 0 0' }}>
                    We also sent a copy to <strong style={{ color: '#a09890' }}>{leadEmail}</strong>.
                  </p>
                  <button
                    onClick={() => document.getElementById('get-access')?.scrollIntoView({ behavior: 'smooth' })}
                    className="paywall-lead-magnet-upgrade-btn"
                  >
                    <Sparkles size={14} />
                    Ready to Get Full Access?
                  </button>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* ─── COMPETITOR COMPARISON CHART ─── */}
        <section className="paywall-comparison">
          <div className="paywall-comparison-inner">
            <div className="paywall-comparison-header">
              <span className="paywall-comparison-badge">
                <TrendingUp size={12} /> SEE THE DIFFERENCE
              </span>
              <h2 className="paywall-comparison-title">
                Why Wholesalers Choose <span style={{ color: '#ff7e5f' }}>FTC</span>
              </h2>
              <p className="paywall-comparison-subtitle">
                Compare Flip the Contract against other popular wholesale real estate platforms. No other platform gives you this many tools at this price.
              </p>
            </div>

            {/* Scrollable table wrapper for mobile */}
            <div className="paywall-comparison-table-wrap">
              <table className="paywall-comparison-table">
                <thead>
                  <tr>
                    <th className="paywall-comparison-feature-col">Feature</th>
                    <th className="paywall-comparison-ftc-col">
                      <div className="paywall-comparison-ftc-header">
                        <span className="paywall-comparison-ftc-logo">FTC</span>
                        <span className="paywall-comparison-ftc-price">$50/mo</span>
                      </div>
                    </th>
                    <th>REIPro<br /><span className="paywall-comparison-competitor-price">$149/mo</span></th>
                    <th>PropertyRadar<br /><span className="paywall-comparison-competitor-price">$59/mo</span></th>
                    <th>InvestorLift<br /><span className="paywall-comparison-competitor-price">$175/mo</span></th>
                    <th>BatchLeads<br /><span className="paywall-comparison-competitor-price">$99/mo</span></th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    { feature: '50-State Contract Templates', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Assignment & JV Contracts', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Cancellation Contract Forms', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'State Laws & Compliance', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Skip Tracing Tools', ftc: true, c1: true, c2: true, c3: false, c4: true },
                    { feature: 'Lead Generation', ftc: true, c1: true, c2: true, c3: false, c4: true },
                    { feature: 'Hedge Fund Buyer Lists', ftc: true, c1: false, c2: false, c3: true, c4: false },
                    { feature: 'Cash Buyer Directory', ftc: true, c1: false, c2: false, c3: true, c4: false },
                    { feature: 'Deal Analyzer', ftc: true, c1: true, c2: false, c3: false, c4: false },
                    { feature: 'CRM & Pipeline Tracker', ftc: true, c1: true, c2: false, c3: true, c4: true },
                    { feature: 'Marketing Templates & Scripts', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Quick Offer Calculator', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Multi-Family Calculator', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: '1-on-1 Coaching Calls', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Wholesale Glossary & Training', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Daily Motivation & Mindset', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Title Company Directory', ftc: true, c1: false, c2: false, c3: false, c4: false },
                    { feature: 'Funding Sources Directory', ftc: true, c1: false, c2: false, c3: false, c4: false },
                  ].map((row, i) => (
                    <tr key={i}>
                      <td className="paywall-comparison-feature-cell">{row.feature}</td>
                      <td className="paywall-comparison-ftc-cell">
                        {row.ftc ? <CheckCircle size={18} color="#5cb885" /> : <XCircle size={18} color="#4a4440" />}
                      </td>
                      <td>{row.c1 ? <CheckCircle size={16} color="#5cb885" /> : <XCircle size={16} color="#3d4e65" />}</td>
                      <td>{row.c2 ? <CheckCircle size={16} color="#5cb885" /> : <XCircle size={16} color="#3d4e65" />}</td>
                      <td>{row.c3 ? <CheckCircle size={16} color="#5cb885" /> : <XCircle size={16} color="#3d4e65" />}</td>
                      <td>{row.c4 ? <CheckCircle size={16} color="#5cb885" /> : <XCircle size={16} color="#3d4e65" />}</td>
                    </tr>
                  ))}
                  {/* Totals row */}
                  <tr className="paywall-comparison-totals-row">
                    <td className="paywall-comparison-feature-cell" style={{ fontWeight: 700, color: '#f5f0eb' }}>Total Features</td>
                    <td className="paywall-comparison-ftc-cell">
                      <span className="paywall-comparison-total paywall-comparison-total-ftc">18 / 18</span>
                    </td>
                    <td><span className="paywall-comparison-total">4 / 18</span></td>
                    <td><span className="paywall-comparison-total">2 / 18</span></td>
                    <td><span className="paywall-comparison-total">3 / 18</span></td>
                    <td><span className="paywall-comparison-total">3 / 18</span></td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Bottom CTA */}
            <div className="paywall-comparison-cta">
              <p className="paywall-comparison-cta-text">
                <strong style={{ color: '#ff7e5f' }}>FTC delivers 18 out of 18 features</strong> at just <strong style={{ color: '#5cb885' }}>$50/mo</strong> — less than any competitor. <span style={{ color: '#5ba3d9' }}>Start free with basic tools</span>, then upgrade when you're ready.
              </p>
              <button
                onClick={() => document.getElementById('get-access')?.scrollIntoView({ behavior: 'smooth' })}
                className="btn-orange paywall-comparison-cta-btn"
              >
                <ArrowRight size={16} /> Get Full Access Now
              </button>
            </div>
          </div>
        </section>

        {/* Social proof strip */}
        <section className="paywall-social-proof">
          <div className="paywall-social-proof-inner">
            {[
              { icon: Users, text: 'Growing community of wholesalers', color: '#5ba3d9' },
              { icon: TrendingUp, text: 'Members closing deals nationwide', color: '#5cb885' },
              { icon: Shield, text: 'Updated monthly with new content', color: '#ffb347' },
            ].map(item => (
              <div key={item.text} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <item.icon size={16} color={item.color} />
                <span style={{ fontSize: 13, color: '#9a918a' }}>{item.text}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Sticky mobile CTA */}
        <div className="paywall-sticky-cta">
          <button
            onClick={() => document.getElementById('get-access')?.scrollIntoView({ behavior: 'smooth' })}
            className="btn-orange w-full justify-center py-3 text-base"
          >
            Subscribe Now — $50/mo
          </button>
        </div>

        {/* Footer */}
        <footer className="paywall-footer">
          <span style={{ fontSize: 11, color: '#4a4440' }}>
            &copy; 2026 Flip the Contract LLC. All rights reserved. &middot;{' '}
            <a href="/terms" style={{ color: '#6b6560', textDecoration: 'none' }}>Terms & Conditions</a>
          </span>
        </footer>
      </div>
    </div>
  )
}

export type AccessTier = 'full' | 'free' | null

// Sections available to free-tier users
export const FREE_SECTIONS = new Set([
  'getting-started',
  'daily-motivation',
  'wholesale-glossary',
  'key-verbiage',
  'deal-checklist',
  'faq',
  'community',
  'reviews',
])

// Routes available to free-tier users
export const FREE_ROUTES = new Set([
  '/',
  '/getting-started',
  '/faq',
  '/community',
  '/login',
  '/terms',
  '/privacy',
  '/contact',
  '/settings',
])

export function usePaywall() {
  const [unlocked, setUnlocked] = useState<boolean | null>(null)
  const [tier, setTier] = useState<AccessTier>(null)

  useEffect(() => {
    async function check() {
      // Use a controller to timeout the fetch
      const controller = new AbortController()
      const timeoutId = setTimeout(() => controller.abort(), 3000)

      try {
        const res = await fetch('/api/check-access', { signal: controller.signal })
        const data = await res.json()
        setUnlocked(data.unlocked)
        setTier(data.tier || null)
      } catch (err) {
        console.warn('Access check failed or timed out, defaulting to locked state', err)
        setUnlocked(false)
        setTier(null)
      } finally {
        clearTimeout(timeoutId)
      }
    }
    check()
  }, [])

  function unlock() {
    setUnlocked(true)
    setTier('full')
    window.scrollTo({ top: 0, behavior: 'instant' })
  }

  return { unlocked, unlock, tier }
}
