'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { Prisma } from '@/generated/prisma/client'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseGallery(formData: FormData) {
  const year = Number(formData.get('year'))
  const authors = String(formData.get('authors') ?? '').trim()
  const photoIds = formData.getAll('photo_ids').map(Number)
  const bannerRaw = String(formData.get('banner_id') ?? '')
  if (!Number.isInteger(year)) return null
  return {
    year,
    authors: authors || null,
    photoIds,
    banner_id: bannerRaw ? Number(bannerRaw) : null,
  }
}

function isYearTaken(error: unknown) {
  return error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002'
}

export async function createGallery(formData: FormData) {
  await requireAdmin()
  const data = parseGallery(formData)
  if (!data) redirect('/dashboard/galleries/new?error=invalid')

  try {
    await prisma.gallery.create({
      data: {
        year: data.year,
        authors: data.authors,
        banner_id: data.banner_id,
        photos: { connect: data.photoIds.map((id) => ({ id })) },
      },
    })
  } catch (error) {
    if (isYearTaken(error)) redirect('/dashboard/galleries/new?error=year_taken')
    throw error
  }
  revalidatePath('/dashboard/galleries')
  redirect('/dashboard/galleries')
}

export async function updateGallery(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseGallery(formData)
  if (!data) redirect(`/dashboard/galleries/${id}?error=invalid`)

  try {
    await prisma.gallery.update({
      where: { id },
      data: {
        year: data.year,
        authors: data.authors,
        banner_id: data.banner_id,
        photos: { set: data.photoIds.map((photoId) => ({ id: photoId })) },
      },
    })
  } catch (error) {
    if (isYearTaken(error)) redirect(`/dashboard/galleries/${id}?error=year_taken`)
    throw error
  }
  revalidatePath('/dashboard/galleries')
  redirect('/dashboard/galleries')
}

export async function deleteGallery(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.gallery.delete({ where: { id } })
  revalidatePath('/dashboard/galleries')
}
