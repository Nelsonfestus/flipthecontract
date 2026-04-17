import { useState } from 'react'
import { ShoppingCart, MapPin, CheckCircle, Zap, Shield, Users } from 'lucide-react'

const STATES = [
  'Alabama', 'Arizona', 'Arkansas', 'California', 'Colorado', 'Connecticut', 'Florida', 'Georgia',
  'Idaho', 'Illinois', 'Indiana', 'Iowa', 'Kansas', 'Kentucky', 'Louisiana', 'Maine', 'Maryland',
  'Massachusetts', 'Michigan', 'Minnesota', 'Mississippi', 'Missouri', 'Montana', 'Nebraska',
  'Nevada', 'New Hampshire', 'New Jersey', 'New Mexico', 'New York', 'North Carolina', 'Ohio',
  'Oklahoma', 'Oregon', 'Pennsylvania', 'Rhode Island', 'South Carolina', 'Tennessee', 'Texas',
  'Utah', 'Virginia', 'Washington', 'West Virginia', 'Wisconsin', 'Wyoming',
]

const PRICING = [
  { leads: 50, price: 25, perLead: '0.50', popular: false },
  { leads: 130, price: 45, perLead: '0.35', popular: true },
  { leads: 800, price: 80, perLead: '0.10', popular: false },
]

export default function BuyLeads() {
  const [selectedState, setSelectedState] = useState('')
  const [city, setCity] = useState('')
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null)

  return (
    <div>
      <h2 className="section-header">Buy Wholesale Leads</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Get motivated seller leads delivered to your inbox. Select your state and city, choose a package, and start closing deals.
      </p>
      <div className="info-warn" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#d4a574', margin: 0 }}>
          <strong>Important:</strong> Leads are generated from public records, pre-foreclosure filings, probate records, tax liens, and absentee owner data. Leads are refreshed weekly and are non-exclusive.
        </p>
      </div>

      {/* Benefits */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16, marginBottom: 32 }}>
        {[
          { icon: Zap, title: 'Fresh Data', desc: 'Leads updated weekly from county records' },
          { icon: Shield, title: 'Verified Info', desc: 'Skip-traced with phone & email' },
          { icon: Users, title: 'Motivated Sellers', desc: 'Pre-foreclosure, probate, tax lien, absentee' },
          { icon: MapPin, title: 'Your Market', desc: 'Filtered by your state and city' },
        ].map(item => (
          <div key={item.title} className="resource-card" style={{ borderRadius: 10, padding: 16, textAlign: 'center' }}>
            <item.icon size={24} color="#ff7e5f" style={{ marginBottom: 8 }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 4 }}>
              {item.title}
            </div>
            <div style={{ fontSize: 12, color: '#888' }}>{item.desc}</div>
          </div>
        ))}
      </div>

      {/* Location Selection */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
          1. Select Your Market
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>State</label>
            <select
              className="input-dark"
              value={selectedState}
              onChange={e => setSelectedState(e.target.value)}
              style={{ cursor: 'pointer' }}
            >
              <option value="">Select a state...</option>
              {STATES.map(s => (
                <option key={s} value={s}>{s}</option>
              ))}
            </select>
          </div>
          <div>
            <label style={{ display: 'block', fontSize: 13, color: '#888', marginBottom: 6 }}>City (optional)</label>
            <input
              className="input-dark"
              placeholder="e.g. Houston, Atlanta, Phoenix..."
              value={city}
              onChange={e => setCity(e.target.value)}
            />
          </div>
        </div>
      </div>

      {/* Pricing Tiers */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24, marginBottom: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
          2. Choose Your Package
        </h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
          {PRICING.map(plan => (
            <div
              key={plan.leads}
              onClick={() => setSelectedPlan(plan.leads)}
              style={{
                background: selectedPlan === plan.leads ? 'rgba(244,126,95,0.1)' : '#12161c',
                border: selectedPlan === plan.leads ? '2px solid #ff7e5f' : plan.popular ? '2px solid #ffb347' : '1px solid #3d4e65',
                borderRadius: 10,
                padding: 24,
                cursor: 'pointer',
                transition: 'all 0.2s',
                position: 'relative',
                textAlign: 'center',
              }}
            >
              {plan.popular && (
                <span className="badge badge-gold" style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%)' }}>
                  Most Popular
                </span>
              )}
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 42, color: '#ff7e5f', letterSpacing: '0.04em' }}>
                ${plan.price}
              </div>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', marginBottom: 8 }}>
                {plan.leads} Leads
              </div>
              <div style={{ fontSize: 13, color: '#888', marginBottom: 12 }}>
                ${plan.perLead} per lead
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left' }}>
                {['Name & address', 'Phone numbers', 'Email addresses', 'Property details', 'Motivation indicators'].map(f => (
                  <div key={f} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa' }}>
                    <CheckCircle size={12} color="#5cb885" /> {f}
                  </div>
                ))}
              </div>
              {selectedPlan === plan.leads && (
                <div style={{ marginTop: 12 }}>
                  <CheckCircle size={20} color="#ff7e5f" />
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Checkout */}
      <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 16px' }}>
          3. Complete Your Order
        </h3>
        {selectedState && selectedPlan ? (
          <div>
            <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#888' }}>Market:</span>
                <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>
                  {city ? `${city}, ${selectedState}` : selectedState}
                </span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                <span style={{ fontSize: 13, color: '#888' }}>Package:</span>
                <span style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>
                  {selectedPlan} Leads
                </span>
              </div>
              <div style={{ borderTop: '1px solid #3d4e65', paddingTop: 8, display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ fontSize: 15, color: '#f5f0eb', fontWeight: 700 }}>Total:</span>
                <span style={{ fontSize: 15, color: '#ff7e5f', fontWeight: 700 }}>
                  ${PRICING.find(p => p.leads === selectedPlan)?.price}
                </span>
              </div>
            </div>
            <a
              href="https://www.paypal.com/webapps/billing/plans/subscribe"
              target="_blank"
              rel="noopener noreferrer"
              className="btn-orange"
              style={{ width: '100%', justifyContent: 'center', textDecoration: 'none', display: 'flex' }}
            >
              <ShoppingCart size={16} /> Purchase Leads with PayPal
            </a>
            <p style={{ fontSize: 11, color: '#555', textAlign: 'center', marginTop: 8 }}>
              Leads delivered via email within 24 hours of purchase
            </p>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '20px 0', color: '#555', fontSize: 14 }}>
            {!selectedState ? 'Please select a state above' : 'Please select a package above'}
          </div>
        )}
      </div>
    </div>
  )
}
