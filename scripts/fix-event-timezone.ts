// One-time correction for events that were created through the production
// dashboard before the Europe/Belgrade timezone fix. Those events were saved
// 2 hours behind what was actually selected (the server's OS timezone, UTC,
// was used to interpret the datetime-local value instead of Europe/Belgrade).
//
// Usage:
//   pnpm dlx tsx scripts/fix-event-timezone.ts            # dry run — prints only
//   pnpm dlx tsx scripts/fix-event-timezone.ts --apply     # actually updates rows
import 'dotenv/config'
import { prisma } from '../src/lib/prisma'

const SHIFT_MS = 2 * 60 * 60 * 1000
const apply = process.argv.includes('--apply')

async function main() {
  const events = await prisma.event.findMany({ orderBy: { start_at: 'asc' } })

  if (events.length === 0) {
    console.log('No events found.')
    return
  }

  for (const event of events) {
    const newStart = new Date(event.start_at.getTime() + SHIFT_MS)
    const newEnds = new Date(event.ends_at.getTime() + SHIFT_MS)
    console.log(
      `#${event.id} ${event.title}\n` +
        `  start: ${event.start_at.toISOString()} -> ${newStart.toISOString()}\n` +
        `  ends:  ${event.ends_at.toISOString()} -> ${newEnds.toISOString()}`,
    )
    if (apply) {
      await prisma.event.update({
        where: { id: event.id },
        data: { start_at: newStart, ends_at: newEnds },
      })
    }
  }

  console.log(apply ? `\nUpdated ${events.length} event(s).` : `\nDry run only — ${events.length} event(s) would change. Re-run with --apply to write.`)
}

main()
  .catch((err) => {
    console.error(err)
    process.exitCode = 1
  })
  .finally(() => prisma.$disconnect())
