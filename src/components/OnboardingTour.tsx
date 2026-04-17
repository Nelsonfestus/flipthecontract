import { useState, useEffect, useCallback, useRef } from 'react'
import { X, ChevronRight, ChevronLeft, Flame, FileText, Search, Building, Zap, Users, Sparkles, GraduationCap, Briefcase, Trophy, RotateCcw } from 'lucide-react'

type ExperienceLevel = 'beginner' | 'intermediate' | 'advanced' | null

interface TourStep {
  target: string // CSS selector or data-tour attribute
  title: string
  description: string
  icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>
  action?: { label: string; to: string }
}

const BEGINNER_STEPS: TourStep[] = [
  {
    target: '[data-tour="getting-started"]',
    title: 'Start Here',
    description: 'New to wholesaling? This section has daily motivation, a glossary of key terms, negotiation verbiage, and a step-by-step deal checklist to get you going.',
    icon: Flame,
    action: { label: 'Open Getting Started', to: '/getting-started' },
  },
  {
    target: '[data-tour="contracts-legal"]',
    title: 'Your Contract Templates',
    description: 'Access purchase agreements, assignment contracts, double close agreements, and LOIs for all 50 states. These are the documents you\'ll use on every deal.',
    icon: FileText,
    action: { label: 'Browse Contracts', to: '/contracts-legal' },
  },
  {
    target: '[data-tour="deals"]',
    title: 'Find Your First Deal',
    description: 'Use skip trace tools to find motivated sellers, grab cold calling scripts, and download marketing templates to generate leads.',
    icon: Search,
    action: { label: 'Find Deals', to: '/deals' },
  },
  {
    target: '[data-tour="buyers"]',
    title: 'Connect with Cash Buyers',
    description: 'Access hedge fund buyer lists, investment brokerages, and title companies. These are the people who will buy your contracts.',
    icon: Building,
    action: { label: 'View Buyers', to: '/buyers' },
  },
  {
    target: '[data-tour="quick-access"]',
    title: 'Practice & Community',
    description: 'Try risk-free practice deals to build confidence, browse the property marketplace, and connect with other wholesalers in the community.',
    icon: Users,
    action: { label: 'Try Practice Deals', to: '/practice-deals' },
  },
]

const INTERMEDIATE_STEPS: TourStep[] = [
  {
    target: '[data-tour="tools"]',
    title: 'Power Calculators',
    description: 'Run Quick Offer, Multi-Family, and Investment Strategy calculations. Save your analyses to build a deal history over time.',
    icon: Zap,
    action: { label: 'Open Tools', to: '/tools' },
  },
  {
    target: '[data-tour="contracts-legal"]',
    title: 'Advanced Contracts',
    description: 'Double close agreements, cancellation notices, JV partnership contracts, and state-by-state legal guides for more complex deal structures.',
    icon: FileText,
    action: { label: 'Browse Contracts', to: '/contracts-legal' },
  },
  {
    target: '[data-tour="deals"]',
    title: 'Scale Your Lead Gen',
    description: 'Import leads with the Smart Lead Importer, use advanced marketing templates, and leverage the property map to find deals in your target markets.',
    icon: Search,
    action: { label: 'Find Deals', to: '/deals' },
  },
  {
    target: '[data-tour="crm"]',
    title: 'Your Deal Pipeline',
    description: 'Track every lead from first contact to close. The CRM has a Kanban pipeline, deal scoring, and activity feeds to manage your business.',
    icon: Users,
    action: { label: 'Open CRM', to: '/crm' },
  },
  {
    target: '[data-tour="buyers"]',
    title: 'Institutional Buyers',
    description: 'Access hedge fund buyer contacts and disposition email templates to move properties faster. Build your buyer list systematically.',
    icon: Building,
    action: { label: 'View Buyers', to: '/buyers' },
  },
]

