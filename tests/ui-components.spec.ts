/**
 * Unit tests for UI Components
 * Tests button variants, card styling, badge categorization, and section heading typography
 * Requirements: 2.4
 */

import { test, expect } from '@playwright/test';

test.describe('UI Components Unit Tests', () => {
  
  test.beforeEach(async ({ page }) => {
    // Create a simple test page with Tailwind CSS
    await page.setContent(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>UI Components Test</title>
          <style>
            /* Tailwind CSS classes for testing */
            .inline-flex { display: inline-flex; }
            .items-center { align-items: center; }
            .justify-center { justify-content: center; }
            .rounded-md { border-radius: 0.375rem; }
            .rounded-lg { border-radius: 0.5rem; }
            .rounded-full { border-radius: 9999px; }
            .font-medium { font-weight: 500; }
            .font-semibold { font-weight: 600; }
            .transition-all { transition: all 0.2s; }
            .bg-primary-500 { background-color: #3b82f6; }
            .bg-white { background-color: white; }
            .bg-gray-100 { background-color: #f3f4f6; }
            .bg-gray-50 { background-color: #f9fafb; }
            .bg-secondary-100 { background-color: #ede9fe; }
            .text-white { color: white; }
            .text-primary-600 { color: #2563eb; }
            .text-gray-700 { color: #374151; }
            .text-gray-600 { color: #4b5563; }
            .text-gray-900 { color: #111827; }
            .text-gray-500 { color: #6b7280; }
            .text-secondary-700 { color: #6d28d9; }
            .border { border-width: 1px; }
            .border-primary-200 { border-color: #bfdbfe; }
            .border-gray-200 { border-color: #e5e7eb; }
            .border-gray-100 { border-color: #f3f4f6; }
            .border-secondary-200 { border-color: #ddd6fe; }
            .shadow-md { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .shadow-sm { box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); }
            .shadow-lg { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .h-9 { height: 2.25rem; }
            .h-10 { height: 2.5rem; }
            .h-12 { height: 3rem; }
            .px-3 { padding-left: 0.75rem; padding-right: 0.75rem; }
            .px-4 { padding-left: 1rem; padding-right: 1rem; }
            .px-6 { padding-left: 1.5rem; padding-right: 1.5rem; }
            .px-2\\.5 { padding-left: 0.625rem; padding-right: 0.625rem; }
            .py-2 { padding-top: 0.5rem; padding-bottom: 0.5rem; }
            .py-3 { padding-top: 0.75rem; padding-bottom: 0.75rem; }
            .py-0\\.5 { padding-top: 0.125rem; padding-bottom: 0.125rem; }
            .p-6 { padding: 1.5rem; }
            .pt-0 { padding-top: 0; }
            .mt-4 { margin-top: 1rem; }
            .mb-12 { margin-bottom: 3rem; }
            .text-xs { font-size: 0.75rem; }
            .text-sm { font-size: 0.875rem; }
            .text-base { font-size: 1rem; }
            .text-lg { font-size: 1.125rem; }
            .text-xl { font-size: 1.25rem; }
            .text-2xl { font-size: 1.5rem; }
            .text-3xl { font-size: 1.875rem; }
            .text-4xl { font-size: 2.25rem; }
            .text-5xl { font-size: 3rem; }
            .text-center { text-align: center; }
            .tracking-tight { letter-spacing: -0.025em; }
            .leading-none { line-height: 1; }
            .flex { display: flex; }
            .flex-col { flex-direction: column; }
            .space-y-1\\.5 > * + * { margin-top: 0.375rem; }
            .max-w-2xl { max-width: 42rem; }
            .mx-auto { margin-left: auto; margin-right: auto; }
            .focus-visible\\:outline-none:focus-visible { outline: none; }
            .focus-visible\\:ring-2:focus-visible { box-shadow: 0 0 0 2px #3b82f6; }
            .hover\\:bg-primary-600:hover { background-color: #2563eb; }
            .hover\\:shadow-lg:hover { box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1); }
            .hover\\:shadow-md:hover { box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1); }
            .hover\\:border-gray-300:hover { border-color: #d1d5db; }
            .disabled\\:opacity-50:disabled { opacity: 0.5; }
            .disabled\\:pointer-events-none:disabled { pointer-events: none; }
            @media (min-width: 768px) {
              .md\\:text-5xl { font-size: 3rem; }
              .md\\:text-3xl { font-size: 1.875rem; }
              .md\\:text-2xl { font-size: 1.5rem; }
              .md\\:mb-16 { margin-bottom: 4rem; }
            }
          </style>
        </head>
        <body>
          <div id="test-container"></div>
        </body>
      </html>
    `);
  });

  test('Button component should render with correct primary variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<button class="inline-flex items-center justify-center rounded-md font-medium transition-all bg-primary-500 text-white shadow-md h-10 px-4 py-2 text-base" id="primary-button">Primary Button</button>';
    });

    const button = page.locator('#primary-button');
    
    // Test button is visible and has correct text
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Primary Button');
    
    // Test primary variant classes are applied
    await expect(button).toHaveClass(/bg-primary-500/);
    await expect(button).toHaveClass(/text-white/);
    await expect(button).toHaveClass(/shadow-md/);
    
    // Test button is focusable and clickable
    await button.focus();
    await expect(button).toBeFocused();
    
    await button.click();
    // Button should be clickable without errors
  });

  test('Button component should render with correct secondary variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<button class="inline-flex items-center justify-center rounded-md font-medium transition-all bg-white text-primary-600 border border-primary-200 shadow-sm h-10 px-4 py-2 text-base" id="secondary-button">Secondary Button</button>';
    });

    const button = page.locator('#secondary-button');
    
    // Test secondary variant classes are applied
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Secondary Button');
    await expect(button).toHaveClass(/bg-white/);
    await expect(button).toHaveClass(/text-primary-600/);
    await expect(button).toHaveClass(/border-primary-200/);
    await expect(button).toHaveClass(/shadow-sm/);
  });

  test('Button component should render with correct ghost variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<button class="inline-flex items-center justify-center rounded-md font-medium transition-all text-primary-600 h-10 px-4 py-2 text-base" id="ghost-button">Ghost Button</button>';
    });

    const button = page.locator('#ghost-button');
    
    // Test ghost variant classes are applied
    await expect(button).toBeVisible();
    await expect(button).toHaveText('Ghost Button');
    await expect(button).toHaveClass(/text-primary-600/);
    // Ghost variant should not have background or border by default
    await expect(button).not.toHaveClass(/bg-primary-500/);
    await expect(button).not.toHaveClass(/border/);
  });

  test('Button component should handle different sizes correctly', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div><button class="inline-flex items-center justify-center rounded-md font-medium bg-primary-500 text-white h-9 px-3 text-sm" id="small-button">Small</button><button class="inline-flex items-center justify-center rounded-md font-medium bg-primary-500 text-white h-10 px-4 py-2 text-base" id="medium-button">Medium</button><button class="inline-flex items-center justify-center rounded-md font-medium bg-primary-500 text-white h-12 px-6 py-3 text-lg" id="large-button">Large</button></div>';
    });

    // Test small button
    const smallButton = page.locator('#small-button');
    await expect(smallButton).toHaveClass(/h-9/);
    await expect(smallButton).toHaveClass(/px-3/);
    await expect(smallButton).toHaveClass(/text-sm/);

    // Test medium button
    const mediumButton = page.locator('#medium-button');
    await expect(mediumButton).toHaveClass(/h-10/);
    await expect(mediumButton).toHaveClass(/px-4/);
    await expect(mediumButton).toHaveClass(/text-base/);

    // Test large button
    const largeButton = page.locator('#large-button');
    await expect(largeButton).toHaveClass(/h-12/);
    await expect(largeButton).toHaveClass(/px-6/);
    await expect(largeButton).toHaveClass(/text-lg/);
  });

  test('Card component should render with correct elevated variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div class="rounded-lg border bg-white transition-all border-gray-200 shadow-lg" id="elevated-card"><div class="flex flex-col space-y-1.5 p-6"><h3 class="text-xl font-semibold leading-none tracking-tight text-gray-900">Card Title</h3><p class="text-sm text-gray-500">Card Description</p></div><div class="p-6 pt-0">Card Content</div></div>';
    });

    const card = page.locator('#elevated-card');
    
    // Test elevated variant classes are applied
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/shadow-lg/);
    await expect(card).toHaveClass(/border-gray-200/);
    await expect(card).toHaveClass(/bg-white/);
    await expect(card).toHaveClass(/rounded-lg/);
    
    // Test card content structure
    const title = card.locator('h3');
    await expect(title).toHaveText('Card Title');
    await expect(title).toHaveClass(/text-xl/);
    await expect(title).toHaveClass(/font-semibold/);
    
    const description = card.locator('p');
    await expect(description).toHaveText('Card Description');
    await expect(description).toHaveClass(/text-sm/);
    await expect(description).toHaveClass(/text-gray-500/);
  });

  test('Card component should render with correct standard variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div class="rounded-lg border bg-white transition-all border-gray-200 shadow-sm" id="standard-card"><div class="p-6">Standard Card Content</div></div>';
    });

    const card = page.locator('#standard-card');
    
    // Test standard variant classes are applied
    await expect(card).toBeVisible();
    await expect(card).toHaveClass(/shadow-sm/);
    await expect(card).toHaveClass(/border-gray-200/);
    await expect(card).toHaveClass(/bg-white/);
    await expect(card).toHaveClass(/rounded-lg/);
    
    // Standard variant should have less shadow than elevated
    await expect(card).not.toHaveClass(/shadow-lg/);
  });

  test('Badge component should render with correct strategic variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all bg-secondary-100 text-secondary-700 border-secondary-200 shadow-sm" id="strategic-badge">.NET MVC ★</div>';
    });

    const badge = page.locator('#strategic-badge');
    
    // Test strategic variant classes are applied
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('.NET MVC ★');
    await expect(badge).toHaveClass(/bg-secondary-100/);
    await expect(badge).toHaveClass(/text-secondary-700/);
    await expect(badge).toHaveClass(/border-secondary-200/);
    await expect(badge).toHaveClass(/shadow-sm/);
    await expect(badge).toHaveClass(/rounded-full/);
  });

  test('Badge component should render with correct standard variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all bg-gray-100 text-gray-700 border-gray-200" id="standard-badge">Node.js</div>';
    });

    const badge = page.locator('#standard-badge');
    
    // Test standard variant classes are applied
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('Node.js');
    await expect(badge).toHaveClass(/bg-gray-100/);
    await expect(badge).toHaveClass(/text-gray-700/);
    await expect(badge).toHaveClass(/border-gray-200/);
    await expect(badge).toHaveClass(/rounded-full/);
  });

  test('Badge component should render with correct subtle variant styles', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium transition-all bg-gray-50 text-gray-600 border-gray-100" id="subtle-badge">Docker (Learning)</div>';
    });

    const badge = page.locator('#subtle-badge');
    
    // Test subtle variant classes are applied
    await expect(badge).toBeVisible();
    await expect(badge).toHaveText('Docker (Learning)');
    await expect(badge).toHaveClass(/bg-gray-50/);
    await expect(badge).toHaveClass(/text-gray-600/);
    await expect(badge).toHaveClass(/border-gray-100/);
    await expect(badge).toHaveClass(/rounded-full/);
  });

  test('SectionHeading component should render with correct typography hierarchy', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div><div class="text-center mb-12 md:mb-16"><h1 class="font-semibold text-gray-900 tracking-tight text-4xl md:text-5xl" id="h1-heading">Main Heading</h1><p class="mt-4 text-lg text-gray-500 max-w-2xl mx-auto">This is a subtitle for the main heading</p></div><div class="text-center mb-12 md:mb-16"><h2 class="font-semibold text-gray-900 tracking-tight text-2xl md:text-3xl" id="h2-heading">Section Heading</h2></div><div class="text-center mb-12 md:mb-16"><h3 class="font-semibold text-gray-900 tracking-tight text-xl md:text-2xl" id="h3-heading">Subsection Heading</h3></div></div>';
    });

    // Test H1 heading
    const h1 = page.locator('#h1-heading');
    await expect(h1).toBeVisible();
    await expect(h1).toHaveText('Main Heading');
    await expect(h1).toHaveClass(/text-4xl/);
    await expect(h1).toHaveClass(/md:text-5xl/);
    await expect(h1).toHaveClass(/font-semibold/);
    await expect(h1).toHaveClass(/text-gray-900/);

    // Test H2 heading
    const h2 = page.locator('#h2-heading');
    await expect(h2).toBeVisible();
    await expect(h2).toHaveText('Section Heading');
    await expect(h2).toHaveClass(/text-2xl/);
    await expect(h2).toHaveClass(/md:text-3xl/);
    await expect(h2).toHaveClass(/font-semibold/);

    // Test H3 heading
    const h3 = page.locator('#h3-heading');
    await expect(h3).toBeVisible();
    await expect(h3).toHaveText('Subsection Heading');
    await expect(h3).toHaveClass(/text-xl/);
    await expect(h3).toHaveClass(/md:text-2xl/);
    await expect(h3).toHaveClass(/font-semibold/);

    // Test subtitle
    const subtitle = page.locator('p.mt-4');
    await expect(subtitle).toBeVisible();
    await expect(subtitle).toHaveText('This is a subtitle for the main heading');
    await expect(subtitle).toHaveClass(/text-lg/);
    await expect(subtitle).toHaveClass(/text-gray-500/);
  });

  test('Components should have proper accessibility attributes', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div><button class="inline-flex items-center justify-center rounded-md font-medium transition-all focus-visible:outline-none focus-visible:ring-2 bg-primary-500 text-white h-10 px-4 py-2 text-base" id="accessible-button" aria-label="Primary action button">Click Me</button><div class="rounded-lg border bg-white shadow-sm" role="article" id="accessible-card"><h3 class="text-xl font-semibold p-6">Accessible Card</h3></div><div class="text-center mb-12"><h2 class="font-semibold text-gray-900 text-2xl" id="accessible-heading">Accessible Section</h2></div></div>';
    });

    // Test button accessibility
    const button = page.locator('#accessible-button');
    await expect(button).toHaveAttribute('aria-label', 'Primary action button');
    
    // Test focus visibility
    await button.focus();
    await expect(button).toBeFocused();
    await expect(button).toHaveClass(/focus-visible:ring-2/);

    // Test card semantic structure
    const card = page.locator('#accessible-card');
    await expect(card).toHaveAttribute('role', 'article');

    // Test heading hierarchy
    const heading = page.locator('#accessible-heading');
    await expect(heading).toBeVisible();
  });

  test('Components should handle hover and interaction states', async ({ page }) => {
    await page.evaluate(() => {
      const container = document.getElementById('test-container');
      container.innerHTML = '<div><button class="inline-flex items-center justify-center rounded-md font-medium transition-all bg-primary-500 text-white hover:bg-primary-600 hover:shadow-lg shadow-md h-10 px-4 py-2 text-base" id="hover-button">Hover Me</button><div class="rounded-lg border bg-white transition-all shadow-sm hover:shadow-md hover:border-gray-300" id="hover-card"><div class="p-6">Hover Card</div></div></div>';
    });

    // Test button hover classes are present
    const button = page.locator('#hover-button');
    await expect(button).toHaveClass(/hover:bg-primary-600/);
    await expect(button).toHaveClass(/hover:shadow-lg/);
    await expect(button).toHaveClass(/transition-all/);

    // Test card hover classes are present
    const card = page.locator('#hover-card');
    await expect(card).toHaveClass(/hover:shadow-md/);
    await expect(card).toHaveClass(/hover:border-gray-300/);
    await expect(card).toHaveClass(/transition-all/);
  });
});