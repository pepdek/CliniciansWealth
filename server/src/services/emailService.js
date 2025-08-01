import nodemailer from 'nodemailer';
import fs from 'fs/promises';
import path from 'path';
import { mcpConfig } from '../config/mcp-config.js';

class EmailService {
  constructor() {
    this.transporter = null;
    this.initializeTransporter();
  }

  async initializeTransporter() {
    if (!mcpConfig.email.enabled) {
      console.log('📧 Email service disabled in configuration');
      return;
    }

    // Check if email credentials are properly configured
    const smtpConfig = mcpConfig.email.smtp;
    if (!smtpConfig.auth.user || !smtpConfig.auth.pass) {
      console.log('📧 Email service not configured - missing SMTP credentials');
      console.log('💡 To enable email: Set SMTP_USER and SMTP_PASS in your .env file');
      this.transporter = null;
      return;
    }

    try {
      this.transporter = nodemailer.createTransport(smtpConfig);
      
      // Only verify if credentials are present
      await this.transporter.verify();
      console.log('✅ Email service initialized successfully');
    } catch (error) {
      console.log('⚠️ Email service connection failed:', error.message);
      console.log('📧 Email will use fallback logging - check SMTP settings');
      this.transporter = null;
    }
  }

  async sendReportEmail(userEmail, userName, reportData) {
    if (!this.transporter) {
      // Use fallback email logging
      console.log('📧 Email service not configured - using fallback logging');
      return this.sendFallbackEmail(userEmail, userName, reportData);
    }

    const emailContent = await this.generateReportEmailContent(userName, reportData);
    
    const mailOptions = {
      from: mcpConfig.email.from,
      to: userEmail,
      subject: 'Your Personalized Loan Optimization Report is Ready',
      html: emailContent.html,
      text: emailContent.text,
      attachments: reportData.pdfPath ? [{
        filename: 'loan-optimization-report.pdf',
        path: reportData.pdfPath
      }] : []
    };

    try {
      const result = await this.transporter.sendMail(mailOptions);
      return {
        success: true,
        messageId: result.messageId,
        response: result.response
      };
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async sendWelcomeSequence(userEmail, userName, userData) {
    const sequences = this.getEmailSequences();
    
    for (const email of sequences.welcome) {
      setTimeout(async () => {
        await this.sendSequenceEmail(userEmail, userName, email, userData);
      }, email.delay * 24 * 60 * 60 * 1000); // Convert days to milliseconds
    }
  }

  async sendSequenceEmail(userEmail, userName, emailConfig, userData) {
    if (!this.transporter) return;

    const template = await this.loadEmailTemplate(emailConfig.template);
    const content = this.replaceTemplateVariables(template, {
      userName,
      ...userData
    });

    const mailOptions = {
      from: mcpConfig.email.from,
      to: userEmail,
      subject: emailConfig.subject,
      html: content.html,
      text: content.text
    };

    try {
      await this.transporter.sendMail(mailOptions);
      console.log(`Sequence email sent: ${emailConfig.template} to ${userEmail}`);
    } catch (error) {
      console.error(`Failed to send sequence email: ${emailConfig.template}`, error);
    }
  }

  async generateReportEmailContent(userName, reportData) {
    const html = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; }
        .container { max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #2563eb; color: white; padding: 20px; text-align: center; }
        .content { padding: 20px; background: #f8fafc; }
        .highlight { background: #ecfdf5; border-left: 4px solid #10b981; padding: 15px; margin: 20px 0; }
        .cta { text-align: center; margin: 30px 0; }
        .button { background: #2563eb; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; display: inline-block; }
        .footer { text-align: center; color: #666; font-size: 12px; margin-top: 30px; }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Your Loan Optimization Report</h1>
        </div>
        
        <div class="content">
            <h2>Hello ${userName}!</h2>
            
            <p>Great news! Your personalized loan optimization analysis is complete. Based on your specialty and financial profile, we've analyzed the best repayment strategy for your situation.</p>
            
            <div class="highlight">
                <h3>Key Findings:</h3>
                <ul>
                    <li><strong>Recommended Strategy:</strong> ${reportData.recommendation}</li>
                    <li><strong>Potential Savings:</strong> ${reportData.potentialSavings || 'See detailed report'}</li>
                    <li><strong>Optimal Monthly Payment:</strong> ${reportData.monthlyPayment || 'See detailed report'}</li>
                </ul>
            </div>
            
            <p>Your comprehensive report includes:</p>
            <ul>
                <li>Detailed PSLF vs. Refinancing comparison</li>
                <li>Specialty-specific salary projections</li>
                <li>Step-by-step implementation guide</li>
                <li>Common pitfalls to avoid</li>
            </ul>
            
            <div class="cta">
                <a href="#" class="button">View Full Report</a>
            </div>
            
            <p>Questions? Reply to this email or schedule a consultation with our team.</p>
            
            <p>Best regards,<br>The Clinician Loan Optimizer Team</p>
        </div>
        
        <div class="footer">
            <p>This email was sent to ${reportData.userEmail}</p>
            <p>© 2025 Clinician Loan Optimizer. All rights reserved.</p>
        </div>
    </div>
</body>
</html>`;

    const text = `
Hello ${userName}!

Your personalized loan optimization analysis is complete. 

Key Findings:
- Recommended Strategy: ${reportData.recommendation}
- Potential Savings: ${reportData.potentialSavings || 'See detailed report'}
- Optimal Monthly Payment: ${reportData.monthlyPayment || 'See detailed report'}

Your comprehensive report includes detailed PSLF vs. Refinancing comparison, specialty-specific salary projections, step-by-step implementation guide, and common pitfalls to avoid.

Questions? Reply to this email or schedule a consultation with our team.

Best regards,
The Clinician Loan Optimizer Team
`;

    return { html, text };
  }

  getEmailSequences() {
    return {
      welcome: [
        {
          delay: 0,
          subject: "Your Loan Optimization Report is Ready",
          template: "welcome_report"
        },
        {
          delay: 3,
          subject: "Next Steps: Implementing Your Loan Strategy",
          template: "implementation_guide"
        },
        {
          delay: 7,
          subject: "Common Loan Optimization Mistakes to Avoid",
          template: "mistakes_guide"
        },
        {
          delay: 14,
          subject: "PSLF Updates and What They Mean for You",
          template: "pslf_updates"
        },
        {
          delay: 30,
          subject: "How's Your Loan Strategy Going?",
          template: "follow_up"
        }
      ],
      onboarding: [
        {
          delay: 0,
          subject: "Welcome to Clinician Loan Optimizer",
          template: "welcome"
        },
        {
          delay: 1,
          subject: "Getting Started: Complete Your Profile",
          template: "complete_profile"
        }
      ]
    };
  }

  async loadEmailTemplate(templateName) {
    try {
      const templatePath = path.join('./templates/email', `${templateName}.html`);
      const content = await fs.readFile(templatePath, 'utf-8');
      return { html: content, text: this.htmlToText(content) };
    } catch (error) {
      return this.getDefaultTemplate(templateName);
    }
  }

  getDefaultTemplate(templateName) {
    const templates = {
      welcome_report: {
        html: `
          <h2>Welcome to Clinician Loan Optimizer!</h2>
          <p>Hello {{userName}},</p>
          <p>Your loan optimization report is attached. This comprehensive analysis will help you make informed decisions about your student loan repayment strategy.</p>
          <p>Key highlights from your report:</p>
          <ul>
            <li>Personalized PSLF analysis</li>
            <li>Refinancing comparison</li>
            <li>Specialty-specific recommendations</li>
          </ul>
          <p>Questions? Reply to this email!</p>
        `,
        text: `Welcome to Clinician Loan Optimizer! Hello {{userName}}, your loan optimization report is attached...`
      },
      implementation_guide: {
        html: `
          <h2>Next Steps: Implementing Your Loan Strategy</h2>
          <p>Hi {{userName}},</p>
          <p>Now that you have your personalized loan strategy, here's how to implement it:</p>
          <ol>
            <li>Review your current loan servicer</li>
            <li>Understand your payment options</li>
            <li>Set up automatic payments</li>
            <li>Track your progress</li>
          </ol>
        `,
        text: `Next Steps: Implementing Your Loan Strategy. Hi {{userName}}, now that you have your personalized loan strategy...`
      },
      mistakes_guide: {
        html: `
          <h2>Common Loan Optimization Mistakes to Avoid</h2>
          <p>Hi {{userName}},</p>
          <p>Many physicians make these costly mistakes with their student loans:</p>
          <ul>
            <li>Not understanding PSLF requirements</li>
            <li>Refinancing federal loans without considering forgiveness</li>
            <li>Choosing the wrong repayment plan</li>
            <li>Not tracking qualifying payments</li>
          </ul>
        `,
        text: `Common Loan Optimization Mistakes to Avoid. Hi {{userName}}, many physicians make these costly mistakes...`
      }
    };

    return templates[templateName] || templates.welcome_report;
  }

  replaceTemplateVariables(template, variables) {
    let html = template.html;
    let text = template.text;

    for (const [key, value] of Object.entries(variables)) {
      const regex = new RegExp(`{{${key}}}`, 'g');
      html = html.replace(regex, value || '');
      text = text.replace(regex, value || '');
    }

    return { html, text };
  }

  htmlToText(html) {
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  async sendFallbackEmail(userEmail, userName, reportData) {
    console.log('📧 FALLBACK EMAIL CONTENT:');
    console.log('================================');
    console.log(`To: ${userEmail}`);
    console.log(`Subject: Your Loan Optimization Report is Ready`);
    console.log(`
Hello ${userName},

Your personalized loan optimization report has been generated!

Key Findings:
- Recommended Strategy: ${reportData.recommendation || 'See full report'}
- Potential Savings: ${reportData.potentialSavings || 'See full report'}
- Monthly Payment: ${reportData.monthlyPayment || 'See full report'}

Your report includes detailed analysis of PSLF vs refinancing strategies.

To receive reports via email, please configure SMTP settings in your environment variables.

Best regards,
Clinician Loan Optimizer Team
    `);
    console.log('================================');
    
    return {
      success: true,
      method: 'console-log-fallback',
      messageId: `fallback_${Date.now()}`
    };
  }

  async testConnection() {
    if (!this.transporter) {
      return { success: false, error: 'Email service not configured - will use fallback logging' };
    }

    try {
      await this.transporter.verify();
      return { success: true, message: 'Email service connected successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new EmailService();