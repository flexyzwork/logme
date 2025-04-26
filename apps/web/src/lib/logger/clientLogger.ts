import { ClientBetterStackStrategy } from './strategies/better-stack/ClientBetterStackStrategy';
import { ClientSlackStrategy } from './strategies/slack/ClientSlackStrategy';
import { ClientSentryStrategy } from './strategies/sentry/ClientSentryStrategy';
import { Logger } from '@/lib/logger/Logger';

export const clientLogger = new Logger([
  new ClientBetterStackStrategy(),
  new ClientSlackStrategy(),
  new ClientSentryStrategy(),
]);