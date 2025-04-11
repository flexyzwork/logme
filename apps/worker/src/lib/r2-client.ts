import { S3Client, PutObjectCommand } from '@aws-sdk/client-s3'

const R2_ENDPOINT = process.env.R2_ENDPOINT as string
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID as string
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY as string
const R2_BUCKET = process.env.R2_BUCKET as string

export class R2Client {
  private client: S3Client

  constructor() {
    this.client = new S3Client({
      region: 'auto',
      endpoint: R2_ENDPOINT,
      credentials: {
        accessKeyId: R2_ACCESS_KEY_ID,
        secretAccessKey: R2_SECRET_ACCESS_KEY,
      },
    })
  }

  async putObject(key: string, body: Buffer | Uint8Array | Blob | string, p0: { ContentType: any }) {
    const command = new PutObjectCommand({
      Bucket: R2_BUCKET,
      Key: key,
      Body: body,
      ContentType: p0.ContentType,
    })

    await this.client.send(command)
  }
}
