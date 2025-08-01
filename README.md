# Clinician Loan Optimizer

A full-stack web application that analyzes medical school loans and provides specialty-specific repayment strategies for physicians and clinicians.

## ✨ New: MCP Services Integration

**Model Context Protocol (MCP) services now integrated for enhanced functionality:**

- 🔍 **Real-time Web Search** - Live salary data and refinancing rates via Brave Search API
- 📄 **Professional PDF Reports** - Automated report generation with charts and analysis  
- 📧 **Email Automation** - Report delivery and follow-up sequences
- 🔧 **Smart Fallbacks** - Works perfectly even without API keys

**Ready to use with fallback services, enhanced with API keys. See [MCP Setup Guide](MCP_SETUP_GUIDE.md) for configuration.**

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- PostgreSQL (for production)

### Installation

1. **Clone and navigate to the project:**
   ```bash
   cd ~/Documents/"Clinicians Wealth"/"web app"/clinician-loan-optimizer
   ```

2. **Install all dependencies:**
   ```bash
   npm run install:all
   ```

3. **Set up environment variables:**
   ```bash
   cp server/.env.example server/.env
   # Edit server/.env with your configuration
   ```

4. **Start development servers:**
   ```bash
   npm run dev
   ```

This will start:
- Frontend (React + Vite): http://localhost:3000
- Backend (Express.js): http://localhost:4545

## 🏗️ Project Structure

```
clinician-loan-optimizer/
├── client/                 # React frontend (Vite + Tailwind)
│   ├── src/
│   │   ├── components/     # Reusable UI components  
│   │   ├── pages/         # Route components
│   │   ├── hooks/         # Custom React hooks
│   │   ├── utils/         # Frontend utilities
│   │   └── services/      # API service functions
│   └── public/            # Static assets
├── server/                # Node.js backend (Express)
│   ├── src/
│   │   ├── controllers/   # Route handlers
│   │   ├── middleware/    # Express middleware
│   │   ├── models/        # Data models
│   │   ├── routes/        # API routes
│   │   └── utils/         # Backend utilities
│   └── prisma/            # Database schema & migrations
└── shared/                # Shared utilities & types
    ├── types/             # TypeScript/Zod schemas
    └── utils/             # Common utilities
```

## 🛠️ Available Scripts

### Root Level
- `npm run dev` - Start both client and server in development mode
- `npm run build` - Build both client and server for production
- `npm run install:all` - Install dependencies for all workspaces

### Client (Frontend)
- `npm run dev:client` - Start React dev server (port 3000)
- `npm run build:client` - Build React app for production

### Server (Backend)  
- `npm run dev:server` - Start Express server with nodemon (port 4545)
- `npm run start` - Start Express server in production mode
- `npm run db:generate` - Generate Prisma client
- `npm run db:push` - Push schema changes to database
- `npm run db:migrate` - Run database migrations

## 🎯 Core Features (Planned)

1. **Multi-step Form** - Collect loan and career data
2. **Calculation Engine** - PSLF vs refinancing analysis  
3. **Specialty Database** - Salary projections by medical specialty
4. **PDF Reports** - Professional analysis reports
5. **User Management** - Authentication and payment processing

## 🔧 Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS
- **Backend:** Node.js, Express.js
- **Database:** PostgreSQL with Prisma ORM
- **Authentication:** JWT-based auth
- **Payments:** Stripe integration
- **PDF Generation:** jsPDF/Puppeteer

## 🌐 API Endpoints

### Core Endpoints
- `GET /api/health` - Health check with MCP services status
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/calculations/analyze` - Loan analysis

### MCP Service Endpoints
- `GET /api/mcp/test` - Test all MCP services
- `POST /api/mcp/search/salary` - Search salary data by specialty
- `GET /api/mcp/search/refinancing-rates` - Current refinancing rates
- `POST /api/mcp/search/comprehensive` - Combined search (salary + rates + PSLF)
- `POST /api/mcp/generate/report` - Generate PDF report
- `POST /api/mcp/email/send-report` - Email report delivery

## 🚧 Development Status

- ✅ Project structure and basic setup
- ✅ React frontend with Tailwind CSS
- ✅ Express.js backend with health check
- ✅ Shared utilities and type definitions
- ✅ **MCP Services Integration** - Web search, PDF generation, email automation
- ✅ **Professional PDF Reports** - Puppeteer + jsPDF with fallbacks
- ✅ **Email Automation System** - Report delivery and sequences
- ✅ **Smart Fallback Services** - Works without API keys
- 🔄 Database schema design
- 🔄 Multi-step form implementation
- 🔄 Calculation engine
- 🔄 User authentication
- 🔄 Payment processing

## 📝 Next Steps

1. **Configure MCP Services** - Add API keys for enhanced functionality ([Setup Guide](MCP_SETUP_GUIDE.md))
2. Set up PostgreSQL database and Prisma schema
3. Implement user authentication system
4. Build multi-step loan data collection form
5. Create PSLF vs refinancing calculation engine
6. Connect MCP services to calculation engine
7. Add Stripe payment processing

## 🔧 MCP Services Quick Setup

1. **Basic Setup (Works Now):**
   ```bash
   npm run dev  # Uses fallback services
   ```

2. **Enhanced Setup (Recommended):**
   ```bash
   # Get Brave Search API key (free tier: 2,000 queries/month)
   # Add to server/.env: BRAVE_API_KEY=your-key
   
   # Configure email (optional)
   # Add SMTP settings to server/.env
   ```

3. **Test Services:**
   ```bash
   curl http://localhost:4545/api/mcp/test
   ```

**See [MCP_SETUP_GUIDE.md](MCP_SETUP_GUIDE.md) for detailed configuration instructions.**# CliniciansWealth
