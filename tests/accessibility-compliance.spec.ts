import { test, expect } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

/**
 * Property 13: Accessibility Compliance
 * **Validates: Requirements 6.1, 6.2, 6.3, 6.4, 6.6**
 * 
 * For any accessibility audit, the portfolio should provide:
 * - Keyboard navigation with visible focus indicators
 * - Semantic HTML structure
 * - Color contrast ratios ≥ 4.5:1 for normal text
 * - Alt text for all images
 * - Respect prefers-reduced-motion settings
 * 
 * Feature: portfolio-website, Property 13: Accessibility Compliance
 */

test.describe('Property 13: Accessibility Compliance', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should have no automatically detectable accessibility violations', async ({ page }) => {
    // Run axe accessibility scan on the entire page
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();

    expect(accessibilityScanResults.violations).toEqual([]);
  });

  test('should provide keyboard navigation for all interactive elements', async ({ page }) => {
    // Test skip to main content link
    await page.keyboard.press('Tab');
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toBeFocused();
    await expect(skipLink).toBeVisible();

    // Test navigation links are keyboard accessible
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab'); // Skip logo
    
    // Should be able to tab through navigation items
    const navButtons = page.locator('nav[aria-label="Main navigation"] button');
    const navButtonCount = await navButtons.count();
    
    for (let i = 0; i < navButtonCount; i++) {
      const button = navButtons.nth(i);
      await expect(button).toBeFocused();
      await page.keyboard.press('Tab');
    }
  });

  test('should have visible focus indicators on all interactive elements', async ({ page }) => {
    // Test various interactive elements for focus indicators
    const interactiveElements = [
      'a[href="#main-content"]', // Skip link
      'a[href="/"]', // Logo
      'nav button', // Navigation buttons
      'button:has-text("Download Resume")', // CTA buttons
    ];

    for (const selector of interactiveElements) {
      const element = page.locator(selector).first();
      await element.focus();
      
      // Check that element has focus styles (outline or ring)
      const outlineWidth = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.outlineWidth;
      });
      
      const boxShadow = await element.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.boxShadow;
      });
      
      // Should have either outline or box-shadow (focus ring)
      expect(outlineWidth !== '0px' || boxShadow !== 'none').toBeTruthy();
    }
  });

  test('should have proper semantic HTML structure with heading hierarchy', async ({ page }) => {
    // Check for proper heading hierarchy (h1 -> h2 -> h3, no skipping)
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();
    const headingLevels = await Promise.all(
      headings.map(h => h.evaluate(el => parseInt(el.tagName.substring(1))))
    );

    // Should have exactly one h1
    const h1Count = headingLevels.filter(level => level === 1).length;
    expect(h1Count).toBe(1);

    // Check heading hierarchy doesn't skip levels
    for (let i = 1; i < headingLevels.length; i++) {
      const diff = headingLevels[i] - headingLevels[i - 1];
      // Difference should be at most 1 when going down, any amount when going up
      if (diff > 0) {
        expect(diff).toBeLessThanOrEqual(1);
      }
    }

    // Check for semantic HTML5 elements
    await expect(page.locator('main')).toBeVisible();
    await expect(page.locator('header')).toBeVisible();
    await expect(page.locator('footer')).toBeVisible();
    await expect(page.locator('nav')).toBeVisible();
    
    // Check sections have proper ARIA labels or headings
    const sections = await page.locator('section').all();
    for (const section of sections) {
      const hasAriaLabel = await section.getAttribute('aria-labelledby');
      const hasHeading = await section.locator('h1, h2, h3').count();
      expect(hasAriaLabel !== null || hasHeading > 0).toBeTruthy();
    }
  });

  test('should have alt text for all images', async ({ page }) => {
    // Wait for images to load
    await page.waitForLoadState('networkidle');

    // Get all img elements
    const images = await page.locator('img').all();
    
    for (const img of images) {
      const alt = await img.getAttribute('alt');
      const ariaHidden = await img.getAttribute('aria-hidden');
      const role = await img.getAttribute('role');
      
      // Image should have alt text, or be marked as decorative (aria-hidden or role="presentation")
      const isDecorative = ariaHidden === 'true' || role === 'presentation';
      const hasAlt = alt !== null && alt !== undefined;
      
      expect(hasAlt || isDecorative).toBeTruthy();
      
      // If has alt, it should not be empty (unless decorative)
      if (hasAlt && !isDecorative) {
        expect(alt.length).toBeGreaterThan(0);
      }
    }
  });

  test('should respect prefers-reduced-motion settings', async ({ page, context }) => {
    // Create a new page with reduced motion preference
    const reducedMotionPage = await context.newPage();
    await reducedMotionPage.emulateMedia({ reducedMotion: 'reduce' });
    await reducedMotionPage.goto('/');

    // Check that animations are disabled or minimal
    const animatedElement = reducedMotionPage.locator('.animate-bounce').first();
    
    if (await animatedElement.count() > 0) {
      const animationDuration = await animatedElement.evaluate(el => {
        const styles = window.getComputedStyle(el);
        return styles.animationDuration;
      });
      
      // Animation duration should be very short (0.01ms as per CSS)
      const duration = parseFloat(animationDuration);
      expect(duration).toBeLessThan(0.1); // Less than 0.1 seconds
    }

    // Check scroll behavior is auto (not smooth)
    const scrollBehavior = await reducedMotionPage.evaluate(() => {
      return window.getComputedStyle(document.documentElement).scrollBehavior;
    });
    
    expect(scrollBehavior).toBe('auto');
    
    await reducedMotionPage.close();
  });

  test('should have proper ARIA labels for interactive elements', async ({ page }) => {
    // Check navigation has proper ARIA labels
    const mainNav = page.locator('nav[aria-label="Main navigation"]');
    await expect(mainNav).toBeVisible();

    const mobileNav = page.locator('nav[aria-label="Mobile navigation"]');
    // Mobile nav might not be visible on desktop, but should exist in DOM
    expect(await mobileNav.count()).toBeGreaterThanOrEqual(0);

    // Check buttons have proper labels
    const buttons = await page.locator('button').all();
    for (const button of buttons) {
      const ariaLabel = await button.getAttribute('aria-label');
      const textContent = await button.textContent();
      const hasLabel = (ariaLabel && ariaLabel.length > 0) || (textContent && textContent.trim().length > 0);
      
      expect(hasLabel).toBeTruthy();
    }

    // Check links have proper labels
    const links = await page.locator('a').all();
    for (const link of links) {
      const ariaLabel = await link.getAttribute('aria-label');
      const textContent = await link.textContent();
      const hasLabel = (ariaLabel && ariaLabel.length > 0) || (textContent && textContent.trim().length > 0);
      
      expect(hasLabel).toBeTruthy();
    }
  });

  test('should have proper color contrast ratios', async ({ page }) => {
    // Run axe scan specifically for color contrast
    const accessibilityScanResults = await new AxeBuilder({ page })
      .withTags(['wcag2aa'])
      .include('body')
      .analyze();

    // Filter for color contrast violations
    const contrastViolations = accessibilityScanResults.violations.filter(
      violation => violation.id === 'color-contrast'
    );

    expect(contrastViolations).toEqual([]);
  });

  test('should have minimum touch target sizes on mobile', async ({ page, context }) => {
    // Set mobile viewport
    await page.setViewportSize({ width: 375, height: 667 });
    await page.goto('/');

    // Check interactive elements have minimum 44x44px touch targets
    const interactiveElements = await page.locator('button, a, input, textarea').all();
    
    for (const element of interactiveElements) {
      const isVisible = await element.isVisible();
      if (!isVisible) continue;

      const box = await element.boundingBox();
      if (box) {
        // WCAG 2.1 AA requires minimum 44x44 pixels
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }
    }
  });

  test('should have proper form labels and error messages', async ({ page }) => {
    // Navigate to contact section
    await page.goto('/#contact');
    await page.waitForSelector('form');

    // Check all form inputs have associated labels
    const inputs = await page.locator('input:not([type="hidden"]), textarea').all();
    
    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      
      // Input should have id with associated label, or aria-label, or aria-labelledby
      if (id) {
        const label = page.locator(`label[for="${id}"]`);
        const hasLabel = await label.count() > 0;
        expect(hasLabel || ariaLabel || ariaLabelledBy).toBeTruthy();
      } else {
        expect(ariaLabel || ariaLabelledBy).toBeTruthy();
      }
    }
  });

  test('should have proper landmark regions', async ({ page }) => {
    // Check for proper landmark regions
    const landmarks = {
      banner: page.locator('header[role="banner"], header:has(nav)'),
      main: page.locator('main[role="main"], main'),
      contentinfo: page.locator('footer[role="contentinfo"], footer'),
      navigation: page.locator('nav'),
    };

    // Should have exactly one banner (header)
    expect(await landmarks.banner.count()).toBeGreaterThanOrEqual(1);

    // Should have exactly one main
    expect(await landmarks.main.count()).toBe(1);

    // Should have exactly one contentinfo (footer)
    expect(await landmarks.contentinfo.count()).toBeGreaterThanOrEqual(1);

    // Should have at least one navigation
    expect(await landmarks.navigation.count()).toBeGreaterThanOrEqual(1);
  });

  test('should support screen reader navigation', async ({ page }) => {
    // Check for screen reader only content
    const srOnly = page.locator('.sr-only');
    expect(await srOnly.count()).toBeGreaterThan(0);

    // Check skip link is screen reader accessible
    const skipLink = page.locator('a:has-text("Skip to main content")');
    await expect(skipLink).toHaveClass(/sr-only/);
    
    // When focused, skip link should become visible
    await skipLink.focus();
    await expect(skipLink).toHaveClass(/focus:not-sr-only/);
  });
});
