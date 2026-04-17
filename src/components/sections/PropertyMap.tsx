import { useState, useCallback, useMemo } from 'react'
import { MapPin, Search, ChevronRight, ArrowLeft, Building, Image, ExternalLink, Navigation, Lightbulb, Filter, BarChart3, CheckSquare, Info, Globe, TrendingUp, Users, DollarSign, Shield } from 'lucide-react'

// Real street data for accurate address searches per city
const CITY_STREETS: Record<string, string[]> = {
  'Birmingham': ['1st Ave N', '2nd Ave N', '20th St S', 'Richard Arrington Jr Blvd', 'University Blvd', 'Pawnee Ave', 'Bessemer Rd', 'Center St S'],
  'Montgomery': ['Dexter Ave', 'Perry St', 'S Court St', 'Bell St', 'Jeff Davis Ave', 'Mobile Hwy', 'Atlanta Hwy', 'Norman Bridge Rd'],
  'Huntsville': ['Memorial Pkwy', 'University Dr', 'Governors Dr', 'Jordan Ln', 'Bob Wallace Ave', 'Whitesburg Dr', 'Drake Ave', 'Holmes Ave'],
  'Mobile': ['Government St', 'Dauphin St', 'Airport Blvd', 'Old Shell Rd', 'Springhill Ave', 'Schillinger Rd', 'Cottage Hill Rd', 'Hillcrest Rd'],
  'Tuscaloosa': ['University Blvd', 'McFarland Blvd', '15th St', 'Hackberry Ln', 'Skyland Blvd', 'Greensboro Ave', 'Lurleen Wallace Blvd'],
  'Decatur': ['6th Ave SE', 'Beltline Rd', 'Point Mallard Dr', 'Spring Ave', 'Danville Rd'],
  'Hoover': ['Lorna Rd', 'John Hawkins Pkwy', 'Bluff Park Blvd', 'Patton Chapel Rd', 'Rocky Ridge Rd'],
  'Phoenix': ['Central Ave', 'Camelback Rd', 'Indian School Rd', 'Thomas Rd', 'McDowell Rd', 'Van Buren St', 'Baseline Rd', '7th St'],
  'Tucson': ['Speedway Blvd', 'Broadway Blvd', 'Grant Rd', '6th Ave', 'Oracle Rd', 'Campbell Ave', 'Kolb Rd', 'Tanque Verde Rd'],
  'Mesa': ['Main St', 'Southern Ave', 'Dobson Rd', 'Stapley Dr', 'Country Club Dr', 'Power Rd', 'University Dr'],
  'Scottsdale': ['Scottsdale Rd', 'Shea Blvd', 'Hayden Rd', 'Indian Bend Rd', 'McDowell Rd', 'Frank Lloyd Wright Blvd'],
  'Chandler': ['Chandler Blvd', 'Alma School Rd', 'Arizona Ave', 'Ray Rd', 'Riggs Rd', 'McQueen Rd'],
  'Gilbert': ['Gilbert Rd', 'Elliot Rd', 'Val Vista Dr', 'Higley Rd', 'Greenfield Rd', 'Warner Rd'],
  'Tempe': ['Mill Ave', 'University Dr', 'Apache Blvd', 'Rural Rd', 'McClintock Dr', 'Broadway Rd'],
  'Glendale': ['Glendale Ave', 'Northern Ave', '59th Ave', 'Bethany Home Rd', 'Peoria Ave'],
  'Little Rock': ['Main St', 'Markham St', 'Broadway St', 'Capitol Ave', 'Cantrell Rd', 'Kavanaugh Blvd', 'Asher Ave', 'Baseline Rd'],
  'Fort Smith': ['Rogers Ave', 'Garrison Ave', 'Towson Ave', 'Grand Ave', 'Midland Blvd', 'Phoenix Ave'],
  'Fayetteville': ['College Ave', 'Dickson St', 'Mission Blvd', 'Razorback Rd', 'Crossover Rd', 'Joyce Blvd'],
  'Springdale': ['Emma Ave', 'Sunset Ave', 'Thompson St', 'Pleasant St', 'Old Missouri Rd'],
  'Jonesboro': ['Main St', 'Highland Dr', 'Stadium Blvd', 'Caraway Rd', 'Parker Rd'],
  'Conway': ['Oak St', 'Harkrider St', 'Prince St', 'College Ave', 'Dave Ward Dr'],
  'Denver': ['Colfax Ave', '16th St', 'Broadway', 'Federal Blvd', 'Colorado Blvd', 'Speer Blvd', 'Alameda Ave', 'Downing St'],
  'Colorado Springs': ['Nevada Ave', 'Academy Blvd', 'Platte Ave', 'Austin Bluffs Pkwy', 'Garden of the Gods Rd', 'Fillmore St'],
  'Aurora': ['Colfax Ave', 'Havana St', 'Chambers Rd', 'Mississippi Ave', 'Alameda Ave', 'Buckley Rd'],
  'Fort Collins': ['College Ave', 'Mulberry St', 'Harmony Rd', 'Drake Rd', 'Shields St', 'Lemay Ave'],
  'Lakewood': ['Wadsworth Blvd', 'Alameda Ave', 'Colfax Ave', 'Morrison Rd', 'Union Blvd'],
  'Pueblo': ['Northern Ave', 'Main St', 'Elizabeth St', 'Abriendo Ave', 'Santa Fe Ave'],
  'Miami': ['Biscayne Blvd', 'Flagler St', 'Calle Ocho', 'Coral Way', 'NW 7th St', 'S Dixie Hwy', 'NW 36th St', 'Collins Ave'],
  'Orlando': ['Orange Ave', 'Colonial Dr', 'International Dr', 'Kirkman Rd', 'Semoran Blvd', 'Mills Ave', 'Edgewater Dr'],
  'Tampa': ['Dale Mabry Hwy', 'Kennedy Blvd', 'Hillsborough Ave', 'Nebraska Ave', 'Bayshore Blvd', 'Armenia Ave', 'Gandy Blvd'],
  'Jacksonville': ['Beach Blvd', 'University Blvd', 'Atlantic Blvd', 'Blanding Blvd', 'San Jose Blvd', 'Arlington Expy', 'Philips Hwy'],
  'Fort Lauderdale': ['Las Olas Blvd', 'Sunrise Blvd', 'Broward Blvd', 'Federal Hwy', 'Andrews Ave', 'Commercial Blvd'],
  'St. Petersburg': ['Central Ave', '4th St N', 'MLK St S', '34th St S', 'Gandy Blvd', '1st Ave N', 'Park St'],
  'Hialeah': ['Palm Ave', 'E 49th St', 'W 12th Ave', 'E 4th Ave', 'W 68th St'],
  'Tallahassee': ['Monroe St', 'Apalachee Pkwy', 'Tennessee St', 'Thomasville Rd', 'Capital Cir'],
  'Cape Coral': ['Del Prado Blvd', 'Pine Island Rd', 'Santa Barbara Blvd', 'Chiquita Blvd', 'Skyline Blvd'],
  'Atlanta': ['Peachtree St', 'Ponce de Leon Ave', 'Moreland Ave', 'Piedmont Ave', 'North Ave', 'Memorial Dr', 'MLK Jr Dr', 'DeKalb Ave'],
  'Savannah': ['Bull St', 'Broughton St', 'Abercorn St', 'Liberty St', 'Victory Dr', 'Waters Ave', 'DeRenne Ave'],
  'Augusta': ['Broad St', 'Walton Way', 'Washington Rd', 'Wrightsboro Rd', 'Laney Walker Blvd', 'Highland Ave'],
  'Columbus': ['Broadway', 'Victory Dr', 'Macon Rd', 'Manchester Expy', 'Buena Vista Rd', '13th St'],
  'Macon': ['Riverside Dr', 'Vineville Ave', 'Forsyth St', 'Pio Nono Ave', 'Mercer University Dr'],
  'Marietta': ['Roswell St', 'South Marietta Pkwy', 'Church St', 'Powder Springs St', 'Cobb Pkwy'],
  'Albany': ['Oglethorpe Blvd', 'Slappey Blvd', 'Dawson Rd', 'Westover Blvd'],
  'Boise': ['Capitol Blvd', 'State St', 'Vista Ave', 'Fairview Ave', 'Ustick Rd', 'Overland Rd', 'Cole Rd'],
  'Meridian': ['Eagle Rd', 'Fairview Ave', 'Ustick Rd', 'Linder Rd', 'Cherry Ln', 'McMillan Rd'],
  'Nampa': ['12th Ave Rd', 'Caldwell Blvd', 'Midway Rd', 'Garrity Blvd', 'Karcher Rd'],
  'Idaho Falls': ['17th St', 'Holmes Ave', 'Yellowstone Ave', 'Hitt Rd', 'Woodruff Ave'],
  'Pocatello': ['Yellowstone Ave', 'Philbin Rd', '5th Ave', 'Benton St', 'Arthur Ave'],
  'Chicago': ['Michigan Ave', 'State St', 'Halsted St', 'Ashland Ave', 'Western Ave', 'Pulaski Rd', 'Cottage Grove Ave', 'Division St'],
  'Aurora IL': ['Broadway', 'New York St', 'Lake St', 'Indian Trail Rd', 'Farnsworth Ave', 'Galena Blvd'],
  'Rockford': ['State St', 'Charles St', 'Broadway', 'E State St', 'Auburn St', 'Kishwaukee St'],
  'Joliet': ['Jefferson St', 'Collins St', 'Essington Rd', 'Cass St', 'Larkin Ave'],
  'Springfield': ['MacArthur Blvd', 'Wabash Ave', '6th St', 'Dirksen Pkwy', 'South Grand Ave'],
  'Naperville': ['Washington St', 'Ogden Ave', 'Aurora Ave', 'Naper Blvd', 'Route 59'],
  'Peoria': ['Main St', 'War Memorial Dr', 'University St', 'Knoxville Ave', 'Sterling Ave'],
  'Indianapolis': ['Meridian St', 'Washington St', 'Capitol Ave', 'Illinois St', 'Fall Creek Pkwy', 'Michigan St', '38th St', 'Keystone Ave'],
  'Fort Wayne': ['Calhoun St', 'Broadway', 'Lima Rd', 'Clinton St', 'Coliseum Blvd', 'Fairfield Ave'],
  'Evansville': ['First Ave', 'Washington Ave', 'Green River Rd', 'Lloyd Expy', 'Morgan Ave'],
  'South Bend': ['Michigan St', 'Main St', 'Lincoln Way W', 'Mishawaka Ave', 'Western Ave'],
  'Gary': ['Broadway', '5th Ave', 'Grant St', 'Ridge Rd', 'MLK Dr'],
  'Carmel': ['Rangeline Rd', 'Main St', '116th St', 'Keystone Ave', 'Westfield Blvd'],
  'Louisville': ['Bardstown Rd', 'Broadway', 'Main St', 'Frankfort Ave', 'Shelbyville Rd', 'Dixie Hwy', 'Preston Hwy', 'River Rd'],
  'Lexington': ['Main St', 'Nicholasville Rd', 'Tates Creek Rd', 'New Circle Rd', 'Versailles Rd', 'Richmond Rd'],
  'Bowling Green': ['Scottsville Rd', '31W Bypass', 'Nashville Rd', 'Cemetery Rd', 'Campbell Ln'],
  'Owensboro': ['Frederica St', 'New Hartford Rd', 'Leitchfield Rd', 'Triplett St', 'E 4th St'],
  'Covington': ['Madison Ave', 'Scott Blvd', 'Pike St', 'Main St', 'Greenup St'],
  'New Orleans': ['Canal St', 'St. Charles Ave', 'Magazine St', 'Bourbon St', 'Esplanade Ave', 'Claiborne Ave', 'Elysian Fields Ave'],
  'Baton Rouge': ['Government St', 'Florida Blvd', 'Airline Hwy', 'Plank Rd', 'Highland Rd', 'Perkins Rd'],
  'Shreveport': ['Texas St', 'Line Ave', 'Youree Dr', 'Jewella Ave', 'Kings Hwy', 'Mansfield Rd'],
  'Lafayette': ['Johnston St', 'Ambassador Caffery Pkwy', 'Congress St', 'Pinhook Rd', 'University Ave'],
  'Lake Charles': ['Ryan St', 'Common St', 'Broad St', 'Enterprise Blvd', 'Country Club Rd'],
  'Baltimore': ['Charles St', 'Pratt St', 'North Ave', 'Eastern Ave', 'Greenmount Ave', 'Harford Rd', 'Reisterstown Rd', 'Belair Rd'],
  'Columbia': ['Little Patuxent Pkwy', 'Snowden River Pkwy', 'Broken Land Pkwy', 'Columbia Rd', 'Oakland Mills Rd'],
  'Silver Spring': ['Georgia Ave', 'Colesville Rd', 'University Blvd', 'Piney Branch Rd', 'Wayne Ave'],
  'Frederick': ['Market St', 'Patrick St', 'E Church St', 'Rosemont Ave', 'Opossumtown Pike'],
  'Hagerstown': ['Dual Hwy', 'Potomac Ave', 'Virginia Ave', 'Burhans Blvd'],
  'Detroit': ['Woodward Ave', 'Michigan Ave', 'Gratiot Ave', 'Grand River Ave', 'Livernois Ave', 'Mack Ave', 'Warren Ave', 'Joy Rd'],
  'Grand Rapids': ['Division Ave', 'Fulton St', 'Wealthy St', 'Eastern Ave', 'Michigan St', 'Lake Dr'],
  'Flint': ['Saginaw St', 'Corunna Rd', 'Court St', 'Dort Hwy', 'Flushing Rd', 'MLK Ave'],
  'Lansing': ['Michigan Ave', 'Saginaw St', 'Grand River Ave', 'Cedar St', 'MLK Jr Blvd', 'Kalamazoo St'],
  'Ann Arbor': ['Main St', 'Washtenaw Ave', 'Huron St', 'State St', 'Plymouth Rd', 'Liberty St'],
  'Warren': ['Van Dyke Ave', 'Mound Rd', 'Hoover Rd', 'E 14 Mile Rd', 'Schoenherr Rd'],
  'Sterling Heights': ['Van Dyke Ave', 'M-59', 'Schoenherr Rd', 'Mound Rd', 'Ryan Rd'],
  'Minneapolis': ['Hennepin Ave', 'Nicollet Ave', 'Lake St', 'Washington Ave', 'University Ave', 'Lyndale Ave', 'Broadway St NE'],
  'St. Paul': ['University Ave', 'Grand Ave', 'Summit Ave', 'Snelling Ave', 'Marshall Ave', 'Payne Ave'],
  'Rochester': ['Broadway Ave', '2nd St SW', 'Civic Center Dr', 'Northern Hills Dr', 'Apache Mall'],
  'Duluth': ['Superior St', 'London Rd', 'Central Ave', 'Grand Ave', 'Mesaba Ave'],
  'Brooklyn Park': ['Brooklyn Blvd', 'Zane Ave N', '85th Ave N', 'Noble Ave', 'Regent Ave'],
  'Jackson': ['Capitol St', 'State St', 'N Farish St', 'Livingston Rd', 'Terry Rd', 'N State St', 'Woodrow Wilson Ave'],
  'Gulfport': ['Pass Rd', '25th Ave', 'Courthouse Rd', 'Debuys Rd', 'Cowan Rd'],
  'Hattiesburg': ['Hardy St', 'Broadway Dr', 'W Pine St', 'N Main St', 'Lincoln Rd'],
  'Biloxi': ['Pass Rd', 'Division St', 'Howard Ave', 'Veterans Ave', 'Popp\'s Ferry Rd'],
  'Southaven': ['Stateline Rd', 'Getwell Rd', 'Goodman Rd', 'Church Rd'],
  'Kansas City': ['Main St', 'Grand Blvd', 'Broadway Blvd', 'Troost Ave', 'Paseo Blvd', 'Prospect Ave', 'Independence Ave', '39th St'],
  'St. Louis': ['Grand Blvd', 'Natural Bridge Ave', 'Delmar Blvd', 'Kingshighway', 'Jefferson Ave', 'Market St', 'Olive St'],
  'Springfield MO': ['Glenstone Ave', 'Campbell Ave', 'National Ave', 'Kearney St', 'Sunshine St', 'Kansas Expy'],
  'Columbia MO': ['Broadway', 'Providence Rd', 'Stadium Blvd', 'Grindstone Pkwy', 'Paris Rd'],
  'Independence': ['Noland Rd', 'Sterling Ave', 'Truman Rd', 'Blue Ridge Blvd', '23rd St'],
  'Lee\'s Summit': ['Colbern Rd', '3rd St', 'Chipman Rd', 'Douglas St', 'SW Oldham Pkwy'],
  'Charlotte': ['Tryon St', 'Independence Blvd', 'Central Ave', 'South Blvd', 'Freedom Dr', 'N Davidson St', 'Beatties Ford Rd'],
  'Raleigh': ['Hillsborough St', 'Glenwood Ave', 'Capital Blvd', 'New Bern Ave', 'Western Blvd', 'Wake Forest Rd'],
  'Greensboro': ['Elm St', 'High Point Rd', 'Battleground Ave', 'Wendover Ave', 'Gate City Blvd'],
  'Durham': ['Main St', 'Duke St', 'Gregson St', 'Roxboro Rd', 'University Dr', 'Chapel Hill Rd'],
  'Winston-Salem': ['Stratford Rd', 'Peters Creek Pkwy', 'Silas Creek Pkwy', 'Hanes Mall Blvd', 'Trade St'],
  'Fayetteville NC': ['Bragg Blvd', 'Skibo Rd', 'Raeford Rd', 'Yadkin Rd', 'Hay St'],
  'Wilmington': ['Market St', 'Oleander Dr', 'College Rd', 'Carolina Beach Rd', 'Wrightsville Ave'],
  'Asheville': ['Patton Ave', 'Tunnel Rd', 'Merrimon Ave', 'Hendersonville Rd', 'Charlotte St'],
  'Las Vegas': ['Las Vegas Blvd', 'Flamingo Rd', 'Sahara Ave', 'Charleston Blvd', 'Tropicana Ave', 'Fremont St', 'Eastern Ave', 'Decatur Blvd'],
  'Henderson': ['Stephanie St', 'Sunset Rd', 'Green Valley Pkwy', 'Warm Springs Rd', 'Eastern Ave'],
  'Reno': ['Virginia St', 'Sierra St', 'Wells Ave', 'S Virginia St', 'McCarran Blvd', 'N Virginia St'],
  'North Las Vegas': ['Craig Rd', 'Cheyenne Ave', 'Lake Mead Blvd', 'Las Vegas Blvd N', 'Civic Center Dr'],
  'Sparks': ['Victorian Ave', 'Prater Way', 'Pyramid Way', 'McCarran Blvd', 'El Rancho Dr'],
  'Columbus OH': ['High St', 'Broad St', 'Main St', 'Morse Rd', 'Parsons Ave', 'Cleveland Ave', 'Dublin Rd', 'Livingston Ave'],
  'Cleveland': ['Euclid Ave', 'Superior Ave', 'St. Clair Ave', 'Lorain Ave', 'Carnegie Ave', 'Detroit Ave', 'W 25th St'],
  'Cincinnati': ['Vine St', 'Reading Rd', 'Central Ave', 'Western Ave', 'Colerain Ave', 'Montgomery Rd', 'Beechmont Ave'],
  'Toledo': ['Summit St', 'Monroe St', 'Dorr St', 'Sylvania Ave', 'Lagrange St', 'Cherry St'],
  'Akron': ['Market St', 'Main St', 'Copley Rd', 'Arlington St', 'S Arlington St', 'E Waterloo Rd'],
  'Dayton': ['Main St', 'Salem Ave', 'N Dixie Dr', 'E 3rd St', 'W 3rd St', 'Germantown St'],
  'Youngstown': ['Market St', 'Belmont Ave', 'Glenwood Ave', 'Elm St', 'Mahoning Ave'],
  'Canton': ['Market Ave', 'Tuscarawas St', 'Cleveland Ave', 'Navarre Rd', 'Fulton Dr'],
  'Oklahoma City': ['N Western Ave', 'NW 23rd St', 'Penn Ave', 'Classen Blvd', 'May Ave', 'Reno Ave', 'NW Expressway', 'S Walker Ave'],
  'Tulsa': ['Peoria Ave', 'Harvard Ave', 'Lewis Ave', 'Sheridan Rd', 'Yale Ave', 'Memorial Dr', '21st St', 'Admiral Pl'],
  'Norman': ['Main St', 'Lindsey St', 'Robinson St', 'Porter Ave', 'Classen Blvd', 'W Boyd St'],
  'Broken Arrow': ['Main St', 'Kenosha St', 'Elm Pl', 'Albany St', 'Aspen Ave'],
  'Lawton': ['Cache Rd', 'Gore Blvd', 'Sheridan Rd', 'Lee Blvd', 'NW Ferris Ave'],
  'Edmond': ['Broadway', 'Danforth Rd', '2nd St', 'Santa Fe Ave', 'Kelly Ave'],
  'Philadelphia': ['Broad St', 'Market St', 'Girard Ave', 'Germantown Ave', 'Frankford Ave', 'Kensington Ave', 'Lehigh Ave', 'Ridge Ave'],
  'Pittsburgh': ['Forbes Ave', 'Fifth Ave', 'Butler St', 'Penn Ave', 'Murray Ave', 'E Carson St', 'Liberty Ave'],
  'Allentown': ['Hamilton St', '7th St', 'Tilghman St', 'Cedar Crest Blvd', 'Union Blvd'],
  'Reading': ['Penn St', '5th St', 'N 5th St Hwy', 'Lancaster Ave', 'Perkiomen Ave'],
  'Erie': ['State St', 'Peach St', 'W 26th St', '12th St', 'Buffalo Rd'],
  'Scranton': ['N Washington Ave', 'Lackawanna Ave', 'Main Ave', 'Mulberry St', 'Wyoming Ave'],
  'Charleston': ['King St', 'Meeting St', 'Calhoun St', 'East Bay St', 'Savannah Hwy', 'Rivers Ave', 'Dorchester Rd'],
  'Greenville': ['Main St', 'Church St', 'Wade Hampton Blvd', 'N Pleasantburg Dr', 'Augusta St'],
  'Myrtle Beach': ['Kings Hwy', 'Ocean Blvd', 'Mr Joe White Ave', '21st Ave N', 'Robert Grissom Pkwy'],
  'Rock Hill': ['Cherry Rd', 'Oakland Ave', 'Celanese Rd', 'Anderson Rd', 'Main St'],
  'Spartanburg': ['E Main St', 'Church St', 'Asheville Hwy', 'Pine St', 'N Church St'],
  'Nashville': ['Broadway', 'West End Ave', 'Gallatin Pike', 'Nolensville Pike', 'Charlotte Ave', 'Murfreesboro Pike', 'Dickerson Pike'],
  'Memphis': ['Beale St', 'Union Ave', 'Poplar Ave', 'Summer Ave', 'Lamar Ave', 'Madison Ave', 'S Main St'],
  'Knoxville': ['Kingston Pike', 'Chapman Hwy', 'Broadway', 'Magnolia Ave', 'Sutherland Ave', 'N Central St'],
  'Chattanooga': ['Broad St', 'Market St', 'Brainerd Rd', 'Rossville Blvd', 'Hixson Pike', 'E Main St'],
  'Clarksville': ['Madison St', 'Wilma Rudolph Blvd', 'Fort Campbell Blvd', 'Riverside Dr', 'College St'],
  'Murfreesboro': ['Memorial Blvd', 'Broad St', 'Church St', 'S Church St', 'Old Fort Pkwy'],
  'Houston': ['Westheimer Rd', 'Richmond Ave', 'Washington Ave', 'Kirby Dr', 'Shepherd Dr', 'Main St', 'Montrose Blvd', 'Fannin St'],
  'Dallas': ['Elm St', 'Commerce St', 'Ross Ave', 'Greenville Ave', 'Gaston Ave', 'Cedar Springs Rd', 'Harry Hines Blvd'],
  'San Antonio': ['Broadway', 'Commerce St', 'St. Mary\'s St', 'Fredericksburg Rd', 'Culebra Rd', 'Nogalitos St', 'Military Dr'],
  'Austin': ['Congress Ave', 'Lamar Blvd', 'S 1st St', 'Guadalupe St', 'E Riverside Dr', 'Oltorf St', 'Manor Rd'],
  'Fort Worth': ['Main St', 'Camp Bowie Blvd', 'Lancaster Ave', 'Henderson St', 'Seminary Dr', 'Hemphill St'],
  'El Paso': ['Montana Ave', 'Mesa St', 'N Stanton St', 'Alameda Ave', 'Dyer St', 'Lee Trevino Dr'],
  'Arlington': ['Pioneer Pkwy', 'Center St', 'S Cooper St', 'Matlock Rd', 'Collins St', 'Abram St'],
  'Corpus Christi': ['S Staples St', 'Ayers St', 'Leopard St', 'Everhart Rd', 'Saratoga Blvd'],
  'Plano': ['15th St', 'K Ave', 'Spring Creek Pkwy', 'Coit Rd', 'Preston Rd'],
  'Lubbock': ['Broadway', 'University Ave', 'Slide Rd', 'Indiana Ave', '50th St'],
  'Salt Lake City': ['State St', 'Main St', '700 E', '900 S', '400 S', 'N Temple', '200 W', 'Highland Dr'],
  'West Valley City': ['3500 S', 'Redwood Rd', '4100 S', 'Bangerter Hwy', '2700 W'],
  'Provo': ['University Ave', 'Center St', 'State St', 'Freedom Blvd', 'N Canyon Rd'],
  'Ogden': ['Washington Blvd', '25th St', 'Harrison Blvd', 'Grant Ave', 'Wall Ave'],
  'Layton': ['Main St', 'Gentile St', 'Fort Ln', 'Hill Field Rd', 'Wasatch Dr'],
  'St. George': ['Bluff St', 'River Rd', 'Dixie Dr', 'Red Cliffs Dr', 'Tabernacle St'],
  'Virginia Beach': ['Virginia Beach Blvd', 'Shore Dr', 'Independence Blvd', 'Laskin Rd', 'Holland Rd', 'Great Neck Rd', 'Indian River Rd'],
  'Norfolk': ['Granby St', 'Church St', 'Colley Ave', 'Hampton Blvd', 'Tidewater Dr', 'Military Hwy'],
  'Richmond': ['Broad St', 'Main St', 'Cary St', 'Monument Ave', 'Chamberlayne Ave', 'Hull St', 'Midlothian Tpke'],
  'Chesapeake': ['Battlefield Blvd', 'Cedar Rd', 'Military Hwy', 'S Military Hwy', 'Greenbrier Pkwy'],
  'Newport News': ['Warwick Blvd', 'Jefferson Ave', 'Mercury Blvd', 'Denbigh Blvd', 'J Clyde Morris Blvd'],
  'Alexandria': ['King St', 'Duke St', 'Washington St', 'Braddock Rd', 'Seminary Rd'],
  'Milwaukee': ['Water St', 'Wisconsin Ave', 'N 3rd St', 'Vliet St', 'North Ave', 'Center St', 'Capitol Dr', 'Lisbon Ave'],
  'Madison': ['State St', 'University Ave', 'E Washington Ave', 'Park St', 'Monroe St', 'Atwood Ave'],
  'Green Bay': ['Main St', 'Military Ave', 'Oneida St', 'E Mason St', 'S Broadway'],
  'Kenosha': ['Sheridan Rd', '22nd Ave', '75th St', 'Roosevelt Rd', '52nd St'],
  'Racine': ['Main St', 'Washington Ave', 'State St', 'Rapids Dr', 'Lathrop Ave'],
  'Appleton': ['College Ave', 'Wisconsin Ave', 'Oneida St', 'Richmond St', 'E Calumet St'],
}

