/**
 * Meets Database Operations
 * 
 * FIRESTORE STRUCTURE:
 * Collection: meets
 * Document ID: Auto-generated
 * Fields: { id, name, date, venue, poolLength, lanes, description, status, createdBy, createdAt, updatedAt }
 * 
 * MIGRATION NOTE (Firestore → SQL):
 * Firestore Collection 'meets' → SQL Table 'meets'
 * Firestore document fields map directly to SQL columns
 * Document ID → Primary Key (id)
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
import { db, getCurrentUserId } from '../firebase';

const COLLECTION_NAME = 'meets';

/**
 * Create a new meet
 * @param {Object} meetData - Meet information
 * @returns {Promise<Object>} Created meet with ID
 */
export const createMeet = async (meetData) => {
    try {
        const userId = getCurrentUserId();
        const meetRef = await addDoc(collection(db, COLLECTION_NAME), {
            ...meetData,
            status: meetData.status || 'draft',
            createdBy: userId,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
        });

        // Get the created document to return it
        const meetDoc = await getDoc(meetRef);
        return {
            id: meetDoc.id,
            ...meetDoc.data(),
        };
    } catch (error) {
        console.error('Error creating meet:', error);
        throw error;
    }
};

/**
 * Get a single meet by ID
 * @param {string} meetId - Meet document ID
 * @returns {Promise<Object|null>} Meet data or null if not found
 */
export const getMeet = async (meetId) => {
    try {
        const meetDoc = await getDoc(doc(db, COLLECTION_NAME, meetId));
        if (meetDoc.exists()) {
            return {
                id: meetDoc.id,
                ...meetDoc.data(),
            };
        }
        return null;
    } catch (error) {
        console.error('Error getting meet:', error);
        throw error;
    }
};

/**
 * Get all meets (optionally filter by status)
 * @param {string} status - Optional status filter ('draft', 'setup', 'live', 'completed')
 * @returns {Promise<Array>} Array of meets
 */
export const getMeets = async (status = null) => {
    try {
        let q = query(
            collection(db, COLLECTION_NAME),
            orderBy('date', 'desc')
        );

        // Add status filter if provided
        if (status) {
            q = query(
                collection(db, COLLECTION_NAME),
                where('status', '==', status),
                orderBy('date', 'desc')
            );
        }

        const querySnapshot = await getDocs(q);
        return querySnapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }));
    } catch (error) {
        console.error('Error getting meets:', error);
        throw error;
    }
};

/**
 * Update an existing meet
 * @param {string} meetId - Meet document ID
 * @param {Object} updates - Fields to update
 * @returns {Promise<Object>} Updated meet
 */
export const updateMeet = async (meetId, updates) => {
    try {
        const meetRef = doc(db, COLLECTION_NAME, meetId);
        await updateDoc(meetRef, {
            ...updates,
            updatedAt: serverTimestamp(),
        });

        // Return updated document
        return await getMeet(meetId);
    } catch (error) {
        console.error('Error updating meet:', error);
        throw error;
    }
};

/**
 * Delete a meet
 * NOTE: In production, you may want to cascade delete related events, heats, results
 * @param {string} meetId - Meet document ID
 * @returns {Promise<void>}
 */
export const deleteMeet = async (meetId) => {
    try {
        await deleteDoc(doc(db, COLLECTION_NAME, meetId));
    } catch (error) {
        console.error('Error deleting meet:', error);
        throw error;
    }
};

/**
 * Update meet status
 * @param {string} meetId - Meet document ID
 * @param {string} status - New status ('draft', 'setup', 'live', 'completed')
 * @returns {Promise<Object>} Updated meet
 */
export const updateMeetStatus = async (meetId, status) => {
    return updateMeet(meetId, { status });
};