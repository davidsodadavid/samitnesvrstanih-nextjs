import { DeleteObjectCommand, PutObjectCommand, S3Client } from '@aws-sdk/client-s3'

function env(name: string): string {
  const value = process.env[name]
  if (!value) throw new Error(`${name} is not set`)
  return value
}

let client: S3Client | undefined

function r2(): S3Client {
  client ??= new S3Client({
    region: 'auto',
    endpoint: `https://${env('R2_ACCOUNT_ID')}.r2.cloudflarestorage.com`,
    credentials: {
      accessKeyId: env('R2_ACCESS_KEY_ID'),
      secretAccessKey: env('R2_SECRET_ACCESS_KEY'),
    },
  })
  return client
}

// Stores a file under a collision-safe key, returns { key, url } for the DB row.
export async function uploadToR2(
  file: File,
  folder: 'photos' | 'images' | 'designs',
): Promise<{ key: string; url: string }> {
  const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
  const key = `${folder}/${Date.now()}-${crypto.randomUUID().slice(0, 8)}-${safeName}`

  await r2().send(
    new PutObjectCommand({
      Bucket: env('R2_BUCKET'),
      Key: key,
      Body: new Uint8Array(await file.arrayBuffer()),
      ContentType: file.type || 'application/octet-stream',
    }),
  )

  return { key, url: `${env('R2_PUBLIC_URL')}/${key}` }
}

export async function deleteFromR2(key: string): Promise<void> {
  await r2().send(new DeleteObjectCommand({ Bucket: env('R2_BUCKET'), Key: key }))
}
