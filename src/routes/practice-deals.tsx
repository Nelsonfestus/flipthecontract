import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Gamepad2, Phone } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import PracticeDeal from '@/components/sections/PracticeDeal'
import ScriptCoach from '@/components/sections/ScriptCoach'

export const Route = createFileRoute('/practice-deals')({
  component: PracticeDealsPage,
})

const TABS = [
  { id: 'simulator', label: 'Deal Simulator', icon: Gamepad2 },
  { id: 'script-coach', label: 'Script Coach', icon: Phone },
]

function PracticeDealsPage() {
  const [activeTab, setActiveTab] = useState('simulator')

  return (
    <SectionLayout
      title="Practice Deals"
      subtitle="Simulate the entire wholesale process — find leads, run numbers, write contracts, find buyers, and close — all without risking real money. Like a video game for wholesale education."
      badge="Simulator"
      badgeColor="purple"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'simulator' && <PracticeDeal />}
      {activeTab === 'script-coach' && <ScriptCoach />}
    </SectionLayout>
  )
}
