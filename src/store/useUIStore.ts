import type { MapLayerKey } from '@/config/disasterMapLayers';
import type { DisasterType } from '@/types/disasterData';
import { create } from 'zustand';

// Legacy zone layers (保留用於 PolygonLayer 中的 Zone 顯示)
type ZoneLayers = {
  safeZone: boolean;
  ngoZone: boolean;
  restrictedZone: boolean;
};

type MapType = 'adaptive' | 'satellite' | 'streets';

// 動態圖層狀態：使用 MapLayerKey 記錄每個圖層的開關狀態
type DynamicMapLayers = Partial<Record<MapLayerKey, boolean>>;

interface UIState {
  isAdvancedFilterOpen: boolean;
  isTaskDetailOpen: boolean;
  isTaskFullDetailOpen: boolean;
  isTaskCreateOpen: boolean;
  newTaskCoords: [number, number] | null;
  selectedMapLocation: [number, number] | null;
  resolvedAddress: string | null;
  // 舊的 zone 圖層 (用於顯示任務區域)
  activeMapLayers: ZoneLayers & { waterLevel: boolean; terrain: boolean };
  // 新的災害圖層 (根據災害類型動態載入)
  activeDisasterLayers: DynamicMapLayers;
  mapType: MapType;
  layerMenuOpen: boolean;
  currentUserRole: string | null;
  isLoggedIn: boolean;
  viewMode: 'map' | 'board';
  currentDisasterType: DisasterType;

  // Actions
  setAdvancedFilterOpen: (isOpen: boolean) => void;
  setTaskDetailOpen: (isOpen: boolean) => void;
  setTaskFullDetailOpen: (isOpen: boolean) => void;
  setTaskCreateOpen: (isOpen: boolean, coords?: [number, number] | null) => void;
  setSelectedMapLocation: (loc: [number, number] | null) => void;
  setResolvedAddress: (address: string | null) => void;
  toggleMapLayer: (layer: keyof (ZoneLayers & { waterLevel: boolean; terrain: boolean })) => void;
  // 新增：災害圖層操作
  toggleDisasterLayer: (layer: MapLayerKey) => void;
  setDisasterLayers: (layers: DynamicMapLayers) => void;
  resetDisasterLayers: () => void;
  setMapType: (type: MapType) => void;
  setLayerMenuOpen: (open: boolean) => void;
  setCurrentUserRole: (role: string | null) => void;
  setIsLoggedIn: (isLoggedIn: boolean) => void;
  setViewMode: (mode: 'map' | 'board') => void;
  setCurrentDisasterType: (type: DisasterType) => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAdvancedFilterOpen: false,
  isTaskDetailOpen: false,
  isTaskFullDetailOpen: false,
  isTaskCreateOpen: false,
  newTaskCoords: null,
  selectedMapLocation: null,
  resolvedAddress: null,
  activeMapLayers: {
    safeZone: true,
    ngoZone: false,
    restrictedZone: true,
    waterLevel: false,
    terrain: false,
  },
  activeDisasterLayers: {},
  mapType: 'streets',
  layerMenuOpen: false,
  currentUserRole: null, // null means not logged in
  isLoggedIn: false,
  viewMode: 'map',
  currentDisasterType: 'earthquake',

  setAdvancedFilterOpen: (isOpen) => set({ isAdvancedFilterOpen: isOpen }),
  setTaskDetailOpen: (isOpen) => set({ isTaskDetailOpen: isOpen }),
  setTaskFullDetailOpen: (isOpen) => set({ isTaskFullDetailOpen: isOpen }),
  setTaskCreateOpen: (isOpen, coords = null) =>
    set({ isTaskCreateOpen: isOpen, newTaskCoords: coords }),
  setSelectedMapLocation: (loc) => set({ selectedMapLocation: loc, resolvedAddress: null }),
  setResolvedAddress: (address) => set({ resolvedAddress: address }),
  toggleMapLayer: (layer) =>
    set((state) => ({
      activeMapLayers: {
        ...state.activeMapLayers,
        [layer]: !state.activeMapLayers[layer],
      },
    })),
  toggleDisasterLayer: (layer) =>
    set((state) => ({
      activeDisasterLayers: {
        ...state.activeDisasterLayers,
        [layer]: !state.activeDisasterLayers[layer],
      },
    })),
  setDisasterLayers: (layers) => set({ activeDisasterLayers: layers }),
  resetDisasterLayers: () => set({ activeDisasterLayers: {} }),
  setMapType: (type) => set({ mapType: type }),
  setLayerMenuOpen: (open) => set({ layerMenuOpen: open }),
  setCurrentUserRole: (role) => set({ currentUserRole: role }),
  setIsLoggedIn: (isLoggedIn) => set({ isLoggedIn }),
  setViewMode: (mode) => set({ viewMode: mode }),
  setCurrentDisasterType: (type) => set({ currentDisasterType: type }),
}));
