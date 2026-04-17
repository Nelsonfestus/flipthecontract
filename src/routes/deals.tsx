import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Search, ShoppingCart, MessageSquare, Mail, Map } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import SkipTrace from '@/components/sections/SkipTrace'
import BuyLeads from '@/components/sections/BuyLeads'
import SalesScripts from '@/components/sections/SalesScripts'
import MarketingTemplates from '@/components/sections/MarketingTemplates'
import PropertyMap from '@/components/sections/PropertyMap'

export const Route = createFileRoute('/deals')({
  component: DealsPage,
})

const TABS = [
  { id: 'skiptrace', label: 'Skip Trace Tools', icon: Search },
  { id: 'leads', label: 'Buy Leads', icon: ShoppingCart },
  { id: 'scripts', label: 'Sales Scripts', icon: MessageSquare },
  { id: 'marketing', label: 'Marketing Templates', icon: Mail },
  { id: 'propertymap', label: 'Property Map', icon: Map },
]

function DealsPage() {
  const [activeTab, setActiveTab] = useState('skiptrace')

  return (
    <SectionLayout
      title="Finding Deals"
      subtitle="Skip trace tools, motivated seller leads, cold calling scripts, direct mail templates, and an interactive property map to find your next wholesale deal."
      badge="Deal Finding"
      badgeColor="blue"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'skiptrace' && <SkipTrace />}
      {activeTab === 'leads' && <BuyLeads />}
      {activeTab === 'scripts' && <SalesScripts />}
      {activeTab === 'marketing' && <MarketingTemplates />}
      {activeTab === 'propertymap' && <PropertyMap />}
    </SectionLayout>
  )
}
