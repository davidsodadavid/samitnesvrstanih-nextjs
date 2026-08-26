import { DesignsRotator } from './designs-rotator'
import { getRecentDesigns } from './get-recent-designs'
import { HomeCard } from './home-card'

// Sits below Exhibitions in the homepage grid's right column.
export async function HomeDesignsCard() {
  const designs = await getRecentDesigns()

  return (
    <HomeCard
      title="Designs"
      art="/designs/banner.png"
      icon="/icons/navbar/designs-black.png"
      bgColor="#7f7e38"
      className="lg:min-h-0 lg:flex-1"
    >
      <DesignsRotator items={designs} />
    </HomeCard>
  )
}
