import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const walletInfosStringfied = request.cookies.get('walletInfos')?.value
  let isAdmin = 'false'
  if (walletInfosStringfied) {
    const walletInfos = JSON.parse(walletInfosStringfied)
    isAdmin = walletInfos.isAdmin
  }

  if (isAdmin !== 'true') {
    const redirectURL = new URL('/', request.url)
    return NextResponse.redirect(redirectURL)
  }

  return NextResponse.next()
}

export const config = {
  matcher: '/settings/:path*',
}
