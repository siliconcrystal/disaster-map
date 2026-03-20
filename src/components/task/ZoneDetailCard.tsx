"use client";

import { useTaskStore } from "@/store/useTaskStore";
import { X, Info, LayoutPanelTop, MapPin, Share2 } from "lucide-react";
import { useMemo } from "react";

export function ZoneDetailCard() {
    const { zones, selectedZoneId, setSelectedZoneId } = useTaskStore();

    const zone = useMemo(() => zones.find(z => z.id === selectedZoneId), [zones, selectedZoneId]);

    if (!zone) return null;

    return (
        <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:justify-end sm:pr-4 pointer-events-none bg-black/20 sm:bg-transparent backdrop-blur-sm sm:backdrop-blur-none transition-all">
            <div
                className="relative w-full h-[60vh] sm:h-auto sm:max-h-[85vh] sm:w-[380px] bg-white dark:bg-slate-900 sm:rounded-3xl rounded-t-3xl shadow-2xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-right-8 duration-300 border border-slate-200 dark:border-slate-800 flex flex-col pointer-events-auto"
            >

                <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50">
                    <div className="flex items-center gap-2">
                        <div className="p-2 rounded-xl bg-white dark:bg-slate-800 shadow-sm border border-slate-100 dark:border-slate-700">
                            <LayoutPanelTop className="w-5 h-5" style={{ color: zone.color }} />
                        </div>
                        <div>
                            <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">{zone.name}</h2>
                            <span className="text-[10px] font-bold uppercase tracking-widest text-slate-400">區域資訊</span>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedZoneId(null)}
                        className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                    >
                        <X className="w-5 h-5 text-slate-500" />
                    </button>
                </div>

                <div className="p-6 flex-1 overflow-y-auto space-y-8">
                    <div className="space-y-3">
                        <h3 className="text-xs font-black text-slate-400 uppercase tracking-[0.2em] flex items-center gap-2">
                            <Info className="w-3.5 h-3.5" /> 區域功用與說明
                        </h3>
                        <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                            {zone.description}
                        </p>
                    </div>

                    <div className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 space-y-4">
                        <div className="flex items-start gap-3">
                            <div className="p-1.5 rounded-lg bg-white dark:bg-slate-700 shadow-sm">
                                <MapPin className="w-4 h-4 text-slate-400" />
                            </div>
                            <div>
                                <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100">管理中心位置</h4>
                                <p className="text-xs text-slate-500 mt-0.5">{zone.coordinates[0][0].toFixed(4)}, {zone.coordinates[0][1].toFixed(4)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
