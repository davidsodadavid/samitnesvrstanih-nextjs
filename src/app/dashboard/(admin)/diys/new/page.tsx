import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { createDiy } from '../actions'
import { DiyForm } from '../diy-form'

export default async function NewDiyPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const locations = await prisma.location.findMany({ orderBy: { name: 'asc' } })

  if (locations.length === 0) {
    return (
      <>
        <PageHeader title="New DIY entry" />
        <p className="max-w-xl text-sm text-zinc-600">
          DIY entries need a location. Create one under{' '}
          <Link href="/dashboard/locations/new" className="font-semibold underline">
            Locations
          </Link>{' '}
          first.
        </p>
      </>
    )
  }

  return (
    <>
      <PageHeader title="New DIY entry" />
      <ErrorNote message={error ? 'Title and location are required.' : undefined} />
      <DiyForm action={createDiy} locations={locations} />
    </>
  )
}
