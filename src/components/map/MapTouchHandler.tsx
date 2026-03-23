'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import L from 'leaflet';
import { Marker, useMapEvents } from 'react-leaflet';

const createTouchPinIcon = () => {
  const html = `
    <div class="relative w-8 h-8">
      <div class="absolute left-1/2 -translate-x-1/2 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md animate-ping" style="animation-duration: 2s;"></div>
      <div class="absolute left-1/2 -translate-x-1/2 top-2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white shadow-md z-10"></div>
      <div class="absolute left-1/2 -translate-x-1/2 top-5 w-1 h-3 bg-blue-500 z-0"></div>
    </div>
  `;
  return L.divIcon({
    html,
    className: 'custom-touch-icon bg-transparent border-0',
    iconSize: L.point(32, 32),
    iconAnchor: [16, 32],
  });
};

export function MapTouchHandler() {
  const { selectedMapLocation, setSelectedMapLocation, isTaskCreateOpen } = useUIStore();
  const { setSelectedTaskId } = useTaskStore();

  const handleInteract = (e: L.LeafletMouseEvent) => {
    if (isTaskCreateOpen) return;

    setSelectedTaskId(null);

    const coords: [number, number] = [e.latlng.lat, e.latlng.lng];
    setSelectedMapLocation(coords);

    if (!!window && typeof window?.innerWidth !== 'undefined' && window.innerWidth < 768) {
      e.target.panTo(e.latlng, { animate: true });
    }
  };

  useMapEvents({
    click: handleInteract,
    contextmenu: handleInteract,
  });

  if (!selectedMapLocation) return null;

  return <Marker position={selectedMapLocation} icon={createTouchPinIcon()} zIndexOffset={2000} />;
}
