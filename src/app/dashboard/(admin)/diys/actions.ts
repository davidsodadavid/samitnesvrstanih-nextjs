'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseDiy(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '')
  const location_id = Number(formData.get('location_id'))
  const photoIds = formData.getAll('photo_ids').map(Number)
  if (!title || !location_id) return null
  return { title, description, location_id, photoIds }
}

export async function createDiy(formData: FormData) {
  await requireAdmin()
  const data = parseDiy(formData)
  if (!data) redirect('/dashboard/diys/new?error=invalid')

  await prisma.diy.create({
    data: {
      title: data.title,
      description: data.description,
      location_id: data.location_id,
      photos: { connect: data.photoIds.map((id) => ({ id })) },
    },
  })
  revalidatePath('/dashboard/diys')
  redirect('/dashboard/diys')
}

export async function updateDiy(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseDiy(formData)
  if (!data) redirect(`/dashboard/diys/${id}?error=invalid`)

  await prisma.diy.update({
    where: { id },
    data: {
      title: data.title,
      description: data.description,
      location_id: data.location_id,
      photos: { set: data.photoIds.map((photoId) => ({ id: photoId })) },
    },
  })
  revalidatePath('/dashboard/diys')
  redirect('/dashboard/diys')
}

export async function deleteDiy(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.diy.delete({ where: { id } })
  revalidatePath('/dashboard/diys')
}
