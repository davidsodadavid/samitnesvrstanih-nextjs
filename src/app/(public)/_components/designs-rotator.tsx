'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { RecentDesign } from './get-recent-designs'

const ROTATE_MS = 6000
const PER_PAGE = 3

/** Shows three designs at a time, cycling through the set. */
export function DesignsRotator({ items }: { items: RecentDesign[] }) {
  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const [page, setPage] = useState(0)

  useEffect(() => {
    if (pageCount < 2) return
    const timer = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS)
    return () => clearInterval(timer)
  }, [pageCount])

  if (items.length === 0) return null

  // Wraps around so the final page is always full rather than leaving gaps
  // when the count isn't divisible by three.
  const visible = Array.from(
    { length: Math.min(PER_PAGE, items.length) },
    (_, i) => items[(page * PER_PAGE + i) % items.length],
  )

  return (
    <div className="flex flex-col p-3 sm:p-4 lg:min-h-0 lg:flex-1">
      <div className="grid h-40 grid-cols-3 gap-2 sm:h-[260px] sm:gap-3 lg:h-auto lg:min-h-0 lg:flex-1">
        {visible.map((design, i) => (
          <Link
            key={`${page}-${i}-${design.id}`}
            href="/designs"
            className="block min-h-0 border-2 border-black"
          >
            <img
              src={design.url}
              alt={design.author ? `Design by ${design.author}` : 'Design'}
              className="h-full w-full object-cover"
            />
          </Link>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Show designs page ${i + 1}`}
              aria-current={i === page}
              className={`h-2 w-2 cursor-pointer rounded-full border border-black ${
                i === page ? 'bg-black' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
