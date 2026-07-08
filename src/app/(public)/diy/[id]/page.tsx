import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { PhotoGrid } from '../../_components/lightbox'
import { Markdown } from '../../_components/markdown'

export const dynamic = 'force-dynamic'

export default async function DiyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const diyId = Number(id)
  if (!Number.isInteger(diyId)) notFound()
  const diy = await prisma.diy.findUnique({
    where: { id: diyId },
    include: { location: true, photos: true },
  })
  if (!diy) notFound()

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{diy.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">{diy.location.name}</p>
      <div className="mt-6">
        <Markdown>{diy.description}</Markdown>
      </div>
      <div className="mt-8">
        <PhotoGrid
          photos={diy.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            author: photo.author,
          }))}
        />
      </div>
    </article>
  )
}
