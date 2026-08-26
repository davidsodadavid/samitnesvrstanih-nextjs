import { prisma } from '@/lib/prisma'
import { toPlainText, truncate } from '@/lib/markdown-text'

// Matched by name (not a hardcoded id) so the type can be recreated in the
// dashboard without breaking this card.
const EXHIBITION_TYPE_NAME = 'exhibition'

const TEASER_LENGTH = 320

export type PastExhibition = {
  id: number
  title: string
  teaser: string
  imageUrl: string
}

/** Most recent past exhibitions that have an image, newest first. */
export async function getPastExhibitions(limit = 5): Promise<PastExhibition[]> {
  const events = await prisma.event.findMany({
    where: {
      ends_at: { lt: new Date() },
      image_id: { not: null },
      event_type: { name: { equals: EXHIBITION_TYPE_NAME, mode: 'insensitive' } },
    },
    orderBy: { start_at: 'desc' },
    take: limit,
    include: { image: true },
  })

  return events
    .filter((event) => event.image !== null)
    .map((event) => ({
      id: event.id,
      title: event.title,
      teaser: truncate(toPlainText(event.description), TEASER_LENGTH),
      imageUrl: event.image!.url,
    }))
}
