"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { useTheme } from "next-themes";
import { MarkerLayer } from "./MarkerLayer";
import { StationMarkerLayer } from "./StationMarkerLayer";
import { PolygonLayer } from "./PolygonLayer";
import { MapControls } from "./MapControls";
import { DisasterZoneLayer } from "./DisasterZoneLayer";
import { MapTouchHandler } from "./MapTouchHandler";
import { ResourceMarkerLayer } from "./ResourceMarkerLayer";
import { ZoneDetailCard } from "../task/ZoneDetailCard";
import { StationDetailCard } from "../station/StationDetailCard";
import { MapClickDetailCard } from "../task/MapClickDetailCard";



export default function MapView() {
  const { mapCenter, mapZoom } = useTaskStore(); // mapCenter and mapZoom remain from useTaskStore
  const { activeMapLayers, mapType } = useUIStore(); // Added destructuring from useUIStore
  const { theme, resolvedTheme } = useTheme();

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  // Replaced tileUrl variable with getTileUrl function
  const getTileUrl = () => {
    if (mapType === 'satellite') {
      return "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}";
    }
    if (mapType === 'streets') {
      return "https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png";
    }
    // Adaptive Default
    return currentTheme === "dark"
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png";
  };

  return (
    <div className="w-full h-full relative overflow-hidden"> {/* Changed className */}
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
        {/* 任務 Marker 圖層 */}
        <MarkerLayer />
        {/* 站點 Marker 圖層 */}
        <StationMarkerLayer />
        <MapTouchHandler />
      </MapContainer>

      <ZoneDetailCard />
      <StationDetailCard />
      <MapClickDetailCard />
    </div>
  );
}
