import { useState, useEffect, useCallback } from 'react'
import {
  Flame, RefreshCw, Share2, ChevronRight, Trophy, Target, Zap,
  Rocket, Star, TrendingUp, CheckCircle2, Award, Heart,
  Sparkles, Phone, MapPin, Users, DollarSign
} from 'lucide-react'

/* ─── Data ─────────────────────────────────────────────────────── */

const MOTIVATIONAL_QUOTES = [
  { quote: "Your first deal proves it works. Your tenth deal proves you have a system.", author: "FTC Community", category: "Growth" },
  { quote: "Consistent outreach beats sporadic effort. Fifty calls a day will outperform waiting for the perfect lead.", author: "FTC Community", category: "Consistency" },
  { quote: "Wholesalers close deals in every market cycle. The variable is finding the right seller, not timing the market.", author: "FTC Community", category: "Strategy" },
  { quote: "Build your buyers list before you have a deal. When you lock up a property, you want to assign it — not scramble.", author: "FTC Community", category: "Strategy" },
  { quote: "A motivated seller cares about your solution, not your experience level. Lead with how you can help.", author: "FTC Community", category: "Mindset" },
  { quote: "The difference between a $5K and a $25K assignment fee is knowing your numbers and negotiating from data.", author: "FTC Community", category: "Strategy" },
  { quote: "The money follows the marketing. If nobody knows you buy houses, nobody will call you to sell one.", author: "FTC Community", category: "Strategy" },
  { quote: "When a seller says 'I need to think about it,' that's a cue to follow up — not to move on.", author: "FTC Community", category: "Persistence" },
  { quote: "Treat every seller with respect. Your reputation in a market compounds faster than your deal count.", author: "FTC Community", category: "Mindset" },
  { quote: "Revenue grows from repeatable processes — consistent marketing, organized follow-up, and reliable closings.", author: "FTC Community", category: "Growth" },
  { quote: "Driving for dollars works because you see what data can't show you: vacancy, deferred maintenance, and opportunity.", author: "FTC Community", category: "Strategy" },
  { quote: "The best way to learn wholesaling is to make offers. Study enough to be competent, then get reps.", author: "FTC Community", category: "Action" },
  { quote: "Every door knocked, letter sent, and call made adds to your pipeline. Results lag behind activity by weeks.", author: "FTC Community", category: "Persistence" },
  { quote: "Don't compare your month three to someone else's year three. Focus on building your own track record.", author: "FTC Community", category: "Persistence" },
  { quote: "Your assignment fee reflects the size of the problem you solve for the seller and the value you deliver to the buyer.", author: "FTC Community", category: "Growth" },
]

const DAILY_TIPS = [
  "Make at least 25 outbound calls today. Consistent volume builds your pipeline.",
  "Update your buyers list — reach out to 3 new cash buyers this week.",
  "Drive a new neighborhood today. Look for vacancy indicators: overgrown lawns, boarded windows, code violations.",
  "Follow up with every lead from the past 7 days. Most deals close on the second or third touch.",
  "Post in 2 local Facebook groups: 'I buy houses cash, any condition.'",
  "Pull a new skip trace batch of 50 owners. Current data leads to better conversations.",
  "Review your last 3 offers. What would you adjust? Apply those lessons to the next one.",
  "Send 20 yellow letters or postcards to absentee owners today.",
  "Call your title company and check on any pending deals. Stay on top of the process.",
  "Spend 30 minutes studying your target market's comps. Accurate ARVs protect your margins.",
  "Text a past seller lead: 'Hi, just checking in — still thinking about selling?'",
  "Update your CRM. An organized pipeline means fewer missed opportunities.",
  "Ask a fellow wholesaler to JV on a deal you can't close alone.",
  "Practice your elevator pitch: 60 seconds to explain what you do and why sellers should work with you.",
  "Search '[your city] code violations' — that list is a strong source of motivated sellers.",
]

