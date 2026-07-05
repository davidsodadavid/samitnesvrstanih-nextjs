'use server'

import { revalidatePath } from 'next/cache'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { uploadToR2 } from '@/lib/r2'
import type { ImageItem, Page, PhotoItem } from './media-types'

const PAGE_SIZE = 24

export async function fetchImagesPage(cursor?: number): Promise<Page<ImageItem>> {
  await requireAdmin()
  const rows = await prisma.image.findMany({
    orderBy: { id: 'desc' },
    take: PAGE_SIZE + 1,
    ...(cursor !== undefined && { cursor: { id: cursor }, skip: 1 }),
    select: { id: true, url: true, key: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}

// Upload from inside the picker modal, returning the row so the client can select it
export async function uploadPickerImage(formData: FormData): Promise<ImageItem> {
  await requireAdmin()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) throw new Error('No file provided')

  const { key, url } = await uploadToR2(file, 'images')
  const image = await prisma.image.create({
    data: { key, url },
    select: { id: true, url: true, key: true },
  })
  revalidatePath('/dashboard/images')
  return image
}

export async function fetchPhotosPage(cursor?: number): Promise<Page<PhotoItem>> {
  await requireAdmin()
  const rows = await prisma.photo.findMany({
    orderBy: { id: 'desc' },
    take: PAGE_SIZE + 1,
    ...(cursor !== undefined && { cursor: { id: cursor }, skip: 1 }),
    select: { id: true, url: true, author: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}
