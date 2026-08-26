import { ProgramMap, type EventTypeStyle, type ProgramDay } from '../program/program-view'
import { HomeCard } from './home-card'

// Mini teaser version of /program for the homepage: same map, legend, and
// description — reusing the exact assets/components from that page — but
// without the day/type filter controls.
export function HomeProgramCard({
  days,
  eventTypes,
}: {
  days: ProgramDay[]
  eventTypes: EventTypeStyle[]
}) {
  return (
    <HomeCard
      title="Program"
      art="/program/header-photo.png"
      icon="/program/corner-icon.svg"
      bgColor="#ff3c21"
    >
      <div className="p-3 sm:p-4">
        <ProgramMap days={days} eventTypes={eventTypes} />

        <div className="mt-6 bg-black px-2 py-1">
          <p className="font-display text-base text-white sm:text-md">
            Over the course of several days, the festival spreads across different spots in
            Belgrade, bringing together skaters, artists, musicians, filmmakers, and everyone who
            wants to be part of the community. The program includes skate sessions, live music,
            exhibitions, film screenings, workshops, talks, and plenty of moments that happen
            naturally along the way.
          </p>
        </div>
      </div>
    </HomeCard>
  )
}
