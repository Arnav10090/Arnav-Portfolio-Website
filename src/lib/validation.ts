/**
 * Validation module for Resend email integration
 * Provides validation functions for contact form data
 * Requirements: 2.1, 2.2, 2.3, 2.5
 */

/**
 * Contact form data structure
 */
export interface ContactFormData {
  name: string;
  email: string;
  message: string;
}

/**
 * Validation result structure
 */
export interface ValidationResult {
  valid: boolean;
  errors: string[];
}

/**
 * Email validation regex pattern
 * Matches standard email format: local@domain.tld
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

/**
 * Validates that a name is non-empty after trimming
 * Requirement 2.1: Name field must not be empty
 *
 * @param name - The name string to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateName(name: string): { valid: boolean; error?: string } {
  const trimmedName = name.trim();

  if (trimmedName.length === 0) {
    return {
      valid: false,
      error: 'Name is required and cannot be empty',
    };
  }

  return { valid: true };
}

/**
 * Validates that an email matches the standard email format
 * Requirement 2.2: Email field must contain a valid email format
 * Requirement 2.5: Email validation must reject non-standard patterns
 *
 * @param email - The email string to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateEmail(email: string): {
  valid: boolean;
  error?: string;
} {
  const trimmedEmail = email.trim();

  if (trimmedEmail.length === 0) {
    return {
      valid: false,
      error: 'Email is required and cannot be empty',
    };
  }

  if (!EMAIL_REGEX.test(trimmedEmail)) {
    return {
      valid: false,
      error: 'Email must be in a valid format (e.g., user@example.com)',
    };
  }

  return { valid: true };
}

/**
 * Validates that a message is non-empty after trimming
 * Requirement 2.3: Message field must not be empty
 *
 * @param message - The message string to validate
 * @returns Validation result with valid flag and optional error message
 */
export function validateMessage(message: string): {
  valid: boolean;
  error?: string;
} {
  const trimmedMessage = message.trim();

  if (trimmedMessage.length === 0) {
    return {
      valid: false,
      error: 'Message is required and cannot be empty',
    };
  }

  return { valid: true };
}

/**
 * Validates complete contact form data
 * Combines all individual field validations
 * Requirement 2.4: Return descriptive error response if any validation fails
 *
 * @param data - The contact form data to validate
 * @returns Validation result with valid flag and array of error messages
 */
export function validateContactForm(data: ContactFormData): ValidationResult {
  const errors: string[] = [];

  // Validate name
  const nameResult = validateName(data.name);
  if (!nameResult.valid && nameResult.error) {
    errors.push(nameResult.error);
  }

  // Validate email
  const emailResult = validateEmail(data.email);
  if (!emailResult.valid && emailResult.error) {
    errors.push(emailResult.error);
  }

  // Validate message
  const messageResult = validateMessage(data.message);
  if (!messageResult.valid && messageResult.error) {
    errors.push(messageResult.error);
  }

  return {
    valid: errors.length === 0,
    errors,
  };
}
