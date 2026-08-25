'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'
import { pinIcon } from '../program-view'

export function LocationMap({
  lat,
  lng,
  color,
  iconUrl,
}: {
  lat: number
  lng: number
  color: string
  iconUrl: string | null
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)

  useEffect(() => {
    let cancelled = false
    // Leaflet touches `window` on import, so it can only load in the browser
    void import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      const map = L.map(containerRef.current).setView([lat, lng], 15)
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
      }).addTo(map)
      L.marker([lat, lng], { icon: pinIcon(L, color, iconUrl) }).addTo(map)
      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
    }
  }, [lat, lng, color, iconUrl])

  return <div ref={containerRef} className="isolate z-0 h-80 w-full border border-black sm:h-96" />
}
