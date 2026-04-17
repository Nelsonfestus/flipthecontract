import { useState, useEffect, useCallback, useMemo } from 'react'
import {
  Bell,
  BellRing,
  Phone,
  Mail,
  MessageSquare,
  Calendar,
  Clock,
  CheckCircle2,
  Plus,
  Filter,
  Trash2,
  StickyNote,
} from 'lucide-react'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export type ActivityType = 'note' | 'call' | 'email' | 'meeting' | 'reminder' | 'system'

export interface Activity {
  id: string
  type: ActivityType
  title: string
  description?: string
  createdAt: string // ISO
}

export interface Reminder {
  id: string
  title: string
  description?: string
  dueAt: string // ISO
  completed: boolean
  createdAt: string // ISO
}

interface FeedState {
  activities: Activity[]
  reminders: Reminder[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const LS_KEY = 'ftc_activity_feed'

const TYPE_META: Record<ActivityType, { icon: React.ComponentType<{ size?: number; style?: React.CSSProperties }>; color: string; label: string }> = {
  note: { icon: StickyNote, color: '#ffb347', label: 'Note' },
  call: { icon: Phone, color: '#5cb885', label: 'Call' },
  email: { icon: Mail, color: '#6aadee', label: 'Email' },
  meeting: { icon: Calendar, color: '#c893e8', label: 'Meeting' },
  reminder: { icon: BellRing, color: '#ff7e5f', label: 'Reminder' },
  system: { icon: Bell, color: '#6b6560', label: 'System' },
}

const ALL_TYPES: ActivityType[] = ['note', 'call', 'email', 'meeting', 'reminder', 'system']

const FILTER_OPTIONS: { value: ActivityType | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  ...ALL_TYPES.map(t => ({ value: t as ActivityType | 'all', label: TYPE_META[t].label })),
]

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function uid(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2, 8)
}

function loadState(): FeedState {
  try {
    const raw = localStorage.getItem(LS_KEY)
    if (raw) return JSON.parse(raw) as FeedState
  } catch { /* ignore */ }
  return { activities: defaultActivities(), reminders: [] }
}

function saveState(state: FeedState) {
  try {
    localStorage.setItem(LS_KEY, JSON.stringify(state))
  } catch { /* ignore */ }
}

function defaultActivities(): Activity[] {
  const now = Date.now()
  return [
    { id: uid(), type: 'system', title: 'New lead added: 123 Main St', createdAt: new Date(now - 2 * 3600000).toISOString() },
    { id: uid(), type: 'system', title: 'Deal moved to Under Contract', description: '456 Oak Ave — buyer confirmed', createdAt: new Date(now - 5 * 3600000).toISOString() },
    { id: uid(), type: 'system', title: 'Contract downloaded for FL property', createdAt: new Date(now - 86400000).toISOString() },
    { id: uid(), type: 'system', title: 'Offer submitted: $85,000', description: '789 Pine Rd — waiting on seller response', createdAt: new Date(now - 2 * 86400000).toISOString() },
    { id: uid(), type: 'call', title: 'Follow-up call with seller', description: 'Left voicemail — call back tomorrow', createdAt: new Date(now - 3 * 86400000).toISOString() },
  ]
}

function relativeTime(iso: string): string {
  const diff = Date.now() - new Date(iso).getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'Just now'
  if (mins < 60) return `${mins}m ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours}h ago`
  const days = Math.floor(hours / 24)
  if (days === 1) return 'Yesterday'
  if (days < 7) return `${days}d ago`
  return new Date(iso).toLocaleDateString()
}

function dueLabel(iso: string): { text: string; overdue: boolean } {
  const diff = new Date(iso).getTime() - Date.now()
  if (diff < 0) {
    const ago = Math.abs(diff)
    const hours = Math.floor(ago / 3600000)
    if (hours < 1) return { text: 'Overdue', overdue: true }
    if (hours < 24) return { text: `Overdue ${hours}h`, overdue: true }
    return { text: `Overdue ${Math.floor(hours / 24)}d`, overdue: true }
  }
  const hours = Math.floor(diff / 3600000)
  if (hours < 1) return { text: `Due in ${Math.max(1, Math.floor(diff / 60000))}m`, overdue: false }
  if (hours < 24) return { text: `Due in ${hours}h`, overdue: false }
  return { text: `Due in ${Math.floor(hours / 24)}d`, overdue: false }
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function TypeBadge({ type }: { type: ActivityType }) {
  const meta = TYPE_META[type]
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: 4,
      fontSize: 10, fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase',
      padding: '2px 8px', borderRadius: 20,
      background: meta.color + '18', color: meta.color,
      fontFamily: "'DM Sans', sans-serif",
    }}>
      {meta.label}
    </span>
  )
}

