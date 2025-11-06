import { useState, useEffect } from "react";
import {
  ArrowLeft,
  Users,
  Clock,
  Shuffle,
  Save,
  Plus,
  Check,
} from "lucide-react";
import { useMeetStore } from "@/stores/meetStore";
import {
  getHeatAssignments,
  saveHeatAssignments,
  getSwimmersForEvent,
} from "@/data/mockDB";
import MeetEventSelector from "./MeetEventSelector";

export default function HeatBuilder({ onNavigate }) {
  const {
    selectedMeetId,
    selectedEventId,
    selectedMeet,
    selectedEvent,
    getEligibleSwimmers,
  } = useMeetStore();

  const [currentHeat, setCurrentHeat] = useState(1);
  const [laneAssignments, setLaneAssignments] = useState({});
  const [draggedSwimmer, setDraggedSwimmer] = useState(null);
  const [dragOverLane, setDragOverLane] = useState(null);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'saved'

  const totalLanes = selectedMeet?.lanes || 8;

  // Initialize empty lanes when meet/event/heat changes
  useEffect(() => {
    if (selectedMeetId && selectedEventId) {
      // Try to load existing heat assignments
      const existingAssignments = getHeatAssignments(
        selectedMeetId,
        selectedEventId,
        currentHeat,
      );

      if (existingAssignments) {
        setLaneAssignments(existingAssignments);
      } else {
        // Initialize empty lanes
        const initialLanes = {};
        for (let i = 1; i <= totalLanes; i++) {
          initialLanes[i] = null;
        }
        setLaneAssignments(initialLanes);
      }
    }
  }, [selectedMeetId, selectedEventId, currentHeat, totalLanes]);

  const handleDragStart = (e, swimmer) => {
    setDraggedSwimmer(swimmer);
    e.dataTransfer.effectAllowed = "move";
  };

  const handleDragOver = (e, laneNumber) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
    setDragOverLane(laneNumber);
  };

  const handleDragLeave = () => {
    setDragOverLane(null);
  };

  const handleDrop = (e, laneNumber) => {
    e.preventDefault();
    setDragOverLane(null);

    if (!draggedSwimmer) return;

    // Check if swimmer is already in a lane and remove them
    const currentLaneAssignments = { ...laneAssignments };
    Object.keys(currentLaneAssignments).forEach((lane) => {
      if (currentLaneAssignments[lane]?.id === draggedSwimmer.id) {
        currentLaneAssignments[lane] = null;
      }
    });

    // Assign swimmer to new lane
    currentLaneAssignments[laneNumber] = {
      swimmerId: draggedSwimmer.id,
      name: draggedSwimmer.name,
      team: draggedSwimmer.team,
      seedTime: draggedSwimmer.seedTime,
    };
    setLaneAssignments(currentLaneAssignments);
    setDraggedSwimmer(null);
  };

  const removeSwimerFromLane = (laneNumber) => {
    setLaneAssignments((prev) => ({
      ...prev,
      [laneNumber]: null,
    }));
  };

  const getUnassignedSwimmers = () => {
    const eligibleSwimmers = getEligibleSwimmers();
    const assignedSwimmerIds = Object.values(laneAssignments)
      .filter(Boolean)
      .map((swimmer) => swimmer.swimmerId);

    return eligibleSwimmers
      .filter((swimmer) => !assignedSwimmerIds.includes(swimmer.id))
      .map((swimmer) => ({
        id: swimmer.id,
        name: swimmer.name,
        team: swimmer.team,
        seedTime: swimmer.seedTime,
      }));
  };

  const generateHeats = () => {
    // Auto-assign swimmers based on seed times
    const unassigned = getUnassignedSwimmers().sort(
      (a, b) => parseFloat(a.seedTime) - parseFloat(b.seedTime),
    );

    const newAssignments = {};
    const centerLanes = [4, 5, 3, 6, 2, 7, 1, 8]; // Assign fastest to center lanes

    // Initialize all lanes as empty
    for (let i = 1; i <= totalLanes; i++) {
      newAssignments[i] = null;
    }

    unassigned.forEach((swimmer, index) => {
      if (index < totalLanes) {
        const laneNumber = centerLanes[index] || index + 1;
        newAssignments[laneNumber] = {
          swimmerId: swimmer.id,
          name: swimmer.name,
          team: swimmer.team,
          seedTime: swimmer.seedTime,
        };
      }
    });

    setLaneAssignments(newAssignments);
  };

  const clearHeat = () => {
    const emptyLanes = {};
    for (let i = 1; i <= totalLanes; i++) {
      emptyLanes[i] = null;
    }
    setLaneAssignments(emptyLanes);
  };

  const handleSaveAssignments = () => {
    if (!selectedMeetId || !selectedEventId) return;

    setSaveStatus("saving");

    // Simulate save delay
    setTimeout(() => {
      const success = saveHeatAssignments(
        selectedMeetId,
        selectedEventId,
        currentHeat,
        laneAssignments,
      );
      setSaveStatus(success ? "saved" : null);

      // Reset save status after 2 seconds
      setTimeout(() => setSaveStatus(null), 2000);
    }, 500);
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
          Saved!
        </>
      );
    } else {
      return (
        <>
          <Save size={16} />
          Save Assignments
        </>
      );
    }
  };

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
              Heat Builder
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-inter">
              Drag swimmers into lanes to organize heats
            </p>
          </div>
        </div>

        {selectedEventId && (
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
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8 max-w-7xl mx-auto">
          {/* Left Column - Available Swimmers */}
          <div className="lg:col-span-2">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center gap-2">
                  <Users
                    size={18}
                    className="text-slate-500 dark:text-slate-400"
                  />
                  <h2 className="font-semibold text-slate-800 dark:text-white font-inter">
                    Available Swimmers
                  </h2>
                  <span className="text-sm text-slate-500 dark:text-slate-400 font-inter">
                    ({getUnassignedSwimmers().length})
                  </span>
                </div>
              </div>

              <div className="p-4 max-h-96 overflow-y-auto">
                <div className="space-y-2">
                  {getUnassignedSwimmers().map((swimmer) => (
                    <div
                      key={swimmer.id}
                      draggable
                      onDragStart={(e) => handleDragStart(e, swimmer)}
                      className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-700/50 rounded-lg border border-slate-200 dark:border-slate-600 cursor-move hover:bg-slate-100 dark:hover:bg-slate-700 transition-all duration-150 group"
                    >
                      <div>
                        <div className="font-medium text-slate-800 dark:text-white text-sm font-inter">
                          {swimmer.name}
                        </div>
                        <div className="text-xs text-slate-500 dark:text-slate-400 font-inter">
                          {swimmer.team}
                        </div>
                      </div>
                      <div className="flex items-center gap-1 text-sm">
                        <Clock
                          size={14}
                          className="text-slate-400 dark:text-slate-500"
                        />
                        <span className="font-mono text-slate-600 dark:text-slate-300">
                          {swimmer.seedTime}
                        </span>
                      </div>
                    </div>
                  ))}

                  {getUnassignedSwimmers().length === 0 && (
                    <div className="text-center py-8 text-slate-500 dark:text-slate-400 font-inter">
                      <Users size={32} className="mx-auto mb-2 opacity-50" />
                      <p className="text-sm">All swimmers assigned</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Lane Grid */}
          <div className="lg:col-span-3">
            <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
              <div className="p-4 border-b border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <h2 className="font-semibold text-slate-800 dark:text-white font-inter">
                  Lane Assignments - Heat {currentHeat}
                </h2>
              </div>

              <div className="p-6">
                {/* Lane Grid */}
                <div className="grid grid-cols-1 gap-3 mb-6">
                  {Array.from({ length: totalLanes }, (_, i) => i + 1).map(
                    (laneNumber) => (
                      <div
                        key={laneNumber}
                        onDragOver={(e) => handleDragOver(e, laneNumber)}
                        onDragLeave={handleDragLeave}
                        onDrop={(e) => handleDrop(e, laneNumber)}
                        className={`
                        relative p-4 rounded-lg border-2 border-dashed transition-all duration-200 min-h-[80px] flex items-center
                        ${
                          dragOverLane === laneNumber
                            ? "border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                            : "border-slate-300 dark:border-slate-600"
                        }
                        ${
                          laneAssignments[laneNumber]
                            ? "bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/30 dark:to-blue-800/30 border-solid border-blue-200 dark:border-blue-700"
                            : "bg-slate-50 dark:bg-slate-700/30"
                        }
                      `}
                      >
                        {/* Lane Number */}
                        <div className="absolute top-2 left-3 w-6 h-6 bg-slate-600 dark:bg-slate-500 text-white text-xs font-bold rounded-full flex items-center justify-center font-inter">
                          {laneNumber}
                        </div>

                        {/* Swimmer Assignment */}
                        {laneAssignments[laneNumber] ? (
                          <div className="flex items-center justify-between w-full ml-8">
                            <div>
                              <div className="font-medium text-slate-800 dark:text-white text-sm font-inter">
                                {laneAssignments[laneNumber].name}
                              </div>
                              <div className="text-xs text-slate-500 dark:text-slate-400 font-inter">
                                {laneAssignments[laneNumber].team}
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center gap-1 text-sm">
                                <Clock
                                  size={14}
                                  className="text-slate-400 dark:text-slate-500"
                                />
                                <span className="font-mono text-slate-600 dark:text-slate-300">
                                  {laneAssignments[laneNumber].seedTime}
                                </span>
                              </div>
                              <button
                                onClick={() => removeSwimerFromLane(laneNumber)}
                                className="text-red-500 hover:text-red-600 text-xs font-medium font-inter"
                              >
                                Remove
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div className="text-center w-full ml-8 text-slate-400 dark:text-slate-500 font-inter">
                            <p className="text-sm">Drop swimmer here</p>
                          </div>
                        )}
                      </div>
                    ),
                  )}
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap gap-3 pt-4 border-t border-slate-200 dark:border-slate-700">
                  <button
                    onClick={() => setCurrentHeat((prev) => prev + 1)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter"
                  >
                    <Plus size={16} />
                    Add Heat
                  </button>

                  <button
                    onClick={generateHeats}
                    className="flex items-center gap-2 px-4 py-2 bg-slate-600 hover:bg-slate-500 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter"
                  >
                    <Shuffle size={16} />
                    Auto Assign Lanes
                  </button>

                  <button
                    onClick={clearHeat}
                    className="flex items-center gap-2 px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 font-medium transition-all duration-150 font-inter"
                  >
                    Clear Heat
                  </button>

                  <button
                    onClick={handleSaveAssignments}
                    disabled={saveStatus === "saving"}
                    className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter ml-auto ${
                      saveStatus === "saved"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-green-600 hover:bg-green-700 text-white"
                    }`}
                  >
                    {getSaveButtonContent()}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      ) : null}

      {/* Quick Stats */}
      {selectedMeetId && selectedEventId && (
        <div className="mt-6 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-7xl mx-auto">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-blue-600 dark:text-blue-400 font-inter">
              {Object.values(laneAssignments).filter(Boolean).length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Assigned
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-orange-600 dark:text-orange-400 font-inter">
              {getUnassignedSwimmers().length}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Available
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-green-600 dark:text-green-400 font-inter">
              {totalLanes}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Total Lanes
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="text-2xl font-bold text-purple-600 dark:text-purple-400 font-inter">
              {currentHeat}
            </div>
            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
              Current Heat
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
