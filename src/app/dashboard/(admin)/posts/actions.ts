'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { requireAdmin } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import type { PostType } from '@/generated/prisma/client'

const POST_TYPES = ['POST', 'FILM', 'EXHIBITION'] as const

function parsePost(formData: FormData) {
  const title = String(formData.get('title') ?? '').trim()
  const type = String(formData.get('type') ?? '')
  const description = String(formData.get('description') ?? '')
  const thumbnailRaw = String(formData.get('thumbnail_id') ?? '')
  const photoIds = formData.getAll('photo_ids').map(Number)

  if (!title || !POST_TYPES.includes(type as (typeof POST_TYPES)[number])) return null
  return {
    title,
    type: type as PostType,
    description,
    thumbnail_id: thumbnailRaw ? Number(thumbnailRaw) : null,
    photoIds,
  }
}

export async function createPost(formData: FormData) {
  await requireAdmin()
  const data = parsePost(formData)
  if (!data) redirect('/dashboard/posts/new?error=invalid')

  await prisma.post.create({
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      thumbnail_id: data.thumbnail_id,
      photos: { connect: data.photoIds.map((id) => ({ id })) },
    },
  })
  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function updatePost(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  const data = parsePost(formData)
  if (!data) redirect(`/dashboard/posts/${id}?error=invalid`)

  await prisma.post.update({
    where: { id },
    data: {
      title: data.title,
      type: data.type,
      description: data.description,
      thumbnail_id: data.thumbnail_id,
      photos: { set: data.photoIds.map((photoId) => ({ id: photoId })) },
    },
  })
  revalidatePath('/dashboard/posts')
  redirect('/dashboard/posts')
}

export async function deletePost(formData: FormData) {
  await requireAdmin()
  const id = Number(formData.get('id'))
  await prisma.post.delete({ where: { id } })
  revalidatePath('/dashboard/posts')
}
