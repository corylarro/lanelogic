import { Target, Users } from "lucide-react";
import { SwimmerList } from "./SwimmerList";
import { LaneAssignments } from "./LaneAssignments";

export function HeatsTab({
  events,
  selectedEvent,
  onEventChange,
  currentHeat,
  onPreviousHeat,
  onNextHeat,
  eligibleSwimmers,
  unassignedSwimmers,
  loadingSwimmers,
  totalLanes,
  laneAssignments,
  dragOverLane,
  onDragStart,
  onDragOver,
  onDragLeave,
  onDrop,
  onRemoveSwimmer,
  onAddHeat,
  onAutoAssign,
  onClearHeat,
}) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <div className="flex-1">
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
            Select Event
          </label>
          <select
            value={selectedEvent}
            onChange={(e) => onEventChange(e.target.value)}
            className="w-full sm:w-64 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          >
            <option value="">Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} – {event.ageGroup}
              </option>
            ))}
          </select>
        </div>

        {selectedEvent && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Heat{" "}
              <span className="font-semibold text-slate-800 dark:text-white">
                {currentHeat}
              </span>
            </div>
            <button
              onClick={onPreviousHeat}
              className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-inter"
              disabled={currentHeat <= 1}
            >
              Previous
            </button>
            <button
              onClick={onNextHeat}
              className="px-3 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors font-inter"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {selectedEvent ? (
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Users
                    size={18}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <h3 className="font-semibold text-slate-800 dark:text-white font-inter">
                    Available Swimmers
                  </h3>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-inter">
                    ({unassignedSwimmers.length})
                  </span>
                </div>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                <SwimmerList
                  swimmers={unassignedSwimmers}
                  loadingSwimmers={loadingSwimmers}
                  onDragStart={onDragStart}
                  totalSwimmers={eligibleSwimmers.length}
                />
              </div>
            </div>
          </div>

          <div className="lg:col-span-3">
            <LaneAssignments
              totalLanes={totalLanes}
              laneAssignments={laneAssignments}
              dragOverLane={dragOverLane}
              currentHeat={currentHeat}
              onDragOver={onDragOver}
              onDragLeave={onDragLeave}
              onDrop={onDrop}
              onRemoveSwimmer={onRemoveSwimmer}
              onAddHeat={onAddHeat}
              onAutoAssign={onAutoAssign}
              onClearHeat={onClearHeat}
            />
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
          <Target
            size={48}
            className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
          />
          <p className="text-slate-600 dark:text-slate-400 text-lg font-inter">
            Select an event to start building heats.
          </p>
        </div>
      )}
    </div>
  );
}
