import Stripe from 'stripe';

class StripeService {
  constructor() {
    this.stripe = null;
    this.enabled = false;
    this.initialize();
  }

  initialize() {
    if (process.env.STRIPE_SECRET_KEY) {
      this.stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      this.enabled = true;
      console.log('✅ Stripe service initialized');
    } else {
      console.log('⚠️ Stripe service disabled (no STRIPE_SECRET_KEY)');
    }
  }

  async createPaymentIntent(amount, customerData, metadata = {}) {
    if (!this.enabled) {
      throw new Error('Stripe service not configured');
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.create({
        amount: Math.round(amount * 100), // Convert to cents
        currency: 'usd',
        metadata: {
          customer_email: customerData.email,
          customer_name: customerData.name,
          customer_specialty: customerData.specialty,
          loan_amount: customerData.loanAmount,
          recommended_strategy: customerData.recommendedStrategy,
          potential_savings: customerData.potentialSavings,
          ...metadata
        },
        receipt_email: customerData.email,
        description: 'Clinician Loan Optimization Report'
      });

      return {
        success: true,
        paymentIntent: {
          id: paymentIntent.id,
          client_secret: paymentIntent.client_secret,
          amount: paymentIntent.amount,
          status: paymentIntent.status
        }
      };
    } catch (error) {
      console.error('Stripe payment intent creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async confirmPayment(paymentIntentId) {
    if (!this.enabled) {
      throw new Error('Stripe service not configured');  
    }

    try {
      const paymentIntent = await this.stripe.paymentIntents.retrieve(paymentIntentId);
      
      return {
        success: true,
        payment: {
          id: paymentIntent.id,
          status: paymentIntent.status,
          amount: paymentIntent.amount,
          metadata: paymentIntent.metadata,
          receipt_email: paymentIntent.receipt_email
        }
      };
    } catch (error) {
      console.error('Stripe payment confirmation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async handleWebhook(rawBody, signature) {
    if (!this.enabled) {
      throw new Error('Stripe service not configured');
    }

    try {
      const event = this.stripe.webhooks.constructEvent(
        rawBody,
        signature,
        process.env.STRIPE_WEBHOOK_SECRET
      );

      switch (event.type) {
        case 'payment_intent.succeeded':
          await this.handlePaymentSuccess(event.data.object);
          break;
        
        case 'payment_intent.payment_failed':
          await this.handlePaymentFailure(event.data.object);
          break;
        
        default:
          console.log(`Unhandled webhook event type: ${event.type}`);
      }

      return { success: true, processed: true };
    } catch (error) {
      console.error('Webhook processing failed:', error);
      return { success: false, error: error.message };
    }
  }

  async handlePaymentSuccess(paymentIntent) {
    console.log('🎉 Payment successful:', paymentIntent.id);
    
    // Here you would typically:
    // 1. Generate and send the PDF report
    // 2. Send confirmation email
    // 3. Update your database
    // 4. Start email sequence
    
    const customerData = {
      email: paymentIntent.receipt_email,
      name: paymentIntent.metadata.customer_name,
      specialty: paymentIntent.metadata.customer_specialty,
      loanAmount: paymentIntent.metadata.loan_amount,
      recommendedStrategy: paymentIntent.metadata.recommended_strategy,
      potentialSavings: paymentIntent.metadata.potential_savings
    };

    // Trigger report generation and email sending
    return {
      success: true,
      customerData,
      paymentId: paymentIntent.id
    };
  }

  async handlePaymentFailure(paymentIntent) {
    console.log('❌ Payment failed:', paymentIntent.id);
    
    // Handle failed payment
    // Could send recovery email, log analytics, etc.
    
    return {
      success: false,
      paymentId: paymentIntent.id,
      error: paymentIntent.last_payment_error?.message
    };
  }

  async createCustomer(customerData) {
    if (!this.enabled) {
      throw new Error('Stripe service not configured');
    }

    try {
      const customer = await this.stripe.customers.create({
        email: customerData.email,
        name: customerData.name,
        phone: customerData.phone,
        metadata: {
          specialty: customerData.specialty,
          career_stage: customerData.careerStage,
          state: customerData.state
        }
      });

      return {
        success: true,
        customer: {
          id: customer.id,
          email: customer.email,
          name: customer.name
        }
      };
    } catch (error) {
      console.error('Customer creation failed:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }

  async getPricing() {
    return {
      basic: {
        price: 47,
        currency: 'usd',
        name: 'Complete Loan Optimization Strategy',
        features: [
          '25+ page detailed report',
          'Month-by-month payment schedule',
          'Step-by-step implementation guide', 
          'Specialty salary projections',
          'Tax implications breakdown',
          'Follow-up email sequence',
          '100% money-back guarantee'
        ]
      }
    };
  }

  formatCurrency(amount) {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  }

  async testConnection() {
    if (!this.enabled) {
      return {
        success: false,
        error: 'Stripe API key not configured'
      };
    }

    try {
      // Test with a simple API call
      await this.stripe.paymentMethods.list({ limit: 1 });
      
      return {
        success: true,
        message: 'Stripe service connected successfully',
        testMode: process.env.STRIPE_SECRET_KEY?.includes('test') || false
      };
    } catch (error) {
      return {
        success: false,
        error: error.message
      };
    }
  }
}

export default new StripeService();