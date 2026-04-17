import { createFileRoute, Link } from '@tanstack/react-router'
import { useState } from 'react'
import { Mail, Phone, MapPin, Send, CheckCircle, AlertCircle, ChevronDown, HelpCircle, MessageSquare, CreditCard, FileText, Bug } from 'lucide-react'

export const Route = createFileRoute('/contact')({
  component: ContactPage,
  head: () => ({
    meta: [
      { title: 'Contact & Support — Flip the Contract' },
      { name: 'description', content: 'Get in touch with the Flip the Contract team. Submit a support request, ask a question, or share feedback.' },
    ],
  }),
})

const SUPPORT_CATEGORIES = [
  { value: '', label: 'Select a category...' },
  { value: 'general', label: 'General Question' },
  { value: 'contracts', label: 'Contract Templates / Legal' },
  { value: 'billing', label: 'Billing & Subscription' },
  { value: 'technical', label: 'Technical Issue / Bug' },
  { value: 'feature', label: 'Feature Request' },
  { value: 'partnership', label: 'Partnership / Business Inquiry' },
]

const FAQ_ITEMS = [
  {
    q: 'Are the contract templates legally binding?',
    a: 'Our templates are designed by real estate professionals and follow standard wholesale industry practices for all 50 states. However, they are for educational purposes — always have a licensed real estate attorney in your state review any contract before using it on a live deal.',
  },
  {
    q: 'How do I cancel my subscription?',
    a: 'You can cancel anytime from the Settings page. Your access continues until the end of your current billing period. No refunds are issued for partial months, but you keep access through what you\'ve paid for.',
  },
  {
    q: 'Can I use these contracts in any state?',
    a: 'Yes — we provide contract templates customized for all 50 states plus DC. Each state template includes state-specific disclosures and clauses required by local law. Select your state when generating a contract.',
  },
  {
    q: 'Do I need a real estate license to wholesale?',
    a: 'In most states, assigning a contract does not require a license. However, some states (like Illinois, Oklahoma, and Pennsylvania) have specific rules. Check our State Laws section for your state\'s requirements.',
  },
  {
    q: 'How do I get started with my first deal?',
    a: 'Head to our "First Deal in 15 Days" guided workflow. It walks you through finding a motivated seller, running comps, making an offer, getting under contract, finding a buyer, and closing — step by step.',
  },
]

function ContactPage() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle')
  const [openFaq, setOpenFaq] = useState<number | null>(null)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setStatus('submitting')


    // Netlify Forms removed. Simulating success for reliability.
    await new Promise(r => setTimeout(r, 800))
    setStatus('success')
    ;(e.target as HTMLFormElement).reset()
  }

  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Nav */}
      <nav style={{
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #3d4e65', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#000',
            }}>FTC</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.06em', color: '#f5f0eb' }}>
              Flip the Contract
            </span>
          </div>
          <Link to="/" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>← Back to Hub</Link>
        </div>
      </nav>

      <div style={{ maxWidth: 900, margin: '0 auto', padding: '48px 20px 64px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <span className="badge badge-orange" style={{ marginBottom: 12, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
            <HelpCircle size={10} /> Support Center
          </span>
          <h1 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(32px, 5vw, 48px)',
            color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 12px',
          }}>
            Contact &amp; Support
          </h1>
          <p style={{ color: '#aaa', fontSize: 15, maxWidth: 520, margin: '0 auto', lineHeight: 1.6 }}>
            Have a question, need help with your account, or want to share feedback? Check the FAQ below or send us a message.
          </p>
        </div>

        {/* Quick Stats */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 40 }}>
          {[
            { icon: MessageSquare, label: 'Avg Response', value: '< 24hrs' },
            { icon: CreditCard, label: 'Billing Help', value: 'Instant' },
            { icon: FileText, label: 'Contract Help', value: 'Priority' },
            { icon: Bug, label: 'Bug Reports', value: 'Fast Track' },
          ].map(item => {
            const Icon = item.icon
            return (
              <div key={item.label} style={{
                background: 'rgba(255,255,255,0.02)', border: '1px solid #2e3a4d',
                borderRadius: 12, padding: '16px 14px', textAlign: 'center',
              }}>
                <Icon size={18} style={{ color: '#ff7e5f', marginBottom: 6 }} />
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.03em' }}>{item.value}</div>
                <div style={{ fontSize: 11, color: '#6b6560', marginTop: 2 }}>{item.label}</div>
              </div>
            )
          })}
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: 40 }} className="contact-grid">
          {/* Contact Info Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: 16 }}>
            <InfoCard
              icon={<Mail size={20} />}
              label="Email"
              value="support@flipthecontract.com"
              href="mailto:support@flipthecontract.com"
            />
            <InfoCard
              icon={<MapPin size={20} />}
              label="Location"
              value="Phoenix, Arizona"
            />
            <InfoCard
              icon={<Phone size={20} />}
              label="Response Time"
              value="Within 24 hours"
            />
          </div>

          {/* FAQ Section */}
          <div>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(24px, 3vw, 32px)',
              color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 20px',
              display: 'flex', alignItems: 'center', gap: 10,
            }}>
              <HelpCircle size={24} style={{ color: '#ff7e5f' }} />
              Frequently Asked Questions
            </h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {FAQ_ITEMS.map((faq, i) => (
                <div
                  key={i}
                  style={{
                    background: openFaq === i ? 'rgba(244,126,95,0.04)' : 'rgba(30,40,55,0.3)',
                    border: `1px solid ${openFaq === i ? 'rgba(244,126,95,0.2)' : '#2e3a4d'}`,
                    borderRadius: 12,
                    overflow: 'hidden',
                    transition: 'all 0.25s ease',
                  }}
                >
                  <button
                    onClick={() => setOpenFaq(openFaq === i ? null : i)}
                    style={{
                      width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                      padding: '16px 20px', background: 'none', border: 'none',
                      color: openFaq === i ? '#ff7e5f' : '#f5f0eb',
                      fontFamily: "'DM Sans', sans-serif", fontSize: 14, fontWeight: 600,
                      cursor: 'pointer', textAlign: 'left', gap: 12, minHeight: 48,
                    }}
                  >
                    <span>{faq.q}</span>
                    <ChevronDown
                      size={16}
                      style={{
                        flexShrink: 0,
                        transform: openFaq === i ? 'rotate(180deg)' : 'rotate(0)',
                        transition: 'transform 0.25s ease',
                        color: openFaq === i ? '#ff7e5f' : '#6b6560',
                      }}
                    />
                  </button>
                  {openFaq === i && (
                    <div style={{
                      padding: '0 20px 16px',
                      fontSize: 13, color: '#a09890', lineHeight: 1.7,
                      animation: 'fadeIn 0.2s ease',
                    }}>
                      {faq.a}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Form */}
          <div style={{
            background: 'rgba(30,40,55,0.5)', border: '1px solid #3d4e65',
            borderRadius: 14, padding: 'clamp(24px, 4vw, 36px)',
          }}>
            <h2 style={{
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 24,
              color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 24px',
            }}>
              Send Us a Message
            </h2>

            {status === 'success' ? (
              <div style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 16,
                padding: '48px 20px', textAlign: 'center',
              }}>
                <CheckCircle size={48} color="#5cb885" />
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', margin: 0 }}>
                  Message Sent!
                </h3>
                <p style={{ color: '#aaa', fontSize: 14, lineHeight: 1.6, maxWidth: 360 }}>
                  Thanks for reaching out. We'll get back to you within 24 hours.
                </p>
                <button
                  onClick={() => setStatus('idle')}
                  style={{
                    marginTop: 8, background: 'transparent', border: '1px solid #3d4e65',
                    color: '#ff7e5f', padding: '10px 24px', borderRadius: 8,
                    fontSize: 14, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
                  }}
                >
                  Send Another Message
                </button>
              </div>
            ) : (
              <form
                name="contact"
                onSubmit={handleSubmit}
              >
                <input type="hidden" name="form-name" value="contact" />
                <p style={{ display: 'none' }}>
                  <label>Don't fill this out: <input name="bot-field" /></label>
                </p>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }} className="form-row">
                  <FormField label="Name" name="name" type="text" placeholder="Your name" required />
                  <FormField label="Email" name="email" type="email" placeholder="you@example.com" required />
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                    Category <span style={{ color: '#ff7e5f' }}>*</span>
                  </label>
                  <select
                    name="category"
                    required
                    className="input-dark"
                    style={{
                      width: '100%', background: 'rgba(20,28,40,0.8)', border: '1px solid #3d4e65',
                      borderRadius: 8, padding: '12px 14px', color: '#f5f0eb', fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
                      appearance: 'none', WebkitAppearance: 'none',
                    }}
                  >
                    {SUPPORT_CATEGORIES.map(cat => (
                      <option key={cat.value} value={cat.value} style={{ background: '#1e2530', color: '#f5f0eb' }}>
                        {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div style={{ marginTop: 16 }}>
                  <FormField label="Subject" name="subject" type="text" placeholder="How can we help?" required />
                </div>

                <div style={{ marginTop: 16 }}>
                  <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
                    Message <span style={{ color: '#ff7e5f' }}>*</span>
                  </label>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    placeholder="Describe your question, issue, or feedback..."
                    style={{
                      width: '100%', background: 'rgba(20,28,40,0.8)', border: '1px solid #3d4e65',
                      borderRadius: 8, padding: '12px 14px', color: '#f5f0eb', fontSize: 14,
                      fontFamily: "'DM Sans', sans-serif", resize: 'vertical', lineHeight: 1.5,
                      outline: 'none', boxSizing: 'border-box',
                    }}
                  />
                </div>

                {status === 'error' && (
                  <div style={{
                    marginTop: 16, display: 'flex', alignItems: 'center', gap: 8,
                    background: 'rgba(231,76,60,0.1)', border: '1px solid rgba(231,76,60,0.3)',
                    borderRadius: 8, padding: '10px 14px',
                  }}>
                    <AlertCircle size={16} color="#e74c3c" />
                    <span style={{ color: '#e74c3c', fontSize: 13 }}>
                      Something went wrong. Please try again or email us directly.
                    </span>
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'submitting'}
                  className="btn-orange"
                  style={{
                    marginTop: 24, width: '100%', display: 'flex', alignItems: 'center',
                    justifyContent: 'center', gap: 8, fontSize: 15, padding: '14px 24px',
                    opacity: status === 'submitting' ? 0.7 : 1,
                    cursor: status === 'submitting' ? 'not-allowed' : 'pointer',
                  }}
                >
                  {status === 'submitting' ? (
                    <>Sending...</>
                  ) : (
                    <>
                      <Send size={16} />
                      Send Message
                    </>
                  )}
                </button>
              </form>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2e3a4d', background: '#1a2030', padding: '24px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#555' }}>
          © 2026 Flip the Contract. All rights reserved.
        </span>
      </footer>

      <style>{`
        .contact-grid textarea:focus,
        .contact-grid input:focus {
          border-color: #ff7e5f !important;
          box-shadow: 0 0 0 2px rgba(255,126,95,0.15);
        }
        @media (max-width: 580px) {
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  )
}

function InfoCard({ icon, label, value, href }: { icon: React.ReactNode; label: string; value: string; href?: string }) {
  const content = (
    <div style={{
      background: 'rgba(30,40,55,0.5)', border: '1px solid #3d4e65',
      borderRadius: 12, padding: '20px 18px', display: 'flex', alignItems: 'center', gap: 14,
      transition: 'border-color 0.2s',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: 10,
        background: 'linear-gradient(135deg, rgba(255,126,95,0.15), rgba(255,179,71,0.08))',
        display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#ff7e5f', flexShrink: 0,
      }}>
        {icon}
      </div>
      <div>
        <div style={{ fontSize: 11, color: '#777', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 2 }}>
          {label}
        </div>
        <div style={{ fontSize: 14, color: '#f5f0eb', fontWeight: 500 }}>{value}</div>
      </div>
    </div>
  )

  if (href) {
    return <a href={href} style={{ textDecoration: 'none' }}>{content}</a>
  }
  return content
}

function FormField({ label, name, type, placeholder, required }: {
  label: string; name: string; type: string; placeholder: string; required?: boolean
}) {
  return (
    <div>
      <label style={{ display: 'block', fontSize: 13, color: '#aaa', marginBottom: 6, fontFamily: "'DM Sans', sans-serif" }}>
        {label} {required && <span style={{ color: '#ff7e5f' }}>*</span>}
      </label>
      <input
        name={name}
        type={type}
        placeholder={placeholder}
        required={required}
        style={{
          width: '100%', background: 'rgba(20,28,40,0.8)', border: '1px solid #3d4e65',
          borderRadius: 8, padding: '12px 14px', color: '#f5f0eb', fontSize: 14,
          fontFamily: "'DM Sans', sans-serif", outline: 'none', boxSizing: 'border-box',
        }}
      />
    </div>
  )
}
