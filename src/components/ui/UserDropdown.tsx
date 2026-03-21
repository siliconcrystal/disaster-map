"use client";

import { useState, useRef, useEffect } from "react";
import { User, LogIn, LogOut, ChevronRight, ChevronLeft, Check, AlertTriangle, Monitor, Sun, Moon } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import { useTheme } from "next-themes";
import { motion, AnimatePresence } from "framer-motion";

const ROLES = [
  { name: "災民", icon: "🏡" },
  { name: "指揮所", icon: "🎖️" },
  { name: "救難隊", icon: "🆘" },
  { name: "消防隊", icon: "🚒" },
  { name: "醫療團隊", icon: "🚑" },
  { name: "無人機隊伍", icon: "🛸" },
  { name: "在地組織", icon: "🏘️" },
  { name: "線上志工", icon: "💻" },
  { name: "現場志工", icon: "🤝" }
];

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'roles'>('main');
  const { currentUserRole, setCurrentUserRole, setTaskCreateOpen, viewMode, setViewMode } = useUIStore();
  const { mapCenter } = useTaskStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = theme === "system" ? resolvedTheme : theme;

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('main'), 200);
    }
  }, [isOpen]);

  const handleRoleSelect = (role: string) => {
    setCurrentUserRole(role);
    setIsOpen(false);
  };

  const handleLoginToggle = () => {
    if (currentUserRole) {
      setCurrentUserRole(null);
    } else {
      setCurrentUserRole("現場志工");
    }
    setIsOpen(false);
  };

  const handleReportTask = async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTaskCreateOpen(true, [pos.coords.latitude, pos.coords.longitude]);
          setIsOpen(false);
        },
        () => {
          setTaskCreateOpen(true, mapCenter);
          setIsOpen(false);
        }
      );
    } else {
      setTaskCreateOpen(true, mapCenter);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-13 h-13 rounded-full 
        bg-[url('/Avatar.png')] bg-cover bg-center dark:bg-slate-700 bg-cover bg-center 
        border border-white border-1 dark:border-slate-700  
        shadow-xl flex items-center justify-center text-slate-400 dark:text-slate-500 
        hover:text-slate-500 dark:hover:text-slate-300 hover:bg-blue-100/70 dark:hover:bg-slate-700 transition-colors pointer-events-auto  shadow-xl"
      >
        
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="absolute right-0 mt-3 w-[240px] rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-xl overflow-hidden z-[9999] pointer-events-auto flex flex-col"
          >
            {view === 'main' ? (
              <motion.div
                key="main"
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: -20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col py-2"
              >
                <button
                  onClick={() => setView('roles')}
                  className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 outline-none"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 opacity-80 text-slate-600" />
                    <span className="text-[15px] font-medium tracking-wide">切換角色</span>
                  </div>
                  <ChevronRight className="w-4 h-4 opacity-50" />
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-1" />

                <button
                  onClick={handleReportTask}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 outline-none"
                >
                  <AlertTriangle className="w-5 h-5 opacity-80 text-slate-600" />
                  <span className="text-[15px] font-medium tracking-wide">回報任務</span>
                </button>

                <button
                  onClick={() => { setViewMode(viewMode === 'map' ? 'board' : 'map'); setIsOpen(false); }}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 outline-none"
                >
                  <Monitor className="w-5 h-5 opacity-80 text-slate-600" />
                  <span className="text-[15px] font-medium tracking-wide">
                    {viewMode === 'map' ? '切換看板模式' : '切換地圖模式'}
                  </span>
                </button>

                <button
                  onClick={() => setTheme(currentTheme === "dark" ? "light" : "dark")}
                  className="flex items-center justify-between w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200 outline-none"
                >
                  <div className="flex items-center gap-3">
                    {currentTheme === 'dark' ? <Moon className="w-5 h-5 opacity-60 text-slate-500" /> : <Sun className="w-5 h-5 opacity-80 text-slate-600" />}
                    <span className="text-[15px] font-medium tracking-wide">深色主題</span>
                  </div>
                  <div className={`w-10 h-6 flex items-center bg-slate-200 dark:bg-blue-500 rounded-full p-1 transition-colors duration-300`}>
                    <div className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform duration-300 ${currentTheme === 'dark' ? 'translate-x-4' : 'translate-x-0'}`} />
                  </div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-2" />

                <div className="px-5 py-2">
                  <button
                    onClick={handleLoginToggle}
                    className="w-full py-2.5 rounded-xl hover:bg-slate-200 border border-slate-300 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2 text-[14px] font-bold text-slate-800 dark:text-slate-200"
                  >
                    {currentUserRole ? (
                      <><LogOut className="w-4 h-4" /> 登出 </>
                    ) : (
                      <><LogIn className="w-4 h-4" /> 登入 </>
                    )}
                  </button>
                  <p className="text-[11px] text-center text-slate-400 dark:text-slate-500 mt-2.5 font-medium">
                    登入以記住您的設定
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="roles"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col max-h-[400px]"
              >
                <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-800 shrink-0">
                  <button
                    onClick={() => setView('main')}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-500 transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-sm font-bold text-slate-800 dark:text-slate-100 tracking-wide">選擇您的角色</span>
                </div>

                <div className="overflow-y-auto no-scrollbar py-2">
                  {ROLES.map(({ name, icon }) => (
                    <button
                      key={name}
                      onClick={() => handleRoleSelect(name)}
                      className="flex items-center justify-between w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors text-slate-700 dark:text-slate-200"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <span className="text-[15px] font-medium">{name}</span>
                      </div>
                      {currentUserRole === name && <Check className="w-4 h-4 text-[#ff6c00]" strokeWidth={3} />}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
