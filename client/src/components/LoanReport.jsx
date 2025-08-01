import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import pdfExportService from '../utils/pdfExport';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { 
  TrendingUp, 
  Calendar, 
  FileText, 
  Download, 
  Mail, 
  CheckCircle, 
  AlertTriangle, 
  DollarSign, 
  Clock, 
  Target,
  ChevronDown,
  ChevronRight,
  Info,
  ExternalLink,
  Share2
} from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const LoanReport = ({ reportData, onBack }) => {
  const [selectedStrategy, setSelectedStrategy] = useState('recommended');
  const [activeSection, setActiveSection] = useState('overview');
  const [expandedSections, setExpandedSections] = useState(new Set(['timeline']));
  const [isExporting, setIsExporting] = useState(false);
  const reportRef = useRef(null);
  const chartRef = useRef(null);

  // Mock data - in real app this would come from props/API
  const strategies = {
    recommended: {
      name: 'SAVE Plan + PSLF',
      icon: '🎯',
      totalPaid: 89247,
      monthlyPayment: 387,
      timeToPayoff: 10,
      forgiveness: 168753,
      confidence: 'High',
      description: 'Optimal for your PSLF-eligible employment at academic medical center',
      pros: [
        'Lowest monthly payments during residency ($189/month)',
        'Significant loan forgiveness ($168,753)',
        'Interest subsidy prevents balance growth',
        'Income-driven payments protect during low-income periods'
      ],
      cons: [
        'Must maintain PSLF-eligible employment for 10 years',
        'Forgiven amount may be taxable (pending legislation)',
        'Requires annual income recertification',
        'Payment increases with attending salary'
      ],
      timeline: [
        { step: 1, title: 'Submit SAVE Application', deadline: 'This Week', description: 'Complete online application at studentaid.gov', status: 'pending' },
        { step: 2, title: 'PSLF Employer Certification', deadline: 'This Week', description: 'Submit annual certification form for current employer', status: 'pending' },
        { step: 3, title: 'Confirm Approval', deadline: '30 days', description: 'Verify SAVE plan activation and payment amount', status: 'pending' },
        { step: 4, title: 'Track PSLF Progress', deadline: 'Ongoing', description: 'Monitor qualifying payments through FedLoan portal', status: 'pending' }
      ],
      paymentSchedule: [
        { year: 1, payment: 189, salary: 60000, balance: 248500 },
        { year: 2, payment: 189, salary: 61000, balance: 247800 },
        { year: 3, payment: 189, salary: 62000, balance: 247100 },
        { year: 4, payment: 267, salary: 63000, balance: 246200 },
        { year: 5, payment: 892, salary: 280000, balance: 235400 },
        { year: 6, payment: 892, salary: 285000, balance: 224100 },
        { year: 7, payment: 892, salary: 290000, balance: 212300 },
        { year: 8, payment: 892, salary: 295000, balance: 200000 },
        { year: 9, payment: 892, salary: 300000, balance: 187200 },
        { year: 10, payment: 892, salary: 305000, balance: 0 }
      ]
    },
    refinancing: {
      name: 'Private Refinancing',
      icon: '📈',
      totalPaid: 124891,
      monthlyPayment: 1041,
      timeToPayoff: 10,
      forgiveness: 0,
      confidence: 'Medium',
      description: 'Fixed rate option with physician-specific benefits',
      pros: [
        'Lower interest rate (4.2% vs 6.8%)',
        'Flexible employment options',
        'No federal program restrictions',
        'Potential for further rate reductions'
      ],
      cons: [
        'Higher total cost ($35,644 more than SAVE)',
        'No federal protections or forgiveness',
        'Fixed payments during residency',
        'Credit score requirements'
      ],
      timeline: [
        { step: 1, title: 'Check Credit Score', deadline: 'This Week', description: 'Ensure score above 720 for best rates', status: 'pending' },
        { step: 2, title: 'Compare Lenders', deadline: '2 weeks', description: 'Apply to 3-5 physician-focused lenders', status: 'pending' },
        { step: 3, title: 'Submit Applications', deadline: '3 weeks', description: 'Complete applications within 14-day window', status: 'pending' },
        { step: 4, title: 'Review Offers', deadline: '4 weeks', description: 'Compare terms and select best option', status: 'pending' }
      ],
      paymentSchedule: [
        { year: 1, payment: 1041, salary: 60000, balance: 237459 },
        { year: 2, payment: 1041, salary: 61000, balance: 224918 },
        { year: 3, payment: 1041, salary: 62000, balance: 212377 },
        { year: 4, payment: 1041, salary: 63000, balance: 199836 },
        { year: 5, payment: 1041, salary: 280000, balance: 187295 },
        { year: 6, payment: 1041, salary: 285000, balance: 174754 },
        { year: 7, payment: 1041, salary: 290000, balance: 162213 },
        { year: 8, payment: 1041, salary: 295000, balance: 149672 },
        { year: 9, payment: 1041, salary: 300000, balance: 137131 },
        { year: 10, payment: 1041, salary: 305000, balance: 0 }
      ]
    },
    standard: {
      name: 'Standard Federal',
      icon: '📊',
      totalPaid: 136641,
      monthlyPayment: 1139,
      timeToPayoff: 10,
      forgiveness: 0,
      confidence: 'Low',
      description: 'Traditional 10-year repayment plan',
      pros: [
        'Fastest payoff timeline',
        'No employment restrictions',
        'Predictable monthly payments',
        'No annual recertification required'
      ],
      cons: [
        'Highest total cost ($47,394 more than SAVE)',
        'High payments during residency ($1,139/month)',
        'No income-based protections',
        'No forgiveness opportunities'
      ],
      timeline: [
        { step: 1, title: 'Confirm Current Plan', deadline: 'This Week', description: 'Verify you are on standard repayment', status: 'pending' },
        { step: 2, title: 'Budget Planning', deadline: 'This Week', description: 'Ensure monthly payment fits budget', status: 'pending' },
        { step: 3, title: 'Autopay Setup', deadline: '2 weeks', description: 'Enable autopay for 0.25% rate reduction', status: 'pending' },
        { step: 4, title: 'Regular Reviews', deadline: 'Annual', description: 'Reassess strategy as income changes', status: 'pending' }
      ],
      paymentSchedule: [
        { year: 1, payment: 1139, salary: 60000, balance: 236861 },
        { year: 2, payment: 1139, salary: 61000, balance: 223722 },
        { year: 3, payment: 1139, salary: 62000, balance: 210583 },
        { year: 4, payment: 1139, salary: 63000, balance: 197444 },
        { year: 5, payment: 1139, salary: 280000, balance: 184305 },
        { year: 6, payment: 1139, salary: 285000, balance: 171166 },
        { year: 7, payment: 1139, salary: 290000, balance: 158027 },
        { year: 8, payment: 1139, salary: 295000, balance: 144888 },
        { year: 9, payment: 1139, salary: 300000, balance: 131749 },
        { year: 10, payment: 1139, salary: 305000, balance: 0 }
      ]
    }
  };

  const currentStrategy = strategies[selectedStrategy];

  const toggleSection = (section) => {
    const newExpanded = new Set(expandedSections);
    if (newExpanded.has(section)) {
      newExpanded.delete(section);
    } else {
      newExpanded.add(section);
    }
    setExpandedSections(newExpanded);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const exportToPDF = async () => {
    if (!reportRef.current || isExporting) return;
    
    setIsExporting(true);
    
    const userProfile = {
      name: 'Dr. Sarah Chen',
      specialty: 'Internal Medicine',
      careerStage: 'Resident'
    };

    const filename = `loan-strategy-${currentStrategy.name.replace(/\s+/g, '-').toLowerCase()}-${Date.now()}.pdf`;
    
    try {
      const result = await pdfExportService.exportReportToPDF(
        reportRef.current,
        filename,
        userProfile
      );
      
      if (result.success) {
        // Show success message (optional)
        console.log('PDF exported successfully');
      } else {
        console.error('PDF export failed:', result.error);
        // Fallback to print
        pdfExportService.exportUsingPrint();
      }
    } catch (error) {
      console.error('PDF export error:', error);
      // Fallback to print
      pdfExportService.exportUsingPrint();
    } finally {
      setIsExporting(false);
    }
  };

  const shareReport = () => {
    if (navigator.share) {
      navigator.share({
        title: 'My Loan Optimization Report',
        text: `I could save ${formatCurrency(strategies.recommended.totalPaid - currentStrategy.totalPaid)} on my student loans!`,
        url: window.location.href
      });
    }
  };

  // Chart data preparation
  const paymentTimelineData = {
    labels: currentStrategy.paymentSchedule.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Monthly Payment',
        data: currentStrategy.paymentSchedule.map(item => item.payment),
        borderColor: '#0f766e',
        backgroundColor: 'rgba(15, 118, 110, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        yAxisID: 'y'
      },
      {
        label: 'Annual Salary',
        data: currentStrategy.paymentSchedule.map(item => item.salary / 1000),
        borderColor: '#f59e0b',
        backgroundColor: 'rgba(245, 158, 11, 0.1)',
        borderWidth: 3,
        fill: false,
        tension: 0.4,
        yAxisID: 'y1'
      }
    ]
  };

  const loanBalanceData = {
    labels: currentStrategy.paymentSchedule.map(item => `Year ${item.year}`),
    datasets: [
      {
        label: 'Remaining Balance',
        data: currentStrategy.paymentSchedule.map(item => item.balance),
        borderColor: '#ef4444',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        borderWidth: 3,
        fill: true,
        tension: 0.4
      }
    ]
  };

  const strategyComparisonData = {
    labels: ['SAVE + PSLF', 'Private Refinancing', 'Standard Federal'],
    datasets: [
      {
        label: 'Total Amount Paid',
        data: [
          strategies.recommended.totalPaid,
          strategies.refinancing.totalPaid,
          strategies.standard.totalPaid
        ],
        backgroundColor: [
          'rgba(15, 118, 110, 0.8)',
          'rgba(245, 158, 11, 0.8)',
          'rgba(239, 68, 68, 0.8)'
        ],
        borderColor: [
          '#0f766e',
          '#f59e0b',
          '#ef4444'
        ],
        borderWidth: 2
      }
    ]
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          padding: 20
        }
      },
      tooltip: {
        mode: 'index',
        intersect: false,
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Annual Salary') {
              return `${context.dataset.label}: $${(context.parsed.y * 1000).toLocaleString()}`;
            }
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        type: 'linear',
        display: true,
        position: 'left',
        title: {
          display: true,
          text: 'Monthly Payment ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + value.toLocaleString();
          }
        }
      },
      y1: {
        type: 'linear',
        display: true,
        position: 'right',
        title: {
          display: true,
          text: 'Annual Salary ($000)'
        },
        grid: {
          drawOnChartArea: false,
        },
        ticks: {
          callback: function(value) {
            return '$' + value + 'K';
          }
        }
      }
    },
    interaction: {
      mode: 'index',
      intersect: false,
    }
  };

  const balanceChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top'
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Loan Balance ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  const comparisonChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `Total Paid: $${context.parsed.y.toLocaleString()}`;
          }
        }
      }
    },
    scales: {
      y: {
        title: {
          display: true,
          text: 'Total Amount Paid ($)'
        },
        ticks: {
          callback: function(value) {
            return '$' + (value / 1000) + 'K';
          }
        }
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div>
              <button 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2 mb-2"
              >
                ← Back to Calculator
              </button>
              <h1 className="text-2xl font-display font-bold text-navy-800">
                Your Personalized Loan Strategy Report
              </h1>
              <p className="text-gray-600">
                Generated for Dr. Sarah Chen, Internal Medicine • {new Date().toLocaleDateString()}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <button
                onClick={shareReport}
                className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors"
              >
                <Share2 className="w-4 h-4" />
                <span>Share</span>
              </button>
              <button
                onClick={exportToPDF}
                disabled={isExporting}
                className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-colors ${
                  isExporting 
                    ? 'bg-gray-400 text-gray-600 cursor-not-allowed' 
                    : 'bg-coral-500 text-white hover:bg-coral-600'
                }`}
              >
                {isExporting ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
                    <span>Generating...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4" />
                    <span>Export PDF</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8" ref={reportRef}>
        {/* Executive Summary */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-teal-600 to-teal-700 rounded-2xl p-8 text-white mb-8 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl transform translate-x-32 -translate-y-32"></div>
          <div className="relative z-10">
            <div className="flex items-center space-x-3 mb-6">
              <span className="text-4xl">{currentStrategy.icon}</span>
              <div>
                <h2 className="text-2xl font-display font-bold">Recommended Strategy</h2>
                <p className="text-teal-100">{currentStrategy.name}</p>
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatCurrency(currentStrategy.totalPaid)}</div>
                <div className="text-teal-200 text-sm">Total You'll Pay</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatCurrency(currentStrategy.monthlyPayment)}</div>
                <div className="text-teal-200 text-sm">Starting Payment</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{currentStrategy.timeToPayoff} years</div>
                <div className="text-teal-200 text-sm">Time to Freedom</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold mb-1">{formatCurrency(strategies.standard.totalPaid - currentStrategy.totalPaid)}</div>
                <div className="text-teal-200 text-sm">vs Standard Plan</div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Strategy Selector */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white rounded-xl p-6 mb-8 shadow-lg"
        >
          <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
            Compare All Your Options
          </h3>
          <p className="text-gray-600 mb-6">
            Click any strategy below to see how it affects your payments, timeline, and implementation steps.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {Object.entries(strategies).map(([key, strategy]) => (
              <button
                key={key}
                onClick={() => setSelectedStrategy(key)}
                className={`text-left p-4 rounded-xl border-2 transition-all ${
                  selectedStrategy === key
                    ? 'border-teal-500 bg-teal-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
              >
                <div className="flex items-center space-x-3 mb-3">
                  <span className="text-2xl">{strategy.icon}</span>
                  <div>
                    <div className="font-semibold text-navy-800">{strategy.name}</div>
                    <div className="text-sm text-gray-600">Confidence: {strategy.confidence}</div>
                  </div>
                </div>
                <div className="text-2xl font-bold text-navy-800 mb-1">
                  {formatCurrency(strategy.totalPaid)}
                </div>
                <div className="text-sm text-gray-600">
                  {formatCurrency(strategy.monthlyPayment)}/month
                </div>
              </button>
            ))}
          </div>
        </motion.div>

        {/* Strategy Details */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Strategy Analysis */}
          <div className="lg:col-span-2 space-y-6">
            {/* Pros and Cons */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                {currentStrategy.name} Analysis
              </h3>
              <p className="text-gray-600 mb-6">{currentStrategy.description}</p>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-green-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-semibold text-green-800 mb-3 flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5" />
                    <span>Advantages</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentStrategy.pros.map((pro, index) => (
                      <li key={index} className="text-sm text-green-700 flex items-start space-x-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>{pro}</span>
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div className="bg-amber-50 rounded-lg p-4 border border-amber-200">
                  <h4 className="font-semibold text-amber-800 mb-3 flex items-center space-x-2">
                    <AlertTriangle className="w-5 h-5" />
                    <span>Considerations</span>
                  </h4>
                  <ul className="space-y-2">
                    {currentStrategy.cons.map((con, index) => (
                      <li key={index} className="text-sm text-amber-700 flex items-start space-x-2">
                        <span className="text-amber-500 mt-1">•</span>
                        <span>{con}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>

            {/* Payment Timeline Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Payment Timeline & Salary Growth
              </h3>
              <div className="h-80">
                <Line data={paymentTimelineData} options={chartOptions} />
              </div>
            </motion.div>

            {/* Loan Balance Progression */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.45 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Loan Balance Over Time
              </h3>
              <div className="h-64">
                <Line data={loanBalanceData} options={balanceChartOptions} />
              </div>
            </motion.div>

            {/* Strategy Comparison Chart */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Total Cost Comparison
              </h3>
              <div className="h-64">
                <Bar data={strategyComparisonData} options={comparisonChartOptions} />
              </div>
            </motion.div>

            {/* Payment Schedule Table */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Year-by-Year Payment Schedule
              </h3>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 font-semibold">Year</th>
                      <th className="text-right py-3 font-semibold">Monthly Payment</th>
                      <th className="text-right py-3 font-semibold">Annual Salary</th>
                      <th className="text-right py-3 font-semibold">Remaining Balance</th>
                    </tr>
                  </thead>
                  <tbody>
                    {currentStrategy.paymentSchedule.map((year, index) => (
                      <tr key={index} className="border-b border-gray-100">
                        <td className="py-2">{year.year}</td>
                        <td className="text-right py-2">{formatCurrency(year.payment)}</td>
                        <td className="text-right py-2">{formatCurrency(year.salary)}</td>
                        <td className="text-right py-2">{formatCurrency(year.balance)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>
          </div>

          {/* Right Column - Implementation */}
          <div className="space-y-6">
            {/* Implementation Timeline */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Implementation Roadmap
              </h3>
              <div className="space-y-4">
                {currentStrategy.timeline.map((item, index) => (
                  <div key={index} className="flex items-start space-x-4">
                    <div className="flex-shrink-0 w-8 h-8 bg-teal-100 rounded-full flex items-center justify-center">
                      <span className="text-teal-600 font-bold text-sm">{item.step}</span>
                    </div>
                    <div className="flex-grow">
                      <div className="font-semibold text-navy-800">{item.title}</div>
                      <div className="text-sm text-coral-600 font-medium">{item.deadline}</div>
                      <div className="text-sm text-gray-600 mt-1">{item.description}</div>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Key Documents */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-white rounded-xl p-6 shadow-lg"
            >
              <h3 className="text-xl font-display font-bold text-navy-800 mb-4">
                Required Documents
              </h3>
              <div className="space-y-3">
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="font-medium text-navy-800">SAVE Plan Application</div>
                    <div className="text-sm text-gray-600">Apply at studentaid.gov</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="font-medium text-navy-800">PSLF Certification</div>
                    <div className="text-sm text-gray-600">Annual employer certification</div>
                  </div>
                </div>
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <FileText className="w-5 h-5 text-teal-600" />
                  <div>
                    <div className="font-medium text-navy-800">Tax Returns</div>
                    <div className="text-sm text-gray-600">Most recent tax year</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Risk Factors */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="bg-amber-50 rounded-xl p-6 border border-amber-200"
            >
              <h3 className="text-lg font-display font-bold text-amber-800 mb-3 flex items-center space-x-2">
                <AlertTriangle className="w-5 h-5" />
                <span>Important Considerations</span>
              </h3>
              <ul className="space-y-2 text-sm text-amber-700">
                <li>• PSLF forgiveness may be taxable (pending federal legislation)</li>
                <li>• Must maintain eligible employment for full 10 years</li>
                <li>• Annual income recertification required</li>
                <li>• Payment amounts will increase with attending salary</li>
              </ul>
            </motion.div>

            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.9 }}
              className="bg-teal-50 rounded-xl p-6 border border-teal-200"
            >
              <h3 className="text-lg font-display font-bold text-teal-800 mb-3">
                Ready to Get Started?
              </h3>
              <div className="space-y-3">
                <a
                  href="https://studentaid.gov"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 bg-white rounded-lg border border-teal-200 hover:border-teal-300 transition-colors"
                >
                  <span className="font-medium text-teal-800">Apply for SAVE Plan</span>
                  <ExternalLink className="w-4 h-4 text-teal-600" />
                </a>
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-teal-600 text-white rounded-lg hover:bg-teal-700 transition-colors">
                  <Calendar className="w-4 h-4" />
                  <span>Schedule Follow-up Review</span>
                </button>
                <button className="w-full flex items-center justify-center space-x-2 p-3 bg-white border border-teal-200 text-teal-800 rounded-lg hover:border-teal-300 transition-colors">
                  <Mail className="w-4 h-4" />
                  <span>Email This Report</span>
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoanReport;