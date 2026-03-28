import { create } from 'zustand';
import type { DisasterDataSource, DisasterType } from '../types/disasterData';
import { MapZone, Status, Task, TaskType, TimeRange, Urgency } from '../types/task';

// ─── mock helper ───────────────────────────────────────────────────────────
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
  const districts = ['東區', '中西區', '永康區', '安南區', '南區', '北區'];
  const units = ['台南消防局第一大隊', '永康分隊', '安南搜救隊', '民政局志工團'];

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
        name: '永康國小',
        lat: nearbyPt(lat, lng)[0],
        lng: nearbyPt(lat, lng)[1],
        status: 'damaged',
      },
      { name: '區公所', lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], status: 'normal' },
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
    streetLightIds: Array.from({ length: rnd(3, 6) }, (_, i) => `SL-${1000 + rnd(1, 999)}`),
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
        { hospitalName: '台南市立醫院', count: rnd(20, 200) },
        { hospitalName: '成大醫院', count: rnd(50, 400) },
      ],
      infectedPersonTrails: Array.from({ length: rnd(1, 3) }, (_, i) => ({
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
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '南科工業區' },
    ],
    isLegacyRiskBuilding: Math.random() > 0.5,
    buildYear: rnd(1960, 2000),
    medicalStationLocations: [
      { lat: nearbyPt(lat, lng)[0], lng: nearbyPt(lat, lng)[1], name: '戰時救護站', capacity: 80 },
    ],
    cleanupStatus: [{ zone, progress: pick(['pending', 'in_progress']), note: '清除廢墟中' }],
  };
}

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
    disasterCategory,
    disasterData: mockDisasterData(disasterCategory, lat, lng),
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
  disasterData: mockDisasterData('earthquake', 23.0, 120.21),
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
        const roleTypeMap: Record<string, string> = {
          medic: 'medical',
          rescuer: 'rescue',
          inspector: 'inspection',
          supplier: 'supply',
          engineer: 'utility',
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
