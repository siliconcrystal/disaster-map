/**
 * 灾害数据源 Interface
 * 来源：Notion / Data Source In Disasters
 * Category 分类注解：
 *   Static     → 点位静态资料（建筑属性、弱势族群位置等）
 *   Base Layer → 地图图层（道路、水文、地形、气象等）
 *   Operational → 行政/运营动态资料（出勤、物资、医疗等）
 */

export type DisasterType = 'earthquake' | 'fire' | 'storm' | 'flood' | 'pandemic' | 'war';

// ─────────────────────────────────────────────
// 重要度（Notion 中每种灾害对应的优先级）
// ─────────────────────────────────────────────
export type DataImportance = 'Critical' | 'High' | 'Medium' | 'Low' | null;

// ─────────────────────────────────────────────
// ① Static 静态点位资料
//    → 与建物、弱势族群位置相关的预存数据
// ─────────────────────────────────────────────
export interface StaticBuildingInfo {
  /** 是否列管危老（倒塌风险）EQ: Critical */
  isLegacyRiskBuilding?: boolean;

  /** 樓層數（搜救判断）EQ: Critical */
  floorCount?: number;

  /** 建築用途（建筑风险判断）EQ: Critical */
  buildingUsage?: string;

  /** 鋼筋類型（结构强度）EQ: Medium */
  rebarType?: string;

  /** 建築年份（耐震推估）EQ: High */
  buildYear?: number;

  /** 建築內部圖 URL（搜救路线）EQ: Critical */
  buildingFloorPlanUrl?: string;
}

export interface StaticVulnerableGroupInfo {
  /** 高齡點位（弱势族群）EQ: Critical / Flood: High / Pandemic: Critical */
  elderlyLocations?: { lat: number; lng: number; count?: number }[];

  /** 身心障礙點位（弱势族群）EQ: Critical / Flood: High / Pandemic: Critical */
  disabilityLocations?: { lat: number; lng: number; count?: number }[];

  /** 幼兒位置（弱势族群）EQ: Critical / Flood: High / Pandemic: High */
  infantLocations?: { lat: number; lng: number; count?: number }[];
}

export interface StaticDisasterBaseInfo {
  /** 災害種類（全灾害: Critical）*/
  disasterType?: DisasterType[];
}

// ─────────────────────────────────────────────
// ② Base Layer 地图图层资料
//    → 覆盖在地图上的区域/路径/气象图层
// ─────────────────────────────────────────────
export interface BaseLayerTrafficInfo {
  /** 道路網（全灾害: Critical）*/
  roadNetworkUrl?: string;

  /** 交通阻斷路徑（封路）全灾害: Critical */
  blockedRoutes?: { from: [number, number]; to: [number, number]; reason?: string }[];

  /** 重型機具範圍/路線（清理）EQ: Critical / Flood: High */
  heavyEquipmentRouteUrl?: string;
}

export interface BaseLayerGeographyInfo {
  /** 行政區界（所有灾害: High）*/
  administrativeBoundaryUrl?: string;

  /** 衛星圖 URL（全灾害: Medium）*/
  satelliteImageUrl?: string;

  /** 即時空拍圖 URL（EQ: High / Flood: High）*/
  aerialPhotoUrl?: string;

  /** 災害模糊範圍（全灾害: Critical）*/
  disasterApproximateZone?: GeoZone;
}

export interface BaseLayerHydrologyInfo {
  /** 雨量分布（Flood: Critical）*/
  rainfallDistributionUrl?: string;

  /** 淹水潛勢區（Flood: Critical）*/
  floodPotentialZoneUrl?: string;

  /** 河川流域邊界（Flood: Critical）*/
  riverBasinBoundaryUrl?: string;

  /** 河川水位（Flood: Critical，单位: cm）*/
  riverWaterLevel?: number;

  /** 土石流潛勢區（Flood: Critical）*/
  debrisFlowPotentialZoneUrl?: string;

  /** DEM 高程模型 URL（Flood: High）*/
  demUrl?: string;

  /** 坡度圖 URL（Flood: High）*/
  slopeMapUrl?: string;
}

export interface BaseLayerWeatherInfo {
  /** 風力（Storm: Medium）*/
  windSpeed?: number; // m/s
}

export interface BaseLayerHazardInfo {
  /** 加油站位置（次生灾害）EQ: High / Flood: Medium */
  gasStationLocations?: { lat: number; lng: number; name?: string }[];

