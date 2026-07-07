import { prisma } from '@/lib/prisma'
import { DeleteButton, EditLink, Empty, PageHeader, Table } from '../_components/list'
import { deleteGallery } from './actions'

export default async function GalleriesPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { year: 'desc' },
    include: { _count: { select: { photos: true } } },
  })

  return (
    <>
      <PageHeader title="Galleries" newHref="/dashboard/galleries/new" newLabel="New gallery" />
      {galleries.length === 0 ? (
        <Empty>No galleries yet.</Empty>
      ) : (
        <Table headers={['Year', 'Authors', 'Photos', '']}>
          {galleries.map((gallery) => (
            <tr key={gallery.id} className="border-b border-zinc-100 last:border-none">
              <td className="px-3 py-2.5 font-medium">{gallery.year}</td>
              <td className="px-3 py-2.5">
                {gallery.authors ?? <span className="text-zinc-400">—</span>}
              </td>
              <td className="px-3 py-2.5 text-zinc-500">{gallery._count.photos}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/dashboard/galleries/${gallery.id}`} />
                  <DeleteButton action={deleteGallery} id={gallery.id} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
