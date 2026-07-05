import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { SESSION_COOKIE, verifySessionToken } from '@/lib/session'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  if (pathname === '/dashboard/login') return NextResponse.next()

  const token = request.cookies.get(SESSION_COOKIE)?.value
  if (!(await verifySessionToken(token))) {
    return NextResponse.redirect(new URL('/dashboard/login', request.url))
  }
  return NextResponse.next()
}

export const config = {
  matcher: '/dashboard/:path*',
}
