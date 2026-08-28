/**
 * Event types the homepage has a dedicated card for. The cards look their type
 * up by name, so renaming or deleting one silently empties a homepage section —
 * which is why the dashboard locks these three against both.
 *
 * Names are compared case-insensitively, matching how the cards query.
 */
export const EXHIBITIONS_TYPE = 'exhibitions'
export const DIY_TYPE = 'diy'
export const FILMS_TYPE = 'films'

export const HOMEPAGE_EVENT_TYPES = [EXHIBITIONS_TYPE, DIY_TYPE, FILMS_TYPE]

export function isHomepageEventType(name: string): boolean {
  return HOMEPAGE_EVENT_TYPES.includes(name.trim().toLowerCase())
}
