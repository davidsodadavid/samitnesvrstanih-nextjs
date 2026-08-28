import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { SectionHeader } from '../../_components/section-header'
import { fetchPastEvents } from './actions'
import { PastEventList } from './past-event-list'

// Content is edited in the dashboard — always render fresh.
export const dynamic = 'force-dynamic'

export default async function PastEventsPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const eventTypeId = Number(id)
  if (!Number.isInteger(eventTypeId)) notFound()

  const eventType = await prisma.eventType.findUnique({
    where: { id: eventTypeId },
    include: { icon: true, art: true },
  })
  if (!eventType) notFound()

  const firstPage = await fetchPastEvents(eventTypeId)

  return (
    <>
      {/* Colour, icon and strip all come from the type's dashboard entry, the
          same fields its homepage card uses; the generic strip is only a
          stand-in until an admin uploads art for it. */}
      <SectionHeader
        title={eventType.name}
        accentColor={eventType.color}
        icon={eventType.icon?.url}
        photoSrc={eventType.art?.url ?? '/blog/header-strip.png'}
      />

      <PastEventList eventTypeId={eventTypeId} initial={firstPage} />
    </>
  )
}
