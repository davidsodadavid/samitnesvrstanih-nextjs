import Image from 'next/image'

export default function HomePage() {
  return (
    <div className="relative left-1/2 -mt-8 -mb-8 min-h-screen w-screen -translate-x-1/2 bg-black pb-8">
      {/* Flattened export from Figma (photo + decorative marks — all static),
          with the title and date kept as real text for SEO/crawlability. */}
      <div className="relative">
        <Image
          src="/hero/hero-bg.png"
          alt=""
          width={1920}
          height={739}
          priority
          style={{ width: '100%', height: 'auto' }}
        />
        <h1
          className="font-display absolute top-[40.76%] left-[4.85%] leading-[0.8] text-white uppercase"
          style={{ fontSize: 'clamp(1.75rem, 6.78vw, 8.125rem)' }}
        >
          <span className="block">Samit</span>
          <span className="block">Nesvrstanih</span>
        </h1>
        <p
          className="font-display absolute top-[92.65%] left-[41.3%] w-[19.76%] text-center whitespace-nowrap text-white"
          style={{ fontSize: 'clamp(0.625rem, 1.41vw, 1.6875rem)' }}
        >
          10-13. Septeber 2026
        </p>
      </div>
    </div>
  )
}
