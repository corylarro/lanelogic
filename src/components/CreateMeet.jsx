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
import * as db from "@/lib/db";

export default function CreateMeet({ onNavigate, onBack }) {
  const [formData, setFormData] = useState({
    name: "",
    date: "",
    venue: "",
    poolLength: "50",
    lanes: "8",
    description: "",
    selectedEvents: [],
  });
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

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

    setIsSubmitting(true);

    try {
      // Create the meet in Firebase
      const meet = await db.createMeet({
        name: formData.name,
        date: formData.date,
        venue: formData.venue,
        poolLength: parseInt(formData.poolLength),
        lanes: parseInt(formData.lanes),
        description: formData.description,
        status: 'draft',
      });

      console.log('Meet created:', meet);

      // Create events for the meet
      if (formData.selectedEvents.length > 0) {
        const eventPromises = formData.selectedEvents.map((eventId, index) => {
          const eventInfo = availableEvents.find(e => e.id === eventId);

          // Parse event info to get distance and stroke
          const distance = parseInt(eventInfo.name.split(' ')[0]);
          const stroke = eventInfo.category;

          return db.createEvent({
            meetId: meet.id,
            name: eventInfo.name,
            distance: distance,
            stroke: stroke,
            gender: 'mixed', // Default, can be updated later
            ageGroup: 'Open', // Default, can be updated later
            order: index + 1,
          });
        });

        await Promise.all(eventPromises);
        console.log('Events created for meet');
      }

      // Navigate back to dashboard
      onNavigate("dashboard");
    } catch (error) {
      console.error('Error creating meet:', error);
      setErrors({ submit: 'Failed to create meet. Please try again.' });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleAddSwimmers = () => {
    // For now, just show an alert - this would open the swimmer management flow
    alert("Add Swimmers functionality coming soon!");
  };

  return (
    <div className="flex-1 p-6 md:p-8 bg-slate-50 dark:bg-slate-900 overflow-y-auto">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-4 mb-4">
          <button
            onClick={() => onNavigate("dashboard")}
            className="p-2 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-150"
          >
            <ArrowLeft
              size={20}
              className="text-slate-600 dark:text-slate-400"
            />
          </button>
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-slate-800 dark:text-white font-inter">
              Create New Meet
            </h1>
            <p className="text-slate-600 dark:text-slate-400 font-inter">
              Set up a new swimming competition
            </p>
          </div>
        </div>
      </div>

      {/* Form */}
      <div className="max-w-4xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Show submit error if exists */}
          {errors.submit && (
            <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
              <p className="text-red-700 dark:text-red-400 font-inter">{errors.submit}</p>
            </div>
          )}

          {/* Basic Information */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 font-inter">
              Basic Information
            </h2>

            <div className="space-y-4">
              {/* Meet Name */}
              <div>
                <label
                  htmlFor="meetName"
                  className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block font-inter"
                >
                  Meet Name *
                </label>
                <div className="relative">
                  <input
                    id="meetName"
                    type="text"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="e.g., Spring Championships 2024"
                    className={`w-full px-4 py-3 rounded-lg border ${errors.name
                      ? "border-red-500 focus:ring-red-500"
                      : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                      } bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 font-inter`}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-red-500 font-inter">
                    {errors.name}
                  </p>
                )}
              </div>

              {/* Date & Venue */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="date"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block font-inter"
                  >
                    Date *
                  </label>
                  <div className="relative">
                    <Calendar
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="date"
                      type="date"
                      value={formData.date}
                      onChange={(e) =>
                        handleInputChange("date", e.target.value)
                      }
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.date
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                        } bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 font-inter`}
                    />
                  </div>
                  {errors.date && (
                    <p className="mt-1 text-sm text-red-500 font-inter">
                      {errors.date}
                    </p>
                  )}
                </div>

                <div>
                  <label
                    htmlFor="venue"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block font-inter"
                  >
                    Venue *
                  </label>
                  <div className="relative">
                    <MapPin
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <input
                      id="venue"
                      type="text"
                      value={formData.venue}
                      onChange={(e) =>
                        handleInputChange("venue", e.target.value)
                      }
                      placeholder="Aquatic Center"
                      className={`w-full pl-10 pr-4 py-3 rounded-lg border ${errors.venue
                        ? "border-red-500 focus:ring-red-500"
                        : "border-slate-300 dark:border-slate-600 focus:ring-blue-500"
                        } bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 placeholder-slate-500 dark:placeholder-slate-400 focus:outline-none focus:ring-2 focus:border-transparent transition-all duration-200 font-inter`}
                    />
                  </div>
                  {errors.venue && (
                    <p className="mt-1 text-sm text-red-500 font-inter">
                      {errors.venue}
                    </p>
                  )}
                </div>
              </div>

              {/* Pool Configuration */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="poolLength"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block font-inter"
                  >
                    Pool Length
                  </label>
                  <div className="relative">
                    <Ruler
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <select
                      id="poolLength"
                      value={formData.poolLength}
                      onChange={(e) =>
                        handleInputChange("poolLength", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter"
                    >
                      <option value="25">25m (Short Course)</option>
                      <option value="50">50m (Long Course)</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="lanes"
                    className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 block font-inter"
                  >
                    Number of Lanes
                  </label>
                  <div className="relative">
                    <Hash
                      size={18}
                      className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400"
                    />
                    <select
                      id="lanes"
                      value={formData.lanes}
                      onChange={(e) =>
                        handleInputChange("lanes", e.target.value)
                      }
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-slate-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-slate-800 dark:text-slate-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 font-inter"
                    >
                      {[4, 6, 8, 10].map((num) => (
                        <option key={num} value={num}>
                          {num} Lanes
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Event Selection */}
          <div className="bg-white dark:bg-slate-800 rounded-xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
            <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4 font-inter">
              Select Events *
            </h2>
            {errors.selectedEvents && (
              <p className="mb-4 text-sm text-red-500 font-inter">
                {errors.selectedEvents}
              </p>
            )}

            <div className="space-y-4">
              {Object.entries(eventsByCategory).map(([category, events]) => (
                <div key={category}>
                  <h3 className="text-sm font-medium text-slate-700 dark:text-slate-300 mb-2 font-inter">
                    {category}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {events.map((event) => (
                      <button
                        key={event.id}
                        type="button"
                        onClick={() => handleEventToggle(event.id)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-150 ${formData.selectedEvents.includes(event.id)
                          ? "bg-blue-600 text-white"
                          : "bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600"
                          } font-inter`}
                      >
                        {event.name}
                      </button>
                    ))}
                  </div>
                </div>
              ))}
            </div>
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
              disabled={isSubmitting}
              className="flex items-center justify-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-lg font-medium transition-all duration-150 active:scale-95 shadow-sm hover:shadow-md font-inter flex-1 sm:flex-initial"
            >
              {isSubmitting ? (
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