'use server'

import type { PostType } from '@/generated/prisma/client'
import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 10

export type BlogPostItem = {
  id: number
  title: string
  description: string
  dateLabel: string
  thumbnail: { url: string } | null
  photos: { id: number; url: string; author: string | null }[]
}
export type BlogPostPage = { items: BlogPostItem[]; nextCursor: number | null }

// Public read-only fetch — no auth on purpose. Cursor-paginated so blog list
// pages can lazy-load posts as the visitor scrolls (see galleries/actions.ts).
export async function fetchBlogPosts(type: PostType, cursor?: number): Promise<BlogPostPage> {
  const rows = await prisma.post.findMany({
    where: { type, ...(cursor !== undefined && { id: { lt: cursor } }) },
    orderBy: { id: 'desc' },
    take: PAGE_SIZE + 1,
    include: { thumbnail: true, photos: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = (hasMore ? rows.slice(0, PAGE_SIZE) : rows).map((post) => ({
    id: post.id,
    title: post.title,
    description: post.description,
    dateLabel: post.created_at.toISOString().slice(0, 10),
    thumbnail: post.thumbnail,
    photos: post.photos,
  }))
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}
