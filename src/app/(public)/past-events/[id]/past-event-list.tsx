'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { DashedLine } from '../../_components/dashed-line'
import { fetchPastEvents, type PastEventPage } from './actions'

export function PastEventList({
  eventTypeId,
  initial,
}: {
  eventTypeId: number
  initial: PastEventPage
}) {
  const [events, setEvents] = useState(initial.items)
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
        fetchPastEvents(eventTypeId, nextCursor)
          .then((page) => {
            setEvents((prev) => [...prev, ...page.items])
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
  }, [eventTypeId, nextCursor])

  if (events.length === 0) {
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
      {events.map((event, i) => (
        <div key={event.id}>
          {i > 0 && <DashedLine />}
          <Link
            href={`/program/${event.id}`}
            className="flex flex-wrap items-baseline justify-between gap-4 bg-black px-4 py-3 hover:bg-zinc-800"
          >
            <span className="font-headline text-xl font-bold text-white uppercase sm:text-2xl">
              {event.title}
            </span>
            <span className="font-body text-right text-sm text-white sm:text-base">
              {event.dateLabel}
              <br />
              {event.timeLabel} · {event.location}
            </span>
          </Link>
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
