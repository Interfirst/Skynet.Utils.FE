import { LoggingLevel, LogLevel } from './constants';
import { InternalLogger, LogAggregator } from './interfaces';

type LoggingLevelType = typeof LoggingLevel[keyof typeof LoggingLevel];

export interface LogSettings {
  expand: {
    [key in LogLevel]: boolean;
  };

  loggingLevel: LoggingLevelType;

  aggregator?: LogAggregator;
  aggregatorLoggingLevel?: LoggingLevelType;

  internalLogger: InternalLogger;
}

export class LoggerSettings {
  #store: LogSettings;

  constructor(store: LogSettings) {
    this.#store = store;
  }

  setSettings = (getter: (oldSettings: LogSettings) => LogSettings) => {
    this.#store = getter(this.getSettings());
  };

  setAggregator(aggregator?: LogAggregator) {
    this.#store.aggregator = aggregator;
  }

  getSettings() {
    return this.#store;
  }
}
