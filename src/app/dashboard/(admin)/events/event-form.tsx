import {
  Field,
  FormCard,
  Select,
  SubmitButton,
  TextInput,
} from '../_components/form'
import { MarkdownEditor } from '../_components/markdown-editor'
import { EventImageField } from './event-image-field'
import type { Event, EventType, Location } from '@/generated/prisma/client'
import { EVENT_TIME_ZONE, formatLocalDateTime } from '@/lib/event-time'

export function EventForm({
  action,
  locations,
  eventTypes,
  event,
  imageUrl,
}: {
  action: (formData: FormData) => Promise<void>
  locations: Location[]
  eventTypes: EventType[]
  event?: Event
  imageUrl?: string | null
}) {
  return (
    <FormCard action={action}>
      {event && <input type="hidden" name="id" value={event.id} />}
      <Field label="Title">
        <TextInput type="text" name="title" defaultValue={event?.title} required />
      </Field>
      <div className="flex flex-col gap-3.5 sm:flex-row sm:*:flex-1">
        <Field label="Starts">
          <TextInput
            type="datetime-local"
            name="start_at"
            defaultValue={event ? formatLocalDateTime(event.start_at, EVENT_TIME_ZONE) : undefined}
            required
          />
        </Field>
        <Field label="Ends">
          <TextInput
            type="datetime-local"
            name="ends_at"
            defaultValue={event ? formatLocalDateTime(event.ends_at, EVENT_TIME_ZONE) : undefined}
            required
          />
        </Field>
      </div>
      <div className="flex flex-col gap-3.5 sm:flex-row sm:*:flex-1">
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
        <EventImageField initialUrl={imageUrl} />
      </Field>
      <Field label="Description">
        <MarkdownEditor name="description" defaultValue={event?.description} />
      </Field>
      <SubmitButton>{event ? 'Save' : 'Create event'}</SubmitButton>
    </FormCard>
  )
}
