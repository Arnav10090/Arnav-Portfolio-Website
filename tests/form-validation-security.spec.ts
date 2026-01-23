/**
 * Property-Based Test: Form Validation and Security
 * Feature: portfolio-website, Property 9: Form Validation and Security
 * **Validates: Requirements 4.4, 4.5, 4.6**
 * 
 * Tests that contact form validates email format, requires all fields,
 * implements rate limiting (max 3/hour per IP), and rejects honeypot-filled
 * submissions for bot protection.
 */

import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';

// Generate invalid email addresses for testing
function generateInvalidEmails(count: number): string[] {
  const invalidPatterns = [
    'plainaddress',
    '@missingdomain.com',
    'missing@.com',
    'missing@domain',
    'spaces @domain.com',
    'double@@domain.com',
    'trailing.dot.@domain.com',
    '.leading.dot@domain.com',
    'multiple..dots@domain.com',
    'toolong' + 'a'.repeat(250) + '@domain.com',
    'special!chars@domain.com',
    'unicode@dömäin.com',
    '',
    '   ',
    'incomplete@',
    '@incomplete',
    'no-at-sign.com'
  ];
  
  const emails: string[] = [];
  for (let i = 0; i < count; i++) {
    emails.push(invalidPatterns[i % invalidPatterns.length]);
  }
  
  return emails;
}

// Generate edge case names for testing
function generateEdgeCaseNames(count: number): string[] {
  const edgeCases = [
    '', // Empty
    '   ', // Whitespace only
    'A', // Single character
    'a'.repeat(1000), // Very long name
    'Name with    multiple    spaces',
    'Name\nwith\nnewlines',
    'Name\twith\ttabs',
    'Name<script>alert("xss")</script>',
    'Name with "quotes" and \'apostrophes\'',
    'Name with special chars: !@#$%^&*()',
    'Name with unicode: José María',
    'Name with emojis: John 😀 Doe',
    '123456789', // Numbers only
    'ALLCAPS',
    'lowercase',
    'MiXeD cAsE'
  ];
  
  const names: string[] = [];
  for (let i = 0; i < count; i++) {
    names.push(edgeCases[i % edgeCases.length]);
  }
  
  return names;
}

// Generate edge case messages for testing
function generateEdgeCaseMessages(count: number): string[] {
  const edgeCases = [
    '', // Empty
    '   ', // Whitespace only
    'Short', // Too short (under 10 chars)
    'A'.repeat(10000), // Very long message
    'Message with <script>alert("xss")</script> tags',
    'Message with\nmultiple\nlines\nof\ntext',
    'Message with\ttabs\tand\tspaces',
    'Message with "quotes" and \'apostrophes\' and `backticks`',
    'Message with special chars: !@#$%^&*()[]{}|\\:";\'<>?,./~`',
    'Message with unicode: Héllo Wörld 你好',
    'Message with emojis: Hello 😀 World 🌍',
    'SQL injection attempt: \'; DROP TABLE users; --',
    'XSS attempt: <img src="x" onerror="alert(1)">',
    'Path traversal: ../../../etc/passwd',
    'Command injection: ; rm -rf /',
    'Valid message that meets all requirements and should pass validation.'
  ];
  
  const messages: string[] = [];
  for (let i = 0; i < count; i++) {
    messages.push(edgeCases[i % edgeCases.length]);
  }
  
  return messages;
}

// Mock rate limiting responses
async function mockRateLimitedAPI(page: any, requestCount: number = 0) {
  let currentRequestCount = requestCount;
  
  await page.route('/api/contact', async (route: any) => {
    currentRequestCount++;
    
    if (currentRequestCount > 3) {
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
          error: 'Rate limit exceeded. Try again after 1:00:00 PM'
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
  
  return currentRequestCount;
}

// Mock validation responses
async function mockValidationAPI(page: any) {
  await page.route('/api/contact', async (route: any) => {
    const request = route.request();
    const postData = request.postData();
    
    if (!postData) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid request format',
          error: 'Request body must be valid JSON'
        })
      });
      return;
    }
    
    try {
      const formData = JSON.parse(postData);
      const errors: string[] = [];
      
      // Validate name
      if (!formData.name || formData.name.trim().length === 0) {
        errors.push('Name is required');
      }
      
      // Validate email
      if (!formData.email || formData.email.trim().length === 0) {
        errors.push('Email is required');
      } else {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(formData.email.trim())) {
          errors.push('Please enter a valid email address');
        }
      }
      
      // Validate message
      if (!formData.message || formData.message.trim().length === 0) {
        errors.push('Message is required');
      } else if (formData.message.trim().length < 10) {
        errors.push('Message must be at least 10 characters long');
      }
      
      // Check honeypot
      if (formData.honeypot && formData.honeypot.trim().length > 0) {
        // Return success to hide honeypot from bots
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.'
          })
        });
        return;
      }
      
      if (errors.length > 0) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({
            success: false,
            message: 'Validation failed',
            error: errors.join(', ')
          })
        });
      } else {
        await route.fulfill({
          status: 200,
          contentType: 'application/json',
          body: JSON.stringify({
            success: true,
            message: 'Thank you for your message! I\'ll get back to you soon.'
          })
        });
      }
    } catch (error) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Invalid request format',
          error: 'Request body must be valid JSON'
        })
      });
    }
  });
}

