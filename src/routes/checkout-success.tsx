import { createFileRoute, useNavigate } from '@tanstack/react-router'
import { useEffect, useState } from 'react'
import { CheckCircle, ArrowRight } from 'lucide-react'

export const Route = createFileRoute('/checkout-success')({
  component: CheckoutSuccess,
  head: () => ({
    meta: [
      { title: 'Payment Successful — Flip the Contract' },
      { name: 'robots', content: 'noindex, nofollow' },
    ],
  }),
})

const STORAGE_KEY = 'wre_hub_unlocked'

function CheckoutSuccess() {
  const navigate = useNavigate()
  const [countdown, setCountdown] = useState(5)

  useEffect(() => {
    // Unlock the platform immediately on successful checkout
    localStorage.setItem(STORAGE_KEY, '1')
    // Flag so the main page shows a welcome message
    sessionStorage.setItem('ftc_just_subscribed', '1')
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer)
          navigate({ to: '/' })
          return 0
        }
        return prev - 1
      })
    }, 1000)
    return () => clearInterval(timer)
  }, [navigate])

  return (
    <div style={{
      minHeight: '100vh',
      background: 'transparent',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      padding: 20,
    }}>
      <div style={{
        background: '#263040',
        border: '1px solid #3d4e65',
        borderRadius: 16,
        padding: 'clamp(24px, 5vw, 48px)',
        maxWidth: 520,
        width: '100%',
        textAlign: 'center',
        boxShadow: '0 32px 80px rgba(0,0,0,0.8)',
        animation: 'fadeIn 0.5s ease',
      }}>
        <div style={{
          width: 80,
          height: 80,
          borderRadius: '50%',
          background: 'rgba(45,184,133,0.15)',
          border: '2px solid rgba(45,184,133,0.4)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          margin: '0 auto 24px',
          animation: 'fadeInUp 0.6s ease',
        }}>
          <CheckCircle size={40} color="#5cb885" />
        </div>

        <h1 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 36,
          color: '#5cb885',
          letterSpacing: '0.04em',
          margin: '0 0 12px',
        }}>
          Payment Successful!
        </h1>

        <p style={{
          color: '#aaa',
          fontSize: 15,
          lineHeight: 1.7,
          marginBottom: 8,
        }}>
          Welcome to <strong style={{ color: '#ff7e5f' }}>Flip the Contract</strong>! Your subscription is active and you now have full access to all resources.
        </p>

        <div style={{
          background: 'rgba(45,184,133,0.06)',
          border: '1px solid rgba(45,184,133,0.2)',
          borderRadius: 10,
          padding: '16px 20px',
          margin: '24px 0',
          fontSize: 13,
          color: '#8fc9a3',
          lineHeight: 1.7,
        }}>
          <strong>What's included:</strong>
          <div style={{ marginTop: 8, textAlign: 'left' }}>
            {[
              'State-specific contract templates for all 50 states (PDF + Word)',
              'Hedge fund & institutional cash buyer lists',
              'Full CRM with lead pipeline, deal tracker & smart importer',
              'Sales scripts, skip trace tools & deal checklists',
              'Deal simulators, script coach & first-deal wizard',
              'Calculators, investment analyzers & saved analyses',
              'Property marketplace, community forum & EMD vault',
              '1-on-1 coaching calls & daily motivation',
            ].map(item => (
              <div key={item} style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                <CheckCircle size={12} color="#5cb885" style={{ flexShrink: 0 }} />
                {item}
              </div>
            ))}
          </div>
        </div>

        <p style={{ color: '#666', fontSize: 13, marginBottom: 20 }}>
          A confirmation email with your receipt has been sent to your email. You can manage your subscription anytime through the link in that email.
        </p>

        <button
          onClick={() => navigate({ to: '/' })}
          className="btn-orange"
          style={{ width: '100%', justifyContent: 'center', fontSize: 18, padding: '16px 28px' }}
        >
          Access Your Resources <ArrowRight size={18} />
        </button>

        <p style={{ color: '#555', fontSize: 12, marginTop: 12 }}>
          Redirecting in {countdown} seconds...
        </p>

        <div style={{
          marginTop: 24,
          padding: '12px 16px',
          background: 'rgba(244,126,95,0.06)',
          border: '1px solid rgba(244,126,95,0.15)',
          borderRadius: 8,
          fontSize: 11,
          color: '#888',
        }}>
          Payments are securely processed by Stripe and deposited directly to the business bank account. Your card details are never stored on our servers.
        </div>
      </div>
    </div>
  )
}
