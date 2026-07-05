import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../../_components/list'
import { updatePost } from '../actions'
import { PostForm } from '../post-form'

export default async function EditPostPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>
  searchParams: Promise<{ error?: string }>
}) {
  const [{ id }, { error }] = await Promise.all([params, searchParams])
  const post = await prisma.post.findUnique({
    where: { id: Number(id) },
    include: {
      thumbnail: { select: { id: true, url: true, key: true } },
      photos: { select: { id: true, url: true, author: true } },
    },
  })
  if (!post) notFound()

  return (
    <>
      <PageHeader title={`Edit: ${post.title}`} />
      <ErrorNote message={error ? 'Title and type are required.' : undefined} />
      <PostForm
        action={updatePost}
        post={post}
        thumbnail={post.thumbnail}
        selectedPhotos={post.photos}
      />
    </>
  )
}
