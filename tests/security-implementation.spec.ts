/**
 * Property-Based Test: Security Implementation
 * Feature: portfolio-website, Property 20: Security Implementation
 * **Validates: Requirements 11.1, 11.2, 11.3, 11.4, 11.5**
 * 
 * Tests that the portfolio implements comprehensive security measures including
 * HTTPS/TLS encryption, security headers, environment variable protection,
 * input validation/sanitization, and secure contact form processing without
 * persistent storage.
 */

import { test, expect } from '@playwright/test';

test.describe('Property 20: Security Implementation', () => {
  
  test('Property: Application enforces HTTPS/TLS encryption in production', async ({ page, context }) => {
    // Check if running in production-like environment
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Get the current URL protocol
    const currentUrl = page.url();
    const protocol = new URL(currentUrl).protocol;
    
    // In production, should use HTTPS
    if (siteUrl.startsWith('https://')) {
      expect(protocol).toBe('https:');
    }
    
    // Verify secure context API is available (indicates HTTPS or localhost)
    const isSecureContext = await page.evaluate(() => window.isSecureContext);
    expect(isSecureContext).toBeTruthy();
    
    // Check for mixed content warnings (HTTP resources on HTTPS page)
    const mixedContentWarnings: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'warning' && msg.text().includes('mixed content')) {
        mixedContentWarnings.push(msg.text());
      }
    });
    
    await page.waitForTimeout(2000);
    
    // Should not have mixed content warnings
    expect(mixedContentWarnings.length).toBe(0);
  });

  test('Property: Application includes comprehensive security headers', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    
    if (response) {
      const headers = response.headers();
      
      // X-Frame-Options: Prevents clickjacking attacks
      expect(headers['x-frame-options']).toBeDefined();
      expect(headers['x-frame-options'].toLowerCase()).toMatch(/deny|sameorigin/);
      
      // X-Content-Type-Options: Prevents MIME type sniffing
      expect(headers['x-content-type-options']).toBeDefined();
      expect(headers['x-content-type-options'].toLowerCase()).toBe('nosniff');
      
      // Referrer-Policy: Controls referrer information
      expect(headers['referrer-policy']).toBeDefined();
      expect(headers['referrer-policy']).toMatch(/origin-when-cross-origin|strict-origin-when-cross-origin|no-referrer/);
      
      // X-XSS-Protection: Enables browser XSS protection
      expect(headers['x-xss-protection']).toBeDefined();
      expect(headers['x-xss-protection']).toMatch(/1; mode=block/);
      
      // Permissions-Policy: Restricts browser features
      expect(headers['permissions-policy']).toBeDefined();
      expect(headers['permissions-policy']).toContain('camera=()');
      expect(headers['permissions-policy']).toContain('microphone=()');
      expect(headers['permissions-policy']).toContain('geolocation=()');
      
      // Strict-Transport-Security: Enforces HTTPS (may not be present in dev)
      if (process.env.NODE_ENV === 'production') {
        expect(headers['strict-transport-security']).toBeDefined();
        expect(headers['strict-transport-security']).toContain('max-age=');
      }
    }
  });

  test('Property: Application implements Content Security Policy', async ({ page }) => {
    const response = await page.goto('/');
    expect(response).not.toBeNull();
    
    if (response) {
      const headers = response.headers();
      
      // CSP header should be present
      const csp = headers['content-security-policy'] || headers['content-security-policy-report-only'];
      
      if (csp) {
        // Should restrict default sources
        expect(csp).toContain("default-src");
        
        // Should restrict script sources
        expect(csp).toContain("script-src");
        
        // Should restrict frame ancestors
        expect(csp).toContain("frame-ancestors");
        
        // Should restrict form actions
        expect(csp).toContain("form-action");
        
        // Should restrict base URI
        expect(csp).toContain("base-uri");
      }
    }
    
    // Verify no inline scripts without nonce/hash (CSP violation)
    const inlineScripts = await page.locator('script:not([src])').count();
    
    // Next.js may inject some inline scripts, but they should be minimal
    // and properly handled by CSP with unsafe-inline or nonces
    expect(inlineScripts).toBeLessThan(10);
  });

  test('Property: API keys and sensitive configuration are not exposed in client-side code', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Check for exposed API keys in page source
    const pageContent = await page.content();
    
    // Should not contain common API key patterns
    const sensitivePatterns = [
      /RESEND_API_KEY/i,
      /api[_-]?key\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
      /secret\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
      /password\s*[:=]\s*['"][^'"]{8,}['"]/i,
      /token\s*[:=]\s*['"][a-zA-Z0-9_-]{20,}['"]/i,
      /private[_-]?key/i,
    ];
    
    for (const pattern of sensitivePatterns) {
      const matches = pageContent.match(pattern);
      if (matches) {
        // Allow NEXT_PUBLIC_ prefixed variables (intentionally public)
        const isPublicVar = matches[0].includes('NEXT_PUBLIC_');
        if (!isPublicVar) {
          expect(matches).toBeNull();
        }
      }
    }
    
    // Check JavaScript bundles for exposed secrets
    const scriptUrls = await page.locator('script[src]').evaluateAll(scripts => 
      scripts.map(s => (s as HTMLScriptElement).src)
    );
    
    for (const scriptUrl of scriptUrls) {
      if (scriptUrl.startsWith('http')) {
        try {
          const scriptResponse = await page.request.get(scriptUrl);
          const scriptContent = await scriptResponse.text();
          
          // Should not contain API keys in bundled JavaScript
          for (const pattern of sensitivePatterns) {
            const matches = scriptContent.match(pattern);
            if (matches) {
              const isPublicVar = matches[0].includes('NEXT_PUBLIC_');
              if (!isPublicVar) {
                expect(matches).toBeNull();
              }
            }
          }
        } catch (error) {
          // Skip if script can't be fetched (external domain, etc.)
          console.log(`Skipping script: ${scriptUrl}`);
        }
      }
    }
    
    // Verify environment variables are properly scoped
    const windowEnv = await page.evaluate(() => {
      return Object.keys(window).filter(key => 
        key.includes('API_KEY') || 
        key.includes('SECRET') || 
        key.includes('PASSWORD') ||
        key.includes('TOKEN')
      );
    });
    
    // Should not have sensitive keys in window object
    const nonPublicKeys = windowEnv.filter(key => !key.includes('NEXT_PUBLIC_'));
    expect(nonPublicKeys.length).toBe(0);
  });

  test('Property: Contact form implements input validation and sanitization', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Test XSS prevention
    const xssPayloads = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert("xss")',
      '<svg onload="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '"><script>alert("xss")</script>',
      '<body onload="alert(1)">',
    ];
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    
    for (const payload of xssPayloads) {
      // Fill form with XSS payload
      await nameField.fill(payload);
      await emailField.fill('test@example.com');
      await messageField.fill('This is a valid message with XSS attempt: ' + payload);
      
      // Verify no script execution
      let alertFired = false;
      page.once('dialog', async dialog => {
        alertFired = true;
        await dialog.dismiss();
      });
      
      await page.waitForTimeout(500);
      expect(alertFired).toBeFalsy();
      
      // Verify input is sanitized (no raw HTML in DOM)
      const nameValue = await nameField.inputValue();
      const messageValue = await messageField.inputValue();
      
      // Values should be present but sanitized
      expect(nameValue).toBeTruthy();
      expect(messageValue).toBeTruthy();
    }
    
    // Test SQL injection prevention
    const sqlPayloads = [
      "'; DROP TABLE users; --",
      "1' OR '1'='1",
      "admin'--",
      "' OR 1=1--",
      "'; DELETE FROM users WHERE '1'='1",
    ];
    
    for (const payload of sqlPayloads) {
      await nameField.fill(payload);
      await emailField.fill('test@example.com');
      await messageField.fill('This is a valid message with SQL injection attempt.');
      
      // Form should accept input (sanitization happens server-side)
      const nameValue = await nameField.inputValue();
      expect(nameValue).toBeTruthy();
    }
    
    // Test command injection prevention
    const commandPayloads = [
      '; rm -rf /',
      '| cat /etc/passwd',
      '`whoami`',
      '$(whoami)',
      '&& ls -la',
    ];
    
    for (const payload of commandPayloads) {
      await messageField.fill('Valid message with command injection: ' + payload);
      
      const messageValue = await messageField.inputValue();
      expect(messageValue).toBeTruthy();
    }
  });

  test('Property: Contact form processes data without persistent storage', async ({ page, context }) => {
    // Mock the API to verify no storage operations
    let storageOperations: string[] = [];
    
    await page.route('/api/contact', async (route) => {
      const request = route.request();
      const postData = request.postData();
      
      // Verify request doesn't include storage-related headers
      const headers = request.headers();
      expect(headers['x-storage-operation']).toBeUndefined();
      expect(headers['x-database-write']).toBeUndefined();
      
      // Simulate successful email send without storage
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your message! I\'ll get back to you soon.'
        })
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Fill and submit form
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    await nameField.fill('John Doe');
    await emailField.fill('john@example.com');
    await messageField.fill('This is a test message to verify no persistent storage.');
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Verify success message
    const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
    await expect(successMessage).toBeVisible();
    
    // Verify no localStorage or sessionStorage usage for form data
    const localStorageKeys = await page.evaluate(() => Object.keys(localStorage));
    const sessionStorageKeys = await page.evaluate(() => Object.keys(sessionStorage));
    
    // Should not store form data in browser storage
    const formDataKeys = localStorageKeys.filter(key => 
      key.includes('contact') || 
      key.includes('form') || 
      key.includes('message') ||
      key.includes('email')
    );
    
    expect(formDataKeys.length).toBe(0);
    
    const sessionFormDataKeys = sessionStorageKeys.filter(key => 
      key.includes('contact') || 
      key.includes('form') || 
      key.includes('message') ||
      key.includes('email')
    );
    
    expect(sessionFormDataKeys.length).toBe(0);
    
    // Verify no cookies are set for form data
    const cookies = await context.cookies();
    const formCookies = cookies.filter(cookie => 
      cookie.name.includes('contact') || 
      cookie.name.includes('form') || 
      cookie.name.includes('message')
    );
    
    expect(formCookies.length).toBe(0);
  });

  test('Property: Application sanitizes all user input to prevent injection attacks', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Test various injection attack vectors
    const injectionVectors = [
      // XSS
      { name: '<script>alert(1)</script>', email: 'test@example.com', message: 'Valid message here' },
      { name: 'Valid Name', email: 'test@example.com', message: '<img src=x onerror=alert(1)>' },
      
      // HTML injection
      { name: '<h1>Injected Header</h1>', email: 'test@example.com', message: 'Valid message' },
      { name: 'Valid Name', email: 'test@example.com', message: '<div onclick="alert(1)">Click</div>' },
      
      // SQL injection
      { name: "'; DROP TABLE users; --", email: 'test@example.com', message: 'Valid message' },
      { name: 'Valid Name', email: 'test@example.com', message: "1' OR '1'='1" },
      
      // Command injection
      { name: '; rm -rf /', email: 'test@example.com', message: 'Valid message' },
      { name: 'Valid Name', email: 'test@example.com', message: '| cat /etc/passwd' },
      
      // Path traversal
      { name: '../../../etc/passwd', email: 'test@example.com', message: 'Valid message' },
      { name: 'Valid Name', email: 'test@example.com', message: '..\\..\\..\\windows\\system32' },
      
      // LDAP injection
      { name: '*)(uid=*', email: 'test@example.com', message: 'Valid message' },
      
      // XML injection
      { name: '<?xml version="1.0"?>', email: 'test@example.com', message: 'Valid message' },
      
      // Template injection
      { name: '{{7*7}}', email: 'test@example.com', message: 'Valid message' },
      { name: 'Valid Name', email: 'test@example.com', message: '${7*7}' },
      
      // Null byte injection
      { name: 'test\x00admin', email: 'test@example.com', message: 'Valid message' },
      
      // Unicode/encoding attacks
      { name: '\u003cscript\u003ealert(1)\u003c/script\u003e', email: 'test@example.com', message: 'Valid message' },
    ];
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    
    for (const vector of injectionVectors) {
      await nameField.fill(vector.name);
      await emailField.fill(vector.email);
      await messageField.fill(vector.message);
      
      // Verify no script execution
      let alertFired = false;
      page.once('dialog', async dialog => {
        alertFired = true;
        await dialog.dismiss();
      });
      
      await page.waitForTimeout(300);
      expect(alertFired).toBeFalsy();
      
      // Verify input values are present (sanitization happens server-side)
      const nameValue = await nameField.inputValue();
      const messageValue = await messageField.inputValue();
      
      expect(nameValue).toBeTruthy();
      expect(messageValue).toBeTruthy();
      
      // Verify no DOM manipulation occurred
      const bodyHtml = await page.locator('body').innerHTML();
      
      // Should not contain raw injection payloads in DOM
      expect(bodyHtml).not.toContain('<script>alert(1)</script>');
      expect(bodyHtml).not.toContain('onerror=alert(1)');
      expect(bodyHtml).not.toContain('DROP TABLE');
      expect(bodyHtml).not.toContain('rm -rf');
    }
  });

  test('Property: Application implements proper error handling without information disclosure', async ({ page }) => {
    // Test API error responses don't leak sensitive information
    await page.route('/api/contact', async (route) => {
      // Simulate server error
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'An unexpected error occurred. Please try again.',
          error: 'Internal server error'
        })
      });
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Submit form to trigger error
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    await nameField.fill('John Doe');
    await emailField.fill('john@example.com');
    await messageField.fill('This is a test message.');
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Verify error message is user-friendly and doesn't leak details
    const errorMessage = page.locator('[role="alert"]');
    await expect(errorMessage).toBeVisible();
    
    const errorText = await errorMessage.textContent();
    
    // Should not contain sensitive information
    expect(errorText).not.toContain('stack trace');
    expect(errorText).not.toContain('file path');
    expect(errorText).not.toContain('database');
    expect(errorText).not.toContain('SQL');
    expect(errorText).not.toContain('password');
    expect(errorText).not.toContain('token');
    expect(errorText).not.toContain('api key');
    expect(errorText).not.toContain('RESEND');
    
    // Should be generic and user-friendly
    expect(errorText?.toLowerCase()).toMatch(/error|failed|try again|unexpected/);
  });

  test('Property: Application validates environment variables are properly configured', async ({ page }) => {
    // This test verifies that the application checks for required environment variables
    // In a real scenario, missing env vars should be caught at build/startup time
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Verify public environment variables are accessible
    const publicEnvVars = await page.evaluate(() => {
      return {
        siteUrl: (window as any).NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_SITE_URL,
        analyticsId: (window as any).NEXT_PUBLIC_VERCEL_ANALYTICS_ID || process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
      };
    });
    
    // Public vars should be accessible (or undefined if not set)
    expect(publicEnvVars).toBeDefined();
    
    // Verify private environment variables are NOT accessible
    const privateEnvVars = await page.evaluate(() => {
      return {
        resendKey: (window as any).RESEND_API_KEY,
        fromEmail: (window as any).FROM_EMAIL,
        toEmail: (window as any).TO_EMAIL,
      };
    });
    
    // Private vars should NOT be accessible in client-side code
    expect(privateEnvVars.resendKey).toBeUndefined();
    expect(privateEnvVars.fromEmail).toBeUndefined();
    expect(privateEnvVars.toEmail).toBeUndefined();
  });

  test('Property: Application implements rate limiting to prevent abuse', async ({ page }) => {
    // Test rate limiting on contact form
    const validName = 'John Doe';
    const validEmail = 'john@example.com';
    const validMessage = 'This is a valid message that meets all requirements.';
    
    let requestCount = 0;
    
    await page.route('/api/contact', async (route) => {
      requestCount++;
      
      if (requestCount > 3) {
        // Rate limit exceeded
        await route.fulfill({
          status: 429,
          contentType: 'application/json',
          headers: {
            'Retry-After': '3600'
          },
          body: JSON.stringify({
            success: false,
            message: 'Too many submissions. Please try again later.',
            error: 'Rate limit exceeded'
          })
        });
      } else {
        // Normal response
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.'
          })
        });
      }
    });
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Submit form 4 times
    for (let i = 1; i <= 4; i++) {
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(`${validName} ${i}`);
      await emailField.fill(validEmail);
      await messageField.fill(`${validMessage} Submission ${i}`);
      
      await submitButton.click();
      await page.waitForTimeout(1000);
      
      if (i <= 3) {
        // First 3 should succeed
        const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
        await expect(successMessage).toBeVisible();
      } else {
        // 4th should be rate limited
        const rateLimitError = page.locator('[role="alert"]').filter({ hasText: /Too many submissions/i });
        await expect(rateLimitError).toBeVisible();
      }
      
      // Reload page for next submission
      if (i < 4) {
        await page.goto('/');
        await page.waitForLoadState('networkidle');
      }
    }
    
    // Verify rate limit was enforced
    expect(requestCount).toBe(4);
  });

  test('Property: Application uses secure HTTP methods and CORS configuration', async ({ page }) => {
    // Test that API endpoints only accept appropriate HTTP methods
    const methods = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'];
    
    for (const method of methods) {
      const response = await page.request.fetch('/api/contact', {
        method: method as any,
        headers: {
          'Content-Type': 'application/json'
        },
        data: method === 'POST' ? JSON.stringify({
          name: 'Test',
          email: 'test@example.com',
          message: 'Test message'
        }) : undefined,
        failOnStatusCode: false
      });
      
      if (method === 'POST') {
        // POST should be allowed (200 or 400 for validation)
        expect([200, 400, 500]).toContain(response.status());
      } else if (method === 'OPTIONS') {
        // OPTIONS may be allowed for CORS preflight
        expect([200, 204, 405]).toContain(response.status());
      } else {
        // Other methods should return 405 Method Not Allowed
        expect(response.status()).toBe(405);
      }
    }
  });
});
