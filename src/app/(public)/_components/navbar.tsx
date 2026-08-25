import Link from 'next/link'
import { navItems } from './nav-items'
import { MobileNav } from './mobile-nav'
import { NavBlogDropdown } from './nav-blog-dropdown'

export function Navbar({ galleryYears }: { galleryYears: number[] }) {
  // GALLERY stays unlinked until at least one gallery year exists.
  const archiveHref = galleryYears.length > 0 ? '/galleries' : null

  return (
    <header className="sticky top-0 z-40 bg-black">
      <nav className="hidden h-10 w-full items-center justify-center overflow-x-auto md:flex lg:h-12 xl:h-14 2xl:h-[61px]">
        {navItems.map((item, i) => (
          <div key={item.label} className="flex h-full items-center">
            {i > 0 && (
              <span className="mx-1 h-4 w-px bg-white lg:mx-2 lg:h-5 xl:mx-3 xl:h-6 2xl:mx-4 2xl:h-8" />
            )}
            {item.type === 'group' ? (
              <NavBlogDropdown group={item} />
            ) : (
              (() => {
                const href = item.label === 'GALLERY' ? archiveHref : item.href
                const content = (
                  <span className="flex items-center gap-1 whitespace-nowrap lg:gap-1.5 xl:gap-2">
                    <img
                      src={item.desktopIcon}
                      alt=""
                      className="h-4 w-auto lg:h-5 xl:h-6 2xl:h-7"
                    />
                    <span className="font-display text-xs text-white lg:text-sm xl:text-lg 2xl:text-[22px]">
                      {item.label}
                    </span>
                  </span>
                )

                return href ? (
                  <Link href={href} className="flex h-full items-center px-1 hover:opacity-80">
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
      <MobileNav archiveHref={archiveHref} />
    </header>
  )
}
