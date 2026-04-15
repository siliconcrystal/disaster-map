import type { DisasterDataSource, DisasterType } from './disasterData';

// ─────────────────────────────────────────────
// TaskType: matches spreadsheet 任務卡 schema
// ─────────────────────────────────────────────
export type TaskType =
  | 'search_rescue'        // 搜救
  | 'medical_support'      // 醫療支援
  | 'fire_response'        // 火災應變
  | 'supply_delivery'      // 物資運送
  | 'personnel_transport'  // 人員運送
  | 'equipment_transport'  // 設備運送
  | 'cleanup'              // 清理
  | 'repair'               // 修繕
  | 'inspection'           // 巡檢
  | 'info_report'          // 資訊回報
  | 'info_update'          // 資訊更新
  | 'info_verification'    // 資訊驗證
  | 'other'                // 其他

export type Priority = 'low' | 'medium' | 'high' | 'critical';

export type Status = 'pending' | 'in_progress' | 'completed' | 'canceled' | 'archived';

export type TimeRange = 'all' | '1h' | '12h' | '24h' | '72h' | 'custom';

export type VerificationStatus = 'unverified' | 'ai_verified' | 'human_verified' | 'disputed';

export type ModerationStatus = 'pending_review' | 'approved' | 'rejected' | 'merged';

// ─────────────────────────────────────────────
// Task: spreadsheet 任務卡 schema
// ─────────────────────────────────────────────
export type Task = {
  // ── Core identity ──
  id: string
  title: string
  description: string

  // ── Location ──
  lat: number
  lng: number
  address?: string
  poleId?: string

  // ── Classification ──
  type: TaskType
  disasterType: DisasterType
  disasterCategory?: DisasterType

  // ── Status ──
  priority: Priority
  status: Status
  source: 'user' | 'gov' | 'crawler' | 'ngo' | 'admin'
  visibility: 'public' | 'restricted' | 'internal'

  // ── Time ──
  createdAt: number
  updatedAt?: number

  // ── People ──
  createdBy?: string
  updatedBy?: string
  assignedActorIds?: string[]
  reporterName?: string
  reporterUnit?: string
  contact?: string

  // ── Headcount ──
  requiredHeadcount?: number
  assignedHeadcount?: number
  requiredSkills?: string[]
  requiredResources?: string[]

  // ── Media ──
  photoUrls?: string[]

  // ── Verification & trust ──
  confidenceScore: number
  verificationStatus: VerificationStatus
  isDuplicate: boolean
  dedupGroupId?: string
  moderationStatus: ModerationStatus
  reviewNote?: string
  progressNote?: string

  // ── Task execution ──
  history?: {
    timestamp: number
    message: string
    type?: 'status' | 'comment' | 'system'
  }[]

  feedback?: {
    helpful: number
    toConfirm: number
  }

  // ── Disaster-specific (earthquake/fire/landslide) ──
  peopleCount?: number
  floorLevel?: string
  unitNumber?: string
  hazardNote?: string

  // ── Transport-specific ──
  destination?: string
  vehicleTypes?: string[]
  cargoType?: string
  cargoQuantity?: number

  // ── Cleanup-specific ──
  cleanupType?: string
  requiredTools?: string[]

  // ── Legacy/extended data ──
  disasterData?: Partial<DisasterDataSource>
}

// ─────────────────────────────────────────────
// Map zones (unchanged)
// ─────────────────────────────────────────────
export type ZoneType = 'evacuation' | 'ngo' | 'restricted';

export interface MapZone {
  id: string
  type: ZoneType
  name: string
  coordinates: [number, number][]
  description?: string
  color?: string
}
