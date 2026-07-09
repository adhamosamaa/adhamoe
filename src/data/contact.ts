import type { ContactFormField } from '@/types';

export const contactFormFields: ContactFormField[] = [
  { id: 'name', name: 'name', label: 'Your name', type: 'text', placeholder: 'Your Name', autoComplete: 'name' },
  { id: 'email', name: 'email', label: 'Your email', type: 'email', placeholder: 'Your Email', autoComplete: 'email' },
];
