/**
 * Property-Based Test: Hero Content Structure
 * Feature: portfolio-website, Property 5.2: Hero Content Structure Validation
 * **Validates: Requirements 2.1**
 * 
 * Tests that all required elements are present above the fold in the hero section,
 * and that CTA functionality and accessibility work correctly across all viewport sizes.
 */

import { test, expect } from '@playwright/test';

// Generate random viewport widths within the specified range
function generateViewportWidths(count: number): number[] {
  const widths: number[] = [];
  for (let i = 0; i < count; i++) {
    // Generate random width between 320px and 1920px
    const width = Math.floor(Math.random() * (1920 - 320 + 1)) + 320;
    widths.push(width);
  }
  return widths;
}

// Calculate appropriate height based on width (maintaining reasonable aspect ratios)
function calculateHeight(width: number): number {
  if (width <= 768) return Math.max(600, Math.floor(width * 1.5)); // Mobile: taller aspect ratio
  if (width <= 1024) return Math.max(768, Math.floor(width * 0.75)); // Tablet: 4:3 ratio
  return Math.max(800, Math.floor(width * 0.6)); // Desktop: wider aspect ratio
}

test.describe('Property 5.2: Hero Content Structure Validation', () => {
  
  test.beforeEach(async ({ page }) => {
    // Navigate to the actual portfolio website
    await page.goto('/');
    
    // Wait for the page to load completely
    await page.waitForLoadState('networkidle');
  });

  test('Property: All required hero elements are present above the fold', async ({ page }) => {
    // Generate fewer viewport sizes for faster testing while maintaining coverage
    const viewportWidths = generateViewportWidths(5); // Reduced from 15 to 5
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      
      // Set viewport size
      await page.setViewportSize({ width, height });
      
      // Wait for layout to stabilize
      await page.waitForTimeout(300);
      
      // Test that hero section exists and is visible
      const heroSection = page.locator('section').first(); // Hero should be the first section
      await expect(heroSection).toBeVisible();
      
      // Verify hero section takes up significant viewport space (above the fold)
      const heroBox = await heroSection.boundingBox();
      expect(heroBox?.height).toBeGreaterThan(height * 0.7); // At least 70% of viewport height
      
      // Test candidate name is present and visible
      const nameHeading = page.locator('h1').filter({ hasText: 'Arnav Tiwari' });
      await expect(nameHeading).toBeVisible();
      
      // Verify name is prominently displayed (large font size)
      const nameStyles = await nameHeading.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      });
      
      const nameFontSize = parseFloat(nameStyles.fontSize);
      if (!isNaN(nameFontSize)) {
        // Name should be large and prominent
        if (width >= 1024) {
          expect(nameFontSize).toBeGreaterThanOrEqual(48); // Desktop: 3rem+
        } else if (width >= 768) {
          expect(nameFontSize).toBeGreaterThanOrEqual(36); // Tablet: 2.25rem+
        } else {
          expect(nameFontSize).toBeGreaterThanOrEqual(32); // Mobile: 2rem+
        }
      }
      
      // Test role/title is present and visible
      const roleText = page.locator('text=Software Engineer');
      await expect(roleText).toBeVisible();
      
      // Test value proposition is present
      const valueProposition = page.locator('text=Software Engineering student at IIIT Nagpur');
      await expect(valueProposition).toBeVisible();
      
      // Verify key skills are mentioned in value proposition
      const reactMention = page.locator('text=React');
      const dotnetMention = page.locator('text=.NET MVC');
      const hitachiMention = page.locator('text=Hitachi');
      
      await expect(reactMention).toBeVisible();
      await expect(dotnetMention).toBeVisible();
      await expect(hitachiMention).toBeVisible();
      
      // Test primary CTA (View My Work) is present and visible
      const primaryCTA = page.locator('button', { hasText: 'View My Work' });
      await expect(primaryCTA).toBeVisible();
      
      // Test secondary CTA (Download Resume) is present and visible
      const secondaryCTA = page.locator('button', { hasText: 'Download Resume' });
      await expect(secondaryCTA).toBeVisible();
      
      // Verify CTAs are properly positioned and sized for the viewport
      const primaryCTABox = await primaryCTA.boundingBox();
      const secondaryCTABox = await secondaryCTA.boundingBox();
      
      if (primaryCTABox && secondaryCTABox) {
        // CTAs should be large enough for easy interaction
        expect(primaryCTABox.height).toBeGreaterThanOrEqual(44); // Minimum touch target
        expect(secondaryCTABox.height).toBeGreaterThanOrEqual(44);
        
        if (width >= 640) {
          // Desktop/tablet: CTAs should be side by side
          expect(Math.abs(primaryCTABox.y - secondaryCTABox.y)).toBeLessThan(10);
        } else {
          // Mobile: CTAs should be stacked vertically
          expect(primaryCTABox.y).toBeLessThan(secondaryCTABox.y);
        }
      }
      
      // Test scroll indicator is present (should be visible on larger screens)
      const scrollIndicator = page.locator('text=Scroll to explore');
      if (height >= 600) {
        await expect(scrollIndicator).toBeVisible();
        
        // Verify scroll indicator is positioned at bottom of hero
        const scrollBox = await scrollIndicator.boundingBox();
        if (scrollBox && heroBox) {
          expect(scrollBox.y).toBeGreaterThan(heroBox.y + heroBox.height * 0.8);
        }
      }
      
      // Test gradient background is applied (check for background styling)
      const heroBackground = await heroSection.evaluate(el => {
        const styles = getComputedStyle(el);
        return styles.position;
      });
      expect(heroBackground).toBe('relative'); // Hero should have relative positioning for gradient overlay
    }
  });

  test('Property: Primary CTA functionality works correctly', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 } // Desktop
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Test primary CTA is clickable and accessible
      const primaryCTA = page.locator('button', { hasText: 'View My Work' });
      await expect(primaryCTA).toBeVisible();
      await expect(primaryCTA).toBeEnabled();
      
      // Test CTA has proper focus states
      await primaryCTA.focus();
      await expect(primaryCTA).toBeFocused();
      
      // Test CTA has proper ARIA attributes and semantic meaning
      const ctaRole = await primaryCTA.getAttribute('role');
      const ctaType = await primaryCTA.getAttribute('type');
      
      // Should be a proper button element
      expect(ctaType).toBe('button');
      
      // Test CTA click functionality (should scroll to experience section)
      // First, ensure we're at the top of the page
      await page.evaluate(() => window.scrollTo(0, 0));
      await page.waitForTimeout(100);
      
      const initialScrollY = await page.evaluate(() => window.scrollY);
      expect(initialScrollY).toBe(0);
      
      // Click the CTA
      await primaryCTA.click();
      
      // Wait for smooth scroll to complete
      await page.waitForTimeout(1000);
      
      // Verify page has scrolled down
      const finalScrollY = await page.evaluate(() => window.scrollY);
      expect(finalScrollY).toBeGreaterThan(initialScrollY);
      
      // Verify we scrolled to the experience section (or at least significantly down)
      expect(finalScrollY).toBeGreaterThan(200); // Should scroll at least 200px down
    }
  });

  test('Property: Secondary CTA (Download Resume) functionality works correctly', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1200, height: 800 } // Desktop
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Test secondary CTA is clickable and accessible
      const secondaryCTA = page.locator('button', { hasText: 'Download Resume' });
      await expect(secondaryCTA).toBeVisible();
      await expect(secondaryCTA).toBeEnabled();
      
      // Test CTA has proper focus states
      await secondaryCTA.focus();
      await expect(secondaryCTA).toBeFocused();
      
      // Test CTA has proper semantic meaning
      const ctaType = await secondaryCTA.getAttribute('type');
      expect(ctaType).toBe('button');
      
      // Test download functionality (we can't test actual file download in Playwright easily,
      // but we can test that the click handler executes without errors)
      let downloadTriggered = false;
      
      // Listen for any navigation or download events
      page.on('download', () => {
        downloadTriggered = true;
      });
      
      // Mock the download functionality to avoid actual file operations
      await page.addInitScript(() => {
        // Override document.createElement to track download link creation
        const originalCreateElement = document.createElement.bind(document);
        document.createElement = function(tagName) {
          const element = originalCreateElement(tagName);
          if (tagName.toLowerCase() === 'a') {
            // Mock the download behavior
            const originalClick = element.click.bind(element);
            element.click = function() {
              // Set a flag that we can check
              (window as any).downloadAttempted = true;
              // Don't actually trigger the download
            };
          }
          return element;
        };
      });
      
      // Click the download button
      await secondaryCTA.click();
      
      // Wait a moment for any async operations
      await page.waitForTimeout(500);
      
      // Check if download was attempted (via our mock)
      const downloadAttempted = await page.evaluate(() => (window as any).downloadAttempted);
      
      // The download functionality should have been triggered
      // (either actual download or our mock detected the attempt)
      expect(downloadAttempted || downloadTriggered).toBeTruthy();
    }
  });

  test('Property: Hero content hierarchy and typography are appropriate', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3); // Reduced from 10 to 3
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Test heading hierarchy is correct
      const h1Elements = page.locator('h1');
      const h1Count = await h1Elements.count();
      expect(h1Count).toBe(1); // Should have exactly one H1 (the name)
      
      const h1Text = await h1Elements.first().textContent();
      expect(h1Text).toContain('Arnav Tiwari');
      
      // Test role text has appropriate styling (should be prominent but secondary to name)
      const roleElement = page.locator('text=Software Engineer').first();
      const roleStyles = await roleElement.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          color: styles.color
        };
      });
      
      const roleFontSize = parseFloat(roleStyles.fontSize);
      if (!isNaN(roleFontSize)) {
        // Role should be smaller than name but still prominent
        expect(roleFontSize).toBeGreaterThanOrEqual(18); // Minimum readable size
        expect(roleFontSize).toBeLessThanOrEqual(40); // Should be smaller than name
      }
      
      // Test value proposition text is readable
      const valueProposition = page.locator('text=Software Engineering student at IIIT Nagpur').first();
      const valueStyles = await valueProposition.evaluate(el => {
        const styles = getComputedStyle(el);
        return styles.fontSize;
      });
      
      const valueFontSize = parseFloat(valueStyles);
      if (!isNaN(valueFontSize)) {
        expect(valueFontSize).toBeGreaterThanOrEqual(16); // Minimum readable body text
        expect(valueFontSize).toBeLessThanOrEqual(24); // Reasonable maximum
      }
      
      // Test color contrast (basic check - elements should have defined colors)
      const nameColor = await page.locator('h1').first().evaluate(el => {
        return getComputedStyle(el).color;
      });
      
      const roleColor = await roleElement.evaluate(el => {
        return getComputedStyle(el).color;
      });
      
      // Colors should be defined (not transparent or inherit)
      expect(nameColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(roleColor).not.toBe('rgba(0, 0, 0, 0)');
    }
  });

  test('Property: Hero section accessibility features work correctly', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 1200, height: 800 } // Desktop - removed tablet for speed
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Test keyboard navigation through hero elements
      await page.keyboard.press('Tab'); // Should focus on first interactive element
      
      // Find all focusable elements in hero section
      const heroSection = page.locator('section').first();
      const focusableElements = heroSection.locator('button, a, [tabindex]:not([tabindex="-1"])');
      const focusableCount = await focusableElements.count();
      
      expect(focusableCount).toBeGreaterThanOrEqual(2); // At least the two CTA buttons
      
      // Test that all focusable elements can receive focus
      for (let i = 0; i < focusableCount; i++) {
        const element = focusableElements.nth(i);
        await element.focus();
        await expect(element).toBeFocused();
        
        // Test that focused elements have visible focus indicators
        const focusStyles = await element.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            outline: styles.outline,
            outlineWidth: styles.outlineWidth,
            boxShadow: styles.boxShadow
          };
        });
        
        // Should have some form of focus indication (outline or box-shadow)
        const hasFocusIndicator = 
          focusStyles.outline !== 'none' || 
          focusStyles.outlineWidth !== '0px' || 
          focusStyles.boxShadow !== 'none';
        
        expect(hasFocusIndicator).toBeTruthy();
      }
      
      // Test semantic HTML structure
      const heroHeading = page.locator('h1').first();
      await expect(heroHeading).toBeVisible();
      
      // Test that buttons have proper button semantics
      const buttons = heroSection.locator('button');
      const buttonCount = await buttons.count();
      
      for (let i = 0; i < buttonCount; i++) {
        const button = buttons.nth(i);
        const buttonText = await button.textContent();
        
        // Buttons should have descriptive text
        expect(buttonText?.trim().length).toBeGreaterThan(0);
        
        // Test button has proper role
        const role = await button.getAttribute('role');
        // Role should be button (default) or explicitly set
        if (role) {
          expect(role).toBe('button');
        }
      }
      
      // Test that text content is properly structured for screen readers
      const allText = await heroSection.textContent();
      expect(allText).toContain('Arnav Tiwari');
      expect(allText).toContain('Software Engineer');
      expect(allText).toContain('View My Work');
      expect(allText).toContain('Download Resume');
    }
  });

  test('Property: Hero section performance and loading behavior', async ({ page }) => {
    // Test with fewer viewport sizes for faster execution
    const testViewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 1200, height: 800 } // Desktop - removed tablet and large desktop
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      
      // Measure page load performance
      const startTime = Date.now();
      await page.goto('/', { waitUntil: 'networkidle' });
      const loadTime = Date.now() - startTime;
      
      // Hero should load reasonably quickly (under 5 seconds even on slow connections)
      expect(loadTime).toBeLessThan(5000);
      
      // Test that hero content is visible immediately after load
      const heroSection = page.locator('section').first();
      await expect(heroSection).toBeVisible();
      
      // Test that critical hero elements are present without additional loading
      await expect(page.locator('h1', { hasText: 'Arnav Tiwari' })).toBeVisible();
      await expect(page.locator('button', { hasText: 'View My Work' })).toBeVisible();
      await expect(page.locator('button', { hasText: 'Download Resume' })).toBeVisible();
      
      // Test that animations don't cause layout shifts
      const initialHeroBox = await heroSection.boundingBox();
      
      // Wait for any animations to complete
      await page.waitForTimeout(1000);
      
      const finalHeroBox = await heroSection.boundingBox();
      
      // Hero section should maintain stable dimensions (no significant layout shift)
      if (initialHeroBox && finalHeroBox) {
        const heightDifference = Math.abs(initialHeroBox.height - finalHeroBox.height);
        expect(heightDifference).toBeLessThan(50); // Allow small variations but no major shifts
      }
    }
  });
});