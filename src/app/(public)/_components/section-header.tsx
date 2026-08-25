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
// decorative photo strip — the shared page header used by every /blog/[type]
// section and other static pages like /about.
export function SectionHeader({
  title,
  accentColor,
  icon,
  photoSrc,
  cancelTopPadding = true,
}: {
  title: string
  accentColor: string
  icon?: string | null
  photoSrc: string
  // Pages that already cancel <main>'s top padding themselves (e.g. a
  // full-bleed page background) should pass false to avoid doubling it up.
  cancelTopPadding?: boolean
}) {
  return (
    <div className={`${cancelTopPadding ? '-mt-8' : ''} mx-[calc(50%-50vw)]`}>
      <div
        className="relative flex h-24 items-center justify-center sm:h-32 md:h-40"
        style={{ backgroundColor: accentColor }}
      >
        {icon && <img src={icon} alt="" className="absolute left-4 h-8 w-auto sm:h-10 md:h-12" />}
        <h1
          className="font-display text-4xl uppercase sm:text-6xl md:text-8xl"
          style={{ color: readableTextColor(accentColor) }}
        >
          {title}
        </h1>
        {icon && <img src={icon} alt="" className="absolute right-4 h-8 w-auto sm:h-10 md:h-12" />}
      </div>
      <img src={photoSrc} alt="" className="h-10 w-full object-cover sm:h-14 md:h-16" />
    </div>
  )
}
