import { Plus, ArrowRight } from "lucide-react";

export function EventsTab({ events = [], meetData }) {
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white font-inter">
          Event List
        </h3>
        <button
          onClick={() => alert('Add Event functionality coming soon!')}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter"
        >
          <Plus size={16} />
          Add Event
        </button>
      </div>

      {events.length > 0 ? (
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
                    Gender
                  </th>
                  <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                    Age Group
                  </th>
                  <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                    Order
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
                      <span className="capitalize">{event.gender}</span>
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                      {event.ageGroup}
                    </td>
                    <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                      #{event.order}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
          <div className="max-w-sm mx-auto">
            <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
              <Plus size={32} className="text-blue-600 dark:text-blue-400" />
            </div>
            <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-2 font-inter">
              No Events Yet
            </h3>
            <p className="text-slate-600 dark:text-slate-400 mb-6 font-inter">
              Get started by adding your first event to this meet.
            </p>
            <button
              onClick={() => alert('Add Event functionality coming soon!')}
              className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors font-inter"
            >
              <Plus size={18} />
              Add First Event
            </button>
          </div>
        </div>
      )}
    </div>
  );
}