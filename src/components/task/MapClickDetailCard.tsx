'use client';

import { useUIStore } from '@/store/useUIStore';
import { Loader2, MapPin, Plus, X } from 'lucide-react';
import { useEffect, useRef, useState } from 'react';

async function reverseGeocode(lat: number, lng: number): Promise<string> {
  const res = await fetch(
    `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&accept-language=zh-TW`,
    { headers: { 'Accept-Language': 'zh-TW,zh;q=0.9' } },
  );
  const data = await res.json();
  if (data?.address) {
    const a = data.address;
    const parts = [
      a.state || a.county,
      a.city || a.town || a.village,
      a.suburb || a.neighbourhood,
      a.road || a.pedestrian,
      a.house_number,
    ].filter(Boolean);
    return parts.length > 0 ? parts.join('') : data.display_name || '';
  }
  return `${lat.toFixed(6)}, ${lng.toFixed(6)}`;
}

export function MapClickDetailCard() {
  const {
    selectedMapLocation,
    setSelectedMapLocation,
    setTaskCreateOpen,
    resolvedAddress,
    setResolvedAddress,
  } = useUIStore();

  const [isLoading, setIsLoading] = useState(false);
  const lastFetchTime = useRef<number>(0);
  const throttleTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    if (!selectedMapLocation) return;

    const [lat, lng] = selectedMapLocation;
    const now = Date.now();
    const elapsed = now - lastFetchTime.current;
    const delay = Math.max(0, 1000 - elapsed);

    // 清掉上一個 pending 的 throttle timers
    if (throttleTimer.current) clearTimeout(throttleTimer.current);
    abortRef.current?.abort();

    setIsLoading(true);
    setResolvedAddress(null);

    throttleTimer.current = setTimeout(async () => {
      const controller = new AbortController();
      abortRef.current = controller;
      lastFetchTime.current = Date.now();

      try {
        const address = await reverseGeocode(lat, lng);
        if (!controller.signal.aborted) {
          setResolvedAddress(address);
        }
      } catch {
        if (!controller.signal.aborted) {
          setResolvedAddress(`${lat.toFixed(6)}, ${lng.toFixed(6)}`);
        }
      } finally {
        if (!controller.signal.aborted) {
          setIsLoading(false);
        }
      }
    }, delay);

    return () => {
      if (throttleTimer.current) clearTimeout(throttleTimer.current);
      abortRef.current?.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedMapLocation]);

  if (!selectedMapLocation) return null;

  const handleCreateTask = () => {
    setTaskCreateOpen(true, selectedMapLocation);
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-end justify-center sm:pb-8 pointer-events-none sm:bg-transparent transition-all">
      <div className="relative w-full h-fit sm:h-auto sm:max-h-[85vh] sm:w-[380px] bg-white dark:bg-slate-900 sm:rounded-2xl rounded-t-3xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-bottom-8 duration-300 flex flex-col pointer-events-auto">
        {/* Sheet Handle (mobile only) */}
        <div className="flex justify-center py-2 md:hidden">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 min-h-[60px]">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <MapPin className="w-4 h-4 text-blue-500 shrink-0" />
            {isLoading ? (
              <div className="flex items-center gap-2 text-slate-400">
                <Loader2 className="w-4 h-4 animate-spin" />
                <span className="text-sm">解析地址中…</span>
              </div>
            ) : (
              <h2
                className="text-sm font-semibold text-slate-800 dark:text-slate-100 truncate flex-wrap"
                title={resolvedAddress ?? ''}
              >
                {resolvedAddress ??
                  `${selectedMapLocation[0].toFixed(6)}, ${selectedMapLocation[1].toFixed(6)}`}
              </h2>
            )}
          </div>
          <button
            onClick={() => setSelectedMapLocation(null)}
            className="cursor-pointer ml-2 p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-400" />
          </button>
        </div>

        <div className="p-4 flex-1 overflow-y-auto space-y-4">
          <div className="text-sm font-mono text-slate-600 dark:text-slate-400 bg-slate-100 dark:bg-slate-800 p-3 rounded-xl border border-slate-200 dark:border-slate-700 flex justify-between items-center">
            <span>
              {selectedMapLocation[0].toFixed(6)}, {selectedMapLocation[1].toFixed(6)}
            </span>
          </div>
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button
            onClick={handleCreateTask}
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30"
          >
            <Plus className="w-5 h-5" />
            新增任務卡
          </button>
        </div>
      </div>
    </div>
  );
}
