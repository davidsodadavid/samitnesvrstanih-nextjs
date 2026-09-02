import { prisma } from '@/lib/prisma'
import { toPlainText, truncate } from '@/lib/markdown-text'

const TEASER_LENGTH = 320

export type EventTeaser = {
  id: number
  title: string
  teaser: string
  imageUrl: string
}

/**
 * The latest events of one type that have an image, newest first — the shape
 * the homepage's Exhibitions and DIY cards rotate through.
 *
 * Upcoming events count: what makes an event showable here is having a picture,
 * not having happened, the same rule the Films card uses.
 *
 * The type is matched by name rather than a hardcoded id, so it can be deleted
 * and recreated in the dashboard without breaking the card that uses it.
 */
export async function getLatestEventsByType(
  typeName: string,
  limit = 5,
): Promise<EventTeaser[]> {
  const events = await prisma.event.findMany({
    where: {
      image: { isNot: null },
      event_type: { name: { equals: typeName, mode: 'insensitive' } },
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
