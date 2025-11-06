import { Clock, Plus, Shuffle, Save } from "lucide-react";

export function LaneAssignments({
  totalLanes,
  laneAssignments,
  dragOverLane,
  currentHeat,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveSwimmer,
  onAddHeat,
  onAutoAssign,
  onClearHeat,
}) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
      <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
        <h3 className="font-semibold text-slate-800 dark:text-white font-inter">
          Lane Assignments - Heat {currentHeat}
        </h3>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-1 gap-3 mb-6">
          {Array.from({ length: totalLanes }, (_, i) => i + 1).map(
            (laneNumber) => (
              <div
                key={laneNumber}
                onDragOver={(e) => onDragOver(e, laneNumber)}
                onDragLeave={onDragLeave}
                onDrop={(e) => onDrop(e, laneNumber)}
                className={`
                  relative p-4 rounded-lg border-2 border-dashed transition-all duration-200 min-h-[80px] flex items-center
                  ${
                    dragOverLane === laneNumber
                      ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "border-slate-300 dark:border-slate-600"
                  }
                  ${
                    laneAssignments[laneNumber]
                      ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-solid border-blue-200 dark:border-blue-700"
                      : "bg-slate-50 dark:bg-slate-700/30"
                  }
                `}
              >
                <div className="absolute top-2 left-3 w-6 h-6 bg-slate-600 dark:bg-slate-500 text-white text-xs font-bold rounded-full flex items-center justify-center font-inter">
                  {laneNumber}
                </div>

                {laneAssignments[laneNumber] ? (
                  <div className="flex items-center justify-between w-full ml-8">
                    <div>
                      <div className="font-medium text-slate-800 dark:text-white text-sm font-inter">
                        {laneAssignments[laneNumber].name}
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400 font-inter">
                        {laneAssignments[laneNumber].team}
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="flex items-center gap-1 text-sm">
                        <Clock
                          size={14}
                          className="text-slate-400 dark:text-slate-500"
                        />
                        <span className="font-mono text-slate-600 dark:text-slate-300">
                          {laneAssignments[laneNumber].seedTime}
                        </span>
                      </div>
                      <button
                        onClick={() => onRemoveSwimmer(laneNumber)}
                        className="text-red-500 hover:text-red-600 text-xs font-medium font-inter"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="text-center w-full ml-8 text-slate-400 dark:text-slate-500 font-inter">
                    <p className="text-sm">Drop swimmer here</p>
                  </div>
                )}
              </div>
            ),
          )}
        </div>

        <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
          <button
            onClick={onAddHeat}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
          >
            <Plus size={16} />
            Add Heat
          </button>
          <button
            onClick={onAutoAssign}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-inter"
          >
            <Shuffle size={16} />
            Auto Assign Lanes
          </button>
          <button
            onClick={onClearHeat}
            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-inter"
          >
            Clear Heat
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter ml-auto">
            <Save size={16} />
            Save Assignments
          </button>
        </div>
      </div>
    </div>
  );
}
