/**
 * 災害地圖圖層配置
 *
 * 根據不同災害類型，定義地圖上需要顯示的圖層
 * 每個圖層對應 DisasterDataSource 中的資料欄位
 */

import type { DisasterType } from '@/types/disasterData';

// ─────────────────────────────────────────────
// 圖層 Key 定義
// ─────────────────────────────────────────────
export type MapLayerKey =
  // Base Layer - 基礎圖資
  | 'satellite' // 衛星圖
  | 'aerialPhoto' // 即時空拍圖
  | 'adminBoundary' // 行政區界
  | 'roadNetwork' // 道路網
  | 'blockedRoutes' // 交通阻斷路徑
  | 'disasterZone' // 災害影響範圍
  // Hydrology - 水文圖層
  | 'rainfall' // 雨量分布
  | 'floodPotential' // 淹水潛勢區
  | 'riverBasin' // 河川流域
  | 'riverLevel' // 河川水位
  | 'debrisFlow' // 土石流潛勢區
  | 'dem' // DEM 高程模型
  | 'slope' // 坡度圖
  // Weather - 氣象圖層
  | 'windSpeed' // 風速
  // Hazard - 危險點位
  | 'gasStation' // 加油站
  | 'chemicalStorage' // 化學品倉儲
  | 'industrialZone' // 工業區
  // Resource - 資源圖層
  | 'unitStandby' // 出勤單位待命位置
  | 'ambulance' // 救護車動向
  | 'medicalStation' // 醫療站點
  | 'supplyPoint' // 物資發放點
  | 'heavyEquipment' // 重型機具
  // Infrastructure - 基礎設施
  | 'publicFacility' // 公共設施狀態
  | 'utilityOutage' // 停水停電區域
  // Recovery - 復原狀態
  | 'cleanupStatus' // 清潔動態
  // Public - 公共服務
  | 'shelter' // 收容所
  | 'evacuationPoint' // 避難點
  | 'toilet' // 廁所點
  // Vulnerable - 弱勢族群
  | 'elderly' // 高齡點位
  | 'disability' // 身心障礙點位
  | 'infant' // 幼兒位置
  // Building - 建物資訊
  | 'buildingRisk' // 危老建築
  | 'buildingFloorPlan' // 建築內部圖
  // Pandemic - 疫情專用
  | 'hospitalPatient' // 院所病患
  | 'infectedTrail'; // 染疫者足跡

// ─────────────────────────────────────────────
// 單一圖層配置
// ─────────────────────────────────────────────
export interface LayerConfig {
  /** 是否預設啟用 */
  enabled: boolean;
  /** 重要程度：決定圖層載入優先級 */
  priority: 'critical' | 'high' | 'medium' | 'low';
  /** 圖層顯示名稱 */
  label: string;
  /** 圖層圖示 */
  icon?: string;
  /** 圖層分類 */
  category:
    | 'base'
    | 'hydrology'
    | 'weather'
    | 'hazard'
    | 'resource'
    | 'infrastructure'
    | 'public'
    | 'vulnerable'
    | 'pandemic';
}

// ─────────────────────────────────────────────
// 災害類型的圖層配置
// ─────────────────────────────────────────────
export type DisasterLayerConfig = Partial<Record<MapLayerKey, LayerConfig>>;

