'use client'

import { useEffect, useState } from 'react'
import type { FilmVideo } from './get-film-videos'
import { youTubeEmbedUrl, youTubeThumbnailUrl } from '@/lib/youtube'

const ROTATE_MS = 6000
const PER_PAGE = 2

/**
 * Shows two film videos at a time, cycling through the set.
 *
 * Each tile starts as YouTube's own thumbnail with a play button rather than a
 * live <iframe>: two players would pull in a megabyte of YouTube script before
 * anyone asks for a video. Clicking swaps in the real embed, already playing.
 */
export function VideoRotator({ items }: { items: FilmVideo[] }) {
  const pageCount = Math.max(1, Math.ceil(items.length / PER_PAGE))
  const [page, setPage] = useState(0)
  const [playing, setPlaying] = useState<number | null>(null)

  useEffect(() => {
    if (pageCount < 2) return
    const timer = setInterval(() => setPage((p) => (p + 1) % pageCount), ROTATE_MS)
    return () => clearInterval(timer)
  }, [pageCount])

  // Rotating away from a playing video would leave it running unseen.
  useEffect(() => setPlaying(null), [page])

  if (items.length === 0) return null

  // Wraps around so the final page is always full rather than leaving a gap
  // when the count is odd.
  const visible = Array.from(
    { length: Math.min(PER_PAGE, items.length) },
    (_, i) => items[(page * PER_PAGE + i) % items.length],
  )

  return (
    <div className="flex flex-col p-3 sm:p-4">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 sm:gap-4">
        {visible.map((video, i) => (
          // The children are pinned to this frame rather than flowing inside
          // it: as a plain block its height is only implied by aspect-ratio, so
          // a percentage height on the button resolves to auto and the 4:3
          // thumbnail ends up setting the box's height instead.
          <div
            key={`${page}-${i}-${video.id}`}
            className="relative aspect-video min-w-0 bg-black"
          >
            {playing === video.id ? (
              <iframe
                src={youTubeEmbedUrl(video.videoId)}
                title={video.title}
                allow="autoplay; encrypted-media; picture-in-picture"
                allowFullScreen
                className="absolute inset-0 h-full w-full border-0"
              />
            ) : (
              <button
                type="button"
                onClick={() => setPlaying(video.id)}
                aria-label={`Play ${video.title}`}
                className="group absolute inset-0 cursor-pointer"
              >
                {/* hqdefault is 4:3 with bars; cover crops them to 16:9. */}
                <img
                  src={youTubeThumbnailUrl(video.videoId)}
                  alt=""
                  className="h-full w-full object-cover"
                />
                <span className="absolute inset-0 flex items-center justify-center">
                  <span className="flex h-8 w-12 items-center justify-center rounded-lg bg-[#f00] transition-transform group-hover:scale-110 sm:h-9 sm:w-14">
                    <span className="ml-0.5 border-y-[7px] border-l-[12px] border-y-transparent border-l-white" />
                  </span>
                </span>
              </button>
            )}
          </div>
        ))}
      </div>

      {pageCount > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {Array.from({ length: pageCount }, (_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setPage(i)}
              aria-label={`Show videos page ${i + 1}`}
              aria-current={i === page}
              className={`h-2 w-2 cursor-pointer rounded-full border border-white ${
                i === page ? 'bg-white' : 'bg-transparent'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  )
}
