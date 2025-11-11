import { useState, useEffect } from "react";
import { X } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function AddSwimmerModal({ swimmer, onClose }) {
    const queryClient = useQueryClient();
    const isEditing = !!swimmer;

    const [formData, setFormData] = useState({
        first_name: "",
        last_name: "",
        team: "",
        gender: "male",
        age: "",
        birthdate: "",
        seedTime: "",
    });

    const [errors, setErrors] = useState({});

    useEffect(() => {
        if (swimmer) {
            setFormData({
                first_name: swimmer.first_name || "",
                last_name: swimmer.last_name || "",
                team: swimmer.team || "",
                gender: swimmer.gender || "male",
                age: swimmer.age || "",
                birthdate: swimmer.birthdate || "",
                seedTime: swimmer.seedTime || "",
            });
        }
    }, [swimmer]);

    // Create/Update mutation
    const saveMutation = useMutation({
        mutationFn: async (swimmerData) => {
            const url = isEditing
                ? `/api/swimmers/${swimmer.id}`
                : "/api/swimmers";
            const method = isEditing ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(swimmerData),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || "Failed to save swimmer");
            }
            return response.json();
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["swimmers"] });
            onClose();
        },
    });

    const handleInputChange = (field, value) => {
        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
        // Clear error when user starts typing
        if (errors[field]) {
            setErrors((prev) => ({
                ...prev,
                [field]: "",
            }));
        }
    };

    const validateForm = () => {
        const newErrors = {};

        if (!formData.first_name.trim()) {
            newErrors.first_name = "First name is required";
        }

        if (!formData.last_name.trim()) {
            newErrors.last_name = "Last name is required";
        }

        if (!formData.team.trim()) {
            newErrors.team = "Team is required";
        }

        if (!formData.age || formData.age < 1 || formData.age > 100) {
            newErrors.age = "Valid age is required";
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!validateForm()) {
            return;
        }

        saveMutation.mutate(formData);
    };

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 dark:bg-opacity-70 z-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-xl">
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-slate-200 dark:border-slate-700">
                    <h2 className="text-xl font-bold text-slate-800 dark:text-white font-inter">
                        {isEditing ? "Edit Swimmer" : "Add New Swimmer"}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                    >
                        <X size={20} className="text-slate-600 dark:text-slate-400" />
                    </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* First Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                First Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.first_name}
                                onChange={(e) =>
                                    handleInputChange("first_name", e.target.value)
                                }
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter ${errors.first_name
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-slate-300 dark:border-slate-600"
                                    }`}
                                placeholder="John"
                            />
                            {errors.first_name && (
                                <p className="text-red-500 text-sm mt-1 font-inter">
                                    {errors.first_name}
                                </p>
                            )}
                        </div>

                        {/* Last Name */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Last Name <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.last_name}
                                onChange={(e) => handleInputChange("last_name", e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter ${errors.last_name
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-slate-300 dark:border-slate-600"
                                    }`}
                                placeholder="Smith"
                            />
                            {errors.last_name && (
                                <p className="text-red-500 text-sm mt-1 font-inter">
                                    {errors.last_name}
                                </p>
                            )}
                        </div>

                        {/* Team */}
                        <div className="md:col-span-2">
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Team <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="text"
                                value={formData.team}
                                onChange={(e) => handleInputChange("team", e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter ${errors.team
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-slate-300 dark:border-slate-600"
                                    }`}
                                placeholder="Sharks"
                            />
                            {errors.team && (
                                <p className="text-red-500 text-sm mt-1 font-inter">
                                    {errors.team}
                                </p>
                            )}
                        </div>

                        {/* Gender */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Gender <span className="text-red-500">*</span>
                            </label>
                            <select
                                value={formData.gender}
                                onChange={(e) => handleInputChange("gender", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter"
                            >
                                <option value="male">Male</option>
                                <option value="female">Female</option>
                            </select>
                        </div>

                        {/* Age */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Age <span className="text-red-500">*</span>
                            </label>
                            <input
                                type="number"
                                min="1"
                                max="100"
                                value={formData.age}
                                onChange={(e) => handleInputChange("age", e.target.value)}
                                className={`w-full px-4 py-2 border rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter ${errors.age
                                    ? "border-red-500 dark:border-red-500"
                                    : "border-slate-300 dark:border-slate-600"
                                    }`}
                                placeholder="14"
                            />
                            {errors.age && (
                                <p className="text-red-500 text-sm mt-1 font-inter">
                                    {errors.age}
                                </p>
                            )}
                        </div>

                        {/* Birthdate (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Birthdate
                            </label>
                            <input
                                type="date"
                                value={formData.birthdate}
                                onChange={(e) => handleInputChange("birthdate", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter"
                            />
                        </div>

                        {/* Seed Time (Optional) */}
                        <div>
                            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                                Seed Time (50m Free)
                            </label>
                            <input
                                type="text"
                                value={formData.seedTime}
                                onChange={(e) => handleInputChange("seedTime", e.target.value)}
                                className="w-full px-4 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-900 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-600 font-inter font-mono"
                                placeholder="25.34"
                            />
                            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 font-inter">
                                Format: SS.MS (e.g., 25.34)
                            </p>
                        </div>
                    </div>

                    {/* Error Summary */}
                    {Object.keys(errors).length > 0 && (
                        <div className="mt-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                            <p className="text-sm text-red-600 dark:text-red-400 font-inter">
                                Please fix the errors above before submitting.
                            </p>
                        </div>
                    )}

                    {/* Actions */}
                    <div className="flex justify-end gap-3 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors font-inter"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saveMutation.isPending}
                            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors font-inter flex items-center gap-2"
                        >
                            {saveMutation.isPending ? (
                                <>
                                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                                    Saving...
                                </>
                            ) : (
                                <>{isEditing ? "Update Swimmer" : "Add Swimmer"}</>
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}