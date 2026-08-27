// Spacing is carried over from the Figma "END" component (node 8:562), which
// was measured against a 759x69 wordmark. The artwork is now a 637x378 lockup
// (emblem over the Beograd/date lines), so it sits far taller than the strip
// those gaps were tuned around.
export function Footer() {
  return (
    <footer className="bg-black px-4 pt-12 pb-11 text-center sm:px-0 sm:pt-28">
      <img
        src="/belgrade-footer.png"
        alt="Beograd 10-13/9/2026"
        className="mx-auto h-auto w-full max-w-[360px] sm:max-w-[600px]"
      />
      <p className="font-display mt-10 text-xs text-white sm:mt-[87px] sm:text-sm">
        © Summit Of The Non-Aligned 2026
      </p>
    </footer>
  )
}
