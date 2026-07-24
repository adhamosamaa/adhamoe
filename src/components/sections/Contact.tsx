'use client';

import {
  Send,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { useContactForm } from '@/hooks/useContactForm';
import { contactFormFields } from '@/data/contact';
import { siteSettings } from '@/data/settings';
import { cn } from '@/utils/cn';

export function Contact() {
  const { status, statusMessage, handleSubmit } = useContactForm();

  return (
    <section id="contact" className="py-24 md:py-32 border-t border-white/5 relative overflow-hidden">
      {/* Background Ambient Glow Spheres */}
      <div
        className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none blur-[140px] opacity-25"
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-accent) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 relative z-10">
        {/* Main Section Headline */}
        <Reveal delay={0} className="mb-12 md:mb-16">
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <div>
              <SectionLabel className="mb-4">Let&apos;s work together</SectionLabel>
              <h2 className="text-[clamp(42px,5vw,72px)] font-bold tracking-[-0.03em] leading-[.95]">
                {siteSettings.contactHeadline} <AccentText>{siteSettings.contactHighlight}</AccentText>
              </h2>
            </div>
            {/* Availability Badge */}
            <div className="inline-flex items-center gap-2.5 px-4 py-2 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium tracking-wide self-start sm:self-auto shrink-0">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              Available for New Projects
            </div>
          </div>
        </Reveal>

        {/* Full Width Bento Form Card */}
        <Reveal delay={80}>
          <div className="bento-card p-6 sm:p-10 lg:p-12 w-full">
            <div className="flex items-center justify-between mb-8 pb-4 border-b border-white/5">
              <div className="flex items-center gap-2 text-xs font-medium tracking-widest text-accent uppercase">
                <Sparkles className="w-4 h-4" />
                <span>Send A Message</span>
              </div>
              <span className="text-[11px] text-gray/50 font-light">Fast Response</span>
            </div>

            <form id="contact-form" noValidate onSubmit={handleSubmit} className="space-y-8">
              {/* Honeypot field */}
              <input
                type="text"
                name="_honeypot"
                className="absolute opacity-0 -z-10 pointer-events-none"
                tabIndex={-1}
                autoComplete="off"
                aria-hidden="true"
              />

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                {contactFormFields.map((field) => (
                  <div key={field.id} className="relative">
                    <label htmlFor={field.id} className="sr-only">
                      {field.label}
                    </label>
                    <input
                      id={field.id}
                      name={field.name}
                      type={field.type}
                      placeholder={field.placeholder}
                      required
                      autoComplete={field.autoComplete}
                      className="field-input border-0 border-b border-white/15 rounded-none bg-transparent px-0 py-3.5 focus:border-accent focus:bg-transparent text-base transition-all placeholder:text-gray/40"
                    />
                  </div>
                ))}
              </div>

              <div className="relative pt-2">
                <label htmlFor="message" className="sr-only">
                  Your message
                </label>
                <textarea
                  id="message"
                  name="message"
                  placeholder="Tell me about your project..."
                  rows={5}
                  required
                  className="field-input border-0 border-b border-white/15 rounded-none bg-transparent px-0 py-3.5 focus:border-accent focus:bg-transparent text-base transition-all resize-y min-h-[140px] placeholder:text-gray/40"
                ></textarea>
              </div>

              <div className="pt-4 flex flex-col items-stretch gap-4">
                <button
                  type="submit"
                  disabled={status === 'sending'}
                  className="w-full btn-solid justify-center cursor-pointer border-0 font-inherit py-4 px-8 rounded-full flex items-center gap-2 group text-base"
                >
                  {status === 'sending' ? (
                    <>
                      <Loader2 className="w-4.5 h-4.5 animate-spin text-bg" />
                      <span>Sending…</span>
                    </>
                  ) : (
                    <>
                      <span>Send Message</span>
                      <Send className="w-4 h-4 text-bg group-hover:translate-x-1 transition-transform" />
                    </>
                  )}
                </button>

                {statusMessage && (
                  <div
                    id="form-status"
                    role="status"
                    aria-live="polite"
                    className={cn(
                      'p-4 rounded-xl text-xs sm:text-sm font-medium flex items-center gap-3 transition-all duration-300 w-full',
                      status === 'error' && 'bg-red-500/10 border border-red-500/20 text-red-400',
                      status === 'success' && 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
                    )}
                  >
                    {status === 'error' && <AlertCircle className="w-4.5 h-4.5 shrink-0 text-red-400" />}
                    {status === 'success' && <CheckCircle2 className="w-4.5 h-4.5 shrink-0 text-emerald-400" />}
                    <span>{statusMessage}</span>
                  </div>
                )}
              </div>
            </form>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
