import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { updateDiy } from '../actions'
import { DiyForm } from '../diy-form'

export default async function EditDiyPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const [diy, locations] = await Promise.all([
    prisma.diy.findUnique({
      where: { id: Number(id) },
      include: { photos: { select: { id: true, url: true, author: true } } },
    }),
    prisma.location.findMany({ orderBy: { name: 'asc' } }),
  ])
  if (!diy) notFound()

  return (
    <>
      <PageHeader title={`Edit: ${diy.title}`} />
      <ErrorNote message={error ? 'Title and location are required.' : undefined} />
      <DiyForm action={updateDiy} locations={locations} diy={diy} selectedPhotos={diy.photos} />
    </>
  )
}
