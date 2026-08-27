// Advance width of "ANIVERSERY" at font-size 1em in Kharkiv Tone, measured from
// src/app/fonts/KharkivTone-Regular.ttf. Dividing the column's inline size by it
// gives the font size at which the word spans the column exactly, so the
// headline stays edge-to-edge at every viewport the way the design shows it.
// Re-measure if the wording changes.
const HEADLINE_EM_WIDTH = 8.238

export function HomeAnniversary() {
  return (
    // container-type makes 100cqw resolve to this element's content box, which
    // is what the headline is sized against.
    <section className="mx-auto max-w-7xl px-4" style={{ containerType: 'inline-size' }}>
      {/* The padding pushes the headline down without moving the tally marks:
          absolutely positioned children resolve against the padding box, so
          the marks stay pinned to the top edge just under the dashed line. */}
      <div
        className="relative pt-6 sm:pt-8"
        style={{ fontSize: `calc(100cqw / ${HEADLINE_EM_WIDTH})` }}
      >
        {/* Tally marks sit in the gap the shorter, right-aligned first line
            leaves open, pinned just under the dashed line above. Sized in em so
            they track the headline at every width; 0.73em keeps them clear of
            line two's caps even before the padding above is taken into account. */}
        <img
          src="/2%20zips.svg"
          alt=""
          aria-hidden
          className="absolute top-[-0.044em] left-[0.15em] h-[0.73em] w-auto"
        />

        <h2 className="font-display text-right leading-[0.85] text-white uppercase">
          <span className="block whitespace-nowrap">10 Year</span>
          <span className="block whitespace-nowrap">Aniversery</span>
        </h2>
      </div>

      <div className="mt-6 flex flex-col gap-2 sm:mt-8 sm:flex-row sm:items-end sm:justify-between sm:gap-8">
        <p className="font-display max-w-md text-xs leading-snug text-white sm:text-sm lg:max-w-2xl">
          Everything is open to the public, with the full schedule announced as the festival
          approaches. As always, expect a mix of planned events and spontaneous
          gatherings&mdash;because that&apos;s what the summit has always been about.
        </p>

        <p className="font-display shrink-0 text-xs text-white/70 sm:text-right sm:text-sm">
          2017 - first year of samit
        </p>
      </div>
    </section>
  )
}
