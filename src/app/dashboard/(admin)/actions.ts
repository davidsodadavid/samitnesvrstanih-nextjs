'use server'

import { redirect } from 'next/navigation'
import { endSession, requireAdmin } from '@/lib/auth'

export async function logout() {
  await requireAdmin()
  await endSession()
  redirect('/dashboard/login')
}
