// Spacing matches the Figma "END" component (node 8:562) measured against its
// 1920px-wide desktop frame: vector rendered near its native 759x69 size,
// ~113px above it, an 86.5px gap to the copyright line, ~44px below.
export function Footer() {
  return (
    <footer className="bg-black px-4 pt-12 pb-11 text-center sm:px-0 sm:pt-28">
      <img
        src="/footer.svg"
        alt="10-13 September"
        className="mx-auto h-auto w-full max-w-[360px] sm:max-w-[600px]"
      />
      <p className="font-display mt-10 text-xs text-white sm:mt-[87px] sm:text-sm">
        © Summit Of The Non Aligned 2026
      </p>
    </footer>
  )
}