const ADVANCED_STEPS: TourStep[] = [
  {
    target: '[data-tour="crm"]',
    title: 'CRM & Pipeline Management',
    description: 'Manage your entire deal flow — Kanban pipeline, lead scoring, activity tracking, and deal analytics all in one place.',
    icon: Users,
    action: { label: 'Open CRM', to: '/crm' },
  },
  {
    target: '[data-tour="tools"]',
    title: 'Advanced Calculators',
    description: 'Multi-Family calculator, Investment Strategy analyzer, and calculation history. Run comps, analyze NOI, and compare deal structures.',
    icon: Zap,
    action: { label: 'Open Tools', to: '/tools' },
  },
  {
    target: '[data-tour="deals"]',
    title: 'Lead Generation at Scale',
    description: 'Smart Lead Importer for bulk imports, heat maps for market analysis, and advanced comp calculators to find undervalued properties.',
    icon: Search,
    action: { label: 'Find Deals', to: '/deals' },
  },
  {
    target: '[data-tour="contracts-legal"]',
    title: 'JV & Complex Structures',
    description: 'JV partnership agreements, double close contracts, cancellation templates, and state law guides for multi-party deals.',
    icon: FileText,
    action: { label: 'Browse Contracts', to: '/contracts-legal' },
  },
  {
    target: '[data-tour="community"]',
    title: 'Network & Scale',
    description: 'Share deal wins, get advice from experienced wholesalers, browse the property marketplace, and book 1-on-1 coaching calls.',
    icon: Users,
    action: { label: 'Join Community', to: '/community' },
  },
]

function getSteps(level: ExperienceLevel): TourStep[] {
  switch (level) {
    case 'beginner': return BEGINNER_STEPS
    case 'intermediate': return INTERMEDIATE_STEPS
    case 'advanced': return ADVANCED_STEPS
    default: return []
  }
}

const LEVEL_OPTIONS = [
  {
    id: 'beginner' as const,
    label: 'Just Starting Out',
    description: 'New to wholesale real estate',
    icon: GraduationCap,
    color: '#5cb885',
  },
  {
    id: 'intermediate' as const,
    label: 'Some Experience',
    description: 'Done a few deals, want to grow',
    icon: Briefcase,
    color: '#ff7e5f',
  },
  {
    id: 'advanced' as const,
    label: 'Experienced Investor',
    description: 'Scaling my wholesale business',
    icon: Trophy,
    color: '#a855f7',
  },
]

