'use server'

import { prisma } from '@/lib/prisma'

const PAGE_SIZE = 24

export type DesignItem = { id: number; url: string; author: string | null }
export type DesignPage = { items: DesignItem[]; nextCursor: number | null }

// Public read-only fetch — no auth on purpose. Cursor-paginated so the page
// can lazy-load designs as the visitor scrolls (see galleries/actions.ts).
export async function fetchDesigns(cursor?: number): Promise<DesignPage> {
  const rows = await prisma.design.findMany({
    where: cursor !== undefined ? { id: { gt: cursor } } : undefined,
    orderBy: { id: 'asc' },
    take: PAGE_SIZE + 1,
    select: { id: true, url: true, author: true },
  })
  const hasMore = rows.length > PAGE_SIZE
  const items = hasMore ? rows.slice(0, PAGE_SIZE) : rows
  return { items, nextCursor: hasMore ? items[items.length - 1].id : null }
}
