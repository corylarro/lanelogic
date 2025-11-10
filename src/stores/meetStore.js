import { create } from "zustand";
import * as db from "@/lib/db";

export const useMeetStore = create((set, get) => ({
  // State
  selectedMeetId: null,
  selectedEventId: null,
  selectedMeet: null,
  selectedEvent: null,
  selectedMeetEvents: [],

  // Actions
  setSelectedMeet: async (meetId) => {
    if (!meetId) {
      set({
        selectedMeetId: null,
        selectedMeet: null,
        selectedEventId: null,
        selectedEvent: null,
        selectedMeetEvents: [],
      });
      return;
    }

    try {
      // Load meet from Firebase
      const meet = await db.getMeet(meetId);

      // Load events for this meet
      const events = await db.getEventsByMeet(meetId);

      set({
        selectedMeetId: meetId,
        selectedMeet: meet,
        selectedMeetEvents: events,
        // Reset event when changing meet
        selectedEventId: null,
        selectedEvent: null,
      });
    } catch (error) {
      console.error('Error loading meet:', error);
      set({
        selectedMeetId: null,
        selectedMeet: null,
        selectedEventId: null,
        selectedEvent: null,
        selectedMeetEvents: [],
      });
    }
  },

  setSelectedEvent: async (eventId) => {
    if (!eventId) {
      set({
        selectedEventId: null,
        selectedEvent: null,
      });
      return;
    }

    try {
      // Load event from Firebase
      const event = await db.getEvent(eventId);

      set({
        selectedEventId: eventId,
        selectedEvent: event,
      });
    } catch (error) {
      console.error('Error loading event:', error);
      set({
        selectedEventId: null,
        selectedEvent: null,
      });
    }
  },

  // Getters
  getSelectedMeetEvents: () => {
    const { selectedMeetEvents } = get();
    return selectedMeetEvents;
  },

  getEligibleSwimmers: async () => {
    const { selectedMeetId, selectedEventId } = get();

    if (!selectedMeetId || !selectedEventId) {
      return [];
    }

    try {
      // For now, return empty array
      // This will be implemented when swimmer management is added
      // TODO: Load swimmers from Firebase and filter by event requirements
      return [];
    } catch (error) {
      console.error('Error loading swimmers:', error);
      return [];
    }
  },

  // Clear selection
  clearSelection: () => {
    set({
      selectedMeetId: null,
      selectedEventId: null,
      selectedMeet: null,
      selectedEvent: null,
      selectedMeetEvents: [],
    });
  },
}));