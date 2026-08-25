import { notFound } from 'next/navigation'
import { EVENT_TIME_ZONE } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'
import { ZoomableImage } from '../../_components/lightbox'
import { Markdown } from '../../_components/markdown'

export const dynamic = 'force-dynamic'

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

export default async function EventPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const eventId = Number(id)
  if (!Number.isInteger(eventId)) notFound()

  const event = await prisma.event.findUnique({
    where: { id: eventId },
    include: { location: true, event_type: true, image: true },
  })
  if (!event) notFound()

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{event.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {dayFormat.format(event.start_at)} · {timeFormat.format(event.start_at)}–
        {timeFormat.format(event.ends_at)} · {event.location.name}
        <span className="ml-2 rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold text-zinc-700">
          {event.event_type.name}
        </span>
      </p>
      {event.image && (
        <ZoomableImage src={event.image.url} className="mt-6 w-full rounded-xl object-cover" />
      )}
      <div className="mt-6">
        <Markdown>{event.description}</Markdown>
      </div>
    </article>
  )
}
