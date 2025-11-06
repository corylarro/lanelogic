import { ArrowLeft, Trophy, Clock, Medal, Users, Calendar } from "lucide-react";
import { useMeetStore } from "@/stores/meetStore";
import { getResults } from "@/data/mockDB";
import MeetEventSelector from "./MeetEventSelector";

export default function PublicResults({ onNavigate }) {
  const { selectedMeetId, selectedMeet } = useMeetStore();

  const getAllResults = () => {
    if (!selectedMeet) return {};

    const allResults = {};
    selectedMeet.events.forEach((event) => {
      const eventResults = getResults(selectedMeetId, event.id);
      if (eventResults.length > 0) {
        allResults[event.id] = {
          event,
          heats: eventResults,
        };
      }
    });

    return allResults;
  };

  const results = getAllResults();
  const hasResults = Object.keys(results).length > 0;

  const getPlaceDisplay = (place) => {
    if (!place) return "-";

    let suffix = "th";
    if (place === 1) suffix = "st";
    else if (place === 2) suffix = "nd";
    else if (place === 3) suffix = "rd";

    return `${place}${suffix}`;
  };

  const getPlaceColor = (place) => {
    if (place === 1) return "bg-yellow-100 text-yellow-700 border-yellow-200";
    if (place === 2) return "bg-gray-100 text-gray-700 border-gray-200";
    if (place === 3) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-slate-100 text-slate-600 border-slate-200";
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-inter">
              Public Results
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-inter">
              Published race results and standings
            </p>
          </div>
        </div>
      </div>

      {/* Meet Selector - No Event Selector */}
      <MeetEventSelector showEventSelector={false} />

      {selectedMeet ? (
        <div className="max-w-7xl mx-auto">
          {/* Meet Info Header */}
          <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm p-6 mb-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-xl font-bold text-slate-800 dark:text-white font-inter">
                  {selectedMeet.name}
                </h2>
                <div className="flex items-center gap-4 mt-2 text-slate-600 dark:text-slate-400">
                  <div className="flex items-center gap-2">
                    <Calendar size={16} />
                    <span className="font-inter">{selectedMeet.date}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Trophy size={16} />
                    <span className="font-inter">{selectedMeet.venue}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users size={16} />
                    <span className="font-inter">
                      {selectedMeet.swimmers.length} swimmers
                    </span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-inter">
                  {Object.keys(results).length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                  Events with Results
                </div>
              </div>
            </div>
          </div>

          {hasResults ? (
            <div className="space-y-8">
              {Object.entries(results).map(([eventId, eventData]) => (
                <div
                  key={eventId}
                  className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
                >
                  {/* Event Header */}
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex items-center gap-2">
                      <Medal
                        size={20}
                        className="text-slate-500 dark:text-slate-400"
                      />
                      <h3 className="text-lg font-semibold text-slate-800 dark:text-white font-inter">
                        {eventData.event.name} • {eventData.event.ageGroup}
                      </h3>
                      <span className="text-sm text-slate-500 dark:text-slate-400 bg-slate-200 dark:bg-slate-700 px-2 py-1 rounded font-inter">
                        {eventData.event.distance}m {eventData.event.stroke}
                      </span>
                    </div>
                  </div>

                  {/* Heats */}
                  <div className="divide-y divide-slate-200 dark:divide-slate-700">
                    {eventData.heats.map((heat) => (
                      <div key={heat.heatNumber} className="p-6">
                        <h4 className="text-md font-medium text-slate-700 dark:text-slate-300 mb-4 font-inter">
                          Heat {heat.heatNumber}
                        </h4>

                        <div className="overflow-x-auto">
                          <table className="w-full">
                            <thead>
                              <tr className="border-b border-slate-200 dark:border-slate-700">
                                <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Place
                                </th>
                                <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Lane
                                </th>
                                <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Swimmer
                                </th>
                                <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Team
                                </th>
                                <th className="text-left py-2 text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                                  Time
                                </th>
                              </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100 dark:divide-slate-700">
                              {heat.results
                                .sort(
                                  (a, b) => (a.place || 999) - (b.place || 999),
                                )
                                .map((result) => (
                                  <tr
                                    key={result.lane}
                                    className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                  >
                                    <td className="py-3">
                                      <span
                                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-bold border ${getPlaceColor(result.place)}`}
                                      >
                                        {result.place
                                          ? getPlaceDisplay(result.place).slice(
                                              0,
                                              -2,
                                            )
                                          : "-"}
                                      </span>
                                    </td>
                                    <td className="py-3">
                                      <div className="w-6 h-6 bg-slate-600 dark:bg-slate-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                                        {result.lane}
                                      </div>
                                    </td>
                                    <td className="py-3">
                                      <div className="font-medium text-slate-800 dark:text-white font-inter">
                                        {result.name}
                                      </div>
                                    </td>
                                    <td className="py-3">
                                      <div className="text-slate-600 dark:text-slate-300 font-inter">
                                        {result.team}
                                      </div>
                                    </td>
                                    <td className="py-3">
                                      <div className="flex items-center gap-2">
                                        <Clock
                                          size={14}
                                          className="text-slate-400 dark:text-slate-500"
                                        />
                                        <span className="font-mono text-slate-700 dark:text-slate-200 font-medium">
                                          {result.finalTime}
                                        </span>
                                      </div>
                                    </td>
                                  </tr>
                                ))}
                            </tbody>
                          </table>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
              <Trophy
                size={48}
                className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
              />
              <p className="text-slate-600 dark:text-slate-400 text-lg font-inter">
                No results published yet.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm font-inter mt-2">
                Results will appear here once they are entered and saved.
              </p>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
