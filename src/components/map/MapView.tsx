'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import 'leaflet/dist/leaflet.css';
import { useTheme } from 'next-themes';
import { MapContainer, TileLayer } from 'react-leaflet';
import { MapClickDetailCard } from '../task/MapClickDetailCard';
import { TaskDetailCard } from '../task/TaskDetailCard';
import { ZoneDetailCard } from '../task/ZoneDetailCard';
import { DisasterZoneLayer } from './DisasterZoneLayer';
import { MapControls } from './MapControls';
import { MapTouchHandler } from './MapTouchHandler';
import { MarkerLayer } from './MarkerLayer';
import { PolygonLayer } from './PolygonLayer';
import { ResourceMarkerLayer } from './ResourceMarkerLayer';

export default function MapView() {
  const { mapCenter, mapZoom } = useTaskStore(); // mapCenter and mapZoom remain from useTaskStore
  const { activeMapLayers, mapType } = useUIStore(); // Added destructuring from useUIStore
  const { theme, resolvedTheme } = useTheme();

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  // Replaced tileUrl variable with getTileUrl function
  const getTileUrl = () => {
    if (mapType === 'satellite') {
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    }
    if (mapType === 'streets') {
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    }
    // Adaptive Default
    return currentTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  };

  return (
    <div className="w-full h-full relative overflow-hidden">
      {' '}
      {/* Changed className */}
      <MapContainer
        center={mapCenter}
        zoom={mapZoom}
        className="w-full h-full z-0" // Changed className
        zoomControl={false} // Disable default zoom to build custom right controls later
        attributionControl={false} // Added attributionControl
      >
        <TileLayer
          key={mapType + (mapType === 'adaptive' ? currentTheme : '')} // Added key
          url={getTileUrl()} // Changed url to use getTileUrl
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>' // Updated attribution
        />

        {activeMapLayers.terrain && (
          <TileLayer
            url="https://server.arcgisonline.com/ArcGIS/rest/services/Elevation/World_Hillshade/MapServer/tile/{z}/{y}/{x}"
            opacity={0.4}
            attribution="&copy; Esri World Hillshade"
          />
        )}
        <MapControls />

        {/* 災害區域圖層（底層） */}
        <DisasterZoneLayer />
        {/* 任務區域圖層 */}
        <PolygonLayer />
        {/* 資源點位圖層 */}
        <ResourceMarkerLayer />
        {/* 任務 Marker 圖層（最上層） */}
        <MarkerLayer />
        <MapTouchHandler />
      </MapContainer>
      <ZoneDetailCard />
      <TaskDetailCard />
      <MapClickDetailCard />
    </div>
  );
}
