export type AirportOption = {
    code: string
    city: string
    name: string
    country: string
}

export const MAJOR_AIRPORTS: AirportOption[] = [
    { code: "ATL", city: "Atlanta", name: "Hartsfield-Jackson Atlanta International", country: "United States" },
    { code: "AUS", city: "Austin", name: "Austin-Bergstrom International", country: "United States" },
    { code: "BNA", city: "Nashville", name: "Nashville International", country: "United States" },
    { code: "BOS", city: "Boston", name: "Boston Logan International", country: "United States" },
    { code: "CLT", city: "Charlotte", name: "Charlotte Douglas International", country: "United States" },
    { code: "DCA", city: "Washington", name: "Ronald Reagan Washington National", country: "United States" },
    { code: "DEN", city: "Denver", name: "Denver International", country: "United States" },
    { code: "DFW", city: "Dallas", name: "Dallas Fort Worth International", country: "United States" },
    { code: "DTW", city: "Detroit", name: "Detroit Metropolitan Wayne County", country: "United States" },
    { code: "EWR", city: "Newark", name: "Newark Liberty International", country: "United States" },
    { code: "FLL", city: "Fort Lauderdale", name: "Fort Lauderdale-Hollywood International", country: "United States" },
    { code: "HNL", city: "Honolulu", name: "Daniel K. Inouye International", country: "United States" },
    { code: "IAD", city: "Washington", name: "Washington Dulles International", country: "United States" },
    { code: "IAH", city: "Houston", name: "George Bush Intercontinental", country: "United States" },
    { code: "JFK", city: "New York", name: "John F. Kennedy International", country: "United States" },
    { code: "LAS", city: "Las Vegas", name: "Harry Reid International", country: "United States" },
    { code: "LAX", city: "Los Angeles", name: "Los Angeles International", country: "United States" },
    { code: "LGA", city: "New York", name: "LaGuardia", country: "United States" },
    { code: "MCO", city: "Orlando", name: "Orlando International", country: "United States" },
    { code: "MDW", city: "Chicago", name: "Chicago Midway International", country: "United States" },
    { code: "MIA", city: "Miami", name: "Miami International", country: "United States" },
    { code: "MSP", city: "Minneapolis", name: "Minneapolis-Saint Paul International", country: "United States" },
    { code: "ORD", city: "Chicago", name: "O'Hare International", country: "United States" },
    { code: "PDX", city: "Portland", name: "Portland International", country: "United States" },
    { code: "PHL", city: "Philadelphia", name: "Philadelphia International", country: "United States" },
    { code: "PHX", city: "Phoenix", name: "Phoenix Sky Harbor International", country: "United States" },
    { code: "SAN", city: "San Diego", name: "San Diego International", country: "United States" },
    { code: "SEA", city: "Seattle", name: "Seattle-Tacoma International", country: "United States" },
    { code: "SFO", city: "San Francisco", name: "San Francisco International", country: "United States" },
    { code: "SJC", city: "San Jose", name: "San Jose Mineta International", country: "United States" },
    { code: "SLC", city: "Salt Lake City", name: "Salt Lake City International", country: "United States" },
    { code: "TPA", city: "Tampa", name: "Tampa International", country: "United States" },

    { code: "CUN", city: "Cancun", name: "Cancun International", country: "Mexico" },
    { code: "GDL", city: "Guadalajara", name: "Guadalajara International", country: "Mexico" },
    { code: "MEX", city: "Mexico City", name: "Benito Juarez International", country: "Mexico" },
    { code: "MTY", city: "Monterrey", name: "Monterrey International", country: "Mexico" },

    { code: "PTY", city: "Panama City", name: "Tocumen International", country: "Panama" },
    { code: "SJO", city: "San Jose", name: "Juan Santamaria International", country: "Costa Rica" },
    { code: "SAL", city: "San Salvador", name: "El Salvador International", country: "El Salvador" },
    { code: "GUA", city: "Guatemala City", name: "La Aurora International", country: "Guatemala" },

    { code: "BOG", city: "Bogota", name: "El Dorado International", country: "Colombia" },
    { code: "CTG", city: "Cartagena", name: "Rafael Nunez International", country: "Colombia" },
    { code: "MDE", city: "Medellin", name: "Jose Maria Cordova International", country: "Colombia" },

    { code: "LIM", city: "Lima", name: "Jorge Chavez International", country: "Peru" },
    { code: "CUZ", city: "Cusco", name: "Alejandro Velasco Astete International", country: "Peru" },

    { code: "VVI", city: "Santa Cruz de la Sierra", name: "Viru Viru International", country: "Bolivia" },
    { code: "LPB", city: "La Paz", name: "El Alto International", country: "Bolivia" },
    { code: "CBB", city: "Cochabamba", name: "Jorge Wilstermann International", country: "Bolivia" },

    { code: "SCL", city: "Santiago", name: "Arturo Merino Benitez International", country: "Chile" },
    { code: "IPC", city: "Easter Island", name: "Mataveri International", country: "Chile" },

    { code: "EZE", city: "Buenos Aires", name: "Ministro Pistarini International", country: "Argentina" },
    { code: "AEP", city: "Buenos Aires", name: "Jorge Newbery Airfield", country: "Argentina" },
    { code: "COR", city: "Cordoba", name: "Ingeniero Aeronautico Ambrosio Taravella", country: "Argentina" },

    { code: "GRU", city: "Sao Paulo", name: "Sao Paulo-Guarulhos International", country: "Brazil" },
    { code: "CGH", city: "Sao Paulo", name: "Congonhas", country: "Brazil" },
    { code: "GIG", city: "Rio de Janeiro", name: "Galeao International", country: "Brazil" },
    { code: "SDU", city: "Rio de Janeiro", name: "Santos Dumont", country: "Brazil" },
    { code: "BSB", city: "Brasilia", name: "Brasilia International", country: "Brazil" },
    { code: "SSA", city: "Salvador", name: "Salvador International", country: "Brazil" },

    { code: "YYZ", city: "Toronto", name: "Toronto Pearson International", country: "Canada" },
    { code: "YUL", city: "Montreal", name: "Montreal-Trudeau International", country: "Canada" },
    { code: "YVR", city: "Vancouver", name: "Vancouver International", country: "Canada" },
    { code: "YYC", city: "Calgary", name: "Calgary International", country: "Canada" },

    { code: "LHR", city: "London", name: "Heathrow", country: "United Kingdom" },
    { code: "LGW", city: "London", name: "Gatwick", country: "United Kingdom" },
    { code: "LCY", city: "London", name: "London City", country: "United Kingdom" },
    { code: "MAN", city: "Manchester", name: "Manchester Airport", country: "United Kingdom" },
    { code: "EDI", city: "Edinburgh", name: "Edinburgh Airport", country: "United Kingdom" },

    { code: "CDG", city: "Paris", name: "Charles de Gaulle", country: "France" },
    { code: "ORY", city: "Paris", name: "Orly", country: "France" },
    { code: "NCE", city: "Nice", name: "Nice Cote d'Azur", country: "France" },

    { code: "AMS", city: "Amsterdam", name: "Schiphol", country: "Netherlands" },
    { code: "BRU", city: "Brussels", name: "Brussels Airport", country: "Belgium" },
    { code: "FRA", city: "Frankfurt", name: "Frankfurt Airport", country: "Germany" },
    { code: "MUC", city: "Munich", name: "Munich Airport", country: "Germany" },
    { code: "BER", city: "Berlin", name: "Berlin Brandenburg", country: "Germany" },
    { code: "ZRH", city: "Zurich", name: "Zurich Airport", country: "Switzerland" },
    { code: "GVA", city: "Geneva", name: "Geneva Airport", country: "Switzerland" },
    { code: "VIE", city: "Vienna", name: "Vienna International", country: "Austria" },
    { code: "CPH", city: "Copenhagen", name: "Copenhagen Airport", country: "Denmark" },
    { code: "ARN", city: "Stockholm", name: "Stockholm Arlanda", country: "Sweden" },
    { code: "OSL", city: "Oslo", name: "Oslo Gardermoen", country: "Norway" },
    { code: "HEL", city: "Helsinki", name: "Helsinki Airport", country: "Finland" },
    { code: "DUB", city: "Dublin", name: "Dublin Airport", country: "Ireland" },
    { code: "LIS", city: "Lisbon", name: "Humberto Delgado", country: "Portugal" },
    { code: "OPO", city: "Porto", name: "Francisco Sa Carneiro", country: "Portugal" },
    { code: "MAD", city: "Madrid", name: "Adolfo Suarez Madrid-Barajas", country: "Spain" },
    { code: "BCN", city: "Barcelona", name: "Barcelona-El Prat", country: "Spain" },
    { code: "PMI", city: "Palma", name: "Palma de Mallorca", country: "Spain" },
    { code: "FCO", city: "Rome", name: "Leonardo da Vinci Fiumicino", country: "Italy" },
    { code: "MXP", city: "Milan", name: "Milan Malpensa", country: "Italy" },
    { code: "LIN", city: "Milan", name: "Linate", country: "Italy" },
    { code: "VCE", city: "Venice", name: "Marco Polo", country: "Italy" },
    { code: "ATH", city: "Athens", name: "Athens International", country: "Greece" },
    { code: "IST", city: "Istanbul", name: "Istanbul Airport", country: "Turkey" },

    { code: "DXB", city: "Dubai", name: "Dubai International", country: "United Arab Emirates" },
    { code: "AUH", city: "Abu Dhabi", name: "Zayed International", country: "United Arab Emirates" },
    { code: "DOH", city: "Doha", name: "Hamad International", country: "Qatar" },
    { code: "JED", city: "Jeddah", name: "King Abdulaziz International", country: "Saudi Arabia" },
    { code: "RUH", city: "Riyadh", name: "King Khalid International", country: "Saudi Arabia" },
    { code: "CAI", city: "Cairo", name: "Cairo International", country: "Egypt" },
    { code: "CMN", city: "Casablanca", name: "Mohammed V International", country: "Morocco" },
    { code: "CPT", city: "Cape Town", name: "Cape Town International", country: "South Africa" },
    { code: "JNB", city: "Johannesburg", name: "O.R. Tambo International", country: "South Africa" },

    { code: "DEL", city: "Delhi", name: "Indira Gandhi International", country: "India" },
    { code: "BOM", city: "Mumbai", name: "Chhatrapati Shivaji Maharaj International", country: "India" },
    { code: "BLR", city: "Bengaluru", name: "Kempegowda International", country: "India" },
    { code: "MAA", city: "Chennai", name: "Chennai International", country: "India" },
    { code: "HYD", city: "Hyderabad", name: "Rajiv Gandhi International", country: "India" },
    { code: "SIN", city: "Singapore", name: "Changi", country: "Singapore" },
    { code: "KUL", city: "Kuala Lumpur", name: "Kuala Lumpur International", country: "Malaysia" },
    { code: "BKK", city: "Bangkok", name: "Suvarnabhumi", country: "Thailand" },
    { code: "HKT", city: "Phuket", name: "Phuket International", country: "Thailand" },
    { code: "CGK", city: "Jakarta", name: "Soekarno-Hatta International", country: "Indonesia" },
    { code: "MNL", city: "Manila", name: "Ninoy Aquino International", country: "Philippines" },
    { code: "ICN", city: "Seoul", name: "Incheon International", country: "South Korea" },
    { code: "GMP", city: "Seoul", name: "Gimpo International", country: "South Korea" },
    { code: "NRT", city: "Tokyo", name: "Narita International", country: "Japan" },
    { code: "HND", city: "Tokyo", name: "Haneda", country: "Japan" },
    { code: "KIX", city: "Osaka", name: "Kansai International", country: "Japan" },
    { code: "ITM", city: "Osaka", name: "Itami", country: "Japan" },
    { code: "PEK", city: "Beijing", name: "Beijing Capital International", country: "China" },
    { code: "PKX", city: "Beijing", name: "Beijing Daxing International", country: "China" },
    { code: "PVG", city: "Shanghai", name: "Shanghai Pudong International", country: "China" },
    { code: "SHA", city: "Shanghai", name: "Hongqiao International", country: "China" },
    { code: "CAN", city: "Guangzhou", name: "Baiyun International", country: "China" },
    { code: "HKG", city: "Hong Kong", name: "Hong Kong International", country: "Hong Kong" },
    { code: "TPE", city: "Taipei", name: "Taiwan Taoyuan International", country: "Taiwan" },

    { code: "SYD", city: "Sydney", name: "Sydney Kingsford Smith", country: "Australia" },
    { code: "MEL", city: "Melbourne", name: "Melbourne Airport", country: "Australia" },
    { code: "BNE", city: "Brisbane", name: "Brisbane Airport", country: "Australia" },
    { code: "PER", city: "Perth", name: "Perth Airport", country: "Australia" },
    { code: "AKL", city: "Auckland", name: "Auckland Airport", country: "New Zealand" },
    { code: "CHC", city: "Christchurch", name: "Christchurch Airport", country: "New Zealand" },
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