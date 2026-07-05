import { Field, FormCard, SubmitButton, TextInput } from '../_components/form'
import { PhotoMultiPicker } from '../_components/media-picker'
import type { PhotoItem } from '../_components/media-types'
import type { Gallery } from '@/generated/prisma/client'

export function GalleryForm({
  action,
  gallery,
  selectedPhotos,
}: {
  action: (formData: FormData) => Promise<void>
  gallery?: Gallery
  selectedPhotos?: PhotoItem[]
}) {
  return (
    <FormCard action={action}>
      {gallery && <input type="hidden" name="id" value={gallery.id} />}
      <div className="flex gap-3.5 *:flex-1">
        <Field label="Year">
          <TextInput
            type="number"
            name="year"
            defaultValue={gallery?.year ?? new Date().getFullYear()}
            required
          />
        </Field>
        <Field label="Authors">
          <TextInput
            type="text"
            name="authors"
            defaultValue={gallery?.authors}
            placeholder="Credit line for the gallery"
            required
          />
        </Field>
      </div>
      <Field label="Photos">
        <PhotoMultiPicker initialSelected={selectedPhotos} />
      </Field>
      <SubmitButton>{gallery ? 'Save' : 'Create gallery'}</SubmitButton>
    </FormCard>
  )
}
