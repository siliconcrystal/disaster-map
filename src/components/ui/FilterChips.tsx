"use client";

import { useState, useRef, useEffect } from "react";
import { createPortal } from "react-dom";
import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { ChevronDown, SlidersHorizontal, Calendar as CalendarIcon } from "lucide-react";
import { TaskType, Urgency, Status, TimeRange } from "@/types/task";
import { CalendarRangePicker } from "./CalendarRangePicker";

const ASSIGNEE_OPTIONS = [
  { label: '全部任務', value: 'all' },
  { label: '我的角色任務', value: 'my_role' },
  { label: '指派給我的任務', value: 'assigned' },
];

const TYPE_OPTIONS: { label: string, value: TaskType | 'all' }[] = [
  { label: '全部', value: 'all' },
  { label: '🔥火災', value: 'fire' },
  { label: '🚨搜救', value: 'rescue' },
  { label: '🚧危險區域', value: 'danger' },
  { label: '👥人員統計', value: 'people' },
  { label: '⛑️建築檢查', value: 'inspection' },
  { label: '🚑醫療', value: 'medical' },
  { label: '📦物資', value: 'supply' },
  { label: '🪏清理淤泥', value: 'cleanup' },
  { label: '🚜重型機具', value: 'heavy' },
  { label: '🔧水電', value: 'utility' },
  { label: '💪人力支援', value: 'support' },
  { label: '🛵協助運送', value: 'transport' },
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

export function FilterDropdown({ 
  label, value, options, onChange, requiresAuthValues = []
}: { 
  label: string;
  value: string;
  options: {label: string, value: string}[];
  onChange: (val: string) => void;
  requiresAuthValues?: string[];
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [showCustomPicker, setShowCustomPicker] = useState(false);
  const [tempDateTS, setTempDateTS] = useState<{start: number | null, end: number | null}>({ start: null, end: null });
  const [position, setPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const { currentUserRole } = useUIStore();
  const { filters, setFilters } = useTaskStore();

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (
        buttonRef.current && !buttonRef.current.contains(e.target as Node) &&
        dropdownRef.current && !dropdownRef.current.contains(e.target as Node)
      ) {
        setIsOpen(false);
      }
    }
    function handleScroll(e: Event) {
      if (dropdownRef.current && dropdownRef.current.contains(e.target as Node)) return;
      setIsOpen(false);
    }
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      window.addEventListener("scroll", handleScroll, true);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      window.removeEventListener("scroll", handleScroll, true);
    };
  }, [isOpen]);

  const toggleOpen = () => {
    if (!isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setPosition({ top: rect.bottom + 8, left: rect.left });
      setShowCustomPicker(false);
    }
    setIsOpen(!isOpen);
  };

  const selectedLabel = options.find(o => o.value === value)?.label || label;
  
  // Clean emojis if label is prepended (fallback for visual)
  const displayLabel = selectedLabel.replace(/[^\u4E00-\u9FA5a-zA-Z0-9\s]/g, '').trim();

  const handleSelect = (val: string) => {
    if (requiresAuthValues.includes(val) && !currentUserRole) {
      alert("此功能需要登入，請點擊右上角頭像進行登入。");
      setIsOpen(false);
      return;
    }
    if (val === 'custom') {
      setShowCustomPicker(true);
      return;
    }
    onChange(val);
    setIsOpen(false);
  };

  const handleCustomSubmit = () => {
    setFilters({ 
      timeRange: 'custom', 
      customTimeRange: { start: tempDateTS.start, end: tempDateTS.end } 
    });
    setIsOpen(false);
  };

  const isSelectedStyle = value !== 'all';
  const buttonClass = isSelectedStyle 
      ? 'bg-blue-50/80 border-blue-200/80 text-blue-700/80 dark:bg-blue-900/80 dark:border-blue-800/80 dark:text-blue-300/80'
      : 'bg-white/80 dark:bg-slate-900/80 border-slate-100/80 dark:border-slate-800/80 text-[#3c4043] dark:text-slate-300/80 hover:bg-slate-50/80 dark:hover:bg-slate-800/80';

  return (
    <>
      <button 
        ref={buttonRef}
        onClick={toggleOpen}
        className={`flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-full shadow-sm border text-[13px] font-medium transition-all outline-none pointer-events-auto ${buttonClass}`}
      >
        <span className="tracking-wide">
          {value === 'all' ? label : displayLabel}
        </span>
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${isOpen ? 'rotate-180':''} text-slate-400`} strokeWidth={2.5} />
      </button>
      
      {isOpen && typeof document !== 'undefined' && createPortal(
        <>
          {/* Backdrop to catch clicks and provide focus */}
          <div 
            className="fixed inset-0 z-[2999] bg-transparent pointer-events-auto"
            onClick={() => setIsOpen(false)}
          />
          <div 
            ref={dropdownRef}
            style={{ 
              top: position.top, 
              left: Math.min(position.left, typeof window !== 'undefined' ? window.innerWidth - 200 : position.left) 
            }}
            className="fixed min-w-[160px] bg-white dark:bg-slate-800 rounded-2xl shadow-[0_10px_40px_rgba(0,0,0,0.1)] border border-slate-100 dark:border-slate-700 overflow-hidden z-[3000] py-2 pointer-events-auto animate-in fade-in zoom-in-95 duration-200"
          >
            <div className="px-3 pb-1.5 mb-1.5 border-b border-slate-50 dark:border-slate-700/50">
              <span className="text-[11px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                篩選：{label}
              </span>
            </div>
            <div className="max-h-[60vh] overflow-y-auto no-scrollbar">
              {showCustomPicker ? (
                <div className="p-2 space-y-4">
                  <CalendarRangePicker 
                    startDate={tempDateTS.start}
                    endDate={tempDateTS.end}
                    onSelect={(start, end) => setTempDateTS({ start, end })}
                  />
                  <div className="flex gap-2 px-4 pb-4">
                    <button 
                      onClick={() => setShowCustomPicker(false)}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-[13px] font-bold text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all active:scale-95"
                    >
                      返回
                    </button>
                    <button 
                      onClick={handleCustomSubmit}
                      disabled={!tempDateTS.start}
                      className="flex-1 py-2.5 rounded-xl border border-slate-200 dark:bg-slate-100 text-slate-600 dark:text-slate-900 text-[13px] font-bold transition-all active:scale-95 disabled:opacity-50"
                    >
                      套用
                    </button>
                  </div>
                </div>
              ) : (
                options.map(o => {
                  const isSelected = value === o.value;
                  return (
                    <button
                      key={o.value}
                      onClick={() => handleSelect(o.value)}
                      className={`w-full text-left px-4 py-2.5 text-[14px] font-medium transition-all outline-none flex items-center justify-between ${isSelected ? 'bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400' : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50'}`}
                    >
                      <span>{o.label}</span>
                      {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]" />}
                    </button>
                  );
                })
              )}
            </div>
          </div>
        </>,
        document.body
      )}
    </>
  );
}

