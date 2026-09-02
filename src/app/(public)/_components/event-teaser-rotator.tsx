'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'
import type { EventTeaser } from './get-events-by-type'

const ROTATE_MS = 6000

/**
 * Cycles through recent events of one type: photo on the left, teaser on the right.
 *
 * Every row has a fixed height so the card doesn't jump as items rotate through
 * teasers of different lengths — the text box clips instead of growing. Pass
 * `stretch` for a card that has to fill a column of a set height (Exhibitions
 * matching Program's), which trades the fixed height for filling the space.
 */
export function EventTeaserRotator({
  items,
  stretch = false,
}: {
  items: EventTeaser[]
  stretch?: boolean
}) {
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
    <div className={`flex flex-col p-3 sm:p-4 ${stretch ? 'lg:min-h-0 lg:flex-1' : ''}`}>
      {/* Stacked below sm, so the height is split into an explicit image row and
          a text row rather than letting the teaser set it. From sm up the two
          sit side by side in equal columns, sharing one fixed row height. */}
      <div
        className={`grid h-104 grid-cols-1 grid-rows-[12rem_minmax(0,1fr)] gap-3 sm:grid-cols-2 sm:grid-rows-1 sm:gap-4 ${
          stretch
            ? 'sm:h-[260px] lg:h-auto lg:min-h-0 lg:flex-1'
            : // Roughly the height of the Films card's video tiles, so the two
              // sit level in the grid row instead of leaving it half empty.
              'sm:h-[160px]'
        }`}
      >
        <Link href={`/program/${current.id}`} className="block min-h-0 border-2 border-black">
          <img
            src={current.imageUrl}
            alt={current.title}
            className="h-full w-full object-cover"
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
