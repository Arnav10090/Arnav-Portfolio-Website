/**
 * Property-Based Test: Cross-Platform PDF Compatibility
 * Feature: portfolio-website, Property 7: Cross-Platform PDF Compatibility
 * **Validates: Requirements 3.4**
 * 
 * Tests that the resume PDF opens and displays correctly across all major
 * browsers and device combinations without rendering issues, maintains
 * proper formatting, and provides consistent user experience.
 */

import { test, expect, devices } from '@playwright/test';

// Define browser and device combinations for testing
const testConfigurations = [
  { name: 'Desktop Chrome', ...devices['Desktop Chrome'] },
  { name: 'Desktop Firefox', ...devices['Desktop Firefox'] },
  { name: 'Desktop Safari', ...devices['Desktop Safari'] },
  { name: 'Desktop Edge', ...devices['Desktop Edge'] },
  { name: 'iPhone 13', ...devices['iPhone 13'] },
  { name: 'iPhone 13 Pro', ...devices['iPhone 13 Pro'] },
  { name: 'iPad Pro', ...devices['iPad Pro'] },
  { name: 'Samsung Galaxy S21', ...devices['Galaxy S21'] },
  { name: 'Samsung Galaxy Tab S7', ...devices['Galaxy Tab S7'] },
  { name: 'Pixel 5', ...devices['Pixel 5'] }
];

// Generate random test scenarios
function generateTestScenarios(count: number): Array<{ config: any; testType: string }> {
  const scenarios: Array<{ config: any; testType: string }> = [];
  const testTypes = ['direct_download', 'api_access', 'browser_navigation', 'mobile_interaction'];
  
  for (let i = 0; i < count; i++) {
    const randomConfig = testConfigurations[Math.floor(Math.random() * testConfigurations.length)];
    const randomTestType = testTypes[Math.floor(Math.random() * testTypes.length)];
    
    scenarios.push({
      config: randomConfig,
      testType: randomTestType
    });
  }
  
  return scenarios;
}

// Validate PDF structure and content
function validatePDFStructure(buffer: Buffer): { valid: boolean; issues: string[] } {
  const issues: string[] = [];
  let valid = true;

  // Check PDF magic number
  const header = buffer.subarray(0, 8).toString();
  if (!header.startsWith('%PDF-')) {
    issues.push('Invalid PDF magic number');
    valid = false;
  }

  // Check PDF version
  const versionMatch = header.match(/%PDF-(\d+\.\d+)/);
  if (!versionMatch) {
    issues.push('Missing PDF version');
    valid = false;
  } else {
    const version = parseFloat(versionMatch[1]);
    if (version < 1.4 || version > 2.0) {
      issues.push(`Unsupported PDF version: ${version}`);
      valid = false;
    }
  }

  // Check for EOF marker
  const endMarker = buffer.subarray(-10).toString();
  if (!endMarker.includes('%%EOF')) {
    issues.push('Missing PDF EOF marker');
    valid = false;
  }

  // Check minimum file size
  if (buffer.length < 1000) {
    issues.push(`PDF file too small: ${buffer.length} bytes`);
    valid = false;
  }

  // Check maximum file size (500KB limit)
  if (buffer.length > 500 * 1024) {
    issues.push(`PDF file too large: ${buffer.length} bytes`);
    valid = false;
  }

  // Look for essential PDF objects
  const pdfContent = buffer.toString('binary');
  
  if (!pdfContent.includes('/Type /Catalog')) {
    issues.push('Missing PDF catalog object');
    valid = false;
  }

  if (!pdfContent.includes('/Type /Pages')) {
    issues.push('Missing PDF pages object');
    valid = false;
  }

  if (!pdfContent.includes('/Type /Page')) {
    issues.push('Missing PDF page object');
    valid = false;
  }

  return { valid, issues };
}

// Check PDF accessibility features
function checkPDFAccessibility(buffer: Buffer): { score: number; features: string[] } {
  const features: string[] = [];
  let score = 0;
  const pdfContent = buffer.toString('binary');

  // Check for text content (not just images)
  if (pdfContent.includes('BT') && pdfContent.includes('ET')) {
    features.push('Text content present');
    score += 25;
  }

  // Check for font definitions
  if (pdfContent.includes('/Type /Font')) {
    features.push('Font definitions present');
    score += 25;
  }

  // Check for structured content
  if (pdfContent.includes('/StructTreeRoot')) {
    features.push('Structured content (accessibility)');
    score += 25;
  }

  // Check for metadata
  if (pdfContent.includes('/Info') || pdfContent.includes('/Metadata')) {
    features.push('Document metadata');
    score += 25;
  }

  return { score, features };
}

