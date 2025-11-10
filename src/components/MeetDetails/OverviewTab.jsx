import { Plus, Target, Eye } from "lucide-react";

export function OverviewTab({ meetData, events = [] }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 font-inter">
          Meet Summary
        </h3>
        <p className="text-slate-600 dark:text-slate-300 mb-6 font-inter">
          {events.length} Events • {meetData.totalSwimmers || 0} Swimmers •{" "}
          {meetData.poolLength}m Pool • {meetData.lanes} Lanes
        </p>

        <div className="flex flex-wrap gap-3">
          <button
            onClick={() => alert('Add Event functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
          >
            <Plus size={16} />
            Add Event
          </button>
          <button
            onClick={() => alert('Build Heats functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors font-inter"
          >
            <Target size={16} />
            Build Heats
          </button>
          <button
            onClick={() => alert('Publish Results functionality coming soon!')}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter"
          >
            <Eye size={16} />
            Publish Results
          </button>
        </div>
      </div>

      {/* Event List Preview */}
      {events.length > 0 && (
        <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 font-inter">
            Events
          </h3>
          <div className="space-y-2">
            {events.slice(0, 5).map((event) => (
              <div
                key={event.id}
                className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/30 rounded-lg"
              >
                <div>
                  <div className="font-medium text-slate-800 dark:text-white font-inter">
                    {event.name}
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                    {event.distance}m {event.stroke} • {event.gender}
                  </div>
                </div>
              </div>
            ))}
            {events.length > 5 && (
              <div className="text-center pt-2">
                <span className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                  +{events.length - 5} more events
                </span>
              </div>
            )}
          </div>
        </div>
      )}

      {events.length === 0 && (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
          <Target
            size={48}
            className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
          />
          <h3 className="font-medium text-slate-800 dark:text-white mb-2 font-inter">
            No events yet
          </h3>
          <p className="text-slate-500 dark:text-slate-400 mb-4 font-inter">
            Add events to get started with this meet
          </p>
          <button
            onClick={() => alert('Add Event functionality coming soon!')}
            className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors font-inter"
          >
            <Plus size={16} />
            Add First Event
          </button>
        </div>
      )}
    </div>
  );
}