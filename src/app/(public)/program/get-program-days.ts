import { EVENT_TIME_ZONE, parseLocalDateTime } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'
import type { EventTypeStyle, ProgramDay } from './program-view'

const YEAR = 2026

const dayFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: EVENT_TIME_ZONE,
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const timeFormat = new Intl.DateTimeFormat('en-GB', {
  timeZone: EVENT_TIME_ZONE,
  hour: '2-digit',
  minute: '2-digit',
})

// Shared by /program and any other page that needs the festival schedule
// (e.g. the homepage's program teaser card).
export async function getProgramDays(): Promise<ProgramDay[]> {
  const events = await prisma.event.findMany({
    where: {
      start_at: {
        gte: parseLocalDateTime(`${YEAR}-01-01T00:00`, EVENT_TIME_ZONE),
        lt: parseLocalDateTime(`${YEAR + 1}-01-01T00:00`, EVENT_TIME_ZONE),
      },
    },
    orderBy: { start_at: 'asc' },
    include: { location: true, event_type: { include: { icon: true } } },
  })

  const days: ProgramDay[] = []
  for (const event of events) {
    const key = dayFormat.format(event.start_at)
    let day = days.at(-1)
    if (!day || day.key !== key) {
      day = { key, label: dayFormat.format(event.start_at), events: [] }
      days.push(day)
    }
    day.events.push({
      id: event.id,
      timeRange: `${timeFormat.format(event.start_at)}–${timeFormat.format(event.ends_at)}`,
      title: event.title,
      description: event.description,
      eventType: {
        id: event.event_type.id,
        name: event.event_type.name,
        iconUrl: event.event_type.icon?.url ?? null,
        color: event.event_type.color,
      },
      location: {
        id: event.location.id,
        name: event.location.name,
        lat: event.location.lat,
        lng: event.location.lng,
      },
    })
  }
  return days
}

export function getEventTypes(days: ProgramDay[]): EventTypeStyle[] {
  const byId = new Map<number, EventTypeStyle>()
  for (const day of days) for (const e of day.events) byId.set(e.eventType.id, e.eventType)
  return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
}
