"use client";

import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useEffect, useRef } from "react";
import { X } from "lucide-react";
import { TaskType, Urgency, Status, TimeRange } from "@/types/task";
import { CalendarRangePicker } from "./CalendarRangePicker";

const TYPE_OPTIONS: { label: string, value: TaskType | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '🔥 火災', value: 'fire' },
  { label: '🚨 搜救', value: 'rescue' },
  { label: '🚧 危險區域', value: 'danger' },
  { label: '👥 人員統計', value: 'people' },
  { label: '⛑️ 建築檢查', value: 'inspection' },
  { label: '🚑 醫療', value: 'medical' },
  { label: '📦 物資', value: 'supply' },
  { label: '🪏 清理淤泥', value: 'cleanup' },
  { label: '🚜 重型機具', value: 'heavy' },
  { label: '🔧 水電', value: 'utility' },
  { label: '💪 人力支援', value: 'support' },
  { label: '🛵 協助運送', value: 'transport' },
];

const URGENCY_OPTIONS: { label: string, value: Urgency | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '緊急', value: 'high' },
  { label: '中等', value: 'medium' },
  { label: '一般', value: 'low' },
];

const STATUS_OPTIONS: { label: string, value: Status | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '已回報', value: 'reported' },
  { label: '招募中', value: 'recruiting' },
  { label: '進行中', value: 'in_progress' },
  { label: '已完成', value: 'done' },
];

const TIME_RANGE_OPTIONS: { label: string, value: TimeRange }[] = [
  { label: '全部', value: 'all' },
  { label: '過去 1 小時', value: '1h' },
  { label: '過去 12 小時', value: '12h' },
  { label: '過去 24 小時', value: '24h' },
  { label: '過去 72 小時', value: '72h' },
  { label: '自訂', value: 'custom' },
];

const ASSIGNEE_OPTIONS = [
  { label: '全部任務', value: 'all' },
  { label: '我的角色任務', value: 'my_role' },
  { label: '指派給我的任務', value: 'assigned' },
];

const FilterGroup = ({ title, options, filterKey, requiresAuthValues = [] }: { title: string, options: {label: string, value: string}[], filterKey: "type" | "urgency" | "status" | "timeRange" | "assignee", requiresAuthValues?: string[] }) => {
  const { filters, setFilters } = useTaskStore();
  const calendarRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (filterKey === 'timeRange' && filters.timeRange === 'custom') {
      calendarRef.current?.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  }, [filters.timeRange, filterKey]);

  const handleSelect = (val: string) => {
    if (requiresAuthValues.includes(val)) {
      alert("請登入後使用此功能");
      return;
    }
    setFilters({ [filterKey]: val as any });
  };

  return (
    <div>
      <h3 className="text-[15px] font-bold text-slate-800 dark:text-slate-200 mb-3">{title}</h3>
      <div className="flex flex-wrap gap-2">
        {options.map(o => (
          <button
            key={o.value}
            onClick={() => handleSelect(o.value)}
            className={`px-4 py-2 rounded-xl text-[14px] font-medium transition-colors ${filters[filterKey] === o.value ? 'bg-slate-200 text-slate-800' : 'bg-slate dark:bg-slate-800 border border-slate-200 text-slate-800 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'}`}
          >
            {o.label}
          </button>
        ))}
      </div>
      
      {filterKey === 'timeRange' && filters.timeRange === 'custom' && (
        <div 
          ref={calendarRef}
          className="mt-4 p-2 bg-slate-50 dark:bg-slate-800/50 rounded-2xl flex justify-center animate-in fade-in slide-in-from-top-2 duration-200"
        >
          <CalendarRangePicker 
            startDate={filters.customTimeRange?.start || null}
            endDate={filters.customTimeRange?.end || null}
            onSelect={(start, end) => setFilters({ customTimeRange: { start, end } as any })}
          />
        </div>
      )}
    </div>
  );
};

export function AdvancedFilterModal() {
  const { filters, setFilters, getFilteredTasks } = useTaskStore();
  const { isAdvancedFilterOpen, setAdvancedFilterOpen, currentUserRole } = useUIStore();

  if (!isAdvancedFilterOpen) return null;

  const filteredCount = getFilteredTasks(currentUserRole).length;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center bg-black/20 pointer-events-auto">
      <div className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-t-3xl sm:rounded-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 sm:slide-in-from-bottom-0 sm:zoom-in-95 duration-200 max-h-[90dvh] flex flex-col">
        <div className="flex items-center justify-between p-5 border-b border-slate-100 dark:border-slate-800 shrink-0">
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">進階篩選</h2>
          <button 
            onClick={() => setAdvancedFilterOpen(false)}
            className="p-2 -mr-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-6 h-6 text-slate-500" />
          </button>
        </div>
        
        <div className="p-5 space-y-8 overflow-y-auto overflow-x-hidden flex-1 no-scrollbar">
          <FilterGroup title="全部任務" options={ASSIGNEE_OPTIONS} filterKey="assignee" requiresAuthValues={['assigned']} />
          <FilterGroup title="類型" options={TYPE_OPTIONS} filterKey="type" />
          <FilterGroup title="緊急程度" options={URGENCY_OPTIONS} filterKey="urgency" />
          <FilterGroup title="狀態" options={STATUS_OPTIONS} filterKey="status" />
          <FilterGroup title="時間" options={TIME_RANGE_OPTIONS} filterKey="timeRange" />
        </div>
        
        <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex gap-3 shrink-0 bg-white dark:bg-slate-900">
          <button 
            onClick={() => setFilters({ assignee: 'all', type: 'all', urgency: 'all', status: 'all', timeRange: 'all' })}
            className="flex-1 py-3 rounded-xl border border-slate-300 dark:border-slate-700 text-[15px] font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            重設條件
          </button>
          <button 
            onClick={() => setAdvancedFilterOpen(false)}
            className="flex-[2] py-3 rounded-xl hover:bg-slate-100 text-slate-600 border border-slate-300 text-[15px] font-bold transition-all active:scale-[0.98]"
          >
            顯示結果 ({filteredCount})
          </button>
        </div>
      </div>
    </div>
  );
}
