'use client';

import { useTaskStore } from '@/store/useTaskStore';
import { useUIStore } from '@/store/useUIStore';
import type { DisasterType } from '@/types/disasterData';
import { AnimatePresence, motion } from 'framer-motion';
import {
  AlertTriangle,
  Check,
  ChevronLeft,
  ChevronRight,
  CloudLightning,
  LogIn,
  LogOut,
  Monitor,
  Moon,
  Sun,
  User,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useRef, useState } from 'react';

const ROLES = [
  { name: '未設定角色', icon: '👤' },
  { name: '指揮所', icon: '🎖️' },
  { name: '災民', icon: '🏡' },
  { name: '救難隊', icon: '🆘' },
  { name: '消防隊', icon: '🚒' },
  { name: '醫療團隊', icon: '🚑' },
  { name: '無人機隊伍', icon: '🛸' },
  { name: '在地組織', icon: '🏘️' },
  { name: '線上志工', icon: '💻' },
  { name: '現場志工', icon: '🤝' },
];

const DISASTER_TYPES: { type: DisasterType; name: string; icon: string }[] = [
  { type: 'earthquake', name: '地震', icon: '🌍' },
  { type: 'fire', name: '火災', icon: '🔥' },
  { type: 'storm', name: '風災', icon: '🌪️' },
  { type: 'flood', name: '水災', icon: '🌊' },
  { type: 'pandemic', name: '疫情', icon: '🦠' },
  { type: 'war', name: '戰爭', icon: '⚔️' },
];

