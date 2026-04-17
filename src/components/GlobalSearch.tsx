import { useState, useEffect, useRef, useCallback, useMemo } from 'react'
import { useNavigate } from '@tanstack/react-router'
import { Search, X, FileText, GraduationCap, BookOpen, MessageSquare, Building, DollarSign, Scale, MapPin, Zap, ClipboardCheck, Flame, Mail, Phone as PhoneIcon, Handshake, XCircle, ArrowRight, Command } from 'lucide-react'

/* ─── Search Index Item ─── */
interface SearchItem {
  title: string
  description: string
  section: string
  sectionLabel: string
  route: string
  tab?: string
  icon: React.ComponentType<{ size?: number }>
  category: string
}

/* ─── Build the static search index ─── */
function buildSearchIndex(): SearchItem[] {
  const items: SearchItem[] = []

  // ── Getting Started: Glossary Terms ──
  const glossaryTerms = [
    'ARV (After Repair Value)', 'Comps (Comparables)', 'Equity', 'MAO (Maximum Allowable Offer)',
    'NOI (Net Operating Income)', 'Rehab Estimate', '70% Rule', 'Cap Rate', 'BPO (Broker Price Opinion)',
    'CMA (Comparative Market Analysis)', 'Gross Rent Multiplier', 'Assessed Value',
    'Assignment of Contract', 'Assignment Fee', 'Daisy Chain', 'Due Diligence Period',
    'EMD (Earnest Money Deposit)', 'Purchase & Sale Agreement', 'Subject-To', 'Under Contract',
    'Wholesale Deal', 'Contract Assignability', 'Contingency', 'Equitable Interest', 'Addendum',
    'Escalation Clause', 'Option Contract', 'Double Close', 'Closing Costs', 'Proof of Funds',
    'Transactional Funding', 'Escrow', 'Dry Closing', 'Settlement Statement', 'Chain of Title',
    'Title Insurance', 'Seasoning', 'Clear Title', 'Lien', 'Title Search', 'Lis Pendens',
    'Quiet Title Action', 'Motivated Seller', 'Skip Tracing', 'Vacant Property',
    'Driving for Dollars', 'Absentee Owner', 'Pre-Foreclosure', 'Probate', 'Tax Delinquent',
    'Code Violation', 'Cash Buyer', 'End Buyer', 'Disposition', 'Acquisition',
    'Bird Dog', 'JV (Joint Venture)', 'Hard Money Lender', 'Private Money Lender',
    'Wholesaler', 'Flipper', 'Landlord', 'Real Estate Agent',
    'Bandit Signs', 'Cold Calling', 'Direct Mail', 'Pay Per Click',
    'SEO', 'Social Media Marketing', 'Ringless Voicemail', 'SMS Marketing',
    'Rescission Period', 'Specific Performance', 'Memorandum of Contract',
    'Lis Pendens', 'Attorney Review Period',
  ]
  for (const term of glossaryTerms) {
    items.push({
      title: term,
      description: `Wholesale real estate glossary term`,
      section: 'glossary',
      sectionLabel: 'Wholesale Glossary',
      route: '/getting-started',
      tab: 'glossary',
      icon: GraduationCap,
      category: 'Getting Started',
    })
  }

  // ── Getting Started: Key Verbiage ──
  const verbiageTerms = [
    'ARV (After Repair Value)', 'Assignment of Contract', 'Double Close', 'MAO (Maximum Allowable Offer)',
    'Equitable Interest', 'Transactional Funding', 'Subject-To', 'NOI (Net Operating Income)',
    'Cap Rate', 'Earnest Money Deposit', 'Title Search', 'Clear Title', 'Probate Property',
    'Pre-Foreclosure', 'Cash Buyer / End Buyer', 'Wholesaling', 'Skip Tracing', 'Absentee Owner',
    'Daisy Chain', 'Disposition', 'Acquisition', 'Motivated Seller', 'Comps (Comparable Sales)',
    'Driving for Dollars', 'Buyers List', 'EMD (Earnest Money Deposit)',
    'Inspection Contingency', 'Chain of Title', 'Proof of Funds', 'Purchase Agreement',
    'Lien', 'As-Is Clause', 'Closing Costs', 'Title Insurance', 'Contract Assignability',
    'Due Diligence', 'Escrow', 'JV (Joint Venture)', 'Reverse Wholesale',
    'Lease Option', 'Seller Financing', 'Land Trust', 'Blind HUD',
    'Net Sheet', 'Deed', 'Quitclaim Deed', 'Warranty Deed', 'Special Warranty Deed',
    'Closing Disclosure', 'HUD-1', 'ALTA Statement', 'Recording Fees', 'Transfer Tax',
    'Title Commitment', 'Abstract of Title',
  ]
  for (const term of verbiageTerms) {
    items.push({
      title: term,
      description: 'Key verbiage for wholesale negotiations',
      section: 'verbiage',
      sectionLabel: 'Key Verbiage',
      route: '/getting-started',
      tab: 'verbiage',
      icon: BookOpen,
      category: 'Getting Started',
    })
  }

  // ── Getting Started: Deal Checklist Phases ──
  const checklistPhases = [
    { title: 'Lead Generation', desc: 'Find motivated sellers through marketing, skip tracing, and driving for dollars' },
    { title: 'Initial Contact', desc: 'Make first contact, qualify the lead, and gather property information' },
    { title: 'Under Contract', desc: 'Negotiate terms, sign the purchase agreement, and deposit EMD' },
    { title: 'Due Diligence & Analysis', desc: 'Run comps, estimate repairs, calculate MAO and assignment fee' },
    { title: 'Marketing to Buyers', desc: 'Blast the deal to your buyers list and field offers' },
    { title: 'Buyer Negotiation', desc: 'Negotiate assignment fee, qualify buyer funds, and sign assignment' },
    { title: 'At Closing', desc: 'Coordinate with title company, review settlement statement, close the deal' },
    { title: 'Post-Closing', desc: 'Collect assignment fee, update CRM, request referrals' },
  ]
  for (const phase of checklistPhases) {
    items.push({
      title: phase.title,
      description: phase.desc,
      section: 'checklist',
      sectionLabel: 'Deal Checklist',
      route: '/getting-started',
      tab: 'checklist',
      icon: ClipboardCheck,
      category: 'Getting Started',
    })
  }

  // ── Contracts: 50-State Templates ──
  const states = [
    'Alabama', 'Alaska', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Delaware',
    'District of Columbia', 'Florida', 'Georgia', 'Hawaii', 'Idaho', 'Illinois', 'Indiana', 'Iowa',
    'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland', 'Massachusetts', 'Michigan', 'Minnesota',
    'Mississippi', 'Missouri', 'Montana', 'Nebraska', 'Nevada', 'New Hampshire', 'New Jersey',
    'New Mexico', 'New York', 'North Carolina', 'North Dakota', 'Ohio', 'Oklahoma', 'Oregon',
    'Pennsylvania', 'Rhode Island', 'South Carolina', 'South Dakota', 'Tennessee', 'Texas', 'Utah',
    'Vermont', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
  ]
  for (const state of states) {
    items.push({
      title: `${state} Contract Template`,
      description: `Purchase & sale agreement template for wholesale deals in ${state}`,
      section: 'contracts',
      sectionLabel: 'Contract Templates',
      route: '/contracts-legal',
      tab: 'contracts',
      icon: FileText,
      category: 'Contracts & Legal',
    })
  }

  // ── Contracts: Contract Types ──
  const contractTypes = [
    { title: 'Purchase & Sale Agreement', desc: 'Standard wholesale purchase contract with assignment language' },
    { title: 'Assignment Addendum', desc: 'Contract addendum for assigning your purchase rights to an end buyer' },
    { title: 'Double Close Agreement', desc: 'Agreement for simultaneous A-to-B / B-to-C closings' },
    { title: 'Letter of Intent (LOI)', desc: 'Non-binding letter expressing intent to purchase a property' },
    { title: 'Non-Circumvent Agreement', desc: 'NDA protecting your buyer/seller relationships in JV deals' },
    { title: 'Option to Purchase', desc: 'Contract granting the right to purchase within a timeframe' },
    { title: 'Memorandum of Understanding', desc: 'Standard MOU format for wholesale partnerships' },
  ]
  for (const ct of contractTypes) {
    items.push({
      title: ct.title,
      description: ct.desc,
      section: 'contracts',
      sectionLabel: 'Contract Templates',
      route: '/contracts-legal',
      tab: 'contracts',
      icon: FileText,
      category: 'Contracts & Legal',
    })
  }

  // ── Contracts: Cancellation Contracts ──
  const cancellationStates = [
    'Texas', 'Florida', 'Georgia', 'Arizona', 'Ohio', 'North Carolina', 'Indiana', 'Missouri',
    'Colorado', 'Michigan', 'Tennessee', 'Oklahoma', 'Pennsylvania', 'Alabama', 'South Carolina',
    'Mississippi', 'Arkansas', 'Kentucky', 'Iowa', 'Kansas',
  ]
  for (const state of cancellationStates) {
    items.push({
      title: `${state} Cancellation Contract`,
      description: `Contract cancellation/termination template for ${state}`,
      section: 'cancellation',
      sectionLabel: 'Cancellation Contracts',
      route: '/contracts-legal',
      tab: 'cancellation',
      icon: XCircle,
      category: 'Contracts & Legal',
    })
  }

  // ── Contracts: JV Resources ──
  items.push({
    title: 'Joint Venture Agreement',
    description: 'JV agreement template for wholesale real estate partnerships',
    section: 'jv',
    sectionLabel: 'JV Resources',
    route: '/contracts-legal',
    tab: 'jv',
    icon: Handshake,
    category: 'Contracts & Legal',
  })

  // ── Contracts: State Laws ──
  for (const state of states) {
    items.push({
      title: `${state} Wholesale Laws`,
      description: `License requirements, assignment rules, and disclosure laws for ${state}`,
      section: 'laws',
      sectionLabel: 'State Laws & Rules',
      route: '/contracts-legal',
      tab: 'laws',
      icon: Scale,
      category: 'Contracts & Legal',
    })
  }

  // ── Finding Deals: Sales Scripts ──
  const scripts = [
    { title: 'Cold Call — Introduction & Qualifying', desc: 'Opening script for first contact with property owners' },
    { title: 'Cold Call — Expired Listings', desc: 'Script for contacting owners of expired MLS listings' },
    { title: 'Cold Call — For Sale By Owner (FSBO)', desc: 'Script for reaching FSBO sellers' },
    { title: 'Cold Call — Absentee Owners', desc: 'Script for contacting out-of-state property owners' },
    { title: 'Cold Call — Pre-Foreclosure', desc: 'Empathetic script for owners facing foreclosure' },
    { title: 'Seller Follow-Up Script', desc: 'Follow-up script for warm seller leads' },
    { title: 'Objection Handling — Price Too Low', desc: 'Script for handling seller price objections' },
    { title: 'Objection Handling — Not Ready to Sell', desc: 'Script for nurturing undecided sellers' },
    { title: 'Motivated Seller Discovery', desc: 'Deep qualification script for motivated sellers' },
    { title: 'Buyer Lead Generation Script', desc: 'Script for finding cash buyers at REIA meetings' },
    { title: 'Qualifying Buyers Script', desc: 'Script for verifying buyer funds and criteria' },
    { title: 'Buyer Follow-Up Script', desc: 'Script for following up with interested buyers' },
    { title: 'Assignment Explanation Script', desc: 'Script for explaining assignment process to sellers' },
    { title: 'Negotiation — Anchor & Counter', desc: 'Advanced negotiation tactics for wholesale deals' },
    { title: 'Voicemail Drop Script', desc: 'Short voicemail script for cold call campaigns' },
    { title: 'SMS First Touch Template', desc: 'Initial text message template for new leads' },
  ]
  for (const s of scripts) {
    items.push({
      title: s.title,
      description: s.desc,
      section: 'scripts',
      sectionLabel: 'Sales Scripts',
      route: '/deals',
      tab: 'scripts',
      icon: MessageSquare,
      category: 'Finding Deals',
    })
  }

  // ── Finding Deals: Skip Trace Tools ──
  const skipTools = [
    { title: 'BatchSkipTracing', desc: 'Bulk skip tracing — $0.12-$0.18/record' },
    { title: 'PropStream', desc: 'All-in-one list building + skip tracing — $99/mo' },
    { title: 'REISIFT', desc: 'CRM with built-in skip tracing — starts $97/mo' },
    { title: 'TLO (TransUnion)', desc: 'Professional-grade deep search skip tracing' },
    { title: 'Spokeo', desc: 'Consumer-grade people search — $19.95/mo' },
    { title: 'Whitepages Pro', desc: 'Business-grade contact lookup tool' },
  ]
  for (const tool of skipTools) {
    items.push({
      title: tool.title,
      description: tool.desc,
      section: 'skiptrace',
      sectionLabel: 'Skip Trace Tools',
      route: '/deals',
      tab: 'skiptrace',
      icon: Search,
      category: 'Finding Deals',
    })
  }

  // ── Finding Deals: Marketing Templates ──
  const marketingTemplates = [
    { title: 'Handwritten Yellow Letter', desc: 'Classic high-response direct mail for motivated sellers' },
    { title: 'Probate Letter', desc: 'Compassionate letter for inherited property owners' },
    { title: 'Pre-Foreclosure Letter', desc: 'Letter for homeowners facing foreclosure' },
    { title: 'Absentee Owner Postcard', desc: 'Postcard targeting out-of-state property owners' },
    { title: 'Tax Delinquent Owner Letter', desc: 'Letter for owners behind on property taxes' },
    { title: 'Bandit Sign Template', desc: 'Street sign designs for "We Buy Houses" campaigns' },
    { title: 'Facebook Ad Template', desc: 'Social media ad copy for seller lead generation' },
    { title: 'Email Drip Sequence', desc: 'Automated email sequence for nurturing seller leads' },
    { title: 'SMS Campaign Template', desc: 'Text message templates for lead outreach' },
  ]
  for (const tmpl of marketingTemplates) {
    items.push({
      title: tmpl.title,
      description: tmpl.desc,
      section: 'marketing',
      sectionLabel: 'Marketing Templates',
      route: '/deals',
      tab: 'marketing',
      icon: Mail,
      category: 'Finding Deals',
    })
  }

  // ── Buyers: Hedge Fund Buyers by State ──
  const buyerStates: Record<string, string[]> = {
    Texas: ['Invitation Homes', 'Progress Residential', 'Cerberus Capital', 'Tricon Residential', 'Pretium Partners', 'American Homes 4 Rent', 'Blackstone', 'Amherst Holdings', 'Haven Realty Capital', 'VineBrook Homes'],
    Florida: ['Invitation Homes', 'Progress Residential', 'Cerberus Capital', 'Tricon Residential', 'American Homes 4 Rent', 'Blackstone', 'Pretium Partners', 'Fundrise', 'Mynd Management', 'Sylvan Road Capital'],
    Georgia: ['Invitation Homes', 'Progress Residential', 'Cerberus Capital', 'Haven Realty Capital', 'VineBrook Homes', 'American Homes 4 Rent', 'Pretium Partners', 'Amherst Holdings', 'Tricon Residential', 'Sylvan Road Capital'],
    Arizona: ['Invitation Homes', 'Progress Residential', 'American Homes 4 Rent', 'Tricon Residential', 'Blackstone', 'Cerberus Capital', 'Pretium Partners', 'Mynd Management', 'NexPoint Residential', 'Roofstock'],
    Ohio: ['VineBrook Homes', 'Haven Realty Capital', 'Cerberus Capital', 'Pretium Partners', 'Amherst Holdings', 'Progress Residential', 'Invitation Homes', 'Sylvan Road Capital', 'JWB Real Estate Capital', 'Roofstock'],
    'North Carolina': ['Invitation Homes', 'Progress Residential', 'American Homes 4 Rent', 'Tricon Residential', 'Cerberus Capital', 'Pretium Partners', 'Haven Realty', 'Amherst Holdings', 'Sylvan Road Capital', 'Fundrise'],
    Indiana: ['VineBrook Homes', 'Haven Realty Capital', 'Cerberus Capital', 'Pretium Partners', 'Progress Residential', 'Amherst Holdings', 'American Homes 4 Rent', 'Invitation Homes', 'JWB Real Estate Capital', 'Sylvan Road Capital'],
    Missouri: ['VineBrook Homes', 'Haven Realty Capital', 'Pretium Partners', 'Amherst Holdings', 'Cerberus Capital', 'Progress Residential', 'Invitation Homes', 'JWB Real Estate Capital', 'Sylvan Road Capital', 'Roofstock'],
    Colorado: ['Invitation Homes', 'Progress Residential', 'American Homes 4 Rent', 'Tricon Residential', 'Blackstone', 'Pretium Partners', 'Mynd Management', 'NexPoint Residential', 'Cerberus Capital', 'Roofstock'],
    Michigan: ['VineBrook Homes', 'Haven Realty Capital', 'Cerberus Capital', 'Amherst Holdings', 'Pretium Partners', 'Progress Residential', 'Invitation Homes', 'Sylvan Road Capital', 'JWB Real Estate Capital', 'Roofstock'],
  }
  for (const [state, buyers] of Object.entries(buyerStates)) {
    for (const buyer of buyers) {
      items.push({
        title: `${buyer} — ${state}`,
        description: `Institutional buyer active in ${state}`,
        section: 'hedgefund',
        sectionLabel: 'Hedge Fund Buyers',
        route: '/buyers',
        tab: 'hedgefund',
        icon: Building,
        category: 'Buyers & Closing',
      })
    }
  }

  // ── Tools: Funding Sources ──
  const fundingSources = [
    { title: 'Best Transaction Funding', desc: 'Transactional funding for double closes' },
    { title: 'Investor Lending', desc: 'Same-day transactional funding' },
    { title: 'Upright', desc: 'Fast transactional funding with online platform' },
    { title: 'Coastal Funding Group', desc: 'Nationwide transactional funding' },
    { title: 'QC Capital Group', desc: 'Transactional funding with no upfront fees' },
    { title: 'REI Flash Cash', desc: 'Quick transactional funding for wholesalers' },
    { title: 'TC Funding', desc: 'Transactional and bridge funding' },
    { title: 'Lima One Capital', desc: 'Hard money lender for fix & flip' },
    { title: 'Kiavi (LendingHome)', desc: 'Hard money lender with fast approvals' },
    { title: 'Fund That Flip', desc: 'Hard money for residential investors' },
    { title: 'RCN Capital', desc: 'Hard money and bridge loans nationwide' },
    { title: 'CoreVest Finance', desc: 'Institutional lending for rental portfolios' },
  ]
  for (const src of fundingSources) {
    items.push({
      title: src.title,
      description: src.desc,
      section: 'funding',
      sectionLabel: 'Funding Sources',
      route: '/tools',
      tab: 'funding',
      icon: DollarSign,
      category: 'Tools & Finance',
    })
  }

  // ── Tools: Calculators ──
  const calcTools = [
    { title: 'Quick Offer Calculator', desc: 'Calculate MAO using the 70% rule instantly' },
    { title: 'Multi-Family Calculator', desc: 'Analyze multi-family investment deals with NOI and cap rate' },
    { title: 'Investment Strategy Calculator', desc: 'Compare wholesale, flip, and hold strategies' },
  ]
  for (const tool of calcTools) {
    items.push({
      title: tool.title,
      description: tool.desc,
      section: tool.title.toLowerCase().includes('multi') ? 'multifamily' : tool.title.toLowerCase().includes('strategy') ? 'investstrategy' : 'quickoffer',
      sectionLabel: tool.title,
      route: '/tools',
      tab: tool.title.toLowerCase().includes('multi') ? 'multifamily' : tool.title.toLowerCase().includes('strategy') ? 'investstrategy' : 'quickoffer',
      icon: Zap,
      category: 'Tools & Finance',
    })
  }

  // ── Pages ──
  const pages = [
    { title: 'Getting Started', desc: 'Daily motivation, glossary, verbiage, and deal checklists', route: '/getting-started' as const, icon: Flame },
    { title: 'Contracts & Legal', desc: '50-state contracts, cancellation templates, JV resources, state laws', route: '/contracts-legal' as const, icon: FileText },
    { title: 'Finding Deals', desc: 'Skip trace tools, leads, sales scripts, marketing templates', route: '/deals' as const, icon: Search },
    { title: 'Buyers & Closing', desc: 'Hedge fund buyers, brokerages, deal analyzer, title companies', route: '/buyers' as const, icon: Building },
    { title: 'Tools & Finance', desc: 'Calculators, funding sources, coaching calls, reviews', route: '/tools' as const, icon: Zap },
    { title: 'Property Marketplace', desc: 'Browse and post wholesale deals', route: '/properties' as const, icon: MapPin },
    { title: 'Community', desc: 'Q&A, deal wins, and networking', route: '/community' as const, icon: MessageSquare },
    { title: 'My CRM', desc: 'Manage leads, pipeline, contacts, and tasks', route: '/crm' as const, icon: PhoneIcon },
  ]
  for (const page of pages) {
    items.push({
      title: page.title,
      description: page.desc,
      section: 'page',
      sectionLabel: 'Page',
      route: page.route,
      icon: page.icon,
      category: 'Pages',
    })
  }

  return items
}

