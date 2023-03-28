import { LogLevel } from './constants';

export interface Message {
  level: LogLevel;
  message: any;
  withoutAggregator?: boolean;
}

export interface LogAggregator {
  send(message: Message, timestamp: string): Promise<void>;
}

export interface InternalLogger
  extends Pick<Console, 'group' | 'groupCollapsed' | 'warn' | 'log' | 'error' | 'groupEnd'> {}
