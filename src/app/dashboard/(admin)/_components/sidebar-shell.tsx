'use client'

import { useState } from 'react'

/** Client wrapper around the server-rendered sidebar nav: fixed drawer with a
    hamburger top bar on mobile, plain sticky sidebar on md+. */
export function SidebarShell({
  nav,
  children,
}: {
  nav: React.ReactNode
  children: React.ReactNode
}) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen w-full bg-zinc-100 text-zinc-900">
      <header className="fixed inset-x-0 top-0 z-40 flex h-14 items-center justify-between bg-zinc-900 px-4 text-zinc-50 md:hidden">
        <span className="text-lg font-bold tracking-wide">Samit</span>
        <button
          type="button"
          onClick={() => setOpen((o) => !o)}
          aria-label={open ? 'Close menu' : 'Open menu'}
          className="cursor-pointer rounded-md px-2 py-1 text-2xl leading-none hover:bg-zinc-800"
        >
          {open ? '✕' : '☰'}
        </button>
      </header>

      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 md:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      <aside
        // Close the drawer when a nav link (or logout) is clicked — client-side
        // navigation keeps this layout mounted, so it won't close on its own
        onClickCapture={(event) => {
          if ((event.target as HTMLElement).closest('a, button[type="submit"]')) setOpen(false)
        }}
        className={`fixed inset-y-0 left-0 z-50 flex w-56 shrink-0 flex-col gap-1 overflow-y-auto bg-zinc-900 px-3 py-5 text-zinc-50 transition-transform md:sticky md:top-0 md:h-screen md:translate-x-0 ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {nav}
      </aside>

      <main className="min-w-0 flex-1 px-4 pt-19 pb-6 md:px-8 md:py-7">{children}</main>
    </div>
  )
}