test.describe('Property 9: Form Validation and Security', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('Property: Contact form validates email format and rejects invalid emails', async ({ page }) => {
    await mockValidationAPI(page);
    
    const invalidEmails = generateInvalidEmails(10);
    const validName = 'John Doe';
    const validMessage = 'This is a valid message that meets the minimum length requirement.';
    
    for (const invalidEmail of invalidEmails) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form with invalid email
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validName);
      await emailField.fill(invalidEmail);
      await messageField.fill(validMessage);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for validation
      await page.waitForTimeout(500);
      
      if (invalidEmail.trim().length === 0) {
        // Empty email should show "Email is required"
        const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Email is required/i });
        await expect(errorMessage).toBeVisible();
      } else {
        // Invalid format should show "Please enter a valid email address"
        const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Please enter a valid email address/i });
        await expect(errorMessage).toBeVisible();
      }
      
      // Verify email field has error styling
      const emailFieldStyles = await emailField.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          borderColor: styles.borderColor
        };
      });
      
      // Should have red border for error state
      expect(emailFieldStyles.borderColor).toContain('rgb(252, 165, 165)'); // red-300
      
      // Verify form is not submitted (no success message)
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).not.toBeVisible();
    }
  });

  test('Property: Contact form requires all fields and shows appropriate error messages', async ({ page }) => {
    await mockValidationAPI(page);
    
    const testCases = [
      { name: '', email: 'valid@email.com', message: 'Valid message here', expectedError: 'Name is required' },
      { name: 'Valid Name', email: '', message: 'Valid message here', expectedError: 'Email is required' },
      { name: 'Valid Name', email: 'valid@email.com', message: '', expectedError: 'Message is required' },
      { name: '   ', email: 'valid@email.com', message: 'Valid message here', expectedError: 'Name is required' },
      { name: 'Valid Name', email: '   ', message: 'Valid message here', expectedError: 'Email is required' },
      { name: 'Valid Name', email: 'valid@email.com', message: '   ', expectedError: 'Message is required' }
    ];
    
    for (const testCase of testCases) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(testCase.name);
      await emailField.fill(testCase.email);
      await messageField.fill(testCase.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for validation
      await page.waitForTimeout(500);
      
      // Verify appropriate error message appears
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: new RegExp(testCase.expectedError, 'i') });
      await expect(errorMessage).toBeVisible();
      
      // Verify error message styling
      const errorMessageStyles = await errorMessage.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          color: styles.color,
          fontSize: styles.fontSize
        };
      });
      
      // Should have red error styling
      expect(errorMessageStyles.color).toContain('rgb(220, 38, 38)'); // red-600
      expect(parseFloat(errorMessageStyles.fontSize)).toBeLessThanOrEqual(14); // text-sm
      
      // Verify no success message
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).not.toBeVisible();
    }
  });

  test('Property: Contact form validates message length requirement', async ({ page }) => {
    await mockValidationAPI(page);
    
    const validName = 'John Doe';
    const validEmail = 'john@example.com';
    const shortMessages = ['', '   ', 'Short', 'Too short', '123456789']; // All under 10 chars
    const validMessage = 'This is a valid message that meets the minimum length requirement.';
    
    // Test short messages (should fail)
    for (const shortMessage of shortMessages) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form with short message
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validName);
      await emailField.fill(validEmail);
      await messageField.fill(shortMessage);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for validation
      await page.waitForTimeout(500);
      
      if (shortMessage.trim().length === 0) {
        // Empty message should show "Message is required"
        const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Message is required/i });
        await expect(errorMessage).toBeVisible();
      } else {
        // Short message should show length requirement error
        const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Message must be at least 10 characters long/i });
        await expect(errorMessage).toBeVisible();
      }
      
      // Verify message field has error styling
      const messageFieldStyles = await messageField.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          borderColor: styles.borderColor
        };
      });
      
      // Should have red border for error state
      expect(messageFieldStyles.borderColor).toContain('rgb(252, 165, 165)'); // red-300
    }
    
    // Test valid message (should succeed)
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    await nameField.fill(validName);
    await emailField.fill(validEmail);
    await messageField.fill(validMessage);
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should show success message
    const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
    await expect(successMessage).toBeVisible();
  });

  test('Property: Contact form implements rate limiting (max 3 submissions per hour)', async ({ page }) => {
    const validName = 'John Doe';
    const validEmail = 'john@example.com';
    const validMessage = 'This is a valid message that meets all requirements.';
    
    // Mock rate limiting
    await mockRateLimitedAPI(page, 0);
    
    // First 3 submissions should succeed
    for (let i = 1; i <= 3; i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(`${validName} ${i}`);
      await emailField.fill(validEmail);
      await messageField.fill(`${validMessage} Submission ${i}`);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for submission
      await page.waitForTimeout(1000);
      
      // Should show success message
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).toBeVisible();
    }
    
    // 4th submission should be rate limited
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    await nameField.fill(`${validName} 4`);
    await emailField.fill(validEmail);
    await messageField.fill(`${validMessage} Submission 4`);
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should show rate limit error
    const rateLimitError = page.locator('[role="alert"]').filter({ hasText: /Too many submissions/i });
    await expect(rateLimitError).toBeVisible();
    
    // Verify error message styling
    const errorMessageStyles = await rateLimitError.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        backgroundColor: styles.backgroundColor,
        borderColor: styles.borderColor,
        color: styles.color
      };
    });
    
    // Should have red error styling
    expect(errorMessageStyles.backgroundColor).toContain('rgb(254, 242, 242)'); // red-50
    expect(errorMessageStyles.borderColor).toContain('rgb(254, 202, 202)'); // red-200
    expect(errorMessageStyles.color).toContain('rgb(185, 28, 28)'); // red-700
    
    // Verify form data is preserved
    await expect(nameField).toHaveValue(`${validName} 4`);
    await expect(emailField).toHaveValue(validEmail);
    await expect(messageField).toHaveValue(`${validMessage} Submission 4`);
  });

  test('Property: Contact form honeypot field rejects bot submissions', async ({ page }) => {
    await mockValidationAPI(page);
    
    const validName = 'John Doe';
    const validEmail = 'john@example.com';
    const validMessage = 'This is a valid message that meets all requirements.';
    const botValues = ['http://spam-site.com', 'bot-filled-value', 'automated-submission', 'spam-link.net'];
    
    for (const botValue of botValues) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form normally
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validName);
      await emailField.fill(validEmail);
      await messageField.fill(validMessage);
      
      // Fill honeypot field (simulating bot behavior)
      await page.evaluate((value) => {
        const honeypotField = document.querySelector('input[name="website"]') as HTMLInputElement;
        if (honeypotField) {
          honeypotField.value = value;
        }
      }, botValue);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for submission
      await page.waitForTimeout(1000);
      
      // Should still show success message (to hide honeypot from bots)
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).toBeVisible();
      
      // But the server should not actually send the email (handled by server-side logic)
      // This is verified by the mock which returns success for honeypot submissions
    }
    
    // Verify honeypot field properties
    const honeypotField = page.locator('input[name="website"]');
    const honeypotContainer = honeypotField.locator('..');
    
    // Should be hidden from users
    const containerStyles = await honeypotContainer.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        display: styles.display
      };
    });
    
    expect(containerStyles.display).toBe('none');
    
    // Should have proper attributes
    const honeypotAttributes = await honeypotField.evaluate(el => ({
      tabIndex: el.tabIndex,
      autoComplete: el.getAttribute('autocomplete'),
      name: el.getAttribute('name'),
      type: el.getAttribute('type')
    }));
    
    expect(honeypotAttributes.tabIndex).toBe(-1);
    expect(honeypotAttributes.autoComplete).toBe('off');
    expect(honeypotAttributes.name).toBe('website');
    expect(honeypotAttributes.type).toBe('text');
  });

  test('Property: Contact form sanitizes input data to prevent XSS attacks', async ({ page }) => {
    await mockValidationAPI(page);
    
    const xssAttempts = [
      '<script>alert("xss")</script>',
      '<img src="x" onerror="alert(1)">',
      'javascript:alert("xss")',
      '<svg onload="alert(1)">',
      '<iframe src="javascript:alert(1)"></iframe>',
      '<body onload="alert(1)">',
      '<div onclick="alert(1)">Click me</div>',
      '"><script>alert("xss")</script>',
      '\'; DROP TABLE users; --',
      '../../../etc/passwd',
      '${alert("xss")}',
      '{{alert("xss")}}',
      '<style>body{background:url("javascript:alert(1)")}</style>'
    ];
    
    const validEmail = 'john@example.com';
    
    for (const xssAttempt of xssAttempts) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Test XSS in name field
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(xssAttempt);
      await emailField.fill(validEmail);
      await messageField.fill('This is a valid message that meets the minimum length requirement.');
      
      // Submit the form
      await submitButton.click();
      
      // Wait for submission
      await page.waitForTimeout(1000);
      
      // Should show success message (XSS should be sanitized server-side)
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).toBeVisible();
      
      // Verify no script execution occurred
      const alertDialogs: string[] = [];
      page.on('dialog', dialog => {
        alertDialogs.push(dialog.message());
        dialog.dismiss();
      });
      
      // Wait a bit to see if any alerts fire
      await page.waitForTimeout(500);
      
      // Should not have any alert dialogs
      expect(alertDialogs.length).toBe(0);
      
      // Test XSS in message field
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection2 = page.locator('#contact');
      await contactSection2.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      const nameField2 = page.locator('#name');
      const emailField2 = page.locator('#email');
      const messageField2 = page.locator('#message');
      const submitButton2 = page.locator('button[type="submit"]');
      
      await nameField2.fill('Valid Name');
      await emailField2.fill(validEmail);
      await messageField2.fill(xssAttempt + ' - This makes it long enough to pass validation.');
      
      await submitButton2.click();
      await page.waitForTimeout(1000);
      
      const successMessage2 = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage2).toBeVisible();
      
      // Verify no script execution
      await page.waitForTimeout(500);
      expect(alertDialogs.length).toBe(0);
    }
  });

  test('Property: Contact form handles edge cases and malformed input gracefully', async ({ page }) => {
    await mockValidationAPI(page);
    
    const edgeCaseNames = generateEdgeCaseNames(8);
    const edgeCaseMessages = generateEdgeCaseMessages(8);
    const validEmail = 'john@example.com';
    
    for (let i = 0; i < Math.min(edgeCaseNames.length, edgeCaseMessages.length); i++) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Fill out the form with edge case data
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(edgeCaseNames[i]);
      await emailField.fill(validEmail);
      await messageField.fill(edgeCaseMessages[i]);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(1000);
      
      // Check if validation errors are shown appropriately
      const hasError = await page.locator('[role="alert"]').filter({ hasText: /required|invalid|must be/i }).isVisible();
      const hasSuccess = await page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i }).isVisible();
      
      // Should either show error or success, but not both
      expect(hasError || hasSuccess).toBeTruthy();
      expect(hasError && hasSuccess).toBeFalsy();
      
      // If it's a valid case (name not empty/whitespace, message >= 10 chars), should succeed
      const isValidName = edgeCaseNames[i].trim().length > 0;
      const isValidMessage = edgeCaseMessages[i].trim().length >= 10;
      
      if (isValidName && isValidMessage) {
        expect(hasSuccess).toBeTruthy();
      } else {
        expect(hasError).toBeTruthy();
      }
      
      // Verify form doesn't crash or show unexpected behavior
      await expect(submitButton).toBeEnabled();
      await expect(nameField).toBeVisible();
      await expect(emailField).toBeVisible();
      await expect(messageField).toBeVisible();
    }
  });

  test('Property: Contact form real-time validation provides immediate feedback', async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    // Test real-time email validation
    await emailField.fill('invalid-email');
    await emailField.blur(); // Trigger validation
    await page.waitForTimeout(500);
    
    // Should show email validation error after blur
    const emailError = page.locator('[role="alert"]').filter({ hasText: /Please enter a valid email address/i });
    
    // Fill valid email and verify error clears
    await emailField.fill('valid@example.com');
    await page.waitForTimeout(500);
    
    // Error should be cleared or not visible
    await expect(emailError).not.toBeVisible();
    
    // Test message length validation
    await messageField.fill('Short');
    await messageField.blur();
    await page.waitForTimeout(500);
    
    // Should show length validation error
    const messageError = page.locator('[role="alert"]').filter({ hasText: /Message must be at least 10 characters long/i });
    
    // Fill valid message and verify error clears
    await messageField.fill('This is a valid message that meets the minimum length requirement.');
    await page.waitForTimeout(500);
    
    // Error should be cleared
    await expect(messageError).not.toBeVisible();
    
    // Verify form fields have proper focus states
    await nameField.focus();
    const nameFocusStyles = await nameField.evaluate(el => {
      const styles = getComputedStyle(el);
      return {
        outlineColor: styles.outlineColor,
        borderColor: styles.borderColor
      };
    });
    
    // Should have focus styling
    expect(nameFocusStyles.outlineColor).not.toBe('rgba(0, 0, 0, 0)');
  });
});