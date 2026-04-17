import { createFileRoute, useNavigate, Link } from '@tanstack/react-router'
import { useState, useRef, useCallback, useEffect } from 'react'
import { Menu, X, Lock, Shield, ChevronRight, Flame, Building2, MessageCircle, PartyPopper, Users, FileText, Search, Scale, Zap, Home, LogOut, Target, FileCheck, Users2, Gamepad2, Settings, Sparkles, CircleCheckBig, Lightbulb, Info, Vault } from 'lucide-react'
import Paywall, { usePaywall, FREE_ROUTES } from '@/components/Paywall'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from '@/components/GlobalSearch'
import OnboardingTour, { RestartTourButton } from '@/components/OnboardingTour'

export const Route = createFileRoute('/')({
  component: HubPage,
})

// MLP category cards
const CATEGORIES = [
  {
    title: 'Getting Started',
    description: 'Daily tips, wholesale glossary, key verbiage, and deal checklists.',
    icon: Flame,
    badge: 'Beginner Friendly',
    badgeColor: 'green',
    to: '/getting-started' as const,
    items: ['Daily Motivation', 'Wholesale Glossary', 'Key Verbiage', 'Deal Checklist'],
    gradient: 'linear-gradient(135deg, rgba(92,184,133,0.12), rgba(92,184,133,0.03))',
    borderColor: 'rgba(92,184,133,0.25)',
  },
  {
    title: 'Contracts & Legal',
    description: '50-state purchase agreements, assignment contracts, double close agreements, LOIs, and state law guides.',
    icon: FileText,
    badge: 'All 50 States',
    badgeColor: 'orange',
    to: '/contracts-legal' as const,
    items: ['Contract Templates', 'Cancellation Contracts', 'JV Resources', 'State Laws'],
    gradient: 'linear-gradient(135deg, rgba(244,126,95,0.12), rgba(244,126,95,0.03))',
    borderColor: 'rgba(244,126,95,0.25)',
  },
  {
    title: 'Finding Deals',
    description: 'Skip trace tools, motivated seller leads, cold calling scripts, marketing templates, and property maps.',
    icon: Search,
    badge: 'Deal Finding',
    badgeColor: 'blue',
    to: '/deals' as const,
    items: ['Skip Trace Tools', 'Buy Leads', 'Sales Scripts', 'Marketing Templates', 'Property Map'],
    gradient: 'linear-gradient(135deg, rgba(91,163,217,0.12), rgba(91,163,217,0.03))',
    borderColor: 'rgba(91,163,217,0.25)',
  },
  {
    title: 'Buyers & Closing',
    description: 'Institutional buyer lists, hedge fund contacts, investment brokerages, deal analyzers, and title companies.',
    icon: Building2,
    badge: 'Cash Buyers',
    badgeColor: 'gold',
    to: '/buyers' as const,
    items: ['Hedge Fund Buyers', 'Investment Brokerages', 'Deal Analyzer', 'Title Companies'],
    gradient: 'linear-gradient(135deg, rgba(232,179,71,0.12), rgba(232,179,71,0.03))',
    borderColor: 'rgba(232,179,71,0.25)',
  },
  {
    title: 'Tools & Finance',
    description: 'Investment calculators, funding sources, 1-on-1 coaching, and community reviews.',
    icon: Zap,
    badge: 'Power Tools',
    badgeColor: 'purple',
    to: '/tools' as const,
    items: ['Quick Offer Calculator', 'Multi-Family Calc', 'Funding Sources', 'Coaching Calls', 'Reviews'],
    gradient: 'linear-gradient(135deg, rgba(168,85,247,0.12), rgba(168,85,247,0.03))',
    borderColor: 'rgba(168,85,247,0.25)',
  },
]

