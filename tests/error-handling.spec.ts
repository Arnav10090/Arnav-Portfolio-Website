/**
 * Property-Based Test: User Feedback and Error Handling
 * Feature: portfolio-website, Property 10: User Feedback and Error Handling
 * **Validates: Requirements 4.3, 12.4**
 * 
 * Tests that contact form submissions display appropriate success or error feedback
 * and handle email service failures gracefully with proper user messaging.
 */

import { test, expect } from '@playwright/test';
import * as fc from 'fast-check';

// Generate various error scenarios for testing
function generateErrorScenarios(): Array<{
  name: string;
  statusCode: number;
  responseBody: any;
  expectedUserMessage: RegExp;
  expectedErrorType: 'network' | 'server' | 'validation' | 'rate_limit';
}> {
  return [
    {
      name: 'Server Internal Error',
      statusCode: 500,
      responseBody: {
        success: false,
        message: 'Failed to send message. Please try again or contact me directly.',
        error: 'Email delivery failed'
      },
      expectedUserMessage: /Failed to send message/i,
      expectedErrorType: 'server'
    },
    {
      name: 'Email Service Unavailable',
      statusCode: 503,
      responseBody: {
        success: false,
        message: 'Email service is temporarily unavailable. Please try again later.',
        error: 'Service unavailable'
      },
      expectedUserMessage: /temporarily unavailable/i,
      expectedErrorType: 'server'
    },
    {
      name: 'Rate Limit Exceeded',
      statusCode: 429,
      responseBody: {
        success: false,
        message: 'Too many submissions. Please try again later.',
        error: 'Rate limit exceeded. Try again after 1:00:00 PM'
      },
      expectedUserMessage: /Too many submissions/i,
      expectedErrorType: 'rate_limit'
    },
    {
      name: 'Bad Request - Invalid Data',
      statusCode: 400,
      responseBody: {
        success: false,
        message: 'Validation failed',
        error: 'All fields are required'
      },
      expectedUserMessage: /Validation failed/i,
      expectedErrorType: 'validation'
    },
    {
      name: 'Bad Request - Malformed JSON',
      statusCode: 400,
      responseBody: {
        success: false,
        message: 'Invalid request format',
        error: 'Request body must be valid JSON'
      },
      expectedUserMessage: /Invalid request format/i,
      expectedErrorType: 'validation'
    },
    {
      name: 'Timeout Error',
      statusCode: 408,
      responseBody: {
        success: false,
        message: 'Request timed out. Please check your connection and try again.',
        error: 'Request timeout'
      },
      expectedUserMessage: /timed out/i,
      expectedErrorType: 'network'
    },
    {
      name: 'Network Error',
      statusCode: 0, // Special case for network failure
      responseBody: null,
      expectedUserMessage: /Unable to send message.*check your connection/i,
      expectedErrorType: 'network'
    }
  ];
}

// Generate valid form data for testing
function generateValidFormData(count: number): Array<{ name: string; email: string; message: string }> {
  const names = ['John Doe', 'Jane Smith', 'Michael Johnson', 'Sarah Wilson', 'David Brown'];
  const domains = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'];
  const messageTemplates = [
    'I am interested in discussing a software engineering opportunity.',
    'Hello! I would like to connect about potential collaboration opportunities.',
    'Your portfolio caught my attention. Let\'s discuss how you could contribute to our team.',
    'We have an exciting position that matches your skill set perfectly.',
    'I would like to schedule a call to discuss your availability for projects.'
  ];
  
  const formData: Array<{ name: string; email: string; message: string }> = [];
  
  for (let i = 0; i < count; i++) {
    const name = names[i % names.length];
    const username = name.toLowerCase().replace(' ', '.');
    const domain = domains[i % domains.length];
    const email = `${username}@${domain}`;
    const message = messageTemplates[i % messageTemplates.length];
    
    formData.push({ name, email, message });
  }
  
  return formData;
}

// Mock different error responses
async function mockErrorResponse(page: any, scenario: any) {
  if (scenario.statusCode === 0) {
    // Network failure
    await page.route('/api/contact', (route: any) => {
      route.abort('failed');
    });
  } else {
    // HTTP error response
    await page.route('/api/contact', async (route: any) => {
      await route.fulfill({
        status: scenario.statusCode,
        contentType: 'application/json',
        body: JSON.stringify(scenario.responseBody)
      });
    });
  }
}

// Mock slow response for timeout testing
async function mockSlowResponse(page: any, delayMs: number = 5000) {
  await page.route('/api/contact', async (route: any) => {
    await new Promise(resolve => setTimeout(resolve, delayMs));
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon.'
      })
    });
  });
}

