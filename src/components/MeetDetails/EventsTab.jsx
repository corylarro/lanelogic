import { Plus, ArrowRight } from "lucide-react";
import { getStatusColor } from "@/utils/meetHelpers";

export function EventsTab({ events, onAddEvent, onGoToHeats }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white font-inter">
          Event List
        </h3>
        <button
          onClick={onAddEvent}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Event Name
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Stroke
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Distance
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Age Group
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Entries
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Status
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {events.map((event) => (
                <tr
                  key={event.id}
                  className="border-t border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors"
                >
                  <td className="p-4 text-slate-800 dark:text-white font-medium font-inter">
                    {event.name}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                    {event.stroke}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                    {event.distance}m
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                    {event.ageGroup}
                  </td>
                  <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                    {event.entries}
                  </td>
                  <td className="p-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(event.status)} font-inter`}
                    >
                      {event.status.charAt(0).toUpperCase() +
                        event.status.slice(1)}
                    </span>
                  </td>
                  <td className="p-4">
                    <button
                      onClick={() => onGoToHeats(event.id)}
                      className="flex items-center gap-1 px-3 py-1 bg-slate-600 hover:bg-slate-500 text-white text-sm rounded transition-colors font-inter"
                    >
                      Go to Heats
                      <ArrowRight size={12} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
