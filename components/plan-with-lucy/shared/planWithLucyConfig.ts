import type { ModeFlow, PlanningMode } from "./planWithLucyTypes"

export const modeFlows: Record<PlanningMode, ModeFlow> = {
  flights: {
    id: "flights",
    label: "Flights",
    title: "Plan flights with Lucy.",
    subtitle:
      "Choose your flight style, priorities, airport flexibility, and comfort preferences. Lucy will turn it into a smarter flight-planning prompt.",
    promptStart: "I want Lucy to help me plan flight options",
    steps: [
      {
        id: "flight-type",
        type: "choice",
        title: "Flight type",
        variant: "pill",
        options: [
          { icon: "🛫", label: "One-way trip", value: "as a one-way trip" },
          { icon: "🔁", label: "Round trip", value: "as a round trip" },
          {
            icon: "🧭",
            label: "Flexible destination",
            value: "with flexible destination options",
          },
          {
            icon: "📅",
            label: "Flexible dates",
            value: "with flexible travel dates",
          },
          {
            icon: "🌍",
            label: "Multi-city travel",
            value: "as a multi-city trip",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "flight-priority",
        type: "choice",
        title: "Priorities",
        variant: "pill",
        options: [
          {
            icon: "💸",
            label: "Budget first",
            value: "with budget as the main priority",
          },
          {
            icon: "⚡",
            label: "Shortest duration",
            value: "with shorter travel time preferred",
          },
          {
            icon: "🛋️",
            label: "Comfort first",
            value: "with comfort and easy timing prioritized",
          },
          {
            icon: "🌙",
            label: "Red-eye friendly",
            value: "and I am open to red-eye flights",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "airport-flexibility",
        type: "choice",
        title: "Airport flexibility",
        variant: "pill",
        options: [
          {
            icon: "📍",
            label: "Exact airports",
            value: "using exact airports only",
          },
          {
            icon: "🧭",
            label: "Nearby airports",
            value: "with nearby airport options included",
          },
          {
            icon: "🚗",
            label: "Drive to better fare",
            value: "and I am willing to drive farther for a better fare",
          },
          {
            icon: "🧳",
            label: "Easy airport experience",
            value: "with easier airport experience preferred",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "flight-comfort",
        type: "choice",
        title: "Comfort",
        variant: "pill",
        options: [
          { icon: "💺", label: "Economy", value: "in economy" },
          {
            icon: "✨",
            label: "Premium economy",
            value: "with premium economy considered",
          },
          {
            icon: "💼",
            label: "Business class",
            value: "with business class considered",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family timing",
            value: "with family-friendly timing",
          },
        ],
        prompt: (value) => value,
      },
    ],
  },

  hotels: {
    id: "hotels",
    label: "Hotels",
    title: "Plan hotel stays with Lucy.",
    subtitle:
      "Choose your stay style, location needs, amenities, and nightly budget. Lucy will turn it into a smarter hotel-planning prompt.",
    promptStart: "I want Lucy to help me plan hotel options",
    steps: [
      {
        id: "hotel-type",
        type: "choice",
        title: "Hotel type",
        variant: "pill",
        options: [
          {
            icon: "🏙️",
            label: "Business travel",
            value: "for a business travel stay",
          },
          {
            icon: "🏖️",
            label: "Beach resort",
            value: "with beach resort options",
          },
          {
            icon: "🎨",
            label: "Boutique hotel",
            value: "with boutique hotel options",
          },
          {
            icon: "🧳",
            label: "Budget smart stay",
            value: "with budget-smart stays prioritized",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family comfort",
            value: "with family comfort prioritized",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-location",
        type: "choice",
        title: "Location",
        variant: "pill",
        options: [
          { icon: "🏛️", label: "Downtown", value: "near the city center" },
          { icon: "✈️", label: "Near airport", value: "near the airport" },
          {
            icon: "🚇",
            label: "Transit nearby",
            value: "near public transportation",
          },
          {
            icon: "🍽️",
            label: "Food district",
            value: "near good restaurants and food areas",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-amenities",
        type: "choice",
        title: "Amenities",
        variant: "pill",
        options: [
          {
            icon: "☕",
            label: "Breakfast",
            value: "with breakfast included if possible",
          },
          { icon: "🏊", label: "Pool", value: "with a pool preferred" },
          {
            icon: "🐾",
            label: "Pet friendly",
            value: "with pet-friendly options",
          },
          {
            icon: "🧺",
            label: "Laundry",
            value: "with laundry or longer-stay convenience",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "hotel-budget",
        type: "range",
        title: "Nightly budget",
        helper: "Set a rough nightly comfort range.",
        min: 50,
        max: 800,
        step: 25,
        defaultValue: 200,
        icon: "💸",
        marks: [
          { label: "$50", value: 50 },
          { label: "$200", value: 200 },
          { label: "$500", value: 500 },
          { label: "$800", value: 800 },
        ],
        formatValue: (value) => `$${value}/night`,
        prompt: (value) => `with a hotel budget around ${value}`,
      },
    ],
  },

  cars: {
    id: "cars",
    label: "Car rentals",
    title: "Plan car rentals with Lucy.",
    subtitle:
      "Choose your vehicle style, pickup plan, driving needs, and rental duration. Lucy will turn it into a smarter car-rental prompt.",
    promptStart: "I want Lucy to help me plan a car rental",
    steps: [
      {
        id: "vehicle-type",
        type: "choice",
        title: "Vehicle type",
        variant: "pill",
        options: [
          { icon: "🚗", label: "Compact", value: "with a compact car preferred" },
          { icon: "🚙", label: "SUV", value: "with an SUV preferred" },
          {
            icon: "👨‍👩‍👧",
            label: "Family vehicle",
            value: "with a family-friendly vehicle",
          },
          {
            icon: "⚡",
            label: "Electric",
            value: "with electric car options considered",
          },
          {
            icon: "🧳",
            label: "Large luggage",
            value: "with enough space for large luggage",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "pickup-style",
        type: "choice",
        title: "Pickup style",
        variant: "pill",
        options: [
          { icon: "✈️", label: "Airport pickup", value: "with airport pickup" },
          { icon: "🏙️", label: "City pickup", value: "with city pickup" },
          {
            icon: "🔁",
            label: "One-way return",
            value: "with one-way return considered",
          },
          {
            icon: "🕒",
            label: "Flexible timing",
            value: "with flexible pickup and return timing",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "driving-style",
        type: "choice",
        title: "Driving style",
        variant: "pill",
        options: [
          { icon: "🏙️", label: "City driving", value: "mostly for city driving" },
          { icon: "🛣️", label: "Road trip", value: "for a road trip" },
          {
            icon: "🏔️",
            label: "Mountain roads",
            value: "with mountain or rougher roads possible",
          },
          {
            icon: "👶",
            label: "Kids / car seats",
            value: "with kids or car seats needed",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "rental-days",
        type: "range",
        title: "Rental duration",
        helper: "Choose roughly how long the rental is needed.",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 5,
        icon: "📅",
        marks: [
          { label: "1", value: 1 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "30", value: 30 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `for about ${value}`,
      },
    ],
  },

  cruises: {
    id: "cruises",
    label: "Cruises",
    title: "Plan cruises with Lucy.",
    subtitle:
      "Choose your cruise style, destination region, duration, and onboard priorities. Lucy will turn it into a smarter cruise-planning prompt.",
    promptStart: "I want Lucy to help me plan cruise options",
    steps: [
      {
        id: "cruise-style",
        type: "choice",
        title: "Cruise style",
        variant: "pill",
        options: [
          { icon: "🚢", label: "Ocean cruise", value: "as an ocean cruise" },
          {
            icon: "🏝️",
            label: "Island route",
            value: "with island routes preferred",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family cruise",
            value: "with family-friendly cruise options",
          },
          {
            icon: "✨",
            label: "Premium cabin",
            value: "with premium cabin options considered",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "cruise-region",
        type: "choice",
        title: "Destination region",
        variant: "pill",
        options: [
          { icon: "🌴", label: "Caribbean", value: "in the Caribbean" },
          { icon: "🏛️", label: "Mediterranean", value: "in the Mediterranean" },
          {
            icon: "❄️",
            label: "Alaska",
            value: "with Alaska cruise options",
          },
          {
            icon: "🧭",
            label: "Not sure",
            value: "and I am open to destination suggestions",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "cruise-duration",
        type: "range",
        title: "Cruise duration",
        min: 2,
        max: 21,
        step: 1,
        defaultValue: 7,
        icon: "📅",
        marks: [
          { label: "2", value: 2 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "21", value: 21 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `for about ${value}`,
      },
      {
        id: "cruise-priority",
        type: "choice",
        title: "Cruise priority",
        variant: "pill",
        options: [
          {
            icon: "🛏️",
            label: "Cabin comfort",
            value: "with cabin comfort prioritized",
          },
          {
            icon: "🍽️",
            label: "Dining",
            value: "with dining quality prioritized",
          },
          {
            icon: "🎭",
            label: "Entertainment",
            value: "with entertainment and activities prioritized",
          },
          {
            icon: "🧘",
            label: "Relaxed pace",
            value: "with a relaxed onboard pace",
          },
        ],
        prompt: (value) => value,
      },
    ],
  },

  itinerary: {
    id: "itinerary",
    label: "Itinerary",
    title: "Build the full trip flow with Lucy.",
    subtitle:
      "Start with pace, budget, duration, and travel style, then adjust each layer of the trip planning until it’s just right. This is how a full planning conversation with Lucy could go — but in a more visual way.",
    promptStart: "I want to plan a trip",
    steps: [
      {
        id: "trip-includes",
        type: "multi-choice",
        title: "What should this trip include?",
        helper:
          "Choose every part of the trip you want Lucy to help prepare for booking.",
        variant: "card",
        icon: "🧭",
        options: [
          {
            icon: "✈️",
            label: "Flights",
            value: "flights",
          },
          {
            icon: "🏨",
            label: "Hotels",
            value: "hotels",
          },
          {
            icon: "🚗",
            label: "Car rental",
            value: "cars",
          },
          {
            icon: "🚢",
            label: "Cruises",
            value: "cruises",
          },
        ],
        prompt: (values) =>
          `including ${values.join(", ").toLowerCase()} planning`,
      },
      {
        id: "pace",
        type: "choice",
        title: "Pace level",
        variant: "pill",
        options: [
          { icon: "🌴", label: "Relaxed", value: "with a relaxed pace" },
          { icon: "☀️", label: "Moderate", value: "with a moderate pace" },
          { icon: "🚶", label: "Active", value: "with an active pace" },
          { icon: "🚀", label: "Intense", value: "with an intense pace" },
        ],
        prompt: (value) => value,
      },
      {
        id: "budget",
        type: "range",
        title: "Budget level",
        min: 0,
        max: 100000,
        step: 1000,
        defaultValue: 5000,
        icon: "💸",
        marks: [
          { label: "$0", value: 0 },
          { label: "$25,000", value: 25000 },
          { label: "$50,000", value: 50000 },
          { label: "$75,000", value: 75000 },
          { label: "$100,000", value: 100000 },
        ],
        formatValue: (value) => `$${value.toLocaleString("en-US")}`,
        prompt: (value) => `with an all-inclusive budget around ${value}`,
      },
      {
        id: "duration",
        type: "range",
        title: "Duration",
        min: 1,
        max: 30,
        step: 1,
        defaultValue: 7,
        icon: "📅",
        marks: [
          { label: "1", value: 1 },
          { label: "7", value: 7 },
          { label: "14", value: 14 },
          { label: "30", value: 30 },
        ],
        formatValue: (value) => `${value} ${value === 1 ? "day" : "days"}`,
        prompt: (value) => `lasting about ${value}`,
      },
      {
        id: "trip-focus",
        type: "choice",
        title: "Trip focus",
        variant: "pill",
        options: [
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family trip",
            value: "focused on family-friendly planning",
          },
          {
            icon: "🍝",
            label: "Food focused",
            value: "focused on food and local restaurants",
          },
          {
            icon: "🏖️",
            label: "Beach + city",
            value: "mixing beach time and city exploring",
          },
          {
            icon: "🎒",
            label: "Adventure",
            value: "with adventure and outdoor activities included",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-flight-priority",
        type: "choice",
        title: "Flight planning priority",
        helper: "Lucy will use this to prepare smarter flight booking context.",
        variant: "pill",
        requiresTripInclude: ["flights"],
        options: [
          {
            icon: "💸",
            label: "Budget first",
            value: "with budget-friendly flight options prioritized",
          },
          {
            icon: "⚡",
            label: "Shortest duration",
            value: "with shorter flight duration preferred",
          },
          {
            icon: "🛋️",
            label: "Comfort first",
            value: "with comfort and easier timing prioritized",
          },
          {
            icon: "🌙",
            label: "Red-eye friendly",
            value: "and I am open to red-eye flights",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-flight-cabin",
        type: "choice",
        title: "Flight cabin comfort",
        helper: "Choose the cabin level Lucy should keep in mind for flight booking.",
        variant: "pill",
        requiresTripInclude: ["flights"],
        options: [
          { icon: "💺", label: "Economy", value: "in economy" },
          {
            icon: "✨",
            label: "Premium economy",
            value: "with premium economy considered",
          },
          {
            icon: "💼",
            label: "Business class",
            value: "with business class considered",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family timing",
            value: "with family-friendly flight timing",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-flight-stops",
        type: "choice",
        title: "Flight stops",
        helper: "Tell Lucy how flexible the flight routing should be.",
        variant: "pill",
        requiresTripInclude: ["flights"],
        options: [
          {
            icon: "🎯",
            label: "Nonstop only",
            value: "with nonstop flights preferred",
          },
          {
            icon: "1️⃣",
            label: "Up to 1 stop",
            value: "with up to one stop acceptable",
          },
          {
            icon: "🔁",
            label: "Flexible stops",
            value: "with flexible stops if the value is better",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-hotel-style",
        type: "choice",
        title: "Hotel stay style",
        helper: "Lucy will use this to prepare hotel booking context.",
        variant: "pill",
        requiresTripInclude: ["hotels"],
        options: [
          {
            icon: "🏖️",
            label: "Resort comfort",
            value: "with resort-style hotel comfort preferred",
          },
          {
            icon: "🎨",
            label: "Boutique hotel",
            value: "with boutique hotel options preferred",
          },
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family comfort",
            value: "with family-friendly hotel comfort prioritized",
          },
          {
            icon: "🧳",
            label: "Budget smart stay",
            value: "with budget-smart hotel options prioritized",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-hotel-location",
        type: "choice",
        title: "Hotel location preference",
        helper: "Choose the location style Lucy should prioritize.",
        variant: "pill",
        requiresTripInclude: ["hotels"],
        options: [
          { icon: "🏙️", label: "Downtown", value: "near the city center" },
          { icon: "✈️", label: "Near airport", value: "near the airport" },
          {
            icon: "🍽️",
            label: "Food district",
            value: "near restaurants and food areas",
          },
          {
            icon: "🏝️",
            label: "Beach / resort area",
            value: "near beach or resort areas",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-hotel-amenities",
        type: "multi-choice",
        title: "Hotel amenities",
        helper: "Choose any amenities Lucy should keep in the hotel search context.",
        variant: "pill",
        icon: "🏨",
        requiresTripInclude: ["hotels"],
        options: [
          {
            icon: "☕",
            label: "Breakfast",
            value: "breakfast included",
          },
          {
            icon: "🏊",
            label: "Pool",
            value: "pool preferred",
          },
          {
            icon: "🧺",
            label: "Laundry",
            value: "laundry or longer-stay convenience",
          },
          {
            icon: "🐾",
            label: "Pet friendly",
            value: "pet-friendly hotel options",
          },
        ],
        prompt: (values) =>
          `with hotel amenities like ${values.join(", ").toLowerCase()}`,
      },
      {
        id: "itinerary-car-pickup",
        type: "choice",
        title: "Car rental pickup plan",
        helper: "Lucy will use this to prepare car rental booking context.",
        variant: "pill",
        requiresTripInclude: ["cars"],
        options: [
          { icon: "✈️", label: "Airport pickup", value: "with airport car pickup" },
          { icon: "🏙️", label: "City pickup", value: "with city car pickup" },
          {
            icon: "🔁",
            label: "One-way return",
            value: "with one-way car return considered",
          },
          {
            icon: "🕒",
            label: "Flexible timing",
            value: "with flexible pickup and return timing",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-car-type",
        type: "choice",
        title: "Car rental vehicle type",
        helper: "Choose the vehicle style Lucy should keep in mind.",
        variant: "pill",
        requiresTripInclude: ["cars"],
        options: [
          { icon: "🚗", label: "Compact", value: "with a compact rental car preferred" },
          { icon: "🚙", label: "SUV", value: "with an SUV rental preferred" },
          {
            icon: "👨‍👩‍👧",
            label: "Family vehicle",
            value: "with a family-friendly rental vehicle",
          },
          {
            icon: "🧳",
            label: "Large luggage",
            value: "with enough rental car space for luggage",
          },
          {
            icon: "⚡",
            label: "Electric",
            value: "with electric rental car options considered",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-cruise-region",
        type: "choice",
        title: "Cruise region",
        helper: "Lucy will use this to prepare cruise booking context.",
        variant: "pill",
        requiresTripInclude: ["cruises"],
        options: [
          { icon: "🌴", label: "Caribbean", value: "with Caribbean cruise options" },
          {
            icon: "🏛️",
            label: "Mediterranean",
            value: "with Mediterranean cruise options",
          },
          { icon: "❄️", label: "Alaska", value: "with Alaska cruise options" },
          {
            icon: "🚢",
            label: "Europe river cruise",
            value: "with Europe river cruise options considered",
          },
          {
            icon: "🧭",
            label: "Not sure",
            value: "and I am open to cruise region suggestions",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-cruise-cabin",
        type: "choice",
        title: "Cruise cabin style",
        helper: "Choose the cabin style Lucy should keep in mind.",
        variant: "pill",
        requiresTripInclude: ["cruises"],
        options: [
          { icon: "🛏️", label: "Interior", value: "with interior cabin options" },
          { icon: "🌊", label: "Ocean view", value: "with ocean view cabin options" },
          { icon: "🌅", label: "Balcony", value: "with balcony cabin options" },
          {
            icon: "✨",
            label: "Suite / premium",
            value: "with suite or premium cabin options considered",
          },
        ],
        prompt: (value) => value,
      },
      {
        id: "itinerary-cruise-vibe",
        type: "multi-choice",
        title: "Cruise vibe",
        helper: "Choose any cruise priorities Lucy should use when planning.",
        variant: "pill",
        icon: "🚢",
        requiresTripInclude: ["cruises"],
        options: [
          {
            icon: "👨‍👩‍👧‍👦",
            label: "Family friendly",
            value: "family-friendly cruise",
          },
          {
            icon: "🧘",
            label: "Relaxed luxury",
            value: "relaxed luxury cruise pace",
          },
          {
            icon: "🎭",
            label: "Entertainment",
            value: "entertainment-focused cruise",
          },
          {
            icon: "🍽️",
            label: "Food and dining",
            value: "food and dining focused cruise",
          },
          {
            icon: "🧭",
            label: "Excursions",
            value: "excursion and adventure focused cruise",
          },
        ],
        prompt: (values) =>
          `with cruise priorities like ${values.join(", ").toLowerCase()}`,
      },
    ],
  },
}