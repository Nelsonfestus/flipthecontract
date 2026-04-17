import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Flame, GraduationCap, BookOpen, ClipboardCheck } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import DailyMotivation from '@/components/sections/DailyMotivation'
import WholesaleGlossary from '@/components/sections/WholesaleGlossary'
import KeyVerbiage from '@/components/sections/KeyVerbiage'
import DealChecklist from '@/components/sections/DealChecklist'

export const Route = createFileRoute('/getting-started')({
  component: GettingStartedPage,
})

const TABS = [
  { id: 'motivation', label: 'Daily Motivation', icon: Flame },
  { id: 'glossary', label: 'Wholesale Glossary', icon: GraduationCap },
  { id: 'verbiage', label: 'Key Verbiage', icon: BookOpen },
  { id: 'checklist', label: 'Deal Checklist', icon: ClipboardCheck },
]

function GettingStartedPage() {
  const [activeTab, setActiveTab] = useState('motivation')

  return (
    <SectionLayout
      title="Getting Started"
      subtitle="Daily tips, essential terminology, key verbiage for negotiations, and a step-by-step deal checklist."
      badge="Beginner Friendly"
      badgeColor="green"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'motivation' && <DailyMotivation />}
      {activeTab === 'glossary' && <WholesaleGlossary />}
      {activeTab === 'verbiage' && <KeyVerbiage />}
      {activeTab === 'checklist' && <DealChecklist />}
    </SectionLayout>
  )
}
