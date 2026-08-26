import Link from 'next/link'
import { prisma } from '@/lib/prisma'

export default async function DashboardHome() {
  const [galleries, events, eventTypes, locations, photos, designs, images, sponsors] =
    await Promise.all([
      prisma.gallery.count(),
      prisma.event.count(),
      prisma.eventType.count(),
      prisma.location.count(),
      prisma.photo.count(),
      prisma.design.count(),
      prisma.image.count(),
      prisma.sponsor.count(),
    ])

  const stats = [
    { href: '/dashboard/galleries', label: 'Galleries', value: galleries },
    { href: '/dashboard/events', label: 'Events', value: events },
    { href: '/dashboard/event-types', label: 'Event types', value: eventTypes },
    { href: '/dashboard/locations', label: 'Locations', value: locations },
    { href: '/dashboard/photos', label: 'Photos', value: photos },
    { href: '/dashboard/designs', label: 'Designs', value: designs },
    { href: '/dashboard/images', label: 'Images', value: images },
    { href: '/dashboard/sponsors', label: 'Sponsors', value: sponsors },
  ]

  return (
    <>
      <h1 className="mb-5 text-2xl font-bold">Overview</h1>
      <div className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-3.5">
        {stats.map((stat) => (
          <Link
            key={stat.href}
            href={stat.href}
            className="rounded-xl border border-zinc-200 bg-white p-4 hover:border-zinc-400"
          >
            <p className="text-2xl font-bold">{stat.value}</p>
            <p className="mt-0.5 text-sm text-zinc-500">{stat.label}</p>
          </Link>
        ))}
      </div>
    </>
  )
}
