import { prisma } from '@/lib/prisma'
import { ProgramView, type ProgramDay } from './program-view'

export const dynamic = 'force-dynamic'

const YEAR = 2026

// Events are entered as local wall-clock time in the dashboard — format them the
// same way, on the server, so visitors in any timezone see the printed times.
const dayFormat = new Intl.DateTimeFormat('en-GB', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
})
const timeFormat = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit' })

export default async function ProgramPage() {
  const events = await prisma.event.findMany({
    where: {
      start_at: { gte: new Date(YEAR, 0, 1), lt: new Date(YEAR + 1, 0, 1) },
    },
    orderBy: { start_at: 'asc' },
    include: { location: true },
  })

  if (events.length === 0) {
    return (
      <>
        <h1 className="mb-6 text-3xl font-bold">Program {YEAR}</h1>
        <p className="text-zinc-500">No program yet.</p>
      </>
    )
  }

  const days: ProgramDay[] = []
  for (const event of events) {
    const key = event.start_at.toDateString()
    let day = days.at(-1)
    if (!day || day.key !== key) {
      day = { key, label: dayFormat.format(event.start_at), events: [] }
      days.push(day)
    }
    day.events.push({
      id: event.id,
      timeRange: `${timeFormat.format(event.start_at)}–${timeFormat.format(event.ends_at)}`,
      title: event.title,
      location: {
        id: event.location.id,
        name: event.location.name,
        lat: event.location.lat,
        lng: event.location.lng,
      },
    })
  }

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">Program {YEAR}</h1>
      <ProgramView days={days} />
    </>
  )
}
