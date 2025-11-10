/**
 * Events Database Operations
 * 
 * FIRESTORE STRUCTURE:
 * Collection: events
 * Document ID: Auto-generated
 * Fields: { id, meetId, name, distance, stroke, gender, ageGroup, order, createdAt, updatedAt }
 * 
 * MIGRATION NOTE (Firestore → SQL):
 * - meetId field → meet_id foreign key referencing meets table
 * - Events are separate documents, not nested in meets
 * - This allows for efficient querying and indexing
 */

import {
    collection,
    doc,
    addDoc,
    getDoc,
    getDocs,
    updateDoc,
    deleteDoc,
    query,
    where,
    orderBy,
    serverTimestamp,
} from 'firebase/firestore';
import { db } from '../firebase';

const COLLECTION_NAME = 'events';

/**
 * Create a new event
 * @param {Object} eventData - Event information (must include meetId)
 * @returns {Promise<Object>} Created event with ID
 */
export const createEvent = async (eventData) => {
    try {
        if (!eventData.meetId) {
            throw new Error('meetId is required');
        }

        const eventRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...eventData,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const eventDoc = await getDoc(eventRef);
        return {
            id: eventDoc.id,
            ...eventDoc.data(),
        };
    } catch (error) {
        console.error('Error creating event:', error);
        throw error;
    }
};

/**
 * Get a single event by ID
 * @param {string} eventId - Event document ID
 * @returns {Promise<Object|null>} Event data or null if not found
 */
export const getEvent = async (eventId) => {
    try {
        const eventDoc = await getDoc(doc(db, COLLECTION_NAME, eventId));
        if (eventDoc.exists()) {
            return {
                id: eventDoc.id,
                ...eventDoc.data(),
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting event:', error);
        throw error;
    }
};

/**
 * Get all events for a specific meet
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Array>} Array of events
 */
export const getEventsByMeet = async (meetId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId),
            orderBy('order', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting events:', error);
        throw error;
    }
};

/**
 * Update an existing event
 * @param {string} eventId - Event document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated event
 */
export const updateEvent = async (eventId, updates) => {
    try {
        const eventRef = doc(db, COLLECTION_NAME, eventId);
        await updateDoc(eventRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        return await getEvent(eventId);
    } catch (error) {
        console.error('Error updating event:', error);
        throw error;
    }
};

/**
 * Delete an event
 * NOTE: Consider cascading to related heats/results in production
 * @param {string} eventId - Event document ID
 * @returns {Promise<void>}
 */
export const deleteEvent = async (eventId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, eventId));
    } catch (error) {
        console.error('Error deleting event:', error);
        throw error;
    }
};

/**
 * Create multiple events at once (for meet setup)
 * @param {Array<Object>} eventsData - Array of event objects
 * @returns {Promise<Array>} Array of created events
 */
export const createEvents = async (eventsData) => {
    try {
        const createdEvents = [];
        for (const eventData of eventsData) {
            const event = await createEvent(eventData);
            createdEvents.push(event);
        }
        return createdEvents;
    } catch (error) {
        console.error('Error creating multiple events:', error);
        throw error;
    }
};