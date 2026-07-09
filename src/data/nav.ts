import type { NavLink } from '@/types';

export const navLinks: NavLink[] = [
  { id: 'hero', label: 'Home', href: '#hero', routeHref: '/' },
  { id: 'projects', label: 'Work', href: '#projects', routeHref: '/works' },
  { id: 'about', label: 'About', href: '#about', routeHref: '/about' },
  { id: 'skills', label: 'Skills', href: '#skills', routeHref: '/#skills' },
  { id: 'contact', label: 'Contact', href: '#contact', routeHref: '/#contact' },
];
