import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { updateLocation } from '../actions'
import { LocationForm } from '../location-form'

export default async function EditLocationPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const location = await prisma.location.findUnique({ where: { id: Number(id) } })
  if (!location) notFound()

  return (
    <>
      <PageHeader title={`Edit: ${location.name}`} />
      <ErrorNote message={error ? 'Name and valid coordinates are required.' : undefined} />
      <LocationForm action={updateLocation} location={location} />
    </>
  )
}
