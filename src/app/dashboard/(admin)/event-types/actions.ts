'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

function parseIconId(formData: FormData) {
  const raw = String(formData.get('icon_id') ?? '')
  return raw ? Number(raw) : null
}

export async function createEventType(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) redirect('/dashboard/event-types?error=missing-name')
  const color = String(formData.get('color') ?? '').trim()

  await prisma.eventType.create({
    data: { name, icon_id: parseIconId(formData), ...(color ? { color } : {}) },
  })
  revalidatePath('/dashboard/event-types')
}

export async function renameEventType(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const name = String(formData.get('name') ?? '').trim()
  if (!name) redirect('/dashboard/event-types?error=missing-name')
  const color = String(formData.get('color') ?? '').trim()

  await prisma.eventType.update({
    where: { id },
    data: { name, icon_id: parseIconId(formData), ...(color ? { color } : {}) },
  })
  revalidatePath('/dashboard/event-types')
}

export async function deleteEventType(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))

  try {
    await prisma.eventType.delete({ where: { id } })
  } catch {
    redirect('/dashboard/event-types?error=in-use')
  }
  revalidatePath('/dashboard/event-types')
}
