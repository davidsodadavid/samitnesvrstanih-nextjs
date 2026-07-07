import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { updatePhoto } from '../actions'

export default async function EditPhotoPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const photo = await prisma.photo.findUnique({ where: { id: Number(id) } })
  if (!photo) notFound()

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Edit photo</h1>
      <div className="flex max-w-2xl gap-5 rounded-xl border border-zinc-200 bg-white p-5">
        <img
          src={photo.url}
          alt={photo.author ? `Photo by ${photo.author}` : 'Photo'}
          className="h-40 w-56 shrink-0 rounded-lg object-cover"
        />
        <form action={updatePhoto} className="flex flex-1 flex-col gap-3.5">
          <input type="hidden" name="id" value={photo.id} />
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Author (optional)
            <input
              type="text"
              name="author"
              defaultValue={photo.author ?? ''}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold">
            Date taken (optional)
            <input
              type="date"
              name="date"
              defaultValue={photo.date ? photo.date.toISOString().slice(0, 10) : ''}
              className="rounded-lg border border-zinc-300 px-3 py-2 text-sm font-normal outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900"
            />
          </label>
          <button
            type="submit"
            className="cursor-pointer self-start rounded-lg bg-zinc-900 px-4 py-2 text-sm font-semibold text-white hover:bg-zinc-700"
          >
            Save
          </button>
        </form>
      </div>
    </>
  )
}
