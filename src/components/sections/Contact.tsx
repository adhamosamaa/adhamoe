'use client';

import { SectionLabel } from '@/components/ui/SectionLabel';
import { AccentText } from '@/components/ui/AccentText';
import { Reveal } from '@/components/ui/Reveal';
import { useContactForm } from '@/hooks/useContactForm';
import { contactFormFields } from '@/data/contact';
import { socialLinks } from '@/data/social';
import { siteSettings } from '@/data/settings';
import { cn } from '@/utils/cn';

export function Contact() {
  const { status, statusMessage, handleSubmit } = useContactForm();

  return (
    <section id="contact" className="py-32 border-t border-white/5 text-center relative overflow-hidden">
      <div
        className="absolute -bottom-50 left-1/2 -translate-x-1/2 w-[700px] h-[500px] pointer-events-none blur-[60px]"
        style={{
          background: 'radial-gradient(ellipse at center, var(--color-accent-glow) 0%, transparent 65%)',
        }}
        aria-hidden="true"
      ></div>

      <div className="max-w-(--max-width-page) mx-auto px-6 md:px-13 relative z-10">
        <Reveal delay={0} className="flex justify-center">
          <SectionLabel className="justify-center mb-6">Let&apos;s work together</SectionLabel>
        </Reveal>
        <Reveal delay={0}>
          <h2 className="text-[clamp(52px,7vw,100px)] font-bold tracking-[-0.04em] leading-[.9] mb-8">
            {siteSettings.contactHeadline} <AccentText>{siteSettings.contactHighlight}</AccentText>
          </h2>
        </Reveal>
        <Reveal delay={0}>
          <p className="text-base text-gray max-w-[400px] mx-auto leading-[1.75] font-light">
            {siteSettings.contactDescription}
          </p>
        </Reveal>

        <Reveal delay={0} className="max-w-[600px] mx-auto mt-10 mb-15">
          <form className="flex flex-col gap-5 text-left" id="contact-form" noValidate onSubmit={handleSubmit}>
            {/* Honeypot field to deter spam bots */}
            <input
              type="text"
              name="_honeypot"
              className="absolute opacity-0 -z-10 pointer-events-none"
              tabIndex={-1}
              autoComplete="off"
              aria-hidden="true"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              {contactFormFields.map((field) => (
                <div key={field.id}>
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
                    className="field-input"
                  />
                </div>
              ))}
            </div>

            <div>
              <label htmlFor="message" className="sr-only">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                placeholder="Tell me about your project..."
                rows={4}
                required
                className="field-input resize-y min-h-[120px]"
              ></textarea>
            </div>

            <button
              type="submit"
              disabled={status === 'sending'}
              className="btn-solid self-center cursor-pointer border-0 font-inherit mt-2.5"
            >
              <span id="form-submit-label">{status === 'sending' ? 'Sending…' : 'Send Message ↗'}</span>
            </button>

            <p
              id="form-status"
              role="status"
              aria-live="polite"
              className={cn('text-sm text-center min-h-[1.25em]', status === 'error' && 'text-red-400', status === 'success' && 'text-accent')}
            >
              {statusMessage}
            </p>
          </form>
        </Reveal>

        <Reveal delay={0} className="flex justify-center gap-8 flex-wrap">
          {socialLinks.map((social) => (
            <a key={social.id} href={social.href} target="_blank" rel="noopener noreferrer" className="soc-link">
              {social.label}
            </a>
          ))}
        </Reveal>
      </div>
    </section>
  );
}