/* ─── Fuzzy match scoring ─── */
function scoreMatch(query: string, item: SearchItem): number {
  const q = query.toLowerCase()
  const title = item.title.toLowerCase()
  const desc = item.description.toLowerCase()
  const section = item.sectionLabel.toLowerCase()

  // Exact title match
  if (title === q) return 100
  // Title starts with query
  if (title.startsWith(q)) return 90
  // Title contains query as word
  if (title.includes(q)) return 70
  // Section label match
  if (section.includes(q)) return 50
  // Description match
  if (desc.includes(q)) return 30
  // Word-by-word match (all query words found somewhere)
  const words = q.split(/\s+/).filter(w => w.length > 1)
  if (words.length > 1) {
    const combined = `${title} ${desc} ${section}`
    const matched = words.filter(w => combined.includes(w))
    if (matched.length === words.length) return 40
    if (matched.length > 0) return 20 * (matched.length / words.length)
  }

  return 0
}

/* ─── Category Colors ─── */
const CATEGORY_COLORS: Record<string, string> = {
  'Getting Started': '#5cb885',
  'Contracts & Legal': '#ff7e5f',
  'Finding Deals': '#5ba3d9',
  'Buyers & Closing': '#e8b347',
  'Tools & Finance': '#a855f7',
  'Pages': '#888',
}

