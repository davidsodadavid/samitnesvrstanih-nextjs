// DESIGNS has no matching content type yet — rendered unlinked until one exists.

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
        href: null,
        accentColor: '#78793a',
        icon: '/icons/navbar/designs.svg',
      },
      {
        label: 'FILM',
        href: '/blog/films',
        accentColor: '#262525',
        icon: '/icons/navbar/video.svg',
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
    items: [
      { label: 'POSTS', href: '/blog/posts', accentColor: '#f2c14e' },
      {
        label: 'EXHIBITIONS',
        href: '/blog/exhibitions',
        accentColor: '#bae1c4',
        icon: '/icons/navbar/exhibitions.svg',
      },
      { label: 'WORKSHOPS', href: '/blog/workshops', accentColor: '#0f8a7d' },
      { label: 'CONCERTS', href: '/blog/concerts', accentColor: '#e0399a' },
      { label: 'DIY', href: '/diy', accentColor: '#7778b0', icon: '/icons/navbar/diy.svg' },
    ],
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
