import { createFileRoute, Link, useNavigate } from '@tanstack/react-router'
import { useState, useEffect } from 'react'
import {
  ChevronLeft, Mail, User, CreditCard, Shield, LogOut, Loader2,
  AlertTriangle, Check, KeyRound, Settings, Crown,
} from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { supabase } from '@/lib/supabase'

export const Route = createFileRoute('/settings')({
  component: SettingsPage,
})


interface SubscriptionInfo {
  email: string
  name: string
  status: string
  subscribedAt: string
  cancelledAt?: string
  stripe: {
    status: string
    currentPeriodEnd: string | null
    cancelAtPeriodEnd: boolean
    plan: string
    amount: number
  } | null
}

function SettingsPage() {
  const navigate = useNavigate()
  const { user: authUser, signOut, loading: authLoading } = useAuth()
  const [subscription, setSubscription] = useState<SubscriptionInfo | null>(null)
  const [subLoading, setSubLoading] = useState(false)

  // Section states
  const [editingEmail, setEditingEmail] = useState(false)
  const [newEmail, setNewEmail] = useState('')
  const [editingName, setEditingName] = useState(false)
  const [newName, setNewName] = useState('')
  const [changingPassword, setChangingPassword] = useState(false)

  // Feedback
  const [saving, setSaving] = useState(false)
  const [successMsg, setSuccessMsg] = useState('')
  const [errorMsg, setErrorMsg] = useState('')
  const [showCancelConfirm, setShowCancelConfirm] = useState(false)
  const [cancelling, setCancelling] = useState(false)

  // Fetch subscription info
  useEffect(() => {
    if (!authUser?.email) return
    setSubLoading(true)
    fetch(`/api/account-settings?email=${encodeURIComponent(authUser.email)}`)
      .then(r => r.json())
      .then(data => {
        if (data.subscriber) setSubscription(data.subscriber)
      })
      .catch(() => {})
      .finally(() => setSubLoading(false))
  }, [authUser?.email])

  function flash(msg: string, type: 'success' | 'error') {
    if (type === 'success') {
      setSuccessMsg(msg)
      setErrorMsg('')
      setTimeout(() => setSuccessMsg(''), 4000)
    } else {
      setErrorMsg(msg)
      setSuccessMsg('')
      setTimeout(() => setErrorMsg(''), 5000)
    }
  }

  async function handleUpdateEmail(e: React.FormEvent) {
    e.preventDefault()
    if (!newEmail.trim()) return
    setSaving(true)
    try {
      const res = await fetch('/api/account-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'update-email', email: authUser?.email, newEmail: newEmail.trim() }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to update email')
      flash('Email updated successfully.', 'success')
      setEditingEmail(false)
      setNewEmail('')
    } catch (err: any) {
      flash(err.message || 'Failed to update email', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handleUpdateName(e: React.FormEvent) {
    e.preventDefault()
    if (!newName.trim()) return
    setSaving(true)
    try {
      const { error } = await supabase.auth.updateUser({
        data: { full_name: newName.trim() }
      })
      if (error) throw error
      flash('Name updated successfully.', 'success')
      setEditingName(false)
      setNewName('')
    } catch (err: any) {
      flash(err.message || 'Failed to update name', 'error')
    } finally {
      setSaving(false)
    }
  }

  async function handlePasswordReset() {
    if (!authUser?.email) return
    setChangingPassword(true)
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(authUser.email)
      if (error) throw error
      flash('Password reset email sent. Check your inbox.', 'success')
    } catch (err: any) {
      flash(err.message || 'Could not send password reset email.', 'error')
    } finally {
      setChangingPassword(false)
    }
  }

  async function handleCancelSubscription() {
    setCancelling(true)
    try {
      const res = await fetch('/api/account-settings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'cancel-subscription', email: authUser?.email }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to cancel subscription')
      flash(data.message || 'Subscription cancelled.', 'success')
      setShowCancelConfirm(false)
      // Refresh subscription info
      setSubscription(prev => prev ? { ...prev, status: 'cancelled', cancelledAt: new Date().toISOString() } : prev)
    } catch (err: any) {
      flash(err.message || 'Failed to cancel subscription', 'error')
    } finally {
      setCancelling(false)
    }
  }

  async function handleLogout() {
    await signOut()
    navigate({ to: '/' })
  }

  // ---- Loading spinner ----
  if (authLoading) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <Loader2 size={32} color="#ff7e5f" style={{ animation: 'spin 1s linear infinite' }} />
        <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  // ---- Not logged in ----
  if (!authUser) {
    return (
      <div style={{ minHeight: '100dvh', background: 'transparent', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 20 }}>
        <div style={{ textAlign: 'center', maxWidth: 400 }}>
          <div style={{
            width: 64, height: 64, borderRadius: '50%', margin: '0 auto 20px',
            background: 'rgba(61,78,101,0.4)', display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <Settings size={28} color="#6b6560" />
          </div>
          <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 26, color: '#f5f0eb', margin: '0 0 10px', letterSpacing: '0.04em' }}>
            Sign in to access Settings
          </h2>
          <p style={{ color: '#6b6560', fontSize: 14, margin: '0 0 24px', lineHeight: 1.5 }}>
            Log in to manage your account, subscription, and preferences.
          </p>
          <Link
            to="/login"
            className="btn-orange"
            style={{ display: 'inline-block', padding: '14px 32px', fontSize: 16, textDecoration: 'none' }}
          >
            Sign In
          </Link>
        </div>
      </div>
    )
  }

  // ---- Card style ----
  const cardStyle: React.CSSProperties = {
    background: 'rgba(38,48,64,0.55)', backdropFilter: 'blur(12px)',
    border: '1px solid rgba(61,78,101,0.5)', borderRadius: 16, padding: '24px 24px',
    marginBottom: 16,
  }
  const labelStyle: React.CSSProperties = {
    fontFamily: "'Bebas Neue', sans-serif", fontSize: 13, color: '#6b6560',
    letterSpacing: '0.08em', textTransform: 'uppercase' as const, margin: '0 0 6px', display: 'block',
  }
  const valueStyle: React.CSSProperties = {
    color: '#f5f0eb', fontSize: 15, fontWeight: 500,
  }
  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '12px 14px', background: 'rgba(30,37,48,0.8)',
    border: '1px solid rgba(61,78,101,0.6)', borderRadius: 10, color: '#f5f0eb',
    fontSize: 14, fontFamily: "'DM Sans', sans-serif", outline: 'none',
    transition: 'border-color 0.2s',
  }
  const btnSmall: React.CSSProperties = {
    padding: '8px 16px', fontSize: 13, borderRadius: 8, border: 'none', cursor: 'pointer',
    fontFamily: "'DM Sans', sans-serif", fontWeight: 600, transition: 'all 0.2s',
  }

  const isActive = subscription?.status === 'active'
  const isCancelled = subscription?.status === 'cancelled'
  const pendingCancel = subscription?.stripe?.cancelAtPeriodEnd

  return (
    <div style={{ minHeight: '100dvh', background: 'transparent', padding: '0 16px 80px' }}>
      <div style={{ maxWidth: 560, margin: '0 auto', paddingTop: 24 }}>
        {/* Back link */}
        <Link to="/" style={{ display: 'inline-flex', alignItems: 'center', gap: 6, color: '#6b6560', fontSize: 13, textDecoration: 'none', marginBottom: 24, transition: 'color 0.2s' }}>
          <ChevronLeft size={16} /> Back to Hub
        </Link>

        {/* Header */}
        <div style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 6 }}>
            <div style={{
              width: 52, height: 52, borderRadius: '50%',
              background: 'linear-gradient(135deg, #ff7e5f, #e86830)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#fff', fontWeight: 700,
              boxShadow: '0 4px 16px rgba(255,126,95,0.25)', flexShrink: 0,
            }}>
              {(authUser.name || authUser.email || '?')[0].toUpperCase()}
            </div>
            <div>
              <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0, lineHeight: 1.1 }}>
                Account Settings
              </h1>
              <p style={{ color: '#6b6560', fontSize: 13, margin: '2px 0 0' }}>{authUser.email}</p>
            </div>
          </div>
        </div>

        {/* Feedback messages */}
        {successMsg && (
          <div className="animate-fade-in" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: 'rgba(92,184,133,0.12)', border: '1px solid rgba(92,184,133,0.3)',
            borderRadius: 10, marginBottom: 16, color: '#5cb885', fontSize: 14,
          }}>
            <Check size={16} /> {successMsg}
          </div>
        )}
        {errorMsg && (
          <div className="animate-fade-in" style={{
            display: 'flex', alignItems: 'center', gap: 10, padding: '12px 16px',
            background: 'rgba(220,80,60,0.12)', border: '1px solid rgba(220,80,60,0.3)',
            borderRadius: 10, marginBottom: 16, color: '#dc503c', fontSize: 14,
          }}>
            <AlertTriangle size={16} /> {errorMsg}
          </div>
        )}

        {/* ───────── Profile Section ───────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <User size={18} color="#ff7e5f" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em' }}>
              Profile
            </span>
          </div>

          {/* Name */}
          <div style={{ marginBottom: 18 }}>
            <span style={labelStyle}>Full Name</span>
            {editingName ? (
              <form onSubmit={handleUpdateName} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="text"
                  value={newName}
                  onChange={e => setNewName(e.target.value)}
                  placeholder={authUser.name || 'Enter your name'}
                  style={{ ...inputStyle, flex: 1, minWidth: 180 }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="submit" disabled={saving || !newName.trim()} style={{
                    ...btnSmall, background: 'linear-gradient(135deg, #ff7e5f, #ffb347)', color: '#000',
                    opacity: saving || !newName.trim() ? 0.5 : 1,
                  }}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => { setEditingName(false); setNewName('') }} style={{
                    ...btnSmall, background: 'rgba(61,78,101,0.4)', color: '#afa69e',
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={valueStyle}>{authUser.name || 'Not set'}</span>
                <button onClick={() => { setEditingName(true); setNewName(authUser.name || '') }} style={{
                  ...btnSmall, background: 'rgba(255,126,95,0.1)', color: '#ff7e5f',
                }}>
                  Edit
                </button>
              </div>
            )}
          </div>

          {/* Email */}
          <div>
            <span style={labelStyle}>Email Address</span>
            {editingEmail ? (
              <form onSubmit={handleUpdateEmail} style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
                <input
                  type="email"
                  value={newEmail}
                  onChange={e => setNewEmail(e.target.value)}
                  placeholder={authUser.email}
                  style={{ ...inputStyle, flex: 1, minWidth: 180 }}
                  autoFocus
                />
                <div style={{ display: 'flex', gap: 6 }}>
                  <button type="submit" disabled={saving || !newEmail.trim()} style={{
                    ...btnSmall, background: 'linear-gradient(135deg, #ff7e5f, #ffb347)', color: '#000',
                    opacity: saving || !newEmail.trim() ? 0.5 : 1,
                  }}>
                    {saving ? 'Saving...' : 'Save'}
                  </button>
                  <button type="button" onClick={() => { setEditingEmail(false); setNewEmail('') }} style={{
                    ...btnSmall, background: 'rgba(61,78,101,0.4)', color: '#afa69e',
                  }}>
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <span style={valueStyle}>{authUser.email}</span>
                <button onClick={() => { setEditingEmail(true); setNewEmail(authUser.email) }} style={{
                  ...btnSmall, background: 'rgba(255,126,95,0.1)', color: '#ff7e5f',
                }}>
                  Edit
                </button>
              </div>
            )}
          </div>
        </div>

        {/* ───────── Security Section ───────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Shield size={18} color="#5ba3d9" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em' }}>
              Security
            </span>
          </div>

          {/* Password */}
          <div>
            <span style={labelStyle}>Password</span>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ ...valueStyle, color: '#6b6560' }}>••••••••••</span>
              <button
                onClick={handlePasswordReset}
                disabled={changingPassword}
                style={{
                  ...btnSmall, background: 'rgba(91,163,217,0.1)', color: '#5ba3d9',
                  opacity: changingPassword ? 0.5 : 1,
                  display: 'flex', alignItems: 'center', gap: 6,
                }}
              >
                <KeyRound size={14} />
                {changingPassword ? 'Sending...' : 'Reset Password'}
              </button>
            </div>
            <p style={{ color: '#6b6560', fontSize: 12, margin: '8px 0 0', lineHeight: 1.4 }}>
              A password reset link will be sent to your email address.
            </p>
          </div>
        </div>

        {/* ───────── Subscription Section ───────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <CreditCard size={18} color="#ffb347" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em' }}>
              Subscription & Billing
            </span>
          </div>

          {subLoading ? (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: '#6b6560', fontSize: 14 }}>
              <Loader2 size={16} style={{ animation: 'spin 1s linear infinite' }} /> Loading subscription info...
            </div>
          ) : subscription ? (
            <div>
              {/* Status badge */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
                <div style={{
                  display: 'inline-flex', alignItems: 'center', gap: 6, padding: '6px 14px',
                  borderRadius: 20, fontSize: 13, fontWeight: 600,
                  background: isActive && !pendingCancel
                    ? 'rgba(92,184,133,0.15)'
                    : isCancelled || pendingCancel
                      ? 'rgba(220,80,60,0.12)'
                      : 'rgba(232,164,74,0.12)',
                  color: isActive && !pendingCancel
                    ? '#5cb885'
                    : isCancelled || pendingCancel
                      ? '#dc503c'
                      : '#e8a44a',
                  border: `1px solid ${isActive && !pendingCancel
                    ? 'rgba(92,184,133,0.3)'
                    : isCancelled || pendingCancel
                      ? 'rgba(220,80,60,0.25)'
                      : 'rgba(232,164,74,0.25)'}`,
                }}>
                  <Crown size={14} />
                  {pendingCancel ? 'Cancels at Period End' : isActive ? 'Active' : isCancelled ? 'Cancelled' : subscription.status}
                </div>
              </div>

              {/* Subscription details */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '14px 20px', marginBottom: 18 }}>
                {subscription.stripe && (
                  <>
                    <div>
                      <span style={labelStyle}>Plan</span>
                      <span style={valueStyle}>
                        {subscription.stripe.plan === 'year' ? 'Annual' : 'Monthly'} — ${subscription.stripe.amount}/{subscription.stripe.plan === 'year' ? 'yr' : 'mo'}
                      </span>
                    </div>
                    {subscription.stripe.currentPeriodEnd && (
                      <div>
                        <span style={labelStyle}>
                          {pendingCancel ? 'Access Until' : 'Next Billing'}
                        </span>
                        <span style={valueStyle}>
                          {new Date(subscription.stripe.currentPeriodEnd).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                        </span>
                      </div>
                    )}
                  </>
                )}
                <div>
                  <span style={labelStyle}>Member Since</span>
                  <span style={valueStyle}>
                    {subscription.subscribedAt
                      ? new Date(subscription.subscribedAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
                      : '—'}
                  </span>
                </div>
                {subscription.cancelledAt && (
                  <div>
                    <span style={labelStyle}>Cancelled On</span>
                    <span style={valueStyle}>
                      {new Date(subscription.cancelledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                )}
              </div>

              {/* Cancel button */}
              {isActive && !pendingCancel && (
                <>
                  {!showCancelConfirm ? (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      style={{
                        ...btnSmall, background: 'transparent', color: '#6b6560',
                        border: '1px solid rgba(61,78,101,0.4)', fontSize: 13,
                        display: 'flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      Cancel Subscription
                    </button>
                  ) : (
                    <div className="animate-fade-in" style={{
                      padding: '16px 18px', background: 'rgba(220,80,60,0.08)',
                      border: '1px solid rgba(220,80,60,0.25)', borderRadius: 12,
                    }}>
                      <div style={{ display: 'flex', alignItems: 'flex-start', gap: 10, marginBottom: 14 }}>
                        <AlertTriangle size={18} color="#dc503c" style={{ flexShrink: 0, marginTop: 2 }} />
                        <div>
                          <p style={{ color: '#f5f0eb', fontSize: 14, fontWeight: 600, margin: '0 0 4px' }}>
                            Are you sure you want to cancel?
                          </p>
                          <p style={{ color: '#afa69e', fontSize: 13, margin: 0, lineHeight: 1.5 }}>
                            You will keep access until the end of your current billing period. After that, premium features will be locked.
                          </p>
                        </div>
                      </div>
                      <div style={{ display: 'flex', gap: 8 }}>
                        <button
                          onClick={handleCancelSubscription}
                          disabled={cancelling}
                          style={{
                            ...btnSmall, background: '#dc503c', color: '#fff',
                            opacity: cancelling ? 0.6 : 1,
                          }}
                        >
                          {cancelling ? 'Cancelling...' : 'Yes, Cancel'}
                        </button>
                        <button
                          onClick={() => setShowCancelConfirm(false)}
                          style={{ ...btnSmall, background: 'rgba(61,78,101,0.4)', color: '#afa69e' }}
                        >
                          Keep Subscription
                        </button>
                      </div>
                    </div>
                  )}
                </>
              )}

              {/* Reactivation notice for cancelled subs */}
              {(isCancelled || pendingCancel) && (
                <div style={{
                  padding: '12px 16px', background: 'rgba(91,163,217,0.08)',
                  border: '1px solid rgba(91,163,217,0.2)', borderRadius: 10,
                  color: '#5ba3d9', fontSize: 13, lineHeight: 1.5,
                }}>
                  To reactivate your subscription, visit the <Link to="/" style={{ color: '#ff7e5f', textDecoration: 'underline' }}>Hub</Link> and subscribe again.
                </div>
              )}
            </div>
          ) : (
            <div>
              <p style={{ color: '#6b6560', fontSize: 14, margin: '0 0 14px', lineHeight: 1.5 }}>
                No active subscription found. Subscribe to unlock all premium features.
              </p>
              <Link
                to="/"
                className="btn-orange"
                style={{ display: 'inline-block', padding: '10px 22px', fontSize: 14, textDecoration: 'none' }}
              >
                View Plans
              </Link>
            </div>
          )}
        </div>

        {/* ───────── Notifications Section ───────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 18 }}>
            <Mail size={18} color="#5cb885" />
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em' }}>
              Notifications
            </span>
          </div>

          <NotifToggle label="Deal alerts & new resources" defaultOn={true} storageKey="ftc_notif_deals" />
          <NotifToggle label="Weekly market updates" defaultOn={true} storageKey="ftc_notif_market" />
          <NotifToggle label="Community activity" defaultOn={false} storageKey="ftc_notif_community" />
          <NotifToggle label="Promotional offers" defaultOn={false} storageKey="ftc_notif_promo" />
        </div>

        {/* ───────── Quick Links ───────── */}
        <div style={cardStyle}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            <QuickLink to="/privacy" label="Privacy Policy" />
            <QuickLink to="/terms" label="Terms of Service" />
            <QuickLink to="/faq" label="FAQ" />
            <QuickLink to="/contact" label="Contact Support" />
          </div>
        </div>

        {/* ───────── Sign Out ───────── */}
        <div style={{ textAlign: 'center', marginTop: 8 }}>
          <button
            onClick={handleLogout}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: 8,
              padding: '12px 28px', background: 'rgba(220,80,60,0.1)',
              border: '1px solid rgba(220,80,60,0.2)', borderRadius: 10,
              color: '#dc503c', fontSize: 14, fontWeight: 600,
              fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
              transition: 'all 0.2s',
            }}
          >
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </div>
    </div>
  )
}

