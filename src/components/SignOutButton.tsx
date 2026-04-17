import { useState } from 'react'
import { LogOut } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'

export function SignOutButton() {
  const { user, signOut } = useAuth()
  const [hover, setHover] = useState(false)

  if (!user) return null

  return (
    <button
      onClick={signOut}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
      aria-label="Sign out"
      style={{
        position: 'fixed',
        bottom: 24,
        left: 24,
        zIndex: 9998,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        padding: '10px 18px',
        borderRadius: 12,
        background: hover ? 'rgba(244,126,95,0.15)' : 'rgba(18,22,28,0.95)',
        border: hover ? '1px solid rgba(244,126,95,0.4)' : '1px solid #3d4e65',
        color: hover ? '#ff7e5f' : '#9a918a',
        cursor: 'pointer',
        fontFamily: "'DM Sans', sans-serif",
        fontSize: 13,
        fontWeight: 500,
        backdropFilter: 'blur(12px)',
        boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
        transition: 'all 0.2s ease',
      }}
    >
      <LogOut size={14} />
      Sign Out
    </button>
  )
}
