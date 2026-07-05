import { ErrorNote, PageHeader } from '../../_components/list'
import { createLocation } from '../actions'
import { LocationForm } from '../location-form'

export default async function NewLocationPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  return (
    <>
      <PageHeader title="New location" />
      <ErrorNote message={error ? 'Name and valid coordinates are required.' : undefined} />
      <LocationForm action={createLocation} />
    </>
  )
}
