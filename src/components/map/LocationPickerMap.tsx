'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import { TaskType } from '@/types/task';
import { throttle } from '@/utils';
import L from 'leaflet';
import { MapPin } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const cur = map.getCenter();
    if (Math.abs(cur.lat - center[0]) > 0.0001 || Math.abs(cur.lng - center[1]) > 0.0001) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
  return null;
}

function MapCenterListener({ onChange }: { onChange: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    move: () => onChange([map.getCenter().lat, map.getCenter().lng]),
  });
  return null;
}

const TYPE_EMOJI: Record<string, string> = {
  fire: '🔥',
  rescue: '🚨',
  danger: '🚧',
  people: '👥',
  inspection: '⛑️',
  medical: '🚑',
  supply: '📦',
  cleanup: '🪏',
  heavy: '🚜',
  utility: '🔧',
  support: '💪',
  transport: '🛵',
};
const miniIconCache: Record<string, L.DivIcon> = {};
const getMiniIcon = (type: string) => {
  if (miniIconCache[type]) return miniIconCache[type];
  const emoji = TYPE_EMOJI[type] || '📍';
  const html = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-white/70 dark:bg-slate-800/70 shadow border border-slate-200 dark:border-slate-700 text-[10px] opacity-80 backdrop-blur-sm">${emoji}</div>`;
  const icon = L.divIcon({
    html,
    className: 'custom-marker-icon bg-transparent border-0',
    iconSize: L.point(24, 24),
    iconAnchor: [12, 12],
  });
  miniIconCache[type] = icon;
  return icon;
};

function MiniMapMarkers({ type }: { type: TaskType }) {
  const { tasks } = useTaskStore();
  const map = useMap();
  const [bounds, setBounds] = useState<L.LatLngBounds | null>(null);
  useEffect(() => {
    setBounds(map.getBounds());
    const update = () => setBounds(map.getBounds());
    map.on('moveend', update);
    return () => {
      map.off('moveend', update);
    };
  }, [map]);
  if (!bounds) return null;
  return (
    <>
      {tasks
        .filter((t) => t.type === type)
        .map((t) => {
          if (!bounds.contains([t.lat, t.lng])) return null;
          return (
            <Marker
              key={`mini-${t.id}`}
              position={[t.lat, t.lng]}
              icon={getMiniIcon(t.type)}
              interactive={false}
            />
          );
        })}
    </>
  );
}

// ─── Public API ───────────────────────────────────────────────────────────────

export interface LocationPickerMapProps {
  address: string | null;
  center: [number, number];
  type: TaskType;
  onChange: (coords: [number, number]) => void;
  onAddressResolve: (address: string) => void;
}

export function LocationPickerMap({
  address,
  center,
  type,
  onChange,
  onAddressResolve,
}: LocationPickerMapProps) {
  const { mapType } = useUIStore();
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const [isGeocoding, setIsGeocoding] = useState(false);

  const getTileUrl = () => {
    if (mapType === 'satellite')
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if (mapType === 'streets')
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    return currentTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  };

  const reverseGeocode = async (lat: number, lng: number) => {
    setIsGeocoding(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh-TW`,
        { headers: { 'Accept-Language': 'zh-TW,zh;q=0.9' } },
      );
      const data = await res.json();
      if (data?.address) {
        const a = data.address;
        const parts = [
          a.state || a.county,
          a.city || a.town || a.village,
          a.suburb || a.neighbourhood,
          a.road || a.pedestrian,
          a.house_number,
        ].filter(Boolean);
        const formatted = parts.length > 0 ? parts.join('') : data.display_name || '';
        onAddressResolve(formatted);
      }
    } catch (err) {
      console.error('Reverse geocode failed:', err);
    } finally {
      setIsGeocoding(false);
    }
  };

  const throttledGeocode = useRef(
    throttle((lat: number, lng: number) => reverseGeocode(lat, lng), 2000, {
      leading: false,
      trailing: true,
    }),
  );

  const handleMapMove = (pos: [number, number]) => {
    setIsGeocoding(true);
    throttledGeocode.current(pos[0], pos[1]);
    onChange(pos);
  };

  return (
    <div className="mt-3">
      {/* Map */}
      <div className="h-52 w-full border border-slate-300 dark:border-slate-700 rounded-xl relative overflow-hidden">
        <MapContainer
          center={center}
          zoom={16}
          className="w-full h-full z-0"
          zoomControl={false}
          attributionControl={false}
        >
          <TileLayer
            key={mapType + currentTheme}
            url={getTileUrl()}
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          />
          <MapCenterListener onChange={handleMapMove} />
          <MapRecenter center={center} />
          <MiniMapMarkers type={type} />
        </MapContainer>

        {/* Crosshair pin */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000] drop-shadow-md">
          <MapPin
            className="text-blue-500 w-8 h-8 -mt-8"
            fill="currentColor"
            stroke="white"
            strokeWidth={1.5}
          />
        </div>
      </div>

      {/* Coords + address */}
      <div className="mt-1.5 space-y-0.5">
        <p className="text-xs text-slate-400">
          座標位置：({center[0].toFixed(5)}, {center[1].toFixed(5)})
        </p>
        {isGeocoding ? (
          <p className="text-xs text-slate-400 flex items-center gap-1.5">
            <span className="inline-block w-3 h-3 rounded-full border-2 border-slate-300 border-t-blue-500 animate-spin" />
            解析位址中…
          </p>
        ) : address ? (
          <p className="text-xs text-slate-500 dark:text-slate-400">📍 {address}</p>
        ) : null}
      </div>
    </div>
  );
}
