import { motion } from 'framer-motion';
import { BookOpen, Clock, Users, TrendingUp, FileText, ArrowRight, Home } from 'lucide-react';
import { useState } from 'react';

const Resources = ({ onBackToHome }) => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const articles = [
    {
      id: 1,
      title: "Complete Guide to Physician Loan Options (20+ Strategies)",
      excerpt: "Comprehensive breakdown of every federal and private loan strategy available to clinicians under 40, including lesser-known state programs and specialty-specific options.",
      category: "loan-strategies",
      readTime: "15 min read",
      publishDate: "January 2025",
      slug: "complete-physician-loan-guide",
      featured: true
    },
    {
      id: 2,
      title: "SAVE Plan vs REPAYE vs Refinancing: Physician Comparison",
      excerpt: "Side-by-side analysis of income-driven repayment plans specifically for medical professionals, with real scenarios and calculator tools.",
      category: "repayment-plans",
      readTime: "12 min read",
      publishDate: "January 2025",
      slug: "save-vs-repaye-vs-refinancing"
    },
    {
      id: 3,
      title: "State Loan Forgiveness Programs for Doctors by Specialty",
      excerpt: "State-by-state breakdown of loan forgiveness programs, eligibility requirements, and application deadlines for each medical specialty.",
      category: "forgiveness",
      readTime: "10 min read",
      publishDate: "January 2025",
      slug: "state-loan-forgiveness-programs"
    },
    {
      id: 4,
      title: "Physician Refinancing Rates: How to Get the Best Deal",
      excerpt: "Expert strategies for refinancing medical school loans, including credit optimization, lender comparison, and timing considerations.",
      category: "refinancing",
      readTime: "8 min read",
      publishDate: "January 2025",
      slug: "physician-refinancing-guide"
    }
  ];

  const categories = [
    { id: 'all', name: 'All Articles', count: articles.length },
    { id: 'loan-strategies', name: 'Loan Strategies', count: articles.filter(a => a.category === 'loan-strategies').length },
    { id: 'repayment-plans', name: 'Repayment Plans', count: articles.filter(a => a.category === 'repayment-plans').length },
    { id: 'forgiveness', name: 'Loan Forgiveness', count: articles.filter(a => a.category === 'forgiveness').length },
    { id: 'refinancing', name: 'Refinancing', count: articles.filter(a => a.category === 'refinancing').length }
  ];

  const filteredArticles = selectedCategory === 'all' 
    ? articles 
    : articles.filter(article => article.category === selectedCategory);

  const handleArticleClick = (slug) => {
    // For now, just log - we'll implement individual article pages later
    console.log(`Navigate to article: ${slug}`);
    alert('Individual article pages coming soon! These comprehensive guides are being finalized.');
  };

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

            {/* Navigation */}
            <div className="flex items-center space-x-8">
              <button 
                onClick={onBackToHome}
                className="text-navy-200 hover:text-white transition-colors flex items-center space-x-2"
              >
                <Home className="w-4 h-4" />
                <span>Home</span>
              </button>
              <span className="text-teal-400 font-semibold">Resources</span>
            </div>
          </div>
        </div>
      </nav>

      <div className="container mx-auto px-4 py-16">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h1 className="text-5xl font-display font-bold text-navy-800 mb-4">
            Resources for 
            <span className="bg-gradient-to-r from-teal-600 to-coral-500 bg-clip-text text-transparent"> Clinicians Under 40</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
            Expert guides, strategies, and tools specifically designed for medical professionals with student debt. 
            Everything you need to optimize your loans and build wealth early in your career.
          </p>
          
          <div className="bg-amber-50 border border-amber-200 rounded-lg px-6 py-4 max-w-2xl mx-auto">
            <p className="text-amber-800 font-medium">
              📚 <strong>Coming Soon:</strong> These comprehensive guides are being finalized and will be available within the next few weeks. 
              Each article contains 5,000+ words of actionable strategies.
            </p>
          </div>
        </motion.div>

        {/* Category Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="flex flex-wrap justify-center gap-4 mb-12"
        >
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`px-6 py-3 rounded-full font-semibold transition-all ${
                selectedCategory === category.id
                  ? 'bg-teal-500 text-white shadow-lg'
                  : 'bg-white text-gray-700 hover:bg-teal-50 border border-gray-200'
              }`}
            >
              {category.name} ({category.count})
            </button>
          ))}
        </motion.div>

        {/* Articles Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
          {filteredArticles.map((article, index) => (
            <motion.article
              key={article.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer transform hover:scale-105 ${
                article.featured ? 'md:col-span-2 border-2 border-teal-200' : ''
              }`}
              onClick={() => handleArticleClick(article.slug)}
            >
              <div className="p-8">
                {article.featured && (
                  <div className="inline-flex items-center bg-teal-100 text-teal-700 px-3 py-1 rounded-full text-sm font-semibold mb-4">
                    <TrendingUp className="w-4 h-4 mr-1" />
                    Featured Guide
                  </div>
                )}
                
                <h2 className={`font-display font-bold text-navy-800 mb-4 ${
                  article.featured ? 'text-3xl' : 'text-2xl'
                }`}>
                  {article.title}
                </h2>
                
                <p className="text-gray-600 mb-6 leading-relaxed">
                  {article.excerpt}
                </p>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Clock className="w-4 h-4" />
                      <span>{article.readTime}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <BookOpen className="w-4 h-4" />
                      <span>{article.publishDate}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center text-teal-600 font-semibold">
                    <span className="mr-2">Read More</span>
                    <ArrowRight className="w-4 h-4" />
                  </div>
                </div>
              </div>
            </motion.article>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-gradient-to-br from-navy-800 to-navy-900 rounded-2xl p-12 text-center text-white mt-16 max-w-4xl mx-auto"
        >
          <h3 className="text-3xl font-display font-bold mb-4">
            Ready to optimize your loans?
          </h3>
          <p className="text-navy-200 mb-8 text-lg max-w-2xl mx-auto">
            Get your personalized loan optimization strategy in just 5 minutes. 
            Built specifically for clinicians under 40 with student debt.
          </p>
          
          <button
            onClick={onBackToHome}
            className="bg-coral-500 hover:bg-coral-600 text-white font-bold py-4 px-8 rounded-xl text-lg transition-all transform hover:scale-105 inline-flex items-center space-x-2"
          >
            <span>Start Your Analysis</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </motion.div>
      </div>
    </div>
  );
};

export default Resources;