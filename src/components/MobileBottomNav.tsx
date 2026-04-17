import { useState, useEffect } from 'react'
import { Link } from '@tanstack/react-router'
import { Home, FileText, Search, Zap, Users } from 'lucide-react'

const NAV_ITEMS = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/contracts-legal', label: 'Contracts', icon: FileText },
  { to: '/deals', label: 'Find Deals', icon: Search },
  { to: '/tools', label: 'Tools', icon: Zap },
  { to: '/crm', label: 'CRM', icon: Users },
] as const

export function MobileBottomNav() {
  const [activePath, setActivePath] = useState('/')

  useEffect(() => {
    setActivePath(window.location.pathname)
  }, [])

  return (
    <nav
      className="mobile-bottom-nav"
      aria-label="Mobile navigation"
    >
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-around',
          height: 64,
        }}
      >
        {NAV_ITEMS.map((item) => {
          const isActive =
            item.to === '/'
              ? activePath === '/'
              : activePath.startsWith(item.to)
          const Icon = item.icon
          const color = isActive ? '#ff7e5f' : '#6b6560'

          return (
            <Link
              key={item.to}
              to={item.to}
              search={item.to === '/crm' ? { demo: false, from: typeof window !== 'undefined' ? window.location.pathname : '/' } : undefined}
              onClick={() => setActivePath(item.to)}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 4,
                flex: 1,
                height: '100%',
                textDecoration: 'none',
                color,
                transition: 'color 0.2s ease',
              }}
            >
              <Icon size={20} strokeWidth={isActive ? 2.2 : 1.8} />
              <span
                style={{
                  fontFamily: "'Bebas Neue', sans-serif",
                  fontSize: 10,
                  letterSpacing: '0.04em',
                  lineHeight: 1,
                  color,
                }}
              >
                {item.label}
              </span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
