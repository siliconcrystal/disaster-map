"use client";

import { useState, useEffect, useRef } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Pin, ChevronUp, Megaphone } from "lucide-react";

export function AreaSummaryCard() {
  const { tasks, setMapCenter, setMapZoom, setSelectedTaskId } = useTaskStore();
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [manualExpand, setManualExpand] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // 手機版自動收起 8 秒（非手動展開才收）
  useEffect(() => {
    if (!isCollapsed && !manualExpand && window.innerWidth < 768) {
      timerRef.current = setTimeout(() => {
        setIsCollapsed(true);
      }, 8000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [isCollapsed, manualExpand]);

  const handlePinClick = (type: string) => {
    const task = tasks.find(t => t.type === type);
    if (task) {
      setMapCenter([task.lat, task.lng]);
      setMapZoom(16);
      setSelectedTaskId(task.id);
      if (window.innerWidth < 768) setIsCollapsed(true);
    } else {
      alert("目前畫面上無此類型任務可定位");
    }
  };

  // 收起狀態 → 按鈕
  if (isCollapsed) {
    return (
      <button
        onClick={() => {
          setIsCollapsed(false);
          setManualExpand(true);
        }}
        className="
          absolute top-[132px] left-5 z-[1000]
          w-11 h-11
          rounded-2xl
          bg-white/95 dark:bg-slate-800 backdrop-blur
           border border-slate-100/50 dark:border-slate-800
          shadow-[0_2px_12px_rgba(0,0,0,0.08)]
          flex items-center justify-center
          transition-all duration-500 ease-in-out
          hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200
        "
      >
        <Megaphone className="w-5 h-5 text-slate-700 dark:text-slate-300" />
      </button>
    );
  }

  // 展開卡片
  return (
    <div
      className={`absolute top-[136px] left-4 right-20 md:left-5 md:right-auto z-[1000] pointer-events-auto md:w-full md:max-w-[340px] 
        backdrop-blur rounded-xl shadow-l transition-all duration-500 ease-in-out overflow-hidden p-2`}
      style={{
        transitionProperty: "all",
        transformOrigin: "top",
      }}
    >
      {/* header */}
      <div
        className="flex items-center justify-between cursor-pointer px-1"
        onClick={() => {
          setIsCollapsed(true);
          setManualExpand(false);
        }}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🏛️</span>
          <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-500 tracking-wide">
            台南災害應變中心
          </h2>
          <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors ml-1">
            公告
          </button>
        </div>
        <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronUp className="w-4 h-4 text-slate-400" />
        </button>
      </div>

      {/* content */}
      <div
        className={`transition-all duration-500 ease-in-out origin-top ${isCollapsed ? 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100 mt-2 pointer-events-auto'} grid`}
      >
        <div className="overflow-hidden px-1 pb-1">
          <p className="text-[11px] text-slate-500 dark:text-slate-500 font-medium tracking-wide mb-3">
            任務總數：{tasks.length} | 以搜救、物資需求為主要任務
          </p>

          <div className="flex flex-wrap gap-1.5">
            <div
              onClick={() => handlePinClick('fire')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/40 dark:bg-slate-800/40 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Pin className="w-3 h-3 text-red-600 fill-red-600 rotate-45 transform -scale-x-100" />
              <span>🔥 中西區民宅火災</span>
            </div>
            <div
              onClick={() => handlePinClick('rescue')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/40 dark:bg-slate-800/40 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Pin className="w-3 h-3 text-red-600 fill-red-600 rotate-45 transform -scale-x-100" />
              <span>🚨 永康區搜救行動</span>
            </div>
            <div
              onClick={() => handlePinClick('supply')}
              className="flex items-center gap-1 px-2.5 py-1 bg-white/40 dark:bg-slate-800/40 rounded-full text-[11px] font-bold text-slate-800 dark:text-slate-100 transition-colors cursor-pointer hover:bg-slate-200 dark:hover:bg-slate-700"
            >
              <Pin className="w-3 h-3 text-red-600 fill-red-600 rotate-45 transform -scale-x-100" />
              <span>📦 北區物資發放點</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
