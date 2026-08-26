'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'

export async function uploadDesign(formData: FormData) {
  await requireAdmin()
  const files = formData.getAll('file').filter((f): f is File => f instanceof File && f.size > 0)
  const author = String(formData.get('author') ?? '').trim()
  const date = String(formData.get('date') ?? '')

  if (files.length === 0) {
    redirect('/dashboard/designs?error=missing-fields')
  }

  // Author/date only make sense for a single design — a batch upload skips them.
  const single = files.length === 1

  await Promise.all(
    files.map(async (file) => {
      const { key, url } = await uploadToR2(file, 'designs')
      await prisma.design.create({
        data: {
          key,
          url,
          author: single ? author || null : null,
          date: single && date ? new Date(date) : null,
        },
      })
    }),
  )

  revalidatePath('/dashboard/designs')
}

export async function updateDesign(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const author = String(formData.get('author') ?? '').trim()
  const date = String(formData.get('date') ?? '')

  await prisma.design.update({
    where: { id },
    data: { author: author || null, date: date ? new Date(date) : null },
  })

  revalidatePath('/dashboard/designs')
  redirect('/dashboard/designs')
}

export async function deleteDesign(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  const design = await prisma.design.findUnique({ where: { id } })
  if (!design) redirect('/dashboard/designs')

  await prisma.design.delete({ where: { id } })

  try {
    await deleteFromR2(design.key)
  } catch (err) {
    console.error(`Failed to delete R2 object ${design.key}`, err)
  }

  revalidatePath('/dashboard/designs')
}
