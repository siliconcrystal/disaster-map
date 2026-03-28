'use client';

import { LocationPickerMap } from '@/components/map/LocationPickerMap';
import { getTaskTypesForDisaster } from '@/config/disasterTaskTypes';
import { generateMockTask, useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import { TaskType, Urgency } from '@/types/task';
import { Search, X } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';

// 根據災害類型定義對應的任務類型（使用共享配置）
// 詳細對應關係請參考 /config/disasterTaskTypes.ts

// 根據災害類型定義額外的欄位
interface DisasterSpecificFields {
  // 地震
  floorCount?: number;
  isTrapped?: boolean;
  buildingType?: string;
  // 火災
  fireSource?: string;
  hasHazardousMaterial?: boolean;
  // 風災
  windDamageType?: string;
  // 水災
  waterLevel?: number;
  needBoat?: boolean;
  // 疫情
  symptomCount?: number;
  contactTracing?: boolean;
  // 戰爭
  injuredCount?: number;
  needEvacuation?: boolean;
}

export function TaskCreateModal() {
  const {
    isTaskCreateOpen,
    setTaskCreateOpen,
    newTaskCoords,
    setSelectedMapLocation,
    resolvedAddress,
    setResolvedAddress,
    currentDisasterType,
  } = useUIStore();
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [type, setType] = useState<TaskType>('support');
  const [urgency, setUrgency] = useState<Urgency>('medium');
  const [address, setAddress] = useState(resolvedAddress ?? '');
  const [searchInput, setSearchInput] = useState('');
  const [localCoords, setLocalCoords] = useState<[number, number] | null>(newTaskCoords);
  const [isSearching, setIsSearching] = useState(false);

  // 災害特定欄位
  const [disasterFields, setDisasterFields] = useState<DisasterSpecificFields>({});

  // 取得當前災害類型對應的任務類型選項
  const availableTaskTypes = useMemo(() => {
    return getTaskTypesForDisaster(currentDisasterType);
  }, [currentDisasterType]);

  // 當災害類型改變時，重設任務類型為該災害的第一個選項
  useEffect(() => {
    if (availableTaskTypes.length > 0) {
      setType(availableTaskTypes[0].value);
    }
    setDisasterFields({});
  }, [currentDisasterType, availableTaskTypes]);

  useEffect(() => {
    if (isTaskCreateOpen && newTaskCoords) {
      setLocalCoords(newTaskCoords);
    } else {
      setLocalCoords(null);
      setAddress('');
      setSearchInput('');
    }
  }, [isTaskCreateOpen, newTaskCoords]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (resolvedAddress) setAddress(resolvedAddress);
  }, [resolvedAddress]);

  if (!isTaskCreateOpen || !localCoords) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newTaskMockData = generateMockTask({
      title: title || '新任務回報',
      description: description || '無詳細描述',
      lat: localCoords[0],
      lng: localCoords[1],
      address: address || `${localCoords[0].toFixed(5)}, ${localCoords[1].toFixed(5)}`,
      type,
      urgency,
      status: 'reported',
      disasterCategory: currentDisasterType,
    });

    addTask(newTaskMockData);

    setTaskCreateOpen(false);
    setSelectedMapLocation(null);
    setResolvedAddress(null);
    setTitle('');
    setDescription('');
    setAddress('');
    setSearchInput('');
    setDisasterFields({});
  };

  const handleSearch = async () => {
    if (!searchInput.trim()) return;
    setIsSearching(true);
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&limit=1&q=${encodeURIComponent(searchInput)}`,
      );
      const data = await res.json();
      if (data && data.length > 0) {
        setLocalCoords([parseFloat(data[0].lat), parseFloat(data[0].lon)]);
      } else {
        alert('找不到此地址，請嘗試換個關鍵字');
      }
    } catch (err) {
      console.error(err);
      alert('搜尋失敗，請稍後再試');
    } finally {
      setIsSearching(false);
    }
  };

  return (
    <div className="fixed inset-0 z-2000 flex items-center justify-center bg-black/20 pointer-events-auto">
      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-2xl md:rounded-2xl overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">建立新任務</h2>
          <button
            onClick={() => setTaskCreateOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-5 flex flex-col gap-4 h-full md:max-h-[80dvh] overflow-auto"
        >
          {/* 災害類型提示 */}
          <div className="flex items-center gap-2 p-3 bg-slate-50 dark:bg-slate-800 rounded-xl">
            <span className="text-lg">
              {currentDisasterType === 'earthquake' && '🌍'}
              {currentDisasterType === 'fire' && '🔥'}
              {currentDisasterType === 'storm' && '🌪️'}
              {currentDisasterType === 'flood' && '🌊'}
              {currentDisasterType === 'pandemic' && '🦠'}
              {currentDisasterType === 'war' && '⚔️'}
            </span>
            <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
              {currentDisasterType === 'earthquake' && '地震'}
              {currentDisasterType === 'fire' && '火災'}
              {currentDisasterType === 'storm' && '風災'}
              {currentDisasterType === 'flood' && '水災'}
              {currentDisasterType === 'pandemic' && '疫情'}
              {currentDisasterType === 'war' && '戰爭'}
              災害回報
            </span>
          </div>

          {/* 標題 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              標題
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="例：急需飲用水"
            />
          </div>

          {/* 類型 / 緊急程度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                類型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                {availableTaskTypes.map(({ value, label, icon }) => (
                  <option key={value} value={value}>
                    {icon} {label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                緊急程度
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="low">一般</option>
                <option value="medium">中等</option>
                <option value="high">緊急</option>
              </select>
            </div>
          </div>

          {/* 位置 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              位置
            </label>
            <p className="mt-1 text-xs text-slate-400 mb-3">
              輸入任務地址並點擊搜尋，或直接拖曳地圖選擇座標。
            </p>
            <div className="flex gap-2">
              <input
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    e.preventDefault();
                    handleSearch();
                  }
                }}
                className="flex-1 px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
                placeholder="搜尋地址..."
              />
              <button
                type="button"
                onClick={handleSearch}
                className="px-4 py-2 bg-slate-100 dark:bg-slate-800 rounded-xl hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center shrink-0 border border-slate-200 dark:border-slate-700"
                disabled={isSearching}
              >
                {isSearching ? (
                  <div className="w-5 h-5 rounded-full border-2 border-slate-400 border-t-blue-500 animate-spin" />
                ) : (
                  <Search className="w-5 h-5 text-slate-500" />
                )}
              </button>
            </div>

            <LocationPickerMap
              address={resolvedAddress}
              center={localCoords}
              type={type}
              onChange={(coords) => setLocalCoords(coords)}
              onAddressResolve={(resolved) => setAddress((prev) => (prev === '' ? resolved : prev))}
            />
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              描述
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
              placeholder="詳細情況..."
            />
          </div>

          {/* 災害特定欄位 */}
          {currentDisasterType === 'earthquake' && (
            <div className="space-y-4 p-4 bg-amber-50 dark:bg-amber-900/20 rounded-xl border border-amber-200 dark:border-amber-800">
              <p className="text-sm font-medium text-amber-700 dark:text-amber-400">
                🌍 地震相關資訊
              </p>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    建築樓層數
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={disasterFields.floorCount || ''}
                    onChange={(e) =>
                      setDisasterFields((prev) => ({
                        ...prev,
                        floorCount: parseInt(e.target.value) || undefined,
                      }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                    placeholder="例：5"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                    建築類型
                  </label>
                  <select
                    value={disasterFields.buildingType || ''}
                    onChange={(e) =>
                      setDisasterFields((prev) => ({ ...prev, buildingType: e.target.value }))
                    }
                    className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                  >
                    <option value="">請選擇</option>
                    <option value="residential">住宅</option>
                    <option value="commercial">商業</option>
                    <option value="industrial">工業</option>
                    <option value="school">學校</option>
                    <option value="hospital">醫院</option>
                  </select>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="isTrapped"
                  checked={disasterFields.isTrapped || false}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, isTrapped: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="isTrapped" className="text-sm text-slate-600 dark:text-slate-400">
                  有人員受困
                </label>
              </div>
            </div>
          )}

          {currentDisasterType === 'fire' && (
            <div className="space-y-4 p-4 bg-orange-50 dark:bg-orange-900/20 rounded-xl border border-orange-200 dark:border-orange-800">
              <p className="text-sm font-medium text-orange-700 dark:text-orange-400">
                🔥 火災相關資訊
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  火源類型
                </label>
                <select
                  value={disasterFields.fireSource || ''}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, fireSource: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                >
                  <option value="">請選擇</option>
                  <option value="electrical">電氣火災</option>
                  <option value="gas">瓦斯火災</option>
                  <option value="chemical">化學火災</option>
                  <option value="wildfire">野火</option>
                  <option value="other">其他</option>
                </select>
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="hasHazardousMaterial"
                  checked={disasterFields.hasHazardousMaterial || false}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({
                      ...prev,
                      hasHazardousMaterial: e.target.checked,
                    }))
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label
                  htmlFor="hasHazardousMaterial"
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  現場有危險物質
                </label>
              </div>
            </div>
          )}

          {currentDisasterType === 'storm' && (
            <div className="space-y-4 p-4 bg-slate-100 dark:bg-slate-800/50 rounded-xl border border-slate-300 dark:border-slate-700">
              <p className="text-sm font-medium text-slate-700 dark:text-slate-300">
                🌪️ 風災相關資訊
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  損壞類型
                </label>
                <select
                  value={disasterFields.windDamageType || ''}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, windDamageType: e.target.value }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                >
                  <option value="">請選擇</option>
                  <option value="roof">屋頂損壞</option>
                  <option value="tree">樹木倒塌</option>
                  <option value="signboard">招牌掉落</option>
                  <option value="powerline">電線斷裂</option>
                  <option value="structure">結構損壞</option>
                </select>
              </div>
            </div>
          )}

          {currentDisasterType === 'flood' && (
            <div className="space-y-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-xl border border-blue-200 dark:border-blue-800">
              <p className="text-sm font-medium text-blue-700 dark:text-blue-400">
                🌊 水災相關資訊
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  水位高度 (公分)
                </label>
                <input
                  type="number"
                  min={0}
                  value={disasterFields.waterLevel || ''}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({
                      ...prev,
                      waterLevel: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                  placeholder="例：50"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="needBoat"
                  checked={disasterFields.needBoat || false}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, needBoat: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label htmlFor="needBoat" className="text-sm text-slate-600 dark:text-slate-400">
                  需要船隻救援
                </label>
              </div>
            </div>
          )}

          {currentDisasterType === 'pandemic' && (
            <div className="space-y-4 p-4 bg-purple-50 dark:bg-purple-900/20 rounded-xl border border-purple-200 dark:border-purple-800">
              <p className="text-sm font-medium text-purple-700 dark:text-purple-400">
                🦠 疫情相關資訊
              </p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  出現症狀人數
                </label>
                <input
                  type="number"
                  min={0}
                  value={disasterFields.symptomCount || ''}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({
                      ...prev,
                      symptomCount: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                  placeholder="例：3"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="contactTracing"
                  checked={disasterFields.contactTracing || false}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, contactTracing: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label
                  htmlFor="contactTracing"
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  需要接觸追蹤
                </label>
              </div>
            </div>
          )}

          {currentDisasterType === 'war' && (
            <div className="space-y-4 p-4 bg-red-50 dark:bg-red-900/20 rounded-xl border border-red-200 dark:border-red-800">
              <p className="text-sm font-medium text-red-700 dark:text-red-400">⚔️ 戰爭相關資訊</p>
              <div>
                <label className="block text-xs font-medium text-slate-600 dark:text-slate-400 mb-1">
                  傷亡人數
                </label>
                <input
                  type="number"
                  min={0}
                  value={disasterFields.injuredCount || ''}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({
                      ...prev,
                      injuredCount: parseInt(e.target.value) || undefined,
                    }))
                  }
                  className="w-full px-3 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm outline-none dark:text-white"
                  placeholder="例：5"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="needEvacuation"
                  checked={disasterFields.needEvacuation || false}
                  onChange={(e) =>
                    setDisasterFields((prev) => ({ ...prev, needEvacuation: e.target.checked }))
                  }
                  className="w-4 h-4 rounded border-slate-300"
                />
                <label
                  htmlFor="needEvacuation"
                  className="text-sm text-slate-600 dark:text-slate-400"
                >
                  需要緊急撤離
                </label>
              </div>
            </div>
          )}

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-white hover:text-black font-medium cursor-pointer"
            >
              送出回報
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
