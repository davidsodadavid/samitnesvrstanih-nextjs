import { FILMS_TYPE } from '@/lib/homepage-event-types'
import { getEventTypeCard } from './get-event-type-card'
import { getFilmVideos } from './get-film-videos'
import { HomeCard } from './home-card'
import { VideoRotator } from './video-rotator'

// Only used until the type exists in the dashboard.
const FALLBACK_COLOR = '#202020'

// Right half of the row below the photo archive, alongside DIY. Unlike its
// neighbours this one shows embeds pulled out of the events' descriptions
// rather than an image and a teaser.
export async function HomeVideoCard() {
  const [videos, style] = await Promise.all([
    getFilmVideos(FILMS_TYPE),
    getEventTypeCard(FILMS_TYPE),
  ])

  return (
    <HomeCard
      title="Films"
      art={style?.artUrl}
      icon={style?.iconUrl}
      bgColor={style?.color ?? FALLBACK_COLOR}
    >
      <VideoRotator items={videos} />
    </HomeCard>
  )
}
