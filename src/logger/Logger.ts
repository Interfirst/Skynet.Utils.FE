/* eslint-disable no-console */

import { LoggingLevel, LogLevel } from './constants';
import { LogAggregator, Message } from './interfaces';
import { LoggerSettings } from './LoggerSettings';

const isChrome = /Chrome/.test(navigator.userAgent) && /Google Inc/.test(navigator.vendor);

export class Logger {
  #name: string;
  #settings: LoggerSettings;

  constructor(name = '', settings: LoggerSettings) {
    this.#name = name;
    this.#settings = settings;
  }

  static #getTimestamp() {
    return `${new Date().toLocaleTimeString('en-GB')}:${new Date()
      .getMilliseconds()
      .toString()
      .padEnd(3)}`;
  }

  static #getBoxStyles(color: string, background: string) {
    return `color: ${color}; background: ${background}; border-radius: 5px; margin-right: 0.5em; padding: 0.1em 1em;`;
  }

  static get #nameFormat() {
    return Logger.#getBoxStyles('white', 'black');
  }

  static get #timestampFormat() {
    return Logger.#getBoxStyles('white', 'gray');
  }

  static #getLevelFormat(level: Message['level']) {
    switch (level) {
      case LogLevel.INFO:
        return Logger.#getBoxStyles('white', 'blue');

      case LogLevel.LOG:
        return Logger.#getBoxStyles('white', 'gray');

      case LogLevel.WARN:
        return Logger.#getBoxStyles('black', 'orange');

      case LogLevel.ERROR:
        return Logger.#getBoxStyles('white', 'red');
    }
  }

  static #formatValue(value: string) {
    /* *
     * In the other browsers we don't have an API to customize logged value styles
     * so we don't want to have just non formatted messages like '%cMessage color: someColor;'
     * so we disabling any formatting on the non-Chrome browsers and make ASCII-like format
     */
    return isChrome ? `%c${value}` : ` [ ${value} ] `;
  }

  static #formatPrefix(prefixValue: string, logLevel: LogLevel) {
    const prefix = [prefixValue];

    /* *
     * In the other browsers we don't have an API to customize logged value styles
     * so we don't want to have just non formatted messages like '%cMessage color: someColor;'
     * so we disabling any formatting on the non-Chrome browsers and make ASCII-like format
     */
    if (isChrome) {
      prefix.push(Logger.#timestampFormat);
      prefix.push(Logger.#nameFormat);
      prefix.push(Logger.#getLevelFormat(logLevel));
    }

    return prefix;
  }

  #getGroupMethod(level: Message['level']) {
    const { expand, internalLogger } = this.#settings.getSettings();
    const { group, groupCollapsed } = internalLogger;

    return expand[level] ? group : groupCollapsed;
  }

  #getLogMethod(level: Message['level']) {
    const { internalLogger } = this.#settings.getSettings();
    const { log, warn, error } = internalLogger;

    switch (level) {
      case LogLevel.INFO:
        return log;

      case LogLevel.LOG:
        return log;

      case LogLevel.WARN:
        return warn;

      case LogLevel.ERROR:
        return error;
    }
  }

  #sendToAggregator(...args: Parameters<LogAggregator['send']>) {
    const { aggregator, aggregatorLoggingLevel } = this.#settings.getSettings();
    const { level } = args[0];

    if (!aggregator) {
      return;
    }

    if (aggregatorLoggingLevel && aggregatorLoggingLevel < LoggingLevel[level]) {
      return;
    }

    aggregator.send(...args).catch(e => {
      this.#emit.call(this, {
        level: LogLevel.ERROR,
        message: e,
        withoutAggregator: true,
      });
    });
  }

  #emit({ message, level, withoutAggregator }: Message) {
    const timestamp = Logger.#getTimestamp();

    if (!withoutAggregator) {
      this.#sendToAggregator({ message, level }, timestamp);
    }

    const { loggingLevel, internalLogger } = this.#settings.getSettings();

    if (loggingLevel < LoggingLevel[level]) {
      return;
    }

    const groupMethod = this.#getGroupMethod(level);
    const logMethod = this.#getLogMethod(level);

    const formattedTimestamp = Logger.#formatValue(timestamp);
    const formattedName = Logger.#formatValue(this.#name);
    const formattedLevel = Logger.#formatValue(level);

    const prefix = Logger.#formatPrefix(
      `${formattedTimestamp}${formattedName}${formattedLevel}`,
      level,
    );

    groupMethod(...prefix);
    logMethod(...message);
    internalLogger.groupEnd();
  }

  warn(msg: any, ...args: any[]) {
    this.#emit({
      level: LogLevel.WARN,
      message: [msg, ...args],
    });
  }

  info(msg: any, ...args: any[]) {
    this.#emit({
      level: LogLevel.INFO,
      message: [msg, ...args],
    });
  }

  log(msg: any, ...args: any[]) {
    this.#emit({
      level: LogLevel.LOG,
      message: [msg, ...args],
    });
  }

  error(msg: any, ...args: any[]) {
    this.#emit({
      level: LogLevel.ERROR,
      message: [msg, ...args],
    });
  }
}
