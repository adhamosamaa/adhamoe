import type { NextRequest } from 'next/server';
import { updateSession } from '@/utils/supabase/middleware';

/**
 * Next.js 16 renamed `middleware.ts` → `proxy.ts` (same behaviour, Node.js runtime by default).
 * Runs only on admin routes so the public portfolio stays fully static and fast.
 */
export async function proxy(request: NextRequest) {
  return updateSession(request);
}

export const config = {
  matcher: ['/dashboard/:path*', '/login'],
};
