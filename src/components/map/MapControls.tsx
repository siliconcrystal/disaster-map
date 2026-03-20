"use client";

import { useMap } from "react-leaflet";
import { Plus, Minus, Crosshair, Layers, Maximize2 } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import L from "leaflet";
import { useState } from "react";

export function MapControls() {
  const map = useMap();
  const { activeMapLayers, toggleMapLayer, mapType, setMapType } = useUIStore();
  const { tasks } = useTaskStore();
  const [showToast, setShowToast] = useState(false);
  const [layerMenuOpen, setLayerMenuOpen] = useState(false);

  const handleFitAll = () => {
    if (tasks.length === 0) return;
    const bounds = L.latLngBounds(tasks.map(t => [t.lat, t.lng] as [number, number]));
    map.fitBounds(bounds, { padding: [50, 50], maxZoom: 15, animate: true });
  };

  const handleAdvancedLayers = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2500);
  };

  return (
    <div className="absolute right-4 bottom-8 z-[1000] flex flex-col gap-2.5 pointer-events-auto">
      <button
        onClick={() => {
          map.locate().on("locationfound", (e) => {
            map.flyTo(e.latlng, map.getZoom());
          });
        }}
        className="w-11 h-11 flex items-center justify-center bg-white/95 backdrop-blur dark:bg-slate-900/95 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-100/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
      >
        <Crosshair className="w-5 h-5" strokeWidth={1.5} />
      </button>

      <button
        onClick={handleFitAll}
        className="w-11 h-11 flex items-center justify-center bg-white/95 backdrop-blur dark:bg-slate-900/95 rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-100/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
      >
        <Maximize2 className="w-5 h-5" strokeWidth={1.5} />
      </button>

      {/* Layer Button */}
      <div className="relative">
        <button
          onClick={() => setLayerMenuOpen(v => !v)}
          className={`w-11 h-11 flex items-center justify-center backdrop-blur rounded-2xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border transition-colors ${layerMenuOpen ? 'bg-blue-50 dark:bg-blue-900/30 border-blue-200 dark:border-blue-800 text-blue-600 dark:text-blue-400' : 'bg-white/95 dark:bg-slate-900/95 border-slate-100/50 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'}`}
        >
          <Layers className="w-5 h-5" strokeWidth={1.5} />
        </button>

        {/* Layers menu dropdown - click-toggled for mobile */}
        {layerMenuOpen && (
          <>
            {/* Backdrop to close on outside click */}
            <div className="fixed inset-0 z-[-1]" onClick={() => setLayerMenuOpen(false)} />
            <div className="absolute right-full bottom-0 mr-3 w-52 bg-white/97 dark:bg-slate-900/97 backdrop-blur-md rounded-2xl shadow-xl border border-slate-200 dark:border-slate-800 p-3 animate-in fade-in slide-in-from-right-2 duration-150">
              <div className="space-y-4">
                {/* Map type section */}
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">地圖種類</span>
                  <div className="grid grid-cols-3 gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
                    {[
                      { id: 'adaptive', label: '預設' },
                      { id: 'satellite', label: '衛星圖' },
                      { id: 'streets', label: '街道' }
                    ].map((type) => (
                      <button
                        key={type.id}
                        onClick={() => setMapType(type.id as any)}
                        className={`py-1.5 px-1 rounded-lg text-[11px] font-bold transition-all ${mapType === type.id
                            ? 'bg-white dark:bg-slate-700 text-blue-600 dark:text-blue-400 shadow-sm'
                            : 'text-slate-500 hover:text-slate-700 dark:hover:text-slate-300'
                          }`}
                      >
                        {type.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Layer toggles — Switch style */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400 dark:text-slate-500 block mb-2">圖層顯示</span>
                  <div className="space-y-2.5">
                    {[
                      { id: 'safeZone', label: '避難區域' },
                      { id: 'ngoZone', label: 'NGO 中心' },
                      { id: 'restrictedZone', label: '禁止通行區域' },
                      { id: 'waterLevel', label: '即時水位' },
                      { id: 'terrain', label: '地勢高低圖' }
                    ].map((layer) => {
                      const isOn = activeMapLayers[layer.id as keyof typeof activeMapLayers];
                      return (
                        <button
                          key={layer.id}
                          onClick={() => toggleMapLayer(layer.id as any)}
                          className="w-full flex items-center justify-between gap-3 py-0.5 group"
                        >
                          <span className={`text-xs font-medium transition-colors text-left ${isOn ? 'text-slate-900 dark:text-slate-100' : 'text-slate-400 dark:text-slate-500'}`}>
                            {layer.label}
                          </span>
                          {/* Switch */}
                          <div className={`relative w-9 h-5 rounded-full transition-colors duration-200 shrink-0 ${isOn ? 'bg-blue-500' : 'bg-slate-200 dark:bg-slate-700'}`}>
                            <span className={`absolute top-0.5 left-0.5 w-4 h-4 rounded-full bg-white shadow transition-transform duration-200 ${isOn ? 'translate-x-4' : 'translate-x-0'}`} />
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>

                {/* Advanced */}
                <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                  <button
                    onClick={handleAdvancedLayers}
                    className="w-full text-center text-[11px] text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors py-0.5"
                  >
                    進階圖層選項
                  </button>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Toast */}
        {showToast && (
          <div className="absolute right-full bottom-0 mr-3 mb-1 bg-slate-800 dark:bg-slate-700 text-white text-xs font-medium px-3 py-2 rounded-xl shadow-lg whitespace-nowrap animate-in fade-in slide-in-from-right-2 duration-200 pointer-events-none">
            🚧 開發中，敬請期待
          </div>
        )}
      </div>

      <div className="flex flex-col bg-white/95 backdrop-blur dark:bg-slate-900/95 rounded-3xl shadow-[0_2px_12px_rgba(0,0,0,0.08)] border border-slate-100/50 dark:border-slate-800 overflow-hidden mt-1">
        <button
          onClick={() => map.zoomIn()}
          className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors border-b border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200"
        >
          <Plus className="w-5 h-5" strokeWidth={1.5} />
        </button>
        <button
          onClick={() => map.zoomOut()}
          className="w-11 h-11 flex items-center justify-center hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
        >
          <Minus className="w-5 h-5" strokeWidth={1.5} />
        </button>
      </div>
    </div>
  );
}
