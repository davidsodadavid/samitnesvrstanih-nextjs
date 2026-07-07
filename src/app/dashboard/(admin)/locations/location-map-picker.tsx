'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'

// Default view when creating a new location — adjust to your area
const DEFAULT_CENTER: [number, number] = [44.8125, 20.4612]
const DEFAULT_ZOOM = 6

type Coords = { lat: number; lng: number }

export function LocationMapPicker({
  initialLat,
  initialLng,
}: {
  initialLat?: number
  initialLng?: number
}) {
  const [coords, setCoords] = useState<Coords | null>(
    initialLat !== undefined && initialLng !== undefined
      ? { lat: initialLat, lng: initialLng }
      : null,
  )
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const markerRef = useRef<Leaflet.CircleMarker | null>(null)
  const leafletRef = useRef<typeof Leaflet | null>(null)
  const initialCoordsRef = useRef(coords)

  useEffect(() => {
    let cancelled = false
    // Leaflet touches `window` on import, so it can only load in the browser
    void import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      leafletRef.current = L

      const initial = initialCoordsRef.current
      const map = L.map(containerRef.current).setView(
        initial ? [initial.lat, initial.lng] : DEFAULT_CENTER,
        initial ? 14 : DEFAULT_ZOOM,
      )
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
      map.on('click', (event: Leaflet.LeafletMouseEvent) => {
        setCoords({
          lat: Number(event.latlng.lat.toFixed(6)),
          lng: Number(event.latlng.lng.toFixed(6)),
        })
      })
      mapRef.current = map
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markerRef.current = null
    }
  }, [])

  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    if (!L || !map || !coords) return

    if (markerRef.current) {
      markerRef.current.setLatLng([coords.lat, coords.lng])
    } else {
      markerRef.current = L.circleMarker([coords.lat, coords.lng], {
        radius: 9,
        weight: 2,
        color: '#1d4ed8',
        fillColor: '#3b82f6',
        fillOpacity: 0.8,
      }).addTo(map)
    }
  }, [coords])

  const inputClass =
    'rounded-lg border border-zinc-300 bg-white px-3 py-2 text-sm font-normal outline-offset-[-1px] focus:outline-2 focus:outline-zinc-900'

  return (
    <div className="flex flex-col gap-3.5">
      <div className="flex flex-col gap-1.5 text-sm font-semibold">
        Pick on map
        <div
          ref={containerRef}
          className="isolate z-0 h-80 w-full rounded-lg border border-zinc-300"
        />
        <span className="font-normal text-zinc-500">
          Click the map to place the marker, or type coordinates below.
        </span>
      </div>
      <div className="flex flex-col gap-3.5 sm:flex-row sm:*:flex-1">
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Latitude
          <input
            type="number"
            name="lat"
            step="any"
            required
            value={coords?.lat ?? ''}
            onChange={(event) => {
              const lat = Number(event.target.value)
              if (!Number.isNaN(lat)) setCoords({ lat, lng: coords?.lng ?? 0 })
            }}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1.5 text-sm font-semibold">
          Longitude
          <input
            type="number"
            name="lng"
            step="any"
            required
            value={coords?.lng ?? ''}
            onChange={(event) => {
              const lng = Number(event.target.value)
              if (!Number.isNaN(lng)) setCoords({ lat: coords?.lat ?? 0, lng })
            }}
            className={inputClass}
          />
        </label>
      </div>
    </div>
  )
}
