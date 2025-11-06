import { Download, Eye } from "lucide-react";

export function ResultsTab({ events }) {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
            Select Event
          </label>
          <select className="w-full sm:w-64 px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter">
            <option>Select Event</option>
            {events.map((event) => (
              <option key={event.id} value={event.id}>
                {event.name} – {event.ageGroup}
              </option>
            ))}
          </select>
        </div>

        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg transition-colors font-inter">
            <Download size={16} />
            Export CSV
          </button>
          <button className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors font-inter">
            <Eye size={16} />
            Publish Results
          </button>
        </div>
      </div>

      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 overflow-hidden">
        <div className="p-4 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600">
          <h4 className="text-lg font-semibold text-slate-800 dark:text-white font-inter">
            Results - 100m Freestyle Boys 12-14
          </h4>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-100 dark:bg-slate-700">
              <tr>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Place
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Swimmer Name
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Team
                </th>
                <th className="text-left p-4 text-slate-700 dark:text-slate-300 font-medium font-inter">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-yellow-600 dark:text-yellow-400 font-bold font-inter">
                  1st
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-medium font-inter">
                  Michael Johnson
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                  Aqua Sharks
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-mono">
                  58.24
                </td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-slate-600 dark:text-slate-300 font-bold font-inter">
                  2nd
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-medium font-inter">
                  David Chen
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                  Wave Riders
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-mono">
                  59.12
                </td>
              </tr>
              <tr className="border-t border-slate-200 dark:border-slate-600 hover:bg-slate-100 dark:hover:bg-slate-700/30 transition-colors">
                <td className="p-4 text-slate-600 dark:text-slate-300 font-bold font-inter">
                  3rd
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-medium font-inter">
                  Alex Rodriguez
                </td>
                <td className="p-4 text-slate-600 dark:text-slate-300 font-inter">
                  Blue Dolphins
                </td>
                <td className="p-4 text-slate-800 dark:text-white font-mono">
                  1:00.45
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
