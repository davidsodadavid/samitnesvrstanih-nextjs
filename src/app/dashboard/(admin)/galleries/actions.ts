'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseGallery(formData: FormData) {
  const year = Number(formData.get('year'))
  const authors = String(formData.get('authors') ?? '').trim()
  const photoIds = formData.getAll('photo_ids').map(Number)
  if (!Number.isInteger(year) || !authors) return null
  return { year, authors, photoIds }
}

export async function createGallery(formData: FormData) {
  await requireAdmin()
  const data = parseGallery(formData)
  if (!data) redirect('/dashboard/galleries/new?error=invalid')

  await prisma.gallery.create({
    data: {
      year: data.year,
      authors: data.authors,
      photos: { connect: data.photoIds.map((id) => ({ id })) },
    },
  })
  revalidatePath('/dashboard/galleries')
  redirect('/dashboard/galleries')
}

export async function updateGallery(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseGallery(formData)
  if (!data) redirect(`/dashboard/galleries/${id}?error=invalid`)

  await prisma.gallery.update({
    where: { id },
    data: {
      year: data.year,
      authors: data.authors,
      photos: { set: data.photoIds.map((photoId) => ({ id: photoId })) },
    },
  })
  revalidatePath('/dashboard/galleries')
  redirect('/dashboard/galleries')
}

export async function deleteGallery(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.gallery.delete({ where: { id } })
  revalidatePath('/dashboard/galleries')
}
