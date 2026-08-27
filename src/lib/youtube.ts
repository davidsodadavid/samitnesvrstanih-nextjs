// Matches a YouTube video id in any of the shapes an event description might
// carry it: a pasted watch URL, a share link, a markdown link target, or the
// src of an <iframe> embed. The id itself is always 11 url-safe characters.
const YOUTUBE_URL =
  /(?:youtube(?:-nocookie)?\.com\/(?:watch\?(?:[^"'\s]*&)?v=|embed\/|shorts\/|live\/|v\/)|youtu\.be\/)([\w-]{11})/

/**
 * Pulls the first YouTube video id out of a block of text, ignoring whatever
 * else surrounds it — descriptions mix prose and the embed freely.
 */
export function extractYouTubeId(text: string): string | null {
  return text.match(YOUTUBE_URL)?.[1] ?? null
}

/** Thumbnail YouTube generates for every video; 4:3 with bars a 16:9 crop removes. */
export function youTubeThumbnailUrl(videoId: string): string {
  return `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`
}

export function youTubeWatchUrl(videoId: string): string {
  return `https://www.youtube.com/watch?v=${videoId}`
}

/** nocookie host so an unplayed card doesn't set tracking cookies. */
export function youTubeEmbedUrl(videoId: string): string {
  return `https://www.youtube-nocookie.com/embed/${videoId}?autoplay=1&rel=0`
}
