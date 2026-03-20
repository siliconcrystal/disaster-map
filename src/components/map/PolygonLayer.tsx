"use client";

import { Polygon, Tooltip } from "react-leaflet";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { useMemo } from "react";
import L from "leaflet";

export function PolygonLayer() {
  const { zones, setSelectedZoneId, setSelectedTaskId } = useTaskStore();
  const { activeMapLayers } = useUIStore();

  const visibleZones = useMemo(() => {
    return zones.filter((zone) => {
      if (zone.type === 'evacuation' && !activeMapLayers.safeZone) return false;
      if (zone.type === 'ngo' && !activeMapLayers.ngoZone) return false;
      if (zone.type === 'restricted' && !activeMapLayers.restrictedZone) return false;
      return true;
    });
  }, [zones, activeMapLayers]);

  return (
    <>
      {visibleZones.map((zone) => (
        <Polygon
          key={zone.id}
          positions={zone.coordinates}
          eventHandlers={{
            click: (e) => {
              L.DomEvent.stopPropagation(e);
              setSelectedTaskId(null); // Clear task selection when clicking zone
              setSelectedZoneId(zone.id);
            }
          }}
          pathOptions={{
            color: zone.color || (zone.type === 'evacuation' ? '#22c55e' : zone.type === 'ngo' ? '#3b82f6' : '#ef4444'),
            fillColor: zone.color || (zone.type === 'evacuation' ? '#22c55e' : zone.type === 'ngo' ? '#3b82f6' : '#ef4444'),
            fillOpacity: 0.15,
            weight: 2,
            dashArray: '8, 12',
            lineJoin: 'round',
          }}
        >
          <Tooltip permanent direction="center" className="zone-label-tooltip !bg-transparent !border-none !shadow-none p-0">
            <div className="flex flex-col items-center">
              <span className="text-[14px] font-black drop-shadow-[0_1px_2px_rgba(255,255,255,0.8)] dark:drop-shadow-[0_1px_2px_rgba(0,0,0,0.4)] tracking-wide pointer-events-none"
                style={{ color: zone.color }}
              >
                {zone.name}
              </span>
            </div>
          </Tooltip>
        </Polygon>
      ))}
    </>
  );
}
