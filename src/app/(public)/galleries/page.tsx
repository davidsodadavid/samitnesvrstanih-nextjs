import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { DashedLine } from '../_components/dashed-line'
import { navItems } from '../_components/nav-items'
import { SectionHeader } from '../_components/section-header'

export const dynamic = 'force-dynamic'

export default async function GalleriesIndexPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { year: 'desc' },
    select: { year: true },
  })

  const navGroup = navItems.find((item) => item.type === 'group' && item.label === 'GALLERY')

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 min-h-screen w-screen -translate-x-1/2 bg-black pb-8">
      <SectionHeader
        title="Gallery"
        accentColor={navGroup?.accentColor ?? '#6e9985'}
        icon={navGroup?.desktopIcon}
        photoSrc="/galleries/header-strip.png"
        cancelTopPadding={false}
      />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashedLine color="white" />

        <p className="font-body mb-6 text-white">Pick a year to browse.</p>

        {galleries.length === 0 ? (
          <p className="font-body text-white/60">No galleries yet.</p>
        ) : (
          <div className="flex flex-wrap gap-3">
            {galleries.map((gallery) => (
              <Link
                key={gallery.year}
                href={`/galleries/${gallery.year}`}
                className="font-headline border-4 border-white px-4 py-1 text-3xl font-bold text-white uppercase hover:bg-white hover:text-black sm:text-4xl"
              >
                {gallery.year}
              </Link>
            ))}
          </div>
        )}

        <DashedLine color="white" />
      </div>
    </div>
  )
}
