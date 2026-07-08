import { prisma } from '@/lib/prisma'
import { Navbar } from './_components/navbar'

// The navbar lists gallery years from the database — keep the whole public
// section dynamic so a newly added gallery shows up without a rebuild.
export const dynamic = 'force-dynamic'

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const galleries = await prisma.gallery.findMany({
    orderBy: { year: 'desc' },
    select: { year: true },
  })

  return (
    <>
      <Navbar galleryYears={galleries.map((gallery) => gallery.year)} />
      <main className="mx-auto w-full max-w-5xl px-4 py-8">{children}</main>
    </>
  )
}
