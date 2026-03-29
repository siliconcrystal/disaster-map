import { create } from 'zustand';
import type { DisasterDataSource, DisasterType } from '../types/disasterData';
import { Task, TaskType, Urgency, Status, TimeRange, MapZone } from '../types/task';
import { seedTasks } from '../data/seedTasks';
import { seedZones } from '../data/seedZones';

// ─── mock helper (used by generateDisasterData & generateMockTask) ──────────
function rnd(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
function pick<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}
function nearbyPt(lat: number, lng: number, delta = 0.02): [number, number] {
  return [
    +(lat + (Math.random() - 0.5) * delta).toFixed(6),
    +(lng + (Math.random() - 0.5) * delta).toFixed(6),
  ];
}

function mockDisasterData(
  category: DisasterType,
  lat: number,
  lng: number,
): Partial<DisasterDataSource> {
  const zone = {
    type: 'circle' as const,
    center: [lat, lng] as [number, number],
    radius: rnd(200, 800),
  };
  const districts = ['光復鄉', '大富村', '大豐村', '東富村', '西富村', '南富村'];
  const units = ['花蓮縣消防局光復分隊', '鳳林分隊', '瑞穗搜救隊', '光復鄉公所志工團'];

  const sharedBase: Partial<DisasterDataSource> = {
    disasterType: [category],
    disasterApproximateZone: zone,
    roadNetworkUrl: 'https://example.com/mock/road-network.geojson',
    blockedRoutes: [
      { from: nearbyPt(lat, lng), to: nearbyPt(lat, lng), reason: '路面塌陷' },
      { from: nearbyPt(lat, lng), to: nearbyPt(lat, lng), reason: '障礙物堆積' },
    ],
    administrativeBoundaryUrl: 'https://example.com/mock/admin-boundary.geojson',
    aerialPhotoUrl: `https://picsum.photos/seed/aerial${rnd(1, 99)}/1200/800`,
    satelliteImageUrl: `https://picsum.photos/seed/sat${rnd(1, 99)}/1200/800`,
    unitStandbyLocations: units.map((unit) => ({
      unit,
      lat: nearbyPt(lat, lng)[0],
      lng: nearbyPt(lat, lng)[1],
    })),
    ambulanceLocations: Array.from({ length: rnd(2, 4) }, (_, i) => ({
      id: `AMB-${100 + i}`,
      lat: nearbyPt(lat, lng)[0],
      lng: nearbyPt(lat, lng)[1],
      status: pick(['待命', '出勤中', '返回中']),
    })),
    supplyDistributionPoints: Array.from({ length: rnd(2, 3) }, (_, i) => ({
      lat: nearbyPt(lat, lng)[0],
      lng: nearbyPt(lat, lng)[1],
      name: `${pick(districts)}物資發放站 ${i + 1}`,
      items: pick([
        ['飲水', '乾糧', '毛毯'],
        ['醫療包', '飲水'],
        ['飲水', '嬰兒奶粉', '尿布'],
      ]),
    })),
    casualties: { dead: rnd(0, 3), injured: rnd(1, 20), missing: rnd(0, 10), trapped: rnd(0, 8) },
    publicFacilityStatus: [
      {
        name: '光復國小',
        lat: nearbyPt(lat, lng)[0],
        lng: nearbyPt(lat, lng)[1],
        status: 'damaged',
      },
      { name: '光復鄉公所', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], status: 'normal' },
    ],
    utilityOutageZones: [
      { type: 'power', zone: { type: 'circle', center: nearbyPt(lat, lng), radius: 300 } },
      { type: 'water', zone: { type: 'circle', center: nearbyPt(lat, lng), radius: 150 } },
    ],
    shelters: Array.from({ length: rnd(1, 3) }, (_, i) => ({
      lat: nearbyPt(lat, lng)[0],
      lng: nearbyPt(lat, lng)[1],
      name: `${pick(districts)}收容所 ${i + 1}`,
      capacity: rnd(100, 500),
      currentOccupancy: rnd(20, 100),
    })),
    evacuationPoints: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '緊急避難集合點' },
    ],
    elderlyLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], count: rnd(5, 30) },
    ],
    disabilityLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], count: rnd(1, 10) },
    ],
    infantLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], count: rnd(2, 15) },
    ],
    streetLightIds: Array.from({ length: rnd(3, 6) }, () => `SL-${1000 + rnd(1, 999)}`),
  };

  if (category === 'earthquake') {
    return {
      ...sharedBase,
      isLegacyRiskBuilding: Math.random() > 0.6,
      floorCount: rnd(1, 15),
      buildingUsage: pick(['住宅', '商業', '工業', '學校', '醫療']),
      rebarType: pick(['RC', 'SRC', 'S造', '磚造']),
      buildYear: rnd(1960, 2010),
      buildingFloorPlanUrl: `https://example.com/mock/floor-plan-${rnd(1, 9)}.pdf`,
      heavyEquipmentRouteUrl: 'https://example.com/mock/heavy-route.geojson',
      heavyEquipmentLocations: [
        { id: 'EQ-001', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '挖土機' },
        { id: 'EQ-002', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '吊車' },
      ],
      gasStationLocations: [
        { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '中油加油站' },
      ],
      chemicalStorageLocations: [
        { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '工業溶劑' },
      ],
      medicalStationLocations: [
        {
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          name: '前進救護站',
          capacity: 50,
        },
      ],
    };
  }

  if (category === 'fire') {
    return {
      ...sharedBase,
      gasStationLocations: [
        { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '中油加油站' },
      ],
      chemicalStorageLocations: [
        { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '工業溶劑' },
      ],
      industrialZones: [{ lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '工業區' }],
      medicalStationLocations: [
        {
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          name: '火災救護站',
          capacity: 40,
        },
      ],
    };
  }

  if (category === 'storm') {
    return {
      ...sharedBase,
      windSpeed: rnd(15, 60),
      heavyEquipmentRouteUrl: 'https://example.com/mock/heavy-route-storm.geojson',
      heavyEquipmentLocations: [
        { id: 'ST-001', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '吊車' },
        { id: 'ST-002', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '發電機' },
      ],
      medicalStationLocations: [
        {
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          name: '風災救護站',
          capacity: 30,
        },
      ],
    };
  }

  if (category === 'flood') {
    return {
      ...sharedBase,
      rainfallDistributionUrl: 'https://example.com/mock/rainfall.geojson',
      floodPotentialZoneUrl: 'https://example.com/mock/flood-zone.geojson',
      riverBasinBoundaryUrl: 'https://example.com/mock/river-basin.geojson',
      riverWaterLevel: rnd(150, 600),
      debrisFlowPotentialZoneUrl: 'https://example.com/mock/debris-zone.geojson',
      demUrl: 'https://example.com/mock/dem.tif',
      slopeMapUrl: 'https://example.com/mock/slope.tif',
      heavyEquipmentRouteUrl: 'https://example.com/mock/heavy-route-flood.geojson',
      heavyEquipmentLocations: [
        { id: 'FL-001', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '抽水機組' },
      ],
      medicalStationLocations: [
        {
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          name: '水災救護站',
          capacity: 30,
        },
      ],
      cleanupStatus: [
        { zone, progress: pick(['pending', 'in_progress', 'done']), note: '河道清淤中' },
      ],
      toiletLocations: [{ lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1] }],
    };
  }

  if (category === 'pandemic') {
    return {
      ...sharedBase,
      hospitalPatientCount: [
        { hospitalName: '花蓮慈濟醫院', count: rnd(20, 200) },
        { hospitalName: '鳳林榮民醫院', count: rnd(50, 400) },
      ],
      infectedPersonTrails: Array.from({ length: rnd(1, 3) }, () => ({
        trailId: `TRAIL-${rnd(1000, 9999)}`,
        locations: Array.from({ length: rnd(3, 6) }, () => ({
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          timestamp: Date.now() - rnd(1, 72) * 3600000,
        })),
      })),
      medicalStationLocations: [
        { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '篩檢站 A', capacity: 200 },
        {
          lat: nearbyPt(lat, lng)[0],
          lng: nearbyPt(lat, lng)[1],
          name: '隔離收容所',
          capacity: 100,
        },
      ],
      toiletLocations: [{ lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1] }],
    };
  }

  // war
  return {
    ...sharedBase,
    chemicalStorageLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], type: '危險化工廠' },
    ],
    industrialZones: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '光復糖廠工業區' },
    ],
    isLegacyRiskBuilding: Math.random() > 0.5,
    buildYear: rnd(1960, 2000),
    medicalStationLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '戰時救護站', capacity: 80 },
    ],
    cleanupStatus: [{ zone, progress: pick(['pending', 'in_progress']), note: '清除廢墟中' }],
  };
}

