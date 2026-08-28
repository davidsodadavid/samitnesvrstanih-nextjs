import { notFound } from 'next/navigation'
import { EVENT_TIME_ZONE } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'
import { ZoomableImage } from '../../_components/lightbox'
import { Markdown } from '../../_components/markdown'
import { DashedLine } from '../program-view'
import { ProgramHeader } from '../page'
import { LocationMap } from './location-map'

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
    include: { location: true, event_type: { include: { icon: true } }, image: true },
  })
  if (!event) notFound()

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-[#ff3c21]">
      <ProgramHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashedLine />

        <article>
          <div className="flex flex-col gap-1 bg-black px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:gap-4">
            <span className="font-headline flex items-center gap-3 text-2xl font-bold text-white uppercase sm:min-w-0 sm:flex-1 sm:text-3xl">
              {event.event_type.icon && (
                <img
                  src={event.event_type.icon.url}
                  alt=""
                  className="h-8 w-8 shrink-0 object-contain"
                />
              )}
              <span className="min-w-0">{event.title}</span>
            </span>
            <span className="font-body text-right text-sm text-white sm:shrink-0 sm:text-base">
              {dayFormat.format(event.start_at)}
              <br />
              {timeFormat.format(event.start_at)}–{timeFormat.format(event.ends_at)}
            </span>
          </div>

          {event.description && (
            <div className="mt-6">
              <Markdown invert>{event.description}</Markdown>
            </div>
          )}

          {event.image && (
            <div className="mt-6">
              <ZoomableImage src={event.image.url} className="w-full object-cover" />
            </div>
          )}
        </article>

        <DashedLine />

        <div className="bg-black px-4 py-3">
          <span className="font-headline text-xl font-bold text-white uppercase sm:text-2xl">
            {event.location.name}
          </span>
        </div>
        <div className="mt-4">
          <LocationMap
            lat={event.location.lat}
            lng={event.location.lng}
            color={event.event_type.color}
            iconUrl={event.event_type.icon?.url ?? null}
          />
        </div>

        <DashedLine />
      </div>
    </div>
  )
}
