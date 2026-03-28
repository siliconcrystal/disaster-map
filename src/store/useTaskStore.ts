import { create } from 'zustand';
import { Task, TaskType, Urgency, Status, TimeRange, MapZone } from '../types/task';
import { seedTasks } from '../data/seedTasks';
import { seedZones } from '../data/seedZones';

interface Filters {
  type: TaskType | 'all';
  urgency: Urgency | 'all';
  status: Status | 'all';
  timeRange: TimeRange;
  assignee?: 'all' | 'my_role' | 'assigned';
  customTimeRange?: { start: number | null, end: number | null };
}

interface TaskState {
  tasks: Task[];
  searchQuery: string;
  filters: Filters;
  selectedTaskId: string | null;
  mapCenter: [number, number];
  mapZoom: number;
  zones: MapZone[];
  selectedZoneId: string | null;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TaskState["filters"]>) => void;
  setSelectedTaskId: (id: string | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  getFilteredTasks: (role: string | null) => Task[];
  setZones: (zones: MapZone[]) => void;
  setSelectedZoneId: (id: string | null) => void;
}

// Simple hash for UUID-safe assignee filter (replaces task-N assumption)
const hashCode = (s: string): number => {
  let h = 0;
  for (let i = 0; i < s.length; i++) {
    h = ((h << 5) - h + s.charCodeAt(i)) | 0;
  }
  return Math.abs(h);
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: seedTasks,
  searchQuery: "",
  filters: {
    type: "all",
    urgency: "all",
    status: "all",
    timeRange: "all",
    assignee: "all",
    customTimeRange: { start: null, end: null },
  },
  selectedTaskId: null,
  mapCenter: [23.67, 121.43], // Guangfu, Hualien (花蓮光復)
  mapZoom: 13,
  zones: seedZones,
  selectedZoneId: null,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: [...state.tasks, task] })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) =>
    set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setMapZoom: (mapZoom) => set({ mapZoom }),
  setZones: (zones) => set({ zones }),
  setSelectedZoneId: (selectedZoneId) => set({ selectedZoneId }),

  getFilteredTasks: (role) => {
    const { tasks, searchQuery, filters } = get();
    return tasks.filter(t => {
      // Basic search — title, description, and address
      if (searchQuery) {
        const q = searchQuery.toLowerCase();
        const matchesTitle = t.title.toLowerCase().includes(q);
        const matchesDesc = t.description.toLowerCase().includes(q);
        const matchesAddr = t.address ? t.address.toLowerCase().includes(q) : false;
        if (!matchesTitle && !matchesDesc && !matchesAddr) return false;
      }

      // Category filters
      if (filters.type !== 'all' && t.type !== filters.type) return false;
      if (filters.urgency !== 'all' && t.urgency !== filters.urgency) return false;
      if (filters.status !== 'all' && t.status !== filters.status) return false;

      // Time filter
      if (filters.timeRange !== 'all') {
        if (filters.timeRange === 'custom' && filters.customTimeRange) {
          const { start, end } = filters.customTimeRange;
          if (start && t.createdAt < start) return false;
          if (end && t.createdAt > end) return false;
        } else if (filters.timeRange !== 'custom') {
          const hours = parseInt(filters.timeRange.replace('h', ''));
          if (!isNaN(hours) && Date.now() - t.createdAt > hours * 3600000) return false;
        }
      }

      // Assignee filter
      if (filters.assignee === 'my_role') {
        // Show tasks matching user's role type — only filter if role has a mapped type
        const roleTypeMap: Record<string, string> = {
          medic: 'medical', rescuer: 'rescue', inspector: 'inspection',
          supplier: 'supply', engineer: 'utility',
        };
        if (role && roleTypeMap[role] && t.type !== roleTypeMap[role]) return false;
      } else if (filters.assignee === 'assigned') {
        if (hashCode(t.id) % 5 !== 0) return false;
      }

      return true;
    });
  }
}));