const SUCCESS_STORIES = [
  {
    name: "Marcus T.",
    market: "Atlanta, GA",
    story: "Closed my first wholesale deal 6 weeks after joining FTC. Made $8,500 on an assignment fee from a driving-for-dollars lead.",
    tip: "Don't overthink it. Just start making offers.",
    metric: "$8,500",
    metricLabel: "First Deal",
  },
  {
    name: "Keisha R.",
    market: "Houston, TX",
    story: "Went from zero deals to 3 closings in my first 90 days by following the daily action steps and staying consistent with outreach.",
    tip: "The daily tips here actually work if you do them.",
    metric: "3 Deals",
    metricLabel: "In 90 Days",
  },
  {
    name: "Jordan & Alex P.",
    market: "Phoenix, AZ",
    story: "Hit six figures in assignment fees within our first year. The key was building a serious buyers list before locking up properties.",
    tip: "Buyers list first. Everything else gets easier.",
    metric: "$100K+",
    metricLabel: "Year One",
  },
  {
    name: "DeShawn M.",
    market: "Charlotte, NC",
    story: "Left my 9-to-5 after month eight. FTC gave me the scripts, the contracts, and the confidence to go full time.",
    tip: "Stay employed until deal flow is consistent. Then make the leap.",
    metric: "Full Time",
    metricLabel: "Month 8",
  },
]

const DAILY_CHALLENGES = [
  { task: "Make 10 outbound calls to sellers", icon: Phone, xp: 50, difficulty: "Starter" },
  { task: "Drive 3 new streets looking for distressed properties", icon: MapPin, xp: 40, difficulty: "Starter" },
  { task: "Add 2 new cash buyers to your list", icon: Users, xp: 60, difficulty: "Builder" },
  { task: "Submit 1 offer on a property today", icon: DollarSign, xp: 100, difficulty: "Closer" },
  { task: "Follow up with 5 past leads", icon: Phone, xp: 45, difficulty: "Starter" },
  { task: "Analyze comps on 3 properties in your target area", icon: TrendingUp, xp: 55, difficulty: "Builder" },
  { task: "Send 15 direct mail pieces to absentee owners", icon: Target, xp: 70, difficulty: "Builder" },
]

const MILESTONES = [
  { label: "First Visit", threshold: 1, icon: Star },
  { label: "3-Day Streak", threshold: 3, icon: Flame },
  { label: "1-Week Warrior", threshold: 7, icon: Trophy },
  { label: "2-Week Grinder", threshold: 14, icon: Award },
  { label: "30-Day Machine", threshold: 30, icon: Rocket },
]

/* ─── Helpers ──────────────────────────────────────────────────── */

function getDailyIndex(array: unknown[], seed?: number) {
  const today = new Date()
  const dayOfYear = Math.floor((today.getTime() - new Date(today.getFullYear(), 0, 0).getTime()) / 86400000)
  return (dayOfYear + (seed || 0)) % array.length
}

function getStreakData() {
  try {
    const data = localStorage.getItem('ftc_motivation_streak')
    const today = new Date().toDateString()
    if (data) {
      const { count, lastDate } = JSON.parse(data)
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (lastDate === today) return count
      const newCount = lastDate === yesterday ? count + 1 : 1
      localStorage.setItem('ftc_motivation_streak', JSON.stringify({ count: newCount, lastDate: today }))
      return newCount
    }
    localStorage.setItem('ftc_motivation_streak', JSON.stringify({ count: 1, lastDate: today }))
    return 1
  } catch { return 1 }
}

function getCompletedChallenges(): string[] {
  try {
    const data = localStorage.getItem('ftc_challenges_today')
    if (data) {
      const parsed = JSON.parse(data)
      if (parsed.date === new Date().toDateString()) return parsed.completed
    }
    return []
  } catch { return [] }
}

function toggleChallenge(index: number, completed: string[]): string[] {
  const key = `challenge-${index}`
  const next = completed.includes(key)
    ? completed.filter(c => c !== key)
    : [...completed, key]
  try {
    localStorage.setItem('ftc_challenges_today', JSON.stringify({ date: new Date().toDateString(), completed: next }))
  } catch { /* noop */ }
  return next
}

function getTimeGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return { greeting: "Good Morning, Closer", emoji: "☀️", message: "The early bird gets the deal. Let's make today count." }
  if (hour < 17) return { greeting: "Keep Pushing", emoji: "🔥", message: "Afternoon hustle is where deals get done. Stay locked in." }
  return { greeting: "Evening Grind", emoji: "🌙", message: "While others rest, you're building an empire. Respect the process." }
}

/* ─── Component ────────────────────────────────────────────────── */

