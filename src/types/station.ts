// ─────────────────────────────────────────────
// StationType: matches spreadsheet overview tab
// ─────────────────────────────────────────────
export type StationType =
  | 'water'            // 加水點
  | 'shelter'          // 避難所
  | 'shower'           // 洗澡點
  | 'toilet'           // 廁所點 (was 'restroom')
  | 'supply'           // 物資站
  | 'gas_station'      // 加油站
  | 'medical'          // 醫療站
  | 'transport'        // 交通點
  | 'charge_spot'      // 充電站
  | 'power_station'    // 發電站
  | 'cellular_point'   // 通訊站
  | 'accommodation'    // 住宿點
  | 'reception_center' // 收容所

export type StationStatus = 'open' | 'closed' | 'full' | 'limited'

export type VerificationStatus = 'unverified' | 'ai_verified' | 'human_verified' | 'disputed'

// ─────────────────────────────────────────────
// Station: spreadsheet 資源站點 schema
//   - Display=Yes common fields (25)
//   - Display=No system fields (5)
//   - Type-specific properties (flat)
// ─────────────────────────────────────────────
export type Station = {
  // ── Core identity ──
  id: string
  type: StationType
  name: string

  // ── Location ──
  lat: number
  lng: number
  address?: string
  poleId?: string
  poleType?: string
  polePhotoUrl?: string
  poleNote?: string

  // ── Status & metadata ──
  status: StationStatus
  source: 'user' | 'gov' | 'crawler' | 'ngo' | 'admin'
  createdAt: string
  updatedAt: string
  description?: string
  updatedBy?: string

  // ── Media ──
  photoUrls: string[]

  // ── Verification & trust ──
  isTemporary: boolean
  expiresAt?: string
  isOfficial: boolean
  verificationStatus: VerificationStatus
  isDuplicate: boolean
  confidenceScore?: number
  dedupGroupId?: string

  // ── User interaction ──
  voteCount: number
  upvoteCount: number
  downvoteCount: number
  crowdLevel?: string

  // ── Operating ──
  availableTime?: string

  // ── Display control ──
  visibility: 'public' | 'restricted' | 'internal'
  priorityScore?: number

  // ── Contact (generic, replaces old contact/contactName) ──
  contactInfo?: string

  // ── Type-specific: water (加水點) ──
  isPotable?: boolean
  waterLevel?: string

  // ── Type-specific: shelter (避難所) / reception_center (收容所) ──
  capacityTotal?: number
  bedsAvailable?: number
  petFriendly?: boolean
  vulnerablePriority?: boolean
  hasMedicalSupport?: boolean
  longTermStay?: boolean

  // ── Type-specific: accommodation (住宿點) ──
  isCharge?: boolean
  price?: number

  // ── Type-specific: shower (洗澡點) ──
  genderLimit?: string
  hasHotWater?: boolean

  // ── Type-specific: toilet (廁所點) ──
  hasFlush?: boolean

  // ── Type-specific: supply (物資站) ──
  supplyTypes?: string[]
  supplyRationed?: boolean
  supplyCondition?: string

  // ── Type-specific: gas_station (加油站) ──
  fuelTypes?: string[]
  isOpen?: boolean
  isOnsale?: boolean

  // ── Type-specific: medical (醫療站) ──
  medicalLevel?: string
  specialties?: string[]
  hasStaff?: boolean
  capacityAvailable?: number
  vetAvailable?: boolean
}
