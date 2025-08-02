import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Calculator, TrendingUp, Users, Shield, CheckCircle, Star, ArrowRight, FileText, Award, Clock, DollarSign, Download, Twitter, Monitor, Menu, X } from 'lucide-react'
import LoanOptimizer from './components/LoanOptimizer'
import Resources from './components/Resources'
import Dashboard from './components/Dashboard'
import SuccessPage from './components/SuccessPage'

function App() {
  const [showDemo, setShowDemo] = useState(false)
  const [showResources, setShowResources] = useState(false)
  const [showDashboard, setShowDashboard] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)

  // Check if we're on the success page
  if (window.location.pathname === '/success') {
    return <SuccessPage />
  }

  if (showDemo) {
    return <LoanOptimizer />
  }

  if (showResources) {
    return <Resources onBackToHome={() => setShowResources(false)} />
  }

  if (showDashboard) {
    return <Dashboard onBack={() => setShowDashboard(false)} user={{ firstName: 'Sarah' }} />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      {/* Global Navigation */}
      <nav className="bg-navy-900 text-white relative z-50">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center py-4">
            {/* Logo */}
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-teal-500 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <div>
                <div className="text-xl font-display font-bold text-white">Clinicians Wealth</div>
                <div className="text-xs text-teal-400">.dot phrases for your wealth</div>
              </div>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-8">
              <a href="#how-it-works" className="text-navy-200 hover:text-white transition-colors">How It Works</a>
              <button onClick={() => setShowResources(true)} className="text-navy-200 hover:text-white transition-colors">Resources</button>
              <button onClick={() => setShowDashboard(true)} className="text-navy-200 hover:text-white transition-colors">Dashboard</button>
              <button
                onClick={() => setShowDemo(true)}
                className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
              >
                Get Started
              </button>
            </div>

            {/* Mobile menu button */}
            <button
              className="md:hidden"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

          {/* Mobile Navigation */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t border-navy-800 py-4">
              <div className="flex flex-col space-y-4">
                <a href="#how-it-works" className="text-navy-200 hover:text-white transition-colors">How It Works</a>
                <button onClick={() => setShowResources(true)} className="text-navy-200 hover:text-white transition-colors text-left">Resources</button>
                <button onClick={() => setShowDashboard(true)} className="text-navy-200 hover:text-white transition-colors text-left">Dashboard</button>
                <button
                  onClick={() => setShowDemo(true)}
                  className="bg-coral-500 hover:bg-coral-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-left"
                >
                  Get Started
                </button>
              </div>
            </div>
          )}
        </div>
      </nav>
      {/* Hero Section */}
      <section className="container mx-auto px-4 py-16" itemScope itemType="https://schema.org/Service">
        <div className="max-w-4xl mx-auto text-center">
          <div className="mb-4">
            <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-800 mb-4">
              The Loan Strategy Tool Built <br />
              <span className="bg-gradient-to-r from-teal-600 to-coral-500 bg-clip-text text-transparent">
                Specifically for Clinicians
              </span>
            </h1>
          </div>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            Analyze all your federal and private loan options in one place. 
            SAVE plan, PSLF, refinancing, and physician-specific programs.
          </p>
          <p className="text-lg text-gray-500 mb-2">
            Get your personalized strategy in 5 minutes.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-8">
            <button
              onClick={() => setShowDemo(true)}
              className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl"
            >
              Analyze My Options →
            </button>
            
          </div>

          {/* Process Preview */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-16">
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-teal-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-teal-600 font-bold text-lg">1</span>
              </div>
              <h3 className="font-display font-semibold text-navy-800 mb-2">5 Minutes</h3>
              <p className="text-gray-600 text-sm">Quick questions about your specialty and loans</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-coral-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-coral-600 font-bold text-lg">2</span>
              </div>
              <h3 className="font-display font-semibold text-navy-800 mb-2">Complete Analysis</h3>
              <p className="text-gray-600 text-sm">Federal plans, refinancing, state programs, employer benefits</p>
            </div>
            
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="w-12 h-12 bg-gold-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-gold-600 font-bold text-lg">3</span>
              </div>
              <h3 className="font-display font-semibold text-navy-800 mb-2">Lifetime of Savings</h3>
              <p className="text-gray-600 text-sm">Get your detailed strategy and implementation plan</p>
            </div>
          </div>

          {/* Social Proof */}
          <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
            <h3 className="font-display font-semibold text-navy-800 mb-6">Trusted by Physicians Nationwide</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold text-sage-600 mb-2">$47K</div>
                <div className="text-sm text-gray-600">Average potential savings</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">20+</div>
                <div className="text-sm text-gray-600">Loan strategies analyzed</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-coral-600 mb-2">16+</div>
                <div className="text-sm text-gray-600">Medical specialties covered</div>
              </div>
            </div>
          </div>

          {/* Risk Reversal */}
          <div className="mt-8 text-center">
            <p className="text-gray-600">
              🔒 100% Money-Back Guarantee • Bank-Level Security • HIPAA Compliant
            </p>
          </div>
        </div>
      </section>

      {/* Case Study Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-navy-800 mb-4">
                Real Physician. Real Savings.
              </h2>
              <p className="text-xl text-gray-600">
                See exactly what you get with our comprehensive analysis
              </p>
            </div>

            {/* Case Study Card */}
            <div className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-3xl p-8 md:p-12 text-white relative overflow-hidden">
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-64 h-64 bg-teal-500/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-coral-500/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
                  {/* Left: Case Study */}
                  <div>
                    <div className="inline-flex items-center space-x-2 bg-gold-500/20 text-gold-400 px-4 py-2 rounded-full text-sm font-semibold mb-6">
                      <Star className="w-4 h-4" />
                      <span>CASE STUDY</span>
                    </div>
                    
                    <h3 className="text-3xl font-display font-bold mb-4 text-white">
                      Dr. Sarah Chen, OB/GYN Fellow
                    </h3>
                    
                    <div className="space-y-4 text-navy-200">
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-coral-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-white">$285,000 in federal loans</p>
                          <p className="text-sm">Standard 10-year plan: $3,247/month</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-teal-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-white">Fellowship at Children's Hospital (501c3)</p>
                          <p className="text-sm">$65,000 salary, qualifying for PSLF</p>
                        </div>
                      </div>
                      
                      <div className="flex items-start space-x-3">
                        <div className="w-2 h-2 bg-sage-400 rounded-full mt-2 flex-shrink-0"></div>
                        <div>
                          <p className="font-semibold text-white">Plans to work at academic medical center</p>
                          <p className="text-sm">Long-term PSLF eligibility likely</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Right: Results */}
                  <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8">
                    <h4 className="text-2xl font-display font-bold mb-6 text-white">
                      Our Recommendation
                    </h4>
                    
                    <div className="space-y-6">
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-navy-200">Strategy</span>
                        <span className="font-bold text-white">SAVE Plan → PSLF</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-navy-200">Monthly Payment</span>
                        <span className="font-bold text-white">$387/month</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-navy-200">Total Paid (10 years)</span>
                        <span className="font-bold text-white">$46,440</span>
                      </div>
                      
                      <div className="flex justify-between items-center pb-4 border-b border-white/20">
                        <span className="text-navy-200">Amount Forgiven</span>
                        <span className="font-bold text-coral-400">$238,560</span>
                      </div>
                      
                      <div className="bg-sage-500/20 rounded-xl p-4 text-center">
                        <p className="text-sage-300 text-sm mb-1">Total Savings vs Standard Plan</p>
                        <p className="text-4xl font-display font-bold text-sage-400">$343,200</p>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="mt-12 text-center">
                  <p className="text-navy-300 mb-6">
                    This analysis included state loan forgiveness programs, employer benefits, 
                    tax implications, and year-by-year payment projections.
                  </p>
                  
                  <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
                    <button
                      onClick={() => setShowDemo(true)}
                      className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                    >
                      <span>Get Your Custom Analysis</span>
                      <ArrowRight className="w-5 h-5" />
                    </button>
                    
                    <button
                      onClick={() => window.open('/premium-report-sample.pdf', '_blank')}
                      className="bg-white/20 hover:bg-white/30 text-white font-semibold py-4 px-6 rounded-xl text-lg transition-all border border-white/30 hover:border-white/50 inline-flex items-center space-x-2"
                    >
                      <Download className="w-5 h-5" />
                      <span>View Sample Report</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <section id="how-it-works" className="bg-gradient-to-br from-teal-50 to-coral-50 py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-display font-bold text-navy-800 mb-6">
                How Our Analysis Works
              </h2>
              <p className="text-xl text-gray-600 mb-4">
                Simple process, comprehensive results - exclusively for clinicians under 40 with student loans
              </p>
              <p className="text-lg text-gray-500">
                From upload to implementation in under 10 minutes
              </p>
            </div>
            
            {/* Process Steps */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-16">
              <div className="relative text-center">
                <div className="w-20 h-20 bg-teal-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <FileText className="w-10 h-10 text-teal-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-navy-800 mb-3">1. Upload or Enter</h3>
                <p className="text-gray-600 mb-4">Share your loan info via document upload or quick manual entry</p>
                <div className="text-sm text-teal-600 font-semibold">📄 30 seconds</div>
                
                {/* Arrow */}
                <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>
              
              <div className="relative text-center">
                <div className="w-20 h-20 bg-coral-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Calculator className="w-10 h-10 text-coral-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-navy-800 mb-3">2. AI Analysis</h3>
                <p className="text-gray-600 mb-4">We analyze all 20+ federal plans, refinancing options, and state programs</p>
                <div className="text-sm text-coral-600 font-semibold">🧠 2 minutes</div>
                
                {/* Arrow */}
                <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>
              
              <div className="relative text-center">
                <div className="w-20 h-20 bg-sage-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <TrendingUp className="w-10 h-10 text-sage-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-navy-800 mb-3">3. Personalized Strategy</h3>
                <p className="text-gray-600 mb-4">Get your optimal path based on specialty, career goals, and timeline</p>
                <div className="text-sm text-sage-600 font-semibold">🎯 1 minute</div>
                
                {/* Arrow */}
                <div className="hidden md:block absolute top-10 -right-4 text-gray-300">
                  <ArrowRight className="w-8 h-8" />
                </div>
              </div>
              
              <div className="text-center">
                <div className="w-20 h-20 bg-gold-100 rounded-3xl flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Download className="w-10 h-10 text-gold-600" />
                </div>
                <h3 className="text-xl font-display font-bold text-navy-800 mb-3">4. Implementation</h3>
                <p className="text-gray-600 mb-4">Detailed report with exact steps, forms, and contact information</p>
                <div className="text-sm text-gold-600 font-semibold">📋 Lifetime access</div>
              </div>
            </div>

            {/* What Makes Us Different */}
            <div className="bg-white rounded-3xl p-8 md:p-12 shadow-xl">
              <div className="text-center mb-10">
                <h3 className="text-3xl font-display font-bold text-navy-800 mb-4">
                  What Makes Our Analysis Different
                </h3>
                <p className="text-xl text-gray-600">
                  We go beyond basic calculators to give you the complete picture
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
                {/* Left: What Others Miss */}
                <div>
                  <h4 className="text-2xl font-display font-bold text-navy-800 mb-6">
                    What Others Miss:
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Physician-specific rates</p>
                        <p className="text-sm text-gray-600">Most tools use generic rates, not medical professional discounts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">State forgiveness programs</p>
                        <p className="text-sm text-gray-600">Up to $50K available through state programs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Career timeline optimization</p>
                        <p className="text-sm text-gray-600">When to switch strategies as income changes</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center mt-1">
                        <span className="text-red-600 text-sm">✗</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Implementation support</p>
                        <p className="text-sm text-gray-600">Exact forms, deadlines, and contact information</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Right: What We Include */}
                <div>
                  <h4 className="text-2xl font-display font-bold text-navy-800 mb-6">
                    What We Include:
                  </h4>
                  
                  <div className="space-y-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">All 20+ repayment strategies</p>
                        <p className="text-sm text-gray-600">Federal plans, refinancing, hybrid approaches</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Physician-optimized rates</p>
                        <p className="text-sm text-gray-600">Access to medical professional discounts</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Complete program database</p>
                        <p className="text-sm text-gray-600">State, employer, and specialty-specific programs</p>
                      </div>
                    </div>
                    
                    <div className="flex items-start space-x-3">
                      <div className="w-6 h-6 bg-sage-100 rounded-full flex items-center justify-center mt-1">
                        <CheckCircle className="w-4 h-4 text-sage-600" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-800">Step-by-step roadmap</p>
                        <p className="text-sm text-gray-600">Exact implementation plan with deadlines</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA in How It Works */}
              <div className="text-center mt-12">
                <button
                  onClick={() => setShowDemo(true)}
                  className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl inline-flex items-center space-x-2"
                >
                  <span>See How It Works For You</span>
                  <ArrowRight className="w-5 h-5" />
                </button>
                <p className="text-sm text-gray-500 mt-3">
                  Takes 5 minutes • No commitment required
                </p>
              </div>
            </div>
            
            {/* Age Requirement Notice */}
            <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 mt-16 max-w-3xl mx-auto">
              <p className="text-amber-800 font-medium text-center">
                ⚠️ <strong>Important:</strong> This tool is designed specifically for clinicians under 40. If you're over 40, our strategies may not apply to your situation as they focus on early-career student debt optimization.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Comprehensive Options Section */}
      <div className="bg-gradient-to-br from-teal-50 to-coral-50 py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-navy-800 mb-4">
                We Analyze Every Option Available to Physicians
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                Unlike generic calculators, we understand the unique loan landscape for medical professionals. 
                Here's what we cover in your personalized analysis:
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              {/* Federal Plans */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-teal-100 rounded-xl flex items-center justify-center mb-4">
                  <FileText className="w-6 h-6 text-teal-600" />
                </div>
                <h3 className="font-display font-bold text-navy-800 mb-3">Federal Plans</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• SAVE Plan (5% discretionary)</li>
                  <li>• REPAYE (10% discretionary)</li>
                  <li>• PAYE & IBR plans</li>
                  <li>• Standard & Graduated</li>
                  <li>• Public Service Loan Forgiveness</li>
                </ul>
              </div>

              {/* Refinancing Options */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-coral-100 rounded-xl flex items-center justify-center mb-4">
                  <TrendingUp className="w-6 h-6 text-coral-600" />
                </div>
                <h3 className="font-display font-bold text-navy-800 mb-3">Refinancing</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Physician-specific rates</li>
                  <li>• Variable vs fixed terms</li>
                  <li>• 5-20 year options</li>
                  <li>• Residency deferment</li>
                  <li>• Multiple lender comparison</li>
                </ul>
              </div>

              {/* State & Employer Programs */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-sage-100 rounded-xl flex items-center justify-center mb-4">
                  <Award className="w-6 h-6 text-sage-600" />
                </div>
                <h3 className="font-display font-bold text-navy-800 mb-3">Forgiveness Programs</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• State loan repayment programs</li>
                  <li>• Rural physician incentives</li>
                  <li>• Employer loan benefits</li>
                  <li>• Specialty-specific programs</li>
                  <li>• Academic medical centers</li>
                </ul>
              </div>

              {/* Training Strategies */}
              <div className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-shadow">
                <div className="w-12 h-12 bg-gold-100 rounded-xl flex items-center justify-center mb-4">
                  <Clock className="w-6 h-6 text-gold-600" />
                </div>
                <h3 className="font-display font-bold text-navy-800 mb-3">Training Strategies</h3>
                <ul className="text-sm text-gray-600 space-y-2">
                  <li>• Residency payment options</li>
                  <li>• Fellowship transitions</li>
                  <li>• Income-based payments</li>
                  <li>• Deferment strategies</li>
                  <li>• Attending salary planning</li>
                </ul>
              </div>
            </div>

            {/* Comparison Table */}
            <div className="bg-white rounded-3xl p-8 shadow-xl">
              <div className="text-center mb-8">
                <h3 className="text-3xl font-display font-bold text-navy-800 mb-4">
                  Government Calculator vs. Complete Physician Analysis
                </h3>
                <p className="text-gray-600">
                  See why clinicians under 40 choose our targeted approach
                </p>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b-2 border-gray-200">
                      <th className="text-left py-4 px-6 font-display font-bold text-navy-800"></th>
                      <th className="text-center py-4 px-6 font-display font-bold text-gray-600">Government Tool</th>
                      <th className="text-center py-4 px-6 font-display font-bold text-teal-600">Our Analysis</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">Federal repayment plans</td>
                      <td className="py-4 px-6 text-center text-gray-600">4 basic plans</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">All 8+ federal options</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">Refinancing analysis</td>
                      <td className="py-4 px-6 text-center text-gray-400">❌ Not included</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">✅ Full market analysis</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">Physician-specific rates</td>
                      <td className="py-4 px-6 text-center text-gray-400">❌ Generic rates</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">✅ Medical professional rates</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">State forgiveness programs</td>
                      <td className="py-4 px-6 text-center text-gray-400">❌ Not included</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">✅ 50-state program search</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">Employer benefit analysis</td>
                      <td className="py-4 px-6 text-center text-gray-400">❌ Not included</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">✅ Hospital & practice benefits</td>
                    </tr>
                    <tr>
                      <td className="py-4 px-6 font-semibold text-navy-700">Implementation roadmap</td>
                      <td className="py-4 px-6 text-center text-gray-400">❌ Numbers only</td>
                      <td className="py-4 px-6 text-center text-teal-600 font-semibold">✅ Step-by-step guide + forms</td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Trust & Education Section */}
      <div className="bg-white py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-12">
              <h2 className="text-4xl font-display font-bold text-navy-800 mb-4">
                Physician-Forward Education & Resources
              </h2>
              <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                We're here to bring clarity and peace of mind to your loan decisions. 
                Knowledge first, optimization second.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
              {/* Educational Resources */}
              <div className="text-center">
                <div className="w-16 h-16 bg-teal-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <BookOpen className="w-8 h-8 text-teal-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-800 mb-4">Clear Education</h3>
                <p className="text-gray-600">
                  No jargon, no confusion. We explain every option in plain terms 
                  so you can make informed decisions about your financial future.
                </p>
              </div>

              {/* Physician-Specific */}
              <div className="text-center">
                <div className="w-16 h-16 bg-coral-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Users className="w-8 h-8 text-coral-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-800 mb-4">Built for Clinicians Under 40</h3>
                <p className="text-gray-600">
                  Created by those who understand the unique challenges clinicians under 40 face: 
                  massive student debt, lower residency income, and complex federal loan programs.
                </p>
              </div>

              {/* Trust & Transparency */}
              <div className="text-center">
                <div className="w-16 h-16 bg-sage-100 rounded-2xl flex items-center justify-center mx-auto mb-6">
                  <Shield className="w-8 h-8 text-sage-600" />
                </div>
                <h3 className="text-2xl font-display font-bold text-navy-800 mb-4">Your Trusted Partner</h3>
                <p className="text-gray-600">
                  We're the clarity you need when government tools fall short. 
                  Transparent analysis you can return to and trust throughout your career.
                </p>
              </div>
            </div>

            {/* Value Proposition */}
            <div className="bg-gradient-to-r from-navy-800 to-navy-900 rounded-3xl p-8 md:p-12 text-center text-white">
              <h3 className="text-3xl font-display font-bold mb-4">
                Why Physicians Choose Our Complete Analysis
              </h3>
              <p className="text-xl text-navy-200 mb-8 max-w-3xl mx-auto">
                "Government calculators show you 4 options. Generic refinancing sites show you 1 type of analysis. 
                We show you ALL 20+ options with your best recommendation."
              </p>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                <div>
                  <div className="text-4xl font-display font-bold text-coral-400 mb-2">$47K</div>
                  <div className="text-navy-300">Potential savings identified</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-teal-400 mb-2">20+</div>
                  <div className="text-navy-300">Loan strategies analyzed</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-sage-400 mb-2">1000x</div>
                  <div className="text-navy-300">Potential ROI on $47 investment</div>
                </div>
              </div>
              
              <button
                onClick={() => setShowDemo(true)}
                className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
              >
                <span>Start Your Analysis</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-navy-900 text-white py-12">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {/* Brand */}
              <div className="md:col-span-2">
                <div className="mb-4">
                  <div className="text-2xl font-display font-bold text-white mb-1">Clinicians Wealth</div>
                  <div className="text-coral-400 font-medium">.dot phrases for your wealth</div>
                </div>
                <p className="text-navy-300 mb-4 max-w-md">
                  Comprehensive loan optimization tools designed exclusively 
                  for clinicians under 40. Your trusted partner for eliminating student debt.
                </p>
                <div className="flex items-center space-x-4">
                  <a 
                    href="https://x.com/pepdekker" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-navy-400 hover:text-white transition-colors"
                  >
                    <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                  </a>
                </div>
              </div>

              {/* Products */}
              <div>
                <h3 className="font-display font-bold text-white mb-4">Products</h3>
                <ul className="space-y-2 text-navy-300">
                  <li><button onClick={() => setShowDemo(true)} className="hover:text-white transition-colors">Loan Optimizer</button></li>
                  <li className="text-navy-500">Rate Monitoring (Coming Soon)</li>
                  <li className="text-navy-500">Wealth Dashboard (Coming Soon)</li>
                  <li className="text-navy-500">Community Platform (Coming Soon)</li>
                </ul>
              </div>

              {/* Resources */}
              <div>
                <h3 className="font-display font-bold text-white mb-4">Resources</h3>
                <ul className="space-y-2 text-navy-300">
                  <li><a href="/sample-report.pdf" target="_blank" className="hover:text-white transition-colors">Sample Report</a></li>
                  <li className="text-navy-500">Physician Loan Guide (Coming Soon)</li>
                  <li className="text-navy-500">PSLF Calculator (Coming Soon)</li>
                  <li className="text-navy-500">Refinancing Guide (Coming Soon)</li>
                </ul>
              </div>
            </div>

            <div className="border-t border-navy-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <div className="text-navy-400 text-sm mb-4 md:mb-0">
                © 2025 Clinicians Wealth. Simplifying complex financial decisions.
              </div>
              <div className="flex space-x-6 text-navy-400 text-sm">
                <a href="/privacy" className="hover:text-white transition-colors">Privacy</a>
                <a href="/terms" className="hover:text-white transition-colors">Terms</a>
                <a href="/contact" className="hover:text-white transition-colors">Contact</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
