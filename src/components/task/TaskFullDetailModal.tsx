"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { useUIStore } from "@/store/useUIStore";
import { X, MapPin, Clock, Phone, User, Building2, Lock, ExternalLink, ChevronLeft, Share2, Copy, Check, ZoomIn } from "lucide-react";
import { useMemo, useState } from "react";
import { TaskTimeline } from "./TaskTimeline";
import { TaskFeedback } from "./TaskFeedback";
import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

const TYPE_EMOJI: Record<string, string> = {
    fire: '🔥', rescue: '🚨', danger: '🚧', people: '👥',
    inspection: '⛑️', medical: '🚑', supply: '📦', cleanup: '🪏',
    heavy: '🚜', utility: '🔧', support: '💪', transport: '🛵',
};
const TYPE_ZH: Record<string, string> = {
    fire: '火災', rescue: '搜救', danger: '危險區域', people: '人員統計',
    inspection: '建築檢查', medical: '醫療', supply: '物資', cleanup: '清理淤泥',
    heavy: '重型機具', utility: '水電', support: '人力支援', transport: '協助運送',
};
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

export function TaskFullDetailModal() {
    const { tasks, selectedTaskId, setSelectedTaskId } = useTaskStore();
    const { isTaskFullDetailOpen, setTaskFullDetailOpen, currentUserRole } = useUIStore();
    const [copiedAddr, setCopiedAddr] = useState(false);
    const [lightboxPhoto, setLightboxPhoto] = useState<string | null>(null);

    const task = useMemo(() => tasks.find(t => t.id === selectedTaskId), [tasks, selectedTaskId]);

    if (!isTaskFullDetailOpen || !task) return null;

    const isLoggedIn = !!currentUserRole;
    const urgency = URGENCY_ZH[task.urgency];
    const status = STATUS_ZH[task.status];

    const handleCopyAddress = () => {
        const text = task.address || `${task.lat.toFixed(6)}, ${task.lng.toFixed(6)}`;
        navigator.clipboard.writeText(text);
        setCopiedAddr(true);
        setTimeout(() => setCopiedAddr(false), 2000);
    };

    const handleShare = () => {
        const url = `${window.location.origin}?task=${task.id}`;
        if (navigator.share) navigator.share({ title: task.title, url });
        else navigator.clipboard.writeText(url);
    };

    return (
        <>
            <div className="fixed inset-0 z-[3000] bg-white dark:bg-slate-950 flex flex-col animate-in fade-in zoom-in-95 duration-200">
                {/* Header — title only */}
                <div className="px-6 py-4 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between sticky top-0 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md z-10">
                    <div className="flex items-center gap-2 min-w-0">
                        <button onClick={() => setTaskFullDetailOpen(false)} className="p-2 -ml-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors group shrink-0">
                            <ChevronLeft className="w-6 h-6 text-slate-500 group-hover:text-slate-900 dark:group-hover:text-white" />
                        </button>
                        <h1 className="text-lg font-bold text-slate-900 dark:text-white truncate">{task.title}</h1>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                        <button onClick={handleShare} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-blue-600 dark:hover:text-blue-400 transition-all" title="分享此任務">
                            <Share2 className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setTaskFullDetailOpen(false); setSelectedTaskId(null); }} className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 dark:hover:text-white transition-all">
                            <X className="w-5 h-5" />
                        </button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto overflow-x-hidden">
                    <div className="max-w-3xl mx-auto px-6 py-8 space-y-8 pb-32">

                        {/* 1. Tags section — first in body */}
                        <section className="flex flex-wrap gap-2">
                            {urgency && <span className={`px-3 py-1 rounded-full text-sm font-bold ${urgency.className}`}>{urgency.label}</span>}
                            {status && <span className={`px-3 py-1 rounded-full text-sm font-bold ${status.className}`}>{status.label}</span>}
                            <span className="px-3 py-1 rounded-full text-sm font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                                {TYPE_EMOJI[task.type]} {TYPE_ZH[task.type] || task.type}
                            </span>
                        </section>

                        {/* 2. Description */}
                        <section className="space-y-2">
                            <h3 className="font-bold text-slate-900 dark:text-white">描述</h3>
                            <p className="text-slate-600 dark:text-slate-400 leading-relaxed">{task.description}</p>
                        </section>

                        {/* 3. Photo Gallery */}
                        {task.photos && task.photos.length > 0 && (
                            <section className="space-y-3">
                                <h3 className="font-bold text-slate-900 dark:text-white">現場照片</h3>
                                <div className="flex gap-4 overflow-x-auto pb-2 -mx-1 px-1 scrollbar-hide">
                                    {task.photos.map((url, idx) => (
                                        <button
                                            key={idx}
                                            onClick={() => setLightboxPhoto(url)}
                                            className="relative flex-shrink-0 w-60 h-44 rounded-2xl overflow-hidden border border-slate-100 dark:border-slate-800 group cursor-zoom-in focus:outline-none"
                                        >
                                            <img src={url} alt={`現場照片 ${idx + 1}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
                                            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/30 transition-colors flex items-center justify-center">
                                                <ZoomIn className="text-white w-7 h-7 opacity-0 group-hover:opacity-100 drop-shadow-lg transition-opacity" />
                                            </div>
                                        </button>
                                    ))}
                                </div>
                            </section>
                        )}

                        {/* 4. Location */}
                        <section className="rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 overflow-hidden">
                            <div className="p-5">
                                <h3 className="font-bold text-slate-900 dark:text-white flex items-center gap-2 mb-4">
                                    <MapPin className="w-4 h-4 text-slate-400" /> 位置資訊
                                </h3>
                                {task.address && (
                                    <div className="flex items-center justify-between gap-2 mb-4">
                                        <p className="text-slate-600 dark:text-slate-300">{task.address}</p>
                                        <button onClick={handleCopyAddress} className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0" title="複製地址">
                                            {copiedAddr ? <Check className="w-4 h-4 text-green-500" /> : <Copy className="w-4 h-4 text-slate-400" />}
                                        </button>
                                    </div>
                                )}
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                        <p className="text-xs text-slate-400 mb-1">經度</p>
                                        <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{task.lng.toFixed(4)}</p>
                                    </div>
                                    <div className="bg-white dark:bg-slate-800 rounded-xl p-3 border border-slate-100 dark:border-slate-700">
                                        <p className="text-xs text-slate-400 mb-1">緯度</p>
                                        <p className="font-mono font-bold text-slate-800 dark:text-slate-100">{task.lat.toFixed(4)}</p>
                                    </div>
                                </div>
                            </div>
                        </section>

                        {/* 5. Reporter Info (Privacy Block) — after location */}
                        <section className={`relative overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 p-6
                        ${!isLoggedIn ? 'min-h-[140px]' : ''}`}>
                            {!isLoggedIn && (
                                <div className="absolute inset-0 z-10 backdrop-blur-xl bg-white/50 dark:bg-slate-950/50 flex flex-col items-center justify-center p-6 text-center space-y-3 rounded-2xl">
                                    <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                                        <Lock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                                    </div>
                                    <div>
                                        <p className="font-bold text-slate-900 dark:text-white">隱私資料受保護</p>
                                        <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">登入並取得權限後才能查看</p>
                                    </div>
                                    <button className="px-5 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700 transition-colors shadow-lg shadow-blue-500/20">立即登入</button>
                                </div>
                            )}
                            <div className={`space-y-3 ${!isLoggedIn ? 'blur-md pointer-events-none select-none' : ''}`}>
                                <h3 className="font-bold text-slate-900 dark:text-white text-sm mb-3">案件回報者</h3>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="flex items-start gap-2">
                                        <User className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-400">上傳者</p>
                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{task.reporterName || '匿名'}</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start gap-2">
                                        <Building2 className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
                                        <div>
                                            <p className="text-xs text-slate-400">單位</p>
                                            <p className="font-bold text-slate-800 dark:text-slate-100 text-sm">{task.reporterUnit || '志工'}</p>
                                        </div>
                                    </div>
                                </div>
                                <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-2">
                                    <Clock className="w-4 h-4 text-slate-400 shrink-0" />
                                    <span className="text-xs text-slate-400">最後上傳</span>
                                    <span className="text-sm font-semibold text-slate-700 dark:text-slate-200">
                                        {format(task.createdAt, "yyyy-MM-dd HH:mm", { locale: zhTW })}
                                    </span>
                                </div>
                                {task.contact && (
                                    <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex items-center gap-2">
                                        <Phone className="w-4 h-4 text-slate-400 shrink-0" />
                                        <span className="text-sm text-slate-700 dark:text-slate-200">{task.contact}</span>
                                    </div>
                                )}
                            </div>
                        </section>

                        {/* Floor Info Table */}
                        {task.hasFloors && task.floorData && (
                            <section className="space-y-4">
                                <h3 className="font-bold text-slate-900 dark:text-white">樓層詳細資料</h3>
                                <div className="overflow-hidden rounded-2xl border border-slate-100 dark:border-slate-800">
                                    <table className="w-full text-left border-collapse text-sm">
                                        <thead>
                                            <tr className="bg-slate-50 dark:bg-slate-900/80 border-b border-slate-100 dark:border-slate-800">
                                                <th className="px-5 py-3 text-slate-500 dark:text-slate-400 font-bold">樓層</th>
                                                <th className="px-5 py-3 text-slate-500 dark:text-slate-400 font-bold">狀態</th>
                                                <th className="px-5 py-3 text-slate-500 dark:text-slate-400 font-bold">描述</th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-slate-50 dark:divide-slate-800/50">
                                            {task.floorData.map((row, idx) => (
                                                <tr key={idx} className="bg-white dark:bg-slate-900/20 hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                                                    <td className="px-5 py-3 font-bold text-slate-800 dark:text-slate-200">{row.floor}</td>
                                                    <td className="px-5 py-3">
                                                        <span className={`px-2 py-0.5 rounded-md text-xs font-bold ${row.status === '正常' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                            {row.status}
                                                        </span>
                                                    </td>
                                                    <td className="px-5 py-3 text-slate-600 dark:text-slate-400">{row.details}</td>
                                                </tr>
                                            ))}
                                        </tbody>
                                    </table>
                                </div>
                            </section>
                        )}

                        {/* Timeline */}
                        <section className="bg-white dark:bg-slate-900/20 rounded-2xl p-6 border border-slate-100 dark:border-slate-800">
                            <TaskTimeline history={task.history || []} />
                        </section>

                        {/* Feedback */}
                        <section>
                            <TaskFeedback helpful={task.feedback?.helpful || 0} toConfirm={task.feedback?.toConfirm || 0} />
                        </section>
                    </div>
                </div>
            </div>

            {/* Lightbox */}
            {
                lightboxPhoto && (
                    <div
                        className="fixed inset-0 z-[4000] bg-black/90 flex items-center justify-center p-4 animate-in fade-in duration-200"
                        onClick={() => setLightboxPhoto(null)}
                    >
                        <button
                            className="absolute top-4 right-4 p-2 rounded-full bg-white/10 hover:bg-white/20 text-white transition-colors"
                            onClick={() => setLightboxPhoto(null)}
                        >
                            <X className="w-6 h-6" />
                        </button>
                        <img
                            src={lightboxPhoto}
                            alt="放大預覽"
                            className="max-w-full max-h-full rounded-2xl object-contain shadow-2xl"
                            onClick={(e) => e.stopPropagation()}
                        />
                    </div>
                )
            }
        </>
    );
}
