'use client';

import { useUIStore } from '@/store/useUIStore';
import { MapPin, Plus, X } from 'lucide-react';

export function MapClickDetailCard() {
  const { selectedMapLocation, setSelectedMapLocation, setTaskCreateOpen } = useUIStore();

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

        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-blue-500" />
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100">選定位置</h2>
          </div>
          <button
            onClick={() => setSelectedMapLocation(null)}
            className="cursor-pointer m-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
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
            className="cursor-pointer w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-medium transition-colors shadow-lg shadow-blue-500/30 justify-center"
          >
            <Plus className="w-5 h-5" />
            新增任務卡
          </button>
        </div>
      </div>
    </div>
  );
}
