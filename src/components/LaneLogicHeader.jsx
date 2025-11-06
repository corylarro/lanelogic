import { useState } from "react";
import { Search, Bell, Settings, Menu, User, ArrowLeft } from "lucide-react";

export default function LaneLogicHeader({
  onMenuClick,
  title = "Dashboard",
  selectedMeet = null,
  onBackToDashboard = null,
}) {
  const [searchValue, setSearchValue] = useState("");
  const [isSearchFocused, setIsSearchFocused] = useState(false);

  return (
    <div className="h-16 bg-white dark:bg-[#1A1A1A] flex items-center justify-between px-4 md:px-6 border-b border-slate-200 dark:border-slate-700 flex-shrink-0">
      {/* Left side - Mobile menu button, back button, and page title */}
      <div className="flex items-center gap-3">
        {/* Mobile menu button */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 rounded-lg transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 active:scale-95"
        >
          <Menu size={20} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Back to Dashboard button - only show when viewing meet details */}
        {onBackToDashboard && (
          <button
            onClick={onBackToDashboard}
            className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-lg transition-all duration-150 hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-slate-800 dark:hover:text-white"
          >
            <ArrowLeft size={16} />
            <span className="text-sm font-medium">Back to Dashboard</span>
          </button>
        )}

        <div className="flex flex-col">
          <h1 className="text-xl md:text-2xl font-bold text-slate-800 dark:text-white tracking-tight font-inter">
            {title}
          </h1>
          {/* Active Meet Indicator */}
          {selectedMeet && (
            <div className="text-xs text-slate-500 dark:text-slate-400 font-inter">
              Active Meet: {selectedMeet.name}
            </div>
          )}
        </div>
      </div>

      {/* Right side - Search, Action buttons and profile area */}
      <div className="flex items-center space-x-2 md:space-x-4">
        {/* Search field */}
        <div className="relative hidden md:block">
          <input
            type="text"
            placeholder="Search meets, swimmers..."
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
            onFocus={() => setIsSearchFocused(true)}
            onBlur={() => setIsSearchFocused(false)}
            className={`w-[250px] h-10 pl-10 pr-4 rounded-lg bg-slate-50 dark:bg-slate-800 border transition-all duration-200 font-inter text-sm text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 ${
              isSearchFocused
                ? "border-blue-300 dark:border-blue-600 bg-white dark:bg-slate-700"
                : "border-slate-200 dark:border-slate-600 hover:border-slate-300 dark:hover:border-slate-500"
            }`}
          />
          <Search
            size={16}
            className="absolute left-3.5 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
          />
        </div>

        {/* Mobile search button */}
        <button className="md:hidden w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 active:scale-95">
          <Search size={18} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Notification Bell */}
        <button className="w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 flex items-center justify-center transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 active:scale-95">
          <Bell size={18} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* Settings - Hidden on small screens */}
        <button className="hidden sm:flex w-10 h-10 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-600 items-center justify-center transition-all duration-150 hover:bg-slate-100 dark:hover:bg-slate-700 active:bg-slate-200 dark:active:bg-slate-600 active:scale-95">
          <Settings size={18} className="text-slate-600 dark:text-slate-300" />
        </button>

        {/* User Avatar/Profile */}
        <div className="relative">
          <button className="w-10 h-10 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center transition-all duration-150 hover:from-blue-600 hover:to-blue-700 active:scale-95">
            <User size={18} className="text-white" />
          </button>
        </div>
      </div>
    </div>
  );
}
