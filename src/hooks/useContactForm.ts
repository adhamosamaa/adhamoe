'use client';

import { useState, type FormEvent } from 'react';

type SubmitStatus = 'idle' | 'sending' | 'success' | 'error';

interface UseContactFormResult {
  status: SubmitStatus;
  statusMessage: string;
  handleSubmit: (event: FormEvent<HTMLFormElement>) => Promise<void>;
}

/**
 * Handles validation, submission, and status messaging for the
 * contact form via the Next.js API route.
 */
export function useContactForm(): UseContactFormResult {
  const [status, setStatus] = useState<SubmitStatus>('idle');
  const [statusMessage, setStatusMessage] = useState('');

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const form = event.currentTarget;

    if (!form.checkValidity()) {
      setStatus('error');
      setStatusMessage('Please fill in every field with a valid email address.');
      return;
    }

    setStatus('sending');
    setStatusMessage('');

    try {
      const formData = new FormData(form);
      const data = Object.fromEntries(formData);
      
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: { Accept: 'application/json', 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        if (response.status === 429) {
          throw new Error('Too many requests. Please try again later.');
        } else if (response.status === 400) {
          const resData = await response.json().catch(() => null);
          throw new Error(resData?.error || 'Invalid input or missing fields.');
        } else {
          throw new Error('Something went wrong. Please try again.');
        }
      }

      form.reset();
      setStatus('success');
      setStatusMessage('Thanks - your message is on its way. I’ll reply soon.');
    } catch (error: unknown) {
      const message =
        error instanceof Error
          ? error.message
          : 'Something went wrong sending that. Please try again or email me directly.';
      setStatus('error');
      setStatusMessage(message);
    }
  };

  return { status, statusMessage, handleSubmit };
}
