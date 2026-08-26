// iOS opens Apple Maps by default; everywhere else (Android, desktop) Google
// Maps' directions URL opens the app if installed, else falls back to web.
export function getDirectionsUrl(lat: number, lng: number): string {
  const isIOS = typeof navigator !== 'undefined' && /iPhone|iPad|iPod/.test(navigator.userAgent)
  return isIOS
    ? `https://maps.apple.com/?daddr=${lat},${lng}`
    : `https://www.google.com/maps/dir/?api=1&destination=${lat},${lng}`
}
