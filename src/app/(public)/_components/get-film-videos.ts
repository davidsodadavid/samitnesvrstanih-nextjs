import { prisma } from '@/lib/prisma'
import { extractYouTubeId } from '@/lib/youtube'

export type FilmVideo = {
  id: number
  title: string
  videoId: string
}

/**
 * Events of one type whose description contains a YouTube link, newest first.
 *
 * The type is matched by name rather than a hardcoded id, so it can be deleted
 * and recreated in the dashboard without breaking the card.
 *
 * Unlike the other homepage cards this isn't restricted to past events: what
 * makes a film event showable here is having a video, not having happened.
 * Descriptions mix prose with the embed, so the id is scanned for rather than
 * parsed out of a known position, and events without one drop off the list.
 */
export async function getFilmVideos(typeName: string, limit = 6): Promise<FilmVideo[]> {
  const events = await prisma.event.findMany({
    where: { event_type: { name: { equals: typeName, mode: 'insensitive' } } },
    orderBy: { start_at: 'desc' },
    select: { id: true, title: true, description: true },
  })

  return events
    .map((event) => ({
      id: event.id,
      title: event.title,
      videoId: extractYouTubeId(event.description),
    }))
    .filter((video): video is FilmVideo => video.videoId !== null)
    .slice(0, limit)
}
