import { create } from 'zustand';

type MapLayers = {
  safeZone: boolean;
  ngoZone: boolean;
  restrictedZone: boolean;
  waterLevel: boolean;
  terrain: boolean;
};

type MapType = 'adaptive' | 'satellite' | 'streets';

interface UIState {
  isAdvancedFilterOpen: boolean;
  isTaskDetailOpen: boolean;
  isTaskFullDetailOpen: boolean;
  isTaskCreateOpen: boolean;
  newTaskCoords: [number, number] | null;
  activeMapLayers: MapLayers;
  mapType: MapType;
  layerMenuOpen: boolean;
  currentUserRole: string | null;
  viewMode: 'map' | 'board';

  // Actions
  setAdvancedFilterOpen: (isOpen: boolean) => void;
  setTaskDetailOpen: (isOpen: boolean) => void;
  setTaskFullDetailOpen: (isOpen: boolean) => void;
  setTaskCreateOpen: (isOpen: boolean, coords?: [number, number] | null) => void;
  toggleMapLayer: (layer: keyof MapLayers) => void;
  setMapType: (type: MapType) => void;
  setLayerMenuOpen: (open: boolean) => void;
  setCurrentUserRole: (role: string | null) => void;
  setViewMode: (mode: 'map' | 'board') => void;
}

export const useUIStore = create<UIState>((set) => ({
  isAdvancedFilterOpen: false,
  isTaskDetailOpen: false,
  isTaskFullDetailOpen: false,
  isTaskCreateOpen: false,
  newTaskCoords: null,
  activeMapLayers: {
    safeZone: true,
    ngoZone: false,
    restrictedZone: true,
    waterLevel: false,
    terrain: false,
  },
  mapType: "streets",
  layerMenuOpen: false,
  currentUserRole: null, // null means not logged in
  viewMode: 'map',

  setAdvancedFilterOpen: (isOpen) => set({ isAdvancedFilterOpen: isOpen }),
  setTaskDetailOpen: (isOpen) => set({ isTaskDetailOpen: isOpen }),
  setTaskFullDetailOpen: (isOpen) => set({ isTaskFullDetailOpen: isOpen }),
  setTaskCreateOpen: (isOpen, coords = null) => set({ isTaskCreateOpen: isOpen, newTaskCoords: coords }),
  toggleMapLayer: (layer) => set((state) => ({
    activeMapLayers: {
      ...state.activeMapLayers,
      [layer]: !state.activeMapLayers[layer]
    }
  })),
  setMapType: (type) => set({ mapType: type }),
  setLayerMenuOpen: (open) => set({ layerMenuOpen: open }),
  setCurrentUserRole: (role) => set({ currentUserRole: role }),
  setViewMode: (mode) => set({ viewMode: mode }),
}));
