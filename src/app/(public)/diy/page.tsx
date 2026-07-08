import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export const dynamic = 'force-dynamic'

export default async function DiyListPage() {
  const diys = await prisma.diy.findMany({
    orderBy: { id: 'desc' },
    include: {
      location: true,
      photos: { select: { id: true, url: true }, take: 1 },
    },
  })

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">DIY</h1>
      {diys.length === 0 ? (
        <p className="text-zinc-500">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {diys.map((diy) => (
            <Link
              key={diy.id}
              href={`/diy/${diy.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md"
            >
              {diy.photos[0] ? (
                <img src={diy.photos[0].url} alt="" className="h-44 w-full object-cover" />
              ) : (
                <div className="h-44 w-full bg-zinc-100" />
              )}
              <div className="p-4">
                <h2 className="font-semibold group-hover:underline">{diy.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">{diy.location.name}</p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
