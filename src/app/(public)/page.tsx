import Image from 'next/image'
import { DashedLine } from './_components/dashed-line'
import { HomeDesignsCard } from './_components/home-designs-card'
import { HomeExhibitionsCard } from './_components/home-exhibitions-card'
import { HomeProgramCard } from './_components/home-program-card'
import { getEventTypes, getProgramDays } from './program/get-program-days'

export const dynamic = 'force-dynamic'

// Numbered 1-4 to match their order in the Figma design; the strip repeats
// this 4-icon pattern.
const homepageIcons = [
  '/icons/homepage/1.png',
  '/icons/homepage/2.png',
  '/icons/homepage/3.png',
  '/icons/homepage/4.png',
]

// `repeat` may be fractional (e.g. 2.5) to cut the strip mid-pattern, matching the design.
function IconStrip({ repeat, className }: { repeat: number; className?: string }) {
  const icons = Array.from(
    { length: Math.round(homepageIcons.length * repeat) },
    (_, i) => homepageIcons[i % homepageIcons.length],
  )
  return (
    <div className={`flex items-center justify-center gap-6 sm:gap-10 ${className ?? ''}`}>
      {icons.map((src, i) => (
        <img key={i} src={src} alt="" className="h-12 w-12 shrink-0 sm:h-14 sm:w-14 lg:h-16 lg:w-16" />
      ))}
    </div>
  )
}

export default async function HomePage() {
  const days = await getProgramDays()
  const eventTypes = getEventTypes(days)

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 min-h-screen w-screen -translate-x-1/2 bg-black pb-8">
      {/* Flattened export from Figma — title/date are baked into the poster art itself. */}
      <Image
        src="/hero/hero-bg.png"
        alt="Samit Nesvrstanih — Beograd, 10-13/9/2026"
        width={1279}
        height={670}
        priority
        style={{ width: '100%', height: 'auto' }}
      />

      <p className="font-display pt-4 text-center text-sm text-white uppercase sm:text-base">
        Poster by: Andrej Julher
      </p>

      <DashedLine color="white" className="mt-[11px] mb-12 sm:mb-24 opacity-30" />

      <div className="mx-auto max-w-4xl px-4 text-center">
        <h1 className="font-display text-2xl text-white uppercase sm:text-4xl">
          Summit Of The Non-Aligned
        </h1>
        <p className="font-display mt-4 text-sm text-white sm:text-lg">
          Everything is open to the public, with the full schedule announced as the festival
          approaches. As always, expect a mix of planned events and spontaneous gatherings -
          because that&apos;s what the summit has always been about.
        </p>
      </div>

      <IconStrip repeat={1} className="mt-12 sm:mt-20 px-4 lg:hidden" />
      <IconStrip repeat={3} className="mt-12 sm:mt-20 hidden px-4 lg:flex" />

        <DashedLine color="white" className="mt-12 sm:mt-24 mb-4 opacity-30" />

      <div className="mx-auto max-w-7xl px-4 pb-12">
        {/* Program on the left, the smaller sections stacked on the right —
            folds to a single column (Program first) below lg. */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <HomeProgramCard days={days} eventTypes={eventTypes} />
          <div className="flex flex-col gap-6">
            <HomeExhibitionsCard />
            <HomeDesignsCard />
          </div>
        </div>
      </div>
    </div>
  )
}