export function FilterChips() {
  const { filters, setFilters } = useTaskStore();
  const { setAdvancedFilterOpen } = useUIStore();

  return (
    <div className="absolute top-[84px] left-5 right-5 md:right-auto z-[1000] pointer-events-none">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-4 pt-1 max-w-full pl-1">
        
        <FilterDropdown 
          label="全部任務" 
          value={filters.assignee || 'all'} 
          options={ASSIGNEE_OPTIONS} 
          onChange={(val) => setFilters({ assignee: val as 'all' | 'my_role' | 'assigned' })} 
          requiresAuthValues={['assigned']}
        />

        <FilterDropdown 
          label="類型" 
          value={filters.type} 
          options={TYPE_OPTIONS} 
          onChange={(val) => setFilters({ type: val as TaskType | 'all' })} 
        />
        
        <FilterDropdown 
          label="緊急程度" 
          value={filters.urgency} 
          options={URGENCY_OPTIONS} 
          onChange={(val) => setFilters({ urgency: val as Urgency | 'all' })} 
        />

        <FilterDropdown 
          label="狀態" 
          value={filters.status} 
          options={STATUS_OPTIONS} 
          onChange={(val) => setFilters({ status: val as Status | 'all' })} 
        />

        <FilterDropdown 
          label="時間" 
          value={filters.timeRange} 
          options={TIME_RANGE_OPTIONS} 
          onChange={(val) => setFilters({ timeRange: val as TimeRange })} 
        />

        <button 
          onClick={() => setAdvancedFilterOpen(true)}
          className="flex-shrink-0 flex items-center gap-1.5 px-2 py-1.5 rounded-full bg-white/80 dark:bg-slate-900/80 shadow-sm border border-slate-100/80 dark:border-slate-800/80 text-[13px] font-medium text-[#3c4043] dark:text-slate-300 hover:bg-slate-50/80 dark:hover:bg-slate-800/80 transition-colors pointer-events-auto"
        >
          <SlidersHorizontal className="w-3.5 h-3.5 text-slate-500" />
          進階
        </button>

      </div>
    </div>
  );
}
