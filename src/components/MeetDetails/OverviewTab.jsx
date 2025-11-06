import { Plus, Target, Eye } from "lucide-react";

export function OverviewTab({ meetData, onAddEvent, onBuildHeats }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 font-inter">
          Meet Summary
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 font-inter">
          {meetData.totalEvents} Events • {meetData.totalSwimmers} Swimmers •{" "}
          {meetData.poolLength}m Pool • {meetData.lanes} Lanes
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={onAddEvent}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
          >
            <Plus size={16} />
            Add Event
          </button>
          <button
            onClick={onBuildHeats}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-inter"
          >
            <Target size={16} />
            Build Heats
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter">
            <Eye size={16} />
            Publish Results
          </button>
        </div>
      </div>
    </div>
  );
}
