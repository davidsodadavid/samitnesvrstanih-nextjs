import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { updateEvent } from '../actions'
import { EventForm } from '../event-form'

export default async function EditEventPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const [event, locations, eventTypes] = await Promise.all([
    prisma.event.findUnique({
      where: { id: Number(id) },
      include: { image: { select: { id: true, url: true, key: true } } },
    }),
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
    prisma.eventType.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!event) notFound()

  return (
    <>
      <PageHeader title={`Edit: ${event.title}`} />
      <ErrorNote
        message={error ? 'Title, both dates, location and type are required.' : undefined}
      />
      <EventForm
        action={updateEvent}
        locations={locations}
        eventTypes={eventTypes}
        event={event}
        image={event.image}
      />
    </>
  )
}
