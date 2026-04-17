import { useState } from 'react'
import { Search, Building2, MapPin, Globe, Phone, ExternalLink, Star } from 'lucide-react'

interface Brokerage {
  name: string
  specialty: string
  services: string
  markets: string
  website: string
  phone: string
  description: string
  bestPick?: boolean
}

// Best investment brokerage pick for each of the 28 serviced states
const BEST_PICKS: Record<string, Brokerage> = {
  AL: { name: 'Express HomeBuyers', bestPick: true, specialty: 'Cash Offer Investor Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Quick Cash Offers', markets: 'Birmingham, Huntsville, Mobile, Montgomery', website: 'expresshomebuyers.com', phone: '(877) 804-5252', description: 'Established investor-focused brokerage specializing in quick cash transactions for distressed, inherited, and off-market properties. Over 20 years of experience working with local investors on acquisitions, flips, and wholesale deals across Alabama.' },
  AK: { name: 'Keller Williams Realty Alaska Group', bestPick: true, specialty: 'Full-Service Investor Brokerage', services: 'Acquisitions, Rentals, Flipping, Portfolio Building', markets: 'Anchorage, Fairbanks, Wasilla, Kenai Peninsula', website: 'kw.com', phone: '(907) 694-4647', description: 'Alaska\'s largest real estate brokerage with a dedicated investor division. Provides investor-focused services including off-market deal sourcing, rental property acquisitions, and fix-and-flip support in Alaska\'s unique market.' },
  AZ: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Phoenix, East Valley, West Valley, Scottsdale, Mesa, Chandler', website: 'networthrealtyusa.com', phone: '(480) 405-4777', description: 'Investor-only brokerage with multiple Phoenix-area offices. Uses the True Value Method to help investors find, fund, renovate, and sell or lease properties. Over 30 years of combined experience in Arizona\'s investor market.' },
  AR: { name: 'Crye-Leike Real Estate Services', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Little Rock, Fayetteville, Fort Smith, Jonesboro', website: 'crye-leike.com', phone: '(800) 552-5380', description: 'One of the largest independent real estate firms in the South with strong Arkansas roots. Dedicated investor services division helps with acquisitions, rental properties, and fix-and-flip opportunities across all Arkansas markets.' },
  CO: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Denver, Aurora, Lakewood, Colorado Springs', website: 'networthrealtyusa.com', phone: '(720) 903-2525', description: 'Denver-based investor-only brokerage focused exclusively on real estate investors. Provides distressed and off-market property sourcing, renovation consultation, and lending partnerships through 212Loans for Colorado investors.' },
  FL: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Orlando, Tampa, Bradenton, St. Petersburg, Jacksonville', website: 'networthrealtyusa.com', phone: '(407) 955-4440', description: 'Investor-only brokerage with offices in Orlando and the Tampa Bay metro. Specializes in sourcing distressed and value-add properties for Florida investors focused on flips, wholesale assignments, and rental portfolios.' },
  GA: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Atlanta, Marietta, Decatur, Roswell, Sandy Springs', website: 'networthrealtyusa.com', phone: '(404) 891-7777', description: 'Atlanta-based investor-only brokerage dedicated to helping real estate investors build wealth. Sources off-market and distressed properties throughout metro Atlanta for fix-and-flip, wholesale, and buy-and-hold strategies.' },
  ID: { name: 'Silvercreek Realty Group', bestPick: true, specialty: 'Independent Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Land Investments', markets: 'Boise, Meridian, Nampa, Eagle, Caldwell', website: 'silvercreekrealty.com', phone: '(208) 377-0422', description: 'Idaho\'s largest independent real estate brokerage, headquartered in Boise. Strong investor services program with dedicated agents specializing in investment properties, rental acquisitions, and fix-and-flip deals in the booming Treasure Valley market.' },
  IL: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Chicago, Naperville, Aurora, Joliet, Elgin', website: 'networthrealtyusa.com', phone: '(312) 546-4747', description: 'Chicago-based investor-only brokerage focused on sourcing distressed and value-add properties for Chicagoland investors. Provides renovation estimates, funding partnerships, and full transaction support for flips and wholesale deals.' },
  IN: { name: 'Carpenter Realtors', bestPick: true, specialty: 'Full-Service Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Indianapolis, Carmel, Fishers, Bloomington, Fort Wayne', website: 'carpenterrealtors.com', phone: '(317) 573-7777', description: 'Indiana\'s largest independent real estate firm with deep roots in the Indianapolis investment market. Dedicated investment property division assists investors with acquisitions, rental portfolios, and flip opportunities in Indiana\'s affordable, high-yield markets.' },
  KY: { name: 'Berkshire Hathaway HomeServices Parks & Weisberg', bestPick: true, specialty: 'Premier Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Commercial Investments', markets: 'Louisville, Lexington, Bowling Green, Elizabethtown', website: 'parksweisberg.com', phone: '(502) 425-6000', description: 'Louisville\'s premier real estate brokerage with a dedicated investor services team. Specializes in connecting investors with off-market properties, distressed assets, and rental opportunities across Kentucky\'s growing markets.' },
  LA: { name: 'LATTER & BLUM', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Commercial Investments', markets: 'New Orleans, Baton Rouge, Lafayette, Shreveport, Metairie', website: 'latter-blum.com', phone: '(504) 866-0066', description: 'Louisiana\'s largest independent real estate company, founded in 1916. Extensive investor services including off-market property sourcing, rental acquisitions, and renovation project support. Deep expertise in Louisiana\'s unique Napoleonic Code real estate system.' },
  MD: { name: 'Express HomeBuyers', bestPick: true, specialty: 'Cash Offer Investor Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Quick Cash Offers', markets: 'Baltimore, Silver Spring, Columbia, Annapolis, Bethesda', website: 'expresshomebuyers.com', phone: '(877) 804-5252', description: 'Top investor-focused brokerage in the DC/Baltimore corridor with over 20 years of experience. Specializes in distressed property acquisitions, quick cash offers, and connecting wholesale investors with off-market deals across Maryland.' },
  MI: { name: 'Howard Hanna Real Estate Services', bestPick: true, specialty: 'Full-Service Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Detroit, Grand Rapids, Ann Arbor, Lansing, Flint', website: 'howardhanna.com', phone: '(313) 886-5040', description: 'One of the largest real estate companies in the Midwest with strong Michigan market coverage. Dedicated investor services team helps with acquisitions, rental properties, and fix-and-flip opportunities in Detroit and statewide markets.' },
  MN: { name: 'RE/MAX Results', bestPick: true, specialty: 'Investor-Friendly Brokerage', services: 'Acquisitions, Rentals, Flipping, Multi-Family', markets: 'Minneapolis, St. Paul, Bloomington, Plymouth, Edina', website: 'results.net', phone: '(952) 829-2900', description: 'Minnesota\'s largest RE/MAX franchise and the state\'s top-producing brokerage. Extensive investor network with agents specializing in investment properties, rental acquisitions, and fix-and-flip deals across the Twin Cities metro.' },
  MS: { name: 'Nix-Tann & Associates', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Land Investments', markets: 'Jackson, Ridgeland, Madison, Brandon, Hattiesburg', website: 'nixtann.com', phone: '(601) 856-1100', description: 'Central Mississippi\'s premier real estate brokerage specializing in investment property sales. Strong local market expertise helps investors identify undervalued properties and distressed assets for wholesale and flip strategies in Mississippi\'s affordable markets.' },
  MO: { name: 'Reece Nichols Real Estate', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Multi-Family', markets: 'Kansas City, St. Louis, Springfield, Independence', website: 'reecenichols.com', phone: '(816) 333-3550', description: 'Kansas City\'s premier real estate brokerage and one of Missouri\'s largest. Dedicated investor services team specializes in off-market deal sourcing, rental property acquisitions, and connecting investors with wholesale and flip opportunities.' },
  NV: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Las Vegas, Henderson, North Las Vegas, Summerlin', website: 'networthrealtyusa.com', phone: '(702) 605-7575', description: 'Las Vegas-based investor-only brokerage with multiple Nevada offices. Focuses exclusively on connecting real estate investors with distressed, off-market, and value-add properties for flips, wholesale deals, and rental portfolios.' },
  NC: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Charlotte, Raleigh, Durham, Greensboro, Winston-Salem', website: 'networthrealtyusa.com', phone: '(704) 684-5050', description: 'Charlotte-based investor-only brokerage serving North Carolina\'s fastest-growing markets. Sources off-market and distressed properties for investors focused on fix-and-flip, wholesale assignments, and buy-and-hold rental strategies.' },
  OH: { name: 'Howard Hanna Real Estate Services', bestPick: true, specialty: 'Full-Service Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Columbus, Cleveland, Cincinnati, Akron, Dayton', website: 'howardhanna.com', phone: '(216) 447-4477', description: 'Ohio\'s largest real estate brokerage with comprehensive investor services. Dedicated investment team assists with acquisitions, rental portfolios, and flip opportunities across Ohio\'s affordable, high-yield markets — especially Cleveland and Columbus.' },
  OK: { name: 'Chinowth & Cohen Realtors', bestPick: true, specialty: 'Independent Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Commercial Investments', markets: 'Oklahoma City, Tulsa, Norman, Edmond, Broken Arrow', website: 'chinowthcohen.com', phone: '(918) 392-9900', description: 'Oklahoma\'s largest independent real estate brokerage with deep investor market expertise. Provides comprehensive investor services including off-market property sourcing, rental acquisitions, and flip deal analysis across all Oklahoma markets.' },
  PA: { name: 'Express HomeBuyers', bestPick: true, specialty: 'Cash Offer Investor Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Quick Cash Offers', markets: 'Philadelphia, Pittsburgh, Allentown, Harrisburg, Lehigh Valley', website: 'expresshomebuyers.com', phone: '(877) 804-5252', description: 'Established investor-focused brokerage with strong presence across Pennsylvania. Specializes in distressed property acquisitions, quick cash transactions, and connecting wholesale investors with off-market deals in Philadelphia and Pittsburgh metros.' },
  SC: { name: 'Jeff Cook Real Estate', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Charleston, Columbia, Greenville, Myrtle Beach, Rock Hill', website: 'jeffcookrealestate.com', phone: '(843) 564-1200', description: 'South Carolina\'s largest independent real estate team with strong investor focus. Extensive network helps investors find off-market properties, distressed assets, and rental opportunities across South Carolina\'s growing coastal and metro markets.' },
  TN: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Nashville, Franklin, Murfreesboro, Hendersonville', website: 'networthrealtyusa.com', phone: '(615) 988-5858', description: 'Nashville-based investor-only brokerage serving Tennessee\'s hottest investment market. Sources off-market and distressed properties exclusively for real estate investors focused on flips, wholesale deals, and rental portfolios in the Nashville metro.' },
  TX: { name: 'NetWorth Realty', bestPick: true, specialty: 'Investor-Only Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Renovations', markets: 'Dallas, Houston, San Antonio, Austin, Fort Worth, New Braunfels', website: 'networthrealtyusa.com', phone: '(214) 295-4046', description: 'Texas\'s premier investor-only brokerage with 7+ offices statewide. Founded on the True Value Method — helping investors find, fund, renovate, and sell or lease investment properties. Partnered with 212Loans for investor financing across all major Texas metros.' },
  UT: { name: 'Equity Real Estate', bestPick: true, specialty: 'Independent Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Multi-Family', markets: 'Salt Lake City, Provo, Ogden, St. George, Park City', website: 'equityrealestate.com', phone: '(801) 947-8300', description: 'Utah\'s largest independent real estate brokerage with a strong investor services division. Helps investors navigate Salt Lake City\'s competitive market with off-market deal sourcing, rental acquisitions, and fix-and-flip support across the Wasatch Front.' },
  VA: { name: 'Express HomeBuyers', bestPick: true, specialty: 'Cash Offer Investor Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Quick Cash Offers', markets: 'Virginia Beach, Richmond, Norfolk, Arlington, Alexandria', website: 'expresshomebuyers.com', phone: '(877) 804-5252', description: 'Top investor-focused brokerage in Virginia with over 20 years of experience. Headquartered in the DC metro area, specializes in distressed property acquisitions, quick cash offers, and connecting wholesale investors with off-market deals statewide.' },
  WI: { name: 'Shorewest Realtors', bestPick: true, specialty: 'Regional Investment Brokerage', services: 'Acquisitions, Rentals, Flipping, Property Management', markets: 'Milwaukee, Madison, Waukesha, Racine, Green Bay', website: 'shorewest.com', phone: '(414) 747-7000', description: 'Wisconsin\'s largest independent real estate company with dedicated investor services. Extensive Milwaukee market expertise helps investors find off-market properties, distressed assets, and rental opportunities. Full-service support from acquisition through property management.' },
}

