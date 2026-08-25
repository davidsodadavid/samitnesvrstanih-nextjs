import { notFound } from 'next/navigation'
import { BLOG_TYPES } from '@/lib/blog-types'
import { prisma } from '@/lib/prisma'
import { PhotoGrid, ZoomableImage } from '../../../_components/lightbox'
import { Markdown } from '../../../_components/markdown'

export const dynamic = 'force-dynamic'

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ type: string; id: string }>
}) {
  const { type, id } = await params
  const blogType = BLOG_TYPES[type]
  const postId = Number(id)
  if (!blogType || !Number.isInteger(postId)) notFound()

  const post = await prisma.post.findUnique({
    where: { id: postId },
    include: { thumbnail: true, photos: true },
  })
  if (!post || post.type !== blogType.type) notFound()

  return (
    <article className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">{post.title}</h1>
      <p className="mt-2 text-sm text-zinc-500">
        {post.created_at.toISOString().slice(0, 10)}
      </p>
      {post.thumbnail && (
        <ZoomableImage
          src={post.thumbnail.url}
          className="mt-6 w-full object-cover"
        />
      )}
      <div className="mt-6">
        <Markdown>{post.description}</Markdown>
      </div>
      <div className="mt-8">
        <PhotoGrid
          photos={post.photos.map((photo) => ({
            id: photo.id,
            url: photo.url,
            author: photo.author,
          }))}
        />
      </div>
    </article>
  )
}
