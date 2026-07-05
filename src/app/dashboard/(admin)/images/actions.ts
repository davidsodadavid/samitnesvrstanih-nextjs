'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'

export async function uploadImage(formData: FormData) {
  await requireAdmin()
  const file = formData.get('file')
  if (!(file instanceof File) || file.size === 0) {
    redirect('/dashboard/images?error=no-file')
  }

  const { key, url } = await uploadToR2(file, 'images')
  await prisma.image.create({ data: { key, url } })

  revalidatePath('/dashboard/images')
}

export async function deleteImage(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  const image = await prisma.image.findUnique({ where: { id } })
  if (!image) redirect('/dashboard/images')

  try {
    // Post thumbnails and event images are optional FKs and get nulled;
    // a sponsor logo is required and blocks the delete.
    await prisma.image.delete({ where: { id } })
  } catch {
    redirect('/dashboard/images?error=in-use')
  }

  try {
    await deleteFromR2(image.key)
  } catch (err) {
    // DB row is gone; an orphaned object in the bucket is the lesser evil.
    console.error(`Failed to delete R2 object ${image.key}`, err)
  }

  revalidatePath('/dashboard/images')
}