export function UserDropdown() {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<'main' | 'roles' | 'disasters'>('main');

  const {
    currentUserRole,
    setCurrentUserRole,
    setTaskCreateOpen,
    viewMode,
    setViewMode,
    currentDisasterType,
    setCurrentDisasterType,
    isLoggedIn,
    setIsLoggedIn,
  } = useUIStore();

  const { mapCenter, generateDisasterData } = useTaskStore();
  const { theme, setTheme, resolvedTheme } = useTheme();
  const dropdownRef = useRef<HTMLDivElement>(null);

  const currentTheme = theme === 'system' ? resolvedTheme : theme;

  const avatarBg = isLoggedIn ? "bg-[url('/Avatar.png')]" : "bg-[url('/UnloginAvatar.png')]";

  // ✅ 沒選 or 預設 → 顯示「預設」
  const currentRoleName =
    currentUserRole && currentUserRole !== '' ? currentUserRole : '未設定角色';
  const isDefaultRole = currentRoleName === '未設定角色';

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      setTimeout(() => setView('main'), 200);
    }
  }, [isOpen]);

  const handleRoleSelect = (role: string) => {
    // ✅ 選「預設」→ 清空
    if (role === '未設定角色') {
      setCurrentUserRole('');
    } else {
      setCurrentUserRole(role);
    }
    setIsOpen(false);
  };

  const handleDisasterSelect = (type: DisasterType) => {
    setCurrentDisasterType(type);
    // 同時更新災害資料，讓地圖圖層響應
    generateDisasterData(type);
    setIsOpen(false);
  };

  const currentDisasterInfo = DISASTER_TYPES.find((d) => d.type === currentDisasterType);

  const handleLoginToggle = () => {
    setIsLoggedIn(!isLoggedIn);
    setIsOpen(false);
  };

  const handleReportTask = async () => {
    if ('geolocation' in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setTaskCreateOpen(true, [pos.coords.latitude, pos.coords.longitude]);
          setIsOpen(false);
        },
        () => {
          setTaskCreateOpen(true, mapCenter);
          setIsOpen(false);
        },
      );
    } else {
      setTaskCreateOpen(true, mapCenter);
      setIsOpen(false);
    }
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Avatar */}
      <div className="relative w-14 h-14">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className={`w-14 h-14 rounded-full 
            ${avatarBg}
            bg-cover bg-center
            border border-white border-4 dark:border-slate-700  
            shadow-xl flex items-center justify-center
            hover:bg-blue-100/70 dark:hover:bg-slate-700 transition-colors`}
        />

        {/* ✅ 角色名稱 badge（永遠顯示） */}
        <div
          className={`
          hidden sm:flex
          absolute -bottom-3 left-1/2 -translate-x-1/2
          min-w-[28px] h-5 px-1
          rounded-full
          bg-white dark:bg-slate-700
          border border-white dark:border-slate-900
          flex items-center justify-center
          text-[10px] font-medium
        ${
          isDefaultRole
            ? 'text-slate-400 dark:text-slate-400'
            : 'text-slate-700 dark:text-slate-100'
        }
          shadow-md
          whitespace-nowrap
        `}
        >
          {currentRoleName}
        </div>
      </div>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="
              absolute right-0 mt-3 w-[240px] rounded-2xl 
              bg-white dark:bg-slate-900 border
              border-slate-100 dark:border-slate-800 
              shadow-xl overflow-hidden z-[9999] flex flex-col"
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
                  className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <User className="w-5 h-5 opacity-80 text-slate-600 dark:text-slate-300" />
                    <span className="text-[15px] text-slate-700 dark:text-slate-300 font-medium">
                      切換角色
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 dark:text-slate-300 opacity-50" />
                </button>

                <button
                  onClick={() => setView('disasters')}
                  className="flex items-center justify-between w-full px-5 py-3.5 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    <CloudLightning className="w-5 h-5 opacity-80 text-slate-600 dark:text-slate-300" />
                    <span className="text-[15px] text-slate-700 dark:text-slate-300 font-medium">
                      切換災害類型
                      <span className="ml-2 text-xs opacity-60">
                        {currentDisasterInfo?.icon} {currentDisasterInfo?.name}
                      </span>
                    </span>
                  </div>
                  <ChevronRight className="w-4 h-4 dark:text-slate-300 opacity-50" />
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-1" />

                <button
                  onClick={handleReportTask}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <AlertTriangle className="w-5 h-5 opacity-80 text-slate-600 dark:text-slate-300" />
                  <span className="text-[15px] text-slate-700 dark:text-slate-300 font-medium">
                    回報任務
                  </span>
                </button>

                <button
                  onClick={() => {
                    setViewMode(viewMode === 'map' ? 'board' : 'map');
                    setIsOpen(false);
                  }}
                  className="flex items-center gap-3 w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <Monitor className="w-5 h-5 opacity-80 text-slate-600 dark:text-slate-300" />
                  <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300">
                    {viewMode === 'map' ? '切換看板模式' : '切換地圖模式'}
                  </span>
                </button>

                <button
                  onClick={() => setTheme(currentTheme === 'dark' ? 'light' : 'dark')}
                  className="flex items-center justify-between w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                >
                  <div className="flex items-center gap-3">
                    {currentTheme === 'dark' ? (
                      <Moon className="w-5 h-5 opacity-60 text-slate-500 dark:text-slate-300" />
                    ) : (
                      <Sun className="w-5 h-5 opacity-80 text-slate-600 dark:text-slate-300" />
                    )}
                    <span className="text-[15px] font-medium text-slate-700 dark:text-slate-300">
                      深色主題
                    </span>
                  </div>
                  <div className="w-10 h-6 flex items-center bg-slate-200 dark:bg-blue-500 rounded-full p-1">
                    <div
                      className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${currentTheme === 'dark' ? 'translate-x-4' : ''}`}
                    />
                  </div>
                </button>

                <div className="h-px bg-slate-100 dark:bg-slate-800 mx-3 my-2" />

                <div className="px-5 py-2">
                  <button
                    onClick={handleLoginToggle}
                    className="w-full py-2.5 text-slate-700 dark:text-slate-300 rounded-xl hover:bg-slate-200 border border-slate-300 dark:hover:bg-slate-700 flex items-center justify-center gap-2 text-[14px] font-bold"
                  >
                    {isLoggedIn ? (
                      <>
                        <LogOut className="w-4 h-4" /> 登出
                      </>
                    ) : (
                      <>
                        <LogIn className="w-4 h-4" /> 登入
                      </>
                    )}
                  </button>

                  {/* ✅ 只在未登入顯示 */}
                  {!isLoggedIn && (
                    <p className="text-[11px] text-center text-slate-400 mt-2.5">
                      登入以記住您的設定
                    </p>
                  )}
                </div>
              </motion.div>
            ) : view === 'roles' ? (
              <motion.div
                key="roles"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col max-h-[400px]"
              >
                <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setView('main')}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    選擇您的角色
                  </span>
                </div>

                <div className="overflow-y-auto py-2">
                  {ROLES.map(({ name, icon }) => (
                    <button
                      key={name}
                      onClick={() => handleRoleSelect(name)}
                      className="flex items-center justify-between w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        {icon && <span className="text-lg">{icon}</span>}
                        <span className="text-[15px] text-slate-700 dark:text-slate-300">
                          {name}
                        </span>
                      </div>
                      {currentRoleName === name && (
                        <Check className="w-4 h-4 text-white" strokeWidth={3} />
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="disasters"
                initial={{ x: 20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 20, opacity: 0 }}
                transition={{ duration: 0.15 }}
                className="flex flex-col max-h-[400px]"
              >
                <div className="flex items-center gap-2 p-3 border-b border-slate-100 dark:border-slate-800">
                  <button
                    onClick={() => setView('main')}
                    className="p-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800"
                  >
                    <ChevronLeft className="w-5 h-5 text-slate-700 dark:text-slate-300" />
                  </button>
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">
                    選擇災害類型
                  </span>
                </div>

                <div className="overflow-y-auto py-2">
                  {DISASTER_TYPES.map(({ type, name, icon }) => (
                    <button
                      key={type}
                      onClick={() => handleDisasterSelect(type)}
                      className="flex items-center justify-between w-full px-5 py-3 hover:bg-slate-50 dark:hover:bg-slate-800"
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-lg">{icon}</span>
                        <span className="text-[15px] text-slate-700 dark:text-slate-300">
                          {name}
                        </span>
                      </div>
                      {currentDisasterType === type && (
                        <Check className="w-4 h-4 text-blue-500" strokeWidth={3} />
                      )}
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
