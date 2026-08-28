import { notFound } from 'next/navigation'
import { prisma } from '@/lib/prisma'
import { DashedLine } from '../../_components/dashed-line'
import { navItems } from '../../_components/nav-items'
import { SectionHeader } from '../../_components/section-header'
import { fetchGalleryPhotos } from '../actions'
import { GalleryGrid } from './gallery-grid'

export const dynamic = 'force-dynamic'

export default async function GalleryPage({
  params,
}: {
  params: Promise<{ year: string }>
}) {
  const { year: yearParam } = await params
  const year = Number(yearParam)
  if (!Number.isInteger(year)) notFound()

  const gallery = await prisma.gallery.findUnique({ where: { year } })
  if (!gallery) notFound()

  const firstPage = await fetchGalleryPhotos(year)
  const navGroup = navItems.find((item) => item.type === 'group' && item.label === 'GALLERY')

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-black">
      {/* Same heading as the /galleries index, with the chosen year as the title. */}
      <SectionHeader
        title={String(year)}
        accentColor={navGroup?.accentColor ?? '#6e9985'}
        icon="/galleries/photo-camera.svg"
        photoSrc="/galleries/header-strip.png"
        cancelTopPadding={false}
      />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashedLine color="white" className="my-8 opacity-30" />

        {gallery.authors && (
          <p className="font-body mb-4 text-sm tracking-wide text-white uppercase">
            Photos by: {gallery.authors}
          </p>
        )}

        <GalleryGrid year={year} initial={firstPage} />

        <DashedLine color="white" className="my-8 opacity-30" />
      </div>
    </div>
  )
}
