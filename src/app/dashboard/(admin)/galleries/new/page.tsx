import { ErrorNote, PageHeader } from '../../_components/list'
import { createGallery } from '../actions'
import { GalleryForm } from '../gallery-form'

export default async function NewGalleryPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <>
      <PageHeader title="New gallery" />
      <ErrorNote message={error ? 'Year and authors are required.' : undefined} />
      <GalleryForm action={createGallery} />
    </>
  )
}
