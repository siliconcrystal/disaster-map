"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { useMemo } from "react";
import { Task } from "@/types/task";
import { MapPin } from "lucide-react";

const TYPE_EMOJI: Record<string, string> = {
  fire: "🔥",
  rescue: "🚨",
  danger: "🚧",
  people: "👥",
  inspection: "⛑️",
  medical: "🚑",
  supply: "📦",
  cleanup: "🪏",
  heavy: "🚜",
  utility: "🔧",
  support: "💪",
  transport: "🛵"
};


const TaskCard = ({ task }: { task: Task }) => {
  const { setSelectedTaskId } = useTaskStore();
  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-lg
      dark:shadow-none border border-slate-200
      dark:border-slate-700 cursor-pointer
       hover:bg-slate-50
       dark:hover:bg-slate-700/50 transition-all group"
    >
      <div className="flex items-center gap-2 mb-2">
        <span className="text-xl"> {TYPE_EMOJI[task.type] || '📍'}</span>
        <h3 className="font-bold text-slate-800 dark:text-slate-100 line-clamp-1">{task.title}</h3>
      </div>
      <p className="text-sm text-slate-500 dark:text-slate-400 line-clamp-2 mb-1 leading-relaxed">{task.description}</p>
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1 text-[11px] font-medium text-slate-400 dark:text-slate-500">
          <MapPin className="w-3.5 h-3.5" />
          {task.address}
        </div>
        <div className={`px-2 py-1 rounded-md text-[10px] font-bold uppercase tracking-wider ${task.urgency === 'high' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400' : task.urgency === 'medium' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'}`}>
          {task.urgency === 'high' ? '緊急' : task.urgency === 'medium' ? '中等' : '一般'}
        </div>
      </div>
    </div>
  );
};

export function BoardView() {
  const { tasks, getFilteredTasks, searchQuery, filters } = useTaskStore();
  const { currentUserRole } = useUIStore();

  const filteredTasks = useMemo(
    () => getFilteredTasks(currentUserRole),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [searchQuery, filters, currentUserRole, tasks]
  );

  const columns = [
    { id: 'reported', label: '已回報' },
    { id: 'recruiting', label: '招募中' },
    { id: 'in_progress', label: '進行中' },
    { id: 'done', label: '已完成' },
  ];

  return (
    <div className="w-full h-full pt-[140px] pb-6 px-6 overflow-x-auto no-scrollbar bg-slate-50/50 dark:bg-[#0b1120]">
      <div className="flex gap-6 h-full min-w-max">
        {columns.map(col => {
          const colTasks = filteredTasks.filter(t => t.status === col.id);
          return (
            <div key={col.id} className="w-[320px] flex flex-col h-full bg-slate-100/50 dark:bg-slate-900/50 rounded-2xl p-4 border border-slate-200/50 dark:border-slate-800/50">
              <div className="flex items-center justify-between mb-4 px-1">
                <h2 className="text-[16px] font-bold text-slate-700 dark:text-slate-200 tracking-wide">{col.label}</h2>
                <div className="bg-slate-300 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] font-black px-2.5 py-1 rounded-full">{colTasks.length}</div>
              </div>

              <div className="flex-1 overflow-y-auto no-scrollbar space-y-3 pb-4">
                {colTasks.length === 0 ? (
                  <div className="h-24 flex items-center justify-center border-2 border-dashed border-slate-200 dark:border-slate-800 rounded-xl">
                    <span className="text-sm font-medium text-slate-400">目前無任務</span>
                  </div>
                ) : (
                  colTasks.map(task => <TaskCard key={task.id} task={task} />)
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
