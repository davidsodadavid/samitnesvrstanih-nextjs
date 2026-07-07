import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { Empty, ErrorNote, PageHeader } from '../_components/list'
import { createSponsor, deleteSponsor, updateSponsor } from './actions'

const inputClass =
  'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const [sponsors, images] = await Promise.all([
    prisma.sponsor.findMany({ orderBy: { name: 'asc' }, include: { logo: true } }),
    prisma.image.findMany({ orderBy: { id: 'desc' } }),
  ])

  const logoOptions = images.map((image) => ({
    value: image.id,
    label: image.key.split('/').pop() ?? image.key,
  }))

  return (
    <>
      <PageHeader title="Sponsors" />
      <ErrorNote message={error ? 'Name and logo are both required.' : undefined} />

      {images.length === 0 ? (
        <p className="mb-6 max-w-xl text-sm text-zinc-600">
          Sponsors need a logo. Upload one under{' '}
          <Link href="/dashboard/images" className="font-semibold underline">
            Images
          </Link>{' '}
          first.
        </p>
      ) : (
        <form
          action={createSponsor}
          className="mb-6 flex max-w-2xl flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
        >
          <input
            type="text"
            name="name"
            placeholder="Sponsor name…"
            required
            className={`min-w-40 flex-1 ${inputClass}`}
          />
          <select name="logo_id" required defaultValue="" className={inputClass}>
            <option value="" disabled>
              — logo —
            </option>
            {logoOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Add
          </button>
        </form>
      )}

      {sponsors.length === 0 ? (
        <Empty>No sponsors yet.</Empty>
      ) : (
        <div className="flex max-w-2xl flex-col gap-2">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <img
                src={sponsor.logo.url}
                alt={`${sponsor.name} logo`}
                className="h-10 w-14 shrink-0 rounded-md object-contain"
              />
              <form
                action={updateSponsor}
                className="flex flex-1 flex-wrap items-center gap-3"
              >
                <input type="hidden" name="id" value={sponsor.id} />
                <input
                  type="text"
                  name="name"
                  defaultValue={sponsor.name}
                  required
                  className={`min-w-36 flex-1 ${inputClass}`}
                />
                <select
                  name="logo_id"
                  defaultValue={sponsor.logo_id}
                  required
                  className={inputClass}
                >
                  {logoOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                <button
                  type="submit"
                  className="cursor-pointer text-sm font-medium text-zinc-600 hover:underline"
                >
                  Save
                </button>
              </form>
              <form action={deleteSponsor}>
                <input type="hidden" name="id" value={sponsor.id} />
                <button
                  type="submit"
                  className="cursor-pointer text-sm font-medium text-red-600 hover:underline"
                >
                  Delete
                </button>
              </form>
            </div>
          ))}
        </div>
      )}
    </>
  )
}
