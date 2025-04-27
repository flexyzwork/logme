// import { Logger } from '@logtail/next'

// export default async function ExampleServer() {
//   const log = new Logger()
//   log.error('서버 컴포넌트 로깅')

//   await log.flush()

//   return <div>Server Log Test</div>
// }

import { logger2 } from '@/lib/logger'

export default function ServerComponent() {
  console.log('🟢 Server Component Logging')
  logger2.log('error', '서버 컴포넌트 로깅', { userId: 42 })

  return <h1>Logged in</h1>
}
