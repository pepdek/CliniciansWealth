# MCP Implementation Guide for Clinician Loan Optimizer

## 🎯 Overview

This guide explains how to set up and use the Model Context Protocol (MCP) services integrated into the Clinician Loan Optimizer. The MCP services provide:

- **Real-time web search** for salary data and interest rates
- **Professional PDF report generation** 
- **Email automation** for report delivery and follow-up sequences
- **Comprehensive fallback strategies** when services are unavailable

## 🚀 Quick Start

### 1. Basic Setup (Works Out of the Box)

The application works immediately with fallback services:

```bash
cd ~/Documents/"Clinicians Wealth"/"web app"/clinician-loan-optimizer
npm run dev
```

### 2. Test MCP Services

```bash
# Test all services
curl http://localhost:4545/api/mcp/test

# Test fallback salary data
curl -X POST http://localhost:4545/api/mcp/search/comprehensive \
  -H "Content-Type: application/json" \
  -d '{"specialty": "anesthesiology", "location": "United States"}'
```

## 🔧 Service Configuration

### Priority 1: Web Search (Brave Search API)

**Why Critical:** Real-time salary data and interest rates change frequently.

#### Setup Steps:

1. **Get Brave Search API Key:**
   - Visit: https://brave.com/search/api/
   - Sign up for free tier (2,000 queries/month)
   - Get your API key

2. **Configure Environment:**
   ```bash
   # Add to server/.env
   BRAVE_API_KEY=your-brave-search-api-key
   ```

3. **Test Web Search:**
   ```bash
   curl -X POST http://localhost:4545/api/mcp/search/salary \
     -H "Content-Type: application/json" \
     -d '{"specialty": "anesthesiology", "location": "United States", "year": "2025"}'
   ```

#### Benefits:
- Real-time salary data from MGMA, Medscape, Glassdoor
- Current refinancing rates from major lenders
- PSLF program updates and changes

### Priority 2: Email Service (SMTP)

**Why Important:** Automated report delivery and follow-up sequences.

#### Setup Steps:

1. **Gmail Setup (Recommended):**
   ```bash
   # Add to server/.env
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password  # Use App Password, not regular password
   FROM_EMAIL=reports@yourdomain.com
   ```

2. **Test Email Service:**
   ```bash
   curl -X POST http://localhost:4545/api/mcp/email/send-report \
     -H "Content-Type: application/json" \
     -d '{
       "userEmail": "test@example.com",
       "userName": "Dr. Test",
       "reportData": {
         "recommendation": "PSLF",
         "potentialSavings": "$70,000",
         "monthlyPayment": "$1,200"
       }
     }'
   ```

#### Benefits:
- Automatic report delivery via email
- Welcome email sequence for new users
- Follow-up reminders and PSLF updates

### Priority 3: PDF Generation (Already Working)

**Status:** ✅ Ready out of the box using Puppeteer + jsPDF fallback

#### Test PDF Generation:
```bash
curl -X POST http://localhost:4545/api/mcp/generate/report \
  -H "Content-Type: application/json" \
  -d '{
    "userData": {
      "firstName": "Dr. Sarah",
      "lastName": "Johnson", 
      "specialty": "anesthesiology",
      "graduationYear": 2020,
      "totalLoans": 350000
    },
    "calculations": {
      "pslf": {
        "totalPaid": 120000,
        "forgiveness": 230000,
        "monthlyPayment": 1000
      },
      "refinancing": {
        "totalPaid": 280000,
        "savings": 70000,
        "monthlyPayment": 2333,
        "newRate": 0.045
      },
      "recommendation": "PSLF"
    }
  }'
```

## 📊 Available API Endpoints

### Web Search Endpoints
- `POST /api/mcp/search/salary` - Search salary data by specialty
- `GET /api/mcp/search/refinancing-rates` - Get current refinancing rates  
- `GET /api/mcp/search/pslf-updates` - Get PSLF program updates
- `POST /api/mcp/search/comprehensive` - Combined search (salary + rates + PSLF)

### PDF Generation Endpoints
- `POST /api/mcp/generate/report` - Generate comprehensive PDF report
- `POST /api/mcp/generate/summary` - Generate quick summary PDF
- `GET /api/mcp/download/:reportId` - Download generated report

### Email Endpoints  
- `POST /api/mcp/email/send-report` - Send report via email
- `POST /api/mcp/email/welcome-sequence` - Start welcome email sequence

### Testing & Monitoring
- `GET /api/mcp/test` - Test all MCP services
- `GET /api/health` - Health check with MCP status

## 🔄 Fallback Strategies

When MCP services are unavailable, the system automatically uses fallbacks:

### Web Search Fallback
- **Method:** Hardcoded salary estimates by specialty
- **Data Source:** Industry averages from MGMA, Medscape data
- **Coverage:** 16+ medical specialties with salary ranges

### PDF Generation Fallback
- **Method:** jsPDF for basic PDF creation
- **Features:** Essential report data without advanced formatting
- **Reliability:** Works without external dependencies

### Email Fallback
- **Method:** Console logging of email content
- **Use Case:** Development and testing environments
- **Benefit:** Never blocks report generation

## 🎛️ Configuration Files

### MCP Configuration (`mcp-config.json`)
```json
{
  "mcps": {
    "web-search": {
      "enabled": true,
      "provider": "brave",
      "rateLimit": 100,
      "maxResults": 10
    },
    "pdf-generation": {
      "enabled": true,
      "templatePath": "./templates/",
      "outputPath": "./generated/"
    },
    "email": {
      "enabled": true,
      "provider": "nodemailer"
    }
  }
}
```

### Environment Variables (`.env`)
```bash
# MCP Services
BRAVE_API_KEY=your-brave-search-api-key
OPENAI_API_KEY=your-openai-api-key  # Future use

# Email Service
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
FROM_EMAIL=reports@clinicianloanoptimizer.com
```

## 🔍 Monitoring and Debugging

### Check Service Status
```bash
curl http://localhost:4545/api/mcp/test
```

### View Logs
```bash
# Server logs show MCP initialization
npm run dev:server

# Look for:
# ✅ Email service initialized successfully
# ✅ Web search service connected
# 🔄 Using fallback for [service]
```

### Common Issues

1. **Web Search Not Working**
   - Verify BRAVE_API_KEY is set
   - Check API key permissions
   - Ensure internet connectivity

2. **Email Service Failed**
   - Use App Password for Gmail (not regular password)
   - Check SMTP settings
   - Verify firewall allows SMTP traffic

3. **PDF Generation Failed**
   - Check disk space in `./generated/` folder
   - Ensure write permissions
   - Verify Puppeteer installation

## 📈 Performance Optimization

### Rate Limiting
- Brave Search: 100 requests/day (free tier)
- Email: No built-in limits (depend on SMTP provider)
- PDF: Local generation (no external limits)

### Caching Strategy
- Salary data: Cache for 24 hours
- Refinancing rates: Cache for 1 hour
- PSLF updates: Cache for 1 week

### Cost Management
- Free tier Brave Search: $0/month (2,000 queries)
- Gmail SMTP: Free with personal account
- PDF generation: No external costs

## 🚀 Next Steps

1. **Set up Brave Search API** for real-time data
2. **Configure email service** for automated delivery
3. **Test all endpoints** with your data
4. **Monitor usage** and upgrade API tiers as needed
5. **Customize email templates** for your brand

## 🆘 Support

If you encounter issues:

1. Check the server logs for error messages
2. Test individual services using the provided curl commands
3. Verify environment variables are correctly set
4. Use fallback services while troubleshooting

The system is designed to be resilient - it will always work with fallback services even if some MCP integrations fail.