const STATES_DATA: Record<string, { state: string; brokerages: Brokerage[] }> = {
  AL: {
    state: 'Alabama',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Birmingham, Huntsville, Montgomery', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Birmingham, Mobile, Tuscaloosa', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  AK: {
    state: 'Alaska',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Anchorage, Fairbanks', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Anchorage metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  AZ: {
    state: 'Arizona',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Phoenix, Tucson, Mesa, Scottsdale, Chandler', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Phoenix, Tucson, Mesa, Tempe', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Phoenix metro, Tucson (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  AR: {
    state: 'Arkansas',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Little Rock, Fayetteville, Fort Smith', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Little Rock, Northwest Arkansas', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  CA: {
    state: 'California',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Los Angeles, San Diego, Sacramento, Riverside, San Bernardino', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Los Angeles, San Diego, Sacramento, Bay Area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Los Angeles, Sacramento, Inland Empire (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  CO: {
    state: 'Colorado',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Denver, Colorado Springs, Aurora, Fort Collins', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Denver metro, Colorado Springs', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Denver metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  CT: {
    state: 'Connecticut',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Hartford, New Haven, Bridgeport', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Hartford, New Haven, Fairfield County', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  DE: {
    state: 'Delaware',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Wilmington, Dover, Newark', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Wilmington metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  FL: {
    state: 'Florida',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Miami, Tampa, Orlando, Jacksonville, Fort Lauderdale', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Miami, Tampa, Orlando, Jacksonville, Fort Myers', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Tampa, Orlando, Jacksonville (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  GA: {
    state: 'Georgia',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Atlanta, Savannah, Augusta, Marietta', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Atlanta metro, Savannah, Augusta', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Atlanta metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  HI: {
    state: 'Hawaii',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Honolulu, Maui', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Honolulu', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  ID: {
    state: 'Idaho',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Boise, Meridian, Nampa', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Boise metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Boise metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  IL: {
    state: 'Illinois',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Chicago, Aurora, Rockford, Naperville', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Chicago metro, Springfield, Peoria', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Chicago metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  IN: {
    state: 'Indiana',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Indianapolis, Fort Wayne, Evansville', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Indianapolis, Fort Wayne, South Bend', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Indianapolis metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  IA: {
    state: 'Iowa',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Des Moines, Cedar Rapids, Davenport', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Des Moines, Cedar Rapids', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  KS: {
    state: 'Kansas',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Kansas City, Wichita, Topeka', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Kansas City metro, Wichita', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Kansas City metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  KY: {
    state: 'Kentucky',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Louisville, Lexington, Bowling Green', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Louisville, Lexington', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  LA: {
    state: 'Louisiana',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'New Orleans, Baton Rouge, Shreveport', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'New Orleans, Baton Rouge, Shreveport', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  ME: {
    state: 'Maine',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Portland, Bangor, Lewiston', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Portland metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MD: {
    state: 'Maryland',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Baltimore, Bethesda, Silver Spring, Columbia', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Baltimore, D.C. suburbs, Annapolis', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Baltimore metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MA: {
    state: 'Massachusetts',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Boston, Worcester, Springfield', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Boston metro, Worcester, Springfield', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MI: {
    state: 'Michigan',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Detroit, Grand Rapids, Ann Arbor, Lansing', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Detroit metro, Grand Rapids, Flint', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Detroit metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MN: {
    state: 'Minnesota',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Minneapolis, St. Paul, Rochester', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Twin Cities metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Twin Cities metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MS: {
    state: 'Mississippi',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Jackson, Gulfport, Hattiesburg', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Jackson, Gulfport', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MO: {
    state: 'Missouri',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Kansas City, St. Louis, Springfield', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Kansas City, St. Louis, Springfield', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Kansas City, St. Louis (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  MT: {
    state: 'Montana',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Billings, Missoula, Great Falls', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Billings, Missoula', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NE: {
    state: 'Nebraska',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Omaha, Lincoln', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Omaha, Lincoln', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Omaha metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NV: {
    state: 'Nevada',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Las Vegas, Henderson, Reno', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Las Vegas, Henderson, Reno', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Las Vegas metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NH: {
    state: 'New Hampshire',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Manchester, Nashua, Concord', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Manchester, Nashua', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NJ: {
    state: 'New Jersey',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Newark, Jersey City, Paterson, Trenton', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Northern NJ, Central NJ, Camden', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NM: {
    state: 'New Mexico',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Albuquerque, Santa Fe, Las Cruces', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Albuquerque, Santa Fe', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NY: {
    state: 'New York',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'New York City, Buffalo, Rochester, Syracuse', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'NYC metro, Long Island, Westchester, Buffalo', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'NYC metro, Upstate NY (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  NC: {
    state: 'North Carolina',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Charlotte, Raleigh, Durham, Greensboro', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Charlotte, Raleigh-Durham, Greensboro', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Charlotte, Raleigh (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  ND: {
    state: 'North Dakota',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Fargo, Bismarck, Grand Forks', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Fargo, Bismarck', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  OH: {
    state: 'Ohio',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Columbus, Cleveland, Cincinnati, Dayton', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Columbus, Cleveland, Cincinnati, Akron', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Columbus, Cleveland, Cincinnati (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  OK: {
    state: 'Oklahoma',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Oklahoma City, Tulsa, Norman', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Oklahoma City, Tulsa', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Oklahoma City, Tulsa (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  OR: {
    state: 'Oregon',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Portland, Salem, Eugene, Bend', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Portland metro, Salem', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Portland metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  PA: {
    state: 'Pennsylvania',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Philadelphia, Pittsburgh, Allentown, Harrisburg', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Philadelphia, Pittsburgh, Lehigh Valley', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Philadelphia, Pittsburgh (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  RI: {
    state: 'Rhode Island',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Providence, Warwick, Cranston', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Providence metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  SC: {
    state: 'South Carolina',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Charleston, Columbia, Greenville, Myrtle Beach', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Charleston, Columbia, Greenville', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Charleston, Columbia (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  SD: {
    state: 'South Dakota',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Sioux Falls, Rapid City', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Sioux Falls', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  TN: {
    state: 'Tennessee',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Nashville, Memphis, Knoxville, Chattanooga', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Nashville, Memphis, Knoxville', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Nashville, Memphis (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  TX: {
    state: 'Texas',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Dallas, Houston, San Antonio, Austin, Fort Worth', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies. Founded in Dallas, TX.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Dallas, Houston, San Antonio, Austin, El Paso', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network headquartered in Dallas, TX. Specializes in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Dallas, Houston, San Antonio, Austin (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  UT: {
    state: 'Utah',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Salt Lake City, Provo, Ogden', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Salt Lake City, Provo, Ogden', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Salt Lake City metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  VT: {
    state: 'Vermont',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Burlington, South Burlington', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Burlington area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  VA: {
    state: 'Virginia',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Virginia Beach, Richmond, Norfolk, Arlington', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Richmond, Virginia Beach, Northern Virginia', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Richmond, Hampton Roads (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  WA: {
    state: 'Washington',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Seattle, Tacoma, Spokane, Vancouver', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Seattle metro, Tacoma, Spokane', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Seattle metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  WV: {
    state: 'West Virginia',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Charleston, Huntington, Morgantown', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Charleston, Huntington', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  WI: {
    state: 'Wisconsin',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Milwaukee, Madison, Green Bay', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Milwaukee, Madison, Racine', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Milwaukee metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  WY: {
    state: 'Wyoming',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Cheyenne, Casper, Laramie', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'Cheyenne', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'Statewide (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
  DC: {
    state: 'Washington D.C.',
    brokerages: [
      { name: 'New Western', specialty: 'Investment Property Brokerage', services: 'Acquisitions, Flipping, Wholesaling, Rentals', markets: 'Washington D.C. metro', website: 'newwestern.com', phone: '(844) 639-9378', description: 'Largest investor-focused brokerage in the U.S. Connects investors with off-market and distressed properties for fix-and-flip, wholesale, and rental strategies.' },
      { name: 'HomeVestors (We Buy Ugly Houses)', specialty: 'Franchise Investment Brokerage', services: 'Acquisitions, Flipping, Wholesaling', markets: 'D.C. metro area', website: 'homevestors.com', phone: '(800) 444-7865', description: 'Nationally franchised investor network specializing in distressed property acquisitions. Works with local investors on flips and wholesale deals.' },
      { name: 'Roofstock', specialty: 'Investment Property Marketplace', services: 'Acquisitions, Rentals, Portfolio Sales', markets: 'D.C. metro (online marketplace)', website: 'roofstock.com', phone: '(800) 466-9498', description: 'Online investment property marketplace connecting investors with turnkey rental properties and portfolios. Full transaction support with data-driven insights.' },
    ],
  },
}

const STATE_CODES = Object.keys(STATES_DATA).sort()

export default function InvestmentBrokerages() {
  const [selectedState, setSelectedState] = useState('TX')
  const [searchQuery, setSearchQuery] = useState('')
  const [expandedBrokerage, setExpandedBrokerage] = useState<string | null>(null)

  const stateData = STATES_DATA[selectedState]
  const allBrokerages = stateData ? [
    ...(BEST_PICKS[selectedState] ? [BEST_PICKS[selectedState]] : []),
    ...stateData.brokerages,
  ] : []
  const filteredBrokerages = allBrokerages.filter(b =>
    b.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
    b.services.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div style={{ padding: '24px 0' }}>
      {/* Header */}
      <div style={{ marginBottom: 24 }}>
        <h2 style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 28,
          letterSpacing: '0.04em',
          color: '#f5f0eb',
          margin: 0,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}>
          <Building2 size={24} style={{ color: '#ff7e5f' }} />
          Investment Brokerages
        </h2>
        <p style={{ color: '#888', fontSize: 14, margin: '8px 0 0', lineHeight: 1.5 }}>
          Top real estate investment brokerages that work with investors on acquisitions, flipping, wholesaling, and rentals — organized by state.
        </p>
      </div>

      {/* Info tip */}
      <div className="info-tip" style={{ marginBottom: 20 }}>
        <strong>Pro Tip:</strong> These brokerages specialize in working with real estate investors. They source off-market deals, distressed properties, and investment opportunities — not traditional homebuyer transactions. Look for the <span style={{ color: '#ff7e5f', fontWeight: 700 }}>Best Pick</span> badge — our top-recommended investor brokerage for each state. Contact them directly to get on their buyer list.
      </div>

      {/* State selector + search */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '0 0 auto' }}>
          <MapPin size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#ff7e5f' }} />
          <select
            value={selectedState}
            onChange={e => { setSelectedState(e.target.value); setExpandedBrokerage(null) }}
            style={{
              padding: '10px 16px 10px 34px',
              background: '#2e3a4d',
              border: '1px solid #3d4e65',
              borderRadius: 8,
              color: '#f5f0eb',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              cursor: 'pointer',
              minWidth: 200,
              appearance: 'none',
              WebkitAppearance: 'none',
              backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%23888' stroke-width='2'%3E%3Cpath d='M6 9l6 6 6-6'/%3E%3C/svg%3E")`,
              backgroundRepeat: 'no-repeat',
              backgroundPosition: 'right 12px center',
              paddingRight: 32,
            }}
          >
            {STATE_CODES.map(code => (
              <option key={code} value={code}>{STATES_DATA[code].state} ({code})</option>
            ))}
          </select>
        </div>

        <div style={{ position: 'relative', flex: 1, minWidth: 200 }}>
          <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
          <input
            type="text"
            placeholder="Search brokerages..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            style={{
              width: '100%',
              padding: '10px 16px 10px 34px',
              background: '#2e3a4d',
              border: '1px solid #3d4e65',
              borderRadius: 8,
              color: '#f5f0eb',
              fontSize: 14,
              fontFamily: "'DM Sans', sans-serif",
              outline: 'none',
              boxSizing: 'border-box',
            }}
          />
        </div>
      </div>

      {/* State heading */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        marginBottom: 16,
        padding: '12px 16px',
        background: 'rgba(244,126,95,0.06)',
        border: '1px solid rgba(244,126,95,0.15)',
        borderRadius: 8,
      }}>
        <MapPin size={16} style={{ color: '#ff7e5f' }} />
        <span style={{
          fontFamily: "'Bebas Neue', sans-serif",
          fontSize: 20,
          letterSpacing: '0.04em',
          color: '#ff7e5f',
        }}>
          {stateData?.state}
        </span>
        <span style={{ color: '#555', fontSize: 13, marginLeft: 'auto' }}>
          {filteredBrokerages.length} brokerage{filteredBrokerages.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Brokerage cards */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        {filteredBrokerages.map((brokerage, idx) => {
          const isExpanded = expandedBrokerage === `${selectedState}-${idx}`
          return (
            <div
              key={`${selectedState}-${idx}`}
              style={{
                background: brokerage.bestPick ? 'linear-gradient(135deg, rgba(244,126,95,0.06), rgba(232,179,71,0.04))' : '#263040',
                border: `1px solid ${brokerage.bestPick ? 'rgba(244,126,95,0.35)' : isExpanded ? 'rgba(244,126,95,0.3)' : '#3d4e65'}`,
                borderRadius: 10,
                overflow: 'hidden',
                transition: 'border-color 0.2s ease',
                position: 'relative' as const,
              }}
            >
              {/* Best Pick ribbon */}
              {brokerage.bestPick && (
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                  padding: '6px 16px',
                  background: 'linear-gradient(135deg, #ff7e5f, #ffb347)',
                  color: '#000',
                  fontSize: 11,
                  fontWeight: 700,
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase' as const,
                  fontFamily: "'Bebas Neue', sans-serif",
                }}>
                  <Star size={12} fill="#000" />
                  Best Pick for {stateData?.state}
                </div>
              )}
              {/* Card header - clickable */}
              <button
                onClick={() => setExpandedBrokerage(isExpanded ? null : `${selectedState}-${idx}`)}
                style={{
                  width: '100%',
                  padding: '16px 20px',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: 14,
                  textAlign: 'left',
                }}
              >
                {/* Icon */}
                <div style={{
                  width: 44,
                  height: 44,
                  borderRadius: 10,
                  background: brokerage.bestPick ? 'linear-gradient(135deg, #ff7e5f, #ffb347)' : idx === (BEST_PICKS[selectedState] ? 1 : 0) ? 'linear-gradient(135deg, #ff7e5f, #e86830)' : idx === (BEST_PICKS[selectedState] ? 2 : 1) ? 'linear-gradient(135deg, #5cb885, #1a7a42)' : 'linear-gradient(135deg, #2a6aad, #1a4a8a)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Building2 size={20} style={{ color: '#fff' }} />
                </div>

                {/* Info */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexWrap: 'wrap' }}>
                    <span style={{
                      fontFamily: "'Bebas Neue', sans-serif",
                      fontSize: 18,
                      letterSpacing: '0.03em',
                      color: '#f5f0eb',
                    }}>
                      {brokerage.name}
                    </span>
                    <span className={`badge ${brokerage.bestPick ? 'badge-gold' : idx === (BEST_PICKS[selectedState] ? 1 : 0) ? 'badge-orange' : idx === (BEST_PICKS[selectedState] ? 2 : 1) ? 'badge-green' : 'badge-blue'}`} style={{ fontSize: 10 }}>
                      {brokerage.specialty}
                    </span>
                  </div>
                  <div style={{ color: '#888', fontSize: 13, marginTop: 4 }}>
                    {brokerage.services}
                  </div>
                </div>

                {/* Expand indicator */}
                <div style={{
                  color: '#555',
                  transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease',
                  flexShrink: 0,
                  marginTop: 4,
                }}>
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path d="M6 9l6 6 6-6" />
                  </svg>
                </div>
              </button>

              {/* Expanded details */}
              {isExpanded && (
                <div style={{
                  padding: '0 20px 20px',
                  borderTop: '1px solid #2e3a4d',
                }}>
                  {/* Description */}
                  <p style={{ color: '#aaa', fontSize: 13, lineHeight: 1.6, margin: '16px 0' }}>
                    {brokerage.description}
                  </p>

                  {/* Details grid */}
                  <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: 12,
                    marginBottom: 16,
                  }}>
                    <div style={{ background: '#12161c', borderRadius: 8, padding: '12px 16px' }}>
                      <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Markets Served</div>
                      <div style={{ color: '#f5f0eb', fontSize: 13 }}>
                        <MapPin size={12} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 4, color: '#ff7e5f' }} />
                        {brokerage.markets}
                      </div>
                    </div>
                    <div style={{ background: '#12161c', borderRadius: 8, padding: '12px 16px' }}>
                      <div style={{ color: '#555', fontSize: 11, textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>Services</div>
                      <div style={{ color: '#f5f0eb', fontSize: 13 }}>{brokerage.services}</div>
                    </div>
                  </div>

                  {/* Contact row */}
                  <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <a
                      href={`https://${brokerage.website}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        background: 'rgba(244,126,95,0.1)',
                        border: '1px solid rgba(244,126,95,0.25)',
                        borderRadius: 8,
                        color: '#ff7e5f',
                        fontSize: 13,
                        textDecoration: 'none',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Globe size={13} />
                      {brokerage.website}
                      <ExternalLink size={11} />
                    </a>
                    <a
                      href={`tel:${brokerage.phone.replace(/[^\d+]/g, '')}`}
                      style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        gap: 6,
                        padding: '8px 16px',
                        background: 'rgba(45,184,133,0.1)',
                        border: '1px solid rgba(45,184,133,0.25)',
                        borderRadius: 8,
                        color: '#5cb885',
                        fontSize: 13,
                        textDecoration: 'none',
                        fontFamily: "'DM Sans', sans-serif",
                        transition: 'all 0.2s ease',
                      }}
                    >
                      <Phone size={13} />
                      {brokerage.phone}
                    </a>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {/* Disclaimer */}
      <div style={{
        marginTop: 24,
        padding: '16px 20px',
        background: 'rgba(42,106,173,0.08)',
        border: '1px solid rgba(42,106,173,0.2)',
        borderRadius: 8,
        color: '#888',
        fontSize: 12,
        lineHeight: 1.6,
      }}>
        <strong style={{ color: '#2a6aad' }}>Disclaimer:</strong> The brokerage information listed above is provided for educational and informational purposes only. Flip the Contract is not affiliated with, endorsed by, or a representative of any of the brokerages listed. Always perform your own due diligence before working with any brokerage. Availability of services may vary by market and location.
      </div>
    </div>
  )
}
