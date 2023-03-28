export enum LogLevel {
  LOG = 'LOG',
  INFO = 'INFO',
  WARN = 'WARN',
  ERROR = 'ERROR',
}

export const LoggingLevel = {
  VERBOSE: 100000,
  [LogLevel.LOG]: 10000,
  [LogLevel.INFO]: 1000,
  [LogLevel.WARN]: 100,
  [LogLevel.ERROR]: 10,
  NONE: 0,
} as const;
