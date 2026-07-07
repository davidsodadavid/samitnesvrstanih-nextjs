import { Field, FormCard, Select, SubmitButton, TextInput } from '../_components/form'
import { MarkdownEditor } from '../_components/markdown-editor'
import { PhotoMultiPicker } from '../_components/media-picker'
import type { PhotoItem } from '../_components/media-types'
import type { Diy, Location } from '@/generated/prisma/client'

export function DiyForm({
  action,
  locations,
  diy,
  selectedPhotos,
}: {
  action: (formData: FormData) => Promise<void>
  locations: Location[]
  diy?: Diy
  selectedPhotos?: PhotoItem[]
}) {
  return (
    <FormCard action={action}>
      {diy && <input type="hidden" name="id" value={diy.id} />}
      <Field label="Title">
        <TextInput type="text" name="title" defaultValue={diy?.title} required />
      </Field>
      <Field label="Location">
        <Select
          name="location_id"
          defaultValue={diy?.location_id ?? ''}
          emptyLabel="— pick a location —"
          required
          options={locations.map((location) => ({
            value: location.id,
            label: location.name,
          }))}
        />
      </Field>
      <Field label="Description">
        <MarkdownEditor name="description" defaultValue={diy?.description} />
      </Field>
      <Field label="Photos">
        <PhotoMultiPicker initialSelected={selectedPhotos} />
      </Field>
      <SubmitButton>{diy ? 'Save' : 'Create DIY entry'}</SubmitButton>
    </FormCard>
  )
}
