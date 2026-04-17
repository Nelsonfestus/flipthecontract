import { useState, useRef, useEffect, useCallback } from 'react'
import {
  Phone,
  PhoneOff,
  Send,
  RotateCcw,
  Mic,
  User,
  ChevronDown,
  Lightbulb,
  BarChart3,
  MessageSquare,
  Flame,
  Shield,
  Zap,
  Scale,
  Building2,
  RefreshCw,
} from 'lucide-react'

/* ── Scenario Data ── */
interface ScenarioConfig {
  name: string
  icon: React.ComponentType<{ size?: number; className?: string }>
  subtitle: string
  systemPrompt: string
}

const SCENARIOS: Record<string, ScenarioConfig> = {
  cold: {
    name: 'Linda M. — Cold Call Seller',
    icon: Phone,
    subtitle: 'First contact',
    systemPrompt: `You are Linda, a homeowner getting a cold call from a real estate wholesaler. You own a house that needs repairs. You're skeptical but open to listening. You haven't talked to any investors before. Start the call by answering the phone with a brief, slightly suspicious "Hello?" — then react naturally to whatever the wholesaler says. Be realistic: don't give info too easily, ask who they are, ask how they got your number. If they're professional and empathetic, gradually open up.

After each of the user's messages, do TWO things:
1. Reply as Linda in character (keep replies under 3 sentences).
2. On a NEW LINE, write a JSON block like this (no markdown, just raw JSON):
{"score": 7, "good": ["built rapport", "asked open question"], "bad": ["didn't introduce company"], "tip": "Always state your company name early to build trust."}

Score 1-10. Be honest and tough but fair.`,
  },
  objection: {
    name: 'Marcus T. — Full Price Seller',
    icon: Shield,
    subtitle: '"I need full price"',
    systemPrompt: `You are Marcus, a homeowner who wants full retail price for your house. You've had a few showings with agents. A wholesaler is calling you. You're resistant and keep saying you need full price or close to it. You'll push back hard on any low offers. If the wholesaler handles objections well (acknowledges your position, explains the value of a cash offer, asks about timeline/repairs), you slowly consider it.

After each of the user's messages:
1. Reply as Marcus in character (2-3 sentences, skeptical/resistant).
2. On a NEW LINE, write raw JSON:
{"score": 6, "good": ["acknowledged concern"], "bad": ["didn't address the price gap"], "tip": "When they say full price, ask: 'What would make a cash, as-is offer worth considering to you?'"}

Score 1-10.`,
  },
  motivated: {
    name: 'Diane R. — Motivated Seller',
    icon: Flame,
    subtitle: 'Ready to sell fast',
    systemPrompt: `You are Diane, a motivated seller who needs to sell fast (job relocation in 3 weeks). The house needs some work. You're stressed but cooperative. You'll answer questions openly. You're testing whether this wholesaler is professional and trustworthy enough to handle your situation. If they're disorganized or don't ask the right questions (timeline, condition, mortgage, price expectations), you'll lose confidence in them.

After each user message:
1. Reply as Diane (2-3 sentences, stressed but cooperative).
2. On a NEW LINE, raw JSON:
{"score": 8, "good": ["asked about timeline", "showed urgency"], "bad": ["didn't ask about repairs needed"], "tip": "With motivated sellers, always confirm: mortgage balance, timeline, and their asking price — in that order."}

Score 1-10.`,
  },
  probate: {
    name: 'Robert K. — Probate Heir',
    icon: Scale,
    subtitle: 'Inherited property',
    systemPrompt: `You are Robert, who recently inherited a property from your mother who passed away. You live out of state. The property is empty and you're not sure what it's worth. You're grieving and a bit overwhelmed. You need someone you can trust. If the wholesaler is pushy or insensitive, you shut down. If they're empathetic and explain the process clearly, you open up.

After each user message:
1. Reply as Robert (emotional undertone, 2-3 sentences).
2. On a NEW LINE, raw JSON:
{"score": 5, "good": ["expressed condolences"], "bad": ["jumped to price too fast"], "tip": "With probate sellers, never lead with price. Lead with: 'I just want to understand your situation and see if I can help make this easier for you.'"}

Score 1-10.`,
  },
  landlord: {
    name: 'Frank D. — Tired Landlord',
    icon: Building2,
    subtitle: 'Problem tenants',
    systemPrompt: `You are Frank, a landlord with a rental property that has problem tenants who stopped paying rent. You've been dealing with this for 8 months and you're exhausted. You're open to selling but worried about the tenants being in the property during a sale. You'll ask hard questions about how that works. If the wholesaler can't explain the process confidently, you won't trust them.

After each user message:
1. Reply as Frank (frustrated, direct, 2-3 sentences).
2. On a NEW LINE, raw JSON:
{"score": 7, "good": ["validated frustration", "mentioned as-is purchase"], "bad": ["didn't address tenant situation"], "tip": "Tired landlords need to hear: 'We buy with tenants in place. You don't need to deal with the eviction — that becomes our problem.'"}

Score 1-10.`,
  },
  followup: {
    name: 'Sandra W. — 3rd Follow-Up',
    icon: RefreshCw,
    subtitle: '3rd touch',
    systemPrompt: `You are Sandra. A wholesaler has called you twice before. You said you weren't ready both times. Now they're calling again (3rd time). You're slightly more open because your situation has gotten worse (behind on taxes). You might be ready but you don't want to seem desperate. You'll test if they remembered your situation from before.

After each user message:
1. Reply as Sandra (guarded but warming up, 2-3 sentences).
2. On a NEW LINE, raw JSON:
{"score": 6, "good": ["referenced previous conversation"], "bad": ["started with a pitch instead of checking in"], "tip": "On follow-up calls, open with: 'Hey Sandra, it's [name] — I just wanted to check in and see how things are going with the house. Last time we spoke you mentioned [detail]...'"}

Score 1-10.`,
  },
}