function ActivityRow({ activity, onDelete }: { activity: Activity; onDelete: (id: string) => void }) {
  const meta = TYPE_META[activity.type]
  const Icon = meta.icon
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '14px 0',
      borderBottom: '1px solid #2e3a4d',
    }}>
      <div style={{
        width: 34, height: 34, borderRadius: 8, flexShrink: 0,
        background: meta.color + '14',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        <Icon size={16} style={{ color: meta.color }} />
      </div>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontSize: 14, color: '#f5f0eb', fontFamily: "'DM Sans', sans-serif", fontWeight: 500 }}>{activity.title}</span>
          <TypeBadge type={activity.type} />
        </div>
        {activity.description && (
          <p style={{ fontSize: 12, color: '#a09890', margin: '4px 0 0', lineHeight: 1.5 }}>{activity.description}</p>
        )}
        <span style={{ fontSize: 11, color: '#6b6560', marginTop: 4, display: 'inline-flex', alignItems: 'center', gap: 4 }}>
          <Clock size={10} /> {relativeTime(activity.createdAt)}
        </span>
      </div>
      <button
        onClick={() => onDelete(activity.id)}
        aria-label="Delete activity"
        style={{
          background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560',
          padding: 4, flexShrink: 0, alignSelf: 'flex-start',
          transition: 'color 0.15s',
        }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ff7e5f' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6b6560' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

function ReminderRow({ reminder, onComplete, onDelete }: { reminder: Reminder; onComplete: (id: string) => void; onDelete: (id: string) => void }) {
  const due = dueLabel(reminder.dueAt)
  return (
    <div style={{
      display: 'flex', gap: 12, padding: '12px 14px',
      background: reminder.completed ? 'rgba(92,184,133,0.06)' : due.overdue ? 'rgba(255,126,95,0.06)' : 'rgba(255,179,71,0.06)',
      borderRadius: 10, border: `1px solid ${reminder.completed ? '#5cb88530' : due.overdue ? '#ff7e5f30' : '#ffb34730'}`,
      marginBottom: 8,
    }}>
      <button
        onClick={() => onComplete(reminder.id)}
        aria-label={reminder.completed ? 'Mark incomplete' : 'Mark complete'}
        style={{ background: 'none', border: 'none', cursor: 'pointer', padding: 0, flexShrink: 0, marginTop: 2 }}
      >
        <CheckCircle2 size={20} style={{ color: reminder.completed ? '#5cb885' : '#6b6560', transition: 'color 0.15s' }} />
      </button>
      <div style={{ flex: 1, minWidth: 0 }}>
        <span style={{
          fontSize: 14, color: reminder.completed ? '#6b6560' : '#f5f0eb',
          fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
          textDecoration: reminder.completed ? 'line-through' : 'none',
        }}>
          {reminder.title}
        </span>
        {reminder.description && (
          <p style={{ fontSize: 12, color: '#a09890', margin: '2px 0 0', lineHeight: 1.4 }}>{reminder.description}</p>
        )}
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
          <span style={{
            fontSize: 10, fontWeight: 700, letterSpacing: '0.04em', textTransform: 'uppercase',
            padding: '2px 8px', borderRadius: 20,
            background: reminder.completed ? '#5cb88518' : due.overdue ? '#ff7e5f22' : '#ffb34718',
            color: reminder.completed ? '#5cb885' : due.overdue ? '#ff7e5f' : '#ffb347',
          }}>
            {reminder.completed ? 'Completed' : due.text}
          </span>
          <span style={{ fontSize: 11, color: '#6b6560' }}>
            {new Date(reminder.dueAt).toLocaleString([], { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
          </span>
        </div>
      </div>
      <button
        onClick={() => onDelete(reminder.id)}
        aria-label="Delete reminder"
        style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#6b6560', padding: 4, flexShrink: 0, alignSelf: 'flex-start', transition: 'color 0.15s' }}
        onMouseEnter={e => { e.currentTarget.style.color = '#ff7e5f' }}
        onMouseLeave={e => { e.currentTarget.style.color = '#6b6560' }}
      >
        <Trash2 size={14} />
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

export default function ActivityFeed() {
  const [state, setState] = useState<FeedState>({ activities: [], reminders: [] })
  const [loaded, setLoaded] = useState(false)
  const [filterType, setFilterType] = useState<ActivityType | 'all'>('all')
  const [showAddForm, setShowAddForm] = useState(false)
  const [showReminderForm, setShowReminderForm] = useState(false)
  const [showFilters, setShowFilters] = useState(false)

  // Form state — activity
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newType, setNewType] = useState<ActivityType>('note')

  // Form state — reminder
  const [remTitle, setRemTitle] = useState('')
  const [remDesc, setRemDesc] = useState('')
  const [remDate, setRemDate] = useState('')
  const [remTime, setRemTime] = useState('')

  // Load from localStorage
  useEffect(() => {
    setState(loadState())
    setLoaded(true)
  }, [])

  // Persist on change
  useEffect(() => {
    if (loaded) saveState(state)
  }, [state, loaded])

  // Refresh relative times every minute
  const [, setTick] = useState(0)
  useEffect(() => {
    const timer = setInterval(() => setTick(t => t + 1), 60000)
    return () => clearInterval(timer)
  }, [])

  // ---- Actions ----

  const addActivity = useCallback(() => {
    if (!newTitle.trim()) return
    const activity: Activity = {
      id: uid(),
      type: newType,
      title: newTitle.trim(),
      description: newDesc.trim() || undefined,
      createdAt: new Date().toISOString(),
    }
    setState(prev => ({ ...prev, activities: [activity, ...prev.activities] }))
    setNewTitle('')
    setNewDesc('')
    setNewType('note')
    setShowAddForm(false)
  }, [newTitle, newDesc, newType])

  const deleteActivity = useCallback((id: string) => {
    setState(prev => ({ ...prev, activities: prev.activities.filter(a => a.id !== id) }))
  }, [])

  const addReminder = useCallback(() => {
    if (!remTitle.trim() || !remDate) return
    const dueAt = new Date(`${remDate}T${remTime || '09:00'}`).toISOString()
    const reminder: Reminder = {
      id: uid(),
      title: remTitle.trim(),
      description: remDesc.trim() || undefined,
      dueAt,
      completed: false,
      createdAt: new Date().toISOString(),
    }
    setState(prev => ({ ...prev, reminders: [reminder, ...prev.reminders] }))
    setRemTitle('')
    setRemDesc('')
    setRemDate('')
    setRemTime('')
    setShowReminderForm(false)
  }, [remTitle, remDesc, remDate, remTime])

  const toggleReminder = useCallback((id: string) => {
    setState(prev => ({
      ...prev,
      reminders: prev.reminders.map(r => r.id === id ? { ...r, completed: !r.completed } : r),
    }))
  }, [])

  const deleteReminder = useCallback((id: string) => {
    setState(prev => ({ ...prev, reminders: prev.reminders.filter(r => r.id !== id) }))
  }, [])

  // ---- Derived data ----

  const filteredActivities = useMemo(() => {
    if (filterType === 'all') return state.activities
    return state.activities.filter(a => a.type === filterType)
  }, [state.activities, filterType])

  const weekStart = useMemo(() => {
    const d = new Date()
    d.setHours(0, 0, 0, 0)
    d.setDate(d.getDate() - d.getDay())
    return d.getTime()
  }, [])

  const thisWeekCount = useMemo(
    () => state.activities.filter(a => new Date(a.createdAt).getTime() >= weekStart).length,
    [state.activities, weekStart],
  )

  const activeReminders = useMemo(
    () => state.reminders.filter(r => !r.completed).length,
    [state.reminders],
  )

  // ---- Render ----

  const inputStyle: React.CSSProperties = {
    width: '100%', padding: '10px 12px', borderRadius: 8,
    border: '1px solid #2e3a4d', background: '#161b24', color: '#f5f0eb',
    fontFamily: "'DM Sans', sans-serif", fontSize: 14, outline: 'none',
    transition: 'border-color 0.15s',
  }

  const labelStyle: React.CSSProperties = {
    display: 'block', fontSize: 11, fontWeight: 600, color: '#a09890',
    letterSpacing: '0.04em', textTransform: 'uppercase' as const,
    marginBottom: 6, fontFamily: "'DM Sans', sans-serif",
  }

  return (
    <div style={{ maxWidth: 720, margin: '0 auto' }}>

      {/* Stats bar */}
      <div style={{
        display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 24,
      }}>
        {[
          { label: 'This Week', value: thisWeekCount, color: '#ff7e5f' },
          { label: 'Total Activities', value: state.activities.length, color: '#ffb347' },
          { label: 'Active Reminders', value: activeReminders, color: '#6aadee' },
        ].map(s => (
          <div key={s.label} style={{
            background: '#1e2530', borderRadius: 12, border: '1px solid #2e3a4d',
            padding: '16px 14px', textAlign: 'center',
          }}>
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: s.color, letterSpacing: '0.02em', lineHeight: 1 }}>
              {s.value}
            </div>
            <div style={{ fontSize: 11, color: '#6b6560', marginTop: 4, letterSpacing: '0.04em', textTransform: 'uppercase', fontFamily: "'DM Sans', sans-serif" }}>
              {s.label}
            </div>
          </div>
        ))}
      </div>

      {/* Action buttons */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        <button
          onClick={() => { setShowAddForm(!showAddForm); setShowReminderForm(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10,
            background: showAddForm ? 'rgba(255,126,95,0.15)' : 'linear-gradient(135deg, #ff7e5f, #e86830)',
            border: showAddForm ? '1px solid #ff7e5f' : 'none',
            color: showAddForm ? '#ff7e5f' : '#000',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <Plus size={15} /> Add Activity
        </button>
        <button
          onClick={() => { setShowReminderForm(!showReminderForm); setShowAddForm(false) }}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10,
            background: showReminderForm ? 'rgba(255,179,71,0.15)' : 'rgba(255,179,71,0.1)',
            border: `1px solid ${showReminderForm ? '#ffb347' : '#ffb34740'}`,
            color: '#ffb347',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 600,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <BellRing size={15} /> Set Reminder
        </button>
        <button
          onClick={() => setShowFilters(!showFilters)}
          style={{
            display: 'flex', alignItems: 'center', gap: 6,
            padding: '10px 16px', borderRadius: 10, marginLeft: 'auto',
            background: showFilters ? 'rgba(106,173,238,0.12)' : 'rgba(255,255,255,0.04)',
            border: `1px solid ${showFilters ? '#6aadee50' : '#2e3a4d'}`,
            color: showFilters ? '#6aadee' : '#a09890',
            fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 500,
            cursor: 'pointer', transition: 'all 0.15s',
          }}
        >
          <Filter size={14} /> Filter
        </button>
      </div>

      {/* Filter chips */}
      {showFilters && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18, padding: '12px 14px', background: '#1e2530', borderRadius: 10, border: '1px solid #2e3a4d' }}>
          {FILTER_OPTIONS.map(opt => (
            <button
              key={opt.value}
              onClick={() => setFilterType(opt.value)}
              style={{
                padding: '6px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
                fontFamily: "'DM Sans', sans-serif", cursor: 'pointer', transition: 'all 0.15s',
                border: filterType === opt.value ? '1px solid #ff7e5f' : '1px solid #2e3a4d',
                background: filterType === opt.value ? 'rgba(255,126,95,0.12)' : 'transparent',
                color: filterType === opt.value ? '#ff7e5f' : '#a09890',
              }}
            >
              {opt.label}
            </button>
          ))}
        </div>
      )}

      {/* Add Activity form */}
      {showAddForm && (
        <div style={{ background: '#1e2530', borderRadius: 12, border: '1px solid #2e3a4d', padding: 18, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 14px' }}>
            New Activity
          </h3>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Type</label>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {ALL_TYPES.filter(t => t !== 'system').map(t => {
                const meta = TYPE_META[t]
                const Icon = meta.icon
                return (
                  <button
                    key={t}
                    onClick={() => setNewType(t)}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 5,
                      padding: '7px 12px', borderRadius: 8, fontSize: 12, fontWeight: 600,
                      fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
                      border: newType === t ? `1px solid ${meta.color}` : '1px solid #2e3a4d',
                      background: newType === t ? meta.color + '18' : 'transparent',
                      color: newType === t ? meta.color : '#a09890',
                      transition: 'all 0.15s',
                    }}
                  >
                    <Icon size={13} /> {meta.label}
                  </button>
                )
              })}
            </div>
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Title</label>
            <input
              value={newTitle}
              onChange={e => setNewTitle(e.target.value)}
              placeholder="e.g. Called seller for 123 Main St"
              style={inputStyle}
              onKeyDown={e => { if (e.key === 'Enter') addActivity() }}
            />
          </div>
          <div style={{ marginBottom: 14 }}>
            <label style={labelStyle}>Description (optional)</label>
            <input
              value={newDesc}
              onChange={e => setNewDesc(e.target.value)}
              placeholder="Add details..."
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={addActivity}
              disabled={!newTitle.trim()}
              style={{
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: newTitle.trim() ? 'linear-gradient(135deg, #ff7e5f, #e86830)' : '#2e3a4d',
                color: newTitle.trim() ? '#000' : '#6b6560',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                cursor: newTitle.trim() ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Add
            </button>
            <button
              onClick={() => setShowAddForm(false)}
              style={{
                padding: '10px 16px', borderRadius: 8,
                background: 'transparent', border: '1px solid #2e3a4d',
                color: '#a09890', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminder form */}
      {showReminderForm && (
        <div style={{ background: '#1e2530', borderRadius: 12, border: '1px solid #2e3a4d', padding: 18, marginBottom: 20 }}>
          <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 14px' }}>
            Set Reminder
          </h3>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Title</label>
            <input
              value={remTitle}
              onChange={e => setRemTitle(e.target.value)}
              placeholder="e.g. Follow up with seller"
              style={inputStyle}
            />
          </div>
          <div style={{ marginBottom: 12 }}>
            <label style={labelStyle}>Description (optional)</label>
            <input
              value={remDesc}
              onChange={e => setRemDesc(e.target.value)}
              placeholder="Add details..."
              style={inputStyle}
            />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 14 }}>
            <div>
              <label style={labelStyle}>Date</label>
              <input
                type="date"
                value={remDate}
                onChange={e => setRemDate(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
            <div>
              <label style={labelStyle}>Time</label>
              <input
                type="time"
                value={remTime}
                onChange={e => setRemTime(e.target.value)}
                style={{ ...inputStyle, colorScheme: 'dark' }}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 8 }}>
            <button
              onClick={addReminder}
              disabled={!remTitle.trim() || !remDate}
              style={{
                padding: '10px 20px', borderRadius: 8, border: 'none',
                background: (remTitle.trim() && remDate) ? 'linear-gradient(135deg, #ffb347, #e89820)' : '#2e3a4d',
                color: (remTitle.trim() && remDate) ? '#000' : '#6b6560',
                fontFamily: "'DM Sans', sans-serif", fontSize: 13, fontWeight: 700,
                cursor: (remTitle.trim() && remDate) ? 'pointer' : 'not-allowed',
                transition: 'all 0.15s',
              }}
            >
              Set Reminder
            </button>
            <button
              onClick={() => setShowReminderForm(false)}
              style={{
                padding: '10px 16px', borderRadius: 8,
                background: 'transparent', border: '1px solid #2e3a4d',
                color: '#a09890', fontFamily: "'DM Sans', sans-serif", fontSize: 13,
                cursor: 'pointer',
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Reminders section */}
      {state.reminders.length > 0 && (
        <div style={{ marginBottom: 28 }}>
          <h3 style={{
            fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb',
            letterSpacing: '0.04em', margin: '0 0 12px',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <BellRing size={18} style={{ color: '#ffb347' }} /> Reminders
          </h3>
          {state.reminders.map(r => (
            <ReminderRow key={r.id} reminder={r} onComplete={toggleReminder} onDelete={deleteReminder} />
          ))}
        </div>
      )}

      {/* Activity timeline */}
      <div>
        <h3 style={{
          fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb',
          letterSpacing: '0.04em', margin: '0 0 4px',
          display: 'flex', alignItems: 'center', gap: 8,
        }}>
          <MessageSquare size={18} style={{ color: '#ff7e5f' }} /> Activity Timeline
          {filterType !== 'all' && (
            <span style={{
              fontSize: 11, fontWeight: 600, padding: '2px 10px', borderRadius: 20,
              background: '#ff7e5f18', color: '#ff7e5f', fontFamily: "'DM Sans', sans-serif",
              textTransform: 'uppercase', letterSpacing: '0.04em',
            }}>
              {TYPE_META[filterType].label}
            </span>
          )}
        </h3>

        {filteredActivities.length === 0 ? (
          <div style={{
            textAlign: 'center', padding: '48px 20px', color: '#6b6560', fontSize: 14,
            fontFamily: "'DM Sans', sans-serif",
          }}>
            <Bell size={32} style={{ color: '#2e3a4d', marginBottom: 12 }} />
            <p style={{ margin: 0 }}>No activities{filterType !== 'all' ? ` of type "${TYPE_META[filterType].label}"` : ''} yet.</p>
            <p style={{ margin: '4px 0 0', fontSize: 12 }}>Add your first activity above to start tracking.</p>
          </div>
        ) : (
          filteredActivities.map(a => (
            <ActivityRow key={a.id} activity={a} onDelete={deleteActivity} />
          ))
        )}
      </div>
    </div>
  )
}
