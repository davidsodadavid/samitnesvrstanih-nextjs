import {
  Field,
  FormCard,
  Select,
  SubmitButton,
  TextArea,
  TextInput,
} from '../_components/form'
import { ImagePicker } from '../_components/media-picker'
import type { ImageItem } from '../_components/media-types'
import type { Event, EventType, Location } from '@/generated/prisma/client'

// datetime-local wants "YYYY-MM-DDTHH:mm" in local time
function toDatetimeLocal(date: Date): string {
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60_000)
  return local.toISOString().slice(0, 16)
}

export function EventForm({
  action,
  locations,
  eventTypes,
  event,
  image,
}: {
  action: (formData: FormData) => Promise<void>
  locations: Location[]
  eventTypes: EventType[]
  event?: Event
  image?: ImageItem | null
}) {
  return (
    <FormCard action={action}>
      {event && <input type="hidden" name="id" value={event.id} />}
      <Field label="Title">
        <TextInput type="text" name="title" defaultValue={event?.title} required />
      </Field>
      <div className="flex gap-3.5 *:flex-1">
        <Field label="Starts">
          <TextInput
            type="datetime-local"
            name="start_at"
            defaultValue={event ? toDatetimeLocal(event.start_at) : undefined}
            required
          />
        </Field>
        <Field label="Ends">
          <TextInput
            type="datetime-local"
            name="ends_at"
            defaultValue={event ? toDatetimeLocal(event.ends_at) : undefined}
            required
          />
        </Field>
      </div>
      <div className="flex gap-3.5 *:flex-1">
        <Field label="Location">
          <Select
            name="location_id"
            defaultValue={event?.location_id ?? ''}
            emptyLabel="— pick a location —"
            required
            options={locations.map((location) => ({
              value: location.id,
              label: location.name,
            }))}
          />
        </Field>
        <Field label="Event type">
          <Select
            name="event_type_id"
            defaultValue={event?.event_type_id ?? ''}
            emptyLabel="— pick a type —"
            required
            options={eventTypes.map((eventType) => ({
              value: eventType.id,
              label: eventType.name,
            }))}
          />
        </Field>
      </div>
      <Field label="Image (optional)">
        <ImagePicker name="image_id" initial={image} />
      </Field>
      <Field label="Description">
        <TextArea name="description" defaultValue={event?.description} />
      </Field>
      <SubmitButton>{event ? 'Save' : 'Create event'}</SubmitButton>
    </FormCard>
  )
}
