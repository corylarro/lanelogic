import { useState, useEffect } from "react";
import { Search, Plus, X, Users } from "lucide-react";
import { useQuery } from "@tanstack/react-query";

export default function SwimmerSelector({ selectedSwimmers = [], onSwimmersChange, onClose }) {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterGender, setFilterGender] = useState("all");
    const [filterTeam, setFilterTeam] = useState("all");
    const [localSelected, setLocalSelected] = useState(selectedSwimmers);

    // Fetch all swimmers
    const { data: swimmers = [], isLoading } = useQuery({
        queryKey: ["swimmers"],
        queryFn: async () => {
            const response = await fetch("/api/swimmers");
            if (!response.ok) throw new Error("Failed to fetch swimmers");
            return response.json();
        },
    });

    // Get unique teams for filter
    const teams = [...new Set(swimmers.map((s) => s.team))].sort();

    // Filter swimmers
    const filteredSwimmers = swimmers.filter((swimmer) => {
        const matchesSearch =
            searchQuery === "" ||
            `${swimmer.first_name} ${swimmer.last_name}`
                .toLowerCase()
                .includes(searchQuery.toLowerCase()) ||
            swimmer.team.toLowerCase().includes(searchQuery.toLowerCase());

        const matchesGender =
            filterGender === "all" || swimmer.gender === filterGender;

        const matchesTeam = filterTeam === "all" || swimmer.team === filterTeam;

        return matchesSearch && matchesGender && matchesTeam;
    });

    const isSelected = (swimmerId) => {
        return localSelected.some((s) => s.id === swimmerId);
    };

    const toggleSwimmer = (swimmer) => {
        if (isSelected(swimmer.id)) {
            setLocalSelected(localSelected.filter((s) => s.id !== swimmer.id));
        } else {
            setLocalSelected([...localSelected, swimmer]);
        }
    };

    const handleSelectAll = () => {
        // Add all filtered swimmers that aren't already selected
        const newSelections = filteredSwimmers.filter(
            (swimmer) => !isSelected(swimmer.id)
        );
        setLocalSelected([...localSelected, ...newSelections]);
    };

    const handleDeselectAll = () => {
        setLocalSelected([]);
    };

    const handleSave = () => {
        onSwimmersChange(localSelected);
        if (onClose) onClose();
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-4xl w-full max-h-[90vh] overflow-hidden shadow-xl flex flex-col">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <div>
                        <h2 className="text-xl font-bold text-slate-800 dark:text-white font-inter">
                            Select Swimmers
                        </h2>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-inter">
                            Choose swimmers to assign to this meet ({localSelected.length} selected)
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Search and Filters */}
                <div className="p-6 border-b border-slate-200 dark:border-slate-700">
                    <div className="flex flex-col md:flex-row gap-3 mb-3">
                        <div className="relative flex-1">
                            <input
                                type="text"
                                placeholder="Search swimmers or teams..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                            />
                            <Search
                                size={16}
                                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                            />
                        </div>
                        <select
                            value={filterGender}
                            onChange={(e) => setFilterGender(e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                        >
                            <option value="all">All Genders</option>
                            <option value="male">Male</option>
                            <option value="female">Female</option>
                        </select>
                        <select
                            value={filterTeam}
                            onChange={(e) => setFilterTeam(e.target.value)}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                        >
                            <option value="all">All Teams</option>
                            {teams.map((team) => (
                                <option key={team} value={team}>
                                    {team}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Bulk Actions */}
                    <div className="flex gap-2">
                        <button
                            onClick={handleSelectAll}
                            disabled={filteredSwimmers.length === 0}
                            className="text-sm px-3 py-1 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Select All Filtered
                        </button>
                        <button
                            onClick={handleDeselectAll}
                            disabled={localSelected.length === 0}
                            className="text-sm px-3 py-1 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 rounded transition-colors font-inter disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            Deselect All
                        </button>
                    </div>
                </div>

                {/* Swimmer List */}
                <div className="flex-1 overflow-y-auto p-6">
                    {isLoading ? (
                        <div className="text-center py-12">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                            <p className="text-slate-600 dark:text-slate-400 mt-4 font-inter">
                                Loading swimmers...
                            </p>
                        </div>
                    ) : filteredSwimmers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users
                                size={48}
                                className="mx-auto text-slate-400 dark:text-slate-600 mb-4"
                            />
                            <p className="text-slate-600 dark:text-slate-400 font-inter">
                                {swimmers.length === 0
                                    ? "No swimmers available. Add swimmers first."
                                    : "No swimmers match your filters."}
                            </p>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                            {filteredSwimmers.map((swimmer) => {
                                const selected = isSelected(swimmer.id);
                                return (
                                    <button
                                        key={swimmer.id}
                                        onClick={() => toggleSwimmer(swimmer)}
                                        className={`p-4 rounded-lg border-2 text-left transition-all duration-150 ${selected
                                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                                            : "border-slate-200 dark:border-slate-700 hover:border-slate-300 dark:hover:border-slate-600"
                                            }`}
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="font-semibold text-slate-800 dark:text-white font-inter">
                                                    {swimmer.first_name} {swimmer.last_name}
                                                </div>
                                                <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                                                    {swimmer.team}
                                                </div>
                                                <div className="flex gap-4 mt-2 text-xs text-slate-500 dark:text-slate-400">
                                                    <span className="capitalize">{swimmer.gender}</span>
                                                    <span>Age {swimmer.age}</span>
                                                    {swimmer.seedTime && (
                                                        <span className="font-mono">{swimmer.seedTime}</span>
                                                    )}
                                                </div>
                                            </div>
                                            <div
                                                className={`w-5 h-5 rounded border-2 flex items-center justify-center flex-shrink-0 ${selected
                                                    ? "bg-blue-500 border-blue-500"
                                                    : "border-slate-300 dark:border-slate-600"
                                                    }`}
                                            >
                                                {selected && (
                                                    <svg
                                                        className="w-3 h-3 text-white"
                                                        fill="none"
                                                        viewBox="0 0 24 24"
                                                        stroke="currentColor"
                                                    >
                                                        <path
                                                            strokeLinecap="round"
                                                            strokeLinejoin="round"
                                                            strokeWidth={3}
                                                            d="M5 13l4 4L19 7"
                                                        />
                                                    </svg>
                                                )}
                                            </div>
                                        </div>
                                    </button>
                                );
                            })}
                        </div>
                    )}
                </div>

                {/* Footer */}
                <div className="p-6 border-t border-slate-200 dark:border-slate-700 flex justify-between items-center">
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                        {localSelected.length} swimmer{localSelected.length !== 1 ? "s" : ""} selected
                    </div>
                    <div className="flex gap-3">
                        <button
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-inter"
                        >
                            Cancel
                        </button>
                        <button
                            onClick={handleSave}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-inter flex items-center gap-2"
                        >
                            <Plus size={16} />
                            Add {localSelected.length} Swimmer{localSelected.length !== 1 ? "s" : ""}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}