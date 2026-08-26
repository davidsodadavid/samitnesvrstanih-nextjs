// border-dashed's dash rhythm is coarse and browser-dependent — a repeating
// gradient gives the tight, even dashes the design uses instead.
export function DashedLine({
  color = 'black',
  className = 'my-8',
}: {
  color?: string
  className?: string
}) {
  return (
    <div
      aria-hidden
      className={`h-px mx-[calc(50%-50vw)] ${className}`}
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 14px, transparent 14px, transparent 24px)`,
      }}
    />
  )
}
