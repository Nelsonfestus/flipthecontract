import { HeadContent, Link, Scripts, createRootRoute } from '@tanstack/react-router'
import { ChatWidget } from '@/components/ChatWidget'
import { DealTicker } from '@/components/DealTicker'
import { ShootingStars } from '@/components/ShootingStars'
import { SignOutButton } from '@/components/SignOutButton'
import { MobileBottomNav } from '@/components/MobileBottomNav'
import { ToastContainer } from '@/lib/toast'
import '../styles.css'

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1, viewport-fit=cover' },
      { title: 'Flip the Contract | #1 Wholesale Real Estate Platform — 50 States, 21 Sections, 250+ Tools' },
      { name: 'description', content: 'The most comprehensive wholesale real estate platform. 50-state contracts (purchase, assignment, double close, LOI), hedge fund buyer lists, marketing templates, funding sources, ARV/NOI calculators, skip trace tools, sales scripts, and 21 sections of premium resources. Start closing deals today.' },
      { name: 'keywords', content: 'wholesale real estate, assignment contracts, double close agreement, letter of intent, cash buyers, skip tracing, real estate investing, flip contracts, hedge fund buyers, ARV calculator, wholesale deals, marketing templates, transactional funding, hard money lenders, wholesale checklist' },
      { property: 'og:title', content: 'Flip the Contract | #1 Wholesale Real Estate Platform — 50 States, 250+ Tools' },
      { property: 'og:description', content: 'The most comprehensive wholesale real estate platform with 21 resource sections, 50-state contracts, hedge fund buyer lists, marketing templates, funding sources, and premium tools for serious investors.' },
      { property: 'og:type', content: 'website' },
      { name: 'twitter:card', content: 'summary_large_image' },
      { name: 'twitter:title', content: 'Flip the Contract | #1 Wholesale Real Estate Platform' },
      { name: 'twitter:description', content: 'Access 21 sections of premium wholesale real estate tools — 50-state contracts, buyer lists, marketing templates, funding sources, and more.' },
      { name: 'theme-color', content: '#ff7e5f' },
      { name: 'robots', content: 'index, follow' },
      { name: 'apple-mobile-web-app-capable', content: 'yes' },
      { name: 'apple-mobile-web-app-status-bar-style', content: 'black-translucent' },
      { property: 'og:site_name', content: 'Flip the Contract' },
      { property: 'og:locale', content: 'en_US' },
      { name: 'author', content: 'Flip the Contract LLC' },
    ],
    links: [
      { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
      { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossOrigin: 'anonymous' },
      {
        rel: 'stylesheet',
        href: 'https://fonts.googleapis.com/css2?family=Bebas+Neue&family=DM+Sans:wght@300;400;500;600;700&family=Courier+Prime:ital,wght@0,400;0,700;1,400&display=swap',
      },
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' },
    ],
  }),
  notFoundComponent: NotFound,
  shellComponent: RootDocument,
})

function NotFound() {
  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#12161c',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '2rem',
      }}
    >
      <div style={{ textAlign: 'center', maxWidth: '480px', width: '100%' }}>
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '64px',
            height: '64px',
            borderRadius: '16px',
            background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
            marginBottom: '2rem',
          }}
        >
          <span
            style={{
              fontFamily: "'Bebas Neue', sans-serif",
              fontSize: '1.75rem',
              color: '#fff',
              letterSpacing: '0.05em',
              lineHeight: 1,
            }}
          >
            FTC
          </span>
        </div>

        <h1
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: 'clamp(6rem, 15vw, 10rem)',
            lineHeight: 1,
            margin: '0 0 0.5rem',
            background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
          }}
        >
          404
        </h1>

        <h2
          style={{
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.75rem',
            color: '#f5f0eb',
            margin: '0 0 1rem',
            letterSpacing: '0.05em',
          }}
        >
          Page Not Found
        </h2>

        <p
          style={{
            color: '#a09890',
            fontSize: '1rem',
            lineHeight: 1.6,
            margin: '0 0 2.5rem',
          }}
        >
          The page you are looking for does not exist or has been moved.
        </p>

        <Link
          to="/"
          style={{
            display: 'inline-block',
            padding: '0.875rem 2.5rem',
            background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
            color: '#fff',
            fontFamily: "'Bebas Neue', sans-serif",
            fontSize: '1.25rem',
            letterSpacing: '0.05em',
            borderRadius: '8px',
            textDecoration: 'none',
            transition: 'opacity 0.2s',
          }}
        >
          Back to Hub
        </Link>
      </div>
    </div>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <DealTicker />
        <ShootingStars />
        {children}
        <SignOutButton />
        <ChatWidget />
        <ToastContainer />
        <MobileBottomNav />
        <Scripts />
      </body>
    </html>
  )
}
