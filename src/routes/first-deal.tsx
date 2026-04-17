import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Sparkles } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import FirstDealWizard from '@/components/sections/FirstDealWizard'

export const Route = createFileRoute('/first-deal')({
  component: FirstDealPage,
})

const TABS = [
  { id: 'wizard', label: 'Deal Wizard', icon: Sparkles },
]

function FirstDealPage() {
  const [activeTab, setActiveTab] = useState('wizard')

  return (
    <SectionLayout
      title="First Deal in 15 Days"
      subtitle="A guided step-by-step workflow to go from choosing your market to sending your first buyer outreach. Complete each step to build toward your first wholesale deal."
      badge="Guided Workflow"
      badgeColor="orange"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      <FirstDealWizard />
    </SectionLayout>
  )
}
