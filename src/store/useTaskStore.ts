import { create } from 'zustand';
import { MapZone, Status, Task, TaskType, TimeRange, Urgency } from '../types/task';

interface Filters {
  type: TaskType | 'all';
  urgency: Urgency | 'all';
  status: Status | 'all';
  timeRange: TimeRange;
  assignee?: 'all' | 'my_role' | 'assigned';
  customTimeRange?: { start: number | null; end: number | null };
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
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  setSelectedTaskId: (id: string | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  getFilteredTasks: (role: string | null) => Task[];
  setZones: (zones: MapZone[]) => void;
  setSelectedZoneId: (id: string | null) => void;
}

export const generateMockTask = (defaultData?: Partial<Task>): Task => {
  const types: TaskType[] = [
    'fire',
    'rescue',
    'danger',
    'people',
    'inspection',
    'medical',
    'supply',
    'cleanup',
    'heavy',
    'utility',
    'support',
    'transport',
  ];
  const urgencies: Urgency[] = ['low', 'medium', 'high'];
  const statuses: Status[] = ['reported', 'recruiting', 'in_progress', 'done'];

  const lat = 22.95 + Math.random() * 0.1;
  const lng = 120.17 + Math.random() * 0.1;

  const isFire = Math.random() > 0.8;
  const isRescue = Math.random() > 0.85;

  const type = isFire
    ? 'fire'
    : isRescue
      ? 'rescue'
      : types[Math.floor(Math.random() * types.length)];
  const urgency =
    isFire || isRescue ? 'high' : urgencies[Math.floor(Math.random() * urgencies.length)];
  const status = statuses[Math.floor(Math.random() * statuses.length)];

  return {
    id: `task-${Math.random().toString(36).substr(2, 9)}`,
    title: `${type === 'fire' ? '火災回報' : type === 'rescue' ? '受困救援' : '一般回報'} - 區域小組 ${Math.floor(Math.random() * 100)}`,
    description: `系統回報的事件紀錄。事件時間：${new Date().toLocaleTimeString()}度範圍。`,
    lat,
    lng,
    type,
    urgency,
    status,
    address: `台南市${['東區', '中西區', '永康區', '安南區', '南區', '北區'][Math.floor(Math.random() * 6)]}${Math.floor(Math.random() * 200)}號`,
    reporterName: `志工 ${String.fromCharCode(65 + Math.floor(Math.random() * 26))}`,
    reporterUnit: `區域救援隊 ${Math.floor(Math.random() * 5) + 1} 隊`,
    photos: Math.random() > 0.3 ? [`https://picsum.photos/seed/${Math.random()}/800/600`] : [],
    hasFloors: type === 'inspection' || Math.random() > 0.8,
    floorData:
      type === 'inspection' || Math.random() > 0.8
        ? [
            { floor: 'B1', status: '正常', details: '無異常' },
            { floor: '1F', status: '損壞', details: '牆面裂縫' },
            { floor: '2F', status: '正常', details: '無異常' },
          ]
        : undefined,
    history: [
      { timestamp: Date.now() - 3600000 * 5, message: '案件提交並確認', type: 'system' },
      { timestamp: Date.now() - 3600000 * 2, message: '物資已送達', type: 'comment' },
      { timestamp: Date.now() - 3600000 * 1, message: '狀態變更為進行中', type: 'status' },
    ],
    feedback: {
      helpful: Math.floor(Math.random() * 50),
      toConfirm: Math.floor(Math.random() * 10),
    },
    createdAt: Date.now() - Math.random() * 86400000 * 3, // up to 3 days ago
    contact: `09${Math.floor(10000000 + Math.random() * 90000000)}`,
    ...defaultData,
  };
};

const generateMockTasks = (): Task[] => {
  const tasks: Task[] = [];

  for (let i = 0; i < 150; i++) {
    const mockTaskData = generateMockTask();
    tasks.push(mockTaskData);
  }
  return tasks;
};

const generateMockZones = (): MapZone[] => {
  return [
    {
      id: 'zone-1',
      type: 'evacuation',
      name: '台南公園避難區',
      coordinates: [
        [22.998, 120.211],
        [23.004, 120.21],
        [23.005, 120.216],
        [23.001, 120.218],
        [22.997, 120.215],
      ], // Pentagon-ish
      description:
        '台南公園現已開放為緊急避難場所。區內設有醫療站、臨時供水點及行動通訊強化設備。建議避難民眾由勝利路入口進入。',
      color: '#37a4b5',
    },
    {
      id: 'zone-2',
      type: 'ngo',
      name: '慈濟 NGO 支援中心',
      coordinates: [
        [22.992, 120.201],
        [22.996, 120.2],
        [22.997, 120.206],
        [22.993, 120.207],
        [22.991, 120.204],
      ], // Irregular
      description:
        '慈濟基金會設於此處的物資集散與志工調配中心。提供受災群眾熱食、毛毯及心理慰撫服務。NGO 夥伴請至二樓辦公室進行報到。',
      color: '#3b82f6',
    },
    {
      id: 'zone-3',
      type: 'restricted',
      name: '禁止通行 - 永康倒塌警戒區',
      coordinates: [
        [23.015, 120.245],
        [23.019, 120.244],
        [23.02, 120.252],
        [23.016, 120.251],
      ], // Trapezoid-ish
      description:
        '該區域因建築物嚴重受損，仍有倒塌風險。根據災害防救法，目前實施封鎖管制。嚴禁非特種搜救隊及結構工程技師以外人員進入，違者將依法重罰。',
      color: '#ff3333',
    },
  ];
};

export const useTaskStore = create<TaskState>((set, get) => ({
  tasks: generateMockTasks(),
  searchQuery: '',
  filters: {
    type: 'all',
    urgency: 'all',
    status: 'all',
    timeRange: 'all',
    assignee: 'all',
    customTimeRange: { start: null, end: null },
  },
  selectedTaskId: null,
  mapCenter: [23.0, 120.21], // Tainan default center
  mapZoom: 13,
  zones: generateMockZones(),
  selectedZoneId: null,

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: state.tasks.concat(task) })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setMapZoom: (mapZoom) => set({ mapZoom }),
  setZones: (zones) => set({ zones }),
  setSelectedZoneId: (selectedZoneId) => set({ selectedZoneId }),

  getFilteredTasks: (role) => {
    const { tasks, searchQuery, filters } = get();
    return tasks.filter((t) => {
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
          medic: 'medical',
          rescuer: 'rescue',
          inspector: 'inspection',
          supplier: 'supply',
          engineer: 'utility',
        };
        if (role && roleTypeMap[role] && t.type !== roleTypeMap[role]) return false;
      } else if (filters.assignee === 'assigned') {
        if (parseInt(t.id.replace('task-', '')) % 5 !== 0) return false;
      }

      return true;
    });
  },
}));
