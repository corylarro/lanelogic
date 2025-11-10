/**
 * Database Module - Main Export
 * 
 * Centralized exports for all database operations
 * Import with: import * as db from '@/lib/db'
 * Or selectively: import { createMeet, getSwimmers } from '@/lib/db'
 */

// Export all meet operations
export {
    createMeet,
    getMeet,
    getMeets,
    updateMeet,
    deleteMeet,
    updateMeetStatus,
} from './meets';

// Export all event operations
export {
    createEvent,
    getEvent,
    getEventsByMeet,
    updateEvent,
    deleteEvent,
    createEvents,
} from './events';

// Export all swimmer operations
export {
    createSwimmer,
    getSwimmer,
    getSwimmers,
    updateSwimmer,
    deleteSwimmer,
    updateSeedTime,
    getEligibleSwimmers,
    createSwimmers,
} from './swimmers';

// Export all heat operations
export {
    createHeat,
    getHeat,
    getHeatsByEvent,
    getHeatByNumber,
    updateHeatLanes,
    updateHeat,
    deleteHeat,
    saveHeatAssignments,
    getHeatsByMeet,
} from './heats';

// Export all result operations
export {
    createResult,
    getResult,
    getResultsByEvent,
    getResultsByHeat,
    updateResult,
    deleteResult,
    saveHeatResults,
    getResultsByMeet,
    calculatePlaces,
} from './results';

/**
 * Example Usage:
 * 
 * import * as db from '@/lib/db';
 * 
 * // Create a meet
 * const meet = await db.createMeet({
 *   name: 'Spring Championships',
 *   date: '2024-03-15',
 *   venue: 'Aquatic Center',
 *   poolLength: 50,
 *   lanes: 8,
 * });
 * 
 * // Get all meets
 * const meets = await db.getMeets();
 * 
 * // Create events for the meet
 * await db.createEvent({
 *   meetId: meet.id,
 *   name: '50 Free',
 *   distance: 50,
 *   stroke: 'Freestyle',
 *   gender: 'male',
 *   ageGroup: 'Boys 12-14',
 *   order: 1,
 * });
 * 
 * // Get events for a meet
 * const events = await db.getEventsByMeet(meet.id);
 * 
 * // Create a swimmer
 * const swimmer = await db.createSwimmer({
 *   firstName: 'John',
 *   lastName: 'Doe',
 *   gender: 'male',
 *   dateOfBirth: '2010-05-15',
 *   team: 'Sharks',
 * });
 * 
 * // Save heat assignments
 * await db.saveHeatAssignments(meet.id, eventId, 1, [
 *   { laneNumber: 1, swimmerId: swimmer.id },
 *   { laneNumber: 2, swimmerId: swimmer2.id },
 * ]);
 * 
 * // Save results
 * await db.saveHeatResults(meet.id, eventId, heatId, [
 *   { swimmerId: swimmer.id, laneNumber: 1, time: '24.56', place: 1 },
 * ]);
 */