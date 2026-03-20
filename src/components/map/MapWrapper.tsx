"use client";

import dynamic from "next/dynamic";

const MapView = dynamic(() => import("./MapView"), {
  ssr: false,
  loading: () => (
    <div className="absolute inset-0 z-[1] flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="w-8 h-8 rounded-full border-4 border-slate-300 dark:border-slate-700 border-t-blue-500 animate-spin" />
    </div>
  ),
});

export function MapWrapper() {
  return <MapView />;
}
