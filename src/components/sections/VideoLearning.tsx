import { useState } from 'react'
import { Play, BookOpen, TrendingUp, DollarSign, Search as SearchIcon, Home } from 'lucide-react'

const CATEGORIES = ['All', 'ARV & Comps', 'Wholesaling Basics', 'Finding Deals', 'Negotiation', 'Closing Deals'] as const
type Category = typeof CATEGORIES[number]

const VIDEOS = [
  {
    title: 'Real Estate Comps & ARV — Top 5 Hacks',
    description: 'Learn the exact method to calculate ARV using comparable sales. This is the foundation of every wholesale deal.',
    embedId: 'HVBd7lWPm5Y',
    category: 'ARV & Comps' as Category,
    duration: '18:32',
  },
  {
    title: 'How To Comp Real Estate Like a Pro',
    description: 'Master the art of running comparable sales analysis. Learn what makes a good comp, how to adjust values, and avoid common mistakes.',
    embedId: 'c6C8QH6U7W0',
    category: 'ARV & Comps' as Category,
    duration: '24:15',
  },
  {
    title: 'How to Comp Real Estate for Beginners',
    description: 'Free tools you can use today to find comparable sales and estimate property values without an MLS license.',
    embedId: 'fWYEpS8JIXM',
    category: 'ARV & Comps' as Category,
    duration: '15:48',
  },
  {
    title: 'How To Start Wholesaling Real Estate for Beginners',
    description: 'Everything you need to know about wholesaling from A to Z — what it is, how it works, and how to get your first deal.',
    embedId: 'spNyBVgsSuc',
    category: 'Wholesaling Basics' as Category,
    duration: '42:10',
  },
  {
    title: 'How an Assignment of Contract Works',
    description: 'Understand the difference between assigning a contract and doing a double close, and when to use each strategy.',
    embedId: '8G9rkCYABmA',
    category: 'Wholesaling Basics' as Category,
    duration: '19:22',
  },
  {
    title: 'How To Find Cash Buyers for Wholesale Deals',
    description: 'Step-by-step guide to building a strong cash buyers list. Learn where to find buyers and how to qualify them.',
    embedId: 'YzWGQJPKv6c',
    category: 'Wholesaling Basics' as Category,
    duration: '21:45',
  },
  {
    title: 'How to Find Real Estate Deals — Driving for Dollars',
    description: 'Learn how to identify distressed, vacant, and motivated seller properties by driving neighborhoods.',
    embedId: 'aZumyy3cwFk',
    category: 'Finding Deals' as Category,
    duration: '16:30',
  },
  {
    title: 'How to Find Motivated Seller Lists with Propstream',
    description: 'Master skip tracing to find owner phone numbers and emails. Essential for direct-to-seller marketing.',
    embedId: '26cvQNhqpag',
    category: 'Finding Deals' as Category,
    duration: '14:55',
  },
  {
    title: 'Fastest Way to Your First Wholesale Deal',
    description: 'Access free and paid sources for pre-foreclosure, probate, and tax lien motivated seller leads.',
    embedId: '5g50aoOd_4k',
    category: 'Finding Deals' as Category,
    duration: '20:18',
  },
  {
    title: 'Cold Calling Script to Make Millions — Wholesaling',
    description: 'Proven cold calling scripts for wholesalers. Learn how to handle objections and build rapport with sellers.',
    embedId: 'Jhj_SEN2vgA',
    category: 'Negotiation' as Category,
    duration: '28:40',
  },
  {
    title: 'Wholesale Real Estate: 8 Dos and Don\'ts',
    description: 'Advanced negotiation techniques and best practices to get properties under contract at the right price.',
    embedId: 'piSeEwJJRio',
    category: 'Negotiation' as Category,
    duration: '22:15',
  },
  {
    title: 'How To Wholesale Real Estate Step by Step',
    description: 'A complete walkthrough of closing a wholesale deal from contract to assignment to payday.',
    embedId: 'dszG4_lRVr4',
    category: 'Closing Deals' as Category,
    duration: '35:20',
  },
  {
    title: 'Watch Me Get the Title Company to Close My Deal',
    description: 'How to choose a wholesale-friendly title company and what to expect during the closing process.',
    embedId: '0A2TpKfV1Os',
    category: 'Closing Deals' as Category,
    duration: '17:30',
  },
  {
    title: 'How To Analyze a Wholesale Real Estate Deal',
    description: 'Learn the Maximum Allowable Offer formula and how to use it to evaluate every potential deal.',
    embedId: '6l4JRGWkVxQ',
    category: 'ARV & Comps' as Category,
    duration: '13:20',
  },
]

