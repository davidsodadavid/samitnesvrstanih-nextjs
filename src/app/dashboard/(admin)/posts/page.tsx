import { prisma } from '@/lib/prisma'
import { DeleteButton, EditLink, Empty, PageHeader, Table } from '../_components/list'
import { deletePost } from './actions'

export default async function PostsPage() {
  const posts = await prisma.post.findMany({
    orderBy: { created_at: 'desc' },
    include: { thumbnail: true, _count: { select: { photos: true } } },
  })

  return (
    <>
      <PageHeader title="Posts" newHref="/dashboard/posts/new" newLabel="New post" />
      {posts.length === 0 ? (
        <Empty>No posts yet.</Empty>
      ) : (
        <Table headers={['', 'Title', 'Type', 'Photos', 'Created', '']}>
          {posts.map((post) => (
            <tr key={post.id} className="border-b border-zinc-100 last:border-none">
              <td className="w-18 px-3 py-2">
                {post.thumbnail ? (
                  <img
                    src={post.thumbnail.url}
                    alt=""
                    className="h-10 w-14 rounded-md object-cover"
                  />
                ) : (
                  <div className="h-10 w-14 rounded-md bg-zinc-100" />
                )}
              </td>
              <td className="px-3 py-2.5 font-medium">{post.title}</td>
              <td className="px-3 py-2.5">
                <span className="rounded-full bg-zinc-100 px-2.5 py-0.5 text-xs font-semibold">
                  {post.type.toLowerCase()}
                </span>
              </td>
              <td className="px-3 py-2.5 text-zinc-500">{post._count.photos}</td>
              <td className="px-3 py-2.5 text-zinc-500">
                {post.created_at.toISOString().slice(0, 10)}
              </td>
              <td className="px-3 py-2.5">
                <div className="flex items-center justify-end gap-3">
                  <EditLink href={`/dashboard/posts/${post.id}`} />
                  <DeleteButton action={deletePost} id={post.id} />
                </div>
              </td>
            </tr>
          ))}
        </Table>
      )}
    </>
  )
}
