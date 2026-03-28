'use client';

/**
 * ResourceMarkerLayer
 *
 * 根據災害類型和角色權限，顯示災害相關資源點位：
 * - 收容所、醫療站、物資發放點
 * - 救護車、重型機具、待命單位
 * - 加油站、化學品倉儲等危險點位
 * - 弱勢族群點位（高齡、身障、幼兒）
 */

import type { MapLayerKey } from '@/config/disasterMapLayers';
import { useDisasterLayers } from '@/hooks/useDisasterLayers';
import { useTaskStore } from '@/store/useTaskStore';
import L from 'leaflet';
import { useMemo } from 'react';
import { Marker, Tooltip } from 'react-leaflet';

// ─────────────────────────────────────────────
// 圖層對應的 Emoji 和顏色
// ─────────────────────────────────────────────
const LAYER_MARKER_CONFIG: Record<MapLayerKey, { emoji: string; bgColor: string; label: string }> =
  {
    satellite: { emoji: '🛰️', bgColor: 'bg-gray-600', label: '衛星' },
    aerialPhoto: { emoji: '📷', bgColor: 'bg-gray-500', label: '空拍' },
    adminBoundary: { emoji: '🗺️', bgColor: 'bg-gray-400', label: '行政區' },
    roadNetwork: { emoji: '🛣️', bgColor: 'bg-gray-500', label: '道路' },
    blockedRoutes: { emoji: '🚧', bgColor: 'bg-orange-500', label: '道路封閉' },
    disasterZone: { emoji: '⚠️', bgColor: 'bg-red-500', label: '災區' },
    rainfall: { emoji: '🌧️', bgColor: 'bg-blue-400', label: '雨量' },
    floodPotential: { emoji: '💧', bgColor: 'bg-blue-500', label: '淹水潛勢' },
    riverBasin: { emoji: '🏞️', bgColor: 'bg-cyan-500', label: '河川' },
    riverLevel: { emoji: '📊', bgColor: 'bg-cyan-600', label: '水位' },
    debrisFlow: { emoji: '⛰️', bgColor: 'bg-amber-600', label: '土石流' },
    dem: { emoji: '📈', bgColor: 'bg-green-600', label: 'DEM' },
    slope: { emoji: '📉', bgColor: 'bg-green-500', label: '坡度' },
    windSpeed: { emoji: '💨', bgColor: 'bg-sky-400', label: '風速' },
    gasStation: { emoji: '⛽', bgColor: 'bg-red-600', label: '加油站' },
    chemicalStorage: { emoji: '☣️', bgColor: 'bg-yellow-500', label: '化學品' },
    industrialZone: { emoji: '🏭', bgColor: 'bg-slate-500', label: '工業區' },
    unitStandby: { emoji: '🚒', bgColor: 'bg-red-500', label: '待命單位' },
    ambulance: { emoji: '🚑', bgColor: 'bg-red-400', label: '救護車' },
    medicalStation: { emoji: '🏥', bgColor: 'bg-pink-500', label: '醫療站' },
    supplyPoint: { emoji: '📦', bgColor: 'bg-amber-500', label: '物資站' },
    heavyEquipment: { emoji: '🚜', bgColor: 'bg-yellow-600', label: '重機' },
    publicFacility: { emoji: '🏛️', bgColor: 'bg-indigo-500', label: '公設' },
    utilityOutage: { emoji: '💡', bgColor: 'bg-gray-600', label: '停電區' },
    cleanupStatus: { emoji: '🧹', bgColor: 'bg-green-400', label: '清理' },
    shelter: { emoji: '🏕️', bgColor: 'bg-teal-500', label: '收容所' },
    evacuationPoint: { emoji: '🚶', bgColor: 'bg-emerald-500', label: '避難點' },
    toilet: { emoji: '🚻', bgColor: 'bg-blue-300', label: '廁所' },
    elderly: { emoji: '👴', bgColor: 'bg-purple-500', label: '高齡' },
    disability: { emoji: '♿', bgColor: 'bg-purple-400', label: '身障' },
    infant: { emoji: '👶', bgColor: 'bg-pink-400', label: '幼兒' },
    buildingRisk: { emoji: '🏚️', bgColor: 'bg-red-700', label: '危老建築' },
    buildingFloorPlan: { emoji: '📐', bgColor: 'bg-slate-400', label: '平面圖' },
    hospitalPatient: { emoji: '🏨', bgColor: 'bg-rose-500', label: '醫院' },
    infectedTrail: { emoji: '👣', bgColor: 'bg-orange-400', label: '足跡' },
  };

