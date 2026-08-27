import { getPastEventsByType } from './get-past-events-by-type'
import { HomeCard } from './home-card'
import { PastEventsRotator } from './past-events-rotator'

const EXHIBITION_TYPE_NAME = 'exhibition'

// Top-right card of the homepage grid: rotates through recent past exhibitions.
export async function HomeExhibitionsCard() {
  const exhibitions = await getPastEventsByType(EXHIBITION_TYPE_NAME)

  return (
    <HomeCard
      title="Exhibitions"
      art="/blog/header-strip.png"
      icon="/icons/homepage/exhibition.png"
      bgColor="#acd3b6"
      className="lg:min-h-0 lg:flex-1"
    >
      <PastEventsRotator items={exhibitions} />
    </HomeCard>
  )
}
