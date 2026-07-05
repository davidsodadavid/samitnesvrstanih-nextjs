import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../_components/list'
import { createEventType, deleteEventType, renameEventType } from './actions'

const errors: Record<string, string> = {
  'missing-name': 'Name is required.',
  'in-use': 'This type is used by events — reassign them first.',
}

const inputClass =
  'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

export default async function EventTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } } },
  })

  return (
    <>
      <PageHeader title="Event types" />
      <ErrorNote message={error ? (errors[error] ?? 'Something went wrong.') : undefined} />

      <form
        action={createEventType}
        className="mb-6 flex max-w-xl items-center gap-3 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <input
          type="text"
          name="name"
          placeholder="New event type…"
          required
          className={`flex-1 ${inputClass}`}
        />
        <button
          type="submit"
          className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
        >
          Add
        </button>
      </form>

      <div className="flex max-w-xl flex-col gap-2">
        {eventTypes.length === 0 && (
          <p className="py-5 text-sm text-zinc-500">No event types yet.</p>
        )}
        {eventTypes.map((eventType) => (
          <div
            key={eventType.id}
            className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-white px-4 py-3"
          >
            <form action={renameEventType} className="flex flex-1 items-center gap-3">
              <input type="hidden" name="id" value={eventType.id} />
              <input
                type="text"
                name="name"
                defaultValue={eventType.name}
                required
                className={`flex-1 ${inputClass}`}
              />
              <button
                type="submit"
                className="cursor-pointer text-sm font-medium text-zinc-600 hover:underline"
              >
                Rename
              </button>
            </form>
            <span className="text-xs text-zinc-400">{eventType._count.events} events</span>
            <form action={deleteEventType}>
              <input type="hidden" name="id" value={eventType.id} />
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
    </>
  )
}
