'use server'

import { prisma } from '@/lib/prisma'
import { EVENT_TIME_ZONE } from '@/lib/event-time'

const PAGE_SIZE = 10

const dateFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: EVENT_TIME_ZONE,
  day: 'numeric',
  month: 'long',
  year: 'numeric',
})
const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: EVENT_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
})

export type PastEventItem = {
  id: number
  title: string
  dateLabel: string
  timeLabel: string
  location: string
}
export type PastEventPage = { items: PastEventItem[]; nextCursor: number | null }

// Public read-only fetch — no auth on purpose. Cursor-paginated so the list
// can lazy-load older events as the visitor scrolls.
export async function fetchPastEvents(
  eventTypeId: number,
  cursor?: number,
): Promise<PastEventPage> {
  const rows = await prisma.event.findMany({
    where: {
      event_type_id: eventTypeId,
      ends_at: { lt: new Date() },
      ...(cursor !== undefined && { id: { lt: cursor } }),
    },
    orderBy: { id: 'desc' },
    take: PAGE_SIZE + 1,
    include: { location: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = (hasMore ? rows.slice(0, PAGE_SIZE) : rows).map((event) => ({
    id: event.id,
    title: event.title,
    dateLabel: dateFormat.format(event.start_at),
    timeLabel: `${timeFormat.format(event.start_at)}–${timeFormat.format(event.ends_at)}`,
    location: event.location.name,
  }))
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}
