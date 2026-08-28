import { getProgramDays } from './get-program-days'
import { ProgramView } from './program-view'

export const dynamic = 'force-dynamic'

export function ProgramHeader() {
  return (
    <>
      <div className="relative flex h-24 items-center justify-center bg-black sm:h-32 md:h-40">
        <img
          src="/program/corner-icon.svg"
          alt=""
          className="absolute left-4 h-10 w-auto sm:h-14 md:h-16"
        />
        <h1 className="font-display text-4xl text-white uppercase sm:text-6xl md:text-8xl">
          Program
        </h1>
        <img
          src="/program/corner-icon.svg"
          alt=""
          className="absolute right-4 h-10 w-auto sm:h-14 md:h-16"
        />
      </div>
      <img src="/program/header-photo.png" alt="" className="h-10 w-full object-cover sm:h-14 md:h-16" />
    </>
  )
}

export default async function ProgramPage() {
  const days = await getProgramDays()

  if (days.length === 0) {
    return (
      <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-[#ff3c21]">
        <ProgramHeader />
        <p className="px-4 py-8 text-white">No program yet.</p>
      </div>
    )
  }

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-[#ff3c21]">
      <ProgramHeader />
      <div className="mx-auto max-w-5xl px-4 py-8">
        <ProgramView days={days} />
      </div>
    </div>
  )
}
