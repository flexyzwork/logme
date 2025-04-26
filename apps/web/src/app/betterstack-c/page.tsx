// 'use client';
// import { useEffect } from 'react';
// import { useLogger } from '@logtail/next';

// export default function ClientComponent() {
//   const log = useLogger();

//   useEffect(() => {
//     log.error('User logged in', { userId: 42 });
//   }, [log]);

//   return <h1>Logged in</h1>;
// }


'use client';

import { useEffect } from 'react';

export default function ClientComponent() {
  useEffect(() => {
    const sendLog = async () => {
      await fetch('/api/internal/log-betterstack', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          level: 'error',
          message: 'User logged in',
          meta: { userId: 42 },
        }),
      });
    };

    sendLog();
  }, []);

  return <h1>Logged in</h1>;
}