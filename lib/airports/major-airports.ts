export type AirportOption = {
    code: string
    city: string
    name: string
    country: string
    region?: string
    displayName?: string
}

export const MAJOR_AIRPORTS: AirportOption[] = [
    { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", country: "United States", region: "GA", displayName: "Hartsfield-Jackson Atlanta Intl Airport" },
    { code: "AUS", city: "Austin", name: "Austin-Bergstrom International", country: "United States", region: "TX", displayName: "Austin-Bergstrom Intl Airport" },
    { code: "BNA", city: "Nashville", name: "Nashville International", country: "United States", region: "TN", displayName: "Nashville Intl Airport" },
    { code: "BOS", city: "Boston", name: "Boston Logan International", country: "United States", region: "MA", displayName: "Boston Logan Intl Airport" },
    { code: "CLT", city: "Charlotte", name: "Charlotte Douglas International", country: "United States", region: "NC", displayName: "Charlotte Douglas Intl Airport" },
    { code: "DCA", city: "Washington", name: "Ronald Reagan Washington National", country: "United States", region: "DC", displayName: "Reagan National Airport" },
    { code: "DEN", city: "Denver", name: "Denver International", country: "United States", region: "CO", displayName: "Denver Intl Airport" },
    { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International", country: "United States", region: "TX", displayName: "Dallas Fort Worth Intl Airport" },
    { code: "DTW", city: "Detroit", name: "Detroit Metropolitan Wayne County", country: "United States", region: "MI", displayName: "Metropolitan Wayne County Airport" },
    { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States", region: "NJ", displayName: "Newark Liberty Intl Airport" },
    { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood International", country: "United States", region: "FL", displayName: "Fort Lauderdale-Hollywood Intl Airport" },
    { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States", region: "HI", displayName: "Daniel K. Inouye Intl Airport" },
    { code: "IAD", city: "Washington", name: "Washington Dulles International", country: "United States", region: "VA", displayName: "Washington Dulles Intl Airport" },
    { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States", region: "TX", displayName: "George Bush Intercontinental Airport" },
    { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States", region: "NY", displayName: "John F. Kennedy Intl Airport" },
    { code: "LAS", city: "Las Vegas", name: "Harry Reid International", country: "United States", region: "NV", displayName: "Harry Reid Intl Airport" },
    { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States", region: "CA", displayName: "Los Angeles Intl Airport" },
    { code: "LGA", city: "New York", name: "LaGuardia", country: "United States", region: "NY", displayName: "LaGuardia Airport" },
    { code: "MCO", city: "Orlando", name: "Orlando International", country: "United States", region: "FL", displayName: "Orlando Intl Airport" },
    { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States", region: "IL", displayName: "Chicago Midway Intl Airport" },
    { code: "MIA", city: "Miami", name: "Miami International", country: "United States", region: "FL", displayName: "Miami Intl Airport" },
    { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul International", country: "United States", region: "MN", displayName: "Minneapolis-Saint Paul Intl Airport" },
    { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States", region: "IL", displayName: "O'Hare Intl Airport" },
    { code: "PDX", city: "Portland", name: "Portland International", country: "United States", region: "OR", displayName: "Portland Intl Airport" },
    { code: "PHL", city: "Philadelphia", name: "Philadelphia International", country: "United States", region: "PA", displayName: "Philadelphia Intl Airport" },
    { code: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States", region: "AZ", displayName: "Phoenix Sky Harbor Intl Airport" },
    { code: "SAN", city: "San Diego", name: "San Diego International", country: "United States", region: "CA", displayName: "San Diego Intl Airport" },
    { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States", region: "WA", displayName: "Seattle-Tacoma Intl Airport" },
    { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States", region: "CA", displayName: "San Francisco Intl Airport" },
    { code: "SJC", city: "San Jose", name: "San Jose Mineta International", country: "United States", region: "CA", displayName: "San Jose Mineta Intl Airport" },
    { code: "SLC", city: "Salt Lake City", name: "Salt Lake City International", country: "United States", region: "UT", displayName: "Salt Lake City Intl Airport" },
    { code: "TPA", city: "Tampa", name: "Tampa International", country: "United States", region: "FL", displayName: "Tampa Intl Airport" },

    { code: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico", displayName: "Cancun Intl Airport" },
    { code: "GDL", city: "Guadalajara", name: "Guadalajara International", country: "Mexico", displayName: "Guadalajara Intl Airport" },
    { code: "MEX", city: "Mexico City", name: "Benito Juarez International", country: "Mexico", displayName: "Benito Juarez Intl Airport" },
    { code: "MTY", city: "Monterrey", name: "Monterrey International", country: "Mexico", displayName: "Monterrey Intl Airport" },

    { code: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama", displayName: "Tocumen Intl Airport" },
    { code: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica", displayName: "Juan Santamaria Intl Airport" },
    { code: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador", displayName: "El Salvador Intl Airport" },
    { code: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala", displayName: "La Aurora Intl Airport" },

    { code: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia", displayName: "El Dorado Intl Airport" },
    { code: "CTG", city: "Cartagena", name: "Rafael Nunez International", country: "Colombia", displayName: "Rafael Nunez Intl Airport" },
    { code: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia", displayName: "Jose Maria Cordova Intl Airport" },

    { code: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru", displayName: "Jorge Chavez Intl Airport" },
    { code: "CUZ", city: "Cusco", name: "Alejandro Velasco Astete International", country: "Peru", displayName: "Alejandro Velasco Astete Intl Airport" },

    { code: "VVI", city: "Santa Cruz", name: "Viru Viru International", country: "Bolivia", displayName: "Viru Viru Intl Airport" },
    { code: "LPB", city: "La Paz", name: "El Alto International", country: "Bolivia", displayName: "El Alto Intl Airport" },
    { code: "CBB", city: "Cochabamba", name: "Jorge Wilstermann International", country: "Bolivia", displayName: "Jorge Wilstermann Intl Airport" },

    { code: "SCL", city: "Santiago", name: "Arturo Merino Benitez International", country: "Chile", displayName: "Arturo Merino Benitez Intl Airport" },
    { code: "IPC", city: "Easter Island", name: "Mataveri International", country: "Chile", displayName: "Mataveri Intl Airport" },

    { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina", displayName: "Ministro Pistarini (Ezeiza) Intl Airport" },
    { code: "AEP", city: "Buenos Aires", name: "Jorge Newbery Airfield", country: "Argentina", displayName: "Jorge Newbery Airfield" },
    { code: "COR", city: "Cordoba", name: "Ingeniero Aeronautico Ambrosio Taravella", country: "Argentina", displayName: "Ingeniero Ambrosio Taravella Airport" },

    { code: "GRU", city: "Sao Paulo", name: "Sao Paulo-Guarulhos International", country: "Brazil", displayName: "Sao Paulo-Guarulhos Intl Airport" },
    { code: "CGH", city: "Sao Paulo", name: "Congonhas", country: "Brazil", displayName: "Congonhas Airport" },
    { code: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil", displayName: "Galeao Intl Airport" },
    { code: "SDU", city: "Rio de Janeiro", name: "Santos Dumont", country: "Brazil", displayName: "Santos Dumont Airport" },
    { code: "BSB", city: "Brasilia", name: "Brasilia International", country: "Brazil", displayName: "Brasilia Intl Airport" },
    { code: "SSA", city: "Salvador", name: "Salvador International", country: "Brazil", displayName: "Salvador Intl Airport" },

    { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada", displayName: "Toronto Pearson Intl Airport" },
    { code: "YUL", city: "Montreal", name: "Montreal-Trudeau International", country: "Canada", displayName: "Montreal-Trudeau Intl Airport" },
    { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada", displayName: "Vancouver Intl Airport" },
    { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada", displayName: "Calgary Intl Airport" },

    { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom", displayName: "Heathrow Airport" },
    { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom", displayName: "Gatwick Airport" },
    { code: "LCY", city: "London", name: "London City", country: "United Kingdom", displayName: "London City Airport" },
    { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom", displayName: "Manchester Airport" },
    { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom", displayName: "Edinburgh Airport" },

    { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France", displayName: "Charles de Gaulle Airport" },
    { code: "ORY", city: "Paris", name: "Orly", country: "France", displayName: "Orly Airport" },
    { code: "NCE", city: "Nice", name: "Nice Cote d'Azur", country: "France", displayName: "Nice Cote d'Azur Airport" },

    { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands", displayName: "Schiphol Airport" },
    { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium", displayName: "Brussels Airport" },
    { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany", displayName: "Frankfurt Airport" },
    { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany", displayName: "Munich Airport" },
    { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany", displayName: "Berlin Brandenburg Airport" },
    { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland", displayName: "Zurich Airport" },
    { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland", displayName: "Geneva Airport" },
    { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria", displayName: "Vienna Intl Airport" },
    { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark", displayName: "Copenhagen Airport" },
    { code: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden", displayName: "Stockholm Arlanda Airport" },
    { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway", displayName: "Oslo Gardermoen Airport" },
    { code: "HEL", city: "Helsinki", name: "Helsinki Airport", country: "Finland", displayName: "Helsinki Airport" },
    { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland", displayName: "Dublin Airport" },
    { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal", displayName: "Humberto Delgado Airport" },
    { code: "OPO", city: "Porto", name: "Francisco Sa Carneiro", country: "Portugal", displayName: "Francisco Sa Carneiro Airport" },
    { code: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain", displayName: "Adolfo Suarez Madrid-Barajas Airport" },
    { code: "BCN", city: "Barcelona", name: "Barcelona-El Prat", country: "Spain", displayName: "Barcelona-El Prat Airport" },
    { code: "PMI", city: "Palma", name: "Palma de Mallorca", country: "Spain", displayName: "Palma de Mallorca Airport" },
    { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy", displayName: "Leonardo da Vinci Fiumicino Airport" },
    { code: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy", displayName: "Milan Malpensa Airport" },
    { code: "LIN", city: "Milan", name: "Linate", country: "Italy", displayName: "Linate Airport" },
    { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy", displayName: "Marco Polo Airport" },
    { code: "ATH", city: "Athens", name: "Athens International", country: "Greece", displayName: "Athens Intl Airport" },
    { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey", displayName: "Istanbul Airport" },

    { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates", displayName: "Dubai Intl Airport" },
    { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates", displayName: "Zayed Intl Airport" },
    { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar", displayName: "Hamad Intl Airport" },
    { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia", displayName: "King Abdulaziz Intl Airport" },
    { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia", displayName: "King Khalid Intl Airport" },
    { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt", displayName: "Cairo Intl Airport" },
    { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco", displayName: "Mohammed V Intl Airport" },
    { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa", displayName: "Cape Town Intl Airport" },
    { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa", displayName: "O.R. Tambo Intl Airport" },

    { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India", displayName: "Indira Gandhi Intl Airport" },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India", displayName: "Chhatrapati Shivaji Maharaj Intl Airport" },
    { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India", displayName: "Kempegowda Intl Airport" },
    { code: "MAA", city: "Chennai", name: "Chennai International", country: "India", displayName: "Chennai Intl Airport" },
    { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India", displayName: "Rajiv Gandhi Intl Airport" },
    { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore", displayName: "Changi Airport" },
    { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia", displayName: "Kuala Lumpur Intl Airport" },
    { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand", displayName: "Suvarnabhumi Airport" },
    { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand", displayName: "Phuket Intl Airport" },
    { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta International", country: "Indonesia", displayName: "Soekarno-Hatta Intl Airport" },
    { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines", displayName: "Ninoy Aquino Intl Airport" },
    { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea", displayName: "Incheon Intl Airport" },
    { code: "GMP", city: "Seoul", name: "Gimpo International", country: "South Korea", displayName: "Gimpo Intl Airport" },
    { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan", displayName: "Narita Intl Airport" },
    { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan", displayName: "Haneda Airport" },
    { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan", displayName: "Kansai Intl Airport" },
    { code: "ITM", city: "Osaka", name: "Itami", country: "Japan", displayName: "Itami Airport" },
    { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China", displayName: "Beijing Capital Intl Airport" },
    { code: "PKX", city: "Beijing", name: "Beijing Daxing International", country: "China", displayName: "Beijing Daxing Intl Airport" },
    { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China", displayName: "Shanghai Pudong Intl Airport" },
    { code: "SHA", city: "Shanghai", name: "Hongqiao International", country: "China", displayName: "Hongqiao Intl Airport" },
    { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China", displayName: "Baiyun Intl Airport" },
    { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong", displayName: "Hong Kong Intl Airport" },
    { code: "TPE", city: "Taipei", name: "Taiwan Taoyuan International", country: "Taiwan", displayName: "Taiwan Taoyuan Intl Airport" },

    { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia", displayName: "Sydney Kingsford Smith Airport" },
    { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia", displayName: "Melbourne Airport" },
    { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia", displayName: "Brisbane Airport" },
    { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia", displayName: "Perth Airport" },
    { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand", displayName: "Auckland Airport" },
    { code: "CHC", city: "Christchurch", name: "Christchurch Airport", country: "New Zealand", displayName: "Christchurch Airport" },
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