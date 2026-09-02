import { EXHIBITIONS_TYPE } from '@/lib/homepage-event-types'
import { EventTeaserRotator } from './event-teaser-rotator'
import { getEventTypeCard } from './get-event-type-card'
import { getLatestEventsByType } from './get-events-by-type'
import { HomeCard } from './home-card'

// Only used until the type exists in the dashboard; after that the admin's
// colour wins, and the icon and art come from there too.
const FALLBACK_COLOR = '#acd3b6'

// Top-right card of the homepage grid: rotates through the latest exhibitions,
// upcoming ones included.
export async function HomeExhibitionsCard() {
  const [exhibitions, style] = await Promise.all([
    getLatestEventsByType(EXHIBITIONS_TYPE),
    getEventTypeCard(EXHIBITIONS_TYPE),
  ])

  return (
    <HomeCard
      title="Exhibitions"
      art={style?.artUrl}
      icon={style?.iconUrl}
      bgColor={style?.color ?? FALLBACK_COLOR}
      className="lg:min-h-0 lg:flex-1"
    >
      <EventTeaserRotator items={exhibitions} stretch />
    </HomeCard>
  )
}
