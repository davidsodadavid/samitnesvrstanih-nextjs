'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseLocation(formData: FormData) {
  const name = String(formData.get('name') ?? '').trim()
  const description = String(formData.get('description') ?? '').trim()
  const lat = Number(formData.get('lat'))
  const lng = Number(formData.get('lng'))
  if (!name || Number.isNaN(lat) || Number.isNaN(lng)) return null
  return { name, description, lat, lng }
}

export async function createLocation(formData: FormData) {
  await requireAdmin()
  const data = parseLocation(formData)
  if (!data) redirect('/dashboard/locations/new?error=invalid')

  await prisma.location.create({ data })
  revalidatePath('/dashboard/locations')
  redirect('/dashboard/locations')
}

export async function updateLocation(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseLocation(formData)
  if (!data) redirect(`/dashboard/locations/${id}?error=invalid`)

  await prisma.location.update({ where: { id }, data })
  revalidatePath('/dashboard/locations')
  redirect('/dashboard/locations')
}

export async function deleteLocation(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  try {
    await prisma.location.delete({ where: { id } })
  } catch {
    redirect('/dashboard/locations?error=in-use')
  }
  revalidatePath('/dashboard/locations')
}
