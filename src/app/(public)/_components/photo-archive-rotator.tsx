'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { ArchivePhoto } from './get-archive-photos'

const ROTATE_MS = 4000
const SLIDE_MS = 700
// Tiles visible at the widest breakpoint; --per below narrows it for small screens.
const VISIBLE = 5

/**
 * Archive photos on a sliding strip. Advancing by one tile at a time (rather
 * than swapping a whole page of images) means every photo comes around even at
 * the narrow breakpoints that only show two of them.
 *
 * The strip is `photos` plus a clone of its first tiles: it slides one tile past
 * the end into the clones, then snaps back to the real start without animating,
 * so the loop has no visible seam.
 */
export function PhotoArchiveRotator({ photos }: { photos: ArchivePhoto[] }) {
  const rotates = photos.length > VISIBLE
  const [index, setIndex] = useState(0)
  const [paused, setPaused] = useState(false)
  const viewportRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  // Set when the next move is the wrap-around, which has to be instant.
  const snapRef = useRef(false)

  // The strip is scrolled rather than transformed. Tile widths come from
  // container-query units, and Chrome refuses to transition a transform whose
  // value depends on those — it holds the identity matrix and never moves.
  // Scrolling sidesteps the issue and gets smooth behaviour from CSS for free.
  function scrollToIndex(i: number, smooth: boolean) {
    const viewport = viewportRef.current
    const tile = trackRef.current?.children[i] as HTMLElement | undefined
    if (!viewport || !tile) return

    // Measured off rects rather than offsetLeft: the viewport isn't positioned,
    // so offsetLeft would be relative to whatever ancestor happens to be.
    const left =
      tile.getBoundingClientRect().left -
      viewport.getBoundingClientRect().left +
      viewport.scrollLeft

    const previous = viewport.style.scrollBehavior
    if (!smooth) viewport.style.scrollBehavior = 'auto'
    viewport.scrollTo({ left })
    if (!smooth) viewport.style.scrollBehavior = previous
  }

  useEffect(() => {
    if (!rotates || paused) return
    const timer = setInterval(() => setIndex((i) => i + 1), ROTATE_MS)
    return () => clearInterval(timer)
  }, [rotates, paused])

  useEffect(() => {
    const viewport = viewportRef.current
    if (!viewport) return

    const snap = snapRef.current
    snapRef.current = false
    scrollToIndex(index, !snap)

    // Tiles are sized relative to the card, so a resize moves the pixel offset
    // the current tile sits at. The first callback fires on observe and would
    // cut the scroll above short, so it's skipped.
    let initial = true
    const observer = new ResizeObserver(() => {
      if (initial) {
        initial = false
        return
      }
      scrollToIndex(index, false)
    })
    observer.observe(viewport)
    return () => observer.disconnect()
  }, [index])

  // Reached the cloned tiles — let the slide finish, then jump back to the real
  // first tile, which looks identical.
  useEffect(() => {
    if (index !== photos.length) return
    const timer = setTimeout(() => {
      snapRef.current = true
      setIndex(0)
    }, SLIDE_MS)
    return () => clearTimeout(timer)
  }, [index, photos.length])

  if (photos.length === 0) return null

  const track = rotates ? [...photos, ...photos.slice(0, VISIBLE)] : photos

  return (
    <div className="px-2 pb-2 sm:px-3 sm:pb-3">
      <div
        ref={viewportRef}
        // Hovering holds the strip still so it can be read, and stops the timer
        // yanking it back mid-swipe. Touch is left alone: a tap fires
        // pointerenter with no matching leave, which would pause it for good.
        onPointerEnter={(e) => {
          if (e.pointerType === 'mouse') setPaused(true)
        }}
        onPointerLeave={() => setPaused(false)}
        // A real scroll container with the scrollbar hidden, not overflow-hidden:
        // Chrome skips smooth scrolling entirely on overflow-hidden elements
        // (instant scrolls still land, animated ones are dropped). The side
        // benefit is that the strip can be swiped by hand on touch screens.
        className="overflow-x-auto overflow-y-hidden overscroll-x-contain scroll-smooth [--gap:0.5rem] [--per:2] [scrollbar-width:none] motion-reduce:scroll-auto sm:[--gap:0.75rem] sm:[--per:3] lg:[--per:5] [&::-webkit-scrollbar]:hidden"
        style={
          {
            // Tiles are sized off the card's own width rather than the
            // viewport's, so the strip stays exact inside whatever column the
            // card ends up in.
            containerType: 'inline-size',
            '--tile': 'calc((100cqw - (var(--per) - 1) * var(--gap)) / var(--per))',
          } as React.CSSProperties
        }
      >
        <div ref={trackRef} className="flex h-40 sm:h-[240px]" style={{ gap: 'var(--gap)' }}>
          {track.map((photo, i) => (
            <Link
              key={`${i}-${photo.id}`}
              href={`/galleries/${photo.year}`}
              aria-hidden={i >= photos.length}
              tabIndex={i >= photos.length ? -1 : undefined}
              // Fixed tile widths only matter while sliding; a short strip
              // stretches to fill the row instead of leaving dead space.
              className={`border-2 border-black ${
                rotates ? 'w-[var(--tile)] shrink-0' : 'min-w-0 flex-1'
              }`}
            >
              <img
                src={photo.url}
                alt={photo.author ? `Photo by ${photo.author}` : `Photo from ${photo.year}`}
                className="h-full w-full object-cover"
              />
            </Link>
          ))}
        </div>
      </div>

      {rotates && (
        <div className="mt-2 flex flex-wrap justify-center gap-2 sm:mt-3">
          {photos.map((photo, i) => (
            <button
              key={photo.id}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1}`}
              aria-current={i === index % photos.length}
              className={`h-2 w-2 cursor-pointer rounded-full border border-black ${
                i === index % photos.length ? 'bg-black' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
