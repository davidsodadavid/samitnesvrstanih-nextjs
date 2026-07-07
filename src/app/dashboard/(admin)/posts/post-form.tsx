import { Field, FormCard, Select, SubmitButton, TextInput } from '../_components/form'
import { MarkdownEditor } from '../_components/markdown-editor'
import { ImagePicker, PhotoMultiPicker } from '../_components/media-picker'
import type { ImageItem, PhotoItem } from '../_components/media-types'
import type { Post } from '@/generated/prisma/client'

export function PostForm({
  action,
  post,
  thumbnail,
  selectedPhotos,
}: {
  action: (formData: FormData) => Promise<void>
  post?: Post
  thumbnail?: ImageItem | null
  selectedPhotos?: PhotoItem[]
}) {
  return (
    <FormCard action={action}>
      {post && <input type="hidden" name="id" value={post.id} />}
      <Field label="Title">
        <TextInput type="text" name="title" defaultValue={post?.title} required />
      </Field>
      <div className="flex flex-col gap-3.5 sm:flex-row sm:*:flex-1">
        <Field label="Type">
          <Select
            name="type"
            defaultValue={post?.type ?? 'POST'}
            options={[
              { value: 'POST', label: 'Post' },
              { value: 'FILM', label: 'Film' },
              { value: 'EXHIBITION', label: 'Exhibition' },
            ]}
          />
        </Field>
      </div>
      <Field label="Thumbnail">
        <ImagePicker name="thumbnail_id" initial={thumbnail} />
      </Field>
      <Field label="Description">
        <MarkdownEditor name="description" defaultValue={post?.description} />
      </Field>
      <Field label="Photos">
        <PhotoMultiPicker initialSelected={selectedPhotos} />
      </Field>
      <SubmitButton>{post ? 'Save' : 'Create post'}</SubmitButton>
    </FormCard>
  )
}