/* ── Types ── */
interface Message {
  role: 'user' | 'seller'
  text: string
}

interface Feedback {
  score: number
  good: string[]
  bad: string[]
  tip: string
}

/* ── Component ── */
export default function ScriptCoach() {
  const [scenario, setScenario] = useState('cold')
  const [messages, setMessages] = useState<Message[]>([])
  const [feedback, setFeedback] = useState<Feedback | null>(null)
  const [input, setInput] = useState('')
  const [loading, setLoading] = useState(false)
  const [callStarted, setCallStarted] = useState(false)
  const [conversationHistory, setConversationHistory] = useState<
    Array<{ role: 'user' | 'assistant'; content: string }>
  >([])
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, loading, scrollToBottom])

  const resetChat = useCallback(() => {
    setMessages([])
    setFeedback(null)
    setInput('')
    setCallStarted(false)
    setConversationHistory([])
    setLoading(false)
  }, [])

  const selectScenario = useCallback(
    (id: string) => {
      setScenario(id)
      resetChat()
    },
    [resetChat],
  )

  const parseResponse = useCallback(
    (fullText: string): { sellerReply: string; feedback: Feedback | null } => {
      const jsonMatch = fullText.match(/\{[\s\S]*"score"[\s\S]*\}/)
      let sellerReply = fullText
      let parsedFeedback: Feedback | null = null

      if (jsonMatch) {
        sellerReply = fullText.replace(jsonMatch[0], '').trim()
        try {
          parsedFeedback = JSON.parse(jsonMatch[0])
        } catch {
          // ignore parse errors
        }
      }
      return { sellerReply, feedback: parsedFeedback }
    },
    [],
  )

  const callAPI = useCallback(
    async (
      msgs: Array<{ role: 'user' | 'assistant'; content: string }>,
      systemPrompt: string,
    ): Promise<string> => {
      const res = await fetch('/api/script-coach', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: msgs, systemPrompt }),
      })
      if (!res.ok) throw new Error('API request failed')
      const data = await res.json()
      return data.reply
    },
    [],
  )

  const startCall = useCallback(async () => {
    setCallStarted(true)
    setLoading(true)
    setFeedback(null)

    const newHistory = [{ role: 'user' as const, content: 'START_CALL' }]
    setConversationHistory(newHistory)

    try {
      const systemPrompt =
        SCENARIOS[scenario].systemPrompt +
        '\n\nFor the very first message (START_CALL), just answer the phone naturally as the character. No JSON score needed for this first message.'
      const reply = await callAPI(newHistory, systemPrompt)

      setMessages([{ role: 'seller', text: reply.trim() }])
      setConversationHistory((prev) => [...prev, { role: 'assistant', content: reply }])
    } catch {
      setMessages([
        { role: 'seller', text: "Hello? ... Sorry, having connection issues. Try again." },
      ])
      setCallStarted(false)
      setConversationHistory([])
    }
    setLoading(false)
  }, [scenario, callAPI])

  const sendMessage = useCallback(async () => {
    if (loading) return
    if (!callStarted) {
      startCall()
      return
    }

    const userText = input.trim()
    if (!userText) return

    setInput('')
    setLoading(true)
    setFeedback(null)

    setMessages((prev) => [...prev, { role: 'user', text: userText }])
    const newHistory = [...conversationHistory, { role: 'user' as const, content: userText }]
    setConversationHistory(newHistory)

    try {
      const reply = await callAPI(newHistory, SCENARIOS[scenario].systemPrompt)
      const { sellerReply, feedback: parsedFeedback } = parseResponse(reply)

      setMessages((prev) => [...prev, { role: 'seller', text: sellerReply }])
      setConversationHistory((prev) => [...prev, { role: 'assistant', content: reply }])

      if (parsedFeedback) {
        setFeedback(parsedFeedback)
      }
    } catch {
      setMessages((prev) => [
        ...prev,
        { role: 'seller', text: 'Something went wrong. Try again.' },
      ])
    }
    setLoading(false)
    textareaRef.current?.focus()
  }, [loading, callStarted, input, conversationHistory, scenario, callAPI, parseResponse, startCall])

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === 'Enter' && !e.shiftKey) {
        e.preventDefault()
        sendMessage()
      }
    },
    [sendMessage],
  )

  const config = SCENARIOS[scenario]
  const scoreClass =
    feedback && feedback.score >= 8
      ? 'text-green-400'
      : feedback && feedback.score >= 5
        ? 'text-yellow-400'
        : 'text-red-400'
  const scoreLabel =
    feedback && feedback.score >= 8
      ? 'Strong'
      : feedback && feedback.score >= 5
        ? 'Decent'
        : 'Needs Work'

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <div className="flex items-center gap-3">
          <span
            className="text-xs font-bold tracking-widest px-3 py-1 rounded"
            style={{ background: 'var(--color-orange)', color: 'var(--color-bg)' }}
          >
            FTC
          </span>
          <span className="text-xs tracking-wider" style={{ color: 'var(--color-muted)' }}>
            Script Coach
          </span>
        </div>
        <h2
          className="text-3xl md:text-4xl font-bold tracking-wider leading-tight"
          style={{ fontFamily: "'Bebas Neue', sans-serif" }}
        >
          PRACTICE YOUR SELLER CALLS
        </h2>
        <p className="text-sm" style={{ color: 'var(--color-muted)' }}>
          Pick a scenario, talk to a simulated seller, get graded instantly
        </p>
      </div>

      {/* Scenario Picker */}
      <div>
        <div
          className="text-xs font-bold tracking-widest uppercase mb-3"
          style={{ color: 'var(--color-orange)' }}
        >
          Choose Your Scenario
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
          {Object.entries(SCENARIOS).map(([id, sc]) => {
            const Icon = sc.icon
            const active = scenario === id
            return (
              <button
                key={id}
                onClick={() => selectScenario(id)}
                className="text-left p-3 rounded-lg border transition-all duration-150"
                style={{
                  background: active ? 'rgba(255, 126, 95, 0.08)' : 'var(--color-bg-2)',
                  borderColor: active ? 'var(--color-orange)' : 'var(--color-border)',
                  color: active ? 'var(--color-orange)' : 'var(--color-text)',
                }}
              >
                <Icon size={18} className="mb-1" />
                <div className="text-xs font-semibold leading-tight">
                  {sc.name.split(' — ')[1] || sc.name}
                </div>
                <div className="text-[10px] mt-0.5" style={{ color: 'var(--color-muted)' }}>
                  {sc.subtitle}
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Chat Container */}
      <div
        className="rounded-xl border overflow-hidden"
        style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
      >
        {/* Chat Header */}
        <div
          className="flex items-center justify-between px-4 py-3 border-b"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-full flex items-center justify-center border"
              style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
            >
              <User size={16} />
            </div>
            <div>
              <div className="text-sm font-semibold">{config.name}</div>
              <div className="flex items-center gap-1.5 text-xs" style={{ color: 'var(--color-success)' }}>
                <span
                  className="w-1.5 h-1.5 rounded-full inline-block animate-pulse"
                  style={{ background: 'var(--color-success)' }}
                />
                Live Simulation
              </div>
            </div>
          </div>
          <button
            onClick={resetChat}
            className="text-xs px-3 py-1.5 rounded border transition-colors hover:text-red-400 hover:border-red-400"
            style={{ color: 'var(--color-muted)', borderColor: 'var(--color-border)', background: 'transparent' }}
          >
            <RotateCcw size={12} className="inline mr-1" />
            Reset
          </button>
        </div>

        {/* Messages */}
        <div
          className="px-4 py-5 space-y-4 overflow-y-auto"
          style={{ minHeight: 280, maxHeight: 420, scrollbarWidth: 'thin', scrollbarColor: 'var(--color-border) transparent' }}
        >
          {messages.length === 0 && !loading && (
            <div className="text-center py-12" style={{ color: 'var(--color-muted)' }}>
              <Mic size={36} className="mx-auto mb-3 opacity-50" />
              <p className="text-sm">
                Hit <strong style={{ color: 'var(--color-text)' }}>Start Call</strong> to begin
                your practice session.
              </p>
              <p className="text-xs mt-1">The seller will pick up and you take it from there.</p>
            </div>
          )}

          {messages.map((msg, i) => (
            <div
              key={i}
              className={`flex gap-2.5 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
              style={{ animation: 'fadeUp 0.3s ease' }}
            >
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5 text-xs border"
                style={{
                  background:
                    msg.role === 'user'
                      ? 'rgba(255,126,95,0.12)'
                      : 'var(--color-bg)',
                  borderColor:
                    msg.role === 'user'
                      ? 'rgba(255,126,95,0.3)'
                      : 'var(--color-border)',
                }}
              >
                {msg.role === 'user' ? <Mic size={12} /> : <User size={12} />}
              </div>
              <div className={msg.role === 'user' ? 'text-right' : ''}>
                <div
                  className="text-[10px] tracking-wider uppercase mb-1"
                  style={{
                    color:
                      msg.role === 'user'
                        ? 'var(--color-orange)'
                        : 'var(--color-muted)',
                  }}
                >
                  {msg.role === 'user' ? 'You' : 'Seller'}
                </div>
                <div
                  className="text-sm leading-relaxed px-3.5 py-2.5 rounded-xl max-w-[80%] inline-block text-left"
                  style={{
                    background:
                      msg.role === 'user'
                        ? 'rgba(255,126,95,0.1)'
                        : 'var(--color-bg-3)',
                    border: `1px solid ${
                      msg.role === 'user'
                        ? 'rgba(255,126,95,0.25)'
                        : 'var(--color-border)'
                    }`,
                    borderTopRightRadius: msg.role === 'user' ? '4px' : undefined,
                    borderTopLeftRadius: msg.role === 'seller' ? '4px' : undefined,
                  }}
                >
                  {msg.text}
                </div>
              </div>
            </div>
          ))}

          {loading && (
            <div className="flex gap-2.5">
              <div
                className="w-7 h-7 rounded-full flex items-center justify-center flex-shrink-0 border"
                style={{ background: 'var(--color-bg)', borderColor: 'var(--color-border)' }}
              >
                <User size={12} />
              </div>
              <div>
                <div
                  className="text-[10px] tracking-wider uppercase mb-1"
                  style={{ color: 'var(--color-muted)' }}
                >
                  Seller
                </div>
                <div
                  className="flex items-center gap-1.5 px-3.5 py-3 rounded-xl"
                  style={{
                    background: 'var(--color-bg-3)',
                    border: '1px solid var(--color-border)',
                    borderTopLeftRadius: '4px',
                  }}
                >
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-muted)', animationDelay: '0ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-muted)', animationDelay: '150ms' }} />
                  <span className="w-1.5 h-1.5 rounded-full animate-bounce" style={{ background: 'var(--color-muted)', animationDelay: '300ms' }} />
                </div>
              </div>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Feedback Card */}
        {feedback && (
          <div
            className="mx-4 mb-4 rounded-lg p-4 border"
            style={{
              background: 'rgba(255,126,95,0.04)',
              borderColor: 'rgba(255,126,95,0.2)',
              animation: 'fadeUp 0.3s ease',
            }}
          >
            <div className="flex items-center justify-between mb-3">
              <span
                className="text-[11px] font-bold tracking-widest uppercase"
                style={{ color: 'var(--color-orange)' }}
              >
                <BarChart3 size={12} className="inline mr-1" />
                Response Grade
              </span>
              <span className={`text-xl font-bold ${scoreClass}`} style={{ fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '1px' }}>
                {feedback.score}/10 — {scoreLabel}
              </span>
            </div>

            {feedback.tip && (
              <div className="text-xs leading-relaxed mb-3" style={{ color: 'var(--color-muted)' }}>
                <Lightbulb size={11} className="inline mr-1" style={{ color: 'var(--color-gold)' }} />
                <strong style={{ color: 'var(--color-text)' }}>Coach Tip:</strong> {feedback.tip}
              </div>
            )}

            <div className="flex flex-wrap gap-1.5">
              {feedback.good?.map((g, i) => (
                <span
                  key={`g${i}`}
                  className="text-[11px] px-2 py-0.5 rounded-full border"
                  style={{
                    background: 'rgba(92,184,133,0.1)',
                    color: 'var(--color-success)',
                    borderColor: 'rgba(92,184,133,0.2)',
                  }}
                >
                  + {g}
                </span>
              ))}
              {feedback.bad?.map((b, i) => (
                <span
                  key={`b${i}`}
                  className="text-[11px] px-2 py-0.5 rounded-full border"
                  style={{
                    background: 'rgba(255,79,79,0.1)',
                    color: '#ff6b6b',
                    borderColor: 'rgba(255,79,79,0.2)',
                  }}
                >
                  - {b}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Input Area */}
        <div
          className="flex items-end gap-2.5 px-4 py-3 border-t"
          style={{ background: 'var(--color-bg-3)', borderColor: 'var(--color-border)' }}
        >
          <textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder={
              callStarted
                ? 'Type your response to the seller...'
                : 'Press send to start the call...'
            }
            rows={1}
            className="flex-1 text-sm rounded-lg px-3.5 py-2.5 outline-none resize-none transition-colors"
            style={{
              background: 'var(--color-bg)',
              border: '1px solid var(--color-border)',
              color: 'var(--color-text)',
              minHeight: 44,
              maxHeight: 120,
              lineHeight: '1.5',
            }}
            onFocus={(e) => (e.target.style.borderColor = 'var(--color-orange)')}
            onBlur={(e) => (e.target.style.borderColor = 'var(--color-border)')}
          />
          <button
            onClick={sendMessage}
            disabled={loading}
            className="flex items-center justify-center w-11 h-11 rounded-lg transition-all flex-shrink-0 font-bold"
            style={{
              background: loading ? 'var(--color-border)' : 'var(--color-orange)',
              color: loading ? 'var(--color-muted)' : 'var(--color-bg)',
              cursor: loading ? 'not-allowed' : 'pointer',
            }}
          >
            <Send size={16} />
          </button>
        </div>
      </div>

      {/* Coaching Tips */}
      <div
        className="rounded-xl border p-4"
        style={{ background: 'var(--color-bg-2)', borderColor: 'var(--color-border)' }}
      >
        <div
          className="text-[11px] font-bold tracking-widest uppercase mb-3"
          style={{ color: 'var(--color-orange)' }}
        >
          Quick Coaching Tips
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-2">
          {[
            {
              title: 'Lead with empathy',
              text: "Acknowledge their situation before asking questions.",
            },
            {
              title: "Ask, don't tell",
              text: 'Let the seller talk 70% of the time.',
            },
            {
              title: 'Find the why',
              text: "Always uncover why they're selling — it's your leverage.",
            },
            {
              title: 'Shut up after the offer',
              text: 'Silence is a negotiation tool. Use it.',
            },
          ].map((tip, i) => (
            <div
              key={i}
              className="text-xs p-3 rounded-lg"
              style={{
                background: 'var(--color-bg-3)',
                borderLeft: '2px solid var(--color-orange)',
                lineHeight: '1.5',
              }}
            >
              <strong
                className="block text-[11px] uppercase tracking-wider mb-0.5"
                style={{ color: 'var(--color-text)' }}
              >
                {tip.title}
              </strong>
              <span style={{ color: 'var(--color-muted)' }}>{tip.text}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
