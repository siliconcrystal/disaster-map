export type TaskType =
  | "fire"          // 🔥 火災
  | "rescue"        // 🚨 搜救
  | "danger"        // 🚧 危險區
  | "people"        // 👥 人員統計
  | "inspection"    // ⛑️ 建築檢查
  | "medical"       // 🚑 醫療
  | "supply"        // 📦 物資
  | "cleanup"       // 🪏 清理淤泥
  | "heavy"         // 🚜 重型機具
  | "utility"       // 🔧 水電
  | "support"       // 💪 人力支援
  | "transport"     // 🛵 協助運送

export type Urgency = "low" | "medium" | "high"

export type Status = "reported" | "recruiting" | "in_progress" | "done"
export type TimeRange = "all" | "1h" | "12h" | "24h" | "72h" | "custom";

export type Task = {
  id: string
  title: string
  description: string
  lat: number
  lng: number
  type: TaskType
  urgency: Urgency
  status: Status
  createdAt: number
  createdBy?: string
  assignedTo?: string[]
  address?: string
  reporterName?: string
  reporterUnit?: string
  photos?: string[]
  hasFloors?: boolean
  floorData?: { floor: string; status: string; details: string }[]
  history?: { timestamp: number; message: string; type?: 'status' | 'comment' | 'system' }[]
  feedback?: { helpful: number; toConfirm: number }
  contact?: string
}

export type ZoneType = 'evacuation' | 'ngo' | 'restricted';

export interface MapZone {
  id: string;
  type: ZoneType;
  name: string;
  coordinates: [number, number][]; // Array of [lat, lng]
  description?: string;
  color?: string;
}
