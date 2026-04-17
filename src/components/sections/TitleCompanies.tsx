import { useState } from 'react'
import { ExternalLink, Phone, MapPin, Search, Filter } from 'lucide-react'

const TITLE_COMPANIES = [
  // Texas
  {
    name: 'American Title of Houston',
    state: 'TX',
    city: 'Houston',
    phone: '(713) 965-9777',
    url: 'https://www.americantitleofhouston.com',
    specialty: 'Double closes, assignments, investor transactions',
    wholesale: true,
    desc: 'Full-service title company at 2000 Bering Drive, Suite 1000, Houston, TX 77057. Experienced with wholesale investor transactions, assignment contracts, and same-day double closings.',
  },
  {
    name: 'Capital Title of Texas',
    state: 'TX',
    city: 'Plano / Dallas',
    phone: '(972) 682-2700',
    url: 'https://www.capitaltitleoftexas.com',
    specialty: 'Assignments, simultaneous closings, investor services',
    wholesale: true,
    desc: 'Located at 2400 Dallas Pkwy, Suite 560, Plano, TX 75093. One of the largest independent title companies in Texas with dedicated investor services.',
  },
  // Florida
  {
    name: 'Triumph Title Group',
    state: 'FL',
    city: 'Orlando',
    phone: '(407) 217-9231',
    url: 'https://triumphtitlegroup.com',
    specialty: 'Double closings, transactional funding, assignments',
    wholesale: true,
    desc: 'Located at 228 Hillcrest St, Orlando, FL 32801. Specializes in wholesale transactions, double closings, and transactional funding. Toll free: (866) 895-3911.',
  },
  {
    name: 'RTR Title',
    state: 'FL',
    city: 'Tampa / Orlando / Statewide',
    phone: '(833) 787-8485',
    url: 'https://rtrtitle.com',
    specialty: 'Double closings, assignments, creative financing, land trusts',
    wholesale: true,
    desc: 'Offices in Tampa (3400 W. Kennedy Blvd), Orlando, Kissimmee, Fort Lauderdale, Jacksonville. Managed by an investor-friendly real estate attorney. Services all of Florida.',
  },
  {
    name: 'Marina Title',
    state: 'FL',
    city: 'Miami / South Florida',
    phone: '(800) 604-1871',
    url: 'https://marinatitle.com',
    specialty: 'Wholesale transactions, double closings, novations, subject-to',
    wholesale: true,
    desc: 'South Florida specialist for creative investor transactions including wholesale, double closings, novations, subject-to deals, and seller financing.',
  },
  // Ohio
  {
    name: 'Empora Title',
    state: 'OH',
    city: 'Columbus',
    phone: '(614) 660-5503',
    url: 'https://emporatitle.com',
    specialty: 'Digital-first closings, assignments, double closings',
    wholesale: true,
    desc: 'Located at 145 E Rich St Floor 4, Columbus, OH 43215. Built for real estate investors with a digital-first experience. Also services KY, FL, PA, IN, and MO.',
  },
  {
    name: 'Clean Title Agency',
    state: 'OH',
    city: 'Columbus',
    phone: '(614) 237-3525',
    url: 'https://cleantitleagency.com',
    specialty: 'Investment closings, assignments, title searches',
    wholesale: true,
    desc: 'Located at 2154 East Main Street, Suite 301, Columbus, OH 43209. Experienced with wholesale and investor transactions across Ohio.',
  },
  // Georgia
  {
    name: 'Georgia Title & Escrow Co LLC',
    state: 'GA',
    city: 'Atlanta',
    phone: '(678) 448-4148',
    url: 'https://georgiatitle.com',
    specialty: 'Assignments, subject-to, double closings',
    wholesale: true,
    desc: 'Located at 945 E Paces Ferry Road, Resurgens Plaza, Atlanta, GA 30326. Handles wholesale assignments, subject-to deals, and A-to-B / B-to-C double closings.',
  },
  {
    name: 'Southeast Closing Services',
    state: 'GA',
    city: 'Atlanta Metro',
    phone: '(770) 268-3030',
    url: 'https://www.southeastclosing.com',
    specialty: 'Investor closings, assignments, GA title services',
    wholesale: true,
    desc: 'Georgia title company serving the Atlanta metro area. Experienced with investor transactions and wholesale deal closings.',
  },
  // Arizona
  {
    name: 'Premier Title Agency',
    state: 'AZ',
    city: 'Phoenix',
    phone: '(602) 491-9660',
    url: 'https://ptanow.com',
    specialty: 'Assignments, double closings, investor escrow',
    wholesale: true,
    desc: 'Located at 2910 E Camelback Rd, Suite 100, Phoenix, AZ 85016. Full-service title and escrow with experience in wholesale investor transactions.',
  },
  {
    name: 'Great American Title Agency',
    state: 'AZ',
    city: 'Phoenix',
    phone: '(602) 445-5525',
    url: 'https://www.azgat.com',
    specialty: 'Escrow, title insurance, investor transactions',
    wholesale: true,
    desc: 'Located at 7720 N. 16th Street, Suite 450, Phoenix, AZ 85020. Award-winning title and escrow services with multiple Arizona locations.',
  },
  // North Carolina
  {
    name: 'Sterling Law',
    state: 'NC',
    city: 'Raleigh',
    phone: '(919) 999-3500',
    url: 'https://sterlinglaw.com',
    specialty: 'Investor closings, assignments, NC real estate law',
    wholesale: true,
    desc: 'Located at 4208 Six Forks Road, Suite 1000, Raleigh, NC 27609. Investor-friendly settlement attorney handling wholesale and assignment closings in North Carolina.',
  },
  // Michigan
  {
    name: 'Speedy Title & Escrow Services',
    state: 'MI',
    city: 'Clinton Township / Statewide',
    phone: '(586) 739-2233',
    url: 'https://www.speedy-escrow.com',
    specialty: 'Wholesale closings, assignments, for-sale-by-owner',
    wholesale: true,
    desc: 'Located at 17000 17 Mile Rd, Suite 2, Clinton Township, MI. Family-owned with 20+ years in title. Also services Ohio and Florida.',
  },
  // Indiana
  {
    name: 'Hocker Title',
    state: 'IN',
    city: 'Indianapolis / Carmel / Greenwood',
    phone: '(317) 578-1630',
    url: 'https://hockertitle.com',
    specialty: 'Flip, wholesale, buy/sell, land contracts',
    wholesale: true,
    desc: '30+ years helping property investors save money and protect assets. Multiple real estate attorneys on staff. Offices in Indianapolis, Carmel, and Greenwood.',
  },
  // Tennessee
  {
    name: 'Blueprint Title',
    state: 'TN',
    city: 'Nashville / Nationwide',
    phone: '(615) 933-0075',
    url: 'https://blueprinttitle.com',
    specialty: 'Modern digital closings, investor transactions',
    wholesale: true,
    desc: 'Located at 401 Church St #1710, Nashville, TN 37219. Modern, streamlined approach to title and closing designed for investors and wholesalers.',
  },
  {
    name: 'Quality Title Group',
    state: 'TN',
    city: 'Memphis',
    phone: '(901) 249-4787',
    url: 'https://qualitytitlepro.com',
    specialty: 'Wholesale closings, assignments, investor deals',
    wholesale: true,
    desc: 'Located at 6389 N Quail Hollow Rd #201, Memphis, TN 38120. Experienced with wholesale transactions and investor-focused closings in the Memphis market.',
  },
  // Nationwide / Digital
  {
    name: 'CLOSED Title',
    state: 'Nationwide',
    city: 'Digital / Multi-State',
    phone: '(833) 848-5358',
    url: 'https://www.closedtitle.com',
    specialty: 'Digital closings, assignments, double closings, 24-hour close',
    wholesale: true,
    desc: 'Full-service digital title company for investor transactions. Can close in as little as 24 hours. Same-day or next-day title commitments in many states. 100% digital process.',
  },
]

