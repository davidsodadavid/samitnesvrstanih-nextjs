import Image from 'next/image'
import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { name: 'asc' },
    include: { logo: true },
  })

  return (
    <div className="mx-auto max-w-3xl">
      {/* Flattened export from Figma (photo + decorative marks — all static),
          with the title and date kept as real text for SEO/crawlability. */}
      <div className="relative left-1/2 -mt-8 w-screen -translate-x-1/2">
        <Image
          src="/hero/hero-bg.png"
          alt=""
          width={1920}
          height={739}
          priority
          style={{ width: '100%', height: 'auto' }}
        />
        <h1
          className="font-display absolute top-[40.76%] left-[4.85%] leading-[0.8] text-white uppercase"
          style={{ fontSize: 'clamp(1.75rem, 6.78vw, 8.125rem)' }}
        >
          <span className="block">Samit</span>
          <span className="block">Nesvrstanih</span>
        </h1>
        <p
          className="font-display absolute top-[92.65%] left-[41.3%] w-[19.76%] text-center whitespace-nowrap text-white"
          style={{ fontSize: 'clamp(0.625rem, 1.41vw, 1.6875rem)' }}
        >
          10-13. Septeber 2026
        </p>
      </div>

      {sponsors.length > 0 && (
        <section className="mt-12">
          <h2 className="text-xl font-bold">Sponsors</h2>
          <div className="mt-5 flex flex-wrap items-center gap-x-8 gap-y-5">
            {sponsors.map((sponsor) => (
              <figure key={sponsor.id} className="flex flex-col items-center gap-2">
                <img
                  src={sponsor.logo.url}
                  alt={`${sponsor.name} logo`}
                  className="h-14 w-auto max-w-32 object-contain"
                />
                <figcaption className="text-sm text-zinc-600">{sponsor.name}</figcaption>
              </figure>
            ))}
          </div>
        </section>
      )}
    </div>
  )
}
