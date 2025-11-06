import { Users, Target, Waves, Clock } from "lucide-react";

export function MeetStats({ meetData }) {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-blue-600/20 rounded-lg flex items-center justify-center">
            <Users size={20} className="text-blue-600 dark:text-blue-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white font-inter">
              {meetData.totalSwimmers}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-inter">
              Total Swimmers
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-green-600/20 rounded-lg flex items-center justify-center">
            <Target size={20} className="text-green-600 dark:text-green-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white font-inter">
              {meetData.totalEvents}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-inter">
              Total Events
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-cyan-600/20 rounded-lg flex items-center justify-center">
            <Waves size={20} className="text-cyan-600 dark:text-cyan-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white font-inter">
              {meetData.poolLength}m • {meetData.lanes}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-inter">
              Pool & Lanes
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-800 rounded-xl p-4 border border-slate-200 dark:border-slate-700 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-purple-600/20 rounded-lg flex items-center justify-center">
            <Clock size={20} className="text-purple-600 dark:text-purple-400" />
          </div>
          <div>
            <div className="text-2xl font-bold text-slate-800 dark:text-white font-inter">
              {meetData.duration}
            </div>
            <div className="text-slate-600 dark:text-slate-400 text-sm font-inter">
              Duration
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
