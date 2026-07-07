import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { updateGallery } from '../actions'
import { GalleryForm } from '../gallery-form'

export default async function EditGalleryPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const gallery = await prisma.gallery.findUnique({
    where: { id: Number(id) },
    include: { photos: { select: { id: true, url: true, author: true } } },
  })
  if (!gallery) notFound()

  return (
    <>
      <PageHeader title={`Edit gallery ${gallery.year}`} />
      <ErrorNote message={error ? 'A valid year is required.' : undefined} />
      <GalleryForm action={updateGallery} gallery={gallery} selectedPhotos={gallery.photos} />
    </>
  )
}
