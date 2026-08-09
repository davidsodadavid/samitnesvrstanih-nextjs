import { DashedLine } from '../_components/dashed-line'
import { SectionHeader } from '../_components/section-header'

export default function AboutPage() {
  return (
    <>
      <SectionHeader
        title="About us"
        accentColor="#518ea1"
        icon="/icons/navbar/about.svg"
        photoSrc="/about/header-strip.png"
      />

      <DashedLine />

      <article>
        <div className="bg-black px-4 py-2">
          <h2 className="font-headline text-xl font-bold text-white uppercase sm:text-2xl">
            Samit Nesvrstanih
          </h2>
        </div>
        <div className="font-body mt-4 flex flex-col gap-4 text-black">
          <p>
            Samit Nesvrstanih is an independent, community-driven skateboarding festival based
            in Belgrade, Serbia.
          </p>
          <p>
            Since its beginning, the festival has brought together skateboarding, contemporary
            art, music, film, design, and DIY culture through a growing network of local and
            international collaborators, celebrating creativity, shared spaces, and the people
            who make them possible.
          </p>
        </div>
      </article>

      <DashedLine />
    </>
  )
}
