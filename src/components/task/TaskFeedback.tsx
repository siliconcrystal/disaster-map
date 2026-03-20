"use client";

import { ThumbsUp, ThumbsDown, Share2 } from "lucide-react";

interface TaskFeedbackProps {
    helpful: number;
    toConfirm: number;
}

export function TaskFeedback({ helpful, toConfirm }: TaskFeedbackProps) {
    return (
        <div className="bg-slate-50/50 dark:bg-slate-800/30 rounded-3xl p-8 border border-slate-100 dark:border-slate-800/50 text-center space-y-6">
            <div className="space-y-1">
                <h3 className="text-xl font-bold text-slate-800 dark:text-slate-100">
                    這是個好資訊嗎？
                </h3>
                <p className="text-slate-500 dark:text-slate-400">
                    評估這筆資料的準確性與實用性
                </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4">
                <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-blue-500 dark:hover:border-blue-500 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all duration-300 group">
                    <ThumbsUp className="w-5 h-5 text-slate-400 group-hover:text-blue-500 transition-colors" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">有幫助</span>
                    <span className="text-slate-400 font-medium ml-1">{helpful}</span>
                </button>

                <button className="flex items-center gap-3 px-8 py-3.5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 hover:border-orange-500 dark:hover:border-orange-500 hover:bg-orange-50 dark:hover:bg-orange-900/20 transition-all duration-300 group">
                    <ThumbsDown className="w-5 h-5 text-slate-400 group-hover:text-orange-500 transition-colors" />
                    <span className="font-bold text-slate-700 dark:text-slate-200">待確認</span>
                    <span className="text-slate-400 font-medium ml-1">{toConfirm}</span>
                </button>
            </div>

            <div className="pt-2">
                <button className="inline-flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-blue-500 dark:hover:text-blue-400 transition-colors font-medium">
                    <Share2 className="w-4 h-4" />
                    分享此任務詳情
                </button>
            </div>
        </div>
    );
}
