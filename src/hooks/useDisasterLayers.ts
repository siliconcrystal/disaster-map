/**
 * useDisasterLayers Hook
 *
 * 根據當前災害類型和角色，計算應該顯示的地圖圖層
 * 結合 DISASTER_MAP_LAYERS（災害圖層配置）和 ROLE_DISASTER_VISIBILITY（角色權限）
 */

import {
  DISASTER_MAP_LAYERS,
  getLayersByCategory,
  LAYER_TO_DATA_FIELD,
  type LayerConfig,
  type MapLayerKey,
} from '@/config/disasterMapLayers';
import {
  ROLE_DISASTER_VISIBILITY,
  type DataSourceKey,
  type RoleName,
} from '@/config/roleDataSource';
import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import type { DisasterDataSource } from '@/types/disasterData';
import { useEffect, useMemo } from 'react';

// ─────────────────────────────────────────────
// 圖層與資料欄位的反向映射
// ─────────────────────────────────────────────
const DATA_FIELD_TO_LAYER: Partial<Record<DataSourceKey, MapLayerKey>> = {};
for (const [layerKey, fieldKey] of Object.entries(LAYER_TO_DATA_FIELD)) {
  if (fieldKey) {
    DATA_FIELD_TO_LAYER[fieldKey as DataSourceKey] = layerKey as MapLayerKey;
  }
}

// ─────────────────────────────────────────────
// Hook 回傳型別
// ─────────────────────────────────────────────
export interface DisasterLayerInfo {
  key: MapLayerKey;
  config: LayerConfig;
  /** 是否因角色權限而可見 */
  allowedByRole: boolean;
  /** 是否目前啟用（使用者可切換） */
  enabled: boolean;
  /** 對應的資料欄位 */
  dataField: keyof DisasterDataSource | null;
}

export interface UseDisasterLayersReturn {
  /** 所有可用圖層（依分類） */
  layersByCategory: Record<LayerConfig['category'], DisasterLayerInfo[]>;
  /** 目前啟用的圖層 keys */
  enabledLayers: MapLayerKey[];
  /** 檢查特定圖層是否啟用 */
  isLayerEnabled: (key: MapLayerKey) => boolean;
  /** 切換圖層開關 */
  toggleLayer: (key: MapLayerKey) => void;
  /** 重置為預設值 */
  resetToDefaults: () => void;
  /** 取得特定圖層的資料 */
  getLayerData: <K extends MapLayerKey>(
    key: K,
  ) => DisasterDataSource[keyof DisasterDataSource] | undefined;
}

/**
 * 計算角色可見的圖層 keys
 */
function getRoleAllowedLayers(role: string | null, disasterType: string): Set<MapLayerKey> {
  const allowedLayers = new Set<MapLayerKey>();

  if (!role) {
    // 未登入：顯示所有 critical/high 優先度的圖層
    const config = DISASTER_MAP_LAYERS[disasterType as keyof typeof DISASTER_MAP_LAYERS];
    if (config) {
      for (const [key, cfg] of Object.entries(config)) {
        if (cfg.priority === 'critical' || cfg.priority === 'high') {
          allowedLayers.add(key as MapLayerKey);
        }
      }
    }
    return allowedLayers;
  }

  // 根據角色權限取得可見欄位
  const roleVisibility = ROLE_DISASTER_VISIBILITY[role as RoleName];
  if (!roleVisibility) return allowedLayers;

  const visibleFields = roleVisibility[disasterType as keyof typeof roleVisibility] || [];

  // 將資料欄位轉換為圖層 key
  for (const field of visibleFields) {
    const layerKey = DATA_FIELD_TO_LAYER[field];
    if (layerKey) {
      allowedLayers.add(layerKey);
    }
  }

  // 基礎圖層（行政區界、道路網）一律加入
  allowedLayers.add('adminBoundary');
  allowedLayers.add('roadNetwork');
  allowedLayers.add('disasterZone');

  return allowedLayers;
}

/**
 * useDisasterLayers - 災害圖層管理 Hook
 */
