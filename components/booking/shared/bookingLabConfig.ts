import type { BookingMode, BookingModeConfig } from "./bookingLabTypes"

export const bookingModes: Record<BookingMode, BookingModeConfig> = {
  flights: {
    id: "flights",
    label: "Find flights",
    title: "Find flights with Skysirv.",
    subtitle:
      "Search flight options with Lucy context, route intelligence, flexible timing, and smarter booking signals ready to support the decision.",
    panelSubtitle:
      "Enter your flight details, then let Skysirv help compare smarter route options.",
  },
  hotels: {
    id: "hotels",
    label: "Book hotels",
    title: "Book hotels with Skysirv.",
    subtitle:
      "Search stays by destination, dates, guests, location needs, amenities, and total trip fit — with Lucy context ready to guide the stay strategy.",
    panelSubtitle:
      "Enter your stay details, then compare hotels around location, comfort, and total trip value.",
  },
  cars: {
    id: "cars",
    label: "Car rentals",
    title: "Find car rentals with Skysirv.",
    subtitle:
      "Search rental cars by pickup plan, timing, vehicle style, luggage needs, and flexibility so the ground portion of the trip fits the full plan.",
    panelSubtitle:
      "Enter your pickup and vehicle needs, then compare rental options with trip context in mind.",
  },
  cruises: {
    id: "cruises",
    label: "Book cruises",
    title: "Book cruises with Skysirv.",
    subtitle:
      "Search cruise options by region, departure port, duration, travelers, cabin style, and onboard priorities for a cleaner planning-to-booking path.",
    panelSubtitle:
      "Enter your cruise basics, then compare sailing options by region, duration, cabin style, and trip vibe.",
  },
  experiences: {
    id: "experiences",
    label: "Featured Experiences",
    title: "Explore featured experiences with Skysirv.",
    subtitle:
      "Discover curated travel partners, destination experiences, premium services, and hand-picked offers that complement the full Skysirv booking network.",
    panelSubtitle:
      "Browse featured travel experiences, partners, and curated offers selected for the Skysirv network.",
  },
}

export const bookingModeOrder: BookingMode[] = [
  "flights",
  "hotels",
  "cars",
  "cruises",
  "experiences",
]

export const quickOptionLabels: Record<BookingMode, string[]> = {
  flights: ["Bundle + save", "Add a hotel", "Add a car"],
  hotels: ["Free cancellation", "Breakfast included", "Good location"],
  cars: ["Airport pickup", "Extra luggage space", "Flexible return"],
  cruises: ["Family friendly", "Balcony cabin", "Flexible dates"],
  experiences: ["Curated partners", "Local experiences", "Premium travel"],
}

export const compactTrustLabels = [
  "Delta",
  "United",
  "American",
  "Alaska",
  "British Airways",
  "Lufthansa",
]

export const cabinOptions = ["Economy", "Premium Economy", "Business", "First"]