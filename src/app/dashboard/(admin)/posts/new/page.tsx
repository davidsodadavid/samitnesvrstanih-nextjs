import { ErrorNote, PageHeader } from '../../_components/list'
import { createPost } from '../actions'
import { PostForm } from '../post-form'

export default async function NewPostPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams

  return (
    <>
      <PageHeader title="New post" />
      <ErrorNote message={error ? 'Title and type are required.' : undefined} />
      <PostForm action={createPost} />
    </>
  )
}
