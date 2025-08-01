import axios from 'axios';
import { mcpConfig } from '../config/mcp-config.js';

class WebSearchService {
  constructor() {
    this.apiKey = mcpConfig.webSearch.apiKey;
    this.baseUrl = 'https://api.search.brave.com/res/v1/web/search';
    this.enabled = mcpConfig.webSearch.enabled && !!this.apiKey;
  }

  async searchSalaryData(specialty, location = 'United States', year = '2025') {
    if (!this.enabled) {
      throw new Error('Web search service not configured. Please set BRAVE_API_KEY in environment variables.');
    }

    const queries = [
      `${specialty} physician salary ${year} MGMA data ${location}`,
      `${specialty} doctor average salary ${year} ${location}`,
      `${specialty} residency attending physician income ${year}`
    ];

    const results = [];
    
    for (const query of queries) {
      try {
        const response = await this.performSearch(query);
        results.push({
          query,
          results: response.web?.results || []
        });
      } catch (error) {
        console.error(`Search failed for query: ${query}`, error);
      }
    }

    return this.processSalaryResults(results, specialty);
  }

  async searchRefinancingRates(year = '2025') {
    if (!this.enabled) {
      throw new Error('Web search service not configured');
    }

    const queries = [
      `medical school loan refinancing rates ${year} best lenders`,
      `physician loan refinancing ${year} rates comparison`,
      `student loan refinancing rates ${year} medical professionals`
    ];

    const results = [];
    
    for (const query of queries) {
      try {
        const response = await this.performSearch(query);
        results.push({
          query,
          results: response.web?.results || []
        });
      } catch (error) {
        console.error(`Search failed for query: ${query}`, error);
      }
    }

    return this.processRefinancingResults(results);
  }

  async searchPSLFUpdates(year = '2025') {
    if (!this.enabled) {
      throw new Error('Web search service not configured');
    }

    const query = `PSLF public service loan forgiveness updates ${year} requirements changes`;
    
    try {
      const response = await this.performSearch(query);
      return this.processPSLFResults(response.web?.results || []);
    } catch (error) {
      console.error('PSLF search failed:', error);
      return { updates: [], lastUpdated: null };
    }
  }

  async performSearch(query) {
    const params = {
      q: query,
      count: mcpConfig.webSearch.maxResults,
      mkt: 'en-US',
      safesearch: 'moderate',
      textDecorations: false,
      textFormat: 'Raw'
    };

    const response = await axios.get(this.baseUrl, {
      headers: {
        'X-Subscription-Token': this.apiKey,
        'Accept': 'application/json'
      },
      params
    });

    return response.data;
  }

  processSalaryResults(searchResults, specialty) {
    const processedData = {
      specialty,
      estimatedSalary: null,
      salaryRange: { min: null, max: null },
      sources: [],
      confidence: 'low',
      lastUpdated: new Date().toISOString()
    };

    const salaryNumbers = [];
    
    for (const searchResult of searchResults) {
      for (const result of searchResult.results) {
        const text = `${result.title} ${result.description}`.toLowerCase();
        
        const salaryMatches = text.match(/\$[\d,]+(?:,\d{3})*(?:\.\d{2})?/g);
        if (salaryMatches) {
          salaryMatches.forEach(match => {
            const number = parseInt(match.replace(/[$,]/g, ''));
            if (number >= 50000 && number <= 1000000) {
              salaryNumbers.push(number);
            }
          });
        }

        processedData.sources.push({
          title: result.title,
          url: result.url,
          description: result.description?.substring(0, 200) + '...',
          relevanceScore: this.calculateRelevance(text, specialty)
        });
      }
    }

    if (salaryNumbers.length > 0) {
      salaryNumbers.sort((a, b) => a - b);
      processedData.estimatedSalary = Math.round(salaryNumbers[Math.floor(salaryNumbers.length / 2)]);
      processedData.salaryRange.min = Math.min(...salaryNumbers);
      processedData.salaryRange.max = Math.max(...salaryNumbers);
      processedData.confidence = salaryNumbers.length >= 3 ? 'high' : 'medium';
    }

    return processedData;
  }

  processRefinancingResults(searchResults) {
    const processedData = {
      averageRate: null,
      rateRange: { min: null, max: null },
      lenders: [],
      sources: [],
      lastUpdated: new Date().toISOString()
    };

    const rates = [];
    
    for (const searchResult of searchResults) {
      for (const result of searchResult.results) {
        const text = `${result.title} ${result.description}`.toLowerCase();
        
        const rateMatches = text.match(/(\d+\.?\d*)%/g);
        if (rateMatches) {
          rateMatches.forEach(match => {
            const rate = parseFloat(match.replace('%', ''));
            if (rate >= 2 && rate <= 15) {
              rates.push(rate);
            }
          });
        }

        processedData.sources.push({
          title: result.title,
          url: result.url,
          description: result.description?.substring(0, 200) + '...'
        });
      }
    }

    if (rates.length > 0) {
      rates.sort((a, b) => a - b);
      processedData.averageRate = rates.reduce((a, b) => a + b, 0) / rates.length;
      processedData.rateRange.min = Math.min(...rates);
      processedData.rateRange.max = Math.max(...rates);
    }

    return processedData;
  }

  processPSLFResults(results) {
    return {
      updates: results.map(result => ({
        title: result.title,
        url: result.url,
        description: result.description,
        publishedDate: result.published || null
      })),
      lastUpdated: new Date().toISOString()
    };
  }

  calculateRelevance(text, specialty) {
    const specialtyKeywords = specialty.toLowerCase().split(' ');
    const relevantKeywords = ['salary', 'income', 'earnings', 'compensation', 'pay', 'mgma'];
    
    let score = 0;
    specialtyKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 2;
    });
    relevantKeywords.forEach(keyword => {
      if (text.includes(keyword)) score += 1;
    });
    
    return score;
  }

  async testConnection() {
    if (!this.enabled) {
      return { success: false, error: 'Service not configured' };
    }

    try {
      const response = await this.performSearch('test query');
      return { success: true, message: 'Web search service connected successfully' };
    } catch (error) {
      return { success: false, error: error.message };
    }
  }
}

export default new WebSearchService();