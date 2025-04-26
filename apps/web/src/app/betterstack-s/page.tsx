import { Logger } from '@logtail/next'

export default async function ExampleServer() {
  const log = new Logger()
  log.info('서버 컴포넌트 로깅')

  await log.flush()

  return <div>Server Log Test</div>
}