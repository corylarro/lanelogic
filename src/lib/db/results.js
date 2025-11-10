/**
 * Results Database Operations
 * 
 * FIRESTORE STRUCTURE:
 * Collection: results
 * Document ID: Auto-generated
 * Fields: { id, meetId, eventId, heatId, swimmerId, laneNumber, time, place, dq, createdAt, updatedAt }
 * 
 * MIGRATION NOTE (Firestore → SQL):
 * - All fields map directly to SQL columns
 * - Foreign keys: meet_id, event_id, heat_id, swimmer_id
 * - Indexes on (meetId, eventId) for fast result queries
 * - dq (disqualified) boolean field
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

const COLLECTION_NAME = 'results';

/**
 * Create a new result
 * @param {Object} resultData - Result information
 * @returns {Promise<Object>} Created result with ID
 */
export const createResult = async (resultData) => {
    try {
        if (!resultData.meetId || !resultData.eventId || !resultData.swimmerId) {
            throw new Error('meetId, eventId, and swimmerId are required');
        }

        const resultRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...resultData,
            dq: resultData.dq || false,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const resultDoc = await getDoc(resultRef);
        return {
            id: resultDoc.id,
            ...resultDoc.data(),
        };
    } catch (error) {
        console.error('Error creating result:', error);
        throw error;
    }
};

/**
 * Get a single result by ID
 * @param {string} resultId - Result document ID
 * @returns {Promise<Object|null>} Result data or null if not found
 */
export const getResult = async (resultId) => {
    try {
        const resultDoc = await getDoc(doc(db, COLLECTION_NAME, resultId));
        if (resultDoc.exists()) {
            return {
                id: resultDoc.id,
                ...resultDoc.data(),
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting result:', error);
        throw error;
    }
};

/**
 * Get all results for a specific event
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @returns {Promise<Array>} Array of results sorted by place
 */
export const getResultsByEvent = async (meetId, eventId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId),
            where('eventId', '==', eventId)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        // Sort by place (nulls last)
        return results.sort((a, b) => {
            if (a.place === null || a.place === undefined) return 1;
            if (b.place === null || b.place === undefined) return -1;
            return a.place - b.place;
        });
    } catch (error) {
        console.error('Error getting results by event:', error);
        throw error;
    }
};

/**
 * Get all results for a specific heat
 * @param {string} heatId - Heat document ID
 * @returns {Promise<Array>} Array of results sorted by place
 */
export const getResultsByHeat = async (heatId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('heatId', '==', heatId)
        );

        const querySnapshot = await getDocs(q);
        const results = querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));

        return results.sort((a, b) => {
            if (a.place === null || a.place === undefined) return 1;
            if (b.place === null || b.place === undefined) return -1;
            return a.place - b.place;
        });
    } catch (error) {
        console.error('Error getting results by heat:', error);
        throw error;
    }
};

/**
 * Update an existing result
 * @param {string} resultId - Result document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated result
 */
export const updateResult = async (resultId, updates) => {
    try {
        const resultRef = doc(db, COLLECTION_NAME, resultId);
        await updateDoc(resultRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        return await getResult(resultId);
    } catch (error) {
        console.error('Error updating result:', error);
        throw error;
    }
};

/**
 * Delete a result
 * @param {string} resultId - Result document ID
 * @returns {Promise<void>}
 */
export const deleteResult = async (resultId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, resultId));
    } catch (error) {
        console.error('Error deleting result:', error);
        throw error;
    }
};

/**
 * Save or update heat results (batch operation)
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @param {string} heatId - Heat document ID
 * @param {Array} results - Array of result objects
 * @returns {Promise<Array>} Created/updated results
 */
export const saveHeatResults = async (meetId, eventId, heatId, results) => {
    try {
        const savedResults = [];

        for (const resultData of results) {
            // Check if result already exists for this swimmer in this heat
            const existingResultsQuery = query(
                collection(db, COLLECTION_NAME),
                where('heatId', '==', heatId),
                where('swimmerId', '==', resultData.swimmerId)
            );

            const existingSnapshot = await getDocs(existingResultsQuery);

            if (!existingSnapshot.empty) {
                // Update existing result
                const existingResult = existingSnapshot.docs[0];
                const updated = await updateResult(existingResult.id, resultData);
                savedResults.push(updated);
            } else {
                // Create new result
                const created = await createResult({
                    meetId,
                    eventId,
                    heatId,
                    ...resultData,
                });
                savedResults.push(created);
            }
        }

        return savedResults;
    } catch (error) {
        console.error('Error saving heat results:', error);
        throw error;
    }
};

/**
 * Get all results for a meet
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Array>} Array of all results for the meet
 */
export const getResultsByMeet = async (meetId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId)
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting results by meet:', error);
        throw error;
    }
};

/**
 * Calculate and update places for an event
 * Sorts by time and assigns places (1, 2, 3, etc.)
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @returns {Promise<Array>} Updated results with places
 */
export const calculatePlaces = async (meetId, eventId) => {
    try {
        const results = await getResultsByEvent(meetId, eventId);

        // Filter out DQ'd swimmers and those without times
        const validResults = results.filter(
            (r) => !r.dq && r.time && r.time !== ''
        );

        // Sort by time (ascending)
        validResults.sort((a, b) => {
            const timeA = parseFloat(a.time);
            const timeB = parseFloat(b.time);
            return timeA - timeB;
        });

        // Update places
        const updatedResults = [];
        for (let i = 0; i < validResults.length; i++) {
            const updated = await updateResult(validResults[i].id, { place: i + 1 });
            updatedResults.push(updated);
        }

        return updatedResults;
    } catch (error) {
        console.error('Error calculating places:', error);
        throw error;
    }
};