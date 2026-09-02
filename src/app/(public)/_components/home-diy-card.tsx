import { DIY_TYPE } from '@/lib/homepage-event-types'
import { EventTeaserRotator } from './event-teaser-rotator'
import { getEventTypeCard } from './get-event-type-card'
import { getLatestEventsByType } from './get-events-by-type'
import { HomeCard } from './home-card'

// Only used until the type exists in the dashboard.
const FALLBACK_COLOR = '#7978b1'

// Left half of the row below the photo archive — same shape as Exhibitions,
// pointed at a different event type.
export async function HomeDiyCard() {
  const [events, style] = await Promise.all([
    getLatestEventsByType(DIY_TYPE),
    getEventTypeCard(DIY_TYPE),
  ])

  return (
    <HomeCard
      title="DIY"
      art={style?.artUrl}
      icon={style?.iconUrl}
      bgColor={style?.color ?? FALLBACK_COLOR}
    >
      <EventTeaserRotator items={events} />
    </HomeCard>
  )
}
