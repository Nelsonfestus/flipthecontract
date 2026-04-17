import { useState, useRef, useEffect, useCallback } from 'react'

interface Message {
  role: 'user' | 'assistant'
  content: string
}

export function ChatWidget() {
  const [isOpen, setIsOpen] = useState(false)
  const [messages, setMessages] = useState<Message[]>([])
  const [input, setInput] = useState('')
  const [isStreaming, setIsStreaming] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [])

  useEffect(() => {
    scrollToBottom()
  }, [messages, scrollToBottom])

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto'
      textareaRef.current.style.height = Math.min(textareaRef.current.scrollHeight, 120) + 'px'
    }
  }, [input])

  const sendMessage = async () => {
    const trimmed = input.trim()
    if (!trimmed || isStreaming) return

    const userMessage: Message = { role: 'user', content: trimmed }
    const updatedMessages = [...messages, userMessage]
    setMessages(updatedMessages)
    setInput('')
    setIsStreaming(true)

    // Add empty assistant message placeholder
    setMessages(prev => [...prev, { role: 'assistant', content: '' }])

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: updatedMessages }),
      })

      if (!res.ok) {
        throw new Error(`Server error: ${res.status}`)
      }

      const reader = res.body?.getReader()
      if (!reader) throw new Error('No reader available')

      const decoder = new TextDecoder()
      let assistantContent = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        assistantContent += decoder.decode(value, { stream: true })
        setMessages(prev => {
          const updated = [...prev]
          updated[updated.length - 1] = { role: 'assistant', content: assistantContent }
          return updated
        })
      }
    } catch (err) {
      console.error('Chat error:', err)
      setMessages(prev => {
        const updated = [...prev]
        updated[updated.length - 1] = {
          role: 'assistant',
          content: 'Sorry, something went wrong. Please try again.',
        }
        return updated
      })
    } finally {
      setIsStreaming(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      sendMessage()
    }
  }

  return (
    <>
      {/* Floating toggle button */}
      <button
        onClick={() => setIsOpen(prev => !prev)}
        aria-label={isOpen ? 'Close chat' : 'Open chat assistant'}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          zIndex: 9999,
          width: '56px',
          height: '56px',
          borderRadius: '50%',
          background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
          color: '#000',
          border: 'none',
          cursor: 'pointer',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxShadow: '0 4px 20px rgba(255,126,95,0.4)',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
        }}
        onMouseEnter={e => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1.08)'
        }}
        onMouseLeave={e => {
          ;(e.currentTarget as HTMLElement).style.transform = 'scale(1)'
        }}
      >
        {isOpen ? (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="18" y1="6" x2="6" y2="18" />
            <line x1="6" y1="6" x2="18" y2="18" />
          </svg>
        ) : (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat panel */}
      {isOpen && (
        <div
          style={{
            position: 'fixed',
            bottom: '88px',
            right: '20px',
            zIndex: 9998,
            width: 'min(400px, calc(100vw - 40px))',
            height: 'min(550px, calc(100dvh - 120px))',
            background: 'var(--color-bg-2, #263040)',
            border: '1px solid var(--color-border, #3d4e65)',
            borderRadius: '16px',
            display: 'flex',
            flexDirection: 'column',
            overflow: 'hidden',
            boxShadow: '0 20px 60px rgba(0,0,0,0.5)',
            animation: 'chatSlideUp 0.25s ease-out',
          }}
        >
          {/* Header */}
          <div
            style={{
              padding: '14px 18px',
              background: 'linear-gradient(135deg, rgba(255,126,95,0.15), rgba(232,104,48,0.08))',
              borderBottom: '1px solid var(--color-border, #3d4e65)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: '36px',
                height: '36px',
                borderRadius: '10px',
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif",
                fontSize: '14px',
                color: '#000',
                fontWeight: 700,
                letterSpacing: '0.04em',
              }}
            >
              FTC
            </div>
            <div>
              <div
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: '16px',
                  letterSpacing: '0.06em',
                  color: 'var(--color-text, #f5f0eb)',
                }}
              >
                Wholesale Assistant
              </div>
              <div
                style={{
                  fontSize: '11px',
                  color: 'var(--color-muted, #9a918a)',
                }}
              >
                Ask anything about wholesale real estate
              </div>
            </div>
          </div>

          {/* Messages area */}
          <div
            style={{
              flex: 1,
              overflowY: 'auto',
              padding: '16px',
              display: 'flex',
              flexDirection: 'column',
              gap: '12px',
            }}
          >
            {messages.length === 0 && (
              <div
                style={{
                  textAlign: 'center',
                  padding: '32px 16px',
                  color: 'var(--color-muted, #9a918a)',
                  fontSize: '13px',
                  lineHeight: '1.6',
                }}
              >
                <div style={{ fontSize: '28px', marginBottom: '12px' }}>&#x1F3E0;</div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: '18px', letterSpacing: '0.06em', color: 'var(--color-text, #f5f0eb)', marginBottom: '6px' }}>
                  Welcome to FTC Chat
                </div>
                <div>
                  Ask about contracts, deal analysis,<br />
                  finding buyers, or any wholesale topic.
                </div>
              </div>
            )}

            {messages.map((msg, i) => (
              <div
                key={i}
                style={{
                  display: 'flex',
                  justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
                }}
              >
                <div
                  style={{
                    maxWidth: '85%',
                    padding: '10px 14px',
                    borderRadius: msg.role === 'user' ? '14px 14px 4px 14px' : '14px 14px 14px 4px',
                    background:
                      msg.role === 'user'
                        ? 'linear-gradient(135deg, #ff7e5f, #e86830)'
                        : 'var(--color-bg-3, #2e3a4d)',
                    color: msg.role === 'user' ? '#000' : 'var(--color-text, #f5f0eb)',
                    fontSize: '14px',
                    lineHeight: '1.55',
                    fontWeight: msg.role === 'user' ? 500 : 400,
                    whiteSpace: 'pre-wrap',
                    wordBreak: 'break-word',
                  }}
                >
                  {msg.content}
                  {msg.role === 'assistant' && msg.content === '' && isStreaming && (
                    <span style={{ opacity: 0.5 }}>Thinking...</span>
                  )}
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>

          {/* Input area */}
          <div
            style={{
              padding: '12px 14px',
              borderTop: '1px solid var(--color-border, #3d4e65)',
              background: 'var(--color-bg, #12161c)',
              display: 'flex',
              gap: '8px',
              alignItems: 'flex-end',
              flexShrink: 0,
            }}
          >
            <textarea
              ref={textareaRef}
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Ask about wholesaling..."
              rows={1}
              style={{
                flex: 1,
                resize: 'none',
                background: 'var(--color-bg-2, #263040)',
                border: '1px solid var(--color-border, #3d4e65)',
                borderRadius: '12px',
                padding: '10px 14px',
                color: 'var(--color-text, #f5f0eb)',
                fontSize: '14px',
                fontFamily: "'DM Sans', sans-serif",
                lineHeight: '1.4',
                outline: 'none',
                maxHeight: '120px',
              }}
              onFocus={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-orange, #ff7e5f)'
              }}
              onBlur={e => {
                ;(e.currentTarget as HTMLElement).style.borderColor = 'var(--color-border, #3d4e65)'
              }}
            />
            <button
              onClick={sendMessage}
              disabled={isStreaming || !input.trim()}
              aria-label="Send message"
              style={{
                width: '40px',
                height: '40px',
                borderRadius: '12px',
                background:
                  isStreaming || !input.trim()
                    ? 'var(--color-bg-3, #2e3a4d)'
                    : 'linear-gradient(135deg, #ff7e5f, #e86830)',
                color: isStreaming || !input.trim() ? 'var(--color-muted, #9a918a)' : '#000',
                border: 'none',
                cursor: isStreaming || !input.trim() ? 'not-allowed' : 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                transition: 'background 0.2s ease',
              }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="22" y1="2" x2="11" y2="13" />
                <polygon points="22 2 15 22 11 13 2 9 22 2" />
              </svg>
            </button>
          </div>
        </div>
      )}

      {/* Animation keyframe injected via style tag */}
      <style>{`
        @keyframes chatSlideUp {
          from {
            opacity: 0;
            transform: translateY(16px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
      `}</style>
    </>
  )
}
