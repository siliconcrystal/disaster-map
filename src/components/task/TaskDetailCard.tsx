"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { X, MapPin, Clock, Phone, Maximize2, Share2, Copy, Check } from "lucide-react";
import { useUIStore } from "@/store/useUIStore";
import { useMemo, useState } from "react";

const URGENCY_ZH: Record<string, { label: string; className: string }> = {
  high: { label: '緊急', className: 'bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300' },
  medium: { label: '中等', className: 'bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300' },
  low: { label: '一般', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
};

const STATUS_ZH: Record<string, { label: string; className: string }> = {
  reported: { label: '已回報', className: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300' },
  recruiting: { label: '招募中', className: 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300' },
  in_progress: { label: '進行中', className: 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300' },
  done: { label: '已完成', className: 'bg-green-100 text-green-700 dark:bg-green-900/40 dark:text-green-300' },
};

const TYPE_ZH: Record<string, string> = {
  fire: '🔥 火災',
  rescue: '🚨 搜救',
  danger: '🚧 危險區域',
  people: '👥 人員統計',
  inspection: '⛑️ 建築檢查',
  medical: '🚑 醫療',
  supply: '📦 物資',
  cleanup: '🪏 清理淤泥',
  heavy: '🚜 重型機具',
  utility: '🔧 水電',
  support: '💪 人力支援',
  transport: '🛵 協助運送',
};

export function TaskDetailCard() {
  const { tasks, selectedTaskId, setSelectedTaskId } = useTaskStore();
  const { setTaskFullDetailOpen } = useUIStore();
  const [copied, setCopied] = useState(false);

  const task = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

  if (!task) return null;

  const urgency = URGENCY_ZH[task.urgency] || { label: task.urgency, className: '' };
  const status = STATUS_ZH[task.status] || { label: task.status, className: '' };

  const handleCopy = () => {
    const textToCopy = task.address || `${task.lat.toFixed(4)}, ${task.lng.toFixed(4)}`;
    navigator.clipboard.writeText(textToCopy).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShare = () => {
    const url = `${window.location.origin}?task=${task.id}`;
    if (navigator.share) {
      navigator.share({ title: task.title, url });
    } else {
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:justify-end sm:pr-4 pointer-events-none bg-black/20 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all">
      <div
        key={task.id}
        className="relative w-full h-[80vh] sm:h-auto sm:max-h-[85vh] sm:w-[380px] bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-right-8 duration-300 border border-slate-200 dark:border-slate-800 flex flex-col pointer-events-auto"
      >
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
          <div className="flex items-center gap-2 min-w-0">
            <span className="text-2xl shrink-0">{TYPE_ZH[task.type]?.split(' ')[0] || '📍'}</span>
            <h2 className="text-base font-bold text-slate-800 dark:text-slate-100 truncate">{task.title}</h2>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <button onClick={() => setTaskFullDetailOpen(true)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group" title="展開詳情">
              <Maximize2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <button onClick={handleShare} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors group" title="分享任務">
              <Share2 className="w-4 h-4 text-slate-400 group-hover:text-blue-500 transition-colors" />
            </button>
            <button onClick={() => setSelectedTaskId(null)} className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors">
              <X className="w-5 h-5 text-slate-400" />
            </button>
          </div>
        </div>

        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${urgency.className}`}>{urgency.label}</span>
            <span className={`px-2.5 py-1 rounded-full text-xs font-bold ${status.className}`}>{status.label}</span>
            <span className="px-2.5 py-1 rounded-full text-xs font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">{TYPE_ZH[task.type] || task.type}</span>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5">描述</h3>
            <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-sm">{task.description}</p>
          </div>

          {/* Location */}
          <div className="bg-slate-50 dark:bg-slate-800/50 rounded-2xl p-4 space-y-3 border border-slate-100 dark:border-slate-800">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5" /> 位置資訊
            </h3>
            {task.address && (
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm font-semibold text-slate-800 dark:text-slate-100">{task.address}</span>
                <button onClick={handleCopy} className="p-1.5 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0" title="複製地址">
                  {copied ? <Check className="w-3.5 h-3.5 text-green-500" /> : <Copy className="w-3.5 h-3.5 text-slate-400" />}
                </button>
              </div>
            )}
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">緯度</p>
                <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{task.lat.toFixed(4)}</p>
              </div>
              <div className="bg-white dark:bg-slate-900 rounded-xl p-2.5 border border-slate-100 dark:border-slate-800">
                <p className="text-[10px] text-slate-400 mb-0.5">經度</p>
                <p className="text-sm font-mono font-bold text-slate-700 dark:text-slate-200">{task.lng.toFixed(4)}</p>
              </div>
            </div>
          </div>

          {/* Time */}
          <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
            <Clock className="w-4 h-4 shrink-0" />
            <span>{new Date(task.createdAt).toLocaleString('zh-TW')}</span>
          </div>

          {task.contact && (
            <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
              <Phone className="w-4 h-4 shrink-0" />
              <span>{task.contact}</span>
            </div>
          )}
        </div>

        <div className="p-4 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900">
          <button className="w-full flex items-center justify-center py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-medium transition-colors hover:bg-slate-50 dark:hover:bg-slate-800">
            我能前往協助
          </button>
        </div>
      </div>
    </div>
  );
}
