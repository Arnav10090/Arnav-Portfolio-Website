/**
 * Email template module for Resend email integration
 * Generates HTML email content from contact form data
 * Requirements: 1.2, 7.2, 7.3, 7.4, 7.5
 */

import { ContactFormData } from './validation';

/**
 * Escapes HTML special characters to prevent XSS attacks in email content
 *
 * This function is critical for security as it prevents malicious users from
 * injecting HTML/JavaScript into emails. All user-provided content must be
 * escaped before being included in the email HTML.
 *
 * Converts the following characters to their HTML entity equivalents:
 * - & → &amp;   (must be first to avoid double-escaping)
 * - < → &lt;    (prevents opening HTML tags)
 * - > → &gt;    (prevents closing HTML tags)
 * - " → &quot;  (prevents breaking out of attributes)
 * - ' → &#39;   (prevents breaking out of attributes)
 *
 * @param text - The text to escape
 * @returns HTML-safe escaped text
 *
 * @example
 * escapeHtml('<script>alert("xss")</script>')
 * // Returns: '&lt;script&gt;alert(&quot;xss&quot;)&lt;/script&gt;'
 */
function escapeHtml(text: string): string {
  const htmlEscapeMap: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#39;',
  };

  return text.replace(/[&<>"']/g, char => htmlEscapeMap[char]);
}

/**
 * Generates HTML email content from contact form data
 *
 * This function creates a professional, well-formatted HTML email that includes
 * all the visitor's information in a clear, readable format. The email is designed
 * to be compatible with all major email clients.
 *
 * Security: All user input is escaped using escapeHtml() to prevent XSS attacks.
 * This is critical because email clients may render HTML, and malicious users
 * could attempt to inject scripts or malicious HTML.
 *
 * Requirement 1.2: Email includes visitor's name, email address, and message content
 * Requirement 7.2: Email includes visitor's name as a distinct field
 * Requirement 7.3: Email includes visitor's email address as a distinct field
 * Requirement 7.4: Email includes full message content
 * Requirement 7.5: Use HTML formatting to improve readability
 *
 * @param data - The contact form data containing name, email, and message
 * @returns HTML-formatted email content with escaped user input
 *
 * @example
 * const email = generateEmailHTML({
 *   name: 'John Doe',
 *   email: 'john@example.com',
 *   message: 'Hello, I would like to connect.'
 * });
 */
export function generateEmailHTML(data: ContactFormData): string {
  // Escape all user input to prevent XSS attacks
  // This must be done before inserting into HTML template
  const safeName = escapeHtml(data.name);
  const safeEmail = escapeHtml(data.email);
  const safeMessage = escapeHtml(data.message);

  return `
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>New Contact Form Submission</title>
    <style>
      body {
        font-family: Arial, sans-serif;
        line-height: 1.6;
        color: #333;
        margin: 0;
        padding: 0;
        background-color: #f9f9f9;
      }
      .container {
        max-width: 600px;
        margin: 20px auto;
        background-color: #ffffff;
        border-radius: 8px;
        box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        overflow: hidden;
      }
      .header {
        background-color: #4a5568;
        color: #ffffff;
        padding: 24px;
        text-align: center;
      }
      .header h1 {
        margin: 0;
        font-size: 24px;
        font-weight: 600;
      }
      .content {
        padding: 32px 24px;
      }
      .field {
        margin-bottom: 24px;
      }
      .label {
        font-weight: 600;
        color: #4a5568;
        font-size: 14px;
        text-transform: uppercase;
        letter-spacing: 0.5px;
        margin-bottom: 8px;
        display: block;
      }
      .value {
        color: #1a202c;
        font-size: 16px;
        padding: 12px;
        background-color: #f7fafc;
        border-left: 3px solid #4a5568;
        border-radius: 4px;
        word-wrap: break-word;
      }
      .message-value {
        white-space: pre-wrap;
        min-height: 60px;
      }
      .footer {
        background-color: #f7fafc;
        padding: 16px 24px;
        text-align: center;
        font-size: 12px;
        color: #718096;
        border-top: 1px solid #e2e8f0;
      }
    </style>
  </head>
  <body>
    <div class="container">
      <div class="header">
        <h1>New Contact Form Submission</h1>
      </div>
      <div class="content">
        <div class="field">
          <span class="label">From</span>
          <div class="value">${safeName}</div>
        </div>
        <div class="field">
          <span class="label">Email Address</span>
          <div class="value">${safeEmail}</div>
        </div>
        <div class="field">
          <span class="label">Message</span>
          <div class="value message-value">${safeMessage}</div>
        </div>
      </div>
      <div class="footer">
        This message was sent from your portfolio contact form
      </div>
    </div>
  </body>
</html>
  `.trim();
}