// ─────────────────────────────────────────────
// 各災害類型的圖層配置
// ─────────────────────────────────────────────
export const DISASTER_MAP_LAYERS: Record<DisasterType, DisasterLayerConfig> = {
  // ════════════════════════════════════════════
  // 🌍 地震
  // ════════════════════════════════════════════
  earthquake: {
    // Base Layer
    satellite: {
      enabled: false,
      priority: 'medium',
      label: '衛星圖',
      icon: '🛰️',
      category: 'base',
    },
    aerialPhoto: {
      enabled: true,
      priority: 'high',
      label: '即時空拍圖',
      icon: '📷',
      category: 'base',
    },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'critical',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: true,
      priority: 'critical',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '災害範圍',
      icon: '⚠️',
      category: 'base',
    },
    // Hazard
    gasStation: {
      enabled: true,
      priority: 'high',
      label: '加油站',
      icon: '⛽',
      category: 'hazard',
    },
    chemicalStorage: {
      enabled: true,
      priority: 'medium',
      label: '化學品倉儲',
      icon: '☣️',
      category: 'hazard',
    },
    industrialZone: {
      enabled: false,
      priority: 'medium',
      label: '工業區',
      icon: '🏭',
      category: 'hazard',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'critical',
      label: '醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: true,
      priority: 'critical',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    heavyEquipment: {
      enabled: true,
      priority: 'critical',
      label: '重型機具',
      icon: '🚜',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    utilityOutage: {
      enabled: true,
      priority: 'high',
      label: '停水停電',
      icon: '💡',
      category: 'infrastructure',
    },
    // Recovery
    cleanupStatus: {
      enabled: false,
      priority: 'medium',
      label: '清理狀態',
      icon: '🧹',
      category: 'infrastructure',
    },
    // Public
    shelter: { enabled: true, priority: 'high', label: '收容所', icon: '🏕️', category: 'public' },
    evacuationPoint: {
      enabled: true,
      priority: 'medium',
      label: '避難點',
      icon: '🚶',
      category: 'public',
    },
    toilet: { enabled: false, priority: 'low', label: '廁所', icon: '🚻', category: 'public' },
    // Vulnerable
    elderly: {
      enabled: true,
      priority: 'critical',
      label: '高齡點位',
      icon: '👴',
      category: 'vulnerable',
    },
    disability: {
      enabled: true,
      priority: 'critical',
      label: '身障點位',
      icon: '♿',
      category: 'vulnerable',
    },
    infant: {
      enabled: true,
      priority: 'critical',
      label: '幼兒點位',
      icon: '👶',
      category: 'vulnerable',
    },
    // Building
    buildingRisk: {
      enabled: true,
      priority: 'critical',
      label: '危老建築',
      icon: '🏚️',
      category: 'infrastructure',
    },
    buildingFloorPlan: {
      enabled: true,
      priority: 'critical',
      label: '建築平面圖',
      icon: '📐',
      category: 'infrastructure',
    },
  },

  // ════════════════════════════════════════════
  // 🔥 火災
  // ════════════════════════════════════════════
  fire: {
    // Base Layer
    satellite: {
      enabled: false,
      priority: 'medium',
      label: '衛星圖',
      icon: '🛰️',
      category: 'base',
    },
    aerialPhoto: {
      enabled: true,
      priority: 'high',
      label: '即時空拍圖',
      icon: '📷',
      category: 'base',
    },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'critical',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: true,
      priority: 'critical',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '火災範圍',
      icon: '🔥',
      category: 'base',
    },
    // Hazard
    gasStation: {
      enabled: true,
      priority: 'critical',
      label: '加油站',
      icon: '⛽',
      category: 'hazard',
    },
    chemicalStorage: {
      enabled: true,
      priority: 'critical',
      label: '化學品倉儲',
      icon: '☣️',
      category: 'hazard',
    },
    industrialZone: {
      enabled: true,
      priority: 'high',
      label: '工業區',
      icon: '🏭',
      category: 'hazard',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'high',
      label: '醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: false,
      priority: 'medium',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    utilityOutage: {
      enabled: true,
      priority: 'high',
      label: '停水停電',
      icon: '💡',
      category: 'infrastructure',
    },
    // Public
    shelter: { enabled: true, priority: 'high', label: '收容所', icon: '🏕️', category: 'public' },
    evacuationPoint: {
      enabled: true,
      priority: 'critical',
      label: '避難點',
      icon: '🚶',
      category: 'public',
    },
    // Vulnerable
    elderly: {
      enabled: true,
      priority: 'high',
      label: '高齡點位',
      icon: '👴',
      category: 'vulnerable',
    },
    disability: {
      enabled: true,
      priority: 'high',
      label: '身障點位',
      icon: '♿',
      category: 'vulnerable',
    },
  },

  // ════════════════════════════════════════════
  // 🌪️ 風災
  // ════════════════════════════════════════════
  storm: {
    // Base Layer
    satellite: {
      enabled: false,
      priority: 'medium',
      label: '衛星圖',
      icon: '🛰️',
      category: 'base',
    },
    aerialPhoto: {
      enabled: true,
      priority: 'high',
      label: '即時空拍圖',
      icon: '📷',
      category: 'base',
    },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'critical',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: true,
      priority: 'critical',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '風災範圍',
      icon: '🌪️',
      category: 'base',
    },
    // Weather
    windSpeed: {
      enabled: true,
      priority: 'critical',
      label: '風速',
      icon: '💨',
      category: 'weather',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'high',
      label: '醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: true,
      priority: 'high',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    heavyEquipment: {
      enabled: true,
      priority: 'high',
      label: '重型機具',
      icon: '🚜',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    utilityOutage: {
      enabled: true,
      priority: 'critical',
      label: '停水停電',
      icon: '💡',
      category: 'infrastructure',
    },
    cleanupStatus: {
      enabled: true,
      priority: 'medium',
      label: '清理狀態',
      icon: '🧹',
      category: 'infrastructure',
    },
    // Public
    shelter: { enabled: true, priority: 'high', label: '收容所', icon: '🏕️', category: 'public' },
    evacuationPoint: {
      enabled: true,
      priority: 'high',
      label: '避難點',
      icon: '🚶',
      category: 'public',
    },
    // Vulnerable
    elderly: {
      enabled: true,
      priority: 'high',
      label: '高齡點位',
      icon: '👴',
      category: 'vulnerable',
    },
    disability: {
      enabled: true,
      priority: 'high',
      label: '身障點位',
      icon: '♿',
      category: 'vulnerable',
    },
  },

  // ════════════════════════════════════════════
  // 🌊 水災
  // ════════════════════════════════════════════
  flood: {
    // Base Layer
    satellite: {
      enabled: false,
      priority: 'medium',
      label: '衛星圖',
      icon: '🛰️',
      category: 'base',
    },
    aerialPhoto: {
      enabled: true,
      priority: 'high',
      label: '即時空拍圖',
      icon: '📷',
      category: 'base',
    },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'critical',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: true,
      priority: 'critical',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '淹水範圍',
      icon: '🌊',
      category: 'base',
    },
    // Hydrology
    rainfall: {
      enabled: true,
      priority: 'critical',
      label: '雨量分布',
      icon: '🌧️',
      category: 'hydrology',
    },
    floodPotential: {
      enabled: true,
      priority: 'critical',
      label: '淹水潛勢',
      icon: '💧',
      category: 'hydrology',
    },
    riverBasin: {
      enabled: true,
      priority: 'critical',
      label: '河川流域',
      icon: '🏞️',
      category: 'hydrology',
    },
    riverLevel: {
      enabled: true,
      priority: 'critical',
      label: '河川水位',
      icon: '📊',
      category: 'hydrology',
    },
    debrisFlow: {
      enabled: true,
      priority: 'critical',
      label: '土石流潛勢',
      icon: '⛰️',
      category: 'hydrology',
    },
    dem: { enabled: false, priority: 'high', label: 'DEM 高程', icon: '📈', category: 'hydrology' },
    slope: { enabled: false, priority: 'high', label: '坡度圖', icon: '📉', category: 'hydrology' },
    // Hazard
    gasStation: {
      enabled: false,
      priority: 'medium',
      label: '加油站',
      icon: '⛽',
      category: 'hazard',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'critical',
      label: '醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: true,
      priority: 'critical',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    heavyEquipment: {
      enabled: true,
      priority: 'high',
      label: '重型機具',
      icon: '🚜',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    utilityOutage: {
      enabled: true,
      priority: 'high',
      label: '停水停電',
      icon: '💡',
      category: 'infrastructure',
    },
    cleanupStatus: {
      enabled: true,
      priority: 'high',
      label: '清理狀態',
      icon: '🧹',
      category: 'infrastructure',
    },
    // Public
    shelter: { enabled: true, priority: 'high', label: '收容所', icon: '🏕️', category: 'public' },
    evacuationPoint: {
      enabled: true,
      priority: 'high',
      label: '避難點',
      icon: '🚶',
      category: 'public',
    },
    toilet: { enabled: true, priority: 'medium', label: '廁所', icon: '🚻', category: 'public' },
    // Vulnerable
    elderly: {
      enabled: true,
      priority: 'high',
      label: '高齡點位',
      icon: '👴',
      category: 'vulnerable',
    },
    disability: {
      enabled: true,
      priority: 'high',
      label: '身障點位',
      icon: '♿',
      category: 'vulnerable',
    },
    infant: {
      enabled: true,
      priority: 'high',
      label: '幼兒點位',
      icon: '👶',
      category: 'vulnerable',
    },
  },

  // ════════════════════════════════════════════
  // 🦠 疫情
  // ════════════════════════════════════════════
  pandemic: {
    // Base Layer
    satellite: { enabled: false, priority: 'low', label: '衛星圖', icon: '🛰️', category: 'base' },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'medium',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: false,
      priority: 'low',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '疫情熱區',
      icon: '🦠',
      category: 'base',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'critical',
      label: '篩檢站/醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: true,
      priority: 'critical',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    utilityOutage: {
      enabled: false,
      priority: 'low',
      label: '停水停電',
      icon: '💡',
      category: 'infrastructure',
    },
    // Public
    shelter: {
      enabled: true,
      priority: 'high',
      label: '收容/隔離所',
      icon: '🏕️',
      category: 'public',
    },
    toilet: { enabled: true, priority: 'medium', label: '廁所', icon: '🚻', category: 'public' },
    // Vulnerable
    elderly: {
      enabled: true,
      priority: 'critical',
      label: '高齡點位',
      icon: '👴',
      category: 'vulnerable',
    },
    disability: {
      enabled: true,
      priority: 'critical',
      label: '身障點位',
      icon: '♿',
      category: 'vulnerable',
    },
    infant: {
      enabled: true,
      priority: 'high',
      label: '幼兒點位',
      icon: '👶',
      category: 'vulnerable',
    },
    // Pandemic specific
    hospitalPatient: {
      enabled: true,
      priority: 'critical',
      label: '院所病患',
      icon: '🏨',
      category: 'pandemic',
    },
    infectedTrail: {
      enabled: true,
      priority: 'critical',
      label: '足跡追蹤',
      icon: '👣',
      category: 'pandemic',
    },
  },

  // ════════════════════════════════════════════
  // ⚔️ 戰爭
  // ════════════════════════════════════════════
  war: {
    // Base Layer
    satellite: { enabled: true, priority: 'high', label: '衛星圖', icon: '🛰️', category: 'base' },
    aerialPhoto: {
      enabled: false,
      priority: 'medium',
      label: '即時空拍圖',
      icon: '📷',
      category: 'base',
    },
    adminBoundary: {
      enabled: true,
      priority: 'high',
      label: '行政區界',
      icon: '🗺️',
      category: 'base',
    },
    roadNetwork: {
      enabled: true,
      priority: 'critical',
      label: '道路網',
      icon: '🛣️',
      category: 'base',
    },
    blockedRoutes: {
      enabled: true,
      priority: 'critical',
      label: '交通阻斷',
      icon: '🚧',
      category: 'base',
    },
    disasterZone: {
      enabled: true,
      priority: 'critical',
      label: '戰區範圍',
      icon: '⚔️',
      category: 'base',
    },
    // Hazard
    chemicalStorage: {
      enabled: true,
      priority: 'critical',
      label: '化學品倉儲',
      icon: '☣️',
      category: 'hazard',
    },
    industrialZone: {
      enabled: true,
      priority: 'high',
      label: '工業區',
      icon: '🏭',
      category: 'hazard',
    },
    // Resource
    unitStandby: {
      enabled: true,
      priority: 'high',
      label: '待命單位',
      icon: '🚒',
      category: 'resource',
    },
    ambulance: {
      enabled: true,
      priority: 'high',
      label: '救護車',
      icon: '🚑',
      category: 'resource',
    },
    medicalStation: {
      enabled: true,
      priority: 'critical',
      label: '醫療站',
      icon: '🏥',
      category: 'resource',
    },
    supplyPoint: {
      enabled: true,
      priority: 'critical',
      label: '物資發放',
      icon: '📦',
      category: 'resource',
    },
    // Infrastructure
    publicFacility: {
      enabled: true,
      priority: 'high',
      label: '公共設施',
      icon: '🏛️',
      category: 'infrastructure',
    },
    cleanupStatus: {
      enabled: true,
      priority: 'medium',
      label: '清理狀態',
      icon: '🧹',
      category: 'infrastructure',
    },
    // Public
    shelter: {
      enabled: true,
      priority: 'critical',
      label: '收容所/避難所',
      icon: '🏕️',
      category: 'public',
    },
    evacuationPoint: {
      enabled: true,
      priority: 'critical',
      label: '避難點',
      icon: '🚶',
      category: 'public',
    },
    // Building
    buildingRisk: {
      enabled: true,
      priority: 'high',
      label: '危險建築',
      icon: '🏚️',
      category: 'infrastructure',
    },
  },
};

// ─────────────────────────────────────────────
// Helper Functions
// ─────────────────────────────────────────────

/**
 * 取得特定災害類型的圖層配置
 */
export function getLayerConfig(disasterType: DisasterType): DisasterLayerConfig {
  return DISASTER_MAP_LAYERS[disasterType];
}

/**
 * 檢查某圖層是否在特定災害中啟用
 */
export function isLayerEnabled(disasterType: DisasterType, layerKey: MapLayerKey): boolean {
  return DISASTER_MAP_LAYERS[disasterType]?.[layerKey]?.enabled ?? false;
}

/**
 * 取得特定災害類型中所有啟用的圖層
 */
export function getEnabledLayers(disasterType: DisasterType): MapLayerKey[] {
  const config = DISASTER_MAP_LAYERS[disasterType];
  return (Object.entries(config) as [MapLayerKey, LayerConfig][])
    .filter(([, cfg]) => cfg.enabled)
    .map(([key]) => key);
}

/**
 * 取得特定災害類型中按優先級排序的圖層
 */
export function getLayersByPriority(
  disasterType: DisasterType,
  priority?: LayerConfig['priority'],
): MapLayerKey[] {
  const config = DISASTER_MAP_LAYERS[disasterType];
  const entries = Object.entries(config) as [MapLayerKey, LayerConfig][];

  const filtered = priority ? entries.filter(([, cfg]) => cfg.priority === priority) : entries;

  const priorityOrder: Record<LayerConfig['priority'], number> = {
    critical: 0,
    high: 1,
    medium: 2,
    low: 3,
  };

  return filtered
    .sort(([, a], [, b]) => priorityOrder[a.priority] - priorityOrder[b.priority])
    .map(([key]) => key);
}

/**
 * 取得特定災害類型中按分類分組的圖層
 */
export function getLayersByCategory(
  disasterType: DisasterType,
): Record<LayerConfig['category'], { key: MapLayerKey; config: LayerConfig }[]> {
  const config = DISASTER_MAP_LAYERS[disasterType];
  const result: Record<LayerConfig['category'], { key: MapLayerKey; config: LayerConfig }[]> = {
    base: [],
    hydrology: [],
    weather: [],
    hazard: [],
    resource: [],
    infrastructure: [],
    public: [],
    vulnerable: [],
    pandemic: [],
  };

  for (const [key, cfg] of Object.entries(config) as [MapLayerKey, LayerConfig][]) {
    result[cfg.category].push({ key, config: cfg });
  }

  return result;
}

/**
 * MapLayerKey 對應到 DisasterDataSource 的欄位映射
 */
export const LAYER_TO_DATA_FIELD: Record<
  MapLayerKey,
  keyof import('@/types/disasterData').DisasterDataSource | null
> = {
  satellite: 'satelliteImageUrl',
  aerialPhoto: 'aerialPhotoUrl',
  adminBoundary: 'administrativeBoundaryUrl',
  roadNetwork: 'roadNetworkUrl',
  blockedRoutes: 'blockedRoutes',
  disasterZone: 'disasterApproximateZone',
  rainfall: 'rainfallDistributionUrl',
  floodPotential: 'floodPotentialZoneUrl',
  riverBasin: 'riverBasinBoundaryUrl',
  riverLevel: 'riverWaterLevel',
  debrisFlow: 'debrisFlowPotentialZoneUrl',
  dem: 'demUrl',
  slope: 'slopeMapUrl',
  windSpeed: 'windSpeed',
  gasStation: 'gasStationLocations',
  chemicalStorage: 'chemicalStorageLocations',
  industrialZone: 'industrialZones',
  unitStandby: 'unitStandbyLocations',
  ambulance: 'ambulanceLocations',
  medicalStation: 'medicalStationLocations',
  supplyPoint: 'supplyDistributionPoints',
  heavyEquipment: 'heavyEquipmentLocations',
  publicFacility: 'publicFacilityStatus',
  utilityOutage: 'utilityOutageZones',
  cleanupStatus: 'cleanupStatus',
  shelter: 'shelters',
  evacuationPoint: 'evacuationPoints',
  toilet: 'toiletLocations',
  elderly: 'elderlyLocations',
  disability: 'disabilityLocations',
  infant: 'infantLocations',
  buildingRisk: 'isLegacyRiskBuilding',
  buildingFloorPlan: 'buildingFloorPlanUrl',
  hospitalPatient: 'hospitalPatientCount',
  infectedTrail: 'infectedPersonTrails',
};
