import Link from 'next/link'
import { notFound } from 'next/navigation'
import { BLOG_TYPES } from '@/lib/blog-types'
import { prisma } from '@/lib/prisma'

// Content is edited in the dashboard — always render fresh.
export const dynamic = 'force-dynamic'

export default async function BlogListPage({
  params,
}: {
  params: Promise<{ type: string }>
}) {
  const { type } = await params
  const blogType = BLOG_TYPES[type]
  if (!blogType) notFound()

  const posts = await prisma.post.findMany({
    where: { type: blogType.type },
    orderBy: { created_at: 'desc' },
    include: { thumbnail: true },
  })

  return (
    <>
      <h1 className="mb-6 text-3xl font-bold">{blogType.title}</h1>
      {posts.length === 0 ? (
        <p className="text-zinc-500">Nothing here yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.id}
              href={`/blog/${type}/${post.id}`}
              className="group overflow-hidden rounded-xl border border-zinc-200 bg-white transition-shadow hover:shadow-md"
            >
              {post.thumbnail ? (
                <img
                  src={post.thumbnail.url}
                  alt=""
                  className="h-44 w-full object-cover"
                />
              ) : (
                <div className="h-44 w-full bg-zinc-100" />
              )}
              <div className="p-4">
                <h2 className="font-semibold group-hover:underline">{post.title}</h2>
                <p className="mt-1 text-sm text-zinc-500">
                  {post.created_at.toISOString().slice(0, 10)}
                </p>
              </div>
            </Link>
          ))}
        </div>
      )}
    </>
  )
}
