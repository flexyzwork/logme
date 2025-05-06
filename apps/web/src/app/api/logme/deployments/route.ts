import { deployToVercel } from '@/modules/logme/features/deployment/services/deployService'
import { getAuthSession } from '@/shared/lib/auth'
import logger from '@/shared/lib/logger'
// import { db } from '@repo/db'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const session = await getAuthSession()
    if (!session) return new NextResponse('Unauthorized', { status: 401 })

    const result = await deployToVercel({ ...body, userId: session.user.id })
    logger.log('info', '✅ Vercel deployment complete', { result })

    // await db.deployment.create({
    //   data: {
    //     deployTargetId: result.targetId,
    //     deployId: result.id,
    //     deployUrl: result.deployUrl,
    //     status: 'deploying',
    //   },
    // })
    return NextResponse.json({ message: 'Deployment complete', ...result }, { status: 200 })
  } catch (error) {
    logger.log('error', '❌ Vercel deployment failed:', { error })
    return NextResponse.json({ error: 'Failed to deploy to Vercel' }, { status: 500 })
  }
}
