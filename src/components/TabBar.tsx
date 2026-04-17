import { useRef, useState, useEffect } from 'react'
import { FileText, Search, Building2, MessageSquare, Handshake, Scale, Phone, BookOpen, Building, ShoppingCart, Star, XCircle, Send, Flame, ChevronLeft, ChevronRight, GraduationCap, Map, Landmark, Mail, DollarSign, ClipboardCheck, Zap, LayoutGrid, Contact, ArrowRightLeft } from 'lucide-react'

// Tab groups for organized navigation
export const TAB_GROUPS = [
  {
    label: 'Getting Started',
    tabs: ['motivation', 'glossary', 'verbiage', 'checklist'] as const,
  },
  {
    label: 'Contracts & Legal',
    tabs: ['contracts', 'cancellation', 'jv', 'laws'] as const,
  },
  {
    label: 'Finding Deals',
    tabs: ['skiptrace', 'leads', 'scripts', 'marketing', 'propertymap'] as const,
  },
  {
    label: 'Buyers & Closing',
    tabs: ['hedgefund', 'brokerages', 'buyertemplate', 'title'] as const,
  },
  {
    label: 'Tools & Finance',
    tabs: ['quickoffer', 'multifamily', 'investstrategy', 'funding', 'booking', 'reviews', 'crm'] as const,
  },
] as const

export const TABS = [
  // Getting Started
  { id: 'motivation', label: 'Daily Motivation', icon: Flame, group: 'Getting Started' },
  { id: 'glossary', label: 'Wholesale Glossary', icon: GraduationCap, group: 'Getting Started' },
  { id: 'verbiage', label: 'Key Verbiage', icon: BookOpen, group: 'Getting Started' },
  { id: 'checklist', label: 'Deal Checklist', icon: ClipboardCheck, group: 'Getting Started' },
  // Contracts & Legal
  { id: 'contracts', label: 'Contract Templates', icon: FileText, group: 'Contracts & Legal' },
  { id: 'cancellation', label: 'Cancellation Contracts', icon: XCircle, group: 'Contracts & Legal' },
  { id: 'jv', label: 'JV Resources', icon: Handshake, group: 'Contracts & Legal' },
  { id: 'laws', label: 'State Laws & Rules', icon: Scale, group: 'Contracts & Legal' },
  // Finding Deals
  { id: 'skiptrace', label: 'Skip Trace Tools', icon: Search, group: 'Finding Deals' },
  { id: 'leads', label: 'Buy Leads', icon: ShoppingCart, group: 'Finding Deals' },
  { id: 'scripts', label: 'Sales Scripts', icon: MessageSquare, group: 'Finding Deals' },
  { id: 'marketing', label: 'Marketing Templates', icon: Mail, group: 'Finding Deals' },
  { id: 'propertymap', label: 'Property Map', icon: Map, group: 'Finding Deals' },
  // Buyers & Closing
  { id: 'hedgefund', label: 'Hedge Fund Buyers', icon: Building, group: 'Buyers & Closing' },
  { id: 'brokerages', label: 'Investment Brokerages', icon: Landmark, group: 'Buyers & Closing' },
  { id: 'buyertemplate', label: 'Deal Analyzer', icon: Send, group: 'Buyers & Closing' },
  { id: 'title', label: 'Title Companies', icon: Building2, group: 'Buyers & Closing' },
  // Tools & Finance
  { id: 'quickoffer', label: 'Quick Offer Calculator', icon: Zap, group: 'Tools & Finance' },
  { id: 'multifamily', label: 'Multi-Family Calculator', icon: LayoutGrid, group: 'Tools & Finance' },
  { id: 'investstrategy', label: 'Investment Strategy Calc', icon: ArrowRightLeft, group: 'Tools & Finance' },
  { id: 'funding', label: 'Funding Sources', icon: DollarSign, group: 'Tools & Finance' },
  { id: 'booking', label: '1-on-1 Call Booking', icon: Phone, group: 'Tools & Finance' },
  { id: 'reviews', label: 'Reviews', icon: Star, group: 'Tools & Finance' },
  { id: 'crm', label: 'CRM', icon: Contact, group: 'Tools & Finance' },
] as const

