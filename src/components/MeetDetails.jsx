import { useState, useEffect } from "react";
import * as db from "@/lib/db";
import { NoMeetSelected } from "./MeetDetails/NoMeetSelected";
import { MeetHeader } from "./MeetDetails/MeetHeader";
import { MeetStats } from "./MeetDetails/MeetStats";
import { OverviewTab } from "./MeetDetails/OverviewTab";
import { EventsTab } from "./MeetDetails/EventsTab";
import { HeatsTab } from "./MeetDetails/HeatsTab/HeatsTab";
import { ResultsTab } from "./MeetDetails/ResultsTab";
import { SettingsTab } from "./MeetDetails/SettingsTab";
import { getTabs } from "@/utils/meetHelpers";

export default function MeetDetails({
  onNavigate,
  selectedMeet,
  onBackToDashboard,
}) {
  const [activeTab, setActiveTab] = useState("overview");
  const [meetData, setMeetData] = useState(null);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  const tabs = getTabs();

  // Load meet data and events from Firebase
  useEffect(() => {
    const loadMeetData = async () => {
      if (!selectedMeet?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);

        // Load meet from Firebase by ID
        const meet = await db.getMeet(selectedMeet.id);
        setMeetData(meet);

        // Load events for this meet
        const meetEvents = await db.getEventsByMeet(selectedMeet.id);
        setEvents(meetEvents);

        console.log('Loaded meet:', meet);
        console.log('Loaded events:', meetEvents);
      } catch (error) {
        console.error('Error loading meet data:', error);
      } finally {
        setLoading(false);
      }
    };

    loadMeetData();
  }, [selectedMeet?.id]);

  if (!selectedMeet) {
    return <NoMeetSelected onBackToDashboard={onBackToDashboard} />;
  }

  if (loading) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Loading meet details...</div>
        </div>
      </div>
    );
  }

  if (!meetData) {
    return (
      <div className="flex-1 bg-slate-50 dark:bg-slate-900 p-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-slate-600 dark:text-slate-400">Meet not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-slate-50 dark:bg-slate-900 animate-in fade-in-0 duration-300">
      <div className="p-6 md:p-8 space-y-6 animate-in slide-in-from-right-4 duration-500 ease-out">
        <MeetHeader meetData={meetData} />

        <MeetStats meetData={meetData} events={events} />

        <div className="bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
          <div className="border-b border-slate-200 dark:border-slate-700">
            <nav className="flex overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors font-inter ${activeTab === tab.id
                    ? "text-blue-600 dark:text-blue-400 border-b-2 border-blue-600 dark:border-blue-400 bg-blue-50/50 dark:bg-blue-900/10"
                    : "text-slate-600 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-700/30"
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
                events={events}
              />
            )}
            {activeTab === "events" && (
              <EventsTab
                events={events}
                meetData={meetData}
              />
            )}
            {activeTab === "heats" && (
              <HeatsTab
                meetData={meetData}
                events={events}
              />
            )}
            {activeTab === "results" && (
              <ResultsTab
                meetData={meetData}
                events={events}
              />
            )}
            {activeTab === "settings" && (
              <SettingsTab meetData={meetData} />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}