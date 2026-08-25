// Event times are entered/displayed in the festival's own timezone, not the
// server's. `datetime-local` inputs carry no timezone info, so parsing them
// with plain `new Date()` (and formatting with `getTimezoneOffset()`) silently
// uses whatever OS timezone the running process happens to have — which
// differs between a local dev machine and the production host and causes the
// stored time to drift by the difference between the two.
export const EVENT_TIME_ZONE = 'Europe/Belgrade'

// Interpret a "YYYY-MM-DDTHH:mm" datetime-local value as wall-clock time in
// `timeZone`, returning the corresponding instant.
export function parseLocalDateTime(value: string, timeZone: string): Date {
  const match = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2})/.exec(value)
  if (!match) return new Date(NaN)
  const [year, month, day, hour, minute] = match.slice(1).map(Number)

  // Guess the instant as if the wall-clock value were UTC, measure how far
  // that guess actually lands from the target timezone, then correct for it.
  const utcGuess = Date.UTC(year, month - 1, day, hour, minute)
  const formatter = new Intl.DateTimeFormat('en-US', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
    second: '2-digit',
  })
  const parts = Object.fromEntries(formatter.formatToParts(utcGuess).map((p) => [p.type, p.value]))
  const asUtc = Date.UTC(
    Number(parts.year),
    Number(parts.month) - 1,
    Number(parts.day),
    Number(parts.hour),
    Number(parts.minute),
    Number(parts.second),
  )
  return new Date(utcGuess - (asUtc - utcGuess))
}

// Format an instant as a "YYYY-MM-DDTHH:mm" datetime-local value in `timeZone`.
export function formatLocalDateTime(date: Date, timeZone: string): string {
  const formatter = new Intl.DateTimeFormat('en-CA', {
    timeZone,
    hourCycle: 'h23',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
    hour: '2-digit',
    minute: '2-digit',
  })
  const parts = Object.fromEntries(formatter.formatToParts(date).map((p) => [p.type, p.value]))
  return `${parts.year}-${parts.month}-${parts.day}T${parts.hour}:${parts.minute}`
}
