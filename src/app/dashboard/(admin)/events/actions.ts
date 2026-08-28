'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { EVENT_TIME_ZONE, parseLocalDateTime } from '@/lib/event-time'
import { prisma } from '@/lib/prisma'
import { deleteFromR2, uploadToR2 } from '@/lib/r2'

function parseEvent(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const description = String(formData.get('description') ?? '')
  const start_at = parseLocalDateTime(String(formData.get('start_at') ?? ''), EVENT_TIME_ZONE)
  const ends_at = parseLocalDateTime(String(formData.get('ends_at') ?? ''), EVENT_TIME_ZONE)
  const location_id = Number(formData.get('location_id'))
  const event_type_id = Number(formData.get('event_type_id'))

  if (
    !title ||
    Number.isNaN(start_at.getTime()) ||
    Number.isNaN(ends_at.getTime()) ||
    !location_id ||
    !event_type_id
  ) {
    return null
  }
  return { title, description, start_at, ends_at, location_id, event_type_id }
}

function uploadedImage(formData: FormData): File | null {
  const file = formData.get('image')
  return file instanceof File && file.size > 0 ? file : null
}

/**
 * Removes the bucket object behind an event image.
 *
 * Images that predate the split still share their object with a library Image
 * row (one that is also a sponsor logo or an event type icon), so the object is
 * only dropped once nothing else points at that key.
 */
async function deleteEventImageObject(key: string) {
  const sharedWithLibrary = await prisma.image.findUnique({ where: { key }, select: { id: true } })
  if (sharedWithLibrary) return

  try {
    await deleteFromR2(key)
  } catch (err) {
    // The row is already gone; an orphaned object is the lesser evil.
    console.error(`Failed to delete R2 object ${key}`, err)
  }
}

export async function createEvent(formData: FormData) {
  await requireAdmin()
  const data = parseEvent(formData)
  if (!data) redirect('/dashboard/events/new?error=invalid')

  const file = uploadedImage(formData)
  const image = file ? await uploadToR2(file, 'events') : null

  await prisma.event.create({
    data: { ...data, ...(image ? { image: { create: image } } : {}) },
  })
  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function updateEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parseEvent(formData)
  if (!data) redirect(`/dashboard/events/${id}?error=invalid`)

  const file = uploadedImage(formData)
  const removeImage = formData.get('remove_image') === '1'
  const existing = await prisma.event.findUnique({ where: { id }, include: { image: true } })

  // A new file replaces whatever is there; Remove on its own just clears it.
  const image = file ? await uploadToR2(file, 'events') : null
  await prisma.event.update({
    where: { id },
    data: {
      ...data,
      ...(image
        ? { image: { upsert: { create: image, update: image } } }
        : removeImage && existing?.image
          ? { image: { delete: true } }
          : {}),
    },
  })

  if (existing?.image && (image || removeImage)) {
    await deleteEventImageObject(existing.image.key)
  }

  revalidatePath('/dashboard/events')
  redirect('/dashboard/events')
}

export async function deleteEvent(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  // Read the key before the row goes: the image row is cascade-deleted with the
  // event, but the bucket object has to be removed by hand.
  const event = await prisma.event.findUnique({ where: { id }, include: { image: true } })
  await prisma.event.delete({ where: { id } })
  if (event?.image) await deleteEventImageObject(event.image.key)

  revalidatePath('/dashboard/events')
}
