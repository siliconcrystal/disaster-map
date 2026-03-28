'use client';

import { LocationPickerMap } from '@/components/map/LocationPickerMap';
import { generateMockTask, useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import { TaskType, Urgency } from '@/types/task';
import { Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';

export function TaskCreateModal() {
  const {
    isTaskCreateOpen,
    setTaskCreateOpen,
    newTaskCoords,
    setSelectedMapLocation,
    resolvedAddress,
    setResolvedAddress,
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
    });

    addTask(newTaskMockData);

    setTaskCreateOpen(false);
    setSelectedMapLocation(null);
    setResolvedAddress(null);
    setTitle('');
    setDescription('');
    setAddress('');
    setSearchInput('');
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
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/20 pointer-events-auto">
      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 rounded-none sm:rounded-2xl shadow-2xl overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">建立新任務</h2>
          <button
            onClick={() => setTaskCreateOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
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
                <option value="fire">🔥 火災</option>
                <option value="rescue">🚨 搜救</option>
                <option value="danger">🚧 危險區域</option>
                <option value="people:">👥 人員統計</option>
                <option value="inspection">⛑️ 建築檢查</option>
                <option value="medical">🚑 醫療</option>
                <option value="supply">📦 物資</option>
                <option value="cleanup">🪏 清理淤泥</option>
                <option value="heavy">🚜 重型機具</option>
                <option value="utility">🔧 水電</option>
                <option value="support">💪 人力支援</option>
                <option value="transport">🛵 協助運送</option>
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
