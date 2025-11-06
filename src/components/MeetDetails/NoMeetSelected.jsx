import { Calendar } from "lucide-react";

export function NoMeetSelected({ onBackToDashboard }) {
  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900 flex items-center justify-center">
      <div className="text-center">
        <Calendar
          size={64}
          className="text-slate-400 dark:text-slate-600 mx-auto mb-4"
        />
        <h2 className="text-xl font-semibold text-slate-600 dark:text-slate-400 mb-2 font-inter">
          No Meet Selected
        </h2>
        <p className="text-slate-500 dark:text-slate-500 mb-6 font-inter">
          Please select a meet from the Dashboard to view its details.
        </p>
        <button
          onClick={onBackToDashboard}
          className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 font-inter"
        >
          Back to Dashboard
        </button>
      </div>
    </div>
  );
}
