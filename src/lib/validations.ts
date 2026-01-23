/**
 * Form validation schemas and utility functions
 * Requirements: 4.4, 4.5, 4.6
 */

import type { ContactFormData, FormValidationState } from './types';

/**
 * Email validation regex pattern
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  return EMAIL_REGEX.test(email.trim());
}

/**
 * Validate required field is not empty
 */
export function isRequired(value: string): boolean {
  return value.trim().length > 0;
}

/**
 * Validate message length (minimum 10 characters)
 */
export function isValidMessageLength(message: string): boolean {
  return message.trim().length >= 10;
}

/**
 * Check if honeypot field is empty (bot protection)
 */
export function isHoneypotEmpty(honeypot?: string): boolean {
  return !honeypot || honeypot.trim().length === 0;
}

/**
 * Validate contact form data
 */
export function validateContactForm(data: ContactFormData): FormValidationState {
  const errors: Partial<Record<keyof ContactFormData, string>> = {};

  // Validate name
  if (!isRequired(data.name)) {
    errors.name = 'Name is required';
  }

  // Validate email
  if (!isRequired(data.email)) {
    errors.email = 'Email is required';
  } else if (!isValidEmail(data.email)) {
    errors.email = 'Please enter a valid email address';
  }

  // Validate message
  if (!isRequired(data.message)) {
    errors.message = 'Message is required';
  } else if (!isValidMessageLength(data.message)) {
    errors.message = 'Message must be at least 10 characters long';
  }

  // Check honeypot (bot protection)
  if (!isHoneypotEmpty(data.honeypot)) {
    errors.honeypot = 'Bot detected';
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
    isSubmitted: false,
    isSubmitting: false
  };
}

/**
 * Sanitize user input to prevent XSS and injection attacks
 */
export function sanitizeInput(input: string): string {
  return input
    .trim()
    // Remove HTML tags and potentially dangerous characters
    .replace(/[<>'"&]/g, (char) => {
      const entities: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#x27;',
        '&': '&amp;',
      };
      return entities[char] || char;
    })
    // Remove null bytes and control characters
    .replace(/[\x00-\x1F\x7F]/g, '')
    // Limit length to prevent DoS
    .substring(0, 1000);
}

/**
 * Sanitize contact form data
 */
export function sanitizeContactFormData(data: ContactFormData): ContactFormData {
  return {
    name: sanitizeInput(data.name),
    email: sanitizeInput(data.email),
    message: sanitizeInput(data.message),
    honeypot: data.honeypot ? sanitizeInput(data.honeypot) : undefined
  };
}