import { useState } from "react";
import { NoMeetSelected } from "./MeetDetails/NoMeetSelected";
import { MeetHeader } from "./MeetDetails/MeetHeader";
import { MeetStats } from "./MeetDetails/MeetStats";
import { OverviewTab } from "./MeetDetails/OverviewTab";
import { EventsTab } from "./MeetDetails/EventsTab";
import { HeatsTab } from "./MeetDetails/HeatsTab/HeatsTab";
import { ResultsTab } from "./MeetDetails/ResultsTab";
import { SettingsTab } from "./MeetDetails/SettingsTab";
import { useMeetSwimmers } from "@/hooks/useMeetSwimmers";
import { useHeatBuilder } from "@/hooks/useHeatBuilder";
import { getMeetData, getDefaultEvents, getTabs } from "@/utils/meetHelpers";

export default function MeetDetails({
  onNavigate,
  selectedMeet,
  onBackToDashboard,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedEvent, setSelectedEvent] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [showAddEventModal, setShowAddEventModal] = useState(false);

  const meetData = getMeetData(selectedMeet);
  const events = getDefaultEvents();
  const tabs = getTabs();
  const totalLanes = meetData?.lanes || 8;

  const { swimmers, loadingSwimmers } = useMeetSwimmers(meetData?.id);

  const {
    currentHeat,
    setCurrentHeat,
    laneAssignments,
    draggedSwimmer,
    dragOverLane,
    handleDragStart,
    handleDragOver,
    handleDragLeave,
    handleDrop,
    removeSwimmerFromLane,
    clearHeat,
    autoAssignLanes,
  } = useHeatBuilder(totalLanes, selectedEvent);

  const getEligibleSwimmers = () => {
    if (!selectedEvent || !swimmers.length) return [];

    const event = events.find((e) => e.id.toString() === selectedEvent);
    if (!event) return [];

    let filtered = swimmers;

    if (event.ageGroup.includes("Boys")) {
      filtered = filtered.filter((s) => s.gender === "male");
    } else if (event.ageGroup.includes("Girls")) {
      filtered = filtered.filter((s) => s.gender === "female");
    }

    return filtered.map((swimmer) => ({
      id: swimmer.id,
      name: `${swimmer.first_name} ${swimmer.last_name}`,
      team: swimmer.team,
      seedTime: swimmer.seedTime,
    }));
  };

  const getUnassignedSwimmers = () => {
    const assignedSwimmerIds = Object.values(laneAssignments)
      .filter(Boolean)
      .map((swimmer) => swimmer.id);

    return getEligibleSwimmers().filter(
      (swimmer) => !assignedSwimmerIds.includes(swimmer.id),
    );
  };

  if (!selectedMeet) {
    return <NoMeetSelected onBackToDashboard={onBackToDashboard} />;
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 animate-in fade-in-0 duration-300">
      <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-right-4 duration-500 ease-out">
        <MeetHeader
          meetData={meetData}
          onEditClick={() => setShowEditModal(true)}
        />

        <MeetStats meetData={meetData} />

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors font-inter ${
                    activeTab === tab.id
                      ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50 dark:bg-blue-900/20"
                      : "text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-700/20"
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </nav>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <OverviewTab
                meetData={meetData}
                onAddEvent={() => setShowAddEventModal(true)}
                onBuildHeats={() => setActiveTab("heats")}
              />
            )}
            {activeTab === "events" && (
              <EventsTab
                events={events}
                onAddEvent={() => setShowAddEventModal(true)}
                onGoToHeats={(eventId) => {
                  setActiveTab("heats");
                  setSelectedEvent(eventId);
                }}
              />
            )}
            {activeTab === "heats" && (
              <HeatsTab
                events={events}
                selectedEvent={selectedEvent}
                onEventChange={setSelectedEvent}
                currentHeat={currentHeat}
                onPreviousHeat={() =>
                  setCurrentHeat((prev) => Math.max(1, prev - 1))
                }
                onNextHeat={() => setCurrentHeat((prev) => prev + 1)}
                eligibleSwimmers={getEligibleSwimmers()}
                unassignedSwimmers={getUnassignedSwimmers()}
                loadingSwimmers={loadingSwimmers}
                totalLanes={totalLanes}
                laneAssignments={laneAssignments}
                dragOverLane={dragOverLane}
                onDragStart={handleDragStart}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onRemoveSwimmer={removeSwimmerFromLane}
                onAddHeat={() => setCurrentHeat((prev) => prev + 1)}
                onAutoAssign={() => autoAssignLanes(getUnassignedSwimmers())}
                onClearHeat={clearHeat}
              />
            )}
            {activeTab === "results" && <ResultsTab events={events} />}
            {activeTab === "settings" && <SettingsTab meetData={meetData} />}
          </div>
        </div>
      </div>
    </div>
  );
}
