// DESIGNS has no matching content type yet — rendered unlinked until one exists.
export const navItems: {
  label: string
  href: string | null
  desktopIcon: string
  mobileIcon: string
  accentColor: string
}[] = [
  {
    label: 'PROGRAM',
    href: '/program',
    desktopIcon: '/icons/navbar/program.svg',
    mobileIcon: '/icons/navbar-mobile/program.svg',
    accentColor: '#ff3c21',
  },
  {
    label: 'ARCHIVE',
    href: null,
    desktopIcon: '/icons/navbar/archive.svg',
    mobileIcon: '/icons/navbar-mobile/archive.svg',
    accentColor: '#6e9985',
  },
  {
    label: 'DESIGNS',
    href: null,
    desktopIcon: '/icons/navbar/designs.svg',
    mobileIcon: '/icons/navbar-mobile/designs.svg',
    accentColor: '#78793a',
  },
  {
    label: 'EXHIBITIONS',
    href: '/blog/exhibitions',
    desktopIcon: '/icons/navbar/exhibitions.svg',
    mobileIcon: '/icons/navbar-mobile/exhibitions.svg',
    accentColor: '#bae1c4',
  },
  {
    label: 'VIDEO',
    href: '/blog/films',
    desktopIcon: '/icons/navbar/video.svg',
    mobileIcon: '/icons/navbar-mobile/video.svg',
    accentColor: '#262525',
  },
  {
    label: 'DIY',
    href: '/diy',
    desktopIcon: '/icons/navbar/diy.svg',
    mobileIcon: '/icons/navbar-mobile/diy.svg',
    accentColor: '#7778b0',
  },
  {
    label: 'ABOUT US',
    href: '/about',
    desktopIcon: '/icons/navbar/about.svg',
    mobileIcon: '/icons/navbar-mobile/about.svg',
    accentColor: '#518ea1',
  },
]
