import Link from 'next/link'
import { logout } from './actions'
import { SidebarShell } from './_components/sidebar-shell'

export const metadata = { title: 'Samit dashboard' }

// Admin pages must always show fresh data — never prerender them at build time.
export const dynamic = 'force-dynamic'

const sections: { label: string; links: { href: string; label: string }[] }[] = [
  {
    label: 'Content',
    links: [
      { href: '/dashboard/posts', label: 'Posts' },
      { href: '/dashboard/galleries', label: 'Galleries' },
      { href: '/dashboard/diys', label: 'DIY' },
    ],
  },
  {
    label: 'Events',
    links: [
      { href: '/dashboard/events', label: 'Events' },
      { href: '/dashboard/event-types', label: 'Event types' },
      { href: '/dashboard/locations', label: 'Locations' },
    ],
  },
  {
    label: 'Media',
    links: [
      { href: '/dashboard/photos', label: 'Photos' },
      { href: '/dashboard/images', label: 'Images' },
    ],
  },
  {
    label: 'Other',
    links: [{ href: '/dashboard/sponsors', label: 'Sponsors' }],
  },
]

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarShell
      nav={
        <>
          <Link href="/dashboard" className="px-2.5 pb-4 text-lg font-bold tracking-wide">
            Samit
          </Link>
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-2.5 pt-3 pb-1 text-[11px] tracking-widest text-zinc-500 uppercase">
                {section.label}
              </p>
              {section.links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="block rounded-md px-2.5 py-2 text-sm text-zinc-300 hover:bg-zinc-800 hover:text-white"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          ))}
          <form action={logout} className="mt-auto pt-3">
            <button
              type="submit"
              className="w-full cursor-pointer rounded-md px-2.5 py-2 text-left text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white"
            >
              Log out
            </button>
          </form>
        </>
      }
    >
      {children}
    </SidebarShell>
  )
}