export type TabId = (typeof TABS)[number]['id']

interface TabBarProps {
  active: TabId
  onChange: (id: TabId) => void
}

export default function TabBar({ active, onChange }: TabBarProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

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

  // Scroll active tab into view on mount / change
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    const activeBtn = el.querySelector(`[data-tab="${active}"]`) as HTMLElement
    if (activeBtn) {
      activeBtn.scrollIntoView({ inline: 'center', block: 'nearest', behavior: 'smooth' })
    }
  }, [active])

  function scroll(direction: 'left' | 'right') {
    const el = scrollRef.current
    if (!el) return
    el.scrollBy({ left: direction === 'left' ? -200 : 200, behavior: 'smooth' })
  }

  return (
    <div className="mobile-bottom-tabs" style={{ position: 'relative', background: 'rgba(17,17,17,0.98)', borderBottom: '1px solid #3d4e65' }} role="tablist" aria-label="Resource sections">
      {/* Left scroll arrow */}
      {canScrollLeft && (
        <button
          onClick={() => scroll('left')}
          aria-label="Scroll tabs left"
          style={{
            position: 'absolute', left: 0, top: 0, bottom: 0, width: 44, zIndex: 2,
            background: 'linear-gradient(to right, rgba(17,17,17,0.98) 60%, transparent)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#888',
          }}
        >
          <ChevronLeft size={18} />
        </button>
      )}

      {/* Right scroll arrow */}
      {canScrollRight && (
        <button
          onClick={() => scroll('right')}
          aria-label="Scroll tabs right"
          style={{
            position: 'absolute', right: 0, top: 0, bottom: 0, width: 44, zIndex: 2,
            background: 'linear-gradient(to left, rgba(17,17,17,0.98) 60%, transparent)',
            border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center',
            color: '#888',
          }}
        >
          <ChevronRight size={18} />
        </button>
      )}

      <div
        ref={scrollRef}
        id="tab-bar"
        style={{
          overflowX: 'auto',
          scrollbarWidth: 'none',
        }}
      >
        <div style={{ display: 'flex', minWidth: 'max-content', padding: '0 16px', gap: 2, alignItems: 'center' }}>
          {TAB_GROUPS.map((group, gi) => (
            <div key={group.label} style={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              {gi > 0 && (
                <div style={{ width: 1, height: 20, background: '#3d4e65', margin: '0 6px', flexShrink: 0 }} />
              )}
              {group.tabs.map(tabId => {
                const tab = TABS.find(t => t.id === tabId)!
                const Icon = tab.icon
                return (
                  <button
                    key={tab.id}
                    data-tab={tab.id}
                    onClick={() => onChange(tab.id)}
                    role="tab"
                    aria-selected={active === tab.id}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 6,
                      padding: '12px 16px',
                      background: active === tab.id ? 'rgba(244,126,95,0.08)' : 'transparent',
                      border: 'none',
                      borderBottom: active === tab.id ? '2px solid #ff7e5f' : '2px solid transparent',
                      color: active === tab.id ? '#ff7e5f' : '#888',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      fontSize: 13,
                      fontWeight: active === tab.id ? 600 : 400,
                      whiteSpace: 'nowrap',
                      transition: 'all 0.2s ease',
                      marginBottom: -1,
                      borderRadius: '6px 6px 0 0',
                    }}
                    onMouseEnter={e => { if (active !== tab.id) { e.currentTarget.style.color = '#f5f0eb'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' } }}
                    onMouseLeave={e => { if (active !== tab.id) { e.currentTarget.style.color = '#888'; e.currentTarget.style.background = 'transparent' } }}
                  >
                    <Icon size={14} />
                    {tab.label}
                  </button>
                )
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