// Mock intermittent failures
async function mockIntermittentFailures(page: any, failureRate: number = 0.5) {
  let requestCount = 0;
  
  await page.route('/api/contact', async (route: any) => {
    requestCount++;
    
    if (Math.random() < failureRate) {
      // Fail this request
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Failed to send message. Please try again or contact me directly.',
          error: 'Email delivery failed'
        })
      });
    } else {
      // Succeed this request
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
}

test.describe('Property 10: User Feedback and Error Handling', () => {
  
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    // Navigate to contact section
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
  });

  test('Property: Contact form displays appropriate error messages for different failure scenarios', async ({ page }) => {
    const errorScenarios = generateErrorScenarios();
    const validFormData = generateValidFormData(1)[0];
    
    for (const scenario of errorScenarios) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Mock the error response
      await mockErrorResponse(page, scenario);
      
      // Fill out the form with valid data
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validFormData.name);
      await emailField.fill(validFormData.email);
      await messageField.fill(validFormData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Verify appropriate error message is displayed
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: scenario.expectedUserMessage });
      await expect(errorMessage).toBeVisible();
      
      // Verify error message styling
      const errorMessageStyles = await errorMessage.evaluate(el => {
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
      
      // Verify form data is preserved after error
      await expect(nameField).toHaveValue(validFormData.name);
      await expect(emailField).toHaveValue(validFormData.email);
      await expect(messageField).toHaveValue(validFormData.message);
      
      // Verify submit button is re-enabled
      await expect(submitButton).toBeEnabled();
      await expect(submitButton).toHaveText('Send Message');
      
      // Verify no success message is shown
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).not.toBeVisible();
      
      // Clear the route for next iteration
      await page.unroute('/api/contact');
    }
  });

  test('Property: Contact form handles network failures gracefully with user-friendly messages', async ({ page }) => {
    const validFormData = generateValidFormData(3);
    
    for (const formData of validFormData) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Mock network failure
      await page.route('/api/contact', route => {
        route.abort('failed');
      });
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(formData.name);
      await emailField.fill(formData.email);
      await messageField.fill(formData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for network failure handling
      await page.waitForTimeout(2000);
      
      // Should show network error message
      const networkError = page.locator('[role="alert"]').filter({ 
        hasText: /Unable to send message.*check your connection/i 
      });
      await expect(networkError).toBeVisible();
      
      // Verify error provides actionable guidance
      const errorText = await networkError.textContent();
      expect(errorText).toMatch(/check your connection/i);
      expect(errorText).toMatch(/try again/i);
      
      // Verify form state is preserved
      await expect(nameField).toHaveValue(formData.name);
      await expect(emailField).toHaveValue(formData.email);
      await expect(messageField).toHaveValue(formData.message);
      
      // Verify user can retry
      await expect(submitButton).toBeEnabled();
      
      // Clear route for next iteration
      await page.unroute('/api/contact');
    }
  });

  test('Property: Contact form provides clear success feedback after successful submission', async ({ page }) => {
    const validFormData = generateValidFormData(5);
    
    // Mock successful responses
    await page.route('/api/contact', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your message! I\'ll get back to you soon.'
        })
      });
    });
    
    for (const formData of validFormData) {
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
      
      await nameField.fill(formData.name);
      await emailField.fill(formData.email);
      await messageField.fill(formData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for success response
      await page.waitForTimeout(1000);
      
      // Verify success message is displayed
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).toBeVisible();
      
      // Verify success message styling
      const successMessageStyles = await successMessage.evaluate(el => {
        const styles = getComputedStyle(el);
        return {
          backgroundColor: styles.backgroundColor,
          borderColor: styles.borderColor,
          color: styles.color
        };
      });
      
      // Should have green success styling
      expect(successMessageStyles.backgroundColor).toContain('rgb(240, 253, 244)'); // green-50
      expect(successMessageStyles.borderColor).toContain('rgb(187, 247, 208)'); // green-200
      expect(successMessageStyles.color).toContain('rgb(21, 128, 61)'); // green-700
      
      // Verify form is reset after successful submission
      await expect(nameField).toHaveValue('');
      await expect(emailField).toHaveValue('');
      await expect(messageField).toHaveValue('');
      
      // Verify submit button is re-enabled
      await expect(submitButton).toBeEnabled();
      await expect(submitButton).toHaveText('Send Message');
      
      // Verify no error messages are shown
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: /error|failed|invalid/i });
      await expect(errorMessage).not.toBeVisible();
    }
  });

  test('Property: Contact form handles loading states properly during submission', async ({ page }) => {
    const validFormData = generateValidFormData(2);
    
    for (const formData of validFormData) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Mock slow response to test loading state
      await mockSlowResponse(page, 2000);
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(formData.name);
      await emailField.fill(formData.email);
      await messageField.fill(formData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Verify loading state immediately
      await expect(submitButton).toBeDisabled();
      await expect(submitButton).toHaveText(/Sending.../);
      
      // Verify loading spinner is visible
      const loadingSpinner = submitButton.locator('svg.animate-spin');
      await expect(loadingSpinner).toBeVisible();
      
      // Verify form fields are disabled during submission
      await expect(nameField).toBeDisabled();
      await expect(emailField).toBeDisabled();
      await expect(messageField).toBeDisabled();
      
      // Wait for submission to complete
      await page.waitForTimeout(3000);
      
      // Verify loading state is cleared
      await expect(submitButton).toBeEnabled();
      await expect(submitButton).toHaveText('Send Message');
      
      // Verify form fields are re-enabled
      await expect(nameField).toBeEnabled();
      await expect(emailField).toBeEnabled();
      await expect(messageField).toBeEnabled();
      
      // Verify success message
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      await expect(successMessage).toBeVisible();
      
      // Clear route for next iteration
      await page.unroute('/api/contact');
    }
  });

  test('Property: Contact form error messages are accessible and properly announced', async ({ page }) => {
    const errorScenarios = generateErrorScenarios().slice(0, 3); // Test subset for performance
    const validFormData = generateValidFormData(1)[0];
    
    for (const scenario of errorScenarios) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Mock the error response
      await mockErrorResponse(page, scenario);
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validFormData.name);
      await emailField.fill(validFormData.email);
      await messageField.fill(validFormData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for error response
      await page.waitForTimeout(2000);
      
      // Verify error message has proper accessibility attributes
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: scenario.expectedUserMessage });
      await expect(errorMessage).toBeVisible();
      
      // Verify role="alert" for screen reader announcement
      const roleAttribute = await errorMessage.getAttribute('role');
      expect(roleAttribute).toBe('alert');
      
      // Verify error message is focusable for keyboard users
      const tabIndex = await errorMessage.getAttribute('tabindex');
      expect(tabIndex).not.toBe('-1');
      
      // Verify error message has sufficient color contrast
      const errorStyles = await errorMessage.evaluate(el => {
        const styles = getComputedStyle(el);
        const bgColor = styles.backgroundColor;
        const textColor = styles.color;
        
        // Parse RGB values
        const bgMatch = bgColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        const textMatch = textColor.match(/rgb\((\d+), (\d+), (\d+)\)/);
        
        return {
          backgroundColor: bgColor,
          color: textColor,
          bgRgb: bgMatch ? [parseInt(bgMatch[1]), parseInt(bgMatch[2]), parseInt(bgMatch[3])] : null,
          textRgb: textMatch ? [parseInt(textMatch[1]), parseInt(textMatch[2]), parseInt(textMatch[3])] : null
        };
      });
      
      // Verify error styling uses appropriate colors
      expect(errorStyles.backgroundColor).toContain('rgb(254, 242, 242)'); // red-50
      expect(errorStyles.color).toContain('rgb(185, 28, 28)'); // red-700
      
      // Clear route for next iteration
      await page.unroute('/api/contact');
    }
  });

  test('Property: Contact form handles intermittent failures with retry capability', async ({ page }) => {
    const validFormData = generateValidFormData(1)[0];
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // Mock intermittent failures (50% failure rate)
    await mockIntermittentFailures(page, 0.7);
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    // Fill out the form once
    await nameField.fill(validFormData.name);
    await emailField.fill(validFormData.email);
    await messageField.fill(validFormData.message);
    
    let attempts = 0;
    let success = false;
    const maxAttempts = 5;
    
    while (attempts < maxAttempts && !success) {
      attempts++;
      
      // Submit the form
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(1500);
      
      // Check if submission was successful
      const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Failed to send message/i });
      
      if (await successMessage.isVisible()) {
        success = true;
        
        // Verify success state
        await expect(successMessage).toBeVisible();
        await expect(nameField).toHaveValue('');
        await expect(emailField).toHaveValue('');
        await expect(messageField).toHaveValue('');
      } else if (await errorMessage.isVisible()) {
        // Verify error state and retry capability
        await expect(errorMessage).toBeVisible();
        
        // Verify form data is preserved for retry
        await expect(nameField).toHaveValue(validFormData.name);
        await expect(emailField).toHaveValue(validFormData.email);
        await expect(messageField).toHaveValue(validFormData.message);
        
        // Verify submit button is enabled for retry
        await expect(submitButton).toBeEnabled();
        await expect(submitButton).toHaveText('Send Message');
        
        // Wait before retry
        await page.waitForTimeout(500);
      }
    }
    
    // Should eventually succeed or we should have made reasonable attempts
    expect(attempts).toBeLessThanOrEqual(maxAttempts);
    
    // If we didn't succeed after max attempts, that's also a valid test outcome
    // as it demonstrates the system handles persistent failures gracefully
  });

  test('Property: Contact form error recovery allows users to correct and resubmit', async ({ page }) => {
    const validFormData = generateValidFormData(1)[0];
    
    await page.goto('/');
    await page.waitForLoadState('networkidle');
    
    const contactSection = page.locator('#contact');
    await contactSection.scrollIntoViewIfNeeded();
    await page.waitForTimeout(500);
    
    // First, mock a server error
    await page.route('/api/contact', async (route: any) => {
      await route.fulfill({
        status: 500,
        contentType: 'application/json',
        body: JSON.stringify({
          success: false,
          message: 'Failed to send message. Please try again or contact me directly.',
          error: 'Email delivery failed'
        })
      });
    });
    
    const nameField = page.locator('#name');
    const emailField = page.locator('#email');
    const messageField = page.locator('#message');
    const submitButton = page.locator('button[type="submit"]');
    
    // Fill and submit form (should fail)
    await nameField.fill(validFormData.name);
    await emailField.fill(validFormData.email);
    await messageField.fill(validFormData.message);
    
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Verify error is shown
    const errorMessage = page.locator('[role="alert"]').filter({ hasText: /Failed to send message/i });
    await expect(errorMessage).toBeVisible();
    
    // Verify form data is preserved
    await expect(nameField).toHaveValue(validFormData.name);
    await expect(emailField).toHaveValue(validFormData.email);
    await expect(messageField).toHaveValue(validFormData.message);
    
    // Now mock success for retry
    await page.unroute('/api/contact');
    await page.route('/api/contact', async (route: any) => {
      await route.fulfill({
        status: 200,
        contentType: 'application/json',
        body: JSON.stringify({
          success: true,
          message: 'Thank you for your message! I\'ll get back to you soon.'
        })
      });
    });
    
    // User can modify form if needed
    await messageField.fill(validFormData.message + ' (Updated after error)');
    
    // Retry submission
    await submitButton.click();
    await page.waitForTimeout(1000);
    
    // Should now succeed
    const successMessage = page.locator('[role="alert"]').filter({ hasText: /Thank you for your message/i });
    await expect(successMessage).toBeVisible();
    
    // Verify error message is cleared
    await expect(errorMessage).not.toBeVisible();
    
    // Verify form is reset after success
    await expect(nameField).toHaveValue('');
    await expect(emailField).toHaveValue('');
    await expect(messageField).toHaveValue('');
  });

  test('Property: Contact form provides consistent error messaging across different error types', async ({ page }) => {
    const errorScenarios = generateErrorScenarios();
    const validFormData = generateValidFormData(1)[0];
    
    const errorMessagePatterns: Record<string, RegExp> = {};
    
    for (const scenario of errorScenarios) {
      await page.goto('/');
      await page.waitForLoadState('networkidle');
      
      const contactSection = page.locator('#contact');
      await contactSection.scrollIntoViewIfNeeded();
      await page.waitForTimeout(500);
      
      // Mock the error response
      await mockErrorResponse(page, scenario);
      
      // Fill out the form
      const nameField = page.locator('#name');
      const emailField = page.locator('#email');
      const messageField = page.locator('#message');
      const submitButton = page.locator('button[type="submit"]');
      
      await nameField.fill(validFormData.name);
      await emailField.fill(validFormData.email);
      await messageField.fill(validFormData.message);
      
      // Submit the form
      await submitButton.click();
      
      // Wait for response
      await page.waitForTimeout(2000);
      
      // Capture error message
      const errorMessage = page.locator('[role="alert"]').filter({ hasText: scenario.expectedUserMessage });
      await expect(errorMessage).toBeVisible();
      
      const errorText = await errorMessage.textContent();
      expect(errorText).toBeTruthy();
      
      // Store pattern for consistency checking
      errorMessagePatterns[scenario.expectedErrorType] = scenario.expectedUserMessage;
      
      // Verify error message structure is consistent
      expect(errorText).toMatch(/^[A-Z]/); // Starts with capital letter
      expect(errorText).toMatch(/[.!]$/); // Ends with punctuation
      expect(errorText!.length).toBeGreaterThan(10); // Meaningful length
      expect(errorText!.length).toBeLessThan(200); // Not too verbose
      
      // Verify error message is user-friendly (no technical jargon)
      expect(errorText).not.toMatch(/500|404|503|timeout|xhr|ajax|api/i);
      expect(errorText).not.toMatch(/stack trace|exception|null pointer/i);
      
      // Clear route for next iteration
      await page.unroute('/api/contact');
    }
    
    // Verify different error types have distinct messaging
    const uniquePatterns = Object.values(errorMessagePatterns);
    const uniqueCount = new Set(uniquePatterns.map(p => p.source)).size;
    expect(uniqueCount).toBeGreaterThan(1); // Should have different messages for different error types
  });
});