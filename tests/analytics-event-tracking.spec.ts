/**
 * Property-Based Test: Analytics Event Tracking
 * Feature: portfolio-website, Property 17: Analytics Event Tracking
 * **Validates: Requirements 9.2**
 * 
 * Tests that analytics events are properly tracked for all user interactions
 * including resume downloads, contact form submissions, and project link clicks.
 * Verifies that events contain correct properties and are fired consistently.
 */

import { test, expect } from '@playwright/test';

// Generate random viewport widths for responsive testing
function generateViewportWidths(count: number): number[] {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    const width = Math.floor(Math.random() * (1920 - 320 + 1)) + 320;
    widths.push(width);
  }
  return widths;
}

// Calculate appropriate height based on width
function calculateHeight(width: number): number {
  if (width <= 768) return Math.max(600, Math.floor(width * 1.5));
  if (width <= 1024) return Math.max(768, Math.floor(width * 0.75));
  return Math.max(800, Math.floor(width * 0.6));
}

// Analytics event interface
interface AnalyticsEvent {
  name: string;
  properties?: Record<string, any>;
}

test.describe('Property 17: Analytics Event Tracking', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Property: Resume download events are tracked with correct properties from all locations', async ({ page }) => {
    const viewportWidths = generateViewportWidths(1);
    const trackedEvents: AnalyticsEvent[] = [];
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Analytics Event:')) {
        try {
          // Extract the event object from the console message
          const eventMatch = text.match(/Analytics Event: ({.*})/);
          if (eventMatch) {
            const event = JSON.parse(eventMatch[1]);
            trackedEvents.push(event);
          }
        } catch (e) {
          // If parsing fails, try to extract event name at least
          if (text.includes('resume_download')) {
            trackedEvents.push({ name: 'resume_download', properties: {} });
          }
        }
      }
    });
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Test resume download from hero section
      const downloadPromise1 = page.waitForEvent('download');
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await heroDownloadButton.click();
      await downloadPromise1;
      await page.waitForTimeout(500);
      
      // Verify hero section event was tracked
      const heroEvents = trackedEvents.filter(e => 
        e.name === 'resume_download' && 
        e.properties?.source === 'hero_section'
      );
      expect(heroEvents.length).toBeGreaterThan(0);
      
      // Verify event properties
      const heroEvent = heroEvents[heroEvents.length - 1];
      expect(heroEvent.properties).toBeDefined();
      expect(heroEvent.properties?.source).toBe('hero_section');
      expect(heroEvent.properties?.filename).toBe('Arnav_Tiwari_Resume.pdf');
      expect(heroEvent.properties?.timestamp).toBeDefined();
      expect(typeof heroEvent.properties?.timestamp).toBe('number');
      
      // Test resume download from header (desktop only)
      if (width >= 768) {
        const downloadPromise2 = page.waitForEvent('download');
        const headerDownloadButton = page.locator('header button').filter({ hasText: /Download Resume/i });
        await headerDownloadButton.click();
        await downloadPromise2;
        await page.waitForTimeout(500);
        
        // Verify header event was tracked
        const headerEvents = trackedEvents.filter(e => 
          e.name === 'resume_download' && 
          e.properties?.source === 'header'
        );
        expect(headerEvents.length).toBeGreaterThan(0);
        
        const headerEvent = headerEvents[headerEvents.length - 1];
        expect(headerEvent.properties?.source).toBe('header');
        expect(headerEvent.properties?.filename).toBe('Arnav_Tiwari_Resume.pdf');
        expect(headerEvent.properties?.timestamp).toBeDefined();
      }
      
      // Test resume download from resume section
      const resumeSection = page.locator('#resume');
      await resumeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const downloadPromise3 = page.waitForEvent('download');
      const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
      await resumeSectionButton.click();
      await downloadPromise3;
      await page.waitForTimeout(500);
      
      // Verify resume section event was tracked
      const resumeEvents = trackedEvents.filter(e => 
        e.name === 'resume_download' && 
        e.properties?.source === 'resume_section'
      );
      expect(resumeEvents.length).toBeGreaterThan(0);
      
      const resumeEvent = resumeEvents[resumeEvents.length - 1];
      expect(resumeEvent.properties?.source).toBe('resume_section');
      expect(resumeEvent.properties?.filename).toBe('Arnav_Tiwari_Resume.pdf');
      expect(resumeEvent.properties?.timestamp).toBeDefined();
    }
    
    // Verify all resume download events have consistent structure
    const allResumeEvents = trackedEvents.filter(e => e.name === 'resume_download');
    expect(allResumeEvents.length).toBeGreaterThan(0);
    
    for (const event of allResumeEvents) {
      expect(event.name).toBe('resume_download');
      expect(event.properties).toBeDefined();
      expect(event.properties?.source).toMatch(/^(hero_section|header|resume_section)$/);
      expect(event.properties?.filename).toBe('Arnav_Tiwari_Resume.pdf');
      expect(event.properties?.timestamp).toBeDefined();
      expect(typeof event.properties?.timestamp).toBe('number');
      expect(event.properties?.timestamp).toBeGreaterThan(0);
    }
  });

  test('Property: Contact form submission events are tracked with correct properties', async ({ page }) => {
    const viewportWidths = generateViewportWidths(1);
    const trackedEvents: AnalyticsEvent[] = [];
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Analytics Event:')) {
        try {
          const eventMatch = text.match(/Analytics Event: ({.*})/);
          if (eventMatch) {
            const event = JSON.parse(eventMatch[1]);
            trackedEvents.push(event);
          }
        } catch (e) {
          if (text.includes('contact_submit')) {
            trackedEvents.push({ name: 'contact_submit', properties: {} });
          }
        }
      }
    });
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to contact section
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out contact form
      const nameInput = page.locator('input[name="name"]');
      const emailInput = page.locator('input[name="email"]');
      const messageInput = page.locator('textarea[name="message"]');
      
      await nameInput.fill('Test User');
      await emailInput.fill('test@example.com');
      await messageInput.fill('This is a test message for analytics tracking.');
      
      // Submit form
      const submitButton = page.locator('button[type="submit"]').filter({ hasText: /Send Message/i });
      await submitButton.click();
      
      // Wait for submission to complete
      await page.waitForTimeout(2000);
      
      // Verify contact submit event was tracked
      const contactEvents = trackedEvents.filter(e => e.name === 'contact_submit');
      expect(contactEvents.length).toBeGreaterThan(0);
      
      // Verify event properties
      const contactEvent = contactEvents[contactEvents.length - 1];
      expect(contactEvent.name).toBe('contact_submit');
      expect(contactEvent.properties).toBeDefined();
      expect(contactEvent.properties?.timestamp).toBeDefined();
      expect(typeof contactEvent.properties?.timestamp).toBe('number');
      expect(contactEvent.properties?.timestamp).toBeGreaterThan(0);
    }
    
    // Verify all contact submit events have consistent structure
    const allContactEvents = trackedEvents.filter(e => e.name === 'contact_submit');
    expect(allContactEvents.length).toBeGreaterThan(0);
    
    for (const event of allContactEvents) {
      expect(event.name).toBe('contact_submit');
      expect(event.properties).toBeDefined();
      expect(event.properties?.timestamp).toBeDefined();
      expect(typeof event.properties?.timestamp).toBe('number');
    }
  });

  test('Property: Project link click events are tracked with correct properties', async ({ page }) => {
    const viewportWidths = generateViewportWidths(1);
    const trackedEvents: AnalyticsEvent[] = [];
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Analytics Event:')) {
        try {
          const eventMatch = text.match(/Analytics Event: ({.*})/);
          if (eventMatch) {
            const event = JSON.parse(eventMatch[1]);
            trackedEvents.push(event);
          }
        } catch (e) {
          if (text.includes('project_click')) {
            trackedEvents.push({ name: 'project_click', properties: {} });
          }
        }
      }
    });
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to projects section
      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Find all project cards
      const projectCards = page.locator('[role="article"]').filter({ has: page.locator('button').filter({ hasText: /GitHub|Live Demo/i }) });
      const projectCount = await projectCards.count();
      
      expect(projectCount).toBeGreaterThan(0);
      
      // Test clicking GitHub link on first project
      const firstCard = projectCards.first();
      const githubButton = firstCard.locator('button').filter({ hasText: /GitHub/i });
      
      if (await githubButton.count() > 0) {
        // Prevent actual navigation
        await page.route('**/*', route => {
          if (route.request().url().includes('github.com')) {
            route.abort();
          } else {
            route.continue();
          }
        });
        
        await githubButton.click();
        await page.waitForTimeout(500);
        
        // Verify GitHub click event was tracked
        const githubEvents = trackedEvents.filter(e => 
          e.name === 'project_click' && 
          e.properties?.link_type === 'github'
        );
        expect(githubEvents.length).toBeGreaterThan(0);
        
        // Verify event properties
        const githubEvent = githubEvents[githubEvents.length - 1];
        expect(githubEvent.name).toBe('project_click');
        expect(githubEvent.properties).toBeDefined();
        expect(githubEvent.properties?.project_id).toBeDefined();
        expect(typeof githubEvent.properties?.project_id).toBe('string');
        expect(githubEvent.properties?.link_type).toBe('github');
        expect(githubEvent.properties?.timestamp).toBeDefined();
        expect(typeof githubEvent.properties?.timestamp).toBe('number');
      }
      
      // Test clicking Live Demo link on first project
      const liveButton = firstCard.locator('button').filter({ hasText: /Live Demo/i });
      
      if (await liveButton.count() > 0) {
        // Prevent actual navigation
        await page.route('**/*', route => {
          if (route.request().url().includes('vercel.app') || route.request().url().includes('demo')) {
            route.abort();
          } else {
            route.continue();
          }
        });
        
        await liveButton.click();
        await page.waitForTimeout(500);
        
        // Verify Live Demo click event was tracked
        const liveEvents = trackedEvents.filter(e => 
          e.name === 'project_click' && 
          e.properties?.link_type === 'live'
        );
        expect(liveEvents.length).toBeGreaterThan(0);
        
        // Verify event properties
        const liveEvent = liveEvents[liveEvents.length - 1];
        expect(liveEvent.name).toBe('project_click');
        expect(liveEvent.properties).toBeDefined();
        expect(liveEvent.properties?.project_id).toBeDefined();
        expect(typeof liveEvent.properties?.project_id).toBe('string');
        expect(liveEvent.properties?.link_type).toBe('live');
        expect(liveEvent.properties?.timestamp).toBeDefined();
        expect(typeof liveEvent.properties?.timestamp).toBe('number');
      }
      
      // Remove route interception
      await page.unroute('**/*');
    }
    
    // Verify all project click events have consistent structure
    const allProjectEvents = trackedEvents.filter(e => e.name === 'project_click');
    
    if (allProjectEvents.length > 0) {
      for (const event of allProjectEvents) {
        expect(event.name).toBe('project_click');
        expect(event.properties).toBeDefined();
        expect(event.properties?.project_id).toBeDefined();
        expect(typeof event.properties?.project_id).toBe('string');
        expect(event.properties?.link_type).toMatch(/^(github|live)$/);
        expect(event.properties?.timestamp).toBeDefined();
        expect(typeof event.properties?.timestamp).toBe('number');
        expect(event.properties?.timestamp).toBeGreaterThan(0);
      }
    }
  });

  test('Property: Analytics events are tracked consistently across multiple interactions', async ({ page }) => {
    const trackedEvents: AnalyticsEvent[] = [];
    const eventCounts: Record<string, number> = {
      resume_download: 0,
      contact_submit: 0,
      project_click: 0
    };
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Analytics Event:')) {
        try {
          const eventMatch = text.match(/Analytics Event: ({.*})/);
          if (eventMatch) {
            const event = JSON.parse(eventMatch[1]);
            trackedEvents.push(event);
            if (event.name in eventCounts) {
              eventCounts[event.name]++;
            }
          }
        } catch (e) {
          // Try to extract event name
          if (text.includes('resume_download')) {
            trackedEvents.push({ name: 'resume_download', properties: {} });
            eventCounts.resume_download++;
          } else if (text.includes('contact_submit')) {
            trackedEvents.push({ name: 'contact_submit', properties: {} });
            eventCounts.contact_submit++;
          } else if (text.includes('project_click')) {
            trackedEvents.push({ name: 'project_click', properties: {} });
            eventCounts.project_click++;
          }
        }
      }
    });
    
    // Perform multiple interactions
    const iterations = 2;
    
    for (let i = 0; i < iterations; i++) {
      // Resume download
      const downloadPromise = page.waitForEvent('download');
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await heroDownloadButton.click();
      await downloadPromise;
      await page.waitForTimeout(500);
      
      // Project click
      const projectsSection = page.locator('#projects');
      await projectsSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const firstCard = page.locator('[role="article"]').first();
      const githubButton = firstCard.locator('button').filter({ hasText: /GitHub/i });
      
      if (await githubButton.count() > 0) {
        await page.route('**/*', route => {
          if (route.request().url().includes('github.com')) {
            route.abort();
          } else {
            route.continue();
          }
        });
        
        await githubButton.click();
        await page.waitForTimeout(500);
        await page.unroute('**/*');
      }
      
      // Scroll back to top for next iteration
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(500);
    }
    
    // Verify events were tracked for each interaction
    expect(eventCounts.resume_download).toBeGreaterThanOrEqual(iterations);
    
    // Verify all events have required properties
    for (const event of trackedEvents) {
      expect(event.name).toBeDefined();
      expect(typeof event.name).toBe('string');
      expect(event.name).toMatch(/^(resume_download|contact_submit|project_click|external_link)$/);
      
      if (event.properties) {
        expect(event.properties.timestamp).toBeDefined();
        expect(typeof event.properties.timestamp).toBe('number');
        expect(event.properties.timestamp).toBeGreaterThan(0);
      }
    }
  });

  test('Property: Analytics events contain valid timestamps and are ordered chronologically', async ({ page }) => {
    const trackedEvents: Array<AnalyticsEvent & { captureTime: number }> = [];
    
    // Monitor console for analytics events
    page.on('console', msg => {
      const text = msg.text();
      if (text.includes('Analytics Event:')) {
        try {
          const eventMatch = text.match(/Analytics Event: ({.*})/);
          if (eventMatch) {
            const event = JSON.parse(eventMatch[1]);
            trackedEvents.push({
              ...event,
              captureTime: Date.now()
            });
          }
        } catch (e) {
          // Ignore parsing errors
        }
      }
    });
    
    // Perform multiple interactions with delays
    const downloadPromise1 = page.waitForEvent('download');
    const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
    await heroDownloadButton.click();
    await downloadPromise1;
    await page.waitForTimeout(1000);
    
    const projectsSection = page.locator('#projects');
    await projectsSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const firstCard = page.locator('[role="article"]').first();
    const githubButton = firstCard.locator('button').filter({ hasText: /GitHub/i });
    
    if (await githubButton.count() > 0) {
      await page.route('**/*', route => {
        if (route.request().url().includes('github.com')) {
          route.abort();
        } else {
          route.continue();
        }
      });
      
      await githubButton.click();
      await page.waitForTimeout(1000);
      await page.unroute('**/*');
    }
    
    const resumeSection = page.locator('#resume');
    await resumeSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const downloadPromise2 = page.waitForEvent('download');
    const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
    await resumeSectionButton.click();
    await downloadPromise2;
    await page.waitForTimeout(500);
    
    // Verify events have valid timestamps
    expect(trackedEvents.length).toBeGreaterThan(0);
    
    for (const event of trackedEvents) {
      if (event.properties?.timestamp) {
        expect(typeof event.properties.timestamp).toBe('number');
        expect(event.properties.timestamp).toBeGreaterThan(0);
        
        // Timestamp should be within reasonable range (last hour to now)
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        expect(event.properties.timestamp).toBeGreaterThan(oneHourAgo);
        expect(event.properties.timestamp).toBeLessThanOrEqual(now + 1000); // Allow 1s buffer
      }
    }
    
    // Verify events are roughly chronologically ordered
    for (let i = 1; i < trackedEvents.length; i++) {
      const prevEvent = trackedEvents[i - 1];
      const currEvent = trackedEvents[i];
      
      if (prevEvent.properties?.timestamp && currEvent.properties?.timestamp) {
        // Current event timestamp should be >= previous event timestamp
        expect(currEvent.properties.timestamp).toBeGreaterThanOrEqual(prevEvent.properties.timestamp);
      }
    }
  });
});
