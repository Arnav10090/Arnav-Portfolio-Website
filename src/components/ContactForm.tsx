'use client';

import React, { useState, useCallback, memo } from 'react';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import { validateContactForm, sanitizeContactFormData } from '@/lib/validations';
import { trackContactSubmit } from '@/lib/analytics';
import type { ContactFormData, FormValidationState, ContactFormResponse } from '@/lib/types';

interface ContactFormProps {
  className?: string;
}

// Memoized input component to prevent unnecessary re-renders
const FormInput = memo(({ 
  id, 
  type = 'text', 
  label, 
  value, 
  onChange, 
  error, 
  placeholder, 
  disabled, 
  required = false,
  rows
}: {
  id: string;
  type?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder: string;
  disabled: boolean;
  required?: boolean;
  rows?: number;
}) => {
  const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  const inputClassName = `w-full px-3 py-2 border rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-colors ${
    error 
      ? 'border-red-300 focus:ring-red-500 focus:border-red-500' 
      : 'border-gray-300'
  }`;

  return (
    <div className="space-y-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label} {required && '*'}
      </label>
      {type === 'textarea' ? (
        <textarea
          id={id}
          name={id}
          rows={rows || 5}
          value={value}
          onChange={handleChange}
          className={`${inputClassName} resize-vertical`}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
        />
      ) : (
        <input
          type={type}
          id={id}
          name={id}
          value={value}
          onChange={handleChange}
          className={inputClassName}
          placeholder={placeholder}
          disabled={disabled}
          required={required}
          suppressHydrationWarning
        />
      )}
      {error && (
        <p className="text-sm text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
});

FormInput.displayName = 'FormInput';

export const ContactForm = memo(function ContactForm({ className }: ContactFormProps) {
  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    honeypot: ''
  });

  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    isSubmitted: false,
    isSubmitting: false
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: ''
  });

  // Real-time validation
  const validateField = useCallback((field: keyof ContactFormData, value: string) => {
    const tempData = { ...formData, [field]: value };
    const validation = validateContactForm(tempData);
    
    setValidationState(prev => ({
      ...prev,
      errors: {
        ...prev.errors,
        [field]: validation.errors[field]
      }
    }));
  }, [formData]);

  // Handle input changes with real-time validation
  const handleNameChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, name: value }));
    if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
    if (validationState.isSubmitted) {
      setTimeout(() => validateField('name', value), 300);
    }
  }, [validateField, validationState.isSubmitted, submitStatus.type]);

  const handleEmailChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, email: value }));
    if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
    if (validationState.isSubmitted) {
      setTimeout(() => validateField('email', value), 300);
    }
  }, [validateField, validationState.isSubmitted, submitStatus.type]);

  const handleMessageChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, message: value }));
    if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
    if (validationState.isSubmitted) {
      setTimeout(() => validateField('message', value), 300);
    }
  }, [validateField, validationState.isSubmitted, submitStatus.type]);

  const handleHoneypotChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, honeypot: value }));
  }, []);

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const validation = validateContactForm(formData);
    setValidationState({
      ...validation,
      isSubmitted: true,
      isSubmitting: true
    });

    if (!validation.isValid) {
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      // Sanitize data before sending
      const sanitizedData = sanitizeContactFormData(formData);
      
      // Submit form
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      const result: ContactFormResponse = await response.json();

      if (response.ok && result.success) {
        // Success
        setSubmitStatus({
          type: 'success',
          message: result.message || 'Thank you for your message! I\'ll get back to you soon.'
        });
        
        // Track successful submission
        trackContactSubmit();
        
        // Reset form
        setFormData({
          name: '',
          email: '',
          message: '',
          honeypot: ''
        });
        
        setValidationState({
          isValid: false,
          errors: {},
          isSubmitted: false,
          isSubmitting: false
        });
      } else {
        // Error from server
        setSubmitStatus({
          type: 'error',
          message: result.error || result.message || 'Something went wrong. Please try again.'
        });
      }
    } catch (error) {
      // Network or other error
      setSubmitStatus({
        type: 'error',
        message: 'Unable to send message. Please check your connection and try again.'
      });
    } finally {
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <Card className={className}>
      <CardContent className="p-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Honeypot field for bot protection - hidden from users */}
          <div className="hidden" suppressHydrationWarning>
            <label htmlFor="website">
              Website (leave blank):
              <input
                type="text"
                id="website"
                name="website"
                value={formData.honeypot || ''}
                onChange={(e) => handleHoneypotChange(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                suppressHydrationWarning
              />
            </label>
          </div>

          {/* Name field */}
          <FormInput
            id="name"
            label="Name"
            value={formData.name}
            onChange={handleNameChange}
            error={validationState.errors.name}
            placeholder="Your full name"
            disabled={validationState.isSubmitting}
            required
          />

          {/* Email field */}
          <FormInput
            id="email"
            type="email"
            label="Email"
            value={formData.email}
            onChange={handleEmailChange}
            error={validationState.errors.email}
            placeholder="your.email@example.com"
            disabled={validationState.isSubmitting}
            required
          />

          {/* Message field */}
          <div className="space-y-2">
            <FormInput
              id="message"
              type="textarea"
              label="Message"
              value={formData.message}
              onChange={handleMessageChange}
              error={validationState.errors.message}
              placeholder="Tell me about the opportunity or project you'd like to discuss..."
              disabled={validationState.isSubmitting}
              required
              rows={5}
            />
            <p className="text-xs text-gray-500">
              Minimum 10 characters required
            </p>
          </div>

          {/* Submit status messages */}
          {submitStatus.type && (
            <div 
              className={`p-4 rounded-md ${
                submitStatus.type === 'success' 
                  ? 'bg-green-50 border border-green-200' 
                  : 'bg-red-50 border border-red-200'
              }`}
              role="alert"
            >
              <p className={`text-sm ${
                submitStatus.type === 'success' ? 'text-green-700' : 'text-red-700'
              }`}>
                {submitStatus.message}
              </p>
            </div>
          )}

          {/* Submit button */}
          <Button
            type="submit"
            variant="primary"
            size="lg"
            className="w-full"
            disabled={validationState.isSubmitting}
            suppressHydrationWarning
          >
            {validationState.isSubmitting ? (
              <span className="flex items-center justify-center">
                <svg 
                  className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" 
                  xmlns="http://www.w3.org/2000/svg" 
                  fill="none" 
                  viewBox="0 0 24 24"
                >
                  <circle 
                    className="opacity-25" 
                    cx="12" 
                    cy="12" 
                    r="10" 
                    stroke="currentColor" 
                    strokeWidth="4"
                  />
                  <path 
                    className="opacity-75" 
                    fill="currentColor" 
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  />
                </svg>
                Sending...
              </span>
            ) : (
              'Send Message'
            )}
          </Button>

          {/* Form footer */}
          <p className="text-xs text-gray-500 text-center">
            Your information is secure and will only be used to respond to your inquiry.
          </p>
        </form>
      </CardContent>
    </Card>
  );
});