import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { createEvent } from '../actions'
import { EventForm } from '../event-form'

export default async function NewEventPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const [locations, eventTypes] = await Promise.all([
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
    prisma.eventType.findMany({ orderBy: { name: 'asc' } }),
  ])

  if (locations.length === 0 || eventTypes.length === 0) {
    return (
      <>
        <PageHeader title="New event" />
        <p className="max-w-xl text-sm text-zinc-600">
          Events need a location and an event type. Create at least one{' '}
          <Link href="/dashboard/locations/new" className="font-semibold underline">
            location
          </Link>{' '}
          and one{' '}
          <Link href="/dashboard/event-types" className="font-semibold underline">
            event type
          </Link>{' '}
          first.
        </p>
      </>
    )
  }

  return (
    <>
      <PageHeader title="New event" />
      <ErrorNote
        message={error ? 'Title, both dates, location and type are required.' : undefined}
      />
      <EventForm action={createEvent} locations={locations} eventTypes={eventTypes} />
    </>
  )
}