export default function OnboardingTour({ onClose }: { onClose: () => void }) {
  const [level, setLevel] = useState<ExperienceLevel>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [highlightRect, setHighlightRect] = useState<DOMRect | null>(null)
  const [targetFound, setTargetFound] = useState(true)
  const tooltipRef = useRef<HTMLDivElement>(null)

  const steps = getSteps(level)
  const step = steps[currentStep]

  const positionHighlight = useCallback(() => {
    if (!step) return
    const el = document.querySelector(step.target)
    if (el) {
      setTargetFound(true)
      const rect = el.getBoundingClientRect()
      setHighlightRect(rect)
      // Scroll element into view if needed
      const viewportH = window.innerHeight
      if (rect.top < 80 || rect.bottom > viewportH - 40) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' })
        // Re-measure after scroll
        setTimeout(() => {
          setHighlightRect(el.getBoundingClientRect())
        }, 400)
      }
    } else {
      setTargetFound(false)
      setHighlightRect(null)
    }
  }, [step])

  useEffect(() => {
    if (level && step) {
      positionHighlight()
      window.addEventListener('resize', positionHighlight)
      window.addEventListener('scroll', positionHighlight, true)
      return () => {
        window.removeEventListener('resize', positionHighlight)
        window.removeEventListener('scroll', positionHighlight, true)
      }
    }
  }, [level, currentStep, positionHighlight, step])

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        handleFinish()
      } else if (level) {
        if (e.key === 'ArrowRight' || e.key === 'Enter') {
          e.preventDefault()
          handleNext()
        } else if (e.key === 'ArrowLeft' && currentStep > 0) {
          e.preventDefault()
          handlePrev()
        }
      }
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  })

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1)
    } else {
      handleFinish()
    }
  }

  const handlePrev = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1)
  }

  const handleFinish = () => {
    try { localStorage.setItem('ftc_onboarding_done', '1') } catch {}
    onClose()
  }

  const handleSelectLevel = (l: ExperienceLevel) => {
    setLevel(l)
    setCurrentStep(0)
  }

  // Calculate tooltip position
  const getTooltipPosition = (): React.CSSProperties => {
    if (!highlightRect) {
      return {
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
      }
    }

    const padding = 16
    const tooltipWidth = Math.min(380, window.innerWidth - 32)
    const viewportH = window.innerHeight
    const centerX = highlightRect.left + highlightRect.width / 2

    // Prefer below, then above
    const spaceBelow = viewportH - highlightRect.bottom
    const placeBelow = spaceBelow > 220

    let left = centerX - tooltipWidth / 2
    left = Math.max(padding, Math.min(left, window.innerWidth - tooltipWidth - padding))

    if (placeBelow) {
      return {
        position: 'fixed',
        top: highlightRect.bottom + 16,
        left,
        width: tooltipWidth,
      }
    }
    return {
      position: 'fixed',
      bottom: viewportH - highlightRect.top + 16,
      left,
      width: tooltipWidth,
    }
  }

  // Experience level selection screen
  if (!level) {
    return (
      <div className="onboarding-overlay" onClick={handleFinish}>
        <div className="onboarding-level-picker" onClick={e => e.stopPropagation()} role="dialog" aria-label="Welcome tour - select experience level">
          <button className="onboarding-close" onClick={handleFinish} aria-label="Skip onboarding">
            <X size={18} />
          </button>

          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14,
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
              display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
              marginBottom: 16,
            }}>
              <Sparkles size={28} color="#fff" />
            </div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(24px, 5vw, 32px)',
              color: '#f5f0eb',
              letterSpacing: '0.04em',
              margin: '0 0 8px',
            }}>
              Welcome to Flip the Contract
            </h2>
            <p style={{ color: '#9a918a', fontSize: 14, margin: 0, lineHeight: 1.6 }}>
              Tell us your experience level and we'll show you the 5 most important features to get started.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {LEVEL_OPTIONS.map(opt => {
              const Icon = opt.icon
              return (
                <button
                  key={opt.id}
                  className="onboarding-level-btn"
                  onClick={() => handleSelectLevel(opt.id)}
                  style={{ '--level-color': opt.color } as React.CSSProperties}
                >
                  <div className="onboarding-level-icon" style={{ background: `${opt.color}15`, borderColor: `${opt.color}30` }}>
                    <Icon size={22} style={{ color: opt.color }} />
                  </div>
                  <div style={{ flex: 1, textAlign: 'left' }}>
                    <div style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 19, color: '#f5f0eb',
                      letterSpacing: '0.04em', lineHeight: 1.1,
                    }}>
                      {opt.label}
                    </div>
                    <div style={{ fontSize: 13, color: '#9a918a', marginTop: 2 }}>
                      {opt.description}
                    </div>
                  </div>
                  <ChevronRight size={18} style={{ color: '#6b6560', flexShrink: 0 }} />
                </button>
              )
            })}
          </div>

          <button className="onboarding-skip-link" onClick={handleFinish}>
            Skip tour, I'll explore on my own
          </button>
          <p style={{ color: '#4a4540', fontSize: 11, textAlign: 'center', margin: '12px 0 0', lineHeight: 1.4 }}>
            Press <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #3d4e65', borderRadius: 4, padding: '1px 5px', fontSize: 10 }}>Esc</kbd> to skip
          </p>
        </div>
      </div>
    )
  }

  // Tour step view
  const Icon = step?.icon || Flame
  const isLast = currentStep === steps.length - 1

  return (
    <>
      {/* Backdrop overlay with spotlight cutout */}
      <div className="onboarding-overlay onboarding-overlay-tour" onClick={handleFinish}>
        {highlightRect && (
          <div
            className="onboarding-spotlight"
            style={{
              top: highlightRect.top - 8,
              left: highlightRect.left - 8,
              width: highlightRect.width + 16,
              height: highlightRect.height + 16,
            }}
          />
        )}
      </div>

      {/* Tooltip */}
      <div
        ref={tooltipRef}
        className="onboarding-tooltip"
        style={getTooltipPosition()}
        onClick={e => e.stopPropagation()}
        role="dialog"
        aria-label={`Tour step ${currentStep + 1} of ${steps.length}: ${step?.title}`}
      >
        {/* Progress bar */}
        <div className="onboarding-progress">
          {steps.map((_, i) => (
            <div
              key={i}
              className={`onboarding-progress-dot ${i === currentStep ? 'active' : ''} ${i < currentStep ? 'done' : ''}`}
            />
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 14, marginBottom: 12 }}>
          <div style={{
            width: 44, height: 44, borderRadius: 12,
            background: 'rgba(244,126,95,0.1)',
            border: '1px solid rgba(244,126,95,0.2)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon size={22} style={{ color: '#ff7e5f' }} />
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: 22, color: '#f5f0eb',
                letterSpacing: '0.04em', margin: 0, lineHeight: 1.1,
              }}>
                {step?.title}
              </h3>
              <button className="onboarding-close-sm" onClick={handleFinish} aria-label="Close tour">
                <X size={14} />
              </button>
            </div>
            <p style={{ color: '#a09890', fontSize: 13, lineHeight: 1.6, margin: '8px 0 0' }}>
              {step?.description}
            </p>
          </div>
        </div>

        {/* Action button - directs user to the relevant section */}
        {step?.action && targetFound && (
          <div style={{ marginBottom: 12 }}>
            <a
              href={step.action.to}
              className="onboarding-action-btn"
              onClick={(e) => {
                e.preventDefault()
                handleFinish()
                window.location.href = step.action!.to
              }}
            >
              {step.action.label} <ChevronRight size={14} />
            </a>
          </div>
        )}

        {/* Missing target hint */}
        {!targetFound && (
          <div style={{
            background: 'rgba(255,183,77,0.08)',
            border: '1px solid rgba(255,183,77,0.2)',
            borderRadius: 8,
            padding: '8px 12px',
            marginBottom: 12,
            fontSize: 12,
            color: '#ffb74d',
            lineHeight: 1.5,
          }}>
            Scroll down to find this section on the page, or click Next to continue.
          </div>
        )}

        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <span style={{ fontSize: 12, color: '#6b6560', fontFamily: "'DM Sans', sans-serif" }}>
            {currentStep + 1} of {steps.length}
          </span>

          <div style={{ display: 'flex', gap: 8 }}>
            {currentStep > 0 && (
              <button className="onboarding-btn-ghost" onClick={handlePrev}>
                <ChevronLeft size={14} /> Back
              </button>
            )}
            <button className="onboarding-btn-primary" onClick={handleNext}>
              {isLast ? 'Finish Tour' : 'Next'} {!isLast && <ChevronRight size={14} />}
            </button>
          </div>
        </div>

        {/* Keyboard hint */}
        <div style={{ marginTop: 8, textAlign: 'center' }}>
          <span style={{ fontSize: 10, color: '#4a4540' }}>
            Use <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #3d4e65', borderRadius: 3, padding: '0 4px', fontSize: 9 }}>←</kbd> <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #3d4e65', borderRadius: 3, padding: '0 4px', fontSize: 9 }}>→</kbd> keys to navigate · <kbd style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid #3d4e65', borderRadius: 3, padding: '0 4px', fontSize: 9 }}>Esc</kbd> to close
          </span>
        </div>
      </div>
    </>
  )
}

/** Small button to restart the tour — render in the hub page */
export function RestartTourButton() {
  const handleRestart = () => {
    try { localStorage.removeItem('ftc_onboarding_done') } catch {}
    window.location.reload()
  }

  return (
    <button
      className="restart-tour-btn"
      onClick={handleRestart}
      title="Restart guided tour"
      aria-label="Restart guided tour"
    >
      <RotateCcw size={14} />
      <span>Restart Tour</span>
    </button>
  )
}