  /** 化學品倉儲（危险物）EQ: Medium / War: High */
  chemicalStorageLocations?: { lat: number; lng: number; type?: string }[];

  /** 工業區（化学风险）EQ: Medium / War: High */
  industrialZones?: { lat: number; lng: number; name?: string }[];
}

// ─────────────────────────────────────────────
// ③ Operational 行政/运营动态资料
// ─────────────────────────────────────────────
export interface OperationalResourceInfo {
  /** 出勤單位待命位置（全灾害: High）*/
  unitStandbyLocations?: { unit: string; lat: number; lng: number }[];

  /** 在地救護車動向（全灾害: High）*/
  ambulanceLocations?: { id: string; lat: number; lng: number; status?: string }[];

  /** 醫療站點（EQ: Critical / Flood: Critical）*/
  medicalStationLocations?: { lat: number; lng: number; name?: string; capacity?: number }[];

  /** 物資發放點（全灾害: Critical）*/
  supplyDistributionPoints?: { lat: number; lng: number; name?: string; items?: string[] }[];

  /** 重型機具位置（EQ/Flood: 相关）*/
  heavyEquipmentLocations?: { id: string; lat: number; lng: number; type?: string }[];
}

export interface OperationalInfrastructureInfo {
  /** 公共設施狀態（全灾害: High）*/
  publicFacilityStatus?: {
    name: string;
    lat: number;
    lng: number;
    status: 'normal' | 'damaged' | 'destroyed';
  }[];

  /** 停水停電區域（全灾害: High）*/
  utilityOutageZones?: { type: 'water' | 'power' | 'both'; zone: GeoZone }[];

  /** 路燈編號（全灾害: High）*/
  streetLightIds?: string[];
}

export interface OperationalCasualtyInfo {
  /** 人員傷亡（全灾害: Critical）*/
  casualties?: {
    dead?: number;
    injured?: number;
    missing?: number;
    trapped?: number;
  };
}

export interface OperationalRecoveryInfo {
  /** 清潔動態（EQ: Medium / Flood: High）*/
  cleanupStatus?: { zone: GeoZone; progress: 'pending' | 'in_progress' | 'done'; note?: string }[];
}

// ─────────────────────────────────────────────
// ④ 未分类 / 共用资料
// ─────────────────────────────────────────────
export interface PublicFacilitiesInfo {
  /** 收容所（EQ: High / Flood: High）*/
  shelters?: {
    lat: number;
    lng: number;
    name?: string;
    capacity?: number;
    currentOccupancy?: number;
  }[];

  /** 避難點（EQ: Medium / Flood: Medium）*/
  evacuationPoints?: { lat: number; lng: number; name?: string }[];

  /** 廁所點（EQ: Medium / Flood: Medium）*/
  toiletLocations?: { lat: number; lng: number }[];
}

export interface PandemicSpecificInfo {
  /** 院所病患人數（Pandemic 专用）*/
  hospitalPatientCount?: { hospitalName: string; count: number }[];

  /** 染疫者足跡（Pandemic 专用）*/
  infectedPersonTrails?: {
    trailId: string;
    locations: { lat: number; lng: number; timestamp: number }[];
  }[];
}

// ─────────────────────────────────────────────
// 🗺️ 通用几何类型
// ─────────────────────────────────────────────
export interface GeoZone {
  type: 'polygon' | 'circle' | 'bbox';
  coordinates?: [number, number][]; // polygon
  center?: [number, number]; // circle
  radius?: number; // circle, 单位 meters
  bbox?: [number, number, number, number]; // [minLng, minLat, maxLng, maxLat]
}

// ─────────────────────────────────────────────
// ✅ 最终汇总 Interface
//    所有 37 笔 Notion 资料的完整 union
// ─────────────────────────────────────────────
export interface DisasterDataSource
  extends
    StaticBuildingInfo,
    StaticVulnerableGroupInfo,
    StaticDisasterBaseInfo,
    BaseLayerTrafficInfo,
    BaseLayerGeographyInfo,
    BaseLayerHydrologyInfo,
    BaseLayerWeatherInfo,
    BaseLayerHazardInfo,
    OperationalResourceInfo,
    OperationalInfrastructureInfo,
    OperationalCasualtyInfo,
    OperationalRecoveryInfo,
    PublicFacilitiesInfo,
    PandemicSpecificInfo {}