// ─────────────────────────────────────────────
// 建立自訂 Marker Icon
// ─────────────────────────────────────────────
function createResourceIcon(layerKey: MapLayerKey, size: number = 32) {
  const config = LAYER_MARKER_CONFIG[layerKey];
  const html = `
    <div class="flex items-center justify-center w-full h-full rounded-full ${config.bgColor} shadow-lg border-2 border-white dark:border-slate-700 text-base">
      ${config.emoji}
    </div>
  `;
  return L.divIcon({
    html,
    className: 'resource-marker-icon bg-transparent border-0',
    iconSize: L.point(size, size),
    iconAnchor: [size / 2, size / 2],
  });
}

// ─────────────────────────────────────────────
// 資源點位介面
// ─────────────────────────────────────────────
interface ResourcePoint {
  id: string;
  layerKey: MapLayerKey;
  lat: number;
  lng: number;
  label: string;
  details?: string;
}

export function ResourceMarkerLayer() {
  const { disasterData } = useTaskStore();
  const { enabledLayers, isLayerEnabled } = useDisasterLayers();

  // 將災害資料轉換為資源點位
  const resourcePoints = useMemo((): ResourcePoint[] => {
    if (!disasterData) return [];

    const points: ResourcePoint[] = [];
    let idCounter = 0;

    // Helper function
    const addPoints = (
      layerKey: MapLayerKey,
      data:
        | Array<{
            lat: number;
            lng: number;
            name?: string;
            unit?: string;
            id?: string;
            type?: string;
            count?: number;
            status?: string;
          }>
        | undefined,
    ) => {
      if (!data || !isLayerEnabled(layerKey)) return;
      const config = LAYER_MARKER_CONFIG[layerKey];
      for (const item of data) {
        points.push({
          id: `resource-${idCounter++}`,
          layerKey,
          lat: item.lat,
          lng: item.lng,
          label: item.name || item.unit || item.id || config.label,
          details: item.type || item.status || (item.count ? `${item.count} 人` : undefined),
        });
      }
    };

    // 收容所
    addPoints('shelter', disasterData.shelters);
    // 避難點
    addPoints('evacuationPoint', disasterData.evacuationPoints);
    // 醫療站
    addPoints('medicalStation', disasterData.medicalStationLocations);
    // 物資發放點
    addPoints('supplyPoint', disasterData.supplyDistributionPoints);
    // 待命單位
    addPoints('unitStandby', disasterData.unitStandbyLocations);
    // 救護車
    addPoints('ambulance', disasterData.ambulanceLocations);
    // 重型機具
    addPoints('heavyEquipment', disasterData.heavyEquipmentLocations);
    // 加油站
    addPoints('gasStation', disasterData.gasStationLocations);
    // 化學品倉儲
    addPoints('chemicalStorage', disasterData.chemicalStorageLocations);
    // 工業區
    addPoints('industrialZone', disasterData.industrialZones);
    // 高齡點位
    addPoints('elderly', disasterData.elderlyLocations);
    // 身障點位
    addPoints('disability', disasterData.disabilityLocations);
    // 幼兒點位
    addPoints('infant', disasterData.infantLocations);
    // 廁所
    addPoints('toilet', disasterData.toiletLocations);
    // 公共設施
    if (disasterData.publicFacilityStatus && isLayerEnabled('publicFacility')) {
      for (const item of disasterData.publicFacilityStatus) {
        points.push({
          id: `resource-${idCounter++}`,
          layerKey: 'publicFacility',
          lat: item.lat,
          lng: item.lng,
          label: item.name,
          details: item.status === 'normal' ? '正常' : item.status === 'damaged' ? '受損' : '損毀',
        });
      }
    }

    return points;
  }, [disasterData, enabledLayers, isLayerEnabled]);

  if (resourcePoints.length === 0) return null;

  return (
    <>
      {resourcePoints.map((point) => {
        const config = LAYER_MARKER_CONFIG[point.layerKey];
        return (
          <Marker
            key={point.id}
            position={[point.lat, point.lng]}
            icon={createResourceIcon(point.layerKey)}
          >
            <Tooltip direction="top" offset={[0, -16]}>
              <div className="text-sm">
                <div className="font-semibold flex items-center gap-1">
                  <span>{config.emoji}</span>
                  <span>{point.label}</span>
                </div>
                {point.details && (
                  <div className="text-xs text-slate-500 dark:text-slate-400">{point.details}</div>
                )}
              </div>
            </Tooltip>
          </Marker>
        );
      })}
    </>
  );
}
