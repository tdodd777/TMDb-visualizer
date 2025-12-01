/**
 * Production-safe logging utility
 *
 * In development: Logs to console as normal
 * In production: Silent (or can be configured to send to error tracking service)
 *
 * Usage:
 * import { logger } from '@/utils/logger';
 * logger.error('Error message:', error);
 * logger.warn('Warning message');
 * logger.info('Info message');
 */

const isDevelopment = import.meta.env.DEV;

export const logger = {
  /**
   * Log error messages
   * In development: Logs to console.error
   * In production: Silent (configure error tracking service here)
   */
  error: (...args) => {
    if (isDevelopment) {
      console.error(...args);
    }
    // TODO: In production, send to error tracking service
    // Example: Sentry.captureException(args[0]);
  },

  /**
   * Log warning messages
   * In development: Logs to console.warn
   * In production: Silent
   */
  warn: (...args) => {
    if (isDevelopment) {
      console.warn(...args);
    }
  },

  /**
   * Log info messages
   * In development: Logs to console.info
   * In production: Silent
   */
  info: (...args) => {
    if (isDevelopment) {
      console.info(...args);
    }
  },

  /**
   * Log debug messages
   * In development: Logs to console.debug
   * In production: Silent
   */
  debug: (...args) => {
    if (isDevelopment) {
      console.debug(...args);
    }
  },

  /**
   * Log general messages
   * In development: Logs to console.log
   * In production: Silent
   */
  log: (...args) => {
    if (isDevelopment) {
      console.log(...args);
    }
  },
};

export default logger;
