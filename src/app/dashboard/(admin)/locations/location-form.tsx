import { Field, FormCard, SubmitButton, TextArea, TextInput } from '../_components/form'
import { LocationMapPicker } from './location-map-picker'
import type { Location } from '@/generated/prisma/client'

export function LocationForm({
  action,
  location,
}: {
  action: (formData: FormData) => Promise<void>
  location?: Location
}) {
  return (
    <FormCard action={action}>
      {location && <input type="hidden" name="id" value={location.id} />}
      <Field label="Name">
        <TextInput type="text" name="name" defaultValue={location?.name} required />
      </Field>
      <LocationMapPicker initialLat={location?.lat} initialLng={location?.lng} />
      <Field label="Description">
        <TextArea name="description" defaultValue={location?.description} />
      </Field>
      <SubmitButton>{location ? 'Save' : 'Create location'}</SubmitButton>
    </FormCard>
  )
}
