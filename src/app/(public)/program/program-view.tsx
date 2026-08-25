'use client'

import Link from 'next/link'
import { useEffect, useMemo, useRef, useState } from 'react'
import 'leaflet/dist/leaflet.css'
import type * as Leaflet from 'leaflet'

export type ProgramEvent = {
  id: number
  timeRange: string
  title: string
  description: string
  eventType: { id: number; name: string; iconUrl: string | null; color: string }
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

// The design's buttons have almost no padding at all — text fills the box,
// border touching top/bottom of the glyphs. leading-none removes the font's
// default line-height slack; py stays at 0.
const tabClass = (active: boolean) =>
  `font-headline cursor-pointer border-4 border-black px-2 py-0 text-xl leading-none font-bold tracking-wide uppercase sm:text-2xl ${
    active ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
  }`

// Day tabs read noticeably larger than the other filter rows in the design.
const dayTabClass = (active: boolean) =>
  `font-headline cursor-pointer border-4 border-black px-3 py-0 text-3xl leading-none font-bold tracking-wide uppercase sm:text-4xl ${
    active ? 'bg-black text-white' : 'bg-white text-black hover:bg-zinc-100'
  }`

export type EventTypeStyle = { id: number; name: string; iconUrl: string | null; color: string }

// border-dashed's dash rhythm is coarse and browser-dependent — a repeating
// gradient gives the tight, even dashes the design uses instead.
export function DashedLine() {
  return (
    <div
      aria-hidden
      className="my-4 h-px mx-[calc(50%-50vw)] opacity-60"
      style={{
        backgroundImage:
          'repeating-linear-gradient(to right, white 0, white 14px, transparent 14px, transparent 24px)',
      }}
    />
  )
}

export function ProgramView({ days }: { days: ProgramDay[] }) {
  const [view, setView] = useState<'list' | 'map'>('map')
  const [dayKey, setDayKey] = useState<string | null>(null) // null = all days
  const [eventTypeId, setEventTypeId] = useState<number | null>(null) // null = all types

  const eventTypes = useMemo(() => {
    const byId = new Map<number, EventTypeStyle>()
    for (const day of days)
      for (const e of day.events) byId.set(e.eventType.id, e.eventType)
    return [...byId.values()].sort((a, b) => a.name.localeCompare(b.name))
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
      <DashedLine />

      <div className="flex flex-wrap gap-2">
        <button type="button" onClick={() => setView('map')} className={tabClass(view === 'map')}>
          Map
        </button>
        <button type="button" onClick={() => setView('list')} className={tabClass(view === 'list')}>
          Not map
        </button>
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setDayKey(null)}
          className={dayTabClass(dayKey === null)}
        >
          All days
        </button>
        {days.map((d, i) => (
          <button
            key={d.key}
            type="button"
            onClick={() => setDayKey(d.key)}
            className={dayTabClass(dayKey === d.key)}
          >
            Day {i + 1}
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

      <DashedLine />

      {filteredDays.length === 0 && (
        <p className="font-body text-white">No events match this filter.</p>
      )}

      {view === 'list' ? (
        <ProgramList days={filteredDays} />
      ) : (
        <ProgramMap days={filteredDays} eventTypes={eventTypes} />
      )}

      <DashedLine />

      <div className="bg-black px-2 py-1">
        <p className="font-display text-base text-white sm:text-md">
          Over the course of several days, the festival spreads across different spots in
          Belgrade, bringing together skaters, artists, musicians, filmmakers, and everyone who
          wants to be part of the community. The program includes skate sessions, live music,
          exhibitions, film screenings, workshops, talks, and plenty of moments that happen
          naturally along the way.
        </p>
      </div>

      <DashedLine />
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
            <Link
              key={event.id}
              href={`/program/${event.id}`}
              className={`flex flex-col gap-2 px-4 py-4 hover:bg-white/10 sm:flex-row sm:items-center sm:gap-6 ${
                j > 0 ? 'border-t border-dashed border-white/50' : ''
              }`}
            >
              <span className="font-body w-28 shrink-0 font-semibold whitespace-nowrap text-white">
                {event.timeRange}
              </span>
              {event.eventType.iconUrl && (
                <img
                  src={event.eventType.iconUrl}
                  alt={event.eventType.name}
                  title={event.eventType.name}
                  className="h-8 w-8 shrink-0 object-contain"
                />
              )}
              <p className="font-body min-w-0 flex-1 font-bold text-white">{event.title}</p>
              <span className="font-body text-right font-semibold text-white sm:w-64 sm:shrink-0">
                {event.location.name}
              </span>
            </Link>
          ))}
        </div>
      ))}
    </div>
  )
}

