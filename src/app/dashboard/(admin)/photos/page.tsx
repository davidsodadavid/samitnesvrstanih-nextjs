import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { deletePhoto, uploadPhoto } from './actions'

function inputClass() {
  return 'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'
}

export default async function PhotosPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const photos = await prisma.photo.findMany({ orderBy: { id: 'desc' } })

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Photos</h1>

      {error && (
        <p className="mb-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          File, author and date are all required.
        </p>
      )}

      <form
        action={uploadPhoto}
        className="mb-6 grid max-w-2xl gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <input
          type="file"
          name="file"
          accept="image/*"
          required
          className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold"
        />
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
            Author
            <input type="text" name="author" required className={inputClass()} />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
            Date taken
            <input type="date" name="date" required className={inputClass()} />
          </label>
        </div>
        <button
          type="submit"
          className="cursor-pointer justify-self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Upload photo
        </button>
      </form>

      {photos.length === 0 ? (
        <p className="py-5 text-sm text-zinc-500">No photos uploaded yet.</p>
      ) : (
        <div className="overflow-x-auto rounded-xl border border-zinc-200 bg-white">
          <table className="w-full border-collapse text-sm">
            <thead>
              <tr className="border-b border-zinc-200 text-left text-xs tracking-wide text-zinc-500 uppercase">
                <th className="px-3 py-2.5">Preview</th>
                <th className="px-3 py-2.5">Author</th>
                <th className="px-3 py-2.5">Date</th>
                <th className="px-3 py-2.5">File</th>
                <th className="px-3 py-2.5" />
              </tr>
            </thead>
            <tbody>
              {photos.map((photo) => (
                <tr key={photo.id} className="border-b border-zinc-100 last:border-none">
                  <td className="px-3 py-2">
                    <a href={photo.url} target="_blank" rel="noreferrer">
                      <img
                        src={photo.url}
                        alt={`Photo by ${photo.author}`}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    </a>
                  </td>
                  <td className="px-3 py-2">{photo.author}</td>
                  <td className="px-3 py-2">{photo.date.toISOString().slice(0, 10)}</td>
                  <td className="max-w-48 truncate px-3 py-2 text-zinc-500" title={photo.key}>
                    {photo.key.split('/').pop()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/photos/${photo.id}`}
                        className="font-medium text-zinc-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deletePhoto}>
                        <input type="hidden" name="id" value={photo.id} />
                        <button
                          type="submit"
                          className="cursor-pointer font-medium text-red-600 hover:underline"
                        >
                          Delete
                        </button>
                      </form>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </>
  )
}
