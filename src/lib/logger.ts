export type LogArgs = unknown[]

const isDev = typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.DEV
const isTest = typeof process !== 'undefined' && process.env?.NODE_ENV === 'test'

/**
 * Centralized logging utility
 * - debug/info: Development only
 * - log: Development only (alias for info)
 * - warn: All environments
 * - error: All environments
 * - group/groupEnd: Development only
 */
export const logger = {
  debug: (...args: LogArgs) => {
    if (isDev && !isTest) console.debug(...args)
  },
  info: (...args: LogArgs) => {
    if (isDev && !isTest) console.info(...args)
  },
  log: (...args: LogArgs) => {
    if (isDev && !isTest) console.log(...args)
  },
  warn: (...args: LogArgs) => {
    if (!isTest) console.warn(...args)
  },
  error: (...args: LogArgs) => {
    if (!isTest) console.error(...args)
  },
  group: (label: string) => {
    if (isDev && !isTest) console.group(label)
  },
  groupEnd: () => {
    if (isDev && !isTest) console.groupEnd()
  },
}
