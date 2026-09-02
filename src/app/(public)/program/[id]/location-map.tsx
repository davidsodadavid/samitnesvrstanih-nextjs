'use client'

import { useEffect, useRef } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'
import { BASEMAP_ATTRIBUTION, BASEMAP_TILE_URL } from '@/lib/basemap'
import { getDirectionsUrl } from '@/lib/directions'
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
      L.tileLayer(BASEMAP_TILE_URL, { attribution: BASEMAP_ATTRIBUTION }).addTo(map)
      L.marker([lat, lng], { icon: pinIcon(L, color, iconUrl) })
        .addTo(map)
        .bindPopup(
          `<a href="${getDirectionsUrl(lat, lng)}" target="_blank" rel="noopener noreferrer" class="font-body block px-2 py-1.5 text-center text-xs font-semibold uppercase">Get directions</a>`,
        )
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
