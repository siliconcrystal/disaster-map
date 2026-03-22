"use client";

import { useState } from "react";
import { useTaskStore } from "@/store/useTaskStore";
import { Pin, ChevronUp } from "lucide-react";

export function AreaSummaryCard() {
  const { tasks, setMapCenter, setMapZoom, setSelectedTaskId } = useTaskStore();
  const [isCollapsed, setIsCollapsed] = useState(false);

  const handlePinClick = (type: string) => {
    const task = tasks.find(t => t.type === type);
    if (task) {
      setMapCenter([task.lat, task.lng]);
      setMapZoom(16);
      setSelectedTaskId(task.id);
    } else {
      alert("目前畫面上無此類型任務可定位");
    }
  };

  return (
    <div className={`absolute top-[136px] left-4 right-20 md:left-5 md:right-auto z-[1000] pointer-events-auto md:w-full md:max-w-[340px] bg-white/20 border border-white backdrop-blur dark:bg-slate-900/50 dark:border-slate-800/80 backdrop-blur rounded-xl shadow-l transition-all duration-300 overflow-hidden p-2`}>
      <div
        className="flex items-center justify-between cursor-pointer px-1"
        onClick={() => setIsCollapsed(!isCollapsed)}
      >
        <div className="flex items-center gap-1.5">
          <span className="text-lg">🏛️</span>
          <h2 className="text-[15px] font-bold text-slate-800 dark:text-slate-100 tracking-wide">台南災害應變中心</h2>
          <button className="flex items-center gap-1 px-2 py-0.5 rounded-lg bg-red-50 dark:bg-red-500/10 text-red-600 dark:text-red-400 text-[10px] font-bold border border-red-100 dark:border-red-500/20 hover:bg-red-100 dark:hover:bg-red-500/20 transition-colors ml-1">
            <span className="relative flex h-1.5 w-1.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-red-500"></span>
            </span>
            公告
          </button>
        </div>
        <button className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
          <ChevronUp className={`w-4 h-4 text-slate-400 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`} />
        </button>
      </div>

      <div
        className={`transition-all duration-300 ease-in-out origin-top ${isCollapsed ? 'grid-rows-[0fr] opacity-0 mt-0 pointer-events-none' : 'grid-rows-[1fr] opacity-100 mt-2 pointer-events-auto'} grid`}
      >
        <div className="overflow-hidden px-1 pb-1">
          <p className="text-[11px] text-slate-500 dark:text-slate-200 font-medium tracking-wide mb-3">
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
