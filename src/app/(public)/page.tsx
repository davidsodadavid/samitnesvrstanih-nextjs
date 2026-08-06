import { prisma } from '@/lib/prisma'

export default async function HomePage() {
  const sponsors = await prisma.sponsor.findMany({
    orderBy: { name: 'asc' },
    include: { logo: true },
  })

  return (
    <div className="mx-auto max-w-3xl">
      <h1 className="text-3xl font-bold">Samit</h1>
      <div className="mt-6 flex flex-col gap-4 text-zinc-700">
        <p>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor
          incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud
          exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
        </p>
        <p>
          Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu
          fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in
          culpa qui officia deserunt mollit anim id est laborum.
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