// Teardrop pin colored per event type, with a black backing circle and the
// type's icon shown in its own native colors on top (no color filter).
export function pinIcon(L: typeof Leaflet, color: string, iconUrl: string | null) {
  const r = 25 // head radius
  const h = 81 // total pin height
  const d = r * 2 // head diameter
  const innerR = 19 // black inner circle radius
  const iconSize = 27
  const iconOffset = r - iconSize / 2

  const icon = iconUrl
    ? `<img src="${iconUrl}" style="position:absolute;top:${iconOffset}px;left:${iconOffset}px;width:${iconSize}px;height:${iconSize}px;object-fit:contain;border-radius:50%;" />`
    : ''
  return L.divIcon({
    className: '',
    html:
      `<div style="position:relative;width:${d}px;height:${h}px;">` +
      `<svg width="${d}" height="${h}" viewBox="0 0 ${d} ${h}" xmlns="http://www.w3.org/2000/svg">` +
      // straight tangent lines from the tip to the circle (not bezier curves
      // that bulge past the circle's own width), with the tip corner itself
      // rounded off via a small quadratic curve instead of a sharp point
      `<path d="M21.4 73.8Q25 81 28.6 73.8L47.4 36.2A25 25 0 1 0 2.6 36.2Z" fill="${color}" stroke="black" stroke-width="2"/>` +
      `<circle cx="${r}" cy="${r}" r="${innerR}" fill="black"/>` +
      `</svg>${icon}</div>`,
    iconSize: [d, h],
    iconAnchor: [r, 78],
    popupAnchor: [0, -78],
  })
}

function ProgramMap({ days, eventTypes }: { days: ProgramDay[]; eventTypes: EventTypeStyle[] }) {
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
      L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
        attribution:
          '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
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

    const styleByTypeId = new Map(eventTypes.map((t) => [t.id, t]))
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
      // Multiple events can share a location — pin color/icon come from the first one.
      const style = styleByTypeId.get(events[0].eventType.id)
      const marker = L.marker([location.lat, location.lng], {
        icon: pinIcon(L, style?.color ?? '#3b82f6', style?.iconUrl ?? null),
      }).addTo(map)
      // One popup per location listing every matching event held there;
      // the whole row links to the event page, not just the title. Locations
      // can host a lot of events, so keep text and padding tight and widen
      // the popup (default Leaflet maxWidth is 300) so it doesn't get tall.
      marker.bindPopup(
        `<div class="w-[280px]">` +
          `<div class="bg-[#ff3c21] px-2.5 py-1.5 pr-7">` +
          `<span class="font-headline text-xs font-bold text-black uppercase">${escapeHtml(location.name)}</span>` +
          `</div>` +
          `<div class="font-body flex flex-col text-xs">` +
          events
            .map(
              (event, i) =>
                `<a href="/program/${event.id}" class="px-2.5 py-1${i > 0 ? ' border-t border-white/20' : ''}">` +
                `<span class="font-semibold">${event.timeRange}</span> — ${escapeHtml(event.title)}</a>`,
            )
            .join('') +
          `</div>` +
          `</div>`,
        { maxWidth: 320, minWidth: 280 },
      )
      markersRef.current.push(marker)
      points.push([location.lat, location.lng])
    }

    if (points.length === 1) map.setView(points[0], 15)
    else if (points.length > 1) map.fitBounds(points, { padding: [40, 40] })
  }, [days, eventTypes, mapReady])

  return (
    <div className="flex flex-col gap-9">
      <div
        ref={containerRef}
        className="isolate z-0 h-96 w-full border border-black sm:h-120"
      />
      {eventTypes.length > 0 && (
        <div className="grid grid-cols-1 gap-px bg-white sm:grid-cols-2">
          {eventTypes.map((t, i) => (
            <div
              key={t.id}
              className={`flex items-stretch gap-3 bg-black ${
                i === eventTypes.length - 1 && eventTypes.length % 2 === 1 ? 'sm:col-span-2' : ''
              }`}
            >
              <span
                className="flex w-20 shrink-0 items-center justify-center"
                style={{ backgroundColor: t.color }}
              >
                {t.iconUrl && (
                  <img src={t.iconUrl} alt="" className="h-12 w-12 object-contain" />
                )}
              </span>
              <span className="font-display flex items-center py-4 text-base text-white uppercase">
                {t.name}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
