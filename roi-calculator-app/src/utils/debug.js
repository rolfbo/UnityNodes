/**
 * Debug logging utility
 * Only logs in development mode
 */

const isDevelopment = import.meta.env.DEV;

export const debug = {
  log: (...args) => {
    if (isDevelopment) {
      console.log('[DEBUG]', ...args);
    }
  },

  warn: (...args) => {
    if (isDevelopment) {
      console.warn('[WARN]', ...args);
    }
  },

  error: (...args) => {
    // Always log errors
    console.error('[ERROR]', ...args);
  },

  info: (...args) => {
    if (isDevelopment) {
      console.info('[INFO]', ...args);
    }
  },

  table: (data) => {
    if (isDevelopment && console.table) {
      console.table(data);
    }
  },
};

export default debug;
