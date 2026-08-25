'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'

export async function uploadPhoto(formData: FormData) {
  await requireAdmin()
  const files = formData.getAll('file').filter((f): f is File => f instanceof File && f.size > 0)
  const author = String(formData.get('author') ?? '').trim()
  const date = String(formData.get('date') ?? '')

  if (files.length === 0) {
    redirect('/dashboard/photos?error=missing-fields')
  }

  // Author/date only make sense for a single photo — a batch upload skips them.
  const single = files.length === 1

  await Promise.all(
    files.map(async (file) => {
      const { key, url } = await uploadToR2(file, 'photos')
      await prisma.photo.create({
        data: {
          key,
          url,
          author: single ? author || null : null,
          date: single && date ? new Date(date) : null,
        },
      })
    }),
  )

  revalidatePath('/dashboard/photos')
}

export async function updatePhoto(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const author = String(formData.get('author') ?? '').trim()
  const date = String(formData.get('date') ?? '')

  await prisma.photo.update({
    where: { id },
    data: { author: author || null, date: date ? new Date(date) : null },
  })

  revalidatePath('/dashboard/photos')
  redirect('/dashboard/photos')
}

export async function deletePhoto(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  const photo = await prisma.photo.findUnique({ where: { id } })
  if (!photo) redirect('/dashboard/photos')

  // Implicit m-n join rows (posts, galleries, DIYs) cascade automatically.
  await prisma.photo.delete({ where: { id } })

  try {
    await deleteFromR2(photo.key)
  } catch (err) {
    console.error(`Failed to delete R2 object ${photo.key}`, err)
  }

  revalidatePath('/dashboard/photos')
}
