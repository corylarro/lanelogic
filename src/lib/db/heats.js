/**
 * Heats Database Operations
 * 
 * FIRESTORE STRUCTURE:
 * Collection: heats
 * Document ID: Auto-generated
 * Fields: { id, meetId, eventId, heatNumber, lanes: [{ laneNumber, swimmerId }], createdAt, updatedAt }
 * 
 * MIGRATION NOTE (Firestore → SQL):
 * - lanes array → separate 'heat_lanes' table in SQL
 * - SQL: heat_lanes table with (heat_id, lane_number, swimmer_id) columns
 * - Each heat is a separate document/row, lanes are child records
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

const COLLECTION_NAME = 'heats';

/**
 * Create a new heat
 * @param {Object} heatData - Heat information (must include meetId, eventId, heatNumber)
 * @returns {Promise<Object>} Created heat with ID
 */
export const createHeat = async (heatData) => {
    try {
        if (!heatData.meetId || !heatData.eventId || !heatData.heatNumber) {
            throw new Error('meetId, eventId, and heatNumber are required');
        }

        const heatRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...heatData,
            lanes: heatData.lanes || [],
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        const heatDoc = await getDoc(heatRef);
        return {
            id: heatDoc.id,
            ...heatDoc.data(),
        };
    } catch (error) {
        console.error('Error creating heat:', error);
        throw error;
    }
};

/**
 * Get a single heat by ID
 * @param {string} heatId - Heat document ID
 * @returns {Promise<Object|null>} Heat data or null if not found
 */
export const getHeat = async (heatId) => {
    try {
        const heatDoc = await getDoc(doc(db, COLLECTION_NAME, heatId));
        if (heatDoc.exists()) {
            return {
                id: heatDoc.id,
                ...heatDoc.data(),
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting heat:', error);
        throw error;
    }
};

/**
 * Get all heats for a specific event
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @returns {Promise<Array>} Array of heats
 */
export const getHeatsByEvent = async (meetId, eventId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId),
            where('eventId', '==', eventId),
            orderBy('heatNumber', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting heats:', error);
        throw error;
    }
};

/**
 * Get a specific heat by meet, event, and heat number
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @param {number} heatNumber - Heat number
 * @returns {Promise<Object|null>} Heat data or null if not found
 */
export const getHeatByNumber = async (meetId, eventId, heatNumber) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId),
            where('eventId', '==', eventId),
            where('heatNumber', '==', heatNumber)
        );

        const querySnapshot = await getDocs(q);
        if (querySnapshot.empty) {
            return null;
        }

        const heatDoc = querySnapshot.docs[0];
        return {
            id: heatDoc.id,
            ...heatDoc.data(),
        };
    } catch (error) {
        console.error('Error getting heat by number:', error);
        throw error;
    }
};

/**
 * Update heat lane assignments
 * @param {string} heatId - Heat document ID
 * @param {Array} lanes - Array of lane assignments [{ laneNumber, swimmerId }, ...]
 * @returns {Promise<Object>} Updated heat
 */
export const updateHeatLanes = async (heatId, lanes) => {
    try {
        const heatRef = doc(db, COLLECTION_NAME, heatId);
        await updateDoc(heatRef, {
            lanes,
            updatedAt: serverTimestamp(),
        });

        return await getHeat(heatId);
    } catch (error) {
        console.error('Error updating heat lanes:', error);
        throw error;
    }
};

/**
 * Update an existing heat
 * @param {string} heatId - Heat document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated heat
 */
export const updateHeat = async (heatId, updates) => {
    try {
        const heatRef = doc(db, COLLECTION_NAME, heatId);
        await updateDoc(heatRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        return await getHeat(heatId);
    } catch (error) {
        console.error('Error updating heat:', error);
        throw error;
    }
};

/**
 * Delete a heat
 * @param {string} heatId - Heat document ID
 * @returns {Promise<void>}
 */
export const deleteHeat = async (heatId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, heatId));
    } catch (error) {
        console.error('Error deleting heat:', error);
        throw error;
    }
};

/**
 * Save or update heat assignments (upsert)
 * Creates heat if it doesn't exist, updates if it does
 * @param {string} meetId - Meet document ID
 * @param {string} eventId - Event document ID
 * @param {number} heatNumber - Heat number
 * @param {Array} lanes - Lane assignments
 * @returns {Promise<Object>} Created or updated heat
 */
export const saveHeatAssignments = async (meetId, eventId, heatNumber, lanes) => {
    try {
        // Check if heat already exists
        const existingHeat = await getHeatByNumber(meetId, eventId, heatNumber);

        if (existingHeat) {
            // Update existing heat
            return await updateHeatLanes(existingHeat.id, lanes);
        } else {
            // Create new heat
            return await createHeat({
                meetId,
                eventId,
                heatNumber,
                lanes,
            });
        }
    } catch (error) {
        console.error('Error saving heat assignments:', error);
        throw error;
    }
};

/**
 * Get all heats for a meet (across all events)
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Array>} Array of heats
 */
export const getHeatsByMeet = async (meetId) => {
    try {
        const q = query(
            collection(db, COLLECTION_NAME),
            where('meetId', '==', meetId),
            orderBy('heatNumber', 'asc')
        );

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting heats by meet:', error);
        throw error;
    }
};