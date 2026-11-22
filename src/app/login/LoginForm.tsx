'use client';

import { useActionState, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { Eye, EyeOff, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { loginAction } from './actions';
import { cn } from '@/utils/cn';

function SparkLogo() {
  return (
    <div className="flex size-12 items-center justify-center rounded-xl bg-dash-elevated shadow-dash-card">
      <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-6 text-dash-brand">
        <path d="M12 2L14.4 9.6L22 12L14.4 14.4L12 22L9.6 14.4L2 12L9.6 9.6L12 2Z" fill="currentColor" />
      </svg>
    </div>
  );
}

export function LoginForm() {
  const searchParams = useSearchParams();
  const next = searchParams.get('next') ?? '';
  const [showPassword, setShowPassword] = useState(false);

  const [state, action, isPending] = useActionState(async (prevState: any, formData: FormData) => {
    const result = await loginAction(formData);
    if (result?.error) {
      toast.error(result.error);
      return result;
    }
    return prevState;
  }, null);

  return (
    <main className="relative z-10 flex flex-1 flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-sm animate-dash-fade-up">
        <div className="mb-8 flex flex-col items-center text-center">
          <SparkLogo />
          <h1 className="mt-6 text-2xl font-medium tracking-tight text-dash-fg">Welcome back</h1>
          <p className="mt-2 text-sm text-dash-subtle">Sign in to the Studio CMS</p>
        </div>

        <div className="rounded-2xl bg-dash-surface p-6 shadow-dash-pop">
          <form action={action} className="space-y-4">
            <input type="hidden" name="next" value={next} />

            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-dash-fg">
                Email address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                disabled={isPending}
                className="h-10 w-full rounded-lg border border-dash-line bg-dash-canvas px-3 text-sm text-dash-fg placeholder:text-dash-muted focus:border-dash-brand/60 focus:bg-dash-surface focus:outline-none focus:ring-4 focus:ring-dash-brand/10 disabled:opacity-50"
                placeholder="admin@adhamoe.studio"
              />
            </div>

            <div className="space-y-1.5">
              <label htmlFor="password" className="block text-sm font-medium text-dash-fg">
                Password
              </label>
              <div className="relative">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  autoComplete="current-password"
                  required
                  disabled={isPending}
                  className="h-10 w-full rounded-lg border border-dash-line bg-dash-canvas pl-3 pr-10 text-sm text-dash-fg placeholder:text-dash-muted focus:border-dash-brand/60 focus:bg-dash-surface focus:outline-none focus:ring-4 focus:ring-dash-brand/10 disabled:opacity-50"
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-1 top-1 flex h-8 w-8 items-center justify-center rounded-md text-dash-muted hover:text-dash-fg focus:outline-none disabled:opacity-50"
                >
                  {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isPending}
              className="mt-6 flex h-10 w-full items-center justify-center gap-2 rounded-lg bg-dash-brand px-4 text-sm font-medium text-dash-brand-fg transition-all hover:bg-dash-brand/90 focus:outline-none focus:ring-4 focus:ring-dash-brand/20 disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isPending ? <Loader2 className="size-4 animate-spin" /> : 'Sign in'}
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
