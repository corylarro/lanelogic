import { Calendar, MapPin, Edit3 } from "lucide-react";
import { getStatusColor } from "@/utils/meetHelpers";

export function MeetHeader({ meetData }) {
  return (
    <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm animate-in fade-in-0 slide-in-from-bottom-4 duration-500 delay-150">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-inter">
              {meetData.name}
            </h1>
            <span
              className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(meetData.status)} font-inter`}
            >
              {meetData.status.charAt(0).toUpperCase() +
                meetData.status.slice(1)}
            </span>
          </div>
          <div className="flex items-center gap-4 text-slate-600 dark:text-slate-400">
            <div className="flex items-center gap-2">
              <Calendar size={16} />
              <span className="font-inter">{meetData.date}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin size={16} />
              <span className="font-inter">{meetData.venue}</span>
            </div>
          </div>
        </div>

        <button
          onClick={() => alert('Edit functionality coming soon!')}
          className="flex items-center gap-2 px-4 py-2 text-blue-600 hover:bg-blue-50 dark:text-blue-400 dark:hover:bg-blue-900/20 rounded-lg transition-all duration-200 font-inter hover:scale-105 active:scale-95"
        >
          <Edit3 size={16} />
          Edit Details
        </button>
      </div>
    </div>
  );
}