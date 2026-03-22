"use client";

import { Search } from "lucide-react";
import { useTaskStore } from "@/store/useTaskStore";
import { UserDropdown } from "./UserDropdown";

export function TopBar() {
  const { searchQuery, setSearchQuery } = useTaskStore();

  return (
    <div className="absolute top-5 left-0 right-0 z-[1200] pointer-events-none px-5 flex items-center justify-between">
      {/* Search Input */}
      <div className="relative flex-1 max-w-[460px] shadow-[0_2px_15px_rgba(0,0,0,0.12)] rounded-full bg-white/70 backdrop-blur dark:bg-slate-900/60 border border-slate-100/80 dark:border-slate-800 group pointer-events-auto transition-all">
        <div className="absolute inset-y-0 left-4 flex items-center pointer-events-none">
          <Search
            className="h-[18px] w-[18px] text-slate-400 dark:text-slate-200 group-focus-within:text-blue-400 transition-colors"
            strokeWidth={2.5}
          />
        </div>
        <input
          type="text"
          className="w-full pl-10 pr-4 py-3.5 rounded-full bg-transparent outline-none focus:ring-2 focus:ring-blue-500/50 transition-all text-sm md:text-base tracking-wide text-slate-900 dark:text-slate-100 placeholder:text-slate-400 dark:placeholder:text-slate-200 font-medium"
          placeholder="搜尋任務、地點..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      {/* User Dropdown */}
      <div className="ml-4 flex-shrink-0 pointer-events-auto">
        <UserDropdown />
      </div>
    </div>
  );
}
