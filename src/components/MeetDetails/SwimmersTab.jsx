import { useState } from "react";
import { Plus, Users as UsersIcon, Edit2, X } from "lucide-react";
import SwimmerSelector from "../SwimmerSelector";

export function SwimmersTab({ meetData, onSwimmersUpdate }) {
    const [showSwimmerSelector, setShowSwimmerSelector] = useState(false);
    const swimmers = meetData?.swimmers || [];

    const handleSwimmersChange = (newSwimmers) => {
        if (onSwimmersUpdate) {
            onSwimmersUpdate(newSwimmers);
        }
        setShowSwimmerSelector(false);
    };

    const handleRemoveSwimmer = (swimmerId) => {
        if (
            window.confirm("Remove this swimmer from the meet?")
        ) {
            const updatedSwimmers = swimmers.filter((s) => s.id !== swimmerId);
            if (onSwimmersUpdate) {
                onSwimmersUpdate(updatedSwimmers);
            }
        }
    };

    // Group swimmers by team
    const swimmersByTeam = swimmers.reduce((acc, swimmer) => {
        const team = swimmer.team || "Unknown Team";
        if (!acc[team]) {
            acc[team] = [];
        }
        acc[team].push(swimmer);
        return acc;
    }, {});

    const teams = Object.keys(swimmersByTeam).sort();

    return (
        <div className="space-y-6">
            {/* Header with Add Button */}
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-inter">
                        Meet Roster
                    </h2>
                    <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-inter">
                        {swimmers.length} swimmer{swimmers.length !== 1 ? "s" : ""} assigned to this meet
                    </p>
                </div>
                <button
                    onClick={() => setShowSwimmerSelector(true)}
                    className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-inter text-sm"
                >
                    <Plus size={16} />
                    {swimmers.length > 0 ? "Edit Swimmers" : "Add Swimmers"}
                </button>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                        Total Swimmers
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 font-inter">
                        {swimmers.length}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                        Teams
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 font-inter">
                        {teams.length}
                    </div>
                </div>
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700">
                    <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                        Male / Female
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 font-inter">
                        {swimmers.filter((s) => s.gender === "male").length} /{" "}
                        {swimmers.filter((s) => s.gender === "female").length}
                    </div>
                </div>
            </div>

            {/* Swimmers List */}
            {swimmers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <UsersIcon
                        size={48}
                        className="mx-auto text-slate-400 dark:text-slate-600 mb-4"
                    />
                    <p className="text-slate-600 dark:text-slate-400 mb-4 font-inter">
                        No swimmers assigned to this meet yet.
                    </p>
                    <button
                        onClick={() => setShowSwimmerSelector(true)}
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-inter text-sm"
                    >
                        Add Swimmers
                    </button>
                </div>
            ) : (
                <div className="space-y-6">
                    {teams.map((team) => (
                        <div
                            key={team}
                            className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden"
                        >
                            {/* Team Header */}
                            <div className="bg-slate-50 dark:bg-slate-900/50 px-6 py-3 border-b border-slate-200 dark:border-slate-700">
                                <h3 className="font-semibold text-slate-800 dark:text-white font-inter">
                                    {team}
                                    <span className="ml-2 text-sm text-slate-500 dark:text-slate-400">
                                        ({swimmersByTeam[team].length} swimmer{swimmersByTeam[team].length !== 1 ? "s" : ""})
                                    </span>
                                </h3>
                            </div>

                            {/* Desktop Table View */}
                            <div className="hidden md:block">
                                <table className="w-full">
                                    <thead className="bg-slate-50 dark:bg-slate-900/30">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                                Name
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                                Gender
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                                Age
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                                Seed Time
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                                        {swimmersByTeam[team].map((swimmer) => (
                                            <tr
                                                key={swimmer.id}
                                                className="hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors"
                                            >
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="font-medium text-slate-800 dark:text-white font-inter">
                                                        {swimmer.first_name} {swimmer.last_name}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span className="text-sm text-slate-600 dark:text-slate-400 font-inter capitalize">
                                                        {swimmer.gender}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                                                        {swimmer.age}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-mono text-slate-600 dark:text-slate-400">
                                                        {swimmer.seedTime || "—"}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right">
                                                    <button
                                                        onClick={() => handleRemoveSwimmer(swimmer.id)}
                                                        className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors font-inter"
                                                    >
                                                        <X size={14} />
                                                        Remove
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="md:hidden divide-y divide-slate-200 dark:divide-slate-700">
                                {swimmersByTeam[team].map((swimmer) => (
                                    <div key={swimmer.id} className="p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <div className="font-semibold text-slate-800 dark:text-white font-inter">
                                                    {swimmer.first_name} {swimmer.last_name}
                                                </div>
                                                <div className="text-xs text-slate-500 dark:text-slate-400 font-inter capitalize">
                                                    {swimmer.gender}, Age {swimmer.age}
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => handleRemoveSwimmer(swimmer.id)}
                                                className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                            >
                                                <X size={16} />
                                            </button>
                                        </div>
                                        {swimmer.seedTime && (
                                            <div className="text-sm text-slate-600 dark:text-slate-400">
                                                <span className="font-inter">Seed Time: </span>
                                                <span className="font-mono">{swimmer.seedTime}</span>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            )}

            {/* Swimmer Selector Modal */}
            {showSwimmerSelector && (
                <SwimmerSelector
                    selectedSwimmers={swimmers}
                    onSwimmersChange={handleSwimmersChange}
                    onClose={() => setShowSwimmerSelector(false)}
                />
            )}
        </div>
    );
}