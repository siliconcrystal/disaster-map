import type { DisasterType } from '@/types/disasterData';
import { TaskType } from '@/types/task';

export interface TaskTypeOption {
  value: TaskType;
  label: string;
  icon: string;
}

export const ALL_TASK_TYPES: TaskTypeOption[] = [
  { value: 'search_rescue', label: '搜救', icon: '🚨' },
  { value: 'medical_support', label: '醫療支援', icon: '🚑' },
  { value: 'fire_response', label: '火災應變', icon: '🔥' },
  { value: 'supply_delivery', label: '物資運送', icon: '📦' },
  { value: 'personnel_transport', label: '人員運送', icon: '🛵' },
  { value: 'equipment_transport', label: '設備運送', icon: '🚜' },
  { value: 'cleanup', label: '清理', icon: '🪏' },
  { value: 'repair', label: '修繕', icon: '🔧' },
  { value: 'inspection', label: '巡檢', icon: '⛑️' },
  { value: 'info_report', label: '資訊回報', icon: '📋' },
  { value: 'info_update', label: '資訊更新', icon: '🔄' },
  { value: 'info_verification', label: '資訊驗證', icon: '✅' },
  { value: 'other', label: '其他', icon: '📍' },
];

export const DISASTER_TASK_TYPES: Record<DisasterType, TaskType[]> = {
  earthquake: [
    'fire_response',
    'search_rescue',
    'inspection',
    'equipment_transport',
    'medical_support',
    'cleanup',
    'repair',
  ],
  fire: [
    'fire_response',
    'search_rescue',
    'medical_support',
    'inspection',
  ],
  storm: [
    'search_rescue',
    'medical_support',
    'supply_delivery',
    'cleanup',
    'equipment_transport',
    'repair',
    'other',
  ],
  flood: [
    'search_rescue',
    'medical_support',
    'supply_delivery',
    'cleanup',
    'equipment_transport',
    'repair',
    'other',
  ],
  pandemic: [
    'medical_support',
    'supply_delivery',
    'personnel_transport',
    'other',
  ],
  war: [
    'fire_response',
    'search_rescue',
    'medical_support',
    'equipment_transport',
    'other',
  ],
};

export function getTaskTypesForDisaster(disasterType: DisasterType | null): TaskTypeOption[] {
  if (!disasterType) {
    return ALL_TASK_TYPES;
  }

  const allowedTypes = DISASTER_TASK_TYPES[disasterType];
  return ALL_TASK_TYPES.filter((type) => allowedTypes.includes(type.value));
}

export function getTaskTypeFilterOptions(
  disasterType: DisasterType | null,
): { label: string; value: TaskType | 'all' }[] {
  const taskTypes = getTaskTypesForDisaster(disasterType);
  return [
    { label: '全部', value: 'all' },
    ...taskTypes.map((t) => ({ label: `${t.icon}${t.label}`, value: t.value })),
  ];
}
