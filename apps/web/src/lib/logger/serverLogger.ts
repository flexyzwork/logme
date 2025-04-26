import { ServerBetterStackStrategy } from './strategies/better-stack/ServerBetterStackStrategy';
import { ServerSlackStrategy } from './strategies/slack/ServerSlackStrategy';
import { ServerSentryStrategy } from './strategies/sentry/ServerSentryStrategy';
import { Logger } from '@/lib/logger/Logger';

export const serverLogger = new Logger([
  new ServerBetterStackStrategy(),
  new ServerSlackStrategy(),
  new ServerSentryStrategy(),
]);