"use client";

import { TopBar } from "@/components/ui/TopBar";
import { FilterChips } from "@/components/ui/FilterChips";
import { AdvancedFilterModal } from "@/components/ui/AdvancedFilterModal";
import { TaskListPanel } from "@/components/task/TaskListPanel";
import { TaskDetailCard } from "@/components/task/TaskDetailCard";
import { TaskCreateModal } from "@/components/task/TaskCreateModal";
import { AreaSummaryCard } from "@/components/ui/AreaSummaryCard";
import { BoardView } from "@/components/board/BoardView";
import { useUIStore } from "@/store/useUIStore";
import { MapWrapper } from "@/components/map/MapWrapper";

export default function Home() {
  const { viewMode } = useUIStore();

  return (
    <main className="relative w-full h-[100dvh] overflow-hidden bg-slate-50 dark:bg-slate-950">
      <TopBar />
      <FilterChips />
      
      {viewMode === 'map' ? (
        <>
          <MapWrapper />
          <AreaSummaryCard />
          <TaskListPanel />
        </>
      ) : (
        <BoardView />
      )}
      
      <TaskDetailCard />
      <TaskCreateModal />
      <AdvancedFilterModal />
    </main>
  );
}
