'use client'

import Link from 'next/link'
import { useState } from 'react'
import { navItems } from './nav-items'

export function MobileNav({ archiveHref }: { archiveHref: string | null }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="md:hidden">
      <div className="flex h-[42px] items-center justify-between bg-black px-4">
        <span className="font-display text-xs text-white">Summit Of The Non Aligned</span>
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="font-display text-xs text-white"
        >
          {open ? 'CLOSE' : 'MENU'}
        </button>
      </div>

      {open && (
        <nav className="absolute inset-x-0 flex flex-col bg-black">
          {navItems.map((item) => {
            const href = item.label === 'ARCHIVE' ? archiveHref : item.href
            const content = (
              <>
                <div className="w-2 shrink-0" style={{ backgroundColor: item.accentColor }} />
                <div className="flex items-center gap-3 px-3">
                  <img src={item.mobileIcon} alt="" className="h-5 w-auto" />
                  <span className="font-display text-lg text-white">{item.label}</span>
                </div>
              </>
            )

            return href ? (
              <Link
                key={item.label}
                href={href}
                onClick={() => setOpen(false)}
                className="flex h-12 items-stretch border-t border-white first:border-t-0 active:bg-white active:[&_span]:text-black"
              >
                {content}
              </Link>
            ) : (
              <div
                key={item.label}
                className="flex h-12 items-stretch border-t border-white opacity-50 first:border-t-0"
              >
                {content}
              </div>
            )
          })}
        </nav>
      )}
    </div>
  )
}
