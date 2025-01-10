import { match as matchLocale } from '@formatjs/intl-localematcher'
import Negotiator from 'negotiator'
import { type NextRequest, NextResponse } from 'next/server'

import { auth } from '@/auth'

export const middleware = auth(req => {
  return localesMiddleware(req)
})

const locales = JSON.parse(process.env.NEXTRA_LOCALES!) as string[]

const defaultLocale = process.env.NEXTRA_DEFAULT_LOCALE!

// Refer to:
// - https://github.com/lingui/js-lingui/blob/main/examples/nextjs-swc/src/middleware.ts
// - https://github.com/shuding/nextra/blob/main/packages/nextra/src/server/locales.ts
export function localesMiddleware(request: NextRequest) {
  // Check if there is any supported locale in the pathname
  const { pathname } = request.nextUrl
  const pathnameHasLocale = locales.some(locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`)

  const cookieLocale = request.cookies.get('NEXT_LOCALE')?.value

  if (pathnameHasLocale) {
    const response = NextResponse.next()
    const requestLocale = pathname.split('/', 2)[1]
    if (requestLocale !== cookieLocale) {
      response.cookies.set('NEXT_LOCALE', requestLocale)
    }
    return response
  }

  // Redirect if there is no locale
  const locale = cookieLocale || getRequestLocale(request.headers)
  request.nextUrl.pathname = `/${locale}${pathname}`
  // e.g. incoming request is /products
  // The new URL is now /en/products
  return NextResponse.redirect(request.nextUrl)
}

function getRequestLocale(requestHeaders: Headers): string {
  const langHeader = requestHeaders.get('accept-language') || undefined
  const languages = new Negotiator({
    headers: { 'accept-language': langHeader },
  }).languages(locales.slice())

  const locale = matchLocale(languages, locales, defaultLocale)
  return locale
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - admin (Payload admin routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt (metadata files)
     * - images, fonts
     */
    '/((?!api|admin|_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|WEBP|avif|AVIF|ico|ttf)$).*)',
  ],
}
