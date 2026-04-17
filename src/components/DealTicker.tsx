import { useEffect, useRef } from 'react'

const DEALS = [
  { name: 'Marcus R.', city: 'Atlanta', state: 'GA', fee: '$11,200' },
  { name: 'Keisha M.', city: 'Phoenix', state: 'AZ', fee: '$8,500' },
  { name: 'Devon W.', city: 'Dallas', state: 'TX', fee: '$15,000' },
  { name: 'James T.', city: 'Detroit', state: 'MI', fee: '$6,800' },
  { name: 'Demetrius D.', city: 'Riverbank', state: 'CA', fee: '$8,600' },
  { name: 'Ashley P.', city: 'Houston', state: 'TX', fee: '$9,400' },
  { name: 'Demetrius D.', city: 'Mesquite', state: 'TX', fee: '$3,900' },
  { name: 'Jordan L.', city: 'Chicago', state: 'IL', fee: '$12,750' },
  { name: 'Demetrius D.', city: 'Phoenix', state: 'AZ', fee: '$5,700' },
  { name: 'Brianna S.', city: 'Tampa', state: 'FL', fee: '$7,300' },
  { name: 'Demetrius D.', city: 'Surprise', state: 'AZ', fee: '$9,860' },
  { name: 'Carlos M.', city: 'Charlotte', state: 'NC', fee: '$10,100' },
  { name: 'Demetrius D.', city: 'Forney', state: 'TX', fee: '$3,700' },
  { name: 'Tyrone H.', city: 'Memphis', state: 'TN', fee: '$5,900' },
  { name: 'Demetrius D.', city: 'Goodyear', state: 'AZ', fee: '$5,560' },
  { name: 'Lisa W.', city: 'Baltimore', state: 'MD', fee: '$13,500' },
  { name: 'Demetrius D.', city: 'Midwest City', state: 'OK', fee: '$5,880' },
  { name: 'Ray K.', city: 'Indianapolis', state: 'IN', fee: '$8,200' },
  { name: 'Demetrius D.', city: 'Garner', state: 'NC', fee: '$7,200' },
  { name: 'Demetrius D.', city: 'Phoenix', state: 'AZ', fee: '$6,500' },
  { name: 'Nina G.', city: 'Jacksonville', state: 'FL', fee: '$11,800' },
  { name: 'Derek F.', city: 'San Antonio', state: 'TX', fee: '$14,600' },
  { name: 'Tasha B.', city: 'Columbus', state: 'OH', fee: '$6,400' },
  { name: 'Omar J.', city: 'Nashville', state: 'TN', fee: '$9,900' },
]

function DealItem({ deal }: { deal: typeof DEALS[number] }) {
  return (
    <span className="deal-ticker-item">
      <span className="deal-ticker-icon">🏠</span>
      <span className="deal-ticker-name">{deal.name}</span>
      <span className="deal-ticker-sep">—</span>
      <span className="deal-ticker-city">{deal.city}, {deal.state}</span>
      <span className="deal-ticker-sep">—</span>
      <span className="deal-ticker-fee">{deal.fee} assignment fee</span>
    </span>
  )
}

export function DealTicker() {
  const trackRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const track = trackRef.current
    if (!track) return

    let animationId: number
    let offset = 0
    const speed = 0.5 // px per frame

    function animate() {
      offset -= speed
      const firstHalf = track!.scrollWidth / 2
      if (Math.abs(offset) >= firstHalf) {
        offset += firstHalf
      }
      track!.style.transform = `translateX(${offset}px)`
      animationId = requestAnimationFrame(animate)
    }

    animationId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(animationId)
  }, [])

  return (
    <div className="deal-ticker" aria-label="Recent member deal wins" role="marquee">
      <div className="deal-ticker-track" ref={trackRef}>
        {DEALS.map((deal, i) => (
          <DealItem key={i} deal={deal} />
        ))}
        {/* Duplicate for seamless loop */}
        {DEALS.map((deal, i) => (
          <DealItem key={`dup-${i}`} deal={deal} />
        ))}
      </div>
    </div>
  )
}
