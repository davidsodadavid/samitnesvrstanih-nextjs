import { prisma } from '@/lib/prisma'
import { DeleteButton, EditLink, Empty, PageHeader, Table } from '../_components/list'
import { deleteEvent } from './actions'

function formatRange(start: Date, end: Date): string {
  const fmt = (d: Date) => d.toISOString().slice(0, 16).replace('T', ' ')
  return `${fmt(start)} → ${fmt(end)}`
}

export default async function EventsPage() {
  const events = await prisma.event.findMany({
    orderBy: { start_at: 'desc' },
    include: { location: true, event_type: true },
  })

  return (
    <>
      <PageHeader title="Events" newHref="/dashboard/events/new" newLabel="New event" />
      {events.length === 0 ? (
        <Empty>No events yet.</Empty>
      ) : (
        <Table headers={['Title', 'When', 'Location', 'Type', '']}>
          {events.map((event) => (
            <tr key={event.id} className="border-b border-zinc-100 last:border-none">
              <td className="px-3 py-2.5 font-medium">{event.title}</td>
              <td className="px-3 py-2.5 text-zinc-500">
                {formatRange(event.start_at, event.ends_at)}
              </td>
              <td className="px-3 py-2.5">{event.location.name}</td>
              <td className="px-3 py-2.5">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold">
                  {event.event_type.name}
                </span>
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/dashboard/events/${event.id}`} />
                  <DeleteButton action={deleteEvent} id={event.id} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
