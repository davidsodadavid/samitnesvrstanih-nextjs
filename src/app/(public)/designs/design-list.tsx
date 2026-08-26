'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '../_components/lightbox'
import { fetchDesigns, type DesignPage } from './actions'

// Same layout as a single gallery page (small grid thumbnails, click to
// zoom) — see galleries/[year]/gallery-grid.tsx.
export function DesignList({ initial }: { initial: DesignPage }) {
  const [designs, setDesigns] = useState(initial.items)
  const [nextCursor, setNextCursor] = useState(initial.nextCursor)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (nextCursor === null) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current) return
        loadingRef.current = true
        fetchDesigns(nextCursor)
          .then((page) => {
            setDesigns((prev) => [...prev, ...page.items])
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
  }, [nextCursor])

  if (designs.length === 0) {
    return <p className="font-body text-white/60">No designs yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-1 bg-black sm:grid-cols-3 lg:grid-cols-4">
        {designs.map((design, index) => (
          <button
            key={design.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="cursor-zoom-in"
          >
            <img
              src={design.url}
              alt={design.author ? `Design by ${design.author}` : 'Design'}
              title={design.author ?? undefined}
              loading="lazy"
              className="h-32 w-full object-cover sm:h-40"
            />
          </button>
        ))}
      </div>
      {nextCursor !== null && (
        <div ref={sentinelRef} className="py-6 text-center text-sm text-white/60">
          Loading…
        </div>
      )}
      {openIndex !== null && (
        <Lightbox
          images={designs}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  )
}
