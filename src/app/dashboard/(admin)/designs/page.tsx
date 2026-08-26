import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Pagination } from '../_components/list'
import { deleteDesign, uploadDesign } from './actions'

const PAGE_SIZE = 30

function inputClass() {
  return 'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'
}

export default async function DesignsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string; page?: string }>
}) {
  const { error, page: pageParam } = await searchParams
  const total = await prisma.design.count()
  const pageCount = Math.max(1, Math.ceil(total / PAGE_SIZE))
  const page = Math.min(Math.max(1, Number(pageParam) || 1), pageCount)
  const designs = await prisma.design.findMany({
    orderBy: { id: 'desc' },
    skip: (page - 1) * PAGE_SIZE,
    take: PAGE_SIZE,
  })

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Designs</h1>

      {error && (
        <p className="mb-4 max-w-2xl rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
          Pick a file to upload first.
        </p>
      )}

      <form
        action={uploadDesign}
        className="mb-6 grid max-w-2xl gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <input
          type="file"
          name="file"
          accept="image/*"
          multiple
          required
          className="text-sm file:mr-3 file:cursor-pointer file:rounded-lg file:border file:border-zinc-300 file:bg-white file:px-3 file:py-1.5 file:text-sm file:font-semibold"
        />
        <p className="text-xs text-zinc-500">
          Select multiple files to upload them all at once — author and date only apply when
          uploading a single design.
        </p>
        <div className="flex flex-col gap-3 sm:flex-row">
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
            Author (optional)
            <input type="text" name="author" className={inputClass()} />
          </label>
          <label className="flex flex-1 flex-col gap-1.5 text-sm font-semibold">
            Date (optional)
            <input type="date" name="date" className={inputClass()} />
          </label>
        </div>
        <button
          type="submit"
          className="cursor-pointer justify-self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Upload design(s)
        </button>
      </form>

      {designs.length === 0 ? (
        <p className="py-5 text-sm text-zinc-500">No designs uploaded yet.</p>
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
              {designs.map((design) => (
                <tr key={design.id} className="border-b border-zinc-100 last:border-none">
                  <td className="px-3 py-2">
                    <a href={design.url} target="_blank" rel="noreferrer">
                      <img
                        src={design.url}
                        alt={design.author ? `Design by ${design.author}` : 'Design'}
                        className="h-10 w-14 rounded-md object-cover"
                      />
                    </a>
                  </td>
                  <td className="px-3 py-2">
                    {design.author ?? <span className="text-zinc-400">—</span>}
                  </td>
                  <td className="px-3 py-2">
                    {design.date ? (
                      design.date.toISOString().slice(0, 10)
                    ) : (
                      <span className="text-zinc-400">—</span>
                    )}
                  </td>
                  <td className="max-w-48 truncate px-3 py-2 text-zinc-500" title={design.key}>
                    {design.key.split('/').pop()}
                  </td>
                  <td className="px-3 py-2">
                    <div className="flex items-center justify-end gap-3">
                      <Link
                        href={`/dashboard/designs/${design.id}`}
                        className="font-medium text-zinc-600 hover:underline"
                      >
                        Edit
                      </Link>
                      <form action={deleteDesign}>
                        <input type="hidden" name="id" value={design.id} />
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
      <Pagination page={page} pageCount={pageCount} basePath="/dashboard/designs" />
    </>
  )
}
