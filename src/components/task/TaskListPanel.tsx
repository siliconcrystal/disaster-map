'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import { MapPin, User, X } from 'lucide-react';
import { useMemo } from 'react';

const TYPE_EMOJI: Record<string, string> = {
  fire: '🔥',
  rescue: '🚨',
  danger: '🚧',
  people: '👥',
  inspection: '⛑️',
  medical: '🚑',
  supply: '📦',
  cleanup: '🪏',
  heavy: '🚜',
  utility: '🔧',
  support: '💪',
  transport: '🛵',
};

export function TaskListPanel() {
  const {
    tasks,
    searchQuery,
    filters,
    setSelectedTaskId,
    setSearchQuery,
    setFilters,
    getFilteredTasks,
    isMyTask,
  } = useTaskStore();

  const { currentUserRole } = useUIStore();

  const filteredTasks = useMemo(
    () => getFilteredTasks(currentUserRole),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, filters, currentUserRole, tasks],
  );

  const hasActiveFilters =
    searchQuery ||
    filters.type !== 'all' ||
    filters.urgency !== 'all' ||
    filters.status !== 'all' ||
    filters.timeRange !== 'all' ||
    filters.assignee !== 'all';

  if (!hasActiveFilters && filteredTasks.length > 0) {
    return null;
  }

  return (
    <div
      className="
        fixed inset-0 md:absolute md:top-[360px]
        left-0 right-0 md:left-4 md:right-auto md:w-86
        z-[1000]
        flex items-end md:items-start justify-center md:justify-start
        pointer-events-none
        md:bg-transparent
      "
    >
      <div
        className="
          w-full md:w-auto
          h-[50vh] md:h-[55vh]
          bg-white dark:bg-slate-900
          rounded-t-2xl md:rounded-2xl
          shadow-xl
          flex flex-col
          pointer-events-auto
          animate-in slide-in-from-bottom-full md:slide-in-from-left-8 duration-300
        "
      >
        {/* Sheet Handle (mobile only) */}
        <div className="flex justify-center py-2 md:hidden">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="p-3.5 px-4 border-b border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 rounded-t-2xl flex justify-between items-center">
          <h2 className="font-semibold text-slate-800 dark:text-slate-200 tracking-wide">
            搜尋與篩選結果 ({filteredTasks.length})
          </h2>
          <button
            onClick={() => {
              setSearchQuery('');
              setFilters({
                type: 'all',
                urgency: 'all',
                status: 'all',
                timeRange: 'all',
                assignee: 'all',
              });
            }}
            className="p-1.5 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
          >
            <X className="w-4 h-4" strokeWidth={2.5} />
          </button>
        </div>

        {/* List */}
        <div className="overflow-y-auto flex-1 p-2 space-y-2 no-scrollbar">
          {filteredTasks.length === 0 ? (
            <p className="text-sm text-slate-500 p-4 text-center">找不到符合的任務</p>
          ) : (
            filteredTasks.map((task) => (
              <button
                key={task.id}
                onClick={() => setSelectedTaskId(task.id)}
                className="w-full text-left p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors border border-transparent hover:border-slate-200 dark:hover:border-slate-700 group"
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xl">{TYPE_EMOJI[task.type] || '📍'}</span>
                  <h3 className="font-medium text-slate-800 dark:text-slate-200 line-clamp-1 flex-1">
                    {task.title}
                  </h3>
                  {isMyTask(task.id) && (
                    <span className="flex items-center gap-1 px-2 py-0.5 text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-full shrink-0">
                      <User className="w-3 h-3" />
                      我的任務
                    </span>
                  )}
                </div>

                <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-2">
                  {task.description}
                </p>

                <div className="flex items-center gap-1 text-[10px] text-slate-400">
                  <MapPin className="w-3 h-3" />
                  <span>{task.address}</span>
                </div>
              </button>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
