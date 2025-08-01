import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import pdfExportService from '../utils/pdfExport';
import {
  FileText,
  Download,
  Calendar,
  TrendingUp,
  ArrowLeft,
  Plus,
  Search,
  Filter,
  MoreVertical,
  Star,
  Clock,
  DollarSign,
  User,
  Settings,
  LogOut
} from 'lucide-react';
import LoanReport from './LoanReport';

const Dashboard = ({ onBack, user }) => {
  const [selectedReport, setSelectedReport] = useState(null);
  const [showReport, setShowReport] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock data - in real app this would come from API
  const [reports, setReports] = useState([
    {
      id: 1,
      title: 'SAVE Plan Analysis',
      specialty: 'Internal Medicine',
      careerStage: 'Resident',
      createdAt: '2025-01-15',
      totalSavings: 47394,
      recommendedStrategy: 'SAVE + PSLF',
      status: 'active',
      favorite: true,
      lastViewed: '2025-01-15',
      loanAmount: 250000
    },
    {
      id: 2,
      title: 'Refinancing Comparison',
      specialty: 'Emergency Medicine',
      careerStage: 'Attending',
      createdAt: '2025-01-10',
      totalSavings: 32100,
      recommendedStrategy: 'Private Refinancing',
      status: 'archived',
      favorite: false,
      lastViewed: '2025-01-12',
      loanAmount: 180000
    },
    {
      id: 3,
      title: 'Fellowship Strategy Update',
      specialty: 'Cardiology',
      careerStage: 'Fellow',
      createdAt: '2025-01-08',
      totalSavings: 89200,
      recommendedStrategy: 'SAVE + PSLF',
      status: 'active',
      favorite: true,
      lastViewed: '2025-01-14',
      loanAmount: 320000
    }
  ]);

  const filteredReports = reports.filter(report => {
    const matchesSearch = report.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         report.specialty.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || report.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const handleViewReport = (report) => {
    setSelectedReport(report);
    setShowReport(true);
  };

  const handleBackFromReport = () => {
    setShowReport(false);
    setSelectedReport(null);
  };

  const toggleFavorite = (reportId) => {
    setReports(prev => prev.map(report => 
      report.id === reportId ? { ...report, favorite: !report.favorite } : report
    ));
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  if (showReport && selectedReport) {
    return <LoanReport reportData={selectedReport} onBack={handleBackFromReport} />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-teal-50 via-white to-coral-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <button 
                onClick={onBack}
                className="text-gray-600 hover:text-gray-800 flex items-center space-x-2"
              >
                <ArrowLeft className="w-5 h-5" />
                <span>Back to Home</span>
              </button>
              <div className="h-6 w-px bg-gray-300"></div>
              <div>
                <h1 className="text-2xl font-display font-bold text-navy-800">
                  Your Dashboard
                </h1>
                <p className="text-gray-600">
                  Welcome back, Dr. {user?.firstName || 'User'}
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <button className="flex items-center space-x-2 px-4 py-2 text-gray-600 hover:text-gray-800 border border-gray-300 rounded-lg hover:border-gray-400 transition-colors">
                <Settings className="w-4 h-4" />
                <span>Settings</span>
              </button>
              <button className="flex items-center space-x-2 px-4 py-2 bg-coral-500 text-white rounded-lg hover:bg-coral-600 transition-colors">
                <Plus className="w-4 h-4" />
                <span>New Analysis</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-teal-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-teal-100 rounded-lg flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-teal-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Potential Savings</p>
                <p className="text-2xl font-bold text-teal-600">
                  {formatCurrency(reports.reduce((sum, report) => sum + report.totalSavings, 0))}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-coral-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-coral-100 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-coral-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Active Reports</p>
                <p className="text-2xl font-bold text-coral-600">
                  {reports.filter(r => r.status === 'active').length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-amber-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-amber-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-amber-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Favorite Strategies</p>
                <p className="text-2xl font-bold text-amber-600">
                  {reports.filter(r => r.favorite).length}
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
          >
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center">
                <Clock className="w-5 h-5 text-gray-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Last Activity</p>
                <p className="text-2xl font-bold text-gray-600">
                  {formatDate(Math.max(...reports.map(r => new Date(r.lastViewed))))}
                </p>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-white rounded-xl p-6 shadow-lg mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Search reports..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent"
                />
              </div>
              <div className="relative">
                <Filter className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" />
                <select
                  value={filterStatus}
                  onChange={(e) => setFilterStatus(e.target.value)}
                  className="pl-10 pr-8 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-transparent appearance-none bg-white"
                >
                  <option value="all">All Reports</option>
                  <option value="active">Active</option>
                  <option value="archived">Archived</option>
                </select>
              </div>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <span>{filteredReports.length} of {reports.length} reports</span>
            </div>
          </div>
        </motion.div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredReports.map((report, index) => (
            <motion.div
              key={report.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 + index * 0.1 }}
              className="bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-shadow cursor-pointer border border-gray-100 hover:border-teal-200"
              onClick={() => handleViewReport(report)}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-teal-100 rounded-lg flex items-center justify-center">
                    <FileText className="w-6 h-6 text-teal-600" />
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-navy-800">{report.title}</h3>
                    <p className="text-sm text-gray-600">{report.specialty} • {report.careerStage}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      toggleFavorite(report.id);
                    }}
                    className={`p-1 rounded-full transition-colors ${
                      report.favorite ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-amber-500'
                    }`}
                  >
                    <Star className={`w-4 h-4 ${report.favorite ? 'fill-current' : ''}`} />
                  </button>
                  <button
                    onClick={(e) => e.stopPropagation()}
                    className="p-1 text-gray-400 hover:text-gray-600 rounded-full"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <div className="space-y-3 mb-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Recommended Strategy</span>
                  <span className="text-sm font-medium text-navy-800">{report.recommendedStrategy}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Potential Savings</span>
                  <span className="text-sm font-bold text-green-600">{formatCurrency(report.totalSavings)}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-600">Loan Amount</span>
                  <span className="text-sm font-medium text-gray-800">{formatCurrency(report.loanAmount)}</span>
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2 text-sm text-gray-500">
                  <Calendar className="w-4 h-4" />
                  <span>Created {formatDate(report.createdAt)}</span>
                </div>
                <div className={`px-2 py-1 rounded-full text-xs font-medium ${
                  report.status === 'active' 
                    ? 'bg-green-100 text-green-800' 
                    : 'bg-gray-100 text-gray-600'
                }`}>
                  {report.status}
                </div>
              </div>

              <div className="mt-4 flex items-center space-x-2">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    handleViewReport(report);
                  }}
                  className="flex-1 bg-teal-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:bg-teal-700 transition-colors"
                >
                  View Report
                </button>
                <button
                  onClick={async (e) => {
                    e.stopPropagation();
                    // Use the PDF export service for better results
                    await pdfExportService.exportUsingPrint();
                  }}
                  className="p-2 border border-gray-300 rounded-lg text-gray-600 hover:bg-gray-50 transition-colors"
                  title="Download PDF"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Empty State */}
        {filteredReports.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center py-12"
          >
            <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FileText className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No reports found</h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || filterStatus !== 'all' 
                ? 'Try adjusting your search or filter criteria.'
                : 'Create your first loan optimization analysis to get started.'
              }
            </p>
            <button className="bg-coral-500 text-white py-2 px-4 rounded-lg hover:bg-coral-600 transition-colors">
              Create New Analysis
            </button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;