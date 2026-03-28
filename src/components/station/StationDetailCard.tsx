"use client";

import { useStationStore } from "@/store/useStationStore";
import { X, MapPin, Phone, User, Clock, Package, FileText } from "lucide-react";
import { useMemo } from "react";

const TYPE_LABEL: Record<string, string> = {
  shower: "🚿 洗澡站", restroom: "🚻 廁所", medical: "🏥 醫療站",
  supply: "📦 物資站", shelter: "🏠 避難所", accommodation: "🏨 住宿",
  water: "💧 飲水站", repair: "🔧 維修站"
};

const STATUS_CONFIG: Record<string, { label: string; color: string; dot: string }> = {
  open: { label: "開放中", color: "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400", dot: "bg-green-500" },
  closed: { label: "已關閉", color: "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400", dot: "bg-red-500" },
  full: { label: "額滿", color: "bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400", dot: "bg-orange-500" },
  limited: { label: "有限開放", color: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400", dot: "bg-yellow-500" },
};

export function StationDetailCard() {
  const { stations, selectedStationId, setSelectedStationId } = useStationStore();

  const station = useMemo(
    () => stations.find(s => s.id === selectedStationId),
    [stations, selectedStationId]
  );

  if (!station) return null;

  const typeLabel = TYPE_LABEL[station.type] || station.type;
  const statusConfig = STATUS_CONFIG[station.status] || STATUS_CONFIG.open;

  return (
    <div className="fixed inset-0 z-[2000] flex items-end sm:items-center justify-center sm:justify-end sm:pr-4 pointer-events-none sm:bg-transparent transition-all">
      <div className="relative w-full h-[50vh] sm:h-auto sm:max-h-[85vh] sm:w-[380px] bg-white dark:bg-slate-900 backdrop-blur sm:rounded-2xl rounded-t-2xl shadow-xl overflow-hidden animate-in slide-in-from-bottom-full sm:slide-in-from-right-8 duration-300 dark:border-slate-800 flex flex-col pointer-events-auto">
        {/* Sheet Handle (mobile only) */}
        <div className="flex justify-center py-2 md:hidden">
          <div className="w-10 h-1.5 bg-slate-300 rounded-full" />
        </div>

        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 dark:border-slate-800 bg-amber-50/50 dark:bg-amber-950/30">
          <div className="flex items-center gap-3 min-w-0">
            <div className="p-2.5 rounded-xl bg-white dark:bg-slate-800 border border-amber-200 dark:border-amber-800 text-xl shrink-0">
              {typeLabel.slice(0, 2)}
            </div>
            <div className="min-w-0">
              <h2 className="text-lg font-bold text-slate-800 dark:text-slate-100 truncate">{station.name}</h2>
              <div className="flex items-center gap-2 mt-0.5">
                <span className="text-xs font-medium text-slate-500 dark:text-slate-400">{typeLabel.slice(2).trim()}</span>
                <div className={`flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold ${statusConfig.color}`}>
                  <span className={`w-1.5 h-1.5 rounded-full ${statusConfig.dot}`} />
                  {statusConfig.label}
                </div>
              </div>
            </div>
          </div>
          <button
            onClick={() => setSelectedStationId(null)}
            className="p-2 rounded-full hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors shrink-0"
          >
            <X className="w-5 h-5 text-slate-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-5 flex-1 overflow-y-auto space-y-5">
          {/* Address */}
          {station.address && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                <MapPin className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">地址</h4>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">{station.address}</p>
                <p className="text-[11px] text-slate-400 mt-0.5">{station.lat.toFixed(4)}, {station.lng.toFixed(4)}</p>
              </div>
            </div>
          )}

          {/* Contact */}
          {(station.contactName || station.contact) && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                {station.contactName ? <User className="w-4 h-4 text-slate-400" /> : <Phone className="w-4 h-4 text-slate-400" />}
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">聯絡資訊</h4>
                {station.contactName && (
                  <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">{station.contactName}</p>
                )}
                {station.contact && (
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">{station.contact}</p>
                )}
              </div>
            </div>
          )}

          {/* Operating Hours */}
          {(station.openTime || station.endTime) && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                <Clock className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">開放時間</h4>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200 mt-0.5">
                  {station.openTime || '—'} ~ {station.endTime || '—'}
                </p>
              </div>
            </div>
          )}

          {/* Resources */}
          {station.resources && station.resources.length > 0 && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                <Package className="w-4 h-4 text-slate-400" />
              </div>
              <div className="flex-1">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">可用資源</h4>
                <div className="mt-1.5 space-y-1">
                  {station.resources.map((r, i) => (
                    <div key={i} className="flex items-center justify-between text-sm bg-slate-50 dark:bg-slate-800/50 px-3 py-1.5 rounded-lg">
                      <span className="text-slate-700 dark:text-slate-200 font-medium">{r.name}</span>
                      <span className="text-slate-500 dark:text-slate-400">{r.amount} {r.unit}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Notes */}
          {station.notes && (
            <div className="flex items-start gap-3">
              <div className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 shrink-0">
                <FileText className="w-4 h-4 text-slate-400" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">備註</h4>
                <p className="text-sm text-slate-600 dark:text-slate-300 mt-0.5 leading-relaxed">{station.notes}</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
