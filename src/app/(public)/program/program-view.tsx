'use client'

import { useEffect, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'

export type ProgramEvent = {
  id: number
  timeRange: string
  title: string
  location: { id: number; name: string; lat: number; lng: number }
}

export type ProgramDay = { key: string; label: string; events: ProgramEvent[] }

function escapeHtml(text: string): string {
  return text
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

export function ProgramView({ days }: { days: ProgramDay[] }) {
  const [active, setActive] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)
  const mapRef = useRef<Leaflet.Map | null>(null)
  const leafletRef = useRef<typeof Leaflet | null>(null)
  const markersRef = useRef<Leaflet.Layer[]>([])
  const [mapReady, setMapReady] = useState(false)

  useEffect(() => {
    let cancelled = false
    // Leaflet touches `window` on import, so it can only load in the browser
    void import('leaflet').then((L) => {
      if (cancelled || !containerRef.current || mapRef.current) return
      leafletRef.current = L
      const map = L.map(containerRef.current)
      L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map)
      mapRef.current = map
      setMapReady(true)
    })

    return () => {
      cancelled = true
      mapRef.current?.remove()
      mapRef.current = null
      markersRef.current = []
    }
  }, [])

  // Swap pins whenever the active day changes (or once the map finishes loading)
  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    const day = days[active]
    if (!L || !map || !day) return

    for (const marker of markersRef.current) marker.remove()
    markersRef.current = []

    const byLocation = new Map<
      number,
      { location: ProgramEvent['location']; events: ProgramEvent[] }
    >()
    for (const event of day.events) {
      const entry = byLocation.get(event.location.id)
      if (entry) entry.events.push(event)
      else byLocation.set(event.location.id, { location: event.location, events: [event] })
    }

    const points: [number, number][] = []
    for (const { location, events } of byLocation.values()) {
      const marker = L.circleMarker([location.lat, location.lng], {
        radius: 9,
        weight: 2,
        color: '#1d4ed8',
        fillColor: '#3b82f6',
        fillOpacity: 0.8,
      }).addTo(map)
      // One popup per location listing every event held there that day;
      // the title links to the event page
      marker.bindPopup(
        `<strong>${escapeHtml(location.name)}</strong>` +
          `<div style="margin-top:8px">` +
          events
            .map(
              (event) =>
                `${event.timeRange} — <a href="/program/${event.id}" class="underline">${escapeHtml(event.title)}</a>`,
            )
            .join('<br>') +
          `</div>`,
      )
      markersRef.current.push(marker)
      points.push([location.lat, location.lng])
    }

    if (points.length === 1) map.setView(points[0], 15)
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40] })
  }, [active, days, mapReady])

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        {days.map((d, i) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setActive(i)}
            className={`cursor-pointer rounded-lg px-3.5 py-2 text-sm font-semibold ${
              i === active
                ? 'bg-zinc-900 text-white'
                : 'border border-zinc-300 bg-white hover:bg-zinc-50'
            }`}
          >
            {d.label}
          </button>
        ))}
      </div>

      <div
        ref={containerRef}
        className="isolate z-0 h-96 w-full rounded-xl border border-zinc-200 sm:h-120"
      />
    </div>
  )
}
