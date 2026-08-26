import { ExhibitionsRotator } from './exhibitions-rotator'
import { getPastExhibitions } from './get-past-exhibitions'
import { HomeCard } from './home-card'

// Top-right card of the homepage grid: rotates through recent past exhibitions.
export async function HomeExhibitionsCard() {
  const exhibitions = await getPastExhibitions()

  return (
    <HomeCard
      title="Exhibitions"
      art="/blog/header-strip.png"
      icon="/icons/homepage/exhibition.png"
      bgColor="#acd3b6"
      className="lg:min-h-0 lg:flex-1"
    >
      <ExhibitionsRotator items={exhibitions} />
    </HomeCard>
  )
}
