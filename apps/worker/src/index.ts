import cron from 'node-cron'
import { checkStats } from './youtube/checkStats'

cron.schedule('*/10 * * * *', async () => {
  console.log('🔄 Running YouTube stats check...')
  await checkStats()
})
