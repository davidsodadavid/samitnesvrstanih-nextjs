'use client'

import { useCallback, useEffect, useState } from 'react'

export type LightboxImage = { url: string; author?: string | null }

/** Full-screen image viewer: backdrop/✕/Esc closes, arrows (buttons or keys) navigate. */
export function Lightbox({
  images,
  index,
  onClose,
  onIndexChange,
}: {
  images: LightboxImage[]
  index: number
  onClose: () => void
  onIndexChange: (index: number) => void
}) {
  const count = images.length
  const prev = useCallback(
    () => onIndexChange((index - 1 + count) % count),
    [onIndexChange, index, count],
  )
  const next = useCallback(() => onIndexChange((index + 1) % count), [onIndexChange, index, count])

  useEffect(() => {
    function onKeyDown(event: KeyboardEvent) {
      if (event.key === 'Escape') onClose()
      else if (event.key === 'ArrowLeft' && count > 1) prev()
      else if (event.key === 'ArrowRight' && count > 1) next()
    }
    document.addEventListener('keydown', onKeyDown)
    // lock page scroll while the viewer is open
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      document.removeEventListener('keydown', onKeyDown)
      document.body.style.overflow = previousOverflow
    }
  }, [onClose, prev, next, count])

  const image = images[index]
  if (!image) return null

  const navButtonClass =
    'absolute top-1/2 -translate-y-1/2 cursor-pointer rounded-full bg-black/50 px-3.5 py-2 text-2xl leading-none text-white hover:bg-black/70'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4"
      onClick={onClose}
    >
      <button
        type="button"
        onClick={onClose}
        aria-label="Close"
        className="absolute top-4 right-4 cursor-pointer rounded-full bg-black/50 px-3 py-1.5 text-xl leading-none text-white hover:bg-black/70"
      >
        ✕
      </button>
      <figure
        className="flex max-h-full max-w-full flex-col items-center gap-3"
        onClick={(event) => event.stopPropagation()}
      >
        <img
          src={image.url}
          alt={image.author ? `Photo by ${image.author}` : 'Photo'}
          className="max-h-[85vh] max-w-[90vw] rounded-lg object-contain"
        />
        {image.author && (
          <figcaption className="text-sm text-zinc-300">Photo by {image.author}</figcaption>
        )}
      </figure>
      {count > 1 && (
        <>
          <button
            type="button"
            aria-label="Previous"
            onClick={(event) => {
              event.stopPropagation()
              prev()
            }}
            className={`${navButtonClass} left-4`}
          >
            ‹
          </button>
          <button
            type="button"
            aria-label="Next"
            onClick={(event) => {
              event.stopPropagation()
              next()
            }}
            className={`${navButtonClass} right-4`}
          >
            ›
          </button>
        </>
      )}
    </div>
  )
}

/** Thumbnail grid whose images open in the lightbox (used on post and DIY pages). */
export function PhotoGrid({
  photos,
}: {
  photos: { id: number; url: string; author: string | null }[]
}) {
  const [openIndex, setOpenIndex] = useState<number | null>(null)
  if (photos.length === 0) return null

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
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
              className="h-40 w-full rounded-lg object-cover"
            />
          </button>
        ))}
      </div>
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

/** Single image (post thumbnail, event image) that opens in the lightbox on click. */
export function ZoomableImage({ src, className }: { src: string; className?: string }) {
  const [open, setOpen] = useState(false)
  return (
    <>
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="block w-full cursor-zoom-in"
      >
        <img src={src} alt="" className={className} />
      </button>
      {open && (
        <Lightbox
          images={[{ url: src }]}
          index={0}
          onClose={() => setOpen(false)}
          onIndexChange={() => {}}
        />
      )}
    </>
  )
}