// Wholesale-friendly states data with coordinates for SVG positioning and major cities
const WHOLESALE_STATES: Record<string, {
  name: string
  abbr: string
  friendly: boolean
  notes: string
  cities: { name: string; zip: string; county: string; lat: number; lng: number }[]
}> = {
  AL: { name: 'Alabama', abbr: 'AL', friendly: true, notes: 'No license required. Attorney-closing state. Very investor-friendly.', cities: [
    { name: 'Birmingham', zip: '35203', county: 'Jefferson', lat: 33.5207, lng: -86.8025 },
    { name: 'Montgomery', zip: '36104', county: 'Montgomery', lat: 32.3792, lng: -86.3077 },
    { name: 'Huntsville', zip: '35801', county: 'Madison', lat: 34.7304, lng: -86.5861 },
    { name: 'Mobile', zip: '36602', county: 'Mobile', lat: 30.6954, lng: -88.0399 },
    { name: 'Tuscaloosa', zip: '35401', county: 'Tuscaloosa', lat: 33.2098, lng: -87.5692 },
    { name: 'Decatur', zip: '35601', county: 'Morgan', lat: 34.6059, lng: -86.9834 },
    { name: 'Hoover', zip: '35244', county: 'Jefferson', lat: 33.3765, lng: -86.8114 },
  ]},
  AZ: { name: 'Arizona', abbr: 'AZ', friendly: true, notes: 'No license required. One of the most wholesaler-friendly states.', cities: [
    { name: 'Phoenix', zip: '85003', county: 'Maricopa', lat: 33.4484, lng: -112.0740 },
    { name: 'Tucson', zip: '85701', county: 'Pima', lat: 32.2226, lng: -110.9747 },
    { name: 'Mesa', zip: '85201', county: 'Maricopa', lat: 33.4152, lng: -111.8315 },
    { name: 'Scottsdale', zip: '85251', county: 'Maricopa', lat: 33.4942, lng: -111.9261 },
    { name: 'Chandler', zip: '85225', county: 'Maricopa', lat: 33.3062, lng: -111.8413 },
    { name: 'Gilbert', zip: '85234', county: 'Maricopa', lat: 33.3528, lng: -111.7890 },
    { name: 'Tempe', zip: '85281', county: 'Maricopa', lat: 33.4255, lng: -111.9400 },
    { name: 'Glendale', zip: '85301', county: 'Maricopa', lat: 33.5387, lng: -112.1860 },
  ]},
  AR: { name: 'Arkansas', abbr: 'AR', friendly: true, notes: 'No specific wholesale laws. Affordable entry point.', cities: [
    { name: 'Little Rock', zip: '72201', county: 'Pulaski', lat: 34.7465, lng: -92.2896 },
    { name: 'Fort Smith', zip: '72901', county: 'Sebastian', lat: 35.3859, lng: -94.3985 },
    { name: 'Fayetteville', zip: '72701', county: 'Washington', lat: 36.0626, lng: -94.1574 },
    { name: 'Springdale', zip: '72764', county: 'Washington', lat: 36.1867, lng: -94.1288 },
    { name: 'Jonesboro', zip: '72401', county: 'Craighead', lat: 35.8423, lng: -90.7043 },
    { name: 'Conway', zip: '72032', county: 'Faulkner', lat: 35.0887, lng: -92.4421 },
  ]},
  CO: { name: 'Colorado', abbr: 'CO', friendly: true, notes: 'Assignment allowed. Must use Division-approved forms. Denver is active.', cities: [
    { name: 'Denver', zip: '80202', county: 'Denver', lat: 39.7392, lng: -104.9903 },
    { name: 'Colorado Springs', zip: '80903', county: 'El Paso', lat: 38.8339, lng: -104.8214 },
    { name: 'Aurora', zip: '80012', county: 'Arapahoe', lat: 39.7294, lng: -104.8319 },
    { name: 'Fort Collins', zip: '80521', county: 'Larimer', lat: 40.5853, lng: -105.0844 },
    { name: 'Lakewood', zip: '80226', county: 'Jefferson', lat: 39.7047, lng: -105.0814 },
    { name: 'Pueblo', zip: '81003', county: 'Pueblo', lat: 38.2544, lng: -104.6091 },
  ]},
  FL: { name: 'Florida', abbr: 'FL', friendly: true, notes: 'High-volume wholesale state. Assignment fees must be disclosed.', cities: [
    { name: 'Miami', zip: '33130', county: 'Miami-Dade', lat: 25.7617, lng: -80.1918 },
    { name: 'Orlando', zip: '32801', county: 'Orange', lat: 28.5383, lng: -81.3792 },
    { name: 'Tampa', zip: '33602', county: 'Hillsborough', lat: 27.9506, lng: -82.4572 },
    { name: 'Jacksonville', zip: '32202', county: 'Duval', lat: 30.3322, lng: -81.6557 },
    { name: 'Fort Lauderdale', zip: '33301', county: 'Broward', lat: 26.1224, lng: -80.1373 },
    { name: 'St. Petersburg', zip: '33701', county: 'Pinellas', lat: 27.7676, lng: -82.6403 },
    { name: 'Hialeah', zip: '33010', county: 'Miami-Dade', lat: 25.8576, lng: -80.2781 },
    { name: 'Tallahassee', zip: '32301', county: 'Leon', lat: 30.4383, lng: -84.2807 },
    { name: 'Cape Coral', zip: '33904', county: 'Lee', lat: 26.5629, lng: -81.9495 },
  ]},
  GA: { name: 'Georgia', abbr: 'GA', friendly: true, notes: 'Very investor-friendly. Atlanta is a top wholesale market nationally.', cities: [
    { name: 'Atlanta', zip: '30303', county: 'Fulton', lat: 33.7490, lng: -84.3880 },
    { name: 'Savannah', zip: '31401', county: 'Chatham', lat: 32.0809, lng: -81.0912 },
    { name: 'Augusta', zip: '30901', county: 'Richmond', lat: 33.4735, lng: -81.9748 },
    { name: 'Columbus', zip: '31901', county: 'Muscogee', lat: 32.4610, lng: -84.9877 },
    { name: 'Macon', zip: '31201', county: 'Bibb', lat: 32.8407, lng: -83.6324 },
    { name: 'Marietta', zip: '30060', county: 'Cobb', lat: 33.9526, lng: -84.5499 },
    { name: 'Albany', zip: '31701', county: 'Dougherty', lat: 31.5785, lng: -84.1557 },
  ]},
  ID: { name: 'Idaho', abbr: 'ID', friendly: true, notes: 'Growing market. No specific wholesale legislation.', cities: [
    { name: 'Boise', zip: '83702', county: 'Ada', lat: 43.6150, lng: -116.2023 },
    { name: 'Meridian', zip: '83642', county: 'Ada', lat: 43.6121, lng: -116.3915 },
    { name: 'Nampa', zip: '83651', county: 'Canyon', lat: 43.5407, lng: -116.5635 },
    { name: 'Idaho Falls', zip: '83401', county: 'Bonneville', lat: 43.4917, lng: -112.0339 },
    { name: 'Pocatello', zip: '83201', county: 'Bannock', lat: 42.8713, lng: -112.4455 },
  ]},
  IL: { name: 'Illinois', abbr: 'IL', friendly: true, notes: 'Attorney-closing state. Chicago is a top wholesale market.', cities: [
    { name: 'Chicago', zip: '60601', county: 'Cook', lat: 41.8781, lng: -87.6298 },
    { name: 'Aurora', zip: '60505', county: 'Kane', lat: 41.7606, lng: -88.3201 },
    { name: 'Rockford', zip: '61101', county: 'Winnebago', lat: 42.2711, lng: -89.0940 },
    { name: 'Joliet', zip: '60432', county: 'Will', lat: 41.5250, lng: -88.0817 },
    { name: 'Springfield', zip: '62701', county: 'Sangamon', lat: 39.7817, lng: -89.6501 },
    { name: 'Naperville', zip: '60540', county: 'DuPage', lat: 41.7508, lng: -88.1535 },
    { name: 'Peoria', zip: '61602', county: 'Peoria', lat: 40.6936, lng: -89.5890 },
  ]},
  IN: { name: 'Indiana', abbr: 'IN', friendly: true, notes: 'Very wholesaler-friendly. Indianapolis is strong with active cash buyers.', cities: [
    { name: 'Indianapolis', zip: '46204', county: 'Marion', lat: 39.7684, lng: -86.1581 },
    { name: 'Fort Wayne', zip: '46802', county: 'Allen', lat: 41.0793, lng: -85.1394 },
    { name: 'Evansville', zip: '47708', county: 'Vanderburgh', lat: 37.9716, lng: -87.5711 },
    { name: 'South Bend', zip: '46601', county: 'St. Joseph', lat: 41.6764, lng: -86.2520 },
    { name: 'Gary', zip: '46402', county: 'Lake', lat: 41.5934, lng: -87.3464 },
    { name: 'Carmel', zip: '46032', county: 'Hamilton', lat: 39.9784, lng: -86.1180 },
  ]},
  KY: { name: 'Kentucky', abbr: 'KY', friendly: true, notes: 'No license required for wholesale assignment.', cities: [
    { name: 'Louisville', zip: '40202', county: 'Jefferson', lat: 38.2527, lng: -85.7585 },
    { name: 'Lexington', zip: '40507', county: 'Fayette', lat: 38.0406, lng: -84.5037 },
    { name: 'Bowling Green', zip: '42101', county: 'Warren', lat: 36.9903, lng: -86.4436 },
    { name: 'Owensboro', zip: '42301', county: 'Daviess', lat: 37.7719, lng: -87.1112 },
    { name: 'Covington', zip: '41011', county: 'Kenton', lat: 39.0837, lng: -84.5086 },
  ]},
  LA: { name: 'Louisiana', abbr: 'LA', friendly: true, notes: 'Unique civil law. Notarial closings. Flood zones major consideration.', cities: [
    { name: 'New Orleans', zip: '70112', county: 'Orleans Parish', lat: 29.9511, lng: -90.0715 },
    { name: 'Baton Rouge', zip: '70801', county: 'East Baton Rouge', lat: 30.4515, lng: -91.1871 },
    { name: 'Shreveport', zip: '71101', county: 'Caddo Parish', lat: 32.5252, lng: -93.7502 },
    { name: 'Lafayette', zip: '70501', county: 'Lafayette Parish', lat: 30.2241, lng: -92.0198 },
    { name: 'Lake Charles', zip: '70601', county: 'Calcasieu Parish', lat: 30.2266, lng: -93.2174 },
  ]},
  MD: { name: 'Maryland', abbr: 'MD', friendly: true, notes: 'HB 1079 regulates wholesale. Baltimore is active.', cities: [
    { name: 'Baltimore', zip: '21202', county: 'Baltimore City', lat: 39.2904, lng: -76.6122 },
    { name: 'Columbia', zip: '21044', county: 'Howard', lat: 39.2037, lng: -76.8610 },
    { name: 'Silver Spring', zip: '20901', county: 'Montgomery', lat: 38.9907, lng: -77.0261 },
    { name: 'Frederick', zip: '21701', county: 'Frederick', lat: 39.4143, lng: -77.4105 },
    { name: 'Hagerstown', zip: '21740', county: 'Washington', lat: 39.6418, lng: -77.7200 },
  ]},
  MI: { name: 'Michigan', abbr: 'MI', friendly: true, notes: 'No attorney required. Detroit is highly active for low-cost properties.', cities: [
    { name: 'Detroit', zip: '48226', county: 'Wayne', lat: 42.3314, lng: -83.0458 },
    { name: 'Grand Rapids', zip: '49503', county: 'Kent', lat: 42.9634, lng: -85.6681 },
    { name: 'Flint', zip: '48502', county: 'Genesee', lat: 43.0125, lng: -83.6875 },
    { name: 'Lansing', zip: '48933', county: 'Ingham', lat: 42.7325, lng: -84.5555 },
    { name: 'Ann Arbor', zip: '48104', county: 'Washtenaw', lat: 42.2808, lng: -83.7430 },
    { name: 'Warren', zip: '48089', county: 'Macomb', lat: 42.4775, lng: -83.0277 },
    { name: 'Sterling Heights', zip: '48310', county: 'Macomb', lat: 42.5803, lng: -83.0302 },
  ]},
  MN: { name: 'Minnesota', abbr: 'MN', friendly: true, notes: 'Wholesaler-friendly. Minneapolis-St. Paul is active.', cities: [
    { name: 'Minneapolis', zip: '55401', county: 'Hennepin', lat: 44.9778, lng: -93.2650 },
    { name: 'St. Paul', zip: '55101', county: 'Ramsey', lat: 44.9537, lng: -93.0900 },
    { name: 'Rochester', zip: '55901', county: 'Olmsted', lat: 44.0121, lng: -92.4802 },
    { name: 'Duluth', zip: '55802', county: 'St. Louis', lat: 46.7867, lng: -92.1005 },
    { name: 'Brooklyn Park', zip: '55443', county: 'Hennepin', lat: 45.0941, lng: -93.3563 },
  ]},
  MS: { name: 'Mississippi', abbr: 'MS', friendly: true, notes: 'Wholesale friendly. Few restrictions. Low property values.', cities: [
    { name: 'Jackson', zip: '39201', county: 'Hinds', lat: 32.2988, lng: -90.1848 },
    { name: 'Gulfport', zip: '39501', county: 'Harrison', lat: 30.3674, lng: -89.0928 },
    { name: 'Hattiesburg', zip: '39401', county: 'Forrest', lat: 31.3271, lng: -89.2903 },
    { name: 'Biloxi', zip: '39530', county: 'Harrison', lat: 30.3960, lng: -88.8853 },
    { name: 'Southaven', zip: '38671', county: 'DeSoto', lat: 34.9689, lng: -89.9937 },
  ]},
  MO: { name: 'Missouri', abbr: 'MO', friendly: true, notes: 'No specific wholesale legislation. KC and St. Louis are strong.', cities: [
    { name: 'Kansas City', zip: '64106', county: 'Jackson', lat: 39.0997, lng: -94.5786 },
    { name: 'St. Louis', zip: '63101', county: 'St. Louis City', lat: 38.6270, lng: -90.1994 },
    { name: 'Springfield', zip: '65806', county: 'Greene', lat: 37.2090, lng: -93.2923 },
    { name: 'Columbia', zip: '65201', county: 'Boone', lat: 38.9517, lng: -92.3341 },
    { name: 'Independence', zip: '64050', county: 'Jackson', lat: 39.0911, lng: -94.4155 },
    { name: 'Lee\'s Summit', zip: '64063', county: 'Jackson', lat: 38.9108, lng: -94.3822 },
  ]},
  NC: { name: 'North Carolina', abbr: 'NC', friendly: true, notes: 'Charlotte and Raleigh-Durham are active wholesale markets.', cities: [
    { name: 'Charlotte', zip: '28202', county: 'Mecklenburg', lat: 35.2271, lng: -80.8431 },
    { name: 'Raleigh', zip: '27601', county: 'Wake', lat: 35.7796, lng: -78.6382 },
    { name: 'Greensboro', zip: '27401', county: 'Guilford', lat: 36.0726, lng: -79.7920 },
    { name: 'Durham', zip: '27701', county: 'Durham', lat: 35.9940, lng: -78.8986 },
    { name: 'Winston-Salem', zip: '27101', county: 'Forsyth', lat: 36.0999, lng: -80.2442 },
    { name: 'Fayetteville', zip: '28301', county: 'Cumberland', lat: 35.0527, lng: -78.8784 },
    { name: 'Wilmington', zip: '28401', county: 'New Hanover', lat: 34.2257, lng: -77.9447 },
    { name: 'Asheville', zip: '28801', county: 'Buncombe', lat: 35.5951, lng: -82.5515 },
  ]},
  NV: { name: 'Nevada', abbr: 'NV', friendly: true, notes: 'AB 404 regulations. Las Vegas is a major wholesale market.', cities: [
    { name: 'Las Vegas', zip: '89101', county: 'Clark', lat: 36.1699, lng: -115.1398 },
    { name: 'Henderson', zip: '89002', county: 'Clark', lat: 36.0395, lng: -114.9817 },
    { name: 'Reno', zip: '89501', county: 'Washoe', lat: 39.5296, lng: -119.8138 },
    { name: 'North Las Vegas', zip: '89030', county: 'Clark', lat: 36.1989, lng: -115.1175 },
    { name: 'Sparks', zip: '89431', county: 'Washoe', lat: 39.5349, lng: -119.7527 },
  ]},
  OH: { name: 'Ohio', abbr: 'OH', friendly: true, notes: 'Very wholesaler-friendly. Cleveland, Columbus, Cincinnati all active.', cities: [
    { name: 'Columbus', zip: '43215', county: 'Franklin', lat: 39.9612, lng: -82.9988 },
    { name: 'Cleveland', zip: '44114', county: 'Cuyahoga', lat: 41.4993, lng: -81.6944 },
    { name: 'Cincinnati', zip: '45202', county: 'Hamilton', lat: 39.1031, lng: -84.5120 },
    { name: 'Toledo', zip: '43604', county: 'Lucas', lat: 41.6528, lng: -83.5379 },
    { name: 'Akron', zip: '44308', county: 'Summit', lat: 41.0814, lng: -81.5190 },
    { name: 'Dayton', zip: '45402', county: 'Montgomery', lat: 39.7589, lng: -84.1916 },
    { name: 'Youngstown', zip: '44503', county: 'Mahoning', lat: 41.0998, lng: -80.6495 },
    { name: 'Canton', zip: '44702', county: 'Stark', lat: 40.7990, lng: -81.3784 },
  ]},
  OK: { name: 'Oklahoma', abbr: 'OK', friendly: true, notes: 'No specific wholesale legislation. OKC and Tulsa are active.', cities: [
    { name: 'Oklahoma City', zip: '73102', county: 'Oklahoma', lat: 35.4676, lng: -97.5164 },
    { name: 'Tulsa', zip: '74103', county: 'Tulsa', lat: 36.1540, lng: -95.9928 },
    { name: 'Norman', zip: '73069', county: 'Cleveland', lat: 35.2226, lng: -97.4395 },
    { name: 'Broken Arrow', zip: '74012', county: 'Tulsa', lat: 36.0526, lng: -95.7908 },
    { name: 'Lawton', zip: '73501', county: 'Comanche', lat: 34.6036, lng: -98.3959 },
    { name: 'Edmond', zip: '73003', county: 'Oklahoma', lat: 35.6528, lng: -97.4781 },
  ]},
  PA: { name: 'Pennsylvania', abbr: 'PA', friendly: true, notes: 'Philly has specific licensing. Pittsburgh is straightforward.', cities: [
    { name: 'Philadelphia', zip: '19103', county: 'Philadelphia', lat: 39.9526, lng: -75.1652 },
    { name: 'Pittsburgh', zip: '15222', county: 'Allegheny', lat: 40.4406, lng: -79.9959 },
    { name: 'Allentown', zip: '18101', county: 'Lehigh', lat: 40.6023, lng: -75.4714 },
    { name: 'Reading', zip: '19601', county: 'Berks', lat: 40.3357, lng: -75.9269 },
    { name: 'Erie', zip: '16501', county: 'Erie', lat: 42.1292, lng: -80.0851 },
    { name: 'Scranton', zip: '18503', county: 'Lackawanna', lat: 41.4090, lng: -75.6624 },
  ]},
  SC: { name: 'South Carolina', abbr: 'SC', friendly: true, notes: 'Attorney-closing state. Charleston and Columbia are growing.', cities: [
    { name: 'Charleston', zip: '29401', county: 'Charleston', lat: 32.7765, lng: -79.9311 },
    { name: 'Columbia', zip: '29201', county: 'Richland', lat: 34.0007, lng: -81.0348 },
    { name: 'Greenville', zip: '29601', county: 'Greenville', lat: 34.8526, lng: -82.3940 },
    { name: 'Myrtle Beach', zip: '29577', county: 'Horry', lat: 33.6891, lng: -78.8867 },
    { name: 'Rock Hill', zip: '29730', county: 'York', lat: 34.9249, lng: -81.0251 },
    { name: 'Spartanburg', zip: '29302', county: 'Spartanburg', lat: 34.9496, lng: -81.9320 },
  ]},
  TN: { name: 'Tennessee', abbr: 'TN', friendly: true, notes: 'Top wholesale markets — Nashville and Memphis.', cities: [
    { name: 'Nashville', zip: '37203', county: 'Davidson', lat: 36.1627, lng: -86.7816 },
    { name: 'Memphis', zip: '38103', county: 'Shelby', lat: 35.1495, lng: -90.0490 },
    { name: 'Knoxville', zip: '37902', county: 'Knox', lat: 35.9606, lng: -83.9207 },
    { name: 'Chattanooga', zip: '37402', county: 'Hamilton', lat: 35.0456, lng: -85.3097 },
    { name: 'Clarksville', zip: '37040', county: 'Montgomery', lat: 36.5298, lng: -87.3595 },
    { name: 'Murfreesboro', zip: '37130', county: 'Rutherford', lat: 35.8456, lng: -86.3903 },
  ]},
  TX: { name: 'Texas', abbr: 'TX', friendly: true, notes: 'HB 1228 requires disclosure. DFW, Houston, SA are top markets.', cities: [
    { name: 'Houston', zip: '77002', county: 'Harris', lat: 29.7604, lng: -95.3698 },
    { name: 'Dallas', zip: '75201', county: 'Dallas', lat: 32.7767, lng: -96.7970 },
    { name: 'San Antonio', zip: '78205', county: 'Bexar', lat: 29.4241, lng: -98.4936 },
    { name: 'Austin', zip: '78701', county: 'Travis', lat: 30.2672, lng: -97.7431 },
    { name: 'Fort Worth', zip: '76102', county: 'Tarrant', lat: 32.7555, lng: -97.3308 },
    { name: 'El Paso', zip: '79901', county: 'El Paso', lat: 31.7619, lng: -106.4850 },
    { name: 'Arlington', zip: '76010', county: 'Tarrant', lat: 32.7357, lng: -97.1081 },
    { name: 'Corpus Christi', zip: '78401', county: 'Nueces', lat: 27.8006, lng: -97.3964 },
    { name: 'Plano', zip: '75074', county: 'Collin', lat: 33.0198, lng: -96.6989 },
    { name: 'Lubbock', zip: '79401', county: 'Lubbock', lat: 33.5779, lng: -101.8552 },
  ]},
  UT: { name: 'Utah', abbr: 'UT', friendly: true, notes: 'No specific wholesale legislation. Salt Lake City is active.', cities: [
    { name: 'Salt Lake City', zip: '84101', county: 'Salt Lake', lat: 40.7608, lng: -111.8910 },
    { name: 'West Valley City', zip: '84119', county: 'Salt Lake', lat: 40.6916, lng: -111.9391 },
    { name: 'Provo', zip: '84601', county: 'Utah', lat: 40.2338, lng: -111.6585 },
    { name: 'Ogden', zip: '84401', county: 'Weber', lat: 41.2230, lng: -111.9738 },
    { name: 'Layton', zip: '84041', county: 'Davis', lat: 41.0602, lng: -111.9711 },
    { name: 'St. George', zip: '84770', county: 'Washington', lat: 37.0965, lng: -113.5684 },
  ]},
  VA: { name: 'Virginia', abbr: 'VA', friendly: true, notes: 'VA Real Estate Board provides guidance. Hampton Roads offers good margins.', cities: [
    { name: 'Virginia Beach', zip: '23451', county: 'Virginia Beach', lat: 36.8529, lng: -75.9780 },
    { name: 'Norfolk', zip: '23510', county: 'Norfolk', lat: 36.8508, lng: -76.2859 },
    { name: 'Richmond', zip: '23219', county: 'Richmond City', lat: 37.5407, lng: -77.4360 },
    { name: 'Chesapeake', zip: '23320', county: 'Chesapeake', lat: 36.7682, lng: -76.2875 },
    { name: 'Newport News', zip: '23601', county: 'Newport News', lat: 37.0871, lng: -76.4730 },
    { name: 'Alexandria', zip: '22314', county: 'Alexandria', lat: 38.8048, lng: -77.0469 },
  ]},
  WI: { name: 'Wisconsin', abbr: 'WI', friendly: true, notes: 'Assignment legal with proper documentation. Milwaukee is primary market.', cities: [
    { name: 'Milwaukee', zip: '53202', county: 'Milwaukee', lat: 43.0389, lng: -87.9065 },
    { name: 'Madison', zip: '53703', county: 'Dane', lat: 43.0731, lng: -89.4012 },
    { name: 'Green Bay', zip: '54301', county: 'Brown', lat: 44.5133, lng: -88.0133 },
    { name: 'Kenosha', zip: '53140', county: 'Kenosha', lat: 42.5847, lng: -87.8212 },
    { name: 'Racine', zip: '53403', county: 'Racine', lat: 42.7261, lng: -87.7829 },
    { name: 'Appleton', zip: '54911', county: 'Outagamie', lat: 44.2619, lng: -88.4154 },
  ]},
  // Non-wholesale-friendly (for map display)
  CA: { name: 'California', abbr: 'CA', friendly: false, notes: 'Complex. AB 1788 limits assignment rights. Heavy regulation.', cities: [] },
  NY: { name: 'New York', abbr: 'NY', friendly: false, notes: 'Complex regulatory environment. Attorney-closing state.', cities: [] },
  NJ: { name: 'New Jersey', abbr: 'NJ', friendly: false, notes: 'Attorney-closing state with 3-day review period.', cities: [] },
  CT: { name: 'Connecticut', abbr: 'CT', friendly: false, notes: 'Attorney-closing state. Complex regulations.', cities: [] },
  MA: { name: 'Massachusetts', abbr: 'MA', friendly: false, notes: 'Attorney-closing state with strong consumer protection.', cities: [] },
  OR: { name: 'Oregon', abbr: 'OR', friendly: false, notes: 'Can classify frequent wholesalers as "dealers" requiring licensing.', cities: [] },
  WA: { name: 'Washington', abbr: 'WA', friendly: false, notes: 'High prices, thin margins. Strict consumer protection.', cities: [] },
  HI: { name: 'Hawaii', abbr: 'HI', friendly: false, notes: 'Unique market with leasehold properties. Thin margins.', cities: [] },
}

