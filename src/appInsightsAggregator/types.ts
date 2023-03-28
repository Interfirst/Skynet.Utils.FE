import { Snippet, Tags } from '@microsoft/applicationinsights-web';
import { History } from 'history';

export type AppInsightsAggregatorConfig = {
  history?: History;
  instrumentationKey: string;
  tags: Tags;
} & Snippet['config'];
