import { prisma } from '@/lib/prisma'

export type ArchivePhoto = {
  id: number
  url: string
  author: string | null
}

export type PhotoArchive = {
  year: number
  photos: ArchivePhoto[]
}

/**
 * Photos from the most recent gallery year, for the homepage archive strip.
 * Returns null when that gallery has no photos yet, so the card can be skipped.
 */
export async function getArchivePhotos(limit = 20): Promise<PhotoArchive | null> {
  const gallery = await prisma.gallery.findFirst({
    orderBy: { year: 'desc' },
    select: {
      year: true,
      photos: {
        orderBy: { id: 'desc' },
        take: limit,
        select: { id: true, url: true, author: true },
      },
    },
  })

  return gallery && gallery.photos.length > 0 ? gallery : null
}
