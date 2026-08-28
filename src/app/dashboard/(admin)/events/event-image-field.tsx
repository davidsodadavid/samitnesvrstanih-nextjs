'use client'

import { useRef, useState } from 'react'

/**
 * Upload slot for an event's own image.
 *
 * Not the shared ImagePicker: an event's image belongs to that event alone, so
 * there is no library to browse and nothing to reuse — just this event's file.
 */
export function EventImageField({ initialUrl }: { initialUrl?: string | null }) {
  const [preview, setPreview] = useState<string | null>(initialUrl ?? null)
  const [removed, setRemoved] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPreview((previous) => {
      // Only object URLs are ours to revoke; the initial one is a remote src.
      if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous)
      return URL.createObjectURL(file)
    })
    setRemoved(false)
  }

  function handleRemove() {
    if (inputRef.current) inputRef.current.value = ''
    setPreview((previous) => {
      if (previous?.startsWith('blob:')) URL.revokeObjectURL(previous)
      return null
    })
    setRemoved(true)
  }

  return (
    <div className="flex flex-wrap items-center gap-3">
      {/* Tells the server to drop the stored image when nothing new replaces it. */}
      <input type="hidden" name="remove_image" value={removed ? '1' : ''} />

      {preview ? (
        <img
          src={preview}
          alt=""
          className="h-20 w-28 rounded-lg border border-zinc-200 object-cover"
        />
      ) : (
        <div className="flex h-20 w-28 items-center justify-center rounded-lg border border-dashed border-zinc-300 text-xs text-zinc-400">
          none
        </div>
      )}

      <input
        ref={inputRef}
        type="file"
        name="image"
        accept="image/*"
        onChange={handleChange}
        className="hidden"
      />
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="cursor-pointer rounded-lg bg-zinc-900 px-3.5 py-1.5 text-sm font-semibold text-white hover:bg-zinc-700"
      >
        {preview ? 'Replace…' : 'Upload…'}
      </button>
      {preview && (
        <button
          type="button"
          onClick={handleRemove}
          className="cursor-pointer text-sm font-medium text-zinc-500 hover:underline"
        >
          Remove
        </button>
      )}
    </div>
  )
}
