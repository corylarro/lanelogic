/**
 * Swimmers Database Operations
 * 
 * FIRESTORE STRUCTURE:
 * Collection: swimmers
 * Document ID: Auto-generated
 * Fields: { id, firstName, lastName, gender, dateOfBirth, team, seedTimes: { eventId: time }, createdAt, updatedAt }
 * 
 * MIGRATION NOTE (Firestore → SQL):
 * - seedTimes is a map/object in Firestore → separate 'seed_times' table in SQL
 * - SQL: seed_times table with (swimmer_id, event_id, time) columns
 * - This keeps the relational structure clean for SQL migration
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

const COLLECTION_NAME = 'swimmers';

/**
 * Create a new swimmer
 * @param {Object} swimmerData - Swimmer information
 * @returns {Promise<Object>} Created swimmer with ID
 */
export const createSwimmer = async (swimmerData) => {
    try {
        const swimmerRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...swimmerData,
            seedTimes: swimmerData.seedTimes || {},
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const swimmerDoc = await getDoc(swimmerRef);
        return {
            id: swimmerDoc.id,
            ...swimmerDoc.data(),
        };
    } catch (error) {
        console.error('Error creating swimmer:', error);
        throw error;
    }
};

/**
 * Get a single swimmer by ID
 * @param {string} swimmerId - Swimmer document ID
 * @returns {Promise<Object|null>} Swimmer data or null if not found
 */
export const getSwimmer = async (swimmerId) => {
    try {
        const swimmerDoc = await getDoc(doc(db, COLLECTION_NAME, swimmerId));
        if (swimmerDoc.exists()) {
            return {
                id: swimmerDoc.id,
                ...swimmerDoc.data(),
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting swimmer:', error);
        throw error;
    }
};

/**
 * Get all swimmers (optionally filter by team or gender)
 * @param {Object} filters - Optional filters { team, gender }
 * @returns {Promise<Array>} Array of swimmers
 */
export const getSwimmers = async (filters = {}) => {
    try {
        let q = query(
            collection(db, COLLECTION_NAME),
            orderBy('lastName', 'asc'),
            orderBy('firstName', 'asc')
        );

        // Note: Firestore has limitations on compound queries
        // For complex filtering, fetch all and filter in memory
        const querySnapshot = await getDocs(q);
        let swimmers = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Apply filters in memory (simpler for Firestore)
        if (filters.team) {
            swimmers = swimmers.filter((s) => s.team === filters.team);
        }
        if (filters.gender) {
            swimmers = swimmers.filter((s) => s.gender === filters.gender);
        }

        return swimmers;
    } catch (error) {
        console.error('Error getting swimmers:', error);
        throw error;
    }
};

/**
 * Update an existing swimmer
 * @param {string} swimmerId - Swimmer document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated swimmer
 */
export const updateSwimmer = async (swimmerId, updates) => {
    try {
        const swimmerRef = doc(db, COLLECTION_NAME, swimmerId);
        await updateDoc(swimmerRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        return await getSwimmer(swimmerId);
    } catch (error) {
        console.error('Error updating swimmer:', error);
        throw error;
    }
};

/**
 * Delete a swimmer
 * @param {string} swimmerId - Swimmer document ID
 * @returns {Promise<void>}
 */
export const deleteSwimmer = async (swimmerId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, swimmerId));
    } catch (error) {
        console.error('Error deleting swimmer:', error);
        throw error;
    }
};

/**
 * Update seed time for a swimmer/event
 * @param {string} swimmerId - Swimmer document ID
 * @param {string} eventId - Event document ID
 * @param {string} time - Seed time (e.g., "24.56")
 * @returns {Promise<Object>} Updated swimmer
 */
export const updateSeedTime = async (swimmerId, eventId, time) => {
    try {
        const swimmer = await getSwimmer(swimmerId);
        if (!swimmer) {
            throw new Error('Swimmer not found');
        }

        const seedTimes = swimmer.seedTimes || {};
        seedTimes[eventId] = time;

        return await updateSwimmer(swimmerId, { seedTimes });
    } catch (error) {
        console.error('Error updating seed time:', error);
        throw error;
    }
};

/**
 * Get swimmers eligible for an event (by gender and age)
 * @param {string} eventId - Event document ID
 * @param {Object} eventData - Event data (gender, ageGroup)
 * @returns {Promise<Array>} Array of eligible swimmers
 */
export const getEligibleSwimmers = async (eventData) => {
    try {
        // Get all swimmers matching the event gender
        const swimmers = await getSwimmers({ gender: eventData.gender });

        // TODO: Add age group filtering based on eventData.ageGroup
        // For now, return all swimmers matching gender
        return swimmers;
    } catch (error) {
        console.error('Error getting eligible swimmers:', error);
        throw error;
    }
};

/**
 * Create multiple swimmers at once (bulk import)
 * @param {Array<Object>} swimmersData - Array of swimmer objects
 * @returns {Promise<Array>} Array of created swimmers
 */
export const createSwimmers = async (swimmersData) => {
    try {
        const createdSwimmers = [];
        for (const swimmerData of swimmersData) {
            const swimmer = await createSwimmer(swimmerData);
            createdSwimmers.push(swimmer);
        }
        return createdSwimmers;
    } catch (error) {
        console.error('Error creating multiple swimmers:', error);
        throw error;
    }
};