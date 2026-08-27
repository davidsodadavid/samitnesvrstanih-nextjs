import { getFilmVideos } from './get-film-videos'
import { HomeCard } from './home-card'
import { VideoRotator } from './video-rotator'

// Right half of the row below the photo archive, alongside DIY. Unlike its
// neighbours this one shows embeds pulled out of the events' descriptions
// rather than an image and a teaser.
export async function HomeVideoCard() {
  const videos = await getFilmVideos()

  return (
    <HomeCard title="Films" art="/film/art.png" icon="/film/video.svg" bgColor="#202020">
      <VideoRotator items={videos} />
    </HomeCard>
  )
}
