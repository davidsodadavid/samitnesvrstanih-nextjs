import Link from 'next/link'
import { prisma } from '@/lib/prisma'
import { navItems as staticNavItems, siteBrand, type NavEntry } from './nav-items'
import { MobileNav } from './mobile-nav'
import { NavDropdown } from './nav-dropdown'

// PAST EVENTS lists every event type that has at least one event already
// over — real festival history, not the hand-picked blog categories it used
// to link to. Fetched here (server-only) rather than in nav-items.ts, which
// client components also import and can't touch the database.
async function getPastEventTypeItems() {
  const types = await prisma.eventType.findMany({
    where: { events: { some: { ends_at: { lt: new Date() } } } },
    include: { icon: true },
    orderBy: { name: 'asc' },
  })
  return types.map((type) => ({
    label: type.name.toUpperCase(),
    href: `/past-events/${type.id}`,
    accentColor: type.color,
    icon: type.icon?.url,
  }))
}

export async function Navbar() {
  const pastEventItems = await getPastEventTypeItems()
  const navItems: NavEntry[] = staticNavItems.map((item) =>
    item.type === 'group' && item.label === 'PAST EVENTS'
      ? { ...item, items: pastEventItems }
      : item,
  )

  return (
    <header className="sticky top-0 z-40 bg-black">
      <nav className="relative hidden h-10 w-full items-center justify-end overflow-x-auto pr-4 md:flex lg:h-12 xl:h-14 2xl:h-[61px]">
        <Link
          href={siteBrand.href}
          className="absolute left-4 flex items-center gap-2 hover:opacity-80"
        >
          <img src="/logo.svg" alt="" className="h-6 w-auto lg:h-7 xl:h-8 2xl:h-9" />
          <span className="font-display text-xs leading-none text-white lg:text-sm xl:text-lg 2xl:text-[22px]">
            {siteBrand.label}
          </span>
        </Link>
        {navItems.map((item, i) => (
          <div key={item.label} className="flex h-full items-center">
            {i > 0 && (
              <span className="mx-1 h-4 w-px bg-white lg:mx-2 lg:h-5 xl:mx-3 xl:h-6 2xl:mx-4 2xl:h-8" />
            )}
            {item.type === 'group' ? (
              <NavDropdown group={item} />
            ) : (
              (() => {
                const content = (
                  <span className="flex items-center gap-1 whitespace-nowrap lg:gap-1.5 xl:gap-2">
                    <img
                      src={item.desktopIcon}
                      alt=""
                      className="h-4 w-auto lg:h-5 xl:h-6 2xl:h-7"
                    />
                    <span className="font-display text-xs leading-none text-white lg:text-sm xl:text-lg 2xl:text-[22px]">
                      {item.label}
                    </span>
                  </span>
                )

                return item.href ? (
                  <Link href={item.href} className="flex h-full items-center px-1 hover:opacity-80">
                    {content}
                  </Link>
                ) : (
                  <span className="flex h-full items-center px-1 opacity-50">{content}</span>
                )
              })()
            )}
          </div>
        ))}
      </nav>
      <MobileNav navItems={navItems} />
    </header>
  )
}
