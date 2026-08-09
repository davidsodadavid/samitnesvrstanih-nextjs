// border-dashed's dash rhythm is coarse and browser-dependent — a repeating
// gradient gives the tight, even dashes the design uses instead.
export function DashedLine({ color = 'black' }: { color?: string }) {
  return (
    <div
      aria-hidden
      className="my-8 h-px mx-[calc(50%-50vw)]"
      style={{
        backgroundImage: `repeating-linear-gradient(to right, ${color} 0, ${color} 14px, transparent 14px, transparent 24px)`,
      }}
    />
  )
}
