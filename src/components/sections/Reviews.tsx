import { Star, Quote, CheckCircle } from 'lucide-react'

const REVIEWS = [
  {
    name: 'Marcus Johnson',
    location: 'Houston, TX',
    rating: 5,
    title: 'Closed my first deal in 3 weeks!',
    review: 'I was skeptical at first, but the contract templates and scripts alone were worth the membership. I closed my first wholesale deal within 3 weeks of joining. The state-specific contracts saved me from having to hire an attorney for my first deal.',
    date: 'March 2026',
    verified: true,
  },
  {
    name: 'Tasha Williams',
    location: 'Atlanta, GA',
    rating: 5,
    title: 'Best wholesale resource I\'ve found',
    review: 'I\'ve tried multiple courses and memberships. Flip the Contract gives you everything in one place — no fluff, just the tools you need. The hedge fund buyers list has been useful for moving deals quickly. Already closed 4 deals.',
    date: 'February 2026',
    verified: true,
  },
  {
    name: 'David Chen',
    location: 'Phoenix, AZ',
    rating: 5,
    title: 'The skip trace tools directory saved me hundreds',
    review: 'I was paying way too much for skip tracing before I found the tools directory here. Switched to BatchSkipTracing based on the recommendation and I\'m saving $200/month while getting better data. The cold calling scripts are solid too.',
    date: 'February 2026',
    verified: true,
  },
  {
    name: 'Jasmine Rogers',
    location: 'Jacksonville, FL',
    rating: 5,
    title: 'From zero knowledge to closing deals',
    review: 'I knew nothing about wholesaling 6 months ago. The video tutorials taught me how to run comps and find ARV. The contract templates gave me confidence to put my first property under contract. Just assigned my 3rd deal last week for a $12K fee.',
    date: 'January 2026',
    verified: true,
  },
  {
    name: 'Robert Martinez',
    location: 'San Antonio, TX',
    rating: 5,
    title: 'JV resources helped me partner on bigger deals',
    review: 'The JV agreement templates were exactly what I needed to start partnering with more experienced investors. I\'ve done 2 JV deals using the templates here and both went smoothly. The state laws section also helped me stay compliant.',
    date: 'January 2026',
    verified: true,
  },
  {
    name: 'Keisha Thompson',
    location: 'Charlotte, NC',
    rating: 4,
    title: 'Great resource, wish I found it sooner',
    review: 'I spent $5,000 on a "guru" course that gave me less than what this $75/month membership includes. The buyer template tool is so professional — my cash buyers take me more seriously now. Only wish there were more videos.',
    date: 'December 2025',
    verified: true,
  },
  {
    name: 'Anthony Brooks',
    location: 'Columbus, OH',
    rating: 5,
    title: 'The leads are legit motivated sellers',
    review: 'Bought the 130-lead package for my market and started calling immediately. Got 3 appointments in the first week. Already have one property under contract. The quality of the leads is much better than other services I\'ve tried.',
    date: 'December 2025',
    verified: true,
  },
  {
    name: 'Maria Gonzalez',
    location: 'Denver, CO',
    rating: 5,
    title: 'Cancellation contracts are a lifesaver',
    review: 'Having state-specific cancellation contracts and addendums ready to go has saved me so much time and legal fees. Everything is professional and ready to download. This is the real deal for anyone serious about wholesaling.',
    date: 'November 2025',
    verified: true,
  },
  {
    name: 'James Wilson',
    location: 'Indianapolis, IN',
    rating: 5,
    title: 'Worth the membership',
    review: 'I\'ve made over $35,000 in assignment fees since joining 4 months ago. The combination of buyer lists, scripts, and contract templates makes this the most complete wholesale toolkit I\'ve found.',
    date: 'November 2025',
    verified: true,
  },
  {
    name: 'Crystal Davis',
    location: 'Memphis, TN',
    rating: 5,
    title: 'The coaching call changed everything',
    review: 'I booked a 1-on-1 coaching call and got personalized advice on my specific market. That single call helped me restructure my approach and I closed my next deal within 2 weeks. The whole platform is solid.',
    date: 'October 2025',
    verified: true,
  },
  {
    name: 'Derek Howard',
    location: 'Detroit, MI',
    rating: 4,
    title: 'Solid tools for new wholesalers',
    review: 'As someone just getting started in wholesale real estate, this membership has been invaluable. The key verbiage glossary helped me sound professional on calls, and the ARV calculator makes evaluating deals so much faster.',
    date: 'October 2025',
    verified: true,
  },
  {
    name: 'Stephanie Brown',
    location: 'Kansas City, MO',
    rating: 5,
    title: 'Everything in one place',
    review: 'I used to have bookmarks for 20 different websites to find all the tools I needed. Now it\'s all here. Contracts, scripts, buyer lists, laws — everything. The title company directory was especially helpful for finding wholesale-friendly closers.',
    date: 'September 2025',
    verified: true,
  },
]

export default function Reviews() {
  const avgRating = (REVIEWS.reduce((sum, r) => sum + r.rating, 0) / REVIEWS.length).toFixed(1)

  return (
    <div>
      <h2 className="section-header">Member Reviews</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        See what our members are saying about Flip the Contract.
      </p>

      {/* Stats bar */}
      <div style={{
        display: 'flex', gap: 24, flexWrap: 'wrap',
        background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 20, marginBottom: 32,
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#ff7e5f' }}>{avgRating}</div>
          <div style={{ display: 'flex', gap: 2, justifyContent: 'center', marginBottom: 4 }}>
            {[1, 2, 3, 4, 5].map(s => (
              <Star key={s} size={16} color="#ff7e5f" fill={s <= Math.round(Number(avgRating)) ? '#ff7e5f' : 'none'} />
            ))}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>Average Rating</div>
        </div>
        <div style={{ width: 1, height: 50, background: '#3d4e65' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#f5f0eb' }}>{REVIEWS.length}</div>
          <div style={{ fontSize: 12, color: '#888' }}>Total Reviews</div>
        </div>
        <div style={{ width: 1, height: 50, background: '#3d4e65' }} />
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 36, color: '#5cb885' }}>
            {REVIEWS.filter(r => r.rating === 5).length}
          </div>
          <div style={{ fontSize: 12, color: '#888' }}>5-Star Reviews</div>
        </div>
      </div>

      {/* Reviews grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 340px), 1fr))', gap: 16 }}>
        {REVIEWS.map(review => (
          <div key={review.name} className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', gap: 2, marginBottom: 6 }}>
                  {[1, 2, 3, 4, 5].map(s => (
                    <Star key={s} size={14} color="#ff7e5f" fill={s <= review.rating ? '#ff7e5f' : 'none'} />
                  ))}
                </div>
                <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                  {review.title}
                </div>
              </div>
              <Quote size={24} color="rgba(244,126,95,0.2)" />
            </div>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.7, margin: '0 0 16px' }}>
              "{review.review}"
            </p>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #3d4e65', paddingTop: 12 }}>
              <div>
                <div style={{ fontSize: 13, color: '#f5f0eb', fontWeight: 600 }}>{review.name}</div>
                <div style={{ fontSize: 12, color: '#888' }}>{review.location}</div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                {review.verified && (
                  <span style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 11, color: '#5cb885' }}>
                    <CheckCircle size={12} /> Verified
                  </span>
                )}
                <span style={{ fontSize: 11, color: '#555' }}>{review.date}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
