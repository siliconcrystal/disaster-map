/**
 * 災害地圖 - Role × 災害類型 → 可見數據字段映射
 *
 * 來源：Notion / Role View in Disasters
 *
 * 結構：
 *   ROLE_DISASTER_VISIBILITY[roleName][disasterType] = Array<keyof DisasterDataSource>
 *
 * 並集：
 *   DISASTER_REQUIRED_FIELDS[disasterType] = 所有角色字段的並集
 *   （即該災害類型下系統需要儲存/展示的完整字段集合）
 */

import type { DisasterDataSource, DisasterType } from '@/types/disasterData';

// ─────────────────────────────────────────────
// 角色名稱 type（與 UserDropdown.tsx 的 ROLES 對齊）
// ─────────────────────────────────────────────
export type RoleName =
  | '指揮所、軍方、縣市政府'
  | '縣政府行政部門'
  | '救難隊'
  | '醫療團隊'
  | '在地組織'
  | '線上志工'
  | '現場志工'
  | '災民（含家屬）';

export type DataSourceKey = keyof DisasterDataSource;

// ─────────────────────────────────────────────
// 每個角色 × 災害類型 → 可見字段
// 來源：Notion Role View 中各角色的 Mission / Notes
//       與 Data Source 的重要度（Critical/High 優先）
// ─────────────────────────────────────────────
export const ROLE_DISASTER_VISIBILITY: Record<
  RoleName,
  Partial<Record<DisasterType, DataSourceKey[]>>
> = {
  // ── 指揮決策：全局資源調度與決策
  '指揮所、軍方、縣市政府': {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'heavyEquipmentLocations',
      'heavyEquipmentRouteUrl',
      'blockedRoutes',
      'roadNetworkUrl',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'utilityOutageZones',
      'aerialPhotoUrl',
      'supplyDistributionPoints',
      'medicalStationLocations',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'utilityOutageZones',
      'gasStationLocations',
      'chemicalStorageLocations',
      'industrialZones',
      'medicalStationLocations',
      'ambulanceLocations',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'utilityOutageZones',
      'windSpeed',
      'heavyEquipmentLocations',
      'supplyDistributionPoints',
      'medicalStationLocations',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'floodPotentialZoneUrl',
      'rainfallDistributionUrl',
      'riverWaterLevel',
      'riverBasinBoundaryUrl',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'utilityOutageZones',
      'supplyDistributionPoints',
      'medicalStationLocations',
      'heavyEquipmentLocations',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'supplyDistributionPoints',
      'medicalStationLocations',
      'hospitalPatientCount',
      'utilityOutageZones',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'administrativeBoundaryUrl',
      'publicFacilityStatus',
      'supplyDistributionPoints',
      'medicalStationLocations',
      'chemicalStorageLocations',
      'industrialZones',
    ],
  },

  // ── 行政：管轄、物資協調、輪班
  縣政府行政部門: {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'publicFacilityStatus',
      'utilityOutageZones',
      'blockedRoutes',
      'administrativeBoundaryUrl',
      'medicalStationLocations',
      'elderlyLocations',
      'disabilityLocations',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'publicFacilityStatus',
      'utilityOutageZones',
      'blockedRoutes',
      'administrativeBoundaryUrl',
      'medicalStationLocations',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'publicFacilityStatus',
      'utilityOutageZones',
      'blockedRoutes',
      'administrativeBoundaryUrl',
      'windSpeed',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'publicFacilityStatus',
      'utilityOutageZones',
      'blockedRoutes',
      'administrativeBoundaryUrl',
      'floodPotentialZoneUrl',
      'rainfallDistributionUrl',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
      'hospitalPatientCount',
      'medicalStationLocations',
      'elderlyLocations',
      'disabilityLocations',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'publicFacilityStatus',
      'blockedRoutes',
      'administrativeBoundaryUrl',
    ],
  },

  // ── 專業救援：搜救、消防、高密度圖資
  救難隊: {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'isLegacyRiskBuilding',
      'floorCount',
      'buildingUsage',
      'buildYear',
      'buildingFloorPlanUrl',
      'rebarType',
      'heavyEquipmentRouteUrl',
      'heavyEquipmentLocations',
      'aerialPhotoUrl',
      'roadNetworkUrl',
      'blockedRoutes',
      'gasStationLocations',
      'chemicalStorageLocations',
      'unitStandbyLocations',
      'medicalStationLocations',
      'ambulanceLocations',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'roadNetworkUrl',
      'blockedRoutes',
      'gasStationLocations',
      'chemicalStorageLocations',
      'industrialZones',
      'unitStandbyLocations',
      'medicalStationLocations',
      'ambulanceLocations',
      'aerialPhotoUrl',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'roadNetworkUrl',
      'blockedRoutes',
      'windSpeed',
      'heavyEquipmentRouteUrl',
      'heavyEquipmentLocations',
      'unitStandbyLocations',
      'medicalStationLocations',
      'ambulanceLocations',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'roadNetworkUrl',
      'blockedRoutes',
      'floodPotentialZoneUrl',
      'debrisFlowPotentialZoneUrl',
      'riverWaterLevel',
      'demUrl',
      'slopeMapUrl',
      'heavyEquipmentRouteUrl',
      'heavyEquipmentLocations',
      'unitStandbyLocations',
      'medicalStationLocations',
      'ambulanceLocations',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'hospitalPatientCount',
      'roadNetworkUrl',
      'blockedRoutes',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'roadNetworkUrl',
      'blockedRoutes',
      'chemicalStorageLocations',
      'industrialZones',
      'unitStandbyLocations',
      'medicalStationLocations',
      'ambulanceLocations',
    ],
  },

  // ── 醫療：檢傷與後送
  醫療團隊: {
    earthquake: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'roadNetworkUrl',
      'blockedRoutes',
      'shelters',
    ],
    fire: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'roadNetworkUrl',
      'blockedRoutes',
    ],
    storm: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'roadNetworkUrl',
      'blockedRoutes',
      'shelters',
    ],
    flood: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'roadNetworkUrl',
      'blockedRoutes',
      'shelters',
    ],
    pandemic: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'hospitalPatientCount',
      'infectedPersonTrails',
      'roadNetworkUrl',
      'elderlyLocations',
      'disabilityLocations',
    ],
    war: [
      'disasterType',
      'casualties',
      'ambulanceLocations',
      'medicalStationLocations',
      'roadNetworkUrl',
      'blockedRoutes',
    ],
  },

  // ── 在地協力：里長/在地NGO，最了解在地狀況
  在地組織: {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'elderlyLocations',
      'disabilityLocations',
      'infantLocations',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
      'aerialPhotoUrl',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'elderlyLocations',
      'disabilityLocations',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'elderlyLocations',
      'disabilityLocations',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
      'windSpeed',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'unitStandbyLocations',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'elderlyLocations',
      'disabilityLocations',
      'floodPotentialZoneUrl',
      'riverWaterLevel',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
      'cleanupStatus',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'supplyDistributionPoints',
      'shelters',
      'elderlyLocations',
      'disabilityLocations',
      'infantLocations',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
      'hospitalPatientCount',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'medicalStationLocations',
      'blockedRoutes',
      'roadNetworkUrl',
      'supplyDistributionPoints',
      'shelters',
      'publicFacilityStatus',
      'administrativeBoundaryUrl',
    ],
  },

  // ── 資訊支援：線上整合、散播正確資訊
  線上志工: {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'satelliteImageUrl',
      'utilityOutageZones',
      'blockedRoutes',
      'publicFacilityStatus',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'satelliteImageUrl',
      'blockedRoutes',
      'publicFacilityStatus',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'satelliteImageUrl',
      'windSpeed',
      'blockedRoutes',
      'utilityOutageZones',
      'publicFacilityStatus',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'aerialPhotoUrl',
      'satelliteImageUrl',
      'rainfallDistributionUrl',
      'floodPotentialZoneUrl',
      'riverWaterLevel',
      'blockedRoutes',
      'utilityOutageZones',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'hospitalPatientCount',
      'infectedPersonTrails',
      'publicFacilityStatus',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'casualties',
      'satelliteImageUrl',
      'blockedRoutes',
      'publicFacilityStatus',
    ],
  },

  // ── 民間支援：接案、現場協助
  現場志工: {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'toiletLocations',
      'cleanupStatus',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'cleanupStatus',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'toiletLocations',
      'cleanupStatus',
    ],
    pandemic: ['disasterType', 'disasterApproximateZone', 'supplyDistributionPoints', 'shelters'],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
    ],
  },

  // ── 受災方：自救、避難、尋求資源
  '災民（含家屬）': {
    earthquake: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'medicalStationLocations',
      'publicFacilityStatus',
      'utilityOutageZones',
      'aerialPhotoUrl',
    ],
    fire: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'medicalStationLocations',
    ],
    storm: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'medicalStationLocations',
      'publicFacilityStatus',
      'utilityOutageZones',
    ],
    flood: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'medicalStationLocations',
      'floodPotentialZoneUrl',
      'rainfallDistributionUrl',
      'riverWaterLevel',
      'utilityOutageZones',
    ],
    pandemic: [
      'disasterType',
      'disasterApproximateZone',
      'supplyDistributionPoints',
      'shelters',
      'medicalStationLocations',
      'infectedPersonTrails',
    ],
    war: [
      'disasterType',
      'disasterApproximateZone',
      'roadNetworkUrl',
      'blockedRoutes',
      'supplyDistributionPoints',
      'shelters',
      'evacuationPoints',
      'medicalStationLocations',
    ],
  },
};

