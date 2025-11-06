import { useMeetStore } from "@/stores/meetStore";
import { getMeets } from "@/data/mockDB";
import { Calendar, Target } from "lucide-react";

export default function MeetEventSelector({
  showEventSelector = true,
  className = "mb-6",
}) {
  const {
    selectedMeetId,
    selectedEventId,
    selectedMeet,
    setSelectedMeet,
    setSelectedEvent,
    getSelectedMeetEvents,
  } = useMeetStore();

  const meets = getMeets();
  const events = getSelectedMeetEvents();

  return (
    <div className={className}>
      {/* Active Meet Display */}
      {selectedMeet && (
        <div className="mb-4 px-4 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg">
          <div className="flex items-center gap-2 text-sm text-blue-700 dark:text-blue-300 font-inter">
            <Calendar size={16} />
            <span className="font-medium">Active Meet:</span>
            <span>
              {selectedMeet.name} • {selectedMeet.date}
            </span>
          </div>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Meet Selector */}
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
            Select Meet
          </label>
          <select
            value={selectedMeetId || ""}
            onChange={(e) => setSelectedMeet(e.target.value || null)}
            className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
          >
            <option value="">Choose a meet...</option>
            {meets.map((meet) => (
              <option key={meet.id} value={meet.id}>
                {meet.name} • {meet.date}
              </option>
            ))}
          </select>
        </div>

        {/* Event Selector */}
        {showEventSelector && (
          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
              Select Event
            </label>
            <select
              value={selectedEventId || ""}
              onChange={(e) => setSelectedEvent(e.target.value || null)}
              disabled={!selectedMeetId}
              className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter disabled:bg-slate-100 dark:disabled:bg-slate-600 disabled:cursor-not-allowed"
            >
              <option value="">Choose an event...</option>
              {events.map((event) => (
                <option key={event.id} value={event.id}>
                  {event.name} • {event.ageGroup}
                </option>
              ))}
            </select>
          </div>
        )}
      </div>

      {/* No Meet Selected State */}
      {!selectedMeetId && (
        <div className="mt-8 bg-slate-50 dark:bg-slate-800 rounded-xl p-8 border border-slate-200 dark:border-slate-700 text-center">
          <Target
            size={48}
            className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
          />
          <p className="text-slate-600 dark:text-slate-400 text-lg font-inter">
            Select a meet to get started.
          </p>
        </div>
      )}
    </div>
  );
}
