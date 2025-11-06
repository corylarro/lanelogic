import { useState, useEffect } from "react";
import { ArrowLeft, Save, RotateCcw, Trophy, Clock, Check } from "lucide-react";
import { useMeetStore } from "@/stores/meetStore";
import { getHeatAssignments, saveResults, getResults } from "@/data/mockDB";
import MeetEventSelector from "./MeetEventSelector";

export default function ResultsEntry({ onNavigate }) {
  const { selectedMeetId, selectedEventId, selectedMeet, selectedEvent } =
    useMeetStore();

  const [currentHeat, setCurrentHeat] = useState(1);
  const [results, setResults] = useState({});
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved'

  // Load existing results or heat assignments
  useEffect(() => {
    if (selectedMeetId && selectedEventId) {
      // Try to load existing results first
      const existingResults = getResults(selectedMeetId, selectedEventId);
      const heatResults = existingResults.find(
        (r) => r.heatNumber === currentHeat,
      );

      if (heatResults) {
        // Convert results to our format
        const resultsMap = {};
        heatResults.results.forEach((result) => {
          resultsMap[result.lane] = {
            swimmerId: result.swimmerId,
            name: result.name,
            team: result.team,
            finalTime: result.finalTime || "",
            place: result.place || "",
          };
        });
        setResults(resultsMap);
      } else {
        // Load heat assignments if no results exist
        const heatAssignments = getHeatAssignments(
          selectedMeetId,
          selectedEventId,
          currentHeat,
        );
        if (heatAssignments) {
          const resultsMap = {};
          Object.keys(heatAssignments).forEach((lane) => {
            const assignment = heatAssignments[lane];
            if (assignment) {
              resultsMap[lane] = {
                swimmerId: assignment.swimmerId,
                name: assignment.name,
                team: assignment.team,
                finalTime: "",
                place: "",
              };
            }
          });
          setResults(resultsMap);
        } else {
          setResults({});
        }
      }
    }
  }, [selectedMeetId, selectedEventId, currentHeat]);

  const handleTimeChange = (lane, time) => {
    setResults((prev) => ({
      ...prev,
      [lane]: {
        ...prev[lane],
        finalTime: time,
      },
    }));
  };

  const handlePlaceChange = (lane, place) => {
    setResults((prev) => ({
      ...prev,
      [lane]: {
        ...prev[lane],
        place: place,
      },
    }));
  };

  const handleSaveResults = () => {
    if (!selectedMeetId || !selectedEventId) return;

    setSaveStatus("saving");

    // Convert results to save format
    const resultsToSave = Object.keys(results)
      .filter((lane) => results[lane] && results[lane].finalTime)
      .map((lane) => ({
        swimmerId: results[lane].swimmerId,
        name: results[lane].name,
        team: results[lane].team,
        lane: parseInt(lane),
        finalTime: results[lane].finalTime,
        place: parseInt(results[lane].place) || null,
      }));

    // Simulate save delay
    setTimeout(() => {
      const success = saveResults(
        selectedMeetId,
        selectedEventId,
        currentHeat,
        resultsToSave,
      );
      setSaveStatus(success ? "saved" : null);

      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    }, 500);
  };

  const handleClear = () => {
    const clearedResults = { ...results };
    Object.keys(clearedResults).forEach((lane) => {
      if (clearedResults[lane]) {
        clearedResults[lane].finalTime = "";
        clearedResults[lane].place = "";
      }
    });
    setResults(clearedResults);
  };

  const getSaveButtonContent = () => {
    if (saveStatus === "saving") {
      return (
        <>
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          Saving...
        </>
      );
    } else if (saveStatus === "saved") {
      return (
        <>
          <Check size={16} />
          Results Saved!
        </>
      );
    } else {
      return (
        <>
          <Save size={16} />
          Save Results
        </>
      );
    }
  };

  const assignedLanes = Object.keys(results).filter((lane) => results[lane]);
  const completedResults = assignedLanes.filter(
    (lane) => results[lane]?.finalTime,
  );

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900">
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
              Results Entry
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-inter">
              Enter race times and finishes for swimmers
            </p>
          </div>
        </div>

        {selectedEventId && assignedLanes.length > 0 && (
          <div className="flex items-center gap-3">
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Heat{" "}
              <span className="font-semibold text-slate-800 dark:text-white">
                {currentHeat}
              </span>
            </div>
            <button
              onClick={() => setCurrentHeat((prev) => Math.max(1, prev - 1))}
              className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors font-inter"
              disabled={currentHeat <= 1}
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentHeat((prev) => prev + 1)}
              className="px-3 py-1 text-sm bg-slate-600 hover:bg-slate-500 text-white rounded transition-colors font-inter"
            >
              Next
            </button>
          </div>
        )}
      </div>

      {/* Meet/Event Selector */}
      <MeetEventSelector />

      {selectedMeetId && selectedEventId ? (
        <div className="max-w-6xl mx-auto">
          {assignedLanes.length > 0 ? (
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Trophy
                      size={18}
                      className="text-slate-500 dark:text-slate-400"
                    />
                    <h2 className="font-semibold text-slate-800 dark:text-white font-inter">
                      {selectedEvent?.name} • {selectedEvent?.ageGroup} - Heat{" "}
                      {currentHeat}
                    </h2>
                  </div>
                  <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                    {completedResults.length} of {assignedLanes.length} results
                    entered
                  </div>
                </div>
              </div>

              {/* Results Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-50 dark:bg-slate-900/50">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Lane
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Swimmer
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Team
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Final Time
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                        Place
                      </th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {assignedLanes.map((lane) => (
                      <tr
                        key={lane}
                        className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                      >
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="w-8 h-8 bg-slate-600 dark:bg-slate-500 text-white text-sm font-bold rounded-full flex items-center justify-center">
                            {lane}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="font-medium text-slate-800 dark:text-white font-inter">
                            {results[lane]?.name}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-slate-600 dark:text-slate-300 font-inter">
                            {results[lane]?.team}
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center gap-2">
                            <Clock
                              size={16}
                              className="text-slate-400 dark:text-slate-500"
                            />
                            <input
                              type="text"
                              placeholder="00.00"
                              value={results[lane]?.finalTime || ""}
                              onChange={(e) =>
                                handleTimeChange(lane, e.target.value)
                              }
                              className="w-24 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white font-mono focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <input
                            type="number"
                            placeholder="1"
                            min="1"
                            value={results[lane]?.place || ""}
                            onChange={(e) =>
                              handlePlaceChange(lane, e.target.value)
                            }
                            className="w-16 px-2 py-1 text-sm border border-slate-300 dark:border-slate-600 rounded bg-white dark:bg-slate-700 text-slate-800 dark:text-white text-center focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Action Buttons */}
              <div className="p-6 border-t border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex flex-wrap gap-3">
                  <button
                    onClick={handleSaveResults}
                    disabled={
                      saveStatus === "saving" || completedResults.length === 0
                    }
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter ${
                      saveStatus === "saved"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : completedResults.length === 0
                          ? "bg-slate-300 dark:bg-slate-600 text-slate-500 dark:text-slate-400 cursor-not-allowed"
                          : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {getSaveButtonContent()}
                  </button>

                  <button
                    onClick={handleClear}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all duration-150 font-inter"
                  >
                    <RotateCcw size={16} />
                    Clear
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="bg-slate-50 dark:bg-slate-800 rounded-xl p-12 border border-slate-200 dark:border-slate-700 text-center">
              <Trophy
                size={48}
                className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
              />
              <p className="text-slate-600 dark:text-slate-400 text-lg font-inter">
                No heat assignments found for Heat {currentHeat}.
              </p>
              <p className="text-slate-500 dark:text-slate-500 text-sm font-inter mt-2">
                Create heat assignments in the Heat Builder first.
              </p>
            </div>
          )}

          {/* Stats */}
          {assignedLanes.length > 0 && (
            <div className="mt-6 grid grid-cols-2 md:grid-cols-3 gap-4">
              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-inter">
                  {assignedLanes.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                  Swimmers in Heat
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-inter">
                  {completedResults.length}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                  Results Entered
                </div>
              </div>

              <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-inter">
                  {Math.round(
                    (completedResults.length / assignedLanes.length) * 100,
                  )}
                  %
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                  Complete
                </div>
              </div>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
