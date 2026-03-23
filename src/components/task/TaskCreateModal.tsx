'use client';

import { generateMockTask, useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import { TaskType, Urgency } from '@/types/task';
import L from 'leaflet';
import { MapPin, Search, X } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { MapContainer, Marker, TileLayer, useMap, useMapEvents } from 'react-leaflet';

function MapRecenter({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    if (!map) return;
    const currentCenter = map.getCenter();
    const dLat = Math.abs(currentCenter.lat - center[0]);
    const dLng = Math.abs(currentCenter.lng - center[1]);
    if (dLat > 0.0001 || dLng > 0.0001) {
      map.setView(center, map.getZoom(), { animate: true });
    }
  }, [center, map]);
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
  const html = `<div class="flex items-center justify-center w-6 h-6 rounded-full bg-white/70 dark:bg-slate-800/70 shadow border border-slate-200 dark:border-slate-700 text-[10px] opacity-80 backdrop-blur-sm">
      ${emoji}
    </div>`;
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
    const updateBounds = () => setBounds(map.getBounds());
    map.on('moveend', updateBounds);
    return () => {
      map.off('moveend', updateBounds);
    };
  }, [map]);

  if (!bounds) return null;

  return (
    <>
      {tasks
        .filter((task) => task.type === type)
        .map((task) => {
          if (!bounds.contains([task.lat, task.lng])) return null;
          return (
            <Marker
              key={`mini-${task.id}`}
              position={[task.lat, task.lng]}
              icon={getMiniIcon(task.type)}
              interactive={false}
            />
          );
        })}
    </>
  );
}

function MapCenterListener({ onChange }: { onChange: (pos: [number, number]) => void }) {
  const map = useMapEvents({
    move: () => {
      onChange([map.getCenter().lat, map.getCenter().lng]);
    },
  });
  return null;
}

export function TaskCreateModal() {
  const { isTaskCreateOpen, setTaskCreateOpen, newTaskCoords, mapType, setSelectedMapLocation } =
    useUIStore();
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('support');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [address, setAddress] = useState('');
  const [localCoords, setLocalCoords] = useState<[number, number] | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const { theme, resolvedTheme } = useTheme();
  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const getTileUrl = () => {
    if (mapType === 'satellite')
      return 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}';
    if (mapType === 'streets')
      return 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png';
    return currentTheme === 'dark'
      ? 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png'
      : 'https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png';
  };

  useEffect(() => {
    if (isTaskCreateOpen && newTaskCoords) {
      setLocalCoords(newTaskCoords);
    } else {
      setLocalCoords(null);
    }
  }, [isTaskCreateOpen, newTaskCoords]);

  if (!isTaskCreateOpen || !newTaskCoords) return null;

  const coordsToUse = localCoords || newTaskCoords;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTaskMockData = generateMockTask({
      title: title || '新任務回報',
      description: description || '無詳細描述',
      lat: coordsToUse[0],
      lng: coordsToUse[1],
      address: address || `${coordsToUse[0].toFixed(5)}, ${coordsToUse[1].toFixed(5)}`,
      type,
      urgency,
      status: 'reported',
    });

    addTask(newTaskMockData);

    setTaskCreateOpen(false);
    setSelectedMapLocation(null);
    setTitle('');
    setDescription('');
    setAddress('');
  };

  const handleSearch = async () => {
    if (!address) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(address)}`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setLocalCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert('找不到此地址，請嘗試換個關鍵字');
      }
    } catch (err) {
      console.error(err);
      alert('搜尋失敗，請稍後再試');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/20 pointer-events-auto">
      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-2xl overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">建立新任務</h2>
          <button
            onClick={() => setTaskCreateOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 標題 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              標題
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="例：急需飲用水"
            />
          </div>

          {/* 類型 / 緊急程度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                類型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="fire">🔥 火災</option>
                <option value="rescue">🚨 搜救</option>
                <option value="danger">🚧 危險區域</option>
                <option value="people:">👥 人員統計</option>
                <option value="inspection">⛑️ 建築檢查</option>
                <option value="medical">🚑 醫療</option>
                <option value="supply">📦 物資</option>
                <option value="cleanup">🪏 清理淤泥</option>
                <option value="heavy">🚜 重型機具</option>
                <option value="utility">🔧 水電</option>
                <option value="support">💪 人力支援</option>
                <option value="transport">🛵 協助運送</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                緊急程度
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="low">一般</option>
                <option value="medium">中等</option>
                <option value="high">緊急</option>
              </select>
            </div>
          </div>

          {/* 位置 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              位置
            </label>
            <p className="mt-1 text-xs text-slate-400 mb-3">
              輸入任務地址並點擊搜尋，或直接拖曳地圖選擇座標。
            </p>
            <div className="flex gap-2">
              <input
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="輸入地址..."
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-blue-500 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>

            {/* 地圖示意區塊 */}
            <div className="mt-3 h-52 w-full border border-slate-300 dark:border-slate-700 rounded-xl relative overflow-hidden">
              <MapContainer
                center={coordsToUse}
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
                <MapCenterListener onChange={(pos) => setLocalCoords(pos)} />
                <MapRecenter center={coordsToUse} />
                <MiniMapMarkers type={type} />
              </MapContainer>
              {/* Pin 完全置中 */}
              <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-[1000] drop-shadow-md">
                <MapPin
                  className="text-blue-500 w-8 h-8 -mt-8"
                  fill="currentColor"
                  stroke="white"
                  strokeWidth={1.5}
                />
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              座標位置：({coordsToUse[0].toFixed(5)}, {coordsToUse[1].toFixed(5)})
            </p>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              描述
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
              placeholder="詳細情況..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-white hover:text-black font-medium cursor-pointer"
            >
              送出回報
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
