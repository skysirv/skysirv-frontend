export type AirportOption = {
  code: string
  city: string
  name: string
  country: string
  region?: string
  displayName?: string
  latitude?: number
  longitude?: number
}

export const MAJOR_AIRPORTS: AirportOption[] = [
  { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", country: "United States", region: "GA", displayName: "Hartsfield-Jackson Atlanta Intl Airport", latitude: 33.6407, longitude: -84.4277 },
  { code: "AUS", city: "Austin", name: "Austin-Bergstrom International", country: "United States", region: "TX", displayName: "Austin-Bergstrom Intl Airport", latitude: 30.1975, longitude: -97.6664 },
  { code: "BNA", city: "Nashville", name: "Nashville International", country: "United States", region: "TN", displayName: "Nashville Intl Airport", latitude: 36.1263, longitude: -86.6774 },
  { code: "BOS", city: "Boston", name: "Boston Logan International", country: "United States", region: "MA", displayName: "Boston Logan Intl Airport", latitude: 42.3656, longitude: -71.0096 },
  { code: "CLT", city: "Charlotte", name: "Charlotte Douglas International", country: "United States", region: "NC", displayName: "Charlotte Douglas Intl Airport", latitude: 35.214, longitude: -80.9431 },
  { code: "DCA", city: "Washington", name: "Ronald Reagan Washington National", country: "United States", region: "DC", displayName: "Reagan National Airport", latitude: 38.8521, longitude: -77.0377 },
  { code: "DEN", city: "Denver", name: "Denver International", country: "United States", region: "CO", displayName: "Denver Intl Airport", latitude: 39.8561, longitude: -104.6737 },
  { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International", country: "United States", region: "TX", displayName: "Dallas Fort Worth Intl Airport", latitude: 32.8998, longitude: -97.0403 },
  { code: "DTW", city: "Detroit", name: "Detroit Metropolitan Wayne County", country: "United States", region: "MI", displayName: "Metropolitan Wayne County Airport", latitude: 42.2162, longitude: -83.3554 },
  { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States", region: "NJ", displayName: "Newark Liberty Intl Airport", latitude: 40.6895, longitude: -74.1745 },
  { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood International", country: "United States", region: "FL", displayName: "Fort Lauderdale-Hollywood Intl Airport", latitude: 26.0726, longitude: -80.1527 },
  { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States", region: "HI", displayName: "Daniel K. Inouye Intl Airport", latitude: 21.3187, longitude: -157.9225 },
  { code: "IAD", city: "Washington", name: "Washington Dulles International", country: "United States", region: "VA", displayName: "Washington Dulles Intl Airport", latitude: 38.9531, longitude: -77.4565 },
  { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States", region: "TX", displayName: "George Bush Intercontinental Airport", latitude: 29.9844, longitude: -95.3414 },
  { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States", region: "NY", displayName: "John F. Kennedy Intl Airport", latitude: 40.6413, longitude: -73.7781 },
  { code: "LAS", city: "Las Vegas", name: "Harry Reid International", country: "United States", region: "NV", displayName: "Harry Reid Intl Airport", latitude: 36.084, longitude: -115.1537 },
  { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States", region: "CA", displayName: "Los Angeles Intl Airport", latitude: 33.9416, longitude: -118.4085 },
  { code: "LGA", city: "New York", name: "LaGuardia", country: "United States", region: "NY", displayName: "LaGuardia Airport", latitude: 40.7769, longitude: -73.874 },
  { code: "MCO", city: "Orlando", name: "Orlando International", country: "United States", region: "FL", displayName: "Orlando Intl Airport", latitude: 28.4312, longitude: -81.3081 },
  { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States", region: "IL", displayName: "Chicago Midway Intl Airport", latitude: 41.7868, longitude: -87.7522 },
  { code: "MIA", city: "Miami", name: "Miami International", country: "United States", region: "FL", displayName: "Miami Intl Airport", latitude: 25.7959, longitude: -80.287 },
  { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul International", country: "United States", region: "MN", displayName: "Minneapolis-Saint Paul Intl Airport", latitude: 44.8848, longitude: -93.2223 },
  { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States", region: "IL", displayName: "O'Hare Intl Airport", latitude: 41.9742, longitude: -87.9073 },
  { code: "PDX", city: "Portland", name: "Portland International", country: "United States", region: "OR", displayName: "Portland Intl Airport", latitude: 45.5898, longitude: -122.5951 },
  { code: "PHL", city: "Philadelphia", name: "Philadelphia International", country: "United States", region: "PA", displayName: "Philadelphia Intl Airport", latitude: 39.8744, longitude: -75.2424 },
  { code: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States", region: "AZ", displayName: "Phoenix Sky Harbor Intl Airport", latitude: 33.4352, longitude: -112.0101 },
  { code: "SAN", city: "San Diego", name: "San Diego International", country: "United States", region: "CA", displayName: "San Diego Intl Airport", latitude: 32.7338, longitude: -117.1933 },
  { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States", region: "WA", displayName: "Seattle-Tacoma Intl Airport", latitude: 47.4502, longitude: -122.3088 },
  { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States", region: "CA", displayName: "San Francisco Intl Airport", latitude: 37.6213, longitude: -122.379 },
  { code: "SJC", city: "San Jose", name: "San Jose Mineta International", country: "United States", region: "CA", displayName: "San Jose Mineta Intl Airport", latitude: 37.3639, longitude: -121.9289 },
  { code: "SLC", city: "Salt Lake City", name: "Salt Lake City International", country: "United States", region: "UT", displayName: "Salt Lake City Intl Airport", latitude: 40.7899, longitude: -111.9791 },
  { code: "TPA", city: "Tampa", name: "Tampa International", country: "United States", region: "FL", displayName: "Tampa Intl Airport", latitude: 27.9755, longitude: -82.5332 },

  { code: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico", displayName: "Cancun Intl Airport", latitude: 21.0365, longitude: -86.8771 },
  { code: "GDL", city: "Guadalajara", name: "Guadalajara International", country: "Mexico", displayName: "Guadalajara Intl Airport", latitude: 20.5218, longitude: -103.3112 },
  { code: "MEX", city: "Mexico City", name: "Benito Juarez International", country: "Mexico", displayName: "Benito Juarez Intl Airport", latitude: 19.4361, longitude: -99.0719 },
  { code: "MTY", city: "Monterrey", name: "Monterrey International", country: "Mexico", displayName: "Monterrey Intl Airport", latitude: 25.7785, longitude: -100.107 },
  { code: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama", displayName: "Tocumen Intl Airport", latitude: 9.0714, longitude: -79.3835 },
  { code: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica", displayName: "Juan Santamaria Intl Airport", latitude: 9.9939, longitude: -84.2088 },
  { code: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador", displayName: "El Salvador Intl Airport", latitude: 13.4409, longitude: -89.0557 },
  { code: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala", displayName: "La Aurora Intl Airport", latitude: 14.5833, longitude: -90.5275 },

  { code: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia", displayName: "El Dorado Intl Airport", latitude: 4.7016, longitude: -74.1469 },
  { code: "CTG", city: "Cartagena", name: "Rafael Nunez International", country: "Colombia", displayName: "Rafael Nunez Intl Airport", latitude: 10.4424, longitude: -75.513 },
  { code: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia", displayName: "Jose Maria Cordova Intl Airport", latitude: 6.1645, longitude: -75.4231 },
  { code: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru", displayName: "Jorge Chavez Intl Airport", latitude: -12.0219, longitude: -77.1143 },
  { code: "CUZ", city: "Cusco", name: "Alejandro Velasco Astete International", country: "Peru", displayName: "Alejandro Velasco Astete Intl Airport", latitude: -13.5357, longitude: -71.9388 },

  { code: "VVI", city: "Santa Cruz", name: "Viru Viru International", country: "Bolivia", displayName: "Viru Viru Intl Airport", latitude: -17.6448, longitude: -63.1354 },
  { code: "LPB", city: "La Paz", name: "El Alto International", country: "Bolivia", displayName: "El Alto Intl Airport", latitude: -16.5133, longitude: -68.1923 },
  { code: "CBB", city: "Cochabamba", name: "Jorge Wilstermann International", country: "Bolivia", displayName: "Jorge Wilstermann Intl Airport", latitude: -17.4211, longitude: -66.1771 },

  { code: "SCL", city: "Santiago", name: "Arturo Merino Benitez International", country: "Chile", displayName: "Arturo Merino Benitez Intl Airport", latitude: -33.3928, longitude: -70.7858 },
  { code: "IPC", city: "Easter Island", name: "Mataveri International", country: "Chile", displayName: "Mataveri Intl Airport", latitude: -27.1648, longitude: -109.4218 },
  { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina", displayName: "Ministro Pistarini (Ezeiza) Intl Airport", latitude: -34.8222, longitude: -58.5358 },
  { code: "AEP", city: "Buenos Aires", name: "Jorge Newbery Airfield", country: "Argentina", displayName: "Jorge Newbery Airfield", latitude: -34.5592, longitude: -58.4156 },
  { code: "COR", city: "Cordoba", name: "Ingeniero Aeronautico Ambrosio Taravella", country: "Argentina", displayName: "Ingeniero Ambrosio Taravella Airport", latitude: -31.31, longitude: -64.208 },
  { code: "GRU", city: "Sao Paulo", name: "Sao Paulo-Guarulhos International", country: "Brazil", displayName: "Sao Paulo-Guarulhos Intl Airport", latitude: -23.4356, longitude: -46.4731 },
  { code: "CGH", city: "Sao Paulo", name: "Congonhas", country: "Brazil", displayName: "Congonhas Airport", latitude: -23.6267, longitude: -46.6554 },
  { code: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil", displayName: "Galeao Intl Airport", latitude: -22.809999, longitude: -43.250557 },
  { code: "SDU", city: "Rio de Janeiro", name: "Santos Dumont", country: "Brazil", displayName: "Santos Dumont Airport", latitude: -22.91, longitude: -43.1631 },
  { code: "BSB", city: "Brasilia", name: "Brasilia International", country: "Brazil", displayName: "Brasilia Intl Airport", latitude: -15.8697, longitude: -47.9208 },
  { code: "SSA", city: "Salvador", name: "Salvador International", country: "Brazil", displayName: "Salvador Intl Airport", latitude: -12.9086, longitude: -38.3225 },

  { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada", displayName: "Toronto Pearson Intl Airport", latitude: 43.6777, longitude: -79.6248 },
  { code: "YUL", city: "Montreal", name: "Montreal-Trudeau International", country: "Canada", displayName: "Montreal-Trudeau Intl Airport", latitude: 45.4706, longitude: -73.7408 },
  { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada", displayName: "Vancouver Intl Airport", latitude: 49.1967, longitude: -123.1815 },
  { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada", displayName: "Calgary Intl Airport", latitude: 51.1215, longitude: -114.0076 },

  { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom", displayName: "Heathrow Airport", latitude: 51.47, longitude: -0.4543 },
  { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom", displayName: "Gatwick Airport", latitude: 51.1537, longitude: -0.1821 },
  { code: "LCY", city: "London", name: "London City", country: "United Kingdom", displayName: "London City Airport", latitude: 51.5053, longitude: 0.0553 },
  { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom", displayName: "Manchester Airport", latitude: 53.365, longitude: -2.2726 },
  { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom", displayName: "Edinburgh Airport", latitude: 55.95, longitude: -3.3725 },

  { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France", displayName: "Charles de Gaulle Airport", latitude: 49.0097, longitude: 2.5479 },
  { code: "ORY", city: "Paris", name: "Orly", country: "France", displayName: "Orly Airport", latitude: 48.7233, longitude: 2.3794 },
  { code: "NCE", city: "Nice", name: "Nice Cote d'Azur", country: "France", displayName: "Nice Cote d'Azur Airport", latitude: 43.6584, longitude: 7.2159 },
  { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands", displayName: "Schiphol Airport", latitude: 52.3105, longitude: 4.7683 },
  { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium", displayName: "Brussels Airport", latitude: 50.9014, longitude: 4.4844 },
  { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", displayName: "Frankfurt Airport", latitude: 50.0379, longitude: 8.5622 },
  { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany", displayName: "Munich Airport", latitude: 48.3538, longitude: 11.7861 },
  { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany", displayName: "Berlin Brandenburg Airport", latitude: 52.3667, longitude: 13.5033 },
  { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", displayName: "Zurich Airport", latitude: 47.4581, longitude: 8.5555 },
  { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland", displayName: "Geneva Airport", latitude: 46.2381, longitude: 6.1089 },
  { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria", displayName: "Vienna Intl Airport", latitude: 48.1103, longitude: 16.5697 },
  { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark", displayName: "Copenhagen Airport", latitude: 55.6181, longitude: 12.6561 },
  { code: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden", displayName: "Stockholm Arlanda Airport", latitude: 59.6519, longitude: 17.9186 },
  { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway", displayName: "Oslo Gardermoen Airport", latitude: 60.1975, longitude: 11.1004 },
  { code: "HEL", city: "Helsinki", name: "Helsinki Airport", country: "Finland", displayName: "Helsinki Airport", latitude: 60.3172, longitude: 24.9633 },
  { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland", displayName: "Dublin Airport", latitude: 53.4213, longitude: -6.2701 },
  { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal", displayName: "Humberto Delgado Airport", latitude: 38.7742, longitude: -9.1342 },
  { code: "OPO", city: "Porto", name: "Francisco Sa Carneiro", country: "Portugal", displayName: "Francisco Sa Carneiro Airport", latitude: 41.2421, longitude: -8.6785 },
  { code: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain", displayName: "Adolfo Suarez Madrid-Barajas Airport", latitude: 40.4983, longitude: -3.5676 },
  { code: "BCN", city: "Barcelona", name: "Barcelona-El Prat", country: "Spain", displayName: "Barcelona-El Prat Airport", latitude: 41.2974, longitude: 2.0833 },
  { code: "PMI", city: "Palma", name: "Palma de Mallorca", country: "Spain", displayName: "Palma de Mallorca Airport", latitude: 39.5517, longitude: 2.7388 },
  { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy", displayName: "Leonardo da Vinci Fiumicino Airport", latitude: 41.8003, longitude: 12.2389 },
  { code: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy", displayName: "Milan Malpensa Airport", latitude: 45.6306, longitude: 8.7281 },
  { code: "LIN", city: "Milan", name: "Linate", country: "Italy", displayName: "Linate Airport", latitude: 45.4451, longitude: 9.2767 },
  { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy", displayName: "Marco Polo Airport", latitude: 45.5053, longitude: 12.3519 },
  { code: "ATH", city: "Athens", name: "Athens International", country: "Greece", displayName: "Athens Intl Airport", latitude: 37.9364, longitude: 23.9445 },
  { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", displayName: "Istanbul Airport", latitude: 41.2753, longitude: 28.7519 },

  { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates", displayName: "Dubai Intl Airport", latitude: 25.2532, longitude: 55.3657 },
  { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates", displayName: "Zayed Intl Airport", latitude: 24.433, longitude: 54.6511 },
  { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar", displayName: "Hamad Intl Airport", latitude: 25.2731, longitude: 51.6081 },
  { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia", displayName: "King Abdulaziz Intl Airport", latitude: 21.6796, longitude: 39.1565 },
  { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia", displayName: "King Khalid Intl Airport", latitude: 24.9576, longitude: 46.6988 },
  { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt", displayName: "Cairo Intl Airport", latitude: 30.1219, longitude: 31.4056 },
  { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco", displayName: "Mohammed V Intl Airport", latitude: 33.3675, longitude: -7.5899 },
  { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa", displayName: "Cape Town Intl Airport", latitude: -33.9715, longitude: 18.6021 },
  { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa", displayName: "O.R. Tambo Intl Airport", latitude: -26.1337, longitude: 28.242 },

  { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India", displayName: "Indira Gandhi Intl Airport", latitude: 28.5562, longitude: 77.1 },
  { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India", displayName: "Chhatrapati Shivaji Maharaj Intl Airport", latitude: 19.0896, longitude: 72.8656 },
  { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India", displayName: "Kempegowda Intl Airport", latitude: 13.1986, longitude: 77.7066 },
  { code: "MAA", city: "Chennai", name: "Chennai International", country: "India", displayName: "Chennai Intl Airport", latitude: 12.9941, longitude: 80.1709 },
  { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", displayName: "Rajiv Gandhi Intl Airport", latitude: 17.2403, longitude: 78.4294 },
  { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore", displayName: "Changi Airport", latitude: 1.3644, longitude: 103.9915 },
  { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia", displayName: "Kuala Lumpur Intl Airport", latitude: 2.7456, longitude: 101.7072 },
  { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand", displayName: "Suvarnabhumi Airport", latitude: 13.69, longitude: 100.7501 },
  { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand", displayName: "Phuket Intl Airport", latitude: 8.1132, longitude: 98.3169 },
  { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta International", country: "Indonesia", displayName: "Soekarno-Hatta Intl Airport", latitude: -6.1256, longitude: 106.6559 },
  { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines", displayName: "Ninoy Aquino Intl Airport", latitude: 14.5086, longitude: 121.0198 },
  { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea", displayName: "Incheon Intl Airport", latitude: 37.4602, longitude: 126.4407 },
  { code: "GMP", city: "Seoul", name: "Gimpo International", country: "South Korea", displayName: "Gimpo Intl Airport", latitude: 37.5583, longitude: 126.7906 },
  { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan", displayName: "Narita Intl Airport", latitude: 35.7719, longitude: 140.3929 },
  { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan", displayName: "Haneda Airport", latitude: 35.5494, longitude: 139.7798 },
  { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan", displayName: "Kansai Intl Airport", latitude: 34.4347, longitude: 135.2441 },
  { code: "ITM", city: "Osaka", name: "Itami", country: "Japan", displayName: "Itami Airport", latitude: 34.7855, longitude: 135.4382 },
  { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China", displayName: "Beijing Capital Intl Airport", latitude: 40.0801, longitude: 116.5846 },
  { code: "PKX", city: "Beijing", name: "Beijing Daxing International", country: "China", displayName: "Beijing Daxing Intl Airport", latitude: 39.5098, longitude: 116.4105 },
  { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China", displayName: "Shanghai Pudong Intl Airport", latitude: 31.1443, longitude: 121.8083 },
  { code: "SHA", city: "Shanghai", name: "Hongqiao International", country: "China", displayName: "Hongqiao Intl Airport", latitude: 31.1979, longitude: 121.3363 },
  { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China", displayName: "Baiyun Intl Airport", latitude: 23.3924, longitude: 113.2988 },
  { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong", displayName: "Hong Kong Intl Airport", latitude: 22.308, longitude: 113.9185 },
  { code: "TPE", city: "Taipei", name: "Taiwan Taoyuan International", country: "Taiwan", displayName: "Taiwan Taoyuan Intl Airport", latitude: 25.0797, longitude: 121.2342 },

  { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia", displayName: "Sydney Kingsford Smith Airport", latitude: -33.9399, longitude: 151.1753 },
  { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia", displayName: "Melbourne Airport", latitude: -37.669, longitude: 144.841 },
  { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia", displayName: "Brisbane Airport", latitude: -27.3842, longitude: 153.1175 },
  { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia", displayName: "Perth Airport", latitude: -31.9403, longitude: 115.9672 },
  { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand", displayName: "Auckland Airport", latitude: -37.0082, longitude: 174.785 },
  { code: "CHC", city: "Christchurch", name: "Christchurch Airport", country: "New Zealand", displayName: "Christchurch Airport", latitude: -43.4894, longitude: 172.5322 },
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
    .sort((a, b) => b.score - a.score || a.airport.city.localeCompare(b.airport.city))
    .slice(0, limit)
    .map((item) => item.airport)

  return ranked
}

export function getAirportByCode(code?: string | null): AirportOption | null {
  if (!code) return null

  const normalized = code.trim().toUpperCase()

  return MAJOR_AIRPORTS.find((airport) => airport.code === normalized) ?? null
}