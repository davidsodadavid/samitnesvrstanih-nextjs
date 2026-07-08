'use client'

import Link from 'next/link'
import { useState } from 'react'

const blogLinks = [
  { href: '/blog/posts', label: 'Posts' },
  { href: '/blog/films', label: 'Films' },
  { href: '/blog/exhibitions', label: 'Exhibitions' },
  { href: '/blog/workshops', label: 'Workshops' },
  { href: '/blog/concerts', label: 'Concerts' },
  { href: '/diy', label: 'DIY' },
]

function Dropdown({
  label,
  items,
  open,
  onToggle,
  onClose,
}: {
  label: string
  items: { href: string; label: string }[]
  open: boolean
  onToggle: () => void
  onClose: () => void
}) {
  return (
    <div className="relative">
      <button
        type="button"
        onClick={onToggle}
        className="cursor-pointer rounded-md px-2.5 py-1.5 text-sm font-semibold hover:bg-zinc-100"
      >
        {label} <span className="text-xs text-zinc-500">▾</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 z-20 mt-1 w-44 rounded-lg border border-zinc-200 bg-white py-1 shadow-lg">
          {items.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={onClose}
              className="block px-3.5 py-2 text-sm hover:bg-zinc-50"
            >
              {item.label}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}

export function Navbar({ galleryYears }: { galleryYears: number[] }) {
  const [openMenu, setOpenMenu] = useState<'blog' | 'galleries' | null>(null)
  const close = () => setOpenMenu(null)
  const toggle = (menu: 'blog' | 'galleries') =>
    setOpenMenu((current) => (current === menu ? null : menu))

  return (
    <header className="sticky top-0 z-40 border-b border-zinc-200 bg-white">
      <nav className="mx-auto flex h-14 w-full max-w-5xl items-center gap-6 px-4">
        <Link href="/" className="text-lg font-bold tracking-wide">
          Samit
        </Link>
        {/* invisible backdrop so clicking anywhere else closes the open dropdown */}
        {openMenu !== null && <div className="fixed inset-0 z-10" onClick={close} />}
        <Dropdown
          label="Blog"
          items={blogLinks}
          open={openMenu === 'blog'}
          onToggle={() => toggle('blog')}
          onClose={close}
        />
        <Link
          href="/program"
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold hover:bg-zinc-100"
        >
          Program 2026
        </Link>
        {galleryYears.length > 0 && (
          <Dropdown
            label="Galleries"
            items={galleryYears.map((year) => ({
              href: `/galleries/${year}`,
              label: String(year),
            }))}
            open={openMenu === 'galleries'}
            onToggle={() => toggle('galleries')}
            onClose={close}
          />
        )}
        <Link
          href="/about"
          className="rounded-md px-2.5 py-1.5 text-sm font-semibold hover:bg-zinc-100"
        >
          About us
        </Link>
      </nav>
    </header>
  )
}