// SVG path data for US states (simplified)
const STATE_PATHS: Record<string, string> = {
  AL: 'M628,396 L628,445 L618,460 L625,468 L638,460 L646,446 L646,396Z',
  AK: 'M110,485 L160,485 L170,510 L130,530 L100,520 L90,500Z',
  AZ: 'M195,380 L245,380 L250,440 L210,450 L190,435Z',
  AR: 'M545,395 L595,395 L595,435 L545,440Z',
  CA: 'M120,260 L155,260 L170,330 L160,400 L130,410 L110,360 L110,290Z',
  CO: 'M280,290 L355,290 L355,340 L280,340Z',
  CT: 'M770,215 L790,210 L795,225 L775,230Z',
  DE: 'M740,285 L750,280 L752,300 L742,300Z',
  FL: 'M630,465 L690,450 L710,470 L700,520 L670,540 L650,510 L640,475Z',
  GA: 'M645,390 L690,390 L695,445 L650,455 L645,440Z',
  HI: 'M300,505 L330,500 L340,515 L315,520Z',
  ID: 'M210,170 L240,150 L250,230 L220,260 L210,230Z',
  IL: 'M555,260 L580,260 L585,345 L560,360 L550,320Z',
  IN: 'M590,270 L620,270 L620,350 L590,350Z',
  IA: 'M490,240 L555,240 L555,290 L490,290Z',
  KS: 'M390,320 L480,320 L480,370 L390,370Z',
  KY: 'M580,340 L660,325 L665,350 L580,365Z',
  LA: 'M530,445 L575,440 L585,470 L570,490 L540,485 L525,465Z',
  ME: 'M790,130 L810,115 L815,160 L795,175Z',
  MD: 'M700,280 L745,270 L748,295 L710,300Z',
  MA: 'M770,195 L800,190 L805,205 L775,210Z',
  MI: 'M570,175 L620,165 L630,230 L600,260 L575,240 L565,200Z',
  MN: 'M470,135 L530,135 L535,220 L470,225Z',
  MS: 'M575,400 L600,400 L605,460 L575,465Z',
  MO: 'M490,310 L555,300 L560,370 L490,380Z',
  MT: 'M235,120 L345,120 L345,180 L235,185Z',
  NE: 'M370,260 L470,255 L475,305 L380,310Z',
  NV: 'M165,240 L210,230 L220,330 L175,350Z',
  NH: 'M775,155 L790,150 L792,195 L777,200Z',
  NJ: 'M745,240 L758,235 L760,280 L748,285Z',
  NM: 'M250,375 L330,370 L335,445 L255,450Z',
  NY: 'M700,175 L770,160 L775,220 L740,240 L700,230Z',
  NC: 'M650,345 L740,330 L745,355 L660,370Z',
  ND: 'M370,130 L460,130 L460,185 L370,185Z',
  OH: 'M625,260 L665,255 L670,320 L625,325Z',
  OK: 'M380,375 L480,365 L490,400 L400,410 L375,395Z',
  OR: 'M120,160 L200,155 L205,220 L120,230Z',
  PA: 'M680,235 L745,225 L748,270 L685,278Z',
  RI: 'M785,215 L792,212 L793,225 L786,227Z',
  SC: 'M660,370 L710,360 L715,395 L670,400Z',
  SD: 'M370,185 L460,185 L465,245 L375,250Z',
  TN: 'M565,360 L660,345 L665,370 L570,385Z',
  TX: 'M335,400 L470,390 L490,420 L485,500 L430,520 L370,500 L340,460Z',
  UT: 'M225,260 L280,255 L285,340 L230,345Z',
  VT: 'M765,145 L778,140 L780,190 L768,195Z',
  VA: 'M650,305 L740,290 L745,325 L660,340Z',
  WA: 'M130,110 L210,105 L215,165 L140,170Z',
  WV: 'M660,280 L695,270 L700,325 L665,330Z',
  WI: 'M520,155 L570,150 L575,230 L525,235Z',
  WY: 'M270,195 L350,190 L355,255 L275,260Z',
}

