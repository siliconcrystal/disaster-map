import { create } from 'zustand';
import { Station, StationType } from '../types/station';
import { seedStations } from '../data/seedStations';

interface StationFilters {
  type: StationType | 'all';
}

interface StationState {
  stations: Station[];
  selectedStationId: string | null;
  stationFilters: StationFilters;

  setSelectedStationId: (id: string | null) => void;
  setStationFilters: (filters: Partial<StationFilters>) => void;
  getFilteredStations: () => Station[];
}

export const useStationStore = create<StationState>((set, get) => ({
  stations: seedStations,
  selectedStationId: null,
  stationFilters: { type: 'all' },

  setSelectedStationId: (selectedStationId) => set({ selectedStationId }),
  setStationFilters: (filters) =>
    set((state) => ({ stationFilters: { ...state.stationFilters, ...filters } })),

  getFilteredStations: () => {
    const { stations, stationFilters } = get();
    return stations.filter(s => {
      if (stationFilters.type !== 'all' && s.type !== stationFilters.type) return false;
      return true;
    });
  },
}));
