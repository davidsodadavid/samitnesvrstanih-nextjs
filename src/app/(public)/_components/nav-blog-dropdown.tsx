'use client'

import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { NavGroup } from './nav-items'

export function NavBlogDropdown({ group }: { group: NavGroup }) {
  const [open, setOpen] = useState(false)
  const [panelPos, setPanelPos] = useState({ top: 0, left: 0 })
  const buttonRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return

    const updatePosition = () => {
      const rect = buttonRef.current?.getBoundingClientRect()
      if (!rect) return
      setPanelPos({ top: rect.bottom, left: rect.left + rect.width / 2 })
    }
    updatePosition()

    const onClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (buttonRef.current?.contains(target) || panelRef.current?.contains(target)) return
      setOpen(false)
    }
    document.addEventListener('mousedown', onClickOutside)
    window.addEventListener('scroll', updatePosition, true)
    window.addEventListener('resize', updatePosition)
    return () => {
      document.removeEventListener('mousedown', onClickOutside)
      window.removeEventListener('scroll', updatePosition, true)
      window.removeEventListener('resize', updatePosition)
    }
  }, [open])

  return (
    <div className="flex h-full items-center">
      <button
        ref={buttonRef}
        type="button"
        onClick={() => setOpen((v) => !v)}
        className="flex h-full items-center px-1 hover:opacity-80"
      >
        <span className="flex items-center gap-1 whitespace-nowrap lg:gap-1.5 xl:gap-2">
          <img
            src={group.desktopIcon}
            alt=""
            className="h-4 w-auto lg:h-5 xl:h-6 2xl:h-7"
          />
          <span className="font-display text-xs text-white lg:text-sm xl:text-lg 2xl:text-[22px]">
            {group.label}
          </span>
        </span>
      </button>

      {open &&
        createPortal(
          <div
            ref={panelRef}
            className="fixed z-50 flex w-56 -translate-x-1/2 flex-col bg-black shadow-lg"
            style={{ top: panelPos.top, left: panelPos.left }}
          >
            {group.items.map((item) => {
              const row = (
                <>
                  <span className="w-2 shrink-0" style={{ backgroundColor: item.accentColor }} />
                  <span className="font-display flex-1 px-3 py-2 text-sm text-white">
                    {item.label}
                  </span>
                </>
              )

              return item.href ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setOpen(false)}
                  className="flex items-stretch border-t border-white/20 first:border-t-0 hover:bg-white/10"
                >
                  {row}
                </Link>
              ) : (
                <span
                  key={item.label}
                  className="flex items-stretch border-t border-white/20 opacity-50 first:border-t-0"
                >
                  {row}
                </span>
              )
            })}
          </div>,
          document.body,
        )}
    </div>
  )
}
