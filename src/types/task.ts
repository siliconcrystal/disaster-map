import type { DisasterDataSource, DisasterType } from './disasterData';

// ─────────────────────────────────────────────
// TaskType：对应地图上的任务点类型
// 依灾害大类归拢如下：
//   earthquake / fire → fire, rescue, danger, inspection, heavy, utility
//   storm_flood       → cleanup, heavy, rescue, utility, transport
//   pandemic          → medical, people, supply, support
//   war               → danger, supply, support, transport
// ─────────────────────────────────────────────
export type TaskType =
  | 'fire' // 🔥 火災
  | 'rescue' // 🚨 搜救
  | 'danger' // 🚧 危險區
  | 'people' // 👥 人員統計
  | 'inspection' // ⛑️ 建築檢查
  | 'medical' // 🚑 醫療
  | 'supply' // 📦 物資
  | 'cleanup' // 🪏 清理淤泥
  | 'heavy' // 🚜 重型機具
  | 'utility' // 🔧 水電
  | 'support' // 💪 人力支援
  | 'transport'; // 🛵 協助運送

export type Urgency = 'low' | 'medium' | 'high';

export type Status = 'reported' | 'recruiting' | 'in_progress' | 'done';

export type TimeRange = 'all' | '1h' | '12h' | '24h' | '72h' | 'custom';

// ─────────────────────────────────────────────
// Task：地图上每一个任务点的完整数据结构
// ─────────────────────────────────────────────
export type Task = {
  // ── 基本资讯
  id: string;
  title: string;
  description: string;
  lat: number;
  lng: number;
  address?: string;

  // ── 任务分类
  type: TaskType;

  /**
   * 所属灾害类别，决定：
   *   1. 显示哪些 disasterData 栏位
   *   2. 权限层 getVisibleFields(role, disasterCategory) 的查询 key
   */
  disasterCategory?: DisasterType;

  urgency: Urgency;
  status: Status;

  // ── 时间
  createdAt: number;
  updatedAt?: number;

  // ── 人员
  createdBy?: string;
  assignedTo?: string[];
  reporterName?: string;
  reporterUnit?: string;
  contact?: string;

  // ── 媒体
  photos?: string[];

  // ── 任务执行纪录
  history?: {
    timestamp: number;
    message: string;
    type?: 'status' | 'comment' | 'system';
  }[];

  feedback?: {
    helpful: number;
    toConfirm: number;
  };

  // ── 灾害相关数据（依 disasterCategory 动态筛选可见栏位）
  //    所有字段定义见 src/types/disasterData.ts
  //    实际权限控制见 src/config/roleDataSource.ts → getVisibleFields()
  disasterData?: Partial<DisasterDataSource>;
};

// ─────────────────────────────────────────────
// 地图区域
// ─────────────────────────────────────────────
export type ZoneType = 'evacuation' | 'ngo' | 'restricted';

export interface MapZone {
  id: string;
  type: ZoneType;
  name: string;
  coordinates: [number, number][]; // [lat, lng][]
  description?: string;
  color?: string;
}
