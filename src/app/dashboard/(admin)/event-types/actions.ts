'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { isHomepageEventType } from '@/lib/homepage-event-types'
import { prisma } from '@/lib/prisma'

// The homepage cards find their type by name, so renaming or deleting one of
// them empties a section of the homepage. The form disables both, and these
// guards make that stick for anything posting straight to the action.
async function assertUnlocked(id: number) {
  const existing = await prisma.eventType.findUnique({ where: { id }, select: { name: true } })
  if (existing && isHomepageEventType(existing.name)) redirect('/dashboard/event-types?error=locked')
  return existing
}

function parseImageId(formData: FormData, field: string) {
  const raw = String(formData.get(field) ?? '')
  return raw ? Number(raw) : null
}

export async function createEventType(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) redirect('/dashboard/event-types?error=missing-name')
  const color = String(formData.get('color') ?? '').trim()

  await prisma.eventType.create({
    data: {
      name,
      icon_id: parseImageId(formData, 'icon_id'),
      art_id: parseImageId(formData, 'art_id'),
      ...(color ? { color } : {}),
    },
  })
  revalidatePath('/dashboard/event-types')
}

export async function updateEventType(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const submitted = String(formData.get('name') ?? '').trim()
  if (!submitted) redirect('/dashboard/event-types?error=missing-name')
  const color = String(formData.get('color') ?? '').trim()

  // A locked type keeps its name; its colour, icon and art stay editable.
  const existing = await prisma.eventType.findUnique({ where: { id }, select: { name: true } })
  const locked = existing !== null && isHomepageEventType(existing.name)
  if (locked && submitted.toLowerCase() !== existing.name.toLowerCase()) {
    redirect('/dashboard/event-types?error=locked')
  }
  const name = locked ? existing.name : submitted

  await prisma.eventType.update({
    where: { id },
    data: {
      name,
      icon_id: parseImageId(formData, 'icon_id'),
      art_id: parseImageId(formData, 'art_id'),
      ...(color ? { color } : {}),
    },
  })
  revalidatePath('/dashboard/event-types')
}

export async function deleteEventType(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await assertUnlocked(id)

  try {
    await prisma.eventType.delete({ where: { id } })
  } catch {
    redirect('/dashboard/event-types?error=in-use')
  }
  revalidatePath('/dashboard/event-types')
}
