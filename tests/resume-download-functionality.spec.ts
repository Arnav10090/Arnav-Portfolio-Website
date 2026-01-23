/**
 * Property-Based Test: Resume Download Functionality
 * Feature: portfolio-website, Property 6: Resume Download Functionality
 * **Validates: Requirements 3.2, 3.3**
 * 
 * Tests that resume download functionality works correctly across all download
 * locations (hero, header, resume section), serves PDF files under 500KB with
 * proper headers and filename, and tracks download events for analytics.
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

// Validate PDF file headers and properties
function validatePDFHeaders(headers: Record<string, string>): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  let valid = true;

  // Check Content-Type
  if (!headers['content-type'] || !headers['content-type'].includes('application/pdf')) {
    issues.push('Missing or incorrect Content-Type header');
    valid = false;
  }

  // Check Content-Disposition
  if (!headers['content-disposition'] || !headers['content-disposition'].includes('attachment')) {
    issues.push('Missing or incorrect Content-Disposition header');
    valid = false;
  }

  // Check filename in Content-Disposition
  if (!headers['content-disposition'] || !headers['content-disposition'].includes('Arnav_Tiwari_Resume.pdf')) {
    issues.push('Missing or incorrect filename in Content-Disposition');
    valid = false;
  }

  // Check Content-Length
  if (!headers['content-length']) {
    issues.push('Missing Content-Length header');
    valid = false;
  } else {
    const contentLength = parseInt(headers['content-length']);
    if (contentLength > 500 * 1024) { // 500KB limit
      issues.push(`PDF file too large: ${contentLength} bytes (limit: 512000 bytes)`);
      valid = false;
    }
    if (contentLength < 1000) { // Minimum reasonable size
      issues.push(`PDF file too small: ${contentLength} bytes (minimum: 1000 bytes)`);
      valid = false;
    }
  }

  // Check Last-Modified
  if (!headers['last-modified']) {
    issues.push('Missing Last-Modified header');
    valid = false;
  }

  // Check Cache-Control
  if (!headers['cache-control']) {
    issues.push('Missing Cache-Control header');
    valid = false;
  }

  return { valid, issues };
}

test.describe('Property 6: Resume Download Functionality', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
  });

  test('Property: Resume API endpoint serves PDF with proper headers and filename', async ({ page }) => {
    // Test the API endpoint directly
    const response = await page.request.get('/api/resume');
    
    // Verify response status
    expect(response.status()).toBe(200);
    
    // Get response headers
    const headers = response.headers();
    
    // Validate PDF headers
    const validation = validatePDFHeaders(headers);
    expect(validation.valid).toBeTruthy();
    
    if (!validation.valid) {
      console.log('Header validation issues:', validation.issues);
    }
    
    // Verify response body is valid PDF
    const buffer = await response.body();
    expect(buffer.length).toBeGreaterThan(0);
    
    // Check PDF magic number
    const pdfHeader = buffer.subarray(0, 4).toString();
    expect(pdfHeader).toBe('%PDF');
    
    // Verify file size constraint
    expect(buffer.length).toBeLessThanOrEqual(500 * 1024); // 500KB limit
    expect(buffer.length).toBeGreaterThan(1000); // Minimum reasonable size
    
    // Test HEAD request for metadata
    const headResponse = await page.request.head('/api/resume');
    expect(headResponse.status()).toBe(200);
    
    const headHeaders = headResponse.headers();
    expect(headHeaders['content-type']).toContain('application/pdf');
    expect(headHeaders['content-length']).toBe(headers['content-length']);
  });

  test('Property: Resume download buttons are accessible and functional across all locations', async ({ page }) => {
    const viewportWidths = generateViewportWidths(5);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Test Hero Section download button
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await expect(heroDownloadButton).toBeVisible();
      
      // Verify button accessibility
      const heroButtonRole = await heroDownloadButton.getAttribute('role');
      const heroButtonTabIndex = await heroDownloadButton.getAttribute('tabindex');
      
      // Should be focusable
      expect(heroButtonTabIndex).not.toBe('-1');
      
      // Test keyboard navigation
      await heroDownloadButton.focus();
      const isFocused = await heroDownloadButton.evaluate(el => document.activeElement === el);
      expect(isFocused).toBeTruthy();
      
      // Test Header download button (desktop only)
      if (width >= 768) {
        const headerDownloadButton = page.locator('header button').filter({ hasText: /Download Resume/i });
        await expect(headerDownloadButton).toBeVisible();
        
        // Test focus
        await headerDownloadButton.focus();
        const headerFocused = await headerDownloadButton.evaluate(el => document.activeElement === el);
        expect(headerFocused).toBeTruthy();
      } else {
        // Mobile: test hamburger menu
        const mobileMenuButton = page.locator('header button[aria-expanded]');
        await expect(mobileMenuButton).toBeVisible();
        
        await mobileMenuButton.click();
        await page.waitForTimeout(300);
        
        const mobileDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).last();
        await expect(mobileDownloadButton).toBeVisible();
        
        // Close mobile menu
        await mobileMenuButton.click();
        await page.waitForTimeout(300);
      }
      
      // Test Resume Section download button
      const resumeSection = page.locator('#resume');
      await resumeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
      await expect(resumeSectionButton).toBeVisible();
      
      // Verify button styling and hover states
      const buttonStyles = await resumeSectionButton.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          color: styles.color,
          borderRadius: styles.borderRadius,
          padding: styles.padding,
          fontSize: styles.fontSize,
          fontWeight: styles.fontWeight
        };
      });
      
      // Should have primary button styling
      expect(buttonStyles.backgroundColor).not.toBe('rgba(0, 0, 0, 0)');
      expect(buttonStyles.color).not.toBe('rgb(0, 0, 0)');
      expect(parseFloat(buttonStyles.borderRadius)).toBeGreaterThan(4);
      expect(parseFloat(buttonStyles.fontSize)).toBeGreaterThanOrEqual(16);
      
      // Test hover state
      await resumeSectionButton.hover();
      await page.waitForTimeout(100);
      
      const hoverStyles = await resumeSectionButton.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          transform: styles.transform
        };
      });
      
      // Hover should change appearance
      expect(hoverStyles.backgroundColor).not.toBe(buttonStyles.backgroundColor);
    }
  });

  test('Property: Resume download triggers proper file download with correct filename', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      
      // Test download from hero section
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await heroDownloadButton.click();
      
      // Wait for download to start
      const download = await downloadPromise;
      
      // Verify download properties
      expect(download.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
      
      // Verify download URL
      const downloadUrl = download.url();
      expect(downloadUrl).toContain('/api/resume');
      
      // Save and verify file
      const downloadPath = await download.path();
      expect(downloadPath).toBeTruthy();
      
      if (downloadPath) {
        const fs = require('fs');
        const fileBuffer = fs.readFileSync(downloadPath);
        
        // Verify file is valid PDF
        const pdfHeader = fileBuffer.subarray(0, 4).toString();
        expect(pdfHeader).toBe('%PDF');
        
        // Verify file size
        expect(fileBuffer.length).toBeLessThanOrEqual(500 * 1024);
        expect(fileBuffer.length).toBeGreaterThan(1000);
      }
      
      // Test download from resume section
      const resumeSection = page.locator('#resume');
      await resumeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const downloadPromise2 = page.waitForEvent('download');
      const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
      await resumeSectionButton.click();
      
      const download2 = await downloadPromise2;
      expect(download2.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
      expect(download2.url()).toContain('/api/resume');
    }
  });

  test('Property: Resume section displays last updated date and file information', async ({ page }) => {
    const viewportWidths = generateViewportWidths(3);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Navigate to resume section
      const resumeSection = page.locator('#resume');
      await resumeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Verify section heading
      const sectionHeading = resumeSection.locator('h2').filter({ hasText: /Resume/i });
      await expect(sectionHeading).toBeVisible();
      
      // Verify subtitle
      const subtitle = resumeSection.locator('text=Download my complete professional resume');
      await expect(subtitle).toBeVisible();
      
      // Verify file information display
      const filename = resumeSection.locator('text=Arnav_Tiwari_Resume.pdf');
      await expect(filename).toBeVisible();
      
      const fileSize = resumeSection.locator('text=245 KB');
      await expect(fileSize).toBeVisible();
      
      const fileType = resumeSection.locator('text=PDF');
      await expect(fileType).toBeVisible();
      
      // Verify last updated date
      const lastUpdatedText = resumeSection.locator('text=/Last updated:/');
      await expect(lastUpdatedText).toBeVisible();
      
      const lastUpdatedDate = resumeSection.locator('text=/December 15, 2024/');
      await expect(lastUpdatedDate).toBeVisible();
      
      // Verify file icon
      const fileIcon = resumeSection.locator('svg').first();
      await expect(fileIcon).toBeVisible();
      
      // Verify download icon in button
      const downloadIcon = resumeSection.locator('button svg');
      await expect(downloadIcon).toBeVisible();
      
      // Verify section styling
      const sectionStyles = await resumeSection.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          paddingTop: styles.paddingTop,
          paddingBottom: styles.paddingBottom
        };
      });
      
      // Should have gray background
      expect(sectionStyles.backgroundColor).toBe('rgb(249, 250, 251)'); // gray-50
      
      // Verify card styling
      const card = resumeSection.locator('.bg-white');
      await expect(card).toBeVisible();
      
      const cardStyles = await card.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderRadius: styles.borderRadius,
          boxShadow: styles.boxShadow,
          border: styles.border
        };
      });
      
      expect(cardStyles.backgroundColor).toBe('rgb(255, 255, 255)');
      expect(parseFloat(cardStyles.borderRadius)).toBeGreaterThan(6);
      expect(cardStyles.boxShadow).not.toBe('none');
      expect(cardStyles.border).toContain('rgb(229, 231, 235)'); // gray-200
    }
  });

  test('Property: Resume download handles errors gracefully with fallback mechanism', async ({ page }) => {
    // Test with network failure simulation
    await page.route('/api/resume', route => {
      route.abort('failed');
    });
    
    const viewportWidths = generateViewportWidths(2);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Monitor console for error messages
      const consoleMessages: string[] = [];
      page.on('console', msg => {
        if (msg.type() === 'error') {
          consoleMessages.push(msg.text());
        }
      });
      
      // Set up download listener for fallback
      const downloadPromise = page.waitForEvent('download');
      
      // Try to download from hero section
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await heroDownloadButton.click();
      
      // Should still trigger download via fallback
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
      
      // Should log error message
      expect(consoleMessages.some(msg => msg.includes('Error downloading resume'))).toBeTruthy();
      
      // Verify fallback URL
      const downloadUrl = download.url();
      expect(downloadUrl).toContain('/resume/Arnav_Tiwari_Resume.pdf');
    }
    
    // Remove route interception
    await page.unroute('/api/resume');
  });

  test('Property: Resume download functionality works consistently across multiple attempts', async ({ page }) => {
    const attemptCount = 5;
    const downloadResults: Array<{ filename: string; size: number; success: boolean }> = [];
    
    for (let i = 0; i < attemptCount; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Set up download listener
      const downloadPromise = page.waitForEvent('download');
      
      // Alternate between different download locations
      if (i % 2 === 0) {
        // Hero section
        const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
        await heroDownloadButton.click();
      } else {
        // Resume section
        const resumeSection = page.locator('#resume');
        await resumeSection.scrollIntoViewIfNeeded();
        await page.waitForTimeout(500);
        
        const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
        await resumeSectionButton.click();
      }
      
      try {
        const download = await downloadPromise;
        const downloadPath = await download.path();
        
        let fileSize = 0;
        if (downloadPath) {
          const fs = require('fs');
          const fileBuffer = fs.readFileSync(downloadPath);
          fileSize = fileBuffer.length;
        }
        
        downloadResults.push({
          filename: download.suggestedFilename(),
          size: fileSize,
          success: true
        });
      } catch (error) {
        downloadResults.push({
          filename: '',
          size: 0,
          success: false
        });
      }
    }
    
    // Verify all downloads were successful
    const successfulDownloads = downloadResults.filter(result => result.success);
    expect(successfulDownloads.length).toBe(attemptCount);
    
    // Verify consistent filename
    const filenames = successfulDownloads.map(result => result.filename);
    const uniqueFilenames = [...new Set(filenames)];
    expect(uniqueFilenames.length).toBe(1);
    expect(uniqueFilenames[0]).toBe('Arnav_Tiwari_Resume.pdf');
    
    // Verify consistent file size
    const fileSizes = successfulDownloads.map(result => result.size);
    const uniqueSizes = [...new Set(fileSizes)];
    expect(uniqueSizes.length).toBe(1);
    expect(uniqueSizes[0]).toBeGreaterThan(1000);
    expect(uniqueSizes[0]).toBeLessThanOrEqual(500 * 1024);
  });

  test('Property: Resume download analytics tracking fires correctly', async ({ page }) => {
    // Monitor network requests for analytics
    const analyticsRequests: Array<{ url: string; method: string; postData: any }> = [];
    
    page.on('request', request => {
      const url = request.url();
      if (url.includes('gtag') || url.includes('analytics') || url.includes('track')) {
        analyticsRequests.push({
          url,
          method: request.method(),
          postData: request.postData()
        });
      }
    });
    
    // Monitor console for analytics events
    const consoleEvents: string[] = [];
    page.on('console', msg => {
      if (msg.text().includes('Analytics Event') || msg.text().includes('resume_download')) {
        consoleEvents.push(msg.text());
      }
    });
    
    const viewportWidths = generateViewportWidths(2);
    
    for (const width of viewportWidths) {
      const height = calculateHeight(width);
      await page.setViewportSize({ width, height });
      await page.waitForTimeout(200);
      
      // Test analytics from hero section
      const downloadPromise = page.waitForEvent('download');
      const heroDownloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await heroDownloadButton.click();
      
      await downloadPromise;
      await page.waitForTimeout(500);
      
      // Should have logged analytics event
      const heroEvents = consoleEvents.filter(event => 
        event.includes('resume_download') && event.includes('hero_section')
      );
      expect(heroEvents.length).toBeGreaterThan(0);
      
      // Test analytics from resume section
      const resumeSection = page.locator('#resume');
      await resumeSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const downloadPromise2 = page.waitForEvent('download');
      const resumeSectionButton = resumeSection.locator('button').filter({ hasText: /Download Resume/i });
      await resumeSectionButton.click();
      
      await downloadPromise2;
      await page.waitForTimeout(500);
      
      // Should have logged analytics event
      const resumeEvents = consoleEvents.filter(event => 
        event.includes('resume_download') && event.includes('resume_section')
      );
      expect(resumeEvents.length).toBeGreaterThan(0);
    }
    
    // Verify analytics events contain required properties
    for (const event of consoleEvents) {
      if (event.includes('resume_download')) {
        expect(event).toMatch(/timestamp/);
        expect(event).toMatch(/filename.*Arnav_Tiwari_Resume\.pdf/);
        expect(event).toMatch(/source.*(hero_section|resume_section|header)/);
      }
    }
  });
});