"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore"; // Added import for useUIStore
import { useMemo } from "react";
import { MapPin, X } from "lucide-react";

export function TaskListPanel() {
  const { searchQuery, filters, setSelectedTaskId, selectedTaskId, setSearchQuery, setFilters, getFilteredTasks } = useTaskStore();
  const { currentUserRole } = useUIStore();

  const filteredTasks = useMemo(
    () => getFilteredTasks(currentUserRole),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, filters, currentUserRole]
  );

  const hasActiveFilters = searchQuery || filters.type !== 'all' || filters.urgency !== 'all' || filters.status !== 'all' || filters.timeRange !== 'all' || filters.assignee !== 'all';

  if (!hasActiveFilters && filteredTasks.length > 0) {
    return null;
  }

  return (
    <div className="absolute top-[280px] md:top-[280px] left-4 right-4 md:right-auto md:w-80 bottom-4 z-[1000] pointer-events-none flex flex-col gap-2 animate-in slide-in-from-left-8 duration-300">
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl flex-1 overflow-hidden flex flex-col pointer-events-auto">
        <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 tracking-wide">搜尋與篩選結果 ({filteredTasks.length})</h2>
          <button
            onClick={() => {
              setSearchQuery("");
              setFilters({ type: 'all', urgency: 'all', status: 'all', timeRange: 'all', assignee: 'all' });
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>
        <div className="overflow-y-auto flex-1 p-2 space-y-2 no-scrollbar">
          {filteredTasks.length === 0 ? (
            <p className="text-sm text-slate-500 p-4 text-center">找不到符合的任務</p>
          ) : (
            filteredTasks.map(task => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{task.type === 'fire' ? '🔥' : task.type === 'rescue' ? '🚨' : '📍'}</span>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1">{task.title}</h3>
                </div>
                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">{task.description}</p>
                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{task.lat.toFixed(4)}, {task.lng.toFixed(4)}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
