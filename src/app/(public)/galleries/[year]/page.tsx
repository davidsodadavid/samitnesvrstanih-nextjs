import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { fetchGalleryPhotos } from '../actions'
import { GalleryGrid } from './gallery-grid'

export const dynamic = 'force-dynamic'

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ year: string }>
}) {
  const { year: yearParam } = await params
  const year = Number(yearParam)
  if (!Number.isInteger(year)) notFound()

  const gallery = await prisma.gallery.findUnique({ where: { year } })
  if (!gallery) notFound()

  const firstPage = await fetchGalleryPhotos(year)

  return (
    <>
      <h1 className="text-3xl font-bold">Gallery {year}</h1>
      {gallery.authors && <p className="mt-2 text-sm text-zinc-500">Photos: {gallery.authors}</p>}
      <div className="mt-6">
        <GalleryGrid year={year} initial={firstPage} />
      </div>
    </>
  )
}