export default function VideoLearning() {
  const [category, setCategory] = useState<Category>('All')
  const [playingVideo, setPlayingVideo] = useState<string | null>(null)

  const filtered = category === 'All' ? VIDEOS : VIDEOS.filter(v => v.category === category)

  const categoryIcons: Record<string, typeof Play> = {
    'All': BookOpen,
    'ARV & Comps': TrendingUp,
    'Wholesaling Basics': Home,
    'Finding Deals': SearchIcon,
    'Negotiation': DollarSign,
    'Closing Deals': Play,
  }

  return (
    <div>
      <h2 className="section-header">Video Learning Center</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Learn how to find ARV, run comps, and master the basics of wholesale real estate with curated video tutorials.
      </p>
      <div className="info-tip" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0 }}>
          <strong>Start Here:</strong> If you're brand new, start with "How To Start Wholesaling Real Estate for Beginners" then move to the ARV & Comps section.
        </p>
      </div>

      {/* Category filter */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 24 }}>
        {CATEGORIES.map(cat => {
          const Icon = categoryIcons[cat] || BookOpen
          return (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              style={{
                padding: '8px 16px',
                borderRadius: 6,
                border: category === cat ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                background: category === cat ? 'rgba(244,126,95,0.15)' : 'transparent',
                color: category === cat ? '#ff7e5f' : '#888',
                cursor: 'pointer',
                fontFamily: "'DM Sans', sans-serif",
                fontSize: 13,
                fontWeight: 500,
                display: 'flex',
                alignItems: 'center',
                gap: 6,
                transition: 'all 0.2s',
              }}
            >
              <Icon size={14} />
              {cat}
            </button>
          )
        })}
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
        Showing {filtered.length} videos
      </div>

      {/* Video grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))', gap: 20 }}>
        {filtered.map(video => (
          <div key={video.title} className="resource-card" style={{ borderRadius: 10, overflow: 'hidden' }}>
            {/* Video embed or thumbnail */}
            <div
              style={{
                position: 'relative',
                paddingBottom: '56.25%',
                background: '#141820',
                cursor: 'pointer',
              }}
              onClick={() => setPlayingVideo(playingVideo === video.title ? null : video.title)}
            >
              {playingVideo === video.title ? (
                <iframe
                  style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                  src={`https://www.youtube.com/embed/${video.embedId}?autoplay=1`}
                  title={video.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                />
              ) : (
                <img
                  src={`https://img.youtube.com/vi/${video.embedId}/hqdefault.jpg`}
                  alt={video.title}
                  style={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                  }}
                  loading="lazy"
                />
              )}
              {playingVideo !== video.title && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, transparent 50%)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  flexDirection: 'column', gap: 8,
                }}>
                  <div style={{
                    width: 56, height: 56, borderRadius: '50%',
                    background: 'rgba(244,126,95,0.85)', border: '2px solid #fff',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    transition: 'all 0.2s',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.4)',
                  }}>
                    <Play size={24} color="#fff" fill="#fff" />
                  </div>
                  <span style={{ fontSize: 12, color: '#fff', fontWeight: 600, textShadow: '0 1px 4px rgba(0,0,0,0.6)' }}>{video.duration}</span>
                </div>
              )}
            </div>
            <div style={{ padding: 16 }}>
              <span className="badge badge-orange" style={{ marginBottom: 8, display: 'inline-block' }}>
                {video.category}
              </span>
              <h3 style={{
                fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb',
                letterSpacing: '0.03em', margin: '4px 0 8px', lineHeight: 1.2,
              }}>
                {video.title}
              </h3>
              <p style={{ fontSize: 13, color: '#888', lineHeight: 1.6, margin: 0 }}>
                {video.description}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
