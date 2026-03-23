"use client";

import { useEffect, useState, useCallback, useMemo } from "react";
import { useMap, Marker } from "react-leaflet";
import useSupercluster from "use-supercluster";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import L from "leaflet";

const TYPE_EMOJI: Record<string, string> = {
  fire: "🔥", rescue: "🚨", danger: "🚧", people: "👥",
  inspection: "⛑️", medical: "🚑", supply: "📦", cleanup: "🪏",
  heavy: "🚜", utility: "🔧", support: "💪", transport: "🛵"
};

export function MarkerLayer() {
  const map = useMap();
  const { tasks, setSelectedTaskId, selectedTaskId, getFilteredTasks, searchQuery, filters } = useTaskStore();
  const { currentUserRole, setSelectedMapLocation } = useUIStore();

  const [bounds, setBounds] = useState<[number, number, number, number] | undefined>(undefined);
  const [zoom, setZoom] = useState(13);

  const updateMapState = useCallback(() => {
    const b = map.getBounds();
    setBounds([
      b.getSouthWest().lng,
      b.getSouthWest().lat,
      b.getNorthEast().lng,
      b.getNorthEast().lat
    ]);
    setZoom(map.getZoom());
  }, [map]);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    updateMapState();
    map.on("moveend", updateMapState);
    return () => { map.off("moveend", updateMapState); };
  }, [map, updateMapState]);

  const filteredTasks = useMemo(
    () => getFilteredTasks(currentUserRole),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, filters, currentUserRole, tasks]
  );

  const points = useMemo(() => {
    return filteredTasks.map(task => ({
      type: "Feature" as const,
      properties: { cluster: false, taskId: task.id, type: task.type },
      geometry: { type: "Point" as const, coordinates: [task.lng, task.lat] }
    }));
  }, [filteredTasks]);

  const { clusters, supercluster } = useSupercluster({
    points,
    bounds,
    zoom,
    options: { radius: 75, maxZoom: 20 }
  });

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const createClusterIcon = (cluster: any) => {
    const count = cluster.properties.point_count;
    let size = "w-10 h-10 text-sm";
    if (count > 10) size = "w-12 h-12 text-base";
    if (count > 50) size = "w-14 h-14 text-lg";

    const html = `<div class="flex items-center justify-center ${size} rounded-full bg-white dark:bg-slate-900 text-slate-900 dark:text-white font-bold border-[1px] border-slate-200 dark:border-slate-800 shadow-xl backdrop-blur-md transition-transform hover:scale-105">
      ${count}
    </div>`;

    return L.divIcon({ html, className: "custom-cluster-icon bg-transparent border-0", iconSize: L.point(40, 40), iconAnchor: [20, 20] });
  };

  const createCustomIcon = (type: string, isSelected: boolean) => {
    const emoji = TYPE_EMOJI[type] || "📍";

    if (isSelected) {
      const size = 56;
      const html = `
        <div class="selected-pin-ring" style="width:${size}px;height:${size}px;">
          <div class="flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-slate-800 text-2xl shadow-2xl z-10">
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

    const size = 40;
    const html = `<div class="flex items-center justify-center w-full h-full rounded-full bg-white dark:bg-slate-800 shadow-xl border border-slate-200 dark:border-slate-700 text-xl transition-all duration-300">
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
    if (selectedTaskId) {
      const task = tasks.find(t => t.id === selectedTaskId);
      if (task) {
        map.setView([task.lat, task.lng], map.getZoom(), { animate: true });
      }
    }
  }, [selectedTaskId, tasks, map]);

  return (
    <>
      {clusters.map((cluster) => {
        const [longitude, latitude] = cluster.geometry.coordinates;
        const { cluster: isCluster, taskId, type } = cluster.properties;

        if (isCluster) {
          return (
            <Marker
              key={`cluster-${cluster.id}`}
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
            key={`task-${taskId}`}
            position={[latitude, longitude]}
            icon={createCustomIcon(type, selectedTaskId === taskId)}
            zIndexOffset={selectedTaskId === taskId ? 1000 : 0}
            eventHandlers={{
              click: () => {
                setSelectedMapLocation(null);
                setSelectedTaskId(taskId);
              }
            }}
          />
        );
      })}
    </>
  );
}
