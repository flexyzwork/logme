'use client';
import { useLogger } from '@logtail/next';

export default function ClientComponent() {
  const log = useLogger();
  log.debug('User logged in', { userId: 42 });
  return <h1>Logged in</h1>;
}
