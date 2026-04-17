import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  LogIn, UserPlus, Mail, AlertCircle, Loader2, ChevronLeft,
  Eye, EyeOff, Users, ArrowRight, Shield, Lock, Settings, Key,
} from 'lucide-react'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/login')({
  component: LoginPage,
})

interface IdentityUser {
  id: string
  email: string
  name?: string
  confirmedAt?: string
}

function LoginPage() {
  const navigate = useNavigate()
  const [user, setUser] = useState<IdentityUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [view, setView] = useState<'login' | 'signup' | 'forgot'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [name, setName] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [confirmationSent, setConfirmationSent] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const [codeChecking, setCodeChecking] = useState(false)
  const [codeSuccess, setCodeSuccess] = useState(false)
  const [codeTier, setCodeTier] = useState<'free' | 'full' | null>(null)

  // Check if user is already logged in
  useEffect(() => {
    let cancelled = false
    async function checkAuth() {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!cancelled && session?.user) {
          const u = session.user
          setUser({
            id: u.id,
            email: u.email ?? '',
            name: u.user_metadata?.full_name ?? undefined,
            confirmedAt: u.email_confirmed_at
          })
        }
      } catch {
        // not logged in
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    checkAuth()
    return () => { cancelled = true }
  }, [])

  // If already logged in, show account info
  useEffect(() => {
    if (user && !loading) {
      // User is already logged in — they can navigate from here
    }
  }, [user, loading])

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      if (error) throw error
      if (data.user) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? undefined,
          confirmedAt: data.user.email_confirmed_at
        })
      }
    } catch (err: any) {
      setError(err?.message || 'Login failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            plan: 'free'
          }
        }
      })
      if (error) throw error

      // Automatically grant free-tier access after signup
      try {
        localStorage.setItem('wre_hub_tier', 'free')
      } catch {
        // Non-critical
      }

      if (data.user?.email_confirmed_at) {
        setUser({
          id: data.user.id,
          email: data.user.email ?? '',
          name: data.user.user_metadata?.full_name ?? undefined,
          confirmedAt: data.user.email_confirmed_at
        })
      } else {
        setConfirmationSent(true)
      }
    } catch (err: any) {
      setError(err?.message || 'Signup failed. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleForgotPassword(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSubmitting(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email)
      if (error) throw error
      setResetSent(true)
    } catch (err: any) {
      setError(err?.message || 'Could not send reset email. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut()
    setUser(null)
  }

  async function handleAccessCode(e: React.FormEvent) {
    e.preventDefault()
    setCodeError('')
    setCodeChecking(true)
    try {
      const res = await fetch('/api/validate-access-code', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code: accessCode }),
      })
      const data = await res.json()
      if (data.valid) {
        setCodeSuccess(true)
        setCodeTier(data.tier || null)
        setTimeout(() => {
          navigate({ to: '/' })
        }, 1500)
      } else {
        setCodeError('Invalid access code. Please try again.')
      }
    } catch {
      setCodeError('Something went wrong. Please try again.')
    } finally {
      setCodeChecking(false)
    }
  }

  if (loading) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#ff7e5f" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // Logged-in account hub
  if (user) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ width: '100%', maxWidth: 480 }}>
          <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b6560', fontSize: 13, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }}>
            <ChevronLeft size={16} /> Back to Home
          </Link>

          <div className="animate-fade-in-up" style={{
            background: 'rgba(38,48,64,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20, padding: '40px 32px',
            boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
          }}>
            {/* User avatar */}
            <div style={{ textAlign: 'center', marginBottom: 28 }}>
              <div style={{
                width: 64, height: 64, borderRadius: '50%', margin: '0 auto 14px',
                background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#fff', fontWeight: 700,
                boxShadow: '0 4px 20px rgba(255,126,95,0.3)',
              }}>
                {(user.name || user.email || '?')[0].toUpperCase()}
              </div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 4px' }}>
                Welcome Back{user.name ? `, ${user.name}` : ''}
              </h1>
              <p style={{ color: '#6b6560', fontSize: 13, margin: 0 }}>{user.email}</p>
            </div>

            {/* Quick links */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <Link
                to="/crm"
                search={{ demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' }}
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                  background: 'rgba(255,126,95,0.08)', border: '1px solid rgba(255,126,95,0.2)',
                  borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Users size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>
                    My CRM
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6560' }}>Manage leads, offers & pipeline</span>
                </div>
                <ArrowRight size={18} color="#ff7e5f" />
              </Link>

              <Link
                to="/"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                  background: 'rgba(92,184,133,0.08)', border: '1px solid rgba(92,184,133,0.2)',
                  borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #5cb885, #3d9e6a)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Shield size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>
                    Resource Hub
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6560' }}>Contracts, tools & resources</span>
                </div>
                <ArrowRight size={18} color="#5cb885" />
              </Link>

              <Link
                to="/settings"
                style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                  background: 'rgba(91,163,217,0.08)', border: '1px solid rgba(91,163,217,0.2)',
                  borderRadius: 14, textDecoration: 'none', transition: 'all 0.2s',
                }}
              >
                <div style={{
                  width: 42, height: 42, borderRadius: 10, flexShrink: 0,
                  background: 'linear-gradient(135deg, #5ba3d9, #3d7ab8)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                }}>
                  <Settings size={20} color="#fff" />
                </div>
                <div style={{ flex: 1 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', display: 'block', lineHeight: 1.2 }}>
                    Account Settings
                  </span>
                  <span style={{ fontSize: 12, color: '#6b6560' }}>Email, subscription & preferences</span>
                </div>
                <ArrowRight size={18} color="#5ba3d9" />
              </Link>
            </div>

            {/* Sign out */}
            <div style={{ marginTop: 24, paddingTop: 20, borderTop: '1px solid rgba(61,78,101,0.4)', textAlign: 'center' }}>
              <button
                onClick={handleLogout}
                className="btn-ghost"
                style={{ fontSize: 13, color: '#6b6560' }}
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  // Login / Signup / Forgot password forms
  return (
    <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 440 }}>
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b6560', fontSize: 13, textDecoration: 'none', marginBottom: 28, transition: 'color 0.2s' }}>
          <ChevronLeft size={16} /> Back to Home
        </Link>

        <div className="animate-fade-in-up" style={{
          background: 'rgba(38,48,64,0.7)', backdropFilter: 'blur(16px)', border: '1px solid rgba(61,78,101,0.6)', borderRadius: 20, padding: '36px 32px',
          boxShadow: '0 16px 64px rgba(0,0,0,0.3)',
        }}>
          {/* Logo */}
          <div style={{ textAlign: 'center', marginBottom: 28 }}>
            <div style={{
              width: 56, height: 56, borderRadius: 14, margin: '0 auto 14px',
              background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#000', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(255,126,95,0.3)',
            }}>FTC</div>
            <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 4px' }}>
              {view === 'login' ? 'Welcome Back' : view === 'signup' ? 'Create Your Account' : 'Reset Password'}
            </h1>
            <p style={{ color: '#6b6560', fontSize: 13, margin: 0 }}>
              {view === 'login' ? 'Sign in to access your CRM & resources' : view === 'signup' ? 'Join the #1 wholesale real estate platform' : 'Enter your email to receive a reset link'}
            </p>
          </div>

          {/* Confirmation sent */}
          {confirmationSent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(92,184,133,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Shield size={24} color="#5cb885" />
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#5cb885', margin: '0 0 8px' }}>Free Access Granted!</h2>
              <p style={{ color: '#9a918a', fontSize: 14, lineHeight: 1.6, marginBottom: 12 }}>
                Your free-tier tools are now unlocked. Here is your access code:
              </p>
              <div style={{
                display: 'inline-flex', alignItems: 'center', gap: 10,
                padding: '10px 18px', borderRadius: 10, marginBottom: 12,
                background: 'rgba(92,184,133,0.1)', border: '1px solid rgba(92,184,133,0.3)',
              }}>
                <Key size={16} color="#5cb885" />
                <span style={{
                  fontFamily: 'monospace', fontSize: 18, color: '#5cb885',
                  letterSpacing: '0.1em', fontWeight: 700, userSelect: 'all',
                }}>
                  ftcfree2025
                </span>
              </div>
              <p style={{ color: '#9a918a', fontSize: 13, lineHeight: 1.6 }}>
                A confirmation link was also sent to <strong style={{ color: '#f5f0eb' }}>{email}</strong>. Confirm your email so you can log in anytime.
              </p>
              <button
                onClick={() => { setConfirmationSent(false); setView('login') }}
                className="btn-ghost"
                style={{ marginTop: 20 }}
              >
                Back to Login
              </button>
            </div>
          ) : resetSent ? (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ width: 48, height: 48, borderRadius: '50%', background: 'rgba(91,163,217,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px' }}>
                <Mail size={24} color="#5ba3d9" />
              </div>
              <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: '0 0 8px' }}>Reset Link Sent</h2>
              <p style={{ color: '#9a918a', fontSize: 14, lineHeight: 1.6 }}>
                Check <strong style={{ color: '#f5f0eb' }}>{email}</strong> for a password reset link.
              </p>
              <button
                onClick={() => { setResetSent(false); setView('login') }}
                className="btn-ghost"
                style={{ marginTop: 20 }}
              >
                Back to Login
              </button>
            </div>
          ) : (
            <>
              {/* Tab toggle — only for login/signup */}
              {view !== 'forgot' && (
                <div style={{ display: 'flex', gap: 0, marginBottom: 24, background: '#2e3a4d', borderRadius: 10, padding: 3 }}>
                  <button
                    onClick={() => { setView('login'); setError('') }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      background: view === 'login' ? '#ff7e5f' : 'transparent',
                      color: view === 'login' ? '#000' : '#9a918a',
                      transition: 'all 0.2s',
                    }}
                  >
                    <LogIn size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Log In
                  </button>
                  <button
                    onClick={() => { setView('signup'); setError('') }}
                    style={{
                      flex: 1, padding: '10px 0', borderRadius: 8, border: 'none', cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      background: view === 'signup' ? '#ff7e5f' : 'transparent',
                      color: view === 'signup' ? '#000' : '#9a918a',
                      transition: 'all 0.2s',
                    }}
                  >
                    <UserPlus size={14} style={{ verticalAlign: 'middle', marginRight: 6 }} />
                    Sign Up
                  </button>
                </div>
              )}

              {error && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 8, padding: '10px 14px', marginBottom: 16, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <AlertCircle size={16} color="#ef4444" />
                  <span style={{ color: '#ef4444', fontSize: 13 }}>{error}</span>
                </div>
              )}

              {/* Forgot password form */}
              {view === 'forgot' ? (
                <form onSubmit={handleForgotPassword}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email Address</label>
                    <input
                      className="input-dark"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <button
                    type="submit"
                    className="btn-orange"
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                    Send Reset Link
                  </button>
                  <div style={{ textAlign: 'center', marginTop: 16 }}>
                    <button
                      type="button"
                      onClick={() => { setView('login'); setError('') }}
                      style={{ background: 'none', border: 'none', color: '#5ba3d9', cursor: 'pointer', fontSize: 13, fontFamily: "'DM Sans', sans-serif" }}
                    >
                      Back to Login
                    </button>
                  </div>
                </form>
              ) : (
                /* Login / Signup form */
                <form onSubmit={view === 'login' ? handleLogin : handleSignup}>
                  {view === 'signup' && (
                    <div style={{ marginBottom: 14 }}>
                      <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Full Name</label>
                      <input
                        className="input-dark"
                        type="text"
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  )}
                  <div style={{ marginBottom: 14 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Email</label>
                    <input
                      className="input-dark"
                      type="email"
                      value={email}
                      onChange={e => setEmail(e.target.value)}
                      placeholder="you@example.com"
                      required
                    />
                  </div>
                  <div style={{ marginBottom: 8 }}>
                    <label style={{ display: 'block', fontSize: 12, color: '#6b6560', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.08em' }}>Password</label>
                    <div style={{ position: 'relative' }}>
                      <input
                        className="input-dark"
                        type={showPassword ? 'text' : 'password'}
                        value={password}
                        onChange={e => setPassword(e.target.value)}
                        placeholder="••••••••"
                        minLength={6}
                        required
                        style={{ paddingRight: 44 }}
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        aria-label={showPassword ? 'Hide password' : 'Show password'}
                        style={{
                          position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)',
                          background: 'none', border: 'none', color: '#6b6560', cursor: 'pointer', padding: 4,
                        }}
                      >
                        {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                      </button>
                    </div>
                  </div>

                  {view === 'login' && (
                    <div style={{ textAlign: 'right', marginBottom: 20 }}>
                      <button
                        type="button"
                        onClick={() => { setView('forgot'); setError('') }}
                        style={{ background: 'none', border: 'none', color: '#5ba3d9', cursor: 'pointer', fontSize: 12, fontFamily: "'DM Sans', sans-serif" }}
                      >
                        Forgot password?
                      </button>
                    </div>
                  )}

                  {view === 'signup' && <div style={{ height: 12 }} />}

                  <button
                    type="submit"
                    className="btn-orange"
                    disabled={submitting}
                    style={{ width: '100%', justifyContent: 'center', opacity: submitting ? 0.7 : 1 }}
                  >
                    {submitting && <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} />}
                    {view === 'login' ? 'Log In' : 'Create Account'}
                  </button>
                </form>
              )}

              {/* Benefits for signup */}
              {view === 'signup' && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(61,78,101,0.4)' }}>
                  <p style={{ color: '#6b6560', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>What you get</p>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                    {[
                      { icon: Users, text: 'Full CRM — leads, offers & pipeline' },
                      { icon: Lock, text: '50-state contracts & legal templates' },
                      { icon: Shield, text: '250+ wholesale tools & resources' },
                    ].map((item, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#9a918a', fontSize: 13 }}>
                        <item.icon size={14} color="#ff7e5f" />
                        {item.text}
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {view === 'login' && (
                <div style={{ marginTop: 20, paddingTop: 20, borderTop: '1px solid rgba(61,78,101,0.4)', textAlign: 'center' }}>
                  <p style={{ color: '#6b6560', fontSize: 12, marginBottom: 10 }}>Want to see the CRM in action?</p>
                  <a
                    href="/crm?demo=true"
                    style={{
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                      width: '100%', padding: '12px 0', borderRadius: 10,
                      border: '1px solid rgba(91,163,217,0.3)',
                      background: 'linear-gradient(135deg, rgba(91,163,217,0.12), rgba(91,163,217,0.04))',
                      cursor: 'pointer',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      color: '#5ba3d9', textDecoration: 'none', transition: 'all 0.2s',
                    }}
                  >
                    <Users size={16} />
                    Try CRM Demo — No Sign Up Needed
                    <ArrowRight size={14} />
                  </a>
                </div>
              )}

              {/* Access Code Entry */}
              {view === 'login' && (
                <div style={{ marginTop: 16, paddingTop: 16, borderTop: '1px solid rgba(61,78,101,0.4)' }}>
                  <p style={{ color: '#f5f0eb', marginBottom: 4, textAlign: 'center', fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em', fontSize: 18 }}>Enter Access Code</p>
                  <p style={{ color: '#6b6560', fontSize: 11, marginBottom: 12, textAlign: 'center' }}>
                    Free code = limited access &nbsp;|&nbsp; Paid code = full access
                  </p>
                  {codeSuccess ? (
                    <div style={{ textAlign: 'center', padding: '12px 0' }}>
                      <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'rgba(92,184,133,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 10px' }}>
                        <Shield size={20} color="#5cb885" />
                      </div>
                      <p style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#5cb885', letterSpacing: '0.04em', margin: '0 0 4px' }}>
                        {codeTier === 'full' ? 'Full Access Granted' : 'Free Access Granted'}
                      </p>
                      <p style={{ color: '#9a918a', fontSize: 12 }}>
                        {codeTier === 'full'
                          ? 'All sections unlocked. Redirecting...'
                          : 'Getting Started, Glossary & more unlocked. Redirecting...'}
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleAccessCode} style={{ display: 'flex', gap: 8 }}>
                      <div style={{ position: 'relative', flex: 1 }}>
                        <Key size={14} color="#6b6560" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
                        <input
                          className="input-dark"
                          type="text"
                          value={accessCode}
                          onChange={e => { setAccessCode(e.target.value); setCodeError('') }}
                          placeholder="Free or paid access code"
                          required
                          style={{ paddingLeft: 34, fontSize: 13 }}
                        />
                      </div>
                      <button
                        type="submit"
                        disabled={codeChecking}
                        style={{
                          padding: '10px 18px', borderRadius: 10, border: '1px solid rgba(255,126,95,0.4)',
                          background: 'linear-gradient(135deg, rgba(255,126,95,0.15), rgba(255,126,95,0.05))',
                          color: '#ff7e5f', cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                          fontSize: 13, fontWeight: 600, whiteSpace: 'nowrap', transition: 'all 0.2s',
                          opacity: codeChecking ? 0.7 : 1,
                        }}
                      >
                        {codeChecking ? <Loader2 size={14} style={{ animation: 'spin 1s linear infinite' }} /> : 'Go'}
                      </button>
                    </form>
                  )}
                  {codeError && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 8 }}>
                      <AlertCircle size={13} color="#ef4444" />
                      <span style={{ color: '#ef4444', fontSize: 12 }}>{codeError}</span>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer note */}
        <p style={{ textAlign: 'center', color: '#4a4440', fontSize: 11, marginTop: 24 }}>
          By signing up, you agree to our{' '}
          <Link to="/terms" style={{ color: '#6b6560', textDecoration: 'underline' }}>Terms</Link>{' '}and{' '}
          <Link to="/privacy" style={{ color: '#6b6560', textDecoration: 'underline' }}>Privacy Policy</Link>.
        </p>
      </div>
    </div>
  )
}
