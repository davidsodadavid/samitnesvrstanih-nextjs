import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { DashedLine } from '../_components/dashed-line'
import { navItems } from '../_components/nav-items'
import { SectionHeader } from '../_components/section-header'

export const dynamic = 'force-dynamic'

export default async function GalleriesIndexPage() {
  const galleries = await prisma.gallery.findMany({
    orderBy: { year: 'desc' },
    select: { year: true, banner: { select: { url: true } } },
  })

  const navGroup = navItems.find((item) => item.type === 'group' && item.label === 'GALLERY')

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-black">
      <SectionHeader
        title="Photo archive"
        accentColor={navGroup?.accentColor ?? '#6e9985'}
        icon="/galleries/photo-camera.svg"
        photoSrc="/galleries/header-strip.png"
        cancelTopPadding={false}
      />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashedLine color="white" className="my-8 opacity-30" />

        {galleries.length === 0 ? (
          <p className="font-body text-white/60">No galleries yet.</p>
        ) : (
          <div className="flex flex-col gap-2">
            {galleries.map((gallery) => (
              <Link
                key={gallery.year}
                href={`/galleries/${gallery.year}`}
                className="group relative block h-20 border-4 border-black sm:h-[125px]"
              >
                {gallery.banner ? (
                  <img
                    src={gallery.banner.url}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : (
                  // Nothing uploaded yet — the year and the button still need
                  // something to sit on.
                  <span className="absolute inset-0 bg-zinc-800" />
                )}

                {/* Both sit along the top edge of the bar, as in the design. */}
                <span className="relative flex items-start justify-between">
                  <span className="font-headline bg-black px-2 py-1 text-2xl font-bold text-white sm:px-3 sm:text-4xl">
                    {gallery.year}
                  </span>
                  <span className="font-headline border-2 border-black bg-white px-1.5 py-0.5 text-xl font-bold text-black uppercase group-hover:bg-black group-hover:text-white sm:px-2 sm:text-3xl">
                    View all
                  </span>
                </span>
              </Link>
            ))}
          </div>
        )}

        <DashedLine color="white" className="my-8 opacity-30" />
      </div>
    </div>
  )
}
