import { useState, useRef, useCallback, useEffect } from 'react'
import { Link, useNavigate } from '@tanstack/react-router'
import { Menu, X, Lock, Shield, Flame, Building2, MessageCircle, Users, ChevronLeft, ChevronRight, FileText, Search, Scale, Zap, Home, LogOut, Gamepad2, Settings, Sparkles, Vault, Crown } from 'lucide-react'
import { usePaywall, FREE_ROUTES } from '@/components/Paywall'
import Paywall from '@/components/Paywall'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from '@/components/GlobalSearch'

export interface SectionTab {
  id: string
  label: string
  icon: React.ComponentType<{ size?: number }>
}

interface SectionLayoutProps {
  title: string
  subtitle: string
  badge: string
  badgeColor: string
  tabs: SectionTab[]
  activeTab: string
  onTabChange: (id: string) => void
  children: React.ReactNode
}

// Navigation links for all MLP pages
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
  { to: '/emd-vault' as const, label: 'EMD Vault', icon: Vault },
  { to: '/settings' as const, label: 'Settings', icon: Settings },
] as const

export default function SectionLayout({ title, subtitle, badge, badgeColor, tabs, activeTab, onTabChange, children }: SectionLayoutProps) {
  const { unlocked, unlock, tier } = usePaywall()
  const { user, signOut } = useAuth()
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const navigate = useNavigate()
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  // Check if this route is restricted for free-tier users
  const currentPath = typeof window !== 'undefined' ? window.location.pathname : '/'
  const isFreeTierRestricted = tier === 'free' && !FREE_ROUTES.has(currentPath)

  // Handle hash-based tab navigation (from GlobalSearch)
  useEffect(() => {
    const hash = window.location.hash
    if (hash && hash.startsWith('#tab=')) {
      const tabId = hash.replace('#tab=', '')
      const validTab = tabs.find(t => t.id === tabId)
      if (validTab) {
        onTabChange(tabId)
        // Clear the hash after navigating
        window.history.replaceState(null, '', window.location.pathname)
      }
    }
  }, [tabs, onTabChange])

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

  function checkScroll() {
    const el = scrollRef.current
    if (!el) return
    setCanScrollLeft(el.scrollLeft > 10)
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10)
  }

  useEffect(() => {
    checkScroll()
    const el = scrollRef.current
    if (el) {
      el.addEventListener('scroll', checkScroll, { passive: true })
      window.addEventListener('resize', checkScroll)
    }
    return () => {
      if (el) el.removeEventListener('scroll', checkScroll)
      window.removeEventListener('resize', checkScroll)
    }
  }, [])

  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const activeBtn = el.querySelector(`[data-tab="${activeTab}"]`) as HTMLElement
    if (activeBtn) {
      activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [activeTab])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
  }

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
    <div style={{ minHeight: '100dvh', background: '#12161c' }}>
      <a href="#section-content" className="skip-to-content">Skip to content</a>

      {!unlocked && <Paywall onUnlock={unlock} />}

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
                fontWeight: 700,
                boxShadow: '0 2px 10px rgba(244,126,95,0.3)',
                cursor: 'pointer', userSelect: 'none',
              }}
            >FTC</div>
            <Link to="/" style={{ textDecoration: 'none' }}>
              <span className="nav-brand-text" style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.06em', color: '#f5f0eb', display: 'block', lineHeight: 1.1 }}>
                Flip the Contract
              </span>
            </Link>
          </div>

          {/* Desktop nav links — centered, horizontally scrollable */}
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

          {/* Right side */}
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
              <button
                className="btn-orange nav-unlock-btn"
                style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8, whiteSpace: 'nowrap' }}
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              >
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
                borderRadius: 8,
                padding: '8px 10px', cursor: 'pointer',
                color: mobileMenuOpen ? '#ff7e5f' : '#9a918a',
                display: 'flex', alignItems: 'center',
                transition: 'all 0.2s',
              }}
            >
              {mobileMenuOpen ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu dropdown */}
        {mobileMenuOpen && (
          <div
            className="animate-slide-down"
            role="menu"
            style={{
              background: 'rgba(26,31,40,0.98)',
              borderTop: '1px solid #3d4e65',
              padding: '8px 0 16px',
              backdropFilter: 'blur(16px)',
              maxHeight: 'calc(100dvh - 60px)',
              overflowY: 'auto',
              WebkitOverflowScrolling: 'touch',
            }}
          >
            {NAV_LINKS.map(link => {
              const Icon = link.icon
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  search={link.to === '/crm' ? { demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' } : undefined}
                  role="menuitem"
                  onClick={() => setMobileMenuOpen(false)}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 10,
                    width: '100%', padding: '14px 24px',
                    background: 'transparent',
                    color: '#a09890',
                    fontFamily: "'DM Sans', sans-serif", fontSize: 15,
                    borderLeft: '3px solid transparent',
                    textAlign: 'left', textDecoration: 'none',
                    minHeight: 48,
                  }}
                >
                  <Icon size={16} />
                  {link.label}
                </Link>
              )
            })}
            {user && (
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
            )}
          </div>
        )}
      </nav>
      <section style={{ position: 'relative', background: '#14181f', borderBottom: '1px solid #2e3a4d', padding: '36px 20px 28px', overflow: 'hidden' }}>
        <div className="hero-gradient-mesh" />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div className="animate-fade-in-up" style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className={`badge badge-${badgeColor}`} style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              {badge}
            </span>
          </div>
          <h1 className="animate-fade-in-up" style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(32px, 5vw, 56px)',
            letterSpacing: '0.03em',
            margin: '0 0 8px',
            lineHeight: 1,
            color: '#f5f0eb',
          }}>
            {title}
          </h1>
          <p className="animate-fade-in-up" style={{ color: '#a09890', fontSize: 'clamp(14px, 1.5vw, 16px)', maxWidth: 600, lineHeight: 1.6, margin: 0 }}>
            {subtitle}
          </p>
        </div>
      </section>

      {/* Sub-tab navigation for this section */}
      {tabs.length > 1 && (
        <div className="mobile-bottom-tabs" style={{ position: 'relative', background: 'rgba(17,17,17,0.98)', borderBottom: '1px solid #3d4e65' }} role="tablist" aria-label="Section navigation">
          {canScrollLeft && (
            <button
              onClick={() => scroll('left')}
              aria-label="Scroll tabs left"
              style={{
                position: 'absolute', left: 0, top: 0, bottom: 0, width: 36, zIndex: 2,
                background: 'linear-gradient(to right, rgba(17,17,17,0.98) 60%, transparent)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#888',
              }}
            >
              <ChevronLeft size={18} />
            </button>
          )}
          {canScrollRight && (
            <button
              onClick={() => scroll('right')}
              aria-label="Scroll tabs right"
              style={{
                position: 'absolute', right: 0, top: 0, bottom: 0, width: 36, zIndex: 2,
                background: 'linear-gradient(to left, rgba(17,17,17,0.98) 60%, transparent)',
                border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
                color: '#888',
              }}
            >
              <ChevronRight size={18} />
            </button>
          )}
          <div ref={scrollRef} style={{ overflowX: 'auto', scrollbarWidth: 'none' }}>
            <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 16px', gap: 2, alignItems: 'center' }}>
              {tabs.map(tab => {
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => onTabChange(tab.id)}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 6,
                      padding: '12px 16px',
                      background: activeTab === tab.id ? 'rgba(244,126,95,0.08)' : 'transparent',
                      border: 'none',
                      borderBottom: activeTab === tab.id ? '2px solid #ff7e5f' : '2px solid transparent',
                      color: activeTab === tab.id ? '#ff7e5f' : '#888',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: activeTab === tab.id ? 600 : 400,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      marginBottom: -1,
                      borderRadius: '6px 6px 0 0',
                    }}
                    onMouseEnter={e => { if (activeTab !== tab.id) { e.currentTarget.style.color = '#f5f0eb'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' } }}
                    onMouseLeave={e => { if (activeTab !== tab.id) { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

      {/* Content */}
      <main id="section-content" className="animate-fade-in section-main-content" style={{ maxWidth: 1200, margin: '0 auto', padding: '36px 20px 48px' }}>
        {isFreeTierRestricted ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'linear-gradient(135deg, rgba(255,179,71,0.15), rgba(168,85,247,0.15))',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              margin: '0 auto 24px',
              border: '1px solid rgba(255,179,71,0.3)',
            }}>
              <Crown size={32} color="#ffb347" />
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 32,
              color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 12px',
            }}>
              Pro Content
            </h2>
            <p style={{ color: '#9a918a', fontSize: 15, lineHeight: 1.7, maxWidth: 480, margin: '0 auto 8px' }}>
              This section is available with a paid access code. Upgrade to unlock all contracts, tools, calculators, buyer lists, and premium resources.
            </p>
            <p style={{ color: '#6b6560', fontSize: 13, marginBottom: 28 }}>
              Your free account includes: Getting Started, Glossary, Key Verbiage, Deal Checklist, and Community.
            </p>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              <Link
                to="/login"
                className="btn-orange"
                style={{ padding: '14px 32px', fontSize: 15, textDecoration: 'none' }}
              >
                <Lock size={16} /> Enter Paid Access Code
              </Link>
              <Link
                to="/getting-started"
                className="btn-ghost"
                style={{ padding: '14px 24px', textDecoration: 'none' }}
              >
                Browse Free Content
              </Link>
            </div>
          </div>
        ) : children}
      </main>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2e3a4d', background: '#14181f' }}>
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
              <Link to="/" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Hub</Link>
              <Link to="/properties" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Properties</Link>
              <Link to="/community" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>Community</Link>
              <Link to="/crm" search={{ demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' }} className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>My CRM</Link>
              <Link to="/emd-vault" className="footer-link" style={{ textDecoration: 'none', padding: 0, minHeight: 'auto', fontSize: 13 }}>EMD Vault</Link>
              <a href="/terms" className="footer-link" style={{ padding: 0, minHeight: 'auto', fontSize: 13 }}>Terms</a>
              <a href="/privacy" className="footer-link" style={{ padding: 0, minHeight: 'auto', fontSize: 13 }}>Privacy</a>
              <a href="mailto:support@flipthecontract.com" className="footer-link" style={{ padding: 0, minHeight: 'auto', fontSize: 13 }}>Contact</a>
            </div>
          </div>
          <div style={{ marginBottom: 16, padding: '12px 14px', background: 'rgba(255,255,255,0.02)', borderRadius: 10, border: '1px solid #2e3a4d' }}>
            <p style={{ fontSize: 11, color: '#6b6560', lineHeight: 1.6, margin: 0 }}>
              All resources are for educational purposes only. Flip the Contract is not a law firm, brokerage, or licensed real estate entity. Always consult licensed attorneys, CPAs, and real estate professionals before executing transactions.
            </p>
          </div>
          <div style={{ textAlign: 'center' }}>
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
      `}</style>
    </div>
  )
}
