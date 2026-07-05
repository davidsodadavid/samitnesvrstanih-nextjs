import { prisma } from '@/lib/prisma'
import { DeleteButton, EditLink, Empty, PageHeader, Table } from '../_components/list'
import { deleteDiy } from './actions'

export default async function DiysPage() {
  const diys = await prisma.diy.findMany({
    orderBy: { id: 'desc' },
    include: { location: true, _count: { select: { photos: true } } },
  })

  return (
    <>
      <PageHeader title="DIY" newHref="/dashboard/diys/new" newLabel="New DIY entry" />
      {diys.length === 0 ? (
        <Empty>No DIY entries yet.</Empty>
      ) : (
        <Table headers={['Title', 'Location', 'Photos', '']}>
          {diys.map((diy) => (
            <tr key={diy.id} className="border-b border-zinc-100 last:border-none">
              <td className="px-3 py-2.5 font-medium">{diy.title}</td>
              <td className="px-3 py-2.5">{diy.location.name}</td>
              <td className="px-3 py-2.5 text-zinc-500">{diy._count.photos}</td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/dashboard/diys/${diy.id}`} />
                  <DeleteButton action={deleteDiy} id={diy.id} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
