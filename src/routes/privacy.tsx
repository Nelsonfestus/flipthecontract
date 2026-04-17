import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/privacy')({
  component: PrivacyPage,
  head: () => ({
    meta: [
      { title: 'Privacy Policy — Flip the Contract' },
      { name: 'description', content: 'Privacy policy for Flip the Contract wholesale real estate platform.' },
    ],
  }),
})

function PrivacyPage() {
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
          Privacy Policy – Flip The Contract
        </h1>
        <p style={{ color: '#888', fontSize: 13, marginBottom: 32 }}>Effective Date: March 27, 2026</p>

        <div style={{ color: '#aaa', fontSize: 14, lineHeight: 1.9 }}>

          <p style={{ marginBottom: 24 }}>
            Flip The Contract LLC ("we," "us," or "our") operates the Flip The Contract platform. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you visit our website and use our services. By accessing or using the Service, you consent to the practices described in this policy.
          </p>

          <Section title="1. Information We Collect">
            <p><strong style={{ color: '#f5f0eb' }}>Account Information</strong></p>
            <p>When you create an account or subscribe, we collect:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Full name</li>
              <li>Email address</li>
              <li>Password (stored in hashed form)</li>
              <li>Phone number (if provided)</li>
            </ul>

            <p style={{ marginTop: 12 }}><strong style={{ color: '#f5f0eb' }}>Payment Information</strong></p>
            <p>Payment processing is handled by Stripe. We do <strong style={{ color: '#f5f0eb' }}>not</strong> store your full credit card number, CVV, or banking details on our servers. Stripe may collect:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Credit or debit card details</li>
              <li>Billing address</li>
              <li>Transaction history</li>
            </ul>

            <p style={{ marginTop: 12 }}><strong style={{ color: '#f5f0eb' }}>Usage Data</strong></p>
            <p>We automatically collect certain information when you access the platform, including:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>IP address</li>
              <li>Browser type and version</li>
              <li>Device type and operating system</li>
              <li>Pages visited and time spent on pages</li>
              <li>Referring URLs and exit pages</li>
              <li>Date and time of access</li>
            </ul>
          </Section>

          <Section title="2. How We Use Your Information">
            <p>We use the information we collect to:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>Provide, maintain, and improve the Service</li>
              <li>Process subscriptions and payments</li>
              <li>Send transactional emails (account confirmations, billing receipts, subscription updates)</li>
              <li>Respond to customer support requests</li>
              <li>Monitor platform usage and analyze trends to improve user experience</li>
              <li>Detect and prevent fraud, abuse, or unauthorized access</li>
              <li>Comply with legal obligations</li>
            </ul>
            <p style={{ marginTop: 8 }}>We do <strong style={{ color: '#f5f0eb' }}>not</strong> sell your personal information to third parties.</p>
          </Section>

          <Section title="3. Data Sharing & Third Parties">
            <p>We may share your information with the following third-party service providers who assist in operating our platform:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong style={{ color: '#f5f0eb' }}>Stripe</strong> — payment processing and subscription management</li>
              <li><strong style={{ color: '#f5f0eb' }}>Supabase</strong> — database management and authentication infrastructure</li>
              <li><strong style={{ color: '#f5f0eb' }}>Analytics providers</strong> — aggregated usage data to improve the Service</li>
              <li><strong style={{ color: '#f5f0eb' }}>Email service providers</strong> — transactional and account-related communications</li>
            </ul>
            <p style={{ marginTop: 12 }}>These providers are contractually obligated to handle your data in accordance with their own privacy policies and applicable law. We only share the minimum information necessary for them to perform their services.</p>
            <p style={{ marginTop: 8 }}>We may also disclose your information if required to do so by law, court order, or governmental request, or if we believe disclosure is necessary to protect our rights, your safety, or the safety of others.</p>
          </Section>

          <Section title="4. Cookies & Tracking">
            <p>We use cookies and similar tracking technologies to enhance your experience. These may include:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong style={{ color: '#f5f0eb' }}>Essential cookies</strong> — required for authentication, session management, and core functionality</li>
              <li><strong style={{ color: '#f5f0eb' }}>Analytics cookies</strong> — help us understand how users interact with the platform</li>
              <li><strong style={{ color: '#f5f0eb' }}>Preference cookies</strong> — store your settings and display preferences</li>
            </ul>
            <p style={{ marginTop: 8 }}>You can control cookie preferences through your browser settings. Disabling certain cookies may limit your ability to use some features of the Service.</p>
          </Section>

          <Section title="5. Data Security">
            <p>We implement industry-standard security measures to protect your personal information, including:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li>SSL/TLS encryption for all data in transit</li>
              <li>Hashed and salted password storage</li>
              <li>Access controls limiting employee access to personal data</li>
              <li>Regular security reviews and monitoring</li>
            </ul>
            <p style={{ marginTop: 8 }}>While we strive to protect your data, no method of transmission over the Internet or electronic storage is 100% secure. We cannot guarantee absolute security, but we are committed to taking reasonable precautions to safeguard your information.</p>
          </Section>

          <Section title="6. Your Rights">
            <p>You have the following rights regarding your personal information:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0' }}>
              <li><strong style={{ color: '#f5f0eb' }}>Access</strong> — request a copy of the personal data we hold about you</li>
              <li><strong style={{ color: '#f5f0eb' }}>Correction</strong> — request correction of inaccurate or incomplete data</li>
              <li><strong style={{ color: '#f5f0eb' }}>Deletion</strong> — request deletion of your personal data, subject to legal retention requirements</li>
              <li><strong style={{ color: '#f5f0eb' }}>Export</strong> — request a portable copy of your data in a commonly used format</li>
              <li><strong style={{ color: '#f5f0eb' }}>Opt-out</strong> — unsubscribe from non-essential communications at any time</li>
            </ul>
            <p style={{ marginTop: 8 }}>To exercise any of these rights, contact us at <a href="mailto:support@flipthecontract.com" style={{ color: '#ff7e5f' }}>support@flipthecontract.com</a>. We will respond to your request within 30 days.</p>
          </Section>

          <Section title="7. Children's Privacy">
            <p>The Service is not directed at individuals under the age of 13. We do not knowingly collect personal information from children under 13. If we become aware that we have inadvertently collected data from a child under 13, we will take steps to delete that information promptly.</p>
            <p style={{ marginTop: 8 }}>If you believe a child under 13 has provided us with personal information, please contact us at <a href="mailto:support@flipthecontract.com" style={{ color: '#ff7e5f' }}>support@flipthecontract.com</a>.</p>
          </Section>

          <Section title="8. Changes to This Policy">
            <p>We reserve the right to update or modify this Privacy Policy at any time. When we make changes, we will update the "Effective Date" at the top of this page and, where appropriate, notify you via email or a prominent notice on the platform.</p>
            <p style={{ marginTop: 8 }}>Your continued use of the Service after any changes constitutes your acceptance of the revised Privacy Policy. We encourage you to review this page periodically for the latest information on our privacy practices.</p>
          </Section>

          <Section title="9. Contact Us">
            <p>If you have any questions or concerns about this Privacy Policy or our data practices, please contact us:</p>
            <ul style={{ paddingLeft: 20, margin: '8px 0', listStyle: 'none' }}>
              <li>Email: <a href="mailto:support@flipthecontract.com" style={{ color: '#ff7e5f' }}>support@flipthecontract.com</a></li>
              <li>Company: Flip The Contract LLC</li>
              <li>Location: Phoenix, Arizona</li>
            </ul>
          </Section>

          <div style={{
            marginTop: 40, padding: 20, background: '#263040', border: '1px solid #3d4e65', borderRadius: 10,
            textAlign: 'center',
          }}>
            <p style={{ fontSize: 13, color: '#888', margin: '0 0 12px' }}>
              By using Flip The Contract, you acknowledge that you have read, understood, and agree to this Privacy Policy.
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
