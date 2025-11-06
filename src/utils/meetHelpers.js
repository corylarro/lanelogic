export const getStatusColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-900/20 dark:text-blue-300 dark:border-blue-800";
    case "active":
      return "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/20 dark:text-green-300 dark:border-green-800";
    case "completed":
      return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:border-slate-600";
    default:
      return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-900/20 dark:text-amber-300 dark:border-amber-800";
  }
};

export const getStatusDotColor = (status) => {
  switch (status) {
    case "upcoming":
      return "bg-blue-500";
    case "active":
      return "bg-green-500";
    case "completed":
      return "bg-slate-500";
    default:
      return "bg-amber-500";
  }
};

export const getMeetData = (selectedMeet) => {
  return (
    selectedMeet || {
      id: 1,
      name: "Spring Championships 2024",
      date: "March 14, 2024",
      location: "Aquatic Center Pool",
      status: "active",
      poolLength: 50,
      lanes: 8,
      totalSwimmers: 204,
      totalEvents: 12,
      duration: "2 days",
    }
  );
};

export const getDefaultEvents = () => [
  {
    id: 1,
    name: "100m Freestyle",
    stroke: "Freestyle",
    distance: 100,
    ageGroup: "Boys 12-14",
    entries: 24,
    status: "ready",
  },
  {
    id: 2,
    name: "50m Backstroke",
    stroke: "Backstroke",
    distance: 50,
    ageGroup: "Girls 12-14",
    entries: 18,
    status: "completed",
  },
  {
    id: 3,
    name: "200m Butterfly",
    stroke: "Butterfly",
    distance: 200,
    ageGroup: "Boys 15-18",
    entries: 16,
    status: "in-progress",
  },
  {
    id: 4,
    name: "100m Breaststroke",
    stroke: "Breaststroke",
    distance: 100,
    ageGroup: "Girls 15-18",
    entries: 22,
    status: "ready",
  },
];

export const getTabs = () => [
  { id: "overview", label: "Overview" },
  { id: "events", label: "Events" },
  { id: "heats", label: "Heats" },
  { id: "results", label: "Results" },
  { id: "settings", label: "Settings" },
];
