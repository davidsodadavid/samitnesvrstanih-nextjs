// Picks readable title text for whichever accent color the section uses
// (e.g. a near-black background needs white, not the design's default black).
function readableTextColor(hex: string): string {
  const n = Number.parseInt(hex.replace('#', ''), 16)
  const r = (n >> 16) & 0xff
  const g = (n >> 8) & 0xff
  const b = n & 0xff
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255
  return luminance > 0.5 ? '#000' : '#fff'
}

// Full-bleed title bar (accent color + two corner icons) followed by the
// decorative photo strip — the shared page header used by /past-events/[id]
// and other static pages like /about.
export function SectionHeader({
  title,
  accentColor,
  icon,
  photoSrc,
  titleColor,
  cancelTopPadding = true,
}: {
  title: string
  accentColor: string
  icon?: string | null
  photoSrc: string
  // Overrides the automatic light/dark pick when a section wants a specific one.
  titleColor?: string
  // Pages that already cancel <main>'s top padding themselves (e.g. a
  // full-bleed page background) should pass false to avoid doubling it up.
  cancelTopPadding?: boolean
}) {
  return (
    <div className={`${cancelTopPadding ? '-mt-8' : ''} mx-[calc(50%-50vw)]`}>
      <div
        // Padding rather than a fixed height, so the bar sits just clear of the
        // title at whatever size the title happens to be.
        className="relative flex items-center justify-center py-2 sm:py-3"
        style={{ backgroundColor: accentColor }}
      >
        {icon && (
          <img src={icon} alt="" className="absolute left-4 h-11 w-auto sm:left-8 sm:h-14 md:left-12 md:h-18" />
        )}
        {/* Kharkiv Tone's caps sit high in the em box, so centring the text box
            leaves the letters ~0.1em above the true middle and out of line with
            the icons. The nudge is in em, so it tracks the title at every size. */}
        <h1
          className="font-display translate-y-[0.099em] text-4xl uppercase sm:text-6xl md:text-8xl"
          style={{ color: titleColor ?? readableTextColor(accentColor) }}
        >
          {title}
        </h1>
        {icon && (
          <img src={icon} alt="" className="absolute right-4 h-11 w-auto sm:right-8 sm:h-14 md:right-12 md:h-18" />
        )}
      </div>
      <img src={photoSrc} alt="" className="h-10 w-full object-cover sm:h-14 md:h-16" />
    </div>
  )
}
