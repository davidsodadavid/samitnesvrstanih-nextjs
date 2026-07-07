import { prisma } from '@/lib/prisma'
import { deleteImage, uploadImage } from './actions'

const errors: Record<string, string> = {
  'no-file': 'Pick a file to upload first.',
  'in-use': 'This image is used as a sponsor logo — remove it there first.',
}

export default async function ImagesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const images = await prisma.image.findMany({ orderBy: { id: 'desc' } })

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Images</h1>
      <p className="mb-4 max-w-2xl text-sm text-zinc-500">
        Utility images: post thumbnails, event images and sponsor logos. For gallery/content
        photos with an author, use <b>Photos</b> instead.
      </p>

      {error && (
        <p className="mb-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          {errors[error] ?? 'Something went wrong.'}
        </p>
      )}

      <form
        action={uploadImage}
        className="mb-6 flex max-w-2xl flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="min-w-0 flex-1 text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold"
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Upload
        </button>
      </form>

      {images.length === 0 ? (
        <p className="py-5 text-sm text-zinc-500">No images uploaded yet.</p>
      ) : (
        <div className="grid grid-cols-[repeat(auto-fill,minmax(11rem,1fr))] gap-3.5">
          {images.map((image) => (
            <div
              key={image.id}
              className="overflow-hidden rounded-xl border border-zinc-200 bg-white"
            >
              <a href={image.url} target="_blank" rel="noreferrer">
                <img src={image.url} alt={image.key} className="h-28 w-full object-cover" />
              </a>
              <div className="flex items-center justify-between gap-2 px-3 py-2">
                <p className="truncate text-xs text-zinc-500" title={image.key}>
                  {image.key.split('/').pop()}
                </p>
                <form action={deleteImage}>
                  <input type="hidden" name="id" value={image.id} />
                  <button
                    type="submit"
                    className="cursor-pointer text-xs font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              </div>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
