import { prisma } from '@/lib/prisma'
import { DeleteButton, EditLink, Empty, ErrorNote, PageHeader, Table } from '../_components/list'
import { deleteLocation } from './actions'

export default async function LocationsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const locations = await prisma.location.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } } },
  })

  return (
    <>
      <PageHeader title="Locations" newHref="/dashboard/locations/new" newLabel="New location" />
      <ErrorNote
        message={error === 'in-use' ? 'This location is used by events — reassign them first.' : undefined}
      />

      {locations.length === 0 ? (
        <Empty>No locations yet.</Empty>
      ) : (
        <Table headers={['Name', 'Coordinates', 'Used by', '']}>
          {locations.map((location) => (
            <tr key={location.id} className="border-b border-zinc-100 last:border-none">
              <td className="px-3 py-2.5 font-medium">{location.name}</td>
              <td className="px-3 py-2.5 text-zinc-500">
                {location.lat}, {location.lng}
              </td>
              <td className="px-3 py-2.5 text-zinc-500">{location._count.events} events</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/dashboard/locations/${location.id}`} />
                  <DeleteButton action={deleteLocation} id={location.id} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
