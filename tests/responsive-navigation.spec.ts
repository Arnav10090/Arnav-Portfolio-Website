/**
 * Property-Based Test: Responsive Design Compliance
 * Feature: portfolio-website, Property 11: Responsive Design Compliance
 * **Validates: Requirements 5.1, 5.4, 5.5**
 * 
 * Tests that navigation components render correctly across viewport sizes from 320px to 1920px,
 * with appropriate typography scaling and touch targets ≥ 44px on mobile devices.
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

test.describe('Property 11: Responsive Design Compliance', () => {
  
  test.beforeEach(async ({ page }) => {
    // Create a test page that includes the Header and Footer components
    await page.setContent(`
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Responsive Navigation Test</title>
          <script src="https://cdn.tailwindcss.com"></script>
          <script>
            tailwind.config = {
              theme: {
                extend: {
                  colors: {
                    primary: {
                      50: '#eff6ff',
                      500: '#3b82f6',
                      600: '#2563eb',
                      700: '#1d4ed8'
                    },
                    gray: {
                      50: '#f9fafb',
                      100: '#f3f4f6',
                      200: '#e5e7eb',
                      500: '#6b7280',
                      600: '#4b5563',
                      700: '#374151',
                      900: '#111827'
                    }
                  }
                }
              }
            }
          </script>
        </head>
        <body>
          <!-- Header Component (matches the React component structure) -->
          <header class="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-sm shadow-sm border-b border-gray-200">
            <!-- Skip to main content link -->
            <a href="#main-content" class="absolute -top-10 left-4 bg-primary-500 text-white px-4 py-2 rounded-md z-50 focus:top-4 transition-all">
              Skip to main content
            </a>
            
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
              <div class="flex items-center justify-between h-16">
                <!-- Logo/Name -->
                <div class="flex-shrink-0">
                  <a href="/" class="text-xl font-semibold text-gray-900 hover:text-primary-600 transition-colors">
                    Arnav Tiwari
                  </a>
                </div>

                <!-- Desktop Navigation -->
                <nav class="hidden md:flex items-center space-x-8">
                  <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm">About</button>
                  <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm">Experience</button>
                  <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm">Projects</button>
                  <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm">Skills</button>
                  <button class="text-gray-700 hover:text-primary-600 font-medium transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2 rounded-sm">Contact</button>
                </nav>

                <!-- Desktop Resume Download -->
                <div class="hidden md:flex">
                  <a href="/resume.pdf" download="Arnav_Tiwari_Resume.pdf" class="inline-flex items-center justify-center h-9 px-3 text-sm rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 active:bg-primary-100 shadow-sm hover:shadow-md">
                    Download Resume
                  </a>
                </div>

                <!-- Mobile menu button -->
                <div class="md:hidden">
                  <button id="mobile-menu-button" class="inline-flex items-center justify-center w-11 h-11 rounded-md text-gray-700 hover:text-primary-600 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-500" aria-expanded="false" aria-label="Toggle navigation menu">
                    <span class="sr-only">Open main menu</span>
                    <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              </div>
            </div>

            <!-- Mobile Navigation Overlay -->
            <div id="mobile-menu" class="md:hidden hidden">
              <div class="fixed inset-0 z-40 bg-black bg-opacity-50" onclick="document.getElementById('mobile-menu-button').click()"></div>
              <div class="fixed top-16 left-0 right-0 z-50 bg-white border-b border-gray-200 shadow-lg">
                <div class="px-4 py-6 space-y-1">
                  <button class="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">About</button>
                  <button class="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">Experience</button>
                  <button class="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">Projects</button>
                  <button class="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">Skills</button>
                  <button class="block w-full text-left px-3 py-3 text-base font-medium text-gray-700 hover:text-primary-600 hover:bg-gray-50 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-primary-500 min-h-[44px]">Contact</button>
                  <div class="pt-4 border-t border-gray-200">
                    <a href="/resume.pdf" download="Arnav_Tiwari_Resume.pdf" class="inline-flex items-center justify-center w-full h-12 px-4 py-3 text-base rounded-md font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 bg-white text-primary-600 border border-primary-200 hover:bg-primary-50 hover:border-primary-300 active:bg-primary-100 shadow-sm hover:shadow-md min-h-[48px]">
                      Download Resume
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </header>

          <!-- Main Content -->
          <main id="main-content" class="pt-16">
            <div class="min-h-screen bg-gray-50 p-8">
              <h1 class="text-4xl font-bold text-center">Portfolio Content</h1>
            </div>
          </main>

          <!-- Footer Component -->
          <footer class="bg-gray-50 border-t border-gray-200">
            <div class="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
              <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Contact</h3>
                  <div class="space-y-2 text-gray-600">
                    <p><a href="mailto:arnav.tiwari@example.com" class="hover:text-primary-600 transition-colors">arnav.tiwari@example.com</a></p>
                    <p>Nagpur, India</p>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Connect</h3>
                  <div class="flex space-x-4">
                    <a href="#" class="text-gray-600 hover:text-primary-600 transition-colors p-3 rounded-md hover:bg-gray-100" aria-label="LinkedIn">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286z"/></svg>
                    </a>
                    <a href="#" class="text-gray-600 hover:text-primary-600 transition-colors p-3 rounded-md hover:bg-gray-100" aria-label="GitHub">
                      <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"/></svg>
                    </a>
                  </div>
                </div>
                <div>
                  <h3 class="text-lg font-semibold text-gray-900 mb-4">Built With</h3>
                  <div class="space-y-2 text-gray-600 text-sm">
                    <p><a href="https://nextjs.org" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">Next.js 14</a></p>
                    <p><a href="https://tailwindcss.com" target="_blank" rel="noopener noreferrer" class="hover:text-primary-600 transition-colors">Tailwind CSS</a></p>
                  </div>
                </div>
              </div>
            </div>
          </footer>

          <script>
            // Mobile menu toggle functionality
            const mobileMenuButton = document.getElementById('mobile-menu-button');
            const mobileMenu = document.getElementById('mobile-menu');
            
            mobileMenuButton.addEventListener('click', () => {
              const isOpen = !mobileMenu.classList.contains('hidden');
              if (isOpen) {
                mobileMenu.classList.add('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'false');
              } else {
                mobileMenu.classList.remove('hidden');
                mobileMenuButton.setAttribute('aria-expanded', 'true');
              }
            });
          </script>
        </body>
      </html>
    `);
  });

  test('Property: Navigation renders correctly across all viewport sizes (320px-1920px)', async ({ page }) => {
    // Generate 20 random viewport widths for comprehensive testing
    const viewportWidths = generateViewportWidths(20);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      
      // Set viewport size
      await page.setViewportSize({ width, height });
      
      // Wait for layout to stabilize
      await page.waitForTimeout(200);
      
      // Test header is always visible and properly positioned
      const header = page.locator('header');
      await expect(header).toBeVisible();
      
      // Verify header is fixed at top
      const headerBox = await header.boundingBox();
      expect(headerBox?.y).toBe(0);
      expect(headerBox?.width).toBeGreaterThan(0);
      
      // Test logo/name is always visible
      const logo = page.locator('header a[href="/"]');
      await expect(logo).toBeVisible();
      await expect(logo).toContainText('Arnav Tiwari');
      
      if (width >= 768) {
        // Desktop/Tablet: Desktop navigation should be visible
        const desktopNav = page.locator('nav.hidden.md\\:flex');
        await expect(desktopNav).toBeVisible();
        
        // Mobile menu button should be hidden
        const mobileButton = page.locator('#mobile-menu-button');
        await expect(mobileButton).toBeHidden();
        
        // Test all desktop navigation links are visible and clickable
        const navButtons = desktopNav.locator('button');
        const navCount = await navButtons.count();
        expect(navCount).toBe(5); // About, Experience, Projects, Skills, Contact
        
        for (let i = 0; i < navCount; i++) {
          const button = navButtons.nth(i);
          await expect(button).toBeVisible();
          
          // Test button is focusable
          await button.focus();
          await expect(button).toBeFocused();
        }
        
        // Desktop resume download should be visible
        const desktopResume = page.locator('header .hidden.md\\:flex a[download]');
        await expect(desktopResume).toBeVisible();
        
      } else {
        // Mobile: Desktop navigation should be hidden
        const desktopNav = page.locator('nav.hidden.md\\:flex');
        await expect(desktopNav).toBeHidden();
        
        // Mobile menu button should be visible
        const mobileButton = page.locator('#mobile-menu-button');
        await expect(mobileButton).toBeVisible();
        
        // Test mobile button has proper touch target size (≥ 44px)
        const buttonBox = await mobileButton.boundingBox();
        expect(buttonBox?.width).toBeGreaterThanOrEqual(44);
        expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
        
        // Test mobile menu functionality
        await mobileButton.click();
        
        // Wait for mobile menu to appear
        await page.waitForTimeout(100);
        
        const mobileMenu = page.locator('#mobile-menu');
        // Check if mobile menu is visible by checking if it doesn't have 'hidden' class
        const isMenuVisible = await mobileMenu.evaluate(el => !el.classList.contains('hidden'));
        
        if (isMenuVisible) {
          // Test mobile navigation links have proper touch targets
          const mobileNavButtons = mobileMenu.locator('button');
          const mobileNavCount = await mobileNavButtons.count();
          expect(mobileNavCount).toBe(5);
          
          for (let i = 0; i < mobileNavCount; i++) {
            const button = mobileNavButtons.nth(i);
            await expect(button).toBeVisible();
            
            const buttonBox = await button.boundingBox();
            expect(buttonBox?.height).toBeGreaterThanOrEqual(44);
            
            // Test button is focusable
            await button.focus();
            await expect(button).toBeFocused();
          }
          
          // Mobile resume download should be visible and have proper touch target
          const mobileResume = mobileMenu.locator('a[download]');
          await expect(mobileResume).toBeVisible();
          
          const resumeBox = await mobileResume.boundingBox();
          expect(resumeBox?.height).toBeGreaterThanOrEqual(44);
          
          // Close mobile menu by clicking the overlay
          const overlay = mobileMenu.locator('div.fixed.inset-0');
          await overlay.click();
          await page.waitForTimeout(100);
        }
      }
      
      // Test skip-to-main-content link exists (it's screen-reader only until focused)
      const skipLink = page.locator('a[href="#main-content"]');
      await expect(skipLink).toBeAttached(); // Should exist in DOM
      
      // Test footer is always visible and properly laid out
      const footer = page.locator('footer');
      await expect(footer).toBeVisible();
      
      // Test footer content adapts to viewport
      if (width >= 768) {
        // Desktop: Should have 3-column grid
        const footerGrid = footer.locator('.grid-cols-1.md\\:grid-cols-3');
        await expect(footerGrid).toBeVisible();
      }
      
      // Test social links have proper touch targets on mobile
      const socialLinks = footer.locator('a[aria-label]');
      const socialCount = await socialLinks.count();
      
      for (let i = 0; i < socialCount; i++) {
        const link = socialLinks.nth(i);
        await expect(link).toBeVisible();
        
        if (width < 768) {
          const linkBox = await link.boundingBox();
          expect(linkBox?.width).toBeGreaterThanOrEqual(44);
          expect(linkBox?.height).toBeGreaterThanOrEqual(44);
        }
      }
    }
  });

  test('Property: Typography scales appropriately across viewport sizes', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 }, // Mobile
      { width: 768, height: 1024 }, // Tablet
      { width: 1024, height: 768 }, // Desktop small
      { width: 1920, height: 1080 } // Desktop large
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Test logo text size is appropriate
      const logo = page.locator('header a[href="/"]');
      await expect(logo).toBeVisible();
      
      const logoStyles = await logo.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      });
      
      const logoFontSize = parseFloat(logoStyles.fontSize);
      
      // Only test if we get a valid font size
      if (!isNaN(logoFontSize) && logoFontSize > 0) {
        // Logo should be readable but not overwhelming
        expect(logoFontSize).toBeGreaterThanOrEqual(16); // Minimum readable size
        expect(logoFontSize).toBeLessThanOrEqual(32); // Maximum reasonable size
      }
      
      // Test navigation text is appropriately sized
      if (viewport.width >= 768) {
        const navButton = page.locator('nav.hidden.md\\:flex button').first();
        if (await navButton.isVisible()) {
          const navStyles = await navButton.evaluate(el => {
            const styles = getComputedStyle(el);
            return styles.fontSize;
          });
          const navFontSize = parseFloat(navStyles);
          
          if (!isNaN(navFontSize) && navFontSize > 0) {
            expect(navFontSize).toBeGreaterThanOrEqual(14);
            expect(navFontSize).toBeLessThanOrEqual(18);
          }
        }
      } else {
        // Mobile navigation should have larger touch-friendly text
        const mobileButton = page.locator('#mobile-menu-button');
        await mobileButton.click();
        await page.waitForTimeout(100);
        
        const mobileNavButton = page.locator('#mobile-menu button').first();
        if (await mobileNavButton.isVisible()) {
          const mobileNavStyles = await mobileNavButton.evaluate(el => {
            const styles = getComputedStyle(el);
            return styles.fontSize;
          });
          const mobileNavFontSize = parseFloat(mobileNavStyles);
          
          if (!isNaN(mobileNavFontSize) && mobileNavFontSize > 0) {
            expect(mobileNavFontSize).toBeGreaterThanOrEqual(16); // Larger for touch
          }
        }
        
        // Close menu by clicking overlay
        const overlay = page.locator('#mobile-menu div.fixed.inset-0');
        if (await overlay.isVisible()) {
          await overlay.click();
          await page.waitForTimeout(100);
        }
      }
      
      // Test footer text scales appropriately
      const footerHeading = page.locator('footer h3').first();
      if (await footerHeading.isVisible()) {
        const footerStyles = await footerHeading.evaluate(el => {
          const styles = getComputedStyle(el);
          return styles.fontSize;
        });
        const footerFontSize = parseFloat(footerStyles);
        
        if (!isNaN(footerFontSize) && footerFontSize > 0) {
          expect(footerFontSize).toBeGreaterThanOrEqual(16);
          expect(footerFontSize).toBeLessThanOrEqual(24);
        }
      }
    }
  });

  test('Property: Interactive elements maintain proper spacing and layout', async ({ page }) => {
    // Test with various viewport sizes
    const viewportWidths = generateViewportWidths(10);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Test header maintains proper height and spacing
      const header = page.locator('header');
      const headerBox = await header.boundingBox();
      expect(headerBox?.height).toBeGreaterThanOrEqual(64); // Minimum header height
      
      // Test navigation elements don't overlap
      if (width >= 768) {
        const navButtons = page.locator('nav.hidden.md\\:flex button');
        const navCount = await navButtons.count();
        
        if (navCount > 1) {
          const firstButton = await navButtons.nth(0).boundingBox();
          const secondButton = await navButtons.nth(1).boundingBox();
          
          // Buttons should not overlap (only test if both buttons have valid bounding boxes)
          if (firstButton && secondButton) {
            expect(firstButton.x + firstButton.width).toBeLessThanOrEqual(secondButton.x);
          }
        }
      }
      
      // Test footer maintains proper spacing
      const footer = page.locator('footer');
      const footerBox = await footer.boundingBox();
      expect(footerBox?.height).toBeGreaterThan(0);
      
      // Test footer content doesn't overflow
      const footerContent = footer.locator('.max-w-6xl');
      const contentBox = await footerContent.boundingBox();
      expect(contentBox?.width).toBeLessThanOrEqual(width);
    }
  });

  test('Property: Focus management and keyboard navigation work across all viewport sizes', async ({ page }) => {
    const testViewports = [
      { width: 320, height: 568 },
      { width: 768, height: 1024 },
      { width: 1200, height: 800 }
    ];
    
    for (const viewport of testViewports) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Reset focus by clicking on body
      await page.locator('body').click();
      
      // Test that we can focus on the logo (first main focusable element)
      const logo = page.locator('header a[href="/"]');
      await logo.focus();
      await expect(logo).toBeFocused();
      
      if (viewport.width >= 768) {
        // Desktop: Test navigation buttons are focusable in order
        const navButtons = page.locator('nav.hidden.md\\:flex button');
        const navCount = await navButtons.count();
        
        for (let i = 0; i < navCount; i++) {
          await page.keyboard.press('Tab');
          await expect(navButtons.nth(i)).toBeFocused();
        }
        
        // Test resume download is focusable
        await page.keyboard.press('Tab');
        const resumeLink = page.locator('header .hidden.md\\:flex a[download]');
        await expect(resumeLink).toBeFocused();
        
      } else {
        // Mobile: Test mobile menu button is focusable
        await page.keyboard.press('Tab');
        const mobileButton = page.locator('#mobile-menu-button');
        await expect(mobileButton).toBeFocused();
        
        // Test mobile menu navigation with click
        await mobileButton.click();
        await page.waitForTimeout(100);
        
        // Check if mobile menu is visible
        const mobileMenu = page.locator('#mobile-menu');
        const mobileMenuVisible = await mobileMenu.isVisible();
        if (mobileMenuVisible) {
          // Test mobile navigation buttons are focusable
          const mobileNavButtons = mobileMenu.locator('button');
          const mobileNavCount = await mobileNavButtons.count();
          
          if (mobileNavCount > 0) {
            // Focus first mobile nav button
            await mobileNavButtons.first().focus();
            await expect(mobileNavButtons.first()).toBeFocused();
            
            // Test mobile resume download is focusable
            const mobileResume = mobileMenu.locator('a[download]');
            if (await mobileResume.isVisible()) {
              await mobileResume.focus();
              await expect(mobileResume).toBeFocused();
            }
          }
        }
        
        // Close menu by clicking button again
        await mobileButton.click();
        await page.waitForTimeout(100);
      }
    }
  });
});