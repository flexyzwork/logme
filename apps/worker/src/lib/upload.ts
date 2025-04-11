import fs from 'fs-extra'
import path from 'path'
import { lookup as getType } from 'mime-types'
import { R2Client } from './r2-client'
import pLimit from 'p-limit'

const limit = pLimit(15)

export async function uploadToR2(dirPath: string, slug: string): Promise<number> {
  const client = new R2Client()

  async function walkAndUpload(currentPath: string, relativePath = ''): Promise<number> {
    const entries = await fs.readdir(currentPath, { withFileTypes: true }).catch((err) => {
      console.error(`❌ Failed to read directory: ${currentPath}`, err)
      return []
    })
    const tasks: Promise<number>[] = []

    for (const entry of entries) {
      const fullPath = path.join(currentPath, entry.name)
      const relativeKey = path.join(relativePath, entry.name)
      const targetKey = path.join(slug, relativeKey).replace(/\\/g, '/')

      const task = limit(async () => {
        try {
          const stat = await fs.stat(fullPath)
          if (stat.isDirectory()) {
            const subDirUploadCount = await walkAndUpload(fullPath, relativeKey)
            if (subDirUploadCount === 0) {
              console.warn(`⚠️ No files uploaded in subdirectory: ${relativeKey}`)
            }
            return subDirUploadCount
          } else {
            let fileBuffer = await fs.readFile(fullPath)
            const mimeType = getType(fullPath) || 'application/octet-stream'
            if (fullPath.endsWith('.html')) {
              let html = fileBuffer.toString('utf-8')

              // console.log(`🔍 HTML Content:\n`, html.slice(0, 2000)) // 맨 앞만 출력

              // 절대 경로를 슬러그 없이 상대 경로로 치환
              html = html.replace(/(href|src)=["']\/(?!\/)([^"']+)["']/g, (match, attr, path) => {
                // 클린 URL이면 (확장자 없음 && 쿼리스트링 없음)
                const isCleanUrl = !path.match(
                  /\.(html|js|css|png|jpe?g|gif|svg|webp|woff2?|ttf|json|xml)(\?|$)/i
                )
                const finalPath = isCleanUrl ? `./${path}/` : `./${path}`
                return `${attr}="${finalPath}"`
              })

              fileBuffer = Buffer.from(html, 'utf-8')
              // console.log(`🔍 HTML Content after replacement:\n`, html.slice(0, 2000))
            }
            if (mimeType === 'application/octet-stream' && fullPath.includes('_next/static/')) {
              console.warn(`⚠️ Missing MIME type for file: ${fullPath}`)
            }
            console.log(`🟡 Uploading ${targetKey} (${fileBuffer.length} bytes) ${mimeType}`)
            await client.putObject(targetKey, fileBuffer, { ContentType: mimeType })
            console.log(`🟢 Uploaded ${targetKey}`)
            return 1
          }
        } catch (err) {
          console.error('🔴 Error handling file:', fullPath)
          console.error(err)
          return 0
        }
      })

      tasks.push(task)
    }

    const results = await Promise.all(tasks)
    return results.reduce((sum, val) => sum + val, 0)
  }

  const uploadedCount = await walkAndUpload(dirPath)
  return uploadedCount
}
