'use client';

/**
 * DisasterZoneLayer
 *
 * 顯示災害相關的區域圖層：
 * - 災害影響範圍（disasterApproximateZone）
 * - 停水停電區域（utilityOutageZones）
 * - 交通阻斷路線（blockedRoutes）
 */

import { useDisasterLayers } from '@/hooks/useDisasterLayers';
import { useTaskStore } from '@/store/useTaskStore';
import type { GeoZone } from '@/types/disasterData';
import { useMemo } from 'react';
import { Circle, Polygon, Polyline, Tooltip } from 'react-leaflet';

// ─────────────────────────────────────────────
// 區域類型的顏色配置
// ─────────────────────────────────────────────
const ZONE_COLORS = {
  disasterZone: { stroke: '#ef4444', fill: '#ef4444', fillOpacity: 0.15 },
  powerOutage: { stroke: '#6b7280', fill: '#374151', fillOpacity: 0.2 },
  waterOutage: { stroke: '#3b82f6', fill: '#1d4ed8', fillOpacity: 0.2 },
  bothOutage: { stroke: '#8b5cf6', fill: '#6d28d9', fillOpacity: 0.25 },
  blockedRoute: { stroke: '#f97316', weight: 4, dashArray: '10, 6' },
} as const;

// ─────────────────────────────────────────────
// 渲染 GeoZone
// ─────────────────────────────────────────────
function renderGeoZone(
  zone: GeoZone,
  config: { stroke: string; fill: string; fillOpacity: number },
  key: string,
  label?: string,
) {
  if (zone.type === 'circle' && zone.center && zone.radius) {
    return (
      <Circle
        key={key}
        center={[zone.center[0], zone.center[1]]}
        radius={zone.radius}
        pathOptions={{
          color: config.stroke,
          fillColor: config.fill,
          fillOpacity: config.fillOpacity,
          weight: 2,
        }}
      >
        {label && (
          <Tooltip
            direction="center"
            permanent
            className="zone-label-tooltip !bg-transparent !border-none !shadow-none"
          >
            <span
              className="text-xs font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ color: config.stroke }}
            >
              {label}
            </span>
          </Tooltip>
        )}
      </Circle>
    );
  }

  if (zone.type === 'polygon' && zone.coordinates) {
    return (
      <Polygon
        key={key}
        positions={zone.coordinates.map(([lat, lng]) => [lat, lng])}
        pathOptions={{
          color: config.stroke,
          fillColor: config.fill,
          fillOpacity: config.fillOpacity,
          weight: 2,
        }}
      >
        {label && (
          <Tooltip
            direction="center"
            permanent
            className="zone-label-tooltip !bg-transparent !border-none !shadow-none"
          >
            <span
              className="text-xs font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ color: config.stroke }}
            >
              {label}
            </span>
          </Tooltip>
        )}
      </Polygon>
    );
  }

  if (zone.type === 'bbox' && zone.bbox) {
    const [minLng, minLat, maxLng, maxLat] = zone.bbox;
    const positions: [number, number][] = [
      [minLat, minLng],
      [minLat, maxLng],
      [maxLat, maxLng],
      [maxLat, minLng],
    ];
    return (
      <Polygon
        key={key}
        positions={positions}
        pathOptions={{
          color: config.stroke,
          fillColor: config.fill,
          fillOpacity: config.fillOpacity,
          weight: 2,
        }}
      >
        {label && (
          <Tooltip
            direction="center"
            permanent
            className="zone-label-tooltip !bg-transparent !border-none !shadow-none"
          >
            <span
              className="text-xs font-bold drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)]"
              style={{ color: config.stroke }}
            >
              {label}
            </span>
          </Tooltip>
        )}
      </Polygon>
    );
  }

  return null;
}

export function DisasterZoneLayer() {
  const { disasterData } = useTaskStore();
  const { isLayerEnabled } = useDisasterLayers();

  // 災害影響範圍
  const disasterZone = useMemo(() => {
    if (!disasterData?.disasterApproximateZone || !isLayerEnabled('disasterZone')) {
      return null;
    }
    return renderGeoZone(
      disasterData.disasterApproximateZone,
      ZONE_COLORS.disasterZone,
      'disaster-zone',
      '災害影響範圍',
    );
  }, [disasterData?.disasterApproximateZone, isLayerEnabled]);

  // 停水停電區域
  const utilityOutageZones = useMemo(() => {
    if (!disasterData?.utilityOutageZones || !isLayerEnabled('utilityOutage')) {
      return null;
    }
    return disasterData.utilityOutageZones.map((outage, idx) => {
      const config =
        outage.type === 'power'
          ? ZONE_COLORS.powerOutage
          : outage.type === 'water'
            ? ZONE_COLORS.waterOutage
            : ZONE_COLORS.bothOutage;
      const label =
        outage.type === 'power' ? '停電區' : outage.type === 'water' ? '停水區' : '停水停電';
      return renderGeoZone(outage.zone, config, `utility-outage-${idx}`, label);
    });
  }, [disasterData?.utilityOutageZones, isLayerEnabled]);

  // 交通阻斷路線
  const blockedRoutes = useMemo(() => {
    if (!disasterData?.blockedRoutes || !isLayerEnabled('blockedRoutes')) {
      return null;
    }
    return disasterData.blockedRoutes.map((route, idx) => (
      <Polyline
        key={`blocked-route-${idx}`}
        positions={[
          [route.from[0], route.from[1]],
          [route.to[0], route.to[1]],
        ]}
        pathOptions={{
          color: ZONE_COLORS.blockedRoute.stroke,
          weight: ZONE_COLORS.blockedRoute.weight,
          dashArray: ZONE_COLORS.blockedRoute.dashArray,
        }}
      >
        <Tooltip direction="center">
          <div className="text-xs">
            <div className="font-semibold text-orange-600">🚧 道路封閉</div>
            {route.reason && <div className="text-slate-500">{route.reason}</div>}
          </div>
        </Tooltip>
      </Polyline>
    ));
  }, [disasterData?.blockedRoutes, isLayerEnabled]);

  return (
    <>
      {disasterZone}
      {utilityOutageZones}
      {blockedRoutes}
    </>
  );
}