export default function DailyMotivation() {
  const [quoteIndex, setQuoteIndex] = useState(getDailyIndex(MOTIVATIONAL_QUOTES))
  const [streak, setStreak] = useState(0)
  const [copied, setCopied] = useState(false)
  const [showAllQuotes, setShowAllQuotes] = useState(false)
  const [completedChallenges, setCompletedChallenges] = useState<string[]>([])
  const [showAllStories, setShowAllStories] = useState(false)
  const [activeInsight, setActiveInsight] = useState<string>('quote')

  useEffect(() => {
    setStreak(getStreakData())
    setCompletedChallenges(getCompletedChallenges())
  }, [])

  const dailyQuote = MOTIVATIONAL_QUOTES[quoteIndex]
  const dailyTip = DAILY_TIPS[getDailyIndex(DAILY_TIPS)]
  const todayChallenges = DAILY_CHALLENGES.slice(getDailyIndex(DAILY_CHALLENGES, 0), getDailyIndex(DAILY_CHALLENGES, 0) + 3).length < 3
    ? DAILY_CHALLENGES.slice(0, 3)
    : DAILY_CHALLENGES.slice(getDailyIndex(DAILY_CHALLENGES, 0), getDailyIndex(DAILY_CHALLENGES, 0) + 3)
  const timeInfo = getTimeGreeting()
  const todayStories = SUCCESS_STORIES.slice(0, showAllStories ? undefined : 2)

  const nextMilestone = MILESTONES.find(m => streak < m.threshold) || MILESTONES[MILESTONES.length - 1]
  const prevMilestone = MILESTONES.filter(m => streak >= m.threshold).pop()
  const milestoneProgress = nextMilestone
    ? Math.min(100, Math.round((streak / nextMilestone.threshold) * 100))
    : 100

  const challengeXP = todayChallenges.reduce((sum, c, i) =>
    completedChallenges.includes(`challenge-${i}`) ? sum + c.xp : sum, 0)
  const totalXP = todayChallenges.reduce((sum, c) => sum + c.xp, 0)

  const shuffleQuote = useCallback(() => {
    let next = quoteIndex
    while (next === quoteIndex) next = Math.floor(Math.random() * MOTIVATIONAL_QUOTES.length)
    setQuoteIndex(next)
  }, [quoteIndex])

  function copyQuote() {
    navigator.clipboard.writeText(`"${dailyQuote.quote}" — ${dailyQuote.author}`)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const today = new Date()
  const dateStr = today.toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })

  const activeLibraryQuotes = MOTIVATIONAL_QUOTES
    .slice(0, showAllQuotes ? undefined : 6)
    .filter((_, i) => i !== quoteIndex)
    .slice(0, showAllQuotes ? undefined : 5)

  const insightTitle = (() => {
    if (activeInsight === 'quote') return 'Quote Focus'
    if (activeInsight === 'tip') return "Today's Action Focus"
    const statIds = ['streak', 'quotes', 'tips'] as const
    if (statIds.includes(activeInsight as typeof statIds[number])) {
      const card = STAT_CARDS.find(c => c.id === activeInsight)
      return card ? card.detailTitle : 'Motivation Focus'
    }
    const quoteMatch = activeLibraryQuotes.find((_, i) => `library-${i}` === activeInsight)
    if (quoteMatch) return `${quoteMatch.category} Quote Focus`
    return 'Motivation Focus'
  })()

  const insightDescription = (() => {
    if (activeInsight === 'quote')
      return `"${dailyQuote.quote}" centers on ${dailyQuote.category.toLowerCase()}. Use it as the standard for decisions and conversations today.`
    if (activeInsight === 'tip') return dailyTip
    const card = STAT_CARDS.find(c => c.id === activeInsight)
    if (card) return card.detail
    const quoteMatch = activeLibraryQuotes.find((_, i) => `library-${i}` === activeInsight)
    if (quoteMatch) return quoteMatch.quote
    return 'Select any card to load contextual motivation guidance.'
  })()

  return (
    <div>
      {/* ── Hero Greeting ────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(244,126,95,0.15) 0%, rgba(255,179,71,0.08) 50%, rgba(92,184,133,0.08) 100%)',
        border: '1px solid rgba(244,126,95,0.2)',
        borderRadius: 20,
        padding: '36px 32px',
        marginBottom: 32,
        position: 'relative',
        overflow: 'hidden',
      }}>
        {/* Decorative glow */}
        <div style={{
          position: 'absolute', top: -60, right: -60, width: 200, height: 200,
          background: 'radial-gradient(circle, rgba(244,126,95,0.15) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />
        <div style={{
          position: 'absolute', bottom: -40, left: -40, width: 150, height: 150,
          background: 'radial-gradient(circle, rgba(92,184,133,0.1) 0%, transparent 70%)',
          borderRadius: '50%', pointerEvents: 'none',
        }} />

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
            <span style={{ fontSize: 32 }}>{timeInfo.emoji}</span>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 'clamp(28px, 5vw, 42px)',
              color: '#f5f0eb',
              letterSpacing: '0.04em',
              margin: 0,
              lineHeight: 1.1,
            }}>
              {timeInfo.greeting}
            </h2>
          </div>
          <p style={{ color: '#ccc', fontSize: 16, margin: '8px 0 0', maxWidth: 500, lineHeight: 1.5 }}>
            {timeInfo.message}
          </p>
          <p style={{ color: '#666', fontSize: 13, marginTop: 8 }}>{dateStr}</p>
        </div>
      </div>

      {/* ── Streak + Milestone Progress ──────────────────── */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 280px), 1fr))',
        gap: 16,
        marginBottom: 32,
      }}>
        {/* Streak card */}
        <div style={{
          background: 'rgba(26,31,40,0.85)',
          border: '1px solid #3d4e65',
          borderRadius: 16,
          padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <Flame size={22} color="#ff7e5f" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
              Your Streak
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
            <span style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: 56,
              color: '#ff7e5f',
              letterSpacing: '0.04em',
              lineHeight: 1,
            }}>
              {streak}
            </span>
            <span style={{ color: '#888', fontSize: 14 }}>
              {streak === 1 ? 'day' : 'days'} in a row
            </span>
          </div>

          {/* Milestone progress */}
          <div style={{ marginTop: 12 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ color: '#888', fontSize: 12 }}>
                {prevMilestone ? `✓ ${prevMilestone.label}` : 'Get started!'}
              </span>
              <span style={{ color: '#ffb347', fontSize: 12, fontWeight: 600 }}>
                {nextMilestone && streak < nextMilestone.threshold
                  ? `${nextMilestone.threshold - streak} days to "${nextMilestone.label}"`
                  : 'All milestones reached!'}
              </span>
            </div>
            <div style={{
              height: 8,
              borderRadius: 4,
              background: 'rgba(255,126,95,0.15)',
              overflow: 'hidden',
            }}>
              <div style={{
                height: '100%',
                width: `${milestoneProgress}%`,
                borderRadius: 4,
                background: 'linear-gradient(90deg, #ff7e5f, #ffb347)',
                transition: 'width 0.6s ease',
              }} />
            </div>
            {/* Milestone badges */}
            <div style={{ display: 'flex', gap: 8, marginTop: 12, flexWrap: 'wrap' }}>
              {MILESTONES.map(m => {
                const MIcon = m.icon
                const achieved = streak >= m.threshold
                return (
                  <div
                    key={m.label}
                    title={m.label}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 4,
                      padding: '4px 10px',
                      borderRadius: 20,
                      fontSize: 11,
                      background: achieved ? 'rgba(244,126,95,0.15)' : 'rgba(61,78,101,0.3)',
                      color: achieved ? '#ff7e5f' : '#555',
                      border: achieved ? '1px solid rgba(244,126,95,0.3)' : '1px solid transparent',
                    }}
                  >
                    <MIcon size={12} /> {m.label}
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Daily Challenge card */}
        <div style={{
          background: 'rgba(26,31,40,0.85)',
          border: '1px solid #3d4e65',
          borderRadius: 16,
          padding: '24px 28px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <Target size={22} color="#ffb347" />
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                Today's Challenges
              </span>
            </div>
            <span style={{
              fontSize: 12,
              color: challengeXP === totalXP ? '#5cb885' : '#ffb347',
              fontWeight: 600,
            }}>
              {challengeXP}/{totalXP} XP
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
            {todayChallenges.map((challenge, i) => {
              const CIcon = challenge.icon
              const done = completedChallenges.includes(`challenge-${i}`)
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => setCompletedChallenges(toggleChallenge(i, completedChallenges))}
                  style={{
                    display: 'flex', alignItems: 'center', gap: 12,
                    padding: '14px 16px',
                    borderRadius: 10,
                    border: done ? '1px solid rgba(92,184,133,0.3)' : '1px solid #3d4e65',
                    background: done ? 'rgba(92,184,133,0.08)' : 'rgba(26,31,40,0.6)',
                    cursor: 'pointer',
                    textAlign: 'left',
                    transition: 'all 0.2s ease',
                    textDecoration: 'none',
                  }}
                >
                  {done
                    ? <CheckCircle2 size={20} color="#5cb885" />
                    : <CIcon size={20} color="#888" />
                  }
                  <div style={{ flex: 1 }}>
                    <div style={{
                      color: done ? '#5cb885' : '#ccc',
                      fontSize: 14,
                      textDecoration: done ? 'line-through' : 'none',
                      opacity: done ? 0.8 : 1,
                    }}>
                      {challenge.task}
                    </div>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    <span style={{
                      fontSize: 11,
                      padding: '2px 8px',
                      borderRadius: 10,
                      background: challenge.difficulty === 'Closer' ? 'rgba(244,126,95,0.2)' : challenge.difficulty === 'Builder' ? 'rgba(255,179,71,0.2)' : 'rgba(92,184,133,0.2)',
                      color: challenge.difficulty === 'Closer' ? '#ff7e5f' : challenge.difficulty === 'Builder' ? '#ffb347' : '#5cb885',
                    }}>
                      {challenge.difficulty}
                    </span>
                    <span style={{ color: done ? '#5cb885' : '#666', fontSize: 12, fontWeight: 600 }}>
                      +{challenge.xp} XP
                    </span>
                  </div>
                </button>
              )
            })}
          </div>

          {challengeXP === totalXP && (
            <div style={{
              marginTop: 12,
              padding: '10px 14px',
              borderRadius: 8,
              background: 'rgba(92,184,133,0.12)',
              border: '1px solid rgba(92,184,133,0.2)',
              color: '#5cb885',
              fontSize: 13,
              textAlign: 'center',
              fontWeight: 600,
            }}>
              All challenges complete! You're building real momentum.
            </div>
          )}
        </div>
      </div>

      {/* ── Featured Quote ───────────────────────────────── */}
      <button
        type="button"
        onClick={() => setActiveInsight('quote')}
        aria-pressed={activeInsight === 'quote'}
        style={{
          width: '100%',
          textAlign: 'left',
          background: 'linear-gradient(135deg, rgba(244,126,95,0.14) 0%, rgba(232,179,71,0.07) 100%)',
          border: activeInsight === 'quote' ? '1px solid #ff7e5f' : '1px solid rgba(244,126,95,0.25)',
          borderRadius: 16,
          padding: '40px 32px',
          marginBottom: 24,
          position: 'relative',
          overflow: 'hidden',
          cursor: 'pointer',
        }}
      >
        <div style={{
          position: 'absolute', top: -10, left: 16, fontSize: 120,
          fontFamily: 'Georgia, serif', color: 'rgba(244,126,95,0.1)',
          lineHeight: 1, pointerEvents: 'none', userSelect: 'none',
        }}>"</div>

        <div style={{ position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
            <span className="badge badge-orange">Quote of the Day</span>
            <span className="badge" style={{ background: 'rgba(232,179,71,0.2)', color: '#ffb347' }}>
              {dailyQuote.category}
            </span>
          </div>

          <blockquote style={{
            fontSize: 'clamp(18px, 3vw, 24px)',
            color: '#f5f0eb',
            lineHeight: 1.6,
            fontWeight: 500,
            margin: '0 0 16px',
            fontStyle: 'italic',
          }}>
            "{dailyQuote.quote}"
          </blockquote>

          <div style={{ color: '#ff7e5f', fontSize: 14, fontWeight: 600, marginBottom: 20 }}>
            — {dailyQuote.author}
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <button
              onClick={e => { e.stopPropagation(); shuffleQuote() }}
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <RefreshCw size={14} /> New Quote
            </button>
            <button
              onClick={e => { e.stopPropagation(); copyQuote() }}
              className="btn-ghost"
              style={{ padding: '8px 16px', fontSize: 13, display: 'flex', alignItems: 'center', gap: 6 }}
            >
              <Share2 size={14} /> {copied ? 'Copied!' : 'Copy Quote'}
            </button>
          </div>
        </div>
      </button>

      {/* ── Daily Action Tip ─────────────────────────────── */}
      <button
        type="button"
        onClick={() => setActiveInsight('tip')}
        aria-pressed={activeInsight === 'tip'}
        className="info-tip"
        style={{
          width: '100%',
          textAlign: 'left',
          borderRadius: '0 10px 10px 0',
          marginBottom: 32,
          padding: '20px 24px',
          cursor: 'pointer',
          border: activeInsight === 'tip' ? '1px solid #5cb885' : undefined,
        }}
      >
        <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#5cb885', letterSpacing: '0.04em', marginBottom: 8 }}>
          Today's Action Step
        </div>
        <p style={{ color: '#c8e8d4', fontSize: 15, lineHeight: 1.7, margin: 0 }}>
          {dailyTip}
        </p>
      </button>

      {/* ── Community Wins / Success Stories ──────────────── */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <Sparkles size={20} color="#ffb347" />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
              Community Wins
            </h3>
          </div>
          <button
            onClick={() => setShowAllStories(!showAllStories)}
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {showAllStories ? 'Show Less' : 'See All'} <ChevronRight size={12} style={{ transform: showAllStories ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))', gap: 16 }}>
          {todayStories.map((story, i) => (
            <div
              key={i}
              style={{
                background: 'rgba(26,31,40,0.85)',
                border: '1px solid #3d4e65',
                borderRadius: 14,
                padding: '24px',
                position: 'relative',
                overflow: 'hidden',
              }}
            >
              {/* Accent */}
              <div style={{
                position: 'absolute', top: 0, left: 0, right: 0, height: 3,
                background: 'linear-gradient(90deg, #ff7e5f, #ffb347)',
              }} />

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                <div>
                  <div style={{ color: '#f5f0eb', fontSize: 16, fontWeight: 600 }}>{story.name}</div>
                  <div style={{ color: '#888', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4, marginTop: 2 }}>
                    <MapPin size={10} /> {story.market}
                  </div>
                </div>
                <div style={{
                  textAlign: 'right',
                  background: 'rgba(244,126,95,0.12)',
                  border: '1px solid rgba(244,126,95,0.2)',
                  borderRadius: 10,
                  padding: '6px 12px',
                }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.03em', lineHeight: 1.1 }}>
                    {story.metric}
                  </div>
                  <div style={{ color: '#888', fontSize: 10 }}>{story.metricLabel}</div>
                </div>
              </div>

              <p style={{ color: '#bbb', fontSize: 13, lineHeight: 1.6, margin: '0 0 12px' }}>
                {story.story}
              </p>

              <div style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 12px',
                borderRadius: 8,
                background: 'rgba(92,184,133,0.08)',
                border: '1px solid rgba(92,184,133,0.15)',
              }}>
                <Heart size={12} color="#5cb885" />
                <span style={{ color: '#5cb885', fontSize: 12, fontStyle: 'italic' }}>
                  "{story.tip}"
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── Stats Row ────────────────────────────────────── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(180px, 1fr))', gap: 16, marginBottom: 32 }}>
        {STAT_CARDS.map(card => {
          const Icon = card.icon
          const value = card.id === 'streak' ? streak : card.id === 'quotes' ? MOTIVATIONAL_QUOTES.length : DAILY_TIPS.length
          const isActive = activeInsight === card.id
          return (
            <button
              key={card.id}
              type="button"
              onClick={() => setActiveInsight(card.id)}
              aria-pressed={isActive}
              className="resource-card"
              style={{
                borderRadius: 10,
                padding: '20px 24px',
                textAlign: 'center',
                cursor: 'pointer',
                border: isActive ? `1px solid ${card.color}` : '1px solid #3d4e65',
                background: isActive ? 'rgba(244,126,95,0.06)' : 'rgba(26,31,40,0.8)',
                transition: 'all 0.2s ease',
              }}
            >
              <Icon size={24} color={card.color} style={{ marginBottom: 8 }} />
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: card.color, letterSpacing: '0.04em' }}>
                {value}
              </div>
              <div style={{ color: '#888', fontSize: 13 }}>{card.label}</div>
              <div style={{ color: '#555', fontSize: 11, marginTop: 4 }}>{card.helper}</div>
            </button>
          )
        })}
      </div>

      {/* ── More Quotes Grid ─────────────────────────────── */}
      <div style={{ marginBottom: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
            More Motivation
          </h3>
          <button
            onClick={() => setShowAllQuotes(!showAllQuotes)}
            className="btn-ghost"
            style={{ padding: '6px 14px', fontSize: 12, display: 'flex', alignItems: 'center', gap: 4 }}
          >
            {showAllQuotes ? 'Show Less' : 'View All'} <ChevronRight size={12} style={{ transform: showAllQuotes ? 'rotate(90deg)' : 'none', transition: 'transform 0.2s' }} />
          </button>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 16 }}>
          {activeLibraryQuotes.map((q, i) => (
            <button
              key={`${q.quote}-${i}`}
              type="button"
              onClick={() => setActiveInsight(`library-${i}`)}
              aria-pressed={activeInsight === `library-${i}`}
              className="resource-card"
              style={{
                borderRadius: 10,
                padding: '20px 24px',
                textAlign: 'left',
                cursor: 'pointer',
                border: activeInsight === `library-${i}` ? '1px solid rgba(244,126,95,0.35)' : '1px solid #3d4e65',
                background: activeInsight === `library-${i}` ? 'rgba(244,126,95,0.06)' : 'rgba(26,31,40,0.8)',
              }}
            >
              <span className="badge" style={{
                background: q.category === 'Strategy' ? 'rgba(244,126,95,0.2)' : q.category === 'Growth' ? 'rgba(45,184,133,0.2)' : q.category === 'Action' ? 'rgba(232,179,71,0.2)' : 'rgba(42,106,173,0.2)',
                color: q.category === 'Strategy' ? '#ff7e5f' : q.category === 'Growth' ? '#5cb885' : q.category === 'Action' ? '#ffb347' : '#5a9ad6',
                marginBottom: 12, display: 'inline-block',
              }}>
                {q.category}
              </span>
              <p style={{ color: '#ccc', fontSize: 14, lineHeight: 1.6, margin: '0 0 10px', fontStyle: 'italic' }}>
                "{q.quote}"
              </p>
              <div style={{ color: '#888', fontSize: 12 }}>— {q.author}</div>
            </button>
          ))}
        </div>
      </div>

      {/* ── Insight Panel ────────────────────────────────── */}
      <div
        className="resource-card"
        style={{
          marginTop: 24,
          borderRadius: 12,
          border: '1px solid #3d4e65',
          background: 'rgba(26,31,40,0.85)',
          padding: '20px 22px',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <Flame size={16} color="#ff7e5f" />
          <div style={{ color: '#ff7e5f', fontSize: 14, fontWeight: 600 }}>{insightTitle}</div>
        </div>
        <p style={{ color: '#d0cdc9', fontSize: 14, lineHeight: 1.7, margin: 0 }}>{insightDescription}</p>
      </div>
    </div>
  )
}

/* ─── Constants (after helpers so they can reference nothing external) ─── */

const STAT_CARDS = [
  {
    id: 'streak',
    label: 'Day Streak',
    helper: 'Consecutive days visited',
    icon: Trophy,
    color: '#ff7e5f',
    detailTitle: 'Consistency Streak',
    detail: 'Momentum compounds in wholesaling. A daily visit keeps scripts, follow-up cadence, and lead discipline top of mind so execution stays sharp.',
  },
  {
    id: 'quotes',
    label: 'Quotes',
    helper: 'Rotates daily',
    icon: Target,
    color: '#ffb347',
    detailTitle: 'Mindset Library',
    detail: 'These quotes are built around core wholesaling priorities: consistent outreach, strong numbers, and reliable follow-up. Use one as your focus for today.',
  },
  {
    id: 'tips',
    label: 'Daily Action Tips',
    helper: 'Actionable steps',
    icon: Zap,
    color: '#5cb885',
    detailTitle: 'Execution Checklist',
    detail: 'Action beats intention. Daily tips are designed to generate pipeline activity that can convert into contracts over the next several weeks.',
  },
] as const
