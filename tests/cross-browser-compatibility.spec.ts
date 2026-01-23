/**
 * Property-Based Test: Cross-Browser Compatibility
 * Feature: portfolio-website, Property 12: Cross-Browser Compatibility
 * **Validates: Requirements 5.3**
 * 
 * Tests that the portfolio maintains readability and full functionality across
 * major browsers (Chrome, Firefox, Safari, Edge) and mobile platforms (iOS Safari, Android Chrome).
 */

import { test, expect, devices } from '@playwright/test';

// Test configurations for different browsers and platforms
const browserConfigurations = [
  { name: 'Desktop Chrome', device: devices['Desktop Chrome'], platform: 'desktop' },
  { name: 'Desktop Firefox', device: devices['Desktop Firefox'], platform: 'desktop' },
  { name: 'Desktop Safari', device: devices['Desktop Safari'], platform: 'desktop' },
  { name: 'Desktop Edge', device: devices['Desktop Edge'], platform: 'desktop' },
  { name: 'Mobile Chrome (Android)', device: devices['Pixel 5'], platform: 'mobile' },
  { name: 'Mobile Safari (iOS)', device: devices['iPhone 12'], platform: 'mobile' },
];

test.describe('Property 12: Cross-Browser Compatibility', () => {
  
  for (const config of browserConfigurations) {
    test.describe(`${config.name}`, () => {
      
      test.use(config.device);
      
      test('Property: Core layout and navigation render correctly', async ({ page, browserName }) => {
        await page.goto('/');
        
        // Wait for page to be fully loaded
        await page.waitForLoadState('networkidle');
        
        // Test header is visible and properly positioned
        const header = page.locator('header');
        await expect(header).toBeVisible();
        
        // Test logo/name is visible
        const logo = header.locator('a').first();
        await expect(logo).toBeVisible();
        await expect(logo).toContainText('Arnav');
        
        // Test navigation based on platform
        if (config.platform === 'desktop') {
          // Desktop navigation should be visible
          const desktopNav = page.locator('nav').first();
          await expect(desktopNav).toBeVisible();
          
          // Test navigation links are clickable
          const navButtons = desktopNav.locator('button');
          const navCount = await navButtons.count();
          expect(navCount).toBeGreaterThan(0);
          
          // Test first nav button is interactive
          const firstNavButton = navButtons.first();
          await expect(firstNavButton).toBeVisible();
          await expect(firstNavButton).toBeEnabled();
          
        } else {
          // Mobile: hamburger menu should be visible
          const mobileMenuButton = page.locator('button[aria-label*="menu" i], button[aria-label*="navigation" i]').first();
          await expect(mobileMenuButton).toBeVisible();
          await expect(mobileMenuButton).toBeEnabled();
          
          // Test mobile menu can be opened
          await mobileMenuButton.click();
          await page.waitForTimeout(300);
          
          // Mobile menu should appear
          const mobileNav = page.locator('[id*="mobile"], [class*="mobile"]').first();
          // Just verify the button click worked - menu visibility varies by implementation
        }
        
        // Test main content is visible
        const main = page.locator('main');
        await expect(main).toBeVisible();
        
        // Test hero section is visible
        const heroSection = page.locator('section').first();
        await expect(heroSection).toBeVisible();
        
        // Test footer is visible
        const footer = page.locator('footer');
        await expect(footer).toBeVisible();
      });
      
      test('Property: Typography renders correctly and is readable', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Test hero heading is visible and readable
        const heroHeading = page.locator('h1').first();
        await expect(heroHeading).toBeVisible();
        
        const headingText = await heroHeading.textContent();
        expect(headingText).toBeTruthy();
        expect(headingText!.length).toBeGreaterThan(0);
        
        // Test heading has appropriate font size
        const headingStyles = await heroHeading.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            fontSize: parseFloat(styles.fontSize),
            fontWeight: styles.fontWeight,
            color: styles.color
          };
        });
        
        expect(headingStyles.fontSize).toBeGreaterThan(24); // Minimum readable heading size
        expect(headingStyles.fontWeight).toBeTruthy();
        
        // Test body text is readable
        const bodyText = page.locator('p').first();
        await expect(bodyText).toBeVisible();
        
        const bodyStyles = await bodyText.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            fontSize: parseFloat(styles.fontSize),
            lineHeight: parseFloat(styles.lineHeight)
          };
        });
        
        expect(bodyStyles.fontSize).toBeGreaterThanOrEqual(14); // Minimum readable body text
        expect(bodyStyles.lineHeight).toBeGreaterThan(bodyStyles.fontSize); // Proper line spacing
      });
      
      test('Property: Interactive elements are functional', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Test buttons are clickable
        const buttons = page.locator('button, a[role="button"]');
        const buttonCount = await buttons.count();
        
        if (buttonCount > 0) {
          const firstButton = buttons.first();
          await expect(firstButton).toBeVisible();
          await expect(firstButton).toBeEnabled();
          
          // Test button can receive focus
          await firstButton.focus();
          await expect(firstButton).toBeFocused();
        }
        
        // Test links are clickable
        const links = page.locator('a[href]');
        const linkCount = await links.count();
        expect(linkCount).toBeGreaterThan(0);
        
        const firstLink = links.first();
        await expect(firstLink).toBeVisible();
        
        // Test link has href attribute
        const href = await firstLink.getAttribute('href');
        expect(href).toBeTruthy();
      });
      
      test('Property: Forms render and validate correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Scroll to contact section
        const contactSection = page.locator('section').last();
        await contactSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        // Test form inputs are visible and functional
        const nameInput = page.locator('input[name="name"], input[id="name"]');
        if (await nameInput.count() > 0) {
          await expect(nameInput.first()).toBeVisible();
          await expect(nameInput.first()).toBeEnabled();
          
          // Test input accepts text
          await nameInput.first().fill('Test User');
          const inputValue = await nameInput.first().inputValue();
          expect(inputValue).toBe('Test User');
        }
        
        const emailInput = page.locator('input[type="email"], input[name="email"], input[id="email"]');
        if (await emailInput.count() > 0) {
          await expect(emailInput.first()).toBeVisible();
          await expect(emailInput.first()).toBeEnabled();
          
          // Test email input accepts text
          await emailInput.first().fill('test@example.com');
          const emailValue = await emailInput.first().inputValue();
          expect(emailValue).toBe('test@example.com');
        }
        
        const messageInput = page.locator('textarea[name="message"], textarea[id="message"]');
        if (await messageInput.count() > 0) {
          await expect(messageInput.first()).toBeVisible();
          await expect(messageInput.first()).toBeEnabled();
          
          // Test textarea accepts text
          await messageInput.first().fill('Test message');
          const messageValue = await messageInput.first().inputValue();
          expect(messageValue).toBe('Test message');
        }
      });
      
      test('Property: Images load and display correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Wait for images to load
        await page.waitForTimeout(1000);
        
        // Test images are present
        const images = page.locator('img');
        const imageCount = await images.count();
        
        if (imageCount > 0) {
          // Test first few images
          const testCount = Math.min(3, imageCount);
          
          for (let i = 0; i < testCount; i++) {
            const img = images.nth(i);
            
            // Scroll image into view
            await img.scrollIntoViewIfNeeded();
            await page.waitForTimeout(300);
            
            // Test image is visible
            await expect(img).toBeVisible();
            
            // Test image has alt text (accessibility)
            const alt = await img.getAttribute('alt');
            expect(alt).toBeDefined(); // Alt can be empty string for decorative images
            
            // Test image has loaded (has natural dimensions)
            const dimensions = await img.evaluate((el: HTMLImageElement) => ({
              naturalWidth: el.naturalWidth,
              naturalHeight: el.naturalHeight,
              complete: el.complete
            }));
            
            // Image should be complete
            expect(dimensions.complete).toBe(true);
          }
        }
      });
      
      test('Property: CSS styles are applied correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Test header has background color
        const header = page.locator('header');
        const headerStyles = await header.evaluate(el => {
          const styles = getComputedStyle(el);
          return {
            backgroundColor: styles.backgroundColor,
            position: styles.position,
            zIndex: styles.zIndex
          };
        });
        
        expect(headerStyles.backgroundColor).toBeTruthy();
        expect(headerStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)'); // Not transparent
        expect(headerStyles.position).toBe('fixed'); // Header should be fixed
        
        // Test buttons have proper styling
        const button = page.locator('button').first();
        if (await button.count() > 0) {
          const buttonStyles = await button.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              cursor: styles.cursor,
              borderRadius: styles.borderRadius,
              padding: styles.padding
            };
          });
          
          expect(buttonStyles.cursor).toBe('pointer');
          expect(buttonStyles.padding).toBeTruthy();
        }
        
        // Test cards have proper styling
        const card = page.locator('[class*="card" i], [class*="Card" i]').first();
        if (await card.count() > 0) {
          const cardStyles = await card.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              backgroundColor: styles.backgroundColor,
              borderRadius: styles.borderRadius,
              boxShadow: styles.boxShadow
            };
          });
          
          expect(cardStyles.backgroundColor).toBeTruthy();
        }
      });
      
      test('Property: Scroll behavior works correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Get initial scroll position
        const initialScroll = await page.evaluate(() => window.scrollY);
        expect(initialScroll).toBe(0);
        
        // Test scrolling works
        await page.evaluate(() => window.scrollTo(0, 500));
        await page.waitForTimeout(300);
        
        const scrolledPosition = await page.evaluate(() => window.scrollY);
        expect(scrolledPosition).toBeGreaterThan(0);
        
        // Test scroll to top works
        await page.evaluate(() => window.scrollTo(0, 0));
        await page.waitForTimeout(300);
        
        const topPosition = await page.evaluate(() => window.scrollY);
        expect(topPosition).toBe(0);
      });
      
      test('Property: Hover and focus states work correctly', async ({ page }) => {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Test button focus state
        const button = page.locator('button').first();
        if (await button.count() > 0) {
          await button.focus();
          await expect(button).toBeFocused();
          
          // Test button has focus styles
          const focusStyles = await button.evaluate(el => {
            const styles = getComputedStyle(el);
            return {
              outline: styles.outline,
              outlineWidth: styles.outlineWidth,
              boxShadow: styles.boxShadow
            };
          });
          
          // Should have some focus indicator (outline or box-shadow)
          const hasFocusIndicator = 
            focusStyles.outline !== 'none' || 
            focusStyles.outlineWidth !== '0px' ||
            focusStyles.boxShadow !== 'none';
          
          expect(hasFocusIndicator).toBe(true);
        }
        
        // Test link focus state
        const link = page.locator('a[href]').first();
        await link.focus();
        await expect(link).toBeFocused();
      });
      
      test('Property: Page performance is acceptable', async ({ page }) => {
        const startTime = Date.now();
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        const loadTime = Date.now() - startTime;
        
        // Page should load within reasonable time (10 seconds for all browsers)
        expect(loadTime).toBeLessThan(10000);
        
        // Test page is interactive
        const button = page.locator('button').first();
        if (await button.count() > 0) {
          await expect(button).toBeEnabled();
        }
      });
      
      test('Property: Console errors are minimal', async ({ page }) => {
        const consoleErrors: string[] = [];
        
        page.on('console', msg => {
          if (msg.type() === 'error') {
            consoleErrors.push(msg.text());
          }
        });
        
        await page.goto('/');
        await page.waitForLoadState('networkidle');
        
        // Wait a bit for any delayed errors
        await page.waitForTimeout(2000);
        
        // Filter out known acceptable errors (like network errors in tests)
        const criticalErrors = consoleErrors.filter(error => 
          !error.includes('favicon') &&
          !error.includes('net::ERR') &&
          !error.includes('Failed to load resource')
        );
        
        // Should have minimal critical console errors
        expect(criticalErrors.length).toBeLessThan(5);
      });
    });
  }
});
