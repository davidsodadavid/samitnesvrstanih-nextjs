export type NavLink = {
  type: 'link'
  label: string
  href: string | null
  desktopIcon: string
  mobileIcon: string
  accentColor: string
}

export type NavGroupItem = {
  label: string
  href: string | null
  accentColor: string
  // Only some content types have a dedicated icon asset today — the section
  // header just omits the icon when this is unset.
  icon?: string
}

export type NavGroup = {
  type: 'group'
  label: string
  desktopIcon: string
  mobileIcon: string
  accentColor: string
  items: NavGroupItem[]
}

export type NavEntry = NavLink | NavGroup

// Site brand link shown at the far left of the navbar, separate from the
// centered nav items — always points home.
export const siteBrand = { label: 'Summit Of The Non-Aligned', href: '/' }

export const navItems: NavEntry[] = [
  {
    type: 'link',
    label: 'PROGRAM',
    href: '/program',
    desktopIcon: '/icons/navbar/program.svg',
    mobileIcon: '/icons/navbar-mobile/program.svg',
    accentColor: '#ff3c21',
  },
  {
    type: 'group',
    label: 'GALLERY',
    desktopIcon: '/icons/navbar/archive.svg',
    mobileIcon: '/icons/navbar-mobile/archive.svg',
    accentColor: '#6e9985',
    items: [
      { label: 'PHOTO', href: '/galleries', accentColor: '#6e9985' },
      {
        label: 'DESIGNS',
        href: '/designs',
        accentColor: '#78793a',
        icon: '/icons/navbar/designs.svg',
      },
    ],
  },
  {
    type: 'group',
    label: 'PAST EVENTS',
    // TODO: the design uses a trophy icon for this trigger — no asset for it
    // yet, reusing the old video icon as a placeholder until one is provided.
    desktopIcon: '/icons/navbar/video.svg',
    mobileIcon: '/icons/navbar-mobile/video.svg',
    accentColor: '#262525',
    // Populated at request time from event types that have past events —
    // see getPastEventTypeItems() in navbar.tsx. Empty here since this array
    // is also imported by client components that can't touch the database.
    items: [],
  },
  {
    type: 'link',
    label: 'TEAM',
    href: '/about',
    desktopIcon: '/icons/navbar/about.svg',
    mobileIcon: '/icons/navbar-mobile/about.svg',
    accentColor: '#518ea1',
  },
]
