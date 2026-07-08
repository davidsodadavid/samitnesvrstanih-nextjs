'use client'

import { useEffect, useRef, useState } from 'react'
import { Lightbox } from '../../_components/lightbox'
import { fetchGalleryPhotos, type GalleryPhotoPage } from '../actions'

export function GalleryGrid({ year, initial }: { year: number; initial: GalleryPhotoPage }) {
  const [photos, setPhotos] = useState(initial.items)
  const [nextCursor, setNextCursor] = useState(initial.nextCursor)
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  const loadingRef = useRef(false)
  const sentinelRef = useRef<HTMLDivElement>(null)

  // Load the next page when the sentinel below the grid scrolls near the viewport
  useEffect(() => {
    if (nextCursor === null) return
    const sentinel = sentinelRef.current
    if (!sentinel) return

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries[0].isIntersecting || loadingRef.current) return
        loadingRef.current = true
        fetchGalleryPhotos(year, nextCursor)
          .then((page) => {
            setPhotos((prev) => [...prev, ...page.items])
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
  }, [year, nextCursor])

  if (photos.length === 0) {
    return <p className="text-zinc-500">No photos yet.</p>
  }

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {photos.map((photo, index) => (
          <button
            key={photo.id}
            type="button"
            onClick={() => setOpenIndex(index)}
            className="cursor-zoom-in"
          >
            <img
              src={photo.url}
              alt={photo.author ? `Photo by ${photo.author}` : 'Photo'}
              title={photo.author ?? undefined}
              loading="lazy"
              className="h-44 w-full rounded-lg object-cover sm:h-56"
            />
          </button>
        ))}
      </div>
      {nextCursor !== null && (
        <div ref={sentinelRef} className="py-6 text-center text-sm text-zinc-500">
          Loading…
        </div>
      )}
      {openIndex !== null && (
        <Lightbox
          images={photos}
          index={openIndex}
          onClose={() => setOpenIndex(null)}
          onIndexChange={setOpenIndex}
        />
      )}
    </>
  )
}
