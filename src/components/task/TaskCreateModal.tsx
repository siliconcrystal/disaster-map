"use client";

import { useUIStore } from "@/store/useUIStore";
import { useTaskStore } from "@/store/useTaskStore";
import { X } from "lucide-react";
import { useState } from "react";
import { TaskType, Urgency } from "@/types/task";

export function TaskCreateModal() {
  const { isTaskCreateOpen, setTaskCreateOpen, newTaskCoords } = useUIStore();
  const { addTask } = useTaskStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [type, setType] = useState<TaskType>("support");
  const [urgency, setUrgency] = useState<Urgency>("medium");
  const [address, setAddress] = useState("");

  if (!isTaskCreateOpen || !newTaskCoords) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: title || "新任務回報",
      description: description || "無詳細描述",
      lat: newTaskCoords[0],
      lng: newTaskCoords[1],
      address: address || `${newTaskCoords[0]}, ${newTaskCoords[1]}`,
      type,
      urgency,
      status: "reported",
      createdAt: Date.now(),
    });

    setTaskCreateOpen(false);
    setTitle("");
    setDescription("");
    setAddress("");
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/20 pointer-events-auto">
      {/* Modal */}
      <div className="relative w-full h-full sm:h-auto sm:max-w-md bg-white dark:bg-slate-900 rounded-none sm:rounded-3xl shadow-2xl overflow-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-200 dark:border-slate-800 sticky top-0 bg-white dark:bg-slate-900 z-10">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">
            建立新任務
          </h2>
          <button
            onClick={() => setTaskCreateOpen(false)}
            className="p-2 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          {/* 標題 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              標題
            </label>
            <input
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="例：急需飲用水"
            />
          </div>

          {/* 類型 / 緊急程度 */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                類型
              </label>
              <select
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="fire">🔥 火災</option>
                <option value="rescue">🚨 搜救</option>
                <option value="danger">🚧 危險區域</option>
                <option value="people:">👥 人員統計</option>
                <option value="inspection">⛑️ 建築檢查</option>
                <option value="medical">🚑 醫療</option>
                <option value="supply">📦 物資</option>
                <option value="cleanup">🪏 清理淤泥</option>
                <option value="heavy">🚜 重型機具</option>
                <option value="utility">🔧 水電</option>
                <option value="support">💪 人力支援</option>
                <option value="transport">🛵 協助運送</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                緊急程度
              </label>
              <select
                value={urgency}
                onChange={(e) => setUrgency(e.target.value as Urgency)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="low">一般</option>
                <option value="medium">中等</option>
                <option value="high">緊急</option>
              </select>
            </div>
          </div>

          {/* 位置 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              位置
            </label>
            <p className="mt-1 text-xs text-slate-400 mb-1">
              輸入任務地址或移動座標。
            </p>
            <input
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="任務地址..."
            />

            {/* 地圖示意區塊 */}
            <div className="mt-2 h-52 w-full bg-[url('/miniMapMock.png')] bg-cover bg-center rounded-xl relative">
              {/* Pin 完全置中 */}
              <div className="absolute inset-0 flex items-center justify-center text-white text-2xl">
                📍
              </div>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              座標位置： 台北市信義區松高路 1 號 ({newTaskCoords[0].toFixed(5)}, {newTaskCoords[1].toFixed(5)})
            </p>
          </div>

          {/* 描述 */}
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
              描述
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
              placeholder="詳細情況..."
            />
          </div>

          <div className="pt-4">
            <button
              type="submit"
              className="w-full py-3 rounded-xl border border-slate-300 hover:bg-slate-100 transition-colors text-slate-800 font-medium"
            >
              送出回報
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