const QUICK_LINKS = [
  { to: '/first-deal' as const, label: 'First Deal in 15 Days', icon: Sparkles, desc: 'Guided deal workflow — start here' },
  { to: '/practice-deals' as const, label: 'Practice Deals', icon: Gamepad2, desc: 'Simulate deals — zero risk' },
  { to: '/properties' as const, label: 'Property Marketplace', icon: Building2, desc: 'Browse & post wholesale deals' },
  { to: '/community' as const, label: 'Community', icon: MessageCircle, desc: 'Q&A, deal wins, networking' },
  { to: '/crm' as const, label: 'My CRM', icon: Users, desc: 'Manage leads & pipeline' },
  { to: '/emd-vault' as const, label: 'EMD Vault', icon: Vault, desc: 'Earnest money funding' },
]

// Navigation links for MLP pages
const NAV_LINKS = [
  { to: '/' as const, label: 'Hub', icon: Home },
  { to: '/first-deal' as const, label: 'First Deal', icon: Sparkles },
  { to: '/getting-started' as const, label: 'Getting Started', icon: Flame },
  { to: '/contracts-legal' as const, label: 'Contracts', icon: FileText },
  { to: '/deals' as const, label: 'Find Deals', icon: Search },
  { to: '/buyers' as const, label: 'Buyers', icon: Scale },
  { to: '/tools' as const, label: 'Tools', icon: Zap },
  { to: '/practice-deals' as const, label: 'Practice', icon: Gamepad2 },
  { to: '/properties' as const, label: 'Properties', icon: Building2 },
  { to: '/community' as const, label: 'Community', icon: MessageCircle },
  { to: '/crm' as const, label: 'CRM', icon: Users },
  { to: '/settings' as const, label: 'Settings', icon: Settings },
]

