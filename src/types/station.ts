export type StationType =
  | 'shower'         // 🚿 洗澡
  | 'restroom'       // 🚻 廁所
  | 'medical'        // 🏥 醫療
  | 'supply'         // 📦 物資
  | 'shelter'        // 🏠 避難
  | 'accommodation'  // 🏨 住宿
  | 'water'          // 💧 飲水
  | 'repair'         // 🔧 維修

export type StationStatus = 'open' | 'closed' | 'full' | 'limited'

export type Station = {
  id: string
  name: string
  address: string
  lat: number
  lng: number
  type: StationType
  subType?: string
  status: StationStatus
  contact?: string
  contactName?: string
  notes?: string
  openTime?: string
  endTime?: string
  resources?: { name: string; unit: string; amount: number }[]
}
