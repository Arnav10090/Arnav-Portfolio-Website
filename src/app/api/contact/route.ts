import { NextRequest, NextResponse } from 'next/server';
import { Resend } from 'resend';
import { validateContactForm, sanitizeContactFormData } from '@/lib/validations';
import { validateEnvironmentVariables } from '@/lib/security';
import type { ContactFormData, ContactFormResponse } from '@/lib/types';

// Initialize Resend with API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Rate limiting configuration
const RATE_LIMIT_MAX = 3; // Maximum submissions per hour
const RATE_LIMIT_WINDOW = 60 * 60 * 1000; // 1 hour in milliseconds

/**
 * Get client IP address for rate limiting
 */
function getClientIP(request: NextRequest): string {
  const forwarded = request.headers.get('x-forwarded-for');
  const realIP = request.headers.get('x-real-ip');
  
  if (forwarded) {
    return forwarded.split(',')[0].trim();
  }
  
  if (realIP) {
    return realIP;
  }
  
  // Fallback for development
  return 'unknown';
}

/**
 * Check rate limiting for IP address
 */
function checkRateLimit(ip: string): { allowed: boolean; resetTime?: number } {
  const now = Date.now();
  const record = rateLimitMap.get(ip);
  
  if (!record || now > record.resetTime) {
    // First request or window expired
    rateLimitMap.set(ip, { count: 1, resetTime: now + RATE_LIMIT_WINDOW });
    return { allowed: true };
  }
  
  if (record.count >= RATE_LIMIT_MAX) {
    // Rate limit exceeded
    return { allowed: false, resetTime: record.resetTime };
  }
  
  // Increment count
  record.count += 1;
  rateLimitMap.set(ip, record);
  return { allowed: true };
}

/**
 * Clean up expired rate limit records
 */
function cleanupRateLimitMap(): void {
  const now = Date.now();
  for (const [ip, record] of rateLimitMap.entries()) {
    if (now > record.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

/**
 * Send email notification using Resend
 */
async function sendEmailNotification(data: ContactFormData): Promise<void> {
  const fromEmail = process.env.FROM_EMAIL || 'noreply@example.com';
  const toEmail = process.env.TO_EMAIL || 'arnav.tiwari@example.com';
  
  // Email content for the recipient (portfolio owner)
  const emailContent = `
    <h2>New Contact Form Submission</h2>
    <p><strong>From:</strong> ${data.name}</p>
    <p><strong>Email:</strong> ${data.email}</p>
    <p><strong>Message:</strong></p>
    <div style="background-color: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
      ${data.message.replace(/\n/g, '<br>')}
    </div>
    <hr>
    <p style="color: #666; font-size: 12px;">
      This message was sent from your portfolio website contact form.
      Reply directly to this email to respond to ${data.name}.
    </p>
  `;
  
  // Send email using Resend
  await resend.emails.send({
    from: fromEmail,
    to: toEmail,
    replyTo: data.email, // Allow direct reply to the sender
    subject: `Portfolio Contact: Message from ${data.name}`,
    html: emailContent,
    text: `
New Contact Form Submission

From: ${data.name}
Email: ${data.email}

Message:
${data.message}

---
This message was sent from your portfolio website contact form.
Reply directly to this email to respond to ${data.name}.
    `.trim()
  });
}

/**
 * POST handler for contact form submissions
 */
export async function POST(request: NextRequest): Promise<NextResponse<ContactFormResponse>> {
  try {
    // Clean up expired rate limit records periodically
    if (Math.random() < 0.1) { // 10% chance to clean up
      cleanupRateLimitMap();
    }
    
    // Check rate limiting
    const clientIP = getClientIP(request);
    const rateLimitCheck = checkRateLimit(clientIP);
    
    if (!rateLimitCheck.allowed) {
      const resetTime = rateLimitCheck.resetTime || Date.now();
      const resetDate = new Date(resetTime);
      
      return NextResponse.json(
        {
          success: false,
          message: 'Too many submissions. Please try again later.',
          error: `Rate limit exceeded. Try again after ${resetDate.toLocaleTimeString()}`
        },
        { 
          status: 429,
          headers: {
            'Retry-After': Math.ceil((resetTime - Date.now()) / 1000).toString()
          }
        }
      );
    }
    
    // Parse request body
    let body: ContactFormData;
    try {
      body = await request.json();
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          message: 'Invalid request format',
          error: 'Request body must be valid JSON'
        },
        { status: 400 }
      );
    }
    
    // Sanitize input data
    const sanitizedData = sanitizeContactFormData(body);
    
    // Validate form data
    const validation = validateContactForm(sanitizedData);
    
    if (!validation.isValid) {
      const errorMessages = Object.values(validation.errors).filter(Boolean);
      return NextResponse.json(
        {
          success: false,
          message: 'Validation failed',
          error: errorMessages.join(', ')
        },
        { status: 400 }
      );
    }
    
    // Check for bot submissions (honeypot field)
    if (sanitizedData.honeypot && sanitizedData.honeypot.trim().length > 0) {
      // Log potential bot attempt but don't reveal it
      console.warn('Potential bot submission detected:', {
        ip: clientIP,
        honeypot: sanitizedData.honeypot,
        timestamp: new Date().toISOString()
      });
      
      // Return success to avoid revealing the honeypot
      return NextResponse.json({
        success: true,
        message: 'Thank you for your message! I\'ll get back to you soon.'
      });
    }
    
    // Check if required environment variables are set
    const envValidation = validateEnvironmentVariables();
    if (!envValidation.isValid) {
      console.error('Missing required environment variables:', envValidation.missing);
      return NextResponse.json(
        {
          success: false,
          message: 'Email service is not configured',
          error: 'Server configuration error'
        },
        { status: 500 }
      );
    }
    
    // Send email notification
    try {
      await sendEmailNotification(sanitizedData);
    } catch (emailError) {
      console.error('Failed to send email:', emailError);
      
      // Return user-friendly error message
      return NextResponse.json(
        {
          success: false,
          message: 'Failed to send message. Please try again or contact me directly.',
          error: 'Email delivery failed'
        },
        { status: 500 }
      );
    }
    
    // Success response
    return NextResponse.json({
      success: true,
      message: 'Thank you for your message! I\'ll get back to you soon.'
    });
    
  } catch (error) {
    console.error('Contact form error:', error);
    
    return NextResponse.json(
      {
        success: false,
        message: 'An unexpected error occurred. Please try again.',
        error: 'Internal server error'
      },
      { status: 500 }
    );
  }
}

/**
 * Handle unsupported HTTP methods
 */
export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  );
}