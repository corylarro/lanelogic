// Firebase Configuration and Initialization
// This file sets up Firebase and exports the necessary instances

import { initializeApp, getApps } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth, signInAnonymously } from 'firebase/auth';

/**
 * Firebase Configuration
 * Uses environment variables for security (NEXT_PUBLIC_ prefix makes them available in browser)
 */
const firebaseConfig = {
    apiKey: process.env.NEXT_PUBLIC_FIREBASE_API_KEY,
    authDomain: process.env.NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN,
    projectId: process.env.NEXT_PUBLIC_FIREBASE_PROJECT_ID,
    storageBucket: process.env.NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET,
    messagingSenderId: process.env.NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
    appId: process.env.NEXT_PUBLIC_FIREBASE_APP_ID,
    measurementId: process.env.NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID,
};

/**
 * Initialize Firebase App
 * Prevents multiple initializations in development (hot reload)
 */
const app = !getApps().length ? initializeApp(firebaseConfig) : getApps()[0];

/**
 * Firestore Database Instance
 * This is our main database connection
 * 
 * MIGRATION NOTE (Firestore → Supabase/Postgres):
 * - Firestore uses collections and documents
 * - SQL uses tables and rows
 * - Our flat structure with ID references maps 1:1 to SQL foreign keys
 * - Example: meetId in Firestore doc → meet_id foreign key in SQL
 */
export const db = getFirestore(app);

/**
 * Firebase Auth Instance
 * Currently using anonymous authentication for demo
 */
export const auth = getAuth(app);

/**
 * Ensure user is authenticated (anonymous for now)
 * Call this on app initialization
 */
export const ensureAuth = async () => {
    try {
        if (!auth.currentUser) {
            await signInAnonymously(auth);
            console.log('Anonymous authentication successful');
        }
        return auth.currentUser;
    } catch (error) {
        console.error('Authentication error:', error);
        throw error;
    }
};

/**
 * Get current user ID
 * Useful for tracking who created/modified records
 */
export const getCurrentUserId = () => {
    return auth.currentUser?.uid || null;
};

export default app;