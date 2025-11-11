import { useState } from "react";
import { Plus, Search, Edit2, Trash2, Upload, Download, Users as UsersIcon } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import AddSwimmerModal from "./AddSwimmerModal";

export default function Swimmers() {
    const [searchQuery, setSearchQuery] = useState("");
    const [filterGender, setFilterGender] = useState("all");
    const [filterTeam, setFilterTeam] = useState("all");
    const [showAddModal, setShowAddModal] = useState(false);
    const [editingSwimmer, setEditingSwimmer] = useState(null);
    const queryClient = useQueryClient();

    // Fetch swimmers
    const { data: swimmers = [], isLoading } = useQuery({
        queryKey: ["swimmers"],
        queryFn: async () => {
            const response = await fetch("/api/swimmers");
            if (!response.ok) throw new Error("Failed to fetch swimmers");
            return response.json();
        },
    });

    // Delete mutation
    const deleteMutation = useMutation({
        mutationFn: async (swimmerId) => {
            const response = await fetch(`/api/swimmers/${swimmerId}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete swimmer");
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimmers"] });
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

    const handleEdit = (swimmer) => {
        setEditingSwimmer(swimmer);
        setShowAddModal(true);
    };

    const handleDelete = (swimmerId) => {
        if (
            window.confirm(
                "Are you sure you want to delete this swimmer? This action cannot be undone."
            )
        ) {
            deleteMutation.mutate(swimmerId);
        }
    };

    const handleModalClose = () => {
        setShowAddModal(false);
        setEditingSwimmer(null);
    };

    const handleImportCSV = () => {
        // TODO: Implement CSV import
        alert("CSV import coming soon!");
    };

    const handleExportCSV = () => {
        // TODO: Implement CSV export
        alert("CSV export coming soon!");
    };

    return (
        <div className="p-4 md:p-8 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-6">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                    <div>
                        <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-inter">
                            Swimmers
                        </h1>
                        <p className="text-sm text-slate-600 dark:text-slate-400 mt-1 font-inter">
                            Manage your team roster
                        </p>
                    </div>
                    <div className="flex gap-2">
                        <button
                            onClick={handleImportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-inter text-sm"
                        >
                            <Upload size={16} />
                            <span className="hidden sm:inline">Import CSV</span>
                        </button>
                        <button
                            onClick={handleExportCSV}
                            className="flex items-center gap-2 px-4 py-2 bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-slate-600 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-200 font-inter text-sm"
                        >
                            <Download size={16} />
                            <span className="hidden sm:inline">Export CSV</span>
                        </button>
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-inter text-sm"
                        >
                            <Plus size={16} />
                            Add Swimmer
                        </button>
                    </div>
                </div>

                {/* Search and Filters */}
                <div className="flex flex-col md:flex-row gap-3">
                    <div className="relative flex-1">
                        <input
                            type="text"
                            placeholder="Search swimmers or teams..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                        />
                        <Search
                            size={16}
                            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-500 dark:text-slate-400"
                        />
                    </div>
                    <select
                        value={filterGender}
                        onChange={(e) => setFilterGender(e.target.value)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                    >
                        <option value="all">All Genders</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                    </select>
                    <select
                        value={filterTeam}
                        onChange={(e) => setFilterTeam(e.target.value)}
                        className="px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter text-sm"
                    >
                        <option value="all">All Teams</option>
                        {teams.map((team) => (
                            <option key={team} value={team}>
                                {team}
                            </option>
                        ))}
                    </select>
                </div>
            </div>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
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
                        Filtered
                    </div>
                    <div className="text-2xl font-bold text-slate-800 dark:text-white mt-1 font-inter">
                        {filteredSwimmers.length}
                    </div>
                </div>
            </div>

            {/* Swimmers List */}
            {isLoading ? (
                <div className="text-center py-12">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
                    <p className="text-slate-600 dark:text-slate-400 mt-4 font-inter">
                        Loading swimmers...
                    </p>
                </div>
            ) : filteredSwimmers.length === 0 ? (
                <div className="text-center py-12 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700">
                    <UsersIcon
                        size={48}
                        className="mx-auto text-slate-400 dark:text-slate-600 mb-4"
                    />
                    <p className="text-slate-600 dark:text-slate-400 mb-4 font-inter">
                        {swimmers.length === 0
                            ? "No swimmers yet. Add your first swimmer to get started!"
                            : "No swimmers match your filters."}
                    </p>
                    {swimmers.length === 0 && (
                        <button
                            onClick={() => setShowAddModal(true)}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-all duration-200 font-inter text-sm"
                        >
                            Add Your First Swimmer
                        </button>
                    )}
                </div>
            ) : (
                <>
                    {/* Desktop Table View */}
                    <div className="hidden md:block bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <table className="w-full">
                            <thead className="bg-slate-50 dark:bg-slate-900/50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                        Name
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider font-inter">
                                        Team
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
                                {filteredSwimmers.map((swimmer) => (
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
                                            <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                                                {swimmer.team}
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
                                                onClick={() => handleEdit(swimmer)}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors font-inter"
                                            >
                                                <Edit2 size={14} />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(swimmer.id)}
                                                className="inline-flex items-center gap-1 px-3 py-1 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors ml-2 font-inter"
                                            >
                                                <Trash2 size={14} />
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    {/* Mobile Card View */}
                    <div className="md:hidden space-y-3">
                        {filteredSwimmers.map((swimmer) => (
                            <div
                                key={swimmer.id}
                                className="bg-white dark:bg-slate-800 p-4 rounded-lg border border-slate-200 dark:border-slate-700"
                            >
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <div className="font-semibold text-slate-800 dark:text-white font-inter">
                                            {swimmer.first_name} {swimmer.last_name}
                                        </div>
                                        <div className="text-sm text-slate-600 dark:text-slate-400 font-inter">
                                            {swimmer.team}
                                        </div>
                                    </div>
                                    <div className="flex gap-2">
                                        <button
                                            onClick={() => handleEdit(swimmer)}
                                            className="p-2 text-blue-600 dark:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 rounded transition-colors"
                                        >
                                            <Edit2 size={16} />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(swimmer.id)}
                                            className="p-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded transition-colors"
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </div>
                                <div className="grid grid-cols-2 gap-2 text-sm">
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 font-inter">
                                            Gender:
                                        </span>{" "}
                                        <span className="text-slate-700 dark:text-slate-300 font-inter capitalize">
                                            {swimmer.gender}
                                        </span>
                                    </div>
                                    <div>
                                        <span className="text-slate-500 dark:text-slate-400 font-inter">
                                            Age:
                                        </span>{" "}
                                        <span className="text-slate-700 dark:text-slate-300 font-inter">
                                            {swimmer.age}
                                        </span>
                                    </div>
                                    <div className="col-span-2">
                                        <span className="text-slate-500 dark:text-slate-400 font-inter">
                                            Seed Time:
                                        </span>{" "}
                                        <span className="text-slate-700 dark:text-slate-300 font-mono">
                                            {swimmer.seedTime || "—"}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </>
            )}

            {/* Add/Edit Modal */}
            {showAddModal && (
                <AddSwimmerModal
                    swimmer={editingSwimmer}
                    onClose={handleModalClose}
                />
            )}
        </div>
    );
}