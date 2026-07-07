'use client'

import { useCallback, useRef, useState } from 'react'
import { fetchImagesPage, fetchPhotosPage, uploadPickerImage } from './media-actions'
import type { ImageItem, Page, PhotoItem } from './media-types'

function useMediaPages<T extends { id: number }>(
  fetchPage: (cursor?: number) => Promise<Page<T>>,
) {
  const [items, setItems] = useState<T[]>([])
  const [nextCursor, setNextCursor] = useState<number | null>(null)
  const [loading, setLoading] = useState(false)
  const startedRef = useRef(false)

  const loadMore = useCallback(
    async (cursor?: number) => {
      setLoading(true)
      try {
        const page = await fetchPage(cursor)
        setItems((prev) => (cursor === undefined ? page.items : [...prev, ...page.items]))
        setNextCursor(page.nextCursor)
      } finally {
        setLoading(false)
      }
    },
    [fetchPage],
  )

  // Called from the button that opens the modal — fetches the first page once
  const ensureLoaded = useCallback(() => {
    if (startedRef.current) return
    startedRef.current = true
    void loadMore()
  }, [loadMore])

  const prepend = useCallback((item: T) => {
    setItems((prev) => [item, ...prev])
  }, [])

  return { items, nextCursor, loading, loadMore, ensureLoaded, prepend }
}

function Modal({
  title,
  onClose,
  children,
  footer,
}: {
  title: string
  onClose: () => void
  children: React.ReactNode
  footer?: React.ReactNode
}) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3 sm:p-6"
      onClick={onClose}
    >
      <div
        className="flex max-h-[85vh] w-full max-w-3xl flex-col rounded-xl bg-white shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        <div className="flex items-center justify-between border-b border-zinc-200 px-5 py-3">
          <h2 className="text-base font-bold">{title}</h2>
          <button
            type="button"
            onClick={onClose}
            className="cursor-pointer rounded-md px-2 py-1 text-sm font-semibold text-zinc-500 hover:bg-zinc-100"
          >
            ✕ Close
          </button>
        </div>
        <div className="flex-1 overflow-y-auto p-4 sm:p-5">{children}</div>
        {footer && <div className="border-t border-zinc-200 px-5 py-3">{footer}</div>}
      </div>
    </div>
  )
}

function LoadMore({
  nextCursor,
  loading,
  onLoadMore,
  itemCount,
}: {
  nextCursor: number | null
  loading: boolean
  onLoadMore: () => void
  itemCount: number
}) {
  if (loading && itemCount === 0) {
    return <p className="py-6 text-center text-sm text-zinc-500">Loading…</p>
  }
  if (itemCount === 0) {
    return <p className="py-6 text-center text-sm text-zinc-500">Nothing uploaded yet.</p>
  }
  if (nextCursor === null) return null
  return (
    <div className="pt-4 text-center">
      <button
        type="button"
        onClick={onLoadMore}
        disabled={loading}
        className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50 disabled:opacity-50"
      >
        {loading ? 'Loading…' : 'Load more'}
      </button>
    </div>
  )
}

/**
 * Single-select image picker: preview + button that opens a paginated modal grid.
 * `compact` collapses the trigger to thumbnail + "Change" so it fits inline rows;
 * the upload option moves into the modal footer.
 */
export function ImagePicker({
  name,
  initial,
  required = false,
  compact = false,
}: {
  name: string
  initial?: ImageItem | null
  required?: boolean
  compact?: boolean
}) {
  const [selected, setSelected] = useState<ImageItem | null>(initial ?? null)
  const [open, setOpen] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { items, nextCursor, loading, loadMore, ensureLoaded, prepend } =
    useMediaPages(fetchImagesPage)

  const openModal = () => {
    ensureLoaded()
    setOpen(true)
  }

  async function handleUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    event.target.value = ''
    if (!file) return
    setUploading(true)
    try {
      const formData = new FormData()
      formData.set('file', file)
      const image = await uploadPickerImage(formData)
      prepend(image)
      setSelected(image)
      setOpen(false)
    } catch {
      window.alert('Upload failed — check the file and try again.')
    } finally {
      setUploading(false)
    }
  }

  const thumbnail = selected ? (
    <img
      src={selected.url}
      alt={selected.key}
      className="h-14 w-20 rounded-lg border border-zinc-200 object-cover"
    />
  ) : (
    <div className="flex h-14 w-20 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-400">
      none
    </div>
  )

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input type="hidden" name={name} value={selected?.id ?? ''} required={required} />
      {compact ? (
        <button type="button" onClick={openModal} className="cursor-pointer">
          {thumbnail}
        </button>
      ) : (
        thumbnail
      )}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleUpload}
        className="hidden"
      />
      {compact ? (
        <button
          type="button"
          onClick={openModal}
          className="cursor-pointer text-sm font-medium text-zinc-600 hover:underline"
        >
          {selected ? 'Change' : 'Choose…'}
        </button>
      ) : (
        <>
          <button
            type="button"
            disabled={uploading}
            onClick={() => fileInputRef.current?.click()}
            className="cursor-pointer rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
          >
            {uploading ? 'Uploading…' : 'Upload…'}
          </button>
          <button
            type="button"
            onClick={openModal}
            className="cursor-pointer rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-50"
          >
            Choose from gallery…
          </button>
        </>
      )}
      {selected && !required && (
        <button
          type="button"
          onClick={() => setSelected(null)}
          className="cursor-pointer text-sm font-medium text-zinc-500 hover:underline"
        >
          Remove
        </button>
      )}

      {open && (
        <Modal
          title="Choose an image"
          onClose={() => setOpen(false)}
          footer={
            compact ? (
              <button
                type="button"
                disabled={uploading}
                onClick={() => fileInputRef.current?.click()}
                className="cursor-pointer rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-zinc-700 disabled:opacity-50"
              >
                {uploading ? 'Uploading…' : 'Upload new…'}
              </button>
            ) : undefined
          }
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
            {items.map((image) => (
              <button
                key={image.id}
                type="button"
                onClick={() => {
                  setSelected(image)
                  setOpen(false)
                }}
                title={image.key}
                className={`cursor-pointer overflow-hidden rounded-lg border-2 ${
                  selected?.id === image.id
                    ? 'border-blue-600'
                    : 'border-transparent hover:border-zinc-300'
                }`}
              >
                <img src={image.url} alt={image.key} className="h-24 w-full object-cover" />
              </button>
            ))}
          </div>
          <LoadMore
            nextCursor={nextCursor}
            loading={loading}
            itemCount={items.length}
            onLoadMore={() => void loadMore(nextCursor ?? undefined)}
          />
        </Modal>
      )}
    </div>
  )
}