// ─────────────────────────────────────────────
// 各災害類型的並集（union across all roles）
// → 即該災害下系統需要收集/儲存的完整字段集合
// ─────────────────────────────────────────────
function buildDisasterUnion(disasterType: DisasterType): DataSourceKey[] {
  const allKeys = new Set<DataSourceKey>();
  for (const roleFields of Object.values(ROLE_DISASTER_VISIBILITY)) {
    const fields = roleFields[disasterType] ?? [];
    for (const key of fields) {
      allKeys.add(key);
    }
  }
  return Array.from(allKeys);
}

export const DISASTER_REQUIRED_FIELDS: Record<DisasterType, DataSourceKey[]> = {
  earthquake: buildDisasterUnion('earthquake'),
  fire: buildDisasterUnion('fire'),
  storm: buildDisasterUnion('storm'),
  flood: buildDisasterUnion('flood'),
  pandemic: buildDisasterUnion('pandemic'),
  war: buildDisasterUnion('war'),
};

// ─────────────────────────────────────────────
// Helper：取得特定角色在特定災害下的可見字段
// ─────────────────────────────────────────────
export function getVisibleFields(role: RoleName, disasterType: DisasterType): DataSourceKey[] {
  return ROLE_DISASTER_VISIBILITY[role]?.[disasterType] ?? [];
}

// ─────────────────────────────────────────────
// Helper：過濾 DisasterDataSource，僅保留角色可見字段
// ─────────────────────────────────────────────
export function filterDataByRole<T extends Partial<DisasterDataSource>>(
  data: T,
  role: RoleName,
  disasterType: DisasterType,
): Partial<T> {
  const visibleKeys = new Set(getVisibleFields(role, disasterType));
  return Object.fromEntries(
    Object.entries(data).filter(([key]) => visibleKeys.has(key as DataSourceKey)),
  ) as Partial<T>;
}
