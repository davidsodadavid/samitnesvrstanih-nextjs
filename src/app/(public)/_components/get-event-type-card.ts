import { prisma } from '@/lib/prisma'

export type EventTypeCard = {
  color: string
  iconUrl: string | null
  artUrl: string | null
}

/**
 * Presentation an admin has set for one event type: the panel colour, the icon
 * in the card's top-right, and the banner art behind its title.
 *
 * Matched by name (not a hardcoded id) so the type can be recreated in the
 * dashboard without breaking the card. Returns null when no such type exists —
 * the card then falls back to its design defaults rather than rendering unstyled.
 */
export async function getEventTypeCard(typeName: string): Promise<EventTypeCard | null> {
  const eventType = await prisma.eventType.findFirst({
    where: { name: { equals: typeName, mode: 'insensitive' } },
    select: {
      color: true,
      icon: { select: { url: true } },
      art: { select: { url: true } },
    },
  })

  if (!eventType) return null

  return {
    color: eventType.color,
    iconUrl: eventType.icon?.url ?? null,
    artUrl: eventType.art?.url ?? null,
  }
}
