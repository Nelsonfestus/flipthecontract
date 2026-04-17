import { useState } from 'react'
import { ChevronLeft, ChevronRight, CheckCircle, Clock } from 'lucide-react'

function getDates(count = 14) {
  const days: Date[] = []
  const now = new Date()
  for (let i = 1; i <= count; i++) {
    const d = new Date(now)
    d.setDate(now.getDate() + i)
    const dow = d.getDay()
    if (dow !== 0 && dow !== 6) days.push(d) // weekdays only
    if (days.length >= 10) break
  }
  return days
}

const TIME_SLOTS = [
  '9:00 AM', '10:00 AM', '11:00 AM',
  '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
]

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']
const MONTH_NAMES = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']

export default function BookingCall() {
  const dates = getDates()
  const [selectedDate, setSelectedDate] = useState<Date | null>(null)
  const [selectedTime, setSelectedTime] = useState<string | null>(null)
  const [dateOffset, setDateOffset] = useState(0)
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: '' })
  const [submitted, setSubmitted] = useState(false)

  const visibleDates = dates.slice(dateOffset, dateOffset + 5)

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedDate || !selectedTime) return
    setSubmitted(true)
  }

  if (submitted) {
    return (
      <div>
        <h2 className="section-header">1-on-1 Call Booking</h2>
        <div style={{
          textAlign: 'center', padding: '60px 20px',
          background: '#263040', border: '1px solid #3d4e65',
          borderRadius: 12, marginTop: 24,
        }}>
          <CheckCircle size={56} color="#5cb885" style={{ margin: '0 auto 16px' }} />
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885', letterSpacing: '0.04em' }}>
            Call Booked Successfully!
          </h3>
          <p style={{ color: '#aaa', fontSize: 14, marginBottom: 8 }}>
            {selectedDate && `${DAY_NAMES[selectedDate.getDay()]}, ${MONTH_NAMES[selectedDate.getMonth()]} ${selectedDate.getDate()}`} at {selectedTime}
          </p>
          <p style={{ color: '#888', fontSize: 13 }}>
            A confirmation will be sent to <strong style={{ color: '#f5f0eb' }}>{form.email}</strong>
          </p>
          <button
            className="btn-ghost"
            style={{ marginTop: 24 }}
            onClick={() => { setSubmitted(false); setSelectedDate(null); setSelectedTime(null); setForm({ name:'',email:'',phone:'',topic:'' }) }}
          >
            Book Another Call
          </button>
        </div>
      </div>
    )
  }

  return (
    <div>
      <h2 className="section-header">1-on-1 Call Booking</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Book a private 30-minute coaching call. Available Monday–Friday, 9 AM – 4 PM Eastern. All times shown in EST.
      </p>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(min(100%, 300px), 1fr))', gap: 24, alignItems: 'start' }}>
        {/* Left: Calendar + time slots */}
        <div>
          {/* Date strip */}
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 20, marginBottom: 16 }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 16 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', letterSpacing: '0.04em', margin: 0 }}>
                SELECT DATE
              </h3>
              <div style={{ display: 'flex', gap: 8 }}>
                <button
                  onClick={() => setDateOffset(Math.max(0, dateOffset - 5))}
                  disabled={dateOffset === 0}
                  style={{
                    background: 'none', border: '1px solid #3d4e65', borderRadius: 6,
                    padding: '4px 8px', cursor: 'pointer', color: dateOffset === 0 ? '#444' : '#888',
                  }}
                >
                  <ChevronLeft size={16} />
                </button>
                <button
                  onClick={() => setDateOffset(Math.min(dates.length - 5, dateOffset + 5))}
                  disabled={dateOffset + 5 >= dates.length}
                  style={{
                    background: 'none', border: '1px solid #3d4e65', borderRadius: 6,
                    padding: '4px 8px', cursor: 'pointer', color: dateOffset + 5 >= dates.length ? '#444' : '#888',
                  }}
                >
                  <ChevronRight size={16} />
                </button>
              </div>
            </div>
            <div style={{ display: 'flex', gap: 8, overflowX: 'auto' }}>
              {visibleDates.map(d => {
                const isSelected = selectedDate?.toDateString() === d.toDateString()
                return (
                  <div
                    key={d.toISOString()}
                    className={`date-pill${isSelected ? ' selected' : ''}`}
                    onClick={() => { setSelectedDate(d); setSelectedTime(null) }}
                  >
                    <div style={{ fontSize: 11, fontWeight: 600, marginBottom: 2 }}>{DAY_NAMES[d.getDay()]}</div>
                    <div style={{ fontSize: 18, fontFamily: "'Bebas Neue', sans-serif", letterSpacing: '0.04em' }}>{d.getDate()}</div>
                    <div style={{ fontSize: 11, color: isSelected ? '#000' : '#888' }}>{MONTH_NAMES[d.getMonth()]}</div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Time slots */}
          {selectedDate && (
            <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 20 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
                SELECT TIME — {DAY_NAMES[selectedDate.getDay()]}, {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()}
              </h3>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(100px, 1fr))', gap: 8 }}>
                {TIME_SLOTS.map(t => (
                  <div
                    key={t}
                    className={`time-slot${selectedTime === t ? ' selected' : ''}`}
                    onClick={() => setSelectedTime(t)}
                    style={{ display: 'flex', alignItems: 'center', gap: 6 }}
                  >
                    <Clock size={12} style={{ opacity: 0.6 }} />
                    {t}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right: form */}
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 20 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 16 }}>
            YOUR DETAILS
          </h3>

          {selectedDate && selectedTime && (
            <div style={{
              background: 'rgba(244,126,95,0.08)', border: '1px solid rgba(244,126,95,0.2)',
              borderRadius: 6, padding: '10px 12px', marginBottom: 16, fontSize: 13, color: '#f5f0eb',
            }}>
              📅 {DAY_NAMES[selectedDate.getDay()]}, {MONTH_NAMES[selectedDate.getMonth()]} {selectedDate.getDate()} at {selectedTime} EST
            </div>
          )}

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Full Name *</label>
              <input className="input-dark" placeholder="John Smith" required
                value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Email Address *</label>
              <input className="input-dark" type="email" placeholder="john@example.com" required
                value={form.email} onChange={e => setForm({...form, email: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>Phone Number</label>
              <input className="input-dark" type="tel" placeholder="(555) 000-0000"
                value={form.phone} onChange={e => setForm({...form, phone: e.target.value})} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: 12, color: '#888', marginBottom: 4 }}>What would you like to discuss?</label>
              <textarea
                className="input-dark"
                placeholder="e.g., How to find my first deal, offer calculation, building a buyer's list..."
                rows={4}
                value={form.topic}
                onChange={e => setForm({...form, topic: e.target.value})}
                style={{ resize: 'vertical' }}
              />
            </div>
            <button
              type="submit"
              className="btn-orange"
              disabled={!selectedDate || !selectedTime}
              style={{
                justifyContent: 'center', width: '100%',
                opacity: (!selectedDate || !selectedTime) ? 0.4 : 1,
                cursor: (!selectedDate || !selectedTime) ? 'not-allowed' : 'pointer',
              }}
            >
              {!selectedDate ? 'Select a Date First' : !selectedTime ? 'Select a Time First' : 'Confirm Booking'}
            </button>
          </form>
        </div>
      </div>
    </div>
  )
}
