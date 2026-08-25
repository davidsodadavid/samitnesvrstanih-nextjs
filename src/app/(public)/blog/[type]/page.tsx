import { notFound } from 'next/navigation'
import { BLOG_TYPES } from '@/lib/blog-types'
import { navItems } from '../../_components/nav-items'
import { SectionHeader } from '../../_components/section-header'
import { fetchBlogPosts } from './actions'
import { PostList } from './post-list'

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

  // Reuse the navbar's per-section color/icon so the header matches it —
  // search every dropdown, since a content type can live in any of them.
  const navItem = navItems
    .filter((item) => item.type === 'group')
    .flatMap((group) => group.items)
    .find((item) => item.href === `/blog/${type}`)
  const firstPage = await fetchBlogPosts(blogType.type)

  return (
    <>
      <SectionHeader
        title={blogType.title}
        accentColor={navItem?.accentColor ?? '#000'}
        icon={navItem?.icon}
        photoSrc="/blog/header-strip.png"
      />

      <PostList type={blogType.type} initial={firstPage} />
    </>
  )
}