// Used by TaskCreateModal to generate a new task with disaster-specific mock data
export const generateMockTask = (defaultData?: Partial<Task>): Task => {
  const types: TaskType[] = [
    'fire', 'rescue', 'danger', 'people', 'inspection', 'medical',
    'supply', 'cleanup', 'heavy', 'utility', 'support', 'transport',
  ];
  const urgencies: Urgency[] = ['low', 'medium', 'high'];
  const statuses: Status[] = ['reported', 'recruiting', 'in_progress', 'done'];

  const lat = 23.65 + Math.random() * 0.1;
  const lng = 121.35 + Math.random() * 0.1;

  const type = pick(types);
  const urgency = pick(urgencies);
  const status = pick(statuses);

  const disasterCategory: DisasterType =
    type === 'inspection' || type === 'rescue' || type === 'heavy' || type === 'danger'
      ? 'earthquake'
      : type === 'fire'
        ? 'fire'
        : type === 'medical' || type === 'people'
          ? 'pandemic'
          : type === 'cleanup'
            ? 'flood'
            : type === 'support' || type === 'transport'
              ? 'war'
              : 'earthquake';

  return {
    id: `task-${Math.random().toString(36).substr(2, 9)}`,
    title: `新回報 - 區域小組 ${Math.floor(Math.random() * 100)}`,
    description: `系統回報的事件紀錄。`,
    lat,
    lng,
    type,
    urgency,
    status,
    address: '',
    reporterName: '',
    reporterUnit: '',
    photos: [],
    disasterCategory,
    history: [
      { timestamp: Date.now(), message: '案件提交', type: 'system' },
    ],
    feedback: { helpful: 0, toConfirm: 0 },
    createdAt: Date.now(),
    contact: '',
    ...defaultData,
  };
};

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
  /** 當前活躍災害的資料來源 */
  disasterData: Partial<DisasterDataSource> | null;
  /** 我的任務 ID 列表 */
  myTaskIds: Set<string>;

  // Actions
  setTasks: (tasks: Task[]) => void;
  addTask: (task: Task) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  setSearchQuery: (query: string) => void;
  setFilters: (filters: Partial<TaskState['filters']>) => void;
  setSelectedTaskId: (id: string | null) => void;
  setMapCenter: (center: [number, number]) => void;
  setMapZoom: (zoom: number) => void;
  getFilteredTasks: (role: string | null) => Task[];
  setZones: (zones: MapZone[]) => void;
  setSelectedZoneId: (id: string | null) => void;
  /** 設定當前災害資料 */
  setDisasterData: (data: Partial<DisasterDataSource> | null) => void;
  /** 根據災害類型生成 mock 資料 */
  generateDisasterData: (type: DisasterType, lat?: number, lng?: number) => void;
  /** 加入我的任務（參加任務） */
  joinTask: (taskId: string) => void;
  /** 離開我的任務 */
  leaveTask: (taskId: string) => void;
  /** 檢查是否為我的任務 */
  isMyTask: (taskId: string) => boolean;
  /** 取得我的任務列表 */
  getMyTasks: () => Task[];
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
  mapCenter: [23.67, 121.43], // Guangfu, Hualien (花蓮光復)
  mapZoom: 13,
  zones: seedZones,
  selectedZoneId: null,
  disasterData: null,
  myTaskIds: new Set<string>(),

  setTasks: (tasks) => set({ tasks }),
  addTask: (task) => set((state) => ({ tasks: state.tasks.concat(task) })),
  updateTask: (taskId, updates) =>
    set((state) => ({
      tasks: state.tasks.map((t) =>
        t.id === taskId ? { ...t, ...updates, updatedAt: Date.now() } : t,
      ),
    })),
  setSearchQuery: (searchQuery) => set({ searchQuery }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setSelectedTaskId: (selectedTaskId) => set({ selectedTaskId }),
  setMapCenter: (mapCenter) => set({ mapCenter }),
  setMapZoom: (mapZoom) => set({ mapZoom }),
  setZones: (zones) => set({ zones }),
  setSelectedZoneId: (selectedZoneId) => set({ selectedZoneId }),
  setDisasterData: (disasterData) => set({ disasterData }),
  generateDisasterData: (type, lat, lng) => {
    const { mapCenter } = get();
    const data = mockDisasterData(type, lat ?? mapCenter[0], lng ?? mapCenter[1]);
    set({ disasterData: data });
  },

  // 我的任務相關
  joinTask: (taskId) =>
    set((state) => {
      const newMyTaskIds = new Set(state.myTaskIds);
      newMyTaskIds.add(taskId);
      // 同時更新任務狀態為進行中
      const tasks = state.tasks.map((t) =>
        t.id === taskId ? { ...t, status: 'in_progress' as const, updatedAt: Date.now() } : t,
      );
      return { myTaskIds: newMyTaskIds, tasks };
    }),
  leaveTask: (taskId) =>
    set((state) => {
      const newMyTaskIds = new Set(state.myTaskIds);
      newMyTaskIds.delete(taskId);
      return { myTaskIds: newMyTaskIds };
    }),
  isMyTask: (taskId) => get().myTaskIds.has(taskId),
  getMyTasks: () => {
    const { tasks, myTaskIds } = get();
    return tasks.filter((t) => myTaskIds.has(t.id));
  },

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
        // Keys are Chinese role names from UserDropdown ROLES
        const roleTypeMap: Record<string, string> = {
          '消防隊': 'fire', '救難隊': 'rescue', '醫療團隊': 'medical',
        };
        if (role && roleTypeMap[role] && t.type !== roleTypeMap[role]) return false;
      } else if (filters.assignee === 'assigned') {
        // Show only tasks that user has joined
        const { myTaskIds } = get();
        if (!myTaskIds.has(t.id)) return false;
      }

      return true;
    });
  },
}));
