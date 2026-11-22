import { createServerClient } from '@supabase/ssr';
import { NextResponse, type NextRequest } from 'next/server';
import { getSupabaseEnv } from './env';

export const LOGIN_PATH = '/login';
export const PROTECTED_PREFIX = '/dashboard';

/**
 * Refreshes the Supabase session cookie and enforces route access.
 * - Unauthenticated requests to /dashboard/** → /login?next=<original path>
 * - Authenticated requests to /login → /dashboard
 */
export async function updateSession(request: NextRequest) {
  const { url, key } = getSupabaseEnv();
  let response = NextResponse.next({ request });

  const supabase = createServerClient(url, key, {
    cookies: {
      getAll() {
        return request.cookies.getAll();
      },
      setAll(cookiesToSet, headers) {
        cookiesToSet.forEach(({ name, value }) => request.cookies.set(name, value));
        response = NextResponse.next({ request });
        cookiesToSet.forEach(({ name, value, options }) => response.cookies.set(name, value, options));
        // Prevent CDNs from caching responses that carry a session token.
        Object.entries(headers).forEach(([header, value]) => response.headers.set(header, value));
      },
    },
  });

  // IMPORTANT: no code between createServerClient and this call.
  // getClaims() validates the JWT signature (never trust getSession() on the server).
  const { data } = await supabase.auth.getClaims();
  const isAuthenticated = Boolean(data?.claims?.sub);

  const { pathname, search } = request.nextUrl;
  const isProtected = pathname === PROTECTED_PREFIX || pathname.startsWith(`${PROTECTED_PREFIX}/`);

  if (!isAuthenticated && isProtected) {
    const loginUrl = request.nextUrl.clone();
    loginUrl.pathname = LOGIN_PATH;
    loginUrl.search = '';
    loginUrl.searchParams.set('next', `${pathname}${search}`);
    return redirectWithCookies(loginUrl, response);
  }

  if (isAuthenticated && pathname === LOGIN_PATH) {
    const dashboardUrl = request.nextUrl.clone();
    dashboardUrl.pathname = PROTECTED_PREFIX;
    dashboardUrl.search = '';
    return redirectWithCookies(dashboardUrl, response);
  }

  return response;
}

/** Redirect while carrying over any refreshed auth cookies and cache headers. */
function redirectWithCookies(destination: URL, source: NextResponse) {
  const redirect = NextResponse.redirect(destination);
  source.cookies.getAll().forEach((cookie) => redirect.cookies.set(cookie));
  const cacheControl = source.headers.get('cache-control');
  if (cacheControl) redirect.headers.set('cache-control', cacheControl);
  return redirect;
}
