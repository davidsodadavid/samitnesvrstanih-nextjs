'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function createSponsor(formData: FormData) {
  await requireAdmin()
  const name = String(formData.get('name') ?? '').trim()
  const logo_id = Number(formData.get('logo_id'))
  if (!name || !logo_id) redirect('/dashboard/sponsors?error=invalid')

  await prisma.sponsor.create({ data: { name, logo_id } })
  revalidatePath('/dashboard/sponsors')
}

export async function updateSponsor(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const name = String(formData.get('name') ?? '').trim()
  const logo_id = Number(formData.get('logo_id'))
  if (!name || !logo_id) redirect('/dashboard/sponsors?error=invalid')

  await prisma.sponsor.update({ where: { id }, data: { name, logo_id } })
  revalidatePath('/dashboard/sponsors')
}

export async function deleteSponsor(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.sponsor.delete({ where: { id } })
  revalidatePath('/dashboard/sponsors')
}
