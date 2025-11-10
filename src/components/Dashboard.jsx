import { useState, useEffect } from "react";
import {
  Plus,
  Calendar,
  MapPin,
  Users,
  Trophy,
  Target,
  Clock,
  Eye,
  Waves,
} from "lucide-react";
import * as db from "@/lib/db"; // ✅ NEW — Firestore helper
import { useMeetStore } from "@/stores/meetStore";

export default function Dashboard({ onNavigate, onMeetSelect }) {
  const { setSelectedMeet } = useMeetStore();
  const [meets, setMeets] = useState([]); // ✅ replaced static data with state
  const [loading, setLoading] = useState(true);

  // ✅ Load meets from Firestore on mount
  useEffect(() => {
    const loadMeets = async () => {
      try {
        const fetchedMeets = await db.getMeets();
        setMeets(fetchedMeets);
        console.log("✅ Loaded meets:", fetchedMeets);
      } catch (err) {
        console.error("❌ Failed to load meets:", err);
      } finally {
        setLoading(false);
      }
    };
    loadMeets();
  }, []);

  const handleMeetSelect = (meet) => {
    setSelectedMeet(meet.id);
    if (onMeetSelect) onMeetSelect(meet);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "upcoming":
        return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-700";
      case "active":
        return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-700";
      case "completed":
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700";
      case "draft":
        return "bg-orange-50 text-orange-700 border-orange-200 dark:bg-orange-900/20 dark:text-orange-300 dark:border-orange-700";
      default:
        return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-900/20 dark:text-slate-300 dark:border-slate-700";
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case "upcoming":
        return "Upcoming";
      case "active":
        return "Live";
      case "completed":
        return "Completed";
      case "draft":
        return "Draft";
      default:
        return status;
    }
  };

  if (loading) {
    return (
      <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
        <p className="text-slate-500 dark:text-slate-400 font-inter">
          Loading meets...
        </p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white mb-2 font-inter">
          Dashboard
        </h1>
        <p className="text-slate-600 dark:text-slate-400 font-inter">
          Manage your swimming meets and competitions
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <button
          onClick={() => onNavigate("create-meet")}
          className="flex items-center gap-3 p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md group"
        >
          <div className="p-2 bg-blue-500 rounded-lg group-hover:bg-blue-600 transition-colors">
            <Plus size={20} />
          </div>
          <div className="text-left">
            <div className="font-medium font-inter">New Meet</div>
            <div className="text-sm text-blue-200 font-inter">Create meet</div>
          </div>
        </button>

        {/* Other buttons unchanged */}
      </div>

      {/* Recent Meets */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold text-slate-800 dark:text-white font-inter">
            Recent Meets
          </h2>
          <button
            onClick={() => onNavigate("create-meet")}
            className="flex items-center gap-2 px-4 py-2 text-sm bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors font-inter"
          >
            <Plus size={16} />
            New Meet
          </button>
        </div>

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {meets.map((meet) => (
            <div
              key={meet.id}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl p-6 hover:shadow-md transition-all duration-200 group cursor-pointer"
              onClick={() => handleMeetSelect(meet)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-800 dark:text-white mb-1 font-inter group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {meet.name}
                  </h3>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400 mb-2">
                    <Calendar size={14} />
                    <span className="font-inter">{meet.date}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <MapPin size={14} />
                    <span className="font-inter">{meet.venue}</span>
                  </div>
                </div>
                <span
                  className={`px-2 py-1 text-xs font-medium rounded-md border ${getStatusColor(
                    meet.status
                  )} font-inter`}
                >
                  {getStatusText(meet.status)}
                </span>
              </div>
            </div>
          ))}

          {meets.length === 0 && (
            <div className="col-span-full">
              <div className="bg-slate-50 dark:bg-slate-800 border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-xl p-8 text-center">
                <Waves
                  size={48}
                  className="text-slate-400 dark:text-slate-500 mx-auto mb-4"
                />
                <h3 className="font-medium text-slate-800 dark:text-white mb-2 font-inter">
                  No meets created yet
                </h3>
                <p className="text-slate-500 dark:text-slate-400 mb-4 font-inter">
                  Get started by creating your first swimming meet
                </p>
                <button
                  onClick={() => onNavigate("create-meet")}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors font-inter"
                >
                  <Plus size={16} />
                  Create Meet
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
