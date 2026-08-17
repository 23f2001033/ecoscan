/** Below this confidence we refuse to name a species rather than risk a wrong call. */
export const LOW_CONFIDENCE = 0.4;

/**
 * Upper bound on the *source* photo. Generous, because we downscale in the browser
 * before upload — this only rejects things too large to decode comfortably.
 */
export const MAX_FILE_BYTES = 15_000_000;

export const HISTORY_KEY = 'ecoscan.history.v1';
