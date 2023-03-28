import { ReactPlugin } from '@microsoft/applicationinsights-react-js';
import { ApplicationInsights } from '@microsoft/applicationinsights-web';
import { History } from 'history';

import { LogLevel, Message } from '../logger';

import { getOperationName } from './AppInsightsAggregator.utils';
import { AppInsightsAggregatorConfig } from './types';

const reactPlugin = new ReactPlugin();

export class AppInsightsAggregator {
  #instance: ApplicationInsights;
  #history?: History;

  constructor(config: AppInsightsAggregatorConfig) {
    const { history, tags, ...appInsightsConfig } = config;

    this.#history = history;

    this.#instance = new ApplicationInsights({
      config: {
        enableRequestHeaderTracking: true,
        enableResponseHeaderTracking: true,
        enableAjaxErrorStatusText: true,
        enableUnhandledPromiseRejectionTracking: true,
        disableFetchTracking: false,
        disableDataLossAnalysis: false,
        extensions: [reactPlugin],
        ...(this.#history && {
          extensionConfig: {
            [reactPlugin.identifier]: {
              history: this.#history,
            },
          },
        }),
        ...appInsightsConfig,
      },
    });

    this.#instance.trackPageView();

    this.#instance.loadAppInsights();

    this.#instance.addTelemetryInitializer(envelope => {
      if (!envelope || !envelope.tags) {
        // eslint-disable-next-line
        console.error('Envelope is undefined');
        return;
      }

      Object.entries(tags).forEach(([key, value]: [string, string]) => {
        // TypeGuard above
        envelope.tags!.push({ [key]: value });
      });

      const cloudRole = tags?.['ai.cloud.role'];
      const operationName = getOperationName(cloudRole);

      if (envelope.baseType === 'PageviewData') {
        envelope.baseData!.name = operationName;
      }

      envelope.tags!.push({ 'ai.operation.name': operationName });
    });
  }

  async send({ level, message }: Message) {
    switch (level) {
      case LogLevel.LOG:
        this.#traceLog(message);
        break;

      case LogLevel.INFO:
        this.#traceInfo(message);
        break;

      case LogLevel.WARN:
        this.#traceWarn(message);
        break;

      case LogLevel.ERROR:
        this.#traceError(message);
        break;
    }
  }

  setUserContext({ authenticatedUserId, accountId = '', storeInCookie = false }: any) {
    this.#instance.setAuthenticatedUserContext(authenticatedUserId, accountId, storeInCookie);
  }

  clearUserContext() {
    this.#instance.clearAuthenticatedUserContext();
  }

  #createLevelMessage(level: LogLevel) {
    return level;
  }

  #traceError(exception: any) {
    const error = exception instanceof Error ? exception : new Error(exception);
    this.#instance.appInsights.trackException({ exception: error });
  }

  #traceInfo(message: any) {
    this.#instance.trackTrace({ message: this.#createLevelMessage(LogLevel.INFO) }, { message });
  }

  #traceLog(message: any) {
    this.#instance.trackTrace({ message: this.#createLevelMessage(LogLevel.LOG) }, { message });
  }

  #traceWarn(message: any) {
    this.#instance.trackTrace({ message: this.#createLevelMessage(LogLevel.WARN) }, { message });
  }
}
