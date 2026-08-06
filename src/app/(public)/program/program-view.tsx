'use client'

import { useEffect, useMemo, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'

export type ProgramEvent = {
  id: number
  timeRange: string
  title: string
  description: string
  eventType: { id: number; name: string }
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

const tabClass = (active: boolean) =>
  `font-headline cursor-pointer rounded-md border-2 border-black px-4 py-2 text-sm font-bold tracking-wide uppercase ${
    active ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
  }`

export function ProgramView({ days }: { days: ProgramDay[] }) {
  const [view, setView] = useState<'list' | 'map'>('list')
  const [dayKey, setDayKey] = useState<string | null>(null) // null = all days
  const [eventTypeId, setEventTypeId] = useState<number | null>(null) // null = all types

  const eventTypes = useMemo(() => {
    const byId = new Map<number, string>()
    for (const day of days) for (const e of day.events) byId.set(e.eventType.id, e.eventType.name)
    return [...byId.entries()]
      .map(([id, name]) => ({ id, name }))
      .sort((a, b) => a.name.localeCompare(b.name))
  }, [days])

  const filteredDays = useMemo(
    () =>
      days
        .filter((d) => dayKey === null || d.key === dayKey)
        .map((d) => ({
          ...d,
          events: d.events.filter((e) => eventTypeId === null || e.eventType.id === eventTypeId),
        }))
        .filter((d) => d.events.length > 0),
    [days, dayKey, eventTypeId],
  )

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setView('list')} className={tabClass(view === 'list')}>
          Not map
        </button>
        <button type="button" onClick={() => setView('map')} className={tabClass(view === 'map')}>
          Map
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setDayKey(null)} className={tabClass(dayKey === null)}>
          All days
        </button>
        {days.map((d) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDayKey(d.key)}
            className={tabClass(dayKey === d.key)}
          >
            {d.label}
          </button>
        ))}
      </div>

      {eventTypes.length > 0 && (
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setEventTypeId(null)}
            className={tabClass(eventTypeId === null)}
          >
            All
          </button>
          {eventTypes.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setEventTypeId(t.id)}
              className={tabClass(eventTypeId === t.id)}
            >
              {t.name}
            </button>
          ))}
        </div>
      )}

      {filteredDays.length === 0 && (
        <p className="font-body text-white">No events match this filter.</p>
      )}

      {view === 'list' ? (
        <ProgramList days={filteredDays} />
      ) : (
        <ProgramMap days={filteredDays} />
      )}
    </div>
  )
}

function ProgramList({ days }: { days: ProgramDay[] }) {
  return (
    <div className="flex flex-col">
      {days.map((day, i) => (
        <div key={day.key}>
          <div className="flex items-baseline justify-between gap-4 bg-black px-4 py-3">
            <span className="font-headline text-2xl font-bold text-white uppercase sm:text-3xl">
              Day {i + 1}
            </span>
            <span className="font-headline text-lg font-bold text-white uppercase sm:text-xl">
              {day.label}
            </span>
          </div>
          {day.events.map((event, j) => (
            <div
              key={event.id}
              className={`flex flex-col gap-2 px-4 py-4 sm:flex-row sm:items-start sm:gap-6 ${
                j > 0 ? 'border-t border-dashed border-white/50' : ''
              }`}
            >
              <span className="font-body w-24 shrink-0 font-semibold text-white">
                {event.timeRange}
              </span>
              <div className="font-body min-w-0 flex-1 text-white">
                <p className="font-bold">{event.title}</p>
                {event.description && (
                  <p className="mt-1 whitespace-pre-wrap text-white/80">{event.description}</p>
                )}
              </div>
              <span className="font-body text-right font-semibold text-white sm:w-64 sm:shrink-0">
                {event.location.name}
              </span>
            </div>
          ))}
        </div>
      ))}
    </div>
  )
}

function ProgramMap({ days }: { days: ProgramDay[] }) {
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

  // Swap pins whenever the filtered event set changes (or once the map loads)
  useEffect(() => {
    const L = leafletRef.current
    const map = mapRef.current
    if (!L || !map) return

    for (const marker of markersRef.current) marker.remove()
    markersRef.current = []

    const byLocation = new Map<
      number,
      { location: ProgramEvent['location']; events: ProgramEvent[] }
    >()
    for (const day of days) {
      for (const event of day.events) {
        const entry = byLocation.get(event.location.id)
        if (entry) entry.events.push(event)
        else byLocation.set(event.location.id, { location: event.location, events: [event] })
      }
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
      // One popup per location listing every matching event held there;
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
  }, [days, mapReady])

  return (
    <div
      ref={containerRef}
      className="isolate z-0 h-96 w-full rounded-xl border border-zinc-200 sm:h-120"
    />
  )
}
