"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface CalendarRangePickerProps {
  startDate: number | null;
  endDate: number | null;
  onSelect: (start: number | null, end: number | null) => void;
}

export function CalendarRangePicker({ startDate, endDate, onSelect }: CalendarRangePickerProps) {
  const [viewDate, setViewDate] = useState(new Date());

  const daysInMonth = (year: number, month: number) => new Date(year, month + 1, 0).getDate();
  const firstDayOfMonth = (year: number, month: number) => new Date(year, month, 1).getDay();

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const days = daysInMonth(year, month);
  const offset = firstDayOfMonth(year, month);

  const prevMonth = () => setViewDate(new Date(year, month - 1, 1));
  const nextMonth = () => setViewDate(new Date(year, month + 1, 1));

  const handleDateClick = (day: number) => {
    const clickedDate = new Date(year, month, day).getTime();

    if (!startDate || (startDate && endDate)) {
      onSelect(clickedDate, null);
    } else if (clickedDate < startDate) {
      onSelect(clickedDate, startDate);
    } else {
      onSelect(startDate, clickedDate);
    }
  };

  const isSelected = (day: number) => {
    const date = new Date(year, month, day).getTime();
    return date === startDate || date === endDate;
  };

  const isInRange = (day: number) => {
    if (!startDate || !endDate) return false;
    const date = new Date(year, month, day).getTime();
    return date > startDate && date < endDate;
  };

  const isStart = (day: number) => {
    const date = new Date(year, month, day).getTime();
    return startDate && date === startDate;
  };

  const isEnd = (day: number) => {
    const date = new Date(year, month, day).getTime();
    return endDate && date === endDate;
  };

  const weekDays = ["日", "一", "二", "三", "四", "五", "六"];

  return (
    <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl w-full max-w-[320px]">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-sm font-bold text-slate-800 dark:text-slate-100">
          {year} 年 {month + 1} 月
        </h3>
        <div className="flex gap-1">
          <button onClick={prevMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronLeft className="w-4 h-4 text-slate-500" />
          </button>
          <button onClick={nextMonth} className="p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors">
            <ChevronRight className="w-4 h-4 text-slate-500" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-y-1">
        {weekDays.map(d => (
          <div key={d} className="text-center text-[11px] font-bold text-slate-400 mb-2">{d}</div>
        ))}
        {Array.from({ length: offset }).map((_, i) => (
          <div key={`empty-${i}`} />
        ))}
        {Array.from({ length: days }).map((_, i) => {
          const day = i + 1;
          const selected = isSelected(day);
          const inRange = isInRange(day);
          const start = isStart(day);
          const end = isEnd(day);

          return (
            <div 
              key={day} 
              className="relative h-10 flex items-center justify-center cursor-pointer group"
              onClick={() => handleDateClick(day)}
            >
              {/* Range Bridge */}
              {inRange && (
                <div className="absolute inset-y-1.5 left-0 right-0 bg-slate-100 dark:bg-slate-800/80" />
              )}
              {start && endDate && (
                <div className="absolute inset-y-1.5 left-1/2 right-0 bg-slate-100 dark:bg-slate-800/80" />
              )}
              {end && startDate && (
                <div className="absolute inset-y-1.5 left-0 right-1/2 bg-slate-100 dark:bg-slate-800/80" />
              )}

              <div className={`z-10 w-9 h-9 flex items-center justify-center text-[13px] font-bold transition-all rounded-full ${selected ? 'bg-[#1a1a1b] dark:bg-slate-100 text-white dark:text-slate-900 shadow-lg scale-110' : 'text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'}`}>
                {day}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