/** Multi-select photo picker: selected grid + paginated modal for adding/removing. */
export function PhotoMultiPicker({
  name = 'photo_ids',
  initialSelected = [],
}: {
  name?: string
  initialSelected?: PhotoItem[]
}) {
  const [selected, setSelected] = useState<PhotoItem[]>(initialSelected)
  const [open, setOpen] = useState(false)
  const { items, nextCursor, loading, loadMore, ensureLoaded } = useMediaPages(fetchPhotosPage)

  const openModal = () => {
    ensureLoaded()
    setOpen(true)
  }

  const toggle = (photo: PhotoItem) =>
    setSelected((prev) =>
      prev.some((p) => p.id === photo.id)
        ? prev.filter((p) => p.id !== photo.id)
        : [...prev, photo],
    )

  return (
    <div className="flex flex-col gap-2.5">
      {selected.map((photo) => (
        <input key={photo.id} type="hidden" name={name} value={photo.id} />
      ))}

      {selected.length === 0 ? (
        <p className="text-sm font-normal text-zinc-500">No photos selected.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(6.5rem,1fr))] gap-2.5">
          {selected.map((photo) => (
            <div key={photo.id} className="group relative" title={photo.author ?? undefined}>
              <img
                src={photo.url}
                alt={photo.author ? `Photo by ${photo.author}` : 'Photo'}
                className="h-20 w-full rounded-lg object-cover"
              />
              <button
                type="button"
                onClick={() => toggle(photo)}
                className="absolute top-1 right-1 flex h-6 w-6 cursor-pointer items-center justify-center rounded-full bg-black/60 text-xs text-white md:hidden md:group-hover:flex"
                aria-label="Remove photo"
              >
                ✕
              </button>
            </div>
          ))}
        </div>
      )}

      <button
        type="button"
        onClick={openModal}
        className="cursor-pointer self-start rounded-lg border border-zinc-300 px-3 py-1.5 text-sm font-semibold hover:bg-zinc-50"
      >
        {selected.length > 0 ? `Add / remove photos (${selected.length} selected)…` : 'Pick photos…'}
      </button>

      {open && (
        <Modal
          title="Pick photos"
          onClose={() => setOpen(false)}
          footer={
            <div className="flex items-center justify-between">
              <span className="text-sm text-zinc-500">{selected.length} selected</span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
              >
                Done
              </button>
            </div>
          }
        >
          <div className="grid grid-cols-[repeat(auto-fill,minmax(8rem,1fr))] gap-3">
            {items.map((photo) => {
              const isSelected = selected.some((p) => p.id === photo.id)
              return (
                <button
                  key={photo.id}
                  type="button"
                  onClick={() => toggle(photo)}
                  title={photo.author ?? undefined}
                  className={`relative cursor-pointer overflow-hidden rounded-lg border-2 ${
                    isSelected ? 'border-blue-600' : 'border-transparent hover:border-zinc-300'
                  }`}
                >
                  <img
                    src={photo.url}
                    alt={photo.author ? `Photo by ${photo.author}` : 'Photo'}
                    className="h-24 w-full object-cover"
                  />
                  {isSelected && (
                    <span className="absolute top-1 right-1 flex h-6 w-6 items-center justify-center rounded-full bg-blue-600 text-xs text-white">
                      ✓
                    </span>
                  )}
                </button>
              )
            })}
          </div>
          <LoadMore
            nextCursor={nextCursor}
            loading={loading}
            itemCount={items.length}
            onLoadMore={() => void loadMore(nextCursor ?? undefined)}
          />
        </Modal>
      )}
    </div>
  )
}
