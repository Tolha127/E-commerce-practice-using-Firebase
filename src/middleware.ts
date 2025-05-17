
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

const ADMIN_LOGIN_URL_PATH = '/login'
const ADMIN_DASHBOARD_URL_PATH = '/admin'
const PROTECTED_ADMIN_ROUTES_PREFIX = '/admin' // Covers /admin and /admin/*
const AUTH_COOKIE_NAME = 'auth_token'
// This should match the value set in login/actions.ts
const EXPECTED_AUTH_TOKEN_VALUE = "secret-hardcoded-stylecanvas-auth-token";


export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const authToken = request.cookies.get(AUTH_COOKIE_NAME)?.value

  const isAuthenticated = authToken === EXPECTED_AUTH_TOKEN_VALUE;

  // If user is trying to access login page but is already authenticated, redirect to admin dashboard
  if (isAuthenticated && pathname === ADMIN_LOGIN_URL_PATH) {
    return NextResponse.redirect(new URL(ADMIN_DASHBOARD_URL_PATH, request.url))
  }

  // If user is trying to access any /admin path (including /admin itself) and is not authenticated, redirect to login
  if (!isAuthenticated && pathname.startsWith(PROTECTED_ADMIN_ROUTES_PREFIX)) {
     // If the current path is ALREADY the login page, do nothing to prevent redirect loop
     // This case should ideally not be hit if /login is not under /admin, but good for safety.
    if (pathname === ADMIN_LOGIN_URL_PATH) {
        return NextResponse.next();
    }
    return NextResponse.redirect(new URL(ADMIN_LOGIN_URL_PATH, request.url))
  }

  return NextResponse.next()
}

export const config = {
  // Match all /admin routes and the /login page.
  // :path* matches zero or more segments after /admin/
  // /admin also needs to be implicitly matched if it's a page
  matcher: ['/admin/:path*', '/admin', '/login'],
}
