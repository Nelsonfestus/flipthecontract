import { ExternalLink, Star, Lightbulb, AlertTriangle } from 'lucide-react'

function InfoBox({ type, children }: { type: 'tip' | 'warn' | 'note'; children: React.ReactNode }) {
  const cfg = {
    tip: { cls: 'info-tip', label: 'TIP', color: '#5cb885' },
    warn: { cls: 'info-warn', label: 'WARNING', color: '#c47a1a' },
    note: { cls: 'info-note', label: 'NOTE', color: '#6aadee' },
  }[type]
  return (
    <div className={cfg.cls} style={{ marginBottom: 16 }}>
      <span style={{ fontSize: 11, fontWeight: 700, color: cfg.color, letterSpacing: '0.05em', display: 'block', marginBottom: 4 }}>{cfg.label}</span>
      <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>{children}</div>
    </div>
  )
}

const SKIP_TOOLS = [
  {
    name: 'BatchSkipTracing',
    url: 'https://www.batchskiptracing.com',
    price: '$0.12–$0.18/record',
    rating: 5,
    tags: ['Bulk', 'Phone + Email', 'Popular'],
    desc: 'Industry standard for bulk skip tracing. Upload a CSV, get phone numbers, emails, and relative info back fast. Best price-per-record for volume.',
  },
  {
    name: 'PropStream',
    url: 'https://trial.propstream.com',
    price: '$99/mo',
    rating: 5,
    tags: ['Data', 'Skip Trace', 'List Building'],
    desc: 'All-in-one platform for list building + skip tracing. Pull distressed property lists and skip trace in one workflow. Great for beginners.',
  },
  {
    name: 'REISIFT',
    url: 'https://reisift.com',
    price: 'Starts $97/mo',
    rating: 4,
    tags: ['CRM', 'Skip Trace', 'Marketing'],
    desc: 'CRM with built-in skip tracing. Track contacts through your pipeline, assign tasks, and skip trace without leaving the platform.',
  },
  {
    name: 'TLO (TransUnion)',
    url: 'https://www.tlo.com',
    price: 'Pay-per-use',
    rating: 4,
    tags: ['Deep Search', 'Professional'],
    desc: 'Professional-grade skip tracing used by investigators. Excellent hit rate for hard-to-find owners. Requires business verification to access.',
  },
  {
    name: 'Spokeo',
    url: 'https://www.spokeo.com',
    price: '$14.95/mo',
    rating: 3,
    tags: ['Individual Search', 'Budget'],
    desc: 'Good for individual one-off searches. Aggregates public records. Not ideal for bulk, but useful for verifying specific contacts.',
  },
  {
    name: 'Whitepages Pro',
    url: 'https://pro.whitepages.com',
    price: 'Pay-per-lookup',
    rating: 3,
    tags: ['API Access', 'Verification'],
    desc: 'API-based contact verification. Good for integrating into custom CRMs or automations. Also useful for phone number verification.',
  },
]

function StarRating({ n }: { n: number }) {
  return (
    <div style={{ display: 'flex', gap: 2 }}>
      {[1,2,3,4,5].map(i => (
        <Star key={i} size={12} fill={i <= n ? '#ffb347' : 'none'} color={i <= n ? '#ffb347' : '#444'} />
      ))}
    </div>
  )
}

export default function SkipTraceTools() {
  return (
    <div>
      <h2 className="section-header">Skip Trace Tools</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 24, lineHeight: 1.7 }}>
        Verified skip tracing platforms for finding property owner contact information. Ranked by value, accuracy, and ease of use.
      </p>

      <InfoBox type="tip">
        For cold calling campaigns, use BatchSkipTracing for bulk lists. For individual deep dives on a high-value lead, use TLO or PropStream.
      </InfoBox>
      <InfoBox type="warn">
        Always comply with TCPA regulations when cold calling skip-traced numbers. Scrub your list against the DNC registry and use a compliant dialer.
      </InfoBox>

      <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 300px), 1fr))' }}>
        {SKIP_TOOLS.map(tool => (
          <div key={tool.name} className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
              <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ff7e5f', margin: 0, letterSpacing: '0.04em' }}>
                {tool.name}
              </h3>
              <StarRating n={tool.rating} />
            </div>
            <div style={{ fontSize: 13, color: '#ffb347', fontWeight: 600, marginBottom: 8 }}>{tool.price}</div>
            <p style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6, marginBottom: 12 }}>{tool.desc}</p>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 12 }}>
              {tool.tags.map(tag => (
                <span key={tag} className="badge badge-orange">{tag}</span>
              ))}
            </div>
            <a
              href={tool.url}
              target="_blank"
              rel="noopener noreferrer"
              style={{
                display: 'inline-flex', alignItems: 'center', gap: 6,
                fontSize: 12, color: '#ff7e5f', textDecoration: 'none',
                fontWeight: 600,
              }}
            >
              Visit Site <ExternalLink size={12} />
            </a>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 24 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 12 }}>
          Skip Trace Workflow
        </h3>
        <div style={{ display: 'flex', gap: 0, flexWrap: 'wrap' }}>
          {[
            { step: '01', title: 'Pull List', desc: 'Use PropStream or DealMachine to build a targeted distressed property list.' },
            { step: '02', title: 'Export CSV', desc: 'Export with property address, owner name, and mailing address fields.' },
            { step: '03', title: 'Upload to Batch', desc: 'Upload to BatchSkipTracing for bulk phone + email data.' },
            { step: '04', title: 'Scrub DNC', desc: 'Remove numbers on the DNC registry using a TCPA compliance tool.' },
            { step: '05', title: 'Dial & Track', desc: 'Load into your dialer (Mojo, CallTools) and track results in CRM.' },
          ].map((item, i, arr) => (
            <div key={item.step} style={{ flex: 1, minWidth: 140, padding: '16px 12px', borderTop: '2px solid', borderTopColor: '#ff7e5f', marginRight: i < arr.length - 1 ? 8 : 0, marginBottom: 8 }}>
              <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: 'rgba(244,126,95,0.3)', lineHeight: 1 }}>{item.step}</div>
              <div style={{ fontWeight: 700, fontSize: 13, color: '#f5f0eb', margin: '4px 0' }}>{item.title}</div>
              <div style={{ fontSize: 12, color: '#888', lineHeight: 1.5 }}>{item.desc}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
