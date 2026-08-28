import { Footer } from './_components/footer'
import { Navbar } from './_components/navbar'

// The navbar's PAST EVENTS dropdown is built from the database, so every page
// under this layout has to render at request time — prerendering them at build
// time would need a database connection the build environment doesn't have.
export const dynamic = 'force-dynamic'

export default function PublicLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      {/* A flex column so a page's full-bleed colour panel can fill whatever
          height is left over, instead of claiming a viewport of its own. */}
      <main className="mx-auto flex w-full max-w-5xl flex-1 flex-col px-4 py-8">{children}</main>
      <Footer />
    </div>
  )
}
