"use client";

import { format } from "date-fns";
import { zhTW } from "date-fns/locale";

interface TimelineItem {
    timestamp: number;
    message: string;
    type?: 'status' | 'comment' | 'system';
}

interface TaskTimelineProps {
    history: TimelineItem[];
}

export function TaskTimeline({ history }: TaskTimelineProps) {
    if (!history || history.length === 0) return null;

    return (
        <div className="space-y-6">
            <h3 className="text-lg font-bold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                更新紀錄
            </h3>
            <div className="relative pl-8 space-y-8 before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-slate-200 dark:before:bg-slate-700">
                {[...history].reverse().map((item, index) => (
                    <div key={index} className="relative">
                        {/* Timeline Circle */}
                        <div className={`absolute -left-8 top-1 w-6 h-6 rounded-full border-4 bg-white dark:bg-slate-900 z-10 
              ${index === 0 ? 'border-orange-500 scale-110' : 'border-slate-200 dark:border-slate-700'}`}
                        />

                        {/* Content */}
                        <div className="space-y-1">
                            <span className="text-sm font-medium text-slate-500 dark:text-slate-400">
                                {format(item.timestamp, "MM/dd HH:mm", { locale: zhTW })}
                            </span>
                            <p className="text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
                                {item.message}
                            </p>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
