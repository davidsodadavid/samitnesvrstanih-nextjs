// Shared shell for the homepage's section cards (Program, Exhibitions,
// Designs): colored panel with a black border, a title bar whose height is set
// by the title chip itself (the decorative art fills exactly that height, the
// section icon sits on top of it at the right), then the static date line.
export function HomeCard({
  title,
  art,
  icon,
  bgColor,
  className,
  children,
}: {
  title: string
  // Null for an event-type card whose art or icon hasn't been uploaded yet.
  art?: string | null
  icon?: string | null
  bgColor: string
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      className={`flex flex-col border-4 border-black sm:border-7 ${className ?? ''}`}
      style={{ backgroundColor: bgColor }}
    >
      <div className="relative flex">
        {art && <img src={art} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <h2 className="font-display relative z-10 flex items-center bg-black px-3 py-1 text-3xl text-white uppercase sm:text-5xl">
          {title}
        </h2>
        {icon && (
          <div className="relative z-10 ml-auto flex items-center px-3">
            <img src={icon} alt="" className="h-8 w-auto sm:h-10" />
          </div>
        )}
      </div>

      <div className="py-1.5">
        <span className="font-display inline-block bg-black px-3 py-1.5 text-sm text-white uppercase sm:text-base">
          Belgrade / 10-13 September 2026
        </span>
      </div>

      {/* Grows to fill the card on desktop so a column of cards can be
          stretched to match its neighbour's height. */}
      {children && <div className="flex flex-col lg:min-h-0 lg:flex-1">{children}</div>}
    </div>
  )
}
