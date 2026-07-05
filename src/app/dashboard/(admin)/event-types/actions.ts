'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createEventType(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  if (!name) redirect('/dashboard/event-types?error=missing-name')

  await prisma.eventType.create({ data: { name } })
  revalidatePath('/dashboard/event-types')
}

export async function renameEventType(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const name = String(formData.get('name') ?? '').trim()
  if (!name) redirect('/dashboard/event-types?error=missing-name')

  await prisma.eventType.update({ where: { id }, data: { name } })
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
