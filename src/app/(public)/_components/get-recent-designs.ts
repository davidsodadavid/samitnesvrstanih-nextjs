import { prisma } from '@/lib/prisma'

export type RecentDesign = {
  id: number
  url: string
  author: string | null
}

/** Most recently uploaded designs, newest first. */
export async function getRecentDesigns(limit = 10): Promise<RecentDesign[]> {
  return prisma.design.findMany({
    orderBy: { id: 'desc' },
    take: limit,
    select: { id: true, url: true, author: true },
  })
}
