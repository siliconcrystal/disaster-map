import type { TaskType } from '@/types/task';

/**
 * 前台角色 → 可見任務類型映射
 *
 * 來源：Google Spreadsheet「欄位、角色overview」tab（Carol 定義）
 * 用途：當使用者切換角色時，任務清單/地圖 marker 依此表過濾
 *
 * - `null` 代表不過濾（預設 + 未登入）
 * - key 必須與 UserDropdown.tsx 的 ROLES array name 對齊
 */
export const ROLE_TASK_TYPES: Record<string, TaskType[] | null> = {
  未設定角色: null,
  '救難隊（含消防隊）': ['search_rescue', 'fire_response'],
  醫療團隊: ['medical_support'],
  在地組織: ['cleanup', 'repair', 'supply_delivery', 'personnel_transport'],
  現場志工: ['cleanup', 'repair'],
  '災民（含家屬）': [
    'search_rescue',
    'fire_response',
    'medical_support',
    'cleanup',
    'repair',
    'supply_delivery',
    'personnel_transport',
  ],
};

/**
 * Helper：查詢角色可見的 task_type 清單。
 * - 回 `null` 代表該角色不過濾任務類型（顯示全部）
 * - 未知角色 → 回 `null`（gracefully 不過濾，不擋使用者）
 */
export function getVisibleTaskTypes(roleName: string | null | undefined): TaskType[] | null {
  if (!roleName) return null;
  const entry = ROLE_TASK_TYPES[roleName];
  return entry === undefined ? null : entry;
}
