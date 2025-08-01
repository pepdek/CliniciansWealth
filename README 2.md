# Clinician Loan Optimizer

A full-stack web application that analyzes medical school loans and provides specialty-specific repayment strategies for physicians and clinicians.

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
- Backend (Express.js): http://localhost:5000

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
- `npm run dev:server` - Start Express server with nodemon (port 5000)
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

- `GET /api/health` - Health check
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `POST /api/calculations/analyze` - Loan analysis
- `GET /api/calculations/report` - Generate PDF report

## 🚧 Development Status

- ✅ Project structure and basic setup
- ✅ React frontend with Tailwind CSS
- ✅ Express.js backend with health check
- ✅ Shared utilities and type definitions
- 🔄 Database schema design
- 🔄 Multi-step form implementation
- 🔄 Calculation engine
- 🔄 User authentication
- 🔄 Payment processing
- 🔄 PDF report generation

## 📝 Next Steps

1. Set up PostgreSQL database and Prisma schema
2. Implement user authentication system
3. Build multi-step loan data collection form
4. Create PSLF vs refinancing calculation engine
5. Add specialty-specific salary database
6. Implement PDF report generation
7. Add Stripe payment processing