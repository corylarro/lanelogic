import { Users, Clock } from "lucide-react";

export function SwimmerList({
  swimmers,
  loadingSwimmers,
  onDragStart,
  totalSwimmers = 0,
}) {
  if (loadingSwimmers) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-inter">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
        <p className="text-sm">Loading swimmers...</p>
      </div>
    );
  }

  if (swimmers.length === 0) {
    return (
      <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-inter">
        <Users size={32} className="mx-auto mb-2 opacity-50" />
        <p className="text-sm">
          {totalSwimmers === 0
            ? "No swimmers have been added to this meet yet."
            : "No swimmers registered for this event."}
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {swimmers.map((swimmer) => (
        <div
          key={swimmer.id}
          draggable
          onDragStart={(e) => onDragStart(e, swimmer)}
          className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 cursor-move hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-150 group"
        >
          <div>
            <div className="font-medium text-slate-800 dark:text-white text-sm font-inter">
              {swimmer.name}
            </div>
            <div className="text-xs text-slate-500 dark:text-slate-400 font-inter">
              {swimmer.team}
            </div>
          </div>
          <div className="flex items-center gap-1 text-sm">
            <Clock size={14} className="text-slate-400 dark:text-slate-500" />
            <span className="font-mono text-slate-600 dark:text-slate-300">
              {swimmer.seedTime}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}
