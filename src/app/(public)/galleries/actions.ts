'use server'

import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 24

export type GalleryPhoto = { id: number; url: string; author: string | null }
export type GalleryPhotoPage = { items: GalleryPhoto[]; nextCursor: number | null }

// Public read-only fetch — no auth on purpose. Cursor-paginated so the gallery
// page can lazy-load photos as the visitor scrolls.
export async function fetchGalleryPhotos(
  year: number,
  cursor?: number,
): Promise<GalleryPhotoPage> {
  if (!Number.isInteger(year)) return { items: [], nextCursor: null }

  const rows = await prisma.photo.findMany({
    where: {
      galleries: { some: { year } },
      ...(cursor !== undefined && { id: { gt: cursor } }),
    },
    orderBy: { id: 'asc' },
    take: PAGE_SIZE + 1,
    select: { id: true, url: true, author: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}
