/**
 * Contact information and communication channels
 * Requirements: 2.6
 */

import type { NavigationItem } from '../lib/types';

export const contactInfo = {
  email: 'arnav.tiwari@example.com',
  phone: '+91 98765 43210',
  location: 'Nagpur, India',
  availability: 'Available for full-time opportunities starting July 2026'
};

export const socialLinks: NavigationItem[] = [
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/arnavtiwari',
    external: true,
    icon: 'linkedin'
  },
  {
    label: 'GitHub',
    href: 'https://github.com/arnavtiwari',
    external: true,
    icon: 'github'
  },
  {
    label: 'Email',
    href: 'mailto:arnav.tiwari@example.com',
    external: true,
    icon: 'email'
  },
  {
    label: 'Twitter',
    href: 'https://twitter.com/arnavtiwari',
    external: true,
    icon: 'twitter'
  }
];

export const navigationItems: NavigationItem[] = [
  {
    label: 'About',
    href: '#about'
  },
  {
    label: 'Experience',
    href: '#experience'
  },
  {
    label: 'Projects',
    href: '#projects'
  },
  {
    label: 'Skills',
    href: '#skills'
  },
  {
    label: 'Contact',
    href: '#contact'
  }
];

export const resumeDownload = {
  filename: 'Arnav_Tiwari_Resume.pdf',
  url: '/resume/Arnav_Tiwari_Resume.pdf',
  lastUpdated: '2024-12-15',
  size: '245 KB'
};