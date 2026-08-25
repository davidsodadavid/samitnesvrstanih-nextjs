'use client'

import Link from 'next/link'
import { useState } from 'react'
import { navItems } from './nav-items'

export function MobileNav({ archiveHref }: { archiveHref: string | null }) {
  const [open, setOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null)

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
            if (item.type === 'group') {
              const isExpanded = expandedGroup === item.label
              return (
                <div key={item.label} className="border-t border-white first:border-t-0">
                  <button
                    type="button"
                    onClick={() => setExpandedGroup(isExpanded ? null : item.label)}
                    className="flex h-12 w-full items-stretch active:bg-white active:[&_span]:text-black"
                  >
                    <div className="w-2 shrink-0" style={{ backgroundColor: item.accentColor }} />
                    <div className="flex flex-1 items-center justify-between gap-3 px-3">
                      <span className="flex items-center gap-3">
                        <img src={item.mobileIcon} alt="" className="h-5 w-auto" />
                        <span className="font-display text-lg text-white">{item.label}</span>
                      </span>
                      <span className="font-display text-white">{isExpanded ? '−' : '+'}</span>
                    </div>
                  </button>
                  {isExpanded && (
                    <div className="flex flex-col">
                      {item.items.map((sub) => {
                        const subContent = (
                          <>
                            <div
                              className="w-2 shrink-0"
                              style={{ backgroundColor: sub.accentColor }}
                            />
                            <div className="flex items-center px-6">
                              <span className="font-display text-base text-white">
                                {sub.label}
                              </span>
                            </div>
                          </>
                        )

                        return sub.href ? (
                          <Link
                            key={sub.label}
                            href={sub.href}
                            onClick={() => setOpen(false)}
                            className="flex h-10 items-stretch border-t border-white/20 active:bg-white active:[&_span]:text-black"
                          >
                            {subContent}
                          </Link>
                        ) : (
                          <div
                            key={sub.label}
                            className="flex h-10 items-stretch border-t border-white/20 opacity-50"
                          >
                            {subContent}
                          </div>
                        )
                      })}
                    </div>
                  )}
                </div>
              )
            }

            const href = item.label === 'GALLERY' ? archiveHref : item.href
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
