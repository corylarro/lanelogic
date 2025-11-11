import { useState } from "react";
import {
  LayoutDashboard,
  Plus,
  Users,
  Trophy,
  Calendar,
  Eye,
  Waves,
  FileText,
  UserCircle2,
} from "lucide-react";

export default function LaneLogicSidebar({ onClose, currentPage, onNavigate }) {
  const handleItemClick = (itemName, path) => {
    if (onNavigate) {
      onNavigate(path);
    }
    // Close sidebar on mobile when item is clicked
    if (onClose && typeof window !== "undefined" && window.innerWidth < 1024) {
      onClose();
    }
  };

  const navigationItems = [
    {
      name: "Dashboard",
      icon: LayoutDashboard,
      path: "dashboard",
      hasSubmenu: false,
    },
    {
      name: "Swimmers",
      icon: UserCircle2,
      path: "swimmers",
      hasSubmenu: false
    },
    { name: "Create Meet", icon: Plus, path: "create-meet", hasSubmenu: false },
    {
      name: "Heat Builder",
      icon: Users,
      path: "heat-builder",
      hasSubmenu: false,
    },
    { name: "Results Entry", icon: Trophy, path: "results", hasSubmenu: false },
    { name: "Public Results", icon: Eye, path: "public", hasSubmenu: false },
  ];

  return (
    <div className="w-60 bg-white dark:bg-[#1A1A1A] flex-shrink-0 flex flex-col h-full border-r border-[#E5E7EB] dark:border-[#374151]">
      {/* Brand Logo */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center">
          <Waves size={20} className="text-white" />
        </div>
        <div>
          <h1 className="text-xl font-bold text-slate-800 dark:text-white font-inter">
            LaneLogic
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-inter">
            Swim Meet Manager
          </p>
        </div>
      </div>

      {/* Navigation Menu */}
      <nav className="flex-1 px-4">
        <div className="space-y-1">
          {navigationItems.map((item) => {
            const Icon = item.icon;
            const isActive = currentPage === item.path;

            return (
              <button
                key={item.name}
                onClick={() => handleItemClick(item.name, item.path)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${isActive
                  ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 text-blue-700 dark:text-blue-300"
                  : "text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-50 dark:hover:bg-slate-800 active:bg-slate-100 dark:active:bg-slate-700"
                  }`}
              >
                <Icon
                  size={18}
                  className={
                    isActive
                      ? "text-blue-600 dark:text-blue-400"
                      : "text-slate-500 dark:text-slate-400"
                  }
                />
                <span className="font-medium text-sm font-inter">
                  {item.name}
                </span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Bottom Info */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-700">
        <div className="text-xs text-slate-500 dark:text-slate-400 text-center font-inter">
          Professional swim meet management
        </div>
      </div>
    </div>
  );
}