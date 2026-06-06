'use client';

import React, { useState, useCallback, memo } from 'react';
import { motion, useReducedMotion } from 'framer-motion';
import { Button } from '@/components/ui/Button';
import { Card, CardContent } from '@/components/ui/Card';
import {
  validateContactForm,
  sanitizeContactFormData,
} from '@/lib/validations';
import { trackContactSubmit } from '@/lib/analytics';
import type {
  ContactFormData,
  FormValidationState,
  ContactFormResponse,
} from '@/lib/types';
import { fadeUpVariant } from '@/lib/animation-variants';

interface ContactFormProps {
  className?: string;
}

// Memoized input component to prevent unnecessary re-renders
const FormInput = memo(
  ({
    id,
    type = 'text',
    label,
    value,
    onChange,
    error,
    placeholder,
    disabled,
    required = false,
    rows,
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
    const shouldReduce = useReducedMotion();
    const [showError, setShowError] = React.useState(false);
    const [isValid, setIsValid] = React.useState(false);

    React.useEffect(() => {
      if (error) {
        setShowError(true);
        setIsValid(false);
        const timer = setTimeout(() => setShowError(false), 400);
        return () => clearTimeout(timer);
      } else if (value && !error) {
        setIsValid(true);
      } else {
        setIsValid(false);
      }
    }, [error, value]);

    const handleChange = useCallback(
      (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        onChange(e.target.value);
      },
      [onChange]
    );

    const inputClassName = `w-full px-[14px] py-[14px] border rounded-xl transition-all outline-none bg-white dark:bg-[rgba(30,41,59,0.6)] border-gray-200 dark:border-white/10 text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 dark:focus:border-primary-500 focus:ring-2 focus:ring-blue-500/20 dark:focus:ring-primary-500/20 ${
      error
        ? 'border-red-500/50 focus:ring-red-500/20'
        : isValid
          ? 'border-green-500/50'
          : 'hover:border-white/30'
    }`;

    return (
      <motion.div
        className="space-y-2 relative"
        animate={showError && !shouldReduce ? { x: [-5, 5, -5, 5, 0] } : {}}
        transition={{ duration: 0.4 }}
      >
        <label
          htmlFor={id}
          className="block text-sm font-medium text-gray-700 dark:text-gray-300 uppercase tracking-[0.8px]"
        >
          {label}{' '}
          {required && (
            <span className="text-red-500 dark:text-primary-400">*</span>
          )}
        </label>
        {type === 'textarea' ? (
          <textarea
            id={id}
            name={id}
            rows={rows || 5}
            value={value}
            onChange={handleChange}
            className={`${inputClassName} resize-none min-h-[140px] text-base`}
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
            className={`${inputClassName} text-base`}
            placeholder={placeholder}
            disabled={disabled}
            required={required}
            suppressHydrationWarning
          />
        )}
        {isValid && !error && (
          <div className="absolute right-3 top-9 text-green-400">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>
        )}
        {error && (
          <p className="text-sm text-red-400" role="alert">
            {error}
          </p>
        )}
      </motion.div>
    );
  }
);

FormInput.displayName = 'FormInput';

export const ContactForm = memo(function ContactForm({
  className,
}: ContactFormProps) {
  const shouldReduce = useReducedMotion();

  const [formData, setFormData] = useState<ContactFormData>({
    name: '',
    email: '',
    message: '',
    honeypot: '',
  });

  const [validationState, setValidationState] = useState<FormValidationState>({
    isValid: false,
    errors: {},
    isSubmitted: false,
    isSubmitting: false,
  });

  const [submitStatus, setSubmitStatus] = useState<{
    type: 'success' | 'error' | null;
    message: string;
  }>({
    type: null,
    message: '',
  });

  const validateField = useCallback(
    (field: keyof ContactFormData, value: string) => {
      const tempData = { ...formData, [field]: value };
      const validation = validateContactForm(tempData);

      setValidationState(prev => ({
        ...prev,
        errors: {
          ...prev.errors,
          [field]: validation.errors[field],
        },
      }));
    },
    [formData]
  );

  const handleNameChange = useCallback(
    (value: string) => {
      setFormData(prev => ({ ...prev, name: value }));
      if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
      if (validationState.isSubmitted) {
        setTimeout(() => validateField('name', value), 300);
      }
    },
    [validateField, validationState.isSubmitted, submitStatus.type]
  );

  const handleEmailChange = useCallback(
    (value: string) => {
      setFormData(prev => ({ ...prev, email: value }));
      if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
      if (validationState.isSubmitted) {
        setTimeout(() => validateField('email', value), 300);
      }
    },
    [validateField, validationState.isSubmitted, submitStatus.type]
  );

  const handleMessageChange = useCallback(
    (value: string) => {
      setFormData(prev => ({ ...prev, message: value }));
      if (submitStatus.type) setSubmitStatus({ type: null, message: '' });
      if (validationState.isSubmitted) {
        setTimeout(() => validateField('message', value), 300);
      }
    },
    [validateField, validationState.isSubmitted, submitStatus.type]
  );

  const handleHoneypotChange = useCallback((value: string) => {
    setFormData(prev => ({ ...prev, honeypot: value }));
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const validation = validateContactForm(formData);
    setValidationState({
      ...validation,
      isSubmitted: true,
      isSubmitting: true,
    });

    if (!validation.isValid) {
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
      return;
    }

    try {
      const sanitizedData = sanitizeContactFormData(formData);

      const formspreeEndpoint = process.env.NEXT_PUBLIC_FORMSPREE_ENDPOINT;

      if (!formspreeEndpoint) {
        console.error('NEXT_PUBLIC_FORMSPREE_ENDPOINT is not configured');
        setSubmitStatus({
          type: 'error',
          message: 'Contact form is not configured. Please try again later.',
        });
        setValidationState(prev => ({ ...prev, isSubmitting: false }));
        return;
      }

      const response = await fetch(formspreeEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(sanitizedData),
      });

      if (response.ok) {
        setSubmitStatus({
          type: 'success',
          message: "Thank you for your message! I'll get back to you soon.",
        });
        trackContactSubmit();
        setFormData({ name: '', email: '', message: '', honeypot: '' });
        setValidationState({
          isValid: false,
          errors: {},
          isSubmitted: false,
          isSubmitting: false,
        });
      } else {
        const result = await response.json().catch(() => ({}));
        setSubmitStatus({
          type: 'error',
          message:
            result.error ||
            result.errors?.map((e: any) => e.message).join(', ') ||
            'Something went wrong. Please try again.',
        });
      }
    } catch (error) {
      setSubmitStatus({
        type: 'error',
        message:
          'Unable to send message. Please check your connection and try again.',
      });
    } finally {
      setValidationState(prev => ({ ...prev, isSubmitting: false }));
    }
  };

  return (
    <Card variant="elevated" className={className}>
      <CardContent className="p-8 bg-white dark:bg-[rgba(30,41,59,0.4)] backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-xl">
        <motion.form
          onSubmit={handleSubmit}
          className="space-y-6"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: '-50px' }}
          variants={{
            visible: {
              transition: { staggerChildren: shouldReduce ? 0 : 0.1 },
            },
          }}
        >
          <div className="hidden" suppressHydrationWarning>
            <label htmlFor="website">
              Website (leave blank):
              <input
                type="text"
                id="website"
                name="website"
                value={formData.honeypot || ''}
                onChange={e => handleHoneypotChange(e.target.value)}
                tabIndex={-1}
                autoComplete="off"
                suppressHydrationWarning
              />
            </label>
          </div>

          <motion.div variants={fadeUpVariant}>
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
          </motion.div>

          <motion.div variants={fadeUpVariant}>
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
          </motion.div>

          <motion.div variants={fadeUpVariant}>
            <div className="space-y-2">
              <FormInput
                id="message"
                type="textarea"
                label="Message"
                value={formData.message}
                onChange={handleMessageChange}
                error={validationState.errors.message}
                placeholder="Tell me about the opportunity or project..."
                disabled={validationState.isSubmitting}
                required
                rows={5}
              />
            </div>
          </motion.div>

          {submitStatus.type && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              className={`p-4 rounded-lg success-animation overflow-hidden ${
                submitStatus.type === 'success'
                  ? 'bg-green-500/10 border border-green-500/20 text-green-700 dark:text-green-400'
                  : 'bg-red-500/10 border border-red-500/20 text-red-700 dark:text-red-400'
              }`}
              role="alert"
            >
              <div className="flex items-center gap-3">
                {submitStatus.type === 'success' && (
                  <svg
                    className="w-6 h-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      className="success-checkmark"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                )}
                {submitStatus.type === 'error' && (
                  <svg
                    className="w-6 h-6 flex-shrink-0"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                )}
                <p className="text-sm">{submitStatus.message}</p>
              </div>
            </motion.div>
          )}

          <motion.div variants={fadeUpVariant} className="flex justify-center">
            <motion.div
              animate={
                validationState.isSubmitting && !shouldReduce
                  ? {
                      scale: [1, 1.05, 1],
                      boxShadow: [
                        '0px 0px 0px 0px rgba(37,99,235,0)',
                        '0px 0px 20px 4px rgba(37,99,235,0.4)',
                        '0px 0px 0px 0px rgba(37,99,235,0)',
                      ],
                    }
                  : {}
              }
              transition={
                validationState.isSubmitting && !shouldReduce
                  ? {
                      duration: 1.5,
                      repeat: Infinity,
                      ease: 'easeInOut',
                    }
                  : {}
              }
              className="rounded-xl"
            >
              <Button
                type="submit"
                variant="primary"
                size="lg"
                className="w-auto px-12 bg-blue-600 hover:bg-blue-700 text-white font-semibold shadow-lg hover:shadow-floating rounded-xl"
                disabled={validationState.isSubmitting}
                suppressHydrationWarning
              >
                {validationState.isSubmitting ? 'Sending...' : 'Send Message'}
              </Button>
            </motion.div>
          </motion.div>

          <motion.p
            variants={fadeUpVariant}
            className="text-xs text-gray-500 text-center"
          >
            Your information is secure and will only be used to respond to your
            inquiry.
          </motion.p>
        </motion.form>
      </CardContent>
    </Card>
  );
});
