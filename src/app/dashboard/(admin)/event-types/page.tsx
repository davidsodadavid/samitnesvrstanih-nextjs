import { prisma } from '@/lib/prisma'
import { ErrorNote, PageHeader } from '../_components/list'
import { ImagePicker } from '../_components/media-picker'
import { isHomepageEventType } from '@/lib/homepage-event-types'
import { createEventType, deleteEventType, updateEventType } from './actions'

const errors: Record<string, string> = {
  'missing-name': 'Name is required.',
  'in-use': 'This type is used by events — reassign them first.',
  locked: 'This type has its own section on the homepage — it can be restyled, but not renamed or deleted.',
}

const inputClass =
  'rounded-lg border border-zinc-300 px-3 py-2 text-sm outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

const swatchClass =
  'h-9 w-9 shrink-0 cursor-pointer rounded-lg border border-zinc-300 p-0.5'

// The two pickers are otherwise identical thumbnails, so each is labelled.
function PickerField({
  label,
  name,
  initial,
}: {
  label: string
  name: string
  initial?: React.ComponentProps<typeof ImagePicker>['initial']
}) {
  return (
    <div className="flex min-w-56 flex-col gap-2">
      <span className="text-xs font-semibold text-zinc-700">{label}</span>
      <ImagePicker name={name} initial={initial} compact />
    </div>
  )
}

export default async function EventTypesPage({
  searchParams,
}: {
  searchParams: Promise<{ error?: string }>
}) {
  const { error } = await searchParams
  const eventTypes = await prisma.eventType.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { events: true } }, icon: true, art: true },
  })

  return (
    <>
      <PageHeader title="Event types" />
      <ErrorNote message={error ? (errors[error] ?? 'Something went wrong.') : undefined} />

      <p className="mb-4 max-w-3xl text-sm text-zinc-500">
          Dev note:
          <br />
          Name should be plural, art is an icon that goes on the side and art is that wide banner that goes right below it
          <br />
          There are 3 pre-defined event-types that we use on the Homepage, they are not able to be renamed/deleted (diy, films, exhibitions)
      </p>

      <form
        action={createEventType}
        className="mb-6 flex max-w-3xl flex-col gap-4 rounded-xl border border-zinc-200 bg-white p-4"
      >
        <div className="flex flex-wrap items-center gap-3">
          <input
            type="color"
            name="color"
            defaultValue="#3b82f6"
            title="Colour for map pins and the homepage card"
            className={swatchClass}
          />
          <input
            type="text"
            name="name"
            placeholder="New event type…"
            required
            className={`min-w-40 flex-1 ${inputClass}`}
          />
          <button
            type="submit"
            className="cursor-pointer rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Add
          </button>
        </div>
        <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-100 pt-4">
          <PickerField label="Icon" name="icon_id" />
          <PickerField label="Art" name="art_id" />
        </div>
      </form>

      <div className="flex max-w-3xl flex-col gap-3">
        {eventTypes.length === 0 && (
          <p className="py-5 text-sm text-zinc-500">No event types yet.</p>
        )}
        {eventTypes.map((eventType) => {
          const locked = isHomepageEventType(eventType.name)
          return (
          <div
            key={eventType.id}
            className="flex items-start gap-4 rounded-xl border border-zinc-200 bg-white p-4"
          >
            <form action={updateEventType} className="flex min-w-0 flex-1 flex-col gap-4">
              <input type="hidden" name="id" value={eventType.id} />
              <div className="flex flex-wrap items-center gap-3">
                <input
                  type="color"
                  name="color"
                  defaultValue={eventType.color}
                  title="Colour for map pins and the homepage card"
                  className={swatchClass}
                />
                <input
                  type="text"
                  name="name"
                  defaultValue={eventType.name}
                  required
                  // readOnly rather than disabled, so the value still posts.
                  readOnly={locked}
                  title={locked ? 'Renaming would empty this type’s homepage section' : undefined}
                  className={`min-w-36 flex-1 ${inputClass} ${
                    locked ? 'cursor-not-allowed bg-zinc-50 text-zinc-500' : ''
                  }`}
                />
                <button
                  type="submit"
                  className="cursor-pointer rounded-lg border border-zinc-300 px-4 py-2 text-sm font-semibold hover:bg-zinc-50"
                >
                  Save
                </button>
              </div>
              <div className="flex flex-wrap gap-x-10 gap-y-4 border-t border-zinc-100 pt-4">
                <PickerField label="Icon" name="icon_id" initial={eventType.icon} />
                <PickerField label="Art" name="art_id" initial={eventType.art} />
              </div>
            </form>

            {/* Outside the update form — forms can't nest. */}
            <div className="flex shrink-0 flex-col items-end gap-2">
              <span className="text-xs whitespace-nowrap text-zinc-400">
                {eventType._count.events} events
              </span>
              {locked ? (
                <span
                  className="text-xs whitespace-nowrap text-zinc-400"
                  title="Renaming or deleting this type would empty its homepage section"
                >
                  🔒 On homepage
                </span>
              ) : (
                <form action={deleteEventType}>
                  <input type="hidden" name="id" value={eventType.id} />
                  <button
                    type="submit"
                    className="cursor-pointer text-sm font-medium text-red-600 hover:underline"
                  >
                    Delete
                  </button>
                </form>
              )}
            </div>
          </div>
          )
        })}
      </div>
    </>
  )
}
