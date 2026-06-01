export type AirportOption = {
  code: string
  city: string
  name: string
  country: string
  region?: string
  displayName?: string
  latitude?: number
  longitude?: number
  airportType?: "major" | "regional" | "executive" | "cargo" | "reliever"
  priorityRank?: number
}

export const MAJOR_AIRPORTS: AirportOption[] = [
  // North America - United States and Canada

  { code: "ABQ", city: "Albuquerque", name: "Albuquerque International Sunport", country: "United States", region: "NM", displayName: "Albuquerque International Sunport", latitude: 35.0402, longitude: -106.6092, airportType: "regional", priorityRank: 3 },
  { code: "ALB", city: "Albany", name: "Albany International", country: "United States", region: "NY", displayName: "Albany Intl Airport", latitude: 42.7483, longitude: -73.8017, airportType: "regional", priorityRank: 3 },
  { code: "ANC", city: "Anchorage", name: "Ted Stevens Anchorage International", country: "United States", region: "AK", displayName: "Ted Stevens Anchorage Intl Airport", latitude: 61.1744, longitude: -149.9964, airportType: "major", priorityRank: 2 },
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", country: "United States", region: "GA", displayName: "Hartsfield-Jackson Atlanta Intl Airport", latitude: 33.6407, longitude: -84.4277, airportType: "major", priorityRank: 1 },
  { code: "AUS", city: "Austin", name: "Austin-Bergstrom International", country: "United States", region: "TX", displayName: "Austin-Bergstrom Intl Airport", latitude: 30.1975, longitude: -97.6664, airportType: "major", priorityRank: 2 },
  { code: "AVL", city: "Asheville", name: "Asheville Regional", country: "United States", region: "NC", displayName: "Asheville Regional Airport", latitude: 35.4362, longitude: -82.5418, airportType: "regional", priorityRank: 4 },
  { code: "BDL", city: "Hartford", name: "Bradley International", country: "United States", region: "CT", displayName: "Bradley Intl Airport", latitude: 41.9389, longitude: -72.6832, airportType: "regional", priorityRank: 3 },
  { code: "BNA", city: "Nashville", name: "Nashville International", country: "United States", region: "TN", displayName: "Nashville Intl Airport", latitude: 36.1263, longitude: -86.6774, airportType: "major", priorityRank: 2 },
  { code: "BOI", city: "Boise", name: "Boise Airport", country: "United States", region: "ID", displayName: "Boise Airport", latitude: 43.5644, longitude: -116.2228, airportType: "regional", priorityRank: 3 },
  { code: "BOS", city: "Boston", name: "Boston Logan International", country: "United States", region: "MA", displayName: "Boston Logan Intl Airport", latitude: 42.3656, longitude: -71.0096, airportType: "major", priorityRank: 1 },
  { code: "BUF", city: "Buffalo", name: "Buffalo Niagara International", country: "United States", region: "NY", displayName: "Buffalo Niagara Intl Airport", latitude: 42.9405, longitude: -78.7322, airportType: "regional", priorityRank: 3 },
  { code: "BUR", city: "Burbank", name: "Hollywood Burbank", country: "United States", region: "CA", displayName: "Hollywood Burbank Airport", latitude: 34.2007, longitude: -118.3587, airportType: "regional", priorityRank: 3 },
  { code: "BWI", city: "Baltimore", name: "Baltimore/Washington International Thurgood Marshall", country: "United States", region: "MD", displayName: "Baltimore/Washington Intl Airport", latitude: 39.1774, longitude: -76.6684, airportType: "major", priorityRank: 2 },
  { code: "CHS", city: "Charleston", name: "Charleston International", country: "United States", region: "SC", displayName: "Charleston Intl Airport", latitude: 32.8986, longitude: -80.0405, airportType: "regional", priorityRank: 3 },
  { code: "CLE", city: "Cleveland", name: "Cleveland Hopkins International", country: "United States", region: "OH", displayName: "Cleveland Hopkins Intl Airport", latitude: 41.4117, longitude: -81.8498, airportType: "regional", priorityRank: 3 },
  { code: "CLT", city: "Charlotte", name: "Charlotte Douglas International", country: "United States", region: "NC", displayName: "Charlotte Douglas Intl Airport", latitude: 35.214, longitude: -80.9431, airportType: "major", priorityRank: 1 },
  { code: "CMH", city: "Columbus", name: "John Glenn Columbus International", country: "United States", region: "OH", displayName: "John Glenn Columbus Intl Airport", latitude: 39.998, longitude: -82.8919, airportType: "regional", priorityRank: 3 },
  { code: "CVG", city: "Cincinnati", name: "Cincinnati/Northern Kentucky International", country: "United States", region: "KY", displayName: "Cincinnati/Northern Kentucky Intl Airport", latitude: 39.0488, longitude: -84.6678, airportType: "regional", priorityRank: 3 },
  { code: "DAL", city: "Dallas", name: "Dallas Love Field", country: "United States", region: "TX", displayName: "Dallas Love Field", latitude: 32.8471, longitude: -96.8518, airportType: "regional", priorityRank: 3 },
  { code: "DCA", city: "Washington", name: "Ronald Reagan Washington National", country: "United States", region: "DC", displayName: "Reagan National Airport", latitude: 38.8521, longitude: -77.0377, airportType: "major", priorityRank: 2 },
  { code: "DEN", city: "Denver", name: "Denver International", country: "United States", region: "CO", displayName: "Denver Intl Airport", latitude: 39.8561, longitude: -104.6737, airportType: "major", priorityRank: 1 },
  { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International", country: "United States", region: "TX", displayName: "Dallas Fort Worth Intl Airport", latitude: 32.8998, longitude: -97.0403, airportType: "major", priorityRank: 1 },
  { code: "DTW", city: "Detroit", name: "Detroit Metropolitan Wayne County", country: "United States", region: "MI", displayName: "Metropolitan Wayne County Airport", latitude: 42.2162, longitude: -83.3554, airportType: "major", priorityRank: 2 },
  { code: "EGE", city: "Vail", name: "Eagle County Regional", country: "United States", region: "CO", displayName: "Eagle County Regional Airport", latitude: 39.6426, longitude: -106.9177, airportType: "regional", priorityRank: 4 },
  { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States", region: "NJ", displayName: "Newark Liberty Intl Airport", latitude: 40.6895, longitude: -74.1745, airportType: "major", priorityRank: 1 },
  { code: "FAT", city: "Fresno", name: "Fresno Yosemite International", country: "United States", region: "CA", displayName: "Fresno Yosemite Intl Airport", latitude: 36.7762, longitude: -119.7181, airportType: "regional", priorityRank: 4 },
  { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood International", country: "United States", region: "FL", displayName: "Fort Lauderdale-Hollywood Intl Airport", latitude: 26.0726, longitude: -80.1527, airportType: "major", priorityRank: 2 },
  { code: "GEG", city: "Spokane", name: "Spokane International", country: "United States", region: "WA", displayName: "Spokane Intl Airport", latitude: 47.6199, longitude: -117.5338, airportType: "regional", priorityRank: 3 },
  { code: "GRR", city: "Grand Rapids", name: "Gerald R. Ford International", country: "United States", region: "MI", displayName: "Gerald R. Ford Intl Airport", latitude: 42.8808, longitude: -85.5228, airportType: "regional", priorityRank: 4 },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States", region: "HI", displayName: "Daniel K. Inouye Intl Airport", latitude: 21.3187, longitude: -157.9225, airportType: "major", priorityRank: 2 },
  { code: "HOU", city: "Houston", name: "William P. Hobby", country: "United States", region: "TX", displayName: "William P. Hobby Airport", latitude: 29.6454, longitude: -95.2789, airportType: "regional", priorityRank: 3 },
  { code: "HPN", city: "White Plains", name: "Westchester County", country: "United States", region: "NY", displayName: "Westchester County Airport", latitude: 41.0669, longitude: -73.7076, airportType: "executive", priorityRank: 3 },
  { code: "IAD", city: "Washington", name: "Washington Dulles International", country: "United States", region: "VA", displayName: "Washington Dulles Intl Airport", latitude: 38.9531, longitude: -77.4565, airportType: "major", priorityRank: 2 },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States", region: "TX", displayName: "George Bush Intercontinental Airport", latitude: 29.9844, longitude: -95.3414, airportType: "major", priorityRank: 1 },
  { code: "IND", city: "Indianapolis", name: "Indianapolis International", country: "United States", region: "IN", displayName: "Indianapolis Intl Airport", latitude: 39.7173, longitude: -86.2944, airportType: "regional", priorityRank: 3 },
  { code: "ISP", city: "Islip", name: "Long Island MacArthur", country: "United States", region: "NY", displayName: "Long Island MacArthur Airport", latitude: 40.7952, longitude: -73.1002, airportType: "regional", priorityRank: 4 },
  { code: "JAX", city: "Jacksonville", name: "Jacksonville International", country: "United States", region: "FL", displayName: "Jacksonville Intl Airport", latitude: 30.4941, longitude: -81.6879, airportType: "regional", priorityRank: 3 },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States", region: "NY", displayName: "John F. Kennedy Intl Airport", latitude: 40.6413, longitude: -73.7781, airportType: "major", priorityRank: 1 },
  { code: "KOA", city: "Kailua-Kona", name: "Ellison Onizuka Kona International", country: "United States", region: "HI", displayName: "Kona Intl Airport", latitude: 19.7388, longitude: -156.0456, airportType: "regional", priorityRank: 4 },
  { code: "LAS", city: "Las Vegas", name: "Harry Reid International", country: "United States", region: "NV", displayName: "Harry Reid Intl Airport", latitude: 36.084, longitude: -115.1537, airportType: "major", priorityRank: 1 },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States", region: "CA", displayName: "Los Angeles Intl Airport", latitude: 33.9416, longitude: -118.4085, airportType: "major", priorityRank: 1 },
  { code: "LGA", city: "New York", name: "LaGuardia", country: "United States", region: "NY", displayName: "LaGuardia Airport", latitude: 40.7769, longitude: -73.874, airportType: "major", priorityRank: 1 },
  { code: "LGB", city: "Long Beach", name: "Long Beach Airport", country: "United States", region: "CA", displayName: "Long Beach Airport", latitude: 33.8177, longitude: -118.1516, airportType: "regional", priorityRank: 3 },
  { code: "LIH", city: "Lihue", name: "Lihue Airport", country: "United States", region: "HI", displayName: "Lihue Airport", latitude: 21.976, longitude: -159.3389, airportType: "regional", priorityRank: 4 },
  { code: "MCI", city: "Kansas City", name: "Kansas City International", country: "United States", region: "MO", displayName: "Kansas City Intl Airport", latitude: 39.2976, longitude: -94.7139, airportType: "regional", priorityRank: 3 },
  { code: "MCO", city: "Orlando", name: "Orlando International", country: "United States", region: "FL", displayName: "Orlando Intl Airport", latitude: 28.4312, longitude: -81.3081, airportType: "major", priorityRank: 1 },
  { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States", region: "IL", displayName: "Chicago Midway Intl Airport", latitude: 41.7868, longitude: -87.7522, airportType: "regional", priorityRank: 3 },
  { code: "MEM", city: "Memphis", name: "Memphis International", country: "United States", region: "TN", displayName: "Memphis Intl Airport", latitude: 35.0424, longitude: -89.9767, airportType: "regional", priorityRank: 3 },
  { code: "MHT", city: "Manchester", name: "Manchester Boston Regional", country: "United States", region: "NH", displayName: "Manchester Boston Regional Airport", latitude: 42.9328056, longitude: -71.43575, airportType: "regional", priorityRank: 4 },
  { code: "MIA", city: "Miami", name: "Miami International", country: "United States", region: "FL", displayName: "Miami Intl Airport", latitude: 25.7959, longitude: -80.287, airportType: "major", priorityRank: 1 },
  { code: "MKE", city: "Milwaukee", name: "Milwaukee Mitchell International", country: "United States", region: "WI", displayName: "Milwaukee Mitchell Intl Airport", latitude: 42.9472, longitude: -87.8966, airportType: "regional", priorityRank: 3 },
  { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul International", country: "United States", region: "MN", displayName: "Minneapolis-Saint Paul Intl Airport", latitude: 44.8848, longitude: -93.2223, airportType: "major", priorityRank: 2 },
  { code: "MSY", city: "New Orleans", name: "Louis Armstrong New Orleans International", country: "United States", region: "LA", displayName: "Louis Armstrong New Orleans Intl Airport", latitude: 29.9934, longitude: -90.258, airportType: "regional", priorityRank: 3 },
  { code: "MYR", city: "Myrtle Beach", name: "Myrtle Beach International", country: "United States", region: "SC", displayName: "Myrtle Beach Intl Airport", latitude: 33.6797, longitude: -78.9283, airportType: "regional", priorityRank: 4 },
  { code: "OAK", city: "Oakland", name: "Oakland International", country: "United States", region: "CA", displayName: "Oakland Intl Airport", latitude: 37.7126, longitude: -122.2197, airportType: "regional", priorityRank: 3 },
  { code: "OMA", city: "Omaha", name: "Eppley Airfield", country: "United States", region: "NE", displayName: "Eppley Airfield", latitude: 41.3032, longitude: -95.8941, airportType: "regional", priorityRank: 3 },
  { code: "ONT", city: "Ontario", name: "Ontario International", country: "United States", region: "CA", displayName: "Ontario Intl Airport", latitude: 34.056, longitude: -117.6012, airportType: "regional", priorityRank: 3 },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States", region: "IL", displayName: "O'Hare Intl Airport", latitude: 41.9742, longitude: -87.9073, airportType: "major", priorityRank: 1 },
  { code: "ORF", city: "Norfolk", name: "Norfolk International", country: "United States", region: "VA", displayName: "Norfolk Intl Airport", latitude: 36.8946, longitude: -76.2012, airportType: "regional", priorityRank: 4 },
  { code: "PBI", city: "West Palm Beach", name: "Palm Beach International", country: "United States", region: "FL", displayName: "Palm Beach Intl Airport", latitude: 26.6832, longitude: -80.0956, airportType: "regional", priorityRank: 3 },
  { code: "PDX", city: "Portland", name: "Portland International", country: "United States", region: "OR", displayName: "Portland Intl Airport", latitude: 45.5898, longitude: -122.5951, airportType: "regional", priorityRank: 3 },
  { code: "PHL", city: "Philadelphia", name: "Philadelphia International", country: "United States", region: "PA", displayName: "Philadelphia Intl Airport", latitude: 39.8744, longitude: -75.2424, airportType: "major", priorityRank: 2 },
  { code: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States", region: "AZ", displayName: "Phoenix Sky Harbor Intl Airport", latitude: 33.4352, longitude: -112.0101, airportType: "major", priorityRank: 1 },
  { code: "PIT", city: "Pittsburgh", name: "Pittsburgh International", country: "United States", region: "PA", displayName: "Pittsburgh Intl Airport", latitude: 40.4915, longitude: -80.2329, airportType: "regional", priorityRank: 3 },
  { code: "PNS", city: "Pensacola", name: "Pensacola International", country: "United States", region: "FL", displayName: "Pensacola Intl Airport", latitude: 30.4734, longitude: -87.1866, airportType: "regional", priorityRank: 4 },
  { code: "PSP", city: "Palm Springs", name: "Palm Springs International", country: "United States", region: "CA", displayName: "Palm Springs Intl Airport", latitude: 33.8297, longitude: -116.5067, airportType: "regional", priorityRank: 4 },
  { code: "PVD", city: "Providence", name: "Rhode Island T. F. Green International", country: "United States", region: "RI", displayName: "T. F. Green Intl Airport", latitude: 41.724, longitude: -71.4282, airportType: "regional", priorityRank: 3 },
  { code: "PWM", city: "Portland", name: "Portland International Jetport", country: "United States", region: "ME", displayName: "Portland International Jetport", latitude: 43.6456435, longitude: -70.3086164, airportType: "regional", priorityRank: 3 },
  { code: "RDU", city: "Raleigh-Durham", name: "Raleigh-Durham International", country: "United States", region: "NC", displayName: "Raleigh-Durham Intl Airport", latitude: 35.8776, longitude: -78.7875, airportType: "regional", priorityRank: 3 },
  { code: "RIC", city: "Richmond", name: "Richmond International", country: "United States", region: "VA", displayName: "Richmond Intl Airport", latitude: 37.5052, longitude: -77.3197, airportType: "regional", priorityRank: 4 },
  { code: "RNO", city: "Reno", name: "Reno-Tahoe International", country: "United States", region: "NV", displayName: "Reno-Tahoe Intl Airport", latitude: 39.4991, longitude: -119.7681, airportType: "regional", priorityRank: 4 },
  { code: "ROC", city: "Rochester", name: "Frederick Douglass Greater Rochester International", country: "United States", region: "NY", displayName: "Greater Rochester Intl Airport", latitude: 43.1189, longitude: -77.6724, airportType: "regional", priorityRank: 4 },
  { code: "RSW", city: "Fort Myers", name: "Southwest Florida International", country: "United States", region: "FL", displayName: "Southwest Florida Intl Airport", latitude: 26.5362, longitude: -81.7552, airportType: "regional", priorityRank: 3 },
  { code: "SAN", city: "San Diego", name: "San Diego International", country: "United States", region: "CA", displayName: "San Diego Intl Airport", latitude: 32.7338, longitude: -117.1933, airportType: "major", priorityRank: 2 },
  { code: "SAT", city: "San Antonio", name: "San Antonio International", country: "United States", region: "TX", displayName: "San Antonio Intl Airport", latitude: 29.5337, longitude: -98.4698, airportType: "regional", priorityRank: 3 },
  { code: "SBA", city: "Santa Barbara", name: "Santa Barbara Municipal", country: "United States", region: "CA", displayName: "Santa Barbara Municipal Airport", latitude: 34.4262, longitude: -119.8404, airportType: "regional", priorityRank: 4 },
  { code: "SDF", city: "Louisville", name: "Louisville Muhammad Ali International", country: "United States", region: "KY", displayName: "Louisville Muhammad Ali Intl Airport", latitude: 38.1744, longitude: -85.736, airportType: "regional", priorityRank: 3 },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States", region: "WA", displayName: "Seattle-Tacoma Intl Airport", latitude: 47.4502, longitude: -122.3088, airportType: "major", priorityRank: 1 },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States", region: "CA", displayName: "San Francisco Intl Airport", latitude: 37.6213, longitude: -122.379, airportType: "major", priorityRank: 1 },
  { code: "SJC", city: "San Jose", name: "San Jose Mineta International", country: "United States", region: "CA", displayName: "San Jose Mineta Intl Airport", latitude: 37.3639, longitude: -121.9289, airportType: "major", priorityRank: 2 },
  { code: "SJU", city: "San Juan", name: "Luis Munoz Marin International", country: "United States", region: "PR", displayName: "Luis Munoz Marin Intl Airport", latitude: 18.4394, longitude: -66.0018, airportType: "regional", priorityRank: 3 },
  { code: "SLC", city: "Salt Lake City", name: "Salt Lake City International", country: "United States", region: "UT", displayName: "Salt Lake City Intl Airport", latitude: 40.7899, longitude: -111.9791, airportType: "major", priorityRank: 2 },
  { code: "SMF", city: "Sacramento", name: "Sacramento International", country: "United States", region: "CA", displayName: "Sacramento Intl Airport", latitude: 38.6954, longitude: -121.5908, airportType: "regional", priorityRank: 3 },
  { code: "SNA", city: "Orange County", name: "John Wayne Airport", country: "United States", region: "CA", displayName: "John Wayne Airport", latitude: 33.6757, longitude: -117.8682, airportType: "regional", priorityRank: 3 },
  { code: "SRQ", city: "Sarasota", name: "Sarasota Bradenton International", country: "United States", region: "FL", displayName: "Sarasota Bradenton Intl Airport", latitude: 27.3954, longitude: -82.5544, airportType: "regional", priorityRank: 4 },
  { code: "STL", city: "St. Louis", name: "St. Louis Lambert International", country: "United States", region: "MO", displayName: "St. Louis Lambert Intl Airport", latitude: 38.7487, longitude: -90.37, airportType: "regional", priorityRank: 3 },
  { code: "SYR", city: "Syracuse", name: "Syracuse Hancock International", country: "United States", region: "NY", displayName: "Syracuse Hancock Intl Airport", latitude: 43.1112, longitude: -76.1063, airportType: "regional", priorityRank: 4 },
  { code: "TEB", city: "Teterboro", name: "Teterboro Airport", country: "United States", region: "NJ", displayName: "Teterboro Airport", latitude: 40.8501, longitude: -74.0608, airportType: "executive", priorityRank: 3 },
  { code: "TPA", city: "Tampa", name: "Tampa International", country: "United States", region: "FL", displayName: "Tampa Intl Airport", latitude: 27.9755, longitude: -82.5332, airportType: "major", priorityRank: 2 },
  { code: "TUL", city: "Tulsa", name: "Tulsa International", country: "United States", region: "OK", displayName: "Tulsa Intl Airport", latitude: 36.1984, longitude: -95.8881, airportType: "regional", priorityRank: 4 },
  { code: "TUS", city: "Tucson", name: "Tucson International", country: "United States", region: "AZ", displayName: "Tucson Intl Airport", latitude: 32.1161, longitude: -110.941, airportType: "regional", priorityRank: 4 },
  { code: "VPS", city: "Destin-Fort Walton Beach", name: "Destin-Fort Walton Beach Airport", country: "United States", region: "FL", displayName: "Destin-Fort Walton Beach Airport", latitude: 30.4832, longitude: -86.5254, airportType: "regional", priorityRank: 4 },

  { code: "YUL", city: "Montreal", name: "Montreal-Trudeau International", country: "Canada", region: "QC", displayName: "Montreal-Trudeau Intl Airport", latitude: 45.4706, longitude: -73.7408, airportType: "major", priorityRank: 2 },
  { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada", region: "BC", displayName: "Vancouver Intl Airport", latitude: 49.1967, longitude: -123.1815, airportType: "major", priorityRank: 2 },
  { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada", region: "AB", displayName: "Calgary Intl Airport", latitude: 51.1215, longitude: -114.0076, airportType: "major", priorityRank: 2 },
  { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada", region: "ON", displayName: "Toronto Pearson Intl Airport", latitude: 43.6777, longitude: -79.6248, airportType: "major", priorityRank: 1 },

  // Mexico, Central America, and Caribbean

  { code: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico", region: "QR", displayName: "Cancun Intl Airport", latitude: 21.0365, longitude: -86.8771, airportType: "major", priorityRank: 2 },
  { code: "GDL", city: "Guadalajara", name: "Guadalajara International", country: "Mexico", region: "JAL", displayName: "Guadalajara Intl Airport", latitude: 20.5218, longitude: -103.3112, airportType: "regional", priorityRank: 3 },
  { code: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala", region: "GU", displayName: "La Aurora Intl Airport", latitude: 14.5833, longitude: -90.5275, airportType: "regional", priorityRank: 3 },
  { code: "MEX", city: "Mexico City", name: "Benito Juarez International", country: "Mexico", region: "CMX", displayName: "Benito Juarez Intl Airport", latitude: 19.4361, longitude: -99.0719, airportType: "major", priorityRank: 1 },
  { code: "MTY", city: "Monterrey", name: "Monterrey International", country: "Mexico", region: "NL", displayName: "Monterrey Intl Airport", latitude: 25.7785, longitude: -100.107, airportType: "regional", priorityRank: 3 },
  { code: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama", region: "PA", displayName: "Tocumen Intl Airport", latitude: 9.0714, longitude: -79.3835, airportType: "major", priorityRank: 2 },
  { code: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador", region: "SV", displayName: "El Salvador Intl Airport", latitude: 13.4409, longitude: -89.0557, airportType: "regional", priorityRank: 3 },
  { code: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica", region: "CR", displayName: "Juan Santamaria Intl Airport", latitude: 9.9939, longitude: -84.2088, airportType: "regional", priorityRank: 3 },

  // South America

  { code: "AEP", city: "Buenos Aires", name: "Jorge Newbery Airfield", country: "Argentina", region: "BA", displayName: "Jorge Newbery Airfield", latitude: -34.5592, longitude: -58.4156, airportType: "regional", priorityRank: 3 },
  { code: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia", region: "DC", displayName: "El Dorado Intl Airport", latitude: 4.7016, longitude: -74.1469, airportType: "major", priorityRank: 2 },
  { code: "BSB", city: "Brasilia", name: "Brasilia International", country: "Brazil", region: "DF", displayName: "Brasilia Intl Airport", latitude: -15.8697, longitude: -47.9208, airportType: "major", priorityRank: 2 },
  { code: "CBB", city: "Cochabamba", name: "Jorge Wilstermann International", country: "Bolivia", region: "CB", displayName: "Jorge Wilstermann Intl Airport", latitude: -17.4211, longitude: -66.1771, airportType: "regional", priorityRank: 4 },
  { code: "CGH", city: "Sao Paulo", name: "Congonhas", country: "Brazil", region: "SP", displayName: "Congonhas Airport", latitude: -23.6267, longitude: -46.6554, airportType: "regional", priorityRank: 3 },
  { code: "COR", city: "Cordoba", name: "Ingeniero Aeronautico Ambrosio Taravella", country: "Argentina", region: "CB", displayName: "Ingeniero Ambrosio Taravella Airport", latitude: -31.31, longitude: -64.208, airportType: "regional", priorityRank: 4 },
  { code: "CTG", city: "Cartagena", name: "Rafael Nunez International", country: "Colombia", region: "BOL", displayName: "Rafael Nunez Intl Airport", latitude: 10.4424, longitude: -75.513, airportType: "regional", priorityRank: 4 },
  { code: "CUZ", city: "Cusco", name: "Alejandro Velasco Astete International", country: "Peru", region: "CUS", displayName: "Alejandro Velasco Astete Intl Airport", latitude: -13.5357, longitude: -71.9388, airportType: "regional", priorityRank: 4 },
  { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina", region: "BA", displayName: "Ministro Pistarini (Ezeiza) Intl Airport", latitude: -34.8222, longitude: -58.5358, airportType: "major", priorityRank: 2 },
  { code: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil", region: "RJ", displayName: "Galeao Intl Airport", latitude: -22.809999, longitude: -43.250557, airportType: "major", priorityRank: 2 },
  { code: "GRU", city: "Sao Paulo", name: "Sao Paulo-Guarulhos International", country: "Brazil", region: "SP", displayName: "Sao Paulo-Guarulhos Intl Airport", latitude: -23.4356, longitude: -46.4731, airportType: "major", priorityRank: 1 },
  { code: "IPC", city: "Easter Island", name: "Mataveri International", country: "Chile", region: "VS", displayName: "Mataveri Intl Airport", latitude: -27.1648, longitude: -109.4218, airportType: "regional", priorityRank: 4 },
  { code: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru", region: "LIM", displayName: "Jorge Chavez Intl Airport", latitude: -12.0219, longitude: -77.1143, airportType: "major", priorityRank: 2 },
  { code: "LPB", city: "La Paz", name: "El Alto International", country: "Bolivia", region: "LP", displayName: "El Alto Intl Airport", latitude: -16.5133, longitude: -68.1923, airportType: "regional", priorityRank: 4 },
  { code: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia", region: "ANT", displayName: "Jose Maria Cordova Intl Airport", latitude: 6.1645, longitude: -75.4231, airportType: "regional", priorityRank: 3 },
  { code: "SCL", city: "Santiago", name: "Arturo Merino Benitez International", country: "Chile", region: "RM", displayName: "Arturo Merino Benitez Intl Airport", latitude: -33.3928, longitude: -70.7858, airportType: "major", priorityRank: 2 },
  { code: "SDU", city: "Rio de Janeiro", name: "Santos Dumont", country: "Brazil", region: "RJ", displayName: "Santos Dumont Airport", latitude: -22.91, longitude: -43.1631, airportType: "regional", priorityRank: 3 },
  { code: "SSA", city: "Salvador", name: "Salvador International", country: "Brazil", region: "BA", displayName: "Salvador Intl Airport", latitude: -12.9086, longitude: -38.3225, airportType: "regional", priorityRank: 3 },
  { code: "VVI", city: "Santa Cruz", name: "Viru Viru International", country: "Bolivia", region: "SC", displayName: "Viru Viru Intl Airport", latitude: -17.6448, longitude: -63.1354, airportType: "major", priorityRank: 3 },

  // Europe

  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands", region: "NH", displayName: "Schiphol Airport", latitude: 52.3105, longitude: 4.7683, airportType: "major", priorityRank: 1 },
  { code: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden", region: "AB", displayName: "Stockholm Arlanda Airport", latitude: 59.6519, longitude: 17.9186, airportType: "major", priorityRank: 2 },
  { code: "ATH", city: "Athens", name: "Athens International", country: "Greece", region: "I", displayName: "Athens Intl Airport", latitude: 37.9364, longitude: 23.9445, airportType: "major", priorityRank: 2 },
  { code: "BCN", city: "Barcelona", name: "Barcelona-El Prat", country: "Spain", region: "CT", displayName: "Barcelona-El Prat Airport", latitude: 41.2974, longitude: 2.0833, airportType: "major", priorityRank: 2 },
  { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany", region: "BB", displayName: "Berlin Brandenburg Airport", latitude: 52.3667, longitude: 13.5033, airportType: "major", priorityRank: 2 },
  { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium", region: "BRU", displayName: "Brussels Airport", latitude: 50.9014, longitude: 4.4844, airportType: "major", priorityRank: 2 },
  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France", region: "IDF", displayName: "Charles de Gaulle Airport", latitude: 49.0097, longitude: 2.5479, airportType: "major", priorityRank: 1 },
  { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark", region: "H", displayName: "Copenhagen Airport", latitude: 55.6181, longitude: 12.6561, airportType: "major", priorityRank: 2 },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland", region: "D", displayName: "Dublin Airport", latitude: 53.4213, longitude: -6.2701, airportType: "major", priorityRank: 2 },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom", region: "SCT", displayName: "Edinburgh Airport", latitude: 55.95, longitude: -3.3725, airportType: "regional", priorityRank: 3 },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy", region: "LAZ", displayName: "Leonardo da Vinci Fiumicino Airport", latitude: 41.8003, longitude: 12.2389, airportType: "major", priorityRank: 1 },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", region: "HE", displayName: "Frankfurt Airport", latitude: 50.0379, longitude: 8.5622, airportType: "major", priorityRank: 1 },
  { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland", region: "GE", displayName: "Geneva Airport", latitude: 46.2381, longitude: 6.1089, airportType: "major", priorityRank: 2 },
  { code: "HEL", city: "Helsinki", name: "Helsinki Airport", country: "Finland", region: "FI-18", displayName: "Helsinki Airport", latitude: 60.3172, longitude: 24.9633, airportType: "major", priorityRank: 2 },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", region: "TR-34", displayName: "Istanbul Airport", latitude: 41.2753, longitude: 28.7519, airportType: "major", priorityRank: 1 },
  { code: "LCY", city: "London", name: "London City", country: "United Kingdom", region: "ENG", displayName: "London City Airport", latitude: 51.5053, longitude: 0.0553, airportType: "regional", priorityRank: 3 },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom", region: "ENG", displayName: "Gatwick Airport", latitude: 51.1537, longitude: -0.1821, airportType: "major", priorityRank: 2 },
  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom", region: "ENG", displayName: "Heathrow Airport", latitude: 51.47, longitude: -0.4543, airportType: "major", priorityRank: 1 },
  { code: "LIN", city: "Milan", name: "Linate", country: "Italy", region: "LOM", displayName: "Linate Airport", latitude: 45.4451, longitude: 9.2767, airportType: "regional", priorityRank: 3 },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal", region: "PT-11", displayName: "Humberto Delgado Airport", latitude: 38.7742, longitude: -9.1342, airportType: "major", priorityRank: 2 },
  { code: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain", region: "MD", displayName: "Adolfo Suarez Madrid-Barajas Airport", latitude: 40.4983, longitude: -3.5676, airportType: "major", priorityRank: 1 },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom", region: "ENG", displayName: "Manchester Airport", latitude: 53.365, longitude: -2.2726, airportType: "major", priorityRank: 2 },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany", region: "BY", displayName: "Munich Airport", latitude: 48.3538, longitude: 11.7861, airportType: "major", priorityRank: 1 },
  { code: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy", region: "LOM", displayName: "Milan Malpensa Airport", latitude: 45.6306, longitude: 8.7281, airportType: "major", priorityRank: 2 },
  { code: "NCE", city: "Nice", name: "Nice Cote d'Azur", country: "France", region: "PAC", displayName: "Nice Cote d'Azur Airport", latitude: 43.6584, longitude: 7.2159, airportType: "regional", priorityRank: 3 },
  { code: "OPO", city: "Porto", name: "Francisco Sa Carneiro", country: "Portugal", region: "PT-13", displayName: "Francisco Sa Carneiro Airport", latitude: 41.2421, longitude: -8.6785, airportType: "regional", priorityRank: 3 },
  { code: "ORY", city: "Paris", name: "Orly", country: "France", region: "IDF", displayName: "Orly Airport", latitude: 48.7233, longitude: 2.3794, airportType: "major", priorityRank: 2 },
  { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway", region: "NO-02", displayName: "Oslo Gardermoen Airport", latitude: 60.1975, longitude: 11.1004, airportType: "major", priorityRank: 2 },
  { code: "PMI", city: "Palma", name: "Palma de Mallorca", country: "Spain", region: "IB", displayName: "Palma de Mallorca Airport", latitude: 39.5517, longitude: 2.7388, airportType: "regional", priorityRank: 3 },
  { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy", region: "VEN", displayName: "Marco Polo Airport", latitude: 45.5053, longitude: 12.3519, airportType: "regional", priorityRank: 3 },
  { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria", region: "AT-3", displayName: "Vienna Intl Airport", latitude: 48.1103, longitude: 16.5697, airportType: "major", priorityRank: 2 },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", region: "ZH", displayName: "Zurich Airport", latitude: 47.4581, longitude: 8.5555, airportType: "major", priorityRank: 1 },

  // Middle East

  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates", region: "AZ", displayName: "Zayed Intl Airport", latitude: 24.433, longitude: 54.6511, airportType: "major", priorityRank: 2 },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar", region: "QA", displayName: "Hamad Intl Airport", latitude: 25.2731, longitude: 51.6081, airportType: "major", priorityRank: 1 },
  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates", region: "DU", displayName: "Dubai Intl Airport", latitude: 25.2532, longitude: 55.3657, airportType: "major", priorityRank: 1 },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia", region: "Makkah", displayName: "King Abdulaziz Intl Airport", latitude: 21.6796, longitude: 39.1565, airportType: "major", priorityRank: 2 },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia", region: "Riyadh", displayName: "King Khalid Intl Airport", latitude: 24.9576, longitude: 46.6988, airportType: "major", priorityRank: 2 },

  // Africa

  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt", region: "C", displayName: "Cairo Intl Airport", latitude: 30.1219, longitude: 31.4056, airportType: "major", priorityRank: 2 },
  { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco", region: "CAS", displayName: "Mohammed V Intl Airport", latitude: 33.3675, longitude: -7.5899, airportType: "major", priorityRank: 2 },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa", region: "WC", displayName: "Cape Town Intl Airport", latitude: -33.9715, longitude: 18.6021, airportType: "major", priorityRank: 2 },
  { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa", region: "GP", displayName: "O.R. Tambo Intl Airport", latitude: -26.1337, longitude: 28.242, airportType: "major", priorityRank: 1 },

  // Asia

  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand", region: "TH-10", displayName: "Suvarnabhumi Airport", latitude: 13.69, longitude: 100.7501, airportType: "major", priorityRank: 2 },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India", region: "KA", displayName: "Kempegowda Intl Airport", latitude: 13.1986, longitude: 77.7066, airportType: "major", priorityRank: 2 },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India", region: "MH", displayName: "Chhatrapati Shivaji Maharaj Intl Airport", latitude: 19.0896, longitude: 72.8656, airportType: "major", priorityRank: 1 },
  { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China", region: "GD", displayName: "Baiyun Intl Airport", latitude: 23.3924, longitude: 113.2988, airportType: "major", priorityRank: 2 },
  { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta International", country: "Indonesia", region: "JK", displayName: "Soekarno-Hatta Intl Airport", latitude: -6.1256, longitude: 106.6559, airportType: "major", priorityRank: 2 },
  { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India", region: "DL", displayName: "Indira Gandhi Intl Airport", latitude: 28.5562, longitude: 77.1, airportType: "major", priorityRank: 1 },
  { code: "GMP", city: "Seoul", name: "Gimpo International", country: "South Korea", region: "KR-11", displayName: "Gimpo Intl Airport", latitude: 37.5583, longitude: 126.7906, airportType: "regional", priorityRank: 3 },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong", region: "HK", displayName: "Hong Kong Intl Airport", latitude: 22.308, longitude: 113.9185, airportType: "major", priorityRank: 1 },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand", region: "TH-83", displayName: "Phuket Intl Airport", latitude: 8.1132, longitude: 98.3169, airportType: "regional", priorityRank: 3 },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan", region: "TK", displayName: "Haneda Airport", latitude: 35.5494, longitude: 139.7798, airportType: "major", priorityRank: 1 },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", region: "TG", displayName: "Rajiv Gandhi Intl Airport", latitude: 17.2403, longitude: 78.4294, airportType: "major", priorityRank: 2 },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea", region: "KR-28", displayName: "Incheon Intl Airport", latitude: 37.4602, longitude: 126.4407, airportType: "major", priorityRank: 1 },
  { code: "ITM", city: "Osaka", name: "Itami", country: "Japan", region: "OSA", displayName: "Itami Airport", latitude: 34.7855, longitude: 135.4382, airportType: "regional", priorityRank: 3 },
  { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan", region: "OSA", displayName: "Kansai Intl Airport", latitude: 34.4347, longitude: 135.2441, airportType: "major", priorityRank: 2 },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia", region: "MY-10", displayName: "Kuala Lumpur Intl Airport", latitude: 2.7456, longitude: 101.7072, airportType: "major", priorityRank: 2 },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India", region: "TN", displayName: "Chennai Intl Airport", latitude: 12.9941, longitude: 80.1709, airportType: "major", priorityRank: 2 },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines", region: "NCR", displayName: "Ninoy Aquino Intl Airport", latitude: 14.5086, longitude: 121.0198, airportType: "major", priorityRank: 2 },
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan", region: "CHB", displayName: "Narita Intl Airport", latitude: 35.7719, longitude: 140.3929, airportType: "major", priorityRank: 1 },
  { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China", region: "BJ", displayName: "Beijing Capital Intl Airport", latitude: 40.0801, longitude: 116.5846, airportType: "major", priorityRank: 1 },
  { code: "PKX", city: "Beijing", name: "Beijing Daxing International", country: "China", region: "BJ", displayName: "Beijing Daxing Intl Airport", latitude: 39.5098, longitude: 116.4105, airportType: "major", priorityRank: 2 },
  { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China", region: "SH", displayName: "Shanghai Pudong Intl Airport", latitude: 31.1443, longitude: 121.8083, airportType: "major", priorityRank: 1 },
  { code: "SHA", city: "Shanghai", name: "Hongqiao International", country: "China", region: "SH", displayName: "Hongqiao Intl Airport", latitude: 31.1979, longitude: 121.3363, airportType: "regional", priorityRank: 3 },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore", region: "SG", displayName: "Changi Airport", latitude: 1.3644, longitude: 103.9915, airportType: "major", priorityRank: 1 },
  { code: "TPE", city: "Taipei", name: "Taiwan Taoyuan International", country: "Taiwan", region: "TAO", displayName: "Taiwan Taoyuan Intl Airport", latitude: 25.0797, longitude: 121.2342, airportType: "major", priorityRank: 2 },

  // Oceania

  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand", region: "AUK", displayName: "Auckland Airport", latitude: -37.0082, longitude: 174.785, airportType: "major", priorityRank: 2 },
  { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia", region: "QLD", displayName: "Brisbane Airport", latitude: -27.3842, longitude: 153.1175, airportType: "major", priorityRank: 2 },
  { code: "CHC", city: "Christchurch", name: "Christchurch Airport", country: "New Zealand", region: "CAN", displayName: "Christchurch Airport", latitude: -43.4894, longitude: 172.5322, airportType: "regional", priorityRank: 3 },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia", region: "VIC", displayName: "Melbourne Airport", latitude: -37.669, longitude: 144.841, airportType: "major", priorityRank: 1 },
  { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia", region: "WA", displayName: "Perth Airport", latitude: -31.9403, longitude: 115.9672, airportType: "major", priorityRank: 2 },
  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia", region: "NSW", displayName: "Sydney Kingsford Smith Airport", latitude: -33.9399, longitude: 151.1753, airportType: "major", priorityRank: 1 },
]

export function searchAirports(query: string, limit = 8): AirportOption[] {
  const q = query.trim().toLowerCase()

  if (!q) {
    return MAJOR_AIRPORTS.slice(0, limit)
  }

  const ranked = MAJOR_AIRPORTS.map((airport) => {
    const code = airport.code.toLowerCase()
    const city = airport.city.toLowerCase()
    const name = airport.name.toLowerCase()
    const country = airport.country.toLowerCase()

    let score = 0

    if (code === q) score += 100
    if (code.startsWith(q)) score += 60
    if (city.startsWith(q)) score += 40
    if (name.startsWith(q)) score += 30
    if (country.startsWith(q)) score += 20

    if (code.includes(q)) score += 15
    if (city.includes(q)) score += 12
    if (name.includes(q)) score += 10
    if (country.includes(q)) score += 6

    return { airport, score }
  })
    .filter((item) => item.score > 0)
    .sort(
      (a, b) =>
        b.score - a.score ||
        (a.airport.priorityRank ?? 99) - (b.airport.priorityRank ?? 99) ||
        a.airport.city.localeCompare(b.airport.city),
    )
    .slice(0, limit)
    .map((item) => item.airport)

  return ranked
}

export function getAirportByCode(code?: string | null): AirportOption | null {
  if (!code) return null

  const normalized = code.trim().toUpperCase()

  return MAJOR_AIRPORTS.find((airport) => airport.code === normalized) ?? null
}