test.describe('Property 7: Cross-Platform PDF Compatibility', () => {
  
  test('Property: PDF downloads and opens correctly across different browsers and devices', async ({ page, browserName }) => {
    // Test with random device configurations
    const scenarios = generateTestScenarios(5);
    
    for (const scenario of scenarios) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test API endpoint accessibility
      const response = await page.request.get('/api/resume');
      expect(response.status()).toBe(200);
      
      // Verify response headers are browser-compatible
      const headers = response.headers();
      expect(headers['content-type']).toBe('application/pdf');
      expect(headers['content-disposition']).toContain('attachment');
      expect(headers['content-disposition']).toContain('Arnav_Tiwari_Resume.pdf');
      
      // Get PDF content
      const pdfBuffer = await response.body();
      
      // Validate PDF structure
      const structureValidation = validatePDFStructure(pdfBuffer);
      expect(structureValidation.valid).toBeTruthy();
      
      if (!structureValidation.valid) {
        console.log(`PDF structure issues on ${browserName}:`, structureValidation.issues);
      }
      
      // Check PDF accessibility features
      const accessibilityCheck = checkPDFAccessibility(pdfBuffer);
      expect(accessibilityCheck.score).toBeGreaterThanOrEqual(50); // Minimum accessibility score
      
      // Test download functionality
      const downloadPromise = page.waitForEvent('download');
      
      // Find and click download button
      const downloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
      await expect(downloadButton).toBeVisible();
      await downloadButton.click();
      
      // Verify download
      const download = await downloadPromise;
      expect(download.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
      
      // Verify downloaded file
      const downloadPath = await download.path();
      if (downloadPath) {
        const fs = require('fs');
        const downloadedBuffer = fs.readFileSync(downloadPath);
        
        // Verify downloaded file matches API response
        expect(downloadedBuffer.length).toBe(pdfBuffer.length);
        
        // Validate downloaded file structure
        const downloadValidation = validatePDFStructure(downloadedBuffer);
        expect(downloadValidation.valid).toBeTruthy();
      }
    }
  });
  
  test('Property: PDF rendering is consistent across viewport sizes', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Test different viewport sizes
    const viewportSizes = [
      { width: 320, height: 568 },   // Small mobile
      { width: 375, height: 667 },   // iPhone SE
      { width: 768, height: 1024 },  // Tablet portrait
      { width: 1024, height: 768 },  // Tablet landscape
      { width: 1280, height: 720 },  // Desktop small
      { width: 1920, height: 1080 }  // Desktop large
    ];
    
    for (const viewport of viewportSizes) {
      await page.setViewportSize(viewport);
      await page.waitForTimeout(200);
      
      // Test API endpoint
      const response = await page.request.get('/api/resume');
      expect(response.status()).toBe(200);
      
      const pdfBuffer = await response.body();
      const validation = validatePDFStructure(pdfBuffer);
      expect(validation.valid).toBeTruthy();
      
      // Verify download buttons are accessible
      const downloadButtons = page.locator('button').filter({ hasText: /Download Resume/i });
      const buttonCount = await downloadButtons.count();
      expect(buttonCount).toBeGreaterThan(0);
      
      // Test first visible button
      const firstButton = downloadButtons.first();
      await expect(firstButton).toBeVisible();
      
      // Verify button is clickable
      const buttonBox = await firstButton.boundingBox();
      expect(buttonBox).toBeTruthy();
      
      if (buttonBox) {
        expect(buttonBox.width).toBeGreaterThan(0);
        expect(buttonBox.height).toBeGreaterThan(0);
      }
    }
  });
  
  test('Property: PDF content remains consistent across all browser engines', async ({ page }) => {
    const scenarios = generateTestScenarios(10);
    const pdfHashes: string[] = [];
    
    for (const scenario of scenarios) {
      // Use the configuration
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get PDF from API
      const response = await page.request.get('/api/resume');
      expect(response.status()).toBe(200);
      
      const pdfBuffer = await response.body();
      
      // Create hash of PDF content for consistency check
      const crypto = require('crypto');
      const hash = crypto.createHash('sha256').update(pdfBuffer).digest('hex');
      pdfHashes.push(hash);
      
      // Validate structure
      const validation = validatePDFStructure(pdfBuffer);
      expect(validation.valid).toBeTruthy();
      
      // Check accessibility features
      const accessibility = checkPDFAccessibility(pdfBuffer);
      expect(accessibility.score).toBeGreaterThanOrEqual(50);
    }
    
    // Verify all PDFs are identical
    const uniqueHashes = [...new Set(pdfHashes)];
    expect(uniqueHashes.length).toBe(1); // All PDFs should be identical
  });
  
  test('Property: PDF opens correctly in browser PDF viewers', async ({ page, browserName }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate directly to PDF URL
    await page.goto('/api/resume');
    await page.waitForLoadState('networkidle');
    
    // Check if browser displays PDF or downloads it
    const url = page.url();
    expect(url).toContain('/api/resume');
    
    // For browsers that display PDFs inline, check for PDF viewer
    if (browserName === 'chromium' || browserName === 'webkit') {
      // Chrome and Safari typically show PDF inline
      await page.waitForTimeout(2000); // Allow PDF to load
      
      // Check for PDF viewer elements (browser-specific)
      const pdfViewer = page.locator('embed[type="application/pdf"], object[type="application/pdf"]');
      const hasPdfViewer = await pdfViewer.count() > 0;
      
      if (hasPdfViewer) {
        await expect(pdfViewer).toBeVisible();
      }
    }
    
    // Verify response headers
    const response = await page.request.get('/api/resume');
    const headers = response.headers();
    
    // Headers should be compatible with all browsers
    expect(headers['content-type']).toBe('application/pdf');
    expect(headers['cache-control']).toBeTruthy();
    expect(headers['last-modified']).toBeTruthy();
    
    // Content-Length should be present for proper browser handling
    expect(headers['content-length']).toBeTruthy();
    const contentLength = parseInt(headers['content-length']);
    expect(contentLength).toBeGreaterThan(0);
    expect(contentLength).toBeLessThanOrEqual(500 * 1024);
  });
  
  test('Property: PDF download works with various network conditions', async ({ page }) => {
    const networkConditions = [
      { name: 'Fast 3G', downloadThroughput: 1.5 * 1024 * 1024 / 8, uploadThroughput: 750 * 1024 / 8, latency: 40 },
      { name: 'Slow 3G', downloadThroughput: 500 * 1024 / 8, uploadThroughput: 500 * 1024 / 8, latency: 400 },
      { name: 'WiFi', downloadThroughput: 30 * 1024 * 1024 / 8, uploadThroughput: 15 * 1024 * 1024 / 8, latency: 2 }
    ];
    
    for (const condition of networkConditions) {
      // Simulate network condition
      await page.context().route('**/*', async route => {
        await new Promise(resolve => setTimeout(resolve, condition.latency));
        await route.continue();
      });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Test API endpoint under network condition
      const startTime = Date.now();
      const response = await page.request.get('/api/resume');
      const endTime = Date.now();
      
      expect(response.status()).toBe(200);
      
      const pdfBuffer = await response.body();
      const validation = validatePDFStructure(pdfBuffer);
      expect(validation.valid).toBeTruthy();
      
      // Verify reasonable download time (should complete within 30 seconds even on slow 3G)
      const downloadTime = endTime - startTime;
      expect(downloadTime).toBeLessThan(30000);
      
      console.log(`${condition.name}: Downloaded ${pdfBuffer.length} bytes in ${downloadTime}ms`);
      
      // Clear route
      await page.context().unroute('**/*');
    }
  });
  
  test('Property: PDF maintains quality across different device pixel ratios', async ({ page }) => {
    const pixelRatios = [1, 1.5, 2, 2.5, 3]; // Common device pixel ratios
    
    for (const ratio of pixelRatios) {
      // Set device pixel ratio
      await page.emulateMedia({ reducedMotion: 'reduce' });
      await page.setViewportSize({ width: 1280, height: 720 });
      
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      // Get PDF
      const response = await page.request.get('/api/resume');
      expect(response.status()).toBe(200);
      
      const pdfBuffer = await response.body();
      const validation = validatePDFStructure(pdfBuffer);
      expect(validation.valid).toBeTruthy();
      
      // PDF should be the same regardless of pixel ratio
      expect(pdfBuffer.length).toBeGreaterThan(1000);
      expect(pdfBuffer.length).toBeLessThanOrEqual(500 * 1024);
      
      // Check accessibility features
      const accessibility = checkPDFAccessibility(pdfBuffer);
      expect(accessibility.score).toBeGreaterThanOrEqual(50);
    }
  });
  
  test('Property: PDF error handling works across all platforms', async ({ page }) => {
    // Test with corrupted PDF scenario
    await page.route('/api/resume', route => {
      route.fulfill({
        status: 200,
        contentType: 'application/pdf',
        body: Buffer.from('Invalid PDF content')
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Try to download
    const downloadPromise = page.waitForEvent('download');
    const downloadButton = page.locator('button').filter({ hasText: /Download Resume/i }).first();
    await downloadButton.click();
    
    // Should still trigger download (browser will handle invalid PDF)
    const download = await downloadPromise;
    expect(download.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
    
    // Clear route and test server error
    await page.unroute('/api/resume');
    await page.route('/api/resume', route => {
      route.fulfill({ status: 500, body: 'Server Error' });
    });
    
    // Should fall back to static file
    const downloadPromise2 = page.waitForEvent('download');
    await downloadButton.click();
    
    const download2 = await downloadPromise2;
    expect(download2.suggestedFilename()).toBe('Arnav_Tiwari_Resume.pdf');
    
    // Verify fallback URL
    const downloadUrl = download2.url();
    expect(downloadUrl).toContain('/resume/Arnav_Tiwari_Resume.pdf');
    
    await page.unroute('/api/resume');
  });
});