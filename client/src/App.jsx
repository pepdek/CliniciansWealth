import { useState } from 'react'
import { ChevronDown, ChevronRight, BookOpen, Calculator, TrendingUp, Users, Shield, CheckCircle, Star, ArrowRight, FileText, Award, Clock, DollarSign } from 'lucide-react'
import LoanOptimizer from './components/LoanOptimizer'

function App() {
  const [showDemo, setShowDemo] = useState(false)

  if (showDemo) {
    return <LoanOptimizer />
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-5xl md:text-6xl font-display font-bold text-navy-800 mb-6">
            Stop Guessing. <br />
            <span className="bg-gradient-to-r from-teal-600 to-coral-500 bg-clip-text text-transparent">
              Start Saving.
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-4 max-w-2xl mx-auto">
            The only comprehensive loan analysis tool built specifically for physicians.
          </p>
          <p className="text-lg text-gray-500 mb-8">
            We analyze <strong>all 20+ repayment options</strong> - not just the 4 the government shows you.
          </p>

          {/* CTA Button */}
          <button
            onClick={() => setShowDemo(true)}
            className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-2xl text-lg transition-all transform hover:scale-105 shadow-lg hover:shadow-xl mb-8"
          >
            Optimize My Loans →
          </button>

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
                <div className="text-sm text-gray-600">Average savings per physician</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-teal-600 mb-2">2,847+</div>
                <div className="text-sm text-gray-600">Physicians helped</div>
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
      </div>

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
                  
                  <button
                    onClick={() => setShowDemo(true)}
                    className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
                  >
                    <span>Get Your Custom Analysis</span>
                    <ArrowRight className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

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
                  See why physicians choose our comprehensive approach
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
                <h3 className="text-2xl font-display font-bold text-navy-800 mb-4">Built for Clinicians</h3>
                <p className="text-gray-600">
                  Created by physicians who understand your unique career path, 
                  income timeline, and the challenges of medical training debt.
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
                  <div className="text-navy-300">Average savings identified</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-teal-400 mb-2">20+</div>
                  <div className="text-navy-300">Loan strategies analyzed</div>
                </div>
                <div>
                  <div className="text-4xl font-display font-bold text-sage-400 mb-2">1000x</div>
                  <div className="text-navy-300">Minimum ROI on $47 investment</div>
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
    </div>
  )
}

export default App
