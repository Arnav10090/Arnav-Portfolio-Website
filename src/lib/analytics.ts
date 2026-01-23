/**
 * Analytics event tracking utilities
 */

import type { AnalyticsEvent } from './types';
import { track } from '@vercel/analytics';

/**
 * Track analytics events
 */
export function trackEvent(event: AnalyticsEvent): void {
  // In development, log to console
  if (process.env.NODE_ENV === 'development') {
    console.log('Analytics Event:', event);
  }

  // Track with Vercel Analytics
  if (typeof window !== 'undefined') {
    track(event.name, event.properties);
  }
}

/**
 * Track resume download
 */
export function trackResumeDownload(source: string = 'unknown'): void {
  trackEvent({
    name: 'resume_download',
    properties: {
      source,
      timestamp: Date.now(),
      filename: 'Arnav_Tiwari_Resume.pdf',
    },
  });
}

/**
 * Track contact form submission
 */
export function trackContactSubmit(): void {
  trackEvent({
    name: 'contact_submit',
    properties: {
      timestamp: Date.now(),
    },
  });
}

/**
 * Track project link clicks
 */
export function trackProjectClick(
  projectId: string,
  linkType: 'github' | 'live'
): void {
  trackEvent({
    name: 'project_click',
    properties: {
      project_id: projectId,
      link_type: linkType,
      timestamp: Date.now(),
    },
  });
}

/**
 * Track external link clicks
 */
export function trackExternalLink(url: string): void {
  trackEvent({
    name: 'external_link',
    properties: {
      url,
      timestamp: Date.now(),
    },
  });
}