const ALL_STATES = [...new Set(TITLE_COMPANIES.map(tc => tc.state))].sort()

const WHOLESALE_FRIENDLY_STATES = [
  'TX', 'FL', 'OH', 'GA', 'AZ', 'NC', 'MI', 'IN', 'TN', 'PA', 'CO', 'MO',
  'AL', 'AR', 'CA', 'CT', 'IL', 'KS', 'KY', 'LA', 'MD', 'MA', 'MN', 'MS',
  'NE', 'NV', 'NJ', 'NM', 'NY', 'OK', 'OR', 'SC', 'UT', 'VA', 'WA', 'WI',
]

export default function TitleCompanies() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedState, setSelectedState] = useState<string>('all')

  const filtered = TITLE_COMPANIES.filter(tc => {
    const matchSearch = searchTerm === '' ||
      tc.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.state.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
      tc.specialty.toLowerCase().includes(searchTerm.toLowerCase())
    const matchState = selectedState === 'all' || tc.state === selectedState
    return matchSearch && matchState
  })

  return (
    <div>
      <h2 className="section-header">Wholesale-Friendly Title Companies</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Real, verified wholesale-friendly title companies across the country. All phone numbers are clickable — tap to call directly. Always verify current availability and fees with the company.
      </p>

      <div className="info-tip" style={{ marginBottom: 20 }}>
        <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>TIP</span>
        <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
          When calling a title company for the first time, ask: <em>"Do you handle double closes with same-day A-to-B and B-to-C transactions? Do you require seasoning?"</em> Their answer tells you everything.
        </div>
      </div>

      {/* Search & Filter */}
      <div style={{ display: 'flex', gap: 10, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 250px' }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            className="input-dark"
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search by name, state, city, or specialty..."
            style={{ paddingLeft: 34 }}
          />
        </div>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <Filter size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <select
            className="input-dark"
            value={selectedState}
            onChange={e => setSelectedState(e.target.value)}
            style={{ paddingLeft: 34, cursor: 'pointer', minWidth: 160 }}
          >
            <option value="all">All States ({TITLE_COMPANIES.length})</option>
            {ALL_STATES.map(s => (
              <option key={s} value={s}>{s} ({TITLE_COMPANIES.filter(tc => tc.state === s).length})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Results count */}
      <div style={{ fontSize: 12, color: '#666', marginBottom: 16 }}>
        Showing {filtered.length} of {TITLE_COMPANIES.length} companies
      </div>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 320px), 1fr))' }}>
        {filtered.map(tc => (
          <div key={tc.name} className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 19, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em', lineHeight: 1.2 }}>
                {tc.name}
              </h3>
              {tc.wholesale && <span className="badge badge-green">Wholesale Friendly</span>}
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4, fontSize: 12, color: '#888' }}>
              <MapPin size={11} /> {tc.city}, {tc.state}
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
              <Phone size={11} color="#5cb885" />
              <a
                href={`tel:${tc.phone.replace(/[^0-9+]/g, '')}`}
                style={{ fontSize: 14, color: '#5cb885', textDecoration: 'none', fontWeight: 600, fontFamily: "'DM Sans', sans-serif" }}
              >
                {tc.phone}
              </a>
            </div>

            <div style={{ fontSize: 11, color: '#ffb347', fontWeight: 600, marginBottom: 8, letterSpacing: '0.03em' }}>
              SPECIALTY: {tc.specialty}
            </div>

            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, marginBottom: 12 }}>{tc.desc}</p>

            <a
              href={tc.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 5,
                fontSize: 12, color: '#ff7e5f', textDecoration: 'none', fontWeight: 600,
              }}
            >
              Visit Website <ExternalLink size={11} />
            </a>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 20px', color: '#666' }}>
          <p style={{ fontSize: 14 }}>No companies found matching your search. Try a different term or state filter.</p>
        </div>
      )}

      {/* Wholesale-friendly states reference */}
      <div style={{ marginTop: 24, background: '#263040', border: '1px solid #3d4e65', borderRadius: 10, padding: 20 }}>
        <h4 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#ffb347', letterSpacing: '0.04em', margin: '0 0 10px' }}>
          Wholesale-Friendly States
        </h4>
        <p style={{ fontSize: 12, color: '#888', marginBottom: 10, lineHeight: 1.6 }}>
          These states generally allow wholesale real estate transactions (assignments and/or double closings). Always verify current laws with a local attorney.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
          {WHOLESALE_FRIENDLY_STATES.sort().map(s => (
            <span key={s} style={{ fontSize: 11, padding: '3px 10px', background: 'rgba(244,126,95,0.08)', border: '1px solid #3d4e65', borderRadius: 4, color: '#ccc', fontFamily: "'DM Sans', sans-serif" }}>
              {s}
            </span>
          ))}
        </div>
      </div>

      <div style={{ marginTop: 16 }}>
        <div className="info-warn">
          <span style={{ fontSize: 11, fontWeight: 700, color: '#c47a1a', letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>WARNING</span>
          <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
            Not all title companies handle double closes or understand assignment fees. Always disclose your wholesale intent upfront. Using a title company unfamiliar with investor transactions can kill your deal.
          </div>
        </div>
      </div>
    </div>
  )
}
