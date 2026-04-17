import { useState } from 'react'
import { Search, Building, DollarSign, MapPin, TrendingUp } from 'lucide-react'

const STATES_DATA: Record<string, { state: string; buyers: { name: string; type: string; buyBox: string; avgPurchase: string; propertyTypes: string; speed: string }[] }> = {
  TX: {
    state: 'Texas',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT / Institutional', buyBox: 'SFR, 3+ BR, built after 1980, ARV $150K–$350K', avgPurchase: '$180K–$280K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional Fund', buyBox: 'SFR, 3–4 BR, good school districts, ARV $150K–$300K', avgPurchase: '$160K–$260K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Cerberus Capital (FirstKey Homes)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $120K–$250K, minimal rehab', avgPurchase: '$100K–$200K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $175K–$350K', avgPurchase: '$150K–$280K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Pretium Partners (Front Yard)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$275K, light rehab OK', avgPurchase: '$80K–$200K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $180K–$400K, newer builds preferred', avgPurchase: '$200K–$350K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Blackstone (Home Partners)', type: 'Hedge Fund / PE', buyBox: 'SFR, lease-purchase model, ARV $150K–$450K', avgPurchase: '$150K–$350K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$250K, bulk portfolios', avgPurchase: '$90K–$200K', propertyTypes: 'Single Family / Portfolio', speed: '14–30 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & small MF, ARV $80K–$200K, value-add', avgPurchase: '$60K–$150K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $80K–$180K, Class B/C areas', avgPurchase: '$50K–$130K', propertyTypes: 'Single Family', speed: '10–14 days' },
    ],
  },
  FL: {
    state: 'Florida',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT / Institutional', buyBox: 'SFR, 3+ BR, ARV $200K–$400K, no flood zone', avgPurchase: '$180K–$320K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional Fund', buyBox: 'SFR, 3–4 BR, ARV $180K–$350K, newer construction', avgPurchase: '$170K–$300K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Cerberus Capital (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $130K–$280K, light rehab', avgPurchase: '$100K–$220K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1985, ARV $200K–$375K', avgPurchase: '$175K–$300K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $200K–$450K, suburban preferred', avgPurchase: '$200K–$380K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Blackstone (Home Partners)', type: 'Hedge Fund / PE', buyBox: 'SFR, ARV $175K–$500K, A/B neighborhoods', avgPurchase: '$175K–$400K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $120K–$300K, value-add', avgPurchase: '$100K–$240K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Fundrise / Build-to-Rent', type: 'Fund / Tech', buyBox: 'New construction, ARV $250K–$450K, master-planned', avgPurchase: '$220K–$380K', propertyTypes: 'New Build SFR', speed: '21–45 days' },
      { name: 'Mynd Management', type: 'Institutional', buyBox: 'SFR, ARV $150K–$350K, good rent-to-value ratio', avgPurchase: '$120K–$280K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$250K, Class B/C', avgPurchase: '$80K–$190K', propertyTypes: 'Single Family', speed: '7–14 days' },
    ],
  },
  GA: {
    state: 'Georgia',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $150K–$300K, metro Atlanta', avgPurchase: '$140K–$250K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $140K–$280K', avgPurchase: '$130K–$240K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Cerberus (FirstKey Homes)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$220K, light rehab', avgPurchase: '$80K–$170K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & MF, ARV $80K–$200K, value-add', avgPurchase: '$60K–$150K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $70K–$180K, Class B/C', avgPurchase: '$50K–$140K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $175K–$375K', avgPurchase: '$160K–$300K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $90K–$250K, suburban areas', avgPurchase: '$70K–$200K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $80K–$200K, portfolio deals', avgPurchase: '$60K–$160K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $150K–$300K', avgPurchase: '$130K–$260K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $70K–$180K', avgPurchase: '$50K–$130K', propertyTypes: 'Single Family', speed: '7–14 days' },
    ],
  },
  AZ: {
    state: 'Arizona',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $250K–$450K, Phoenix metro', avgPurchase: '$220K–$380K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $200K–$400K', avgPurchase: '$180K–$340K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $250K–$500K', avgPurchase: '$230K–$420K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $225K–$400K', avgPurchase: '$200K–$350K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Blackstone (Home Partners)', type: 'Hedge Fund / PE', buyBox: 'SFR, ARV $200K–$500K, A/B areas', avgPurchase: '$200K–$450K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, ARV $150K–$300K, light rehab', avgPurchase: '$120K–$250K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $150K–$350K', avgPurchase: '$120K–$280K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Mynd Management', type: 'Institutional', buyBox: 'SFR, ARV $175K–$375K, good rent yield', avgPurchase: '$150K–$300K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'NexPoint Residential', type: 'REIT', buyBox: 'MF & SFR, ARV $200K–$400K', avgPurchase: '$180K–$350K', propertyTypes: 'Multi / SFR', speed: '14–30 days' },
      { name: 'Roofstock (Institutional)', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $150K–$350K', avgPurchase: '$130K–$280K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  OH: {
    state: 'Ohio',
    buyers: [
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $60K–$150K, Class B/C', avgPurchase: '$40K–$110K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & small MF, ARV $50K–$150K, value-add', avgPurchase: '$35K–$100K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $80K–$180K', avgPurchase: '$60K–$140K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $70K–$200K, Columbus/Cincinnati metro', avgPurchase: '$50K–$150K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $60K–$160K, bulk portfolios', avgPurchase: '$40K–$120K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $120K–$250K', avgPurchase: '$100K–$200K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $120K–$280K', avgPurchase: '$100K–$220K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$140K', avgPurchase: '$35K–$100K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'JWB Real Estate Capital', type: 'Fund', buyBox: 'SFR, turnkey ready, ARV $80K–$200K', avgPurchase: '$60K–$150K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $70K–$180K', avgPurchase: '$50K–$140K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  NC: {
    state: 'North Carolina',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $175K–$350K, Charlotte/Raleigh', avgPurchase: '$150K–$290K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $160K–$320K', avgPurchase: '$140K–$270K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $200K–$400K', avgPurchase: '$180K–$340K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $175K–$325K', avgPurchase: '$160K–$280K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, ARV $120K–$260K, light rehab', avgPurchase: '$100K–$210K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$280K', avgPurchase: '$80K–$220K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & small MF, ARV $80K–$200K', avgPurchase: '$60K–$160K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'Blackstone (Home Partners)', type: 'Hedge Fund / PE', buyBox: 'SFR, ARV $175K–$450K, A/B areas', avgPurchase: '$175K–$380K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Mynd Management', type: 'Institutional', buyBox: 'SFR, ARV $140K–$300K, rent yield focus', avgPurchase: '$120K–$260K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $80K–$200K', avgPurchase: '$60K–$160K', propertyTypes: 'Single Family', speed: '7–14 days' },
    ],
  },
  IN: {
    state: 'Indiana',
    buyers: [
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $60K–$150K', avgPurchase: '$40K–$110K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & MF, ARV $50K–$140K, value-add', avgPurchase: '$35K–$100K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $80K–$180K', avgPurchase: '$60K–$140K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $60K–$150K, bulk deals', avgPurchase: '$40K–$110K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $100K–$220K', avgPurchase: '$90K–$180K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $70K–$180K, Indianapolis metro', avgPurchase: '$50K–$140K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$130K', avgPurchase: '$35K–$95K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $120K–$250K', avgPurchase: '$100K–$200K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'JWB Real Estate Capital', type: 'Fund', buyBox: 'SFR, turnkey, ARV $70K–$180K', avgPurchase: '$50K–$130K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $60K–$160K', avgPurchase: '$45K–$120K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  MO: {
    state: 'Missouri',
    buyers: [
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $60K–$140K', avgPurchase: '$40K–$100K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & small MF, ARV $50K–$130K', avgPurchase: '$35K–$90K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $70K–$170K', avgPurchase: '$50K–$130K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $60K–$170K, KC/STL metro', avgPurchase: '$45K–$130K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $50K–$140K, portfolios', avgPurchase: '$35K–$100K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $100K–$220K', avgPurchase: '$90K–$180K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$120K', avgPurchase: '$35K–$85K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $110K–$240K', avgPurchase: '$95K–$200K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'JWB Real Estate Capital', type: 'Fund', buyBox: 'SFR, turnkey, ARV $60K–$160K', avgPurchase: '$45K–$120K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $55K–$150K', avgPurchase: '$40K–$110K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  CO: {
    state: 'Colorado',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $300K–$550K, Denver metro', avgPurchase: '$270K–$470K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $300K–$600K', avgPurchase: '$280K–$500K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $250K–$450K', avgPurchase: '$230K–$380K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $275K–$475K', avgPurchase: '$250K–$400K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Blackstone (Home Partners)', type: 'Hedge Fund / PE', buyBox: 'SFR, ARV $275K–$600K, A/B areas', avgPurchase: '$275K–$500K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $200K–$400K', avgPurchase: '$170K–$330K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, ARV $180K–$350K, light rehab', avgPurchase: '$150K–$280K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Mynd Management', type: 'Institutional', buyBox: 'SFR, ARV $225K–$425K, rent yield', avgPurchase: '$200K–$360K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'NexPoint Residential', type: 'REIT', buyBox: 'MF & SFR, ARV $250K–$500K', avgPurchase: '$230K–$420K', propertyTypes: 'Multi / SFR', speed: '14–30 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $200K–$400K', avgPurchase: '$180K–$340K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  MI: {
    state: 'Michigan',
    buyers: [
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$140K', avgPurchase: '$30K–$100K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & MF, ARV $40K–$120K, value-add', avgPurchase: '$25K–$80K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $70K–$160K', avgPurchase: '$50K–$120K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $50K–$130K, bulk/portfolio', avgPurchase: '$30K–$90K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $60K–$160K, Detroit metro suburbs', avgPurchase: '$40K–$120K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $100K–$220K', avgPurchase: '$85K–$180K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $40K–$120K', avgPurchase: '$25K–$85K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $100K–$230K', avgPurchase: '$85K–$190K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'JWB Real Estate Capital', type: 'Fund', buyBox: 'SFR, turnkey, ARV $60K–$150K', avgPurchase: '$40K–$110K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $50K–$140K', avgPurchase: '$35K–$100K', propertyTypes: 'Single Family', speed: '14–21 days' },
    ],
  },
  TN: {
    state: 'Tennessee',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $175K–$350K, Nashville metro', avgPurchase: '$150K–$290K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $150K–$300K', avgPurchase: '$130K–$260K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'American Homes 4 Rent', type: 'REIT', buyBox: 'SFR, 3–5 BR, ARV $200K–$400K', avgPurchase: '$180K–$340K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $100K–$240K', avgPurchase: '$80K–$190K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $90K–$250K, Memphis/Nashville', avgPurchase: '$70K–$200K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Tricon Residential', type: 'Institutional', buyBox: 'SFR, built after 1990, ARV $160K–$320K', avgPurchase: '$140K–$270K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & small MF, ARV $70K–$180K', avgPurchase: '$50K–$140K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $60K–$160K', avgPurchase: '$40K–$120K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $70K–$170K', avgPurchase: '$50K–$130K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Mynd Management', type: 'Institutional', buyBox: 'SFR, ARV $130K–$280K, rent yield', avgPurchase: '$110K–$240K', propertyTypes: 'Single Family', speed: '10–21 days' },
    ],
  },
  PA: {
    state: 'Pennsylvania',
    buyers: [
      { name: 'Invitation Homes', type: 'REIT', buyBox: 'SFR, 3+ BR, ARV $150K–$300K', avgPurchase: '$130K–$250K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Progress Residential', type: 'Institutional', buyBox: 'SFR, 3–4 BR, ARV $120K–$280K', avgPurchase: '$100K–$230K', propertyTypes: 'Single Family', speed: '10–21 days' },
      { name: 'Cerberus (FirstKey)', type: 'Hedge Fund', buyBox: 'SFR, 3+ BR, ARV $80K–$200K', avgPurchase: '$60K–$160K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'Pretium Partners', type: 'Hedge Fund', buyBox: 'SFR, ARV $70K–$220K, Philly/Pittsburgh', avgPurchase: '$50K–$170K', propertyTypes: 'Single Family', speed: '14–28 days' },
      { name: 'Amherst Holdings', type: 'Hedge Fund', buyBox: 'SFR, ARV $60K–$180K, portfolio deals', avgPurchase: '$40K–$140K', propertyTypes: 'SFR / Portfolio', speed: '14–30 days' },
      { name: 'Haven Realty Capital', type: 'Institutional', buyBox: 'SFR & MF, ARV $50K–$160K, value-add', avgPurchase: '$35K–$120K', propertyTypes: 'SFR / Small Multi', speed: '7–14 days' },
      { name: 'VineBrook Homes', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$140K', avgPurchase: '$30K–$100K', propertyTypes: 'Single Family', speed: '10–14 days' },
      { name: 'Sylvan Road Capital', type: 'Institutional Fund', buyBox: 'SFR, 3+ BR, ARV $50K–$140K', avgPurchase: '$30K–$100K', propertyTypes: 'Single Family', speed: '7–14 days' },
      { name: 'Roofstock', type: 'Fund / Tech', buyBox: 'SFR, tenant-occupied, ARV $70K–$180K', avgPurchase: '$50K–$140K', propertyTypes: 'Single Family', speed: '14–21 days' },
      { name: 'JWB Real Estate Capital', type: 'Fund', buyBox: 'SFR, turnkey, ARV $60K–$170K', avgPurchase: '$45K–$130K', propertyTypes: 'Single Family', speed: '10–21 days' },
    ],
  },
}

const STATE_KEYS = Object.keys(STATES_DATA)

export default function HedgeFundBuyers() {
  const [selectedState, setSelectedState] = useState('TX')
  const [search, setSearch] = useState('')

  const data = STATES_DATA[selectedState]
  const filtered = data.buyers.filter(b =>
    b.name.toLowerCase().includes(search.toLowerCase()) ||
    b.type.toLowerCase().includes(search.toLowerCase()) ||
    b.buyBox.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div>
      <h2 className="section-header">Hedge Fund & Institutional Buyers</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 8, lineHeight: 1.7 }}>
        Top 10 institutional and hedge fund cash buyers actively acquiring properties in each wholesale-friendly state. Use their buy box criteria to match deals and close faster.
      </p>
      <div className="info-tip" style={{ marginBottom: 24 }}>
        <p style={{ fontSize: 12, color: '#8fc9a3', margin: 0 }}>
          <strong>Pro Tip:</strong> Always verify current buy box criteria directly with each buyer's acquisitions team — criteria can change quarterly based on market conditions and portfolio strategy.
        </p>
      </div>

      {/* State selector */}
      <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', marginBottom: 20 }}>
        {STATE_KEYS.map(key => (
          <button
            key={key}
            onClick={() => { setSelectedState(key); setSearch('') }}
            style={{
              padding: '8px 16px',
              borderRadius: 6,
              border: selectedState === key ? '1px solid #ff7e5f' : '1px solid #3d4e65',
              background: selectedState === key ? 'rgba(244,126,95,0.15)' : 'transparent',
              color: selectedState === key ? '#ff7e5f' : '#888',
              cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              fontSize: 13,
              fontWeight: 600,
              transition: 'all 0.2s',
            }}
          >
            <MapPin size={12} style={{ display: 'inline', verticalAlign: '-1px', marginRight: 4 }} />
            {STATES_DATA[key].state}
          </button>
        ))}
      </div>

      {/* Search */}
      <div style={{ position: 'relative', marginBottom: 20 }}>
        <Search size={16} color="#888" style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)' }} />
        <input
          className="input-dark"
          placeholder="Search buyers, types, or criteria..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ paddingLeft: 38 }}
        />
      </div>

      <div style={{ fontSize: 12, color: '#888', marginBottom: 16 }}>
        Showing {filtered.length} buyers in <strong style={{ color: '#ff7e5f' }}>{data.state}</strong>
      </div>

      {/* Buyers list */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filtered.map((buyer, i) => (
          <div key={buyer.name} className="resource-card" style={{ borderRadius: 10, padding: 20 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              <div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 14, color: '#555', width: 24 }}>#{i + 1}</span>
                  <Building size={16} color="#ff7e5f" />
                  <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                    {buyer.name}
                  </span>
                </div>
                <span className="badge badge-orange" style={{ marginLeft: 0 }}>{buyer.type}</span>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#5cb885', fontSize: 12, fontWeight: 600 }}>
                <TrendingUp size={14} />
                Close: {buyer.speed}
              </div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 12, marginLeft: 0 }}>
              <div>
                <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Buy Box</div>
                <div style={{ fontSize: 13, color: '#aaa', lineHeight: 1.6 }}>{buyer.buyBox}</div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Avg Purchase Range</div>
                <div style={{ fontSize: 13, color: '#ff7e5f', fontWeight: 600 }}>
                  <DollarSign size={13} style={{ display: 'inline', verticalAlign: '-2px' }} />
                  {buyer.avgPurchase.replace('$', '')}
                </div>
              </div>
              <div>
                <div style={{ fontSize: 11, color: '#666', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Property Types</div>
                <div style={{ fontSize: 13, color: '#aaa' }}>{buyer.propertyTypes}</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '40px 0', color: '#555', fontSize: 14 }}>
          No buyers found matching "{search}"
        </div>
      )}
    </div>
  )
}
