import { useState } from "react";
import LaneLogicSidebar from "../../components/LaneLogicSidebar";
import LaneLogicHeader from "../../components/LaneLogicHeader";
import Dashboard from "../../components/Dashboard";
import CreateMeet from "../../components/CreateMeet";
import HeatBuilder from "../../components/HeatBuilder";
import PublicResults from "../../components/PublicResults";
import ResultsEntry from "../../components/ResultsEntry";
import MeetDetails from "../../components/MeetDetails";

export default function LaneLogicApp() {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState("dashboard");
  const [selectedMeet, setSelectedMeet] = useState(null);

  const handleNavigate = (page) => {
    setCurrentPage(page);
    setSidebarOpen(false); // Close sidebar on navigation (mobile)

    // Clear selected meet when navigating away from meet details
    if (page !== "meet-details") {
      setSelectedMeet(null);
    }
  };

  const handleMeetSelect = (meet) => {
    setSelectedMeet(meet);
    setCurrentPage("meet-details");
    setSidebarOpen(false);
  };

  const handleBackToDashboard = () => {
    setSelectedMeet(null);
    setCurrentPage("dashboard");
  };

  const getPageTitle = () => {
    switch (currentPage) {
      case "dashboard":
        return "Dashboard";
      case "create-meet":
        return "Create Meet";
      case "meet-details":
        return selectedMeet
          ? `${selectedMeet.name} • ${selectedMeet.date}`
          : "Meet Details";
      case "heat-builder":
        return "Heat Builder";
      case "results":
        return "Results Entry";
      case "public":
        return "Public Results";
      default:
        return "Dashboard";
    }
  };

  const renderCurrentPage = () => {
    switch (currentPage) {
      case "dashboard":
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onMeetSelect={handleMeetSelect}
          />
        );
      case "create-meet":
        return <CreateMeet onNavigate={handleNavigate} />;
      case "meet-details":
        return (
          <MeetDetails
            onNavigate={handleNavigate}
            selectedMeet={selectedMeet}
            onBackToDashboard={handleBackToDashboard}
          />
        );
      case "heat-builder":
        return <HeatBuilder onNavigate={handleNavigate} />;
      case "results":
        return <ResultsEntry onNavigate={handleNavigate} />;
      case "public":
        return <PublicResults onNavigate={handleNavigate} />;
      default:
        return (
          <Dashboard
            onNavigate={handleNavigate}
            onMeetSelect={handleMeetSelect}
          />
        );
    }
  };

  return (
    <div className="flex h-screen bg-slate-50 dark:bg-slate-900">
      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 dark:bg-black dark:bg-opacity-70 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Responsive: hidden on mobile, toggleable via overlay */}
      <div
        className={`
        fixed lg:static inset-y-0 left-0 z-50 lg:z-auto
        transform ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
        lg:translate-x-0 transition-transform duration-300 ease-in-out
      `}
      >
        <LaneLogicSidebar
          onClose={() => setSidebarOpen(false)}
          currentPage={currentPage}
          onNavigate={handleNavigate}
        />
      </div>

      {/* Main content area - Takes remaining width, contains header and main sections */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header - Fixed top bar spanning full width of main content area */}
        <LaneLogicHeader
          onMenuClick={() => setSidebarOpen(true)}
          title={getPageTitle()}
          selectedMeet={selectedMeet}
          onBackToDashboard={
            currentPage === "meet-details" ? handleBackToDashboard : null
          }
        />

        {/* Content area below header - Scrollable, contains main page content */}
        <div className="flex-1 overflow-y-auto">{renderCurrentPage()}</div>
      </div>
    </div>
  );
}
