"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useMap, Marker } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { useStationStore } from "@/store/useStationStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import L from "leaflet";

const TYPE_EMOJI: Record<string, string> = {
  shower: "🚿", restroom: "🚻", medical: "🏥", supply: "📦",
  shelter: "🏠", accommodation: "🏨", water: "💧", repair: "🔧"
};

export function StationMarkerLayer() {
  const map = useMap();
  const { stations, selectedStationId, setSelectedStationId, getFilteredStations, stationFilters } = useStationStore();
  const { setSelectedTaskId } = useTaskStore();
  const { activeMapLayers } = useUIStore();

  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState(13);

  const updateMapState = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng, b.getSouthWest().lat,
      b.getNorthEast().lng, b.getNorthEast().lat
    ]);
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateMapState();
    map.on("moveend", updateMapState);
    return () => { map.off("moveend", updateMapState); };
  }, [map, updateMapState]);

  const filteredStations = useMemo(
    () => getFilteredStations(),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [stations, stationFilters]
  );

  const points = useMemo(() => {
    return filteredStations.map(station => ({
      type: "Feature" as const,
      properties: { cluster: false, stationId: station.id, type: station.type },
      geometry: { type: "Point" as const, coordinates: [station.lng, station.lat] }
    }));
  }, [filteredStations]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createClusterIcon = (cluster: any) => {
    const count = cluster.properties.point_count;
    let size = "w-9 h-9 text-xs";
    if (count > 10) size = "w-11 h-11 text-sm";
    if (count > 50) size = "w-13 h-13 text-base";

    const html = `<div class="flex items-center justify-center ${size} rounded-xl bg-amber-50 dark:bg-amber-950 text-amber-800 dark:text-amber-200 font-bold border border-amber-200 dark:border-amber-800 shadow-lg backdrop-blur-md transition-transform hover:scale-105">
      ${count}
    </div>`;

    return L.divIcon({ html, className: "custom-cluster-icon bg-transparent border-0", iconSize: L.point(36, 36), iconAnchor: [18, 18] });
  };

  const createStationIcon = (type: string, isSelected: boolean) => {
    const emoji = TYPE_EMOJI[type] || "📍";

    if (isSelected) {
      const size = 48;
      const html = `
        <div class="selected-pin-ring" style="width:${size}px;height:${size}px;">
          <div class="flex items-center justify-center w-full h-full rounded-xl bg-amber-50 dark:bg-amber-900 text-2xl shadow-2xl border-2 border-amber-400 dark:border-amber-500 z-10">
            ${emoji}
          </div>
        </div>`;
      return L.divIcon({
        html,
        className: "custom-marker-icon bg-transparent border-0",
        iconSize: L.point(size, size),
        iconAnchor: [size / 2, size / 2],
      });
    }

    const size = 36;
    const html = `<div class="flex items-center justify-center w-full h-full rounded-xl bg-amber-50 dark:bg-amber-900 shadow-lg border border-amber-200 dark:border-amber-700 text-lg transition-all duration-300">
      ${emoji}
    </div>`;
    return L.divIcon({
      html,
      className: "custom-marker-icon bg-transparent border-0",
      iconSize: L.point(size, size),
      iconAnchor: [size / 2, size / 2],
    });
  };

  useEffect(() => {
    if (selectedStationId) {
      const station = stations.find(s => s.id === selectedStationId);
      if (station) {
        map.setView([station.lat, station.lng], map.getZoom(), { animate: true });
      }
    }
  }, [selectedStationId, stations, map]);

  // Don't render if station layer is off
  if (!activeMapLayers.station) return null;

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, stationId, type } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`station-cluster-${cluster.id}`}
              position={[latitude, longitude]}
              icon={createClusterIcon(cluster)}
              eventHandlers={{
                click: () => {
                  const expansionZoom = Math.min(supercluster.getClusterExpansionZoom(cluster.id), 20);
                  map.setView([latitude, longitude], expansionZoom, { animate: true });
                }
              }}
            />
          );
        }

        return (
          <Marker
            key={`station-${stationId}`}
            position={[latitude, longitude]}
            icon={createStationIcon(type, selectedStationId === stationId)}
            zIndexOffset={selectedStationId === stationId ? 900 : -100}
            eventHandlers={{
              click: () => {
                setSelectedStationId(stationId);
                setSelectedTaskId(null); // mutual exclusion
              }
            }}
          />
        );
      })}
    </>
  );
}
