import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Building, Landmark, Send, Building2, Mail } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import HedgeFundBuyers from '@/components/sections/HedgeFundBuyers'
import InvestmentBrokerages from '@/components/sections/InvestmentBrokerages'
import BuyerTemplate from '@/components/sections/BuyerTemplate'
import TitleCompanies from '@/components/sections/TitleCompanies'
import DispositionEmails from '@/components/sections/DispositionEmails'

export const Route = createFileRoute('/buyers')({
  component: BuyersPage,
})

const TABS = [
  { id: 'hedgefund', label: 'Hedge Fund Buyers', icon: Building },
  { id: 'brokerages', label: 'Investment Brokerages', icon: Landmark },
  { id: 'buyertemplate', label: 'Deal Analyzer', icon: Send },
  { id: 'disposition', label: 'Disposition Emails', icon: Mail },
  { id: 'title', label: 'Title Companies', icon: Building2 },
]

function BuyersPage() {
  const [activeTab, setActiveTab] = useState('hedgefund')

  return (
    <SectionLayout
      title="Buyers & Closing"
      subtitle="Institutional buyer lists, hedge fund contacts, investment brokerages, deal analyzers, and title company resources to close your wholesale deals."
      badge="Cash Buyers"
      badgeColor="gold"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'hedgefund' && <HedgeFundBuyers />}
      {activeTab === 'brokerages' && <InvestmentBrokerages />}
      {activeTab === 'buyertemplate' && <BuyerTemplate />}
      {activeTab === 'disposition' && <DispositionEmails />}
      {activeTab === 'title' && <TitleCompanies />}
    </SectionLayout>
  )
}
