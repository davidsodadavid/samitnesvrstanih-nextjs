import { getPastEventsByType } from './get-past-events-by-type'
import { HomeCard } from './home-card'
import { PastEventsRotator } from './past-events-rotator'

const DIY_TYPE_NAME = 'diy'

// Left half of the row below the photo archive — same shape as Exhibitions,
// pointed at a different event type.
export async function HomeDiyCard() {
  const events = await getPastEventsByType(DIY_TYPE_NAME)

  return (
    <HomeCard title="DIY" art="/diy/art.png" icon="/diy/hammer.svg" bgColor="#7978b1">
      <PastEventsRotator items={events} />
    </HomeCard>
  )
}
