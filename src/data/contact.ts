/**
 * Contact information and communication channels
 * Requirements: 2.6
 */

import type { NavigationItem } from '../lib/types';

export const contactInfo = {
  email: 'arnavt292@gmail.com',
  phone: '+91 83298 46328',
  location: 'Nagpur, India',
  availability:
    'Available for full-time software engineering roles starting July 2026.',
};

export const socialLinks: NavigationItem[] = [
  {
    label: 'LinkedIn',
    href: 'https://www.linkedin.com/in/arnav-tiwari-063278253/',
    external: true,
    icon: 'linkedin',
  },
  {
    label: 'GitHub',
    href: 'https://github.com/Arnav10090',
    external: true,
    icon: 'github',
  },
  {
    label: 'Email',
    href: 'mailto:arnavt292@gmail.com',
    external: true,
    icon: 'email',
  },
  {
    label: 'Twitter',
    href: 'https://x.com/Arnav_IIITN',
    external: true,
    icon: 'twitter',
  },
];

export const navigationItems: NavigationItem[] = [
  {
    label: 'About',
    href: '#about',
  },
  {
    label: 'Skills',
    href: '#skills',
  },
  {
    label: 'Experience',
    href: '#experience',
  },
  {
    label: 'Projects',
    href: '#projects',
  },
  {
    label: 'Resume',
    href: '#resume',
  },
  {
    label: 'Contact',
    href: '#contact',
  },
];

export const resumeDownload = {
  filename: 'Arnav_Tiwari_Resume.pdf',
  url: '/resume/Arnav_Tiwari_Resume.pdf',
  lastUpdated: '2024-12-15',
  size: '245 KB',
};
