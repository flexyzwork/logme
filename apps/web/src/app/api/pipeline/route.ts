// apps/web/src/app/api/pipeline/route.ts

import { NextResponse } from 'next/server'

export async function POST() {
  console.log('⚠️ [개발용] /pipeline 요청 수신됨')
  return NextResponse.json({ message: 'Not implemented yet' }, { status: 200 })
}
