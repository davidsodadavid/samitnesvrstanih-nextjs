'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { EVENT_TIME_ZONE, parseLocalDateTime } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'

function parseEvent(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '')
  const start_at = parseLocalDateTime(String(formData.get('start_at') ?? ''), EVENT_TIME_ZONE)
  const ends_at = parseLocalDateTime(String(formData.get('ends_at') ?? ''), EVENT_TIME_ZONE)
  const location_id = Number(formData.get('location_id'))
  const event_type_id = Number(formData.get('event_type_id'))
  const imageRaw = String(formData.get('image_id') ?? '')

  if (
    !title ||
    Number.isNaN(start_at.getTime()) ||
    Number.isNaN(ends_at.getTime()) ||
    !location_id ||
    !event_type_id
  ) {
    return null
  }
  return {
    title,
    description,
    start_at,
    ends_at,
    location_id,
    event_type_id,
    image_id: imageRaw ? Number(imageRaw) : null,
  }
}

export async function createEvent(formData: FormData) {
  await requireAdmin()
  const data = parseEvent(formData)
  if (!data) redirect('/dashboard/events/new?error=invalid')

  await prisma.event.create({ data })
  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function updateEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseEvent(formData)
  if (!data) redirect(`/dashboard/events/${id}?error=invalid`)

  await prisma.event.update({ where: { id }, data })
  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.event.delete({ where: { id } })
  revalidatePath('/dashboard/events')
}
