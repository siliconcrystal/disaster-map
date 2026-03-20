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

  if (!isTaskCreateOpen || !newTaskCoords) return null;

  const handleSubmit = (e: React.FormEvent) => {
    if (e) e.preventDefault();
    
    addTask({
      id: Math.random().toString(36).substr(2, 9),
      title: title || "新任務回報",
      description: description || "無詳細描述",
      lat: newTaskCoords[0],
      lng: newTaskCoords[1],
      type,
      urgency,
      status: "reported",
      createdAt: Date.now()
    });

    setTaskCreateOpen(false);
    setTitle("");
    setDescription("");
  };

  return (
    <div className="fixed inset-0 z-[2000] flex items-center justify-center bg-black/60 backdrop-blur-sm pointer-events-auto p-4 transition-all">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-900 rounded-3xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200 border border-slate-200 dark:border-slate-800">
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800">
          <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100">建立新任務</h2>
          <button 
            onClick={() => setTaskCreateOpen(false)}
            className="p-2 mr-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">標題</label>
            <input 
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              placeholder="例：急需飲用水"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">描述</label>
            <textarea 
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white resize-none"
              placeholder="詳細情況..."
            />
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">類型</label>
              <select 
                value={type}
                onChange={(e) => setType(e.target.value as TaskType)}
                className="w-full px-4 py-2 rounded-xl border border-slate-300 dark:border-slate-700 bg-transparent focus:ring-2 focus:ring-blue-500 outline-none transition-all dark:text-white"
              >
                <option value="fire">火災</option>
                <option value="rescue">搜救</option>
                <option value="supply">物資</option>
                <option value="medical">醫療</option>
                <option value="support">人力支援</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">緊急程度</label>
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
          
          <div className="pt-2">
            <button 
              type="submit"
              className="w-full py-3 rounded-xl bg-blue-600 hover:bg-blue-700 transition-colors text-white font-medium shadow-lg shadow-blue-500/30"
            >
              送出回報
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
