import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import mcpRoutes from './routes/mcpRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 4545;

app.use(helmet());
app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:3000',
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Routes
app.use('/api/mcp', mcpRoutes);

app.get('/', (req, res) => {
  res.json({ 
    message: 'Clinician Loan Optimizer API - Hello World!',
    status: 'Server is running successfully',
    timestamp: new Date().toISOString()
  });
});

app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy',
    service: 'clinician-loan-optimizer-api',
    timestamp: new Date().toISOString(),
    features: {
      mcpServices: '✅ Integrated',
      webSearch: '🔧 Configure BRAVE_API_KEY',
      pdfGeneration: '✅ Ready',
      emailService: '🔧 Configure SMTP',
      fallbackServices: '✅ Ready'
    }
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
  console.log(`📊 Health check available at http://localhost:${PORT}/api/health`);
});