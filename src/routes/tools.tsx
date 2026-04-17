import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Zap, LayoutGrid, ArrowRightLeft, DollarSign, Phone, Star, History } from 'lucide-react'
import SectionLayout from '@/components/SectionLayout'
import QuickOfferCalc from '@/components/sections/QuickOfferCalc'
import MultiFamilyCalc from '@/components/sections/MultiFamilyCalc'
import InvestmentStrategyCalc from '@/components/sections/InvestmentStrategyCalc'
import FundingSources from '@/components/sections/FundingSources'
import BookingCall from '@/components/sections/BookingCall'
import Reviews from '@/components/sections/Reviews'
import CalculatorHistory from '@/components/sections/CalculatorHistory'

export const Route = createFileRoute('/tools')({
  component: ToolsPage,
})

const TABS = [
  { id: 'quickoffer', label: 'Quick Offer Calculator', icon: Zap },
  { id: 'multifamily', label: 'Multi-Family Calculator', icon: LayoutGrid },
  { id: 'investstrategy', label: 'Investment Strategy Calc', icon: ArrowRightLeft },
  { id: 'funding', label: 'Funding Sources', icon: DollarSign },
  { id: 'booking', label: '1-on-1 Call Booking', icon: Phone },
  { id: 'reviews', label: 'Reviews', icon: Star },
  { id: 'calchistory', label: 'Saved Analyses', icon: History },
]

function ToolsPage() {
  const [activeTab, setActiveTab] = useState('quickoffer')

  return (
    <SectionLayout
      title="Tools & Finance"
      subtitle="Investment calculators, transactional funding sources, hard money lenders, 1-on-1 coaching calls, and community reviews."
      badge="Power Tools"
      badgeColor="purple"
      tabs={TABS}
      activeTab={activeTab}
      onTabChange={setActiveTab}
    >
      {activeTab === 'quickoffer' && <QuickOfferCalc />}
      {activeTab === 'multifamily' && <MultiFamilyCalc />}
      {activeTab === 'investstrategy' && <InvestmentStrategyCalc />}
      {activeTab === 'funding' && <FundingSources />}
      {activeTab === 'booking' && <BookingCall />}
      {activeTab === 'reviews' && <Reviews />}
      {activeTab === 'calchistory' && <CalculatorHistory />}
    </SectionLayout>
  )
}
