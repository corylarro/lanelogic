import { useState } from "react";
import {
  ArrowLeft,
  Calendar,
  MapPin,
  Ruler,
  Hash,
  Save,
  Users,
  Plus,
} from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export default function CreateMeet({ onNavigate, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    venue: "",
    poolLength: "50m",
    lanes: "8",
    description: "",
    selectedEvents: [],
  });
  const [errors, setErrors] = useState({});

  const queryClient = useQueryClient();

  // Common swimming events
  const availableEvents = [
    { id: "50_free", name: "50 Free", category: "Freestyle" },
    { id: "100_free", name: "100 Free", category: "Freestyle" },
    { id: "200_free", name: "200 Free", category: "Freestyle" },
    { id: "500_free", name: "500 Free", category: "Freestyle" },
    { id: "1000_free", name: "1000 Free", category: "Freestyle" },
    { id: "1650_free", name: "1650 Free", category: "Freestyle" },
    { id: "50_back", name: "50 Back", category: "Backstroke" },
    { id: "100_back", name: "100 Back", category: "Backstroke" },
    { id: "200_back", name: "200 Back", category: "Backstroke" },
    { id: "50_breast", name: "50 Breast", category: "Breaststroke" },
    { id: "100_breast", name: "100 Breast", category: "Breaststroke" },
    { id: "200_breast", name: "200 Breast", category: "Breaststroke" },
    { id: "50_fly", name: "50 Fly", category: "Butterfly" },
    { id: "100_fly", name: "100 Fly", category: "Butterfly" },
    { id: "200_fly", name: "200 Fly", category: "Butterfly" },
    { id: "100_im", name: "100 IM", category: "Individual Medley" },
    { id: "200_im", name: "200 IM", category: "Individual Medley" },
    { id: "400_im", name: "400 IM", category: "Individual Medley" },
    { id: "200_free_relay", name: "200 Free Relay", category: "Relay" },
    { id: "400_free_relay", name: "400 Free Relay", category: "Relay" },
    { id: "200_medley_relay", name: "200 Medley Relay", category: "Relay" },
    { id: "400_medley_relay", name: "400 Medley Relay", category: "Relay" },
  ];

  // Group events by category
  const eventsByCategory = availableEvents.reduce((acc, event) => {
    if (!acc[event.category]) {
      acc[event.category] = [];
    }
    acc[event.category].push(event);
    return acc;
  }, {});

  // Create meet mutation
  const createMeetMutation = useMutation({
    mutationFn: async (meetData) => {
      const response = await fetch("/api/meets", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(meetData),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to create meet");
      }
      return response.json();
    },
    onSuccess: () => {
      // Refresh the meets list
      queryClient.invalidateQueries({ queryKey: ["meets"] });
      // Navigate back to dashboard
      onNavigate("dashboard");
    },
    onError: (error) => {
      console.error("Error creating meet:", error);
      // Could show a toast notification here
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

  const handleEventToggle = (eventId) => {
    setFormData((prev) => ({
      ...prev,
      selectedEvents: prev.selectedEvents.includes(eventId)
        ? prev.selectedEvents.filter((id) => id !== eventId)
        : [...prev.selectedEvents, eventId],
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = "Meet name is required";
    }

    if (!formData.date) {
      newErrors.date = "Date is required";
    }

    if (!formData.venue.trim()) {
      newErrors.venue = "Venue is required";
    }

    if (formData.selectedEvents.length === 0) {
      newErrors.selectedEvents = "Please select at least one event";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    // Submit the form using the mutation
    createMeetMutation.mutate(formData);
  };

  const handleAddSwimmers = () => {
    // For now, just show an alert - this would open the swimmer management flow
    alert("Add Swimmers functionality coming soon!");
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => onNavigate("dashboard")}
          className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150"
        >
          <ArrowLeft size={20} className="text-slate-600 dark:text-slate-400" />
        </button>
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-inter">
            Create New Meet
          </h1>
          <p className="text-slate-600 dark:text-slate-400 font-inter">
            Set up the basic information for your swim meet
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Meet Name */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label
              htmlFor="meetName"
              className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter"
            >
              <Calendar
                size={16}
                className="text-slate-500 dark:text-slate-500"
              />
              Meet Name
            </label>
            <input
              id="meetName"
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange("name", e.target.value)}
              placeholder="e.g., Spring Championships 2024"
              className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 font-inter ${
                errors.name
                  ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                  : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
              } text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent`}
            />
            {errors.name && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-inter">
                {errors.name}
              </p>
            )}
          </div>

          {/* Date and Venue Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Date */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label
                htmlFor="meetDate"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter"
              >
                <Calendar
                  size={16}
                  className="text-slate-500 dark:text-slate-500"
                />
                Date
              </label>
              <input
                id="meetDate"
                type="date"
                value={formData.date}
                onChange={(e) => handleInputChange("date", e.target.value)}
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 font-inter ${
                  errors.date
                    ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                } text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent`}
              />
              {errors.date && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-inter">
                  {errors.date}
                </p>
              )}
            </div>

            {/* Venue */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label
                htmlFor="venue"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter"
              >
                <MapPin
                  size={16}
                  className="text-slate-500 dark:text-slate-500"
                />
                Venue
              </label>
              <input
                id="venue"
                type="text"
                value={formData.venue}
                onChange={(e) => handleInputChange("venue", e.target.value)}
                placeholder="e.g., Aquatic Center Pool"
                className={`w-full px-4 py-3 rounded-lg border transition-all duration-200 font-inter ${
                  errors.venue
                    ? "border-red-300 dark:border-red-600 bg-red-50 dark:bg-red-900/20"
                    : "border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700"
                } text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent`}
              />
              {errors.venue && (
                <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-inter">
                  {errors.venue}
                </p>
              )}
            </div>
          </div>

          {/* Pool Configuration Row */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Pool Length */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label
                htmlFor="poolLength"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter"
              >
                <Ruler
                  size={16}
                  className="text-slate-500 dark:text-slate-500"
                />
                Pool Length
              </label>
              <select
                id="poolLength"
                value={formData.poolLength}
                onChange={(e) =>
                  handleInputChange("poolLength", e.target.value)
                }
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 font-inter"
              >
                <option value="25y">25 yards (Short Course Yards)</option>
                <option value="25m">25 meters (Short Course Meters)</option>
                <option value="50m">50 meters (Long Course Meters)</option>
              </select>
            </div>

            {/* Number of Lanes */}
            <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
              <label
                htmlFor="lanes"
                className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter"
              >
                <Hash
                  size={16}
                  className="text-slate-500 dark:text-slate-500"
                />
                Number of Lanes
              </label>
              <select
                id="lanes"
                value={formData.lanes}
                onChange={(e) => handleInputChange("lanes", e.target.value)}
                className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 font-inter"
              >
                <option value="4">4 lanes</option>
                <option value="5">5 lanes</option>
                <option value="6">6 lanes</option>
                <option value="7">7 lanes</option>
                <option value="8">8 lanes</option>
                <option value="9">9 lanes</option>
                <option value="10">10 lanes</option>
              </select>
            </div>
          </div>

          {/* Add Events */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-300 mb-4 font-inter">
              <Plus size={16} className="text-slate-500 dark:text-slate-500" />
              Add Events
            </label>
            <p className="text-sm text-slate-600 dark:text-slate-400 mb-4 font-inter">
              Select the events that will be part of this meet
            </p>

            {Object.entries(eventsByCategory).map(([category, events]) => (
              <div key={category} className="mb-6 last:mb-0">
                <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 font-inter">
                  {category}
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {events.map((event) => (
                    <button
                      key={event.id}
                      type="button"
                      onClick={() => handleEventToggle(event.id)}
                      className={`px-3 py-2 rounded-lg border text-sm font-medium transition-all duration-200 font-inter ${
                        formData.selectedEvents.includes(event.id)
                          ? "bg-blue-100 dark:bg-blue-900/30 border-blue-300 dark:border-blue-600 text-blue-700 dark:text-blue-300"
                          : "bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-600"
                      }`}
                    >
                      {event.name}
                    </button>
                  ))}
                </div>
              </div>
            ))}

            {errors.selectedEvents && (
              <p className="text-red-600 dark:text-red-400 text-sm mt-2 font-inter">
                {errors.selectedEvents}
              </p>
            )}

            {formData.selectedEvents.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
                <p className="text-sm text-blue-700 dark:text-blue-300 font-inter">
                  <strong>{formData.selectedEvents.length}</strong> events
                  selected
                </p>
              </div>
            )}
          </div>

          {/* Description */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <label
              htmlFor="description"
              className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-3 block font-inter"
            >
              Description (Optional)
            </label>
            <textarea
              id="description"
              value={formData.description}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Add any additional information about the meet..."
              rows={4}
              className="w-full px-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 focus:border-transparent transition-all duration-200 font-inter resize-none"
            />
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 pt-6">
            <button
              type="button"
              onClick={() => onNavigate("dashboard")}
              className="px-6 py-3 border border-slate-300 dark:border-slate-600 text-slate-700 dark:text-slate-300 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-700 transition-all duration-150 font-medium font-inter"
            >
              Cancel
            </button>

            <button
              type="button"
              onClick={handleAddSwimmers}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter"
            >
              <Users size={18} />
              Add Swimmers
            </button>

            <button
              type="submit"
              disabled={createMeetMutation.isPending}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter flex-1 sm:flex-initial"
            >
              {createMeetMutation.isPending ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  Creating...
                </>
              ) : (
                <>
                  <Save size={18} />
                  Create Meet
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
