export type AirlineTier = "major" | "secondary" | "unknown"

export type AirlineReferenceEntry = {
  name: string
  tier: AirlineTier
}

export const airlineReference: Record<string, AirlineReferenceEntry> = {
  A3: { name: "Aegean Airlines", tier: "secondary" },
  AA: { name: "American Airlines", tier: "major" },
  AC: { name: "Air Canada", tier: "major" },
  AD: { name: "Azul Brazilian Airlines", tier: "major" },
  AF: { name: "Air France", tier: "major" },
  AH: { name: "Air Algerie", tier: "secondary" },
  AI: { name: "Air India", tier: "major" },
  AK: { name: "AirAsia", tier: "secondary" },
  AM: { name: "Aeromexico", tier: "major" },
  AR: { name: "Aerolíneas Argentinas", tier: "major" },
  AS: { name: "Alaska Airlines", tier: "major" },
  AT: { name: "Royal Air Maroc", tier: "secondary" },
  AV: { name: "Avianca", tier: "major" },
  AY: { name: "Finnair", tier: "major" },

  B6: { name: "JetBlue", tier: "major" },
  BA: { name: "British Airways", tier: "major" },
  BR: { name: "EVA Air", tier: "major" },
  BT: { name: "airBaltic", tier: "secondary" },

  CA: { name: "Air China", tier: "major" },
  CI: { name: "China Airlines", tier: "major" },
  CM: { name: "Copa Airlines", tier: "major" },
  CX: { name: "Cathay Pacific", tier: "major" },
  CZ: { name: "China Southern Airlines", tier: "major" },

  DE: { name: "Condor", tier: "secondary" },
  DL: { name: "Delta Air Lines", tier: "major" },
  DY: { name: "Norwegian Air Shuttle", tier: "secondary" },

  EK: { name: "Emirates", tier: "major" },
  ET: { name: "Ethiopian Airlines", tier: "major" },
  EW: { name: "Eurowings", tier: "secondary" },
  EY: { name: "Etihad Airways", tier: "major" },

  F9: { name: "Frontier Airlines", tier: "secondary" },
  FD: { name: "Thai AirAsia", tier: "secondary" },
  FI: { name: "Icelandair", tier: "major" },
  FJ: { name: "Fiji Airways", tier: "secondary" },
  FM: { name: "Shanghai Airlines", tier: "secondary" },
  FR: { name: "Ryanair", tier: "secondary" },

  G3: { name: "GOL Linhas Aéreas", tier: "major" },
  G4: { name: "Allegiant Air", tier: "secondary" },
  GA: { name: "Garuda Indonesia", tier: "major" },
  GF: { name: "Gulf Air", tier: "secondary" },

  HA: { name: "Hawaiian Airlines", tier: "secondary" },
  H2: { name: "Sky Airline", tier: "secondary" },
  HV: { name: "Transavia", tier: "secondary" },
  HU: { name: "Hainan Airlines", tier: "major" },

  IB: { name: "Iberia", tier: "major" },

  JA: { name: "JetSMART", tier: "secondary" },
  JL: { name: "Japan Airlines", tier: "major" },
  JQ: { name: "Jetstar Airways", tier: "secondary" },
  JU: { name: "Air Serbia", tier: "secondary" },

  KE: { name: "Korean Air", tier: "major" },
  KL: { name: "KLM", tier: "major" },
  KP: { name: "ASKY Airlines", tier: "secondary" },
  KQ: { name: "Kenya Airways", tier: "secondary" },
  KU: { name: "Kuwait Airways", tier: "secondary" },

  LA: { name: "LATAM Airlines", tier: "major" },
  LH: { name: "Lufthansa", tier: "major" },
  LO: { name: "LOT Polish Airlines", tier: "major" },
  LR: { name: "Avianca Costa Rica", tier: "secondary" },
  LX: { name: "SWISS", tier: "major" },
  LY: { name: "EL AL", tier: "major" },

  ME: { name: "Middle East Airlines", tier: "secondary" },
  MF: { name: "XiamenAir", tier: "secondary" },
  MH: { name: "Malaysia Airlines", tier: "major" },
  MS: { name: "Egyptair", tier: "secondary" },
  MU: { name: "China Eastern Airlines", tier: "major" },

  N0: { name: "Norse Atlantic Airways", tier: "secondary" },
  NH: { name: "All Nippon Airways", tier: "major" },
  NK: { name: "Spirit Airlines", tier: "secondary" },
  NZ: { name: "Air New Zealand", tier: "major" },

  OB: { name: "Boliviana de Aviación", tier: "secondary" },
  OG: { name: "PLAY Airlines", tier: "secondary" },
  OS: { name: "Austrian Airlines", tier: "major" },
  OU: { name: "Croatia Airlines", tier: "secondary" },
  OZ: { name: "Asiana Airlines", tier: "major" },

  PC: { name: "Pegasus Airlines", tier: "secondary" },
  PD: { name: "Porter Airlines", tier: "secondary" },
  PK: { name: "PIA", tier: "secondary" },
  PR: { name: "Philippine Airlines", tier: "secondary" },

  QF: { name: "Qantas", tier: "major" },
  QR: { name: "Qatar Airways", tier: "major" },
  QS: { name: "Smartwings", tier: "secondary" },
  QZ: { name: "Indonesia AirAsia", tier: "secondary" },

  RJ: { name: "Royal Jordanian", tier: "secondary" },
  RO: { name: "Tarom", tier: "secondary" },

  S4: { name: "Azores Airlines", tier: "secondary" },
  SA: { name: "South African Airways", tier: "secondary" },
  SC: { name: "Shandong Airlines", tier: "secondary" },
  SK: { name: "SAS Scandinavian Airlines", tier: "major" },
  SL: { name: "Thai Lion Air", tier: "secondary" },
  SN: { name: "Brussels Airlines", tier: "major" },
  SQ: { name: "Singapore Airlines", tier: "major" },
  SU: { name: "Aeroflot", tier: "secondary" },
  SV: { name: "Saudia", tier: "major" },

  TA: { name: "Avianca El Salvador", tier: "secondary" },
  TG: { name: "THAI Airways", tier: "major" },
  TK: { name: "Turkish Airlines", tier: "major" },
  TO: { name: "Transavia France", tier: "secondary" },
  TP: { name: "TAP Air Portugal", tier: "major" },

  U2: { name: "easyJet", tier: "secondary" },
  UA: { name: "United Airlines", tier: "major" },
  UL: { name: "SriLankan Airlines", tier: "secondary" },
  UX: { name: "Air Europa", tier: "major" },

  VA: { name: "Virgin Australia", tier: "major" },
  VB: { name: "Viva Aerobus", tier: "secondary" },
  VJ: { name: "Vietjet", tier: "secondary" },
  VN: { name: "Vietnam Airlines", tier: "major" },
  VS: { name: "Virgin Atlantic", tier: "major" },
  VY: { name: "Vueling", tier: "secondary" },

  W6: { name: "Wizz Air", tier: "secondary" },
  WG: { name: "Sunwing Airlines", tier: "secondary" },
  WN: { name: "Southwest Airlines", tier: "major" },
  WS: { name: "WestJet", tier: "secondary" },
  WY: { name: "Oman Air", tier: "secondary" },

  X3: { name: "TUI fly Deutschland", tier: "secondary" },
  XQ: { name: "SunExpress", tier: "secondary" },

  Y4: { name: "Volaris", tier: "secondary" },

  ZH: { name: "Shenzhen Airlines", tier: "secondary" },
}

export function normalizeAirlineCode(code?: string | null) {
  const normalizedCode = code?.trim().toUpperCase()

  return normalizedCode || null
}

export function getAirlineDisplayName(code?: string | null) {
  const normalizedCode = normalizeAirlineCode(code)

  if (!normalizedCode) {
    return "Airline pending"
  }

  return airlineReference[normalizedCode]?.name ?? "Airline pending"
}

export function getAirlineTier(code?: string | null): AirlineTier {
  const normalizedCode = normalizeAirlineCode(code)

  if (!normalizedCode) {
    return "unknown"
  }

  return airlineReference[normalizedCode]?.tier ?? "unknown"
}