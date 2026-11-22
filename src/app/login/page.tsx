import { Suspense } from 'react';
import { LoginForm } from './LoginForm';

// Auth page: never prerender at build time; always render per request.
export const dynamic = 'force-dynamic';

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginForm />
    </Suspense>
  );
}