function HubPage() {
  const { unlocked, unlock, tier } = usePaywall()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const tapCountRef = useRef(0)
  const tapTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const handleLogoTap = useCallback(() => {
    tapCountRef.current += 1
    if (tapTimerRef.current) clearTimeout(tapTimerRef.current)
    if (tapCountRef.current >= 5) {
      tapCountRef.current = 0
      navigate({ to: '/ftc-admin' })
      return
    }
    tapTimerRef.current = setTimeout(() => { tapCountRef.current = 0 }, 2000)
  }, [navigate])

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setMobileMenuOpen(false)
    }
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => { document.body.style.overflow = '' }
  }, [mobileMenuOpen])

  const [showWelcome, setShowWelcome] = useState(false)
  const [showOnboarding, setShowOnboarding] = useState(false)
  useEffect(() => {
    if (sessionStorage.getItem('ftc_just_subscribed') === '1') {
      sessionStorage.removeItem('ftc_just_subscribed')
      setShowWelcome(true)
      window.scrollTo({ top: 0, behavior: 'instant' })
      const timer = setTimeout(() => setShowWelcome(false), 8000)
      return () => clearTimeout(timer)
    }
  }, [])

  // Show onboarding tour for first-time visitors (only after paywall is unlocked)
  useEffect(() => {
    if (!unlocked) return
    try {
      if (!localStorage.getItem('ftc_onboarding_done')) {
        // Delay slightly so the page renders first
        const timer = setTimeout(() => setShowOnboarding(true), 800)
        return () => clearTimeout(timer)
      }
    } catch {}
  }, [unlocked])

  if (unlocked === null) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 48, height: 48, borderRadius: 10,
            background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#000', letterSpacing: '0.04em',
            margin: '0 auto 16px',
            animation: 'pulse-glow 2s infinite',
          }}>FTC</div>
          <div style={{ width: 32, height: 32, border: '2px solid #3d4e65', borderTop: '2px solid #ff7e5f', borderRadius: '50%', animation: 'spin 0.8s linear infinite', margin: '0 auto' }} />
          <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent' }}>
      <a href="#hub-content" className="skip-to-content">Skip to content</a>

      {!unlocked && <Paywall onUnlock={unlock} />}

      {/* Onboarding Tour */}
      {showOnboarding && (
        <OnboardingTour onClose={() => setShowOnboarding(false)} />
      )}
      {showWelcome && (
        <div
          className="animate-fade-in-up"
          style={{
            position: 'fixed', top: 72, left: '50%', transform: 'translateX(-50%)',
            zIndex: 1000,
            background: 'linear-gradient(135deg, rgba(45,184,133,0.95), rgba(34,120,72,0.95))',
            border: '1px solid rgba(45,184,133,0.5)', borderRadius: 14,
            padding: '18px 28px', maxWidth: 480, width: 'calc(100% - 32px)',
            boxShadow: '0 12px 40px rgba(0,0,0,0.5)', backdropFilter: 'blur(12px)',
            display: 'flex', alignItems: 'center', gap: 14,
          }}
        >
          <div style={{ width: 44, height: 44, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <PartyPopper size={22} color="#fff" />
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(16px, 5vw, 20px)', color: '#fff', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 4 }}>
              Welcome to Flip the Contract!
            </div>
            <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', margin: 0, lineHeight: 1.5 }}>
              Your subscription is active. Explore all sections of premium wholesale resources below.
            </p>
          </div>
          <button onClick={() => setShowWelcome(false)} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', padding: 4, flexShrink: 0, lineHeight: 1 }} aria-label="Dismiss welcome message">
            <X size={18} />
          </button>
        </div>
      )}

      {/* Sticky Nav */}
      <nav id="sticky-nav" role="navigation" aria-label="Main navigation">
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', height: 60, gap: 16 }}>
          {/* Logo */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
            <div
              onClick={handleLogoTap}
              role="button"
              tabIndex={0}
              aria-label="Flip the Contract logo"
              onKeyDown={e => { if (e.key === 'Enter') handleLogoTap() }}
              style={{
                width: 36, height: 36, borderRadius: 8,
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 17, color: '#000', letterSpacing: '0.04em',
                fontWeight: 700, boxShadow: '0 2px 10px rgba(244,126,95,0.3)',
                cursor: 'pointer', userSelect: 'none',
              }}
            >FTC</div>
            <span className="nav-brand-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.06em', color: '#f5f0eb', lineHeight: 1.1 }}>
              Flip the Contract
            </span>
          </div>

          {/* Desktop nav — centered, horizontally scrollable */}
          <div style={{ display: 'none', flex: 1, gap: 2, alignItems: 'center', justifyContent: 'center', flexWrap: 'nowrap', overflowX: 'auto', overflowY: 'hidden', minWidth: 0, WebkitOverflowScrolling: 'touch', scrollbarWidth: 'none', msOverflowStyle: 'none' }} className="desktop-nav desktop-nav-scroll">
            {NAV_LINKS.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  search={link.to === '/crm' ? { demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' } : undefined}
                  className="nav-tab-pill"
                  style={{ textDecoration: 'none' }}
                >
                  <Icon size={13} />
                  {link.label}
                </Link>
              )
            })}
          </div>

          {/* Right actions */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0, marginLeft: 'auto' }}>
            <GlobalSearch />
            {unlocked && (
              <span className={`badge ${tier === 'full' ? 'badge-green' : 'badge-blue'} nav-member-badge`} style={{ fontSize: 11, display: 'flex', alignItems: 'center', gap: 4 }}>
                <Shield size={10} /> {tier === 'full' ? 'Pro Member' : 'Free'}
              </span>
            )}
            <Link
              to="/crm"
              search={{ demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' }}
              className="nav-auth-btn"
              style={{
                display: 'flex', alignItems: 'center', gap: 5,
                padding: '6px 14px', borderRadius: 8,
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                border: 'none', color: '#fff', cursor: 'pointer',
                fontSize: 12, fontWeight: 600, fontFamily: "'DM Sans', sans-serif",
                textDecoration: 'none', transition: 'all 0.2s', whiteSpace: 'nowrap',
                boxShadow: '0 2px 8px rgba(255,126,95,0.25)',
              }}
            >
              <Users size={12} /> CRM Dashboard
            </Link>
            {!unlocked && (
              <button className="btn-orange nav-unlock-btn" style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8, whiteSpace: 'nowrap' }} onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                <Lock size={13} /> Unlock
              </button>
            )}
            <button
              className="mobile-menu-btn"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-expanded={mobileMenuOpen}
              aria-label={mobileMenuOpen ? 'Close menu' : 'Open menu'}
              style={{
                background: mobileMenuOpen ? 'rgba(244,126,95,0.1)' : 'rgba(255,255,255,0.04)',
                border: mobileMenuOpen ? '1px solid rgba(244,126,95,0.3)' : '1px solid #3d4e65',
                borderRadius: 8, padding: '8px 10px', cursor: 'pointer',
                color: mobileMenuOpen ? '#ff7e5f' : '#9a918a',
                display: 'flex', alignItems: 'center', transition: 'all 0.2s',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileMenuOpen && (
          <div className="animate-slide-down" role="menu" style={{
            background: 'rgba(26,31,40,0.98)', borderTop: '1px solid #3d4e65',
            padding: '8px 0 16px', backdropFilter: 'blur(16px)',
            maxHeight: 'calc(100dvh - 60px)', overflowY: 'auto', WebkitOverflowScrolling: 'touch',
          }}>
            {NAV_LINKS.map(link => {
              const Icon = link.icon
              return (
                <Link key={link.to} to={link.to} role="menuitem" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px 24px',
                  background: 'transparent', color: '#a09890', fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                  borderLeft: '3px solid transparent', textAlign: 'left', textDecoration: 'none', minHeight: 48,
                }}>
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}
            {user ? (
              <>
                <div style={{ height: 1, background: '#3d4e65', margin: '8px 24px' }} />
                <button
                  onClick={() => { signOut(); setMobileMenuOpen(false) }}
                  role="menuitem"
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '14px 24px',
                    background: 'transparent',
                    color: '#ff7e5f',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                    border: 'none', borderLeft: '3px solid transparent',
                    textAlign: 'left', cursor: 'pointer',
                    minHeight: 48,
                  }}
                >
                  <LogOut size={16} />
                  Sign Out
                </button>
              </>
            ) : (
              <>
                <div style={{ height: 1, background: '#3d4e65', margin: '8px 24px' }} />
                <Link to="/crm" search={{ demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' }} role="menuitem" onClick={() => setMobileMenuOpen(false)} style={{
                  display: 'flex', alignItems: 'center', gap: 10, width: '100%', padding: '14px 24px',
                  background: 'transparent', color: '#ff7e5f', fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                  borderLeft: '3px solid transparent', textAlign: 'left', textDecoration: 'none', minHeight: 48,
                }}>
                  <Users size={16} />
                  CRM Dashboard
                </Link>
              </>
            )}
          </div>
        )}
      </nav>

      {/* Hero Section */}
      <section className="hero-section" style={{ position: 'relative', background: 'transparent', borderBottom: 'none', padding: '48px 20px 40px', overflow: 'hidden' }}>
        <div className="hero-gradient-mesh" />
        <div className="hero-scanlines" aria-hidden="true" />
        <div className="hero-watermark" aria-hidden="true">FLIP THE CONTRACT</div>

        {/* Pulsing rings behind content */}
        <div style={{ position: 'absolute', top: '40%', left: '60%', width: 0, height: 0, pointerEvents: 'none' }} aria-hidden="true">
          <div className="hero-pulse-ring" />
          <div className="hero-pulse-ring" />
          <div className="hero-pulse-ring" />
        </div>

        {/* Animated glow border at bottom */}
        <div className="hero-glow-border" aria-hidden="true" />

        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
            <span className="badge badge-orange badge-futuristic" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Flame size={10} /> Wholesale Platform
            </span>
            <span className="badge badge-green badge-futuristic">All 50 States</span>
          </div>

          <h1 className="animate-fade-in-up text-glow-pulse" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(36px, 7vw, 80px)', letterSpacing: '0.03em',
            margin: '0 0 16px', lineHeight: 0.95, color: '#f5f0eb',
          }}>
            Flip the Contract<br />
            <span style={{
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347, #a855f7)',
              backgroundSize: '200% 200%',
              animation: 'gradientShift 6s ease infinite',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text',
            }}>Your Wholesale Toolkit</span>
          </h1>

          <p className="animate-fade-in-up" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(18px, 3.5vw, 30px)', color: '#ff7e5f',
            letterSpacing: '0.03em', lineHeight: 1.2, marginBottom: 16, maxWidth: 640,
          }}>
            Contracts, buyers, scripts, and tools for your first wholesale deal — or your next one.
          </p>

          <p className="animate-fade-in-up" style={{ color: '#a09890', fontSize: 'clamp(14px, 1.6vw, 16px)', maxWidth: 640, lineHeight: 1.7, marginBottom: 32 }}>
            50-state contracts, double close agreements, LOIs, institutional buyer lists, skip trace tools, marketing templates, funding sources, calculators, and more — organized in one place.
          </p>

          <div className="animate-fade-in-up hero-cta-buttons" style={{ display: 'flex', gap: 12, flexWrap: 'wrap', marginBottom: 32 }}>
            <Link to="/getting-started" className="btn-orange" style={{ padding: '14px 32px', fontSize: 17, textDecoration: 'none' }}>
              <Flame size={16} /> Get Started
            </Link>
            <Link to="/contracts-legal" className="btn-ghost" style={{ padding: '14px 24px', display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none' }}>
              Browse Contracts <ChevronRight size={16} />
            </Link>
          </div>
        </div>
      </section>

      {/* MLP Category Cards */}
      <main id="hub-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '40px 20px 24px' }}>
        {/* Section heading */}
        <div style={{ marginBottom: 28, display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 36px)',
              color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 6px',
            }}>
              Explore Resources
            </h2>
            <p style={{ color: '#9a918a', fontSize: 14, margin: 0 }}>
              Jump into any section — each page has its own tools, templates, and sub-navigation.
            </p>
          </div>
          {!showOnboarding && <RestartTourButton />}
        </div>

        {/* Category grid */}
        <div className="hub-category-grid" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))',
          gap: 20,
          marginBottom: 40,
        }}>
          {CATEGORIES.map(cat => {
            const Icon = cat.icon
            const isLockedForFree = tier === 'free' && !FREE_ROUTES.has(cat.to)
            return (
              <Link
                key={cat.to}
                to={cat.to}
                data-tour={cat.to.replace('/', '')}
                className="hub-category-card"
                style={{
                  display: 'block',
                  background: cat.gradient,
                  border: `1px solid ${cat.borderColor}`,
                  borderRadius: 16,
                  padding: '28px 24px',
                  textDecoration: 'none',
                  transition: 'all 0.3s ease',
                  cursor: 'pointer',
                  opacity: isLockedForFree ? 0.7 : 1,
                  position: 'relative',
                }}
              >
                {isLockedForFree && (
                  <div style={{
                    position: 'absolute', top: 12, right: 12,
                    background: 'rgba(255,179,71,0.15)', border: '1px solid rgba(255,179,71,0.3)',
                    borderRadius: 6, padding: '3px 8px',
                    display: 'flex', alignItems: 'center', gap: 4,
                    fontSize: 10, color: '#ffb347', fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <Lock size={10} /> PRO
                  </div>
                )}
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
                  <div style={{
                    width: 44, height: 44, borderRadius: 12,
                    background: 'rgba(255,255,255,0.06)',
                    border: `1px solid ${cat.borderColor}`,
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    flexShrink: 0,
                  }}>
                    <Icon size={22} style={{ color: '#ff7e5f' }} />
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 22,
                      color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1,
                    }}>
                      {cat.title}
                    </h3>
                    <span className={`badge badge-${cat.badgeColor}`} style={{ marginTop: 4 }}>
                      {cat.badge}
                    </span>
                  </div>
                  <ChevronRight size={20} style={{ color: '#6b6560', flexShrink: 0 }} />
                </div>
                <p style={{ color: '#a09890', fontSize: 13, lineHeight: 1.6, margin: '0 0 14px' }}>
                  {cat.description}
                </p>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                  {cat.items.map(item => (
                    <span key={item} style={{
                      display: 'inline-block', padding: '3px 10px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.06)',
                      fontSize: 11, color: '#9a918a', fontFamily: "'DM Sans', sans-serif",
                    }}>
                      {item}
                    </span>
                  ))}
                </div>
              </Link>
            )
          })}
        </div>

        {/* Quick links section */}
        <div className="labeled-divider">Quick Access</div>

        <div data-tour="quick-access" style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
          gap: 16,
          marginBottom: 40,
        }}>
          {QUICK_LINKS.map(link => {
            const Icon = link.icon
            const isLockedForFree = tier === 'free' && !FREE_ROUTES.has(link.to)
            return (
              <Link
                key={link.to}
                to={link.to}
                search={link.to === '/crm' ? { demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' } : undefined}
                data-tour={link.to.replace('/', '')}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14,
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid #3d4e65', borderRadius: 12,
                  padding: '18px 20px', textDecoration: 'none',
                  transition: 'all 0.25s ease',
                  opacity: isLockedForFree ? 0.6 : 1,
                  position: 'relative',
                }}
                className="resource-card"
              >
                {isLockedForFree && (
                  <div style={{
                    position: 'absolute', top: 8, right: 8,
                    display: 'flex', alignItems: 'center', gap: 3,
                    fontSize: 9, color: '#ffb347', fontWeight: 600,
                    fontFamily: "'DM Sans', sans-serif",
                  }}>
                    <Lock size={9} /> PRO
                  </div>
                )}
                <div style={{
                  width: 40, height: 40, borderRadius: 10,
                  background: 'rgba(244,126,95,0.08)',
                  border: '1px solid rgba(244,126,95,0.15)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={18} style={{ color: '#ff7e5f' }} />
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontFamily: "'Bebas Neue', sans-serif", fontSize: 17,
                    color: '#f5f0eb', letterSpacing: '0.04em', lineHeight: 1.1,
                  }}>
                    {link.label}
                  </div>
                  <div style={{ fontSize: 12, color: '#9a918a', marginTop: 2 }}>
                    {link.desc}
                  </div>
                </div>
                <ChevronRight size={16} style={{ color: '#6b6560', flexShrink: 0 }} />
              </Link>
            )
          })}
        </div>

        {/* Deal Progress Tracker / Pipeline */}
        <div style={{ marginBottom: 40 }}>
          <div className="labeled-divider">Your Deal Pipeline</div>
          <p style={{ color: '#9a918a', fontSize: 13, textAlign: 'center', margin: '0 0 28px', lineHeight: 1.5 }}>
            Every wholesale deal follows these 5 stages. Tap any stage to jump to the tools you need.
          </p>

          {/* Pipeline stages */}
          <div style={{
            display: 'flex', flexDirection: 'row', alignItems: 'stretch', justifyContent: 'center',
            gap: 0, flexWrap: 'wrap', position: 'relative',
          }}>
            {[
              { icon: Target, label: 'Lead Found', to: '/deals' as const, desc: 'Find motivated sellers' },
              { icon: FileCheck, label: 'Under Contract', to: '/contracts-legal' as const, desc: 'Lock it up legally' },
              { icon: Users2, label: 'Buyer Matched', to: '/buyers' as const, desc: 'Connect with cash buyers' },
              { icon: Building2, label: 'In Closing', to: '/tools' as const, desc: 'Title, funding & docs' },
              { icon: CircleCheckBig, label: 'Deal Closed', to: '/community' as const, desc: 'Celebrate your win!' },
            ].map((stage, idx, arr) => {
              const Icon = stage.icon
              return (
                <div key={stage.label} style={{ display: 'flex', alignItems: 'center', flex: '1 1 0', minWidth: 140, maxWidth: 220 }} className="pipeline-stage-wrapper">
                  <Link
                    to={stage.to}
                    className="resource-card"
                    style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      textAlign: 'center', textDecoration: 'none', flex: 1,
                      background: 'rgba(255,255,255,0.02)',
                      border: '1px solid rgba(244,126,95,0.18)',
                      borderRadius: 14, padding: '22px 12px 18px',
                      transition: 'all 0.25s ease',
                      position: 'relative',
                    }}
                  >
                    {/* Step number badge */}
                    <div style={{
                      position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)',
                      background: '#1a1f28', border: '1px solid rgba(244,126,95,0.3)',
                      borderRadius: 20, padding: '2px 10px',
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 11,
                      color: '#ff7e5f', letterSpacing: '0.06em',
                    }}>
                      Step {idx + 1}
                    </div>
                    {/* Icon circle */}
                    <div style={{
                      width: 48, height: 48, borderRadius: '50%',
                      background: 'linear-gradient(135deg, rgba(255,126,95,0.15), rgba(255,179,71,0.10))',
                      border: '1px solid rgba(255,126,95,0.25)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      marginBottom: 10, flexShrink: 0,
                    }}>
                      <Icon size={22} style={{ color: '#ff7e5f' }} />
                    </div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 16,
                      color: '#f5f0eb', letterSpacing: '0.04em', lineHeight: 1.1, marginBottom: 4,
                    }}>
                      {stage.label}
                    </div>
                    <div style={{ fontSize: 11, color: '#9a918a', lineHeight: 1.4 }}>
                      {stage.desc}
                    </div>
                  </Link>
                  {/* Connector line between stages (hidden on mobile via CSS) */}
                  {idx < arr.length - 1 && (
                    <div className="pipeline-connector" style={{
                      width: 24, height: 2, flexShrink: 0,
                      background: 'linear-gradient(90deg, rgba(255,126,95,0.4), rgba(255,179,71,0.3))',
                      borderRadius: 1,
                    }} />
                  )}
                </div>
              )
            })}
          </div>

          {/* Pro Tips */}
          <div style={{ marginTop: 32 }}>
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
              marginBottom: 16,
            }}>
              <Lightbulb size={14} style={{ color: '#ffb347' }} />
              <span style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 18,
                color: '#ffb347', letterSpacing: '0.04em',
              }}>
                Pro Tips
              </span>
            </div>
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))',
              gap: 14,
            }}>
              {[
                { title: 'Speed Wins Deals', text: 'The first investor to contact a motivated seller usually gets the contract. Set up skip tracing + auto-dialers early.' },
                { title: 'Always Double Close', text: 'When your assignment fee exceeds $10K, consider a double close to keep your profit private and avoid deal disputes.' },
                { title: 'Build Your Buyer List First', text: 'Knowing what your buyers want lets you target the right properties. A strong buyer list is your biggest asset.' },
              ].map(tip => (
                <div key={tip.title} style={{
                  background: 'rgba(255,179,71,0.04)',
                  border: '1px solid rgba(255,179,71,0.15)',
                  borderRadius: 12, padding: '16px 18px',
                  display: 'flex', gap: 12, alignItems: 'flex-start',
                }}>
                  <div style={{
                    width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                    background: 'rgba(255,179,71,0.10)',
                    border: '1px solid rgba(255,179,71,0.2)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                  }}>
                    <Info size={14} style={{ color: '#ffb347' }} />
                  </div>
                  <div>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif", fontSize: 15,
                      color: '#f5f0eb', letterSpacing: '0.03em', lineHeight: 1.1, marginBottom: 4,
                    }}>
                      {tip.title}
                    </div>
                    <div style={{ fontSize: 12, color: '#9a918a', lineHeight: 1.5 }}>
                      {tip.text}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </main>

      {/* CTA Section */}
      <div style={{ padding: '0 20px' }}>
      <section className="cta-section" style={{ maxWidth: 1160, margin: '0 auto', padding: 'clamp(32px, 5vw, 48px) clamp(16px, 4vw, 32px)', textAlign: 'center' }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 'clamp(28px, 4vw, 42px)',
          color: '#f5f0eb',
          letterSpacing: '0.04em',
          margin: '0 0 12px',
        }}>
          Ready to Close Your First (or Next) Deal?
        </h2>
        <p style={{ color: '#9a918a', fontSize: 'clamp(14px, 1.5vw, 16px)', maxWidth: 560, margin: '0 auto 24px', lineHeight: 1.7 }}>
          Join hundreds of users finding deals, locking contracts, and connecting with cash buyers across all 50 states.
        </p>
        <Link to="/getting-started" className="btn-orange" style={{ padding: '16px 36px', fontSize: 18, textDecoration: 'none' }}>
          <Flame size={18} /> Start Wholesaling Today
        </Link>
      </section>
      </div>
      <footer style={{ borderTop: '1px solid #2e3a4d', background: 'transparent' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '32px 20px 24px' }}>
          <div className="footer-top-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 24, marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#000', fontWeight: 700,
                flexShrink: 0,
              }}>FTC</div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ff7e5f', letterSpacing: '0.06em' }}>
                Flip the Contract
              </span>
            </div>
            <div className="footer-links-row" style={{ display: 'flex', gap: 20, alignItems: 'center', flexWrap: 'wrap' }}>
              <Link to="/getting-started" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Getting Started</Link>
              <Link to="/contracts-legal" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Contracts</Link>
              <Link to="/deals" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Find Deals</Link>
              <Link to="/buyers" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Buyers</Link>
              <Link to="/tools" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Tools</Link>
              <Link to="/properties" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Properties</Link>
              <Link to="/community" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Community</Link>
              <Link to="/crm" search={{ demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' }} className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>My CRM</Link>
              <Link to="/settings" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Settings</Link>
              <a href="/terms" className="footer-link" style={{ padding: 0, minHeight: 'auto', fontSize: 13 }}>Terms</a>
              <a href="/privacy" className="footer-link" style={{ padding: 0, minHeight: 'auto', fontSize: 13 }}>Privacy</a>
              <Link to="/contact" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Contact</Link>
            </div>
          </div>

          <div style={{ marginBottom: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid #2e3a4d' }}>
            <p style={{ fontSize: 11, color: '#6b6560', lineHeight: 1.6, margin: 0 }}>
              All resources are for educational purposes only. Flip the Contract is not a law firm, brokerage, or licensed real estate entity. Always consult licensed attorneys, CPAs, and real estate professionals before executing transactions.
            </p>
          </div>

          <div style={{ textAlign: 'center' }}>
            <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', marginBottom: 16 }}>
              {[
                { label: 'Contracts', value: '50 States' },
                { label: 'Tools', value: '250+' },
                { label: 'Sections', value: '22+' },
                { label: 'Support', value: '24/7 AI' },
              ].map(item => (
                <div key={item.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#ff7e5f', lineHeight: 1 }}>{item.value}</div>
                  <div style={{ fontSize: 10, color: '#6b6560', textTransform: 'uppercase', letterSpacing: '0.08em' }}>{item.label}</div>
                </div>
              ))}
            </div>
            <span style={{ fontSize: 12, color: '#444' }}>
              &copy; 2026 Flip the Contract. All rights reserved.
            </span>
          </div>
        </div>
      </footer>

      <style>{`
        @media (min-width: 768px) {
          .desktop-nav { display: flex !important; }
          .mobile-menu-btn { display: none !important; }
        }
        .hub-category-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 12px 40px rgba(244,126,95,0.1), 0 4px 12px rgba(0,0,0,0.3);
        }
        @media (max-width: 720px) {
          .hub-category-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}