/* ─── Notification Toggle ─── */
function NotifToggle({ label, defaultOn, storageKey }: { label: string; defaultOn: boolean; storageKey: string }) {
  const [on, setOn] = useState(() => {
    if (typeof window === 'undefined') return defaultOn
    const stored = localStorage.getItem(storageKey)
    return stored !== null ? stored === '1' : defaultOn
  })

  function toggle() {
    const next = !on
    setOn(next)
    localStorage.setItem(storageKey, next ? '1' : '0')
  }

  return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(61,78,101,0.25)' }}>
      <span style={{ color: '#f5f0eb', fontSize: 14 }}>{label}</span>
      <button
        onClick={toggle}
        aria-label={`Toggle ${label}`}
        style={{
          width: 44, height: 24, borderRadius: 12, border: 'none', cursor: 'pointer',
          background: on ? 'linear-gradient(135deg, #ff7e5f, #ffb347)' : 'rgba(61,78,101,0.5)',
          position: 'relative', transition: 'background 0.25s', flexShrink: 0,
        }}
      >
        <span style={{
          position: 'absolute', top: 3, left: on ? 23 : 3,
          width: 18, height: 18, borderRadius: '50%',
          background: '#fff', transition: 'left 0.25s', boxShadow: '0 1px 4px rgba(0,0,0,0.3)',
        }} />
      </button>
    </div>
  )
}

/* ─── Quick Link ─── */
function QuickLink({ to, label }: { to: string; label: string }) {
  return (
    <Link
      to={to}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        padding: '12px 0', borderBottom: '1px solid rgba(61,78,101,0.25)',
        color: '#afa69e', fontSize: 14, textDecoration: 'none',
        transition: 'color 0.2s',
      }}
    >
      {label}
      <ChevronLeft size={14} style={{ transform: 'rotate(180deg)' }} />
    </Link>
  )
}
