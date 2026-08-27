import { getArchivePhotos } from './get-archive-photos'
import { HomeCard } from './home-card'
import { PhotoArchiveRotator } from './photo-archive-rotator'

// Full-width card below the anniversary section.
export async function HomePhotoArchiveCard() {
  const archive = await getArchivePhotos()
  if (!archive) return null

  return (
    <HomeCard
      title="Photo Archive"
      art="/galleries/header-strip.png"
      icon="/galleries/photo-camera.svg"
      bgColor="#6e9985"
    >
      <PhotoArchiveRotator photos={archive.photos} year={archive.year} />
    </HomeCard>
  )
}
