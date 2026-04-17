import { createFileRoute, Link } from '@tanstack/react-router'
import { useState, useEffect, useCallback } from 'react'
import { Home, Plus, X, MessageCircle, Trophy, PartyPopper, ThumbsUp, DollarSign, MapPin, User, Clock, Loader2, HelpCircle, ChevronDown, LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import GlobalSearch from '@/components/GlobalSearch'

interface CommunityPost {
  id: string
  type: 'question' | 'deal-closing'
  authorName: string
  title: string
  body: string
  dealAmount?: string
  location?: string
  createdAt: string
  reactions: number
}

export const Route = createFileRoute('/community')({
  component: CommunityPage,
})

function timeAgo(dateStr: string): string {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  if (minutes < 1) return 'Just now'
  if (minutes < 60) return `${minutes}m ago`
  const hours = Math.floor(minutes / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days < 7) return `${days}d ago`
  return new Date(dateStr).toLocaleDateString()
}

function CommunityPage() {
  const { user, signOut } = useAuth()
  const [posts, setPosts] = useState<CommunityPost[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState<'all' | 'question' | 'deal-closing'>('all')
  const [showForm, setShowForm] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')
  const [reactedPosts, setReactedPosts] = useState<Set<string>>(new Set())

  // Form state
  const [form, setForm] = useState({
    type: 'question' as 'question' | 'deal-closing',
    authorName: '',
    title: '',
    body: '',
    dealAmount: '',
    location: '',
  })

  const fetchPosts = useCallback(async () => {
    try {
      const url = filter === 'all' ? '/api/community' : `/api/community?type=${filter}`
      const res = await fetch(url)
      const data = await res.json()
      setPosts(data.posts || [])
    } catch {
      console.error('Failed to fetch community posts')
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    setLoading(true)
    fetchPosts()
  }, [fetchPosts])

  // Load reacted posts from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('ftc_reacted_posts')
      if (stored) setReactedPosts(new Set(JSON.parse(stored)))
    } catch { /* ignore */ }
  }, [])

  async function handleReact(postId: string) {
    if (reactedPosts.has(postId)) return

    try {
      const res = await fetch(`/api/community?id=${postId}`, { method: 'PATCH' })
      const data = await res.json()
      if (res.ok) {
        setPosts(prev => prev.map(p => p.id === postId ? { ...p, reactions: data.post.reactions } : p))
        const updated = new Set(reactedPosts)
        updated.add(postId)
        setReactedPosts(updated)
        localStorage.setItem('ftc_reacted_posts', JSON.stringify([...updated]))
      }
    } catch { /* ignore */ }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)

    try {
      const res = await fetch('/api/community', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error || 'Failed to create post')
        return
      }
      setPosts(prev => [data.post, ...prev])
      setShowForm(false)
      setForm({ type: 'question', authorName: '', title: '', body: '', dealAmount: '', location: '' })
    } catch {
      setError('Network error. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  function updateForm(field: string, value: string) {
    setForm(prev => ({ ...prev, [field]: value }))
  }

  const questionCount = posts.filter(p => p.type === 'question').length
  const closingCount = posts.filter(p => p.type === 'deal-closing').length

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent' }}>
      {/* Header */}
      <nav id="sticky-nav" style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(18,22,28,0.92)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(47,58,74,0.6)' }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 60 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: 8, textDecoration: 'none', color: '#9a918a', fontSize: 13 }}>
              <Home size={16} />
              <span style={{ display: 'none' }} className="desktop-nav-text">Back to Hub</span>
            </Link>
            <div style={{ width: 1, height: 20, background: '#3d4e65' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <div style={{
                width: 32, height: 32, borderRadius: 7,
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#000', fontWeight: 700,
              }}>FTC</div>
              <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.06em' }}>
                Community
              </span>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <GlobalSearch />
            {user && (
              <button
                onClick={signOut}
                aria-label="Sign out"
                style={{
                  display: 'flex', alignItems: 'center', gap: 5,
                  padding: '6px 12px', borderRadius: 8,
                  background: 'rgba(255,255,255,0.04)',
                  border: '1px solid #3d4e65',
                  color: '#9a918a', cursor: 'pointer',
                  fontSize: 12, fontFamily: "'DM Sans', sans-serif",
                  transition: 'all 0.2s',
                }}
                onMouseEnter={e => { e.currentTarget.style.background = 'rgba(244,126,95,0.1)'; e.currentTarget.style.borderColor = 'rgba(244,126,95,0.3)'; e.currentTarget.style.color = '#ff7e5f' }}
                onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.color = '#9a918a' }}
              >
                <LogOut size={12} /> Sign Out
              </button>
            )}
            <button
              onClick={() => setShowForm(true)}
              className="btn-orange"
              style={{ padding: '8px 18px', fontSize: 13, borderRadius: 8 }}
            >
              <Plus size={14} /> New Post
            </button>
          </div>
        </div>
      </nav>

      {/* Hero Banner */}
      <section style={{ background: 'transparent', borderBottom: '1px solid #2e3a4d', padding: '36px 20px 32px', position: 'relative', overflow: 'hidden' }}>
        <div className="hero-gradient-mesh" />
        <div style={{ maxWidth: 1200, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12, flexWrap: 'wrap' }}>
            <span className="badge badge-purple" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <MessageCircle size={10} /> Community
            </span>
            <span className="badge badge-gold" style={{ display: 'flex', alignItems: 'center', gap: 4 }}>
              <Trophy size={10} /> Deal Closings
            </span>
          </div>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(28px, 5vw, 48px)',
            color: '#f5f0eb', letterSpacing: '0.03em', margin: '0 0 8px', lineHeight: 1,
          }}>
            FTC Community Board
          </h1>
          <p style={{ color: '#9a918a', fontSize: 'clamp(13px, 1.5vw, 15px)', maxWidth: 600, lineHeight: 1.7, margin: 0 }}>
            Connect with wholesalers, share deal wins, and get answers to your questions.
          </p>
        </div>
      </section>

      {/* Main Content */}
      <main style={{ maxWidth: 800, margin: '0 auto', padding: '28px 20px 48px' }}>
        {/* Community Guidelines */}
        <div className="info-tip" style={{ marginBottom: 24 }}>
          <p style={{ fontSize: 13, margin: 0, lineHeight: 1.6, color: '#8fc9a3' }}>
            <strong>Community Guidelines:</strong> Be respectful, share real experiences, and support fellow wholesalers. No spam, no solicitation, no fake deal closings.
          </p>
        </div>

        {/* Filter tabs */}
        <div style={{ display: 'flex', gap: 8, marginBottom: 24, flexWrap: 'wrap' }}>
          {([
            { key: 'all' as const, label: 'All Posts', count: posts.length },
            { key: 'question' as const, label: 'Questions', count: questionCount, icon: HelpCircle },
            { key: 'deal-closing' as const, label: 'Deal Closings', count: closingCount, icon: Trophy },
          ]).map(tab => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '8px 16px', borderRadius: 10,
                background: filter === tab.key ? 'rgba(244,126,95,0.1)' : 'rgba(255,255,255,0.03)',
                border: filter === tab.key ? '1px solid rgba(244,126,95,0.3)' : '1px solid #3d4e65',
                color: filter === tab.key ? '#ff7e5f' : '#9a918a',
                cursor: 'pointer', fontSize: 13, fontWeight: 500,
                fontFamily: "'DM Sans', sans-serif",
                transition: 'all 0.2s',
              }}
            >
              {tab.icon && <tab.icon size={14} />}
              {tab.label}
              <span style={{
                fontSize: 11, padding: '1px 6px', borderRadius: 6,
                background: filter === tab.key ? 'rgba(244,126,95,0.15)' : 'rgba(255,255,255,0.04)',
              }}>{tab.count}</span>
            </button>
          ))}
        </div>

        {/* Loading Skeletons */}
        {loading && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {[1, 2, 3].map((i) => (
              <div key={i} className="community-post" style={{ background: 'rgba(255,255,255,0.02)', padding: 20, borderRadius: 12, border: '1px solid rgba(255,255,255,0.05)' }}>
                <div style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                  <div style={{ width: 40, height: 40, borderRadius: 8, background: 'rgba(255,255,255,0.05)', animation: 'pulse 1.5s infinite' }} />
                  <div style={{ flex: 1 }}>
                    <div style={{ width: '40%', height: 16, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                    <div style={{ width: '20%', height: 12, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
                  </div>
                </div>
                <div style={{ width: '90%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, marginBottom: 8, animation: 'pulse 1.5s infinite' }} />
                <div style={{ width: '60%', height: 14, background: 'rgba(255,255,255,0.05)', borderRadius: 4, animation: 'pulse 1.5s infinite' }} />
              </div>
            ))}
            <style>{`@keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.5; } }`}</style>
          </div>
        )}

        {/* Empty state */}
        {!loading && posts.length === 0 && (
          <div style={{
            textAlign: 'center', padding: '60px 20px',
            background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
            borderRadius: 16,
          }}>
            <MessageCircle size={48} color="#3d4e65" style={{ margin: '0 auto 16px' }} />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', margin: '0 0 8px' }}>
              No Posts Yet
            </h3>
            <p style={{ color: '#7a7370', fontSize: 14, maxWidth: 400, margin: '0 auto 20px', lineHeight: 1.6 }}>
              Be the first to ask a question or share a deal closing. The community is here to help.
            </p>
            <button onClick={() => setShowForm(true)} className="btn-orange" style={{ fontSize: 15 }}>
              <Plus size={16} /> Create First Post
            </button>
          </div>
        )}

        {/* Posts List */}
        {!loading && posts.length > 0 && (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {posts.map(post => (
              <div
                key={post.id}
                className="resource-card"
                style={{
                  borderRadius: 14, padding: 0, overflow: 'hidden',
                  borderLeft: post.type === 'deal-closing' ? '3px solid #5cb885' : '3px solid #5ba3d9',
                }}
              >
                {/* Deal closing celebration banner */}
                {post.type === 'deal-closing' && (
                  <div style={{
                    background: 'linear-gradient(135deg, rgba(92,184,133,0.1), rgba(255,179,71,0.05))',
                    borderBottom: '1px solid rgba(92,184,133,0.2)',
                    padding: '10px 18px',
                    display: 'flex', alignItems: 'center', gap: 8,
                  }}>
                    <PartyPopper size={16} color="#5cb885" />
                    <span style={{ fontSize: 13, fontWeight: 600, color: '#5cb885' }}>Deal Closing!</span>
                    {post.dealAmount && (
                      <span style={{
                        marginLeft: 'auto', fontSize: 14, fontWeight: 700, color: '#5cb885',
                        display: 'flex', alignItems: 'center', gap: 4,
                      }}>
                        <DollarSign size={14} />{post.dealAmount}
                      </span>
                    )}
                  </div>
                )}

                {/* Question badge */}
                {post.type === 'question' && (
                  <div style={{
                    background: 'rgba(91,163,217,0.06)',
                    borderBottom: '1px solid rgba(91,163,217,0.15)',
                    padding: '8px 18px',
                    display: 'flex', alignItems: 'center', gap: 6,
                  }}>
                    <HelpCircle size={14} color="#5ba3d9" />
                    <span style={{ fontSize: 12, fontWeight: 500, color: '#5ba3d9' }}>Question</span>
                  </div>
                )}

                {/* Post content */}
                <div style={{ padding: '16px 18px' }}>
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 12, marginBottom: 10 }}>
                    <h3 style={{ fontSize: 17, fontWeight: 600, color: '#f5f0eb', margin: 0, lineHeight: 1.3, flex: 1 }}>
                      {post.title}
                    </h3>
                  </div>

                  <p style={{ fontSize: 14, color: '#a09890', lineHeight: 1.7, marginBottom: 14, whiteSpace: 'pre-wrap' }}>
                    {post.body}
                  </p>

                  {post.location && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12, fontSize: 13, color: '#9a918a' }}>
                      <MapPin size={13} color="#ffb347" /> {post.location}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    borderTop: '1px solid #2e3a4d', paddingTop: 12, flexWrap: 'wrap', gap: 8,
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 13, color: '#9a918a' }}>
                        <User size={13} /> {post.authorName}
                      </div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12, color: '#6b6560' }}>
                        <Clock size={11} /> {timeAgo(post.createdAt)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleReact(post.id)}
                      disabled={reactedPosts.has(post.id)}
                      style={{
                        display: 'flex', alignItems: 'center', gap: 6,
                        padding: '6px 14px', borderRadius: 8,
                        background: reactedPosts.has(post.id)
                          ? (post.type === 'deal-closing' ? 'rgba(92,184,133,0.15)' : 'rgba(91,163,217,0.15)')
                          : 'rgba(255,255,255,0.03)',
                        border: reactedPosts.has(post.id)
                          ? (post.type === 'deal-closing' ? '1px solid rgba(92,184,133,0.3)' : '1px solid rgba(91,163,217,0.3)')
                          : '1px solid #3d4e65',
                        color: reactedPosts.has(post.id)
                          ? (post.type === 'deal-closing' ? '#5cb885' : '#5ba3d9')
                          : '#9a918a',
                        cursor: reactedPosts.has(post.id) ? 'default' : 'pointer',
                        fontSize: 13, fontWeight: 500,
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s',
                      }}
                    >
                      {post.type === 'deal-closing' ? (
                        <>{reactedPosts.has(post.id) ? <PartyPopper size={14} /> : <ThumbsUp size={14} />} {post.reactions > 0 ? post.reactions : ''} {post.reactions === 0 ? 'Congrats!' : post.reactions === 1 ? 'Congrats' : 'Congrats'}</>
                      ) : (
                        <>{reactedPosts.has(post.id) ? <ThumbsUp size={14} /> : <ThumbsUp size={14} />} {post.reactions > 0 ? post.reactions : ''} {post.reactions === 0 ? 'Helpful' : 'Helpful'}</>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>

      {/* Post Form Modal */}
      {showForm && (
        <div style={{
          position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.85)', zIndex: 9999,
          display: 'flex', alignItems: 'flex-start', justifyContent: 'center',
          padding: '20px', overflowY: 'auto',
        }}>
          <div className="animate-fade-in-up" style={{
            background: '#263040', border: '1px solid #3d4e65', borderRadius: 16,
            width: '100%', maxWidth: 540, margin: '40px auto',
          }}>
            {/* Modal header */}
            <div style={{
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
              padding: '18px 24px', borderBottom: '1px solid #3d4e65',
            }}>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                New Post
              </h2>
              <button onClick={() => { setShowForm(false); setError('') }} style={{
                background: 'rgba(255,255,255,0.04)', border: '1px solid #3d4e65',
                borderRadius: 8, padding: 6, cursor: 'pointer', color: '#9a918a',
              }}>
                <X size={18} />
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} style={{ padding: '20px 24px' }}>
              {error && (
                <div className="info-warn" style={{ marginBottom: 16, fontSize: 13 }}>
                  {error}
                </div>
              )}

              {/* Post type selector */}
              <div style={{ marginBottom: 18 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 8, letterSpacing: '0.04em' }}>What are you posting?</label>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                  <button
                    type="button"
                    onClick={() => updateForm('type', 'question')}
                    style={{
                      padding: '14px 16px', borderRadius: 10,
                      background: form.type === 'question' ? 'rgba(91,163,217,0.1)' : 'rgba(255,255,255,0.02)',
                      border: form.type === 'question' ? '1px solid rgba(91,163,217,0.4)' : '1px solid #3d4e65',
                      color: form.type === 'question' ? '#5ba3d9' : '#9a918a',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.2s',
                    }}
                  >
                    <HelpCircle size={18} style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Ask a Question</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Get help from the community</div>
                  </button>
                  <button
                    type="button"
                    onClick={() => updateForm('type', 'deal-closing')}
                    style={{
                      padding: '14px 16px', borderRadius: 10,
                      background: form.type === 'deal-closing' ? 'rgba(92,184,133,0.1)' : 'rgba(255,255,255,0.02)',
                      border: form.type === 'deal-closing' ? '1px solid rgba(92,184,133,0.4)' : '1px solid #3d4e65',
                      color: form.type === 'deal-closing' ? '#5cb885' : '#9a918a',
                      cursor: 'pointer', textAlign: 'left',
                      fontFamily: "'DM Sans', sans-serif",
                      transition: 'all 0.2s',
                    }}
                  >
                    <Trophy size={18} style={{ marginBottom: 6 }} />
                    <div style={{ fontSize: 14, fontWeight: 600 }}>Deal Closing</div>
                    <div style={{ fontSize: 11, opacity: 0.7, marginTop: 2 }}>Celebrate your win!</div>
                  </button>
                </div>
              </div>

              {/* Author name */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Your Name *</label>
                <input className="input-dark" placeholder="Your Name" value={form.authorName} onChange={e => updateForm('authorName', e.target.value)} required />
              </div>

              {/* Title */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>
                  {form.type === 'deal-closing' ? 'Deal Title *' : 'Question *'}
                </label>
                <input
                  className="input-dark"
                  placeholder={form.type === 'deal-closing' ? 'e.g., Just closed my first double close!' : 'e.g., How do you handle seller objections about assignment fees?'}
                  value={form.title}
                  onChange={e => updateForm('title', e.target.value)}
                  required
                />
              </div>

              {/* Body */}
              <div style={{ marginBottom: 14 }}>
                <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>
                  {form.type === 'deal-closing' ? 'Tell us about the deal *' : 'Details *'}
                </label>
                <textarea
                  className="input-dark"
                  placeholder={form.type === 'deal-closing'
                    ? 'Share your story — how you found the deal, challenges you overcame, advice for others...'
                    : 'Share a deal win, ask a question, or connect with fellow wholesalers...'}
                  value={form.body}
                  onChange={e => updateForm('body', e.target.value)}
                  required
                  rows={4}
                  style={{ resize: 'vertical', minHeight: 100 }}
                />
              </div>

              {/* Deal-closing specific fields */}
              {form.type === 'deal-closing' && (
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 14 }}>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Assignment Fee / Profit</label>
                    <input className="input-dark" placeholder="15,000" value={form.dealAmount} onChange={e => updateForm('dealAmount', e.target.value)} />
                  </div>
                  <div>
                    <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Location</label>
                    <input className="input-dark" placeholder="Houston, TX" value={form.location} onChange={e => updateForm('location', e.target.value)} />
                  </div>
                </div>
              )}

              {/* Question location */}
              {form.type === 'question' && (
                <div style={{ marginBottom: 14 }}>
                  <label style={{ display: 'block', fontSize: 12, color: '#9a918a', marginBottom: 4 }}>Market / Location (optional)</label>
                  <input className="input-dark" placeholder="e.g., Atlanta, GA" value={form.location} onChange={e => updateForm('location', e.target.value)} />
                </div>
              )}

              <div style={{ display: 'flex', gap: 10, marginTop: 20 }}>
                <button type="button" onClick={() => { setShowForm(false); setError('') }} className="btn-ghost" style={{ flex: 1 }}>
                  Cancel
                </button>
                <button type="submit" className="btn-orange" style={{ flex: 2 }} disabled={submitting}>
                  {submitting ? <><Loader2 size={14} style={{ animation: 'spin 0.8s linear infinite' }} /> Posting...</> : <><Plus size={14} /> Post</>}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Responsive styles */}
      <style>{`
        @media (max-width: 640px) {
          .desktop-nav-text { display: none !important; }
          form div[style*="grid-template-columns: 1fr 1fr"] {
            grid-template-columns: 1fr !important;
          }
        }
        @media (min-width: 641px) {
          .desktop-nav-text { display: inline !important; }
        }
      `}</style>
    </div>
  )
}
