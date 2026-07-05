'use server'

import { redirect } from 'next/navigation'
import { startSession } from '@/lib/auth'

export async function login(formData: FormData) {
  const password = formData.get('password')
  if (typeof password !== 'string' || password !== process.env.ADMIN_PASSWORD) {
    redirect('/dashboard/login?error=1')
  }
  await startSession()
  redirect('/dashboard')
}
