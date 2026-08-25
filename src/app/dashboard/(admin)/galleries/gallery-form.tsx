import { Field, FormCard, SubmitButton, TextInput } from '../_components/form'
import { ImagePicker, PhotoMultiPicker } from '../_components/media-picker'
import type { ImageItem, PhotoItem } from '../_components/media-types'
import type { Gallery } from '@/generated/prisma/client'

export function GalleryForm({
  action,
  gallery,
  selectedPhotos,
  image,
}: {
  action: (formData: FormData) => Promise<void>
  gallery?: Gallery
  selectedPhotos?: PhotoItem[]
  image?: ImageItem | null
}) {
  return (
    <FormCard action={action}>
      {gallery && <input type="hidden" name="id" value={gallery.id} />}
      <div className="flex flex-col gap-3.5 sm:flex-row sm:*:flex-1">
        <Field label="Year">
          <TextInput
            type="number"
            name="year"
            defaultValue={gallery?.year ?? new Date().getFullYear()}
            required
          />
        </Field>
        <Field label="Authors (optional)">
          <TextInput
            type="text"
            name="authors"
            defaultValue={gallery?.authors ?? ''}
            placeholder="Credit line for the gallery"
          />
        </Field>
      </div>
      <Field label="Link image (optional)">
        <ImagePicker name="image_id" initial={image} />
      </Field>
      <Field label="Photos">
        <PhotoMultiPicker initialSelected={selectedPhotos} />
      </Field>
      <SubmitButton>{gallery ? 'Save' : 'Create gallery'}</SubmitButton>
    </FormCard>
  )
}
