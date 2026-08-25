import { EVENT_TIME_ZONE, parseLocalDateTime } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'
import { ProgramView, type ProgramDay } from './program-view'

export const dynamic = 'force-dynamic'

const YEAR = 2026

// Events are entered as wall-clock time in the festival's own timezone —
// format them the same way regardless of the server's OS timezone, so
// visitors everywhere see the printed times the organizers intended.
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

export function ProgramHeader() {
  return (
    <>
      <div className="relative flex h-24 items-center justify-center bg-black sm:h-32 md:h-40">
        <img
          src="/program/corner-icon.svg"
          alt=""
          className="absolute left-4 h-10 w-auto sm:h-14 md:h-16"
        />
        <h1 className="font-display text-4xl text-white uppercase sm:text-6xl md:text-8xl">
          Program
        </h1>
        <img
          src="/program/corner-icon.svg"
          alt=""
          className="absolute right-4 h-10 w-auto sm:h-14 md:h-16"
        />
      </div>
      <img src="/program/header-photo.png" alt="" className="h-10 w-full object-cover sm:h-14 md:h-16" />
    </>
  )
}

export default async function ProgramPage() {
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

  if (events.length === 0) {
    return (
      <div className="relative left-1/2 -mt-8 -mb-8 min-h-screen w-screen -translate-x-1/2 bg-[#ff3c21] pb-8">
        <ProgramHeader />
        <p className="px-4 py-8 text-white">No program yet.</p>
      </div>
    )
  }

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

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 min-h-screen w-screen -translate-x-1/2 bg-[#ff3c21] pb-8">
      <ProgramHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ProgramView days={days} />
      </div>
    </div>
  )
}
