'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { ArchivePhoto } from './get-archive-photos'

const ROTATE_MS = 4000
// The widest breakpoint shows five; narrower ones hide the tail of the row.
const VISIBLE = 5

/**
 * Endless strip of archive photos. The window shifts by one each tick rather
 * than by a whole page, so every photo comes around even at the narrow
 * breakpoints where only two or three tiles are on screen.
 */
export function PhotoArchiveRotator({ photos, year }: { photos: ArchivePhoto[]; year: number }) {
  const [start, setStart] = useState(0)

  useEffect(() => {
    if (photos.length <= VISIBLE) return
    const timer = setInterval(() => setStart((s) => (s + 1) % photos.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [photos.length])

  if (photos.length === 0) return null

  const visible = Array.from(
    { length: Math.min(VISIBLE, photos.length) },
    (_, i) => photos[(start + i) % photos.length],
  )

  return (
    <div className="px-2 pb-2 sm:px-3 sm:pb-3">
      {/* A fixed row height with flex-1 tiles, rather than square tiles in a
          fixed grid: the strip keeps the same height whether the gallery has
          five photos to show or two. */}
      <div className="flex h-40 gap-2 sm:h-[240px] sm:gap-3">
        {visible.map((photo, i) => (
          <Link
            key={`${start}-${i}-${photo.id}`}
            href={`/galleries/${year}`}
            className={`min-w-0 flex-1 border-2 border-black ${
              i === 2 ? 'hidden sm:block' : i > 2 ? 'hidden lg:block' : ''
            }`}
          >
            <img
              src={photo.url}
              alt={photo.author ? `Photo by ${photo.author}` : `Photo from ${year}`}
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>
    </div>
  )
}
