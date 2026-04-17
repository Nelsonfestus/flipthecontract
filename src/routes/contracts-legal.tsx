import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { FileText, XCircle, Handshake, Scale } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import ContractTemplates from '@/components/sections/ContractTemplates'
import CancellationContracts from '@/components/sections/CancellationContracts'
import JVResources from '@/components/sections/JVResources'
import StateLaws from '@/components/sections/StateLaws'

export const Route = createFileRoute('/contracts-legal')({
  component: ContractsLegalPage,
})

const TABS = [
  { id: 'contracts', label: 'Contract Templates', icon: FileText },
  { id: 'cancellation', label: 'Cancellation Contracts', icon: XCircle },
  { id: 'jv', label: 'JV Resources', icon: Handshake },
  { id: 'laws', label: 'State Laws & Rules', icon: Scale },
]

function ContractsLegalPage() {
  const [activeTab, setActiveTab] = useState('contracts')

  return (
    <SectionLayout
      title="Contracts & Legal"
      subtitle="50-state purchase agreements, assignment contracts, double close agreements, LOIs, cancellation templates, JV resources, and state-by-state wholesaling laws."
      badge="All 50 States"
      badgeColor="orange"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'contracts' && <ContractTemplates />}
      {activeTab === 'cancellation' && <CancellationContracts />}
      {activeTab === 'jv' && <JVResources />}
      {activeTab === 'laws' && <StateLaws />}
    </SectionLayout>
  )
}
