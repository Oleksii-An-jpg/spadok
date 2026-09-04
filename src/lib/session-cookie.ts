// Shared between the edge middleware and the Node runtime, so this module must
// stay free of firebase-admin (and anything else Node-only).
export const SESSION_COOKIE = 'session';

export const SESSION_MAX_AGE_MS = 60 * 60 * 24 * 14 * 1000; // 14 days
