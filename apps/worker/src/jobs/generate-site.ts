import { db, genId } from '@repo/db'
import { JobData, JobType } from '@repo/queue'
import fs from 'fs-extra'
import path from 'path'
import { exec } from 'child_process'
import { uploadToR2 } from '../lib/upload' // R2 업로드 유틸 함수라고 가정

export const runGenerateSite = async (data: JobData[JobType.GenerateSite]) => {
  const { siteId, buildId, userId, slug, siteTitle, siteDescription, contentSourceId } = data

  console.log('runGenerateSite', data)

  const buildDir = path.resolve('/tmp', `site-${buildId}`)

  await db.build.update({
    where: { id: buildId },
    data: { status: 'building', startedAt: new Date() },
  })

  console.log('runGenerateSite', data)

  try {
    // 1. 템플릿 복사
    const templateSrc = path.resolve('/app/template') // Docker에 COPY된 디렉토리
    await fs.copy(templateSrc, buildDir)
    console.log('Template copied to', buildDir)

    // 2. 설정 주입 (예: site.config.ts 또는 .env 생성)
    // await fs.writeFile(path.join(buildDir, 'site.config.json'), JSON.stringify({
    //   title: siteTitle,
    //   description: siteDescription,
    //   slug,
    // }))

    // 3. 빌드 실행
    // await run(`pnpm build`, { cwd: buildDir })

    await run(`BASE_PATH=/${slug} pnpm build`, { cwd: buildDir })
    // await run(`pnpm export`, { cwd: buildDir })
    console.log('Build completed')

    // 4. export 결과 압축 (선택)
    const outDir = path.join(buildDir, 'out')
    // await run(`zip -r out.zip .`, { cwd: outDir }) // optional

    // 5. R2 업로드
    const uploadedCount = await uploadToR2(outDir, slug)
    console.log(`📦 Uploaded ${uploadedCount} files to R2 under ${slug}/`)

    // 6. 상태 업데이트
    await db.build.update({
      where: { id: buildId },
      data: { status: 'success', finishedAt: new Date() },
    })
  } catch (err) {
    await db.build.update({
      where: { id: buildId },
      data: {
        status: 'error',
        finishedAt: new Date(),
        error: err instanceof Error ? err.message : 'Unknown error',
      },
    })
    throw err
  }
}

function run(cmd: string, opts: { cwd: string }): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(cmd, { cwd: opts.cwd }, (err, stdout, stderr) => {
      if (err) {
        console.error(stderr)
        return reject(err)
      }
      console.log(stdout)
      resolve()
    })
  })
}
