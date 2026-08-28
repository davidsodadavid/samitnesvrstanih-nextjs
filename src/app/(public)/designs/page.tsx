import { DashedLine } from '../_components/dashed-line'
import { navItems } from '../_components/nav-items'
import { SectionHeader } from '../_components/section-header'
import { fetchDesigns } from './actions'
import { DesignList } from './design-list'

// Content is edited in the dashboard — always render fresh.
export const dynamic = 'force-dynamic'

export default async function DesignsPage() {
  const firstPage = await fetchDesigns()
  const navItem = navItems
    .filter((item) => item.type === 'group')
    .flatMap((group) => group.items)
    .find((item) => item.href === '/designs')

  return (
    <div className="relative left-1/2 -mt-8 -mb-8 flex-1 w-screen -translate-x-1/2 bg-black">
      <SectionHeader
        title="Designs"
        accentColor={navItem?.accentColor ?? '#78793a'}
        icon="/designs/icon.png"
        photoSrc="/designs/banner.png"
        titleColor="#000"
        cancelTopPadding={false}
      />

      <div className="mx-auto max-w-5xl px-4 py-8">
        <DashedLine color="white" className="my-8 opacity-30" />

        <DesignList initial={firstPage} />

        <DashedLine color="white" className="my-8 opacity-30" />
      </div>
    </div>
  )
}
