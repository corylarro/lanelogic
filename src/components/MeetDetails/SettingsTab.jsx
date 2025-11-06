import { Save, Trash2 } from "lucide-react";

export function SettingsTab({ meetData }) {
  return (
    <div className="space-y-6">
      <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-6 font-inter">
          Meet Settings
        </h3>

        <div className="grid gap-6">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                Meet Name
              </label>
              <input
                type="text"
                defaultValue={meetData.name}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                Location
              </label>
              <input
                type="text"
                defaultValue={meetData.location}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>
          </div>

          <div className="grid sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                Pool Length (m)
              </label>
              <input
                type="number"
                defaultValue={meetData.poolLength}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                Number of Lanes
              </label>
              <input
                type="number"
                defaultValue={meetData.lanes}
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                Date
              </label>
              <input
                type="date"
                defaultValue="2024-03-14"
                className="w-full px-3 py-2 bg-white dark:bg-slate-700 border border-slate-300 dark:border-slate-600 rounded-lg text-slate-800 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 font-inter"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-4">
            <button className="flex items-center gap-2 px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-inter">
              <Save size={16} />
              Save Changes
            </button>
            <button className="flex items-center gap-2 px-6 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors font-inter">
              <Trash2 size={16} />
              Delete Meet
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
