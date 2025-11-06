import { create } from "zustand";
import {
  getMeetById,
  getEventsForMeet,
  getSwimmersForEvent,
} from "@/data/mockDB";

export const useMeetStore = create((set, get) => ({
  // State
  selectedMeetId: null,
  selectedEventId: null,
  selectedMeet: null,
  selectedEvent: null,

  // Actions
  setSelectedMeet: (meetId) => {
    const meet = getMeetById(meetId);
    set({
      selectedMeetId: meetId,
      selectedMeet: meet,
      // Reset event when changing meet
      selectedEventId: null,
      selectedEvent: null,
    });
  },

  setSelectedEvent: (eventId) => {
    const { selectedMeet } = get();
    if (!selectedMeet) return;

    const event = selectedMeet.events.find((e) => e.id === eventId);
    set({
      selectedEventId: eventId,
      selectedEvent: event,
    });
  },

  // Getters
  getSelectedMeetEvents: () => {
    const { selectedMeetId } = get();
    return selectedMeetId ? getEventsForMeet(selectedMeetId) : [];
  },

  getEligibleSwimmers: () => {
    const { selectedMeetId, selectedEventId } = get();
    return selectedMeetId && selectedEventId
      ? getSwimmersForEvent(selectedMeetId, selectedEventId)
      : [];
  },

  // Clear selection
  clearSelection: () => {
    set({
      selectedMeetId: null,
      selectedEventId: null,
      selectedMeet: null,
      selectedEvent: null,
    });
  },
}));
