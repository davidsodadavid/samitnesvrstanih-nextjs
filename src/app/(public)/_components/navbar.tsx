import Link from 'next/link'
import { navItems, siteBrand } from './nav-items'
import { MobileNav } from './mobile-nav'
import { NavDropdown } from './nav-dropdown'

export function Navbar() {
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
      <MobileNav />
    </header>
  )
}
