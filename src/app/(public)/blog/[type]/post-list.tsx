'use client'

import { useEffect, useRef, useState } from 'react'
import type { PostType } from '@/generated/prisma/client'
import { DashedLine } from '../../_components/dashed-line'
import { Markdown } from '../../_components/markdown'
import { PhotoGrid, ZoomableImage } from '../../_components/lightbox'
import { fetchBlogPosts, type BlogPostItem, type BlogPostPage } from './actions'

function PostEntry({ post }: { post: BlogPostItem }) {
  return (
    <article>
      <div className="flex flex-wrap items-baseline justify-between gap-4 bg-black px-4 py-2">
        <h2 className="font-headline text-xl font-bold text-white uppercase sm:text-2xl">
          {post.title}
        </h2>
        <span className="font-body text-sm text-white sm:text-base">{post.dateLabel}</span>
      </div>
      <div className="mt-4">
        <Markdown>{post.description}</Markdown>
      </div>
      {post.thumbnail && (
        <div className="mt-6">
          <ZoomableImage src={post.thumbnail.url} className="w-full object-cover" />
        </div>
      )}
      {post.photos.length > 0 && (
        <div className="mt-4">
          <PhotoGrid photos={post.photos} />
        </div>
      )}
    </article>
  )
}

export function PostList({ type, initial }: { type: PostType; initial: BlogPostPage }) {
  const [posts, setPosts] = useState(initial.items)
  const [nextCursor, setNextCursor] = useState(initial.nextCursor)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Load the next page when the sentinel below the list scrolls near the viewport
  useEffect(() => {
    if (nextCursor === null) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current) return
        loadingRef.current = true
        fetchBlogPosts(type, nextCursor)
          .then((page) => {
            setPosts((prev) => [...prev, ...page.items])
            setNextCursor(page.nextCursor)
          })
          .finally(() => {
            loadingRef.current = false
          })
      },
      { rootMargin: '600px' },
    )
    observer.observe(sentinel)
    return () => observer.disconnect()
  }, [type, nextCursor])

  if (posts.length === 0) {
    return (
      <>
        <DashedLine />
        <p className="text-zinc-500">Nothing here yet.</p>
      </>
    )
  }

  return (
    <>
      <DashedLine />
      {posts.map((post, i) => (
        <div key={post.id}>
          {i > 0 && <DashedLine />}
          <PostEntry post={post} />
        </div>
      ))}
      <DashedLine />
      {nextCursor !== null && (
        <div ref={sentinelRef} className="py-6 text-center text-sm text-zinc-500">
          Loading…
        </div>
      )}
    </>
  )
}
