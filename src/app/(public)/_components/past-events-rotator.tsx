'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { PastEventTeaser } from './get-past-events-by-type'

const ROTATE_MS = 6000

/** Cycles through recent past events: photo on the left, teaser text on the right. */
export function PastEventsRotator({ items }: { items: PastEventTeaser[] }) {
  const [index, setIndex] = useState(0)

  useEffect(() => {
    if (items.length < 2) return
    const timer = setInterval(() => setIndex((i) => (i + 1) % items.length), ROTATE_MS)
    return () => clearInterval(timer)
  }, [items.length])

  if (items.length === 0) return null
  // Guards against the list shrinking (fewer events after a revalidate).
  const current = items[index % items.length]

  return (
    <div className="flex flex-col p-3 sm:p-4 lg:min-h-0 lg:flex-1">
      {/* Fixed row height keeps the card from resizing as photos rotate; on
          desktop it instead fills the card so the column can match Program's
          height. Two equal columns — the grid splits the leftover space after
          the gap evenly, so photo and text box are the same width. */}
      <div className="grid grid-cols-1 gap-3 sm:h-[260px] sm:grid-cols-2 sm:gap-4 lg:h-auto lg:min-h-0 lg:flex-1">
        <Link
          href={`/program/${current.id}`}
          className="block min-h-0 border-2 border-black sm:h-full"
        >
          <img
            src={current.imageUrl}
            alt={current.title}
            className="h-48 w-full object-cover sm:h-full"
          />
        </Link>

        <div className="min-h-0 min-w-0 overflow-hidden bg-black p-3">
          <p className="font-body text-sm leading-snug text-white">{current.teaser}</p>
        </div>
      </div>

      {items.length > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {items.map((item, i) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show ${item.title}`}
              aria-current={i === index}
              className={`h-2 w-2 cursor-pointer rounded-full border border-black ${
                i === index ? 'bg-black' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