/* ─── Component ─── */
export default function GlobalSearch() {
  const [open, setOpen] = useState(false)
  const [query, setQuery] = useState('')
  const [selectedIndex, setSelectedIndex] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)
  const listRef = useRef<HTMLDivElement>(null)
  const navigate = useNavigate()

  const searchIndex = useMemo(() => buildSearchIndex(), [])

  const results = useMemo(() => {
    if (!query.trim()) return []
    const scored = searchIndex
      .map(item => ({ item, score: scoreMatch(query.trim(), item) }))
      .filter(r => r.score > 0)
      .sort((a, b) => b.score - a.score)
    // Deduplicate by title+route+tab
    const seen = new Set<string>()
    const deduped: typeof scored = []
    for (const r of scored) {
      const key = `${r.item.title}|${r.item.route}|${r.item.tab || ''}`
      if (!seen.has(key)) {
        seen.add(key)
        deduped.push(r)
      }
    }
    return deduped.slice(0, 20)
  }, [query, searchIndex])

  // Keyboard shortcut: Ctrl+K or Cmd+K
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault()
        setOpen(prev => !prev)
      }
      if (e.key === 'Escape' && open) {
        e.preventDefault()
        setOpen(false)
      }
    }
    document.addEventListener('keydown', handleKeyDown)
    return () => document.removeEventListener('keydown', handleKeyDown)
  }, [open])

  // Focus input when opened
  useEffect(() => {
    if (open) {
      setQuery('')
      setSelectedIndex(0)
      setTimeout(() => inputRef.current?.focus(), 50)
    }
  }, [open])

  // Scroll selected item into view
  useEffect(() => {
    if (!listRef.current) return
    const el = listRef.current.querySelector(`[data-index="${selectedIndex}"]`)
    if (el) el.scrollIntoView({ block: 'nearest' })
  }, [selectedIndex])

  const handleSelect = useCallback((item: SearchItem) => {
    setOpen(false)
    // Navigate to route with tab info in hash
    if (item.tab) {
      navigate({ to: item.route as any, hash: `tab=${item.tab}` })
    } else {
      navigate({ to: item.route as any })
    }
  }, [navigate])

  const handleKeyDown = useCallback((e: React.KeyboardEvent) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault()
      setSelectedIndex(i => Math.min(i + 1, results.length - 1))
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      setSelectedIndex(i => Math.max(i - 1, 0))
    } else if (e.key === 'Enter' && results[selectedIndex]) {
      e.preventDefault()
      handleSelect(results[selectedIndex].item)
    }
  }, [results, selectedIndex, handleSelect])

  // Reset selection when results change
  useEffect(() => {
    setSelectedIndex(0)
  }, [results])

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        aria-label="Search across all sections (Ctrl+K)"
        className="global-search-trigger"
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 8,
          padding: '7px 14px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid #3d4e65',
          borderRadius: 8,
          color: '#888',
          cursor: 'pointer',
          fontFamily: "'DM Sans', sans-serif",
          fontSize: 13,
          transition: 'all 0.2s',
          whiteSpace: 'nowrap',
        }}
        onMouseEnter={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.08)'
          e.currentTarget.style.borderColor = 'rgba(244,126,95,0.3)'
          e.currentTarget.style.color = '#f5f0eb'
        }}
        onMouseLeave={e => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.04)'
          e.currentTarget.style.borderColor = '#3d4e65'
          e.currentTarget.style.color = '#888'
        }}
      >
        <Search size={14} />
        <span className="global-search-label">Search...</span>
        <kbd style={{
          fontSize: 10,
          padding: '2px 5px',
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid #3d4e65',
          borderRadius: 4,
          color: '#666',
          fontFamily: "'DM Sans', sans-serif",
          lineHeight: 1.4,
        }}>
          <span className="global-search-kbd-symbol" style={{ fontSize: 11 }}>
            {typeof navigator !== 'undefined' && /Mac|iPod|iPhone|iPad/.test(navigator.platform || '') ? '\u2318' : 'Ctrl+'}
          </span>K
        </kbd>
      </button>
    )
  }

  return (
    <>
      {/* Backdrop */}
      <div
        onClick={() => setOpen(false)}
        style={{
          position: 'fixed', inset: 0, zIndex: 9998,
          background: 'rgba(0,0,0,0.6)',
          backdropFilter: 'blur(4px)',
          animation: 'gs-fade-in 0.15s ease',
        }}
      />

      {/* Modal */}
      <div
        role="dialog"
        aria-label="Global search"
        style={{
          position: 'fixed',
          top: 'min(20vh, 120px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 9999,
          width: 'min(580px, calc(100vw - 32px))',
          background: '#1a1f28',
          border: '1px solid #3d4e65',
          borderRadius: 14,
          boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
          overflow: 'hidden',
          animation: 'gs-slide-up 0.2s ease',
        }}
      >
        {/* Search input */}
        <div style={{ display: 'flex', alignItems: 'center', padding: '14px 18px', borderBottom: '1px solid #2e3a4d', gap: 10 }}>
          <Search size={18} color="#888" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search contracts, scripts, buyers, glossary..."
            autoComplete="off"
            style={{
              flex: 1,
              background: 'transparent',
              border: 'none',
              outline: 'none',
              color: '#f5f0eb',
              fontSize: 15,
              fontFamily: "'DM Sans', sans-serif",
              lineHeight: 1.5,
            }}
          />
          <button
            onClick={() => setOpen(false)}
            style={{
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: 'rgba(255,255,255,0.06)', border: '1px solid #3d4e65',
              borderRadius: 6, padding: '4px 8px', cursor: 'pointer', color: '#888',
              fontSize: 11, fontFamily: "'DM Sans', sans-serif",
            }}
          >
            ESC
          </button>
        </div>

        {/* Results */}
        <div
          ref={listRef}
          style={{
            maxHeight: 'min(400px, 50vh)',
            overflowY: 'auto',
            padding: query.trim() ? '8px' : '16px 18px',
            scrollbarWidth: 'thin',
          }}
        >
          {!query.trim() && (
            <div style={{ textAlign: 'center', padding: '24px 0' }}>
              <div style={{ fontSize: 13, color: '#666', marginBottom: 8 }}>
                Search across all sections
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, justifyContent: 'center' }}>
                {['ARV', 'assignment', 'Florida', 'skip trace', 'yellow letter', 'Invitation Homes', 'MAO'].map(tag => (
                  <button
                    key={tag}
                    onClick={() => setQuery(tag)}
                    style={{
                      padding: '4px 10px', borderRadius: 6,
                      background: 'rgba(255,255,255,0.04)',
                      border: '1px solid #2e3a4d',
                      color: '#888', fontSize: 12, cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.15s',
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = 'rgba(244,126,95,0.3)'; e.currentTarget.style.color = '#f5f0eb' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#2e3a4d'; e.currentTarget.style.color = '#888' }}
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {query.trim() && results.length === 0 && (
            <div style={{ textAlign: 'center', padding: '32px 0', color: '#666', fontSize: 14 }}>
              No results found for "{query}"
            </div>
          )}

          {results.map((r, idx) => {
            const Icon = r.item.icon
            const catColor = CATEGORY_COLORS[r.item.category] || '#888'
            return (
              <button
                key={`${r.item.title}-${r.item.route}-${r.item.tab}-${idx}`}
                data-index={idx}
                onClick={() => handleSelect(r.item)}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  width: '100%',
                  padding: '10px 12px',
                  background: selectedIndex === idx ? 'rgba(244,126,95,0.08)' : 'transparent',
                  border: 'none',
                  borderRadius: 8,
                  cursor: 'pointer',
                  textAlign: 'left',
                  transition: 'background 0.1s',
                  color: '#f5f0eb',
                }}
                onMouseEnter={() => setSelectedIndex(idx)}
              >
                <div style={{
                  width: 32, height: 32, borderRadius: 8,
                  background: `${catColor}15`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Icon size={15} />
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{
                    fontSize: 13, fontWeight: 500, color: '#f5f0eb',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {r.item.title}
                  </div>
                  <div style={{
                    fontSize: 11, color: '#888',
                    overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap',
                  }}>
                    {r.item.description}
                  </div>
                </div>
                <span style={{
                  fontSize: 10, padding: '2px 7px', borderRadius: 4,
                  background: `${catColor}15`,
                  color: catColor,
                  fontWeight: 600,
                  whiteSpace: 'nowrap',
                  flexShrink: 0,
                }}>
                  {r.item.sectionLabel}
                </span>
                <ArrowRight size={12} color="#555" style={{ flexShrink: 0 }} />
              </button>
            )
          })}
        </div>

        {/* Footer hint */}
        {query.trim() && results.length > 0 && (
          <div style={{
            padding: '8px 18px',
            borderTop: '1px solid #2e3a4d',
            display: 'flex',
            alignItems: 'center',
            gap: 16,
            fontSize: 11,
            color: '#555',
          }}>
            <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: 3, fontSize: 10, border: '1px solid #2e3a4d' }}>&uarr;&darr;</kbd> Navigate</span>
            <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: 3, fontSize: 10, border: '1px solid #2e3a4d' }}>Enter</kbd> Open</span>
            <span><kbd style={{ padding: '1px 4px', background: 'rgba(255,255,255,0.06)', borderRadius: 3, fontSize: 10, border: '1px solid #2e3a4d' }}>Esc</kbd> Close</span>
          </div>
        )}
      </div>

      <style>{`
        @keyframes gs-fade-in {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        @keyframes gs-slide-up {
          from { opacity: 0; transform: translateX(-50%) translateY(10px); }
          to { opacity: 1; transform: translateX(-50%) translateY(0); }
        }
      `}</style>
    </>
  )
}