export function useDisasterLayers(): UseDisasterLayersReturn {
  const {
    currentDisasterType,
    currentUserRole,
    activeDisasterLayers,
    toggleDisasterLayer,
    setDisasterLayers,
  } = useUIStore();
  const { disasterData } = useTaskStore();

  // 計算角色允許的圖層
  const roleAllowedLayers = useMemo(
    () => getRoleAllowedLayers(currentUserRole, currentDisasterType),
    [currentUserRole, currentDisasterType],
  );

  // 取得當前災害類型的圖層配置（按分類）
  const rawLayersByCategory = useMemo(
    () => getLayersByCategory(currentDisasterType),
    [currentDisasterType],
  );

  // 組合完整的圖層資訊
  const layersByCategory = useMemo(() => {
    const result: Record<LayerConfig['category'], DisasterLayerInfo[]> = {
      base: [],
      hydrology: [],
      weather: [],
      hazard: [],
      resource: [],
      infrastructure: [],
      public: [],
      vulnerable: [],
      pandemic: [],
    };

    for (const [category, layers] of Object.entries(rawLayersByCategory)) {
      result[category as LayerConfig['category']] = layers.map(({ key, config }) => {
        const allowedByRole = roleAllowedLayers.has(key);
        // 如果 activeDisasterLayers 沒有設定，使用配置的預設值
        const enabled =
          activeDisasterLayers[key] !== undefined
            ? activeDisasterLayers[key]!
            : config.enabled && allowedByRole;

        return {
          key,
          config,
          allowedByRole,
          enabled: enabled && allowedByRole, // 必須同時滿足角色權限
          dataField: LAYER_TO_DATA_FIELD[key],
        };
      });
    }

    return result;
  }, [rawLayersByCategory, roleAllowedLayers, activeDisasterLayers]);

  // 計算啟用的圖層清單
  const enabledLayers = useMemo(() => {
    const result: MapLayerKey[] = [];
    for (const layers of Object.values(layersByCategory)) {
      for (const layer of layers) {
        if (layer.enabled) {
          result.push(layer.key);
        }
      }
    }
    return result;
  }, [layersByCategory]);

  // 當災害類型變更時，重置圖層為該災害的預設配置
  useEffect(() => {
    const config = DISASTER_MAP_LAYERS[currentDisasterType];
    const defaultLayers: Partial<Record<MapLayerKey, boolean>> = {};

    for (const [key, cfg] of Object.entries(config)) {
      const layerKey = key as MapLayerKey;
      const allowedByRole = roleAllowedLayers.has(layerKey);
      defaultLayers[layerKey] = cfg.enabled && allowedByRole;
    }

    setDisasterLayers(defaultLayers);
  }, [currentDisasterType, roleAllowedLayers, setDisasterLayers]);

  // 檢查特定圖層是否啟用
  const isLayerEnabled = (key: MapLayerKey): boolean => {
    return enabledLayers.includes(key);
  };

  // 切換圖層
  const toggleLayer = (key: MapLayerKey): void => {
    // 檢查角色是否允許此圖層
    if (!roleAllowedLayers.has(key)) {
      console.warn(`Layer "${key}" is not allowed for current role`);
      return;
    }
    toggleDisasterLayer(key);
  };

  // 重置為預設值
  const resetToDefaults = (): void => {
    const config = DISASTER_MAP_LAYERS[currentDisasterType];
    const defaultLayers: Partial<Record<MapLayerKey, boolean>> = {};

    for (const [key, cfg] of Object.entries(config)) {
      const layerKey = key as MapLayerKey;
      const allowedByRole = roleAllowedLayers.has(layerKey);
      defaultLayers[layerKey] = cfg.enabled && allowedByRole;
    }

    setDisasterLayers(defaultLayers);
  };

  // 取得特定圖層的資料
  const getLayerData = <K extends MapLayerKey>(
    key: K,
  ): DisasterDataSource[keyof DisasterDataSource] | undefined => {
    const fieldKey = LAYER_TO_DATA_FIELD[key];
    if (!fieldKey || !disasterData) return undefined;
    return disasterData[fieldKey];
  };

  return {
    layersByCategory,
    enabledLayers,
    isLayerEnabled,
    toggleLayer,
    resetToDefaults,
    getLayerData,
  };
}

// ─────────────────────────────────────────────
// 圖層分類的中文標籤
// ─────────────────────────────────────────────
export const LAYER_CATEGORY_LABELS: Record<LayerConfig['category'], string> = {
  base: '基礎圖資',
  hydrology: '水文圖層',
  weather: '氣象圖層',
  hazard: '危險區域',
  resource: '救災資源',
  infrastructure: '基礎設施',
  public: '公共服務',
  vulnerable: '弱勢族群',
  pandemic: '疫情專用',
};
