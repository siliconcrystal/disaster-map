import type { DisasterType } from '@/types/disasterData';
import { TaskType } from '@/types/task';

export interface TaskTypeOption {
  value: TaskType;
  label: string;
  icon: string;
}

// 所有任務類型的完整列表
export const ALL_TASK_TYPES: TaskTypeOption[] = [
  { value: 'fire', label: '火災', icon: '🔥' },
  { value: 'rescue', label: '搜救', icon: '🚨' },
  { value: 'danger', label: '危險區域', icon: '🚧' },
  { value: 'people', label: '人員統計', icon: '👥' },
  { value: 'inspection', label: '建築檢查', icon: '⛑️' },
  { value: 'medical', label: '醫療', icon: '🚑' },
  { value: 'supply', label: '物資', icon: '📦' },
  { value: 'cleanup', label: '清潔', icon: '🪏' },
  { value: 'heavy', label: '重型機具', icon: '🚜' },
  { value: 'utility', label: '水電', icon: '🔧' },
  { value: 'support', label: '人力支援', icon: '💪' },
  { value: 'transport', label: '協助運送', icon: '🛵' },
];

// 根據災害類型定義對應的任務類型
export const DISASTER_TASK_TYPES: Record<DisasterType, TaskType[]> = {
  earthquake: [
    'fire', // 地震火災
    'rescue', // 搜救
    'danger', // 危險區域
    'people', // 人員統計 (All)
    'inspection', // 建築檢查
    'medical', // 醫療 (All)
    'heavy', // 重型機具
  ],
  fire: [
    'fire', // 火災
    'rescue', // 搜救
    'danger', // 危險區域
    'people', // 人員統計 (All)
    'inspection', // 建築檢查
    'medical', // 醫療 (All)
  ],
  storm: [
    'danger', // 危險區域
    'people', // 人員統計 (All)
    'medical', // 醫療 (All)
    'supply', // 物資
    'cleanup', // 清潔
    'heavy', // 重型機具
    'utility', // 水電
    'support', // 人力支援
  ],
  flood: [
    'danger', // 危險區域
    'people', // 人員統計 (All)
    'medical', // 醫療 (All)
    'supply', // 物資
    'cleanup', // 清潔
    'heavy', // 重型機具
    'utility', // 水電
    'support', // 人力支援
  ],
  pandemic: [
    'people', // 人員統計 (All)
    'medical', // 醫療 (All)
    'supply', // 物資
    'support', // 人力支援
    'transport', // 協助運送
  ],
  war: [
    'fire', // 戰爭火災
    'rescue', // 搜救
    'danger', // 危險區域
    'people', // 人員統計 (All)
    'medical', // 醫療 (All)
    'heavy', // 重型機具
  ],
};

// 根據災害類型取得對應的任務類型選項（用於篩選器）
export function getTaskTypesForDisaster(disasterType: DisasterType | null): TaskTypeOption[] {
  if (!disasterType) {
    return ALL_TASK_TYPES;
  }

  const allowedTypes = DISASTER_TASK_TYPES[disasterType];
  return ALL_TASK_TYPES.filter((type) => allowedTypes.includes(type.value));
}

// 根據災害類型取得篩選選項（包含「全部」選項）
export function getTaskTypeFilterOptions(
  disasterType: DisasterType | null,
): { label: string; value: TaskType | 'all' }[] {
  const taskTypes = getTaskTypesForDisaster(disasterType);
  return [
    { label: '全部', value: 'all' },
    ...taskTypes.map((t) => ({ label: `${t.icon}${t.label}`, value: t.value })),
  ];
}