type ViewLevel = 'country' | 'state' | 'city' | 'address'

interface AddressSearch {
  address: string
  city: string
  state: string
  zip: string
  lat: number
  lng: number
}

// Due diligence checklist items
const DUE_DILIGENCE_CHECKLIST = [
  { id: 'title', label: 'Run title search for liens & encumbrances' },
  { id: 'tax', label: 'Verify property tax status (current or delinquent)' },
  { id: 'arv', label: 'Calculate ARV using 3+ recent comps' },
  { id: 'repair', label: 'Estimate repair costs (get contractor bid)' },
  { id: 'mao', label: 'Calculate MAO (ARV x 70% - Repairs - Fee)' },
  { id: 'owner', label: 'Verify owner info matches county records' },
  { id: 'zoning', label: 'Check zoning & code violations' },
  { id: 'contract', label: 'Get property under contract with assignment clause' },
  { id: 'buyer', label: 'Market to cash buyer list' },
  { id: 'close', label: 'Coordinate with title company for closing' },
]

export default function PropertyMap() {
  const [viewLevel, setViewLevel] = useState<ViewLevel>('country')
  const [selectedState, setSelectedState] = useState<string | null>(null)
  const [selectedCity, setSelectedCity] = useState<string | null>(null)
  const [addressSearch, setAddressSearch] = useState('')
  const [hoveredState, setHoveredState] = useState<string | null>(null)
  const [searchResults, setSearchResults] = useState<AddressSearch[]>([])
  const [showStreetView, setShowStreetView] = useState(false)
  const [currentAddress, setCurrentAddress] = useState<AddressSearch | null>(null)
  const [stateFilter, setStateFilter] = useState('')
  const [showOnlyFriendly, setShowOnlyFriendly] = useState(false)
  const [checkedItems, setCheckedItems] = useState<Set<string>>(new Set())
  const [activeTab, setActiveTab] = useState<'map' | 'list'>('map')

  const stateData = selectedState ? WHOLESALE_STATES[selectedState] : null
  const cityData = stateData?.cities.find(c => c.name === selectedCity) || null

  const friendlyCount = useMemo(() => Object.values(WHOLESALE_STATES).filter(s => s.friendly).length, [])
  const totalCities = useMemo(() => Object.values(WHOLESALE_STATES).reduce((acc, s) => acc + s.cities.length, 0), [])
  const restrictedCount = useMemo(() => Object.values(WHOLESALE_STATES).filter(s => !s.friendly).length, [])

  const filteredStates = useMemo(() => {
    return Object.entries(WHOLESALE_STATES)
      .filter(([_, s]) => {
        if (showOnlyFriendly && !s.friendly) return false
        if (stateFilter && !s.name.toLowerCase().includes(stateFilter.toLowerCase()) && !s.abbr.toLowerCase().includes(stateFilter.toLowerCase())) return false
        return true
      })
      .sort((a, b) => a[1].name.localeCompare(b[1].name))
  }, [stateFilter, showOnlyFriendly])

  const handleStateClick = useCallback((abbr: string) => {
    const state = WHOLESALE_STATES[abbr]
    if (state) {
      setSelectedState(abbr)
      setViewLevel('state')
      setSelectedCity(null)
      setSearchResults([])
      setCurrentAddress(null)
      setShowStreetView(false)
    }
  }, [])

  const handleCityClick = useCallback((cityName: string) => {
    setSelectedCity(cityName)
    setViewLevel('city')
    setSearchResults([])
    setCurrentAddress(null)
    setShowStreetView(false)
  }, [])

  const handleAddressSearch = useCallback(() => {
    if (!addressSearch.trim()) return
    const city = cityData
    const state = stateData
    if (city && state) {
      const streets = CITY_STREETS[city.name] || ['Main St', 'Oak Ave', 'Elm St', 'Maple Dr', 'Cedar Ln']
      const raw = addressSearch.trim()
      const query = raw.toLowerCase()

      // Parse input: separate leading house number from the street part
      const numMatch = raw.match(/^(\d+)\s+(.+)/)
      const typedHouseNum = numMatch ? parseInt(numMatch[1], 10) : null
      const streetQuery = numMatch ? numMatch[2].toLowerCase() : query

      // Score streets by match quality
      const scored = streets.map(street => {
        const sl = street.toLowerCase()
        let score = 0
        if (sl === streetQuery) score = 100                          // exact street match
        else if (sl.startsWith(streetQuery)) score = 80              // starts with query
        else if (streetQuery.length >= 3 && sl.includes(streetQuery)) score = 60  // contains query
        else if (query.length >= 3 && sl.includes(query)) score = 40 // full input as substring (covers no-number input)
        return { street, score }
      }).filter(s => s.score > 0)
        .sort((a, b) => b.score - a.score)

      const results: AddressSearch[] = []

      // Always include the exact typed address as the first result
      const charSumForOffset = raw.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
      results.push({
        address: raw,
        city: city.name,
        state: state.abbr,
        zip: city.zip,
        lat: city.lat + ((charSumForOffset % 100 - 50) * 0.001),
        lng: city.lng + ((charSumForOffset * 3 % 100 - 50) * 0.001),
      })

      // Add matched streets (with the user's house number if provided, otherwise a deterministic one)
      const seen = new Set<string>([raw.toLowerCase()])
      for (const { street } of scored.slice(0, 5)) {
        const charSum = street.split('').reduce((sum, ch) => sum + ch.charCodeAt(0), 0)
        const houseNum = typedHouseNum ?? (((charSum * 7) % 8900) + 100)
        const addr = `${houseNum} ${street}`
        if (seen.has(addr.toLowerCase())) continue
        seen.add(addr.toLowerCase())
        const idx = results.length
        const latOffset = ((charSum + idx * 37) % 100 - 50) * 0.001
        const lngOffset = ((charSum + idx * 53) % 100 - 50) * 0.001
        results.push({
          address: addr,
          city: city.name,
          state: state.abbr,
          zip: city.zip,
          lat: city.lat + latOffset,
          lng: city.lng + lngOffset,
        })
      }

      setSearchResults(results)
      setViewLevel('address')
    }
  }, [addressSearch, cityData, stateData])

  const handleBack = useCallback(() => {
    if (showStreetView) {
      setShowStreetView(false)
      return
    }
    if (viewLevel === 'address') {
      setViewLevel('city')
      setSearchResults([])
      setCurrentAddress(null)
    } else if (viewLevel === 'city') {
      setViewLevel('state')
      setSelectedCity(null)
    } else if (viewLevel === 'state') {
      setViewLevel('country')
      setSelectedState(null)
    }
  }, [viewLevel, showStreetView])

  const handleViewProperty = useCallback((result: AddressSearch) => {
    setCurrentAddress(result)
    setShowStreetView(true)
  }, [])

  const toggleChecked = useCallback((id: string) => {
    setCheckedItems(prev => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }, [])

  return (
    <div>
      <h2 className="section-header">Property Map</h2>
      <p style={{ color: '#888', fontSize: 14, marginBottom: 20, lineHeight: 1.7 }}>
        Interactive wholesale property research tool. Drill down from state to city to property address. {friendlyCount} wholesale-friendly states with {totalCities}+ markets covered.
      </p>

      {/* Stats Dashboard */}
      {viewLevel === 'country' && (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: 12, marginBottom: 24 }}>
          <div style={{ background: 'linear-gradient(135deg, rgba(244,126,95,0.12), rgba(244,126,95,0.04))', border: '1px solid rgba(244,126,95,0.3)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
            <Globe size={20} color="#ff7e5f" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ff7e5f', letterSpacing: '0.03em' }}>{friendlyCount}</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Friendly States</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(45,184,133,0.12), rgba(45,184,133,0.04))', border: '1px solid rgba(45,184,133,0.3)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
            <Building size={20} color="#5cb885" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#5cb885', letterSpacing: '0.03em' }}>{totalCities}+</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Markets</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(99,102,241,0.12), rgba(99,102,241,0.04))', border: '1px solid rgba(99,102,241,0.3)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
            <TrendingUp size={20} color="#6366f1" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#6366f1', letterSpacing: '0.03em' }}>50</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>States Mapped</div>
          </div>
          <div style={{ background: 'linear-gradient(135deg, rgba(239,68,68,0.12), rgba(239,68,68,0.04))', border: '1px solid rgba(239,68,68,0.3)', borderRadius: 12, padding: '16px 14px', textAlign: 'center' }}>
            <Shield size={20} color="#ef4444" style={{ margin: '0 auto 6px' }} />
            <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#ef4444', letterSpacing: '0.03em' }}>{restrictedCount}</div>
            <div style={{ fontSize: 11, color: '#999', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Restricted</div>
          </div>
        </div>
      )}

      {/* Breadcrumb */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16, flexWrap: 'wrap' }}>
        {viewLevel !== 'country' && (
          <button
            onClick={handleBack}
            style={{
              display: 'flex', alignItems: 'center', gap: 4,
              padding: '8px 14px', borderRadius: 8, border: '1px solid #3d4e65',
              background: 'rgba(255,255,255,0.03)', color: '#888', cursor: 'pointer', fontSize: 13,
            }}
          >
            <ArrowLeft size={14} /> Back
          </button>
        )}
        <button
          onClick={() => { setViewLevel('country'); setSelectedState(null); setSelectedCity(null); setSearchResults([]); setCurrentAddress(null); setShowStreetView(false) }}
          style={{ background: 'none', border: 'none', cursor: 'pointer', color: viewLevel === 'country' ? '#ff7e5f' : '#666', fontSize: 13, fontWeight: 600, padding: 0 }}
        >
          United States
        </button>
        {selectedState && stateData && (
          <>
            <ChevronRight size={12} color="#555" />
            <button
              onClick={() => { setViewLevel('state'); setSelectedCity(null); setSearchResults([]); setCurrentAddress(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: viewLevel === 'state' ? '#ff7e5f' : '#666', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              {stateData.name}
            </button>
          </>
        )}
        {selectedCity && (
          <>
            <ChevronRight size={12} color="#555" />
            <button
              onClick={() => { setViewLevel('city'); setSearchResults([]); setCurrentAddress(null) }}
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: viewLevel === 'city' ? '#ff7e5f' : '#666', fontSize: 13, fontWeight: 600, padding: 0 }}
            >
              {selectedCity}
            </button>
          </>
        )}
        {currentAddress && (
          <>
            <ChevronRight size={12} color="#555" />
            <span style={{ color: '#ff7e5f', fontSize: 13, fontWeight: 600 }}>{currentAddress.address}</span>
          </>
        )}
      </div>

      {/* COUNTRY VIEW */}
      {viewLevel === 'country' && (
        <div>
          {/* Search & Filter Bar */}
          <div style={{ display: 'flex', gap: 10, marginBottom: 16, flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ position: 'relative', flex: '1 1 240px', minWidth: 200 }}>
              <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
              <input
                className="input-dark"
                placeholder="Search states (e.g. Texas, FL)..."
                value={stateFilter}
                onChange={e => setStateFilter(e.target.value)}
                style={{ paddingLeft: 34, width: '100%', boxSizing: 'border-box' }}
              />
            </div>
            <button
              onClick={() => setShowOnlyFriendly(!showOnlyFriendly)}
              style={{
                display: 'flex', alignItems: 'center', gap: 6,
                padding: '10px 16px', borderRadius: 8,
                border: showOnlyFriendly ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                background: showOnlyFriendly ? 'rgba(244,126,95,0.12)' : 'transparent',
                color: showOnlyFriendly ? '#ff7e5f' : '#888',
                cursor: 'pointer', fontSize: 13, fontWeight: 600, transition: 'all 0.2s', whiteSpace: 'nowrap',
              }}
            >
              <Filter size={14} /> {showOnlyFriendly ? 'Friendly Only' : 'All States'}
            </button>
            {/* Map / List toggle */}
            <div style={{ display: 'flex', border: '1px solid #3d4e65', borderRadius: 8, overflow: 'hidden' }}>
              <button
                onClick={() => setActiveTab('map')}
                style={{
                  padding: '10px 16px', border: 'none', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: activeTab === 'map' ? 'rgba(244,126,95,0.15)' : 'transparent',
                  color: activeTab === 'map' ? '#ff7e5f' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                Map
              </button>
              <button
                onClick={() => setActiveTab('list')}
                style={{
                  padding: '10px 16px', border: 'none', borderLeft: '1px solid #3d4e65', cursor: 'pointer', fontSize: 13, fontWeight: 600,
                  background: activeTab === 'list' ? 'rgba(244,126,95,0.15)' : 'transparent',
                  color: activeTab === 'list' ? '#ff7e5f' : '#666',
                  transition: 'all 0.2s',
                }}
              >
                List
              </button>
            </div>
          </div>

          {/* Legend */}
          <div style={{ display: 'flex', gap: 16, marginBottom: 16, flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(244,126,95,0.5)', border: '1px solid #ff7e5f' }} />
              Wholesale-Friendly ({friendlyCount} states)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa' }}>
              <div style={{ width: 14, height: 14, borderRadius: 3, background: 'rgba(255,255,255,0.08)', border: '1px solid #333' }} />
              Restricted / Complex ({restrictedCount} states)
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: '#aaa' }}>
              <Info size={13} color="#666" />
              Click any state to explore
            </div>
          </div>

          {/* Map View */}
          {activeTab === 'map' && (
            <div style={{ background: '#12161c', border: '1px solid #3d4e65', borderRadius: 14, padding: '20px 12px', marginBottom: 24, overflow: 'hidden' }}>
              <svg
                viewBox="70 90 770 470"
                style={{ width: '100%', height: 'auto', minHeight: 350, maxHeight: 650 }}
                preserveAspectRatio="xMidYMid meet"
              >
                {/* Background grid lines for visual depth */}
                <defs>
                  <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                    <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255,255,255,0.02)" strokeWidth="0.5"/>
                  </pattern>
                </defs>
                <rect x="70" y="90" width="770" height="470" fill="url(#grid)" />

                {Object.entries(STATE_PATHS).map(([abbr, path]) => {
                  const state = WHOLESALE_STATES[abbr]
                  const isFriendly = state?.friendly ?? false
                  const isHovered = hoveredState === abbr
                  const isFiltered = stateFilter && state && (state.name.toLowerCase().includes(stateFilter.toLowerCase()) || state.abbr.toLowerCase().includes(stateFilter.toLowerCase()))
                  const dimmed = stateFilter && !isFiltered
                  return (
                    <path
                      key={abbr}
                      d={path}
                      fill={dimmed
                        ? 'rgba(255,255,255,0.01)'
                        : isFriendly
                          ? (isHovered ? 'rgba(244,126,95,0.75)' : isFiltered ? 'rgba(244,126,95,0.6)' : 'rgba(244,126,95,0.3)')
                          : (isHovered ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.05)')
                      }
                      stroke={dimmed
                        ? 'rgba(255,255,255,0.03)'
                        : isFriendly
                          ? (isHovered ? '#ff7e5f' : isFiltered ? '#ff7e5f' : 'rgba(244,126,95,0.45)')
                          : (isHovered ? '#555' : '#3d4e65')
                      }
                      strokeWidth={isHovered ? 2.5 : isFiltered ? 2 : 1}
                      style={{ cursor: 'pointer', transition: 'all 0.2s' }}
                      onMouseEnter={() => setHoveredState(abbr)}
                      onMouseLeave={() => setHoveredState(null)}
                      onClick={() => handleStateClick(abbr)}
                    />
                  )
                })}
                {/* State labels */}
                {Object.entries(STATE_PATHS).map(([abbr, path]) => {
                  const coords = path.match(/\d+/g)?.map(Number) || []
                  let cx = 0, cy = 0, count = 0
                  for (let i = 0; i < coords.length; i += 2) {
                    cx += coords[i]; cy += coords[i + 1]; count++
                  }
                  if (count === 0) return null
                  cx /= count; cy /= count
                  const state = WHOLESALE_STATES[abbr]
                  const isFriendly = state?.friendly ?? false
                  const dimmed = stateFilter && state && !state.name.toLowerCase().includes(stateFilter.toLowerCase()) && !state.abbr.toLowerCase().includes(stateFilter.toLowerCase())
                  return (
                    <text
                      key={`label-${abbr}`}
                      x={cx}
                      y={cy}
                      textAnchor="middle"
                      dominantBaseline="central"
                      fill={dimmed ? 'rgba(255,255,255,0.05)' : isFriendly ? '#ff7e5f' : '#444'}
                      fontSize={10}
                      fontWeight={700}
                      fontFamily="'DM Sans', sans-serif"
                      style={{ pointerEvents: 'none', transition: 'fill 0.2s' }}
                    >
                      {abbr}
                    </text>
                  )
                })}
              </svg>

              {/* Hovered state tooltip */}
              {hoveredState && WHOLESALE_STATES[hoveredState] && (
                <div style={{
                  background: '#141414', border: '1px solid #3d4e65', borderRadius: 10, padding: '14px 18px',
                  marginTop: 10,
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
                    <MapPin size={16} color={WHOLESALE_STATES[hoveredState].friendly ? '#ff7e5f' : '#555'} />
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                      {WHOLESALE_STATES[hoveredState].name}
                    </span>
                    <span
                      className={WHOLESALE_STATES[hoveredState].friendly ? 'badge badge-orange' : ''}
                      style={!WHOLESALE_STATES[hoveredState].friendly ? { fontSize: 10, padding: '3px 8px', borderRadius: 4, background: 'rgba(239,68,68,0.15)', color: '#ef4444', border: '1px solid rgba(239,68,68,0.3)', fontWeight: 600, letterSpacing: '0.04em' } : { fontSize: 10 }}
                    >
                      {WHOLESALE_STATES[hoveredState].friendly ? 'Wholesale Friendly' : 'Restricted'}
                    </span>
                  </div>
                  <p style={{ fontSize: 13, color: '#999', margin: 0, lineHeight: 1.6 }}>
                    {WHOLESALE_STATES[hoveredState].notes}
                  </p>
                  {WHOLESALE_STATES[hoveredState].friendly && WHOLESALE_STATES[hoveredState].cities.length > 0 && (
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 8 }}>
                      <Building size={13} color="#666" />
                      <span style={{ fontSize: 12, color: '#666' }}>
                        {WHOLESALE_STATES[hoveredState].cities.length} markets available
                      </span>
                      <span style={{ fontSize: 12, color: '#ff7e5f', fontWeight: 600, marginLeft: 'auto' }}>
                        Click to explore →
                      </span>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* List View */}
          {activeTab === 'list' && (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(100%, 280px), 1fr))', gap: 12, marginBottom: 24 }}>
              {filteredStates.map(([abbr, state]) => (
                <button
                  key={abbr}
                  onClick={() => handleStateClick(abbr)}
                  style={{
                    background: 'rgba(255,255,255,0.02)', border: '1px solid #3d4e65', borderRadius: 12,
                    padding: '16px 18px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                    display: 'flex', flexDirection: 'column', gap: 8,
                  }}
                  onMouseEnter={e => { e.currentTarget.style.borderColor = state.friendly ? '#ff7e5f' : '#555'; e.currentTarget.style.background = state.friendly ? 'rgba(244,126,95,0.06)' : 'rgba(255,255,255,0.04)' }}
                  onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.background = 'rgba(255,255,255,0.02)' }}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <MapPin size={18} color={state.friendly ? '#ff7e5f' : '#555'} />
                    <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.03em', flex: 1 }}>
                      {state.name}
                    </span>
                    <span style={{ fontSize: 14, color: '#555', fontWeight: 700 }}>{abbr}</span>
                  </div>
                  <p style={{ fontSize: 12, color: '#777', margin: 0, lineHeight: 1.5 }}>{state.notes}</p>
                  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 }}>
                    <span
                      style={{
                        fontSize: 10, padding: '3px 8px', borderRadius: 4, fontWeight: 600, letterSpacing: '0.04em',
                        background: state.friendly ? 'rgba(244,126,95,0.12)' : 'rgba(239,68,68,0.1)',
                        color: state.friendly ? '#ff7e5f' : '#ef4444',
                        border: `1px solid ${state.friendly ? 'rgba(244,126,95,0.3)' : 'rgba(239,68,68,0.2)'}`,
                      }}
                    >
                      {state.friendly ? 'FRIENDLY' : 'RESTRICTED'}
                    </span>
                    {state.cities.length > 0 && (
                      <span style={{ fontSize: 11, color: '#666' }}>
                        {state.cities.length} markets →
                      </span>
                    )}
                  </div>
                </button>
              ))}
              {filteredStates.length === 0 && (
                <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: 40, color: '#555' }}>
                  No states match your search. Try a different term.
                </div>
              )}
            </div>
          )}
        </div>
      )}

      {/* STATE VIEW - Cities grid */}
      {viewLevel === 'state' && stateData && (
        <div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '28px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, flexWrap: 'wrap' }}>
              <MapPin size={28} color="#ff7e5f" />
              <div style={{ flex: 1 }}>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 32, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
                  {stateData.name}
                </h3>
                <span
                  style={{
                    display: 'inline-block', marginTop: 6, fontSize: 11, padding: '4px 10px', borderRadius: 4, fontWeight: 600, letterSpacing: '0.04em',
                    background: stateData.friendly ? 'rgba(244,126,95,0.12)' : 'rgba(239,68,68,0.1)',
                    color: stateData.friendly ? '#ff7e5f' : '#ef4444',
                    border: `1px solid ${stateData.friendly ? 'rgba(244,126,95,0.3)' : 'rgba(239,68,68,0.2)'}`,
                  }}
                >
                  {stateData.friendly ? 'WHOLESALE FRIENDLY' : 'RESTRICTED'}
                </span>
              </div>
            </div>
            <p style={{ fontSize: 15, color: '#999', lineHeight: 1.7, margin: '0 0 20px' }}>{stateData.notes}</p>

            {/* State stats */}
            {stateData.cities.length > 0 && (
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 10, marginBottom: 24 }}>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#ff7e5f' }}>{stateData.cities.length}</div>
                  <div style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Markets</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#5cb885' }}>{stateData.cities.reduce((a, c) => a + 1, 0)}</div>
                  <div style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Counties</div>
                </div>
                <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #222', borderRadius: 8, padding: '12px 14px', textAlign: 'center' }}>
                  <div style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#6366f1' }}>{stateData.friendly ? 'YES' : 'NO'}</div>
                  <div style={{ fontSize: 10, color: '#666', fontWeight: 600, letterSpacing: '0.04em', textTransform: 'uppercase' }}>Assignment OK</div>
                </div>
              </div>
            )}

            {stateData.cities.length > 0 ? (
              <>
                <div style={{ fontSize: 13, color: '#666', marginBottom: 14, fontWeight: 600 }}>
                  Select a city to search properties and access research tools:
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 12 }}>
                  {stateData.cities.map(city => (
                    <button
                      key={city.name}
                      onClick={() => handleCityClick(city.name)}
                      style={{
                        background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 12,
                        padding: '18px 16px', textAlign: 'left', cursor: 'pointer', transition: 'all 0.2s',
                      }}
                      onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff7e5f'; e.currentTarget.style.background = 'rgba(244,126,95,0.06)' }}
                      onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.background = 'rgba(255,255,255,0.03)' }}
                    >
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
                        <Building size={18} color="#ff7e5f" />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                          {city.name}
                        </span>
                      </div>
                      <div style={{ fontSize: 12, color: '#666', lineHeight: 1.6 }}>
                        <div>County: {city.county}</div>
                        <div>ZIP: {city.zip}</div>
                      </div>
                      <div style={{ fontSize: 12, color: '#ff7e5f', marginTop: 10, display: 'flex', alignItems: 'center', gap: 4, fontWeight: 600 }}>
                        Search properties <ChevronRight size={13} />
                      </div>
                    </button>
                  ))}
                </div>
              </>
            ) : (
              <div className="info-warn" style={{ marginTop: 0 }}>
                <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                  This state has complex wholesale regulations. Proceed with caution and always consult a local real estate attorney before attempting wholesale deals here.
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* CITY VIEW - Address search */}
      {viewLevel === 'city' && stateData && cityData && (
        <div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '28px 24px', marginBottom: 24 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 20 }}>
              <Building size={28} color="#ff7e5f" />
              <div>
                <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 28, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
                  {cityData.name}, {stateData.abbr}
                </h3>
                <div style={{ fontSize: 13, color: '#888', marginTop: 4 }}>
                  {cityData.county} County — ZIP: {cityData.zip}
                </div>
              </div>
            </div>

            {/* Address search bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input
                  className="input-dark"
                  placeholder={`Search street names in ${cityData.name}...`}
                  value={addressSearch}
                  onChange={e => setAddressSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddressSearch()}
                  style={{ paddingLeft: 34 }}
                />
              </div>
              <button
                onClick={handleAddressSearch}
                className="btn-orange"
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                <Search size={14} /> Search
              </button>
            </div>

            {/* Quick links for common property search tools */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 12, color: '#666', marginBottom: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                External Property Tools
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 8 }}>
                {[
                  { label: 'Google Maps', icon: '🗺️', url: `https://www.google.com/maps/search/properties+${encodeURIComponent(cityData.name + ', ' + stateData.abbr)}` },
                  { label: 'Zillow', icon: '🏠', url: `https://www.zillow.com/homes/${encodeURIComponent(cityData.name + '-' + stateData.abbr)}/` },
                  { label: 'Redfin', icon: '📊', url: `https://www.redfin.com/city/${encodeURIComponent(cityData.name)}/${stateData.abbr}` },
                  { label: 'County Records', icon: '📋', url: `https://www.google.com/search?q=${encodeURIComponent(cityData.county + ' County ' + stateData.name + ' property records')}` },
                ].map(tool => (
                  <a
                    key={tool.label}
                    href={tool.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    style={{
                      display: 'flex', alignItems: 'center', gap: 8,
                      padding: '12px 14px', borderRadius: 8, border: '1px solid #3d4e65',
                      background: 'rgba(255,255,255,0.03)', color: '#999', fontSize: 13,
                      textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500,
                    }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff7e5f'; e.currentTarget.style.color = '#ff7e5f' }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.color = '#999' }}
                  >
                    <span style={{ fontSize: 16 }}>{tool.icon}</span> {tool.label}
                    <ExternalLink size={11} style={{ marginLeft: 'auto', opacity: 0.5 }} />
                  </a>
                ))}
              </div>
            </div>

            {/* Map embed for the city - BIGGER */}
            <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #3d4e65', marginBottom: 24 }}>
              <iframe
                title={`Map of ${cityData.name}, ${stateData.abbr}`}
                width="100%"
                height="450"
                style={{ border: 0, display: 'block' }}
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                src={`https://www.openstreetmap.org/export/embed.html?bbox=${cityData.lng - 0.15}%2C${cityData.lat - 0.1}%2C${cityData.lng + 0.15}%2C${cityData.lat + 0.1}&layer=mapnik&marker=${cityData.lat}%2C${cityData.lng}`}
              />
            </div>

            {/* Due Diligence Checklist */}
            <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid #222', borderRadius: 12, padding: '20px', marginBottom: 20 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
                <CheckSquare size={18} color="#ff7e5f" />
                <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.04em' }}>
                  Wholesale Due Diligence Checklist
                </span>
                <span style={{ fontSize: 11, color: '#666', marginLeft: 'auto' }}>
                  {checkedItems.size}/{DUE_DILIGENCE_CHECKLIST.length} complete
                </span>
              </div>
              {/* Progress bar */}
              <div style={{ background: '#2e3a4d', borderRadius: 6, height: 6, marginBottom: 16, overflow: 'hidden' }}>
                <div style={{
                  background: checkedItems.size === DUE_DILIGENCE_CHECKLIST.length ? '#5cb885' : '#ff7e5f',
                  height: '100%',
                  width: `${(checkedItems.size / DUE_DILIGENCE_CHECKLIST.length) * 100}%`,
                  borderRadius: 6,
                  transition: 'width 0.3s ease, background 0.3s ease',
                }} />
              </div>
              <div style={{ display: 'grid', gap: 6 }}>
                {DUE_DILIGENCE_CHECKLIST.map(item => (
                  <label
                    key={item.id}
                    style={{
                      display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px',
                      borderRadius: 8, cursor: 'pointer', transition: 'all 0.15s',
                      background: checkedItems.has(item.id) ? 'rgba(45,184,133,0.06)' : 'transparent',
                      border: `1px solid ${checkedItems.has(item.id) ? 'rgba(45,184,133,0.2)' : 'transparent'}`,
                    }}
                  >
                    <input
                      type="checkbox"
                      checked={checkedItems.has(item.id)}
                      onChange={() => toggleChecked(item.id)}
                      style={{ accentColor: '#ff7e5f', width: 16, height: 16, cursor: 'pointer' }}
                    />
                    <span style={{
                      fontSize: 13, color: checkedItems.has(item.id) ? '#5cb885' : '#bbb', lineHeight: 1.5,
                      textDecoration: checkedItems.has(item.id) ? 'line-through' : 'none',
                      transition: 'all 0.15s',
                    }}>
                      {item.label}
                    </span>
                  </label>
                ))}
              </div>
            </div>

            <div className="info-tip">
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                <Lightbulb size={14} color="#5cb885" />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#5cb885', letterSpacing: '0.05em' }}>PRO TIP</span>
              </div>
              <div style={{ fontSize: 13, color: '#ccc', lineHeight: 1.6 }}>
                Use satellite view on Google Maps to inspect property conditions before contacting sellers. Look for roof damage, overgrown yards, and boarded windows — signs of distressed properties ideal for wholesale deals.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ADDRESS VIEW - Search results */}
      {viewLevel === 'address' && searchResults.length > 0 && stateData && cityData && (
        <div>
          <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '28px 24px', marginBottom: 24 }}>
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', letterSpacing: '0.04em', margin: '0 0 20px' }}>
              Property Results — {cityData.name}, {stateData.abbr}
            </h3>

            {/* Address search bar */}
            <div style={{ display: 'flex', gap: 8, marginBottom: 24 }}>
              <div style={{ position: 'relative', flex: 1 }}>
                <Search size={14} style={{ position: 'absolute', left: 12, top: '50%', transform: 'translateY(-50%)', color: '#555' }} />
                <input
                  className="input-dark"
                  placeholder={`Refine search in ${cityData.name}...`}
                  value={addressSearch}
                  onChange={e => setAddressSearch(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && handleAddressSearch()}
                  style={{ paddingLeft: 34 }}
                />
              </div>
              <button
                onClick={handleAddressSearch}
                className="btn-orange"
                style={{ padding: '10px 20px', fontSize: 14 }}
              >
                <Search size={14} /> Search
              </button>
            </div>

            <div style={{ display: 'grid', gap: 12 }}>
              {searchResults.map((result, i) => (
                <div
                  key={i}
                  style={{
                    background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 12,
                    padding: '18px 16px', transition: 'all 0.2s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 12, flexWrap: 'wrap' }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
                        <MapPin size={16} color="#ff7e5f" />
                        <span style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 20, color: '#f5f0eb', letterSpacing: '0.03em' }}>
                          {result.address}
                        </span>
                      </div>
                      <div style={{ fontSize: 13, color: '#888' }}>
                        {result.city}, {result.state} {result.zip} — {cityData.county} County
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                      <button
                        onClick={() => handleViewProperty(result)}
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '10px 16px', borderRadius: 8, border: '1px solid #ff7e5f',
                          background: 'rgba(244,126,95,0.1)', color: '#ff7e5f', cursor: 'pointer',
                          fontSize: 13, fontWeight: 600, transition: 'all 0.2s',
                        }}
                      >
                        <Image size={13} /> View Property
                      </button>
                      <a
                        href={`https://www.google.com/maps/search/${encodeURIComponent(result.address + ', ' + result.city + ', ' + result.state + ' ' + result.zip)}/@${result.lat},${result.lng},17z`}
                        target="_blank"
                        rel="noopener noreferrer"
                        style={{
                          display: 'flex', alignItems: 'center', gap: 6,
                          padding: '10px 16px', borderRadius: 8, border: '1px solid #3d4e65',
                          background: 'transparent', color: '#888', cursor: 'pointer',
                          fontSize: 13, textDecoration: 'none', transition: 'all 0.2s',
                        }}
                      >
                        <Navigation size={13} /> Google Maps
                      </a>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Street View / Property Image */}
      {showStreetView && currentAddress && stateData && cityData && (
        <div style={{ background: '#263040', border: '1px solid #3d4e65', borderRadius: 12, padding: '28px 24px', marginBottom: 24 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <Image size={22} color="#ff7e5f" />
            <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 24, color: '#f5f0eb', letterSpacing: '0.04em', margin: 0 }}>
              Property View — {currentAddress.address}
            </h3>
          </div>

          {/* Map embed for property location - BIGGER */}
          <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid #3d4e65', marginBottom: 20 }}>
            <iframe
              title={`Map view of ${currentAddress.address}`}
              width="100%"
              height="500"
              style={{ border: 0, display: 'block' }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              src={`https://www.openstreetmap.org/export/embed.html?bbox=${currentAddress.lng - 0.008}%2C${currentAddress.lat - 0.006}%2C${currentAddress.lng + 0.008}%2C${currentAddress.lat + 0.006}&layer=mapnik&marker=${currentAddress.lat}%2C${currentAddress.lng}`}
            />
          </div>

          {/* Property details card */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 12, marginBottom: 20 }}>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>Address</div>
              <div style={{ fontSize: 15, color: '#f5f0eb' }}>{currentAddress.address}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>City / State</div>
              <div style={{ fontSize: 15, color: '#f5f0eb' }}>{currentAddress.city}, {currentAddress.state}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>ZIP Code</div>
              <div style={{ fontSize: 15, color: '#f5f0eb' }}>{currentAddress.zip}</div>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid #3d4e65', borderRadius: 10, padding: 16 }}>
              <div style={{ fontSize: 11, color: '#888', fontWeight: 700, letterSpacing: '0.05em', textTransform: 'uppercase', marginBottom: 6 }}>County</div>
              <div style={{ fontSize: 15, color: '#f5f0eb' }}>{cityData.county}</div>
            </div>
          </div>

          {/* External research links */}
          <div style={{ fontSize: 12, color: '#666', marginBottom: 10, fontWeight: 600, letterSpacing: '0.05em', textTransform: 'uppercase' }}>
            Research This Property
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))', gap: 8 }}>
            {[
              { label: 'Google Maps', url: `https://www.google.com/maps/search/${encodeURIComponent(currentAddress.address + ', ' + currentAddress.city + ', ' + currentAddress.state + ' ' + currentAddress.zip)}/@${currentAddress.lat},${currentAddress.lng},17z` },
              { label: 'Zillow Estimate', url: `https://www.zillow.com/homes/${encodeURIComponent(currentAddress.address + ' ' + currentAddress.city + ' ' + currentAddress.state + ' ' + currentAddress.zip)}/` },
              { label: 'County Tax Records', url: `https://www.google.com/search?q=${encodeURIComponent(cityData.county + ' County ' + stateData.name + ' property tax records ' + currentAddress.address)}` },
              { label: 'Comps Search', url: `https://www.google.com/search?q=${encodeURIComponent('comparable sales ' + currentAddress.city + ' ' + currentAddress.state + ' ' + currentAddress.zip)}` },
            ].map(tool => (
              <a
                key={tool.label}
                href={tool.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex', alignItems: 'center', gap: 8,
                  padding: '12px 14px', borderRadius: 8, border: '1px solid #3d4e65',
                  background: 'rgba(255,255,255,0.03)', color: '#999', fontSize: 13,
                  textDecoration: 'none', transition: 'all 0.2s', fontWeight: 500,
                }}
                onMouseEnter={e => { e.currentTarget.style.borderColor = '#ff7e5f'; e.currentTarget.style.color = '#ff7e5f' }}
                onMouseLeave={e => { e.currentTarget.style.borderColor = '#3d4e65'; e.currentTarget.style.color = '#999' }}
              >
                <ExternalLink size={12} /> {tool.label}
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Quick state grid (always visible at bottom) */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ fontFamily: "'Bebas Neue', sans-serif", fontSize: 22, color: '#ffb347', letterSpacing: '0.04em', marginBottom: 14 }}>
          All Wholesale-Friendly States
        </h3>
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {Object.entries(WHOLESALE_STATES).filter(([_, s]) => s.friendly).sort((a, b) => a[1].name.localeCompare(b[1].name)).map(([abbr, state]) => (
            <button
              key={abbr}
              onClick={() => handleStateClick(abbr)}
              style={{
                padding: '8px 14px', borderRadius: 8,
                border: selectedState === abbr ? '1px solid #ff7e5f' : '1px solid #3d4e65',
                background: selectedState === abbr ? 'rgba(244,126,95,0.15)' : 'transparent',
                color: selectedState === abbr ? '#ff7e5f' : '#888',
                cursor: 'pointer', fontSize: 12, fontWeight: 600, transition: 'all 0.2s',
                display: 'flex', alignItems: 'center', gap: 4,
              }}
            >
              <MapPin size={11} />
              {state.name}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
