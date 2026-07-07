import { prisma } from '@/lib/prisma'
import { Empty, ErrorNote, PageHeader } from '../_components/list'
import { ImagePicker } from '../_components/media-picker'
import { createSponsor, deleteSponsor, updateSponsor } from './actions'

const inputClass =
  'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

export default async function SponsorsPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { name: 'asc' },
    include: { logo: true },
  })

  return (
    <>
      <PageHeader title="Sponsors" />
      <ErrorNote message={error ? 'Name and logo are both required.' : undefined} />

      <form
        action={createSponsor}
        className="mb-6 flex max-w-2xl flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <ImagePicker name="logo_id" required compact />
        <input
          type="text"
          name="name"
          placeholder="Sponsor name…"
          required
          className={`min-w-40 flex-1 ${inputClass}`}
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Add
        </button>
      </form>

      {sponsors.length === 0 ? (
        <Empty>No sponsors yet.</Empty>
      ) : (
        <div className="flex max-w-2xl flex-col gap-2">
          {sponsors.map((sponsor) => (
            <div
              key={sponsor.id}
              className="flex flex-wrap items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
            >
              <form
                action={updateSponsor}
                className="flex min-w-0 flex-1 flex-wrap items-center gap-3"
              >
                <input type="hidden" name="id" value={sponsor.id} />
                <ImagePicker name="logo_id" initial={sponsor.logo} required compact />
                <input
                  type="text"
                  name="name"
                  defaultValue={sponsor.name}
                  required
                  className={`min-w-36 flex-1 ${inputClass}`}
                />
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
