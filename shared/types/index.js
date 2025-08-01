import { z } from 'zod';

export const LoanSchema = z.object({
  id: z.string().optional(),
  balance: z.number().positive(),
  interestRate: z.number().min(0).max(100),
  type: z.enum(['federal', 'private']),
  servicer: z.string().optional(),
});

export const SpecialtySchema = z.object({
  name: z.string(),
  averageSalary: z.number().positive(),
  category: z.enum(['primary-care', 'specialty', 'surgical']),
});

export const UserProfileSchema = z.object({
  id: z.string().optional(),
  email: z.string().email(),
  firstName: z.string().min(1),
  lastName: z.string().min(1),
  specialty: z.string(),
  graduationYear: z.number().int().min(2000).max(2030),
  loans: z.array(LoanSchema),
});

export const CalculationResultSchema = z.object({
  pslf: z.object({
    totalPaid: z.number(),
    forgiveness: z.number(),
    monthlyPayment: z.number(),
  }),
  refinancing: z.object({
    totalPaid: z.number(),
    savings: z.number(),
    monthlyPayment: z.number(),
    newRate: z.number(),
  }),
  recommendation: z.enum(['pslf', 'refinancing', 'hybrid']),
});

export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    REFRESH: '/api/auth/refresh',
    LOGOUT: '/api/auth/logout',
  },
  CALCULATIONS: {
    ANALYZE: '/api/calculations/analyze',
    REPORT: '/api/calculations/report',
  },
  USER: {
    PROFILE: '/api/user/profile',
    UPDATE: '/api/user/update',
  },
  PAYMENT: {
    CREATE_INTENT: '/api/payment/create-intent',
    WEBHOOK: '/api/payment/webhook',
  },
};