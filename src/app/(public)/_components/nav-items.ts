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
  // Only some blog types have a dedicated icon asset today — the section
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
    type: 'link',
    label: 'GALLERY',
    href: null,
    desktopIcon: '/icons/navbar/archive.svg',
    mobileIcon: '/icons/navbar-mobile/archive.svg',
    accentColor: '#6e9985',
  },
  {
    type: 'group',
    label: 'ARCHIVE',
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
      {
        label: 'FILM',
        href: '/blog/films',
        accentColor: '#262525',
        icon: '/icons/navbar/video.svg',
      },
      { label: 'WORKSHOPS', href: '/blog/workshops', accentColor: '#0f8a7d' },
      { label: 'CONCERTS', href: '/blog/concerts', accentColor: '#e0399a' },
      { label: 'DIY', href: '/diy', accentColor: '#7778b0', icon: '/icons/navbar/diy.svg' },
      {
        label: 'DESIGNS',
        href: null,
        accentColor: '#78793a',
        icon: '/icons/navbar/designs.svg',
      },
    ],
  },
  {
    type: 'link',
    label: 'ABOUT US',
    href: '/about',
    desktopIcon: '/icons/navbar/about.svg',
    mobileIcon: '/icons/navbar-mobile/about.svg',
    accentColor: '#518ea1',
  },
]
