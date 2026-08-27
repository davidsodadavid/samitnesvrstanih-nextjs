import { prisma } from '@/lib/prisma'

export type ArchivePhoto = {
  id: number
  url: string
  author: string | null
  /** Gallery the photo was found in — the strip links each tile to its year. */
  year: number
}

/**
 * Photos for the homepage archive strip, newest gallery year first.
 *
 * Walks every gallery rather than only the latest one, so an empty or
 * half-filled newest gallery just falls through to the year below it instead of
 * leaving the strip short. Prisma can't sort a to-many relation by a field on
 * the parent, so the ordering is done by iterating galleries in year order.
 */
export async function getArchivePhotos(limit = 20): Promise<ArchivePhoto[]> {
  const galleries = await prisma.gallery.findMany({
    orderBy: { year: 'desc' },
    select: {
      year: true,
      // No single gallery can fill more than the whole strip, so this caps the
      // rows fetched without ever cutting off photos we'd have used.
      photos: {
        orderBy: { id: 'desc' },
        take: limit,
        select: { id: true, url: true, author: true },
      },
    },
  })

  const photos: ArchivePhoto[] = []
  const seen = new Set<number>()

  for (const gallery of galleries) {
    for (const photo of gallery.photos) {
      // A photo can belong to more than one gallery; keep the newest year's copy.
      if (seen.has(photo.id)) continue
      seen.add(photo.id)
      photos.push({ ...photo, year: gallery.year })
      if (photos.length === limit) return photos
    }
  }

  return photos
}
