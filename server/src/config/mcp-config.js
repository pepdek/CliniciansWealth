import dotenv from 'dotenv';

dotenv.config();

export const mcpConfig = {
  webSearch: {
    enabled: true,
    provider: 'brave',
    apiKey: process.env.BRAVE_API_KEY,
    rateLimit: 100,
    maxResults: 10
  },
  pdfGeneration: {
    enabled: true,
    templatePath: './templates/',
    outputPath: './generated/',
    format: 'A4',
    orientation: 'portrait'
  },
  email: {
    enabled: true,
    provider: 'nodemailer',
    smtp: {
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: process.env.SMTP_PORT || 587,
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
      }
    },
    from: process.env.FROM_EMAIL || 'reports@clinicianloanoptimizer.com'
  },
  database: {
    enabled: true,
    type: 'postgresql',
    url: process.env.DATABASE_URL
  },
  openai: {
    apiKey: process.env.OPENAI_API_KEY,
    model: 'gpt-4-turbo-preview'
  }
};

export default mcpConfig;