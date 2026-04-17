import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/terms')({
  component: TermsPage,
  head: () => ({
    meta: [
      { title: 'Terms & Conditions — Flip the Contract' },
      { name: 'description', content: 'Terms and conditions for using Flip the Contract wholesale real estate platform. Read our policies on subscriptions, refunds, lead data, and more.' },
    ],
  }),
})

function TermsPage() {
  return (
    <div style={{ minHeight: '100vh', background: 'transparent' }}>
      {/* Nav */}
      <nav style={{
        background: 'rgba(10,10,10,0.95)', backdropFilter: 'blur(10px)',
        borderBottom: '1px solid #3d4e65', position: 'sticky', top: 0, zIndex: 100,
      }}>
        <div style={{ maxWidth: 1200, margin: '0 auto', padding: '0 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 56 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{
              width: 32, height: 32, borderRadius: 6,
              background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontFamily: "'Bebas Neue', sans-serif", fontSize: 16, color: '#000',
            }}>FTC</div>
            <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, letterSpacing: '0.06em', color: '#f5f0eb' }}>
              Flip the Contract
            </span>
          </div>
          <a href="/" style={{ fontSize: 13, color: '#888', textDecoration: 'none' }}>← Back to Hub</a>
        </div>
      </nav>

      <div style={{ maxWidth: 800, margin: '0 auto', padding: '48px 20px' }}>
        <h1 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 'clamp(28px, 5vw, 42px)', color: '#ff7e5f', letterSpacing: '0.04em', margin: '0 0 8px' }}>
          Terms &amp; Conditions – Flip The Contract
        </h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Effective Date: March 27, 2026</p>

        <div style={{ color: '#aaa', fontSize: 14, lineHeight: 1.9 }}>

          <Section title="1. Acceptance of Terms">
            <p>By accessing or using Flip The Contract ("Service"), you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree, you must not use the Service.</p>
            <p style={{ marginTop: 8 }}>Flip The Contract is owned and operated by Flip The Contract LLC, located in Phoenix, Arizona.</p>
            <p style={{ marginTop: 8 }}>These Terms apply to all users, including visitors, subscribers, and customers.</p>
          </Section>

          <Section title="2. Description of Service">
            <p>Flip The Contract provides educational materials, tools, templates, and general information related to wholesale real estate.</p>
            <p style={{ marginTop: 8 }}>All content is provided strictly for informational and educational purposes only.</p>
          </Section>

          <Section title="3. No Professional Advice">
            <div style={{ background: '#1a1200', border: '1px solid #ff7e5f', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <strong style={{ color: '#ff7e5f' }}>Flip The Contract is NOT:</strong>
              <ul style={{ paddingLeft: 20, margin: '8px 0 0' }}>
                <li>A law firm</li>
                <li>A licensed real estate brokerage</li>
                <li>A financial advisory service</li>
              </ul>
            </div>
            <p>Nothing on this platform constitutes legal, financial, or real estate advice.</p>
            <p style={{ marginTop: 8 }}>You are required to consult with:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>A licensed attorney</li>
              <li>A licensed real estate professional</li>
              <li>A certified financial advisor</li>
            </ul>
            <p>before making any decisions.</p>
          </Section>

          <Section title="4. No Guarantee of Results">
            <p>We make <strong style={{ color: '#f5f0eb' }}>NO</strong> guarantees regarding:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Income</li>
              <li>Profits</li>
              <li>Deals closed</li>
              <li>Business success</li>
            </ul>
            <p>All results vary based on effort, experience, and market conditions.</p>
            <p style={{ marginTop: 8 }}>You acknowledge that real estate investing involves risk, including loss of money.</p>
          </Section>

          <Section title="5. Subscription & Payments">
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Subscription pricing is displayed at checkout (e.g., $75/month)</li>
              <li>Billing is recurring and renews automatically</li>
              <li>Payments are processed via PayPal or other third-party processors</li>
              <li>You may cancel anytime through your payment provider</li>
              <li>Access continues until the end of your billing cycle</li>
            </ul>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 18, color: '#f5f0eb', letterSpacing: '0.04em', margin: '16px 0 8px' }}>Refund Policy</h3>
            <div style={{ background: '#1a0000', border: '1px solid #c0392b', borderRadius: 8, padding: 16, marginBottom: 12 }}>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li><strong style={{ color: '#e74c3c' }}>ALL SALES ARE FINAL</strong></li>
                <li>No refunds will be issued once a subscription is billed</li>
                <li>No partial refunds for unused time</li>
              </ul>
            </div>
            <p>Chargebacks or disputes may result in:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Immediate termination</li>
              <li>Permanent ban from the platform</li>
            </ul>
          </Section>

          <Section title="6. Lead Data Disclaimer">
            <div style={{ background: '#1a0000', border: '2px solid #e74c3c', borderRadius: 8, padding: 16, marginBottom: 16 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                <span style={{ fontSize: 20 }}>⚠️</span>
                <strong style={{ color: '#e74c3c', fontSize: 16 }}>HIGH RISK SECTION</strong>
              </div>
              <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
                <li>Lead data is compiled from publicly available sources</li>
                <li>Leads are NOT exclusive and may be sold to multiple users</li>
                <li>We do NOT guarantee accuracy, completeness, or timeliness</li>
              </ul>
            </div>
            <p><strong style={{ color: '#ff7e5f' }}>IMPORTANT:</strong> Flip The Contract DOES NOT:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Provide consent to contact any individual listed</li>
              <li>Verify contact permissions</li>
              <li>Guarantee compliance with marketing laws</li>
            </ul>
            <p style={{ marginTop: 12 }}>You are <strong style={{ color: '#f5f0eb' }}>100% responsible</strong> for compliance with:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Telephone Consumer Protection Act (TCPA)</li>
              <li>Do Not Call (DNC) Registry</li>
              <li>CAN-SPAM Act</li>
              <li>All state and local regulations</li>
            </ul>
            <p style={{ color: '#e74c3c', fontWeight: 600, marginTop: 8 }}>Improper use of lead data can result in fines or legal action. You assume all risk.</p>
          </Section>

          <Section title="7. User Responsibilities">
            <p>You agree to:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Use the Service lawfully</li>
              <li>Not share or resell access</li>
              <li>Not copy or distribute content</li>
              <li>Verify all information independently</li>
            </ul>
            <p>You are solely responsible for your business decisions and actions.</p>
          </Section>

          <Section title="8. Intellectual Property">
            <p>All content is owned by Flip The Contract and protected by copyright laws.</p>
            <p style={{ marginTop: 8 }}>You are granted a limited, non-transferable license for personal use only.</p>
            <p style={{ marginTop: 8 }}>You may <strong style={{ color: '#f5f0eb' }}>NOT</strong>:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Resell content</li>
              <li>Share login access</li>
              <li>Reproduce materials</li>
            </ul>
          </Section>

          <Section title="9. Third-Party Services">
            <p>We may link to third-party tools and services.</p>
            <p style={{ marginTop: 8 }}>We are not responsible for:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Their accuracy</li>
              <li>Their policies</li>
              <li>Any damages caused</li>
            </ul>
            <p>Use them at your own risk.</p>
          </Section>

          <Section title="10. Limitation of Liability">
            <p>To the maximum extent permitted by law:</p>
            <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 8, padding: 16, margin: '12px 0' }}>
              <p style={{ margin: '0 0 8px' }}>Flip The Contract shall <strong style={{ color: '#f5f0eb' }}>NOT</strong> be liable for:</p>
              <ul style={{ paddingLeft: 20, margin: 0 }}>
                <li>Lost profits</li>
                <li>Business failure</li>
                <li>Legal issues</li>
                <li>Data loss</li>
                <li>Any indirect or consequential damages</li>
              </ul>
            </div>
            <p><strong style={{ color: '#f5f0eb' }}>Maximum liability is limited to the total amount paid in the previous 3 months.</strong></p>
          </Section>

          <Section title="11. Indemnification">
            <p>You agree to defend and hold harmless Flip The Contract from any claims resulting from:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Your use of the Service</li>
              <li>Your violation of laws</li>
              <li>Your real estate activities</li>
              <li>Your use of lead data</li>
            </ul>
          </Section>

          <Section title="12. Privacy">
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>We collect minimal data (email, usage data)</li>
              <li>Payments are securely handled by third parties</li>
              <li>We do NOT sell personal data</li>
              <li>You may request data deletion at any time</li>
            </ul>
          </Section>

          <Section title="13. Termination">
            <p>We may suspend or terminate access at any time for:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Violations of these Terms</li>
              <li>Abuse of the platform</li>
              <li>Chargebacks or fraud</li>
            </ul>
            <p><strong style={{ color: '#e74c3c' }}>No refunds will be issued.</strong></p>
          </Section>

          <Section title="14. Compliance Responsibility">
            <p>Wholesale real estate laws vary by state.</p>
            <p style={{ marginTop: 8 }}>You are solely responsible for:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Understanding your local laws</li>
              <li>Determining if licensing is required</li>
              <li>Ensuring legal compliance</li>
            </ul>
            <p>We do NOT guarantee legality in your area.</p>
          </Section>

          <Section title="15. Modifications">
            <p>We may update these Terms at any time.</p>
            <p style={{ marginTop: 8 }}>Continued use = acceptance of changes.</p>
          </Section>

          <Section title="16. Governing Law">
            <p>These Terms are governed by the laws of the <strong style={{ color: '#f5f0eb' }}>State of Arizona</strong>.</p>
          </Section>

          <Section title="17. Dispute Resolution">
            <p>All disputes shall be resolved through <strong style={{ color: '#f5f0eb' }}>binding arbitration</strong>.</p>
            <p style={{ marginTop: 8 }}>You waive the right to:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Jury trial</li>
              <li>Class action lawsuits</li>
            </ul>
          </Section>

          <Section title="18. Severability">
            <p>If any part of these Terms is invalid, the rest remains enforceable.</p>
          </Section>

          <Section title="19. Contact Information">
            <p>Email: <a href="mailto:support@flipthecontract.com" style={{ color: '#ff7e5f' }}>support@flipthecontract.com</a></p>
            <p style={{ marginTop: 4 }}>Location: Phoenix, Arizona</p>
          </Section>

          <div style={{
            marginTop: 40, padding: 20, background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>
              By using Flip The Contract, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
            </p>
            <a href="/" className="btn-orange" style={{ textDecoration: 'none', display: 'inline-flex' }}>
              Return to Hub
            </a>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #2e3a4d', background: '#1a2030', padding: '24px 20px', textAlign: 'center' }}>
        <span style={{ fontSize: 12, color: '#555' }}>
          © 2026 Flip the Contract. All rights reserved.
        </span>
      </footer>
    </div>
  )
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <h2 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 10px' }}>
        {title}
      </h2>
      <div>{children}</div>
    </div>
  )
}
