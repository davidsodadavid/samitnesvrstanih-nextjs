import type { PostType } from '@/generated/prisma/client'

// URL slug → post type shown at /blog/[type]. DIY lives at /diy (own model).
export const BLOG_TYPES: Record<string, { type: PostType; title: string }> = {
  posts: { type: 'POST', title: 'Posts' },
  films: { type: 'FILM', title: 'Films' },
  exhibitions: { type: 'EXHIBITION', title: 'Exhibitions' },
  workshops: { type: 'WORKSHOP', title: 'Workshops' },
  concerts: { type: 'CONCERT', title: 'Concerts' },
}
